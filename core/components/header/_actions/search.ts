'use server';

import { BigCommerceGQLError } from '@bigcommerce/catalyst-client';
import { SubmissionResult } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

import { SearchResult } from '@/vibes/soul/primitives/navigation';

import { graphql } from '~/client/graphql';


import { SearchProductFragment } from './fragment';
import {getFastSimon} from "~/lib/get-fast-simon";
import {FastSimonDataTransformer} from "@fast-simon/storefront-sdk";

const GetQuickSearchResultsQuery = graphql(
  `
    query getQuickSearchResults(
      $filters: SearchProductsFiltersInput!
      $currencyCode: currencyCode
    ) {
      site {
        search {
          searchProducts(filters: $filters) {
            products(first: 5) {
              edges {
                node {
                  ...SearchProductFragment
                }
              }
            }
          }
        }
      }
    }
  `,
  [SearchProductFragment],
);

export async function search(
  prevState: {
    lastResult: SubmissionResult | null;
    searchResults: SearchResult[] | null;
    emptyStateTitle?: string;
    emptyStateSubtitle?: string;
  },
  formData: FormData,
): Promise<{
  lastResult: SubmissionResult | null;
  searchResults: SearchResult[] | null;
  emptyStateTitle: string;
  emptyStateSubtitle: string;
}> {
  const t = await getTranslations('Components.Header.Search');
  const submission = parseWithZod(formData, { schema: z.object({ term: z.string() }) });
  const emptyStateTitle = t('noSearchResultsTitle', {
    term: submission.status === 'success' ? submission.value.term : '',
  });
  const emptyStateSubtitle = t('noSearchResultsSubtitle');

  if (submission.status !== 'success') {
    return {
      lastResult: submission.reply(),
      searchResults: prevState.searchResults,
      emptyStateTitle,
      emptyStateSubtitle,
    };
  }

  if (submission.value.term.length < 3) {
    return {
      lastResult: submission.reply(),
      searchResults: null,
      emptyStateTitle,
      emptyStateSubtitle,
    };
  }


  try {
    const fastSimon = await getFastSimon();
    const results = await fastSimon.getAutocompleteResults({
      query: submission.value.term,
    });

    const fastSimonSearchResults = FastSimonDataTransformer.parseFastSimonAutocompletResponse(results);

    return {
      lastResult: submission.reply(),
      searchResults: fastSimonSearchResults,
      emptyStateTitle,
      emptyStateSubtitle,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    if (error instanceof BigCommerceGQLError) {
      return {
        lastResult: submission.reply({
          formErrors: error.errors.map(({ message }) => message),
        }),
        searchResults: prevState.searchResults,
        emptyStateTitle,
        emptyStateSubtitle,
      };
    }

    if (error instanceof Error) {
      return {
        lastResult: submission.reply({ formErrors: [error.message] }),
        searchResults: prevState.searchResults,
        emptyStateTitle,
        emptyStateSubtitle,
      };
    }

    return {
      lastResult: submission.reply({
        formErrors: [t('error')],
      }),
      searchResults: prevState.searchResults,
      emptyStateTitle,
      emptyStateSubtitle,
    };
  }
}
