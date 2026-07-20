import fs from 'node:fs';
import path from 'node:path';

type Heading = {
  id: string;
  text: string;
  level: number;
};

export type RenderedMarkdown = {
  html: string;
  headings: Heading[];
};

type ContentLanguage = 'en' | 'fa';

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const escapeAttribute = escapeHtml;

const stripTags = (value: string) => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

const getAttr = (source: string, attr: string) => {
  const match = source.match(new RegExp(`${attr}\\s*:\\s*(['"])(.*?)\\1|${attr}=(['"])(.*?)\\3`, 'i'));
  return match?.[2] ?? match?.[4] ?? '';
};

const getCodeVariant = (source: string) => {
  if (/\bprefer\b/i.test(source)) {
    return 'prefer';
  }

  if (/\bavoid\b/i.test(source)) {
    return 'avoid';
  }

  return '';
};

const contentDirectory = path.join(process.cwd(), 'app', 'content');
const defaultContentLanguage: ContentLanguage = 'en';

const normalizeCodeBody = (value: string) => {
  const lines = value.replace(/\r\n/g, '\n').split('\n');

  while (lines.length && !lines[0].trim()) {
    lines.shift();
  }

  while (lines.length && !lines[lines.length - 1].trim()) {
    lines.pop();
  }

  const indents = lines.filter((line) => line.trim()).map((line) => line.match(/^\s*/)?.[0].length ?? 0);
  const minIndent = indents.length ? Math.min(...indents) : 0;

  return lines.map((line) => line.slice(minIndent)).join('\n');
};

const normalizeLanguage = (value: string) => {
  const language = value.toLowerCase();

  if (['angular-ts', 'typescript'].includes(language)) {
    return 'ts';
  }

  if (['angular-html'].includes(language)) {
    return 'html';
  }

  if (['shell', 'bash', 'sh', 'zsh'].includes(language)) {
    return 'shell';
  }

  return language;
};

const inferLanguage = (attrs: string) => {
  const explicit = getAttr(attrs, 'language');

  if (explicit) {
    return normalizeLanguage(explicit);
  }

  const sourcePath = getAttr(attrs, 'path') || getAttr(attrs, 'header');
  const extension = sourcePath.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'ts':
      return 'ts';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'sh':
      return 'shell';
    default:
      return '';
  }
};

const getContentFilePath = (language: ContentLanguage, relativePath: string) =>
  path.join(contentDirectory, language, relativePath);

