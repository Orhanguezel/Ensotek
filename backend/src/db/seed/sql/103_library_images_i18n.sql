-- =============================================================
-- 103_library_images_i18n.sql  (gallery: library_images_i18n)
-- =============================================================

CREATE TABLE IF NOT EXISTS `library_images_i18n` (
  id         CHAR(36)     NOT NULL,
  image_id   CHAR(36)     NOT NULL,
  locale     VARCHAR(10)  NOT NULL,
  alt        VARCHAR(255)   DEFAULT NULL,
  caption    VARCHAR(1000)  DEFAULT NULL,

  created_at DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),
  UNIQUE KEY ux_library_images_i18n_parent_locale (image_id, locale),
  KEY library_images_i18n_locale_idx (locale),

  CONSTRAINT fk_library_images_i18n_parent
    FOREIGN KEY (image_id) REFERENCES library_images(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


SET @LIBIMG_BROCHURE_COVER_ID := (
  SELECT li.id
  FROM library_images li
  WHERE li.library_id = @LIB_BROCHURE_ID
  ORDER BY li.display_order ASC, li.created_at ASC, li.id ASC
  LIMIT 1
);

SET @LIBIMG_GUIDE_COVER_ID := (
  SELECT li.id
  FROM library_images li
  WHERE li.library_id = @LIB_GUIDE_ID
  ORDER BY li.display_order ASC, li.created_at ASC, li.id ASC
  LIMIT 1
);


-- TR
INSERT INTO library_images_i18n
(id, image_id, locale, alt, caption, created_at, updated_at)
SELECT
  UUID(), @LIBIMG_BROCHURE_COVER_ID, 'tr',
  'Kurumsal broşür kapak görseli',
  NULL,
  NOW(3), NOW(3)
WHERE @LIBIMG_BROCHURE_COVER_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  alt        = VALUES(alt),
  caption    = VALUES(caption),
  updated_at = VALUES(updated_at);

INSERT INTO library_images_i18n
(id, image_id, locale, alt, caption, created_at, updated_at)
SELECT
  UUID(), @LIBIMG_GUIDE_COVER_ID, 'tr',
  'Hizmet rehberi kapak görseli',
  NULL,
  NOW(3), NOW(3)
WHERE @LIBIMG_GUIDE_COVER_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  alt        = VALUES(alt),
  caption    = VALUES(caption),
  updated_at = VALUES(updated_at);


-- EN
INSERT INTO library_images_i18n
(id, image_id, locale, alt, caption, created_at, updated_at)
SELECT
  UUID(), @LIBIMG_BROCHURE_COVER_ID, 'en',
  'Company brochure cover image',
  NULL,
  NOW(3), NOW(3)
WHERE @LIBIMG_BROCHURE_COVER_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  alt        = VALUES(alt),
  caption    = VALUES(caption),
  updated_at = VALUES(updated_at);

INSERT INTO library_images_i18n
(id, image_id, locale, alt, caption, created_at, updated_at)
SELECT
  UUID(), @LIBIMG_GUIDE_COVER_ID, 'en',
  'Service guide cover image',
  NULL,
  NOW(3), NOW(3)
WHERE @LIBIMG_GUIDE_COVER_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  alt        = VALUES(alt),
  caption    = VALUES(caption),
  updated_at = VALUES(updated_at);


-- Eksik EN kayıtları için TR’den kopya
INSERT INTO library_images_i18n
(id, image_id, locale, alt, caption, created_at, updated_at)
SELECT
  UUID(), s.image_id, 'en',
  s.alt, s.caption,
  NOW(3), NOW(3)
FROM library_images_i18n s
WHERE s.locale = 'tr'
  AND NOT EXISTS (
    SELECT 1
    FROM library_images_i18n t
    WHERE t.image_id = s.image_id
      AND t.locale   = 'en'
  );
