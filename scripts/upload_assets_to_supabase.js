// scripts/upload_assets_to_supabase.js
// Run: node upload_assets_to_supabase.js /mnt/data/rafaelconde-main.zip
const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
const { createClient } = require("@supabase/supabase-js");

if (process.argv.length < 3) {
  console.error("Usage: node upload_assets_to_supabase.js <zip-path>");
  process.exit(1);
}

const zipPath = process.argv[2];
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars");
  process.exit(1);
}

const supa = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function uploadFile(buffer, destPath, contentType) {
  const { data, error } = await supa.storage.from("template-assets").upload(destPath, buffer, {
    contentType,
    upsert: true,
  });
  if (error) throw error;
  return `${SUPABASE_URL}/storage/v1/object/public/${data.Key || destPath}`;
}

(async () => {
  const dir = fs.mkdtempSync(path.join(require("os").tmpdir(), "tpl-"));
  await fs.createReadStream(zipPath).pipe(unzipper.Extract({ path: dir })).promise();
  // find images
  const files = [];
  function walk(d) {
    for (const f of fs.readdirSync(d)) {
      const fp = path.join(d, f);
      const stat = fs.statSync(fp);
      if (stat.isDirectory()) walk(fp);
      else {
        if (/\.(png|jpe?g|gif|webp)$/i.test(f)) files.push(fp);
      }
    }
  }
  walk(dir);

  console.log("Found images:", files.length);

  for (const f of files) {
    const content = fs.readFileSync(f);
    const basename = path.basename(f);
    const dest = `template-assets/${basename}`;
    console.log("Uploading", basename);
    const url = await uploadFile(content, dest, "image/" + path.extname(basename).slice(1));
    console.log("Uploaded =>", url);
  }

  console.log("Done. Remove temp folder:", dir);
})();