const getCodeFromPath = (sourcePath: string, language: ContentLanguage) => {
  if (!sourcePath) {
    return '';
  }

  const relativePath = sourcePath
    .replace(/^adev\/src\/content\//, '')
    .replace(/^src\/content\//, '')
    .replaceAll('/', path.sep);
  const preferredPath = getContentFilePath(language, relativePath);
  const fallbackPath = getContentFilePath(defaultContentLanguage, relativePath);
  const filePath = fs.existsSync(preferredPath) ? preferredPath : fallbackPath;

  if (!filePath.startsWith(contentDirectory) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return '';
  }

  return fs.readFileSync(filePath, 'utf8');
};

type TokenPattern = {
  regex: RegExp;
  className: string;
};

const tokenize = (code: string, patterns: TokenPattern[]) => {
  let output = '';
  let position = 0;

  while (position < code.length) {
    const token = patterns
      .map((pattern) => {
        pattern.regex.lastIndex = position;
        const match = pattern.regex.exec(code);
        return match?.index === position ? { className: pattern.className, value: match[0] } : undefined;
      })
      .find(Boolean);

    if (token) {
      output += `<span class="token ${token.className}">${escapeHtml(token.value)}</span>`;
      position += token.value.length;
    } else {
      output += escapeHtml(code[position]);
      position += 1;
    }
  }

  return output;
};

const highlightMarkup = (code: string) =>
  tokenize(code, [
    { regex: /<!--[\s\S]*?-->/gy, className: 'comment' },
    { regex: /<\/?[\w-]+/gy, className: 'tag' },
    { regex: /\s[\w:[\]().-]+(?=\=)/gy, className: 'attr' },
    { regex: /"[^"]*"|'[^']*'/gy, className: 'string' },
  ]);

const highlightScript = (code: string) =>
  tokenize(code, [
    { regex: /\/\/[^\n]*/gy, className: 'comment' },
    { regex: /\/\*[\s\S]*?\*\//gy, className: 'comment' },
    { regex: /`(?:\\[\s\S]|[^`\\])*`/gy, className: 'string' },
    { regex: /"(?:\\.|[^"\\])*"/gy, className: 'string' },
    { regex: /'(?:\\.|[^'\\])*'/gy, className: 'string' },
    { regex: /@[A-Za-z_]\w*/gy, className: 'decorator' },
    {
      regex:
        /\b(import|from|export|default|const|let|var|return|if|else|for|while|switch|case|break|continue|class|extends|new|function|async|await|type|interface|implements|public|private|protected|readonly|static|constructor|this|true|false|null|undefined)\b/gy,
      className: 'keyword',
    },
    { regex: /\b\d+(?:\.\d+)?\b/gy, className: 'number' },
  ]);

const highlightShell = (code: string) =>
  tokenize(code, [
    { regex: /#[^\n]*/gy, className: 'comment' },
    { regex: /"(?:\\.|[^"\\])*"/gy, className: 'string' },
    { regex: /'(?:\\.|[^'\\])*'/gy, className: 'string' },
    { regex: /(?<!\S)--?[\w-]+/gy, className: 'flag' },
    { regex: /\b(npm|pnpm|yarn|bun|ng|cd|sudo|source|node|npx)\b/gy, className: 'command' },
    { regex: /<[^>\n]+>/gy, className: 'variable' },
  ]);

const highlightCode = (code: string, language: string) => {
  const normalizedLanguage = normalizeLanguage(language);
  let highlighted = '';

  if (['html', 'xml'].includes(normalizedLanguage)) {
    highlighted = highlightMarkup(code);
  } else if (['ts', 'js', 'json', 'css'].includes(normalizedLanguage)) {
    highlighted = highlightScript(code);
  } else if (normalizedLanguage === 'shell') {
    highlighted = highlightShell(code);
  } else {
    highlighted = escapeHtml(code);
  }

  return highlighted.replace(/\n/g, '&#10;');
};

const renderCodeBlock = (code: string, language = '', header = '', variant = '') => {
  const normalizedCode = normalizeCodeBody(code);
  const normalizedLanguage = normalizeLanguage(language);
  const normalizedVariant = variant === 'prefer' || variant === 'avoid' ? variant : '';
  const label = normalizedVariant ? normalizedVariant.toUpperCase() : header || normalizedLanguage;
  const classes = ['doc-code', normalizedVariant ? `doc-code-${normalizedVariant}` : ''].filter(Boolean).join(' ');

  return `<figure class="${classes}" data-language="${escapeHtml(normalizedLanguage)}"${
    normalizedVariant ? ` data-code-variant="${normalizedVariant}"` : ''
  }>${
    label
      ? `<figcaption><span class="doc-code-heading"><span class="doc-code-label">${escapeHtml(label)}</span>${
          normalizedVariant && header ? `<span class="doc-code-title">${escapeHtml(header)}</span>` : ''
        }</span><button type="button" class="doc-code-copy">Copy</button></figcaption>`
      : `<figcaption><span></span><button type="button" class="doc-code-copy">Copy</button></figcaption>`
  }<pre><code class="language-${escapeHtml(normalizedLanguage)}">${highlightCode(
    normalizedCode,
    normalizedLanguage,
  )}</code></pre></figure>`;
};

const renderDocsCode = (attrs: string, body: string, language: ContentLanguage) => {
  const code = normalizeCodeBody(body) || getCodeFromPath(getAttr(attrs, 'path'), language);
  const header = getAttr(attrs, 'header');

  return renderCodeBlock(code, inferLanguage(attrs), header, getCodeVariant(attrs));
};

const getFileKind = (header: string, language: string) => {
  const normalizedLanguage = normalizeLanguage(language);
  const normalizedHeader = header.toLowerCase();

  if (['html', 'css', 'js', 'ts'].includes(normalizedLanguage)) {
    return normalizedLanguage;
  }

  if (normalizedHeader.endsWith('.html')) {
    return 'html';
  }

  if (normalizedHeader.endsWith('.css')) {
    return 'css';
  }

  if (normalizedHeader.endsWith('.js')) {
    return 'js';
  }

  if (normalizedHeader.endsWith('.ts')) {
    return 'ts';
  }

  return normalizedLanguage;
};

const getPreviewHtml = (examples: { code: string; header: string; language: string; kind: string }[]) => {
  const html = examples.find((example) => example.kind === 'html')?.code;

  if (!html) {
    return '';
  }

  const css = examples
    .filter((example) => example.kind === 'css')
    .map((example) => example.code)
    .join('\n');
  const js = examples
    .filter((example) => example.kind === 'js')
    .map((example) => example.code)
    .join('\n');

  const previewBody = sanitizeAngularTemplateForPreview(html);

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      html { color-scheme: light dark; }
      body {
        margin: 0;
        min-height: 100vh;
        background: #fff;
        color: #18181b;
        font-family: Arial, Helvetica, sans-serif;
        padding: 32px;
      }
      :root[data-theme='dark'] body {
        background: #0f1014;
        color: #f4f4f5;
      }
      *, *::before, *::after { box-sizing: border-box; }
      ${css}
    </style>
    <script>
      addEventListener('message', (event) => {
        if (event.data?.type === 'docs-theme') {
          document.documentElement.dataset.theme = event.data.theme === 'dark' ? 'dark' : 'light';
        }
      });
    <\/script>
  </head>
  <body>
    ${previewBody}
    ${js ? `<script>${js}<\/script>` : ''}
  </body>
</html>`;
};

const sanitizeAngularTemplateForPreview = (source: string) => {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const output: string[] = [];
  let skippedBlockDepth = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    const opens = (line.match(/\{/g) ?? []).length;
    const closes = (line.match(/\}/g) ?? []).length;

    if (skippedBlockDepth > 0) {
      skippedBlockDepth += opens - closes;
      continue;
    }

    if (/^@(if|else|for|switch|case|default|defer|placeholder|loading|error|empty)\b/.test(trimmed)) {
      skippedBlockDepth = Math.max(opens - closes, 0);
      continue;
    }

    if (trimmed === '}') {
      continue;
    }

    output.push(
      line
        .replace(/\s(?:\[|\(|\[\()[^\s=]+(?:\]|\)|\]\))="[^"]*"/g, '')
        .replace(/\s\*[\w-]+="[^"]*"/g, '')
        .replace(/\s#[\w-]+(?:="[^"]*")?/g, '')
        .replace(/\{\{[^}]*\}\}/g, ''),
    );
  }

  return output.join('\n');
};

const renderDocsCodeTabs = (attrs: string, body: string, language: ContentLanguage) => {
  const examples = [
    ...body.matchAll(/<docs-code([^>]*?)>([\s\S]*?)<\/docs-code>|<docs-code([^>]*?)\/>/g),
  ].map((match) => {
    const attrs = match[1] ?? match[3] ?? '';
    const header = getAttr(attrs, 'header') || getAttr(attrs, 'language') || 'Code';
    const code = normalizeCodeBody(match[2] ?? '') || getCodeFromPath(getAttr(attrs, 'path'), language);

    return {
      code,
      header,
      language: inferLanguage(attrs),
      variant: getCodeVariant(attrs),
      kind: getFileKind(header, inferLanguage(attrs)),
    };
  });

  if (!examples.length) {
    return '';
  }

  const previewHtml = getPreviewHtml(examples);
  const hasPreview = Boolean(previewHtml) && (/\bpreview\b/i.test(attrs) || examples.length > 1);
  const previewSrc = hasPreview ? `data:text/html;charset=utf-8,${encodeURIComponent(previewHtml)}` : '';

  return `<section class="doc-code-tabs${hasPreview ? ' has-preview show-preview' : ''}"${
    hasPreview ? ` data-code-view="preview"` : ''
  }>${
    hasPreview
      ? `<div class="doc-code-preview-toolbar"><button type="button" class="doc-code-view-toggle" data-code-view-toggle><span class="doc-code-view-icon" aria-hidden="true">&lt;&gt;</span><span data-code-view-label>Show Code</span></button></div><iframe class="doc-code-preview" title="Code preview" sandbox="allow-scripts allow-forms" src="${escapeAttribute(
          previewSrc,
        )}"></iframe>`
      : ''
  }<div class="doc-code-tabs-code">${examples
    .map(
      (example, index) =>
        `<button type="button" class="doc-code-tab${
          index === 0 ? ' active' : ''
        }" data-code-tab="${index}" aria-selected="${index === 0}">${escapeHtml(example.header)}</button>`,
    )
    .join('')}<div class="doc-code-tab-panels">${examples
    .map(
      (example, index) =>
        `<div class="doc-code-tab-panel${
          index === 0 ? ' active' : ''
        }" data-code-panel="${index}">${renderCodeBlock(example.code, example.language, '', example.variant)}</div>`,
    )
    .join('')}</div></div></section>`;
};

const renderInline = (value: string) => {
  let output = escapeHtml(value);

  output = output.replace(/`([^`]+)`/g, '<code>$1</code>');
  output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  output = output.replace(/_([^_]+)_/g, '<em>$1</em>');
  output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, href: string) => {
    const normalizedHref = href.startsWith('http') || href.startsWith('/') ? href : `/${href}`;
    return `<a href="${escapeHtml(normalizedHref)}">${label}</a>`;
  });

  return output;
};

