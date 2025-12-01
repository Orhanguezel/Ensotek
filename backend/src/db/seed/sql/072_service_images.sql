-- =============================================================
-- 072_service_images.sql
-- Services için gallery görselleri (TR / EN)
--  - 071_services_seed.sql'deki slug'larla uyumlu çalışır
-- =============================================================

START TRANSACTION;

-- -------------------------------------------------------------
-- İLGİLİ SERVICE ID'LERİNİ SLUG ÜZERİNDEN BUL
-- (071_services_seed.sql'deki slug'larla uyumlu)
-- -------------------------------------------------------------

-- 1) Mevsimlik Çiçek Ekimi (gardening)
SET @SRV_MEVSIMLIK_ID := (
  SELECT s.id
  FROM services s
  JOIN services_i18n i
    ON i.service_id = s.id
   AND i.locale = 'tr'
  WHERE i.slug = 'mevsimlik-cicek-ekimi'
  LIMIT 1
);

-- 2) Standart Toprak Doldurumu (soil)
SET @SRV_STANDART_TOPRAK_ID := (
  SELECT s.id
  FROM services s
  JOIN services_i18n i
    ON i.service_id = s.id
   AND i.locale = 'tr'
  WHERE i.slug = 'standart-toprak-doldurumu'
  LIMIT 1
);

-- Eğer ilgili service bulunamadıysa (bir önceki seed fail ise),
-- aşağıdaki INSERT'ler WHERE koşulları sayesinde no-op olur.


-- =============================================================
-- 1) MEVSİMLİK ÇİÇEK EKİMİ ANA GÖRSELİ
-- =============================================================

-- Mevcut ana görsel var mı? (display_order = 1)
SET @SRVIMG_MEVSIMLIK_MAIN_ID := (
  SELECT si.id
  FROM service_images si
  WHERE si.service_id = @SRV_MEVSIMLIK_ID
    AND si.display_order = 1
  LIMIT 1
);

SET @SRVIMG_MEVSIMLIK_MAIN_ID := COALESCE(@SRVIMG_MEVSIMLIK_MAIN_ID, UUID());

-- Parent: service_images
INSERT INTO `service_images`
(`id`,
 `service_id`,
 `image_asset_id`,
 `image_url`,
 `is_active`,
 `display_order`,
 `created_at`,
 `updated_at`)
SELECT
  @SRVIMG_MEVSIMLIK_MAIN_ID,
  @SRV_MEVSIMLIK_ID,
  NULL,
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
  1,
  1,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
FROM DUAL
WHERE @SRV_MEVSIMLIK_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  `service_id`     = VALUES(`service_id`),
  `image_asset_id` = VALUES(`image_asset_id`),
  `image_url`      = VALUES(`image_url`),
  `is_active`      = VALUES(`is_active`),
  `display_order`  = VALUES(`display_order`),
  `updated_at`     = VALUES(`updated_at`);

-- I18N: service_images_i18n (TR)
INSERT INTO `service_images_i18n`
(`id`,
 `image_id`,
 `locale`,
 `title`,
 `alt`,
 `caption`,
 `created_at`,
 `updated_at`)
SELECT
  UUID(),
  @SRVIMG_MEVSIMLIK_MAIN_ID,
  'tr',
  'Mevsimlik çiçek ekimi ana görseli',
  'Mezar üzerinde mevsimlik çiçek ekimi hizmeti',
  'Mevsimlik çiçeklerle düzenlenmiş mezar alanı',
  NOW(3),
  NOW(3)
FROM DUAL
WHERE @SRV_MEVSIMLIK_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  `title`      = VALUES(`title`),
  `alt`        = VALUES(`alt`),
  `caption`    = VALUES(`caption`),
  `updated_at` = VALUES(`updated_at`);

-- I18N: service_images_i18n (EN)
INSERT INTO `service_images_i18n`
(`id`,
 `image_id`,
 `locale`,
 `title`,
 `alt`,
 `caption`,
 `created_at`,
 `updated_at`)
SELECT
  UUID(),
  @SRVIMG_MEVSIMLIK_MAIN_ID,
  'en',
  'Seasonal flower planting main image',
  'Seasonal flower planting service on the grave',
  'Grave area decorated with seasonal flowers',
  NOW(3),
  NOW(3)
FROM DUAL
WHERE @SRV_MEVSIMLIK_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  `title`      = VALUES(`title`),
  `alt`        = VALUES(`alt`),
  `caption`    = VALUES(`caption`),
  `updated_at` = VALUES(`updated_at`);


-- =============================================================
-- 2) STANDART TOPRAK DOLDURUMU ANA GÖRSELİ
-- =============================================================

SET @SRVIMG_STANDART_TOPRAK_MAIN_ID := (
  SELECT si.id
  FROM service_images si
  WHERE si.service_id = @SRV_STANDART_TOPRAK_ID
    AND si.display_order = 1
  LIMIT 1
);

SET @SRVIMG_STANDART_TOPRAK_MAIN_ID := COALESCE(@SRVIMG_STANDART_TOPRAK_MAIN_ID, UUID());

INSERT INTO `service_images`
(`id`,
 `service_id`,
 `image_asset_id`,
 `image_url`,
 `is_active`,
 `display_order`,
 `created_at`,
 `updated_at`)
SELECT
  @SRVIMG_STANDART_TOPRAK_MAIN_ID,
  @SRV_STANDART_TOPRAK_ID,
  NULL,
  'https://images.unsplash.com/photo-1589929460218-da4ba5fce3f5?w=800&h=600&fit=crop',
  1,
  1,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
FROM DUAL
WHERE @SRV_STANDART_TOPRAK_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  `service_id`     = VALUES(`service_id`),
  `image_asset_id` = VALUES(`image_asset_id`),
  `image_url`      = VALUES(`image_url`),
  `is_active`      = VALUES(`is_active`),
  `display_order`  = VALUES(`display_order`),
  `updated_at`     = VALUES(`updated_at`);

-- I18N: TR
INSERT INTO `service_images_i18n`
(`id`,
 `image_id`,
 `locale`,
 `title`,
 `alt`,
 `caption`,
 `created_at`,
 `updated_at`)
SELECT
  UUID(),
  @SRVIMG_STANDART_TOPRAK_MAIN_ID,
  'tr',
  'Standart toprak doldurumu ana görseli',
  'Mezar alanında standart toprak doldurumu hizmeti',
  'Temel toprak doldurumu yapılmış mezar alanı',
  NOW(3),
  NOW(3)
FROM DUAL
WHERE @SRV_STANDART_TOPRAK_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  `title`      = VALUES(`title`),
  `alt`        = VALUES(`alt`),
  `caption`    = VALUES(`caption`),
  `updated_at` = VALUES(`updated_at`);

-- I18N: EN
INSERT INTO `service_images_i18n`
(`id`,
 `image_id`,
 `locale`,
 `title`,
 `alt`,
 `caption`,
 `created_at`,
 `updated_at`)
SELECT
  UUID(),
  @SRVIMG_STANDART_TOPRAK_MAIN_ID,
  'en',
  'Standard soil fill main image',
  'Standard soil filling service on the grave',
  'Grave area after standard soil filling',
  NOW(3),
  NOW(3)
FROM DUAL
WHERE @SRV_STANDART_TOPRAK_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  `title`      = VALUES(`title`),
  `alt`        = VALUES(`alt`),
  `caption`    = VALUES(`caption`),
  `updated_at` = VALUES(`updated_at`);

COMMIT;
