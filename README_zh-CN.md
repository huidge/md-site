# md-site

一个极简的静态站点，用于展示 Markdown 内容，支持侧边栏分组和展开/收起。

## 在线预览

**https://huidge.github.io/md-site/**

## 功能特性

- 零构建步骤 — 把 `.md` 文件丢进 `content/` 目录即可使用
- 侧边栏分组导航 — 按目录自动分组，可折叠，`Ctrl+B` 快捷键切换
- GitHub 风格排版 — 代码块、表格、引用块均有美化样式
- 响应式布局 — 自动适配移动端和桌面端
- 一键同步 — 从源目录拉取 Markdown，构建并推送到 GitHub
- GitHub Pages — 自动从 `docs/` 目录部署

## 快速启动

```bash
# 本地开发服务器
cd md-site
python3 -m http.server 8080
```

浏览器打开 http://localhost:8080

## 自动同步

从 `market-reports/` 同步 Markdown 文件，构建静态站点，推送到 GitHub：

```bash
bash sync-reports.sh
```

脚本执行流程：
1. 从配置的源目录复制 `.md` 文件到 `content/`
2. 自动生成分组 `manifest.json`，用于侧边栏导航
3. 执行 `build.py`，生成静态 HTML 到 `docs/`
4. 提交并推送到 GitHub（通过 GitHub Pages 自动部署）

同步的目录（可在脚本中配置）：
- `daily/` — A 股日报
- `us-stock/daily/` — 美股日报
- `weekly/` — 周报

## 项目结构

```
md-site/
├── index.html              # 开发入口（客户端渲染）
├── sync-reports.sh         # 自动同步 + 构建 + 部署脚本
├── build.py                # 静态 HTML 生成器
├── README.md               # English
├── README_zh-CN.md         # 中文文档
├── assets/
│   ├── style.css           # 主题样式（CSS 变量，方便自定义）
│   └── app.js              # Markdown 加载 + 分组侧边栏
├── content/
│   ├── manifest.json        # 侧边栏配置（自动生成）
│   └── {同步的 .md 文件}
├── docs/                    # 静态构建输出（GitHub Pages 部署源）
└── content/
    ├── daily/               # 同步的报告
    ├── us-stock/daily/
    └── weekly/
```

## 手动添加页面

1. 在 `content/` 目录下创建 `.md` 文件
2. 在 `content/manifest.json` 中添加条目：

```json
[
  {
    "group": "我的分组",
    "pages": [
      { "file": "my-page.md", "title": "我的页面" }
    ]
  }
]
```

3. 刷新浏览器，新页面会出现在侧边栏

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

每次 push 自动通过 GitHub Pages 从 `docs/` 目署。

手动部署：将 `docs/` 目录复制到任意静态托管服务即可。

## License

MIT