const splitMarkdownTableRow = (line: string) => {
  const trimmed = line.trim();

  if (!trimmed.includes('|')) {
    return null;
  }

  const source = trimmed.replace(/^\|/, '').replace(/\|$/, '');
  const cells: string[] = [];
  let cell = '';
  let inCode = false;
  let escaped = false;

  for (const character of source) {
    if (escaped) {
      cell += character;
      escaped = false;
      continue;
    }

    if (character === '\\') {
      cell += character;
      escaped = true;
      continue;
    }

    if (character === '`') {
      inCode = !inCode;
      cell += character;
      continue;
    }

    if (character === '|' && !inCode) {
      cells.push(cell.trim());
      cell = '';
      continue;
    }

    cell += character;
  }

  cells.push(cell.trim());
  return cells.length > 1 ? cells : null;
};

const isMarkdownTableSeparator = (line: string) => {
  const cells = splitMarkdownTableRow(line);

  return Boolean(cells?.length && cells.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s+/g, ''))));
};

const renderMarkdownTable = (header: string[], rows: string[][]) => {
  const columnCount = header.length;
  const normalizeCells = (cells: string[]) =>
    Array.from({ length: columnCount }, (_value, index) => cells[index] ?? '');

  return `<div class="doc-table"><table><thead><tr>${normalizeCells(header)
    .map((cell) => `<th>${renderInline(cell)}</th>`)
    .join('')}</tr></thead><tbody>${rows
    .map(
      (row) =>
        `<tr>${normalizeCells(row)
          .map((cell) => `<td>${renderInline(cell)}</td>`)
          .join('')}</tr>`,
    )
    .join('')}</tbody></table></div>`;
};

