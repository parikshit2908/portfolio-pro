// scripts/upload_template_to_supabase.js
// Uploads a template folder to Supabase Storage and creates/updates database entry
// Usage: node upload_template_to_supabase.js <template_folder_path> <template_id>

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL || "https://bxlvmwnuqghcyoddnlsf.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const STORAGE_BUCKET = "template_files";

if (!SUPABASE_SERVICE_KEY) {
  console.error("Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required");
  process.exit(1);
}

if (process.argv.length < 3) {
  console.error("Usage: node upload_template_to_supabase.js <template_folder_path> [template_id]");
  console.error("Example: node upload_template_to_supabase.js ./src/templates/hamish_inspired");
  process.exit(1);
}

const templateFolder = process.argv[2];
const templateId = process.argv[3] || null;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Get public URL for a file in storage
function getPublicUrl(filePath) {
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${filePath}`;
}

// Upload a file to Supabase Storage
async function uploadFile(localPath, storagePath, contentType) {
  const fileBuffer = fs.readFileSync(localPath);
  
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload ${storagePath}: ${error.message}`);
  }

  return getPublicUrl(storagePath);
}

// Read template files
async function uploadTemplate() {
  if (!fs.existsSync(templateFolder)) {
    throw new Error(`Template folder not found: ${templateFolder}`);
  }

  const templateName = path.basename(templateFolder);
  const storagePrefix = `templates/${templateName}`;

  console.log(`Uploading template: ${templateName}`);
  console.log(`Storage prefix: ${storagePrefix}`);

  // Find required files
  const indexJsx = path.join(templateFolder, "index.jsx");
  const configJson = path.join(templateFolder, "config.json");
  const defaultDataJson = path.join(templateFolder, "defaultData.json");
  const styleCss = path.join(templateFolder, "style.css");
  const previewPng = path.join(templateFolder, "preview.png");

  if (!fs.existsSync(indexJsx)) {
    throw new Error("index.jsx not found in template folder");
  }

  if (!fs.existsSync(configJson)) {
    throw new Error("config.json not found in template folder");
  }

  // Upload files
  console.log("\nUploading files...");
  
  const componentUrl = await uploadFile(
    indexJsx,
    `${storagePrefix}/index.jsx`,
    "text/javascript"
  );
  console.log(`✓ Component: ${componentUrl}`);

  const configUrl = await uploadFile(
    configJson,
    `${storagePrefix}/config.json`,
    "application/json"
  );
  console.log(`✓ Config: ${configUrl}`);

  let dataUrl = null;
  if (fs.existsSync(defaultDataJson)) {
    dataUrl = await uploadFile(
      defaultDataJson,
      `${storagePrefix}/defaultData.json`,
      "application/json"
    );
    console.log(`✓ Default Data: ${dataUrl}`);
  }

  let cssUrl = null;
  if (fs.existsSync(styleCss)) {
    cssUrl = await uploadFile(
      styleCss,
      `${storagePrefix}/style.css`,
      "text/css"
    );
    console.log(`✓ CSS: ${cssUrl}`);
  }

  let previewUrl = null;
  if (fs.existsSync(previewPng)) {
    previewUrl = await uploadFile(
      previewPng,
      `${storagePrefix}/preview.png`,
      "image/png"
    );
    console.log(`✓ Preview: ${previewUrl}`);
  }

  // Read config to get template metadata
  const config = JSON.parse(fs.readFileSync(configJson, "utf8"));

  // Insert or update template in database
  console.log("\nUpdating database...");
  
  const templateData = {
    name: config.name || templateName,
    category: config.category || "Design",
    preview_url: previewUrl,
    component_url: componentUrl,
    config_url: configUrl,
    data_url: dataUrl,
    css_url: cssUrl,
    description: config.description || null,
    demo_url: config.demo_url || null,
    updated_at: new Date().toISOString(),
  };

  if (templateId) {
    // Update existing template
    templateData.id = templateId;
    const { error } = await supabase
      .from("portfolio_templates")
      .update(templateData)
      .eq("id", templateId);

    if (error) {
      throw new Error(`Failed to update template: ${error.message}`);
    }
    console.log(`✓ Updated template ${templateId} in database`);
  } else {
    // Insert new template
    const { data, error } = await supabase
      .from("portfolio_templates")
      .insert(templateData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to insert template: ${error.message}`);
    }
    console.log(`✓ Created template ${data.id} in database`);
    console.log(`  Template ID: ${data.id}`);
  }

  console.log("\n✓ Template uploaded successfully!");
  console.log(`  Name: ${templateData.name}`);
  console.log(`  Category: ${templateData.category}`);
}

// Run upload
uploadTemplate().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});

