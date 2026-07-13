'use client';

import { useState } from 'react';
import type { NavigationItem } from '../routes';
import type { Language } from './data';
import { translateUi } from './i18n';
import { SidebarNavigation } from './SidebarNavigation';

type DocsSidebarProps = {
  section: string;
  items: NavigationItem[];
  activeHref: string;
  language: Language;
};

export function DocsSidebar({ section, items, activeHref, language }: DocsSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
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

      <button
        type="button"
        className={['sidebar-backdrop', isOpen ? 'open' : ''].join(' ')}
        aria-label={translateUi('closeNavigation', language)}
        onClick={() => setIsOpen(false)}
      />

      <aside
        id="docs-sidebar"
        className={['sidebar', isOpen ? 'open' : ''].join(' ')}
        aria-label={`${section} navigation`}
      >
        <div className="sidebar-header">
          <div className="sidebar-title">{section}</div>
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
