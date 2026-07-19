import Link from 'next/link';
import Image from 'next/image';
import { allDocs, getDocNeighbors, isRtlLanguage, navigationSections, type DocEntry, type Language } from './data';
import type { NavigationItem } from '../routes';
import type { RenderedMarkdown } from './markdown';
import { CodeInteractions } from './CodeInteractions';
import { DocsSidebar } from './DocsSidebar';
import { LanguageSelect } from './LanguageSelect';
import { TableOfContents } from './TableOfContents';
import { ThemeToggle } from './ThemeToggle';
import { localizeDocEntry, localizeNavigationItems, translateLabel, translateUi } from './i18n';

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
  const localizedSectionItems = localizeNavigationItems(sectionItems, language);
  const breadcrumbItems = getBreadcrumbItems(localizedSectionItems, doc.href);
  const previousDoc = localizeDocEntry(neighbors.previous, language);
  const nextDoc = localizeDocEntry(neighbors.next, language);
  const primaryNavigation = navigationSections.slice(0, 3).map((section) => ({
    label: translateLabel(section.label, language),
    href: getLocalizedHref(
      allDocs.find((item) => item.section === section.label && item.contentPath)?.href ?? '/overview',
      language,
    ),
    isActive: section.label === doc.section,
  }));
  const isRtl = isRtlLanguage(language);

  return (
    <div className={['docs-app', isRtl ? 'rtl' : ''].join(' ')} dir={isRtl ? 'rtl' : 'ltr'} lang={language}>
      <header className="
                flex items-center justify-between gap-6 
                sticky top-0 z-20 px-3 md:px-7 py-3 md:py-0 
                border-b border-[var(--line)] 
                bg-[var(--topbar-bg)]">

        {/* right */}
        <div className="flex items-center">
          <Link
            className="flex items-center gap-2.5 font-bold tracking-normal"
            href={getLocalizedHref('/overview', language)}
            aria-label="Angular documentation home"
          >
            <Image src="/logo.svg" width="32" height="32" alt="angular logo" />
            <span className="min-w-max">Angular Docs</span>
          </Link>
        </div>
          <nav className="hidden items-center gap-2.5 min-[821px]:flex" aria-label="Primary navigation">
            {primaryNavigation.map((section) => (
              <Link
                key={section.label}
                href={section.href}
                className={[
                  'px-2.5 py-5 text-sm font-semibold hover:!text-[var(--accent)]',
                  section.isActive ? 'border-b-[3px] dark:!text-white  border-b-red-800 ' : '!text-gray-500 ',
                ].join(' ')}
              >
                {section.label}
              </Link>
            ))}
          </nav>

        {/* left */}
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <LanguageSelect language={language} />
        </div>
      </header>

      <div className="docs-layout">
        <DocsSidebar
          section={translateLabel(doc.section, language)}
          items={localizedSectionItems}
          activeHref={doc.href}
          language={language}
          primaryNavigation={primaryNavigation}
        />

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
    </div>
  );
}
