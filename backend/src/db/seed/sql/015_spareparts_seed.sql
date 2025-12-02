-- =============================================================
-- 015_spareparts_seed.sql
-- Sparepart ürünleri – Ensotek (tr + en)
--   category_id = aaaa1001-1111-4111-8111-aaaaaaaa1001 (sparepart)
--   sub_categories: bbbb1001 / bbbb1002 / bbbb1003
-- =============================================================

START TRANSACTION;

INSERT INTO products (
  id,
  locale,
  title,
  slug,
  price,
  description,
  category_id,
  sub_category_id,
  image_url,
  storage_asset_id,
  alt,
  images,
  storage_image_ids,
  is_active,
  is_featured,
  tags,
  specifications,
  product_code,
  stock_quantity,
  rating,
  review_count,
  meta_title,
  meta_description
)
VALUES
  -- YEDEK PARÇA 1 TR: Kule Fan Motoru
  (
    'bbbb1001-2222-4222-8222-bbbbbbbb1001',
    'tr',
    'Kule Fan Motoru',
    'kule-fan-motoru',
    9500.00,
    'Endüstriyel su soğutma kuleleri için yüksek verimli fan motoru. Farklı güç ve devir seçenekleri mevcuttur.',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001', -- SPAREPART ROOT
    'bbbb1002-1111-4111-8111-bbbbbbbb1002', -- Mekanik Parçalar
    'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    'Kule fan motoru',
    JSON_ARRAY(
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80'
    ),
    JSON_ARRAY(),
    1,
    1,
    JSON_ARRAY('sparepart', 'fan motoru', 'mekanik', 'kule'),
    JSON_OBJECT(
      'dimensions', 'Standard IEC gövde',
      'weight', '35 kg',
      'thickness', 'N/A',
      'surfaceFinish', 'Endüstriyel boya kaplı gövde',
      'warranty', '2 yıl motor garantisi',
      'installationTime', '1 iş günü (saha koşuluna bağlı)'
    ),
    'SP-FAN-001',
    10,
    4.80,
    3,
    'Kule Fan Motoru | Ensotek Yedek Parçalar',
    'Su soğutma kuleleri için yüksek verimli fan motoru. Farklı güç seçenekleri ve endüstriyel kullanım için uygundur.'
  ),

  -- YEDEK PARÇA 1 EN: Cooling Tower Fan Motor
  (
    'bbbb1101-2222-4222-8222-bbbbbbbb1101',
    'en',
    'Cooling Tower Fan Motor',
    'cooling-tower-fan-motor',
    9500.00,
    'High-efficiency fan motor for industrial cooling towers. Available in different power and speed options.',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1002-1111-4111-8111-bbbbbbbb1002',
    'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    'Cooling tower fan motor',
    JSON_ARRAY(
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80'
    ),
    JSON_ARRAY(),
    1,
    1,
    JSON_ARRAY('sparepart', 'fan motor', 'mechanical', 'tower'),
    JSON_OBJECT(
      'dimensions', 'Standard IEC frame',
      'weight', '35 kg',
      'thickness', 'N/A',
      'surfaceFinish', 'Industrial painted housing',
      'warranty', '2-year motor warranty',
      'installationTime', '1 business day (depending on site conditions)'
    ),
    'SP-FAN-001',
    10,
    4.80,
    3,
    'Cooling Tower Fan Motor | Ensotek Spare Parts',
    'High-efficiency fan motor for cooling towers. Suitable for industrial use with different power options.'
  ),

  -- YEDEK PARÇA 2 TR: Nozul Seti
  (
    'bbbb1002-2222-4222-8222-bbbbbbbb1002',
    'tr',
    'Kule Püskürtme Nozul Seti',
    'kule-puskurtme-nozul-seti',
    3200.00,
    'Su soğutma kulelerinde homojen su dağılımı için tasarlanmış nozul seti. Farklı debi aralıkları için seçenekler mevcuttur.',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001', -- SPAREPART ROOT
    'bbbb1003-1111-4111-8111-bbbbbbbb1003', -- Montaj Aksesuarları
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    'Kule püskürtme nozul seti',
    JSON_ARRAY(
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&h=600&q=80'
    ),
    JSON_ARRAY(),
    1,
    0,
    JSON_ARRAY('sparepart', 'nozul', 'su dagitim', 'kule'),
    JSON_OBJECT(
      'dimensions', 'Farklı bağlantı çapları mevcuttur',
      'weight', 'Set başına ~4 kg',
      'thickness', 'N/A',
      'surfaceFinish', 'Korozyona dayanıklı plastik/metal',
      'warranty', '1 yıl üretim hatalarına karşı garanti',
      'installationTime', '2-3 saat (kule erişimine bağlı)'
    ),
    'SP-NOZ-001',
    25,
    4.90,
    4,
    'Kule Püskürtme Nozul Seti | Ensotek Yedek Parçalar',
    'Su soğutma kulelerinde homojen su dağılımı sağlayan püskürtme nozul seti. Farklı debi ve çap seçenekleri bulunmaktadır.'
  ),

  -- YEDEK PARÇA 2 EN: Cooling Tower Spray Nozzle Set
  (
    'bbbb1102-2222-4222-8222-bbbbbbbb1102',
    'en',
    'Cooling Tower Spray Nozzle Set',
    'cooling-tower-spray-nozzle-set',
    3200.00,
    'Spray nozzle set designed for homogeneous water distribution in cooling towers. Available for different flow ranges.',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1003-1111-4111-8111-bbbbbbbb1003',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    'Cooling tower spray nozzle set',
    JSON_ARRAY(
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&h=600&q=80'
    ),
    JSON_ARRAY(),
    1,
    0,
    JSON_ARRAY('sparepart', 'nozzle', 'water distribution', 'tower'),
    JSON_OBJECT(
      'dimensions', 'Various connection diameters available',
      'weight', 'Approx. 4 kg per set',
      'thickness', 'N/A',
      'surfaceFinish', 'Corrosion-resistant plastic/metal',
      'warranty', '1-year warranty against manufacturing defects',
      'installationTime', '2–3 hours (depending on tower accessibility)'
    ),
    'SP-NOZ-001',
    25,
    4.90,
    4,
    'Cooling Tower Spray Nozzle Set | Ensotek Spare Parts',
    'Spray nozzle set that provides homogeneous water distribution in cooling towers. Available in different flow and diameter options.'
  )

ON DUPLICATE KEY UPDATE
  locale           = VALUES(locale),
  title            = VALUES(title),
  price            = VALUES(price),
  description      = VALUES(description),
  category_id      = VALUES(category_id),
  sub_category_id  = VALUES(sub_category_id),
  image_url        = VALUES(image_url),
  storage_asset_id = VALUES(storage_asset_id),
  alt              = VALUES(alt),
  images           = VALUES(images),
  storage_image_ids= VALUES(storage_image_ids),
  is_active        = VALUES(is_active),
  is_featured      = VALUES(is_featured),
  tags             = VALUES(tags),
  specifications   = VALUES(specifications),
  product_code     = VALUES(product_code),
  stock_quantity   = VALUES(stock_quantity),
  rating           = VALUES(rating),
  review_count     = VALUES(review_count),
  meta_title       = VALUES(meta_title),
  meta_description = VALUES(meta_description);

COMMIT;
