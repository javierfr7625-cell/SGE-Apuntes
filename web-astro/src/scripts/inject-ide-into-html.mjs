import fs from 'node:fs';
import path from 'node:path';

// 1. Load Zelda project data
const ideData = JSON.parse(fs.readFileSync('web-astro/src/data/zelda-ide-data.json', 'utf-8'));

// 2. Render tree HTML
function renderTree(nodes, depth = 0) {
  let html = `<ul class="ide-tree-list ${depth === 0 ? 'ide-tree-root' : ''}">`;
  for (const node of nodes) {
    if (node.type === 'folder') {
      const isAutoOpen = ['src', 'src/app', 'src/app/pages', 'src/app/pages/materials', 'src/app/services'].includes(node.path);
      html += `
        <li class="ide-tree-item ide-folder ${isAutoOpen ? 'open' : ''}" data-path="${node.path}">
          <div class="ide-tree-row ide-folder-row" tabindex="0">
            <span class="ide-arrow">${isAutoOpen ? '▼' : '▶'}</span>
            <span class="ide-icon">${isAutoOpen ? '📂' : '📁'}</span>
            <span class="ide-name">${node.name}</span>
          </div>
          ${renderTree(node.children, depth + 1)}
        </li>`;
    } else {
      let badgeClass = 'badge-other';
      if (node.ext === 'ts') badgeClass = 'badge-ts';
      else if (node.ext === 'html') badgeClass = 'badge-html';
      else if (node.ext === 'scss' || node.ext === 'css') badgeClass = 'badge-scss';
      else if (node.ext === 'json') badgeClass = 'badge-json';

      const isKeyFile = [
        'src/main.ts',
        'src/app/app.routes.ts',
        'src/app/pages/materials/materials.page.ts',
        'src/app/pages/materials/materials.page.html',
        'src/app/pages/inicio/inicio.page.ts',
        'src/app/pages/inicio/inicio.page.html',
        'src/app/components/menu/menu.component.html',
        'src/app/services/zelda-service.ts',
        'src/app/services/toast-service.ts',
        'package.json'
      ].includes(node.path);

      const isActive = node.path === 'src/app/pages/materials/materials.page.ts';

      html += `
        <li class="ide-tree-item ide-file ${isActive ? 'active' : ''} ${isKeyFile ? 'key-file' : ''}" data-path="${node.path}">
          <div class="ide-tree-row ide-file-row" tabindex="0">
            <span class="ide-file-badge ${badgeClass}">${node.ext.toUpperCase()}</span>
            <span class="ide-name">${node.name}</span>
            ${isKeyFile ? '<span class="ide-star" title="Archivo clave examen">★</span>' : ''}
          </div>
        </li>`;
    }
  }
  html += '</ul>';
  return html;
}

const treeHtml = renderTree(ideData.tree);
const initialFilePath = 'src/app/pages/materials/materials.page.ts';
const initialFile = ideData.fileMap[initialFilePath];

// Generate line numbers for initial file
let initialLineNumbers = '';
for (let i = 1; i <= initialFile.linesCount; i++) {
  initialLineNumbers += `<span>${i}</span>`;
}

// 3. Read index.html
let html = fs.readFileSync('index.html', 'utf-8');

