-- =============================================================
-- FILE: 051.1_custom_pages_mission.seed.sql (FINAL)
-- Ensotek Kurumsal Sayfaları – Misyon
-- ✅ module_key artık PARENT: custom_pages.module_key = 'mission'
-- categories + sub_categories ile ilişkili
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------
-- SABİT SAYFA ID (custom_pages.id)
-- -------------------------------------------------------------
SET @PAGE_MISSION := '11111111-2222-3333-4444-555555555571';

-- -------------------------------------------------------------
-- PARENT MODULE KEY
-- -------------------------------------------------------------
SET @MODULE_KEY := 'mission';

-- -------------------------------------------------------------
-- KATEGORİ & ALT KATEGORİ (011 & 012 ile uyumlu)
-- -------------------------------------------------------------
SET @CAT_ABOUT_ROOT := 'aaaa7001-1111-4111-8111-aaaaaaaa7001';
SET @SUB_MISSION    := 'bbbb7002-1111-4111-8111-bbbbbbbb7002'; -- Misyon

-- -------------------------------------------------------------
-- GÖRSEL URL’LERİ
-- -------------------------------------------------------------
SET @IMG_MISSION_MAIN :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1757875082/uploads/ensotek/about-images/russia-cooling-tower-1757875080869-645546842.webp';
SET @IMG_MISSION_2 :=
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80';
SET @IMG_MISSION_3 :=
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80';

-- -------------------------------------------------------------
-- PARENT UPSERT (custom_pages)
-- -------------------------------------------------------------
INSERT INTO `custom_pages`
  (`id`,
   `module_key`,
   `is_published`,
   `featured`,
   `display_order`,
   `order_num`,
   `featured_image`,
   `featured_image_asset_id`,
   `image_url`,
   `storage_asset_id`,
   `images`,
   `storage_image_ids`,
   `category_id`,
   `sub_category_id`,
   `created_at`,
   `updated_at`)
VALUES
  (
    @PAGE_MISSION,
    @MODULE_KEY,
    1,
    0,
    10,
    10,
    @IMG_MISSION_MAIN,
    NULL,
    @IMG_MISSION_MAIN,
    NULL,
    JSON_ARRAY(
      @IMG_MISSION_MAIN,
      @IMG_MISSION_2,
      @IMG_MISSION_3
    ),
    JSON_ARRAY(),
    @CAT_ABOUT_ROOT,
    @SUB_MISSION,
    NOW(3),
    NOW(3)
  )
ON DUPLICATE KEY UPDATE
  `module_key`              = VALUES(`module_key`),
  `is_published`            = VALUES(`is_published`),
  `featured`                = VALUES(`featured`),
  `display_order`           = VALUES(`display_order`),
  `order_num`               = VALUES(`order_num`),
  `featured_image`          = VALUES(`featured_image`),
  `featured_image_asset_id` = VALUES(`featured_image_asset_id`),
  `image_url`               = VALUES(`image_url`),
  `storage_asset_id`        = VALUES(`storage_asset_id`),
  `images`                  = VALUES(`images`),
  `storage_image_ids`       = VALUES(`storage_image_ids`),
  `category_id`             = VALUES(`category_id`),
  `sub_category_id`         = VALUES(`sub_category_id`),
  `updated_at`              = VALUES(`updated_at`);

-- -------------------------------------------------------------
-- I18N UPSERT – TR / EN / DE
-- ✅ module_key kolonu YOK
-- -------------------------------------------------------------
INSERT INTO `custom_pages_i18n`
  (`id`,
   `page_id`,
   `locale`,
   `title`,
   `slug`,
   `content`,
   `summary`,
   `featured_image_alt`,
   `meta_title`,
   `meta_description`,
   `tags`,
   `created_at`,
   `updated_at`)
VALUES
-- TR
(
  UUID(),
  @PAGE_MISSION,
  'tr',
  'Misyonumuz',
  'misyonumuz',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Sektördeki yenilikleri ve gelişmeleri yakından takip ederek, müşterilerimizin beklentilerine ve ihtiyaçlarına en uygun, verimli ve ekonomik çözümleri sunmayı amaçlıyoruz.</p>',
      '<p>Hem Türkiye''de hem de dünyada, su soğutma kuleleri denince akla gelen lider firmalardan biri olmayı hedefliyoruz.</p>'
    )
  ),
  'Ensotek''in sektörde yenilikçi, verimli ve ekonomik su soğutma kuleleri çözümleri sunma hedefini tanımlar.',
  'Misyonumuz - Ensotek Su Soğutma Kuleleri',
  'Misyonumuz | Ensotek Su Soğutma Kuleleri',
  'Sektördeki yenilikleri takip ederek su soğutma kulelerinde en iyi çözümleri sunmayı hedefleyen Ensotek''in misyonu.',
  'ensotek,misyon,su sogutma kuleleri,frp',
  NOW(3),
  NOW(3)
),
-- EN
(
  UUID(),
  @PAGE_MISSION,
  'en',
  'Our Mission',
  'our-mission',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Our mission is to closely follow innovations and developments in the sector, providing our customers with efficient and economical solutions that best suit their needs and expectations.</p>',
      '<p>We aim to be one of the leading companies in Turkey and worldwide when it comes to water cooling towers.</p>'
    )
  ),
  'Describes Ensotek''s mission to provide efficient and economical water cooling tower solutions worldwide.',
  'Our Mission - Ensotek Water Cooling Towers',
  'Our Mission | Ensotek Water Cooling Towers',
  'Ensotek''s mission is to follow innovations and provide efficient, economical water cooling tower solutions tailored to customer needs.',
  'ensotek,mission,water cooling towers,frp',
  NOW(3),
  NOW(3)
),
-- DE
(
  UUID(),
  @PAGE_MISSION,
  'de',
  'Unsere Mission',
  'unsere-mission',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Unsere Mission ist es, Innovationen und Entwicklungen in der Branche kontinuierlich zu verfolgen und unseren Kunden effiziente sowie wirtschaftliche Lösungen anzubieten, die bestmöglich zu ihren Erwartungen und Anforderungen passen.</p>',
      '<p>Wir möchten in der Türkei und international zu den führenden Unternehmen gehören, wenn es um Wasserkühltürme geht.</p>'
    )
  ),
  'Beschreibt Ensoteks Mission, effiziente und wirtschaftliche Wasserkühlturm-Lösungen anzubieten und zu den führenden Anbietern zu zählen.',
  'Unsere Mission – Ensotek Wasserkühltürme',
  'Unsere Mission | Ensotek Wasserkühltürme',
  'Ensoteks Mission: Innovationen verfolgen und kundenorientierte, effiziente sowie wirtschaftliche Wasserkühlturm-Lösungen bereitstellen.',
  'ensotek,mission,wasserkühltürme,frp',
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`              = VALUES(`title`),
  `slug`               = VALUES(`slug`),
  `content`            = VALUES(`content`),
  `summary`            = VALUES(`summary`),
  `featured_image_alt` = VALUES(`featured_image_alt`),
  `meta_title`         = VALUES(`meta_title`),
  `meta_description`   = VALUES(`meta_description`),
  `tags`               = VALUES(`tags`),
  `updated_at`         = VALUES(`updated_at`);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
