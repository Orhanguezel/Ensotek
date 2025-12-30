-- =============================================================
-- FILE: 051.3_custom_pages_quality.seed.sql (FINAL / STATIC CONTENT)
-- Ensotek Kurumsal Sayfaları – Kalite & Sertifikalar
-- - content_html kullanılmıyor (sayfa statik içerik + ui ile)
-- - sertifika görselleri: custom_pages.images (gallery)
-- - ✅ FIX: Sertifika URL'leri ezilmiyor
-- - ✅ FIX: Gallery: main + 6 sertifika (toplam 7)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

SET @PAGE_QUALITY := '11111111-2222-3333-4444-555555555574';
SET @MODULE_KEY := 'quality';

SET @CAT_ABOUT_ROOT := 'aaaa7001-1111-4111-8111-aaaaaaaa7001';
SET @SUB_QUALITY    := 'bbbb7004-1111-4111-8111-bbbbbbbb7004';

-- MAIN hero / featured image (Cloudinary)
SET @IMG_QUALITY_MAIN :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1757875082/uploads/ensotek/about-images/russia-cooling-tower-1757875080869-645546842.webp';

-- 6 Sertifika görselleri (LOCAL örnek)  ✅ (değiştirme / CDN yap)
SET @IMG_CERT_1 := 'http://localhost:8086/uploads/zertifika/14001_1.jpg';
SET @IMG_CERT_2 := 'http://localhost:8086/uploads/zertifika/45001_1.jpg';
SET @IMG_CERT_3 := 'http://localhost:8086/uploads/zertifika/ce-belgesi-ce-declaration.jpg';
SET @IMG_CERT_4 := 'http://localhost:8086/uploads/zertifika/eac-ensotek.jpg';
SET @IMG_CERT_5 := 'http://localhost:8086/uploads/zertifika/iso-9001.jpg';
SET @IMG_CERT_6 := 'http://localhost:8086/uploads/zertifika/iso-10002.jpg';

-- Cache-bust (deterministik)
SET @IMG_QUALITY_MAIN := CONCAT(@IMG_QUALITY_MAIN, '?v=1');
SET @IMG_CERT_1 := CONCAT(@IMG_CERT_1, '?v=1');
SET @IMG_CERT_2 := CONCAT(@IMG_CERT_2, '?v=1');
SET @IMG_CERT_3 := CONCAT(@IMG_CERT_3, '?v=1');
SET @IMG_CERT_4 := CONCAT(@IMG_CERT_4, '?v=1');
SET @IMG_CERT_5 := CONCAT(@IMG_CERT_5, '?v=1');
SET @IMG_CERT_6 := CONCAT(@IMG_CERT_6, '?v=1');

-- LONGTEXT JSON-string alanlarına güvenli şekilde yaz
-- ✅ Gallery: main + 6 sertifika (toplam 7)
SET @IMAGES_JSON := JSON_ARRAY(
  @IMG_QUALITY_MAIN,
  @IMG_CERT_1,
  @IMG_CERT_2,
  @IMG_CERT_3,
  @IMG_CERT_4,
  @IMG_CERT_5,
  @IMG_CERT_6
);

SET @STORAGE_IMAGE_IDS_JSON := JSON_ARRAY();

INSERT INTO `custom_pages`
  (`id`,
   `module_key`,
   `is_published`,
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
    @PAGE_QUALITY,
    @MODULE_KEY,
    1,
    40,
    40,
    @IMG_QUALITY_MAIN,
    NULL,
    @IMG_QUALITY_MAIN,
    NULL,
    CAST(@IMAGES_JSON AS CHAR),
    CAST(@STORAGE_IMAGE_IDS_JSON AS CHAR),
    @CAT_ABOUT_ROOT,
    @SUB_QUALITY,
    NOW(3),
    NOW(3)
  )
ON DUPLICATE KEY UPDATE
  `module_key`              = VALUES(`module_key`),
  `is_published`            = VALUES(`is_published`),
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

-- deterministik i18n id
SET @I18N_TR := '11111111-2222-3333-4444-555555555571';
SET @I18N_EN := '11111111-2222-3333-4444-555555555572';
SET @I18N_DE := '11111111-2222-3333-4444-555555555573';

-- content artık boş (sayfa statik)
SET @EMPTY_CONTENT := JSON_OBJECT('html', '');

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
(
  @I18N_TR,
  @PAGE_QUALITY,
  'tr',
  'Kalite Belgelerimiz & Kalite Standartlarımız',
  'kalite-belgelerimiz-kalite-standartlarimiz',
  @EMPTY_CONTENT,
  'Ensotek kalite belgeleri ve sertifikaları sayfası',
  'Ensotek kalite belgeleri – sertifikalar',
  'Kalite Belgelerimiz & Kalite Standartlarımız | Ensotek',
  'Ensotek kalite belgeleri ve kalite standartları: ISO 9001, ISO 14001, iş sağlığı ve güvenliği yaklaşımı ve uygunluk dokümantasyonları. Sertifikaları ayrı görsellerle inceleyin.',
  'ensotek,kalite,sertifika,iso 9001,iso 14001,iso 45001,ohsas,standartlar',
  NOW(3),
  NOW(3)
),
(
  @I18N_EN,
  @PAGE_QUALITY,
  'en',
  'Quality Certificates & Quality Standards',
  'quality-certificates-quality-standards',
  @EMPTY_CONTENT,
  'Ensotek quality certificates and standards page',
  'Ensotek quality certificates – certifications',
  'Quality Certificates & Quality Standards | Ensotek',
  'Ensotek quality certificates and standards: ISO 9001, ISO 14001, occupational health & safety approach and compliance documentation. Review certificates as individual visuals.',
  'ensotek,quality,certificate,iso 9001,iso 14001,iso 45001,ohsas,standards',
  NOW(3),
  NOW(3)
),
(
  @I18N_DE,
  @PAGE_QUALITY,
  'de',
  'Qualitätszertifikate & Qualitätsstandards',
  'qualitaetszertifikate-qualitaetsstandards',
  @EMPTY_CONTENT,
  'Ensotek Qualitätszertifikate und Qualitätsstandards',
  'Ensotek Qualitätszertifikate – Zertifizierungen',
  'Qualitätszertifikate & Qualitätsstandards | Ensotek',
  'Ensotek Qualitätszertifikate und Standards: ISO 9001, ISO 14001, Arbeitsschutz-Ansatz sowie Konformitäts- und Dokumentationsprozesse. Zertifikate als einzelne Visuals prüfen.',
  'ensotek,qualität,zertifikat,iso 9001,iso 14001,iso 45001,ohsas,standards',
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
