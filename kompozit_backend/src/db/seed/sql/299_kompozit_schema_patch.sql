-- =============================================================
-- FILE: 299_kompozit_schema_patch.sql
-- MOE Kompozit — Resmi schema patch
-- - products.item_type => kompozit
-- - gallery tablolari
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

ALTER TABLE `products`
  MODIFY COLUMN `item_type` ENUM('product','sparepart','kompozit') NOT NULL DEFAULT 'product';

CREATE TABLE IF NOT EXISTS `galleries` (
  `id` char(36) NOT NULL,
  `module_key` varchar(64) NOT NULL DEFAULT 'general',
  `source_id` char(36) DEFAULT NULL,
  `source_type` varchar(32) DEFAULT 'standalone',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `galleries_module_idx` (`module_key`),
  KEY `galleries_source_idx` (`source_type`,`source_id`),
  KEY `galleries_active_idx` (`is_active`),
  KEY `galleries_order_idx` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `gallery_i18n` (
  `gallery_id` char(36) NOT NULL,
  `locale` varchar(8) NOT NULL DEFAULT 'tr',
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` varchar(500) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`gallery_id`,`locale`),
  UNIQUE KEY `gallery_i18n_locale_slug_uq` (`locale`,`slug`),
  KEY `gallery_i18n_locale_idx` (`locale`),
  CONSTRAINT `fk_gallery_i18n_gallery` FOREIGN KEY (`gallery_id`) REFERENCES `galleries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `gallery_images` (
  `id` char(36) NOT NULL,
  `gallery_id` char(36) NOT NULL,
  `storage_asset_id` char(36) DEFAULT NULL,
  `image_url` longtext DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_cover` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `gallery_images_gallery_idx` (`gallery_id`),
  KEY `gallery_images_order_idx` (`gallery_id`,`display_order`),
  KEY `gallery_images_asset_idx` (`storage_asset_id`),
  CONSTRAINT `fk_gallery_images_gallery` FOREIGN KEY (`gallery_id`) REFERENCES `galleries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_gallery_images_asset` FOREIGN KEY (`storage_asset_id`) REFERENCES `storage_assets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `gallery_image_i18n` (
  `image_id` char(36) NOT NULL,
  `locale` varchar(8) NOT NULL DEFAULT 'tr',
  `alt` varchar(255) DEFAULT NULL,
  `caption` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`image_id`,`locale`),
  CONSTRAINT `fk_gallery_image_i18n_image` FOREIGN KEY (`image_id`) REFERENCES `gallery_images` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
