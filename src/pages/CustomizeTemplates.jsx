// src/pages/CustomizeTemplates.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabase/config";
import { useNavigate } from "react-router-dom";
import { loadTemplate } from "../utils/templateLoader";
import "../styles/glassmorphism.css";
import "./CustomizeTemplates.css";

const SUPABASE_URL = "https://bxlvmwnuqghcyoddnlsf.supabase.co";
const STORAGE_BUCKET = "template_files";

/* ---------------------------
   Helpers
----------------------------*/
function normalizePreviewUrl(urlOrPath) {
  if (!urlOrPath) return null;
  if (typeof urlOrPath !== "string") return null;

  if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
    if (urlOrPath.includes("/template-assets/")) {
      return urlOrPath.replace("/template-assets/", "/template_files/");
    }
    return urlOrPath;
  }

  if (urlOrPath.startsWith("/mnt/data/")) {
    const relative = urlOrPath.replace("/mnt/data/", "");
    return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${relative}`;
  }

  const clean = urlOrPath.replace(/^(storage\/|template-assets\/|template_files\/)/, "");
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${clean}`;
}

function getLayoutForCategory(categoryOrArray) {
  const cat = Array.isArray(categoryOrArray) ? categoryOrArray[0] : categoryOrArray;
  switch (cat) {
    case "Design": return "masonry";
    case "Business": return "wide";
    case "Tech": return "compact";
    case "Photography": return "featured";
    default: return "default";
  }
}

/* ---------------------------
   Component
----------------------------*/
export default function CustomizeTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const loadTemplates = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("portfolio_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load templates:", err);
      setError("Failed to load templates. Try refreshing.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();

    const subscription = supabase
      .channel("portfolio_templates_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "portfolio_templates" },
        () => loadTemplates()
      )
      .subscribe();

    return () => {
      try {
        subscription.unsubscribe();
      } catch {}
    };
  }, [loadTemplates]);

  // Derive category list (unique) from templates
  const categories = useMemo(() => {
    const s = new Set();
    templates.forEach((tpl) => {
      if (Array.isArray(tpl.category)) {
        tpl.category.forEach((c) => c && s.add(String(c)));
      } else if (tpl.category) {
        s.add(String(tpl.category));
      }
    });
    return ["All", ...Array.from(s)];
  }, [templates]);

  // Filtered templates according to activeCategory (single-select)
  const filteredTemplates = useMemo(() => {
    if (activeCategory === "All") return templates;
    return templates.filter((tpl) => {
      if (Array.isArray(tpl.category)) {
        return tpl.category.some((c) => String(c) === activeCategory);
      }
      return String(tpl.category) === activeCategory;
    });
  }, [templates, activeCategory]);

  async function handleUseTemplate(tpl) {
    try {
      const loaded = await loadTemplate(tpl.id);
      if (!loaded) {
        alert(`Template "${tpl.name}" could not be loaded. Check console.`);
        return;
      }
      navigate(`/create-portfolio?tpl=${encodeURIComponent(tpl.id)}`);
    } catch (err) {
      console.error(err);
      alert("Error loading template.");
    }
  }

  if (loading) {
    return (
      <div className="ct-wrapper">
        <div className="container py-5">
          <motion.div className="ct-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="ct-spinner" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Loading templates...</motion.h2>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ct-wrapper">
        <div className="container py-5">
          <motion.div className="ct-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p>{error}</p>
            <motion.button className="ct-btn glass-btn" onClick={loadTemplates}>Retry</motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="ct-wrapper">
      <div className="container py-5">
        {/* Header */}
        <motion.div className="ct-header" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Choose a Template</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Select a template to preview or use</motion.p>
        </motion.div>

        {/* Category filter bar */}
        <motion.div className="ct-filter-bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`ct-filter-chip ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div
          className="ct-grid"
          data-layout={getLayoutForCategory(filteredTemplates[0]?.category || templates[0]?.category)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredTemplates.map((tpl, index) => {
            const preview = normalizePreviewUrl(tpl.preview_url);
            const primaryCategory = Array.isArray(tpl.category) ? tpl.category[0] : tpl.category;
            const cardLayout = getLayoutForCategory(tpl.category);

            const badges = Array.isArray(tpl.category)
              ? tpl.category.filter(Boolean).map(String)
              : tpl.category ? [String(tpl.category)] : [];

            return (
              <motion.div
                key={tpl.id ? `${tpl.id}-${index}` : `${(tpl.name || "tpl")}-${index}`}
                className={`ct-card glass-card ${cardLayout === "featured" && index === 0 ? "featured-card" : ""}`}
                data-category={primaryCategory || "Uncategorized"}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.36, delay: 0.04 * index }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="ct-thumb">
                  {preview ? (
                    <img src={preview} alt={tpl.name || "template preview"} onError={(e) => { e.target.onerror = null; e.target.src = "/vite.svg"; }} />
                  ) : (
                    <div className="ct-placeholder">No Preview</div>
                  )}

                  <div className="ct-badge-group">
                    {badges.length ? badges.map((cat, i) => (
                      <span key={i} className="ct-badge">{cat}</span>
                    )) : (
                      <span className="ct-badge">Uncategorized</span>
                    )}
                  </div>
                </div>

                <div className="ct-card-content">
                  <h3 className="ct-title">{tpl.name || "Untitled Template"}</h3>
                  {tpl.description && <p className="ct-description">{tpl.description}</p>}

                  <motion.button
                    className="ct-btn glass-btn"
                    onClick={() => handleUseTemplate(tpl)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Use Template
                    <svg width="14" height="14" viewBox="0 0 24 24" style={{ marginLeft: 8 }}><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {!filteredTemplates.length && (
          <motion.div className="ct-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p>No templates match <strong>{activeCategory}</strong>.</p>
            <p className="ct-empty-subtitle">Try selecting "All" or a different category.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
