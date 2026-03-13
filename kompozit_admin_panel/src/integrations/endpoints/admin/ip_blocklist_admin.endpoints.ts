// =============================================================
// FILE: src/integrations/endpoints/admin/ip_blocklist_admin.endpoints.ts
// Ensotek – Admin IP Blocklist (RTK Query)
//   GET    /admin/ip-blocklist        → list
//   POST   /admin/ip-blocklist        → add
//   DELETE /admin/ip-blocklist/:id    → remove
// =============================================================

import { baseApi } from '@/integrations/baseApi';
import type {
  IpBlocklistEntry,
  IpBlocklistListResponse,
  AddIpBlocklistPayload,
} from '@/integrations/shared/ip-blocklist.types';

const BASE = 'admin/ip-blocklist';

export const ipBlocklistAdminApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (build) => ({
    listBlockedIpsAdmin: build.query<IpBlocklistListResponse, void>({
      query: () => ({ url: BASE, method: 'GET' }),
      transformResponse: (raw: any): IpBlocklistListResponse => ({
        items: Array.isArray(raw?.items) ? raw.items : [],
        total: Number(raw?.total ?? 0),
      }),
      providesTags: [{ type: 'IpBlocklistEntry' as const, id: 'LIST' }],
    }),

    addBlockedIpAdmin: build.mutation<IpBlocklistEntry, AddIpBlocklistPayload>({
      query: (body) => ({ url: BASE, method: 'POST', body }),
      invalidatesTags: [{ type: 'IpBlocklistEntry' as const, id: 'LIST' }],
    }),

    deleteBlockedIpAdmin: build.mutation<{ ok: boolean }, number>({
      query: (id) => ({ url: `${BASE}/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'IpBlocklistEntry' as const, id: 'LIST' }],
    }),
  }),
});

export const {
  useListBlockedIpsAdminQuery,
  useAddBlockedIpAdminMutation,
  useDeleteBlockedIpAdminMutation,
} = ipBlocklistAdminApi;
