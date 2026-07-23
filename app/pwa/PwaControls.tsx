'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Language } from '../docs/data';

type OfflineManifest = {
  version: string;
  generatedAt: string;
  documentCount: number;
  urls: string[];
};

type DownloadState = 'idle' | 'downloading' | 'downloaded' | 'update' | 'error';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

type PwaControlsProps = {
  language: Language;
};

const downloadedVersionKey = 'angular-docs-offline-version';
const pwaEnabled =
  process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_PWA_IN_DEV === 'true';

const labels = {
  en: {
    online: 'Online',
    offline: 'Offline',
    download: 'Download all documentation',
    downloading: 'Downloading documentation',
    downloaded: 'Documentation is available offline',
    update: 'Documentation update available',
    failed: 'Offline download failed',
    notifications: 'Enable update notifications',
    notificationsEnabled: 'Update notifications enabled',
    install: 'Install application',
  },
  fa: {
    online: 'آنلاین',
    offline: 'آفلاین',
    download: 'دانلود همه مستندات',
    downloading: 'در حال دانلود مستندات',
    downloaded: 'مستندات به‌صورت آفلاین در دسترس است',
    update: 'نسخه جدید مستندات موجود است',
    failed: 'دانلود آفلاین ناموفق بود',
    notifications: 'فعال‌کردن اعلان به‌روزرسانی',
    notificationsEnabled: 'اعلان به‌روزرسانی فعال است',
    install: 'نصب اپلیکیشن',
  },
} as const;

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replaceAll('-', '+').replaceAll('_', '/');
  const rawData = window.atob(base64);
  return Uint8Array.from(rawData, (character) => character.charCodeAt(0));
};

