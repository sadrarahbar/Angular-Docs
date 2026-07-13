'use client';

import { useEffect } from 'react';

export function CodeInteractions() {
  useEffect(() => {
    const onClick = async (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const tab = target.closest<HTMLButtonElement>('[data-code-tab]');
      if (tab) {
        const tabs = tab.closest<HTMLElement>('.doc-code-tabs');
        const tabIndex = tab.dataset.codeTab;

        tabs?.querySelectorAll<HTMLButtonElement>('[data-code-tab]').forEach((button) => {
          const isActive = button.dataset.codeTab === tabIndex;
          button.classList.toggle('active', isActive);
          button.setAttribute('aria-selected', String(isActive));
        });

        tabs?.querySelectorAll<HTMLElement>('[data-code-panel]').forEach((panel) => {
          panel.classList.toggle('active', panel.dataset.codePanel === tabIndex);
        });

        return;
      }

      const copyButton = target.closest<HTMLButtonElement>('.doc-code-copy');
      if (!copyButton) {
        return;
      }

      const code = copyButton.closest<HTMLElement>('.doc-code')?.querySelector('code')?.textContent ?? '';

      try {
        await navigator.clipboard.writeText(code);
        copyButton.textContent = 'Copied';
        window.setTimeout(() => {
          copyButton.textContent = 'Copy';
        }, 1400);
      } catch {
        copyButton.textContent = 'Copy failed';
        window.setTimeout(() => {
          copyButton.textContent = 'Copy';
        }, 1400);
      }
    };

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
    };
  }, []);

  return null;
}
