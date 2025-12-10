-- =============================================================
-- 100_library.sql  (schema + parent seeds)
-- =============================================================

/* ================= TABLE: library ================= */
CREATE TABLE IF NOT EXISTS `library` (
  id               CHAR(36)      NOT NULL,
  is_published     TINYINT(1)    NOT NULL DEFAULT 0,
  is_active        TINYINT(1)    NOT NULL DEFAULT 1,
  display_order    INT           NOT NULL DEFAULT 0,

  tags_json        LONGTEXT      DEFAULT NULL,

  category_id      CHAR(36)      DEFAULT NULL,
  sub_category_id  CHAR(36)      DEFAULT NULL,

  author           VARCHAR(255)  DEFAULT NULL,

  views            INT           NOT NULL DEFAULT 0,
  download_count   INT           NOT NULL DEFAULT 0,

  published_at     DATETIME(3)   DEFAULT NULL,

  created_at       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),

  KEY library_created_idx         (created_at),
  KEY library_updated_idx         (updated_at),
  KEY library_published_idx       (is_published),
  KEY library_active_idx          (is_active),
  KEY library_display_order_idx   (display_order),
  KEY library_published_at_idx    (published_at),
  KEY library_views_idx           (views),
  KEY library_download_idx        (download_count),

  KEY library_category_id_idx     (category_id),
  KEY library_sub_category_id_idx (sub_category_id),

  CONSTRAINT fk_library_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_library_sub_category
    FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


/* ================= TABLE: library_i18n ================= */
CREATE TABLE IF NOT EXISTS `library_i18n` (
  id               CHAR(36)     NOT NULL,
  library_id       CHAR(36)     NOT NULL,
  locale           VARCHAR(10)  NOT NULL,

  title            VARCHAR(255) NOT NULL,
  slug             VARCHAR(255) NOT NULL,

  summary          LONGTEXT     DEFAULT NULL,
  content          LONGTEXT     NOT NULL,

  meta_title       VARCHAR(255)  DEFAULT NULL,
  meta_description VARCHAR(500)  DEFAULT NULL,

  created_at       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),
  UNIQUE KEY ux_library_i18n_parent_locale (library_id, locale),
  UNIQUE KEY ux_library_i18n_locale_slug   (locale, slug),
  KEY library_i18n_locale_idx (locale),
  KEY library_i18n_slug_idx   (slug),

  CONSTRAINT fk_library_i18n_parent
    FOREIGN KEY (library_id) REFERENCES library(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


/* ================= SEED: Parent satırlar ================= */

-- Library ana kategori ve alt kategori ID'leri
-- category: module_key='library' (011_catalog_categories.sql)
-- sub_category: slug='pdf-dokumanlar' (012_catalog_subcategories.sql, TR)
SET @LIB_CATEGORY_ID := (
  SELECT c.id
  FROM categories c
  WHERE c.module_key = 'library'
  LIMIT 1
);

SET @LIB_SUBCATEGORY_PDF := (
  SELECT sc.id
  FROM sub_categories sc
  JOIN sub_category_i18n sci
    ON sci.sub_category_id = sc.id
   AND sci.locale = 'tr'
   AND sci.slug   = 'pdf-dokumanlar'
  WHERE sc.category_id = @LIB_CATEGORY_ID
  LIMIT 1
);

-- Kurumsal Tanıtım Broşürü
SET @LIB_BROCHURE_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'kurumsal-brosur'
  LIMIT 1
);
SET @LIB_BROCHURE_ID := COALESCE(@LIB_BROCHURE_ID, UUID());

INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json,
 category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(@LIB_BROCHURE_ID,
  1, 1, 10,
  -- Çok dilli tags: tr + en
  '{"tr":["broşür","pdf","ensotek","kurumsal"],"en":["brochure","pdf","ensotek","corporate"]}',
  @LIB_CATEGORY_ID, @LIB_SUBCATEGORY_PDF,
  'Ensotek', 0, 0,
  NOW(3), NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 is_published    = VALUES(is_published),
 is_active       = VALUES(is_active),
 display_order   = VALUES(display_order),
 tags_json       = VALUES(tags_json),
 category_id     = VALUES(category_id),
 sub_category_id = VALUES(sub_category_id),
 author          = VALUES(author),
 published_at    = VALUES(published_at),
 updated_at      = VALUES(updated_at);

-- Hizmet Rehberi
SET @LIB_GUIDE_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'hizmet-rehberi'
  LIMIT 1
);
SET @LIB_GUIDE_ID := COALESCE(@LIB_GUIDE_ID, UUID());

INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json,
 category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(@LIB_GUIDE_ID,
  1, 1, 20,
  -- Çok dilli tags: tr + en
  '{"tr":["rehber","pdf","hizmetler","ensotek"],"en":["guide","pdf","services","ensotek"]}',
  @LIB_CATEGORY_ID, @LIB_SUBCATEGORY_PDF,
  'Ensotek', 0, 0,
  NOW(3), NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 is_published    = VALUES(is_published),
 is_active       = VALUES(is_active),
 display_order   = VALUES(display_order),
 tags_json       = VALUES(tags_json),
 category_id     = VALUES(category_id),
 sub_category_id = VALUES(sub_category_id),
 author          = VALUES(author),
 published_at    = VALUES(published_at),
 updated_at      = VALUES(updated_at);
