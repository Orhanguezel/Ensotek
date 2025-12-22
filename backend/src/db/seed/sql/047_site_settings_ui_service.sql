-- =============================================================
-- 047_site_settings_ui_service.sql
-- ui_services: Service list + detail + "more services" translations
--  - Key: ui_services
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Extendable: clone from tr as bootstrap (collation-safe)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_services',
  'tr',
  CAST(JSON_OBJECT(
    'ui_services_page_title',           'Hizmetler',
    'ui_services_subprefix',            'Ensotek',
    'ui_services_sublabel',             'Hizmetler',
    'ui_services_title',                'Neler yapıyoruz',

    'ui_services_placeholder_title',    'Hizmetimiz',
    'ui_services_placeholder_summary',  'Hizmet açıklaması yakında eklenecektir.',
    'ui_services_details_aria',         'hizmet detaylarını görüntüle',

    'ui_services_more_subtitle',        'Diğer hizmetlerimizi keşfedin',
    'ui_services_more_title',           'İlginizi çekebilecek diğer hizmetler',

    'ui_services_detail_title',         'Hizmet',
    'ui_services_not_found_title',      'Hizmet bulunamadı',
    'ui_services_not_found_desc',       'Aradığınız hizmet bulunamadı veya artık yayında değil.',
    'ui_services_back_to_list',         'Hizmetlere geri dön',

    'ui_services_price_label',          'Fiyat',
    'ui_services_includes_label',       'Hizmet kapsamı',
    'ui_services_material_label',       'Kullanılan malzeme',
    'ui_services_warranty_label',       'Garanti',

    'ui_services_specs_title',          'Hizmet özellikleri',
    'ui_services_area_label',           'Alan',
    'ui_services_duration_label',       'Süre',
    'ui_services_maintenance_label',    'Bakım',
    'ui_services_season_label',         'Mevsim',
    'ui_services_soil_type_label',      'Toprak türü',
    'ui_services_thickness_label',      'Kalınlık',
    'ui_services_equipment_label',      'Ekipman',

    'ui_services_gallery_title',        'Hizmet galerisi',

    'ui_services_sidebar_info_title',   'Hizmet bilgileri',
    'ui_services_sidebar_type',         'Hizmet tipi',
    'ui_services_sidebar_category',     'Kategori',
    'ui_services_sidebar_status',       'Durum',

    'ui_common_active',                 'Aktif',
    'ui_common_passive',                'Pasif',

    'ui_services_sidebar_cta_title',    'Detaylı bilgi ister misiniz?',
    'ui_services_sidebar_cta_desc',     'Bu hizmet hakkında detaylı bilgi veya özel teklif almak için bizimle iletişime geçin.',
    'ui_services_sidebar_cta_button',   'İletişime geçin'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_services',
  'en',
  CAST(JSON_OBJECT(
    'ui_services_page_title',           'Services',
    'ui_services_subprefix',            'Ensotek',
    'ui_services_sublabel',             'Services',
    'ui_services_title',                'What we do',

    'ui_services_placeholder_title',    'Our service',
    'ui_services_placeholder_summary',  'Service description is coming soon.',
    'ui_services_details_aria',         'view service details',

    'ui_services_more_subtitle',        'Discover our other services',
    'ui_services_more_title',           'You may also be interested in',

    'ui_services_detail_title',         'Service',
    'ui_services_not_found_title',      'Service not found',
    'ui_services_not_found_desc',       'The service you are looking for could not be found or is no longer available.',
    'ui_services_back_to_list',         'Back to services',

    'ui_services_price_label',          'Price',
    'ui_services_includes_label',       'Service includes',
    'ui_services_material_label',       'Material',
    'ui_services_warranty_label',       'Warranty',

    'ui_services_specs_title',          'Service specifications',
    'ui_services_area_label',           'Area',
    'ui_services_duration_label',       'Duration',
    'ui_services_maintenance_label',    'Maintenance',
    'ui_services_season_label',         'Season',
    'ui_services_soil_type_label',      'Soil type',
    'ui_services_thickness_label',      'Thickness',
    'ui_services_equipment_label',      'Equipment',

    'ui_services_gallery_title',        'Service gallery',

    'ui_services_sidebar_info_title',   'Service info',
    'ui_services_sidebar_type',         'Service type',
    'ui_services_sidebar_category',     'Category',
    'ui_services_sidebar_status',       'Status',

    'ui_common_active',                 'Active',
    'ui_common_passive',                'Inactive',

    'ui_services_sidebar_cta_title',    'Need more information?',
    'ui_services_sidebar_cta_desc',     'Contact us to get a custom offer or detailed information about this service.',
    'ui_services_sidebar_cta_button',   'Contact us'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_services',
  'de',
  CAST(JSON_OBJECT(
    'ui_services_page_title',           'Leistungen',
    'ui_services_subprefix',            'Ensotek',
    'ui_services_sublabel',             'Leistungen',
    'ui_services_title',                'Was wir tun',

    'ui_services_placeholder_title',    'Unsere Leistung',
    'ui_services_placeholder_summary',  'Eine Beschreibung der Leistung folgt in Kürze.',
    'ui_services_details_aria',         'Leistungsdetails anzeigen',

    'ui_services_more_subtitle',        'Entdecken Sie unsere weiteren Leistungen',
    'ui_services_more_title',           'Weitere Leistungen, die Sie interessieren könnten',

    'ui_services_detail_title',         'Leistung',
    'ui_services_not_found_title',      'Leistung nicht gefunden',
    'ui_services_not_found_desc',       'Die gesuchte Leistung wurde nicht gefunden oder ist nicht mehr verfügbar.',
    'ui_services_back_to_list',         'Zurück zu den Leistungen',

    'ui_services_price_label',          'Preis',
    'ui_services_includes_label',       'Leistungsumfang',
    'ui_services_material_label',       'Material',
    'ui_services_warranty_label',       'Garantie',

    'ui_services_specs_title',          'Leistungsmerkmale',
    'ui_services_area_label',           'Bereich',
    'ui_services_duration_label',       'Dauer',
    'ui_services_maintenance_label',    'Wartung',
    'ui_services_season_label',         'Saison',
    'ui_services_soil_type_label',      'Bodentyp',
    'ui_services_thickness_label',      'Dicke',
    'ui_services_equipment_label',      'Ausrüstung',

    'ui_services_gallery_title',        'Leistungsgalerie',

    'ui_services_sidebar_info_title',   'Leistungsinfo',
    'ui_services_sidebar_type',         'Leistungstyp',
    'ui_services_sidebar_category',     'Kategorie',
    'ui_services_sidebar_status',       'Status',

    'ui_common_active',                 'Aktiv',
    'ui_common_passive',                'Inaktiv',

    'ui_services_sidebar_cta_title',    'Benötigen Sie weitere Informationen?',
    'ui_services_sidebar_cta_desc',     'Kontaktieren Sie uns, um ein individuelles Angebot oder weitere Details zu dieser Leistung zu erhalten.',
    'ui_services_sidebar_cta_button',   'Kontakt aufnehmen'
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
  AND (s.`key`  COLLATE utf8mb4_unicode_ci) = ('ui_services' COLLATE utf8mb4_unicode_ci)
  AND (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci) <> ('tr' COLLATE utf8mb4_unicode_ci)
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE (t.`key`  COLLATE utf8mb4_unicode_ci) = (s.`key` COLLATE utf8mb4_unicode_ci)
      AND (t.locale COLLATE utf8mb4_unicode_ci) = (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci)
  );
