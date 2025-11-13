# backend/app/utils.py
# small helper helpers if needed. For now empty.
# backend/app/utils.py
from bs4 import BeautifulSoup

def strip_html(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    # optionally keep limited tags if you want
    return soup.get_text(separator=" ", strip=True)
