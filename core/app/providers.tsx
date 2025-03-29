'use client';

import { PropsWithChildren } from 'react';

import { Toaster } from '@/vibes/soul/primitives/toaster';
import { CartProvider } from '~/components/header/cart-provider';
import { CompareDrawerProvider } from '~/components/ui/compare-drawer';
import { analyticsManager, FastSimonAnalytics } from '@fast-simon/storefront-sdk';

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <Toaster position="top-right" />
      <CartProvider>
        <CompareDrawerProvider>{children}</CompareDrawerProvider>
      </CartProvider>
      <FastSimonAnalytics
        analyticsContextValue={analyticsManager}
        collectionPersonalization={true}
        searchPersonalization={true}
        storeDomain="Your Store Domain"
      />
    </>
  );
}
