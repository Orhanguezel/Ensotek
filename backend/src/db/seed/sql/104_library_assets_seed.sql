-- =============================================================
-- FILE: src/db/seed/sql/104_library_assets_seed.sql
-- Ensotek - Library Assets seed (Images + Files) - TR/EN/DE i18n
--  - SINGLE SOURCE OF TRUTH
--  - Uses storage_assets FK via asset_id
--  - Idempotent: find existing row (by library_id + order) else UUID
--  - Requires:
--      1) Library items inserted
--      2) Asset variables set from storage seed:
--           @ASSET_LIB_BROCHURE_COVER_ID, @ASSET_LIB_GUIDE_COVER_ID,
--           @ASSET_LIB_BROCHURE_PDF_ID,   @ASSET_LIB_GUIDE_PDF_ID
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- -------------------------------------------------------------
-- 0) Resolve library IDs by TR slug (must exist)
-- -------------------------------------------------------------

SET @LIB_CT_BASICS_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id
  WHERE i.locale = 'de'
    AND i.slug = 'su-sogutma-kulesi-nedir-cesitleri-nelerdir-nasil-calisir'
  LIMIT 1
);

SET @LIB_CT_FEATURES_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id
  WHERE i.locale = 'de'
    AND i.slug = 'ensotek-sogutma-kulelerinin-ozellikleri'
  LIMIT 1
);

SET @LIB_CT_OPEN_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id
  WHERE i.locale = 'de'
    AND i.slug = 'acik-tip-su-sogutma-kulesi-calisma-prensibi'
  LIMIT 1
);

SET @LIB_CT_CLOSED_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id
  WHERE i.locale = 'de'
    AND i.slug = 'kapali-cevrim-su-sogutma-kulesi-calisma-prensibi'
  LIMIT 1
);

SET @LIB_CT_SELECTION_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id
  WHERE i.locale = 'de'
    AND i.slug = 'kule-secimi-icin-gerekli-bilgiler'
  LIMIT 1
);

-- -------------------------------------------------------------
-- 1) IMAGES (library_images + i18n)
-- -------------------------------------------------------------

-- 1.1 Brochure Cover Image (FEATURES, order=1)

SET @LIBIMG_BROCHURE_COVER_ID := (
  SELECT li.id
  FROM library_images li
  WHERE li.library_id = @LIB_CT_FEATURES_ID
    AND li.display_order = 1
  LIMIT 1
);
SET @LIBIMG_BROCHURE_COVER_ID := COALESCE(@LIBIMG_BROCHURE_COVER_ID, UUID());

INSERT INTO library_images
(id, library_id, asset_id, image_url, thumb_url, webp_url,
 display_order, is_active, created_at, updated_at)
SELECT
  @LIBIMG_BROCHURE_COVER_ID,
  @LIB_CT_FEATURES_ID,
  @ASSET_LIB_BROCHURE_COVER_ID,
  NULL, NULL, NULL,
  1, 1,
  NOW(3), NOW(3)
FROM DUAL
WHERE @LIB_CT_FEATURES_ID IS NOT NULL
  AND @ASSET_LIB_BROCHURE_COVER_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  asset_id      = VALUES(asset_id),
  image_url     = VALUES(image_url),
  thumb_url     = VALUES(thumb_url),
  webp_url      = VALUES(webp_url),
  display_order = VALUES(display_order),
  is_active     = VALUES(is_active),
  updated_at    = VALUES(updated_at);

-- FK-safe: i18n only if parent exists (TR)
INSERT INTO library_images_i18n
(id, image_id, locale, alt, caption, created_at, updated_at)
SELECT
  UUID(), li.id, 'de',
  'Kurumsal broşür kapak görseli',
  NULL,
  NOW(3), NOW(3)
FROM library_images li
WHERE li.id = @LIBIMG_BROCHURE_COVER_ID
ON DUPLICATE KEY UPDATE
  alt        = VALUES(alt),
  caption    = VALUES(caption),
  updated_at = VALUES(updated_at);

-- FK-safe: i18n only if parent exists (EN)
INSERT INTO library_images_i18n
(id, image_id, locale, alt, caption, created_at, updated_at)
SELECT
  UUID(), li.id, 'en',
  'Company brochure cover image',
  NULL,
  NOW(3), NOW(3)
FROM library_images li
WHERE li.id = @LIBIMG_BROCHURE_COVER_ID
ON DUPLICATE KEY UPDATE
  alt        = VALUES(alt),
  caption    = VALUES(caption),
  updated_at = VALUES(updated_at);

-- FK-safe: i18n only if parent exists (DE)
INSERT INTO library_images_i18n
(id, image_id, locale, alt, caption, created_at, updated_at)
SELECT
  UUID(), li.id, 'de',
  'Titelbild der Unternehmensbroschüre',
  NULL,
  NOW(3), NOW(3)
FROM library_images li
WHERE li.id = @LIBIMG_BROCHURE_COVER_ID
ON DUPLICATE KEY UPDATE
  alt        = VALUES(alt),
  caption    = VALUES(caption),
  updated_at = VALUES(updated_at);


-- 1.2 Service Guide Cover Image (SELECTION, order=1)

SET @LIBIMG_GUIDE_COVER_ID := (
  SELECT li.id
  FROM library_images li
  WHERE li.library_id = @LIB_CT_SELECTION_ID
    AND li.display_order = 1
  LIMIT 1
);
SET @LIBIMG_GUIDE_COVER_ID := COALESCE(@LIBIMG_GUIDE_COVER_ID, UUID());

