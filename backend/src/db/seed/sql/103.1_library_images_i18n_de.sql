-- =============================================================
-- 103_1_library_images_i18n_de.sql  (gallery: library_images_i18n) - DE
-- =============================================================

/* image_id'leri al */
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

/* ================= SEED: DE ================= */

INSERT INTO library_images_i18n
(id, image_id, locale, alt, caption, created_at, updated_at)
SELECT
  UUID(), @LIBIMG_BROCHURE_COVER_ID, 'de',
  'Titelbild der Unternehmensbroschüre',
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
  UUID(), @LIBIMG_GUIDE_COVER_ID, 'de',
  'Titelbild des Service-Leitfadens',
  NULL,
  NOW(3), NOW(3)
WHERE @LIBIMG_GUIDE_COVER_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  alt        = VALUES(alt),
  caption    = VALUES(caption),
  updated_at = VALUES(updated_at);

/* Eksik DE kayıtları için TR’den kopya */
INSERT INTO library_images_i18n
(id, image_id, locale, alt, caption, created_at, updated_at)
SELECT
  UUID(), s.image_id, 'de',
  s.alt, s.caption,
  NOW(3), NOW(3)
FROM library_images_i18n s
WHERE s.locale = 'tr'
  AND NOT EXISTS (
    SELECT 1
    FROM library_images_i18n t
    WHERE t.image_id = s.image_id
      AND t.locale   = 'de'
  );
