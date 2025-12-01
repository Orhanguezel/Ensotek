// ===================================================================
// FILE: src/integrations/rtk/endpoints/public/email_templates_public.endpoints.ts
// Email Templates – PUBLIC RTK endpoints (/email_templates…)
// ===================================================================

import { baseApi } from "@/integrations/rtk/baseApi";
import type {
  EmailTemplatePublicDto,
  EmailTemplatePublicListQueryParams,
  RenderedEmailTemplateDto,
  RenderEmailTemplateByKeyPayload,
} from "@/integrations/types/email_templates.types";

export const emailTemplatesPublicApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * GET /email_templates
     * Query: { q?, locale?, is_active? }
     */
    listEmailTemplatesPublic: build.query<
      EmailTemplatePublicDto[],
      EmailTemplatePublicListQueryParams | void
    >({
      query: (params?: EmailTemplatePublicListQueryParams) => ({
        url: "/email_templates",
        method: "GET",
        params,
      }),
    }),

    /**
     * GET /email_templates/by-key/:key
     * Query: { locale? }
     */
    getEmailTemplateByKeyPublic: build.query<
      EmailTemplatePublicDto,
      { key: string; locale?: string | null }
    >({
      query: ({ key, locale }) => ({
        url: `/email_templates/by-key/${encodeURIComponent(key)}`,
        method: "GET",
        params: locale ? { locale } : undefined,
      }),
    }),

    /**
     * POST /email_templates/by-key/:key/render
     * Body: { params?: Record<string, unknown> }
     * Query: { locale? }
     */
    renderEmailTemplateByKeyPublic: build.mutation<
      RenderedEmailTemplateDto,
      RenderEmailTemplateByKeyPayload
    >({
      query: ({ key, locale, params }) => ({
        url: `/email_templates/by-key/${encodeURIComponent(key)}/render`,
        method: "POST",
        params: locale ? { locale } : undefined,
        body: {
          params: params ?? {},
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useListEmailTemplatesPublicQuery,
  useLazyListEmailTemplatesPublicQuery,
  useGetEmailTemplateByKeyPublicQuery,
  useLazyGetEmailTemplateByKeyPublicQuery,
  useRenderEmailTemplateByKeyPublicMutation,
} = emailTemplatesPublicApi;
