-- =============================================================
-- FILE: 010_catalog_schema.sql  (FINAL)
-- Ensotek – Catalog Schema (categories + category_i18n)
-- - Creates tables required by catalog seeds
-- - Future locale: add rows to category_i18n
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- -------------------------------------------------------------
-- 1) categories (BASE)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id`              CHAR(36)     NOT NULL,
  `module_key`      VARCHAR(64)  NOT NULL,

  `image_url`        TEXT         NULL,
  `storage_asset_id` CHAR(36)     NULL,
  `alt`              VARCHAR(255) NULL,
  `icon`             VARCHAR(64)  NULL,

  `is_active`       TINYINT(1)   NOT NULL DEFAULT 1,
  `is_featured`     TINYINT(1)   NOT NULL DEFAULT 0,
  `display_order`   INT          NOT NULL DEFAULT 0,

  `created_at`      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  KEY `idx_categories_module_key` (`module_key`),
  KEY `idx_categories_active` (`is_active`),
  KEY `idx_categories_featured` (`is_featured`),
  KEY `idx_categories_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 2) category_i18n (I18N)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `category_i18n` (
  `id`          CHAR(36)     NOT NULL,
  `category_id` CHAR(36)     NOT NULL,
  `locale`      VARCHAR(10)  NOT NULL,   -- tr | en | de | ...
  `name`        VARCHAR(255) NOT NULL,
  `slug`        VARCHAR(255) NOT NULL,
  `description` TEXT         NULL,
  `alt`         VARCHAR(255) NULL,

  `created_at`  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_category_i18n_category_locale` (`category_id`, `locale`),
  UNIQUE KEY `uq_category_i18n_locale_slug` (`locale`, `slug`),
  KEY `idx_category_i18n_locale` (`locale`),
  KEY `idx_category_i18n_name` (`name`),

  CONSTRAINT `fk_category_i18n_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
