-- =============================================================
-- 049-2_site_settings_ui_references.sql  (References UI strings) [FINAL]
-- site_settings.key = 'ui_references'
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Extendable: add new keys anytime
--  - UPSERT safe: ON DUPLICATE KEY UPDATE
--  - Requires UNIQUE KEY (key, locale) on site_settings
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_references',
  'tr',
  CAST(JSON_OBJECT(
    -- Section / slider
    'ui_references_page_title',        'Referanslarımız',
    'ui_references_title',             'Referanslarımız',
    'ui_references_subprefix',         'Ensotek',
    'ui_references_sublabel',          'Referanslar',
    'ui_references_page_intro',        'Yurt içi ve yurt dışında tamamladığımız projelerden seçili referanslarımız.',
    'ui_references_view_all',          'Tüm Referanslar',
    'ui_references_prev',              'Önceki',
    'ui_references_next',              'Sonraki',

    -- Tabs / filters
    'ui_references_tab_all',           'Tümü',
    'ui_references_subtab_all',        'Tümü',
    'ui_references_tab_fallback',      'Kategori',
    'ui_references_subtab_fallback',   'Alt Kategori',
    'ui_references_tab_other',         'Diğer Projeler',

    -- Empty / meta lines
    'ui_references_empty',             'Şu anda görüntülenecek referans bulunmamaktadır.',
    'ui_references_meta_line',         '{total} kayıt · Sayfa {page} / {pages}',
    'ui_references_meta_single',       '{total} kayıt görüntüleniyor',

    -- SEO (page-level)
    'ui_references_meta_title',        '',
    'ui_references_meta_description',  '',
    'ui_references_page_description',  ''
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_references',
  'en',
  CAST(JSON_OBJECT(
    -- Section / slider
    'ui_references_page_title',        'Our References',
    'ui_references_title',             'Our References',
    'ui_references_subprefix',         'Ensotek',
    'ui_references_sublabel',          'References',
    'ui_references_page_intro',        'Selected references from our completed projects in Turkey and abroad.',
    'ui_references_view_all',          'View all references',
    'ui_references_prev',              'Previous',
    'ui_references_next',              'Next',

    -- Tabs / filters
    'ui_references_tab_all',           'All',
    'ui_references_subtab_all',        'All',
    'ui_references_tab_fallback',      'Category',
    'ui_references_subtab_fallback',   'Subcategory',
    'ui_references_tab_other',         'Other Projects',

    -- Empty / meta lines
    'ui_references_empty',             'There are no references to display at the moment.',
    'ui_references_meta_line',         '{total} records · Page {page} of {pages}',
    'ui_references_meta_single',       '{total} records displayed',

    -- SEO (page-level)
    'ui_references_meta_title',        '',
    'ui_references_meta_description',  '',
    'ui_references_page_description',  ''
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_references',
  'de',
  CAST(JSON_OBJECT(
    -- Section / slider
    'ui_references_page_title',        'Unsere Referenzen',
    'ui_references_title',             'Unsere Referenzen',
    'ui_references_subprefix',         'Ensotek',
    'ui_references_sublabel',          'Referenzen',
    'ui_references_page_intro',        'Ausgewählte Referenzen aus unseren abgeschlossenen Projekten im In- und Ausland.',
    'ui_references_view_all',          'Alle Referenzen anzeigen',
    'ui_references_prev',              'Zurück',
    'ui_references_next',              'Weiter',

    -- Tabs / filters
    'ui_references_tab_all',           'Alle',
    'ui_references_subtab_all',        'Alle',
    'ui_references_tab_fallback',      'Kategorie',
    'ui_references_subtab_fallback',   'Unterkategorie',
    'ui_references_tab_other',         'Weitere Projekte',

    -- Empty / meta lines
    'ui_references_empty',             'Derzeit sind keine Referenzen verfügbar.',
    'ui_references_meta_line',         '{total} Einträge · Seite {page} von {pages}',
    'ui_references_meta_single',       '{total} Einträge angezeigt',

    -- SEO (page-level)
    'ui_references_meta_title',        '',
    'ui_references_meta_description',  '',
    'ui_references_page_description',  ''
  ) AS CHAR),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);
