// ===================================================================
// FILE: src/integrations/rtk/endpoints/admin/email_templates_admin.endpoints.ts
// Email Templates – ADMIN RTK endpoints (/admin/email_templates…)
// ===================================================================

import { baseApi } from "@/integrations/rtk/baseApi";
import type {
  EmailTemplateAdminListItemDto,
  EmailTemplateAdminDetailDto,
  EmailTemplateAdminListQueryParams,
  EmailTemplateAdminCreatePayload,
  EmailTemplateAdminUpdateArgs,
} from "@/integrations/types/email_templates.types";

export const emailTemplatesAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * GET /admin/email_templates
     * Query: { q?, locale?, is_active? }
     * (baseApi muhtemelen /api/admin prefix'li, biz sadece /email_templates deriz)
     */
    listEmailTemplatesAdmin: build.query<
      EmailTemplateAdminListItemDto[],
      EmailTemplateAdminListQueryParams | void
    >({
      query: (params?: EmailTemplateAdminListQueryParams) => ({
        url: "/email_templates",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "EmailTemplate" as const, id: "LIST" },
              ...result.map((r) => ({
                type: "EmailTemplate" as const,
                id: r.id,
              })),
            ]
          : [{ type: "EmailTemplate" as const, id: "LIST" }],
    }),

    /**
     * GET /admin/email_templates/:id
     * Detail: parent + translations[]
     */
    getEmailTemplateAdmin: build.query<
      EmailTemplateAdminDetailDto,
      string
    >({
      query: (id) => ({
        url: `/email_templates/${id}`,
        method: "GET",
      }),
      providesTags: (result, _err, id) => [
        { type: "EmailTemplate" as const, id },
      ],
    }),

    /**
     * POST /admin/email_templates
     * Body: EmailTemplateAdminCreatePayload
     */
    createEmailTemplateAdmin: build.mutation<
      EmailTemplateAdminDetailDto,
      EmailTemplateAdminCreatePayload
    >({
      query: (body) => ({
        url: "/email_templates",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "EmailTemplate" as const, id: "LIST" }],
    }),

    /**
     * PATCH /admin/email_templates/:id
     * Body: EmailTemplateAdminUpdatePayload
     */
    updateEmailTemplateAdmin: build.mutation<
      EmailTemplateAdminDetailDto,
      EmailTemplateAdminUpdateArgs
    >({
      query: ({ id, patch }) => ({
        url: `/email_templates/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result) =>
        result
          ? [
              { type: "EmailTemplate" as const, id: "LIST" },
              { type: "EmailTemplate" as const, id: result.id },
            ]
          : [{ type: "EmailTemplate" as const, id: "LIST" }],
    }),

    /**
     * DELETE /admin/email_templates/:id
     * 204 No Content
     */
    deleteEmailTemplateAdmin: build.mutation<void, string>({
      query: (id) => ({
        url: `/email_templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "EmailTemplate" as const, id: "LIST" },
        { type: "EmailTemplate" as const, id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListEmailTemplatesAdminQuery,
  useLazyListEmailTemplatesAdminQuery,
  useGetEmailTemplateAdminQuery,
  useLazyGetEmailTemplateAdminQuery,
  useCreateEmailTemplateAdminMutation,
  useUpdateEmailTemplateAdminMutation,
  useDeleteEmailTemplateAdminMutation,
} = emailTemplatesAdminApi;
