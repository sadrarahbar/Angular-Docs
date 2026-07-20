'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Language } from './data';

type LanguageSelectProps = {
  language: Language;
};

export function LanguageSelect({ language }: LanguageSelectProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const changeLanguage = (nextLanguage: Language) => {
    const params = new URLSearchParams(searchParams.toString());

    window.localStorage.setItem('language', nextLanguage);

    if (nextLanguage === 'en') {
      params.delete('lang');
    } else {
      params.set('lang', nextLanguage);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const nextLanguage = language === 'fa' ? 'en' : 'fa';

  return (
    <button
      type="button"
      className="cursor-pointer border-0 bg-transparent p-0 text-[var(--foreground)]"
      aria-label={`Switch language to ${nextLanguage === 'fa' ? 'Persian' : 'English'}`}
      aria-pressed={language === 'fa'}
      onClick={() => changeLanguage(nextLanguage)}
    >
      <span
        className="relative grid h-[34px] w-[68px] grid-cols-2 items-center gap-[1.1rem] rounded-full border border-[var(--line)] bg-[var(--panel)] px-2 [direction:ltr]"
        aria-hidden="true"
      >
        <span
          className={[
            'relative z-[1] text-xs font-extrabold leading-none',
            language === 'en' ? 'text-white' : 'text-[var(--muted)]',
          ].join(' ')}
        >
          EN
        </span>
        <span
          className={[
            'absolute left-[3px] h-7 w-7 rounded-full bg-[var(--accent)] shadow-[0_8px_20px_rgba(24,24,27,0.18)] transition-transform duration-200 ease-in-out',
            language === 'fa' ? 'translate-x-[34px]' : '',
          ].join(' ')}
        />
        <span
          className={[
            "relative z-[1] text-xs font-extrabold leading-none [font-family:'IRANSans',var(--font-geist-sans),Arial,Helvetica,sans-serif]",
            language === 'fa' ? 'text-white' : 'text-[var(--muted)]',
          ].join(' ')}
        >
          فا
        </span>
      </span>
    </button>
  );
}
