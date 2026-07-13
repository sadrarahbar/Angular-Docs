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
      <span>Language</span>
      <select
        value={language}
        aria-label="Language"
        onChange={(event) => changeLanguage(event.target.value as Language)}
      >
        <option value="en">English</option>
        <option value="fa">فارسی</option>
      </select>
    </label>
  );
}
