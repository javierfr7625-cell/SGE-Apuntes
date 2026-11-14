// =========================================
// IDE WORKSPACE & VIEW SWITCHER CONTROLLER
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  initIdeController();
});

if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initIdeController();
}

function initIdeController() {
  if (window.__IDE_INITIALIZED__) return;
  window.__IDE_INITIALIZED__ = true;

  const btnModeGuide = document.getElementById('btnModeGuide');
  const btnModeIde = document.getElementById('btnModeIde');
  const chipIdeZelda = document.getElementById('chipIdeZelda');
  const guideViewContainer = document.getElementById('guideViewContainer');
  const ideViewContainer = document.getElementById('ideViewContainer');
  const btnBackToGuide = document.getElementById('btnBackToGuide');
  const sidebarIdeBtn = document.getElementById('sidebarIdeBtn');

  // VIEW SWITCHER
  function switchView(mode) {
    if (mode === 'ide') {
      btnModeGuide?.classList.remove('active');
      btnModeIde?.classList.add('active');
      if (guideViewContainer) guideViewContainer.style.display = 'none';
      if (ideViewContainer) ideViewContainer.style.display = 'block';
      if (window.location.hash !== '#ide') {
        window.location.hash = 'ide';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Render tree if empty and open file
      if (window.ZELDA_FILES) {
        const treeContainer = document.getElementById('ideTreeContainer');
        if (treeContainer && !treeContainer.hasChildNodes()) {
          buildTreeAndRender();
        }
        openFileInIde(currentOpenFilePath);
      } else {
        tryInitTree();
      }
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

  // Expose globally
  window.switchView = switchView;

  btnModeGuide?.addEventListener('click', () => switchView('guide'));
  btnModeIde?.addEventListener('click', () => switchView('ide'));
  chipIdeZelda?.addEventListener('click', () => switchView('ide'));
  btnBackToGuide?.addEventListener('click', () => switchView('guide'));
  sidebarIdeBtn?.addEventListener('click', () => switchView('ide'));

  // Listen to hashchange in browser URL
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#ide') {
      switchView('ide');
    } else {
      switchView('guide');
    }
  });

  // Quick jump buttons from Guide into IDE
  document.querySelectorAll('.btn-jump-ide').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetFile = btn.dataset.file || 'src/app/pages/materials/materials.page.ts';
      switchView('ide');
      openFileInIde(targetFile);
    });
  });

  // If URL has #ide on initial load, open IDE view
  if (window.location.hash === '#ide') {
    switchView('ide');
  }

  // =========================================
  // FILE EXPLORER & EDITOR
  // =========================================
  let currentOpenFilePath = 'src/app/pages/materials/materials.page.ts';
  let openTabs = [currentOpenFilePath];

  function escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // BUILD DYNAMIC TREE FROM window.ZELDA_FILES
  function buildTreeAndRender() {
    const treeContainer = document.getElementById('ideTreeContainer');
    if (!treeContainer || !window.ZELDA_FILES) return;

    // Build hierarchy
    const root = { name: '', path: '', type: 'folder', children: {} };
    const paths = Object.keys(window.ZELDA_FILES).sort();

    for (const filePath of paths) {
      const parts = filePath.split('/');
      let curr = root;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;
        const curPath = parts.slice(0, i + 1).join('/');

        if (isFile) {
          curr.children[part] = {
            name: part,
            path: curPath,
            type: 'file',
            ext: window.ZELDA_FILES[filePath].ext || part.split('.').pop(),
            linesCount: window.ZELDA_FILES[filePath].linesCount || 0,
            isImage: window.ZELDA_FILES[filePath].isImage || false
          };
        } else {
          if (!curr.children[part]) {
            curr.children[part] = {
              name: part,
              path: curPath,
              type: 'folder',
              children: {}
            };
          }
          curr = curr.children[part];
        }
      }
    }

    function renderNode(node, depth = 0) {
      const items = Object.values(node.children).sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

      let html = `<ul class="ide-tree-list ${depth === 0 ? 'ide-tree-root' : ''}">`;
      for (const item of items) {
        if (item.type === 'folder') {
          const isAutoOpen = ['src', 'src/app', 'src/app/pages', 'src/app/pages/materials', 'src/app/services'].includes(item.path);
          html += `
            <li class="ide-tree-item ide-folder ${isAutoOpen ? 'open' : ''}" data-path="${item.path}">
              <div class="ide-tree-row ide-folder-row" tabindex="0">
                <span class="ide-arrow">${isAutoOpen ? '▼' : '▶'}</span>
                <span class="ide-icon">${isAutoOpen ? '📂' : '📁'}</span>
                <span class="ide-name">${item.name}</span>
              </div>
              ${renderNode(item, depth + 1)}
            </li>`;
        } else {
          let badgeClass = 'badge-other';
          if (item.ext === 'ts') badgeClass = 'badge-ts';
          else if (item.ext === 'html') badgeClass = 'badge-html';
          else if (item.ext === 'scss' || item.ext === 'css') badgeClass = 'badge-scss';
          else if (item.ext === 'json') badgeClass = 'badge-json';

          const isKey = [
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
          ].includes(item.path);

          html += `
            <li class="ide-tree-item ide-file ${item.path === currentOpenFilePath ? 'active' : ''} ${isKey ? 'key-file' : ''}" data-path="${item.path}">
              <div class="ide-tree-row ide-file-row" tabindex="0">
                <span class="ide-file-badge ${badgeClass}">${(item.ext || '').toUpperCase()}</span>
                <span class="ide-name">${item.name}</span>
                ${isKey ? '<span class="ide-star" title="Archivo clave examen">★</span>' : ''}
              </div>
            </li>`;
        }
      }
      html += '</ul>';
      return html;
    }

    treeContainer.innerHTML = renderNode(root, 0);

    // Bind Folder expand / collapse
    treeContainer.querySelectorAll('.ide-folder-row').forEach(row => {
      row.addEventListener('click', (e) => {
        e.stopPropagation();
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

    // Bind File click in tree
    treeContainer.querySelectorAll('.ide-file-row').forEach(row => {
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        const fileItem = row.closest('.ide-file');
        if (fileItem && fileItem.dataset.path) {
          openFileInIde(fileItem.dataset.path);
        }
      });
    });
  }

  // OPEN FILE IN IDE
  function openFileInIde(filePath) {
    const fileData = window.ZELDA_FILES ? window.ZELDA_FILES[filePath] : null;
    if (!fileData) return;
    currentOpenFilePath = filePath;

    // Update tree active selection & expand parent folders
    document.querySelectorAll('.ide-tree-item.ide-file').forEach(el => {
      if (el.dataset.path === filePath) {
        el.classList.add('active');
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

    // Breadcrumbs
    const breadcrumbEl = document.getElementById('ideBreadcrumbPath');
    if (breadcrumbEl) breadcrumbEl.innerText = filePath.replace(/\//g, ' › ');

    // Stats Pill
    const statsEl = document.getElementById('ideFileStats');
    if (statsEl) {
      statsEl.innerText = fileData.isImage
        ? 'Archivo de Imagen'
        : fileData.linesCount + ' líneas • ' + (fileData.content.length / 1024).toFixed(1) + ' KB';
    }

    // Lang Pill
    const langEl = document.getElementById('ideFileLang');
    if (langEl) langEl.innerText = fileData.ext ? fileData.ext.toUpperCase() : 'CODE';

    // Code & Line Numbers
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

    // Update open tabs
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

      html += `
        <div class="ide-tab ${isActive ? 'active' : ''}" data-path="${path}">
          <span class="tab-badge ${badgeClass}">${file.ext.toUpperCase()}</span>
          <span class="tab-title">${file.name}</span>
          <span class="tab-close" data-close="${path}" title="Cerrar pestaña">&times;</span>
        </div>`;
    });
    tabsBar.innerHTML = html;

    // Tabs Click Listeners
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

  // Synchronize Line Numbers with Code Scroll
  const codeScroll = document.getElementById('ideCodeScroll');
  const lineNumbers = document.getElementById('ideLineNumbers');
  codeScroll?.addEventListener('scroll', () => {
    if (lineNumbers) lineNumbers.scrollTop = codeScroll.scrollTop;
  });

  // Quick Pills click
  document.querySelectorAll('.quick-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const path = pill.dataset.path;
      if (path) openFileInIde(path);
    });
  });

  // Expand / Collapse all button
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

  // Real-time File Filter Input
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
        // Open parent folders to show match
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

  // Initialize Dynamic Tree and load initial file (with retry safeguard)
  function tryInitTree(attempts = 0) {
    if (window.ZELDA_FILES) {
      buildTreeAndRender();
      openFileInIde(currentOpenFilePath);
    } else if (attempts < 30) {
      setTimeout(() => tryInitTree(attempts + 1), 50);
    }
  }
  tryInitTree();
}
