'use client';

import { analyticsManager } from '@fast-simon/storefront-sdk';
import { SearchResponse, SmartCollectionResponse } from '@fast-simon/types';
import { useEffect } from 'react';

interface Props {
  fastSimonData: SmartCollectionResponse | SearchResponse;
}

export const SearchViewed = ({ fastSimonData }: Props) => {
  useEffect(() => {
    analyticsManager.emit('search_viewed', fastSimonData);
  }, [fastSimonData]);

  return null;
};
