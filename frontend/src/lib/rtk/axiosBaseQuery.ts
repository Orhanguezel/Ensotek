// src/lib/rtk/axiosBaseQuery.ts
"use client";

import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import API from "@/lib/api";

/** Tüm slice'lar buradaki baseQuery'yi kullanır */
type Args = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: any;
  params?: any;
  headers?: AxiosRequestConfig["headers"];
  csrfDisabled?: boolean;
};

export const axiosBaseQuery =
  (): BaseQueryFn<Args, unknown, { status: number | "FETCH_ERROR"; data: any }> =>
  async ({ url, method = "GET", data, params, headers, csrfDisabled }) => {
    try {
      const res = await API.request({ url, method, data, params, headers, csrfDisabled });
      return { data: res.data };
    } catch (e) {
      const err = e as AxiosError<any>;
      return {
        error: {
          status: (err.response?.status as any) ?? "FETCH_ERROR",
          data: err.response?.data ?? err.message,
        },
      };
    }
  };
