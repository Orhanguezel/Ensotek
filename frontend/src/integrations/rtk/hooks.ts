// =============================================================
// FILE: src/integrations/rtk/hooks.ts
// Barrel exports for RTK Query hooks
// =============================================================

// Auth
export * from './public/auth.endpoints';

// Public
export * from './public/catalog_public.endpoints';
export * from './public/newsletter_public.endpoints';
export * from './public/offers_public.endpoints';
export * from './public/reviews.public.endpoints';
export * from './public/services.public.endpoints';
export * from './public/storage_public.endpoints';

// Content / shared
export * from './public/custom_pages.endpoints';
export * from './public/sliders.endpoints';
export * from './public/products.endpoints';
export * from './public/categories.endpoints';
export * from './public/subcategories.endpoints';
export * from './public/references.endpoints';
export * from './public/library.endpoints';
export * from './public/contacts.endpoints';

// Admin/Settings/Infra
export * from './public/site_settings.endpoints';
export * from './public/email_templates.endpoints';
export * from './public/faqs.endpoints';
export * from './public/menu_items.endpoints';
export * from './public/footer_sections.endpoints';
export * from './public/notifications.endpoints';
export * from './public/mail.endpoints';
export * from './public/support.endpoints';
export * from './public/profiles.endpoints';
export * from './public/user_roles.endpoints';
export * from './public/health.endpoints';

// =============================================================
// Admin – Ensotek
// Buradan sonrası sadece admin RTK endpoint hook’ları
// =============================================================

// Core / Auth / Dashboard
export * from './admin/auth.admin.endpoints';
export * from './admin/dashboard_admin.endpoints';
export * from './admin/db_admin.endpoints';

// Catalog / Products / Offers
export * from './admin/catalog_admin.endpoints';
export * from './admin/products_admin.endpoints';
export * from './admin/products_admin.reviews.endpoints';
export * from './admin/products_admin.faqs.endpoints';
export * from './admin/product_specs_admin.endpoints';
export * from './admin/offers_admin.endpoints';

// Content / CMS
export * from './admin/categories_admin.endpoints';
export * from './admin/subcategories_admin.endpoints';
export * from './admin/services_admin.endpoints';
export * from './admin/library_admin.endpoints';
export * from './admin/references_admin.endpoints';
export * from './admin/reviews_admin.endpoints';
export * from './admin/sliders_admin.endpoints';
export * from './admin/faqs_admin.endpoints';
export * from './admin/custom_pages_admin.endpoints';
export * from './admin/menu_items_admin.endpoints';
export * from './admin/footer_sections_admin.endpoints';

// Communication / Contacts / Newsletter / Support
export * from './admin/contacts_admin.endpoints';
export * from './admin/newsletter_admin.endpoints';
export * from './admin/email_templates_admin.endpoints';
export * from './admin/support_admin.endpoints';
export * from './admin/ticket_replies_admin.endpoints';

// System / Storage / Users / Settings
export * from './admin/site_settings_admin.endpoints';
export * from './admin/storage_admin.endpoints';
export * from './admin/users_admin.endpoints';
export * from './admin/audit_admin.endpoints';
