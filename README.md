# md-site

A minimal static site for displaying Markdown content with a collapsible sidebar.

> [中文文档](README_zh-CN.md)

## Live Demo

**https://huidge.github.io/md-site/**

## Features

- Landing page with grouped card links to all reports
- Collapsible sidebar with grouped navigation (`Ctrl+B` to toggle)
- GitHub-flavored styling — code blocks, tables, blockquotes
- Responsive layout — adapts to mobile and desktop
- Auto sync — pull markdown from source, build, and deploy in one command
- GitHub Pages — auto-deployed from `docs/` on every push

## Quick Start

```bash
cd md-site
python3 -m http.server 8080
```

Open http://localhost:8080

## Auto Sync

Sync markdown from `market-reports/`, build, and push:

```bash
bash sync-reports.sh
```

Steps:
1. Copy `.md` from configured source dirs into `content/`
2. Generate grouped `manifest.json`
3. Run `build.py` — outputs static HTML to `docs/` (including `index.html`)
4. Commit and push (GitHub Pages auto-deploys)

Synced directories (configurable in `sync-reports.sh`):
- `daily/` — A-share daily reports
- `us-stock/daily/` — US stock daily reports
- `weekly/` — weekly reports

## Project Structure

```
md-site/
├── index.html              # dev entry point (SPA mode)
├── sync-reports.sh         # one-click sync + build + deploy
├── build.py                # static HTML generator
├── README.md               # English
├── README_zh-CN.md         # 中文文档
├── assets/
│   ├── style.css           # theme (CSS variables)
│   └── app.js              # markdown loader + grouped sidebar
├── content/
│   ├── manifest.json        # sidebar config (auto-generated)
│   ├── daily/
│   ├── us-stock/daily/
│   └── weekly/
└── docs/                    # static build output (GitHub Pages)
    ├── index.html           # landing page
    ├── daily/
    ├── us-stock/daily/
    └── weekly/
```

## Customization

Edit CSS variables in `assets/style.css`:

```css
:root {
  --sidebar-width: 260px;
  --sidebar-gap: 100px;
  --accent: #0969da;
  --bg-sidebar: #f8f9fb;
  --radius: 8px;
}
```

## License

MIT
