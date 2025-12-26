-- =============================================================
-- 023.1_reference_images_domestic.seeds.sql  (Domestic) [IDEMPOTENT] (FIXED)
-- Adds 3-6 images per domestic reference + TR i18n
-- Requires:
--   - 020_references.schema.sql
--   - 023_reference_images.schema.sql
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

SET @CAT_DOMESTIC := 'aaaa5002-1111-4111-8111-aaaaaaaa5002';
SET @NOW := NOW(3);

-- =============================================================
-- 1) reference_images (base) - 3..6 per reference (deterministic)
--    ✅ Idempotent anahtar: (reference_id, display_order)
-- =============================================================

INSERT INTO reference_images
(
  id, reference_id,
  image_url, storage_asset_id,
  is_featured, display_order, is_published,
  created_at, updated_at
)
SELECT
  COALESCE(
    (
      SELECT ri2.id
      FROM reference_images ri2
      WHERE BINARY ri2.reference_id  = BINARY x.reference_id
        AND ri2.display_order       = x.slot
      LIMIT 1
    ),
    UUID()
  ) AS id,

  x.reference_id,
  x.image_url,
  NULL AS storage_asset_id,

  CASE WHEN x.slot = 1 THEN 1 ELSE 0 END AS is_featured,
  x.slot AS display_order,
  1 AS is_published,

  @NOW, @NOW
FROM (
  SELECT
    r.id AS reference_id,
    r.sub_category_id,
    s.slot,
    CONV(RIGHT(REPLACE(r.id,'-',''),1),16,10) AS last_hex,

    CONCAT(
      'https://images.unsplash.com/photo-',
      CASE s.slot
        WHEN 1 THEN '1487875961445-47a00398c267'
        WHEN 2 THEN '1509391366360-2e959784a276'
        WHEN 3 THEN '1473341304170-971dccb5ac1e'
        WHEN 4 THEN '1581092919535-7146c1f6df2e'
        WHEN 5 THEN '1600585154340-be6161a56a0c'
        ELSE        '1550751827-4bd374c3f58b'
      END,
      '?auto=format&fit=crop&w=1600&h=900&q=80',
      '&sat=-10',
      '&sig=', s.slot,
      '&ixid=ref-', REPLACE(r.id,'-',''),
      '&qtopic=',
      (
        CASE
          WHEN r.sub_category_id = 'bbbb5201-1111-4111-8111-bbbbbbbb5201' THEN 'energy'
          WHEN r.sub_category_id = 'bbbb5202-1111-4111-8111-bbbbbbbb5202' THEN 'petrochem'
          WHEN r.sub_category_id = 'bbbb5203-1111-4111-8111-bbbbbbbb5203' THEN 'cement'
          WHEN r.sub_category_id = 'bbbb5204-1111-4111-8111-bbbbbbbb5204' THEN 'food'
          WHEN r.sub_category_id = 'bbbb5205-1111-4111-8111-bbbbbbbb5205' THEN 'steel'
          WHEN r.sub_category_id = 'bbbb5206-1111-4111-8111-bbbbbbbb5206' THEN 'auto'
          WHEN r.sub_category_id = 'bbbb5207-1111-4111-8111-bbbbbbbb5207' THEN 'mall'
          WHEN r.sub_category_id = 'bbbb5208-1111-4111-8111-bbbbbbbb5208' THEN 'datacenter'
          ELSE 'industrial'
        END
      )
    ) AS image_url

  FROM `references` r
  JOIN (
    SELECT 1 AS slot UNION ALL
    SELECT 2 UNION ALL
    SELECT 3 UNION ALL
    SELECT 4 UNION ALL
    SELECT 5 UNION ALL
    SELECT 6
  ) s
  WHERE BINARY r.category_id = BINARY @CAT_DOMESTIC
) x
WHERE
  (x.slot <= 3)
  OR (x.slot = 4 AND x.last_hex >= 5)
  OR (x.slot = 5 AND x.last_hex >= 10)
  OR (x.slot = 6 AND x.last_hex >= 13)

ON DUPLICATE KEY UPDATE
  image_url        = VALUES(image_url),
  storage_asset_id = VALUES(storage_asset_id),
  is_featured      = VALUES(is_featured),
  is_published     = VALUES(is_published),
  updated_at       = VALUES(updated_at);

-- =============================================================
-- 2) reference_images_i18n (TR) - title/alt for each image
-- =============================================================

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
    rtr.title,
    ' | ',
    CASE
      WHEN r.sub_category_id = 'bbbb5201-1111-4111-8111-bbbbbbbb5201' THEN 'Enerji Santrali'
      WHEN r.sub_category_id = 'bbbb5202-1111-4111-8111-bbbbbbbb5202' THEN 'Petrokimya & Kimya Tesisi'
      WHEN r.sub_category_id = 'bbbb5203-1111-4111-8111-bbbbbbbb5203' THEN 'Çimento & Madencilik'
      WHEN r.sub_category_id = 'bbbb5204-1111-4111-8111-bbbbbbbb5204' THEN 'Gıda & İçecek Tesisi'
      WHEN r.sub_category_id = 'bbbb5205-1111-4111-8111-bbbbbbbb5205' THEN 'Çelik & Metal Sanayi'
      WHEN r.sub_category_id = 'bbbb5206-1111-4111-8111-bbbbbbbb5206' THEN 'Otomotiv & Yan Sanayi'
      WHEN r.sub_category_id = 'bbbb5207-1111-4111-8111-bbbbbbbb5207' THEN 'AVM & Ticari Bina'
      WHEN r.sub_category_id = 'bbbb5208-1111-4111-8111-bbbbbbbb5208' THEN 'Veri Merkezi & Hastane'
      ELSE 'Endüstriyel Proje'
    END,
    ' – referans görseli'
  ) AS alt,

  @NOW, @NOW
FROM reference_images ri
JOIN `references` r
  ON BINARY r.id = BINARY ri.reference_id
JOIN references_i18n rtr
  ON BINARY rtr.reference_id = BINARY r.id
 AND BINARY rtr.locale       = BINARY 'tr'
WHERE BINARY r.category_id = BINARY @CAT_DOMESTIC

ON DUPLICATE KEY UPDATE
  title      = VALUES(title),
  alt        = VALUES(alt),
  updated_at = VALUES(updated_at);

COMMIT;
