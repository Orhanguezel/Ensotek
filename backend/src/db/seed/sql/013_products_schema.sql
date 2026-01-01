-- =============================================================
-- 013_products_schema.sql (FINAL / SCHEMA+VALIDATION ALIGNED)
-- Products + Product_i18n + Specs + FAQs + Reviews + Options + Stock + Images Pool
-- - products.item_type: product|sparepart
-- - storage_asset_id: VARCHAR(64) (validation: assetId max(64), NOT uuid-only)
-- - adds: product_images table (pool)
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- PRODUCTS (BASE – DİL BAĞIMSIZ)
-- =========================
CREATE TABLE IF NOT EXISTS products (
  id                 CHAR(36)      NOT NULL,

  -- 🔑 Ürün tipi (product | sparepart)
  item_type          ENUM('product','sparepart') NOT NULL DEFAULT 'product',

  category_id        CHAR(36)      NOT NULL,
  sub_category_id    CHAR(36)      DEFAULT NULL,

  price              DECIMAL(10,2) NOT NULL,

  -- ✅ Görseller (tekil kapak + çoklu galeri)
  image_url          LONGTEXT      DEFAULT NULL,

  -- ❗ validation.assetId uuid değil -> VARCHAR(64) olmalı
  storage_asset_id   VARCHAR(64)   DEFAULT NULL,

  images             JSON          DEFAULT (JSON_ARRAY()),
  storage_image_ids  JSON          DEFAULT (JSON_ARRAY()),

  is_active          TINYINT(1)    NOT NULL DEFAULT 1,
  is_featured        TINYINT(1)    NOT NULL DEFAULT 0,

  -- 🔢 Drag & drop sıralama için
  order_num          INT(11)       NOT NULL DEFAULT 0,

  product_code       VARCHAR(64)   DEFAULT NULL,
  stock_quantity     INT(11)       NOT NULL DEFAULT 0,
  rating             DECIMAL(3,2)  NOT NULL DEFAULT 5.00,
  review_count       INT(11)       NOT NULL DEFAULT 0,

  created_at         DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at         DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                     ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),

  UNIQUE KEY products_code_uq        (product_code),

  KEY products_item_type_idx         (item_type),
  KEY products_category_id_idx       (category_id),
  KEY products_sub_category_id_idx   (sub_category_id),
  KEY products_active_idx            (is_active),
  KEY products_asset_idx             (storage_asset_id),
  KEY products_order_idx             (order_num),

  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT fk_products_subcategory
    FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- =========================
