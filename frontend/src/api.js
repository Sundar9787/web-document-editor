// frontend/src/api.js
import axios from "axios";
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";

export async function uploadFile(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await axios.post(`${API_BASE}/upload`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000,
  });
  return res.data;
}

export async function exportJSON(sections) {
  const res = await axios.post(`${API_BASE}/export_json`, { sections }, { timeout: 120000 });
  return res.data;
}

export async function exportDOCX(sections) {
  const res = await fetch(`${API_BASE}/export_docx`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sections }),
  });
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "edited_document.docx";
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportPDF(sections) {
  const res = await fetch(`${API_BASE}/export_pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sections }),
  });
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "edited_document.pdf";
  a.click();
  URL.revokeObjectURL(url);
}
