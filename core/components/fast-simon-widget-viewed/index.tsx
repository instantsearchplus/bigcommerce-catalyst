'use client';

import { analyticsManager } from '@fast-simon/storefront-sdk';
import { RecommendationsResponse } from '@fast-simon/types';
import { useEffect } from 'react';

export const FastSimonWidgetViewed = ({
  recommendationsResponse,
}: {
  recommendationsResponse: RecommendationsResponse;
}) => {
  useEffect(() => {
    recommendationsResponse.widget_responses.forEach((widgetData) => {
      analyticsManager.emit('recommendations_products_seen', widgetData);
    });
  }, [recommendationsResponse]);

  return null;
};
