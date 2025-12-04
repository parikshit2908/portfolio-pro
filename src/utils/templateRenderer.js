// src/utils/templateRenderer.js

/**
 * Safely escape HTML entities to avoid breaking markup.
 */
function escapeHTML(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Replace {{field}} placeholders using dot-notation keys.
 * Example: {{user.name}} → data.user.name
 */
function replaceFields(html, data) {
  return html.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
    const parts = key.split(".");
    let value = data;
    for (let part of parts) {
      value = value?.[part];
      if (value === undefined || value === null) return "";
    }
    return escapeHTML(value);
  });
}

/**
 * Generate a fully assembled HTML document for a template.
 * Useful for iframe previews, public portfolio pages, exports, etc.
 *
 * @param {Object} componentResult - Loaded template files
 * @param {Object} data - Filled-in user data
 * @returns HTML string
 */
export function renderTemplateHTML({
  html = "",
  css = "",
  js = "",
  data = {},
  title = "Portfolio",
}) {
  const output = replaceFields(html, data);

  // Escape JS inside script to avoid breaking tags
  const safeJS = js
    .replace(/<\/script>/gi, "<\\/script>")
    .replace(/`/g, "\\`");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHTML(title)}</title>

  <style>
    ${css}
  </style>
</head>

<body>
  ${output}

  <script>
    ${safeJS}
  </script>
</body>
</html>
  `.trim();
}

/**
 * Helper to render a template that exports:
 * - html string
 * - css string
 * - js string
 */
export function renderFromTemplateFiles(template, data) {
  return renderTemplateHTML({
    html: template.html || "",
    css: template.css || "",
    js: template.js || "",
    data,
    title: template.config?.title || "Portfolio",
  });
}
