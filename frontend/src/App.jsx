// frontend/src/App.jsx
import React, { useState } from "react";
import { uploadFile, exportJSON, exportDOCX, exportPDF } from "./api";
import SectionSidebar from "./components/SectionSidebar";
import EditorPanel from "./components/EditorPanel";

function downloadJSON(obj, filename = "export.json") {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [sections, setSections] = useState({});
  const [selected, setSelected] = useState(null);

  // NEW: Merge popup states
  const [mergePopup, setMergePopup] = useState(false);
  const [mergeSelection, setMergeSelection] = useState([]);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const data = await uploadFile(file);
    const extractedSections = data.sections || {};

    setSections(extractedSections);
    const first = Object.keys(extractedSections)[0];
    setSelected(first);
  }

  function handleUpdate(html) {
    setSections((prev) => ({ ...prev, [selected]: html }));
  }

  function handleRename(key) {
    const newName = prompt("New section title", key);
    if (!newName) return;
    setSections((prev) => {
      const obj = { ...prev };
      const value = obj[key];
      delete obj[key];
      obj[newName] = value;
      return obj;
    });
    if (selected === key) setSelected(newName);
  }

  function handleDelete(key) {
    if (!window.confirm("Delete section?")) return;
    setSections((prev) => {
      const o = { ...prev };
      delete o[key];
      return o;
    });
    if (selected === key) setSelected(Object.keys(sections)[0] || null);
  }

  // 🔵 NEW: open merge popup
  function handleMerge() {
    setMergeSelection([]);
    setMergePopup(true);
  }

  // 🔵 NEW: perform merge
  function doMerge() {
    if (mergeSelection.length < 2) {
      alert("Select at least 2 sections to merge.");
      return;
    }

    const combined = mergeSelection.map(k => sections[k] || "").join("<hr/>");

    const newObj = {};
    Object.keys(sections).forEach(k => {
      if (!mergeSelection.includes(k)) newObj[k] = sections[k];
    });

    const mergedTitle = prompt(
      "Title for merged section",
      mergeSelection.join(" + ")
    );

    newObj[mergedTitle || "Merged"] = combined;

    setSections(newObj);
    setSelected(mergedTitle || "Merged");
    setMergePopup(false);
  }

  async function handleExport() {
    const res = await exportJSON(sections);
    downloadJSON(res, "exported_sections.json");
  }

  async function handleExportDOCX() {
    await exportDOCX(sections);
  }

  async function handleExportPDF() {
    await exportPDF(sections);
  }

  function handleReorder(newOrder) {
    const newObj = {};
    newOrder.forEach((k) => {
      if (sections[k]) newObj[k] = sections[k];
    });
    setSections(newObj);
  }

  return (
    <>
      {/* 🔵 MERGE POPUP */}
      {mergePopup && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 999
          }}
        >
          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 8,
              width: 300
            }}
          >
            <h3>Select sections to merge</h3>

            {Object.keys(sections).map((key) => (
              <label key={key} style={{ display: "block", marginBottom: 8 }}>
                <input
                  type="checkbox"
                  checked={mergeSelection.includes(key)}
                  onChange={() => {
                    setMergeSelection(prev =>
                      prev.includes(key)
                        ? prev.filter(x => x !== key)
                        : [...prev, key]
                    );
                  }}
                />
                {" "}
                {key}
              </label>
            ))}

            <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
              <button onClick={doMerge}>Merge Now</button>
              <button onClick={() => setMergePopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN UI */}
      <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
        <SectionSidebar
          sections={sections}
          onSelect={setSelected}
          selectedKey={selected}
          onRename={handleRename}
          onMerge={handleMerge}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />

        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div
            style={{
              padding: 12,
              borderBottom: "1px solid #ddd",
              display: "flex",
              gap: 12,
            }}
          >
            <input type="file" onChange={handleUpload} />
            <button onClick={handleExport}>Export JSON</button>
            <button onClick={handleExportDOCX}>Export DOCX</button>
            <button onClick={handleExportPDF}>Export PDF</button>
            <div style={{ flex: 1 }} />
            <div>Selected: {selected}</div>
          </div>

          <EditorPanel html={sections[selected] || "<p></p>"} onUpdate={handleUpdate} />
        </div>
      </div>
    </>
  );
}
