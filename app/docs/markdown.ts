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

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const stripTags = (value: string) => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getAttr = (source: string, attr: string) => {
  const match = source.match(new RegExp(`${attr}="([^"]*)"`, 'i'));
  return match?.[1] ?? '';
};

const contentDirectory = path.join(process.cwd(), 'app', 'content');

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

const getCodeFromPath = (sourcePath: string) => {
  if (!sourcePath) {
    return '';
  }

  const relativePath = sourcePath
    .replace(/^adev\/src\/content\//, '')
    .replace(/^src\/content\//, '')
    .replaceAll('/', path.sep);
  const filePath = path.join(contentDirectory, relativePath);

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

const renderCodeBlock = (code: string, language = '', header = '') => {
  const normalizedCode = normalizeCodeBody(code);
  const normalizedLanguage = normalizeLanguage(language);
  const label = header || normalizedLanguage;

  return `<figure class="doc-code" data-language="${escapeHtml(normalizedLanguage)}">${
    label
      ? `<figcaption><span>${escapeHtml(label)}</span><button type="button" class="doc-code-copy">Copy</button></figcaption>`
      : `<figcaption><span></span><button type="button" class="doc-code-copy">Copy</button></figcaption>`
  }<pre><code class="language-${escapeHtml(normalizedLanguage)}">${highlightCode(
    normalizedCode,
    normalizedLanguage,
  )}</code></pre></figure>`;
};

const renderDocsCode = (attrs: string, body: string) => {
  const code = normalizeCodeBody(body) || getCodeFromPath(getAttr(attrs, 'path'));
  const header = getAttr(attrs, 'header');

  return renderCodeBlock(code, inferLanguage(attrs), header);
};

const renderDocsCodeTabs = (body: string) => {
  const examples = [
    ...body.matchAll(/<docs-code([^>]*?)>([\s\S]*?)<\/docs-code>|<docs-code([^>]*?)\/>/g),
  ].map((match) => {
    const attrs = match[1] ?? match[3] ?? '';
    const header = getAttr(attrs, 'header') || getAttr(attrs, 'language') || 'Code';
    const code = normalizeCodeBody(match[2] ?? '') || getCodeFromPath(getAttr(attrs, 'path'));

    return {
      code,
      header,
      language: inferLanguage(attrs),
    };
  });

  if (!examples.length) {
    return '';
  }

  return `<section class="doc-code-tabs">${examples
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
        }" data-code-panel="${index}">${renderCodeBlock(example.code, example.language)}</div>`,
    )
    .join('')}</div></section>`;
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

const renderCustomBlocks = (source: string) => {
  let output = source;

  output = output.replace(
    /<docs-code-multifile[^>]*>([\s\S]*?)<\/docs-code-multifile>/g,
    (_match, body: string) => renderDocsCodeTabs(body),
  );

  output = output.replace(
    /<docs-code([^>]*?)>([\s\S]*?)<\/docs-code>|<docs-code([^>]*?)\/>/g,
    (_match, attrs: string, body: string, selfClosingAttrs: string) =>
      renderDocsCode(attrs ?? selfClosingAttrs ?? '', body ?? ''),
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

export function renderMarkdown(markdown: string): RenderedMarkdown {
  const lines = renderCustomBlocks(markdown).replace(/\r\n/g, '\n').split('\n');
  const headings: Heading[] = [];
  const html: string[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let orderedList: string[] = [];
  let inCode = false;
  let codeLanguage = '';
  let code: string[] = [];

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

  for (const line of lines) {
    const codeFence = line.match(/^```([\w-]*)/);
    if (codeFence) {
      if (inCode) {
        html.push(renderCodeBlock(code.join('\n'), codeLanguage));
        code = [];
        inCode = false;
        codeLanguage = '';
      } else {
        closeParagraph();
        closeList();
        inCode = true;
        codeLanguage = codeFence[1] ?? '';
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
      const id = slugify(text);
      if (level > 1) {
        headings.push({ id, text, level });
      }
      html.push(`<h${level} id="${id}">${renderInline(heading[2])}</h${level}>`);
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

    const callout = line.match(/^(TIP|IMPORTANT|NOTE|WARNING|CRITICAL):\s+(.+)$/);
    if (callout) {
      closeParagraph();
      closeList();
      html.push(`<aside class="doc-callout"><strong>${callout[1]}</strong><p>${renderInline(callout[2])}</p></aside>`);
      continue;
    }

    paragraph.push(line.trim());
  }

  closeParagraph();
  closeList();

  return { html: html.join('\n'), headings };
}
