$ErrorActionPreference = "Stop"

$html = [System.IO.File]::ReadAllText("index.html", [System.Text.Encoding]::UTF8)

# 1. IDE CSS Styles
$ideStyles = @"
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

/* =========================================
   IDE WORKSPACE LAYOUT & STYLES
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

.badge-ts { background: #3178c6; color: #fff; }
.badge-html { background: #e34f26; color: #fff; }
.badge-scss { background: #c6538c; color: #fff; }
.badge-json { background: #cbcb41; color: #000; }
.badge-other { background: #6e7681; color: #fff; }

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
  background: rgba(31, 111, 235, 0.25);
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

.ide-editor-container {
  display: flex;
  flex-direction: column;
  background: #070b14;
  overflow: hidden;
}

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
"@

# 2. Inject Styles into <style>
if (-not $html.Contains(".view-mode-bar")) {
  $html = $html.Replace("</style>", "$ideStyles`n</style>")
}

# 3. Inject View Mode Tabs in Header
$switcherHtml = @"
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
"@

if (-not $html.Contains('id="btnModeIde"')) {
  $target = '<div class="filter-tags" id="tagFilters"'
  $html = $html.Replace($target, "$switcherHtml`n$target")
}

# 4. Set id="guideViewContainer" on app-container
if (-not $html.Contains('id="guideViewContainer"')) {
  $html = $html.Replace('<div class="app-container"', '<div class="app-container" id="guideViewContainer"')
}

# 5. Inject Sidebar Promo Card
$sidebarCard = @"
      <div class="sidebar-ide-card">
        <button class="btn-open-ide" id="sidebarIdeBtn">
          <span class="icon">💻</span>
          <div>
            <strong>IDE Simulacro Zelda</strong>
            <div style="font-size: 0.72rem; color: #94a3b8; font-weight: normal;">48 archivos oficiales</div>
          </div>
        </button>
      </div>
"@

if (-not $html.Contains('id="sidebarIdeBtn"')) {
  $targetToc = '<div class="toc-title" data-astro-cid-lcdefpme><span data-astro-cid-lcdefpme>📑</span> Índice Rápido</div>'
  $html = $html.Replace($targetToc, "$targetToc`n$sidebarCard")
}

# 6. Inject IDE Container after app-container
$ideHtml = @"
  <!-- ============================================================== -->
  <!-- IDE VIEW: IONIC-SIMULACRO-ZELDA-MASTER (FULL WORKSPACE) -->
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
          <span class="ide-title-badge">Solución Oficial de Clase • Ionic v8 & Angular Standalone</span>
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
            <span class="pill-badge badge-ts">TS</span> main.ts (Providers & Swiper)
          </button>
          <button class="quick-pill" data-path="src/app/app.routes.ts">
            <span class="pill-badge badge-ts">TS</span> app.routes.ts
          </button>
          <button class="quick-pill" data-path="src/app/pages/inicio/inicio.page.ts">
            <span class="pill-badge badge-ts">TS</span> inicio.page.ts
          </button>
          <button class="quick-pill" data-path="src/app/pages/inicio/inicio.page.html">
            <span class="pill-badge badge-html">HTML</span> inicio.page.html (Swiper)
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

          <!-- Tree View Container (Populated dynamically by zelda-ide.js) -->
          <div class="ide-tree-scroll" id="ideTreeContainer">
          </div>
        </aside>

        <!-- Editor Canvas (Right) -->
        <section class="ide-editor-container">
          
          <!-- Tabs Header Bar -->
          <div class="ide-tabs-bar" id="ideTabsBar">
          </div>

          <!-- Breadcrumb & File Meta Action Bar -->
          <div class="ide-breadcrumb-bar">
            <div class="breadcrumb-left">
              <span class="breadcrumb-root">ionic-simulacro-zelda-master</span>
              <span class="sep">›</span>
              <span id="ideBreadcrumbPath">src › app › pages › materials › materials.page.ts</span>
            </div>

            <div class="breadcrumb-right">
              <span class="file-stat-pill" id="ideFileStats">Cargando...</span>
              <span class="file-lang-pill" id="ideFileLang">TS</span>
              <button class="btn-ide-copy" id="btnCopyIdeFile">
                <span>📋</span> Copiar Archivo Entero
              </button>
            </div>
          </div>

          <!-- Editor Code Area -->
          <div class="ide-code-viewport" id="ideCodeViewport">
            <!-- Line Numbers Gutter -->
            <div class="ide-line-numbers" id="ideLineNumbers"></div>

            <!-- Code Canvas -->
            <div class="ide-code-scroll" id="ideCodeScroll">
              <pre class="ide-code-pre"><code class="hljs" id="ideCodeOutput"></code></pre>
            </div>

            <!-- Image Preview -->
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
"@

if (-not $html.Contains('id="ideViewContainer"')) {
  # Locate the end of the app-container
  # app-container contains </aside> and </main> then </div>
  $mainClose = $html.IndexOf("</main>")
  if ($mainClose -gt 0) {
    $divClose = $html.IndexOf("</div>", $mainClose)
    if ($divClose -gt 0) {
      $split = $divClose + 6
      $html = $html.Substring(0, $split) + "`n" + $ideHtml + "`n" + $html.Substring($split)
    }
  }
}

# 7. Inject Scripts before </body>
$scriptsHtml = @"
  <!-- Zelda Files Data & IDE Controller -->
  <script src="./zelda-files.js"></script>
  <script src="./zelda-ide.js"></script>
"@

if (-not $html.Contains('src="./zelda-ide.js"')) {
  $html = $html.Replace("</body>", "$scriptsHtml`n</body>")
}

[System.IO.File]::WriteAllText("index.html", $html, [System.Text.Encoding]::UTF8)
Write-Output "Successfully updated index.html! New length: $($html.Length)"

