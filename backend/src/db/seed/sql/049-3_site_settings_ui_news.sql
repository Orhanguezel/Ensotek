-- =============================================================
-- 049-4_site_settings_ui_product.sql
-- Ensotek – UI Products (site_settings.ui_products)
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Extendable: clone from tr as bootstrap (collation-safe)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_products',
  'tr',
  CAST(JSON_OBJECT(
    -- HOME SECTION
    'ui_products_kicker_prefix',        'Ensotek',
    'ui_products_kicker_label',         'Ürünlerimiz',
    'ui_products_title_prefix',         'Su Soğutma',
    'ui_products_title_mark',           'Kuleleri',
    'ui_products_read_more',            'Detayları görüntüle',
    'ui_products_read_more_aria',       'ürün detayını görüntüle',
    'ui_products_price_label',          'Başlangıç fiyatı',
    'ui_products_view_all',             'Tüm Ürünler',
    'ui_products_empty',
      'Şu anda görüntülenecek ürün bulunmamaktadır.',

    -- LIST PAGE
    'ui_products_page_title',           'Ürünlerimiz',
    'ui_products_page_intro',
      'Endüstriyel su soğutma kuleleri ve tamamlayıcı ekipmanlara ait seçili ürünler.',

    -- DETAIL PAGE
    'ui_products_detail_page_title',    'Ürün Detayı',
    'ui_products_back_to_list',         'Tüm ürünlere dön',
    'ui_products_loading',              'Ürün yükleniyor...',
    'ui_products_not_found',            'Ürün bulunamadı.',
    'ui_products_specs_title',          'Teknik Özellikler',
    'ui_products_tags_title',           'Etiketler',

    -- MORE PRODUCTS
    'ui_products_more_title',           'Diğer Ürünler'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_products',
  'en',
  CAST(JSON_OBJECT(
    -- HOME SECTION
    'ui_products_kicker_prefix',        'Ensotek',
    'ui_products_kicker_label',         'Our Products',
    'ui_products_title_prefix',         'Cooling',
    'ui_products_title_mark',           'Towers',
    'ui_products_read_more',            'View details',
    'ui_products_read_more_aria',       'view product details',
    'ui_products_price_label',          'Starting from',
    'ui_products_view_all',             'All products',
    'ui_products_empty',
      'There are no products to display at the moment.',

    -- LIST PAGE
    'ui_products_page_title',           'Products',
    'ui_products_page_intro',
      'Selected products for industrial cooling towers and related equipment.',

    -- DETAIL PAGE
    'ui_products_detail_page_title',    'Product Detail',
    'ui_products_back_to_list',         'Back to all products',
    'ui_products_loading',              'Loading product...',
    'ui_products_not_found',            'Product not found.',
    'ui_products_specs_title',          'Technical Specifications',
    'ui_products_tags_title',           'Tags',

    -- MORE PRODUCTS
    'ui_products_more_title',           'More Products'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_products',
  'de',
  CAST(JSON_OBJECT(
    -- HOME SECTION
    'ui_products_kicker_prefix',        'Ensotek',
    'ui_products_kicker_label',         'Unsere Produkte',
    'ui_products_title_prefix',         'Kühl',
    'ui_products_title_mark',           'Türme',
    'ui_products_read_more',            'Details anzeigen',
    'ui_products_read_more_aria',       'Produktdetails anzeigen',
    'ui_products_price_label',          'Ab',
    'ui_products_view_all',             'Alle Produkte',
    'ui_products_empty',
      'Derzeit sind keine Produkte verfügbar.',

    -- LIST PAGE
    'ui_products_page_title',           'Produkte',
    'ui_products_page_intro',
      'Ausgewählte Produkte für industrielle Kühltürme und zugehörige Ausrüstung.',

    -- DETAIL PAGE
    'ui_products_detail_page_title',    'Produktdetails',
    'ui_products_back_to_list',         'Zurück zu allen Produkten',
    'ui_products_loading',              'Produkt wird geladen...',
    'ui_products_not_found',            'Produkt nicht gefunden.',
    'ui_products_specs_title',          'Technische Spezifikationen',
    'ui_products_tags_title',           'Tags',

    -- MORE PRODUCTS
    'ui_products_more_title',           'Weitere Produkte'
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
  AND (s.`key`  COLLATE utf8mb4_unicode_ci) = ('ui_products' COLLATE utf8mb4_unicode_ci)
  AND (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci) <> ('tr' COLLATE utf8mb4_unicode_ci)
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE (t.`key`  COLLATE utf8mb4_unicode_ci) = (s.`key` COLLATE utf8mb4_unicode_ci)
      AND (t.locale COLLATE utf8mb4_unicode_ci) = (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci)
  );
