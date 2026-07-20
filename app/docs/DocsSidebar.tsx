'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { NavigationItem } from '../routes';
import type { Language } from './data';
import { translateUi } from './i18n';
import { SidebarNavigation } from './SidebarNavigation';

type PrimaryNavigationItem = {
  label: string;
  href: string;
  isActive: boolean;
};

type DocsSidebarProps = {
  section: string;
  items: NavigationItem[];
  activeHref: string;
  language: Language;
  primaryNavigation: PrimaryNavigationItem[];
};

export function DocsSidebar({ section, items, activeHref, language, primaryNavigation }: DocsSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarTitle = language === 'fa' ? `${translateUi('menu', language)} ${section}` : `${section} ${translateUi('menu', language)}`;

  return (
    <>
      <div className={['mobile-menu-strip', language === 'fa' ? 'flex-row-reverse' : ''].join(' ')}>
        <button
          type="button"
          className="mobile-menu-button"
          aria-controls="docs-sidebar"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <span>{translateUi('menu', language)}</span>
        </button>

          <nav
            className={[
              'flex w-full px-3 items-center gap-2.5 overflow-x-auto md:hidden ',
              language === 'fa' ? 'flex-row-reverse justify-start border-r border-[var(--line)]' : 'border-l border-[var(--line)]',
            ].join(' ')}
          >
            {primaryNavigation.map((section) => (
              <Link
                key={section.label}
                href={section.href}
                className={[
                  'px-2.5 py-3 text-sm font-semibold hover:!text-[var(--accent)]',
                  section.isActive
                    ? 'border-b-[3px] border-b-[var(--accent)] !text-[var(--accent)]'
                    : '!text-[var(--muted)]',
                ].join(' ')}
              >
                {section.label}
              </Link>
            ))}
          </nav>
      </div>

      <button
        type="button"
        className={['sidebar-backdrop', isOpen ? 'open' : ''].join(' ')}
        aria-label={translateUi('closeNavigation', language)}
        onClick={() => setIsOpen(false)}
      />

      <aside
        id="docs-sidebar"
        className={['sidebar h-full flex flex-col gap-2', isOpen ? 'open' : ''].join(' ')}
        aria-label={`${section} navigation`}
      >
        <div className="sidebar-header">
          <div className="sidebar-title">{sidebarTitle}</div>
          <button
            type="button"
            className="sidebar-close"
            aria-label={translateUi('closeNavigation', language)}
            onClick={() => setIsOpen(false)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <SidebarNavigation
          key={section}
          items={items}
          activeHref={activeHref}
          language={language}
          onNavigate={() => setIsOpen(false)}
        />
      </aside>
    </>
  );
}
