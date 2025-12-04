import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { supabase } from "../supabase/config";
import AIStatusBadge from "../components/AIStatusBadge";
import "./Dashboard.css"; // put file next to this component

export default function Dashboard() {
  const { user } = useAuth(); // from your AuthContext. :contentReference[oaicite:4]{index=4}
  const { theme } = useTheme(); // uses your ThemeContext. :contentReference[oaicite:5]{index=5}
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("latest"); // latest, most_liked, most_viewed, a_z, all
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // fetch projects for current user
  useEffect(() => {
    if (!user?.id) {
      setProjects([]);
      setLoading(false);
      return;
    }

    let mounted = true;
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("user_portfolios")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (!mounted) return;
        // Transform portfolios to match project structure
        const transformedData = (data || []).map(portfolio => ({
          id: portfolio.id,
          title: portfolio.data?.name || portfolio.data?.title || "Untitled Portfolio",
          description: portfolio.data?.description || portfolio.data?.bio || "",
          thumbnail: portfolio.data?.thumbnail || portfolio.data?.image || null,
          kudos: portfolio.data?.kudos || 0,
          views: portfolio.data?.views || 0,
          created_at: portfolio.created_at,
          updated_at: portfolio.updated_at,
          slug: portfolio.slug,
          template_id: portfolio.template_id
        }));
        setProjects(transformedData);
      } catch (err) {
        console.error("fetchProjects error:", err);
        setError(err.message || "Failed to load portfolios");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProjects();

    // optional: subscribe to realtime updates for this user's portfolios
    const channel = supabase
      .channel(`portfolios-user-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_portfolios", filter: `user_id=eq.${user.id}` },
        () => fetchProjects()
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [user]);

  // derived sorted/filtered list
  const visibleProjects = useMemo(() => {
    if (!projects) return [];
    const arr = [...projects];

    switch (filter) {
      case "most_liked":
        return arr.sort((a, b) => (b.kudos || 0) - (a.kudos || 0));
      case "most_viewed":
        return arr.sort((a, b) => (b.views || 0) - (a.views || 0));
      case "a_z":
        return arr.sort((a, b) => ("" + (a.title || "")).localeCompare(b.title || ""));
      case "all":
        return arr; // Show all without sorting
      case "latest":
      default:
        return arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  }, [projects, filter]);

  // short description
  const shortDesc = (d) => {
    if (!d) return "";
    return d.length > 110 ? d.slice(0, 107) + "..." : d;
  };

  const handleCreate = () => navigate("/templates");

  const openProject = (projectId) => {
    navigate(`/editor/${projectId}`);
  };

  const goToAI = () => navigate("/ask-ai");

  const handleDelete = async (e, projectId) => {
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to delete this portfolio? This action cannot be undone.")) {
      return;
    }

    setDeletingId(projectId);
    try {
      // Verify user owns this portfolio
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) {
        throw new Error("Not authenticated");
      }

      // Verify ownership before delete
      const { data: portfolio, error: checkErr } = await supabase
        .from("user_portfolios")
        .select("user_id")
        .eq("id", projectId)
        .single();

      if (checkErr || !portfolio) {
        throw new Error("Portfolio not found");
      }

      if (portfolio.user_id !== authData.user.id) {
        throw new Error("Unauthorized: You don't own this portfolio");
      }

      // Delete portfolio
      const { error: deleteErr } = await supabase
        .from("user_portfolios")
        .delete()
        .eq("id", projectId);

      if (deleteErr) throw deleteErr;

      // Remove from local state
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete portfolio: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={`dashboard-page page-container theme-${theme}`}>
      <motion.div
        className="dashboard-top"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <motion.h2 
          className="dashboard-heading"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Your Projects
        </motion.h2>
          <AIStatusBadge showDetails={false} />
        </div>

        <motion.div 
          className="dashboard-top-controls"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === "latest" ? "active" : ""}`}
              onClick={() => setFilter("latest")}
            >
              Latest
            </button>
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Loading / Error */}
      {loading ? (
        <div className="projects-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="project-card skeleton">
              <div className="thumb-skel" />
              <div className="text-skel short" />
              <div className="text-skel long" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="empty-state error">
          <p>Error: {error}</p>
          <button className="btn" onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : visibleProjects.length === 0 ? (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            No portfolios yet
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Create your first portfolio to get started. Choose a template and customize it to showcase your work.
          </motion.p>
          <motion.button 
            className="btn btn-primary" 
            onClick={() => navigate("/templates")}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Browse Templates
          </motion.button>
        </motion.div>
      ) : (
        <motion.div 
          className="projects-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Create card first */}
          <motion.div
            className="project-card create-card"
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreate}
            role="button"
            tabIndex={0}
          >
            <div className="create-inner">
              <div className="plus">+</div>
              <div>Create New Portfolio</div>
            </div>
          </motion.div>

          {visibleProjects.map((p, index) => (
            <motion.div
              layout
              key={p.id}
              className="project-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.1 + (index * 0.05),
                ease: [0.4, 0, 0.2, 1]
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => navigate(`/editor/${p.id}`)}
            >
              <div className="thumb">
                {p.thumbnail ? (
                  <img src={p.thumbnail} alt={p.title} />
                ) : (
                  <div className="thumb-fallback">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <line x1="9" y1="3" x2="9" y2="21"/>
                    </svg>
                  </div>
                )}
              </div>

              <div className="card-body">
                <div className="card-header-row">
                <h4 className="project-title">{p.title || "Untitled"}</h4>
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDelete(e, p.id)}
                    disabled={deletingId === p.id}
                    title="Delete portfolio"
                  >
                    {deletingId === p.id ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ⏳
                      </motion.span>
                    ) : (
                      "🗑️"
                    )}
                  </button>
                </div>
                <p className="project-desc">{shortDesc(p.description)}</p>

                <div className="card-footer">
                  <div className="kudos">
                    <span className="heart">❤️</span>
                    <span className="count">{p.kudos ?? 0}</span>
                  </div>
                  <button 
                    className="link-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      openProject(p.id);
                    }}
                  >
                    View →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Floating AI Help */}
      <button className="ai-fab" onClick={goToAI} aria-label="Ask AI">
        💬
      </button>
    </div>
  );
}
