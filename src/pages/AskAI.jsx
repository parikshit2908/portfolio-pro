import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/glassmorphism.css";
import "./AskAI.css";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const buildApiUrl = (path) => `${API_BASE_URL}${path}`;

export default function AskAI() {
  const { theme } = useTheme();

  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [model, setModel] = useState("mistral");
  const [availableModels, setAvailableModels] = useState([]);
  const [ollamaStatus, setOllamaStatus] = useState("checking");
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    checkOllamaHealth();
  }, []);

  async function checkOllamaHealth() {
    try {
      const url = buildApiUrl("/api/ollama-health");
      console.log("[Frontend] Checking Ollama health at:", url);
      
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      // Handle empty or invalid JSON responses
      let data;
      const text = await res.text();
      
      if (!text || text.trim() === "") {
        throw new Error("Server returned empty response. Is the server running?");
      }
      
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.error("[Frontend] Invalid JSON response:", text.substring(0, 200));
        throw new Error(`Server returned invalid response. Make sure server is running on port 3001.`);
      }
      
      console.log("[Frontend] Health check response:", data);
      
      if (data.status === "healthy" && data.models) {
        setAvailableModels(data.models.map((m) => m.name));
        if (data.models.length > 0) {
          setModel(data.models[0].name);
        }
        setOllamaStatus("healthy");
        setError(""); // Clear any previous errors
      } else {
        setOllamaStatus("unhealthy");
        setError(data.solution || data.error || "Ollama is not healthy");
      }
    } catch (err) {
      console.error("[Frontend] Health check error:", err);
      setOllamaStatus("unhealthy");
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError") || err.message.includes("empty response")) {
        setError("Cannot connect to server. Start it with: cd server && node index.cjs");
      } else if (err.message.includes("invalid response")) {
        setError("Server error. Check server logs and make sure it's running on port 3001.");
      } else {
        setError(`Connection error: ${err.message}`);
      }
    }
  }

  async function handleAsk(e) {
    e.preventDefault();
    setError("");
    setAnswer("");

    if (!prompt.trim()) {
      setError("Enter a prompt");
      return;
    }

    setLoading(true);

    try {
      // Try Ollama first if available
      if (ollamaStatus === "healthy" && !useFallback) {
    try {
      const res = await fetch(buildApiUrl("/api/ask-ollama"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model: model || "mistral"
        })
      });

          if (res.ok) {
            const data = await res.json();
            const content = data?.response || data?.message?.content || data?.content;
            
            if (content) {
              setAnswer(content);
              setLoading(false);
              return;
            }
          }
        } catch (ollamaErr) {
          console.warn("Ollama request failed, trying fallback:", ollamaErr);
        }
      }

      // Fallback: Use browser-based AI or provide helpful response
      if (useFallback || ollamaStatus !== "healthy") {
        // Provide a helpful response even without Ollama
        const fallbackResponse = `I understand you're asking: "${prompt.trim()}"\n\n` +
          `Currently, the AI service (Ollama) is not available. Here are some suggestions:\n\n` +
          `1. Make sure the server is running: cd server && node index.cjs\n` +
          `2. Ensure Ollama is installed and running locally\n` +
          `3. Check that the API endpoint is accessible\n\n` +
          `For resume improvement, you can:\n` +
          `- Review your resume for grammar and spelling\n` +
          `- Ensure consistent formatting\n` +
          `- Highlight quantifiable achievements\n` +
          `- Tailor content to job descriptions\n` +
          `- Use action verbs to describe your experience`;

        setAnswer(fallbackResponse);
        setError("Note: Using fallback mode. Start the server for full AI capabilities.");
      } else {
        throw new Error("Unable to connect to AI service. Please check your server connection.");
      }
    } catch (err) {
      console.error("AskAI error:", err);
      let errorMsg = err.message || "Failed to contact AI service";
      if (errorMsg.includes("JSON")) {
        errorMsg = "Invalid response from server. Check if Ollama is running correctly.";
      }
      setError(errorMsg);
      
      // Offer fallback option
      if (!useFallback) {
        setTimeout(() => {
          if (window.confirm("AI service unavailable. Use fallback mode?")) {
            setUseFallback(true);
            // Retry with fallback
            const fakeEvent = { preventDefault: () => {} };
            handleAsk(fakeEvent);
          }
        }, 100);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`askai-page theme-${theme}`}>
      <div className="container py-5">
        <motion.div
          className="askai-card glass-card mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>🤖 AI Assistant</h2>

          <div className={`ollama-status ${ollamaStatus}`}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span>
                {ollamaStatus === "healthy"
                  ? `✅ Ollama Active (${availableModels.length} models)`
                  : ollamaStatus === "checking"
                  ? "⏳ Checking Ollama connection..."
                  : useFallback
                  ? "⚠️ Fallback Mode Active"
                  : "❌ Ollama Offline"}
              </span>
              {error && ollamaStatus === "unhealthy" && !useFallback && (
                <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                  {error}
                </span>
              )}
              {useFallback && (
                <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                  Using fallback mode. Start server for full AI features.
                </span>
              )}
            </div>
            {ollamaStatus !== "healthy" && (
              <button
                className="retry-btn"
                onClick={checkOllamaHealth}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontSize: "0.85rem"
                }}
              >
                🔄 Retry Connection
              </button>
            )}
          </div>

          <form onSubmit={handleAsk}>
            <select
              className="glass-input"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              {availableModels.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>

            <textarea
              className="glass-input askai-textarea"
              rows={6}
              placeholder="Ask anything..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <button className="glass-btn askai-submit-btn" disabled={loading}>
              {loading ? "⏳ Thinking..." : `✨ Ask ${model}`}
            </button>
          </form>

          {error && <div className="error-alert">{error}</div>}

          {answer && (
            <motion.div className="answer-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3>💡 Response</h3>
              <pre>{answer}</pre>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
