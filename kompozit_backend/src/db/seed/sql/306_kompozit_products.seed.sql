-- =============================================================
-- FILE: 306_kompozit_products.seed.sql
-- MOE Kompozit — Ornek urun verileri (TR/EN)
-- item_type = 'kompozit'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

INSERT INTO `products`
(
  `id`,
  `item_type`,
  `category_id`,
  `sub_category_id`,
  `price`,
  `image_url`,
  `storage_asset_id`,
  `images`,
  `storage_image_ids`,
  `is_active`,
  `is_featured`,
  `order_num`,
  `product_code`,
  `stock_quantity`,
  `rating`,
  `review_count`
)
VALUES
  (
    'kd010001-7001-4001-9001-dddddddd0001',
    'kompozit',
    'cccc0001-4001-4001-8001-cccccccc0001',
    NULL,
    0.00,
    '/media/gallery-placeholder.svg',
    NULL,
    JSON_ARRAY('/media/gallery-placeholder.svg'),
    JSON_ARRAY(),
    1,
    1,
    10,
    'MOE-CF-PLATE',
    0,
    5.00,
    0
  ),
  (
    'kd010002-7002-4002-9002-dddddddd0002',
    'kompozit',
    'cccc0002-4002-4002-8002-cccccccc0002',
    NULL,
    0.00,
    '/media/gallery-placeholder.svg',
    NULL,
    JSON_ARRAY('/media/gallery-placeholder.svg'),
    JSON_ARRAY(),
    1,
    1,
    20,
    'MOE-CTP-PANEL',
    0,
    5.00,
    0
  ),
  (
    'kd010003-7003-4003-9003-dddddddd0003',
    'kompozit',
    'cccc0003-4003-4003-8003-cccccccc0003',
    NULL,
    0.00,
    '/media/gallery-placeholder.svg',
    NULL,
    JSON_ARRAY('/media/gallery-placeholder.svg'),
    JSON_ARRAY(),
    1,
    0,
    30,
    'MOE-FG-COVER',
    0,
    5.00,
    0
  )
ON DUPLICATE KEY UPDATE
  `item_type` = VALUES(`item_type`),
  `category_id` = VALUES(`category_id`),
  `sub_category_id` = VALUES(`sub_category_id`),
  `price` = VALUES(`price`),
  `image_url` = VALUES(`image_url`),
  `images` = VALUES(`images`),
  `storage_image_ids` = VALUES(`storage_image_ids`),
  `is_active` = VALUES(`is_active`),
  `is_featured` = VALUES(`is_featured`),
  `order_num` = VALUES(`order_num`),
  `product_code` = VALUES(`product_code`),
  `stock_quantity` = VALUES(`stock_quantity`),
  `rating` = VALUES(`rating`),
  `review_count` = VALUES(`review_count`);

