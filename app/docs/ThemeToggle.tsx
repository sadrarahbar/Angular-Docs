'use client';

import { useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

const themeChangeEvent = 'docs-theme-change';

const getPreferredTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const savedTheme = window.localStorage.getItem('theme');

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return 'dark';
};

const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
};

const getThemeSnapshot = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const currentTheme = document.documentElement.dataset.theme;

  if (currentTheme === 'light' || currentTheme === 'dark') {
    return currentTheme;
  }

  return getPreferredTheme();
};

const subscribeToTheme = (callback: () => void) => {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const notify = () => callback();
  const syncPreferredTheme = () => {
    applyTheme(getPreferredTheme());
    callback();
  };

  window.addEventListener(themeChangeEvent, notify);
  window.addEventListener('storage', syncPreferredTheme);
  media.addEventListener('change', syncPreferredTheme);

  return () => {
    window.removeEventListener(themeChangeEvent, notify);
    window.removeEventListener('storage', syncPreferredTheme);
    media.removeEventListener('change', syncPreferredTheme);
  };
};

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => 'dark');

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    window.localStorage.setItem('theme', nextTheme);
    window.dispatchEvent(new Event(themeChangeEvent));
  };

  return (
    <button
      type="button"
      className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border bg-transparent p-0 text-[var(--muted)] [border-color:color-mix(in_srgb,currentColor_35%,transparent)] transition-colors hover:bg-[var(--panel)] hover:text-[var(--foreground)]"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      aria-pressed={theme === 'dark'}
      onClick={toggleTheme}
    >
      {theme === 'light' ? (
        <svg
          className="h-6 w-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 4V2M12 22v-2M4 12H2M22 12h-2M5.64 5.64 4.22 4.22M19.78 19.78l-1.42-1.42M18.36 5.64l1.42-1.42M4.22 19.78l1.42-1.42" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ) : (
        <svg
          className="h-6 w-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M20 14.2A7.4 7.4 0 0 1 9.8 4 8 8 0 1 0 20 14.2Z" />
        </svg>
      )}
    </button>
  );
}
