-- =============================================================
-- 104_library_files_de.sql (files: library_files) - DE labels
-- =============================================================

/* ================= SEED: FILES (PDF) ================= */

-- Broşür PDF
SET @LIBFILE_BROCHURE_ID := (
  SELECT id FROM library_files
  WHERE library_id = @LIB_BROCHURE_ID AND display_order = 1
  LIMIT 1
);
SET @LIBFILE_BROCHURE_ID := COALESCE(@LIBFILE_BROCHURE_ID, UUID());

INSERT INTO library_files
(id, library_id, asset_id, file_url, name,
 size_bytes, mime_type, tags_json, display_order, is_active,
 created_at, updated_at)
SELECT
  @LIBFILE_BROCHURE_ID,
  @LIB_BROCHURE_ID,
  @ASSET_LIB_BROCHURE_PDF_ID,
  NULL,
  'Ensotek Unternehmensbroschüre (TR/EN/DE)',
  NULL,
  'application/pdf',
  '["brochure","pdf","ensotek","corporate","de"]',
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
 tags_json     = VALUES(tags_json),
 display_order = VALUES(display_order),
 is_active     = VALUES(is_active),
 updated_at    = VALUES(updated_at);


-- Hizmet Rehberi PDF
SET @LIBFILE_GUIDE_ID := (
  SELECT id FROM library_files
  WHERE library_id = @LIB_GUIDE_ID AND display_order = 2
  LIMIT 1
);
SET @LIBFILE_GUIDE_ID := COALESCE(@LIBFILE_GUIDE_ID, UUID());

INSERT INTO library_files
(id, library_id, asset_id, file_url, name,
 size_bytes, mime_type, tags_json, display_order, is_active,
 created_at, updated_at)
SELECT
  @LIBFILE_GUIDE_ID,
  @LIB_GUIDE_ID,
  @ASSET_LIB_GUIDE_PDF_ID,
  NULL,
  'Ensotek Service-Leitfaden (TR/EN/DE)',
  NULL,
  'application/pdf',
  '["guide","pdf","services","ensotek","de"]',
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
 tags_json     = VALUES(tags_json),
 display_order = VALUES(display_order),
 is_active     = VALUES(is_active),
 updated_at    = VALUES(updated_at);
