// src/pages/Editor.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../supabase/config";
import { loadTemplate } from "../utils/templateLoader";
import EditorSidebar from "../components/EditorSidebar";
import "./Editor.css";

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const [template, setTemplate] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // -------------------------------------------
  // Load portfolio + template
  // -------------------------------------------
  useEffect(() => {
    async function load() {
      setError(null);

      // Load portfolio
      const { data, error: err } = await supabase
        .from("user_portfolios")
        .select("*")
        .eq("id", id)
        .single();

      if (err || !data) {
        setError("Portfolio not found.");
        return;
      }

      // If no data exists, use empty object
      const safeData = data.data || {};

      setPortfolio({ ...data, data: safeData });

      // Load template using ID
      if (!data.template_id) {
        setError("Template ID missing for this portfolio.");
        return;
      }

      const loadedTpl = await loadTemplate(data.template_id);

      if (!loadedTpl) {
        setError("Template failed to load.");
        return;
      }

      setTemplate(loadedTpl);

      // If data is empty, load defaultData (first load case)
      if (Object.keys(safeData).length === 0 && loadedTpl.defaultData) {
        setPortfolio((prev) => ({
          ...prev,
          data: loadedTpl.defaultData,
        }));
      }
    }

    load();
  }, [id]);

  // -------------------------------------------
  // Field updater (NO auto-save)
  // -------------------------------------------
  const updateField = useCallback(
    (path, value) => {
      if (!portfolio) return;

      const keys = path.split(".");
      const newData = structuredClone(portfolio.data || {});
      let cursor = newData;

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];

        if (cursor[k] === undefined) cursor[k] = {};

        if (i === keys.length - 1) {
          cursor[k] = value;
        } else {
          cursor = cursor[k];
        }
      }

      setPortfolio((prev) => ({ ...prev, data: newData }));
      setHasUnsavedChanges(true);
      setSaveSuccess(false);
    },
    [portfolio]
  );

  // -------------------------------------------
  // Manual Save to DB
  // -------------------------------------------
  const handleSave = useCallback(async () => {
    if (!portfolio) return;

    try {
      setSaving(true);
      setError(null);
      setSaveSuccess(false);

      // Verify user owns this portfolio
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) {
        throw new Error("Not authenticated");
      }

      // First verify ownership
      const { data: portfolioCheck, error: checkErr } = await supabase
        .from("user_portfolios")
        .select("user_id")
        .eq("id", id)
        .single();

      if (checkErr || !portfolioCheck) {
        throw new Error("Portfolio not found");
      }

      if (portfolioCheck.user_id !== authData.user.id) {
        throw new Error("Unauthorized: You don't own this portfolio");
      }

      // Update portfolio
      const { error: saveErr } = await supabase
        .from("user_portfolios")
        .update({
          data: portfolio.data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (saveErr) {
        console.error("Save error:", saveErr);
        throw saveErr;
      }

      setSaveSuccess(true);
      setHasUnsavedChanges(false);
      
      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }, [id, portfolio, navigate]);

  // -------------------------------------------
  // Render States
  // -------------------------------------------
  if (error)
    return <h2 style={{ padding: 20, color: "crimson" }}>{error}</h2>;

  if (!portfolio || !template)
    return <h2 style={{ padding: 20 }}>Loading editor...</h2>;

  const TemplateComponent = template.Component;

  return (
    <div className="editor-layout">
      <EditorSidebar
        data={portfolio.data}
        config={template.config || {}}
        onChange={updateField}
      />

      <div className="editor-preview">
        <div className="editor-toolbar">
          <div className="editor-status">
            {saveSuccess ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="save-success"
              >
                ✓ Saved! Redirecting to dashboard...
              </motion.span>
            ) : hasUnsavedChanges ? (
              <span className="unsaved-changes">● Unsaved changes</span>
            ) : (
              <span>No changes</span>
            )}
          </div>
          <motion.button
            className="editor-save-btn"
            onClick={handleSave}
            disabled={saving || !hasUnsavedChanges}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {saving ? "Saving..." : "Save Portfolio"}
          </motion.button>
        </div>

        <div className="editor-canvas">
          <TemplateComponent data={portfolio.data} />
        </div>
      </div>
    </div>
  );
}
