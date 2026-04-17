# md-site

A minimal static site for displaying Markdown content with a collapsible sidebar.

> [中文文档](README_zh-CN.md)

## Features

- Zero build step — drop `.md` files into `content/` and go
- Collapsible sidebar with smooth animation (`Ctrl+B` to toggle, state persisted)
- GitHub-flavored styling — code blocks, tables, blockquotes
- Responsive layout — adapts to mobile and desktop
- Optional static build — generate pure HTML without client-side JS

## Quick Start

```bash
# local dev server
cd md-site
python3 -m http.server 8080

# or with Node
npx serve .
```

Open http://localhost:8080

## Project Structure

```
md-site/
├── index.html              # entry point
├── build.py                # optional static build script
├── assets/
│   ├── style.css           # theme (CSS variables for easy customization)
│   └── app.js              # markdown loader + sidebar logic
├── content/
│   ├── manifest.json        # sidebar page list
│   ├── hello.md             # demo page
│   └── guide.md             # usage guide
└── dist/                    # static build output (generated)
```

## Adding Pages

1. Create a `.md` file in `content/`
2. Add an entry to `content/manifest.json`:

```json
[
  { "file": "hello.md", "title": "Hello" },
  { "file": "my-page.md", "title": "My Page" }
]
```

3. Refresh — your page appears in the sidebar.

If `manifest.json` is missing, the app auto-discovers common filenames (`hello.md`, `index.md`, `readme.md`, etc.).

## Static Build

Generate standalone HTML pages (no JS required at runtime):

```bash
pip install markdown
python3 build.py
```

Output goes to `dist/` — deploy anywhere as static files.

## Customization

Edit CSS variables in `assets/style.css`:

```css
:root {
  --sidebar-width: 260px;   /* sidebar width */
  --sidebar-gap: 100px;     /* gap between sidebar and content */
  --accent: #0969da;        /* link and highlight color */
  --bg-sidebar: #f8f9fb;    /* sidebar background */
  --radius: 8px;            /* border radius */
}
```

## Deploy

This is a static site — deploy to any static host:

- **GitHub Pages** — push to `gh-pages` or enable in repo settings
- **Netlify / Vercel** — connect repo, set publish directory to `.`
- **Any web server** — copy files to document root

## License

MIT
