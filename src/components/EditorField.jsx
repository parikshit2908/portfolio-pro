// src/components/EditorField.jsx
import React from "react";

/**
 * Props:
 * - label
 * - path
 * - value
 * - onChange(path, value)
 * - type: text | textarea | number | url | email | color
 */
export default function EditorField({ label, path, value, onChange, type = "text" }) {
  const handle = (ev) => {
    onChange(path, type === "number" ? Number(ev.target.value) : ev.target.value);
  };

  return (
    <div className="editor-field">
      <label>{label}</label>

      {type === "textarea" ? (
        <textarea value={value ?? ""} onChange={handle} rows={4} />
      ) : (
        <input
          type={
            ["text", "url", "email", "color", "number"].includes(type)
              ? type
              : "text"
          }
          value={value ?? ""}
          onChange={handle}
        />
      )}
    </div>
  );
}
