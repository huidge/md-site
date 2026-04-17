# md-site

一个极简的静态站点，用于展示 Markdown 内容，支持侧边栏分组和展开/收起。

## 在线预览

**https://huidge.github.io/md-site/**

## 功能特性

- 首页聚合展示 — 分组卡片式入口，点击进入各报告
- 侧边栏分组导航 — 按目录自动分组，可折叠，`Ctrl+B` 快捷键切换
- GitHub 风格排版 — 代码块、表格、引用块均有美化样式
- 响应式布局 — 自动适配移动端和桌面端
- 一键同步 — 从源目录拉取 Markdown，构建并部署
- GitHub Pages — 每次 push 自动部署

## 快速启动

```bash
cd md-site
python3 -m http.server 8080
```

浏览器打开 http://localhost:8080

## 自动同步

从 `market-reports/` 同步 Markdown 文件，构建并推送到 GitHub：

```bash
bash sync-reports.sh
```

执行流程：
1. 从配置的源目录复制 `.md` 文件到 `content/`
2. 自动生成分组 `manifest.json`
3. 执行 `build.py`，生成静态 HTML 到 `docs/`（含首页 `index.html`）
4. 提交并推送（GitHub Pages 自动部署）

同步目录（可在 `sync-reports.sh` 中配置）：
- `daily/` — A 股日报
- `us-stock/daily/` — 美股日报
- `weekly/` — 周报

## 项目结构

```
md-site/
├── index.html              # 开发入口（SPA 模式）
├── sync-reports.sh         # 一键同步 + 构建 + 部署
├── build.py                # 静态 HTML 生成器
├── README.md               # English
├── README_zh-CN.md         # 中文文档
├── assets/
│   ├── style.css           # 主题样式（CSS 变量）
│   └── app.js              # Markdown 加载 + 分组侧边栏
├── content/
│   ├── manifest.json        # 侧边栏配置（自动生成）
│   ├── daily/
│   ├── us-stock/daily/
│   └── weekly/
└── docs/                    # 静态构建输出（GitHub Pages 部署源）
    ├── index.html           # 首页入口
    ├── daily/
    ├── us-stock/daily/
    └── weekly/
```

## 自定义样式

编辑 `assets/style.css` 中的 CSS 变量：

```css
:root {
  --sidebar-width: 260px;   /* 侧边栏宽度 */
  --sidebar-gap: 100px;     /* 侧边栏与内容区的间距 */
  --accent: #0969da;        /* 链接和高亮颜色 */
  --bg-sidebar: #f8f9fb;    /* 侧边栏背景色 */
  --radius: 8px;            /* 圆角大小 */
}
```

## License

MIT
