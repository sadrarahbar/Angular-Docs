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
const publicDirectory = path.join(process.cwd(), 'public');
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
  const publicPath = path.join(publicDirectory, sourcePath.replace(/^\/?public\//, '').replace(/^\//, ''));
  const mirroredAssetPath = path.join(publicDirectory, 'assets', 'context', path.basename(sourcePath));
  const candidates = [preferredPath, fallbackPath, publicPath, mirroredAssetPath];

  const isWithinAllowedRoot = (filePath: string) =>
    [contentDirectory, publicDirectory].some((root) => {
      const relative = path.relative(root, filePath);
      return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
    });

  const filePath = candidates.find(
    (candidate) => isWithinAllowedRoot(candidate) && fs.existsSync(candidate) && fs.statSync(candidate).isFile(),
  );

  return filePath ? fs.readFileSync(filePath, 'utf8') : '';
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
    { regex: /\b(?:true|false|null|undefined|NaN|Infinity)\b/gy, className: 'boolean' },
    { regex: /\bthis\b/gy, className: 'this' },
    {
      regex:
        /\b(import|from|export|default|const|let|var|return|if|else|for|of|in|while|do|switch|case|break|continue|throw|try|catch|finally|class|extends|new|function|async|await|yield|type|interface|enum|namespace|implements|declare|abstract|public|private|protected|readonly|static|constructor|super|typeof|instanceof|keyof|as|satisfies|void|never|unknown|any|string|number|boolean)\b/gy,
      className: 'keyword',
    },
    { regex: /\b[A-Z][A-Za-z0-9_$]*\b/gy, className: 'type' },
    { regex: /\b[A-Za-z_$][\w$]*(?=\s*\()/gy, className: 'function' },
    { regex: /(?<=\.)[A-Za-z_$][\w$]*/gy, className: 'property' },
    { regex: /\b[A-Za-z_$][\w$]*(?=\s*:)/gy, className: 'property' },
    { regex: /\b[A-Za-z_$][\w$]*(?=\s*=)/gy, className: 'variable' },
    { regex: /===|!==|=>|==|!=|<=|>=|\?\?|\?\.|&&|\|\||\+\+|--|\*\*|[+\-*/%=&|!<>?:]/gy, className: 'operator' },
    { regex: /\b\d+(?:\.\d+)?\b/gy, className: 'number' },
  ]);

const highlightJson = (code: string) =>
  tokenize(code, [
    { regex: /"(?:\\.|[^"\\])*"(?=\s*:)/gy, className: 'property' },
    { regex: /"(?:\\.|[^"\\])*"/gy, className: 'string' },
    { regex: /\b(?:true|false|null)\b/gy, className: 'boolean' },
    { regex: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/gyi, className: 'number' },
    { regex: /:/gy, className: 'operator' },
  ]);

