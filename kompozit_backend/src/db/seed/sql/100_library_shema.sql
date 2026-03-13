-- =============================================================
-- 0100_library.sql  (schema)  ✅ DRIZZLE schema.ts + validation.ts UYUMLU
-- - library (parent)
-- - library_i18n
-- - library_images + library_images_i18n
-- - library_files (FK: storage_assets)  ✅
-- - library_files_i18n (Drizzle’da yok; seed bozulmasın diye DB’de tutulur) ✅
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------------
-- DROP (child -> parent)  (varsa)
-- -------------------------------------------------------------
DROP TABLE IF EXISTS `library_files_i18n`;
DROP TABLE IF EXISTS `library_files`;
DROP TABLE IF EXISTS `library_images_i18n`;
DROP TABLE IF EXISTS `library_images`;
DROP TABLE IF EXISTS `library_i18n`;
DROP TABLE IF EXISTS `library`;

-- =============================================================
-- TABLE: library (PARENT)
--  - schema.ts ile birebir
-- =============================================================
CREATE TABLE `library` (
  `id`              CHAR(36)     NOT NULL,

  `type`            VARCHAR(32)  NOT NULL DEFAULT 'other',

  `category_id`     CHAR(36)              DEFAULT NULL,
  `sub_category_id` CHAR(36)              DEFAULT NULL,

  `featured`        TINYINT(1)   NOT NULL DEFAULT 0,
  `is_published`    TINYINT(1)   NOT NULL DEFAULT 0,
  `is_active`       TINYINT(1)   NOT NULL DEFAULT 1,
  `display_order`   INT          NOT NULL DEFAULT 0,

  `featured_image`  VARCHAR(500)          DEFAULT NULL,
  `image_url`       VARCHAR(500)          DEFAULT NULL,
  `image_asset_id`  CHAR(36)              DEFAULT NULL,

  `views`           INT          NOT NULL DEFAULT 0,
  `download_count`  INT          NOT NULL DEFAULT 0,

  `published_at`    DATETIME(3)           DEFAULT NULL,

  `created_at`      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                                 ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),

  KEY `library_active_idx`          (`is_active`),
  KEY `library_published_idx`       (`is_published`),
  KEY `library_order_idx`           (`display_order`),
  KEY `library_type_idx`            (`type`),
  KEY `library_featured_idx`        (`featured`),

  KEY `library_category_id_idx`     (`category_id`),
  KEY `library_sub_category_id_idx` (`sub_category_id`),

  KEY `library_asset_idx`           (`image_asset_id`),

  KEY `library_created_idx`         (`created_at`),
  KEY `library_updated_idx`         (`updated_at`),
  KEY `library_published_at_idx`    (`published_at`),
  KEY `library_views_idx`           (`views`),
  KEY `library_download_idx`        (`download_count`),

  CONSTRAINT `fk_library_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,

  CONSTRAINT `fk_library_sub_category`
    FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,

  CONSTRAINT `fk_library_featured_asset`
    FOREIGN KEY (`image_asset_id`) REFERENCES `storage_assets`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- TABLE: library_i18n
--  - schema.ts ile birebir
--  - NOT: material/price/includes/warranty vb. YOK (drizzle+validation’da yok)
-- =============================================================
CREATE TABLE `library_i18n` (
  `id`               CHAR(36)     NOT NULL,
  `library_id`       CHAR(36)     NOT NULL,
  `locale`           VARCHAR(10)  NOT NULL,

  `slug`             VARCHAR(255) NOT NULL,
  `name`             VARCHAR(255) NOT NULL,
  `description`      TEXT                  DEFAULT NULL,
  `image_alt`        VARCHAR(255)          DEFAULT NULL,

  `tags`             VARCHAR(255)          DEFAULT NULL,
  `meta_title`       VARCHAR(255)          DEFAULT NULL,
  `meta_description` VARCHAR(500)          DEFAULT NULL,
  `meta_keywords`    VARCHAR(255)          DEFAULT NULL,

  `created_at`       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                                  ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),

  UNIQUE KEY `ux_library_i18n_unique` (`library_id`,`locale`),
  UNIQUE KEY `ux_library_locale_slug` (`locale`,`slug`),

  KEY `library_i18n_slug_idx`    (`slug`),
  KEY `library_i18n_name_idx`    (`name`),
  KEY `library_i18n_created_idx` (`created_at`),
  KEY `library_i18n_updated_idx` (`updated_at`),

  CONSTRAINT `fk_library_i18n_parent`
    FOREIGN KEY (`library_id`) REFERENCES `library`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- TABLE: library_images
-- =============================================================
CREATE TABLE `library_images` (
  `id`             CHAR(36)     NOT NULL,
  `library_id`     CHAR(36)     NOT NULL,

  `image_asset_id` CHAR(36)              DEFAULT NULL,
  `image_url`      VARCHAR(500)          DEFAULT NULL,

  `is_active`      TINYINT(1)   NOT NULL DEFAULT 1,
  `display_order`  INT          NOT NULL DEFAULT 0,

  `created_at`     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                                ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),

  KEY `library_images_library_idx` (`library_id`),
  KEY `library_images_active_idx`  (`is_active`),
  KEY `library_images_order_idx`   (`display_order`),
  KEY `library_images_asset_idx`   (`image_asset_id`),

  CONSTRAINT `fk_library_images_library`
    FOREIGN KEY (`library_id`) REFERENCES `library`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT `fk_library_images_asset`
    FOREIGN KEY (`image_asset_id`) REFERENCES `storage_assets`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- TABLE: library_images_i18n
-- =============================================================
CREATE TABLE `library_images_i18n` (
  `id`         CHAR(36)     NOT NULL,
  `image_id`   CHAR(36)     NOT NULL,
  `locale`     VARCHAR(10)  NOT NULL,

  `title`      VARCHAR(255)          DEFAULT NULL,
  `alt`        VARCHAR(255)          DEFAULT NULL,
  `caption`    VARCHAR(500)          DEFAULT NULL,

  `created_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                             ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),

  UNIQUE KEY `ux_library_images_i18n_unique` (`image_id`,`locale`),
  KEY `library_images_i18n_locale_idx` (`locale`),

  CONSTRAINT `fk_library_images_i18n_image`
    FOREIGN KEY (`image_id`) REFERENCES `library_images`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- TABLE: library_files
