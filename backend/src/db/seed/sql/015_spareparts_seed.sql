-- =============================================================
-- 015_spareparts_seed.sql
-- Ensotek Yedek Parça Ürünleri – Cooling Tower Spareparts (TR + EN)
--   - Base ürünler tek ID
--   - TR + EN product_i18n
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =========================
-- 1) BASE PRODUCTS (SPAREPARTS)
-- =========================

INSERT INTO products (
  id,
  category_id,
  sub_category_id,
  price,
  image_url,
  storage_asset_id,
  images,
  storage_image_ids,
  is_active,
  is_featured,
  order_num,
  product_code,
  stock_quantity,
  rating,
  review_count
)
VALUES
  -- SPAREPART 1: Fan Motoru
  (
    'bbbb1001-2222-4222-8222-bbbbbbbb1001',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001', -- SOĞUTMA KULESİ YEDEK PARÇALARI
    'bbbb1004-1111-4111-8111-bbbbbbbb1004', -- Fan ve Motor Grubu
    9500.00,
    'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY(
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80'
    ),
    JSON_ARRAY(),
    1,
    1,
    1,                        -- order_num
    'SP-FAN-001-TR',
    10,
    4.80,
    3
  ),

  -- SPAREPART 2: PVC Dolgu Bloğu
  (
    'bbbb1002-2222-4222-8222-bbbbbbbb1002',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1003-1111-4111-8111-bbbbbbbb1003', -- Dolgu Malzemeleri
    4200.00,
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY(
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&h=600&q=80'
    ),
    JSON_ARRAY(),
    1,
    0,
    2,                        -- order_num
    'SP-FILL-001-TR',
    50,
    4.90,
    5
  )
ON DUPLICATE KEY UPDATE
  category_id       = VALUES(category_id),
  sub_category_id   = VALUES(sub_category_id),
  price             = VALUES(price),
  image_url         = VALUES(image_url),
  storage_asset_id  = VALUES(storage_asset_id),
  images            = VALUES(images),
  storage_image_ids = VALUES(storage_image_ids),
  is_active         = VALUES(is_active),
  is_featured       = VALUES(is_featured),
  order_num         = VALUES(order_num),
  product_code      = VALUES(product_code),
  stock_quantity    = VALUES(stock_quantity),
  rating            = VALUES(rating),
  review_count      = VALUES(review_count);

-- =========================
-- 2) PRODUCT I18N (SPAREPARTS TR + EN)
-- =========================

INSERT INTO product_i18n (
  product_id,
  locale,
  title,
  slug,
  description,
  alt,
  tags,
  specifications,
  meta_title,
  meta_description
)
VALUES
  -- --------- SPAREPART 1: Fan Motoru (TR) ---------
  (
    'bbbb1001-2222-4222-8222-bbbbbbbb1001',
    'tr',
    'Kule Fan Motoru',
    'kule-fan-motoru',
    'Soğutma kuleleri için yüksek verimli, IP55 koruma sınıfına sahip fan motoru. Farklı güç ve devir seçenekleri mevcuttur.',
    'Soğutma kulesi fan motoru',
    JSON_ARRAY('sparepart', 'fan motoru', 'kule', 'ip55', 'ensotek'),
    JSON_OBJECT(
      'powerRange', '7,5 kW – 30 kW',
      'protectionClass', 'IP55',
      'voltage', '400V / 3 Faz / 50 Hz',
      'mounting', 'Flanş montaj',
      'warranty', '2 yıl motor garantisi'
    ),
    'Kule Fan Motoru | Ensotek Yedek Parçalar',
    'Soğutma kuleleri için yüksek verimli, IP55 koruma sınıfına sahip fan motoru. Endüstriyel kullanıma uygundur.'
  ),

  -- --------- SPAREPART 1: Fan Motoru (EN) ---------
  (
    'bbbb1001-2222-4222-8222-bbbbbbbb1001',
    'en',
    'Cooling Tower Fan Motor',
    'cooling-tower-fan-motor',
    'High-efficiency fan motor with IP55 protection class for cooling towers. Available in different power and speed ratings.',
    'Cooling tower fan motor',
    JSON_ARRAY('sparepart', 'fan motor', 'tower', 'ip55', 'ensotek'),
    JSON_OBJECT(
      'powerRange', '7.5 kW – 30 kW',
      'protectionClass', 'IP55',
      'voltage', '400V / 3 Phase / 50 Hz',
      'mounting', 'Flange mounted',
      'warranty', '2-year motor warranty'
    ),
    'Cooling Tower Fan Motor | Ensotek Spare Parts',
    'High-efficiency fan motor with IP55 protection class for cooling towers. Suitable for industrial applications.'
  ),

  -- --------- SPAREPART 2: PVC Dolgu Bloğu (TR) ---------
  (
    'bbbb1002-2222-4222-8222-bbbbbbbb1002',
    'tr',
    'PVC Dolgu Bloğu',
    'pvc-dolgu-blogu',
    'Soğutma kulelerinde ısı transfer yüzeyini artırmak için kullanılan, yüksek ısı ve kimyasal dayanımlı PVC dolgu bloğu. Film tip tasarım.',
    'Soğutma kulesi PVC dolgu bloğu',
    JSON_ARRAY('sparepart', 'dolgu', 'pvc', 'film tip'),
    JSON_OBJECT(
      'material', 'PVC',
      'maxTemp', '60 °C',
      'type', 'Film tip dolgu',
      'dimensions', '600 x 300 x 150 mm (örnek)',
      'warranty', '1 yıl üretim hatalarına karşı garanti'
    ),
    'PVC Dolgu Bloğu | Ensotek Yedek Parçalar',
    'Soğutma kulelerinde ısı transfer yüzeyini artıran, film tip PVC dolgu bloğu. Yüksek ısı ve kimyasal dayanımı sunar.'
  ),

  -- --------- SPAREPART 2: PVC Fill Media Block (EN) ---------
  (
    'bbbb1002-2222-4222-8222-bbbbbbbb1002',
    'en',
    'PVC Fill Media Block',
    'pvc-fill-media-block',
    'PVC fill media block used in cooling towers to increase heat transfer surface. High temperature and chemical resistance with film-type design.',
    'Cooling tower PVC fill media block',
    JSON_ARRAY('sparepart', 'fill media', 'pvc', 'film type'),
    JSON_OBJECT(
      'material', 'PVC',
      'maxTemp', '60 °C',
      'type', 'Film-type fill media',
      'dimensions', '600 x 300 x 150 mm (sample)',
      'warranty', '1-year warranty against manufacturing defects'
    ),
    'PVC Fill Media Block | Ensotek Spare Parts',
    'Film-type PVC fill media block that increases heat transfer surface in cooling towers. Provides high temperature and chemical resistance.'
  )
ON DUPLICATE KEY UPDATE
  title            = VALUES(title),
  slug             = VALUES(slug),
  description      = VALUES(description),
  alt              = VALUES(alt),
  tags             = VALUES(tags),
  specifications   = VALUES(specifications),
  meta_title       = VALUES(meta_title),
  meta_description = VALUES(meta_description);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
