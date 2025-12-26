-- =============================================================
-- FILE: src/db/seed/sql/100_library_schema.sql
-- Ensotek - Library schema (base + i18n + images + files)
-- Drizzle uyumlu: src/modules/library/schema.ts
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- -------------------------------------------------------------
-- library (base)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS library (
  id             CHAR(36)    NOT NULL,

  is_published   TINYINT(1)  NOT NULL DEFAULT 0,
  is_active      TINYINT(1)  NOT NULL DEFAULT 1,
  display_order  INT         NOT NULL DEFAULT 0,

  tags_json      LONGTEXT    NULL,

  category_id     CHAR(36)   NULL,
  sub_category_id CHAR(36)   NULL,

  author         VARCHAR(255) NULL,

  views          INT         NOT NULL DEFAULT 0,
  download_count INT         NOT NULL DEFAULT 0,

  published_at   DATETIME(3) NULL,

  created_at     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),

  KEY library_created_idx (created_at),
  KEY library_updated_idx (updated_at),
  KEY library_published_idx (is_published),
  KEY library_active_idx (is_active),
  KEY library_display_order_idx (display_order),
  KEY library_category_idx (category_id),
  KEY library_sub_category_idx (sub_category_id),

  CONSTRAINT fk_library_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE,

  CONSTRAINT fk_library_sub_category
    FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -------------------------------------------------------------
-- library_i18n
-- - UNIQUE (library_id, locale)
-- - UNIQUE (locale, slug)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS library_i18n (
  id               CHAR(36)    NOT NULL,
  library_id       CHAR(36)    NOT NULL,
  locale           VARCHAR(10) NOT NULL,

  title            VARCHAR(255) NOT NULL,
  slug             VARCHAR(255) NOT NULL,

  summary          LONGTEXT     NULL,
  content          LONGTEXT     NOT NULL,

  meta_title       VARCHAR(255) NULL,
  meta_description VARCHAR(500) NULL,

  created_at       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),

  CONSTRAINT fk_library_i18n_library
    FOREIGN KEY (library_id) REFERENCES library(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  UNIQUE KEY ux_library_i18n_parent_locale (library_id, locale),
  UNIQUE KEY ux_library_i18n_locale_slug (locale, slug),

  KEY library_i18n_locale_idx (locale),
  KEY library_i18n_slug_idx (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -------------------------------------------------------------
-- library_images
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS library_images (
  id            CHAR(36)    NOT NULL,
  library_id    CHAR(36)    NOT NULL,
  asset_id      CHAR(36)    NOT NULL,

  image_url     VARCHAR(500) NULL,
  thumb_url     VARCHAR(500) NULL,
  webp_url      VARCHAR(500) NULL,

  display_order INT         NOT NULL DEFAULT 0,
  is_active     TINYINT(1)  NOT NULL DEFAULT 1,

  created_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),

  CONSTRAINT fk_library_images_library
    FOREIGN KEY (library_id) REFERENCES library(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  KEY library_images_library_idx (library_id),
  KEY library_images_asset_idx (asset_id),
  KEY library_images_order_idx (display_order),
  KEY library_images_active_idx (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -------------------------------------------------------------
-- library_images_i18n
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS library_images_i18n (
  id          CHAR(36)    NOT NULL,
  image_id    CHAR(36)    NOT NULL,
  locale      VARCHAR(10) NOT NULL,

  alt         VARCHAR(255)  NULL,
  caption     VARCHAR(1000) NULL,

  created_at  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),

  CONSTRAINT fk_library_images_i18n_image
    FOREIGN KEY (image_id) REFERENCES library_images(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  UNIQUE KEY ux_library_images_i18n_parent_locale (image_id, locale),
  KEY library_images_i18n_locale_idx (locale)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -------------------------------------------------------------
-- library_files
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS library_files (
  id            CHAR(36)     NOT NULL,
  library_id    CHAR(36)     NOT NULL,
  asset_id      CHAR(36)     NOT NULL,

  file_url      VARCHAR(500) NULL,
  name          VARCHAR(255) NOT NULL,

  size_bytes    INT          NULL,
  mime_type     VARCHAR(255) NULL,

  tags_json     LONGTEXT     NULL,

  display_order INT          NOT NULL DEFAULT 0,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,

  created_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),

  CONSTRAINT fk_library_files_library
    FOREIGN KEY (library_id) REFERENCES library(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  KEY library_files_library_idx (library_id),
  KEY library_files_asset_idx (asset_id),
  KEY library_files_order_idx (display_order),
  KEY library_files_active_idx (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -------------------------------------------------------------
-- library_files_i18n
-- NOT: Drizzle'da yok ama seed kullanıyor; seed bozulmasın diye DB'de tutuyoruz.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS library_files_i18n (
  id          CHAR(36)     NOT NULL,
  file_id     CHAR(36)     NOT NULL,
  locale      VARCHAR(10)  NOT NULL,

  title       VARCHAR(255) NULL,
  description VARCHAR(512) NULL,

  created_at  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),

  CONSTRAINT fk_library_files_i18n_file
    FOREIGN KEY (file_id) REFERENCES library_files(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  UNIQUE KEY uq_library_files_i18n_file_locale (file_id, locale),
  KEY idx_library_files_i18n_locale (locale)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
