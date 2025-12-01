// src/lib/company/api.client.ts
"use client";

import { rootApi } from "@/lib/rtk/rootApi";
import type { SupportedLocale } from "@/types/common";
import type {
  ICompany,
  ApiEnvelope,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "./types";

/**
 * RTK Query — Company (public + admin uçlar)
 *  - baseQuery: axiosBaseQuery() (tenant + Accept-Language interceptor’ları hazır)
 *  - locale override gerekiyorsa lower-case "accept-language" gönderiyoruz
 *  - Kaynak tekil olduğu için "SINGLE" tag id yedeği var
 */
export const companyApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /company — tekil şirket bilgisi (public/admin aynı uç) */
    info: builder.query<ICompany, { locale?: SupportedLocale } | void>({
      query: (args) => ({
        url: "company",
        method: "GET",
        headers: args?.locale ? { "accept-language": String(args.locale) } : undefined,
      }),
      transformResponse: (res: ApiEnvelope<ICompany> | ICompany) =>
        (res as any)?.data ?? (res as ICompany),
      providesTags: (result) =>
        result && (result as any)._id
          ? [{ type: "Company" as const, id: (result as any)._id }]
          : [{ type: "Company" as const, id: "SINGLE" }],
    }),

    /** POST /company — admin create (FormData desteği) */
    createAdmin: builder.mutation<ICompany, CreateCompanyPayload>({
      query: (payload) => {
        const fd = toFormData(payload);
        return { url: "company", method: "POST", data: fd };
      },
      transformResponse: (res: ApiEnvelope<ICompany> | ICompany) =>
        (res as any)?.data ?? (res as ICompany),
      invalidatesTags: [{ type: "Company", id: "SINGLE" }],
    }),

    /** PUT /company/:id — admin update (FormData + images/removedImages) */
    updateAdmin: builder.mutation<ICompany, UpdateCompanyPayload>({
      query: ({ _id, images, removedImages, ...rest }) => {
        const fd = toFormData(rest);

        // images File[] desteği
        if (Array.isArray(images)) {
          images.forEach((f) => {
            if (typeof File !== "undefined" && f instanceof File) {
              fd.append("images", f);
            }
          });
        }
        if (removedImages?.length) {
          fd.append("removedImages", JSON.stringify(removedImages));
        }

        return { url: `company/${encodeURIComponent(_id)}`, method: "PUT", data: fd };
      },
      transformResponse: (res: ApiEnvelope<ICompany> | ICompany) =>
        (res as any)?.data ?? (res as ICompany),
      invalidatesTags: (result) =>
        result && (result as any)._id
          ? [{ type: "Company", id: (result as any)._id }]
          : [{ type: "Company", id: "SINGLE" }],
    }),

    /** DELETE /company/:id — admin delete */
    deleteAdmin: builder.mutation<{ id: string; message?: string }, string>({
      query: (id) => ({ url: `company/${encodeURIComponent(id)}`, method: "DELETE" }),
      transformResponse: (res: any, _e, id) => ({
        id,
        message: (res?.data?.message ?? res?.message) as string | undefined,
      }),
      invalidatesTags: [{ type: "Company", id: "SINGLE" }],
    }),
  }),
  overrideExisting: false,
});

/* ---------------------------- Helpers ---------------------------- */
function toFormData(data: Record<string, any>): FormData {
  const fd = new FormData();
  appendFormData(fd, data);
  return fd;
}

// nested obj/array/file destekli
function appendFormData(fd: FormData, data: Record<string, any>, parent?: string) {
  Object.entries(data ?? {}).forEach(([key, value]) => {
    const name = parent ? `${parent}[${key}]` : key;
    if (value === undefined || value === null) return;

    if (typeof File !== "undefined" && value instanceof File) {
      fd.append(name, value);
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (typeof File !== "undefined" && v instanceof File) fd.append(name, v);
        else if (typeof v === "object" && v !== null) appendFormData(fd, v, `${name}[${i}]`);
        else fd.append(`${name}[${i}]`, String(v));
      });
    } else if (typeof value === "object") {
      appendFormData(fd, value, name);
    } else {
      fd.append(name, String(value));
    }
  });
}

export const {
  useInfoQuery: useCompanyInfoQuery,
  useCreateAdminMutation: useCompanyCreateAdminMutation,
  useUpdateAdminMutation: useCompanyUpdateAdminMutation,
  useDeleteAdminMutation: useCompanyDeleteAdminMutation,
} = companyApi;
