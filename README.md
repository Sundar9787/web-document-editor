# OpenDoc Editor — Assignment

## Overview
Open-source web app to upload DOCX/PDF, edit while preserving formatting, auto-detect sections, and export section-wise JSON with HTML and base64 images.

## Tech stack
- Frontend: React + Tiptap
- Backend: FastAPI (Python)
- DOCX -> HTML: mammoth
- PDF extraction: PyMuPDF (fitz)

## Run locally (dev)
### Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

### Frontend
cd frontend
npm install
npm start

Open http://localhost:3000

## Demo flow
1. Upload DOCX or PDF via file input.
2. Sidebar populates detected sections.
3. Click a section to edit in the right panel.
4. Rename/reorder/merge sections from sidebar controls.
5. Click "Export JSON" to download `exported_sections.json`

## Example JSON
```json
{
  "1. Introduction": "<p>Intro text...</p>",
  "1.1 Background": "<p>Background text...</p>",
  "2. Methodology": "<p>...<table>...</table></p>"
}
