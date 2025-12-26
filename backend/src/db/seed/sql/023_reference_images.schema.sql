-- =============================================================
-- 023_reference_images.schema.sql  (schema) [IDEMPOTENT] (FIXED)
-- Creates:
--   - reference_images
--   - reference_images_i18n
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

CREATE TABLE IF NOT EXISTS `reference_images` (
  `id`               CHAR(36)      NOT NULL,
  `reference_id`     CHAR(36)      NOT NULL,

  `image_url`        VARCHAR(1024) NOT NULL,
  `storage_asset_id` CHAR(36)      DEFAULT NULL,

  `is_featured`      TINYINT(1)    NOT NULL DEFAULT 0,
  `display_order`    INT           NOT NULL DEFAULT 0,
  `is_published`     TINYINT(1)    NOT NULL DEFAULT 1,

  `created_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                     ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),

  -- ✅ Idempotent seed için gerekli
  UNIQUE KEY `ux_ref_images_ref_order` (`reference_id`, `display_order`),

  KEY `ref_images_reference_idx` (`reference_id`),
  KEY `ref_images_published_idx` (`is_published`),
  KEY `ref_images_featured_idx`  (`is_featured`),
  KEY `ref_images_order_idx`     (`display_order`),
  KEY `ref_images_asset_idx`     (`storage_asset_id`),

  CONSTRAINT `fk_reference_images_reference`
    FOREIGN KEY (`reference_id`) REFERENCES `references`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `reference_images_i18n` (
  `id`                  CHAR(36)     NOT NULL,
  `reference_image_id`  CHAR(36)     NOT NULL,
  `locale`              VARCHAR(10)  NOT NULL,

  `title`               VARCHAR(255) DEFAULT NULL,
  `alt`                 VARCHAR(255) DEFAULT NULL,

  `created_at`          DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`          DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                        ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),

  UNIQUE KEY `ux_ref_image_i18n_parent_locale` (`reference_image_id`, `locale`),
  KEY `ref_image_i18n_locale_idx` (`locale`),

  CONSTRAINT `fk_reference_images_i18n_parent`
    FOREIGN KEY (`reference_image_id`) REFERENCES `reference_images`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