INSERT INTO `product_i18n`
(
  `product_id`,
  `locale`,
  `title`,
  `slug`,
  `description`,
  `alt`,
  `tags`,
  `specifications`,
  `meta_title`,
  `meta_description`
)
VALUES
  (
    'kd010001-7001-4001-9001-dddddddd0001',
    'tr',
    'Karbon Fiber Panel Prototipi',
    'karbon-fiber-panel-prototipi',
    'Karbon fiber takviyeli panel prototipi; hafiflik, rijitlik ve seri uretim oncesi dogrulama ihtiyaclari icin ornek bir kompozit urun kaydidir.',
    'Karbon fiber panel prototipi',
    JSON_ARRAY('karbon fiber', 'panel', 'kompozit prototip', 'hafif yapi'),
    JSON_OBJECT('malzeme', 'Karbon fiber takviyeli kompozit', 'proses', 'Prototype tooling', 'uygulama', 'Endustriyel panel ve kapak gruplari'),
    'Karbon Fiber Panel Prototipi | MOE Kompozit',
    'Karbon fiber panel prototipi, hafif ve rijit kompozit parca gelistirme surecleri icin ornek MOE Kompozit urun kaydi.'
  ),
  (
    'kd010001-7001-4001-9001-dddddddd0001',
    'en',
    'Carbon Fiber Panel Prototype',
    'carbon-fiber-panel-prototype',
    'A sample carbon fiber reinforced panel prototype entry for lightweight structural parts, design validation, and pre-series production planning.',
    'Carbon fiber panel prototype',
    JSON_ARRAY('carbon fiber', 'panel prototype', 'composite part', 'lightweight structure'),
    JSON_OBJECT('material', 'Carbon fiber reinforced composite', 'process', 'Prototype tooling', 'application', 'Industrial panels and enclosure parts'),
    'Carbon Fiber Panel Prototype | MOE Kompozit',
    'Sample carbon fiber panel prototype entry by MOE Kompozit for lightweight structural composite development.'
  ),
  (
    'kd010002-7002-4002-9002-dddddddd0002',
    'tr',
    'CTP Koruyucu Govde Paneli',
    'ctp-koruyucu-govde-paneli',
    'Cam takviyeli polyester tabanli koruyucu govde paneli; saha dayanimı, kimyasal direnç ve proses tekrarlanabilirligi odakli ornek urun kaydidir.',
    'CTP koruyucu govde paneli',
    JSON_ARRAY('ctp', 'koruyucu panel', 'cam takviyeli polyester', 'endustriyel govde'),
    JSON_OBJECT('malzeme', 'Cam takviyeli polyester', 'proses', 'Closed mold laminate', 'uygulama', 'Makine govdeleri ve koruyucu muhafazalar'),
    'CTP Koruyucu Govde Paneli | MOE Kompozit',
    'CTP koruyucu govde paneli icin ornek kompozit urun kaydi. Endustriyel panel ve muhafaza uygulamalarina uygun yapi.'
  ),
  (
    'kd010002-7002-4002-9002-dddddddd0002',
    'en',
    'FRP Protective Enclosure Panel',
    'frp-protective-enclosure-panel',
    'Sample FRP enclosure panel entry focused on durability, chemical resistance, and repeatable production for industrial covers and bodies.',
    'FRP protective enclosure panel',
    JSON_ARRAY('frp', 'enclosure panel', 'industrial body', 'protective cover'),
    JSON_OBJECT('material', 'Glass fiber reinforced polyester', 'process', 'Closed mold laminate', 'application', 'Machine bodies and protective enclosures'),
    'FRP Protective Enclosure Panel | MOE Kompozit',
    'Sample FRP enclosure panel by MOE Kompozit for industrial covers and protective body components.'
  ),
  (
    'kd010003-7003-4003-9003-dddddddd0003',
    'tr',
    'Cam Elyaf Servis Kapagi',
    'cam-elyaf-servis-kapagi',
    'Cam elyaf esasli servis kapagi; dis ortam dayanimı ve kolay montaj gerektiren saha ekipmanlari icin ornek bir galeri ve urun destek kaydidir.',
    'Cam elyaf servis kapagi',
    JSON_ARRAY('cam elyaf', 'servis kapagi', 'fiberglass', 'dis ortam ekipmani'),
    JSON_OBJECT('malzeme', 'Cam elyaf kompozit', 'proses', 'Hand lay-up / trim', 'uygulama', 'Dis ortam servis kapaklari ve saha kutulari'),
    'Cam Elyaf Servis Kapagi | MOE Kompozit',
    'Cam elyaf servis kapagi icin ornek kompozit urun kaydi. Dis ortam ve saha ekipmanlari icin hafif cozum.'
  ),
  (
    'kd010003-7003-4003-9003-dddddddd0003',
    'en',
    'Fiberglass Service Cover',
    'fiberglass-service-cover',
    'Sample fiberglass service cover entry for outdoor equipment requiring light weight, corrosion resistance, and easy installation.',
    'Fiberglass service cover',
    JSON_ARRAY('fiberglass', 'service cover', 'outdoor equipment', 'composite cover'),
    JSON_OBJECT('material', 'Fiberglass composite', 'process', 'Hand lay-up / trim', 'application', 'Outdoor service covers and field boxes'),
    'Fiberglass Service Cover | MOE Kompozit',
    'Sample fiberglass service cover by MOE Kompozit for outdoor equipment and corrosion-resistant field applications.'
  )
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `description` = VALUES(`description`),
  `alt` = VALUES(`alt`),
  `tags` = VALUES(`tags`),
  `specifications` = VALUES(`specifications`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
