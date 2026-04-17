// md-site app — loads .md files from content/ and renders with marked.js
(function () {
  'use strict';

  const CONTENT_DIR = 'content';
  const sidebar = document.getElementById('sidebar');
  const sidebarList = document.getElementById('sidebar-list');
  const sidebarFooter = document.getElementById('sidebar-footer');
  const container = document.getElementById('md-content');
  const toggleBtn = document.getElementById('sidebar-toggle');
  const toggleFloat = document.getElementById('sidebar-toggle-floating');

  // --- Sidebar collapse/expand ---
  function initSidebarToggle() {
    // restore state
    if (localStorage.getItem('sidebar-collapsed') === '1') {
      sidebar.classList.add('collapsed');
    }

    toggleBtn.addEventListener('click', () => {
      sidebar.classList.add('collapsed');
      localStorage.setItem('sidebar-collapsed', '1');
    });

    toggleFloat.addEventListener('click', () => {
      sidebar.classList.remove('collapsed');
      localStorage.setItem('sidebar-collapsed', '0');
    });

    // keyboard shortcut: Ctrl+B to toggle
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        const collapsed = sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebar-collapsed', collapsed ? '1' : '0');
      }
    });
  }

  // --- Parse manifest or auto-discover ---
  async function getPages() {
    try {
      const res = await fetch(`${CONTENT_DIR}/manifest.json`);
      if (res.ok) return await res.json();
    } catch (_) {}
    const candidates = ['hello', 'index', 'readme', 'about', 'guide'];
    const found = [];
    for (const name of candidates) {
      try {
        const r = await fetch(`${CONTENT_DIR}/${name}.md`, { method: 'HEAD' });
        if (r.ok) found.push({ file: `${name}.md`, title: capitalize(name) });
      } catch (_) {}
    }
    return found;
  }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // --- Render sidebar ---
  function renderSidebar(pages, activeFile) {
    sidebarList.innerHTML = '';
    pages.forEach(p => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = p.title;
      a.href = `#${p.file}`;
      if (p.file === activeFile) a.classList.add('active');
      a.addEventListener('click', e => {
        e.preventDefault();
        loadPage(p.file, pages);
      });
      li.appendChild(a);
      sidebarList.appendChild(li);
    });
    sidebarFooter.textContent = `${pages.length} page${pages.length !== 1 ? 's' : ''}`;
  }

  // --- Load & render markdown ---
  async function loadPage(file, pages) {
    container.innerHTML = '<p class="loading">Loading...</p>';
    try {
      const res = await fetch(`${CONTENT_DIR}/${file}`);
      if (!res.ok) throw new Error(`Failed to load ${file}: ${res.status}`);
      const md = await res.text();
      container.innerHTML = marked.parse(md);
      renderSidebar(pages, file);
      window.location.hash = file;
      const h1 = container.querySelector('h1');
      if (h1) document.title = h1.textContent + ' — md-site';
      // scroll to top
      window.scrollTo(0, 0);
    } catch (err) {
      container.innerHTML = `<p class="error">${err.message}</p>`;
    }
  }

  // --- Init ---
  async function init() {
    initSidebarToggle();
    const pages = await getPages();
    if (!pages.length) {
      container.innerHTML = '<p class="error">No markdown files found in content/. Add a .md file and optionally a manifest.json.</p>';
      return;
    }
    const hash = window.location.hash.slice(1);
    const startPage = hash || pages[0].file;
    loadPage(startPage, pages);
  }

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      getPages().then(pages => loadPage(hash, pages));
    }
  });

  init();
})();
