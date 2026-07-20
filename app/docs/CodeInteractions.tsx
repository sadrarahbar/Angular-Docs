'use client';

import { useEffect } from 'react';

export function CodeInteractions() {
  useEffect(() => {
    const syncPreviewThemes = () => {
      const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

      document.querySelectorAll<HTMLIFrameElement>('.doc-code-preview').forEach((preview) => {
        preview.contentWindow?.postMessage({ type: 'docs-theme', theme }, '*');
      });
    };

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

      const viewToggle = target.closest<HTMLButtonElement>('[data-code-view-toggle]');
      if (viewToggle) {
        const tabs = viewToggle.closest<HTMLElement>('.doc-code-tabs');
        const nextView = tabs?.dataset.codeView === 'code' ? 'preview' : 'code';
        const label = viewToggle.querySelector<HTMLElement>('[data-code-view-label]');

        tabs?.classList.toggle('show-preview', nextView === 'preview');
        tabs?.classList.toggle('show-code', nextView === 'code');

        if (tabs) {
          tabs.dataset.codeView = nextView;
        }

        if (label) {
          label.textContent = nextView === 'code' ? 'Show Preview' : 'Show Code';
        }

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

    const observer = new MutationObserver(syncPreviewThemes);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    document.addEventListener('click', onClick);
    window.addEventListener('load', syncPreviewThemes);
    document.querySelectorAll<HTMLIFrameElement>('.doc-code-preview').forEach((preview) => {
      preview.addEventListener('load', syncPreviewThemes);
    });
    syncPreviewThemes();

    return () => {
      observer.disconnect();
      document.removeEventListener('click', onClick);
      window.removeEventListener('load', syncPreviewThemes);
      document.querySelectorAll<HTMLIFrameElement>('.doc-code-preview').forEach((preview) => {
        preview.removeEventListener('load', syncPreviewThemes);
      });
    };
  }, []);

  return null;
}
