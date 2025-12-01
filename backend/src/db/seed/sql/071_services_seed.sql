-- =============================================================
-- 071_services_seed.sql  (örnek parent + i18n seed)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- =========================================================
-- ÖRNEK SEEDLER
-- - Eski tek tablo seed'inden iki örnek hizmet:
--   1) mevsimlik-cicek-ekimi (gardening)
--   2) standart-toprak-doldurumu (soil)
-- - Diğerleri aynı pattern ile eklenebilir.
-- =========================================================

-- ---------------------------------------------------------
-- 1) Mevsimlik Çiçek Ekimi  (type: gardening)
-- ---------------------------------------------------------

SET @SRV_MEVSIMLIK_ID := (
  SELECT s.id
  FROM services s
  JOIN services_i18n i ON i.service_id = s.id AND i.locale = 'tr'
  WHERE i.slug = 'mevsimlik-cicek-ekimi'
  LIMIT 1
);
SET @SRV_MEVSIMLIK_ID := COALESCE(@SRV_MEVSIMLIK_ID, UUID());

-- Parent (non-i18n)
INSERT INTO `services`
(`id`,
 `type`,
 `category_id`, `sub_category_id`,
 `featured`, `is_active`, `display_order`,
 `featured_image`, `image_url`, `image_asset_id`,
 `area`, `duration`, `maintenance`, `season`,
 `soil_type`, `thickness`, `equipment`,
 `created_at`, `updated_at`)
VALUES
(@SRV_MEVSIMLIK_ID,
 'gardening',
 NULL, NULL,
 1, 1, 1,
 NULL,
 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
 NULL,
 '2-5 m²','3-4 Ay','Haftalık Bakım','Mevsimlik',
 NULL,NULL,NULL,
 '2024-01-01 00:00:00.000','2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
 `type`           = VALUES(`type`),
 `category_id`    = VALUES(`category_id`),
 `sub_category_id`= VALUES(`sub_category_id`),
 `featured`       = VALUES(`featured`),
 `is_active`      = VALUES(`is_active`),
 `display_order`  = VALUES(`display_order`),
 `featured_image` = VALUES(`featured_image`),
 `image_url`      = VALUES(`image_url`),
 `image_asset_id` = VALUES(`image_asset_id`),
 `area`           = VALUES(`area`),
 `duration`       = VALUES(`duration`),
 `maintenance`    = VALUES(`maintenance`),
 `season`         = VALUES(`season`),
 `soil_type`      = VALUES(`soil_type`),
 `thickness`      = VALUES(`thickness`),
 `equipment`      = VALUES(`equipment`),
 `updated_at`     = VALUES(`updated_at`);

-- i18n (TR)
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `created_at`,`updated_at`)
VALUES
(UUID(), @SRV_MEVSIMLIK_ID, 'tr',
 'mevsimlik-cicek-ekimi','Mevsimlik Çiçek Ekimi',
 'Mezar alanınıza mevsimlik çiçek ekimi ve düzenli bakım hizmeti',
 'Mevsim Çiçekleri','Fiyat İçin Arayınız',
 'Çiçek + Toprak + Ekim + Bakım','Çiçek Sağlığı Garantisi',
 'Mevsimlik çiçek ekimi',
 '2024-01-01 00:00:00.000','2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
 `slug`         = VALUES(`slug`),
 `name`         = VALUES(`name`),
 `description`  = VALUES(`description`),
 `material`     = VALUES(`material`),
 `price`        = VALUES(`price`),
 `includes`     = VALUES(`includes`),
 `warranty`     = VALUES(`warranty`),
 `image_alt`    = VALUES(`image_alt`),
 `updated_at`   = VALUES(`updated_at`);

-- i18n (EN) – gerçek İngilizce metin + INGILIZCE SLUG
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `created_at`,`updated_at`)
VALUES
(
  UUID(),
  @SRV_MEVSIMLIK_ID,
  'en',
  'seasonal-flower-planting',              -- EN slug
  'Seasonal Flower Planting',
  'Seasonal flower planting and regular maintenance service for the grave area.',
  'Seasonal Flowers',
  'Contact us for pricing',
  'Flowers + Soil + Planting + Maintenance',
  'Plant Health Guarantee',
  'Seasonal flower planting',
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `slug`         = VALUES(`slug`),
 `name`         = VALUES(`name`),
 `description`  = VALUES(`description`),
 `material`     = VALUES(`material`),
 `price`        = VALUES(`price`),
 `includes`     = VALUES(`includes`),
 `warranty`     = VALUES(`warranty`),
 `image_alt`    = VALUES(`image_alt`),
 `updated_at`   = VALUES(`updated_at`);


-- ---------------------------------------------------------
-- 2) Standart Toprak Doldurumu  (type: soil)
-- ---------------------------------------------------------

