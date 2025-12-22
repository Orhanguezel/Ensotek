-- =============================================================
-- 049-2_site_settings_ui_references.sql  (References UI strings)
-- site_settings.key = 'ui_references'
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Extendable: clone from tr as bootstrap (collation-safe)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_references',
  'tr',
  CAST(JSON_OBJECT(
    'ui_references_page_title',   'Referanslarımız',
    'ui_references_title',        'Referanslarımız',
    'ui_references_subprefix',    'Ensotek',
    'ui_references_sublabel',     'Referanslar',
    'ui_references_page_intro',
      'Yurt içi ve yurt dışında tamamladığımız projelerden seçili referanslarımız.',
    'ui_references_view_all',     'Tüm Referanslar',
    'ui_references_prev',         'Önceki',
    'ui_references_next',         'Sonraki',
    'ui_references_tab_all',      'Tümü',
    'ui_references_tab_other',    'Diğer Projeler',
    'ui_references_empty',
      'Şu anda görüntülenecek referans bulunmamaktadır.'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_references',
  'en',
  CAST(JSON_OBJECT(
    'ui_references_page_title',   'Our References',
    'ui_references_title',        'Our References',
    'ui_references_subprefix',    'Ensotek',
    'ui_references_sublabel',     'References',
    'ui_references_page_intro',
      'Selected references from our completed projects in Turkey and abroad.',
    'ui_references_view_all',     'View all references',
    'ui_references_prev',         'Previous',
    'ui_references_next',         'Next',
    'ui_references_tab_all',      'All',
    'ui_references_tab_other',    'Other Projects',
    'ui_references_empty',
      'There are no references to display at the moment.'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_references',
  'de',
  CAST(JSON_OBJECT(
    'ui_references_page_title',   'Unsere Referenzen',
    'ui_references_title',        'Unsere Referenzen',
    'ui_references_subprefix',    'Ensotek',
    'ui_references_sublabel',     'Referenzen',
    'ui_references_page_intro',
      'Ausgewählte Referenzen aus unseren abgeschlossenen Projekten im In- und Ausland.',
    'ui_references_view_all',     'Alle Referenzen anzeigen',
    'ui_references_prev',         'Zurück',
    'ui_references_next',         'Weiter',
    'ui_references_tab_all',      'Alle',
    'ui_references_tab_other',    'Weitere Projekte',
    'ui_references_empty',
      'Derzeit sind keine Referenzen verfügbar.'
  ) AS CHAR),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- OPTIONAL BOOTSTRAP CLONE (COLLATION-SAFE): TR → TARGET
SET @TARGET_LOCALE := 'de';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
SELECT
  UUID(),
  s.`key`,
  CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci,
  s.`value`,
  NOW(3),
  NOW(3)
FROM site_settings s
WHERE (s.locale COLLATE utf8mb4_unicode_ci) = ('tr' COLLATE utf8mb4_unicode_ci)
  AND (s.`key`  COLLATE utf8mb4_unicode_ci) = ('ui_references' COLLATE utf8mb4_unicode_ci)
  AND (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci) <> ('tr' COLLATE utf8mb4_unicode_ci)
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE (t.`key`  COLLATE utf8mb4_unicode_ci) = (s.`key` COLLATE utf8mb4_unicode_ci)
      AND (t.locale COLLATE utf8mb4_unicode_ci) = (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci)
  );
