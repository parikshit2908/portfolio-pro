-- ============================================
-- CREATE ALL TEMPLATE RECORDS IN DATABASE
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- This creates database records for all uploaded templates
-- Make sure your files are in: template_files/[folder_name]/

-- Replace the base URL if your Supabase URL is different
-- Current: https://bxlvmwnuqghcyoddnlsf.supabase.co

-- Modern Minimal Template
INSERT INTO portfolio_templates (
  name,
  category,
  preview_url,
  component_url,
  config_url,
  data_url,
  css_url
) VALUES (
  'Modern Minimal',
  'Design',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/modern_minimal/preview.png',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/modern_minimal/index.jsx',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/modern_minimal/config.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/modern_minimal/defaultData.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/modern_minimal/style.css'
) ON CONFLICT DO NOTHING;

-- Tech Professional Template
INSERT INTO portfolio_templates (
  name,
  category,
  preview_url,
  component_url,
  config_url,
  data_url,
  css_url
) VALUES (
  'Tech Professional',
  'Tech',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/tech_professional/preview.png',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/tech_professional/index.jsx',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/tech_professional/config.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/tech_professional/defaultData.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/tech_professional/style.css'
) ON CONFLICT DO NOTHING;

-- Creative Showcase Template
INSERT INTO portfolio_templates (
  name,
  category,
  preview_url,
  component_url,
  config_url,
  data_url,
  css_url
) VALUES (
  'Creative Showcase',
  'Design',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/creative_showcase/preview.png',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/creative_showcase/index.jsx',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/creative_showcase/config.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/creative_showcase/defaultData.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/creative_showcase/style.css'
) ON CONFLICT DO NOTHING;

-- Business Executive Template
INSERT INTO portfolio_templates (
  name,
  category,
  preview_url,
  component_url,
  config_url,
  data_url,
  css_url
) VALUES (
  'Business Executive',
  'Business',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/business_executive/preview.png',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/business_executive/index.jsx',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/business_executive/config.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/business_executive/defaultData.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/business_executive/style.css'
) ON CONFLICT DO NOTHING;

-- Photography Portfolio Template
INSERT INTO portfolio_templates (
  name,
  category,
  preview_url,
  component_url,
  config_url,
  data_url,
  css_url
) VALUES (
  'Photography Portfolio',
  'Photography',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/photography_portfolio/preview.png',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/photography_portfolio/index.jsx',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/photography_portfolio/config.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/photography_portfolio/defaultData.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/photography_portfolio/style.css'
) ON CONFLICT DO NOTHING;

-- Freelancer Pro Template
INSERT INTO portfolio_templates (
  name,
  category,
  preview_url,
  component_url,
  config_url,
  data_url,
  css_url
) VALUES (
  'Freelancer Pro',
  'Business',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/freelancer_pro/preview.png',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/freelancer_pro/index.jsx',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/freelancer_pro/config.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/freelancer_pro/defaultData.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/freelancer_pro/style.css'
) ON CONFLICT DO NOTHING;

-- Verify templates were created
SELECT name, category, created_at FROM portfolio_templates ORDER BY created_at DESC;