--  - schema.ts ile birebir
--  - FK: storage_assets(id) ✅ (Drizzle’da var)
-- =============================================================
CREATE TABLE `library_files` (
  `id`            CHAR(36)     NOT NULL,
  `library_id`    CHAR(36)     NOT NULL,

  `asset_id`      CHAR(36)              DEFAULT NULL,

  `file_url`      VARCHAR(500)          DEFAULT NULL,
  `name`          VARCHAR(255) NOT NULL,

  `size_bytes`    INT                   DEFAULT NULL,
  `mime_type`     VARCHAR(255)          DEFAULT NULL,

  `tags_json`     TEXT                  DEFAULT NULL,

  `display_order` INT          NOT NULL DEFAULT 0,
  `is_active`     TINYINT(1)   NOT NULL DEFAULT 1,

  `created_at`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                                ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),

  KEY `library_files_library_idx` (`library_id`),
  KEY `library_files_asset_idx`   (`asset_id`),
  KEY `library_files_order_idx`   (`display_order`),
  KEY `library_files_active_idx`  (`is_active`),

  CONSTRAINT `fk_library_files_library`
    FOREIGN KEY (`library_id`) REFERENCES `library`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT `fk_library_files_asset`
    FOREIGN KEY (`asset_id`) REFERENCES `storage_assets`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- TABLE: library_files_i18n
--  - Drizzle’da yok (bilerek). Seed bozulmasın diye DB’de tutulur.
-- =============================================================
CREATE TABLE IF NOT EXISTS `library_files_i18n` (
  `id`          CHAR(36)     NOT NULL,
  `file_id`     CHAR(36)     NOT NULL,
  `locale`      VARCHAR(10)  NOT NULL,

  `title`       VARCHAR(255)          DEFAULT NULL,
  `description` VARCHAR(512)          DEFAULT NULL,

  `created_at`  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                              ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),

  UNIQUE KEY `uq_library_files_i18n_file_locale` (`file_id`,`locale`),
  KEY `idx_library_files_i18n_locale` (`locale`),

  CONSTRAINT `fk_library_files_i18n_file`
    FOREIGN KEY (`file_id`) REFERENCES `library_files`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
