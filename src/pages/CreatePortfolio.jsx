// src/pages/CreatePortfolio.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../supabase/config";
import { loadTemplate } from "../utils/templateLoader";
import "../styles/glassmorphism.css";
import "./CreatePortfolio.css";

export default function CreatePortfolio() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const templateId = params.get("tpl");

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (!templateId) throw new Error("No template selected.");
        const loaded = await loadTemplate(templateId);
        setTemplate(loaded);
      } catch (err) {
        setError(err.message || "Failed to load template.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [templateId]);

  const handleCreate = async () => {
    try {
      setCreating(true);
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) throw new Error("You must be logged in.");

      const slug = `${authData.user.id}-${Date.now()}`;

      const { data, error } = await supabase
        .from("user_portfolios")
        .insert({
          user_id: authData.user.id,
          template_id: templateId,
          data: template.defaultData || {},
          slug
        })
        .select()
        .single();

      if (error) throw error;
      navigate(`/editor/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="loading">Loading template…</div>;

  return (
    <div className="create-portfolio-wrapper">
      <div className="container py-5">
        <div className="create-portfolio-card glass-card">

          {error && (
            <div className="error-alert">
              <strong>Error:</strong> {error}
            </div>
          )}

          {template && (
            <>
              <h1 className="create-portfolio-title">
                {template.config?.name || "New Portfolio"}
              </h1>

              <p className="create-portfolio-description">
                {template.config?.description || "Customize this template."}
              </p>

              <div className="button-group">
                <button
                  className="publish-btn glass-btn"
                  onClick={handleCreate}
                  disabled={creating}
                >
                  {creating ? "Creating…" : "Start Editing"}
                </button>
              </div>

              <div className="preview-section">
                <h3 className="preview-title">Template Preview</h3>
                <div className="preview-container">
                  {template.Component &&
                    React.createElement(template.Component, {
                      data: template.defaultData,
                    })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