// 4. IDE Styles
const ideStyles = `
/* =========================================
   VIEW MODE SWITCHER (HEADER)
   ========================================= */
.view-mode-bar {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  border-top: 1px solid var(--border, #22324e);
  padding-top: 10px;
  overflow-x: auto;
}

.view-mode-btn {
  background: var(--bg-surface, #0f172a);
  color: var(--text-muted, #94a3b8);
  border: 1px solid var(--border, #22324e);
  border-radius: var(--radius-md, 10px);
  padding: 8px 16px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  white-space: nowrap;
}

.view-mode-btn:hover {
  background: var(--bg-subtle, #1e293b);
  color: #fff;
  border-color: #38bdf8;
}

.view-mode-btn.active {
  background: linear-gradient(135deg, #0284c7, #2563eb);
  color: #fff;
  border-color: #38bdf8;
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);
}

.btn-badge {
  background: rgba(0, 0, 0, 0.35);
  color: #38bdf8;
  padding: 2px 7px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-family: 'Fira Code', monospace;
}

.view-mode-btn.active .btn-badge {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

/* Sidebar IDE Promo Card */
.sidebar-ide-card {
  margin-bottom: 14px;
  border-radius: var(--radius-md, 10px);
  background: linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(37, 99, 235, 0.25));
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 10px;
}

.btn-open-ide {
  width: 100%;
  background: transparent;
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  cursor: pointer;
  text-align: left;
}

.btn-open-ide:hover strong {
  color: #38bdf8;
}

.btn-open-ide .icon {
  font-size: 1.3rem;
}

/* Model 2 jump banner */
.zelda-ide-jump-banner {
  background: linear-gradient(135deg, rgba(2, 132, 199, 0.2), rgba(37, 99, 235, 0.15));
  border: 1px solid rgba(56, 189, 248, 0.4);
  border-radius: 8px;
  padding: 10px 14px;
  margin: 12px 0 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: #e2e8f0;
}

.btn-jump-ide {
  background: #0284c7;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.btn-jump-ide:hover {
  background: #38bdf8;
  color: #090d16;
  transform: translateY(-1px);
}

/* =========================================
   IDE WORKSPACE LAYOUT & STYLES (VS CODE THEME)
   ========================================= */
.ide-view-container {
  max-width: 1540px;
  margin: 0 auto;
  padding: 16px 20px 40px 20px;
  width: 100%;
}

.ide-window {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  min-height: 820px;
}

/* Titlebar */
.ide-titlebar {
  background: #161b22;
  border-bottom: 1px solid #30363d;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  font-size: 0.82rem;
  user-select: none;
}

.ide-traffic-lights {
  display: flex;
  gap: 6px;
  align-items: center;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.dot-red { background: #ff5f56; }
.dot-yellow { background: #ffbd2e; }
.dot-green { background: #27c93f; }

.ide-titlebar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #c9d1d9;
}

.ide-title-badge {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.72rem;
}

.btn-ide-switch-back {
  background: #21262d;
  color: #c9d1d9;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.btn-ide-switch-back:hover {
  background: #30363d;
  color: #fff;
  border-color: #8b949e;
}

/* Quickbar Pills */
.ide-quickbar {
  background: #0d1117;
  border-bottom: 1px solid #21262d;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  overflow-x: auto;
}

.quickbar-label {
  font-size: 0.76rem;
  font-weight: 700;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.quickbar-pills {
  display: flex;
  gap: 6px;
  overflow-x: auto;
}

.quick-pill {
  background: #161b22;
  border: 1px solid #30363d;
  color: #c9d1d9;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 0.76rem;
  font-family: 'Fira Code', monospace;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  transition: all 0.15s;
}

.quick-pill:hover {
  background: #21262d;
  border-color: #38bdf8;
  color: #fff;
}

.quick-pill.active {
  background: rgba(56, 189, 248, 0.18);
  border-color: #38bdf8;
  color: #38bdf8;
  font-weight: 700;
}

.pill-badge {
  font-size: 0.65rem;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: 700;
}

/* Badges by file type */
.badge-ts { background: #3178c6; color: #fff; }
.badge-html { background: #e34f26; color: #fff; }
.badge-scss { background: #c6538c; color: #fff; }
.badge-json { background: #cbcb41; color: #000; }
.badge-other { background: #6e7681; color: #fff; }

/* Workbench Split */
.ide-workbench {
  display: grid;
  grid-template-columns: 310px 1fr;
  flex: 1;
  min-height: 720px;
  background: #0d1117;
}

@media (max-width: 900px) {
  .ide-workbench {
    grid-template-columns: 1fr;
  }
}

/* Explorer Sidebar */
.ide-explorer {
  background: #161b22;
  border-right: 1px solid #30363d;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.explorer-head {
  padding: 10px 14px;
  border-bottom: 1px solid #21262d;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.explorer-title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #8b949e;
  display: flex;
  align-items: center;
  gap: 6px;
}

.explorer-tools {
  display: flex;
  gap: 4px;
}

.btn-tool {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 2px 6px;
  border-radius: 4px;
}

.btn-tool:hover {
  background: #21262d;
}

.explorer-search {
  padding: 8px 12px;
  border-bottom: 1px solid #21262d;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #0d1117;
  position: relative;
}

.explorer-search input {
  background: transparent;
  border: none;
  outline: none;
  color: #c9d1d9;
  font-size: 0.8rem;
  width: 100%;
}

.btn-clear-search {
  background: transparent;
  border: none;
  color: #8b949e;
  cursor: pointer;
  font-size: 0.9rem;
  display: none;
}

/* Tree list */
.ide-tree-scroll {
  overflow-y: auto;
  flex: 1;
  padding: 6px 0;
  max-height: 680px;
}

.ide-tree-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ide-tree-list .ide-tree-list {
  padding-left: 14px;
  display: none;
}

.ide-tree-item.open > .ide-tree-list {
  display: block;
}

.ide-tree-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 0.8rem;
  font-family: 'Fira Code', Consolas, monospace;
  color: #c9d1d9;
  cursor: pointer;
  user-select: none;
  border-radius: 4px;
  margin: 1px 4px;
  transition: background 0.1s;
}

.ide-tree-row:hover {
  background: #21262d;
  color: #fff;
}

.ide-tree-item.active > .ide-file-row {
  background: #1f6feb33;
  color: #58a6ff;
  border-left: 2px solid #58a6ff;
  font-weight: 600;
}

.ide-arrow {
  font-size: 0.65rem;
  width: 12px;
  color: #8b949e;
  text-align: center;
}

.ide-icon {
  font-size: 0.9rem;
}

.ide-file-badge {
  font-size: 0.62rem;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 3px;
  min-width: 28px;
  text-align: center;
}

.ide-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ide-star {
  color: #f59e0b;
  font-size: 0.85rem;
}

/* Editor Container */
.ide-editor-container {
  display: flex;
  flex-direction: column;
  background: #070b14;
  overflow: hidden;
}

/* Tabs Bar */
.ide-tabs-bar {
  background: #161b22;
  border-bottom: 1px solid #21262d;
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
}

.ide-tabs-bar::-webkit-scrollbar {
  display: none;
}

.ide-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: #0d1117;
  border-right: 1px solid #21262d;
  border-top: 2px solid transparent;
  color: #8b949e;
  font-size: 0.78rem;
  font-family: 'Fira Code', monospace;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
}

.ide-tab:hover {
  color: #c9d1d9;
}

.ide-tab.active {
  background: #070b14;
  color: #fff;
  border-top-color: #38bdf8;
}

.tab-badge {
  font-size: 0.62rem;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 3px;
}

.tab-close {
  opacity: 0.5;
  padding: 0 4px;
  border-radius: 3px;
  font-size: 0.9rem;
}

.tab-close:hover {
  opacity: 1;
  background: #30363d;
  color: #f85149;
}

/* Breadcrumb Bar */
.ide-breadcrumb-bar {
  background: #0d1117;
  border-bottom: 1px solid #21262d;
  padding: 6px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #8b949e;
  flex-wrap: wrap;
  gap: 10px;
}

.breadcrumb-left {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Fira Code', monospace;
}

.breadcrumb-root {
  color: #38bdf8;
  font-weight: 600;
}

.breadcrumb-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-stat-pill {
  color: #8b949e;
  font-family: 'Fira Code', monospace;
  font-size: 0.72rem;
}

.file-lang-pill {
  background: #21262d;
  color: #c9d1d9;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.btn-ide-copy {
  background: linear-gradient(135deg, #0284c7, #2563eb);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(2, 132, 199, 0.4);
}

.btn-ide-copy:hover {
  background: #38bdf8;
  color: #090d16;
  transform: translateY(-1px);
}

/* Code Viewport */
.ide-code-viewport {
  position: relative;
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 600px;
  background: #070b14;
}

.ide-line-numbers {
  width: 48px;
  background: #0a0e1a;
  border-right: 1px solid #161b26;
  padding: 16px 8px 16px 0;
  display: flex;
  flex-direction: column;
  user-select: none;
  text-align: right;
  color: #475569;
  font-family: 'Fira Code', Consolas, monospace;
  font-size: 0.85rem;
  line-height: 1.6;
  overflow: hidden;
}

.ide-code-scroll {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.ide-code-pre {
  margin: 0;
  padding: 0;
  background: transparent;
  overflow: visible;
}

.ide-code-pre code.hljs {
  font-family: 'Fira Code', Consolas, Monaco, monospace !important;
  font-size: 0.85rem !important;
  line-height: 1.6 !important;
  background: transparent !important;
  padding: 0 !important;
  white-space: pre !important;
}

/* Image Preview */
.ide-image-preview {
  position: absolute;
  inset: 0;
  background: #070b14;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}

.image-preview-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  padding: 24px;
  text-align: center;
  max-width: 500px;
}

.image-preview-body img {
  max-width: 100%;
  max-height: 350px;
  border-radius: 6px;
  margin: 16px 0;
  object-fit: contain;
}
`;

