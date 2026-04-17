# Welcome to md-site

A minimal static site for displaying Markdown content.

## Features

- **Zero build step** — just drop `.md` files into `content/`
- **Collapsible sidebar** — grouped navigation with animation
- **Clean typography** — GitHub-flavored styling
- **Static build** — generate pure HTML with `python3 build.py`

## Quick Start

```bash
# serve locally
cd ~/md-site
python3 -m http.server 8080

# or with Node
npx serve .
```

## Sync Reports

```bash
# auto-sync from market-reports, build, and push to GitHub
bash sync-reports.sh
```

---

Made with simplicity in mind.
