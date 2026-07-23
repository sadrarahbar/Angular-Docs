/* global clients */

const CACHE_PREFIX = 'angular-docs-';
const SHELL_CACHE = `${CACHE_PREFIX}shell-v1`;
const RUNTIME_CACHE = `${CACHE_PREFIX}runtime-v1`;
const DOCUMENT_CACHE_PREFIX = `${CACHE_PREFIX}documents-`;
const SHELL_URLS = ['/offline', '/logo.svg', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith(CACHE_PREFIX) &&
                cacheName !== SHELL_CACHE &&
                cacheName !== RUNTIME_CACHE &&
                !cacheName.startsWith(DOCUMENT_CACHE_PREFIX),
            )
            .map((cacheName) => caches.delete(cacheName)),
        ),
      ),
      self.clients.claim(),
    ]),
  );
});

const postToClient = async (clientId, message) => {
  const client = clientId ? await clients.get(clientId) : null;

  if (client) {
    client.postMessage(message);
    return;
  }

  const windows = await clients.matchAll({ type: 'window', includeUncontrolled: true });
  windows.forEach((windowClient) => windowClient.postMessage(message));
};

const getDownloadedDocumentCache = async () => {
  const cacheNames = await caches.keys();
  const cacheName = cacheNames.find((name) => name.startsWith(DOCUMENT_CACHE_PREFIX));
  return cacheName ? caches.open(cacheName) : null;
};

const cacheDocuments = async ({ urls, version }, clientId) => {
  const targetCacheName = `${DOCUMENT_CACHE_PREFIX}${version}`;
  const targetCache = await caches.open(targetCacheName);
  const uniqueUrls = [...new Set(urls)];
  let completed = 0;
  let cursor = 0;
  let downloadFailure = null;

  const downloadNext = async () => {
    while (cursor < uniqueUrls.length && !downloadFailure) {
      const url = uniqueUrls[cursor];
      cursor += 1;

      try {
        const response = await fetch(url, {
          cache: 'no-store',
          credentials: 'same-origin',
          headers: { Accept: url.includes('/assets/') ? '*/*' : 'text/html' },
        });

        if (!response.ok) {
          throw new Error(`Could not download ${url} (${response.status})`);
        }

        await targetCache.put(url, response);
        completed += 1;
        await postToClient(clientId, {
          type: 'OFFLINE_DOWNLOAD_PROGRESS',
          completed,
          total: uniqueUrls.length,
        });
      } catch (error) {
        downloadFailure = error;
      }
    }
  };

  try {
    await Promise.all(Array.from({ length: Math.min(6, uniqueUrls.length) }, () => downloadNext()));

    if (downloadFailure) {
      throw downloadFailure;
    }

    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((name) => name.startsWith(DOCUMENT_CACHE_PREFIX) && name !== targetCacheName)
        .map((name) => caches.delete(name)),
    );

    await postToClient(clientId, {
      type: 'OFFLINE_DOWNLOAD_COMPLETE',
      version,
      total: uniqueUrls.length,
    });
  } catch (error) {
    await caches.delete(targetCacheName);
    await postToClient(clientId, {
      type: 'OFFLINE_DOWNLOAD_ERROR',
      message: error instanceof Error ? error.message : 'The offline download failed.',
    });
  }
};

self.addEventListener('message', (event) => {
  if (event.data?.type === 'DOWNLOAD_OFFLINE_CONTENT') {
    event.waitUntil(cacheDocuments(event.data.payload, event.source?.id));
  }

  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

const networkFirst = async (request) => {
  const runtimeCache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);

    if (response.ok) {
      await runtimeCache.put(request, response.clone());
    }

    return response;
  } catch {
    const downloadedCache = await getDownloadedDocumentCache();
    const downloadedResponse = downloadedCache
      ? await downloadedCache.match(request, { ignoreVary: true })
      : undefined;

    return (
      downloadedResponse ||
      (await runtimeCache.match(request, { ignoreVary: true })) ||
      (await caches.match('/offline')) ||
      Response.error()
    );
  }
};

const staleWhileRevalidate = async (request) => {
  const runtimeCache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await caches.match(request);
  const networkResponse = fetch(request)
    .then((response) => {
      if (response.ok) {
        runtimeCache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  return cachedResponse || (await networkResponse) || Response.error();
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/fonts/') ||
    /\.(?:avif|gif|ico|jpe?g|png|svg|webp|woff2?|ttf|eot)$/i.test(url.pathname)
  ) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

self.addEventListener('push', (event) => {
  const fallback = {
    title: 'Angular Docs updated',
    body: 'New documentation is available to download.',
    url: '/overview',
    version: null,
  };
  const data = event.data ? { ...fallback, ...event.data.json() } : fallback;

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/pwa/icon-192.png',
      badge: '/pwa/icon-192.png',
      tag: data.version ? `content-${data.version}` : 'content-update',
      renotify: true,
      data: { url: data.url, version: data.version },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || '/overview', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      const existingClient = windowClients.find((client) => client.url.startsWith(self.location.origin));

      if (existingClient) {
        existingClient.navigate(targetUrl);
        return existingClient.focus();
      }

      return clients.openWindow(targetUrl);
    }),
  );
});
