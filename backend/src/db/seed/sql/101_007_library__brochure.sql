-- =============================================================
-- FILE: src/db/seed/sql/library/101_007_library__brochure.sql
-- Ensotek - Library Seed: Corporate Brochure (PDF)
-- FINAL / SCHEMA-SAFE
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- 1) PARENT
INSERT INTO `library`
(
  `id`, `type`,
  `category_id`, `sub_category_id`,
  `featured`, `is_published`, `is_active`, `display_order`,
  `featured_image`, `image_url`, `image_asset_id`,
  `views`, `download_count`, `published_at`,
  `created_at`, `updated_at`
)
VALUES
(
  '77777777-7777-7777-7777-777777777777',
  'pdf',
  NULL, NULL,
  0, 1, 1, 90,
  NULL, NULL, NULL,
  0, 0, NOW(3),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `type`           = VALUES(`type`),
  `category_id`    = VALUES(`category_id`),
  `sub_category_id`= VALUES(`sub_category_id`),
  `featured`       = VALUES(`featured`),
  `is_published`   = VALUES(`is_published`),
  `is_active`      = VALUES(`is_active`),
  `display_order`  = VALUES(`display_order`),
  `featured_image` = VALUES(`featured_image`),
  `image_url`      = VALUES(`image_url`),
  `image_asset_id` = VALUES(`image_asset_id`),
  `views`          = VALUES(`views`),
  `download_count` = VALUES(`download_count`),
  `published_at`   = VALUES(`published_at`),
  `updated_at`     = VALUES(`updated_at`);

-- 2) I18N TR
INSERT INTO `library_i18n`
(
  `id`,`library_id`,`locale`,
  `slug`,`name`,`description`,`image_alt`,
  `tags`,`meta_title`,`meta_description`,`meta_keywords`,
  `created_at`,`updated_at`
)
VALUES
(
  '77777777-7777-4777-8666-111111111111',
  '77777777-7777-7777-7777-777777777777',
  'tr',
  'ensotek-kurumsal-brosur',
  'Kurumsal Broşür (PDF)',
  CONCAT(
    '<h2>Kurumsal Broşür (PDF)</h2>',
    '<p>Bu sayfada Ensotek kurumsal broşürünü PDF formatında önizleyebilir ve indirebilirsiniz.</p>',
    '<ul>',
      '<li>Ürün grupları ve çözümler</li>',
      '<li>Hizmet kapsamı ve bakım yaklaşımı</li>',
      '<li>Kalite, sertifikalar ve üretim altyapısı</li>',
      '<li>Proje referansları ve iletişim</li>',
    '</ul>'
  ),
  'Ensotek kurumsal broşür PDF',
  'kurumsal broşür, ensotek broşür, pdf, katalog, kurumsal tanıtım',
  'Kurumsal Broşür (PDF) | Ensotek',
  'Ensotek kurumsal broşür PDF: ürün grupları, hizmetler, kalite yaklaşımı ve iletişim bilgileri.',
  'ensotek, kurumsal brosur, pdf, katalog, company profile',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `slug`=VALUES(`slug`),
  `name`=VALUES(`name`),
  `description`=VALUES(`description`),
  `image_alt`=VALUES(`image_alt`),
  `tags`=VALUES(`tags`),
  `meta_title`=VALUES(`meta_title`),
  `meta_description`=VALUES(`meta_description`),
  `meta_keywords`=VALUES(`meta_keywords`),
  `updated_at`=VALUES(`updated_at`);

-- 3) I18N EN
INSERT INTO `library_i18n`
(
  `id`,`library_id`,`locale`,
  `slug`,`name`,`description`,`image_alt`,
  `tags`,`meta_title`,`meta_description`,`meta_keywords`,
  `created_at`,`updated_at`
)
VALUES
(
  '77777777-7777-4777-8666-222222222222',
  '77777777-7777-7777-7777-777777777777',
  'en',
  'ensotek-corporate-brochure',
  'Corporate Brochure (PDF)',
  CONCAT(
    '<h2>Corporate Brochure (PDF)</h2>',
    '<p>You can preview and download the Ensotek corporate brochure in PDF format on this page.</p>',
    '<ul>',
      '<li>Product lines and solutions</li>',
      '<li>Service scope and maintenance approach</li>',
      '<li>Quality, certifications, and production capabilities</li>',
      '<li>References and contact information</li>',
    '</ul>'
  ),
  'Ensotek corporate brochure PDF',
  'corporate brochure, ensotek brochure, pdf, catalog, company profile',
  'Corporate Brochure (PDF) | Ensotek',
  'Ensotek corporate brochure PDF: product lines, services, quality approach, and contact details.',
  'ensotek, corporate brochure, pdf, catalog, company profile',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `slug`=VALUES(`slug`),
  `name`=VALUES(`name`),
  `description`=VALUES(`description`),
  `image_alt`=VALUES(`image_alt`),
  `tags`=VALUES(`tags`),
  `meta_title`=VALUES(`meta_title`),
  `meta_description`=VALUES(`meta_description`),
  `meta_keywords`=VALUES(`meta_keywords`),
  `updated_at`=VALUES(`updated_at`);

-- 4) I18N DE
INSERT INTO `library_i18n`
(
  `id`,`library_id`,`locale`,
  `slug`,`name`,`description`,`image_alt`,
  `tags`,`meta_title`,`meta_description`,`meta_keywords`,
  `created_at`,`updated_at`
)
VALUES
(
  '77777777-7777-4777-8666-333333333333',
  '77777777-7777-7777-7777-777777777777',
  'de',
  'ensotek-unternehmensbroschuere',
  'Unternehmensbroschüre (PDF)',
  CONCAT(
    '<h2>Unternehmensbroschüre (PDF)</h2>',
    '<p>Auf dieser Seite können Sie die Ensotek-Unternehmensbroschüre als PDF ansehen und herunterladen.</p>',
    '<ul>',
      '<li>Produktlinien und Lösungen</li>',
      '<li>Serviceumfang und Wartungsansatz</li>',
      '<li>Qualität, Zertifizierungen und Fertigungskompetenzen</li>',
      '<li>Referenzen und Kontaktinformationen</li>',
    '</ul>'
  ),
  'Ensotek Unternehmensbroschüre PDF',
  'unternehmensbroschuere, ensotek broschuere, pdf, katalog, unternehmensprofil',
  'Unternehmensbroschüre (PDF) | Ensotek',
  'Ensotek Unternehmensbroschüre als PDF: Produktlinien, Services, Qualitätsansatz und Kontaktdaten.',
  'ensotek, unternehmensbroschuere, pdf, katalog, unternehmensprofil',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `slug`=VALUES(`slug`),
  `name`=VALUES(`name`),
  `description`=VALUES(`description`),
  `image_alt`=VALUES(`image_alt`),
  `tags`=VALUES(`tags`),
  `meta_title`=VALUES(`meta_title`),
  `meta_description`=VALUES(`meta_description`),
  `meta_keywords`=VALUES(`meta_keywords`),
  `updated_at`=VALUES(`updated_at`);

-- 5) COVER IMAGE (display_order=10)  ✅ burada kapak görseli set edebilirsin
INSERT INTO `library_images`
(
  `id`,`library_id`,
  `image_asset_id`,`image_url`,
  `is_active`,`display_order`,
  `created_at`,`updated_at`
)
VALUES
(
  '77777777-8888-4777-9999-aaaaaaaaaaaa',
  '77777777-7777-7777-7777-777777777777',
  NULL,
  '/uploads/catalog/Ensotek-cooling-tower-catalog-cover.png',
  1,
  10,
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `image_asset_id`=VALUES(`image_asset_id`),
  `image_url`=VALUES(`image_url`),
  `is_active`=VALUES(`is_active`),
  `display_order`=VALUES(`display_order`),
  `updated_at`=VALUES(`updated_at`);

-- 6) COVER IMAGE I18N
INSERT INTO `library_images_i18n`
(`id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`)
VALUES
(
  '77777777-9999-4888-aaaa-111111111111',
  '77777777-8888-4777-9999-aaaaaaaaaaaa',
  'tr',
  'Katalog Kapak',
  'Ensotek katalog kapak görseli',
  'Ensotek Katalog',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),
  `alt`=VALUES(`alt`),
  `caption`=VALUES(`caption`),
  `updated_at`=VALUES(`updated_at`);

