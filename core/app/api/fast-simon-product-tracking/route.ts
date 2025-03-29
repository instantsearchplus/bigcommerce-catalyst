import { fastSimonTrackingUtils } from '@fast-simon/storefront-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getFsSessionForRequest } from '~/lib/get-fast-simon';

const PersonalizationDataSchema = z.object({
  productId: z.string().optional(),
  userSession: z.string().optional(),
  sessionToken: z.string().optional(),
});

export async function GET() {
  const session = await getFsSessionForRequest();

  const data = fastSimonTrackingUtils.getViewedProducts(session);

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const session = await getFsSessionForRequest();
  const data = PersonalizationDataSchema.parse(await request.json());
  const result = await fastSimonTrackingUtils.setPersonalizationData(session, data);

  const response = NextResponse.json({ success: true });

  if (result.updatedCookie) {
    response.headers.set('Set-Cookie', result.updatedCookie);
  }

  return response;
}
