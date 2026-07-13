import { redirect } from 'next/navigation';
import { getFirstDoc } from './docs/data';

export default function Home() {
  const firstDoc = getFirstDoc();
  redirect(firstDoc?.href ?? '/overview');
}
