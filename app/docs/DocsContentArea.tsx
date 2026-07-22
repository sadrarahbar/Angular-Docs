import Link from 'next/link';
import type { DocEntry, Language } from './data';
import type { RenderedMarkdown } from './markdown';
import { CodeInteractions } from './CodeInteractions';
import { TableOfContents } from './TableOfContents';
import { translateUi } from './i18n';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type DocsContentAreaProps = {
  breadcrumbItems: BreadcrumbItem[];
  rendered: RenderedMarkdown;
  previousDoc?: DocEntry;
  nextDoc?: DocEntry;
  language: Language;
};

const isExternal = (value?: string) => Boolean(value?.startsWith('http'));

const getLocalizedHref = (href: string, language: Language) => {
  if (isExternal(href) || language === 'en') {
    return href;
  }

  return `${href}?lang=${language}`;
};

export function DocsContentArea({ breadcrumbItems, rendered, previousDoc, nextDoc, language }: DocsContentAreaProps) {
  return (
    <div className="docs-content-layout">
      <main className="content-shell">
        <CodeInteractions />
        {breadcrumbItems.length ? (
          <nav className="doc-breadcrumb" aria-label="Breadcrumb">
            {breadcrumbItems.map((item, index) => (
              <span
                key={`${item.label}-${index}`}
                className="doc-breadcrumb-item"
                aria-current={index === breadcrumbItems.length - 1 ? 'page' : undefined}
              >
                {item.href ? <Link href={getLocalizedHref(item.href, language)}>{item.label}</Link> : <span>{item.label}</span>}
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
          {previousDoc ? (
            <Link href={getLocalizedHref(previousDoc.href, language)} className="page-link previous">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span>
                <small>{translateUi('previous', language)}</small>
                <strong>{previousDoc.label}</strong>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {nextDoc ? (
            <Link href={getLocalizedHref(nextDoc.href, language)} className="page-link next">
              <span>
                <small>{translateUi('next', language)}</small>
                <strong>{nextDoc.label}</strong>
              </span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </Link>
          ) : null}
        </footer>
      </main>

      <aside className="toc" aria-label={translateUi('onThisPage', language)}>
        <div className="toc-title">{translateUi('onThisPage', language)}</div>
        <TableOfContents headings={rendered.headings} noHeadingsLabel={translateUi('noHeadings', language)} />
      </aside>
    </div>
  );
}
