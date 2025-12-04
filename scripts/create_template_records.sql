-- ============================================
-- CREATE TEMPLATE RECORDS IN DATABASE
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- This creates database records for all uploaded templates

-- Replace YOUR_SUPABASE_URL with your actual Supabase URL
-- Example: https://bxlvmwnuqghcyoddnlsf.supabase.co
-- The script will use the correct URL from your config

-- Modern Minimal Template
INSERT INTO portfolio_templates (
  id,
  name,
  category,
  preview_url,
  component_url,
  config_url,
  data_url,
  css_url,
  description
) VALUES (
  gen_random_uuid(),
  'Modern Minimal',
  'Design',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/modern_minimal/preview.png',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/modern_minimal/index.jsx',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/modern_minimal/config.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/modern_minimal/defaultData.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/modern_minimal/style.css',
  'A clean, minimalist portfolio perfect for designers and creative professionals. Features elegant typography and spacious layouts.'
) ON CONFLICT DO NOTHING;

-- Tech Professional Template
INSERT INTO portfolio_templates (
  id,
  name,
  category,
  preview_url,
  component_url,
  config_url,
  data_url,
  css_url,
  description
) VALUES (
  gen_random_uuid(),
  'Tech Professional',
  'Tech',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/tech_professional/preview.png',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/tech_professional/index.jsx',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/tech_professional/config.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/tech_professional/defaultData.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/tech_professional/style.css',
  'A modern portfolio template perfect for developers, engineers, and tech professionals. Features code snippets, project showcases, and technical skills.'
) ON CONFLICT DO NOTHING;

-- Creative Showcase Template
INSERT INTO portfolio_templates (
  id,
  name,
  category,
  preview_url,
  component_url,
  config_url,
  data_url,
  css_url,
  description
) VALUES (
  gen_random_uuid(),
  'Creative Showcase',
  'Design',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/creative_showcase/preview.png',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/creative_showcase/index.jsx',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/creative_showcase/config.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/creative_showcase/defaultData.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/creative_showcase/style.css',
  'A bold, creative portfolio perfect for artists, designers, and creative professionals. Features vibrant colors and visual storytelling.'
) ON CONFLICT DO NOTHING;

-- Business Executive Template
INSERT INTO portfolio_templates (
  id,
  name,
  category,
  preview_url,
  component_url,
  config_url,
  data_url,
  css_url,
  description
) VALUES (
  gen_random_uuid(),
  'Business Executive',
  'Business',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/business_executive/preview.png',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/business_executive/index.jsx',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/business_executive/config.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/business_executive/defaultData.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/business_executive/style.css',
  'A professional, corporate portfolio perfect for executives, consultants, and business professionals. Clean, authoritative design.'
) ON CONFLICT DO NOTHING;

-- Photography Portfolio Template
INSERT INTO portfolio_templates (
  id,
  name,
  category,
  preview_url,
  component_url,
  config_url,
  data_url,
  css_url,
  description
) VALUES (
  gen_random_uuid(),
  'Photography Portfolio',
  'Photography',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/photography_portfolio/preview.png',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/photography_portfolio/index.jsx',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/photography_portfolio/config.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/photography_portfolio/defaultData.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/photography_portfolio/style.css',
  'A stunning photography portfolio template with gallery layouts and image-focused design. Perfect for photographers and visual artists.'
) ON CONFLICT DO NOTHING;

-- Freelancer Pro Template
INSERT INTO portfolio_templates (
  id,
  name,
  category,
  preview_url,
  component_url,
  config_url,
  data_url,
  css_url,
  description
) VALUES (
  gen_random_uuid(),
  'Freelancer Pro',
  'Business',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/freelancer_pro/preview.png',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/freelancer_pro/index.jsx',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/freelancer_pro/config.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/freelancer_pro/defaultData.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/freelancer_pro/style.css',
  'A professional freelance portfolio template perfect for independent professionals, consultants, and service providers.'
) ON CONFLICT DO NOTHING;

