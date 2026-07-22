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
      className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border bg-transparent p-0 text-xs font-extrabold leading-none text-[var(--muted)] [border-color:color-mix(in_srgb,currentColor_35%,transparent)] transition-colors hover:bg-[var(--panel)] hover:text-[var(--foreground)]"
      aria-label={`Switch language to ${nextLanguage === 'fa' ? 'Persian' : 'English'}`}
      onClick={() => changeLanguage(nextLanguage)}
    >
      <span aria-hidden="true">{language === 'fa' ? 'فا' : 'EN'}</span>
    </button>
  );
}
