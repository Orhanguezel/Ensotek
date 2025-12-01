-- =============================================================
-- 102_library_images.sql (gallery: library_images)
-- =============================================================

/* ================= TABLE ================= */
CREATE TABLE IF NOT EXISTS `library_images` (
  id            CHAR(36)    NOT NULL,
  library_id    CHAR(36)    NOT NULL,
  asset_id      CHAR(36)    NOT NULL,
  image_url     VARCHAR(500)  DEFAULT NULL,
  thumb_url     VARCHAR(500)  DEFAULT NULL,
  webp_url      VARCHAR(500)  DEFAULT NULL,

  display_order INT         NOT NULL DEFAULT 0,
  is_active     TINYINT(1)  NOT NULL DEFAULT 1,

  created_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),
  KEY library_images_library_idx (library_id),
  KEY library_images_asset_idx   (asset_id),
  KEY library_images_active_idx  (is_active),
  KEY library_images_order_idx   (display_order),

  CONSTRAINT fk_library_images_parent
    FOREIGN KEY (library_id) REFERENCES library(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_library_images_asset
    FOREIGN KEY (asset_id) REFERENCES storage_assets(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


/* ================= SEED: GALLERY ================= */
/*
  NOT:
  - Aşağıdaki asset değişkenleri storage seed tarafında tanımlanabilir:
    @ASSET_LIB_BROCHURE_COVER_ID
    @ASSET_LIB_GUIDE_COVER_ID
  - Eğer tanımlanmazsa, WHERE @ASSET_... IS NOT NULL koşulu nedeniyle
    INSERT hiçbir satır eklemez ve hata oluşmaz.
*/

-- Broşür: kapak görseli
SET @LIBIMG_BROCHURE_COVER_ID := (
  SELECT id FROM library_images
  WHERE library_id = @LIB_BROCHURE_ID AND display_order = 1
  LIMIT 1
);
SET @LIBIMG_BROCHURE_COVER_ID := COALESCE(@LIBIMG_BROCHURE_COVER_ID, UUID());

INSERT INTO library_images
(id, library_id, asset_id, image_url, thumb_url, webp_url,
 display_order, is_active, created_at, updated_at)
SELECT
  @LIBIMG_BROCHURE_COVER_ID,
  @LIB_BROCHURE_ID,
  @ASSET_LIB_BROCHURE_COVER_ID,
  NULL, NULL, NULL,
  1, 1, NOW(3), NOW(3)
FROM DUAL
WHERE @ASSET_LIB_BROCHURE_COVER_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
 asset_id      = VALUES(asset_id),
 image_url     = VALUES(image_url),
 thumb_url     = VALUES(thumb_url),
 webp_url      = VALUES(webp_url),
 display_order = VALUES(display_order),
 is_active     = VALUES(is_active),
 updated_at    = VALUES(updated_at);

-- Hizmet Rehberi: kapak görseli
SET @LIBIMG_GUIDE_COVER_ID := (
  SELECT id FROM library_images
  WHERE library_id = @LIB_GUIDE_ID AND display_order = 1
  LIMIT 1
);
SET @LIBIMG_GUIDE_COVER_ID := COALESCE(@LIBIMG_GUIDE_COVER_ID, UUID());

INSERT INTO library_images
(id, library_id, asset_id, image_url, thumb_url, webp_url,
 display_order, is_active, created_at, updated_at)
SELECT
  @LIBIMG_GUIDE_COVER_ID,
  @LIB_GUIDE_ID,
  @ASSET_LIB_GUIDE_COVER_ID,
  NULL, NULL, NULL,
  1, 1, NOW(3), NOW(3)
FROM DUAL
WHERE @ASSET_LIB_GUIDE_COVER_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
 asset_id      = VALUES(asset_id),
 image_url     = VALUES(image_url),
 thumb_url     = VALUES(thumb_url),
 webp_url      = VALUES(webp_url),
 display_order = VALUES(display_order),
 is_active     = VALUES(is_active),
 updated_at    = VALUES(updated_at);
