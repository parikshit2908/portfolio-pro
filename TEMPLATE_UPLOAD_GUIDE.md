# Professional Portfolio Templates - Upload Guide

## 📦 Available Templates

I've created **6 professional portfolio templates** for your users:

1. **Modern Minimal** - Clean, minimalist design for designers
2. **Tech Professional** - Modern dark theme for developers
3. **Creative Showcase** - Bold, colorful design for artists
4. **Business Executive** - Professional corporate style
5. **Photography Portfolio** - Image-focused gallery layout
6. **Freelancer Pro** - Perfect for independent professionals

## 🚀 How to Upload Templates to Supabase

### Option 1: Upload All Templates at Once (Recommended)

1. **Set your Supabase Service Role Key** (required for uploads):
   ```bash
   # Windows PowerShell
   $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
   
   # Or create a .env file in the root directory
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

2. **Run the batch upload script**:
   ```bash
   node scripts/upload_all_templates.js
   ```

   This will upload all 6 templates automatically!

### Option 2: Upload Templates Individually

For each template folder in `templates/`:

```bash
node scripts/upload_template_to_supabase.js templates/modern_minimal
node scripts/upload_template_to_supabase.js templates/tech_professional
node scripts/upload_template_to_supabase.js templates/creative_showcase
node scripts/upload_template_to_supabase.js templates/business_executive
node scripts/upload_template_to_supabase.js templates/photography_portfolio
node scripts/upload_template_to_supabase.js templates/freelancer_pro
```

## 📋 Template Structure

Each template includes:

- **index.jsx** - React component (fully editable)
- **style.css** - Custom styles
- **config.json** - Editor configuration (defines editable fields)
- **defaultData.json** - Sample content

## ✨ Features

All templates are:
- ✅ **Fully editable** through the editor interface
- ✅ **Responsive** - Work on all devices
- ✅ **Professional** - Modern, polished designs
- ✅ **Customizable** - Colors, text, images, and more
- ✅ **SEO-friendly** - Clean semantic HTML

## 🎨 Template Categories

- **Design**: Modern Minimal, Creative Showcase
- **Tech**: Tech Professional
- **Business**: Business Executive, Freelancer Pro
- **Photography**: Photography Portfolio

## 📝 After Upload

Once uploaded, templates will:
1. Appear in the "View Templates" page
2. Be available for users to create portfolios
3. Be fully editable through the drag-and-drop editor
4. Save automatically to user's dashboard

## 🔧 Getting Your Supabase Service Role Key

1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **API**
3. Copy the **service_role** key (keep this secret!)
4. Use it as an environment variable when uploading

## ✅ Verification

After uploading, verify templates are available:
1. Go to your app's "View Templates" page
2. You should see all 6 templates
3. Click "Use Template" to test creating a portfolio

## 🎯 Next Steps

1. Upload all templates using the batch script
2. Test creating portfolios with each template
3. Customize templates further if needed
4. Add preview images (optional) - upload `preview.png` to each template folder

---

**Note**: Make sure your Supabase Storage bucket `template_files` exists and is public before uploading!