// 5. Inject styles
if (!html.includes('.view-mode-bar')) {
  html = html.replace('</style>', ideStyles + '\n</style>');
}

// 6. Header Switcher
const headerSwitcherHtml = `
      <!-- View Mode Tabs (Guía vs IDE) -->
      <div class="view-mode-bar">
        <button class="view-mode-btn active" id="btnModeGuide" data-mode="guide">
          <span class="icon">📖</span> Guía y Modelos de Examen
        </button>
        <button class="view-mode-btn" id="btnModeIde" data-mode="ide">
          <span class="icon">💻</span> IDE: Simulacro Zelda (Archivos Oficiales)
          <span class="btn-badge">48 archivos</span>
        </button>
      </div>
`;

if (!html.includes('id="btnModeIde"')) {
  // Put switcher right before tagFilters
  html = html.replace(/<div class="filter-tags" id="tagFilters"/, headerSwitcherHtml + '\n<div class="filter-tags" id="tagFilters"');
}

// 7. Sidebar Card & Guide Container ID
if (!html.includes('id="guideViewContainer"')) {
  html = html.replace(/<div class="app-container"/, '<div class="app-container" id="guideViewContainer"');
}

const sidebarCardHtml = `
      <div class="sidebar-ide-card">
        <button class="btn-open-ide" id="sidebarIdeBtn">
          <span class="icon">💻</span>
          <div>
            <strong>IDE Simulacro Zelda</strong>
            <div style="font-size: 0.72rem; color: #94a3b8; font-weight: normal;">Explorador de archivos oficial</div>
          </div>
        </button>
      </div>
`;

