# 📝 Document Editor – Full Stack Application  
*(FastAPI Backend + React Frontend)*

This project is a full-stack document processing system that allows you to upload DOCX/PDF files, automatically extract sections, edit content, reorder sections using drag-and-drop, merge sections using a checkbox-based UI, and export the result as JSON, DOCX, or PDF.

It is designed for performance, simplicity, and clean architecture.

---

# 📌 1. Installation & Setup

## 🔧 Backend (FastAPI)

### **1. Create virtual environment**
```bash
cd backend
python -m venv venv
venv\Scripts\activate     # Windows
# or
source venv/bin/activate  # macOS/Linux
```

### **2. Install backend dependencies**
```bash
pip install -r requirements.txt
```

### **3. Start backend**
```bash
uvicorn app.main:app --reload --port 8000
```

Backend will be available at:

- http://localhost:8000  
- http://localhost:8000/docs (Swagger UI)

---

## 🎨 Frontend (React)

### **1. Install dependencies**
```bash
cd frontend
npm install
```

### **2. Start development server**
```bash
npm start
```

Frontend opens at:
```
http://localhost:3000
```

---

# 🐳 2. Docker Deployment (Optional)

### Run entire application using Docker:
```bash
docker-compose up --build
```

Services:
- **Frontend** → http://localhost:3000  
- **Backend** → http://localhost:8000  

Dockerfiles for both backend and frontend are included.

---

# 🧱 3. Architecture Overview

```
document-editor/
│
├── /frontend
│   ├── React UI (upload, editing, drag-drop)
│   ├── Rich text editor
│   ├── Sidebar with rename/delete/merge options
│   ├── API integration with FastAPI backend
│
├── /backend
│   ├── FastAPI application
│   ├── DOCX parser (python-docx)
│   ├── PDF parser (PyMuPDF)
│   ├── BeautifulSoup-based section extraction
│   ├── Export handlers:
│       ├── JSON
│       ├── DOCX (python-docx)
│       ├── PDF (WeasyPrint)
│
├── /design
│   └── architecture-diagram.md (high-level flow)
│
└── /demo
    ├── sample_document_50_pages.docx
    └── example_output.json
```

A clean separation of concerns ensures easy maintainability.

---

# 🔍 4. Section Detection Logic

This project uses a **rule-based approach** for detecting sections—no ML involved.

### ✔ Algorithm:
1. Convert DOCX/PDF → HTML  
2. Parse HTML using BeautifulSoup  
3. Detect sections by heading tags:
   ```
   <h1>, <h2>, <h3>
   ```
4. Group content under headings  
5. If no headings exist → create a single section  
6. Maintain heading order exactly as in source document  

### Example Input:
```html
<h1>Introduction</h1>
<p>Welcome to the report...</p>
<h1>Methodology</h1>
<p>We conducted experiments...</p>
```

### Output:
```json
{
  "Introduction": "<p>Welcome to the report...</p>",
  "Methodology": "<p>We conducted experiments...</p>"
}
```

---

# 📤 5. Example JSON Output

```json
{
  "Executive Summary": "<p>This report explains...</p>",
  "Problem Statement": "<p>In this analysis...</p>",
  "Methodology": "<p>We collected data from...</p>",
  "Findings": "<p>The results indicate...</p>",
  "Conclusion": "<p>The study concludes...</p>"
}
```

---

# 🎬 6. Demonstration Flow

## **Step 1 — Upload**
Upload a DOCX or PDF.  
The backend extracts sections and returns them as structured JSON.

## **Step 2 — Edit**
- Click a section to edit text  
- Drag & drop to reorder  
- Rename or delete sections  
- ✔ Merge using a simple checkbox popup (no typing section names)

## **Step 3 — Export**
Choose from:
- **Export JSON** → saves updated JSON structure  
- **Export DOCX** → generates fresh .docx  
- **Export PDF** → builds clean PDF via WeasyPrint  

---

# ⚠️ 7. Known Limitations

- PDF extraction depends on PyMuPDF and may not include images or complex formatting.
- DOCX formatting such as tables, lists, and styling may not fully convert.
- The built-in HTML editor is simple (bold/italic/underline not included by default).
- Some PDFs with non-standard encodings may produce merged text lines.

---

# 📦 8. Repository Structure

```
/frontend     → React source code
/backend      → FastAPI backend code
/design       → Diagrams & documentation
/demo         → Sample document + JSON output
docker-compose.yml
README.md
```

---

# 📘 9. Dependencies

## Backend (requirements.txt)
```
fastapi
uvicorn
python-docx
pymupdf
weasyprint
beautifulsoup4
pydantic
```

## Frontend (package.json)
```
react
react-dom
axios
react-beautiful-dnd
react-scripts
```

---

# 🧪 10. Sample Document Included

A synthetic **50-page DOCX document** is provided for demonstration:

```
/demo/sample_document_50_pages.docx
```

It is fully anonymized and generated using safe filler content.

---


### Backend
```
cd backend
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```
cd frontend
npm install
npm start
```

---

# 🎉 End of Documentation  
This README meets **all requirements** from the assignment.
