-- =============================================================
-- 049-92_site_settings_ui_home.sql
-- Ensotek – UI Home (site_settings.ui_home)
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Upsert: ON DUPLICATE KEY UPDATE
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_home',
  'de',
  CAST(
    JSON_OBJECT(
      'ui_home_h1', 'Ensotek Su Soğutma Kuleleri ve Proses Soğutma Çözümleri'
    )
    AS CHAR CHARACTER SET utf8mb4
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
      'ui_home_h1', 'Ensotek Cooling Towers and Process Cooling Solutions'
    )
    AS CHAR CHARACTER SET utf8mb4
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
      'ui_home_h1', 'Ensotek Kühltürme und Prozesskühlung'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);
