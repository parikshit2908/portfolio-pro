// src/components/EditorRepeater.jsx
import React from "react";
import EditorField from "./EditorField";

/**
 * Repeater Component
 * - items: the array value (from data)
 * - path: base path (e.g. "projects")
 * - schema: config for item fields  (schema.item)
 * - onChange(path, newArray)
 */
export default function EditorRepeater({ items = [], path, onChange, schema = null }) {
  const itemSchema = schema?.item || null; // config for each item

  // Add new item
  const handleAdd = () => {
    let newItem;

    if (itemSchema && typeof itemSchema === "object") {
      // Build object from config defaults
      newItem = {};
      Object.keys(itemSchema).forEach((k) => {
        newItem[k] = itemSchema[k].default ?? "";
      });
    } else {
      // Primitive item
      newItem = "";
    }

    onChange(path, [...items, newItem]);
  };

  // Remove item
  const handleRemove = (idx) => {
    const newArr = items.filter((_, i) => i !== idx);
    onChange(path, newArr);
  };

  // Update single item
  const updateItem = (idx, subKey, value) => {
    const newArr = items.map((it, i) => {
      if (i !== idx) return it;

      // Primitive
      if (!itemSchema || typeof it !== "object") {
        return value;
      }

      // Object field
      return {
        ...it,
        [subKey]: value,
      };
    });

    onChange(path, newArr);
  };

  return (
    <div className="editor-repeater">
      <div className="repeater-header">
        <strong style={{ textTransform: "capitalize" }}>
          {path.replace(/^.*\./, "")}
        </strong>
        <button onClick={handleAdd}>Add</button>
      </div>

      {items.length === 0 && (
        <div style={{ color: "#666" }}>No items yet</div>
      )}

      {items.map((item, idx) => (
        <div key={idx} className="repeater-item">
          <div className="repeater-item-header">
            <small>Item {idx + 1}</small>
            <button onClick={() => handleRemove(idx)}>Remove</button>
          </div>

          {/* CASE 1: primitive array items */}
          {!itemSchema || typeof item !== "object" ? (
            <EditorField
              label={`${path.split(".").pop()} ${idx + 1}`}
              path={`${path}.${idx}`}
              value={item}
              onChange={(p, v) => updateItem(idx, null, v)}
            />
          ) : (
            // CASE 2: object items – render fields from schema.item
            Object.keys(itemSchema).map((fieldKey) => (
              <EditorField
                key={fieldKey}
                label={itemSchema[fieldKey].label || fieldKey}
                path={`${path}.${idx}.${fieldKey}`}
                value={item[fieldKey] ?? itemSchema[fieldKey].default ?? ""}
                type={itemSchema[fieldKey].type || "text"}
                onChange={(p, v) => updateItem(idx, fieldKey, v)}
              />
            ))
          )}
        </div>
      ))}
    </div>
  );
}
