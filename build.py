#!/usr/bin/env python3
"""
Optional static build — converts all .md files into standalone HTML pages.
Use this for deployment where you want no client-side JS.

Usage: python3 build.py
Output: dist/
"""

import json, os, pathlib, markdown

ROOT = pathlib.Path(__file__).parent
DIST = ROOT / "dist"
CONTENT = ROOT / "content"
STYLE = (ROOT / "assets" / "style.css").read_text()

TEMPLATE = """\
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<style>{style}</style>
</head>
<body>
<nav class="sidebar"><h2>Pages</h2><ul>{nav}</ul></nav>
<main class="md-content">{body}</main>
</body>
</html>"""

def build():
    # load manifest
    manifest_path = CONTENT / "manifest.json"
    if manifest_path.exists():
        pages = json.loads(manifest_path.read_text())
    else:
        pages = [{"file": f.name, "title": f.stem.capitalize()}
                 for f in sorted(CONTENT.glob("*.md"))]

    DIST.mkdir(exist_ok=True)

    # build nav HTML
    def nav_html(active_file):
        items = []
        for p in pages:
            cls = ' class="active"' if p["file"] == active_file else ""
            items.append(f'<li><a href="{p["file"].replace(".md",".html")}"{cls}>{p["title"]}</a></li>')
        return "\n".join(items)

    md = markdown.Markdown(extensions=["tables", "fenced_code"])

    for p in pages:
        md_src = (CONTENT / p["file"]).read_text()
        body = md.convert(md_src)
        md.reset()
        html = TEMPLATE.format(
            title=p["title"],
            style=STYLE,
            nav=nav_html(p["file"]),
            body=body,
        )
        out_file = DIST / p["file"].replace(".md", ".html")
        out_file.write_text(html)
        print(f"  built {out_file.relative_to(ROOT)}")

    print(f"\nDone! {len(pages)} pages -> {DIST}/")

if __name__ == "__main__":
    build()
