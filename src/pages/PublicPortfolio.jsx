// src/pages/PublicPortfolio.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/config";
import { loadTemplateFromRemote } from "../utils/templateLoader";

export default function PublicPortfolio() {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [template, setTemplate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setError(null);

      // 1. Load portfolio by slug
      const { data: portfolioData, error: pErr } = await supabase
        .from("user_portfolios")
        .select("*")
        .eq("slug", username)
        .single();

      if (pErr || !portfolioData) {
        if (mounted) setError("Portfolio not found.");
        return;
      }
      if (mounted) setPortfolio(portfolioData);

      // 2. Load template row by template_id (the portfolio stores template_id)
      const tplId = portfolioData.template_id;
      if (!tplId) {
        if (mounted) setError("Template not set for this portfolio.");
        return;
      }

      const { data: tplRow, error: tplErr } = await supabase
        .from("portfolio_templates")
        .select("*")
        .eq("id", tplId)
        .single();

      if (tplErr || !tplRow) {
        if (mounted) setError("Template record not found.");
        return;
      }

      const loaded = await loadTemplateFromRemote(tplRow);
      if (!loaded) {
        if (mounted) setError("Failed to load template.");
        return;
      }

      if (mounted) setTemplate(loaded);
    }

    load();
    return () => (mounted = false);
  }, [username]);

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>{error}</h2>
        <p style={{ color: "#666" }}>
          This portfolio may have been removed or the link is incorrect.
        </p>
      </div>
    );
  }

  if (!portfolio || !template) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Loading portfolio…</h2>
      </div>
    );
  }

  const TemplateComponent = template.Component;
  document.title = portfolio.data?.hero?.title ? `${portfolio.data.hero.title} — Portfolio` : "Portfolio";

  return <TemplateComponent data={portfolio.data} />;
}