INSERT INTO `library_images_i18n`
(`id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`)
VALUES
(
  '77777777-9999-4888-aaaa-222222222222',
  '77777777-8888-4777-9999-aaaaaaaaaaaa',
  'en',
  'Catalog Cover',
  'Ensotek catalog cover image',
  'Ensotek Catalog',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),
  `alt`=VALUES(`alt`),
  `caption`=VALUES(`caption`),
  `updated_at`=VALUES(`updated_at`);

INSERT INTO `library_images_i18n`
(`id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`)
VALUES
(
  '77777777-9999-4888-aaaa-333333333333',
  '77777777-8888-4777-9999-aaaaaaaaaaaa',
  'de',
  'Katalog-Cover',
  'Coverbild des Ensotek-Katalogs',
  'Ensotek Katalog',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),
  `alt`=VALUES(`alt`),
  `caption`=VALUES(`caption`),
  `updated_at`=VALUES(`updated_at`);

-- 7) PDF FILE (display_order=10) ✅ asıl pdf burada
INSERT INTO `library_files`
(
  `id`,`library_id`,
  `asset_id`,
  `file_url`,
  `name`,
  `size_bytes`,
  `mime_type`,
  `tags_json`,
  `display_order`,
  `is_active`,
  `created_at`,`updated_at`
)
VALUES
(
  '77777777-aaaa-4bbb-cccc-bbbbbbbbbbbb',
  '77777777-7777-7777-7777-777777777777',
  NULL,
  'https://www.ensotek.de/uploads/catalog/Ensotek-cooling-tower-catalog.pdf',
  'Ensotek Cooling Tower Catalog (PDF)',
  NULL,
  'application/pdf',
  NULL,
  10,
  1,
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `asset_id`=VALUES(`asset_id`),
  `file_url`=VALUES(`file_url`),
  `name`=VALUES(`name`),
  `size_bytes`=VALUES(`size_bytes`),
  `mime_type`=VALUES(`mime_type`),
  `tags_json`=VALUES(`tags_json`),
  `display_order`=VALUES(`display_order`),
  `is_active`=VALUES(`is_active`),
  `updated_at`=VALUES(`updated_at`);

-- 8) FILE I18N
INSERT INTO `library_files_i18n`
(`id`,`file_id`,`locale`,`title`,`description`,`created_at`,`updated_at`)
VALUES
(
  '77777777-bbbb-4ccc-dddd-111111111111',
  '77777777-aaaa-4bbb-cccc-bbbbbbbbbbbb',
  'tr',
  'Katalog (PDF)',
  'Ensotek soğutma kulesi katalog PDF dosyası.',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),
  `description`=VALUES(`description`),
  `updated_at`=VALUES(`updated_at`);

INSERT INTO `library_files_i18n`
(`id`,`file_id`,`locale`,`title`,`description`,`created_at`,`updated_at`)
VALUES
(
  '77777777-bbbb-4ccc-dddd-222222222222',
  '77777777-aaaa-4bbb-cccc-bbbbbbbbbbbb',
  'en',
  'Catalog (PDF)',
  'Ensotek cooling tower catalog PDF file.',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),
  `description`=VALUES(`description`),
  `updated_at`=VALUES(`updated_at`);

INSERT INTO `library_files_i18n`
(`id`,`file_id`,`locale`,`title`,`description`,`created_at`,`updated_at`)
VALUES
(
  '77777777-bbbb-4ccc-dddd-333333333333',
  '77777777-aaaa-4bbb-cccc-bbbbbbbbbbbb',
  'de',
  'Katalog (PDF)',
  'Ensotek Kühl­turm-Katalog als PDF-Datei.',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),
  `description`=VALUES(`description`),
  `updated_at`=VALUES(`updated_at`);

COMMIT;
