# backend/app/parsers.py
from docx import Document as DocxDocument
import fitz  # PyMuPDF
from bs4 import BeautifulSoup
import io

def parse_docx_to_html(blob: bytes) -> str:
    """
    Convert docx bytes to a simple HTML string preserving headings and paragraphs.
    """
    f = io.BytesIO(blob)
    doc = DocxDocument(f)
    parts = []
    for para in doc.paragraphs:
        style = para.style.name.lower() if para.style and para.style.name else ""
        text = para.text.strip()
        if not text:
            continue
        # detect heading style names like "heading 1", "heading 2"
        if "heading" in style:
            # determine level from style name if possible
            level = 1
            try:
                # extract numeric level if present
                import re
                m = re.search(r'\d+', style)
                if m:
                    level = int(m.group(0))
            except Exception:
                level = 1
            parts.append(f"<h{level}>{BeautifulSoup(text, 'html.parser').get_text()}</h{level}>")
        else:
            parts.append(f"<p>{BeautifulSoup(text, 'html.parser').get_text()}</p>")
    return "\n".join(parts)


def parse_pdf_to_html(blob: bytes) -> str:
    """
    Extract text from PDF (PyMuPDF) and return paragraphs inside <p>.
    This is not perfect for complex layout, but works for most text PDFs.
    """
    doc = fitz.open(stream=blob, filetype="pdf")
    parts = []
    for page in doc:
        text = page.get_text("text").strip()
        if not text:
            continue
        # split into paragraphs by double newline or single newlines
        for p in text.split("\n\n"):
            p = p.strip()
            if p:
                # replace single newlines with spaces
                p = " ".join(p.splitlines())
                parts.append(f"<p>{BeautifulSoup(p, 'html.parser').get_text()}</p>")
    return "\n".join(parts)
