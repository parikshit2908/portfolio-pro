# Fix: Templates Not Showing on View Templates Page

## Problem
You've uploaded template files to Supabase Storage, but they're not appearing on the "View Templates" page.

## Root Cause
The "View Templates" page queries the **database table** (`portfolio_templates`), not storage directly. Even though files are in storage, there are no database records pointing to them.

## Solution

### Option 1: Use the Automated Script (Recommended)

1. **Set your Supabase Service Role Key**:
   ```powershell
   # Windows PowerShell
   $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
   ```

2. **Run the script**:
   ```bash
   node scripts/create_template_records_from_storage.js
   ```

   This script will:
   - Check what folders/files are actually in your storage
   - Create database records for each template
   - Use the correct file paths from your storage

### Option 2: Manual SQL Insert

1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL from `scripts/create_template_records.sql`
3. **Important**: Update the URLs to match your actual storage paths

### Option 3: Use Supabase Dashboard

1. Go to Supabase Dashboard → Table Editor → `portfolio_templates`
2. Click "Insert" → "Insert row"
3. Fill in the fields:
   - **name**: Template name (e.g., "Modern Minimal")
   - **category**: One of: Design, Tech, Photography, Sound, Business
   - **component_url**: Full URL to `index.jsx` file
   - **config_url**: Full URL to `config.json` file
   - **data_url**: Full URL to `defaultData.json` file
   - **css_url**: Full URL to `style.css` file
   - **preview_url**: Full URL to `preview.png` (optional)
   - **description**: Template description

## URL Format

Your template file URLs should follow this format:
```
https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/[folder_name]/[file_name]
```

For example:
- `https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/modern_minimal/index.jsx`
- `https://bxlvmwnuqghcyoddnlsf.supabase.co/storage/v1/object/public/template_files/modern_minimal/config.json`

## Verify File Paths

Check your actual file structure in Supabase Storage:
1. Go to Storage → `template_files` bucket
2. Check the folder structure:
   - Are files directly in folders? (e.g., `modern_minimal/index.jsx`)
   - Or in a subfolder? (e.g., `templates/modern_minimal/index.jsx`)

## Required Files for Each Template

Each template folder should have:
- ✅ `index.jsx` (required)
- ✅ `config.json` (required)
- ✅ `defaultData.json` (required)
- ✅ `style.css` (required)
- ⚠️ `preview.png` (optional but recommended)

## After Creating Records

1. **Refresh the "View Templates" page** in your app
2. Templates should now appear
3. Click "Use Template" to test creating a portfolio

## Troubleshooting

### Templates still not showing?

1. **Check RLS Policies**:
   - Go to Supabase → Authentication → Policies
   - Verify `portfolio_templates` table has a SELECT policy allowing public access

2. **Verify URLs are accessible**:
   - Open a template URL in browser (e.g., component_url)
   - Should see the file content, not an error

3. **Check browser console**:
   - Open browser DevTools (F12)
   - Check Console for errors
   - Check Network tab for failed requests

4. **Verify storage bucket is public**:
   - Go to Storage → `template_files` bucket
   - Should show "Public" badge
   - If not, make it public in bucket settings

## Quick Test

Run this in your browser console on the View Templates page:
```javascript
// Check if templates are being fetched
fetch('https://bxlvmwnuqghcyoddnlsf.supabase.co/rest/v1/portfolio_templates?select=*', {
  headers: {
    'apikey': 'your-anon-key',
    'Authorization': 'Bearer your-anon-key'
  }
})
.then(r => r.json())
.then(console.log);
```

This should return an array of template records.

