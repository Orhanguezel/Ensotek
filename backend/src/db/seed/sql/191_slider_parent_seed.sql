-- =============================================================
-- FILE: 191_slider_parent_seed.sql
-- SEED: Ensotek – Slider Parent (slider)
-- Parent-only seed – idempotent
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

INSERT INTO `slider`
(`uuid`,
 `image_url`,`image_asset_id`,
 `featured`,`is_active`,`display_order`,
 `created_at`,`updated_at`)
VALUES
(
  '99990001-1111-4111-8111-999999990001',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&h=600&q=80',
  NULL,
  1, 1, 1,
  '2024-01-20 00:00:00.000','2024-01-20 00:00:00.000'
),
(
  '99990002-1111-4111-8111-999999990002',
  'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80',
  NULL,
  0, 1, 2,
  '2024-01-21 00:00:00.000','2024-01-21 00:00:00.000'
),
(
  '99990003-1111-4111-8111-999999990003',
  'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80',
  NULL,
  0, 1, 3,
  '2024-01-22 00:00:00.000','2024-01-22 00:00:00.000'
),
(
  '99990004-1111-4111-8111-999999990004',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&h=600&q=80',
  NULL,
  0, 1, 4,
  '2024-01-23 00:00:00.000','2024-01-23 00:00:00.000'
),
(
  '99990005-1111-4111-8111-999999990005',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&h=600&q=80',
  NULL,
  0, 1, 5,
  '2024-01-24 00:00:00.000','2024-01-24 00:00:00.000'
),

-- =============================================================
-- NEW: SERVICES EXPANSION (6 new slides)
-- =============================================================
(
  '99990006-1111-4111-8111-999999990006',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&h=600&q=80',
  NULL,
  0, 1, 6,
  '2024-01-25 00:00:00.000','2024-01-25 00:00:00.000'
),
(
  '99990007-1111-4111-8111-999999990007',
  'https://images.unsplash.com/photo-1581092919535-7146a3d16a5a?auto=format&fit=crop&w=1200&h=600&q=80',
  NULL,
  0, 1, 7,
  '2024-01-26 00:00:00.000','2024-01-26 00:00:00.000'
),
(
  '99990008-1111-4111-8111-999999990008',
  'https://images.unsplash.com/photo-1581093458791-9b6e9d3a4b2a?auto=format&fit=crop&w=1200&h=600&q=80',
  NULL,
  0, 1, 8,
  '2024-01-27 00:00:00.000','2024-01-27 00:00:00.000'
),
(
  '99990009-1111-4111-8111-999999990009',
  'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80',
  NULL,
  0, 1, 9,
  '2024-01-28 00:00:00.000','2024-01-28 00:00:00.000'
),
(
  '99990010-1111-4111-8111-999999990010',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&h=600&q=80',
  NULL,
  0, 1, 10,
  '2024-01-29 00:00:00.000','2024-01-29 00:00:00.000'
),
(
  '99990011-1111-4111-8111-999999990011',
  'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&h=600&q=80',
  NULL,
  0, 1, 11,
  '2024-01-30 00:00:00.000','2024-01-30 00:00:00.000'
)

ON DUPLICATE KEY UPDATE
  `image_url`      = VALUES(`image_url`),
  `image_asset_id` = VALUES(`image_asset_id`),
  `featured`       = VALUES(`featured`),
  `is_active`      = VALUES(`is_active`),
  `display_order`  = VALUES(`display_order`),
  `updated_at`     = VALUES(`updated_at`);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
