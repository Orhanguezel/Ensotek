-- =============================================================
-- 049-1_site_settings_ui_about.sql  (About + About Stats UI strings)
-- site_settings.key IN ('ui_about', 'ui_about_stats')
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Extendable: clone from tr as bootstrap (collation-safe)
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
  CAST(JSON_OBJECT(
    'ui_about_page_title',      'Hakkımızda',
    'ui_about_subprefix',       'Ensotek',
    'ui_about_sublabel',        'Hakkımızda',
    'ui_about_fallback_title',  'Ensotek Su Soğutma Kuleleri Hakkında',
    'ui_about_view_all',        'Tümünü Gör'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_about',
  'en',
  CAST(JSON_OBJECT(
    'ui_about_page_title',      'About Us',
    'ui_about_subprefix',       'Ensotek',
    'ui_about_sublabel',        'About',
    'ui_about_fallback_title',  'About Ensotek Water Cooling Towers',
    'ui_about_view_all',        'View all'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_about',
  'de',
  CAST(JSON_OBJECT(
    'ui_about_page_title',      'Über uns',
    'ui_about_subprefix',       'Ensotek',
    'ui_about_sublabel',        'Über uns',
    'ui_about_fallback_title',  'Über Ensotek Wasserkühltürme',
    'ui_about_view_all',        'Alle anzeigen'
  ) AS CHAR),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- OPTIONAL BOOTSTRAP CLONE (COLLATION-SAFE): TR → TARGET (ui_about)
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
  AND (s.`key`  COLLATE utf8mb4_unicode_ci) = ('ui_about' COLLATE utf8mb4_unicode_ci)
  AND (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci) <> ('tr' COLLATE utf8mb4_unicode_ci)
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE (t.`key`  COLLATE utf8mb4_unicode_ci) = (s.`key` COLLATE utf8mb4_unicode_ci)
      AND (t.locale COLLATE utf8mb4_unicode_ci) = (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci)
  );

-- =============================================================
-- ui_about_stats
-- =============================================================
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_about_stats',
  'tr',
  CAST(JSON_OBJECT(
    'ui_about_stats_refs_value',    '120',
    'ui_about_stats_refs_title',    'Sanayi referansımız',
    'ui_about_stats_refs_label',    'Referans müşteri & tesis',

    'ui_about_stats_projects_value','250',
    'ui_about_stats_projects_title','Tamamlanan proje',
    'ui_about_stats_projects_label','Yurtiçi ve yurtdışı projeler',

    'ui_about_stats_years_value',   '20',
    'ui_about_stats_years_title',   'Yıllık tecrübe',
    'ui_about_stats_years_label',   'Su soğutma ve proses soğutma',

    'ui_about_stats_suffix_letter', '',
    'ui_about_stats_suffix_plus',   '+'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_about_stats',
  'en',
  CAST(JSON_OBJECT(
    'ui_about_stats_refs_value',    '120',
    'ui_about_stats_refs_title',    'Industrial references',
    'ui_about_stats_refs_label',    'Reference customers & plants',

    'ui_about_stats_projects_value','250',
    'ui_about_stats_projects_title','Completed projects',
    'ui_about_stats_projects_label','Domestic and international projects',

    'ui_about_stats_years_value',   '20',
    'ui_about_stats_years_title',   'Years of experience',
    'ui_about_stats_years_label',   'Cooling tower & process cooling',

    'ui_about_stats_suffix_letter', '',
    'ui_about_stats_suffix_plus',   '+'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_about_stats',
  'de',
  CAST(JSON_OBJECT(
    'ui_about_stats_refs_value',    '120',
    'ui_about_stats_refs_title',    'Industrie-Referenzen',
    'ui_about_stats_refs_label',    'Referenzkunden & Anlagen',

    'ui_about_stats_projects_value','250',
    'ui_about_stats_projects_title','Abgeschlossene Projekte',
    'ui_about_stats_projects_label','Nationale und internationale Projekte',

    'ui_about_stats_years_value',   '20',
    'ui_about_stats_years_title',   'Jahre Erfahrung',
    'ui_about_stats_years_label',   'Kühlturm- und Prozesskühlung',

    'ui_about_stats_suffix_letter', '',
    'ui_about_stats_suffix_plus',   '+'
  ) AS CHAR),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- OPTIONAL BOOTSTRAP CLONE (COLLATION-SAFE): TR → TARGET (ui_about_stats)
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
  AND (s.`key`  COLLATE utf8mb4_unicode_ci) = ('ui_about_stats' COLLATE utf8mb4_unicode_ci)
  AND (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci) <> ('tr' COLLATE utf8mb4_unicode_ci)
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE (t.`key`  COLLATE utf8mb4_unicode_ci) = (s.`key` COLLATE utf8mb4_unicode_ci)
      AND (t.locale COLLATE utf8mb4_unicode_ci) = (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci)
  );
