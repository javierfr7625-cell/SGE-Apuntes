$ErrorActionPreference = "Stop"

$astro = [System.IO.File]::ReadAllText("web-astro/src/pages/index.astro", [System.Text.Encoding]::UTF8)

# 1. Read CSS
$ideStyles = [System.IO.File]::ReadAllText("web-astro/src/scripts/build-ide-html.ps1", [System.Text.Encoding]::UTF8)
$startMarker = '/* ========================================='
$endMarker = 'image-preview-body img {'
$idx1 = $ideStyles.IndexOf($startMarker)
$idx2 = $ideStyles.IndexOf('object-fit: contain;', $idx1) + 21
$css = $ideStyles.Substring($idx1, $idx2 - $idx1) + "`n}"

# 2. Inject Styles into <style>
if (-not $astro.Contains(".view-mode-bar")) {
  $targetStyle = '</style>'
  $firstStyle = $astro.IndexOf($targetStyle)
  $astro = $astro.Substring(0, $firstStyle) + "`n$css`n" + $astro.Substring($firstStyle)
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

if (-not $astro.Contains('id="btnModeIde"')) {
  $target = '<div class="filter-tags" id="tagFilters"'
  $astro = $astro.Replace($target, "$switcherHtml`n$target")
}

# 4. Set id="guideViewContainer" on app-container
if (-not $astro.Contains('id="guideViewContainer"')) {
  $astro = $astro.Replace('<div class="app-container">', '<div class="app-container" id="guideViewContainer">')
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

if (-not $astro.Contains('id="sidebarIdeBtn"')) {
  $targetToc = '<div class="toc-title"><span data-icon>📑</span> Índice Rápido</div>'
  if (-not $astro.Contains($targetToc)) {
    $targetToc = '<div class="toc-title"><span>📑</span> Índice Rápido</div>'
  }
  if (-not $astro.Contains($targetToc)) {
    $targetToc = '<div class="toc-title"'
    $endTag = $astro.IndexOf('</div>', $astro.IndexOf($targetToc)) + 6
    $targetStr = $astro.Substring($astro.IndexOf($targetToc), $endTag - $astro.IndexOf($targetToc))
    $astro = $astro.Replace($targetStr, "$targetStr`n$sidebarCard")
  } else {
    $astro = $astro.Replace($targetToc, "$targetToc`n$sidebarCard")
  }
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

if (-not $astro.Contains('id="ideViewContainer"')) {
  $targetDiv = "</main>`n  </div>"
  if (-not $astro.Contains($targetDiv)) {
    $targetDiv = "</main>`r`n  </div>"
  }
  if ($astro.Contains($targetDiv)) {
    $astro = $astro.Replace($targetDiv, "$targetDiv`n$ideHtml")
  }
}

# 7. Inject Scripts before </body>
$scriptsHtml = @"
  <!-- Zelda Files Data & IDE Controller -->
  <script is:inline src="/zelda-files.js"></script>
  <script is:inline src="/zelda-ide.js"></script>
"@

if (-not $astro.Contains('src="/zelda-ide.js"')) {
  $astro = $astro.Replace("</body>", "$scriptsHtml`n</body>")
}

[System.IO.File]::WriteAllText("web-astro/src/pages/index.astro", $astro, [System.Text.Encoding]::UTF8)
Write-Output "Successfully updated web-astro/src/pages/index.astro! New length: $($astro.Length)"

