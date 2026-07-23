import Image from 'next/image';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <main className="offline-fallback">
      <Image src="/logo.svg" width={80} height={80} alt="Angular" priority />
      <h1>You are offline</h1>
      <p>This page has not been downloaded yet. Return to a saved document or reconnect to the internet.</p>
      <Link href="/overview">Open downloaded documentation</Link>
    </main>
  );
}
