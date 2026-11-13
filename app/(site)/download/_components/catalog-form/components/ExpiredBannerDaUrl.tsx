'use client';

import { useSearchParams } from 'next/navigation';

import { ExpiredBanner } from './ExpiredBanner';

// Lê `?error=` no cliente para que /download continue estática.
export function ExpiredBannerDaUrl() {
  const error = useSearchParams().get('error');

  if (error !== 'expired' && error !== 'invalid') return null;

  return <ExpiredBanner reason={error} />;
}
