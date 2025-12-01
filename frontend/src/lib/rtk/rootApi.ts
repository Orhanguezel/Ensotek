// src/lib/rtk/rootApi.ts
"use client";

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

/** Tek kaynak: tüm tag tipleri (literal union) */
export const TAGS = [
  // core
  "Section", "Layout",
  "Contact", "ContactList",

  // domain
  "Services", "ServicesList", "ServicesAdminList",
  "News", "NewsList",
  "About", "AboutList", "AboutCategory",
  "Company",
  "Library", "LibraryList", "LibraryCategory",

  // settings (tekil & çoğul — geri uyumluluk)
  "Setting", "SettingList", "SettingAdminList",
  "Settings", "SettingsList", "SettingsAdminList",

  // diğerleri
  "Team",
  "References",
  "Reactions",
  "Payments",
  "Order", "Offer",
  "Notification",
  "Newsletter", "NewsletterList",
  "Invoices", "Invoice",
  "Gallery", "GalleryList",
  "Files", "File",
  "FAQ", "FAQList",
  "Dashboard",
  "Customer", "CustomerList",
  "Comments", "Comment",
  "Checkout", "Checout",
  "Chat", "Message",
  "Catalog", "CatalogList",
  "Cart",
  "Blog", "BlogList", "BlogCategory",
  "AdminModules",

  // gelecekte
  "Skill", "SkillList", "SkillCategory",
] as const;

export type ApiTag = typeof TAGS[number];

export const rootApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: TAGS,
  /**
   * Performans + SEO (fazla istek yok, agresif cache):
   * - odağı kaybedince/geri bağlanınca refetch yok
   * - kullanılmayan veriyi 10 dk cache’te tut
   * - invalidation batching
   */
  refetchOnFocus: false,
  refetchOnReconnect: false,
  keepUnusedDataFor: 600,        // seconds
  invalidationBehavior: "delayed",
  endpoints: () => ({}),
});
