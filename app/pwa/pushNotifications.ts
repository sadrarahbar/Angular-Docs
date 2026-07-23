import 'server-only';

import webpush from 'web-push';
import { getContentVersion } from './contentManifest';
import {
  getNotifiedContentVersion,
  getPushSubscriptions,
  removePushSubscription,
  setNotifiedContentVersion,
} from './pushStore';

const getVapidConfiguration = () => {
  const subject = process.env.VAPID_SUBJECT;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  return subject && publicKey && privateKey ? { subject, publicKey, privateKey } : null;
};

export const sendContentUpdateNotification = async (version = getContentVersion()) => {
  const vapid = getVapidConfiguration();

  if (!vapid) {
    return { configured: false, sent: 0, failed: 0, version };
  }

  webpush.setVapidDetails(vapid.subject, vapid.publicKey, vapid.privateKey);
  const subscriptions = await getPushSubscriptions();
  let sent = 0;
  let failed = 0;

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          subscription,
          JSON.stringify({
            title: 'Angular Docs updated',
            body: 'Documentation content has changed. Open the app to download the latest offline files.',
            url: '/overview',
            version,
          }),
          {
            TTL: 60 * 60 * 24,
            urgency: 'normal',
          },
        );
        sent += 1;
      } catch (error) {
        failed += 1;
        const statusCode = (error as { statusCode?: number }).statusCode;

        if (statusCode === 404 || statusCode === 410) {
          await removePushSubscription(subscription.endpoint);
        }
      }
    }),
  );

  return { configured: true, sent, failed, version };
};

export const notifyIfContentChanged = async () => {
  const currentVersion = getContentVersion();
  const previousVersion = await getNotifiedContentVersion();

  if (!previousVersion) {
    await setNotifiedContentVersion(currentVersion);
    return { changed: false, initialized: true, version: currentVersion };
  }

  if (previousVersion === currentVersion) {
    return { changed: false, initialized: false, version: currentVersion };
  }

  const result = await sendContentUpdateNotification(currentVersion);

  if (result.configured) {
    await setNotifiedContentVersion(currentVersion);
  }

  return { changed: true, initialized: false, ...result };
};
