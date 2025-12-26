-- =============================================================
-- 023.2_reference_images_i18n.en_de.sql (FIXED)
-- Create EN/DE image i18n rows from TR if missing
-- Requires:
--   - 023_reference_images.schema.sql
--   - 023.1_reference_images_domestic.seeds.sql
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

SET @NOW := NOW(3);

-- =============================================================
-- EN copy (from TR if missing)
-- =============================================================
INSERT INTO reference_images_i18n
(id, reference_image_id, locale, title, alt, created_at, updated_at)
SELECT
  UUID(),
  tr.reference_image_id,
  'en',
  tr.title,
  tr.alt,
  @NOW, @NOW
FROM reference_images_i18n tr
WHERE BINARY tr.locale = BINARY 'tr'
  AND NOT EXISTS (
    SELECT 1
    FROM reference_images_i18n en
    WHERE BINARY en.reference_image_id = BINARY tr.reference_image_id
      AND BINARY en.locale            = BINARY 'en'
  );

-- =============================================================
-- DE copy (from TR if missing)
-- =============================================================
INSERT INTO reference_images_i18n
(id, reference_image_id, locale, title, alt, created_at, updated_at)
SELECT
  UUID(),
  tr.reference_image_id,
  'de',
  tr.title,
  tr.alt,
  @NOW, @NOW
FROM reference_images_i18n tr
WHERE BINARY tr.locale = BINARY 'tr'
  AND NOT EXISTS (
    SELECT 1
    FROM reference_images_i18n de
    WHERE BINARY de.reference_image_id = BINARY tr.reference_image_id
      AND BINARY de.locale            = BINARY 'de'
  );

COMMIT;
