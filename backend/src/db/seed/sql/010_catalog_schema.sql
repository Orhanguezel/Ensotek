-- =========================
-- 010_catalog_schema.sql
-- CATEGORIES (TOP LEVEL) - LOCALE + MODULE_KEY DESTEKLİ
-- =========================
CREATE TABLE IF NOT EXISTS categories (
  id               CHAR(36)      NOT NULL,

  -- 🌍 Dil kodu (tr, en, de ...)
  locale           VARCHAR(8)    NOT NULL DEFAULT 'tr',

  -- Modül / alan anahtarı (product, blog, news, general, vb.)
  module_key       VARCHAR(64)   NOT NULL DEFAULT 'general',

  name             VARCHAR(255)  NOT NULL,
  slug             VARCHAR(255)  NOT NULL,

  description      TEXT          DEFAULT NULL,

  -- Tekil storage pattern (şema ile birebir)
  image_url        LONGTEXT      DEFAULT NULL,
  storage_asset_id CHAR(36)      DEFAULT NULL,
  alt              VARCHAR(255)  DEFAULT NULL,

  icon             VARCHAR(255)  DEFAULT NULL,

  is_active        TINYINT(1)    NOT NULL DEFAULT 1,
  is_featured      TINYINT(1)    NOT NULL DEFAULT 0,
  display_order    INT(11)       NOT NULL DEFAULT 0,

  created_at       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),

  -- ✅ Aynı slug, farklı locale ve/veya farklı module_key ile tekrar kullanılabilir
  UNIQUE KEY categories_slug_locale_module_uq (slug, locale, module_key),

  KEY categories_active_idx         (is_active),
  KEY categories_order_idx          (display_order),
  KEY categories_storage_asset_idx  (storage_asset_id),
  KEY categories_locale_idx         (locale),
  KEY categories_module_idx         (module_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =========================
-- SUB CATEGORIES - LOCALE DESTEKLİ
-- =========================
CREATE TABLE IF NOT EXISTS sub_categories (
  id               CHAR(36)      NOT NULL,
  category_id      CHAR(36)      NOT NULL,

  -- 🌍 Çok dilli – kategoriye paralel locale alanı
  locale           VARCHAR(8)    NOT NULL DEFAULT 'tr',

  name             VARCHAR(255)  NOT NULL,
  slug             VARCHAR(255)  NOT NULL,

  description      TEXT          DEFAULT NULL,

  -- Tekil storage pattern (şema ile birebir)
  image_url        LONGTEXT      DEFAULT NULL,
  storage_asset_id CHAR(36)      DEFAULT NULL,
  alt              VARCHAR(255)  DEFAULT NULL,

  icon             VARCHAR(100)  DEFAULT NULL,

  is_active        TINYINT(1)    NOT NULL DEFAULT 1,
  is_featured      TINYINT(1)    NOT NULL DEFAULT 0,
  display_order    INT(11)       NOT NULL DEFAULT 0,

  created_at       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),

  -- ✅ Aynı kategori + locale + slug kombinasyonu tekil
  UNIQUE KEY sub_categories_cat_locale_slug_uq (category_id, locale, slug),

  KEY sub_categories_category_id_idx     (category_id),
  KEY sub_categories_locale_idx          (locale),
  KEY sub_categories_active_idx          (is_active),
  KEY sub_categories_order_idx           (display_order),
  KEY sub_categories_storage_asset_idx   (storage_asset_id),

  CONSTRAINT fk_sub_categories_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
