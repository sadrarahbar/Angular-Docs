import Link from 'next/link';
import { allDocs, getDocNeighbors, isRtlLanguage, navigationSections, type DocEntry, type Language } from './data';
import type { NavigationItem } from '../routes';
import type { RenderedMarkdown } from './markdown';
import { CodeInteractions } from './CodeInteractions';
import { DocsSidebar } from './DocsSidebar';
import { LanguageSelect } from './LanguageSelect';
import { ThemeToggle } from './ThemeToggle';

type DocsShellProps = {
  doc: DocEntry;
  rendered: RenderedMarkdown;
  language: Language;
};

type BreadcrumbItem = {
  label: string;
  href?: string;
};

const isExternal = (value?: string) => Boolean(value?.startsWith('http'));

const normalizePath = (value?: string) => {
  if (!value || isExternal(value)) {
    return undefined;
  }

  return value.startsWith('/') ? value : `/${value}`;
};

const getLocalizedHref = (href: string, language: Language) => {
  if (isExternal(href) || language === 'en') {
    return href;
  }

  return `${href}?lang=${language}`;
};

const getBreadcrumbItems = (
  items: NavigationItem[],
  activeHref: string,
  ancestors: BreadcrumbItem[] = [],
): BreadcrumbItem[] => {
  for (const item of items) {
    const href = normalizePath(item.path);
    const breadcrumbItem = { label: item.label, href };

    if (href === activeHref) {
      return ancestors;
    }

    if (item.children?.length) {
      const childTrail = getBreadcrumbItems(item.children, activeHref, [...ancestors, breadcrumbItem]);

      if (childTrail.length) {
        return childTrail;
      }
    }
  }

  return [];
};

export function DocsShell({ doc, rendered, language }: DocsShellProps) {
  const neighbors = getDocNeighbors(doc);
  const sectionItems = navigationSections.find((section) => section.label === doc.section)?.items ?? [];
  const breadcrumbItems = getBreadcrumbItems(sectionItems, doc.href);
  const isRtl = isRtlLanguage(language);

  return (
    <div className={['docs-app', isRtl ? 'rtl' : ''].join(' ')} dir={isRtl ? 'rtl' : 'ltr'} lang={language}>
      <header className="topbar">
        <Link className="brand" href={getLocalizedHref('/overview', language)} aria-label="Angular documentation home">
          <span className="brand-mark">A</span>
          <span>Angular Docs</span>
        </Link>
        <div className="topbar-actions">
          <nav aria-label="Primary navigation">
            {navigationSections.slice(0, 3).map((section) => (
              <Link
                key={section.label}
                href={getLocalizedHref(
                  allDocs.find((item) => item.section === section.label && item.contentPath)?.href ?? '/overview',
                  language,
                )}
                className={section.label === doc.section ? 'topbar-link active' : 'topbar-link'}
              >
                {section.label}
              </Link>
            ))}
          </nav>
          <LanguageSelect language={language} />
          <ThemeToggle />
        </div>
      </header>

      <div className="docs-layout">
        <DocsSidebar section={doc.section} items={sectionItems} activeHref={doc.href} language={language} />

        <main className="content-shell">
          <CodeInteractions />
          {breadcrumbItems.length ? (
            <nav className="doc-breadcrumb" aria-label="Breadcrumb">
              {breadcrumbItems.map((item, index) => (
                <span key={`${item.label}-${index}`} className="doc-breadcrumb-item">
                  {item.href ? (
                    <Link href={getLocalizedHref(item.href, language)}>{item.label}</Link>
                  ) : (
                    <span>{item.label}</span>
                  )}
                  {index < breadcrumbItems.length - 1 ? (
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path d="m7.5 4.5 5.5 5.5-5.5 5.5" />
                    </svg>
                  ) : null}
                </span>
              ))}
            </nav>
          ) : null}
          <article className="doc-content" dangerouslySetInnerHTML={{ __html: rendered.html }} />

          <footer className="doc-pagination" aria-label="Document pagination">
            {neighbors.previous ? (
              <Link href={getLocalizedHref(neighbors.previous.href, language)} className="page-link previous">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span>
                  <small>Previous</small>
                  <strong>{neighbors.previous.label}</strong>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {neighbors.next ? (
              <Link href={getLocalizedHref(neighbors.next.href, language)} className="page-link next">
                <span>
                  <small>Next</small>
                  <strong>{neighbors.next.label}</strong>
                </span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </Link>
            ) : null}
          </footer>
        </main>

        <aside className="toc" aria-label="On this page">
          <div className="toc-title">On this page</div>
          {rendered.headings.length ? (
            <nav>
              {rendered.headings.slice(0, 12).map((heading) => (
                <a key={heading.id} href={`#${heading.id}`} className={`toc-link level-${heading.level}`}>
                  {heading.text}
                </a>
              ))}
            </nav>
          ) : (
            <p>No headings</p>
          )}
        </aside>
      </div>
    </div>
  );
}