-- PRODUCT I18N
-- =========================
CREATE TABLE IF NOT EXISTS product_i18n (
  product_id       CHAR(36)     NOT NULL,
  locale           VARCHAR(8)   NOT NULL DEFAULT 'de',

  title            VARCHAR(255) NOT NULL,
  slug             VARCHAR(255) NOT NULL,

  description      TEXT         DEFAULT NULL,
  alt              VARCHAR(255) DEFAULT NULL,

  tags             JSON         DEFAULT (JSON_ARRAY()),
  specifications   JSON         DEFAULT NULL,

  meta_title       VARCHAR(255)  DEFAULT NULL,
  meta_description VARCHAR(500)  DEFAULT NULL,

  created_at       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                     ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (product_id, locale),
  UNIQUE KEY product_i18n_locale_slug_uq (locale, slug),
  KEY product_i18n_locale_idx (locale),

  CONSTRAINT fk_product_i18n_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- =========================
-- PRODUCT SPECS
-- =========================
CREATE TABLE IF NOT EXISTS product_specs (
  id          CHAR(36)     NOT NULL,
  product_id  CHAR(36)     NOT NULL,
  locale      VARCHAR(8)   NOT NULL DEFAULT 'de',

  name        VARCHAR(255) NOT NULL,
  value       TEXT         NOT NULL,
  category    ENUM('physical','material','service','custom') NOT NULL DEFAULT 'custom',
  order_num   INT(11)      NOT NULL DEFAULT 0,

  created_at  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
               ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),

  KEY product_specs_product_id_idx        (product_id),
  KEY product_specs_product_locale_idx    (product_id, locale),
  KEY product_specs_locale_idx            (locale),

  CONSTRAINT fk_product_specs_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- =========================
-- PRODUCT FAQS
-- =========================
CREATE TABLE IF NOT EXISTS product_faqs (
  id            CHAR(36)     NOT NULL,
  product_id    CHAR(36)     NOT NULL,
  locale        VARCHAR(8)   NOT NULL DEFAULT 'de',

  question      VARCHAR(500) NOT NULL,
  answer        TEXT         NOT NULL,
  display_order INT(11)      NOT NULL DEFAULT 0,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,

  created_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                 ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),

  KEY product_faqs_product_id_idx     (product_id),
  KEY product_faqs_order_idx          (display_order),
  KEY product_faqs_product_locale_idx (product_id, locale),
  KEY product_faqs_locale_idx         (locale),

  CONSTRAINT fk_product_faqs_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- =========================
-- PRODUCT REVIEWS
-- =========================
CREATE TABLE IF NOT EXISTS product_reviews (
  id            CHAR(36)     NOT NULL,
  product_id    CHAR(36)     NOT NULL,

  user_id       CHAR(36)     DEFAULT NULL,
  rating        INT(11)      NOT NULL,
  comment       TEXT         DEFAULT NULL,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  customer_name VARCHAR(255) DEFAULT NULL,

  review_date   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  created_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                 ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),

  KEY product_reviews_product_id_idx     (product_id),
  KEY product_reviews_approved_idx       (product_id, is_active),
  KEY product_reviews_rating_idx         (rating),

  CONSTRAINT fk_product_reviews_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- =========================
-- PRODUCT OPTIONS
-- =========================
CREATE TABLE IF NOT EXISTS product_options (
  id            CHAR(36)     NOT NULL,
  product_id    CHAR(36)     NOT NULL,
  option_name   VARCHAR(100) NOT NULL,
  option_values JSON         NOT NULL,

  created_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                 ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),
  KEY product_options_product_id_idx (product_id),

  CONSTRAINT fk_product_options_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- =========================
-- PRODUCT STOCK
-- =========================
CREATE TABLE IF NOT EXISTS product_stock (
  id             CHAR(36)     NOT NULL,
  product_id     CHAR(36)     NOT NULL,
  stock_content  VARCHAR(255) NOT NULL,
  is_used        TINYINT(1)   NOT NULL DEFAULT 0,
  used_at        DATETIME(3)  DEFAULT NULL,
  order_item_id  CHAR(36)     DEFAULT NULL,

  created_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),

  KEY product_stock_product_id_idx      (product_id),
  KEY product_stock_is_used_idx         (product_id, is_used),
  KEY product_stock_order_item_id_idx   (order_item_id),

  CONSTRAINT fk_product_stock_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- =========================
-- PRODUCT IMAGES (POOL)  ✅ NEW
-- =========================
CREATE TABLE IF NOT EXISTS product_images (
  id            CHAR(36)     NOT NULL,

  product_id    CHAR(36)     NOT NULL,
  locale        VARCHAR(8)   NOT NULL DEFAULT 'de',

  image_url     LONGTEXT     NOT NULL,

  -- ❗ asset id uuid değil -> VARCHAR(64)
  image_asset_id VARCHAR(64) DEFAULT NULL,

  title         VARCHAR(255) DEFAULT NULL,
  alt           VARCHAR(255) DEFAULT NULL,
  caption       TEXT         DEFAULT NULL,

  display_order INT(11)      NOT NULL DEFAULT 0,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,

  created_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                 ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),

  KEY product_images_product_id_idx       (product_id),
  KEY product_images_product_locale_idx   (product_id, locale),
  KEY product_images_order_idx            (product_id, display_order),

  CONSTRAINT fk_product_images_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
