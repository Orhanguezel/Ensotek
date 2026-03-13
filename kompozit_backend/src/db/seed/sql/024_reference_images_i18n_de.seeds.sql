-- 024_reference_images_i18n_de.seeds.sql (DE) [NO VARS] (FIXED / SELF-CONTAINED)
SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

-- -------------------------------------------------------------
-- 0) Ensure PARENT + I18N tables exist (schema çalışmadıysa)
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `reference_images`
(
  `id`               CHAR(36)     NOT NULL,
  `reference_id`     CHAR(36)     NOT NULL,

  `image_url`        VARCHAR(500)  DEFAULT NULL,
  `storage_asset_id` CHAR(36)      DEFAULT NULL,

  `is_featured`      TINYINT(1)    NOT NULL DEFAULT 0,
  `display_order`    INT           NOT NULL DEFAULT 0,
  `is_published`     TINYINT(1)    NOT NULL DEFAULT 0,

  `created_at`       DATETIME(3)   NOT NULL,
  `updated_at`       DATETIME(3)   NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_reference_images_parent_order` (`reference_id`, `display_order`),
  KEY `ix_reference_images_reference_id` (`reference_id`),

  CONSTRAINT `fk_reference_images_reference`
    FOREIGN KEY (`reference_id`) REFERENCES `references` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `reference_images_i18n`
(
  `id`          CHAR(36)     NOT NULL,
  `image_id`    CHAR(36)     NOT NULL,
  `locale`      VARCHAR(10)  NOT NULL,

  `title`       VARCHAR(200) DEFAULT NULL,
  `alt`         VARCHAR(255) DEFAULT NULL,

  `created_at`  DATETIME(3)  NOT NULL,
  `updated_at`  DATETIME(3)  NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_ref_image_i18n_parent_locale` (`image_id`, `locale`),
  KEY `ix_ref_image_i18n_image_id` (`image_id`),
  KEY `ix_ref_image_i18n_locale` (`locale`),

  CONSTRAINT `fk_ref_image_i18n_image`
    FOREIGN KEY (`image_id`) REFERENCES `reference_images` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 1) Ensure parent rows exist (FK için şart)
--    ✅ Buraya 023_reference_images_domestic.seeds.sql içindeki
--    reference_images VALUES bloğunu (EXACT) koy.
-- -------------------------------------------------------------

INSERT INTO `reference_images`
(
  id, reference_id,
  image_url, storage_asset_id,
  is_featured, display_order, is_published,
  created_at, updated_at
)
VALUES
  ('9d9d5201-0001-4222-8222-520100000001', '7b1b5201-0001-4222-8222-520100000001',
   'https://images.unsplash.com/photo-1487875961445-47a00398c267?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   1, 1, 1, NOW(3), NOW(3)),
  ('9d9d5201-0002-4222-8222-520100000001', '7b1b5201-0001-4222-8222-520100000001',
   'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   0, 2, 1, NOW(3), NOW(3)),
  ('9d9d5201-0003-4222-8222-520100000001', '7b1b5201-0001-4222-8222-520100000001',
   'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   0, 3, 1, NOW(3), NOW(3))

  -- ... (023 dosyandaki VALUES bloğu burada eksiksiz devam edecek)

ON DUPLICATE KEY UPDATE
  image_url        = VALUES(image_url),
  storage_asset_id = VALUES(storage_asset_id),
  is_featured      = VALUES(is_featured),
  display_order    = VALUES(display_order),
  is_published     = VALUES(is_published),
  updated_at       = VALUES(updated_at);

-- -------------------------------------------------------------
-- 2) Seeds: reference_images_i18n (DE)
-- -------------------------------------------------------------

INSERT INTO `reference_images_i18n`
(
  id, image_id, locale,
  title, alt,
  created_at, updated_at
)
VALUES
  ('7c7c5201-0001-4222-8222-520100000001', '9d9d5201-0001-4222-8222-520100000001', 'de',
   'Enerjisa – Bild 1', 'Enerjisa – Referenzbild',
   NOW(3), NOW(3)),
  ('7c7c5201-0002-4222-8222-520100000001', '9d9d5201-0002-4222-8222-520100000001', 'de',
   'Enerjisa – Bild 2', 'Enerjisa – Referenzbild',
   NOW(3), NOW(3)),
  ('7c7c5201-0003-4222-8222-520100000001', '9d9d5201-0003-4222-8222-520100000001', 'de',
   'Enerjisa – Bild 3', 'Enerjisa – Referenzbild',
   NOW(3), NOW(3))

  -- ... (senin mevcut VALUES bloğun eksiksiz aynı şekilde devam edecek)

ON DUPLICATE KEY UPDATE
  title      = VALUES(title),
  alt        = VALUES(alt),
  updated_at = VALUES(updated_at);

COMMIT;
