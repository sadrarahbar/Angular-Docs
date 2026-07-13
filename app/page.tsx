import { redirect } from 'next/navigation';
import { getFirstDoc, normalizeLanguage } from './docs/data';

type HomeProps = {
  searchParams: Promise<{
    lang?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { lang } = await searchParams;
  const language = normalizeLanguage(lang);
  const firstDoc = getFirstDoc();
  const href = firstDoc?.href ?? '/overview';
  redirect(language === 'fa' ? `${href}?lang=fa` : href);
}
