-- =============================================================
-- FILE: 301_kompozit_site_settings.seed.sql
-- MOE Kompozit — site_settings (kompozit__ prefix)
-- Keys: app_locales, seo, logo, site_logo, site_favicon, site_apple_touch_icon, site_og_default_image, contact_info, branding
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =============================================================
-- APP LOCALES — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__app_locales',
  '*',
  JSON_ARRAY(
    JSON_OBJECT('code', 'tr', 'label', 'Türkçe', 'is_default', true, 'is_active', true),
    JSON_OBJECT('code', 'en', 'label', 'English', 'is_default', false, 'is_active', true),
    JSON_OBJECT('code', 'de', 'label', 'Deutsch', 'is_default', false, 'is_active', false)
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SEO — TR
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__seo',
  'tr',
  JSON_OBJECT(
    'site_title',       'MOE Kompozit | Karbon Fiber & CTP Kompozit Üretimi',
    'site_description', 'Karbon fiber, CTP ve cam elyaf kompozit üretiminde endüstriyel çözümler. Özel üretim, yüksek kalite, hızlı teslimat.',
    'keywords',         'karbon fiber, CTP, cam elyaf, kompozit, endüstriyel üretim, özel üretim, MOE Kompozit',
    'og_image',         '',
    'og_type',          'website'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SEO — EN
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__seo',
  'en',
  JSON_OBJECT(
    'site_title',       'MOE Kompozit | Carbon Fiber & FRP Composite Manufacturing',
    'site_description', 'Industrial solutions in carbon fiber, FRP and fiberglass composite manufacturing. Custom production, high quality, fast delivery.',
    'keywords',         'carbon fiber, FRP, fiberglass, composite, industrial manufacturing, custom production, MOE Kompozit',
    'og_image',         '',
    'og_type',          'website'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- LOGO — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__logo',
  '*',
  JSON_OBJECT(
    'logo_url',         '',
    'logo_alt',         'MOE Kompozit',
    'favicon_url',      '',
    'logo_dark_url',    ''
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SITE LOGO — global (locale='*')
-- Standard site_settings media keys under kompozit__ prefix
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__site_logo',
  '*',
  JSON_OBJECT(
    'logo_url',              '',
    'logo_alt',              'MOE Kompozit',
    'logo_dark_url',         '',
    'favicon_url',           '',
    'apple_touch_icon_url',  ''
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SITE FAVICON — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__site_favicon',
  '*',
  JSON_OBJECT(
    'url', '',
    'alt', 'MOE Kompozit Favicon'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SITE APPLE TOUCH ICON — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__site_apple_touch_icon',
  '*',
  JSON_OBJECT(
    'url', '',
    'alt', 'MOE Kompozit Apple Touch Icon'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SITE OG DEFAULT IMAGE — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__site_og_default_image',
  '*',
  JSON_OBJECT(
    'url', '',
    'alt', 'MOE Kompozit OG Default Image'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- CONTACT INFO — TR
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__contact_info',
  'tr',
  JSON_OBJECT(
    'company_name',     'MOE Kompozit',
    'address',          '',
    'city',             '',
    'country',          'Türkiye',
    'phone',            '',
    'phone_2',          '',
    'email',            'info@karbonkompozit.com.tr',
    'email_2',          '',
    'working_hours',    'Pazartesi - Cuma: 08:00 - 17:00',
    'maps_embed_url',   '',
    'maps_lat',         '',
    'maps_lng',         ''
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- CONTACT INFO — EN
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__contact_info',
  'en',
  JSON_OBJECT(
    'company_name',     'MOE Kompozit',
    'address',          '',
    'city',             '',
    'country',          'Turkey',
    'phone',            '',
    'phone_2',          '',
    'email',            'info@karbonkompozit.com.tr',
    'email_2',          '',
    'working_hours',    'Monday - Friday: 08:00 - 17:00',
    'maps_embed_url',   '',
    'maps_lat',         '',
    'maps_lng',         ''
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- BRANDING — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__branding',
  '*',
  JSON_OBJECT(
    'brand_name',       'MOE Kompozit',
    'brand_tagline_tr', 'Endüstriyel Kompozit Çözümler',
    'brand_tagline_en', 'Industrial Composite Solutions',
    'primary_color',    '#ea580c',
    'accent_color',     '#fb923c',
    'dark_color',       '#111827',
    'font_family',      'Inter',
    'font_display',     'Syne'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
