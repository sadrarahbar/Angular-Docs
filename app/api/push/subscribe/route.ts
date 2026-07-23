import type { PushSubscription } from 'web-push';
import { savePushSubscription } from '../../../pwa/pushStore';

export const runtime = 'nodejs';

const isPushSubscription = (value: unknown): value is PushSubscription => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const subscription = value as Partial<PushSubscription>;
  return (
    typeof subscription.endpoint === 'string' &&
    subscription.endpoint.startsWith('https://') &&
    typeof subscription.keys?.auth === 'string' &&
    typeof subscription.keys?.p256dh === 'string'
  );
};

export async function POST(request: Request) {
  const subscription: unknown = await request.json();

  if (!isPushSubscription(subscription)) {
    return Response.json({ error: 'Invalid push subscription.' }, { status: 400 });
  }

  await savePushSubscription(subscription);
  return Response.json({ success: true });
}
