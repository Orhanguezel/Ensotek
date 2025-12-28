-- =============================================================
-- FILE: 014.5_products_base_ctp_single_cell.sql (FINAL)
-- Ensotek – PRODUCTS base seed
-- Open Circuit Cooling Towers – Single Cell / CTP Series
-- Source: Catalog p.7
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

INSERT INTO products (
  id,
  item_type,
  category_id,
  sub_category_id,
  price,
  image_url,
  storage_asset_id,
  images,
  storage_image_ids,
  is_active,
  is_featured,
  order_num,
  product_code,
  stock_quantity,
  rating,
  review_count
)
VALUES (
  'bbbb0002-2222-4222-8222-bbbbbbbb0002',
  'product',
  'aaaa0002-1111-4111-8111-aaaaaaaa0002',        -- AÇIK DEVRE SOĞUTMA KULELERİ
  'bbbb0102-1111-4111-8111-bbbbbbbb0102',        -- Mekanik Çekişli Açık Devre
  0.00,
  NULL,
  NULL,
  JSON_ARRAY(),
  JSON_ARRAY(),
  1,
  1,
  110,
  'CTP-SINGLE',
  0,
  5.00,
  0
);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