export function PwaControls({ language }: PwaControlsProps) {
  const text = labels[language];
  const [isOnline, setIsOnline] = useState(true);
  const [manifest, setManifest] = useState<OfflineManifest | null>(null);
  const [downloadState, setDownloadState] = useState<DownloadState>('idle');
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const notificationShownForVersion = useRef<string | null>(null);

  const checkConnection = useCallback(async () => {
    if (!window.navigator.onLine) {
      setIsOnline(false);
      return false;
    }

    try {
      const response = await fetch('/api/pwa/ping', {
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      });
      setIsOnline(response.ok);
      return response.ok;
    } catch {
      setIsOnline(false);
      return false;
    }
  }, []);

  const checkContentVersion = useCallback(async () => {
    try {
      const response = await fetch('/api/offline-manifest', { cache: 'no-store' });

      if (!response.ok) {
        return;
      }

      const nextManifest = (await response.json()) as OfflineManifest;
      const downloadedVersion = window.localStorage.getItem(downloadedVersionKey);
      setManifest(nextManifest);

      if (!downloadedVersion) {
        setDownloadState('idle');
        return;
      }

      if (downloadedVersion === nextManifest.version) {
        setDownloadState('downloaded');
        return;
      }

      setDownloadState('update');

      if (
        notificationShownForVersion.current !== nextManifest.version &&
        window.Notification?.permission === 'granted'
      ) {
        notificationShownForVersion.current = nextManifest.version;
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification('Angular Docs updated', {
          body: text.update,
          icon: '/pwa/icon-192.png',
          tag: `content-${nextManifest.version}`,
        });
      }
    } catch {
      // A failed version check is expected while offline.
    }
  }, [text.update]);

  useEffect(() => {
    const supportsServiceWorker = 'serviceWorker' in navigator;

    const initialize = async () => {
      await checkConnection();
      await checkContentVersion();

      if (!pwaEnabled || !supportsServiceWorker) {
        return;
      }

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });
      await navigator.serviceWorker.ready;
      setServiceWorkerReady(true);

      const existingSubscription = await registration.pushManager?.getSubscription();
      setNotificationEnabled(Boolean(existingSubscription));
    };

    initialize().catch(() => setDownloadState('error'));
    const connectionInterval = window.setInterval(checkConnection, 30_000);

    const handleOnline = () => {
      checkConnection().then((online) => {
        if (online) {
          checkContentVersion();
        }
      });
    };
    const handleOffline = () => setIsOnline(false);
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OFFLINE_DOWNLOAD_PROGRESS') {
        setProgress({ completed: event.data.completed, total: event.data.total });
      }

      if (event.data?.type === 'OFFLINE_DOWNLOAD_COMPLETE') {
        window.localStorage.setItem(downloadedVersionKey, event.data.version);
        setDownloadState('downloaded');
        setProgress({ completed: event.data.total, total: event.data.total });
      }

      if (event.data?.type === 'OFFLINE_DOWNLOAD_ERROR') {
        setDownloadState('error');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    if (supportsServiceWorker) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    return () => {
      window.clearInterval(connectionInterval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      if (supportsServiceWorker) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, [checkConnection, checkContentVersion]);

  useEffect(() => {
    if (isOnline) {
      return;
    }

    const navigateWithDocumentCache = (event: MouseEvent) => {
      const target = event.target;
      const anchor = target instanceof Element ? target.closest('a[href]') : null;

      if (!(anchor instanceof HTMLAnchorElement) || anchor.origin !== window.location.origin) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(anchor.href);
    };

    document.addEventListener('click', navigateWithDocumentCache, true);
    return () => document.removeEventListener('click', navigateWithDocumentCache, true);
  }, [isOnline]);

  useEffect(() => {
    document.documentElement.dataset.connection = isOnline ? 'online' : 'offline';
  }, [isOnline]);

  const downloadAllDocumentation = async () => {
    if (!manifest || !isOnline || !('serviceWorker' in navigator)) {
      return;
    }

    setDownloadState('downloading');
    setProgress({ completed: 0, total: manifest.urls.length });

    try {
      await navigator.storage?.persist?.();
      const registration = await navigator.serviceWorker.ready;
      const worker = registration.active;

      if (!worker) {
        throw new Error('The service worker is not active.');
      }

      worker.postMessage({
        type: 'DOWNLOAD_OFFLINE_CONTENT',
        payload: {
          version: manifest.version,
          urls: manifest.urls,
        },
      });
    } catch {
      setDownloadState('error');
    }
  };

  const enableNotifications = async () => {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!publicKey || !('Notification' in window) || !('PushManager' in window)) {
      return;
    }

    const permission = await window.Notification.requestPermission();

    if (permission !== 'granted') {
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription =
      (await registration.pushManager.getSubscription()) ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      }));

    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });

    if (response.ok) {
      setNotificationEnabled(true);
    }
  };

  const installApplication = async () => {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const downloadPercent =
    progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
  const downloadTitle =
    downloadState === 'downloading'
      ? `${text.downloading}: ${downloadPercent}%`
      : downloadState === 'downloaded'
        ? text.downloaded
        : downloadState === 'update'
          ? text.update
          : downloadState === 'error'
            ? text.failed
            : text.download;

  return (
    <div className="pwa-controls">
      <span
        className={['connection-status', isOnline ? 'online' : 'offline'].join(' ')}
        role="status"
        title={isOnline ? text.online : text.offline}
      >
        <span className="connection-status-dot" aria-hidden="true" />
        <span>{isOnline ? text.online : text.offline}</span>
      </span>

      <button
        type="button"
        className={['pwa-action', downloadState === 'update' ? 'attention' : ''].join(' ')}
        title={downloadTitle}
        aria-label={downloadTitle}
        disabled={
          !isOnline ||
          !manifest ||
          !serviceWorkerReady ||
          downloadState === 'downloading'
        }
        onClick={downloadAllDocumentation}
      >
        {downloadState === 'downloading' ? (
          <span className="pwa-download-progress">{downloadPercent}%</span>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" />
          </svg>
        )}
      </button>

      {process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ? (
        <button
          type="button"
          className="pwa-action"
          title={notificationEnabled ? text.notificationsEnabled : text.notifications}
          aria-label={notificationEnabled ? text.notificationsEnabled : text.notifications}
          aria-pressed={notificationEnabled}
          disabled={notificationEnabled || !isOnline || !serviceWorkerReady}
          onClick={enableNotifications}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
          </svg>
        </button>
      ) : null}

      {installPrompt ? (
        <button
          type="button"
          className="pwa-action"
          title={text.install}
          aria-label={text.install}
          onClick={installApplication}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 3h10a2 2 0 0 1 2 2v14H5V5a2 2 0 0 1 2-2M12 7v6m-3-3h6" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
