import 'server-only';

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { docsWithContent } from '../docs/data';

export type OfflineContentManifest = {
  version: string;
  generatedAt: string;
  documentCount: number;
  urls: string[];
};

const contentRoot = path.join(process.cwd(), 'app', 'content');
const publicRoot = path.join(process.cwd(), 'public');
const assetPattern = /\/?assets\/[^\s)"'>]+/g;
let productionManifest: OfflineContentManifest | undefined;

const getFiles = (directory: string): string[] => {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? getFiles(entryPath) : [entryPath];
  });
};

const contentFiles = () => getFiles(contentRoot).sort((left, right) => left.localeCompare(right));

export const getContentVersion = () => {
  const hash = crypto.createHash('sha256');

  for (const filePath of contentFiles()) {
    hash.update(path.relative(contentRoot, filePath).replaceAll(path.sep, '/'));
    hash.update(fs.readFileSync(filePath));
  }

  return hash.digest('hex').slice(0, 20);
};

const getDocumentAssets = () => {
  const assets = new Set<string>();

  for (const document of docsWithContent) {
    if (!document.contentPath) {
      continue;
    }

    for (const language of ['en', 'fa']) {
      const filePath = path.join(contentRoot, language, `${document.contentPath}.md`);

      if (!fs.existsSync(filePath)) {
        continue;
      }

      for (const match of fs.readFileSync(filePath, 'utf8').matchAll(assetPattern)) {
        const assetUrl = `/${match[0].replace(/^\//, '')}`;
        const assetPath = path.join(publicRoot, assetUrl.replace(/^\//, '').replaceAll('/', path.sep));

        if (assetPath.startsWith(publicRoot) && fs.existsSync(assetPath)) {
          assets.add(assetUrl);
        }
      }
    }
  }

  return [...assets].sort((left, right) => left.localeCompare(right));
};

export const getOfflineContentManifest = (): OfflineContentManifest => {
  if (process.env.NODE_ENV === 'production' && productionManifest) {
    return productionManifest;
  }

  const englishDocuments = [...new Set(docsWithContent.map((document) => document.href))];
  const persianDocuments = englishDocuments.map((href) => `${href}?lang=fa`);
  const urls = [
    '/offline',
    '/logo.svg',
    ...englishDocuments,
    ...persianDocuments,
    ...getDocumentAssets(),
  ];

  const manifest = {
    version: getContentVersion(),
    generatedAt: new Date().toISOString(),
    documentCount: englishDocuments.length + persianDocuments.length,
    urls: [...new Set(urls)],
  };

  if (process.env.NODE_ENV === 'production') {
    productionManifest = manifest;
  }

  return manifest;
};
