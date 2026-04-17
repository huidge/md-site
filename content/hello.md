# Welcome to md-site

A minimal static site for displaying Markdown content.

## Features

- **Zero build step** — just drop `.md` files into `content/`
- **Clean typography** — GitHub-flavored styling
- **Sidebar navigation** — auto-generated from manifest
- **Responsive** — works on mobile and desktop

## Quick Start

```bash
# serve locally
cd ~/md-site
python3 -m http.server 8080

# or with Node
npx serve .
```

Then open http://localhost:8080

## Markdown Demo

Here's what you can do:

### Text Formatting

This is **bold**, this is *italic*, and this is `inline code`.

> Blockquotes work great for callouts and important notes.

### Lists

- Item one
- Item two
  - Nested item
  - Another nested
- Item three

1. First step
2. Second step
3. Third step

### Table

| Name    | Role        | Status |
|---------|-------------|--------|
| Alice   | Developer   | Active |
| Bob     | Designer    | Active |
| Charlie | PM          | Away   |

### Code Block

```python
def greet(name: str) -> str:
    return f"Hello, {name}! 🎉"
```

---

Made with simplicity in mind.
