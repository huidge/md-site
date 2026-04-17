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
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        const collapsed = sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebar-collapsed', collapsed ? '1' : '0');
      }
    });
  }

  // --- Parse manifest (supports flat array or grouped [{group, pages}]) ---
  async function getManifest() {
    try {
      const res = await fetch(`${CONTENT_DIR}/manifest.json`);
      if (res.ok) {
        const data = await res.json();
        // detect grouped format
        if (data.length && data[0].group) return data;
        // flat format -> wrap as single group
        return [{ group: 'Pages', pages: data }];
      }
    } catch (_) {}
    // fallback: auto-discover
    const candidates = ['hello', 'index', 'readme', 'about', 'guide'];
    const found = [];
    for (const name of candidates) {
      try {
        const r = await fetch(`${CONTENT_DIR}/${name}.md`, { method: 'HEAD' });
        if (r.ok) found.push({ file: `${name}.md`, title: capitalize(name) });
      } catch (_) {}
    }
    return found.length ? [{ group: 'Pages', pages: found }] : [];
  }

  // flatten groups to page list
  function flatPages(groups) {
    return groups.flatMap(g => g.pages);
  }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // --- Collapsible group state ---
  function isGroupCollapsed(label) {
    try { return JSON.parse(localStorage.getItem('sidebar-groups') || '{}')[label] === true; }
    catch { return false; }
  }
  function setGroupCollapsed(label, collapsed) {
    try {
      const state = JSON.parse(localStorage.getItem('sidebar-groups') || '{}');
      if (collapsed) state[label] = true; else delete state[label];
      localStorage.setItem('sidebar-groups', JSON.stringify(state));
    } catch {}
  }

  // --- Render sidebar with groups ---
  function renderSidebar(groups, activeFile) {
    sidebarList.innerHTML = '';
    const pages = flatPages(groups);

    groups.forEach(g => {
      // group header
      const header = document.createElement('li');
      header.className = 'sidebar-group';
      const collapsed = isGroupCollapsed(g.group);
      if (collapsed) header.classList.add('collapsed');

      const label = document.createElement('span');
      label.className = 'sidebar-group-label';
      label.textContent = g.group;
      label.addEventListener('click', () => {
        const nowCollapsed = header.classList.toggle('collapsed');
        setGroupCollapsed(g.group, nowCollapsed);
      });
      header.appendChild(label);

      // sub-list
      const subUl = document.createElement('ul');
      subUl.className = 'sidebar-group-items';
      g.pages.forEach(p => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = p.title;
        a.href = `#${p.file}`;
        if (p.file === activeFile) a.classList.add('active');
        a.addEventListener('click', e => {
          e.preventDefault();
          loadPage(p.file, groups);
        });
        li.appendChild(a);
        subUl.appendChild(li);
      });

      header.appendChild(subUl);
      sidebarList.appendChild(header);
    });

    sidebarFooter.textContent = `${pages.length} page${pages.length !== 1 ? 's' : ''}`;
  }

  // --- Load & render markdown ---
  async function loadPage(file, groups) {
    container.innerHTML = '<p class="loading">Loading...</p>';
    try {
      const res = await fetch(`${CONTENT_DIR}/${file}`);
      if (!res.ok) throw new Error(`Failed to load ${file}: ${res.status}`);
      const md = await res.text();
      container.innerHTML = marked.parse(md);
      renderSidebar(groups, file);
      window.location.hash = file;
      const h1 = container.querySelector('h1');
      if (h1) document.title = h1.textContent + ' — md-site';
      window.scrollTo(0, 0);
    } catch (err) {
      container.innerHTML = `<p class="error">${err.message}</p>`;
    }
  }

  // --- Init ---
  async function init() {
    initSidebarToggle();
    const groups = await getManifest();
    const pages = flatPages(groups);
    if (!pages.length) {
      container.innerHTML = '<p class="error">No markdown files found in content/. Add a .md file and optionally a manifest.json.</p>';
      return;
    }
    const hash = window.location.hash.slice(1);
    const startPage = hash || pages[0].file;
    loadPage(startPage, groups);
  }

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      getManifest().then(groups => loadPage(hash, groups));
    }
  });

  init();
})();
