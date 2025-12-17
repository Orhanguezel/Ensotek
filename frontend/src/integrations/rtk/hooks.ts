// =============================================================
// FILE: src/integrations/rtk/hooks.ts
// Barrel exports for RTK Query hooks
// =============================================================

// Auth
export * from "./endpoints/auth.endpoints";

// Public
export * from "./endpoints/catalog_public.endpoints";
export * from "./endpoints/newsletter_public.endpoints";
export * from "./endpoints/offers_public.endpoints";
export * from "./endpoints/reviews.public.endpoints";
export * from "./endpoints/services.public.endpoints";
export * from "./endpoints/storage_public.endpoints";

// Content / shared
export * from "./endpoints/custom_pages.endpoints";
export * from "./endpoints/sliders.endpoints";
export * from "./endpoints/products.endpoints";
export * from "./endpoints/categories.endpoints";
export * from "./endpoints/subcategories.endpoints";
export * from "./endpoints/references.endpoints";
export * from "./endpoints/library.endpoints";
export * from "./endpoints/contacts.endpoints";

// Admin/Settings/Infra
export * from "./endpoints/site_settings.endpoints";
export * from "./endpoints/email_templates.endpoints";
export * from "./endpoints/faqs.endpoints";
export * from "./endpoints/menu_items.endpoints";
export * from "./endpoints/footer_sections.endpoints";
export * from "./endpoints/notifications.endpoints";
export * from "./endpoints/mail.endpoints";
export * from "./endpoints/support.endpoints";
export * from "./endpoints/profiles.endpoints";
export * from "./endpoints/user_roles.endpoints";
export * from "./endpoints/health.endpoints";
