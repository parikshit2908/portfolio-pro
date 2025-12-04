// src/utils/templateLoader.js
// Robust template loader with verbose errors and retries

import { supabase } from "../supabase/config";

const SUPABASE_URL = "https://bxlvmwnuqghcyoddnlsf.supabase.co";
const STORAGE_BUCKET = "template_files";

/* -----------------------------------------------------------
 * normalizeStorageUrl
 * ----------------------------------------------------------- */
export function normalizeStorageUrl(urlOrPath) {
  if (!urlOrPath) return null;
  if (urlOrPath.startsWith("http")) return urlOrPath;

  if (urlOrPath.startsWith("/mnt/data/")) {
    const relative = urlOrPath.replace("/mnt/data/", "");
    return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${relative}`;
  }

  const clean = urlOrPath.replace(/^(storage\/|template-assets\/|template_files\/)/, "");
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${clean}`;
}

/* -----------------------------------------------------------
 * safeFetch with retries
 * ----------------------------------------------------------- */
async function safeFetchOnce(url) {
  try {
    const finalUrl = normalizeStorageUrl(url);
    const res = await fetch(finalUrl, { cache: "no-store" });
    const text = res.ok ? await res.text() : null;
    return { ok: res.ok, text, status: res.status, url: finalUrl, error: null };
  } catch (err) {
    return { ok: false, text: null, status: 0, url: url, error: err };
  }
}

async function safeFetch(url, retries = 2) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    const out = await safeFetchOnce(url);
    if (out.ok) return out;
    lastErr = out.error;
    await new Promise((res) => setTimeout(res, 150));
  }
  return { ok: false, text: null, status: 0, url, error: lastErr };
}

/* -----------------------------------------------------------
 * Load Babel standalone
 * ----------------------------------------------------------- */
async function ensureBabel() {
  if (window.Babel) return;
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://unpkg.com/@babel/standalone/babel.min.js";
    s.onload = () => window.Babel ? resolve() : reject();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

/* -----------------------------------------------------------
 * Remove exports
 * ----------------------------------------------------------- */
function removeExports(jsx) {
  return jsx
    .replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)?/g, (_, n) => `function ${n || "TemplateComponent"}`)
    .replace(/export\s+default\s*\(/g, "const __defaultExport = (")
    .replace(/export\s+default\s+/g, "const __defaultExport = ")
    .replace(/^import.+$/gm, "");
}

/* -----------------------------------------------------------
 * Load Template From Remote
 * ----------------------------------------------------------- */
export async function loadTemplateFromRemote(tpl) {
  if (!tpl?.component_url) throw new Error("Template missing component_url.");

  const componentUrl = normalizeStorageUrl(tpl.component_url);
  const configUrl = tpl.config_url ? normalizeStorageUrl(tpl.config_url) : null;
  const dataUrl = tpl.data_url ? normalizeStorageUrl(tpl.data_url) : null;
  const cssUrl = tpl.css_url ? normalizeStorageUrl(tpl.css_url) : null;

  // Load config + data
  const [cfgRes, datRes] = await Promise.all([
    configUrl ? safeFetch(configUrl) : { ok: true, text: null },
    dataUrl ? safeFetch(dataUrl) : { ok: true, text: "{}" }
  ]);

  let config = cfgRes.text ? JSON.parse(cfgRes.text) : null;
  let defaultData = datRes.text ? JSON.parse(datRes.text) : {};

  // Load CSS
  if (cssUrl) {
    const css = await safeFetch(cssUrl);
    if (css.ok && css.text) {
      const id = `tpl-css-${btoa(cssUrl).replace(/=/g, "")}`;
      if (!document.getElementById(id)) {
        const tag = document.createElement("style");
        tag.id = id;
        tag.innerHTML = css.text;
        document.head.appendChild(tag);
      }
    }
  }

  // Load component JSX
  const compRes = await safeFetch(componentUrl);
  if (!compRes.ok) throw new Error(`Failed to fetch component: ${compRes.url}`);

  let jsx = removeExports(compRes.text.trim());

  await ensureBabel();

  const fnMatch = jsx.match(/function\s+([A-Z][A-Za-z0-9_]*)/);
  const compName = fnMatch ? fnMatch[1] : "TemplateComponent";

  if (!jsx.includes("__defaultExport")) {
    jsx += `\n\nvar __defaultExport = ${compName};`;
  }

  const compiled = window.Babel.transform(jsx, {
    presets: ["react"],
    sourceType: "script",
    compact: false
  }).code;

  const ReactObj = window.React || React;

  const runner = new Function(`
    var React = arguments[0];
    var exports = {};
    var module = { exports: exports };
    ${compiled}
    if (typeof __defaultExport === "function") return __defaultExport;
    if (typeof module.exports === "function") return module.exports;
    if (typeof module.exports.default === "function") return module.exports.default;
    return null;
  `);

  const Component = runner(ReactObj);
  if (typeof Component !== "function") throw new Error("Invalid component.");

  return { Component, config, defaultData, previewUrl: tpl.preview_url };
}

/* -----------------------------------------------------------
 * Load Template By ID
 * ----------------------------------------------------------- */
export async function loadTemplate(templateId) {
  const { data, error } = await supabase
    .from("portfolio_templates")
    .select("*")
    .eq("id", templateId)
    .single();

  if (error || !data) throw new Error("Template not found in DB.");
  return await loadTemplateFromRemote(data);
}
