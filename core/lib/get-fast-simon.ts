import {
  CookieSessionStorage,
  createFastSimonClient,
  FastSimonSession,
} from '@fast-simon/storefront-sdk';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const getFastSimon = cache(async () => {
  const fastSimonSession = await getFsSessionForRequest();

  return createFastSimonClient({
    fastSimonSession,
    searchPersonalization: true,
    collectionPersonalization: true,
  });
});

export async function getFsSessionForRequest() {
  const cookieStore = await cookies();

  const storage = new CookieSessionStorage({
    cookieName: 'fastSimonSession',
    cookieSecret: process.env.FAST_SIMON_COOKIE_SECRET || 'fallback-secret',
    maxAge: 60 * 60 * 24 * 5, // 5 days
  });

  return await FastSimonSession.init(cookieStore.toString(), storage);
}
