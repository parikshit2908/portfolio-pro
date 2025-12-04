let fetchFn = global.fetch;
if (!fetchFn) {
  fetchFn = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
}
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs/promises');
// FIX for pdf-parse ESM/CJS issues
let pdfParse = require("pdf-parse");
if (pdfParse && typeof pdfParse !== "function") {
  pdfParse = pdfParse.default;
}

const mammoth = require('mammoth');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Ollama URL builder (same as ask-ollama.cjs)
const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
const buildOllamaUrl = (path) => `${OLLAMA_BASE_URL}${path}`;

// Available Ollama models (use the ones you downloaded)
const AVAILABLE_MODELS = process.env.OLLAMA_ALLOWED_MODELS
  ? process.env.OLLAMA_ALLOWED_MODELS.split(',').map((m) => m.trim()).filter(Boolean)
  : ['llama2', 'mistral', 'codellama', 'gemma:2b'];

// Free local AI with Ollama
async function analyzeWithOllama(resumeText, jobDescription, modelName = 'llama2') {
  try {
    const prompt = `You are an expert ATS (Applicant Tracking System) analyst. Analyze the resume against the job description and provide a detailed assessment.

RESUME TEXT:
${resumeText.substring(0, 4000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 2000)}

Provide your analysis in this EXACT JSON format:
{
  "score": 85,
  "breakdown": {
    "keyword_match": 80,
    "experience_relevance": 90,
    "skills_alignment": 85,
    "format_quality": 75
  },
  "keywordsMatched": ["JavaScript", "React", "Node.js", "Python"],
  "missingKeywords": ["AWS", "Docker", "Kubernetes"],
  "strengths": ["Strong technical skills", "Relevant experience", "Good education"],
  "weaknesses": ["Missing cloud experience", "No certification mentioned"],
  "recommendations": [
    "Add AWS and Docker experience",
    "Include relevant certifications",
    "Quantify achievements with numbers"
  ],
  "summary": "Strong candidate with excellent technical skills but needs to add cloud technologies and quantify achievements.",
  "estimated_recruiter_score": "B+"
}

Return ONLY the JSON object, no other text or explanations.`;

    const response = await fetchFn(buildOllamaUrl('/api/generate'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.1,  // Low temperature for consistent JSON
          top_p: 0.9,
          top_k: 40
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.response) {
      throw new Error('No response from Ollama');
    }

    // Extract JSON from the response
    const jsonMatch = result.response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedResult = JSON.parse(jsonMatch[0]);
      return {
        ...parsedResult,
        modelUsed: modelName
      };
    } else {
      throw new Error('Could not extract JSON from response');
    }

  } catch (error) {
    console.error(`Ollama analysis error (${modelName}):`, error.message);
    return null;
  }
}