INSERT INTO library_images
(id, library_id, asset_id, image_url, thumb_url, webp_url,
 display_order, is_active, created_at, updated_at)
SELECT
  @LIBIMG_GUIDE_COVER_ID,
  @LIB_CT_SELECTION_ID,
  @ASSET_LIB_GUIDE_COVER_ID,
  NULL, NULL, NULL,
  1, 1,
  NOW(3), NOW(3)
FROM DUAL
WHERE @LIB_CT_SELECTION_ID IS NOT NULL
  AND @ASSET_LIB_GUIDE_COVER_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  asset_id      = VALUES(asset_id),
  image_url     = VALUES(image_url),
  thumb_url     = VALUES(thumb_url),
  webp_url      = VALUES(webp_url),
  display_order = VALUES(display_order),
  is_active     = VALUES(is_active),
  updated_at    = VALUES(updated_at);

-- FK-safe i18n (TR)
INSERT INTO library_images_i18n
(id, image_id, locale, alt, caption, created_at, updated_at)
SELECT
  UUID(), li.id, 'de',
  'Hizmet rehberi kapak görseli',
  NULL,
  NOW(3), NOW(3)
FROM library_images li
WHERE li.id = @LIBIMG_GUIDE_COVER_ID
ON DUPLICATE KEY UPDATE
  alt        = VALUES(alt),
  caption    = VALUES(caption),
  updated_at = VALUES(updated_at);

-- FK-safe i18n (EN)
INSERT INTO library_images_i18n
(id, image_id, locale, alt, caption, created_at, updated_at)
SELECT
  UUID(), li.id, 'en',
  'Service guide cover image',
  NULL,
  NOW(3), NOW(3)
FROM library_images li
WHERE li.id = @LIBIMG_GUIDE_COVER_ID
ON DUPLICATE KEY UPDATE
  alt        = VALUES(alt),
  caption    = VALUES(caption),
  updated_at = VALUES(updated_at);

-- FK-safe i18n (DE)
INSERT INTO library_images_i18n
(id, image_id, locale, alt, caption, created_at, updated_at)
SELECT
  UUID(), li.id, 'de',
  'Titelbild des Service-Leitfadens',
  NULL,
  NOW(3), NOW(3)
FROM library_images li
WHERE li.id = @LIBIMG_GUIDE_COVER_ID
ON DUPLICATE KEY UPDATE
  alt        = VALUES(alt),
  caption    = VALUES(caption),
  updated_at = VALUES(updated_at);


-- -------------------------------------------------------------
-- 2) FILES (library_files)
-- -------------------------------------------------------------

-- 2.1 Brochure PDF (FEATURES, order=1)

SET @LIBFILE_BROCHURE_ID := (
  SELECT lf.id
  FROM library_files lf
  WHERE lf.library_id = @LIB_CT_FEATURES_ID
    AND lf.display_order = 1
  LIMIT 1
);
SET @LIBFILE_BROCHURE_ID := COALESCE(@LIBFILE_BROCHURE_ID, UUID());

INSERT INTO library_files
(id, library_id, asset_id, file_url, name,
 size_bytes, mime_type, tags_json, display_order, is_active,
 created_at, updated_at)
SELECT
  @LIBFILE_BROCHURE_ID,
  @LIB_CT_FEATURES_ID,
  @ASSET_LIB_BROCHURE_PDF_ID,
  NULL,
  'Ensotek Corporate Brochure (PDF)',
  NULL,
  'application/pdf',
  '["brochure","pdf","ensotek","corporate"]',
  1, 1,
  NOW(3), NOW(3)
FROM DUAL
WHERE @LIB_CT_FEATURES_ID IS NOT NULL
  AND @ASSET_LIB_BROCHURE_PDF_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  asset_id      = VALUES(asset_id),
  file_url      = VALUES(file_url),
  name          = VALUES(name),
  size_bytes    = VALUES(size_bytes),
  mime_type     = VALUES(mime_type),
  tags_json     = VALUES(tags_json),
  display_order = VALUES(display_order),
  is_active     = VALUES(is_active),
  updated_at    = VALUES(updated_at);

-- 2.2 Service Guide PDF (SELECTION, order=2)

SET @LIBFILE_GUIDE_ID := (
  SELECT lf.id
  FROM library_files lf
  WHERE lf.library_id = @LIB_CT_SELECTION_ID
    AND lf.display_order = 2
  LIMIT 1
);
SET @LIBFILE_GUIDE_ID := COALESCE(@LIBFILE_GUIDE_ID, UUID());

INSERT INTO library_files
(id, library_id, asset_id, file_url, name,
 size_bytes, mime_type, tags_json, display_order, is_active,
 created_at, updated_at)
SELECT
  @LIBFILE_GUIDE_ID,
  @LIB_CT_SELECTION_ID,
  @ASSET_LIB_GUIDE_PDF_ID,
  NULL,
  'Ensotek Service Guide (PDF)',
  NULL,
  'application/pdf',
  '["guide","pdf","services","ensotek"]',
  2, 1,
  NOW(3), NOW(3)
FROM DUAL
WHERE @LIB_CT_SELECTION_ID IS NOT NULL
  AND @ASSET_LIB_GUIDE_PDF_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  asset_id      = VALUES(asset_id),
  file_url      = VALUES(file_url),
  name          = VALUES(name),
  size_bytes    = VALUES(size_bytes),
  mime_type     = VALUES(mime_type),
  tags_json     = VALUES(tags_json),
  display_order = VALUES(display_order),
  is_active     = VALUES(is_active),
  updated_at    = VALUES(updated_at);

COMMIT;
