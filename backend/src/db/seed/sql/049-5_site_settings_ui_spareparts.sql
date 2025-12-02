-- =============================================================
-- 049-5_site_settings_ui_spareparts.sql
-- Ensotek – UI Spareparts (site_settings.ui_spareparts)
--   - Home section, list page, detail page, more spareparts
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- -------------------------------------------------------------
-- TR
-- -------------------------------------------------------------
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
VALUES
(
  UUID(),
  'ui_spareparts',
  'tr',
  JSON_OBJECT(
    -- HOME SECTION (src/components/containers/sparepart/Sparepart.tsx)
    'ui_spareparts_kicker_prefix',   'Ensotek',
    'ui_spareparts_kicker_label',    'Yedek Parçalar',
    'ui_spareparts_title_prefix',    'Kule',
    'ui_spareparts_title_mark',      'Yedek Parçaları',
    'ui_spareparts_read_more',       'Detayları görüntüle',
    'ui_spareparts_read_more_aria',  'yedek parça detayını görüntüle',
    'ui_spareparts_price_label',     'Başlangıç fiyatı',
    'ui_spareparts_view_all',        'Tüm Yedek Parçalar',
    'ui_spareparts_empty',
      'Şu anda görüntülenecek yedek parça bulunmamaktadır.',

    -- LIST PAGE (src/components/containers/sparepart/SparepartPageContent.tsx)
    'ui_spareparts_page_title',      'Yedek Parçalar',
    'ui_spareparts_page_intro',
      'Su soğutma kuleleri ve proses soğutma sistemleri için yedek parça ve sarf malzemeleri.',

    -- DETAIL PAGE (src/components/containers/sparepart/SparepartDetail.tsx)
    'ui_spareparts_detail_page_title','Yedek Parça Detayı',
    'ui_spareparts_back_to_list',    'Tüm yedek parçalara dön',
    'ui_spareparts_loading',         'Yedek parça yükleniyor...',
    'ui_spareparts_not_found',       'Yedek parça bulunamadı.',
    'ui_spareparts_specs_title',     'Teknik Özellikler',
    'ui_spareparts_tags_title',      'Etiketler',

    -- MORE SPAREPARTS (src/components/containers/sparepart/SparepartMore.tsx)
    'ui_spareparts_more_title',      'Diğer Yedek Parçalar'
  ),
  NOW(3),
  NOW(3)
),
-- -------------------------------------------------------------
-- EN
-- -------------------------------------------------------------
(
  UUID(),
  'ui_spareparts',
  'en',
  JSON_OBJECT(
    -- HOME SECTION
    'ui_spareparts_kicker_prefix',   'Ensotek',
    'ui_spareparts_kicker_label',    'Spare Parts',
    'ui_spareparts_title_prefix',    'Tower',
    'ui_spareparts_title_mark',      'Spare Parts',
    'ui_spareparts_read_more',       'View details',
    'ui_spareparts_read_more_aria',  'view spare part details',
    'ui_spareparts_price_label',     'Starting from',
    'ui_spareparts_view_all',        'All Spare Parts',
    'ui_spareparts_empty',
      'There are no spare parts to display at the moment.',

    -- LIST PAGE
    'ui_spareparts_page_title',      'Spare Parts',
    'ui_spareparts_page_intro',
      'Spare parts and consumables for cooling towers and industrial cooling systems.',

    -- DETAIL PAGE
    'ui_spareparts_detail_page_title','Spare Part',
    'ui_spareparts_back_to_list',    'Back to all spare parts',
    'ui_spareparts_loading',         'Loading spare part...',
    'ui_spareparts_not_found',       'Spare part not found.',
    'ui_spareparts_specs_title',     'Technical Specifications',
    'ui_spareparts_tags_title',      'Tags',

    -- MORE SPAREPARTS
    'ui_spareparts_more_title',      'More Spare Parts'
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
  AND s.`key` = 'ui_spareparts'
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE t.`key` = s.`key`
      AND t.locale = 'de'
  );
