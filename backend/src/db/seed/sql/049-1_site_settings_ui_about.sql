-- =============================================================
-- 049-1_site_settings_ui_about.sql  (About + About Stats UI strings)
-- site_settings.key IN ('ui_about', 'ui_about_stats')
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Upsert: ON DUPLICATE KEY UPDATE
--  - Optional bootstrap clone (collation-safe)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- =============================================================
-- ui_about
-- =============================================================
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_about',
  'tr',
  CAST(
    JSON_OBJECT(
      'ui_about_page_title',        'Hakkımızda',
      'ui_about_subprefix',         'Ensotek',
      'ui_about_sublabel',          'Hakkımızda',
      'ui_about_fallback_title',    'Ensotek Su Soğutma Kuleleri Hakkında',
      'ui_about_view_all',          'Tümünü Gör',

      'ui_about_page_description',  'Ensotek hakkında bilgi, kurumsal yaklaşımımız ve faaliyet alanlarımız.',
      'ui_about_meta_title',        'Hakkımızda',
      'ui_about_meta_description',  'Ensotek hakkında bilgi, kurumsal yaklaşımımız ve faaliyet alanlarımız.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_about',
  'en',
  CAST(
    JSON_OBJECT(
      'ui_about_page_title',        'About Us',
      'ui_about_subprefix',         'Ensotek',
      'ui_about_sublabel',          'About',
      'ui_about_fallback_title',    'About Ensotek Water Cooling Towers',
      'ui_about_view_all',          'View all',

      'ui_about_page_description',  'Information about Ensotek, our company and capabilities.',
      'ui_about_meta_title',        'About Us',
      'ui_about_meta_description',  'Information about Ensotek, our company and capabilities.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_about',
  'de',
  CAST(
    JSON_OBJECT(
      'ui_about_page_title',        'Über uns',
      'ui_about_subprefix',         'Ensotek',
      'ui_about_sublabel',          'Über uns',
      'ui_about_fallback_title',    'Über Ensotek Wasserkühltürme',
      'ui_about_view_all',          'Alle anzeigen',

      'ui_about_page_description',  'Informationen über Ensotek, unser Unternehmen und unsere Kompetenzen.',
      'ui_about_meta_title',        'Über uns',
      'ui_about_meta_description',  'Informationen über Ensotek, unser Unternehmen und unsere Kompetenzen.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);