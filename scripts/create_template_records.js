// scripts/create_template_records.js
// Creates database records for templates that are already uploaded to storage
// Usage: node create_template_records.js

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL || "https://bxlvmwnuqghcyoddnlsf.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error("Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

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
  console.log("Creating template records in database...\n");

  for (const template of templates) {
    const folder = template.folder;
    const storagePath = `templates/${folder}`;

    const templateData = {
      name: template.name,
      category: template.category,
      preview_url: `${BASE_URL}/${storagePath}/preview.png`,
      component_url: `${BASE_URL}/${storagePath}/index.jsx`,
      config_url: `${BASE_URL}/${storagePath}/config.json`,
      data_url: `${BASE_URL}/${storagePath}/defaultData.json`,
      css_url: `${BASE_URL}/${storagePath}/style.css`,
      description: template.description
    };

    // Check if template already exists
    const { data: existing } = await supabase
      .from("portfolio_templates")
      .select("id, name")
      .eq("name", template.name)
      .single();

    if (existing) {
      // Update existing template
      const { error } = await supabase
        .from("portfolio_templates")
        .update(templateData)
        .eq("id", existing.id);

      if (error) {
        console.error(`✗ Failed to update ${template.name}:`, error.message);
      } else {
        console.log(`✓ Updated: ${template.name} (ID: ${existing.id})`);
      }
    } else {
      // Insert new template
      const { data, error } = await supabase
        .from("portfolio_templates")
        .insert(templateData)
        .select()
        .single();

      if (error) {
        console.error(`✗ Failed to create ${template.name}:`, error.message);
      } else {
        console.log(`✓ Created: ${template.name} (ID: ${data.id})`);
      }
    }
  }

  console.log("\n✓ Template records creation completed!");
  console.log("\nNote: If templates still don't show, verify:");
  console.log("1. Files are accessible at the URLs above");
  console.log("2. Storage bucket 'template_files' is public");
  console.log("3. RLS policies allow public read access to portfolio_templates table");
}

createTemplateRecords().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});

