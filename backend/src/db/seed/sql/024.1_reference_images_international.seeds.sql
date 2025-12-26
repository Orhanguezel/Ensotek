-- =============================================================
-- 024.1_reference_images_international.seeds.sql  (FINAL)
-- International references -> images
-- Category: aaaa5003... (Yurt Dışı Referanslar)
-- SubCats:  bbbb5301..bbbb5309
-- - reference_images: NO alt
-- - reference_images_i18n: has title/alt per locale
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

SET @CAT_INTL := 'aaaa5003-1111-4111-8111-aaaaaaaa5003';
SET @NOW := NOW(3);

-- -------------------------------------------------------------
-- 1) reference_images (BASE)  [NO alt]
-- -------------------------------------------------------------
INSERT INTO reference_images
(
  id, reference_id,
  image_url, storage_asset_id,
  display_order,
  created_at, updated_at
)
SELECT
  -- deterministic UUID36 from (reference_id + slot)
  CONCAT(
    SUBSTRING(MD5(CONCAT(r.id, ':', s.slot)), 1, 8), '-',
    SUBSTRING(MD5(CONCAT(r.id, ':', s.slot)), 9, 4), '-',
    '4', SUBSTRING(MD5(CONCAT(r.id, ':', s.slot)), 14, 3), '-',
    '8', SUBSTRING(MD5(CONCAT(r.id, ':', s.slot)), 18, 3), '-',
    SUBSTRING(MD5(CONCAT(r.id, ':', s.slot)), 21, 12)
  ) AS id,

  r.id AS reference_id,

  -- choose a photo id pool + per-slot stable signature
  CONCAT(
    'https://images.unsplash.com/photo-',
    CASE s.slot
      WHEN 1 THEN '1509391366360-2e959784a276'
      WHEN 2 THEN '1473341304170-971dccb5ac1e'
      WHEN 3 THEN '1487875961445-47a00398c267'
      ELSE        '1600585154340-be6161a56a0c'
    END,
    '?auto=format&fit=crop&w=1600&h=900&q=80',
    '&sig=', s.slot,
    '&ixid=ref-', REPLACE(r.id,'-','')
  ) AS image_url,

  NULL AS storage_asset_id,
  s.slot AS display_order,
  @NOW, @NOW
FROM `references` r
JOIN (
  SELECT 1 AS slot UNION ALL
  SELECT 2 UNION ALL
  SELECT 3
) s
WHERE BINARY r.category_id = BINARY @CAT_INTL
ON DUPLICATE KEY UPDATE
  reference_id     = VALUES(reference_id),
  image_url        = VALUES(image_url),
  storage_asset_id = VALUES(storage_asset_id),
  display_order    = VALUES(display_order),
  updated_at       = VALUES(updated_at);

-- -------------------------------------------------------------
-- 2) reference_images_i18n (TR)  [title + alt burada]
-- -------------------------------------------------------------
INSERT INTO reference_images_i18n
(
  id, reference_image_id, locale,
  title, alt,
  created_at, updated_at
)
SELECT
  COALESCE(
    (
      SELECT ii.id
      FROM reference_images_i18n ii
      WHERE BINARY ii.reference_image_id = BINARY ri.id
        AND BINARY ii.locale             = BINARY 'tr'
      LIMIT 1
    ),
    UUID()
  ) AS id,

  ri.id AS reference_image_id,
  'tr' AS locale,

  CONCAT(rtr.title, ' – Görsel ', ri.display_order) AS title,

  CONCAT(
    CASE
      WHEN r.sub_category_id = 'bbbb5301-1111-4111-8111-bbbbbbbb5301' THEN 'Enerji santrali sahası'
      WHEN r.sub_category_id = 'bbbb5302-1111-4111-8111-bbbbbbbb5302' THEN 'Petrokimya / kimya tesisi'
      WHEN r.sub_category_id = 'bbbb5303-1111-4111-8111-bbbbbbbb5303' THEN 'Çimento / madencilik tesisi'
      WHEN r.sub_category_id = 'bbbb5304-1111-4111-8111-bbbbbbbb5304' THEN 'Gıda / içecek üretim hattı'
      WHEN r.sub_category_id = 'bbbb5305-1111-4111-8111-bbbbbbbb5305' THEN 'Çelik / metal sanayi'
      WHEN r.sub_category_id = 'bbbb5306-1111-4111-8111-bbbbbbbb5306' THEN 'Otomotiv üretim / montaj'
      WHEN r.sub_category_id = 'bbbb5307-1111-4111-8111-bbbbbbbb5307' THEN 'AVM / ticari bina'
      WHEN r.sub_category_id = 'bbbb5308-1111-4111-8111-bbbbbbbb5308' THEN 'Veri merkezi / hastane'
      WHEN r.sub_category_id = 'bbbb5309-1111-4111-8111-bbbbbbbb5309' THEN 'Diğer proje'
      ELSE 'Proje görseli'
    END,
    ' – ',
    rtr.title,
    ' (Yurt Dışı) – referans görseli'
  ) AS alt,

  @NOW, @NOW
FROM reference_images ri
JOIN `references` r
  ON BINARY r.id = BINARY ri.reference_id
JOIN references_i18n rtr
  ON BINARY rtr.reference_id = BINARY r.id
 AND BINARY rtr.locale       = BINARY 'tr'
WHERE BINARY r.category_id = BINARY @CAT_INTL
ON DUPLICATE KEY UPDATE
  title      = VALUES(title),
  alt        = VALUES(alt),
  updated_at = VALUES(updated_at);

COMMIT;
