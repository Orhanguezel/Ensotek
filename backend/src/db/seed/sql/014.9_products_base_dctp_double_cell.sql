-- =============================================================
-- FILE: 014.9_products_base_dctp_double_cell.sql  (FINAL)
-- Open Circuit Cooling Towers – Double Cell (DCTP Series)
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
  'bbbb0003-2222-4222-8222-bbbbbbbb0003',
  'product',
  'aaaa0002-1111-4111-8111-aaaaaaaa0002',
  'bbbb0102-1111-4111-8111-bbbbbbbb0102',
  0.00,
  NULL,
  NULL,
  JSON_ARRAY(),
  JSON_ARRAY(),
  1,
  1,
  120,
  'DCTP-DOUBLE',
  0,
  5.00,
  0
)
ON DUPLICATE KEY UPDATE
  item_type         = VALUES(item_type),
  category_id       = VALUES(category_id),
  sub_category_id   = VALUES(sub_category_id),
  price             = VALUES(price),
  image_url         = VALUES(image_url),
  storage_asset_id  = VALUES(storage_asset_id),
  images            = VALUES(images),
  storage_image_ids = VALUES(storage_image_ids),
  is_active         = VALUES(is_active),
  is_featured       = VALUES(is_featured),
  order_num         = VALUES(order_num),
  product_code      = VALUES(product_code),
  stock_quantity    = VALUES(stock_quantity),
  rating            = VALUES(rating),
  review_count      = VALUES(review_count);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
