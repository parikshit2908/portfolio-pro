// scripts/create_template_records_simple.cjs
// Creates database records for templates - uses anon key (no service role needed)
// Usage: node scripts/create_template_records_simple.cjs

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://bxlvmwnuqghcyoddnlsf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4bHZtd251cWdoY3lvZGRubHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzMxOTgsImV4cCI6MjA3ODU0OTE5OH0.O-NSXkeJg6gTDwhBisjv18BIhSOQRnde34zVD9vcO_E";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const STORAGE_BUCKET = "template_files";
const BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}`;

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

async function createTemplateRecords() {
  console.log("🔍 Creating template database records...\n");
  console.log(`Storage Base URL: ${BASE_URL}\n`);

  // List folders in storage to see actual structure
  console.log("📁 Checking storage structure...");
  const { data: folders, error: listError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list('', { limit: 100 });

  if (listError) {
    console.error("❌ Error accessing storage:", listError.message);
    console.log("\n💡 Tip: Make sure the storage bucket is public and accessible");
    return;
  }

  const folderNames = folders
    .filter(item => item.id === null)
    .map(item => item.name);

  console.log(`Found folders: ${folderNames.join(', ')}\n`);

  for (const template of templates) {
    const folder = template.folder;
    
    if (!folderNames.includes(folder)) {
      console.log(`⚠️  Skipping ${template.name}: Folder '${folder}' not found`);
      continue;
    }

    // Build URLs - files should be directly in the folder
    const templateData = {
      name: template.name,
      category: template.category,
      preview_url: `${BASE_URL}/${folder}/preview.png`,
      component_url: `${BASE_URL}/${folder}/index.jsx`,
      config_url: `${BASE_URL}/${folder}/config.json`,
      data_url: `${BASE_URL}/${folder}/defaultData.json`,
      css_url: `${BASE_URL}/${folder}/style.css`,
      description: template.description
    };

    console.log(`📝 Processing: ${template.name}`);
    console.log(`   Folder: ${folder}`);
    console.log(`   Component: ${templateData.component_url}`);

    // Check if template exists
    const { data: existing } = await supabase
      .from("portfolio_templates")
      .select("id, name")
      .eq("name", template.name)
      .maybeSingle();

    if (existing) {
      console.log(`   ⚠️  Template already exists (ID: ${existing.id})`);
      console.log(`   💡 To update, use Supabase Dashboard or set SUPABASE_SERVICE_ROLE_KEY`);
      continue;
    }

    // Try to insert (will fail if RLS doesn't allow, but that's okay - user can use SQL)
    const { data, error } = await supabase
      .from("portfolio_templates")
      .insert(templateData)
      .select()
      .single();

    if (error) {
      if (error.code === '42501' || error.message.includes('permission') || error.message.includes('policy')) {
        console.log(`   ⚠️  Permission denied (RLS policy). Use SQL method instead.`);
        console.log(`   📋 SQL for this template:`);
        console.log(`   INSERT INTO portfolio_templates (name, category, preview_url, component_url, config_url, data_url, css_url, description)`);
        console.log(`   VALUES ('${template.name}', '${template.category}',`);
        console.log(`   '${templateData.preview_url}',`);
        console.log(`   '${templateData.component_url}',`);
        console.log(`   '${templateData.config_url}',`);
        console.log(`   '${templateData.data_url}',`);
        console.log(`   '${templateData.css_url}',`);
        console.log(`   '${template.description}');\n`);
      } else {
        console.error(`   ✗ Error:`, error.message);
      }
    } else {
      console.log(`   ✓ Created successfully (ID: ${data.id})\n`);
    }
  }

  console.log("\n✅ Process completed!");
  console.log("\n📋 Next steps:");
  console.log("1. If you see permission errors, use the SQL method (see FIX_TEMPLATES_NOT_SHOWING.md)");
  console.log("2. Or set SUPABASE_SERVICE_ROLE_KEY and run the script again");
  console.log("3. Refresh your 'View Templates' page");
}

createTemplateRecords().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});