const renderCustomBlocks = (source: string, language: ContentLanguage) => {
  let output = source;

  output = output.replace(
    /<docs-code-multifile([^>]*)>([\s\S]*?)<\/docs-code-multifile>/g,
    (_match, attrs: string, body: string) => renderDocsCodeTabs(attrs, body, language),
  );

  output = output.replace(
    /<docs-code([^>]*?)>([\s\S]*?)<\/docs-code>|<docs-code([^>]*?)\/>/g,
    (_match, attrs: string, body: string, selfClosingAttrs: string) =>
      renderDocsCode(attrs ?? selfClosingAttrs ?? '', body ?? '', language),
  );

  output = output.replace(
    /<docs-decorative-header([^>]*)>([\s\S]*?)<\/docs-decorative-header>/g,
    (_match, attrs: string, body: string) => {
      const title = getAttr(attrs, 'title');
      const summary = stripTags(body.replace(/<!--[\s\S]*?-->/g, ''));
      return `<section class="doc-hero"><h1>${escapeHtml(
        title,
      )}</h1>${summary ? `<div>${renderInline(summary)}</div>` : ''}</section>`;
    },
  );

  output = output.replace(
    /<docs-card-container([^>]*)>([\s\S]*?)<\/docs-card-container>/g,
    (_match, attrs: string, body: string) => {
      const title = getAttr(attrs, 'headerTitle');
      return `<section class="doc-card-section">${
        title ? `<h2>${escapeHtml(title)}</h2>` : ''
      }<div class="doc-card-grid">${body}</div></section>`;
    },
  );

  output = output.replace(
    /<docs-nav-card([^>]*)>([\s\S]*?)<\/docs-nav-card>/g,
    (_match, attrs: string, body: string) => {
      const title = getAttr(attrs, 'title');
      return `<section class="doc-card-section">${
        title ? `<h2>${escapeHtml(title)}</h2>` : ''
      }<div class="doc-card-grid">${body}</div></section>`;
    },
  );

  output = output.replace(
    /<docs-(?:nav-link|card)([^>]*)>([\s\S]*?)<\/docs-(?:nav-link|card)>/g,
    (_match, attrs: string, body: string) => {
      const title = getAttr(attrs, 'title');
      const href = getAttr(attrs, 'href');
      const link = getAttr(attrs, 'link');
      const normalizedHref = href ? (href.startsWith('http') || href.startsWith('/') ? href : `/${href}`) : '#';
      const summary = stripTags(body);
      return `<a class="doc-feature-card" href="${escapeHtml(normalizedHref)}"><strong>${escapeHtml(
        title,
      )}</strong>${summary ? `<span>${renderInline(summary)}</span>` : ''}${
        link ? `<small>${escapeHtml(link)}</small>` : ''
      }</a>`;
    },
  );

  output = output.replace(/<\/?docs-[^>]+>/g, '');

  return output;
};

