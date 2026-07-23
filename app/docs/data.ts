import fs from 'node:fs';
import path from 'node:path';
import {
  DOCS_SUB_NAVIGATION_DATA,
  FOOTER_NAVIGATION_DATA,
  REFERENCE_SUB_NAVIGATION_DATA,
  TUTORIALS_SUB_NAVIGATION_DATA,
  type NavigationItem,
} from '../routes';
import { renderMarkdown } from './markdown';

export const languages = ['en', 'fa'] as const;
export type Language = (typeof languages)[number];

export type DocEntry = NavigationItem & {
  href: string;
  section: string;
  depth: number;
};

const contentDirectory = path.join(process.cwd(), 'app', 'content');
const defaultLanguage: Language = 'en';

export const normalizeLanguage = (value?: string): Language =>
  value === 'fa' || value === 'en' ? value : defaultLanguage;

export const isRtlLanguage = (language: Language) => language === 'fa';

const getLocalizedContentPath = (language: Language, contentPath: string) =>
  path.join(contentDirectory, language, `${contentPath}.md`);

export const navigationSections = [
  { label: 'Docs', items: DOCS_SUB_NAVIGATION_DATA, status: 'active' },
  { label: 'Tutorials', items: TUTORIALS_SUB_NAVIGATION_DATA, status: 'disabled' },
  { label: 'Reference', items: REFERENCE_SUB_NAVIGATION_DATA, status: 'disabled' },
  { label: 'More', items: FOOTER_NAVIGATION_DATA, status: 'disabled' },
];

const isExternal = (value?: string) => Boolean(value?.startsWith('http'));

const normalizePath = (value?: string) => {
  if (!value || isExternal(value)) {
    return value ?? '';
  }

  return value.startsWith('/') ? value : `/${value}`;
};

const walkNavigation = (items: NavigationItem[], section: string, depth = 0): DocEntry[] =>
  items.flatMap((item) => {
    const self =
      item.path && !isExternal(item.path)
        ? [{ ...item, href: normalizePath(item.path), section, depth }]
        : [];
    const children = item.children ? walkNavigation(item.children, section, depth + 1) : [];
    return [...self, ...children];
  });

export const allDocs = navigationSections
  .filter((section) => section.status === 'active')
  .flatMap((section) => walkNavigation(section.items, section.label));

export const docsWithContent = allDocs.filter((item) => item.contentPath);

export const getDocBySlug = (slug: string[]) => {
  const href = `/${slug.join('/')}`;
  return docsWithContent.find((item) => item.href === href);
};

export const getFirstDoc = () => docsWithContent[0];

export const getDocNeighbors = (doc: DocEntry) => {
  const index = docsWithContent.findIndex((item) => item.href === doc.href);
  return {
    previous: index > 0 ? docsWithContent[index - 1] : undefined,
    next: index >= 0 && index < docsWithContent.length - 1 ? docsWithContent[index + 1] : undefined,
  };
};

export const getMarkdownForDoc = (doc: DocEntry, language: Language = defaultLanguage) => {
  if (!doc.contentPath) {
    return undefined;
  }

  const preferredPath = getLocalizedContentPath(language, doc.contentPath);
  const fallbackPath = getLocalizedContentPath(defaultLanguage, doc.contentPath);
  const filePath = fs.existsSync(preferredPath) ? preferredPath : fallbackPath;

  if (!filePath.startsWith(contentDirectory) || !fs.existsSync(filePath)) {
    return undefined;
  }

  return fs.readFileSync(filePath, 'utf8');
};

export const getRenderedDoc = (doc: DocEntry, language?: Language) => {
  const markdown = getMarkdownForDoc(doc, language);

  if (!markdown) {
    return undefined;
  }

  return renderMarkdown(markdown, language);
};
