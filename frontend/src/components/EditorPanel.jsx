// frontend/src/components/EditorPanel.jsx
import React, { useEffect, useRef } from "react";

export default function EditorPanel({ html, onUpdate }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = html || "<p></p>";
    }
  }, [html]);

  function handleBlur() {
    if (ref.current) {
      const newHtml = ref.current.innerHTML;
      onUpdate(newHtml);
    }
  }

  return (
    <div style={{ padding: 16, flex: 1, overflowY: "auto" }}>
      <div
        ref={ref}
        contentEditable
        onBlur={handleBlur}
        style={{
          minHeight: 400,
          background: "#fff",
          borderRadius: 6,
          padding: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      />
    </div>
  );
}
