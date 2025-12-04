import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const buildApiUrl = (path) => `${API_BASE_URL}${path}`;

const AIStatusBadge = ({ showDetails = false }) => {
  const [status, setStatus] = useState("checking");
  const [models, setModels] = useState([]);
  const [apiUrl, setApiUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  async function checkStatus() {
    try {
      const url = buildApiUrl("/api/ollama-health");
      setApiUrl(url);
      
      const res = await fetch(url, { 
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.status === "healthy" && data.models) {
        setStatus("healthy");
        setModels(data.models || []);
        setError("");
      } else {
        setStatus("unhealthy");
        setError(data.error || "Ollama not responding");
      }
    } catch (err) {
      console.error("AI status check failed:", err);
      setStatus("unhealthy");
      setError(err.message || "Connection failed");
      setModels([]);
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "healthy": return "#10b981"; // green
      case "unhealthy": return "#ef4444"; // red
      default: return "#f59e0b"; // yellow
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "healthy": return `AI Active (${models.length} models)`;
      case "unhealthy": return "AI Offline";
      default: return "Checking...";
    }
  };

  return (
    <motion.div
      className="ai-status-badge"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        borderRadius: "12px",
        background: "rgba(15, 23, 42, 0.7)",
        border: `1px solid ${getStatusColor()}40`,
        fontSize: "13px",
        color: "#e2e8f0",
      }}
    >
      <motion.div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: getStatusColor(),
          boxShadow: `0 0 8px ${getStatusColor()}80`,
        }}
        animate={{
          scale: status === "checking" ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 1.5,
          repeat: status === "checking" ? Infinity : 0,
        }}
      />
      <span>{getStatusText()}</span>
      
      {showDetails && (
        <div style={{ marginTop: "8px", fontSize: "11px", color: "#94a3b8" }}>
          <div>API: {apiUrl || "Using proxy"}</div>
          {models.length > 0 && (
            <div>Models: {models.map(m => m.name).join(", ")}</div>
          )}
          {error && <div style={{ color: "#ef4444" }}>Error: {error}</div>}
        </div>
      )}
    </motion.div>
  );
};

export default AIStatusBadge;



