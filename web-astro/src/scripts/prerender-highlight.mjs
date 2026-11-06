import fs from 'node:fs';
import hljs from './highlighter.js';

export function highlightHtmlFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf-8');

  // Match all <pre...><code class="([^"]+)"...>...</code></pre>
  const codeBlockRegex = /(<pre[^>]*><code\s+class="([^"]+)"[^>]*>)([\s\S]*?)(<\/code><\/pre>)/g;

  let replacedCount = 0;
  html = html.replace(codeBlockRegex, (match, openTag, classAttr, rawCode, closeTag) => {
    // If it's tree view, nohighlight, or ALREADY HIGHLIGHTED, skip it!
    if (classAttr.includes('nohighlight') || openTag.includes('tree-content') || rawCode.includes('class="hljs-') || rawCode.includes("class='hljs-") || rawCode.includes('&lt;span class=')) {
      return match;
    }

    // Determine language
    let lang = 'typescript';
    if (classAttr.includes('language-bash')) lang = 'bash';
    else if (classAttr.includes('language-html') || classAttr.includes('language-xml')) lang = 'xml';
    else if (classAttr.includes('language-json')) lang = 'json';
    else if (classAttr.includes('language-css')) lang = 'css';
    else if (classAttr.includes('language-typescript')) lang = 'typescript';

    try {
      // Decode Astro JSX braces and HTML entities
      const decodedCode = rawCode
        .replace(/&#123;/g, '{')
        .replace(/&#125;/g, '}')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'");

      const highlighted = hljs.highlight(decodedCode, { language: lang, ignoreIllegals: true }).value;
      replacedCount++;
      return `${openTag}${highlighted}${closeTag}`;
    } catch (err) {
      console.error(`Error highlighting block with lang ${lang}:`, err.message);
      return match;
    }
  });

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log(`Pre-rendered syntax highlighting on ${filePath}: ${replacedCount} code blocks highlighted.`);
}

highlightHtmlFile('dist/index.html');
highlightHtmlFile('../index.html');
