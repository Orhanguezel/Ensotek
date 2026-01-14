// =============================================================
// FILE: src/integrations/rtk/endpoints/offers_public.endpoints.ts
// Ensotek – PUBLIC Offers API (Teklif Talebi Gönderme)
//   - POST /offers → OfferRequestPublic
// =============================================================

import { baseApi } from '@/integrations/rtk/baseApi';
import type { OfferRequestPublic, OfferRow } from '@/integrations/types';

export const offersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // PUBLIC – Teklif talebi oluşturma
    createOfferPublic: build.mutation<OfferRow, OfferRequestPublic>({
      query: (body) => ({
        url: '/offers',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useCreateOfferPublicMutation } = offersApi;
