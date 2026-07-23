import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const baseUrl = process.env.PWA_TEST_URL || 'http://localhost:3100';
const debuggingPort = 9333;
const offlineManifest = await (await fetch(`${baseUrl}/api/offline-manifest`)).json();
const englishTestUrl = offlineManifest.urls.find(
  (url) =>
    url.startsWith('/') &&
    !url.includes('?') &&
    !url.startsWith('/assets/') &&
    !['/offline', '/logo.svg', '/overview'].includes(url),
);
const persianTestUrl = `${englishTestUrl}?lang=fa`;
const chromeCandidates =
  process.platform === 'win32'
    ? [
        process.env.PWA_CHROME_PATH,
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      ]
    : [
        process.env.PWA_CHROME_PATH,
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium',
      ];

const chromePath = (
  await Promise.all(
    chromeCandidates.filter(Boolean).map(async (candidate) => {
      try {
        await fs.access(candidate);
        return candidate;
      } catch {
        return null;
      }
    }),
  )
).find(Boolean);

if (!chromePath) {
  throw new Error('Chrome was not found. Set PWA_CHROME_PATH to a Chromium-based browser.');
}

const profileDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'angular-docs-pwa-'));
const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    `--remote-debugging-port=${debuggingPort}`,
    `--user-data-dir=${profileDirectory}`,
    `${baseUrl}/overview`,
  ],
  {
    stdio: 'ignore',
    windowsHide: true,
  },
);

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const getTarget = async () => {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const targets = await (await fetch(`http://localhost:${debuggingPort}/json/list`)).json();
      const target = targets.find((item) => item.type === 'page' && item.url.startsWith(baseUrl));

      if (target) {
        return target;
      }
    } catch {
      // Chrome may still be starting.
    }

    await wait(250);
  }

  throw new Error('Could not connect to the Chrome DevTools endpoint.');
};

try {
  const target = await getTarget();
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = reject;
  });

  let commandId = 0;
  const pendingCommands = new Map();

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    const pending = pendingCommands.get(message.id);

    if (!pending) {
      return;
    }

    pendingCommands.delete(message.id);
    if (message.error) {
      pending.reject(message.error);
    } else {
      pending.resolve(message.result);
    }
  };

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++commandId;
      pendingCommands.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });

  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    return result.result.value;
  };

  let buttonReady = false;

  for (let attempt = 0; attempt < 40; attempt += 1) {
    buttonReady = await evaluate(
      "Boolean(document.querySelector('.pwa-action') && !document.querySelector('.pwa-action').disabled)",
    );

    if (buttonReady) {
      break;
    }

    await wait(500);
  }

  if (!buttonReady) {
    throw new Error('The offline download button did not become ready.');
  }

  await evaluate("document.querySelector('.pwa-action').click()");
  let downloadedVersion = null;

  for (let attempt = 0; attempt < 240; attempt += 1) {
    downloadedVersion = await evaluate(
      "localStorage.getItem('angular-docs-offline-version')",
    );

    if (downloadedVersion) {
      break;
    }

    await wait(1000);
  }

  if (!downloadedVersion) {
    throw new Error('The offline content download timed out.');
  }

  const cacheSummary = await evaluate(`(async () => {
    const names = await caches.keys();
    const cacheName = names.find((name) => name.startsWith('angular-docs-documents-'));
    const entries = cacheName ? await (await caches.open(cacheName)).keys() : [];
    return { version: localStorage.getItem('angular-docs-offline-version'), cacheName, entries: entries.length };
  })()`);

  await send('Network.enable');
  await send('Page.enable');
  await send('Network.emulateNetworkConditions', {
    offline: true,
    latency: 0,
    downloadThroughput: 0,
    uploadThroughput: 0,
  });

  const openOfflineDocument = async (url, expectedLanguage) => {
    await send('Page.navigate', { url: `${baseUrl}${url}` });
    await wait(2000);
    return evaluate(
      `document.querySelector('.docs-app')?.getAttribute('lang') === '${expectedLanguage}' && Boolean(document.querySelector('.sidebar') && document.querySelector('.doc-content'))`,
    );
  };

  const offlineEnglish = await openOfflineDocument(englishTestUrl, 'en');
  const offlinePersian = await openOfflineDocument(persianTestUrl, 'fa');

  if (!offlineEnglish || !offlinePersian) {
    throw new Error('A downloaded document did not render while the browser was offline.');
  }

  console.log(
    JSON.stringify(
      {
        ...cacheSummary,
        offlineEnglish,
        offlinePersian,
      },
      null,
      2,
    ),
  );
  socket.close();
} finally {
  chrome.kill();
  await wait(750);

  if (profileDirectory.startsWith(path.join(os.tmpdir(), 'angular-docs-pwa-'))) {
    await fs
      .rm(profileDirectory, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 300,
      })
      .catch(() => {
        console.warn(`Chrome profile cleanup was deferred: ${profileDirectory}`);
      });
  }
}
