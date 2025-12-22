// =============================================================
// FILE: src/integrations/rtk/hooks.ts
// Barrel exports for RTK Query hooks
// =============================================================

// Auth
export * from './endpoints/auth.endpoints';

// Public
export * from './endpoints/catalog_public.endpoints';
export * from './endpoints/newsletter_public.endpoints';
export * from './endpoints/offers_public.endpoints';
export * from './endpoints/reviews.public.endpoints';
export * from './endpoints/services.public.endpoints';
export * from './endpoints/storage_public.endpoints';

// Content / shared
export * from './endpoints/custom_pages.endpoints';
export * from './endpoints/sliders.endpoints';
export * from './endpoints/products.endpoints';
export * from './endpoints/categories.endpoints';
export * from './endpoints/subcategories.endpoints';
export * from './endpoints/references.endpoints';
export * from './endpoints/library.endpoints';
export * from './endpoints/contacts.endpoints';

// Admin/Settings/Infra
export * from './endpoints/site_settings.endpoints';
export * from './endpoints/email_templates.endpoints';
export * from './endpoints/faqs.endpoints';
export * from './endpoints/menu_items.endpoints';
export * from './endpoints/footer_sections.endpoints';
export * from './endpoints/notifications.endpoints';
export * from './endpoints/mail.endpoints';
export * from './endpoints/support.endpoints';
export * from './endpoints/profiles.endpoints';
export * from './endpoints/user_roles.endpoints';
export * from './endpoints/health.endpoints';

// =============================================================
// Admin – Ensotek
// Buradan sonrası sadece admin RTK endpoint hook’ları
// =============================================================

// Core / Auth / Dashboard
export * from './endpoints/admin/auth.admin.endpoints';
export * from './endpoints/admin/dashboard_admin.endpoints';
export * from './endpoints/admin/db_admin.endpoints';

// Catalog / Products / Offers
export * from './endpoints/admin/catalog_admin.endpoints';
export * from './endpoints/admin/products_admin.endpoints';
export * from './endpoints/admin/products_admin.reviews.endpoints';
export * from './endpoints/admin/products_admin.faqs.endpoints';
export * from './endpoints/admin/product_specs_admin.endpoints';
export * from './endpoints/admin/offers_admin.endpoints';

// Content / CMS
export * from './endpoints/admin/categories_admin.endpoints';
export * from './endpoints/admin/subcategories_admin.endpoints';
export * from './endpoints/admin/services_admin.endpoints';
export * from './endpoints/admin/library_admin.endpoints';
export * from './endpoints/admin/references_admin.endpoints';
export * from './endpoints/admin/reviews_admin.endpoints';
export * from './endpoints/admin/sliders_admin.endpoints';
export * from './endpoints/admin/faqs_admin.endpoints';
export * from './endpoints/admin/custom_pages_admin.endpoints';
export * from './endpoints/admin/menu_items_admin.endpoints';
export * from './endpoints/admin/footer_sections_admin.endpoints';

// Communication / Contacts / Newsletter / Support
export * from './endpoints/admin/contacts_admin.endpoints';
export * from './endpoints/admin/newsletter_admin.endpoints';
export * from './endpoints/admin/email_templates_admin.endpoints';
export * from './endpoints/admin/support_admin.endpoints';
export * from './endpoints/admin/ticket_replies_admin.endpoints';

// System / Storage / Users / Settings
export * from './endpoints/admin/site_settings_admin.endpoints';
export * from './endpoints/admin/storage_admin.endpoints';
export * from './endpoints/admin/users_admin.endpoints';
