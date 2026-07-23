import Link from 'next/link';
import Image from 'next/image';
import { allDocs, getDocNeighbors, getRenderedDoc, isRtlLanguage, navigationSections, type DocEntry, type Language } from './data';
import type { NavigationItem } from '../routes';
import type { RenderedMarkdown } from './markdown';
import { DocsContentArea } from './DocsContentArea';
import { DocsSidebar } from './DocsSidebar';
import { LanguageSelect } from './LanguageSelect';
import { ThemeToggle } from './ThemeToggle';
import { localizeDocEntry, localizeNavigationItems, translateLabel } from './i18n';

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
      return [...ancestors, { label: item.label }];
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
  const currentDoc = localizeDocEntry(doc, language) ?? doc;
  const canonicalRendered = language === 'en' ? rendered : getRenderedDoc(doc, 'en');
  const useFallbackHero = !canonicalRendered?.html.includes('<h1');
  const previousDoc = localizeDocEntry(neighbors.previous, language);
  const nextDoc = localizeDocEntry(neighbors.next, language);
  const primaryNavigation = navigationSections.map((section) => ({
    label: translateLabel(section.label, language),
    href: getLocalizedHref(
      allDocs.find((item) => item.section === section.label && item.contentPath)?.href ?? '/overview',
      language,
    ),
    isActive: section.label === doc.section,
    disabled: section.status === 'disabled',
  }));
  const isRtl = isRtlLanguage(language);

  return (
    <div className={['docs-app', isRtl ? 'rtl' : ''].join(' ')} dir={isRtl ? 'rtl' : 'ltr'} lang={language}>
      <header className="docs-header
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
              section.disabled ? (
                <span
                  key={section.label}
                  aria-disabled="true"
                  className="cursor-not-allowed px-2.5 py-5 text-sm font-semibold !text-gray-400 opacity-50"
                >
                  {section.label}
                </span>
              ) : (
                <Link
                  key={section.label}
                  href={section.href}
                  className={[
                    'px-2.5 py-5 text-sm font-semibold hover:!text-[var(--accent)]',
                    section.isActive ? 'border-b-[3px] border-b-[var(--accent)] !text-[var(--accent)]' : '!text-gray-500 ',
                  ].join(' ')}
                >
                  {section.label}
                </Link>
              )
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

        <DocsContentArea
          key={doc.href}
          breadcrumbItems={breadcrumbItems}
          docTitle={currentDoc.label}
          forceFallbackHero={useFallbackHero}
          rendered={rendered}
          previousDoc={previousDoc}
          nextDoc={nextDoc}
          language={language}
        />
      </div>
    </div>
  );
}
