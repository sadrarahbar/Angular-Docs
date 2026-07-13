import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsShell } from '../docs/DocsShell';
import { docsWithContent, getDocBySlug, getRenderedDoc } from '../docs/data';

type DocPageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export function generateStaticParams() {
  return docsWithContent.map((doc) => ({
    slug: doc.href.replace(/^\//, '').split('/'),
  }));
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  return {
    title: doc ? `${doc.label} | Angular Docs` : 'Angular Docs',
    description: doc ? `Read ${doc.label} in the Angular documentation.` : 'Angular documentation',
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const rendered = getRenderedDoc(doc);

  if (!rendered) {
    notFound();
  }

  return <DocsShell doc={doc} rendered={rendered} />;
}