// Try multiple models in order
async function tryAllModels(resumeText, jobDescription) {
  for (const model of AVAILABLE_MODELS) {
    console.log(`Trying model: ${model}`);
    const result = await analyzeWithOllama(resumeText, jobDescription, model);
    if (result) {
      return result;
    }
    // Wait a bit before trying next model
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return null;
}

// Enhanced heuristic fallback
function enhancedHeuristicATS(resumeText, jobDescription) {
  const jd = (jobDescription || '').toLowerCase();
  const resume = (resumeText || '').toLowerCase();

  const techKeywords = ['javascript', 'python', 'java', 'react', 'node', 'aws', 'docker', 'sql', 'mongodb', 'git'];
  const matched = techKeywords.filter(keyword => jd.includes(keyword) && resume.includes(keyword));
  const missing = techKeywords.filter(keyword => jd.includes(keyword) && !resume.includes(keyword));

  const score = Math.min(100, Math.round((matched.length / Math.max(1, techKeywords.filter(k => jd.includes(k)).length)) * 100));

  return {
    score: score || 50,
    breakdown: {
      keyword_match: score,
      experience_relevance: Math.round(score * 0.9),
      skills_alignment: Math.round(score * 0.8),
      format_quality: 70
    },
    keywordsMatched: matched,
    missingKeywords: missing,
    strengths: ['Automated analysis completed', 'Basic keyword matching applied'],
    weaknesses: ['Limited contextual understanding', 'No semantic analysis'],
    recommendations: [
      'Add missing technical skills: ' + missing.slice(0, 3).join(', '),
      'Include quantifiable achievements',
      'Ensure clear section headings'
    ],
    summary: 'Basic automated analysis completed. Consider manual review for detailed insights.',
    estimated_recruiter_score: score >= 80 ? 'B+' : score >= 60 ? 'C+' : 'C',
    modelUsed: 'heuristic_fallback'
  };
}

// File text extraction
// Add debug logging in the extractTextFromFile function
// File text extraction (robust)
async function extractTextFromFile(filePath, mimetype) {
  try {
    console.log("Processing file:", filePath, "MIME type:", mimetype);
    const buf = await fs.readFile(filePath);

    // ---------- PDF ----------
    if (mimetype && mimetype.toLowerCase().includes('pdf') || (filePath && filePath.toLowerCase().endsWith('.pdf'))) {
      console.log("Attempting PDF extraction...");

      // Try pdf-parse first (clean and usually works)
      if (typeof pdfParse === 'function') {
        try {
          const r = await pdfParse(buf);
          const text = (r && (r.text || r)) ? (r.text || r).toString() : '';
          console.log("pdf-parse text length:", text.length);
          if (text && text.trim().length > 0) return text;
          console.warn("pdf-parse returned empty text, falling back...");
        } catch (err) {
          console.warn("pdf-parse threw:", err && (err.message || err));
          // fall through to next method
        }
      } else {
        console.warn("pdf-parse not available, trying pdf2json fallback");
      }

      // Fallback: use pdf2json if available
      try {
        const PDFParser = require('pdf2json');
        if (PDFParser && typeof PDFParser === 'function') {
          const parser = new PDFParser();
          return await new Promise((resolve, reject) => {
            parser.on('pdfParser_dataError', (e) => {
              console.warn('pdf2json error:', e);
              reject(e);
            });
            parser.on('pdfParser_dataReady', (pdfData) => {
              try {
                const text = parser.getRawTextContent();
                console.log("pdf2json text length:", text?.length || 0);
                resolve(text || '');
              } catch (e) {
                reject(e);
              }
            });
            parser.loadPDF(filePath);
          });
        }
      } catch (err) {
        console.warn("pdf2json not usable or failed:", err && (err.message || err));
      }

      // Last-resort: try decoding buffer as utf8
      try {
        const fallback = buf.toString('utf8');
        console.log("Fallback utf8 text length:", fallback.length);
        return fallback;
      } catch (err) {
        console.warn("utf8 fallback failed:", err && (err.message || err));
        return '';
      }
    }

    // ---------- DOCX (mammoth) ----------
    if (mimetype && (mimetype.toLowerCase().includes('word') || mimetype.toLowerCase().includes('officedocument')) || (filePath && filePath.toLowerCase().endsWith('.docx'))) {
      if (mammoth) {
        try {
          const r = await mammoth.extractRawText({ buffer: buf });
          console.log("DOCX text length:", (r && r.value) ? r.value.length : 0);
          return (r && r.value) ? r.value : '';
        } catch (err) {
          console.warn("mammoth failed:", err && (err.message || err));
          // fall back to utf8
        }
      } else {
        console.warn("mammoth not available");
      }
      try {
        const fallbackDoc = buf.toString('utf8');
        return fallbackDoc;
      } catch (e) {
        return '';
      }
    }

    // ---------- Plain text ----------
    try {
      const text = buf.toString('utf8');
      console.log("Plain text length:", text.length);
      return text;
    } catch (err) {
      console.warn("Plain text read failed:", err && (err.message || err));
      return '';
    }
  } catch (error) {
    console.error('Text extraction error:', error && (error.message || error));
    return '';
  }
}


// Main ATS route
router.post('/ollama-ats', upload.single('resume'), async (req, res) => {

    console.log("=== FILE UPLOAD DEBUG ===");
  console.log("Request received");
  console.log("Files:", req.file);
  console.log("Body:", req.body);
  console.log("Headers:", req.headers);
  
  if (!req.file) {
    console.log("NO FILE RECEIVED");
    return res.status(400).json({ error: "No file uploaded" });
  }

  console.log("File details:", {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype, 
    size: req.file.size,
    path: req.file.path
  });

  let fileCleanup = false;
  
  try {
    const jobDesc = req.body.jobDescription || '';
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Processing resume:', req.file.originalname);

    // Extract text from resume
    const resumeText = await extractTextFromFile(req.file.path, req.file.mimetype);
    
    if (!resumeText || resumeText.trim().length < 50) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Could not extract sufficient text from resume' });
    }

    console.log(`Extracted ${resumeText.length} characters from resume`);

    // Upload to Supabase if configured
    let signedURL = null;
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      try {
        const supabaseAdmin = createClient(
          process.env.SUPABASE_URL, 
          process.env.SUPABASE_SERVICE_KEY, 
          { auth: { persistSession: false } }
        );
        
        const buffer = await fs.readFile(req.file.path);
        const key = `${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
        const BUCKET = process.env.SUPABASE_BUCKET || 'resumes';

        const { data, error } = await supabaseAdmin.storage
          .from(BUCKET)
          .upload(key, buffer, { contentType: req.file.mimetype });

        if (!error) {
          const { data: signedData } = await supabaseAdmin.storage
            .from(BUCKET)
            .createSignedUrl(data.path, 3600);
          signedURL = signedData?.signedUrl;
          console.log('Uploaded to Supabase:', signedURL);
        }
      } catch (uploadError) {
        console.error('Supabase upload failed:', uploadError.message);
      }
    }

    // Analyze with Ollama
    console.log('Starting AI analysis...');
    let analysis = await tryAllModels(resumeText, jobDesc);
    
    if (!analysis) {
      console.log('All AI models failed, using heuristic fallback');
      analysis = enhancedHeuristicATS(resumeText, jobDesc);
    }

    // Clean up uploaded file
    await fs.unlink(req.file.path);
    fileCleanup = true;

    console.log('Analysis completed successfully');

    res.json({
      success: true,
      signedURL,
      analysis,
      timestamp: new Date().toISOString(),
      resumeLength: resumeText.length,
      modelsAvailable: AVAILABLE_MODELS
    });

  } catch (err) {
    console.error('Ollama ATS error:', err);
    
    // Clean up file if not already done
    if (!fileCleanup && req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }

    res.status(500).json({ 
      error: err.message,
      suggestion: 'Check if Ollama is running: systemctl status ollama'
    });
  }
});

// Health check for Ollama
router.get('/ollama-health', async (req, res) => {
  try {
    const ollamaUrl = buildOllamaUrl('/api/tags');
    console.log(`[Health Check] Attempting to connect to Ollama at: ${ollamaUrl}`);
    
    // Simple fetch without timeout for maximum compatibility
    const response = await fetchFn(ollamaUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`[Health Check] Ollama returned status ${response.status}:`, errorText);
      return res.status(200).json({
        status: 'unhealthy',
        ollama: 'not running',
        error: `Ollama returned HTTP ${response.status}`,
        solution: 'Check if Ollama is running: ollama serve'
      });
    }
    
    const models = await response.json();
    const modelList = models.models || [];
    
    console.log(`[Health Check] Ollama is healthy. Found ${modelList.length} models.`);
    
    return res.status(200).json({
      status: 'healthy',
      ollama: 'running',
      models: modelList,
      availableModels: AVAILABLE_MODELS,
      ollamaUrl: ollamaUrl
    });
  } catch (error) {
    console.error('[Health Check] Error:', error.message);
    if (error.stack) {
      console.error('[Health Check] Stack:', error.stack);
    }
    
    // Provide helpful error messages
    let solution = 'Start Ollama with: ollama serve';
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      solution = 'Ollama is not responding. Check if it\'s running: ollama serve';
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
      solution = 'Cannot connect to Ollama. Make sure it\'s running on port 11434.';
    }
    
    // Always return 200 with JSON, never 500
    return res.status(200).json({
      status: 'unhealthy',
      ollama: 'not running',
      error: error.message || 'Unknown error',
      solution: solution,
      ollamaUrl: buildOllamaUrl('/api/tags')
    });
  }
});

module.exports = router;