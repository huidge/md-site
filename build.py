#!/usr/bin/env python3
"""
Static build — converts all .md files into standalone HTML pages.
Supports grouped manifest: [{group, pages: [{file, title}]}] or flat [{file, title}].

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


def load_manifest():
    manifest_path = CONTENT / "manifest.json"
    if manifest_path.exists():
        data = json.loads(manifest_path.read_text())
        # detect grouped format
        if data and isinstance(data[0], dict) and "group" in data[0]:
            return data
        # flat format -> wrap
        return [{"group": "Pages", "pages": data}]
    # fallback: auto-discover
    found = [{"file": f.name, "title": f.stem.capitalize()}
             for f in sorted(CONTENT.glob("**/*.md")) if f.name not in ("hello.md", "guide.md")]
    return [{"group": "Reports", "pages": found}] if found else []


def flat_pages(groups):
    result = []
    for g in groups:
        result.extend(g["pages"])
    return result


def build():
    groups = load_manifest()
    pages = flat_pages(groups)
    if not pages:
        print("No pages found.")
        return

    # clean dist
    import shutil
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir(exist_ok=True)

    # build nav HTML (grouped)
    def nav_html(active_file):
        items = []
        for g in groups:
            items.append(f'<li class="sidebar-group"><span class="sidebar-group-label">{g["group"]}</span>')
            items.append('<ul class="sidebar-group-items">')
            for p in g["pages"]:
                href = p["file"].replace(".md", ".html")
                # handle subdirectory paths: daily/2026-04-15.md -> daily/2026-04-15.html
                cls = ' class="active"' if p["file"] == active_file else ""
                items.append(f'<li><a href="{href}"{cls}>{p["title"]}</a></li>')
            items.append('</ul></li>')
        return "\n".join(items)

    md = markdown.Markdown(extensions=["tables", "fenced_code"])

    for p in pages:
        src = CONTENT / p["file"]
        if not src.exists():
            print(f"  skip (not found): {p['file']}")
            continue
        md_src = src.read_text()
        body = md.convert(md_src)
        md.reset()
        html = TEMPLATE.format(
            title=p["title"],
            style=STYLE,
            nav=nav_html(p["file"]),
            body=body,
        )
        out = DIST / p["file"].replace(".md", ".html")
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(html)
        print(f"  built {out.relative_to(ROOT)}")

    print(f"\nDone! {len(pages)} pages -> {DIST}/")


if __name__ == "__main__":
    build()
