# Usage Guide

How to use md-site to document anything.

## Adding Pages

1. Create a `.md` file in `content/`
2. Add an entry to `content/manifest.json`:

```json
[
  { "file": "hello.md", "title": "Hello" },
  { "file": "my-page.md", "title": "My Page" }
]
```

3. Refresh the browser — your page appears in the sidebar.

## Editing Content

Just edit the `.md` file with any text editor. Changes appear on refresh.

## Deploying

This is a static site — deploy anywhere:

- **GitHub Pages** — push to `gh-pages` branch
- **Netlify / Vercel** — connect repo, set publish dir to `.` 
- **Any web server** — copy the files to your document root

## Customization

### Styling

Edit `assets/style.css` to change colors, fonts, or layout. CSS variables at the top make it easy:

```css
:root {
  --accent: #0969da;      /* links and highlights */
  --bg-sidebar: #f6f8fa;  /* sidebar background */
  --radius: 8px;          /* border radius */
}
```

### Auto-discovery

If you skip `manifest.json`, the app tries to find files named `hello.md`, `index.md`, `readme.md`, `about.md`, and `guide.md` automatically.
