# PWA deployment setup

The application works offline without external services. Web Push requires VAPID keys and persistent subscription storage.

## 1. Generate VAPID keys

```bash
npm run pwa:vapid
```

Set these environment variables in the deployment environment:

```text
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:admin@example.com
PUSH_NOTIFY_SECRET=use-a-long-random-secret
```

`VAPID_SUBJECT` must be a `mailto:` address or an HTTPS URL.

## 2. Configure persistent subscription storage

For a distributed or serverless deployment, configure Upstash Redis:

```text
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

On a single persistent Node.js server, the fallback store is `.pwa-data/store.json`.
Do not use this fallback on an ephemeral or multi-instance deployment.

## 3. Notify users after deployment

The Node.js instrumentation hook compares a SHA-256 version of every file below `app/content` at startup and sends Web Push notifications when the version changes.

For platforms that suspend startup hooks or for an explicit post-deployment CI step, run:

```bash
PWA_DEPLOYMENT_URL=https://docs.example.com PUSH_NOTIFY_SECRET=... npm run pwa:notify
```

The notification endpoint is idempotent: it sends only when the content hash changed. To deliberately resend, call:

```text
POST /api/push/notify-content-update?force=true
Authorization: Bearer <PUSH_NOTIFY_SECRET>
```

## 4. Local testing

Service workers are enabled in production builds. Test with:

```bash
npm run build
npm start
```

To opt into Service Worker registration during development, set:

```text
NEXT_PUBLIC_ENABLE_PWA_IN_DEV=true
```

Push and PWA features require HTTPS outside `localhost`. On iOS, Web Push requires iOS 16.4 or newer and installation on the Home Screen.
