-- =============================================================
-- 049-1_site_settings_ui_about.sql  (About UI metinleri)
-- site_settings.key = 'ui_about'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
VALUES
-- -------------------------------------------------------------
-- TR
-- -------------------------------------------------------------
(
  UUID(),
  'ui_about',
  'tr',
  JSON_OBJECT(
    -- Sayfa başlığı (Banner)
    'ui_about_page_title',      'Hakkımızda',

    -- Section subtitle
    'ui_about_subprefix',       'Ensotek',
    'ui_about_sublabel',        'Hakkımızda',

    -- Fallback başlık (home about section + page içi fallback)
    'ui_about_fallback_title',  'Ensotek Su Soğutma Kuleleri Hakkında',

    -- CTA / link text
    'ui_about_view_all',        'Tümünü Gör'
  ),
  NOW(3),
  NOW(3)
),
-- -------------------------------------------------------------
-- EN
-- -------------------------------------------------------------
(
  UUID(),
  'ui_about',
  'en',
  JSON_OBJECT(
    -- Page title (Banner)
    'ui_about_page_title',      'About Us',

    -- Section subtitle
    'ui_about_subprefix',       'Ensotek',
    'ui_about_sublabel',        'About',

    -- Fallback title (home about section + page content fallback)
    'ui_about_fallback_title',  'About Ensotek Water Cooling Towers',

    -- CTA / link text
    'ui_about_view_all',        'View all'
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`    = VALUES(`value`),
  updated_at = VALUES(updated_at);

-- -------------------------------------------------------------
-- TR → DE otomatik kopya (Almanca özel çeviri gelene kadar)
-- -------------------------------------------------------------
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
SELECT UUID(), s.`key`, 'de', s.`value`, NOW(3), NOW(3)
FROM site_settings s
WHERE s.locale = 'tr'
  AND s.`key` = 'ui_about'
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE t.`key` = s.`key`
      AND t.locale = 'de'
  );
