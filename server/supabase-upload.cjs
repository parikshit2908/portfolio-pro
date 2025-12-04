// /Users/apple/Desktop/portfolio-ats-main/server/supabase-upload.cjs
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs/promises');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// --- DEBUG / FALLBACKS ---
// sometimes env loading / casing differs when using pm2; add a safe fallback
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.supabaseUrl || process.env.SUPABASE_BASE_URL;
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.supabaseKey;

const BUCKET = process.env.SUPABASE_BUCKET || 'resumes';

// Log a masked debug line to confirm values at startup (won't print secrets)
console.log('server/supabase-upload.cjs env check: SUPABASE_URL present=', !!SUPABASE_URL, 'BUCKET=', BUCKET);

// Fail fast with clear message (so pm2 logs show this once instead of large stack traces)
if (!SUPABASE_URL) {
  console.error('FATAL: SUPABASE_URL is missing. Check server/.env and that pm2 was started with --update-env.');
  // don't throw here to avoid crashing everything; still throw so stacktrace is obvious:
  throw new Error('SUPABASE_URL is required (process.env.SUPABASE_URL is undefined)');
}
if (!SUPABASE_SERVICE_KEY) {
  console.error('FATAL: SUPABASE_SERVICE_ROLE_KEY (or equivalent) is missing in env.');
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required (process.env.SUPABASE_SERVICE_ROLE_KEY is undefined)');
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

// ----------- SIGNED URL UPLOAD HELPER -----------
async function uploadToSupabase(localFilePath, originalName, mime) {
  const buffer = await fs.readFile(localFilePath);
  const key = `${Date.now()}_${originalName.replace(/\s+/g, '_')}`;

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(key, buffer, { contentType: mime });

  if (error) throw error;

  // data.path should contain the path to the uploaded file
  const objectPath = data?.path || data?.Key || key;

  const { data: signedData, error: signErr } =
    await supabaseAdmin.storage.from(BUCKET).createSignedUrl(objectPath, 3600);

  if (signErr) throw signErr;

  return signedData.signedUrl;
}

// ------------- ROUTE -------------
router.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const mime = req.file.mimetype;

    const signedUrl = await uploadToSupabase(filePath, fileName, mime);

    res.json({
      success: true,
      signedURL: signedUrl,
      fileName
    });
  } catch (err) {
    console.error('upload-resume error:', err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

module.exports = router;
