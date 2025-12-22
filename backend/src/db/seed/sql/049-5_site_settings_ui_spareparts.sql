-- =============================================================
-- 049-5_site_settings_ui_spareparts.sql
-- Ensotek – UI Spareparts (site_settings.ui_spareparts)
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Extendable: clone from tr as bootstrap (collation-safe)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_spareparts',
  'tr',
  CAST(JSON_OBJECT(
    'ui_spareparts_kicker_prefix',    'Ensotek',
    'ui_spareparts_kicker_label',     'Yedek Parçalar',
    'ui_spareparts_title_prefix',     'Kule',
    'ui_spareparts_title_mark',       'Yedek Parçaları',
    'ui_spareparts_read_more',        'Detayları görüntüle',
    'ui_spareparts_read_more_aria',   'yedek parça detayını görüntüle',
    'ui_spareparts_price_label',      'Başlangıç fiyatı',
    'ui_spareparts_view_all',         'Tüm Yedek Parçalar',
    'ui_spareparts_empty',
      'Şu anda görüntülenecek yedek parça bulunmamaktadır.',

    'ui_spareparts_page_title',       'Yedek Parçalar',
    'ui_spareparts_page_intro',
      'Su soğutma kuleleri ve proses soğutma sistemleri için yedek parça ve sarf malzemeleri.',

    'ui_spareparts_detail_page_title','Yedek Parça Detayı',
    'ui_spareparts_back_to_list',     'Tüm yedek parçalara dön',
    'ui_spareparts_loading',          'Yedek parça yükleniyor...',
    'ui_spareparts_not_found',        'Yedek parça bulunamadı.',
    'ui_spareparts_specs_title',      'Teknik Özellikler',
    'ui_spareparts_tags_title',       'Etiketler',

    'ui_spareparts_more_title',       'Diğer Yedek Parçalar'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_spareparts',
  'en',
  CAST(JSON_OBJECT(
    'ui_spareparts_kicker_prefix',    'Ensotek',
    'ui_spareparts_kicker_label',     'Spare Parts',
    'ui_spareparts_title_prefix',     'Tower',
    'ui_spareparts_title_mark',       'Spare Parts',
    'ui_spareparts_read_more',        'View details',
    'ui_spareparts_read_more_aria',   'view spare part details',
    'ui_spareparts_price_label',      'Starting from',
    'ui_spareparts_view_all',         'All Spare Parts',
    'ui_spareparts_empty',
      'There are no spare parts to display at the moment.',

    'ui_spareparts_page_title',       'Spare Parts',
    'ui_spareparts_page_intro',
      'Spare parts and consumables for cooling towers and industrial cooling systems.',

    'ui_spareparts_detail_page_title','Spare Part',
    'ui_spareparts_back_to_list',     'Back to all spare parts',
    'ui_spareparts_loading',          'Loading spare part...',
    'ui_spareparts_not_found',        'Spare part not found.',
    'ui_spareparts_specs_title',      'Technical Specifications',
    'ui_spareparts_tags_title',       'Tags',

    'ui_spareparts_more_title',       'More Spare Parts'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_spareparts',
  'de',
  CAST(JSON_OBJECT(
    'ui_spareparts_kicker_prefix',    'Ensotek',
    'ui_spareparts_kicker_label',     'Ersatzteile',
    'ui_spareparts_title_prefix',     'Turm',
    'ui_spareparts_title_mark',       'Ersatzteile',
    'ui_spareparts_read_more',        'Details anzeigen',
    'ui_spareparts_read_more_aria',   'Ersatzteil-Details anzeigen',
    'ui_spareparts_price_label',      'Ab',
    'ui_spareparts_view_all',         'Alle Ersatzteile',
    'ui_spareparts_empty',
      'Derzeit sind keine Ersatzteile verfügbar.',

    'ui_spareparts_page_title',       'Ersatzteile',
    'ui_spareparts_page_intro',
      'Ersatzteile und Verbrauchsmaterialien für Kühltürme und industrielle Kühlsysteme.',

    'ui_spareparts_detail_page_title','Ersatzteil',
    'ui_spareparts_back_to_list',     'Zurück zu allen Ersatzteilen',
    'ui_spareparts_loading',          'Ersatzteil wird geladen...',
    'ui_spareparts_not_found',        'Ersatzteil nicht gefunden.',
    'ui_spareparts_specs_title',      'Technische Spezifikationen',
    'ui_spareparts_tags_title',       'Tags',

    'ui_spareparts_more_title',       'Weitere Ersatzteile'
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
  AND (s.`key`  COLLATE utf8mb4_unicode_ci) = ('ui_spareparts' COLLATE utf8mb4_unicode_ci)
  AND (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci) <> ('tr' COLLATE utf8mb4_unicode_ci)
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE (t.`key`  COLLATE utf8mb4_unicode_ci) = (s.`key` COLLATE utf8mb4_unicode_ci)
      AND (t.locale COLLATE utf8mb4_unicode_ci) = (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci)
  );
