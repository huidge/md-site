# md-site

一个极简的静态站点，用于展示 Markdown 内容，支持侧边栏展开/收起。

## 功能特性

- 零构建步骤 — 把 `.md` 文件丢进 `content/` 目录即可使用
- 侧边栏可折叠 — 平滑动画，`Ctrl+B` 快捷键切换，状态自动记忆
- GitHub 风格排版 — 代码块、表格、引用块均有美化样式
- 响应式布局 — 自动适配移动端和桌面端
- 可选静态构建 — 生成纯 HTML，无需客户端 JS

## 快速启动

```bash
# 本地开发服务器
cd md-site
python3 -m http.server 8080

# 或使用 Node
npx serve .
```

浏览器打开 http://localhost:8080

## 项目结构

```
md-site/
├── index.html              # 入口页面
├── build.py                # 可选的静态构建脚本
├── README.md               # English
├── README_zh-CN.md         # 中文文档
├── assets/
│   ├── style.css           # 主题样式（CSS 变量，方便自定义）
│   └── app.js              # Markdown 加载 + 侧边栏逻辑
├── content/
│   ├── manifest.json        # 侧边栏页面列表
│   ├── hello.md             # 演示页面
│   └── guide.md             # 使用指南
└── dist/                    # 静态构建输出（自动生成）
```

## 添加页面

1. 在 `content/` 目录下创建 `.md` 文件
2. 在 `content/manifest.json` 中添加条目：

```json
[
  { "file": "hello.md", "title": "Hello" },
  { "file": "my-page.md", "title": "我的页面" }
]
```

3. 刷新浏览器，新页面会出现在侧边栏

如果缺少 `manifest.json`，系统会自动发现常见文件名（`hello.md`、`index.md`、`readme.md` 等）。

## 静态构建

生成独立的 HTML 页面（运行时不需要 JS）：

```bash
pip install markdown
python3 build.py
```

输出到 `dist/` 目录，可作为静态文件直接部署。

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

## 部署

这是一个纯静态站点，可以部署到任何静态托管服务：

- **GitHub Pages** — 推送到 `gh-pages` 分支或在仓库设置中启用
- **Netlify / Vercel** — 连接仓库，发布目录设为 `.`
- **任意 Web 服务器** — 将文件复制到网站根目录

## License

MIT
