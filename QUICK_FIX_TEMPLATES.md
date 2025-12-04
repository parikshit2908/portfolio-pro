# 🚀 Quick Fix: Templates Not Showing

## The Problem
Your template files are in Supabase Storage, but they don't appear on the "View Templates" page because there are no database records.

## ✅ Solution: Run SQL in Supabase

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Copy and Run This SQL

Copy the entire contents of `scripts/create_all_templates.sql` and paste it into the SQL Editor, then click **Run**.

**OR** copy this simplified version:

```sql
-- Create template records for all 6 templates
INSERT INTO portfolio_templates (name, category, preview_url, component_url, config_url, data_url, css_url, description) VALUES
('Modern Minimal', 'Design', 
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/modern_minimal/preview.png',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/modern_minimal/index.jsx',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/modern_minimal/config.json',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/modern_minimal/defaultData.json',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/modern_minimal/style.css',
 'A clean, minimalist portfolio perfect for designers and creative professionals.'),

('Tech Professional', 'Tech',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/tech_professional/preview.png',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/tech_professional/index.jsx',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/tech_professional/config.json',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/tech_professional/defaultData.json',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/tech_professional/style.css',
 'A modern portfolio template perfect for developers and tech professionals.'),

('Creative Showcase', 'Design',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/creative_showcase/preview.png',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/creative_showcase/index.jsx',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/creative_showcase/config.json',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/creative_showcase/defaultData.json',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/creative_showcase/style.css',
 'A bold, creative portfolio perfect for artists and designers.'),

('Business Executive', 'Business',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/business_executive/preview.png',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/business_executive/index.jsx',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/business_executive/config.json',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/business_executive/defaultData.json',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/business_executive/style.css',
 'A professional, corporate portfolio perfect for executives and consultants.'),

('Photography Portfolio', 'Photography',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/photography_portfolio/preview.png',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/photography_portfolio/index.jsx',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/photography_portfolio/config.json',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/photography_portfolio/defaultData.json',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/photography_portfolio/style.css',
 'A stunning photography portfolio template with gallery layouts.'),

('Freelancer Pro', 'Business',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/freelancer_pro/preview.png',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/freelancer_pro/index.jsx',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/freelancer_pro/config.json',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/freelancer_pro/defaultData.json',
 'https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/freelancer_pro/style.css',
 'A professional freelance portfolio template perfect for independent professionals.');
```

### Step 3: Verify Templates Were Created

Run this query to see all templates:
```sql
SELECT id, name, category, created_at FROM portfolio_templates ORDER BY created_at DESC;
```

### Step 4: Refresh Your App

1. Go to your app's "View Templates" page
2. Refresh the page (F5)
3. You should now see all 6 templates!

## 🔍 If Templates Still Don't Show

### Check File URLs
1. Open one of the component URLs in a new browser tab:
   ```
   https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/modern_minimal/index.jsx
   ```
2. If you see the file content → URLs are correct ✅
3. If you see an error → Check the file path in storage

### Check File Path Structure
Your files should be organized like this in storage:
```
template_files/
  ├── modern_minimal/
  │   ├── index.jsx
  │   ├── config.json
  │   ├── defaultData.json
  │   ├── style.css
  │   └── preview.png (optional)
  ├── tech_professional/
  │   └── ...
```

If your files are in a different structure (e.g., `templates/modern_minimal/`), update the URLs in the SQL accordingly.

### Check RLS Policies
1. Go to Supabase → Authentication → Policies
2. Find `portfolio_templates` table
3. Make sure there's a SELECT policy allowing public access:
   ```sql
   CREATE POLICY "Templates are viewable by everyone"
   ON portfolio_templates FOR SELECT
   USING (true);
   ```

## ✅ Success Checklist

- [ ] SQL executed successfully in Supabase
- [ ] Templates appear in `SELECT * FROM portfolio_templates` query
- [ ] File URLs are accessible in browser
- [ ] "View Templates" page shows templates
- [ ] Can click "Use Template" and create portfolio

---

**That's it!** Once you run the SQL, your templates will appear on the View Templates page.

