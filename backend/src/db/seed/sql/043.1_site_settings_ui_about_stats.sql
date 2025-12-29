-- =============================================================
-- 043.1_site_settings_ui_about_stats.sql
-- Ensotek – UI strings: About counters (ui_about_stats)
--  - Localized: tr / en / de
--  - Used by: src/components/containers/about/AboutCounter.tsx
--  - Keys:
--    ui_about_stats_suffix_letter, ui_about_stats_suffix_plus
--    ui_about_stats_refs_value/title/label
--    ui_about_stats_projects_value/title/label
--    ui_about_stats_years_value/title/label
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- =============================================================
-- ui_about_stats (TR/EN/DE)
-- =============================================================
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_about_stats',
  'tr',
  CAST(
    JSON_OBJECT(
      'ui_about_stats_suffix_letter', '',
      'ui_about_stats_suffix_plus', '+',

      'ui_about_stats_refs_value', '1500',
      'ui_about_stats_refs_title', 'Sanayi Referansımız',
      'ui_about_stats_refs_label', 'Referans müşteri & tesis',

      'ui_about_stats_projects_value', '5000',
      'ui_about_stats_projects_title', 'Tamamlanan Proje',
      'ui_about_stats_projects_label', 'Yurtiçi ve yurtdışı projeler',

      'ui_about_stats_years_value', '40',
      'ui_about_stats_years_title', 'Yıllık Tecrübe',
      'ui_about_stats_years_label', 'Su soğutma ve proses soğutma'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_about_stats',
  'en',
  CAST(
    JSON_OBJECT(
      'ui_about_stats_suffix_letter', '',
      'ui_about_stats_suffix_plus', '+',

      'ui_about_stats_refs_value', '1500',
      'ui_about_stats_refs_title', 'Industrial References',
      'ui_about_stats_refs_label', 'Reference customers & facilities',

      'ui_about_stats_projects_value', '5000',
      'ui_about_stats_projects_title', 'Completed Projects',
      'ui_about_stats_projects_label', 'Domestic and international projects',

      'ui_about_stats_years_value', '40',
      'ui_about_stats_years_title', 'Years of Experience',
      'ui_about_stats_years_label', 'Water cooling and process cooling'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_about_stats',
  'de',
  CAST(
    JSON_OBJECT(
      'ui_about_stats_suffix_letter', '',
      'ui_about_stats_suffix_plus', '+',

      'ui_about_stats_refs_value', '1500',
      'ui_about_stats_refs_title', 'Industrie-Referenzen',
      'ui_about_stats_refs_label', 'Referenzkunden & Anlagen',

      'ui_about_stats_projects_value', '5000',
      'ui_about_stats_projects_title', 'Abgeschlossene Projekte',
      'ui_about_stats_projects_label', 'Nationale und internationale Projekte',

      'ui_about_stats_years_value', '40',
      'ui_about_stats_years_title', 'Jahre Erfahrung',
      'ui_about_stats_years_label', 'Wasserkühlung und Prozesskühlung'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);
