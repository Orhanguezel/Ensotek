-- =============================================================
-- FILE: 300_kompozit_categories.seed.sql
-- MOE Kompozit — 7 ürün kategorisi + i18n (TR/EN)
-- module_key = 'kompozit'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =========================
-- 1) CATEGORIES (BASE)
-- =========================
INSERT INTO `categories`
(
  `id`,
  `module_key`,
  `image_url`,
  `storage_asset_id`,
  `alt`,
  `icon`,
  `is_active`,
  `is_featured`,
  `display_order`
)
VALUES
  ('cccc0001-4001-4001-8001-cccccccc0001', 'kompozit', NULL, NULL, NULL, NULL, 1, 1, 10),
  ('cccc0002-4002-4002-8002-cccccccc0002', 'kompozit', NULL, NULL, NULL, NULL, 1, 1, 20),
  ('cccc0003-4003-4003-8003-cccccccc0003', 'kompozit', NULL, NULL, NULL, NULL, 1, 1, 30),
  ('cccc0004-4004-4004-8004-cccccccc0004', 'kompozit', NULL, NULL, NULL, NULL, 1, 0, 40),
  ('cccc0005-4005-4005-8005-cccccccc0005', 'kompozit', NULL, NULL, NULL, NULL, 1, 0, 50),
  ('cccc0006-4006-4006-8006-cccccccc0006', 'kompozit', NULL, NULL, NULL, NULL, 1, 0, 60),
  ('cccc0007-4007-4007-8007-cccccccc0007', 'kompozit', NULL, NULL, NULL, NULL, 1, 0, 70)
ON DUPLICATE KEY UPDATE
  `module_key` = VALUES(`module_key`),
  `is_active` = VALUES(`is_active`),
  `display_order` = VALUES(`display_order`);

-- =========================
-- 2) CATEGORY I18N — TR
-- =========================
INSERT INTO `category_i18n`
(
  `category_id`,
  `locale`,
  `name`,
  `slug`,
  `description`
)
VALUES
  ('cccc0001-4001-4001-8001-cccccccc0001', 'tr', 'Karbon Fiber Ürünler', 'karbon-fiber-urunler', 'Yüksek mukavemetli karbon fiber kompozit ürünler'),
  ('cccc0002-4002-4002-8002-cccccccc0002', 'tr', 'CTP Ürünler', 'ctp-urunler', 'Cam takviyeli polyester (CTP) kompozit ürünler'),
  ('cccc0003-4003-4003-8003-cccccccc0003', 'tr', 'Cam Elyaf Ürünler', 'cam-elyaf-urunler', 'Cam elyaf takviyeli kompozit ürünler'),
  ('cccc0004-4004-4004-8004-cccccccc0004', 'tr', 'Endüstriyel Profiller', 'endustriyel-profiller', 'Pultruded ve özel profil kompozit yapılar'),
  ('cccc0005-4005-4005-8005-cccccccc0005', 'tr', 'Kompozit Paneller', 'kompozit-paneller', 'Sandwich panel ve düz plaka kompozit ürünler'),
  ('cccc0006-4006-4006-8006-cccccccc0006', 'tr', 'Özel Üretim', 'ozel-uretim', 'Projeye özel tasarım ve üretim çözümleri'),
  ('cccc0007-4007-4007-8007-cccccccc0007', 'tr', 'Kalıp ve Parçalar', 'kalip-ve-parcalar', 'Kompozit kalıp ve yedek parça üretimi')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `description` = VALUES(`description`);

-- =========================
-- 3) CATEGORY I18N — EN
-- =========================
INSERT INTO `category_i18n`
(
  `category_id`,
  `locale`,
  `name`,
  `slug`,
  `description`
)
VALUES
  ('cccc0001-4001-4001-8001-cccccccc0001', 'en', 'Carbon Fiber Products', 'carbon-fiber-products', 'High-strength carbon fiber composite products'),
  ('cccc0002-4002-4002-8002-cccccccc0002', 'en', 'FRP Products', 'frp-products', 'Fiber-reinforced polymer (FRP) composite products'),
  ('cccc0003-4003-4003-8003-cccccccc0003', 'en', 'Fiberglass Products', 'fiberglass-products', 'Fiberglass-reinforced composite products'),
  ('cccc0004-4004-4004-8004-cccccccc0004', 'en', 'Industrial Profiles', 'industrial-profiles', 'Pultruded and custom profile composite structures'),
  ('cccc0005-4005-4005-8005-cccccccc0005', 'en', 'Composite Panels', 'composite-panels', 'Sandwich panel and flat plate composite products'),
  ('cccc0006-4006-4006-8006-cccccccc0006', 'en', 'Custom Manufacturing', 'custom-manufacturing', 'Project-specific design and manufacturing solutions'),
  ('cccc0007-4007-4007-8007-cccccccc0007', 'en', 'Molds & Parts', 'molds-and-parts', 'Composite mold and spare parts manufacturing')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `description` = VALUES(`description`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
