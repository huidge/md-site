# md-site

A minimal static site for displaying Markdown content with a collapsible sidebar.

> [中文文档](README_zh-CN.md)

## Live Demo

**https://huidge.github.io/md-site/**

## Features

- Zero build step — drop `.md` files into `content/` and go
- Collapsible sidebar with grouped navigation and smooth animation (`Ctrl+B` to toggle)
- GitHub-flavored styling — code blocks, tables, blockquotes
- Responsive layout — adapts to mobile and desktop
- Auto sync — pull markdown from source directory, build, and push to GitHub in one command
- GitHub Pages — auto-deployed from `docs/` directory

## Quick Start

```bash
# local dev server
cd md-site
python3 -m http.server 8080
```

Open http://localhost:8080

## Auto Sync

Sync markdown files from `market-reports/`, build static site, and push to GitHub:

```bash
bash sync-reports.sh
```

This will:
1. Copy `.md` files from configured source directories into `content/`
2. Generate grouped `manifest.json` for sidebar navigation
3. Run `build.py` to generate static HTML into `docs/`
4. Commit and push to GitHub (auto-deploys via GitHub Pages)

## Project Structure

```
md-site/
├── index.html              # dev entry point (client-side rendering)
├── sync-reports.sh         # auto sync + build + deploy script
├── build.py                # static HTML generator
├── README.md               # English
├── README_zh-CN.md         # 中文文档
├── assets/
│   ├── style.css           # theme (CSS variables for customization)
│   └── app.js              # markdown loader + grouped sidebar
├── content/
│   ├── manifest.json        # sidebar config (auto-generated)
│   └── {synced .md files}
├── docs/                    # static build output (GitHub Pages source)
└── content/
    ├── daily/               # synced reports
    ├── us-stock/daily/
    └── weekly/
```

## Adding Pages Manually

1. Create a `.md` file in `content/`
2. Add it to `content/manifest.json`:

```json
[
  {
    "group": "My Section",
    "pages": [
      { "file": "my-page.md", "title": "My Page" }
    ]
  }
]
```

3. Refresh — your page appears in the sidebar.

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

Auto-deployed via GitHub Pages from `docs/` on every push.

Manual deploy: copy `docs/` to any static host.

## License

MIT