if (!html.includes('id="sidebarIdeBtn"')) {
  html = html.replace(/<aside class="toc-sidebar"[^>]*>/, '$&\n' + sidebarCardHtml);
}

// 8. IDE View HTML
const ideViewHtml = `
  <!-- ============================================================== -->
  <!-- IDE VIEW: IONIC-SIMULACRO-ZELDA-MASTER (FULL VS CODE WORKSPACE) -->
  <!-- ============================================================== -->
  <div id="ideViewContainer" class="ide-view-container" style="display: none;">
    <div class="ide-window">
      
      <!-- IDE Top Titlebar -->
      <div class="ide-titlebar">
        <div class="ide-traffic-lights">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <div class="ide-titlebar-title">
          <span class="icon">📁</span>
          <strong>ionic-simulacro-zelda-master</strong>
          <span class="ide-title-badge">Solución Oficial Belda • Ionic v8 & Angular Standalone</span>
        </div>
        <div class="ide-titlebar-actions">
          <button class="btn-ide-switch-back" id="btnBackToGuide">
            <span>📖</span> Volver a la Guía
          </button>
        </div>
      </div>

      <!-- Quick Switcher Bar for Key Exam Files -->
      <div class="ide-quickbar">
        <span class="quickbar-label">⚡ Acceso Rápido:</span>
        <div class="quickbar-pills">
          <button class="quick-pill active" data-path="src/app/pages/materials/materials.page.ts">
            <span class="pill-badge badge-ts">TS</span> materials.page.ts
          </button>
          <button class="quick-pill" data-path="src/app/pages/materials/materials.page.html">
            <span class="pill-badge badge-html">HTML</span> materials.page.html
          </button>
          <button class="quick-pill" data-path="src/main.ts">
            <span class="pill-badge badge-ts">TS</span> main.ts (Providers)
          </button>
          <button class="quick-pill" data-path="src/app/app.routes.ts">
            <span class="pill-badge badge-ts">TS</span> app.routes.ts
          </button>
          <button class="quick-pill" data-path="src/app/pages/inicio/inicio.page.ts">
            <span class="pill-badge badge-ts">TS</span> inicio.page.ts (Swiper)
          </button>
          <button class="quick-pill" data-path="src/app/pages/inicio/inicio.page.html">
            <span class="pill-badge badge-html">HTML</span> inicio.page.html
          </button>
          <button class="quick-pill" data-path="src/app/components/menu/menu.component.html">
            <span class="pill-badge badge-html">HTML</span> menu.component.html
          </button>
          <button class="quick-pill" data-path="src/app/services/zelda-service.ts">
            <span class="pill-badge badge-ts">TS</span> zelda-service.ts
          </button>
          <button class="quick-pill" data-path="src/app/services/toast-service.ts">
            <span class="pill-badge badge-ts">TS</span> toast-service.ts
          </button>
          <button class="quick-pill" data-path="src/app/common/models/zelda.model.ts">
            <span class="pill-badge badge-ts">TS</span> zelda.model.ts
          </button>
          <button class="quick-pill" data-path="package.json">
            <span class="pill-badge badge-json">JSON</span> package.json
          </button>
        </div>
      </div>

      <!-- IDE Workbench Split: Explorer (Left) & Editor (Right) -->
      <div class="ide-workbench">
        
        <!-- Explorer Sidebar (Left) -->
        <aside class="ide-explorer">
          <div class="explorer-head">
            <div class="explorer-title">
              <span>📁</span> EXPLORADOR
            </div>
            <div class="explorer-tools">
              <button class="btn-tool" id="btnToggleAllFolders" title="Expandir / Colapsar Todo">📂</button>
            </div>
          </div>

          <!-- Filter Input -->
          <div class="explorer-search">
            <span class="icon">🔍</span>
            <input type="text" id="ideFileFilter" placeholder="Filtrar archivos..." />
            <button id="btnClearIdeFilter" class="btn-clear-search">&times;</button>
          </div>

          <!-- Tree View Container -->
          <div class="ide-tree-scroll" id="ideTreeContainer">
            ${treeHtml}
          </div>
        </aside>

        <!-- Editor Canvas (Right) -->
        <section class="ide-editor-container">
          
          <!-- Tabs Header Bar -->
          <div class="ide-tabs-bar" id="ideTabsBar">
            <div class="ide-tab active" data-path="${initialFilePath}">
              <span class="tab-badge badge-ts">TS</span>
              <span class="tab-title">materials.page.ts</span>
              <span class="tab-close" data-close="${initialFilePath}" title="Cerrar pestaña">&times;</span>
            </div>
          </div>

          <!-- Breadcrumb & File Meta Action Bar -->
          <div class="ide-breadcrumb-bar">
            <div class="breadcrumb-left">
              <span class="breadcrumb-root">ionic-simulacro-zelda-master</span>
              <span class="sep">›</span>
              <span id="ideBreadcrumbPath">src › app › pages › materials › materials.page.ts</span>
            </div>

            <div class="breadcrumb-right">
              <span class="file-stat-pill" id="ideFileStats">${initialFile.linesCount} líneas • ${(initialFile.content.length / 1024).toFixed(1)} KB</span>
              <span class="file-lang-pill" id="ideFileLang">TypeScript</span>
              <button class="btn-ide-copy" id="btnCopyIdeFile">
                <span>📋</span> Copiar Archivo Entero
              </button>
            </div>
          </div>

          <!-- Editor Code Area -->
          <div class="ide-code-viewport" id="ideCodeViewport">
            <!-- Line Numbers Gutter -->
            <div class="ide-line-numbers" id="ideLineNumbers">
              ${initialLineNumbers}
            </div>

            <!-- Code Canvas -->
            <div class="ide-code-scroll" id="ideCodeScroll">
              <pre class="ide-code-pre"><code class="hljs" id="ideCodeOutput">${initialFile.highlighted}</code></pre>
            </div>

            <!-- Image Preview (Hidden by default, shown when clicking an image) -->
            <div class="ide-image-preview" id="ideImagePreview" style="display: none;">
              <div class="image-preview-card">
                <div class="image-preview-header">
                  <span class="icon">🖼️</span>
                  <strong id="ideImageTitle">Previsualización de Imagen</strong>
                </div>
                <div class="image-preview-body">
                  <img id="idePreviewImg" src="" alt="Vista previa" />
                </div>
                <div class="image-preview-info" id="ideImageInfo">
                  Ruta del proyecto: <code>assets/images/...</code>
                </div>
              </div>
            </div>
          </div>

        </section>

      </div>
    </div>
  </div>
`;

