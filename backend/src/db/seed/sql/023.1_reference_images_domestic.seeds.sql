-- =============================================================
-- 023.1_reference_images_domestic.seeds.sql  (Domestic) [IDEMPOTENT]
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

-- Helper: last hex digit => 0..15
-- We use: CONV(RIGHT(REPLACE(reference_id,'-',''),1),16,10)

-- =============================================================
-- 1) reference_images (base) - 3..6 per reference (deterministic)
-- =============================================================

INSERT INTO reference_images
(
  id, reference_id,
  image_url, storage_asset_id,
  is_featured, display_order, is_published,
  created_at, updated_at
)
SELECT
  -- deterministic image id = LEFT(reference_id_no_dash, 32) but varied per slot
  -- format: xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx (good enough for CHAR(36))
  CONCAT(
    LEFT(x.ref_hex, 8), '-', SUBSTRING(x.ref_hex, 9, 4), '-4',
    SUBSTRING(x.ref_hex, 14, 3), '-8', SUBSTRING(x.ref_hex, 18, 3), '-',
    SUBSTRING(x.ref_hex, 21, 10), LPAD(x.slot, 2, '0')
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
    REPLACE(r.id, '-', '') AS ref_hex,
    r.sub_category_id,

    s.slot,

    -- determine whether to include slot 4-6
    CONV(RIGHT(REPLACE(r.id,'-',''),1),16,10) AS last_hex,

    -- topic by sub_category
    CASE
      WHEN r.sub_category_id = 'bbbb5201-1111-4111-8111-bbbbbbbb5201' THEN 'power-plant'
      WHEN r.sub_category_id = 'bbbb5202-1111-4111-8111-bbbbbbbb5202' THEN 'petrochemical'
      WHEN r.sub_category_id = 'bbbb5203-1111-4111-8111-bbbbbbbb5203' THEN 'cement-factory'
      WHEN r.sub_category_id = 'bbbb5204-1111-4111-8111-bbbbbbbb5204' THEN 'food-factory'
      WHEN r.sub_category_id = 'bbbb5205-1111-4111-8111-bbbbbbbb5205' THEN 'steel-industry'
      WHEN r.sub_category_id = 'bbbb5206-1111-4111-8111-bbbbbbbb5206' THEN 'automotive-factory'
      WHEN r.sub_category_id = 'bbbb5207-1111-4111-8111-bbbbbbbb5207' THEN 'shopping-mall'
      WHEN r.sub_category_id = 'bbbb5208-1111-4111-8111-bbbbbbbb5208' THEN 'data-center'
      ELSE 'industrial'
    END AS topic,

    -- build image url (unsplash query) + seed for variation
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
      '&qtopic=',  -- harmless custom param
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
  -- Always keep 1..3
  (x.slot <= 3)
  -- Deterministic “sometimes” for 4..6 based on last hex digit
  OR (x.slot = 4 AND x.last_hex >= 5)
  OR (x.slot = 5 AND x.last_hex >= 10)
  OR (x.slot = 6 AND x.last_hex >= 13)

ON DUPLICATE KEY UPDATE
  reference_id   = VALUES(reference_id),
  image_url      = VALUES(image_url),
  storage_asset_id = VALUES(storage_asset_id),
  is_featured    = VALUES(is_featured),
  display_order  = VALUES(display_order),
  is_published   = VALUES(is_published),
  updated_at     = VALUES(updated_at);

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
        AND BINARY ii.locale             = BINARY 'de'
      LIMIT 1
    ),
    UUID()
  ) AS id,

  ri.id AS reference_image_id,
  'de' AS locale,

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
 AND BINARY rtr.locale       = BINARY 'de'
WHERE BINARY r.category_id = BINARY @CAT_DOMESTIC

ON DUPLICATE KEY UPDATE
  title      = VALUES(title),
  alt        = VALUES(alt),
  updated_at = VALUES(updated_at);

COMMIT;
