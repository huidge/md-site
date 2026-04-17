#!/usr/bin/env bash
# sync-reports.sh — Sync markdown from market-reports to md-site, build, and push to GitHub.
set -euo pipefail

MARKET_DIR="/Users/huidge/market-reports"
SITE_DIR="/Users/huidge/md-site"
CONTENT_DIR="$SITE_DIR/content"

echo "=== Sync reports to md-site ==="

# 1. Copy .md files, maintaining directory structure
cd "$MARKET_DIR"
find . -name "*.md" -type f | while read -r src; do
  dest="$CONTENT_DIR/$src"
  mkdir -p "$(dirname "$dest")"
  # only copy if changed
  if [ ! -f "$dest" ] || ! diff -q "$src" "$dest" >/dev/null 2>&1; then
    cp "$src" "$dest"
    echo "  synced: $src"
  fi
done

# 2. Generate manifest.json — grouped by directory
python3 - "$CONTENT_DIR" "$MARKET_DIR" <<'PYEOF'
import os, sys, json

content_dir = sys.argv[1]
source_dir = sys.argv[2]
groups = {}  # dir_label -> [{file, title}]

for root, dirs, files in sorted(os.walk(content_dir)):
    for f in sorted(files):
        if not f.endswith('.md'):
            continue
        rel = os.path.relpath(os.path.join(root, f), content_dir).replace('\\', '/')
        # skip demo pages — added manually below
        if rel in ('hello.md', 'guide.md'):
            continue
        # determine group label from path
        parts = rel.split('/')
        if len(parts) == 1:
            label = 'Reports'
        else:
            label = ' / '.join(p.replace('-', ' ').title() for p in parts[:-1])
        title = f.replace('.md', '')
        # capitalize nicely — keep dates as-is
        if not title[0].isdigit():
            title = title.replace('-', ' ').title()
        groups.setdefault(label, []).append({'file': rel, 'title': title})

# build manifest with group headers
manifest = [{'group': 'Getting Started', 'pages': [
    {'file': 'hello.md', 'title': 'Hello'},
]}]
for label, items in groups.items():
    manifest.append({'group': label, 'pages': items})

# write grouped manifest
with open(os.path.join(content_dir, 'manifest.json'), 'w') as fp:
    json.dump(manifest, fp, indent=2, ensure_ascii=False)
total = sum(len(g['pages']) for g in manifest)
print(f"  manifest: {total} pages in {len(manifest)} groups")
PYEOF

# 3. Run static build
echo "=== Building static site ==="
cd "$SITE_DIR"
pip install markdown -q 2>/dev/null || true
python3 build.py

# 4. Git commit & push
echo "=== Sync to GitHub ==="
TOKEN=$(grep "^GITHUB_TOKEN=" ~/.hermes/.env | head -1 | cut -d= -f2 | tr -d '\n\r')
git add -A
if git diff --cached --quiet; then
  echo "  nothing to commit"
else
  CHANGED=$(git diff --cached --stat | tail -1)
  git commit -m "sync: update reports $(date +%Y-%m-%d)"
  git push -q
  echo "  pushed: $CHANGED"
fi

echo "=== Done ==="
