"use client";

import { rootApi } from "@/lib/rtk/rootApi";
import type { SupportedLocale } from "@/types/common";
import type {
  IComment,
  ApiListResponse,
  ApiItemResponse,
  CreateCommentBody,
  ReplyPayload,
  CommentContentType,
  CommentType,
} from "./types";

/**
 * Routes (BE)
 * POST   /comment
 * GET    /comment/testimonials?{page,limit,minRating}
 * GET    /comment/user/me?{page,limit,type,includeGuest}
 * GET    /comment/:type/:id?{page,limit,type}
 * PUT    /comment/:id/toggle         (admin)
 * PUT    /comment/:id/reply          (admin)
 * DELETE /comment/:id                (admin)
 */

export const commentApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ---------- PUBLIC: Testimonials ---------- */
    testimonials: builder.query<
      ApiListResponse<IComment>,
      { page?: number; limit?: number; minRating?: number; locale?: SupportedLocale } | void
    >({
      query: (args) => {
        const p = new URLSearchParams();
        if (args?.page) p.set("page", String(args.page));
        if (args?.limit) p.set("limit", String(args.limit));
        if (args?.minRating) p.set("minRating", String(args.minRating));
        return {
          url: `comment/testimonials?${p.toString()}`,
          method: "GET",
          headers: args?.locale ? { "accept-language": String(args.locale) } : undefined,
        };
      },
      transformResponse: (res: ApiListResponse<IComment>) => res,
      providesTags: (res) => {
        const list = [{ type: "Comment" as const, id: "TESTIMONIALS" }];
        const items =
          res?.data?.map((c) => ({ type: "Comment" as const, id: String(c._id || "") })) ?? [];
        return [...list, ...items];
      },
      keepUnusedDataFor: 60,
    }),

    /* ---------- PUBLIC: İçeriğe göre yorumlar ---------- */
    commentsForContent: builder.query<
      ApiListResponse<IComment>,
      {
        contentType: CommentContentType;
        contentId: string;
        page?: number;
        limit?: number;
        /** yorum filtresi (örn: "testimonial" | "comment" ...) */
        type?: CommentType;
        locale?: SupportedLocale;
      }
    >({
      query: ({ contentType, contentId, page, limit, type, locale }) => {
        const p = new URLSearchParams();
        if (page) p.set("page", String(page));
        if (limit) p.set("limit", String(limit));
        if (type) p.set("type", String(type));
        return {
          url: `comment/${encodeURIComponent(contentType)}/${encodeURIComponent(contentId)}?${p.toString()}`,
          method: "GET",
          headers: locale ? { "accept-language": String(locale) } : undefined,
        };
      },
      transformResponse: (res: ApiListResponse<IComment>) => res,
      providesTags: (res, _e, arg) => {
        const list = [{ type: "Comment" as const, id: `LIST-${arg.contentType}-${arg.contentId}` }];
        const items =
          res?.data?.map((c) => ({ type: "Comment" as const, id: String(c._id || "") })) ?? [];
        return [...list, ...items];
      },
      keepUnusedDataFor: 60,
    }),

    /* ---------- PUBLIC/AUTH: Yorum oluşturma ---------- */
    create: builder.mutation<ApiItemResponse<IComment>, CreateCommentBody & { locale?: SupportedLocale }>({
      query: ({ locale, ...body }) => ({
        url: "comment",
        method: "POST",
        data: body, // JSON
        headers: locale ? { "accept-language": String(locale) } : undefined,
      }),
      transformResponse: (res: ApiItemResponse<IComment>) => res,
      invalidatesTags: (_res, _err, arg) => {
        // testimonial ise testimonials cache’i; değilse bağlı listeyi invalidates
        if ((arg.type || "comment") === "testimonial") {
          return [{ type: "Comment", id: "TESTIMONIALS" }];
        }
        if (arg.contentType && arg.contentId) {
          return [{ type: "Comment", id: `LIST-${arg.contentType}-${arg.contentId}` }];
        }
        return [{ type: "Comment", id: "LIST-UNKNOWN" }];
      },
    }),

    /* ---------- AUTH: Benim yorumlarım ---------- */
    myComments: builder.query<
      ApiListResponse<IComment>,
      { page?: number; limit?: number; type?: CommentType; includeGuest?: boolean; locale?: SupportedLocale } | void
    >({
      query: (args) => {
        const p = new URLSearchParams();
        if (args?.page) p.set("page", String(args.page));
        if (args?.limit) p.set("limit", String(args.limit));
        if (args?.type) p.set("type", String(args.type));
        if (args?.includeGuest != null) p.set("includeGuest", args.includeGuest ? "1" : "0");
        return {
          url: `comment/user/me?${p.toString()}`,
          method: "GET",
          headers: args?.locale ? { "accept-language": String(args.locale) } : undefined,
        };
      },
      transformResponse: (res: ApiListResponse<IComment>) => res,
      providesTags: (res) => {
        const list = [{ type: "Comment" as const, id: "MINE" }];
        const items =
          res?.data?.map((c) => ({ type: "Comment" as const, id: String(c._id || "") })) ?? [];
        return [...list, ...items];
      },
      keepUnusedDataFor: 30,
    }),

    /* ---------- ADMIN: publish toggle ---------- */
    togglePublish: builder.mutation<ApiItemResponse<IComment>, { id: string }>({
      query: ({ id }) => ({ url: `comment/${encodeURIComponent(id)}/toggle`, method: "PUT" }),
      transformResponse: (res: ApiItemResponse<IComment>) => res,
      invalidatesTags: (_res, _err, arg) => [{ type: "Comment", id: String(arg.id) }],
    }),

    /* ---------- ADMIN: sil ---------- */
    delete: builder.mutation<ApiItemResponse<{ _id: string; hardDeleted?: boolean }>, { id: string }>({
      query: ({ id }) => ({ url: `comment/${encodeURIComponent(id)}`, method: "DELETE" }),
      transformResponse: (res: ApiItemResponse<{ _id: string; hardDeleted?: boolean }>) => res,
      invalidatesTags: (_res, _err, arg) => [{ type: "Comment", id: String(arg.id) }],
    }),

    /* ---------- ADMIN: reply ---------- */
    reply: builder.mutation<ApiItemResponse<IComment>, ReplyPayload>({
      query: ({ id, text }) => ({
        url: `comment/${encodeURIComponent(id)}/reply`,
        method: "PUT",
        data: { text },
      }),
      transformResponse: (res: ApiItemResponse<IComment>) => res,
      invalidatesTags: (_res, _err, arg) => [{ type: "Comment", id: String(arg.id) }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useTestimonialsQuery: useTestimonialsQuery,
  useCommentsForContentQuery,
  useCreateMutation: useCreateCommentMutation,
  useMyCommentsQuery,
  useTogglePublishMutation,
  useDeleteMutation: useDeleteCommentMutation,
  useReplyMutation: useReplyToCommentMutation,
} = commentApi;
