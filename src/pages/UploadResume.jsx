import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./UploadResume.css";

/**
 * UploadResume.jsx
 * - POSTS multipart/form-data to /api/ollama-ats
 * - Expects server JSON: { success:true, signedURL, analysis, ... }
 * - Shows upload status and analysis results
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const buildApiUrl = (path) => `${API_BASE_URL}${path}`;

export default function UploadResume() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (
      selectedFile.type === "application/pdf" ||
      selectedFile.type.includes("word") ||
      selectedFile.type === "text/plain"
    ) {
      setFile(selectedFile);
      setErrorMsg("");
    } else {
      setErrorMsg("Please upload only PDF, DOC/DOCX or plain text files.");
    }
  };

  const handleUpload = async (e) => {
    e && e.preventDefault();
    if (!file) {
      setErrorMsg("Please select a file.");
      return;
    }

    setUploading(true);
    setStatusMsg("");
    setErrorMsg("");
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      // If your form lets user enter jobDescription, append it here; otherwise empty string is fine
      formData.append("jobDescription", document.getElementById("job-desc-input")?.value || "");

      const res = await fetch(buildApiUrl("/api/ollama-ats"), {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (!res.ok) {
        const txt = await res.text().catch(()=>null);
        throw new Error(txt || `Upload failed (${res.status})`);
      }

      const json = await res.json();

      if (!json || !json.success) {
        throw new Error(json && json.error ? json.error : "Upload/analysis failed");
      }

      setStatusMsg("Resume uploaded and analyzed.");
      setAnalysis(json.analysis || null);
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg(err.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-resume-page">
      <div className="container py-5">
        <motion.div
          className="upload-resume-card mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="upload-header">
            <i className="bi bi-file-earmark-arrow-up"></i>
            <h2>Upload Resume</h2>
            <p>Upload your resume (PDF, DOCX or TXT) to run ATS analysis.</p>
          </div>

          <form onSubmit={handleUpload} className="upload-form">
            <div className="mb-2">
              <input
                type="text"
                id="job-desc-input"
                placeholder="(Optional) Job description or title — improves matching"
                className="form-control"
                disabled={uploading}
              />
            </div>

            <div className="upload-area">
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="file-input"
                disabled={uploading}
              />
              <label htmlFor="resume-upload" className="upload-label">
                <i className="bi bi-cloud-upload"></i>
                <span>{file ? file.name : "Choose file or drag here"}</span>
                <small>Supported: PDF, DOC, DOCX, TXT</small>
              </label>
            </div>

            {errorMsg && (
              <div className="alert alert-danger mt-2">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {errorMsg}
              </div>
            )}

            {statusMsg && (
              <div className="alert alert-success mt-2">
                <i className="bi bi-check-circle me-2"></i>
                {statusMsg}
              </div>
            )}

            <button
              type="submit"
              className="btn-upload-primary"
              disabled={!file || uploading}
            >
              {uploading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="bi bi-upload me-2"></i>
                  Upload Resume
                </>
              )}
            </button>
          </form>

          {/* Analysis display */}
          {analysis && (
            <div className="mt-4 analysis-card card p-3">
              <h5>ATS Analysis</h5>
              <p>
                <strong>Score:</strong>{" "}
                {analysis.score ?? "N/A"}{" "}
                {analysis.modelUsed ? <em>({analysis.modelUsed})</em> : null}
              </p>

              {analysis.breakdown && (
                <div style={{ marginBottom: 8 }}>
                  <strong>Breakdown:</strong>
                  <ul>
                    <li>Keyword match: {analysis.breakdown.keyword_match}</li>
                    <li>Experience relevance: {analysis.breakdown.experience_relevance}</li>
                    <li>Skills alignment: {analysis.breakdown.skills_alignment}</li>
                    <li>Format quality: {analysis.breakdown.format_quality}</li>
                  </ul>
                </div>
              )}

              {Array.isArray(analysis.keywordsMatched) && analysis.keywordsMatched.length > 0 && (
                <div>
                  <strong>Keywords matched:</strong>
                  <div>{analysis.keywordsMatched.join(", ")}</div>
                </div>
              )}

              {Array.isArray(analysis.missingKeywords) && analysis.missingKeywords.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <strong>Missing keywords:</strong>
                  <div>{analysis.missingKeywords.join(", ")}</div>
                </div>
              )}

              {Array.isArray(analysis.recommendations) && analysis.recommendations.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <strong>Recommendations:</strong>
                  <ol>
                    {analysis.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                  </ol>
                </div>
              )}

              {analysis.summary && (
                <div style={{ marginTop: 8 }}>
                  <strong>Summary:</strong>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{analysis.summary}</div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
