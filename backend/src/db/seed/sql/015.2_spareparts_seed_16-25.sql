-- =============================================================
-- FILE: 015.2_spareparts_seed_16-25__part1_products.sql  (FULL)
-- Ensotek – Spareparts Seed (16..25)  BASE PRODUCTS
-- - products
-- - Re-runnable (ON DUPLICATE KEY UPDATE)
-- FIX:
--  - item_type = 'sparepart'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

INSERT INTO products (
  id,
  item_type,
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
  -- SPAREPART 16: Fan Kayışı (V-Belt)
  (
    'bbbb1016-2222-4222-8222-bbbbbbbb1016',
    'sparepart',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1004-1111-4111-8111-bbbbbbbb1004',
    1250.00,
    'https://images.unsplash.com/photo-1581092160877-ef53b6e7a6c1?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581092160877-ef53b6e7a6c1?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    16,
    'SP-BELT-001',
    120,
    4.55,
    10
  ),

  -- SPAREPART 17: Rulman Seti (Fan Yatağı)
  (
    'bbbb1017-2222-4222-8222-bbbbbbbb1017',
    'sparepart',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1004-1111-4111-8111-bbbbbbbb1004',
    2950.00,
    'https://images.unsplash.com/photo-1581092335397-9fa341108c0c?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581092335397-9fa341108c0c?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    17,
    'SP-BEAR-001',
    60,
    4.60,
    8
  ),

  -- SPAREPART 18: Fan Bacası / Fan Stack (FRP)
  (
    'bbbb1018-2222-4222-8222-bbbbbbbb1018',
    'sparepart',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1001-1111-4111-8111-bbbbbbbb1001',
    22500.00,
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    1,
    18,
    'SP-STACK-001',
    8,
    4.70,
    6
  ),

  -- SPAREPART 19: Redüktör Yağ Kiti (Gearbox Oil Kit)
  (
    'bbbb1019-2222-4222-8222-bbbbbbbb1019',
    'sparepart',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1002-1111-4111-8111-bbbbbbbb1002',
    1850.00,
    'https://images.unsplash.com/photo-1581091215367-59ab6b1d9b01?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581091215367-59ab6b1d9b01?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    19,
    'SP-OIL-001',
    90,
    4.65,
    9
  ),

  -- SPAREPART 20: Şamandıra / Seviye Valfi (Float Valve)
  (
    'bbbb1020-2222-4222-8222-bbbbbbbb1020',
    'sparepart',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1002-1111-4111-8111-bbbbbbbb1002',
    2350.00,
    'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    20,
    'SP-FLOAT-001',
    45,
    4.50,
    7
  ),

  -- SPAREPART 21: Damla Tutucu Klips/Askı Seti (Mounting Kit)
  (
    'bbbb1021-2222-4222-8222-bbbbbbbb1021',
    'sparepart',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1002-1111-4111-8111-bbbbbbbb1002',
    980.00,
    'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    21,
    'SP-CLIP-001',
    200,
    4.55,
    5
  ),

  -- SPAREPART 22: Paslanmaz Bağlantı Elemanları Kiti (AISI 304 Fastener Kit)
  (
    'bbbb1022-2222-4222-8222-bbbbbbbb1022',
    'sparepart',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1002-1111-4111-8111-bbbbbbbb1002',
    1650.00,
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    22,
    'SP-BOLT-001',
    150,
    4.60,
    6
  ),

  -- SPAREPART 23: Su Dağıtım Kollektörü (Header / Manifold)
  (
    'bbbb1023-2222-4222-8222-bbbbbbbb1023',
    'sparepart',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1001-1111-4111-8111-bbbbbbbb1001',
    8900.00,
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    1,
    23,
    'SP-MAN-001',
    14,
    4.65,
    4
  ),

  -- SPAREPART 24: Nozul Yedek Memesi (Orifice / Insert)
  (
    'bbbb1024-2222-4222-8222-bbbbbbbb1024',
    'sparepart',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1002-1111-4111-8111-bbbbbbbb1002',
    420.00,
    'https://images.unsplash.com/photo-1581092918367-3e41f5b7f1b4?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581092918367-3e41f5b7f1b4?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    24,
    'SP-ORIF-001',
    500,
    4.50,
    9
  ),

  -- SPAREPART 25: Titreşim Sensörü (Vibration Sensor / Transmitter)
  (
    'bbbb1025-2222-4222-8222-bbbbbbbb1025',
    'sparepart',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1004-1111-4111-8111-bbbbbbbb1004',
    7600.00,
    'https://images.unsplash.com/photo-1581091870622-2c6ef11b4d2b?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581091870622-2c6ef11b4d2b?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    1,
    25,
    'SP-SENS-001',
    28,
    4.70,
    6
  )

ON DUPLICATE KEY UPDATE
  item_type         = VALUES(item_type),
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

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
