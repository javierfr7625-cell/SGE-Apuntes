import fs from 'node:fs';
import path from 'node:path';
import hljs from './highlighter.js';

const baseDir = path.resolve('../Simulacro/ionic-simulacro-zelda-master');
const imageExtensions = ['.png', '.jpg', '.jpeg', '.avif', '.svg', '.ico'];

function getLanguage(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.ts') return 'typescript';
  if (ext === '.html') return 'xml';
  if (ext === '.scss' || ext === '.css') return 'scss';
  if (ext === '.json') return 'json';
  if (ext === '.js' || ext === '.mts') return 'javascript';
  return 'plaintext';
}

function scanDirectory(dir, relPath = '') {
  let nodes = [];
  const items = fs.readdirSync(dir);
  // Sort directories first, then files alphabetically
  items.sort((a, b) => {
    const isDirA = fs.statSync(path.join(dir, a)).isDirectory();
    const isDirB = fs.statSync(path.join(dir, b)).isDirectory();
    if (isDirA && !isDirB) return -1;
    if (!isDirA && isDirB) return 1;
    return a.localeCompare(b);
  });

  for (const item of items) {
    if (item === 'node_modules' || item === '.git' || item === '.angular') continue;
    const fullPath = path.join(dir, item);
    const itemRel = relPath ? `${relPath}/${item}` : item;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      nodes.push({
        type: 'folder',
        name: item,
        path: itemRel,
        children: scanDirectory(fullPath, itemRel)
      });
    } else {
      const ext = path.extname(item).toLowerCase();
      const isImage = imageExtensions.includes(ext);
      let content = '';
      let highlighted = '';
      let linesCount = 0;

      if (!isImage && item !== 'package-lock.json') {
        content = fs.readFileSync(fullPath, 'utf-8');
        linesCount = content.split('\n').length;
        const lang = getLanguage(item);
        try {
          if (lang !== 'plaintext') {
            highlighted = hljs.highlight(content, { language: lang, ignoreIllegals: true }).value;
          } else {
            highlighted = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          }
        } catch (e) {
          highlighted = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
      }

      nodes.push({
        type: 'file',
        name: item,
        path: itemRel,
        ext: ext.replace('.', ''),
        isImage,
        linesCount,
        content,
        highlighted
      });
    }
  }
  return nodes;
}

const tree = scanDirectory(baseDir);

// Build flat dictionary for quick file lookup
const fileMap = {};
function populateMap(nodes) {
  for (const node of nodes) {
    if (node.type === 'file') {
      fileMap[node.path] = {
        name: node.name,
        path: node.path,
        ext: node.ext,
        isImage: node.isImage,
        linesCount: node.linesCount,
        content: node.content,
        highlighted: node.highlighted
      };
    } else if (node.children) {
      populateMap(node.children);
    }
  }
}
populateMap(tree);

console.log(`Generated IDE tree with ${Object.keys(fileMap).length} files.`);
console.log(`Example key files:`);
console.log(`- src/main.ts: ${fileMap['src/main.ts']?.linesCount} lines`);
console.log(`- src/app/pages/materials/materials.page.ts: ${fileMap['src/app/pages/materials/materials.page.ts']?.linesCount} lines`);
console.log(`- src/app/pages/materials/materials.page.html: ${fileMap['src/app/pages/materials/materials.page.html']?.linesCount} lines`);
console.log(`- src/app/pages/inicio/inicio.page.ts: ${fileMap['src/app/pages/inicio/inicio.page.ts']?.linesCount} lines`);
console.log(`- src/app/components/menu/menu.component.html: ${fileMap['src/app/components/menu/menu.component.html']?.linesCount} lines`);

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/zelda-ide-data.json', JSON.stringify({ tree, fileMap }, null, 2), 'utf-8');
console.log('Saved data to src/data/zelda-ide-data.json');

const jsContent = 'window.ZELDA_FILES = ' + JSON.stringify(fileMap) + ';';
fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/zelda-files.js', jsContent, 'utf-8');
if (fs.existsSync('../zelda-files.js')) {
  fs.writeFileSync('../zelda-files.js', jsContent, 'utf-8');
}
console.log('Saved window.ZELDA_FILES to public/zelda-files.js and ../zelda-files.js');
