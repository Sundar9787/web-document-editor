# backend/app/sections.py
from bs4 import BeautifulSoup
from typing import Dict

def extract_sections_from_html(html: str) -> Dict[str, str]:
    """
    Convert HTML into a mapping of section_title -> html_content.
    Uses <h1> (or first-level headings) as section separators. If none, return single section.
    """
    soup = BeautifulSoup(html, "html.parser")
    # find headings (h1..h3 prefer h1)
    headings = soup.find_all(['h1', 'h2', 'h3', 'h4'])
    if not headings:
        # everything is a single section
        return {"Document": str(soup)}

    sections = {}
    current_title = None
    current_parts = []
    # walk through children preserving order
    for node in soup.children:
        # skip whitespace strings
        if getattr(node, 'name', None) is None:
            continue
        if node.name and node.name.startswith('h'):
            # commit previous
            if current_title is not None:
                sections[current_title] = "".join(str(x) for x in current_parts).strip()
            # start new
            current_title = node.get_text().strip()
            current_parts = []
        else:
            if current_title is None:
                # content before first heading: attach to a default intro
                current_title = "Intro"
            current_parts.append(node)
    # commit last
    if current_title is not None:
        sections[current_title] = "".join(str(x) for x in current_parts).strip()
    return sections


def merge_sections_html(sections: Dict[str, str], order=None):
    """
    Merge sections back into a single HTML string in given order (list of keys),
    or natural order if not provided.
    """
    keys = order or list(sections.keys())
    content = []
    for k in keys:
        content.append(f"<h1>{k}</h1>")
        content.append(sections.get(k, ""))
    return "<html><body>" + "".join(content) + "</body></html>"
