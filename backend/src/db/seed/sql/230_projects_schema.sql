-- ============================================================
-- 230_projects_schema.sql
-- Ensotek endüstriyel proje modülü
-- ============================================================

CREATE TABLE IF NOT EXISTS `projects` (
  `id`                       CHAR(36)      NOT NULL,
  `is_published`             TINYINT       NOT NULL DEFAULT 0,
  `is_featured`              TINYINT       NOT NULL DEFAULT 0,
  `display_order`            INT           NOT NULL DEFAULT 0,

  -- görsel
  `featured_image`           VARCHAR(500)  NULL,
  `featured_image_asset_id`  CHAR(36)      NULL,

  -- Ensotek endüstriyel alanlar
  `category`                 VARCHAR(100)  NULL,   -- "Su Soğutma Kulesi", "HVAC", "Proses Soğutma"
  `product_type`             VARCHAR(150)  NULL,   -- "CTP Kaportalı Açık Tip", "Kapalı Tip"
  `location`                 VARCHAR(255)  NULL,   -- "İstanbul", "Kahramanmaraş"
  `client_name`              VARCHAR(255)  NULL,
  `unit_count`               INT           NULL,   -- kaç adet kule
  `fan_count`                INT           NULL,   -- kaç fanlı
  `start_date`               DATE          NULL,
  `complete_date`            DATE          NULL,
  `completion_time_label`    VARCHAR(100)  NULL,
  `services`                 LONGTEXT      NULL,   -- JSON string[]
  `website_url`              VARCHAR(500)  NULL,   -- müşteri web sitesi
  `youtube_url`              VARCHAR(500)  NULL,   -- YouTube tanıtım/montaj videosu
  `techs`                    LONGTEXT      NULL,   -- JSON string[] (FRP, GRP, CTP, HVAC…)

  `created_at`               DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`               DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  INDEX `projects_created_idx`       (`created_at`),
  INDEX `projects_updated_idx`       (`updated_at`),
  INDEX `projects_published_idx`     (`is_published`),
  INDEX `projects_featured_idx`      (`is_featured`),
  INDEX `projects_display_order_idx` (`display_order`),
  INDEX `projects_featured_asset_idx`(`featured_image_asset_id`),
  INDEX `projects_category_idx`      (`category`),
  INDEX `projects_client_idx`        (`client_name`),
  INDEX `projects_location_idx`      (`location`),
  INDEX `projects_product_type_idx`  (`product_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `projects_i18n` (
  `id`                   CHAR(36)     NOT NULL,
  `project_id`           CHAR(36)     NOT NULL,
  `locale`               VARCHAR(8)   NOT NULL,

  `title`                VARCHAR(255) NOT NULL,
  `slug`                 VARCHAR(255) NOT NULL,
  `summary`              LONGTEXT     NULL,
  `content`              LONGTEXT     NOT NULL,
  `featured_image_alt`   VARCHAR(255) NULL,
  `meta_title`           VARCHAR(255) NULL,
  `meta_description`     VARCHAR(500) NULL,

  `created_at`           DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`           DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE KEY `projects_i18n_project_locale_uq` (`project_id`, `locale`),
  UNIQUE KEY `projects_i18n_locale_slug_uq`    (`locale`, `slug`),
  INDEX `projects_i18n_project_idx` (`project_id`),
  INDEX `projects_i18n_locale_idx`  (`locale`),
  INDEX `projects_i18n_slug_idx`    (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `project_images` (
  `id`            CHAR(36)     NOT NULL,
  `project_id`    CHAR(36)     NOT NULL,
  `asset_id`      CHAR(36)     NOT NULL,
  `image_url`     VARCHAR(500) NULL,
  `display_order` INT          NOT NULL DEFAULT 0,
  `is_active`     TINYINT      NOT NULL DEFAULT 1,
  `created_at`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  INDEX `project_images_project_idx` (`project_id`),
  INDEX `project_images_asset_idx`   (`asset_id`),
  INDEX `project_images_active_idx`  (`is_active`),
  INDEX `project_images_order_idx`   (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `project_images_i18n` (
  `id`         CHAR(36)     NOT NULL,
  `image_id`   CHAR(36)     NOT NULL,
  `locale`     VARCHAR(8)   NOT NULL,
  `alt`        VARCHAR(255) NULL,
  `caption`    LONGTEXT     NULL,
  `created_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE KEY `project_images_i18n_image_locale_uq` (`image_id`, `locale`),
  INDEX `project_images_i18n_image_idx`  (`image_id`),
  INDEX `project_images_i18n_locale_idx` (`locale`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