SET @SRV_STANDART_TOPRAK_ID := (
  SELECT s.id
  FROM services s
  JOIN services_i18n i ON i.service_id = s.id AND i.locale = 'tr'
  WHERE i.slug = 'standart-toprak-doldurumu'
  LIMIT 1
);
SET @SRV_STANDART_TOPRAK_ID := COALESCE(@SRV_STANDART_TOPRAK_ID, UUID());

-- Parent (non-i18n)
INSERT INTO `services`
(`id`,
 `type`,
 `category_id`, `sub_category_id`,
 `featured`, `is_active`, `display_order`,
 `featured_image`, `image_url`, `image_asset_id`,
 `area`, `duration`, `maintenance`, `season`,
 `soil_type`, `thickness`, `equipment`,
 `created_at`,`updated_at`)
VALUES
(@SRV_STANDART_TOPRAK_ID,
 'soil',
 NULL, NULL,
 1, 1, 1,
 NULL,
 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
 NULL,
 '2-10 m²', NULL, NULL, NULL,
 'Kaliteli Bahçe Toprağı','20-30 cm','El Aletleri + Küçük Makine',
 '2024-01-01 00:00:00.000','2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
 `type`           = VALUES(`type`),
 `category_id`    = VALUES(`category_id`),
 `sub_category_id`= VALUES(`sub_category_id`),
 `featured`       = VALUES(`featured`),
 `is_active`      = VALUES(`is_active`),
 `display_order`  = VALUES(`display_order`),
 `featured_image` = VALUES(`featured_image`),
 `image_url`      = VALUES(`image_url`),
 `image_asset_id` = VALUES(`image_asset_id`),
 `area`           = VALUES(`area`),
 `duration`       = VALUES(`duration`),
 `maintenance`    = VALUES(`maintenance`),
 `season`         = VALUES(`season`),
 `soil_type`      = VALUES(`soil_type`),
 `thickness`      = VALUES(`thickness`),
 `equipment`      = VALUES(`equipment`),
 `updated_at`     = VALUES(`updated_at`);

-- i18n (TR)
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `created_at`,`updated_at`)
VALUES
(UUID(), @SRV_STANDART_TOPRAK_ID, 'tr',
 'standart-toprak-doldurumu','Standart Toprak Doldurumu',
 'Mezar alanının temel toprak doldurumu ve düzeltme işlemi',
 'Kaliteli Bahçe Toprağı','Fiyat İçin Arayınız',
 'Toprak + Nakliye + İşçilik + Düzeltme','6 Ay Çöküntü Garantisi',
 'Standart toprak doldurumu',
 '2024-01-01 00:00:00.000','2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
 `slug`         = VALUES(`slug`),
 `name`         = VALUES(`name`),
 `description`  = VALUES(`description`),
 `material`     = VALUES(`material`),
 `price`        = VALUES(`price`),
 `includes`     = VALUES(`includes`),
 `warranty`     = VALUES(`warranty`),
 `image_alt`    = VALUES(`image_alt`),
 `updated_at`   = VALUES(`updated_at`);

-- i18n (EN)
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `created_at`,`updated_at`)
VALUES
(
  UUID(),
  @SRV_STANDART_TOPRAK_ID,
  'en',
  'standard-soil-fill',                 -- EN slug
  'Standard Soil Filling',
  'Basic soil filling and leveling service for the grave area.',
  'High Quality Garden Soil',
  'Contact us for pricing',
  'Soil + Transport + Labor + Leveling',
  '6-Month Settlement Guarantee',
  'Standard soil filling',
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `slug`         = VALUES(`slug`),
 `name`         = VALUES(`name`),
 `description`  = VALUES(`description`),
 `material`     = VALUES(`material`),
 `price`        = VALUES(`price`),
 `includes`     = VALUES(`includes`),
 `warranty`     = VALUES(`warranty`),
 `image_alt`    = VALUES(`image_alt`),
 `updated_at`   = VALUES(`updated_at`);


-- ---------------------------------------------------------
-- GENERIC: Eksik EN kayıtları için TR'den kopya
-- ---------------------------------------------------------

INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `created_at`,`updated_at`)
SELECT
  UUID(), s.service_id, 'en',
  s.slug, s.name, s.description, s.material, s.price,
  s.includes, s.warranty, s.image_alt,
  NOW(3), NOW(3)
FROM `services_i18n` s
WHERE s.locale = 'tr'
  AND NOT EXISTS (
    SELECT 1 FROM `services_i18n` t
    WHERE t.service_id = s.service_id
      AND t.locale = 'en'
  );

COMMIT;