export function renderMarkdown(markdown: string, language: ContentLanguage = defaultContentLanguage): RenderedMarkdown {
  const lines = renderCustomBlocks(markdown, language).replace(/\r\n/g, '\n').split('\n');
  const headings: Heading[] = [];
  const html: string[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let orderedList: string[] = [];
  let inCode = false;
  let codeLanguage = '';
  let codeAttrs = '';
  let code: string[] = [];
  const headingIds = new Map<string, number>();

  const closeParagraph = () => {
    if (!paragraph.length) {
      return;
    }

    html.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (list.length) {
      html.push(`<ul>${list.map((item) => `<li>${renderInline(item)}</li>`).join('')}</ul>`);
      list = [];
    }

    if (orderedList.length) {
      html.push(`<ol>${orderedList.map((item) => `<li>${renderInline(item)}</li>`).join('')}</ol>`);
      orderedList = [];
    }
  };

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    const codeFence = line.match(/^```([^\s{]*)\s*(.*)$/);
    if (codeFence) {
      if (inCode) {
        html.push(renderCodeBlock(code.join('\n'), codeLanguage, getAttr(codeAttrs, 'header'), getCodeVariant(codeAttrs)));
        code = [];
        inCode = false;
        codeLanguage = '';
        codeAttrs = '';
      } else {
        closeParagraph();
        closeList();
        inCode = true;
        codeLanguage = codeFence[1] ?? '';
        codeAttrs = codeFence[2] ?? '';
      }
      continue;
    }

    if (inCode) {
      code.push(line);
      continue;
    }

    if (!line.trim()) {
      closeParagraph();
      closeList();
      continue;
    }

    if (line.trim().startsWith('<')) {
      closeParagraph();
      closeList();
      html.push(line);
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      closeParagraph();
      closeList();
      const level = heading[1].length;
      const text = stripTags(heading[2].replace(/`([^`]+)`/g, '$1'));
      const baseId = slugify(text) || 'section';
      const usedCount = headingIds.get(baseId) ?? 0;
      const id = usedCount ? `${baseId}-${usedCount + 1}` : baseId;
      headingIds.set(baseId, usedCount + 1);
      if (level > 1) {
        headings.push({ id, text, level });
      }
      html.push(`<h${level} id="${id}">${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    const tableHeader = splitMarkdownTableRow(line);
    const nextLine = lines[lineIndex + 1] ?? '';
    if (tableHeader && isMarkdownTableSeparator(nextLine)) {
      const rows: string[][] = [];

      closeParagraph();
      closeList();
      lineIndex += 1;

      while (lineIndex + 1 < lines.length) {
        const row = splitMarkdownTableRow(lines[lineIndex + 1]);

        if (!row || isMarkdownTableSeparator(lines[lineIndex + 1])) {
          break;
        }

        rows.push(row);
        lineIndex += 1;
      }

      html.push(renderMarkdownTable(tableHeader, rows));
      continue;
    }

    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    if (unordered) {
      closeParagraph();
      list.push(unordered[1]);
      continue;
    }

    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (ordered) {
      closeParagraph();
      orderedList.push(ordered[1]);
      continue;
    }

    const callout = line.match(/^(TIP|IMPORTANT|NOTE|WARNING|CRITICAL|HELPFUL):\s+(.+)$/);
    if (callout) {
      closeParagraph();
      closeList();
      const calloutType = callout[1].toLowerCase();

      html.push(
        `<aside class="doc-callout doc-callout-${calloutType}"><strong>${callout[1]}</strong><p>${renderInline(callout[2])}</p></aside>`,
      );
      continue;
    }

    paragraph.push(line.trim());
  }

  closeParagraph();
  closeList();

  return { html: html.join('\n'), headings };
}
