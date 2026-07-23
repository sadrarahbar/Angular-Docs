import { NextResponse } from 'next/server';
import { getOfflineContentManifest } from '../../pwa/contentManifest';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json(getOfflineContentManifest(), {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
