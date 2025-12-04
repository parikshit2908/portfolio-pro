// src/pages/GetInspired.jsx
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "../supabase/config";
import { loadTemplateFromRemote } from "../utils/templateLoader";
import "./GetInspired.css";

export default function GetInspired() {
  const [portfolios, setPortfolios] = useState([]);
  const [templatesCache, setTemplatesCache] = useState({}); // { templateId: { previewUrl, config } }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Adjust this if you want to filter only published portfolios
  const PUBLIC_FILTER = true; // set to false to fetch all

  useEffect(() => {
    let mounted = true;
    async function fetchPortfolios() {
      setLoading(true);
      setError(null);

      try {
        // Basic fetch: adjust .select(...) according to your DB FK setup
        // We fetch the core columns and limit to 48 most recent portfolios
        const { data, error: fetchErr } = await supabase
          .from("user_portfolios")
          .select("id, user_id, slug, template_id, data, created_at")
          .order("created_at", { ascending: false })
          .limit(48);

        if (fetchErr) throw fetchErr;
        if (!mounted) return;

        // Optionally filter on a public flag in the client if required:
        const list = Array.isArray(data) ? data : [];

        // If you have an is_public column, uncomment this:
        // const list = data.filter(p => p.is_public);

        setPortfolios(list);

        // load templates for all unique template_ids (cache them)
        const uniqueTplIds = Array.from(new Set(list.map((p) => p.template_id).filter(Boolean)));

        // avoid re-loading ones already in cache
        const toLoad = uniqueTplIds.filter((id) => !templatesCache[id]);

        if (toLoad.length) {
          const loaded = {};
          await Promise.all(
            toLoad.map(async (tplId) => {
              try {
                // Load template record from Supabase
                const { data: tplRow, error: tplErr } = await supabase
                  .from("portfolio_templates")
                  .select("*")
                  .eq("id", tplId)
                  .single();

                if (tplErr || !tplRow) {
                  throw new Error("Template record not found");
                }

                // Load template component
                const tpl = await loadTemplateFromRemote(tplRow);
                if (tpl) {
                  loaded[tplId] = {
                    previewUrl: tpl.previewUrl || tplRow.preview_url || `/templates/${tplId}/preview.webp`,
                    config: tpl.config || {},
                    name: tpl.config?.name || tplRow.name || tplId,
                    category: tpl.config?.category || tplRow.category || "Unknown",
                  };
                } else {
                  // fallback preview
                  loaded[tplId] = {
                    previewUrl: tplRow.preview_url || `/templates/${tplId}/preview.webp`,
                    config: null,
                    name: tplRow.name || tplId,
                    category: tplRow.category || "Unknown",
                  };
                }
              } catch (e) {
                console.warn("Failed to load template", tplId, e);
                // Try to get at least the template record for preview
                try {
                  const { data: tplRow } = await supabase
                    .from("portfolio_templates")
                    .select("name, category, preview_url")
                    .eq("id", tplId)
                    .single();
                  
                  loaded[tplId] = {
                    previewUrl: tplRow?.preview_url || `/templates/${tplId}/preview.webp`,
                    config: null,
                    name: tplRow?.name || tplId,
                    category: tplRow?.category || "Unknown",
                  };
                } catch {
                  loaded[tplId] = {
                    previewUrl: `/templates/${tplId}/preview.webp`,
                    config: null,
                    name: tplId,
                    category: "Unknown",
                  };
                }
              }
            })
          );

          if (mounted) {
            setTemplatesCache((prev) => ({ ...prev, ...loaded }));
          }
        }
      } catch (err) {
        console.error("GetInspired: failed to fetch portfolios", err);
        if (mounted) setError("Failed to load portfolios.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchPortfolios();
    return () => {
      mounted = false;
    };
  }, []); // run once

  // Helper: determine preview image for a portfolio
  const previewFor = (p) => {
    const tpl = templatesCache[p.template_id];
    if (tpl?.previewUrl) return tpl.previewUrl;
    // fallback to hero background
    const heroBg = p?.data?.hero?.background_image;
    if (heroBg) return heroBg;
    // fallback to first project image
    const projectImg = Array.isArray(p?.data?.projects) && p.data.projects[0]?.image;
    if (projectImg) return projectImg;
    // last resort placeholder
    return "/templates/placeholder-preview.png";
  };

  // Rendering helpers
  if (loading) {
    return (
      <div className="get-inspired-page">
        <div className="container py-5 text-center">
          <h2>Loading portfolios…</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="get-inspired-page">
        <div className="container py-5 text-center">
          <h2>{error}</h2>
          <p style={{ color: "#666" }}>Try refreshing the page.</p>
        </div>
      </div>
    );
  }

  if (!portfolios.length) {
    return (
      <div className="get-inspired-page">
        <div className="container py-5 text-center">
          <h2>No public portfolios yet</h2>
          <p className="text-muted">Once users publish, they will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="get-inspired-page">
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h1 className="getinspired-title">Get Inspired</h1>
            <p className="getinspired-subtitle mb-0">
              Browse public portfolios from talented creators.
            </p>
          </div>
        </div>

        <div className="row g-4">
          {portfolios.map((p, i) => {
            const preview = previewFor(p);
            const tpl = templatesCache[p.template_id] || {};
            const title = p?.data?.hero?.title || `Portfolio — ${p.slug || p.id}`;
            const madeBy = p?.data?.meta?.author_name || p.user_id || "Creator";

            return (
              <motion.div
                key={p.id}
                className="col-lg-4 col-md-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="portfolio-card h-100">
                  <div className="portfolio-header d-flex justify-content-between align-items-center">
                    <h5 className="portfolio-name">{title}</h5>
                    <div className="portfolio-actions">
                      <span className="me-3 text-accent">
                        <i className="bi bi-folder-fill me-1"></i>
                        {tpl.category || "—"}
                      </span>
                    </div>
                  </div>

                  <div style={{ margin: "12px 0" }}>
                    <Link to={`/p/${p.slug || p.id}`}>
                      <img
                        src={preview}
                        alt={title}
                        style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 12 }}
                      />
                    </Link>
                  </div>

                  <p className="portfolio-description my-3">
                    {p?.data?.about?.heading ? p?.data?.about?.heading : (p?.data?.about?.content?.slice?.(0, 140) || "")}
                  </p>

                  <div className="portfolio-footer d-flex justify-content-between align-items-center">
                    <span className="portfolio-madeby">
                      Made by <strong>{madeBy}</strong>
                    </span>
                    <span className="portfolio-date">
                      {new Date(p.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
