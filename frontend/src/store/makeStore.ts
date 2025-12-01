// src/store/makeStore.ts
"use client";

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { rootApi } from "@/lib/rtk/rootApi";
import { baseApi } from "@/integrations/rtk/baseApi";
import { galleryApi } from "@/lib/gallery/api.client";

// RTK Query api instance tipi (reducerPath, reducer, middleware taşıyan her şey)
type AnyApi = {
  reducerPath: string;
  reducer: any;
  middleware: any;
};

// Store’da kullanacağımız tüm createApi instance’ları
const apis: AnyApi[] = [
  rootApi,
  baseApi,    // ⬅️ ENSOTEK public API (metahubApi)
  galleryApi,
].filter(Boolean) as AnyApi[];

export function makeStore() {
  const reducer = {
    // Tüm API’leri dinamik olarak ekle
    ...Object.fromEntries(
      apis.map((api) => [api.reducerPath, api.reducer]),
    ),
  };

  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }).concat(apis.map((api) => api.middleware)),
    devTools: process.env.NODE_ENV !== "production",
  });

  setupListeners(store.dispatch);
  return store;
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