const highlightStylesheet = (code: string) =>
  tokenize(code, [
    { regex: /\/\*[\s\S]*?\*\//gy, className: 'comment' },
    { regex: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/gy, className: 'string' },
    { regex: /@[\w-]+/gy, className: 'keyword' },
    { regex: /--[\w-]+|[\w-]+(?=\s*:)/gy, className: 'property' },
    { regex: /#[\da-f]{3,8}\b/gyi, className: 'number' },
    { regex: /-?\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms|deg)?\b/gyi, className: 'number' },
    { regex: /[.#]?[A-Za-z_-][\w-]*(?=\s*[{,])/gy, className: 'selector' },
    { regex: /[>:~+]/gy, className: 'operator' },
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

const highlightMarkdown = (code: string) =>
  tokenize(code, [
    { regex: /<!--[\s\S]*?-->/gy, className: 'comment' },
    { regex: /^#{1,6}(?=\s)/gmy, className: 'heading' },
    { regex: /^[\t ]*(?:[-*+] |\d+\. )/gmy, className: 'list-marker' },
    { regex: /`[^`\n]+`/gy, className: 'inline-code' },
    { regex: /\[[^\]\n]+\]\([^)\n]+\)/gy, className: 'link' },
    { regex: /\*\*[^*\n]+\*\*/gy, className: 'bold' },
  ]);

const highlightCode = (code: string, language: string) => {
  const normalizedLanguage = normalizeLanguage(language);
  let highlighted = '';

  if (['html', 'xml'].includes(normalizedLanguage)) {
    highlighted = highlightMarkup(code);
  } else if (['ts', 'js'].includes(normalizedLanguage)) {
    highlighted = highlightScript(code);
  } else if (normalizedLanguage === 'json') {
    highlighted = highlightJson(code);
  } else if (normalizedLanguage === 'css') {
    highlighted = highlightStylesheet(code);
  } else if (['md', 'markdown'].includes(normalizedLanguage)) {
    highlighted = highlightMarkdown(code);
  } else if (normalizedLanguage === 'shell') {
    highlighted = highlightShell(code);
  } else {
    highlighted = escapeHtml(code);
  }

  return highlighted.replace(/\n/g, '&#10;');
};

const renderCodeBlock = (code: string, language = '', header = '', variant = '', compact = false) => {
  const normalizedCode = normalizeCodeBody(code);
  const normalizedLanguage = normalizeLanguage(language);
  const normalizedVariant = variant === 'prefer' || variant === 'avoid' ? variant : '';
  const label = normalizedVariant ? normalizedVariant.toUpperCase() : header || normalizedLanguage;
  const classes = ['doc-code', normalizedVariant ? `doc-code-${normalizedVariant}` : '', compact ? 'doc-code-compact' : '']
    .filter(Boolean)
    .join(' ');

  return `<figure class="${classes}" data-language="${escapeHtml(normalizedLanguage)}"${
    normalizedVariant ? ` data-code-variant="${normalizedVariant}"` : ''
  }>${
    compact
      ? ''
      : label
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

  const compact = /\bclass\s*=\s*(['"])[^'"]*\bcompact\b[^'"]*\1/i.test(attrs);

  return renderCodeBlock(code, inferLanguage(attrs), header, getCodeVariant(attrs), compact);
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
  }<div class="doc-code-tabs-code"><div class="doc-code-tab-navigation"><button type="button" class="doc-code-tab-arrow previous" data-code-tab-nav="previous" aria-label="Previous code tab"><span aria-hidden="true">‹</span></button><div class="doc-code-tab-list" role="tablist">${examples
    .map(
      (example, index) =>
        `<button type="button" class="doc-code-tab${
          index === 0 ? ' active' : ''
        }" data-code-tab="${index}" role="tab" aria-selected="${index === 0}">${escapeHtml(example.header)}</button>`,
    )
    .join('')}</div><button type="button" class="doc-code-tab-arrow next" data-code-tab-nav="next" aria-label="Next code tab"><span aria-hidden="true">›</span></button></div><div class="doc-code-tab-panels">${examples
    .map(
      (example, index) =>
        `<div class="doc-code-tab-panel${
          index === 0 ? ' active' : ''
        }" data-code-panel="${index}">${renderCodeBlock(example.code, example.language, '', example.variant)}</div>`,
    )
    .join('')}</div></div></section>`;
};

const renderInline = (value: string): string => {
  const anchors: { attrs: string; body: string }[] = [];
  const markdownLinks: { label: string; href: string }[] = [];
  let source = value.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (_match, attrs: string, body: string) => {
    const index = anchors.push({ attrs, body }) - 1;
    return `@@DOCSANCHOR${index}@@`;
  });

  source = source.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, href: string) => {
    const index = markdownLinks.push({ label, href }) - 1;
    return `@@DOCSLINK${index}@@`;
  });

  let output = escapeHtml(source);

  // Preserve explicit Markdown line breaks without allowing arbitrary inline HTML.
  output = output.replace(/&lt;br\s*\/?&gt;/gi, '<br>');
  output = output.replace(/`([^`]+)`/g, '<code>$1</code>');
  output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  output = output.replace(/_([^_]+)_/g, '<em>$1</em>');
  output = output.replace(/@@DOCSLINK(\d+)@@/g, (_match, rawIndex: string) => {
    const link = markdownLinks[Number(rawIndex)];

    if (!link) {
      return '';
    }

    const normalizedHref = /^(?:https?:|mailto:|\/|#)/i.test(link.href) ? link.href : `/${link.href}`;
    return `<a href="${escapeAttribute(normalizedHref)}">${renderInline(link.label)}</a>`;
  });

  output = output.replace(/@@DOCSANCHOR(\d+)@@/g, (_match, rawIndex: string) => {
    const anchor = anchors[Number(rawIndex)];

    if (!anchor) {
      return '';
    }

    const rawHref = getAttr(anchor.attrs, 'href');
    const href = /^(?:https?:|mailto:|\/|#)/i.test(rawHref) ? rawHref : '#';
    const target = getAttr(anchor.attrs, 'target') === '_blank' ? ' target="_blank" rel="noopener noreferrer"' : '';
    const hasDownload = /(?:^|\s)download(?:\s*=|\s|$)/i.test(anchor.attrs);
    const downloadName = getAttr(anchor.attrs, 'download');
    const download = hasDownload ? ` download${downloadName ? `="${escapeAttribute(downloadName)}"` : ''}` : '';

    return `<a href="${escapeAttribute(href)}"${target}${download}>${renderInline(anchor.body)}</a>`;
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
    /<docs-tab-group[^>]*>([\s\S]*?)<\/docs-tab-group>/g,
    (_match, body: string) => {
      const tabs = [...body.matchAll(/<docs-tab([^>]*)>([\s\S]*?)<\/docs-tab>/g)].map((tab) => ({
        label: getAttr(tab[1], 'label') || 'Tab',
        html: renderMarkdown(normalizeCodeBody(tab[2]), language).html,
      }));

      if (!tabs.length) {
        return '';
      }

      return `<section class="doc-code-tabs doc-content-tabs"><div class="doc-code-tabs-code"><div class="doc-code-tab-navigation"><button type="button" class="doc-code-tab-arrow previous" data-code-tab-nav="previous" aria-label="Previous tab"><span aria-hidden="true">‹</span></button><div class="doc-code-tab-list" role="tablist">${tabs
        .map(
          (tab, index) =>
            `<button type="button" class="doc-code-tab${index === 0 ? ' active' : ''}" data-code-tab="${index}" role="tab" aria-selected="${index === 0}">${renderInline(tab.label)}</button>`,
        )
        .join('')}</div><button type="button" class="doc-code-tab-arrow next" data-code-tab-nav="next" aria-label="Next tab"><span aria-hidden="true">›</span></button></div><div class="doc-code-tab-panels">${tabs
        .map(
          (tab, index) =>
            `<div class="doc-code-tab-panel${index === 0 ? ' active' : ''}" data-code-panel="${index}" role="tabpanel">${tab.html}</div>`,
        )
        .join('')}</div></div></section>`;
    },
  );

  output = output.replace(/<docs-callout([^>]*)>/g, (_match, attrs: string) => {
    const title = getAttr(attrs, 'title') || getAttr(attrs, 'header');
    const type = attrs.match(/\b(critical|important|helpful|warning|note|tip)\b/i)?.[1].toLowerCase() ?? 'helpful';

    return `<aside class="doc-callout docs-callout-block doc-callout-${type}">${
      title ? `<strong>${renderInline(title)}</strong>` : ''
    }`;
  });

  output = output.replace(/<\/docs-callout>/g, '</aside>');

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
        `<aside class="doc-callout doc-callout-${calloutType}"><strong>${callout[1]}:</strong><p>${renderInline(callout[2])}</p></aside>`,
      );
      continue;
    }

    paragraph.push(line.trim());
  }

  closeParagraph();
  closeList();

  return { html: html.join('\n'), headings };
}
