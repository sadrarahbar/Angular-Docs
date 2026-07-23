import 'server-only';

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import type { PushSubscription } from 'web-push';

const subscriptionsKey = 'angular-docs:push-subscriptions';
const contentVersionKey = 'angular-docs:notified-content-version';
const dataFile = '.pwa-data/store.json';

type LocalStore = {
  subscriptions: Record<string, PushSubscription>;
  notifiedContentVersion?: string;
};

let fileMutation = Promise.resolve();

const subscriptionId = (endpoint: string) =>
  crypto.createHash('sha256').update(endpoint).digest('hex');

const hasRedis = () =>
  Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const redisCommand = async <T>(command: Array<string>): Promise<T> => {
  const response = await fetch(process.env.UPSTASH_REDIS_REST_URL!, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Push subscription store failed with ${response.status}.`);
  }

  const payload = (await response.json()) as { result: T; error?: string };

  if (payload.error) {
    throw new Error(payload.error);
  }

  return payload.result;
};

const readLocalStore = async (): Promise<LocalStore> => {
  try {
    return JSON.parse(await fs.readFile(dataFile, 'utf8')) as LocalStore;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { subscriptions: {} };
    }

    throw error;
  }
};

const mutateLocalStore = async (mutator: (store: LocalStore) => void) => {
  const operation = fileMutation.then(async () => {
    const store = await readLocalStore();
    mutator(store);
    await fs.mkdir('.pwa-data', { recursive: true });
    const temporaryFile = `${dataFile}.${process.pid}.tmp`;
    await fs.writeFile(temporaryFile, JSON.stringify(store, null, 2), 'utf8');
    await fs.rename(temporaryFile, dataFile);
  });

  fileMutation = operation.catch(() => undefined);
  return operation;
};

export const savePushSubscription = async (subscription: PushSubscription) => {
  const id = subscriptionId(subscription.endpoint);

  if (hasRedis()) {
    await redisCommand<number>([
      'HSET',
      subscriptionsKey,
      id,
      JSON.stringify(subscription),
    ]);
    return;
  }

  await mutateLocalStore((store) => {
    store.subscriptions[id] = subscription;
  });
};

export const removePushSubscription = async (endpoint: string) => {
  const id = subscriptionId(endpoint);

  if (hasRedis()) {
    await redisCommand<number>(['HDEL', subscriptionsKey, id]);
    return;
  }

  await mutateLocalStore((store) => {
    delete store.subscriptions[id];
  });
};

export const getPushSubscriptions = async (): Promise<PushSubscription[]> => {
  if (hasRedis()) {
    const values = await redisCommand<string[]>(['HVALS', subscriptionsKey]);
    return (values ?? []).map((value) => JSON.parse(value) as PushSubscription);
  }

  return Object.values((await readLocalStore()).subscriptions);
};

export const getNotifiedContentVersion = async () => {
  if (hasRedis()) {
    return redisCommand<string | null>(['GET', contentVersionKey]);
  }

  return (await readLocalStore()).notifiedContentVersion ?? null;
};

export const setNotifiedContentVersion = async (version: string) => {
  if (hasRedis()) {
    await redisCommand<string>(['SET', contentVersionKey, version]);
    return;
  }

  await mutateLocalStore((store) => {
    store.notifiedContentVersion = version;
  });
};
