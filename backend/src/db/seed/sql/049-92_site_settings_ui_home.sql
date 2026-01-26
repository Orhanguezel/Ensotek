-- =============================================================
-- FILE: 049-92_site_settings_ui_home.sql (FINAL — Ensotek)
-- Ensotek – UI Home (site_settings.ui_home)
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - RERUNNABLE: upsert via UNIQUE(key, locale)
--  - Fix: MySQL 1093 -> no SELECT from target table in INSERT/UPSERT
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`) VALUES
(
  UUID(),
  'ui_home',
  'tr',
  CAST(
    JSON_OBJECT(
      'ui_home_h1', 'Ensotek Su Soğutma Kuleleri ve Proses Soğutma Çözümleri',
      'ui_home_meta_title', 'Ensotek Su Soğutma Kuleleri ve Proses Soğutma',
      'ui_home_meta_description', 'Açık ve kapalı devre FRP soğutma kuleleri. Keşif, üretim, montaj, bakım, modernizasyon, performans testleri ve yedek parça.'
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_home',
  'en',
  CAST(
    JSON_OBJECT(
      'ui_home_h1', 'Ensotek Cooling Towers and Process Cooling Solutions',
      'ui_home_meta_title', 'Ensotek Cooling Towers and Process Cooling',
      'ui_home_meta_description', 'Open and closed circuit FRP cooling towers. Engineering, manufacturing, installation, maintenance, modernization, performance testing and spare parts.'
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_home',
  'de',
  CAST(
    JSON_OBJECT(
      'ui_home_h1', 'Ensotek Kühltürme und Prozesskühlung',
      'ui_home_meta_title', 'Ensotek Kühltürme und Prozesskühlung',
      'ui_home_meta_description', 'Offene und geschlossene GFK Kühltürme. Herstellung und Montage, Wartung, Reparatur, Modernisierung, Leistungstests und Ersatzteile.'
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);
