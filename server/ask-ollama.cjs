const express = require("express");
const router = express.Router();

let fetchFn = global.fetch;
if (!fetchFn) {
  fetchFn = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
}

const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
const buildOllamaUrl = (path) => `${OLLAMA_BASE_URL}${path}`;

router.post("/ask-ollama", async (req, res) => {
  try {
    const { prompt, model } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const usedModel = model || process.env.OLLAMA_DEFAULT_MODEL || "mistral";

    const response = await fetchFn(buildOllamaUrl("/api/generate"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: usedModel,
        prompt: prompt.trim(),
        stream: false,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "Unknown error");
      console.error(`Ollama API error (${response.status}):`, text);
      return res.status(response.status).json({
        error: `Ollama API error: ${response.status}`,
        detail: text.substring(0, 200), // Limit error detail length
        status: response.status,
      });
    }

    // Handle both streaming and non-streaming responses
    const contentType = response.headers.get("content-type") || "";
    let json;

    if (contentType.includes("application/json")) {
      // Standard JSON response
      const text = await response.text();
      try {
        json = JSON.parse(text);
      } catch (parseErr) {
        console.error("JSON parse error:", parseErr);
        console.error("Response text (first 500 chars):", text.substring(0, 500));
        return res.status(500).json({
          error: "Invalid JSON response from Ollama",
          detail: "Ollama returned malformed JSON. Check Ollama logs.",
        });
      }
    } else {
      // Try to parse as JSON anyway (some servers don't set content-type correctly)
      const text = await response.text();
      try {
        json = JSON.parse(text);
      } catch (parseErr) {
        console.error("Failed to parse response:", parseErr);
        console.error("Response (first 500 chars):", text.substring(0, 500));
        return res.status(500).json({
          error: "Failed to parse Ollama response",
          detail: "Response was not valid JSON. Check if Ollama is running correctly.",
        });
      }
    }

    // Extract response text from various possible formats
    const responseText = json.response || json.message?.content || json.content || json.text || "";

    if (!responseText) {
      console.error("No response text in Ollama response:", JSON.stringify(json, null, 2));
      return res.status(500).json({
        error: "No response content from Ollama",
        detail: "Ollama returned a response but it was empty.",
      });
    }

    return res.json({
      success: true,
      model: usedModel,
      response: responseText,
    });

  } catch (err) {
    console.error("Ollama error:", err);
    res.status(500).json({
      error: err.message || "Internal server error",
      detail: "Failed to communicate with Ollama service.",
    });
  }
});

module.exports = router;
