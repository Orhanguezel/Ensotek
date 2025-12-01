-- =============================================================
-- 044_library_files.sql (files: library_files)
-- =============================================================

/* ================= TABLE ================= */
CREATE TABLE IF NOT EXISTS `library_files` (
  id           CHAR(36)    NOT NULL,
  library_id   CHAR(36)    NOT NULL,
  asset_id     CHAR(36)    NOT NULL,

  file_url     VARCHAR(500) DEFAULT NULL,
  name         VARCHAR(255) NOT NULL,

  size_bytes   INT          DEFAULT NULL,
  mime_type    VARCHAR(255) DEFAULT NULL,

  display_order INT        NOT NULL DEFAULT 0,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,

  created_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),
  KEY library_files_library_idx (library_id),
  KEY library_files_asset_idx   (asset_id),
  KEY library_files_active_idx  (is_active),
  KEY library_files_order_idx   (display_order),

  CONSTRAINT fk_library_files_parent
    FOREIGN KEY (library_id) REFERENCES library(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_library_files_asset
    FOREIGN KEY (asset_id) REFERENCES storage_assets(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


/* ================= SEED: FILES (PDF) ================= */
/*
  NOT:
  - Aşağıdaki asset değişkenleri, storage_assets seed içinde set edilmelidir:
      @ASSET_LIB_BROCHURE_PDF_ID
      @ASSET_LIB_GUIDE_PDF_ID
  - Set edilmezse, WHERE @ASSET_... IS NOT NULL şartı nedeniyle
    INSERT 0 satır ekler, constraint hatası vermez.
*/

-- Broşür PDF
SET @LIBFILE_BROCHURE_ID := (
  SELECT id FROM library_files
  WHERE library_id = @LIB_BROCHURE_ID AND display_order = 1
  LIMIT 1
);
SET @LIBFILE_BROCHURE_ID := COALESCE(@LIBFILE_BROCHURE_ID, UUID());

INSERT INTO library_files
(id, library_id, asset_id, file_url, name,
 size_bytes, mime_type, display_order, is_active,
 created_at, updated_at)
SELECT
  @LIBFILE_BROCHURE_ID,
  @LIB_BROCHURE_ID,
  @ASSET_LIB_BROCHURE_PDF_ID,
  NULL, -- file_url: storage URL üzerinden üretilecekse NULL bırak
  'Kurumsal Tanıtım Broşürü (TR/EN)',
  NULL,
  'application/pdf',
  1, 1,
  NOW(3), NOW(3)
FROM DUAL
WHERE @ASSET_LIB_BROCHURE_PDF_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
 asset_id      = VALUES(asset_id),
 file_url      = VALUES(file_url),
 name          = VALUES(name),
 size_bytes    = VALUES(size_bytes),
 mime_type     = VALUES(mime_type),
 display_order = VALUES(display_order),
 is_active     = VALUES(is_active),
 updated_at    = VALUES(updated_at);

-- Hizmet Rehberi PDF
SET @LIBFILE_GUIDE_ID := (
  SELECT id FROM library_files
  WHERE library_id = @LIB_GUIDE_ID AND display_order = 1
  LIMIT 1
);
SET @LIBFILE_GUIDE_ID := COALESCE(@LIBFILE_GUIDE_ID, UUID());

INSERT INTO library_files
(id, library_id, asset_id, file_url, name,
 size_bytes, mime_type, display_order, is_active,
 created_at, updated_at)
SELECT
  @LIBFILE_GUIDE_ID,
  @LIB_GUIDE_ID,
  @ASSET_LIB_GUIDE_PDF_ID,
  NULL,
  'Hizmet Rehberi (TR/EN)',
  NULL,
  'application/pdf',
  2, 1,
  NOW(3), NOW(3)
FROM DUAL
WHERE @ASSET_LIB_GUIDE_PDF_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
 asset_id      = VALUES(asset_id),
 file_url      = VALUES(file_url),
 name          = VALUES(name),
 size_bytes    = VALUES(size_bytes),
 mime_type     = VALUES(mime_type),
 display_order = VALUES(display_order),
 is_active     = VALUES(is_active),
 updated_at    = VALUES(updated_at);
