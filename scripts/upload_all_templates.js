// scripts/upload_all_templates.js
// Uploads all templates from the templates directory to Supabase
// Usage: node upload_all_templates.js

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const templatesDir = path.join(__dirname, "..", "templates");
const uploadScript = path.join(__dirname, "upload_template_to_supabase.js");

if (!fs.existsSync(templatesDir)) {
  console.error("Templates directory not found:", templatesDir);
  process.exit(1);
}

const templateFolders = fs.readdirSync(templatesDir).filter(item => {
  const itemPath = path.join(templatesDir, item);
  return fs.statSync(itemPath).isDirectory();
});

if (templateFolders.length === 0) {
  console.error("No template folders found in:", templatesDir);
  process.exit(1);
}

console.log(`Found ${templateFolders.length} templates to upload:\n`);

templateFolders.forEach((folder, index) => {
  const templatePath = path.join(templatesDir, folder);
  console.log(`[${index + 1}/${templateFolders.length}] Uploading: ${folder}`);
  
  try {
    execSync(`node "${uploadScript}" "${templatePath}"`, {
      stdio: "inherit",
      cwd: path.join(__dirname, "..")
    });
    console.log(`✓ Successfully uploaded ${folder}\n`);
  } catch (error) {
    console.error(`✗ Failed to upload ${folder}:`, error.message);
    console.log("");
  }
});

console.log("Upload process completed!");

