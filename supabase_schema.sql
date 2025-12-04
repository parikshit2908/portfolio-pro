-- ============================================
-- SUPABASE SCHEMA FOR PORTFOLIO ATS SYSTEM
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- https://app.supabase.com/project/YOUR_PROJECT/sql

-- ============================================
-- 1. PORTFOLIO TEMPLATES TABLE
-- ============================================
-- Stores all available portfolio templates
CREATE TABLE IF NOT EXISTS portfolio_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Design', 'Tech', 'Photography', 'Sound', 'Business')),
  preview_url TEXT,
  component_url TEXT NOT NULL, -- URL to JSX component file
  config_url TEXT, -- URL to config.json
  data_url TEXT, -- URL to defaultData.json
  css_url TEXT, -- URL to CSS file
  demo_url TEXT, -- Demo/live preview URL
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_portfolio_templates_category ON portfolio_templates(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_templates_created ON portfolio_templates(created_at DESC);

-- Enable Row Level Security
ALTER TABLE portfolio_templates ENABLE ROW LEVEL SECURITY;

-- Allow public read access to templates
DROP POLICY IF EXISTS "Templates are viewable by everyone" ON portfolio_templates;
CREATE POLICY "Templates are viewable by everyone"
  ON portfolio_templates FOR SELECT
  USING (true);

-- Only authenticated users can insert/update/delete (optional - adjust based on needs)
DROP POLICY IF EXISTS "Only admins can modify templates" ON portfolio_templates;
CREATE POLICY "Only admins can modify templates"
  ON portfolio_templates FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- 2. USER PORTFOLIOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  template_id UUID REFERENCES portfolio_templates(id) ON DELETE SET NULL,
  data JSONB DEFAULT '{}'::jsonb,
  html_output TEXT,
  public_url TEXT,
  slug TEXT UNIQUE,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_portfolios_user_id ON user_portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_user_portfolios_slug ON user_portfolios(slug);
CREATE INDEX IF NOT EXISTS idx_user_portfolios_template_id ON user_portfolios(template_id);
CREATE INDEX IF NOT EXISTS idx_user_portfolios_public ON user_portfolios(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_user_portfolios_created ON user_portfolios(created_at DESC);

-- Enable Row Level Security
ALTER TABLE user_portfolios ENABLE ROW LEVEL SECURITY;

-- Users can view their own portfolios
DROP POLICY IF EXISTS "Users can view own portfolios" ON user_portfolios;
CREATE POLICY "Users can view own portfolios"
  ON user_portfolios FOR SELECT
  USING (auth.uid() = user_id);

-- Public portfolios are viewable by everyone
DROP POLICY IF EXISTS "Public portfolios are viewable by everyone" ON user_portfolios;
CREATE POLICY "Public portfolios are viewable by everyone"
  ON user_portfolios FOR SELECT
  USING (is_public = true);

-- Users can insert their own portfolios
DROP POLICY IF EXISTS "Users can insert own portfolios" ON user_portfolios;
CREATE POLICY "Users can insert own portfolios"
  ON user_portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own portfolios
DROP POLICY IF EXISTS "Users can update own portfolios" ON user_portfolios;
CREATE POLICY "Users can update own portfolios"
  ON user_portfolios FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own portfolios
DROP POLICY IF EXISTS "Users can delete own portfolios" ON user_portfolios;
CREATE POLICY "Users can delete own portfolios"
  ON user_portfolios FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 3. ANALYTICS TABLE (if needed)
-- ============================================
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  visits INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date DESC);

-- Enable Row Level Security
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read analytics
DROP POLICY IF EXISTS "Authenticated users can view analytics" ON analytics;
CREATE POLICY "Authenticated users can view analytics"
  ON analytics FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================
-- 4. PROFILES TABLE (user profile info)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view all profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- 5. UPDATE TRIGGERS
-- ============================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DROP TRIGGER IF EXISTS update_portfolio_templates_updated_at ON portfolio_templates;
CREATE TRIGGER update_portfolio_templates_updated_at
  BEFORE UPDATE ON portfolio_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_portfolios_updated_at ON user_portfolios;
CREATE TRIGGER update_user_portfolios_updated_at
  BEFORE UPDATE ON user_portfolios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. STORAGE BUCKETS SETUP
-- ============================================
-- Note: Run these in Supabase Dashboard > Storage

-- Create template_files bucket (for template files)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('template_files', 'template_files', true)
-- ON CONFLICT (id) DO NOTHING;

-- Storage policies for template_files
-- Allow public read access
-- CREATE POLICY "Public Access"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'template_files');

-- Allow authenticated users to upload
-- CREATE POLICY "Authenticated users can upload"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'template_files' AND auth.role() = 'authenticated');

-- ============================================
-- SAMPLE INSERT FOR TESTING
-- ============================================
-- Example: Insert a template record (replace URLs with actual Supabase Storage URLs)
/*
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
  '2d03f435-2a83-4ca3-a152-a3ba3949cc0e',
  'Hamish — Inspired',
  'Design',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/hamish_inspired/preview.png',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/hamish_inspired/index.jsx',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/hamish_inspired/config.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/hamish_inspired/defaultData.json',
  'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/hamish_inspired/style.css',
  'A clean, modern hero-based portfolio inspired by Hamish Williams'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  preview_url = EXCLUDED.preview_url,
  component_url = EXCLUDED.component_url,
  config_url = EXCLUDED.config_url,
  data_url = EXCLUDED.data_url,
  css_url = EXCLUDED.css_url,
  updated_at = NOW();
*/

