import { notifyIfContentChanged, sendContentUpdateNotification } from '../../../pwa/pushNotifications';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const expectedSecret = process.env.PUSH_NOTIFY_SECRET;
  const authorization = request.headers.get('authorization');

  if (!expectedSecret || authorization !== `Bearer ${expectedSecret}`) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const url = new URL(request.url);
  const result =
    url.searchParams.get('force') === 'true'
      ? await sendContentUpdateNotification()
      : await notifyIfContentChanged();

  return Response.json(result);
}
