"use client";

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/rtk/axiosBaseQuery";
import { buildCommonHeaders } from "@/lib/http";
import type { SupportedLocale } from "@/types/common";
import type {
  ApiEnvelope,
  LiteUserPayload,
  RegisterBody,
  LoginBody,
  GoogleBody,
  FacebookBody,
  ForgotPasswordBody,
  ResetPasswordBody,
} from "./types";

/** Uç temel yolu — gerekirse 'auth-lite' vs. yapabilirsin */
const AUTH_BASE = "authlite";

/**
 * RTK Query – Auth (cookie-based)
 * Notlar:
 * - withCredentials:true → HTTP-only cookie token’ı taşımak için zorunlu
 * - Accept-Language + X-Tenant header’ları buildCommonHeaders ile otomatik
 */
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AuthMe"],
  endpoints: (builder) => ({
    /* -------- session -------- */
    me: builder.query<LiteUserPayload | null, { locale?: SupportedLocale } | void>({
      query: (args) => ({
        url: `${AUTH_BASE}/me`,
        method: "GET",
        headers: args?.locale ? buildCommonHeaders(args.locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<LiteUserPayload>) => res?.data ?? null,
      providesTags: ["AuthMe"],
    }),

    logout: builder.mutation<{ success: boolean; message?: string }, { locale?: SupportedLocale } | void>({
      query: (args) => ({
        url: `${AUTH_BASE}/logout`,
        method: "POST",
        headers: args?.locale ? buildCommonHeaders(args.locale) : undefined,
      }),
      invalidatesTags: ["AuthMe"],
      transformResponse: (res: ApiEnvelope<any>) => ({ success: !!res?.success, message: res?.message }),
    }),

    /* -------- email/pass -------- */
    registerEmail: builder.mutation<LiteUserPayload, { body: RegisterBody; locale?: SupportedLocale }>({
      query: ({ body, locale }) => ({
        url: `${AUTH_BASE}/register-email`,
        method: "POST",
        data: body,
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<LiteUserPayload>) => res.data as LiteUserPayload,
      invalidatesTags: ["AuthMe"],
    }),

    loginEmail: builder.mutation<LiteUserPayload, { body: LoginBody; locale?: SupportedLocale }>({
      query: ({ body, locale }) => ({
        url: `${AUTH_BASE}/login-email`,
        method: "POST",
        data: body,
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<LiteUserPayload>) => res.data as LiteUserPayload,
      invalidatesTags: ["AuthMe"],
    }),

    /* -------- social -------- */
    loginGoogle: builder.mutation<LiteUserPayload, { body: GoogleBody; locale?: SupportedLocale }>({
      query: ({ body, locale }) => ({
        url: `${AUTH_BASE}/login-google`,
        method: "POST",
        data: body,
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<LiteUserPayload>) => res.data as LiteUserPayload,
      invalidatesTags: ["AuthMe"],
    }),

    loginFacebook: builder.mutation<LiteUserPayload, { body: FacebookBody; locale?: SupportedLocale }>({
      query: ({ body, locale }) => ({
        url: `${AUTH_BASE}/login-facebook`,
        method: "POST",
        data: body,
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<LiteUserPayload>) => res.data as LiteUserPayload,
      invalidatesTags: ["AuthMe"],
    }),

    /* -------- reset -------- */
    forgotPassword: builder.mutation<{ success: boolean; message?: string }, { body: ForgotPasswordBody; locale?: SupportedLocale }>({
      query: ({ body, locale }) => ({
        url: `${AUTH_BASE}/forgot-password`,
        method: "POST",
        data: body,
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<any>) => ({ success: !!res?.success, message: res?.message }),
    }),

    resetPassword: builder.mutation<LiteUserPayload, { body: ResetPasswordBody; locale?: SupportedLocale }>({
      query: ({ body, locale }) => ({
        url: `${AUTH_BASE}/reset-password`,
        method: "POST",
        data: body,
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<LiteUserPayload>) => res.data as LiteUserPayload,
      invalidatesTags: ["AuthMe"],
    }),
  }),
});

export const {
  useMeQuery,
  useLogoutMutation,
  useRegisterEmailMutation,
  useLoginEmailMutation,
  useLoginGoogleMutation,
  useLoginFacebookMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = userApi;
