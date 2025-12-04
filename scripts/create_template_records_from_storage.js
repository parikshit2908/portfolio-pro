// scripts/create_template_records_from_storage.js
// Creates database records for templates based on what's actually in storage
// Usage: node create_template_records_from_storage.js

const { createClient } = require("@supabase/supabase-js");

// Get URL from config file
const SUPABASE_URL = "https://bxlvmwnuqghcyoddnlsf.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error("Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required");
  console.error("Set it with: $env:SUPABASE_SERVICE_ROLE_KEY='your-key'");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const STORAGE_BUCKET = "template_files";
const BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}`;

// Template configurations
const templates = [
  {
    name: "Modern Minimal",
    category: "Design",
    folder: "modern_minimal",
    description: "A clean, minimalist portfolio perfect for designers and creative professionals. Features elegant typography and spacious layouts."
  },
  {
    name: "Tech Professional",
    category: "Tech",
    folder: "tech_professional",
    description: "A modern portfolio template perfect for developers, engineers, and tech professionals. Features code snippets, project showcases, and technical skills."
  },
  {
    name: "Creative Showcase",
    category: "Design",
    folder: "creative_showcase",
    description: "A bold, creative portfolio perfect for artists, designers, and creative professionals. Features vibrant colors and visual storytelling."
  },
  {
    name: "Business Executive",
    category: "Business",
    folder: "business_executive",
    description: "A professional, corporate portfolio perfect for executives, consultants, and business professionals. Clean, authoritative design."
  },
  {
    name: "Photography Portfolio",
    category: "Photography",
    folder: "photography_portfolio",
    description: "A stunning photography portfolio template with gallery layouts and image-focused design. Perfect for photographers and visual artists."
  },
  {
    name: "Freelancer Pro",
    category: "Business",
    folder: "freelancer_pro",
    description: "A professional freelance portfolio template perfect for independent professionals, consultants, and service providers."
  }
];

// Check if file exists in storage
async function checkFileExists(filePath) {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(filePath.split('/').slice(0, -1).join('/') || '', {
        limit: 1000,
        search: filePath.split('/').pop()
      });
    
    if (error) return false;
    return data && data.some(file => file.name === filePath.split('/').pop());
  } catch {
    return false;
  }
}

// Get public URL for a file
function getPublicUrl(filePath) {
  // Handle different path formats
  let cleanPath = filePath;
  if (cleanPath.startsWith('/')) cleanPath = cleanPath.slice(1);
  if (cleanPath.startsWith('template_files/')) cleanPath = cleanPath.replace('template_files/', '');
  if (cleanPath.startsWith('templates/')) cleanPath = cleanPath.replace('templates/', '');
  
  return `${BASE_URL}/${cleanPath}`;
}

async function createTemplateRecords() {
  console.log("🔍 Checking storage and creating template records...\n");
  console.log(`Storage Bucket: ${STORAGE_BUCKET}`);
  console.log(`Base URL: ${BASE_URL}\n`);

  // First, list all folders in storage to see what's actually there
  console.log("📁 Checking storage folders...");
  const { data: folders, error: listError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list('', { limit: 100 });

  if (listError) {
    console.error("Error listing storage:", listError.message);
    return;
  }

  const availableFolders = folders
    .filter(item => item.id === null) // Folders have null id
    .map(item => item.name);

  console.log(`Found folders: ${availableFolders.join(', ')}\n`);

  for (const template of templates) {
    const folder = template.folder;
    
    // Check if folder exists in storage
    if (!availableFolders.includes(folder)) {
      console.log(`⚠️  Skipping ${template.name}: Folder '${folder}' not found in storage`);
      continue;
    }

    // Try different possible path structures
    const possiblePaths = [
      `${folder}/index.jsx`,           // Direct in folder
      `templates/${folder}/index.jsx`, // In templates subfolder
      `${folder}/index.jsx`            // Root level
    ];

    let componentPath = null;
    for (const path of possiblePaths) {
      const exists = await checkFileExists(path);
      if (exists) {
        componentPath = path;
        break;
      }
    }

    if (!componentPath) {
      // List files in the folder to see what's actually there
      const { data: files } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(folder, { limit: 100 });

      if (files && files.length > 0) {
        console.log(`  Files in ${folder}:`, files.map(f => f.name).join(', '));
        
        // Try to find index.jsx
        const indexFile = files.find(f => f.name === 'index.jsx');
        if (indexFile) {
          componentPath = `${folder}/index.jsx`;
        }
      }

      if (!componentPath) {
        console.log(`⚠️  Skipping ${template.name}: index.jsx not found`);
        continue;
      }
    }

    // Build URLs - try both path structures
    const basePath = componentPath.replace('/index.jsx', '');
    
    const templateData = {
      name: template.name,
      category: template.category,
      preview_url: getPublicUrl(`${basePath}/preview.png`),
      component_url: getPublicUrl(`${basePath}/index.jsx`),
      config_url: getPublicUrl(`${basePath}/config.json`),
      data_url: getPublicUrl(`${basePath}/defaultData.json`),
      css_url: getPublicUrl(`${basePath}/style.css`),
      description: template.description
    };

    console.log(`\n📝 Creating record for: ${template.name}`);
    console.log(`   Component: ${templateData.component_url}`);
    console.log(`   Config: ${templateData.config_url}`);

    // Check if template already exists
    const { data: existing } = await supabase
      .from("portfolio_templates")
      .select("id, name")
      .eq("name", template.name)
      .maybeSingle();

    if (existing) {
      // Update existing template
      const { error } = await supabase
        .from("portfolio_templates")
        .update(templateData)
        .eq("id", existing.id);

      if (error) {
        console.error(`   ✗ Failed to update:`, error.message);
      } else {
        console.log(`   ✓ Updated successfully (ID: ${existing.id})`);
      }
    } else {
      // Insert new template
      const { data, error } = await supabase
        .from("portfolio_templates")
        .insert(templateData)
        .select()
        .single();

      if (error) {
        console.error(`   ✗ Failed to create:`, error.message);
        console.error(`   Error details:`, JSON.stringify(error, null, 2));
      } else {
        console.log(`   ✓ Created successfully (ID: ${data.id})`);
      }
    }
  }

  console.log("\n✅ Template records creation completed!");
  console.log("\n📋 Next steps:");
  console.log("1. Refresh your 'View Templates' page");
  console.log("2. Verify templates appear in the list");
  console.log("3. Test creating a portfolio with one of the templates");
}

createTemplateRecords().catch((err) => {
  console.error("❌ Error:", err.message);
  console.error(err);
  process.exit(1);
});

