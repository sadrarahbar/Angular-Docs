'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Language } from './data';
import { translateUi } from './i18n';

type LanguageSelectProps = {
  language: Language;
};

export function LanguageSelect({ language }: LanguageSelectProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const changeLanguage = (nextLanguage: Language) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextLanguage === 'en') {
      params.delete('lang');
    } else {
      params.set('lang', nextLanguage);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <label className="language-select">
      <span>{translateUi('language', language)}</span>
      <select
        value={language}
        aria-label={translateUi('language', language)}
        onChange={(event) => changeLanguage(event.target.value as Language)}
      >
        <option value="en">English</option>
        <option value="fa">فارسی</option>
      </select>
    </label>
  );
}