if (!html.includes('id="ideViewContainer"')) {
  // Find </main> followed by </div>
  const mainCloseIdx = html.indexOf('</main>');
  if (mainCloseIdx !== -1) {
    const afterMain = html.indexOf('</div>', mainCloseIdx);
    if (afterMain !== -1) {
      const splitPos = afterMain + 6;
      html = html.substring(0, splitPos) + '\n' + ideViewHtml + '\n' + html.substring(splitPos);
    }
  }
}

// 9. Serialize Files & Client Script
const safeJsonString = JSON.stringify(ideData.fileMap).replace(/<\/script>/gi, '<\\/script>');

const ideScript = `
  <!-- Serialized Zelda Project Files Data for Instant Offline Access -->
  <script>
    window.ZELDA_FILES = ${safeJsonString};
  </script>

  <!-- IDE Controller Scripts -->
  <script>
    // =========================================
    // VIEW SWITCHER (GUIDE VS IDE)
    // =========================================
    const btnModeGuide = document.getElementById('btnModeGuide');
    const btnModeIde = document.getElementById('btnModeIde');
    const chipIdeZelda = document.getElementById('chipIdeZelda');
    const guideViewContainer = document.getElementById('guideViewContainer');
    const ideViewContainer = document.getElementById('ideViewContainer');

    function switchView(mode) {
      if (mode === 'ide') {
        btnModeGuide?.classList.remove('active');
        btnModeIde?.classList.add('active');
        if (guideViewContainer) guideViewContainer.style.display = 'none';
        if (ideViewContainer) ideViewContainer.style.display = 'block';
        window.location.hash = 'ide';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        btnModeIde?.classList.remove('active');
        btnModeGuide?.classList.add('active');
        if (ideViewContainer) ideViewContainer.style.display = 'none';
        if (guideViewContainer) guideViewContainer.style.display = 'grid';
        if (window.location.hash === '#ide') {
          history.pushState('', document.title, window.location.pathname + window.location.search);
        }
      }
    }

    btnModeGuide?.addEventListener('click', () => switchView('guide'));
    btnModeIde?.addEventListener('click', () => switchView('ide'));
    chipIdeZelda?.addEventListener('click', () => switchView('ide'));
    document.getElementById('btnBackToGuide')?.addEventListener('click', () => switchView('guide'));
    document.getElementById('sidebarIdeBtn')?.addEventListener('click', () => switchView('ide'));

    // If loaded with #ide in URL, switch automatically
    if (window.location.hash === '#ide') {
      switchView('ide');
    }

    // =========================================
    // IDE FILE EXPLORER & EDITOR CONTROLLER
    // =========================================
    let currentOpenFilePath = 'src/app/pages/materials/materials.page.ts';
    let openTabs = [currentOpenFilePath];

    function escapeHtml(str) {
      return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function openFileInIde(filePath) {
      const fileData = window.ZELDA_FILES ? window.ZELDA_FILES[filePath] : null;
      if (!fileData) return;
      currentOpenFilePath = filePath;

      // Update tree active selection & open parent folders
      document.querySelectorAll('.ide-tree-item.ide-file').forEach(el => {
        if (el.dataset.path === filePath) {
          el.classList.add('active');
          // Open all parent folders
          let parent = el.parentElement;
          while (parent && parent.classList.contains('ide-tree-list')) {
            const folderItem = parent.closest('.ide-folder');
            if (folderItem) {
              folderItem.classList.add('open');
              const arrow = folderItem.querySelector(':scope > .ide-folder-row .ide-arrow');
              const icon = folderItem.querySelector(':scope > .ide-folder-row .ide-icon');
              if (arrow) arrow.innerText = '▼';
              if (icon) icon.innerText = '📂';
            }
            parent = folderItem ? folderItem.parentElement : null;
          }
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          el.classList.remove('active');
        }
      });

      // Update quick pills active state
      document.querySelectorAll('.quick-pill').forEach(pill => {
        if (pill.dataset.path === filePath) pill.classList.add('active');
        else pill.classList.remove('active');
      });

      // Breadcrumb & file meta
      const breadcrumbEl = document.getElementById('ideBreadcrumbPath');
      if (breadcrumbEl) breadcrumbEl.innerText = filePath.replace(/\\//g, ' › ');
      const statsEl = document.getElementById('ideFileStats');
      if (statsEl) {
        statsEl.innerText = fileData.isImage 
          ? 'Archivo de Imagen' 
          : fileData.linesCount + ' líneas • ' + (fileData.content.length / 1024).toFixed(1) + ' KB';
      }
      const langEl = document.getElementById('ideFileLang');
      if (langEl) langEl.innerText = fileData.ext ? fileData.ext.toUpperCase() : 'CODE';

      // Code / Image display
      const imagePreview = document.getElementById('ideImagePreview');
      const codeScroll = document.getElementById('ideCodeScroll');
      const lineNumbers = document.getElementById('ideLineNumbers');
      const codeOutput = document.getElementById('ideCodeOutput');

      if (fileData.isImage) {
        if (codeScroll) codeScroll.style.display = 'none';
        if (lineNumbers) lineNumbers.style.display = 'none';
        if (imagePreview) {
          imagePreview.style.display = 'flex';
          const img = document.getElementById('idePreviewImg');
          if (img) img.src = './Simulacro/ionic-simulacro-zelda-master/' + filePath;
          const imgTitle = document.getElementById('ideImageTitle');
          if (imgTitle) imgTitle.innerText = fileData.name;
          const imgInfo = document.getElementById('ideImageInfo');
          if (imgInfo) imgInfo.innerHTML = 'Ruta: <code>' + filePath + '</code>';
        }
      } else {
        if (imagePreview) imagePreview.style.display = 'none';
        if (codeScroll) codeScroll.style.display = 'block';
        if (lineNumbers) {
          lineNumbers.style.display = 'flex';
          let numsHtml = '';
          for (let i = 1; i <= fileData.linesCount; i++) {
            numsHtml += '<span>' + i + '</span>';
          }
          lineNumbers.innerHTML = numsHtml;
        }
        if (codeOutput) {
          codeOutput.innerHTML = fileData.highlighted || escapeHtml(fileData.content);
        }
        if (codeScroll) codeScroll.scrollTop = 0;
      }

      // Update tabs bar
      renderTabs();
    }

    function renderTabs() {
      const tabsBar = document.getElementById('ideTabsBar');
      if (!tabsBar) return;
      if (!openTabs.includes(currentOpenFilePath)) {
        openTabs.push(currentOpenFilePath);
      }
      let html = '';
      openTabs.forEach(path => {
        const file = window.ZELDA_FILES ? window.ZELDA_FILES[path] : null;
        if (!file) return;
        const isActive = path === currentOpenFilePath;
        let badgeClass = 'badge-other';
        if (file.ext === 'ts') badgeClass = 'badge-ts';
        else if (file.ext === 'html') badgeClass = 'badge-html';
        else if (file.ext === 'scss' || file.ext === 'css') badgeClass = 'badge-scss';
        else if (file.ext === 'json') badgeClass = 'badge-json';

        html += \`
          <div class="ide-tab \${isActive ? 'active' : ''}" data-path="\${path}">
            <span class="tab-badge \${badgeClass}">\${file.ext.toUpperCase()}</span>
            <span class="tab-title">\${file.name}</span>
            <span class="tab-close" data-close="\${path}" title="Cerrar pestaña">&times;</span>
          </div>\`;
      });
      tabsBar.innerHTML = html;

      // Tab click events
      tabsBar.querySelectorAll('.ide-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
          if (e.target.classList.contains('tab-close')) {
            e.stopPropagation();
            const closePath = e.target.dataset.close;
            openTabs = openTabs.filter(p => p !== closePath);
            if (closePath === currentOpenFilePath) {
              const nextPath = openTabs[openTabs.length - 1] || 'src/app/pages/materials/materials.page.ts';
              openFileInIde(nextPath);
            } else {
              renderTabs();
            }
          } else {
            openFileInIde(tab.dataset.path);
          }
        });
      });
    }

    // Synchronize line numbers scroll with code scroll
    const codeScroll = document.getElementById('ideCodeScroll');
    const lineNumbers = document.getElementById('ideLineNumbers');
    codeScroll?.addEventListener('scroll', () => {
      if (lineNumbers) lineNumbers.scrollTop = codeScroll.scrollTop;
    });

    // Tree folder click event (expand/collapse)
    document.querySelectorAll('.ide-folder-row').forEach(row => {
      row.addEventListener('click', () => {
        const folder = row.closest('.ide-folder');
        if (!folder) return;
        folder.classList.toggle('open');
        const arrow = row.querySelector('.ide-arrow');
        const icon = row.querySelector('.ide-icon');
        const isOpen = folder.classList.contains('open');
        if (arrow) arrow.innerText = isOpen ? '▼' : '▶';
        if (icon) icon.innerText = isOpen ? '📂' : '📁';
      });
    });

    // Tree file click event (open file)
    document.querySelectorAll('.ide-file-row').forEach(row => {
      row.addEventListener('click', () => {
        const fileItem = row.closest('.ide-file');
        if (fileItem && fileItem.dataset.path) {
          openFileInIde(fileItem.dataset.path);
        }
      });
    });

    // Quick Jump buttons from Guide into IDE
    document.querySelectorAll('.btn-jump-ide').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetFile = btn.dataset.file || 'src/app/pages/materials/materials.page.ts';
        switchView('ide');
        openFileInIde(targetFile);
      });
    });

    // Quick Pills click
    document.querySelectorAll('.quick-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const path = pill.dataset.path;
        if (path) openFileInIde(path);
      });
    });

    // Toggle all folders button
    let allExpanded = false;
    document.getElementById('btnToggleAllFolders')?.addEventListener('click', () => {
      allExpanded = !allExpanded;
      document.querySelectorAll('.ide-folder').forEach(folder => {
        if (allExpanded) {
          folder.classList.add('open');
        } else {
          folder.classList.remove('open');
        }
        const arrow = folder.querySelector(':scope > .ide-folder-row .ide-arrow');
        const icon = folder.querySelector(':scope > .ide-folder-row .ide-icon');
        if (arrow) arrow.innerText = allExpanded ? '▼' : '▶';
        if (icon) icon.innerText = allExpanded ? '📂' : '📁';
      });
    });

    // File search/filter input in IDE
    const ideFileFilter = document.getElementById('ideFileFilter');
    const btnClearIdeFilter = document.getElementById('btnClearIdeFilter');

    ideFileFilter?.addEventListener('input', () => {
      const query = (ideFileFilter.value || '').toLowerCase().trim();
      if (btnClearIdeFilter) {
        btnClearIdeFilter.style.display = query ? 'block' : 'none';
      }
      document.querySelectorAll('.ide-tree-item.ide-file').forEach(item => {
        const name = (item.querySelector('.ide-name')?.innerText || '').toLowerCase();
        const path = (item.dataset.path || '').toLowerCase();
        const matches = query === '' || name.includes(query) || path.includes(query);
        item.style.display = matches ? 'block' : 'none';
        if (matches && query !== '') {
          // Open parent folders to reveal matching files
          let parent = item.parentElement;
          while (parent && parent.classList.contains('ide-tree-list')) {
            const folderItem = parent.closest('.ide-folder');
            if (folderItem) {
              folderItem.classList.add('open');
              const arrow = folderItem.querySelector(':scope > .ide-folder-row .ide-arrow');
              const icon = folderItem.querySelector(':scope > .ide-folder-row .ide-icon');
              if (arrow) arrow.innerText = '▼';
              if (icon) icon.innerText = '📂';
            }
            parent = folderItem ? folderItem.parentElement : null;
          }
        }
      });
    });

    btnClearIdeFilter?.addEventListener('click', () => {
      if (ideFileFilter) {
        ideFileFilter.value = '';
        ideFileFilter.dispatchEvent(new Event('input'));
      }
    });

    // Copy IDE File Content Button
    const btnCopyIdeFile = document.getElementById('btnCopyIdeFile');
    btnCopyIdeFile?.addEventListener('click', () => {
      const file = window.ZELDA_FILES ? window.ZELDA_FILES[currentOpenFilePath] : null;
      if (!file || !file.content) return;
      navigator.clipboard.writeText(file.content).then(() => {
        const origText = btnCopyIdeFile.innerHTML;
        btnCopyIdeFile.innerHTML = '<span>✅</span> ¡Archivo Copiado!';
        btnCopyIdeFile.style.background = '#10b981';
        btnCopyIdeFile.style.color = '#090d16';
        setTimeout(() => {
          btnCopyIdeFile.innerHTML = origText;
          btnCopyIdeFile.style.background = '';
          btnCopyIdeFile.style.color = '';
        }, 1800);
      });
    });
  </script>
`;

if (!html.includes('window.ZELDA_FILES')) {
  html = html.replace('</body>', ideScript + '\n</body>');
}

// 10. Write output
fs.writeFileSync('index.html', html, 'utf-8');
console.log('🎉 Successfully assembled and injected IDE into index.html!');
console.log('Total file size:', Math.round(html.length / 1024), 'KB');
