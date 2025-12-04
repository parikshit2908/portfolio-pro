// src/components/EditorSidebar.jsx
import React from "react";
import EditorField from "./EditorField";
import EditorRepeater from "./EditorRepeater";

/**
 * Retrieve value from data safely using dot notation path
 */
function getValue(data, path) {
  if (!path) return undefined;
  const keys = path.split(".");
  let cursor = data;
  for (let k of keys) {
    if (cursor && typeof cursor === "object" && k in cursor) {
      cursor = cursor[k];
    } else {
      return undefined;
    }
  }
  return cursor;
}

/**
 * Render a config-based field node
 */
function renderConfigNode(prefix, node, data, onChange) {
  const fieldType = node.type;

  // -----------------------------
  // Primitive field (text, number, color, textarea, etc.)
  // -----------------------------
  if (fieldType && fieldType !== "object" && fieldType !== "repeater") {
    const value = getValue(data, prefix);
    const label = node.label || prefix.split(".").pop();
    const finalValue = value !== undefined ? value : node.default || "";

    return (
      <EditorField
        key={prefix}
        label={label}
        type={fieldType}
        path={prefix}
        value={finalValue}
        onChange={onChange}
      />
    );
  }

  // -----------------------------
  // Repeater field
  // -----------------------------
  if (fieldType === "repeater") {
    const value = getValue(data, prefix);
    const items = Array.isArray(value) ? value : [];

    return (
      <EditorRepeater
        key={prefix}
        path={prefix}
        items={items}
        schema={node}
        onChange={onChange}
      />
    );
  }

  // -----------------------------
  // Object group (fieldset)
  // -----------------------------
  if (fieldType === "object" && node.fields) {
    return (
      <div key={prefix} className="editor-section">
        <h3 style={{ margin: "8px 0" }}>{node.label || prefix}</h3>

        {Object.keys(node.fields).map((childKey) =>
          renderConfigNode(
            `${prefix}.${childKey}`,
            node.fields[childKey],
            data,
            onChange
          )
        )}
      </div>
    );
  }

  return null;
}

/**
 * Fallback: data-based renderer
 * Renders editor based on structure of portfolio.data (used when config is missing)
 */
function renderDataNode(prefix, value, onChange) {
  // array = repeater
  if (Array.isArray(value)) {
    return (
      <EditorRepeater
        key={prefix}
        items={value}
        path={prefix}
        onChange={onChange}
      />
    );
  }

  // primitive
  if (typeof value !== "object" || value === null) {
    return (
      <EditorField
        key={prefix}
        label={prefix.split(".").pop()}
        path={prefix}
        value={value}
        onChange={onChange}
      />
    );
  }

  // object
  return (
    <div key={prefix} className="editor-section">
      <h3 style={{ margin: "8px 0" }}>{prefix}</h3>
      {Object.keys(value).map((k) =>
        renderDataNode(`${prefix}.${k}`, value[k], onChange)
      )}
    </div>
  );
}

/**
 * EditorSidebar
 */
export default function EditorSidebar({ data = {}, config = null, onChange }) {
  // -----------------------------
  // CONFIG MODE (recommended)
  // -----------------------------
  if (config?.fields && Object.keys(config.fields).length) {
    return (
      <aside className="editor-sidebar">
        <h2 style={{ marginTop: 0 }}>{config.name || "Editor"}</h2>

        <div className="editor-scroll">
          {Object.keys(config.fields).map((key) =>
            renderConfigNode(key, config.fields[key], data, onChange)
          )}
        </div>
      </aside>
    );
  }

  // -----------------------------
  // FALLBACK MODE (no config)
  // -----------------------------
  return (
    <aside className="editor-sidebar">
      <h2 style={{ marginTop: 0 }}>{config?.name || "Editor"}</h2>

      <div className="editor-scroll">
        {Object.keys(data).length === 0 && (
          <p style={{ color: "#666" }}>No editable fields found.</p>
        )}

        {Object.keys(data).map((key) =>
          renderDataNode(key, data[key], onChange)
        )}
      </div>
    </aside>
  );
}
