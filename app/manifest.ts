import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Angular Docs Offline',
    short_name: 'Angular Docs',
    description: 'Angular documentation in English and Persian, available online and offline.',
    start_url: '/overview',
    scope: '/',
    display: 'standalone',
    background_color: '#0f0f11',
    theme_color: '#d2234c',
    orientation: 'any',
    lang: 'en',
    dir: 'auto',
    categories: ['education', 'developer tools', 'productivity'],
    icons: [
      {
        src: '/pwa/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'English documentation',
        short_name: 'English',
        url: '/overview',
        icons: [{ src: '/pwa/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'مستندات فارسی',
        short_name: 'فارسی',
        url: '/overview?lang=fa',
        icons: [{ src: '/pwa/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
