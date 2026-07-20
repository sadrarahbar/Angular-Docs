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
      className="cursor-pointer border-0 bg-transparent p-0 text-[var(--foreground)]"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      aria-pressed={theme === 'dark'}
      onClick={toggleTheme}
    >
      <span
        className="relative grid h-[34px] w-[68px] grid-cols-2 items-center gap-[1.1rem] rounded-full border border-[var(--line)] bg-[var(--panel)] px-2 [direction:ltr]"
        aria-hidden="true"
      >
        <svg
          className={[
            'relative z-[1] h-[17px] w-[17px] fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]',
            theme === 'light' ? 'text-white' : 'text-[var(--muted)]',
          ].join(' ')}
          viewBox="0 0 24 24"
        >
          <path d="M12 4V2M12 22v-2M4 12H2M22 12h-2M5.64 5.64 4.22 4.22M19.78 19.78l-1.42-1.42M18.36 5.64l1.42-1.42M4.22 19.78l1.42-1.42" />
          <circle cx="12" cy="12" r="4" />
        </svg>
        <span
          className={[
            'absolute left-[3px] h-7 w-7 rounded-full bg-[var(--accent)] shadow-[0_8px_20px_rgba(24,24,27,0.18)] transition-transform duration-200 ease-in-out',
            theme === 'dark' ? 'translate-x-[34px]' : '',
          ].join(' ')}
        />
        <svg
          className={[
            'relative z-[1] h-[17px] w-[17px] fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]',
            theme === 'dark' ? 'text-white' : 'text-[var(--muted)]',
          ].join(' ')}
          viewBox="0 0 24 24"
        >
          <path d="M20 14.2A7.4 7.4 0 0 1 9.8 4 8 8 0 1 0 20 14.2Z" />
        </svg>
      </span>
    </button>
  );
}
