-- =============================================================
-- FILE: 012_sub_categories.sql  (FINAL / FIXED)
-- Ensotek – Sub Categories schema + seed (TR/EN/DE)
-- - Creates tables if missing (fixes: ER_NO_SUCH_TABLE)
-- - UPSERT safe (re-runnable)
--
-- Fixes applied (per request):
-- 1) REFERENCES: sub-categories were incorrectly attached to aaaa5001.
--    Now they are attached to:
--      - aaaa5002 = Yurt İçi Referanslar
--      - aaaa5003 = Yurt Dışı Referanslar
--    and include "Sektör" sub-categories (Energy, Petrochem, etc.) under BOTH.
-- 2) PRODUCT: preserved + cleaned; added missing Heat Transfer Solutions (aaaa0005) sub-cats.
-- 3) SPAREPART: preserved; adjusted TR label "Kule Ana Ürünleri" -> "Kule Ana Bileşenleri" (more accurate).
-- 4) Keeps ALL other modules' sub-categories as-is.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =============================================================
-- 0) SCHEMA (CREATE TABLES IF NOT EXISTS)
-- =============================================================

CREATE TABLE IF NOT EXISTS `sub_categories` (
  `id`               CHAR(36)      NOT NULL,
  `category_id`      CHAR(36)      NOT NULL,

  `image_url`        VARCHAR(1024) NULL,
  `storage_asset_id` CHAR(36)      NULL,

  `alt`              VARCHAR(255)  NULL,
  `icon`             VARCHAR(255)  NULL,

  `is_active`        TINYINT(1)    NOT NULL DEFAULT 1,
  `is_featured`      TINYINT(1)    NOT NULL DEFAULT 0,
  `display_order`    INT           NOT NULL DEFAULT 0,

  `created_at`       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  KEY `idx_sub_categories_category_id` (`category_id`),
  KEY `idx_sub_categories_active_order` (`is_active`, `display_order`),

  CONSTRAINT `fk_sub_categories_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sub_category_i18n` (
  `sub_category_id` CHAR(36)      NOT NULL,
  `locale`          VARCHAR(10)   NOT NULL,

  `name`            VARCHAR(255)  NOT NULL,
  `slug`            VARCHAR(255)  NOT NULL,
  `description`     TEXT          NULL,
  `alt`             VARCHAR(255)  NULL,

  `created_at`      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`sub_category_id`, `locale`),
  UNIQUE KEY `uq_sub_category_i18n_locale_slug` (`locale`, `slug`),
  KEY `idx_sub_category_i18n_locale` (`locale`),

  CONSTRAINT `fk_sub_category_i18n_sub_category`
    FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- 1) SUB CATEGORIES (BASE)
-- =============================================================

INSERT INTO `sub_categories`
(
  `id`,
  `category_id`,
  `image_url`,
  `storage_asset_id`,
  `alt`,
  `icon`,
  `is_active`,
  `is_featured`,
  `display_order`
)
VALUES
  -- ==========================================================
  -- PRODUCT: SOĞUTMA KULELERİ (aaaa0001)
  -- ==========================================================
  ('bbbb0001-1111-4111-8111-bbbbbbbb0001', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb0002-1111-4111-8111-bbbbbbbb0002', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', NULL, NULL, NULL, NULL, 1, 0, 20),
  ('bbbb0003-1111-4111-8111-bbbbbbbb0003', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', NULL, NULL, NULL, NULL, 1, 0, 30),
  ('bbbb0004-1111-4111-8111-bbbbbbbb0004', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', NULL, NULL, NULL, NULL, 1, 0, 40),

  -- ==========================================================
  -- PRODUCT: AÇIK DEVRE SOĞUTMA KULELERİ (aaaa0002)
  -- ==========================================================
  ('bbbb0101-1111-4111-8111-bbbbbbbb0101', 'aaaa0002-1111-4111-8111-aaaaaaaa0002', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb0102-1111-4111-8111-bbbbbbbb0102', 'aaaa0002-1111-4111-8111-aaaaaaaa0002', NULL, NULL, NULL, NULL, 1, 0, 20),
  ('bbbb0103-1111-4111-8111-bbbbbbbb0103', 'aaaa0002-1111-4111-8111-aaaaaaaa0002', NULL, NULL, NULL, NULL, 1, 0, 30),

  -- ==========================================================
  -- PRODUCT: KAPALI DEVRE SOĞUTMA KULELERİ (aaaa0003)
  -- ==========================================================
  ('bbbb0201-1111-4111-8111-bbbbbbbb0201', 'aaaa0003-1111-4111-8111-aaaaaaaa0003', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb0202-1111-4111-8111-bbbbbbbb0202', 'aaaa0003-1111-4111-8111-aaaaaaaa0003', NULL, NULL, NULL, NULL, 1, 0, 20),
  ('bbbb0203-1111-4111-8111-bbbbbbbb0203', 'aaaa0003-1111-4111-8111-aaaaaaaa0003', NULL, NULL, NULL, NULL, 1, 0, 30),

  -- ==========================================================
  -- PRODUCT: HİBRİT SOĞUTMA SİSTEMLERİ (aaaa0004)
  -- ==========================================================
  ('bbbb0301-1111-4111-8111-bbbbbbbb0301', 'aaaa0004-1111-4111-8111-aaaaaaaa0004', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb0302-1111-4111-8111-bbbbbbbb0302', 'aaaa0004-1111-4111-8111-aaaaaaaa0004', NULL, NULL, NULL, NULL, 1, 0, 20),
  ('bbbb0303-1111-4111-8111-bbbbbbbb0303', 'aaaa0004-1111-4111-8111-aaaaaaaa0004', NULL, NULL, NULL, NULL, 1, 0, 30),

  -- ==========================================================
  -- PRODUCT: ISI TRANSFER ÇÖZÜMLERİ (aaaa0005)  (ADDED / FIX)
  -- ==========================================================
  ('bbbb0401-1111-4111-8111-bbbbbbbb0401', 'aaaa0005-1111-4111-8111-aaaaaaaa0005', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb0402-1111-4111-8111-bbbbbbbb0402', 'aaaa0005-1111-4111-8111-aaaaaaaa0005', NULL, NULL, NULL, NULL, 1, 0, 20),
  ('bbbb0403-1111-4111-8111-bbbbbbbb0403', 'aaaa0005-1111-4111-8111-aaaaaaaa0005', NULL, NULL, NULL, NULL, 1, 0, 30),

  -- ==========================================================
  -- SPAREPART (aaaa1001)
  -- ==========================================================
  ('bbbb1001-1111-4111-8111-bbbbbbbb1001', 'aaaa1001-1111-4111-8111-aaaaaaaa1001', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb1002-1111-4111-8111-bbbbbbbb1002', 'aaaa1001-1111-4111-8111-aaaaaaaa1001', NULL, NULL, NULL, NULL, 1, 0, 20),
  ('bbbb1003-1111-4111-8111-bbbbbbbb1003', 'aaaa1001-1111-4111-8111-aaaaaaaa1001', NULL, NULL, NULL, NULL, 1, 0, 30),
  ('bbbb1004-1111-4111-8111-bbbbbbbb1004', 'aaaa1001-1111-4111-8111-aaaaaaaa1001', NULL, NULL, NULL, NULL, 1, 0, 40),
  ('bbbb1005-1111-4111-8111-bbbbbbbb1005', 'aaaa1001-1111-4111-8111-aaaaaaaa1001', NULL, NULL, NULL, NULL, 1, 0, 50),
  ('bbbb1006-1111-4111-8111-bbbbbbbb1006', 'aaaa1001-1111-4111-8111-aaaaaaaa1001', NULL, NULL, NULL, NULL, 1, 0, 60),

  -- ==========================================================
  -- NEWS (aaaa2001)
  -- ==========================================================
  ('bbbb2001-1111-4111-8111-bbbbbbbb2001', 'aaaa2001-1111-4111-8111-aaaaaaaa2001', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb2002-1111-4111-8111-bbbbbbbb2002', 'aaaa2001-1111-4111-8111-aaaaaaaa2001', NULL, NULL, NULL, NULL, 1, 0, 20),
  ('bbbb2003-1111-4111-8111-bbbbbbbb2003', 'aaaa2001-1111-4111-8111-aaaaaaaa2001', NULL, NULL, NULL, NULL, 1, 0, 30),

  -- NEWS (aaaa2002)
  ('bbbb2101-1111-4111-8111-bbbbbbbb2101', 'aaaa2002-1111-4111-8111-aaaaaaaa2002', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb2102-1111-4111-8111-bbbbbbbb2102', 'aaaa2002-1111-4111-8111-aaaaaaaa2002', NULL, NULL, NULL, NULL, 1, 0, 20),

  -- NEWS (aaaa2003)
  ('bbbb2201-1111-4111-8111-bbbbbbbb2201', 'aaaa2003-1111-4111-8111-aaaaaaaa2003', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb2202-1111-4111-8111-bbbbbbbb2202', 'aaaa2003-1111-4111-8111-aaaaaaaa2003', NULL, NULL, NULL, NULL, 1, 0, 20),

  -- NEWS (aaaa2004)
  ('bbbb2301-1111-4111-8111-bbbbbbbb2301', 'aaaa2004-1111-4111-8111-aaaaaaaa2004', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb2302-1111-4111-8111-bbbbbbbb2302', 'aaaa2004-1111-4111-8111-aaaaaaaa2004', NULL, NULL, NULL, NULL, 1, 0, 20),

  -- ==========================================================
  -- BLOG (aaaa3001)
  -- ==========================================================
  ('bbbb3001-1111-4111-8111-bbbbbbbb3001', 'aaaa3001-1111-4111-8111-aaaaaaaa3001', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb3002-1111-4111-8111-bbbbbbbb3002', 'aaaa3001-1111-4111-8111-aaaaaaaa3001', NULL, NULL, NULL, NULL, 1, 0, 20),
  ('bbbb3003-1111-4111-8111-bbbbbbbb3003', 'aaaa3001-1111-4111-8111-aaaaaaaa3001', NULL, NULL, NULL, NULL, 1, 0, 30),

  -- BLOG (aaaa3002)
  ('bbbb3101-1111-4111-8111-bbbbbbbb3101', 'aaaa3002-1111-4111-8111-aaaaaaaa3002', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb3102-1111-4111-8111-bbbbbbbb3102', 'aaaa3002-1111-4111-8111-aaaaaaaa3002', NULL, NULL, NULL, NULL, 1, 0, 20),

  -- BLOG (aaaa3003)
  ('bbbb3201-1111-4111-8111-bbbbbbbb3201', 'aaaa3003-1111-4111-8111-aaaaaaaa3003', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb3202-1111-4111-8111-bbbbbbbb3202', 'aaaa3003-1111-4111-8111-aaaaaaaa3003', NULL, NULL, NULL, NULL, 1, 0, 20),

  -- BLOG (aaaa3004)
  ('bbbb3301-1111-4111-8111-bbbbbbbb3301', 'aaaa3004-1111-4111-8111-aaaaaaaa3004', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb3302-1111-4111-8111-bbbbbbbb3302', 'aaaa3004-1111-4111-8111-aaaaaaaa3004', NULL, NULL, NULL, NULL, 1, 0, 20),

  -- ==========================================================
  -- SLIDER (aaaa4001)
  -- ==========================================================
  ('bbbb4001-1111-4111-8111-bbbbbbbb4001', 'aaaa4001-1111-4111-8111-aaaaaaaa4001', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb4002-1111-4111-8111-bbbbbbbb4002', 'aaaa4001-1111-4111-8111-aaaaaaaa4001', NULL, NULL, NULL, NULL, 1, 0, 20),

  -- ==========================================================
  -- REFERENCES (FIXED): attach to Yurt İçi (aaaa5002) & Yurt Dışı (aaaa5003)
  -- ==========================================================
  -- Domestic
  ('bbbb5201-1111-4111-8111-bbbbbbbb5201', 'aaaa5002-1111-4111-8111-aaaaaaaa5002', NULL, NULL, NULL, NULL, 1, 0, 10), -- Enerji Santralleri
  ('bbbb5202-1111-4111-8111-bbbbbbbb5202', 'aaaa5002-1111-4111-8111-aaaaaaaa5002', NULL, NULL, NULL, NULL, 1, 0, 20), -- Petro-kimya & Kimya
  ('bbbb5203-1111-4111-8111-bbbbbbbb5203', 'aaaa5002-1111-4111-8111-aaaaaaaa5002', NULL, NULL, NULL, NULL, 1, 0, 30), -- Çimento & Madencilik
  ('bbbb5204-1111-4111-8111-bbbbbbbb5204', 'aaaa5002-1111-4111-8111-aaaaaaaa5002', NULL, NULL, NULL, NULL, 1, 0, 40), -- Gıda & İçecek
  ('bbbb5205-1111-4111-8111-bbbbbbbb5205', 'aaaa5002-1111-4111-8111-aaaaaaaa5002', NULL, NULL, NULL, NULL, 1, 0, 50), -- Çelik & Metal
  ('bbbb5206-1111-4111-8111-bbbbbbbb5206', 'aaaa5002-1111-4111-8111-aaaaaaaa5002', NULL, NULL, NULL, NULL, 1, 0, 60), -- Otomotiv
  ('bbbb5207-1111-4111-8111-bbbbbbbb5207', 'aaaa5002-1111-4111-8111-aaaaaaaa5002', NULL, NULL, NULL, NULL, 1, 0, 70), -- AVM & Ticari
  ('bbbb5208-1111-4111-8111-bbbbbbbb5208', 'aaaa5002-1111-4111-8111-aaaaaaaa5002', NULL, NULL, NULL, NULL, 1, 0, 80), -- Veri Merkezi & Hastane
  ('bbbb5209-1111-4111-8111-bbbbbbbb5209', 'aaaa5002-1111-4111-8111-aaaaaaaa5002', NULL, NULL, NULL, NULL, 1, 0, 90), -- Diğer

  -- International
  ('bbbb5301-1111-4111-8111-bbbbbbbb5301', 'aaaa5003-1111-4111-8111-aaaaaaaa5003', NULL, NULL, NULL, NULL, 1, 0, 10), -- Enerji Santralleri
  ('bbbb5302-1111-4111-8111-bbbbbbbb5302', 'aaaa5003-1111-4111-8111-aaaaaaaa5003', NULL, NULL, NULL, NULL, 1, 0, 20), -- Petro-kimya & Kimya
  ('bbbb5303-1111-4111-8111-bbbbbbbb5303', 'aaaa5003-1111-4111-8111-aaaaaaaa5003', NULL, NULL, NULL, NULL, 1, 0, 30), -- Çimento & Madencilik
  ('bbbb5304-1111-4111-8111-bbbbbbbb5304', 'aaaa5003-1111-4111-8111-aaaaaaaa5003', NULL, NULL, NULL, NULL, 1, 0, 40), -- Gıda & İçecek
  ('bbbb5305-1111-4111-8111-bbbbbbbb5305', 'aaaa5003-1111-4111-8111-aaaaaaaa5003', NULL, NULL, NULL, NULL, 1, 0, 50), -- Çelik & Metal
  ('bbbb5306-1111-4111-8111-bbbbbbbb5306', 'aaaa5003-1111-4111-8111-aaaaaaaa5003', NULL, NULL, NULL, NULL, 1, 0, 60), -- Otomotiv
  ('bbbb5307-1111-4111-8111-bbbbbbbb5307', 'aaaa5003-1111-4111-8111-aaaaaaaa5003', NULL, NULL, NULL, NULL, 1, 0, 70), -- AVM & Ticari
  ('bbbb5308-1111-4111-8111-bbbbbbbb5308', 'aaaa5003-1111-4111-8111-aaaaaaaa5003', NULL, NULL, NULL, NULL, 1, 0, 80), -- Veri Merkezi & Hastane
  ('bbbb5309-1111-4111-8111-bbbbbbbb5309', 'aaaa5003-1111-4111-8111-aaaaaaaa5003', NULL, NULL, NULL, NULL, 1, 0, 90), -- Diğer

  -- ==========================================================
  -- LIBRARY (aaaa6001)
  -- ==========================================================
  ('bbbb6001-1111-4111-8111-bbbbbbbb6001', 'aaaa6001-1111-4111-8111-aaaaaaaa6001', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb6002-1111-4111-8111-bbbbbbbb6002', 'aaaa6001-1111-4111-8111-aaaaaaaa6001', NULL, NULL, NULL, NULL, 1, 0, 20),
  ('bbbb6003-1111-4111-8111-bbbbbbbb6003', 'aaaa6001-1111-4111-8111-aaaaaaaa6001', NULL, NULL, NULL, NULL, 1, 0, 30),

  -- ==========================================================
  -- ABOUT (aaaa7001)
  -- ==========================================================
  ('bbbb7001-1111-4111-8111-bbbbbbbb7001', 'aaaa7001-1111-4111-8111-aaaaaaaa7001', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb7002-1111-4111-8111-bbbbbbbb7002', 'aaaa7001-1111-4111-8111-aaaaaaaa7001', NULL, NULL, NULL, NULL, 1, 0, 20),
  ('bbbb7003-1111-4111-8111-bbbbbbbb7003', 'aaaa7001-1111-4111-8111-aaaaaaaa7001', NULL, NULL, NULL, NULL, 1, 0, 30),
  ('bbbb7004-1111-4111-8111-bbbbbbbb7004', 'aaaa7001-1111-4111-8111-aaaaaaaa7001', NULL, NULL, NULL, NULL, 1, 0, 40),
  ('bbbb7005-1111-4111-8111-bbbbbbbb7005', 'aaaa7001-1111-4111-8111-aaaaaaaa7001', NULL, NULL, NULL, NULL, 1, 0, 50),
  ('bbbb7006-1111-4111-8111-bbbbbbbb7006', 'aaaa7001-1111-4111-8111-aaaaaaaa7001', NULL, NULL, NULL, NULL, 1, 0, 60),
  ('bbbb7007-1111-4111-8111-bbbbbbbb7007', 'aaaa7001-1111-4111-8111-aaaaaaaa7001', NULL, NULL, NULL, NULL, 1, 0, 70),
  ('bbbb7008-1111-4111-8111-bbbbbbbb7008', 'aaaa7001-1111-4111-8111-aaaaaaaa7001', NULL, NULL, NULL, NULL, 1, 0, 80),
  ('bbbb7009-1111-4111-8111-bbbbbbbb7009', 'aaaa7001-1111-4111-8111-aaaaaaaa7001', NULL, NULL, NULL, NULL, 1, 0, 90),
  ('bbbb7010-1111-4111-8111-bbbbbbbb7010', 'aaaa7001-1111-4111-8111-aaaaaaaa7001', NULL, NULL, NULL, NULL, 1, 0, 100),

  -- ==========================================================
  -- SERVICES (aaaa8001)
  -- ==========================================================
  ('bbbb8001-1111-4111-8111-bbbbbbbb8001', 'aaaa8001-1111-4111-8111-aaaaaaaa8001', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb8002-1111-4111-8111-bbbbbbbb8002', 'aaaa8001-1111-4111-8111-aaaaaaaa8001', NULL, NULL, NULL, NULL, 1, 0, 20),
  ('bbbb8003-1111-4111-8111-bbbbbbbb8003', 'aaaa8001-1111-4111-8111-aaaaaaaa8001', NULL, NULL, NULL, NULL, 1, 0, 30),
  ('bbbb8004-1111-4111-8111-bbbbbbbb8004', 'aaaa8001-1111-4111-8111-aaaaaaaa8001', NULL, NULL, NULL, NULL, 1, 0, 40),
  ('bbbb8005-1111-4111-8111-bbbbbbbb8005', 'aaaa8001-1111-4111-8111-aaaaaaaa8001', NULL, NULL, NULL, NULL, 1, 0, 50),
  ('bbbb8006-1111-4111-8111-bbbbbbbb8006', 'aaaa8001-1111-4111-8111-aaaaaaaa8001', NULL, NULL, NULL, NULL, 1, 0, 60),

  -- ==========================================================
  -- FAQ (aaaa9001)
  -- ==========================================================
  ('bbbb9001-1111-4111-8111-bbbbbbbb9001', 'aaaa9001-1111-4111-8111-aaaaaaaa9001', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb9002-1111-4111-8111-bbbbbbbb9002', 'aaaa9001-1111-4111-8111-aaaaaaaa9001', NULL, NULL, NULL, NULL, 1, 0, 20),
  ('bbbb9003-1111-4111-8111-bbbbbbbb9003', 'aaaa9001-1111-4111-8111-aaaaaaaa9001', NULL, NULL, NULL, NULL, 1, 0, 30),
  ('bbbb9004-1111-4111-8111-bbbbbbbb9004', 'aaaa9001-1111-4111-8111-aaaaaaaa9001', NULL, NULL, NULL, NULL, 1, 0, 40),

  -- ==========================================================
  -- TEAM (aaaa9101)
  -- ==========================================================
  ('bbbb9101-1111-4111-8111-bbbbbbbb9101', 'aaaa9101-1111-4111-8111-aaaaaaaa9101', NULL, NULL, NULL, NULL, 1, 0, 10),
  ('bbbb9102-1111-4111-8111-bbbbbbbb9102', 'aaaa9101-1111-4111-8111-aaaaaaaa9101', NULL, NULL, NULL, NULL, 1, 0, 20),
  ('bbbb9103-1111-4111-8111-bbbbbbbb9103', 'aaaa9101-1111-4111-8111-aaaaaaaa9101', NULL, NULL, NULL, NULL, 1, 0, 30)

ON DUPLICATE KEY UPDATE
  `category_id`      = VALUES(`category_id`),
  `image_url`        = VALUES(`image_url`),
  `storage_asset_id` = VALUES(`storage_asset_id`),
  `alt`              = VALUES(`alt`),
  `icon`             = VALUES(`icon`),
  `is_active`        = VALUES(`is_active`),
  `is_featured`      = VALUES(`is_featured`),
  `display_order`    = VALUES(`display_order`);

-- =============================================================
-- 2) SUB CATEGORY I18N (TR + EN + DE)
-- =============================================================

INSERT INTO `sub_category_i18n`
(
  `sub_category_id`,
  `locale`,
  `name`,
  `slug`,
  `description`,
  `alt`
)
VALUES
  -- ==========================================================
  -- PRODUCT: SOĞUTMA KULELERİ (aaaa0001)
  -- ==========================================================
  ('bbbb0001-1111-4111-8111-bbbbbbbb0001','de','Endüstriyel Soğutma Kuleleri','endustriyel-sogutma-kuleleri',NULL,NULL),
  ('bbbb0002-1111-4111-8111-bbbbbbbb0002','de','HVAC Soğutma Kuleleri','hvac-sogutma-kuleleri',NULL,NULL),
  ('bbbb0003-1111-4111-8111-bbbbbbbb0003','de','Proses Soğutma Uygulamaları','proses-sogutma-uygulamalari',NULL,NULL),
  ('bbbb0004-1111-4111-8111-bbbbbbbb0004','de','Yüksek Kapasiteli Kuleler','yuksek-kapasiteli-kuleler',NULL,NULL),

  ('bbbb0001-1111-4111-8111-bbbbbbbb0001','en','Industrial Cooling Towers','industrial-cooling-towers',NULL,NULL),
  ('bbbb0002-1111-4111-8111-bbbbbbbb0002','en','HVAC Cooling Towers','hvac-cooling-towers',NULL,NULL),
  ('bbbb0003-1111-4111-8111-bbbbbbbb0003','en','Process Cooling Applications','process-cooling-applications',NULL,NULL),
  ('bbbb0004-1111-4111-8111-bbbbbbbb0004','en','High Capacity Towers','high-capacity-towers',NULL,NULL),

  ('bbbb0001-1111-4111-8111-bbbbbbbb0001','de','Industrielle Kühltürme','industrielle-kuehltuerme',NULL,NULL),
  ('bbbb0002-1111-4111-8111-bbbbbbbb0002','de','HVAC-Kühltürme','hvac-kuehltuerme',NULL,NULL),
  ('bbbb0003-1111-4111-8111-bbbbbbbb0003','de','Prozesskühlung Anwendungen','prozesskuehlung-anwendungen',NULL,NULL),
  ('bbbb0004-1111-4111-8111-bbbbbbbb0004','de','Hochleistungstürme','hochleistungstuerme',NULL,NULL),

  -- ==========================================================
  -- PRODUCT: AÇIK DEVRE SOĞUTMA KULELERİ (aaaa0002)
  -- ==========================================================
  ('bbbb0101-1111-4111-8111-bbbbbbbb0101','de','Doğrudan Temaslı Açık Devre Kuleler','dogrudan-temasli-acik-devre-kuleler',NULL,NULL),
  ('bbbb0102-1111-4111-8111-bbbbbbbb0102','de','Mekanik Çekişli Açık Devre Kuleler','mekanik-cekisli-acik-devre-kuleler',NULL,NULL),
  ('bbbb0103-1111-4111-8111-bbbbbbbb0103','de','Doğal Çekişli Açık Devre Kuleler','dogal-cekisli-acik-devre-kuleler',NULL,NULL),

  ('bbbb0101-1111-4111-8111-bbbbbbbb0101','en','Direct Contact Open Circuit Towers','direct-contact-open-circuit-towers',NULL,NULL),
  ('bbbb0102-1111-4111-8111-bbbbbbbb0102','en','Mechanical Draft Open Circuit Towers','mechanical-draft-open-circuit-towers',NULL,NULL),
  ('bbbb0103-1111-4111-8111-bbbbbbbb0103','en','Natural Draft Open Circuit Towers','natural-draft-open-circuit-towers',NULL,NULL),

  ('bbbb0101-1111-4111-8111-bbbbbbbb0101','de','Offene Kühltürme mit Direktkontakt','offene-kuehltuerme-direktkontakt',NULL,NULL),
  ('bbbb0102-1111-4111-8111-bbbbbbbb0102','de','Mechanisch belüftete offene Kühltürme','mechanisch-belueftete-offene-kuehltuerme',NULL,NULL),
  ('bbbb0103-1111-4111-8111-bbbbbbbb0103','de','Naturzug offene Kühltürme','naturzug-offene-kuehltuerme',NULL,NULL),

  -- ==========================================================
  -- PRODUCT: KAPALI DEVRE SOĞUTMA KULELERİ (aaaa0003)
  -- ==========================================================
  ('bbbb0201-1111-4111-8111-bbbbbbbb0201','de','Sıçratmalı Kapalı Devre Kuleler','sicratmali-kapali-devre-kuleler',NULL,NULL),
  ('bbbb0202-1111-4111-8111-bbbbbbbb0202','de','Film Tip Kapalı Devre Kuleler','film-tip-kapali-devre-kuleler',NULL,NULL),
  ('bbbb0203-1111-4111-8111-bbbbbbbb0203','de','Adyabatik Kapalı Devre Çözümler','adyabatik-kapali-devre-cozumler',NULL,NULL),

  ('bbbb0201-1111-4111-8111-bbbbbbbb0201','en','Spray Type Closed Circuit Towers','spray-type-closed-circuit-towers',NULL,NULL),
  ('bbbb0202-1111-4111-8111-bbbbbbbb0202','en','Film Type Closed Circuit Towers','film-type-closed-circuit-cooling-towers',NULL,NULL),
  ('bbbb0203-1111-4111-8111-bbbbbbbb0203','en','Adiabatic Closed Circuit Solutions','adiabatic-closed-circuit-solutions',NULL,NULL),

  ('bbbb0201-1111-4111-8111-bbbbbbbb0201','de','Sprüh-Typ geschlossene Kühltürme','sprueh-typ-geschlossene-kuehltuerme',NULL,NULL),
  ('bbbb0202-1111-4111-8111-bbbbbbbb0202','de','Film-Typ geschlossene Kühltürme','film-typ-geschlossene-kuehltuerme',NULL,NULL),
  ('bbbb0203-1111-4111-8111-bbbbbbbb0203','de','Adiabatische Lösungen (geschlossen)','adiabatische-loesungen-geschlossen',NULL,NULL),

  -- ==========================================================
  -- PRODUCT: HİBRİT SOĞUTMA SİSTEMLERİ (aaaa0004)
  -- ==========================================================
  ('bbbb0301-1111-4111-8111-bbbbbbbb0301','de','Hibrit Adyabatik Sistemler','hibrit-adyabatik-sistemler',NULL,NULL),
  ('bbbb0302-1111-4111-8111-bbbbbbbb0302','de','Hibrit Kule + Kuru Soğutucu','hibrit-kule-kuru-sogutucu',NULL,NULL),
  ('bbbb0303-1111-4111-8111-bbbbbbbb0303','de','Mevsimsel Hibrit Çözümler','mevsimsel-hibrit-cozumler',NULL,NULL),

  ('bbbb0301-1111-4111-8111-bbbbbbbb0301','en','Hybrid Adiabatic Systems','hybrid-adiabatic-systems',NULL,NULL),
  ('bbbb0302-1111-4111-8111-bbbbbbbb0302','en','Hybrid Tower + Dry Cooler','hybrid-tower-dry-cooler',NULL,NULL),
  ('bbbb0303-1111-4111-8111-bbbbbbbb0303','en','Seasonal Hybrid Solutions','seasonal-hybrid-solutions',NULL,NULL),

  ('bbbb0301-1111-4111-8111-bbbbbbbb0301','de','Hybrid-adiabatische Systeme','hybrid-adiabatische-systeme',NULL,NULL),
  ('bbbb0302-1111-4111-8111-bbbbbbbb0302','de','Hybridturm + Trockenkühler','hybridturm-trockenkuehler',NULL,NULL),
  ('bbbb0303-1111-4111-8111-bbbbbbbb0303','de','Saisonale Hybridlösungen','saisonale-hybridloesungen',NULL,NULL),

  -- ==========================================================
  -- PRODUCT: ISI TRANSFER ÇÖZÜMLERİ (aaaa0005)  (ADDED / FIX)
  -- ==========================================================
  ('bbbb0401-1111-4111-8111-bbbbbbbb0401','de','Eşanjör Çözümleri','esanjor-cozumleri',NULL,NULL),
  ('bbbb0402-1111-4111-8111-bbbbbbbb0402','de','Kuru Soğutucular (Dry Cooler)','kuru-sogutucular-dry-cooler',NULL,NULL),
  ('bbbb0403-1111-4111-8111-bbbbbbbb0403','de','Özel Isı Transfer Uygulamaları','ozel-isi-transfer-uygulamalari',NULL,NULL),

  ('bbbb0401-1111-4111-8111-bbbbbbbb0401','en','Heat Exchanger Solutions','heat-exchanger-solutions',NULL,NULL),
  ('bbbb0402-1111-4111-8111-bbbbbbbb0402','en','Dry Coolers','dry-coolers',NULL,NULL),
  ('bbbb0403-1111-4111-8111-bbbbbbbb0403','en','Custom Heat Transfer Applications','custom-heat-transfer-applications',NULL,NULL),

  ('bbbb0401-1111-4111-8111-bbbbbbbb0401','de','Wärmetauscher-Lösungen','waermetauscher-loesungen',NULL,NULL),
  ('bbbb0402-1111-4111-8111-bbbbbbbb0402','de','Trockenkühler','trockenkuehler',NULL,NULL),
  ('bbbb0403-1111-4111-8111-bbbbbbbb0403','de','Spezielle Wärmeübertragungs-Anwendungen','spezielle-waermeuebertragungs-anwendungen',NULL,NULL),

  -- ==========================================================
  -- SPAREPART (aaaa1001)
  -- ==========================================================
  ('bbbb1001-1111-4111-8111-bbbbbbbb1001','de','Kule Ana Bileşenleri','kule-ana-bilesenleri',NULL,NULL),
  ('bbbb1002-1111-4111-8111-bbbbbbbb1002','de','Yedek Parçalar ve Aksesuarlar','yedek-parcalar-ve-aksesuarlar',NULL,NULL),
  ('bbbb1003-1111-4111-8111-bbbbbbbb1003','de','Dolgu Malzemeleri','dolgu-malzemeleri',NULL,NULL),
  ('bbbb1004-1111-4111-8111-bbbbbbbb1004','de','Fan ve Motor Grubu','fan-ve-motor-grubu',NULL,NULL),
  ('bbbb1005-1111-4111-8111-bbbbbbbb1005','de','Isı Transfer ve Eşanjör','isi-transfer-ve-esanjor',NULL,NULL),
  ('bbbb1006-1111-4111-8111-bbbbbbbb1006','de','Pompa ve Sirkülasyon','pompa-ve-sirkulasyon',NULL,NULL),

  ('bbbb1001-1111-4111-8111-bbbbbbbb1001','en','Tower Main Components','tower-main-components',NULL,NULL),
  ('bbbb1002-1111-4111-8111-bbbbbbbb1002','en','Spare Parts & Accessories','spare-parts-accessories',NULL,NULL),
  ('bbbb1003-1111-4111-8111-bbbbbbbb1003','en','Fill Media','fill-media',NULL,NULL),
  ('bbbb1004-1111-4111-8111-bbbbbbbb1004','en','Fan & Motor Group','fan-motor-group',NULL,NULL),
  ('bbbb1005-1111-4111-8111-bbbbbbbb1005','en','Heat Transfer & Exchanger','heat-transfer-exchanger',NULL,NULL),
  ('bbbb1006-1111-4111-8111-bbbbbbbb1006','en','Pump & Circulation','pump-circulation',NULL,NULL),

  ('bbbb1001-1111-4111-8111-bbbbbbbb1001','de','Turm-Hauptkomponenten','turm-hauptkomponenten',NULL,NULL),
  ('bbbb1002-1111-4111-8111-bbbbbbbb1002','de','Ersatzteile & Zubehör','ersatzteile-zubehoer',NULL,NULL),
  ('bbbb1003-1111-4111-8111-bbbbbbbb1003','de','Füllkörper / Füllmaterial','fuellkoerper-fuellmaterial',NULL,NULL),
  ('bbbb1004-1111-4111-8111-bbbbbbbb1004','de','Ventilator- & Motorgruppe','ventilator-motorgruppe',NULL,NULL),
  ('bbbb1005-1111-4111-8111-bbbbbbbb1005','de','Wärmeübertragung & Wärmetauscher','waermeuebertragung-waermetauscher',NULL,NULL),
  ('bbbb1006-1111-4111-8111-bbbbbbbb1006','de','Pumpe & Umwälzung','pumpe-umwaelzung',NULL,NULL),

  -- ==========================================================
  -- REFERENCES – DOMESTIC (aaaa5002)
  -- ==========================================================
  ('bbbb5201-1111-4111-8111-bbbbbbbb5201','de','Enerji Santralleri','enerji-santralleri',NULL,NULL),
  ('bbbb5202-1111-4111-8111-bbbbbbbb5202','de','Petrokimya & Kimya Tesisleri','petrokimya-kimya-tesisleri',NULL,NULL),
  ('bbbb5203-1111-4111-8111-bbbbbbbb5203','de','Çimento & Madencilik','cimento-madencilik',NULL,NULL),
  ('bbbb5204-1111-4111-8111-bbbbbbbb5204','de','Gıda & İçecek Tesisleri','gida-icecek-tesisleri',NULL,NULL),
  ('bbbb5205-1111-4111-8111-bbbbbbbb5205','de','Çelik & Metal Sanayi','celik-metal-sanayi',NULL,NULL),
  ('bbbb5206-1111-4111-8111-bbbbbbbb5206','de','Otomotiv & Yan Sanayi','otomotiv-yan-sanayi',NULL,NULL),
  ('bbbb5207-1111-4111-8111-bbbbbbbb5207','de','AVM & Ticari Binalar','avm-ticari-binalar',NULL,NULL),
  ('bbbb5208-1111-4111-8111-bbbbbbbb5208','de','Veri Merkezi & Hastane','veri-merkezi-hastane',NULL,NULL),
  ('bbbb5209-1111-4111-8111-bbbbbbbb5209','de','Diğer Projeler','diger-projeler',NULL,NULL),

  ('bbbb5201-1111-4111-8111-bbbbbbbb5201','en','Power Plants','power-plants',NULL,NULL),
  ('bbbb5202-1111-4111-8111-bbbbbbbb5202','en','Petrochemical & Chemical Plants','petrochemical-chemical-plants',NULL,NULL),
  ('bbbb5203-1111-4111-8111-bbbbbbbb5203','en','Cement & Mining','cement-mining',NULL,NULL),
  ('bbbb5204-1111-4111-8111-bbbbbbbb5204','en','Food & Beverage Plants','food-beverage-plants',NULL,NULL),
  ('bbbb5205-1111-4111-8111-bbbbbbbb5205','en','Steel & Metal Industry','steel-metal-industry',NULL,NULL),
  ('bbbb5206-1111-4111-8111-bbbbbbbb5206','en','Automotive & Supplier Industry','automotive-supplier-industry',NULL,NULL),
  ('bbbb5207-1111-4111-8111-bbbbbbbb5207','en','Malls & Commercial Buildings','malls-commercial-buildings',NULL,NULL),
  ('bbbb5208-1111-4111-8111-bbbbbbbb5208','en','Data Centers & Hospitals','data-centers-hospitals',NULL,NULL),
  ('bbbb5209-1111-4111-8111-bbbbbbbb5209','en','Other Projects','other-projects',NULL,NULL),

  ('bbbb5201-1111-4111-8111-bbbbbbbb5201','de','KRAFTWERKE','kraftwerke',NULL,NULL),
  ('bbbb5202-1111-4111-8111-bbbbbbbb5202','de','PETROCHEMIE & CHEMIEANLAGEN','petrochemie-chemieanlagen',NULL,NULL),
  ('bbbb5203-1111-4111-8111-bbbbbbbb5203','de','ZEMENT & BERGBAU','zement-bergbau',NULL,NULL),
  ('bbbb5204-1111-4111-8111-bbbbbbbb5204','de','LEBENSMITTEL- & GETRÄNKEANLAGEN','lebensmittel-getraenkeanlagen',NULL,NULL),
  ('bbbb5205-1111-4111-8111-bbbbbbbb5205','de','STAHL- & METALLINDUSTRIE','stahl-metallindustrie',NULL,NULL),
  ('bbbb5206-1111-4111-8111-bbbbbbbb5206','de','AUTOMOBIL- & ZULIEFERINDUSTRIE','automobil-zulieferindustrie',NULL,NULL),
  ('bbbb5207-1111-4111-8111-bbbbbbbb5207','de','EINKAUFSZENTREN & GEWERBEGEBÄUDE','einkaufszentren-gewerbegebaeude',NULL,NULL),
  ('bbbb5208-1111-4111-8111-bbbbbbbb5208','de','RECHENZENTREN & KRANKENHÄUSER','rechenzentren-krankenhaeuser',NULL,NULL),
  ('bbbb5209-1111-4111-8111-bbbbbbbb5209','de','SONSTIGE PROJEKTE','sonstige-projekte',NULL,NULL),

  -- ==========================================================
  -- REFERENCES – INTERNATIONAL (aaaa5003)
  -- ==========================================================
  ('bbbb5301-1111-4111-8111-bbbbbbbb5301','de','Enerji Santralleri','enerji-santralleri-yurtdisi',NULL,NULL),
  ('bbbb5302-1111-4111-8111-bbbbbbbb5302','de','Petrokimya & Kimya Tesisleri','petrokimya-kimya-tesisleri-yurtdisi',NULL,NULL),
  ('bbbb5303-1111-4111-8111-bbbbbbbb5303','de','Çimento & Madencilik','cimento-madencilik-yurtdisi',NULL,NULL),
  ('bbbb5304-1111-4111-8111-bbbbbbbb5304','de','Gıda & İçecek Tesisleri','gida-icecek-tesisleri-yurtdisi',NULL,NULL),
  ('bbbb5305-1111-4111-8111-bbbbbbbb5305','de','Çelik & Metal Sanayi','celik-metal-sanayi-yurtdisi',NULL,NULL),
  ('bbbb5306-1111-4111-8111-bbbbbbbb5306','de','Otomotiv & Yan Sanayi','otomotiv-yan-sanayi-yurtdisi',NULL,NULL),
  ('bbbb5307-1111-4111-8111-bbbbbbbb5307','de','AVM & Ticari Binalar','avm-ticari-binalar-yurtdisi',NULL,NULL),
  ('bbbb5308-1111-4111-8111-bbbbbbbb5308','de','Veri Merkezi & Hastane','veri-merkezi-hastane-yurtdisi',NULL,NULL),
  ('bbbb5309-1111-4111-8111-bbbbbbbb5309','de','Diğer Projeler','diger-projeler-yurtdisi',NULL,NULL),

  ('bbbb5301-1111-4111-8111-bbbbbbbb5301','en','Power Plants','power-plants-international',NULL,NULL),
  ('bbbb5302-1111-4111-8111-bbbbbbbb5302','en','Petrochemical & Chemical Plants','petrochemical-chemical-plants-international',NULL,NULL),
  ('bbbb5303-1111-4111-8111-bbbbbbbb5303','en','Cement & Mining','cement-mining-international',NULL,NULL),
  ('bbbb5304-1111-4111-8111-bbbbbbbb5304','en','Food & Beverage Plants','food-beverage-plants-international',NULL,NULL),
  ('bbbb5305-1111-4111-8111-bbbbbbbb5305','en','Steel & Metal Industry','steel-metal-industry-international',NULL,NULL),
  ('bbbb5306-1111-4111-8111-bbbbbbbb5306','en','Automotive & Supplier Industry','automotive-supplier-industry-international',NULL,NULL),
  ('bbbb5307-1111-4111-8111-bbbbbbbb5307','en','Malls & Commercial Buildings','malls-commercial-buildings-international',NULL,NULL),
  ('bbbb5308-1111-4111-8111-bbbbbbbb5308','en','Data Centers & Hospitals','data-centers-hospitals-international',NULL,NULL),
  ('bbbb5309-1111-4111-8111-bbbbbbbb5309','en','Other Projects','other-projects-international',NULL,NULL),

  ('bbbb5301-1111-4111-8111-bbbbbbbb5301','de','KRAFTWERKE','kraftwerke-ausland',NULL,NULL),
  ('bbbb5302-1111-4111-8111-bbbbbbbb5302','de','PETROCHEMIE & CHEMIEANLAGEN','petrochemie-chemieanlagen-ausland',NULL,NULL),
  ('bbbb5303-1111-4111-8111-bbbbbbbb5303','de','ZEMENT & BERGBAU','zement-bergbau-ausland',NULL,NULL),
  ('bbbb5304-1111-4111-8111-bbbbbbbb5304','de','LEBENSMITTEL- & GETRÄNKEANLAGEN','lebensmittel-getraenkeanlagen-ausland',NULL,NULL),
  ('bbbb5305-1111-4111-8111-bbbbbbbb5305','de','STAHL- & METALLINDUSTRIE','stahl-metallindustrie-ausland',NULL,NULL),
  ('bbbb5306-1111-4111-8111-bbbbbbbb5306','de','AUTOMOBIL- & ZULIEFERINDUSTRIE','automobil-zulieferindustrie-ausland',NULL,NULL),
  ('bbbb5307-1111-4111-8111-bbbbbbbb5307','de','EINKAUFSZENTREN & GEWERBEGEBÄUDE','einkaufszentren-gewerbegebaeude-ausland',NULL,NULL),
  ('bbbb5308-1111-4111-8111-bbbbbbbb5308','de','RECHENZENTREN & KRANKENHÄUSER','rechenzentren-krankenhaeuser-ausland',NULL,NULL),
  ('bbbb5309-1111-4111-8111-bbbbbbbb5309','de','SONSTIGE PROJEKTE','sonstige-projekte-ausland',NULL,NULL),

  -- ==========================================================
  -- REST OF MODULES (UNCHANGED)  (NEWS/BLOG/SLIDER/LIBRARY/ABOUT/SERVICES/FAQ/TEAM)
  -- ==========================================================
  -- NEWS (aaaa2001)
  ('bbbb2001-1111-4111-8111-bbbbbbbb2001','de','Duyurular','duyurular',NULL,NULL),
  ('bbbb2002-1111-4111-8111-bbbbbbbb2002','de','Basın Bültenleri','basin-bultenleri',NULL,NULL),
  ('bbbb2003-1111-4111-8111-bbbbbbbb2003','de','Sektör Haberleri','sektor-haberleri',NULL,NULL),

  ('bbbb2001-1111-4111-8111-bbbbbbbb2001','en','Announcements','announcements',NULL,NULL),
  ('bbbb2002-1111-4111-8111-bbbbbbbb2002','en','Press Releases','press-releases',NULL,NULL),
  ('bbbb2003-1111-4111-8111-bbbbbbbb2003','en','Industry News','industry-news',NULL,NULL),

  ('bbbb2001-1111-4111-8111-bbbbbbbb2001','de','Ankündigungen','ankuendigungen',NULL,NULL),
  ('bbbb2002-1111-4111-8111-bbbbbbbb2002','de','Pressemitteilungen','pressemitteilungen',NULL,NULL),
  ('bbbb2003-1111-4111-8111-bbbbbbbb2003','de','Branchennachrichten','branchennachrichten',NULL,NULL),

  -- NEWS (aaaa2002)
  ('bbbb2101-1111-4111-8111-bbbbbbbb2101','de','Yeni Projeler','yeni-projeler',NULL,NULL),
  ('bbbb2102-1111-4111-8111-bbbbbbbb2102','de','Ödül ve Başarılar','odul-ve-basarilar',NULL,NULL),

  ('bbbb2101-1111-4111-8111-bbbbbbbb2101','en','New Projects','new-projects',NULL,NULL),
  ('bbbb2102-1111-4111-8111-bbbbbbbb2102','en','Awards & Achievements','awards-and-achievements',NULL,NULL),

  ('bbbb2101-1111-4111-8111-bbbbbbbb2101','de','Neue Projekte','neue-projekte',NULL,NULL),
  ('bbbb2102-1111-4111-8111-bbbbbbbb2102','de','Auszeichnungen & Erfolge','auszeichnungen-erfolge',NULL,NULL),

  -- NEWS (aaaa2003)
  ('bbbb2201-1111-4111-8111-bbbbbbbb2201','de','Genel Duyurular','genel-duyurular',NULL,NULL),
  ('bbbb2202-1111-4111-8111-bbbbbbbb2202','de','Bakım / Servis Duyuruları','bakim-servis-duyurulari',NULL,NULL),

  ('bbbb2201-1111-4111-8111-bbbbbbbb2201','en','General Announcements','general-announcements',NULL,NULL),
  ('bbbb2202-1111-4111-8111-bbbbbbbb2202','en','Maintenance / Service Announcements','maintenance-service-announcements',NULL,NULL),

  ('bbbb2201-1111-4111-8111-bbbbbbbb2201','de','Allgemeine Ankündigungen','allgemeine-ankuendigungen',NULL,NULL),
  ('bbbb2202-1111-4111-8111-bbbbbbbb2202','de','Wartung / Service Hinweise','wartung-service-hinweise',NULL,NULL),

  -- NEWS (aaaa2004)
  ('bbbb2301-1111-4111-8111-bbbbbbbb2301','de','Gazete & Dergi','gazete-dergi',NULL,NULL),
  ('bbbb2302-1111-4111-8111-bbbbbbbb2302','de','Online Haberler','online-haberler',NULL,NULL),

  ('bbbb2301-1111-4111-8111-bbbbbbbb2301','en','Newspaper & Magazine','newspaper-and-magazine',NULL,NULL),
  ('bbbb2302-1111-4111-8111-bbbbbbbb2302','en','Online News','online-news',NULL,NULL),

  ('bbbb2301-1111-4111-8111-bbbbbbbb2301','de','Zeitung & Magazin','zeitung-magazin',NULL,NULL),
  ('bbbb2302-1111-4111-8111-bbbbbbbb2302','de','Online-News','online-news',NULL,NULL),

  -- BLOG (aaaa3001)
  ('bbbb3001-1111-4111-8111-bbbbbbbb3001','de','Bakım Rehberleri','bakim-rehberleri',NULL,NULL),
  ('bbbb3002-1111-4111-8111-bbbbbbbb3002','de','Tasarım Önerileri','tasarim-onerileri',NULL,NULL),
  ('bbbb3003-1111-4111-8111-bbbbbbbb3003','de','Sık Sorulan Sorular','sik-sorulan-sorular-blog',NULL,NULL),

  ('bbbb3001-1111-4111-8111-bbbbbbbb3001','en','Maintenance Guides','maintenance-guides',NULL,NULL),
  ('bbbb3002-1111-4111-8111-bbbbbbbb3002','en','Design Tips','design-tips',NULL,NULL),
  ('bbbb3003-1111-4111-8111-bbbbbbbb3003','en','Frequently Asked Questions','frequently-asked-questions-blog',NULL,NULL),

  ('bbbb3001-1111-4111-8111-bbbbbbbb3001','de','Wartungsleitfäden','wartungsleitfaeden',NULL,NULL),
  ('bbbb3002-1111-4111-8111-bbbbbbbb3002','de','Design-Tipps','design-tipps',NULL,NULL),
  ('bbbb3003-1111-4111-8111-bbbbbbbb3003','de','Häufige Fragen','haeufige-fragen-blog',NULL,NULL),

  -- BLOG (aaaa3002)
  ('bbbb3101-1111-4111-8111-bbbbbbbb3101','de','Teknik Rehberler','teknik-rehberler',NULL,NULL),
  ('bbbb3102-1111-4111-8111-bbbbbbbb3102','de','Arıza Çözümleri','ariza-cozumleri',NULL,NULL),

  ('bbbb3101-1111-4111-8111-bbbbbbbb3101','en','Technical Guides','technical-guides',NULL,NULL),
  ('bbbb3102-1111-4111-8111-bbbbbbbb3102','en','Troubleshooting','troubleshooting',NULL,NULL),

  ('bbbb3101-1111-4111-8111-bbbbbbbb3101','de','Technische Leitfäden','technische-leitfaeden',NULL,NULL),
  ('bbbb3102-1111-4111-8111-bbbbbbbb3102','de','Fehlersuche','fehlersuche',NULL,NULL),

  -- BLOG (aaaa3003)
  ('bbbb3201-1111-4111-8111-bbbbbbbb3201','de','Pazar Analizi','pazar-analizi',NULL,NULL),
  ('bbbb3202-1111-4111-8111-bbbbbbbb3202','de','Trendler & Gelişmeler','trendler-gelismeler',NULL,NULL),

  ('bbbb3201-1111-4111-8111-bbbbbbbb3201','en','Market Analysis','market-analysis',NULL,NULL),
  ('bbbb3202-1111-4111-8111-bbbbbbbb3202','en','Trends & Developments','trends-and-developments',NULL,NULL),

  ('bbbb3201-1111-4111-8111-bbbbbbbb3201','de','Marktanalyse','marktanalyse',NULL,NULL),
  ('bbbb3202-1111-4111-8111-bbbbbbbb3202','de','Trends & Entwicklungen','trends-entwicklungen',NULL,NULL),

  -- BLOG (aaaa3004)
  ('bbbb3301-1111-4111-8111-bbbbbbbb3301','de','Genel Rehberler','genel-rehberler',NULL,NULL),
  ('bbbb3302-1111-4111-8111-bbbbbbbb3302','de','İlham Veren Hikayeler','ilham-veren-hikayeler',NULL,NULL),

  ('bbbb3301-1111-4111-8111-bbbbbbbb3301','en','General Guides','general-guides',NULL,NULL),
  ('bbbb3302-1111-4111-8111-bbbbbbbb3302','en','Inspiring Stories','inspiring-stories',NULL,NULL),

  ('bbbb3301-1111-4111-8111-bbbbbbbb3301','de','Allgemeine Leitfäden','allgemeine-leitfaeden',NULL,NULL),
  ('bbbb3302-1111-4111-8111-bbbbbbbb3302','de','Inspirierende Geschichten','inspirierende-geschichten',NULL,NULL),

  -- SLIDER (aaaa4001)
  ('bbbb4001-1111-4111-8111-bbbbbbbb4001','de','Ana Sayfa Sliderı','ana-sayfa-slideri',NULL,NULL),
  ('bbbb4002-1111-4111-8111-bbbbbbbb4002','de','Kampanya Sliderı','kampanya-slideri',NULL,NULL),

  ('bbbb4001-1111-4111-8111-bbbbbbbb4001','en','Homepage Slider','homepage-slider',NULL,NULL),
  ('bbbb4002-1111-4111-8111-bbbbbbbb4002','en','Campaign Slider','campaign-slider',NULL,NULL),

  ('bbbb4001-1111-4111-8111-bbbbbbbb4001','de','Startseiten-Slider','startseiten-slider',NULL,NULL),
  ('bbbb4002-1111-4111-8111-bbbbbbbb4002','de','Kampagnen-Slider','kampagnen-slider',NULL,NULL),

  -- LIBRARY (aaaa6001)
  ('bbbb6001-1111-4111-8111-bbbbbbbb6001','de','PDF Dokümanlar','pdf-dokumanlar',NULL,NULL),
  ('bbbb6002-1111-4111-8111-bbbbbbbb6002','de','Görsel Galeri','gorsel-galeri',NULL,NULL),
  ('bbbb6003-1111-4111-8111-bbbbbbbb6003','de','Video İçerikler','video-icerikler',NULL,NULL),

  ('bbbb6001-1111-4111-8111-bbbbbbbb6001','en','PDF Documents','pdf-documents',NULL,NULL),
  ('bbbb6002-1111-4111-8111-bbbbbbbb6002','en','Image Gallery','image-gallery',NULL,NULL),
  ('bbbb6003-1111-4111-8111-bbbbbbbb6003','en','Video Content','video-content',NULL,NULL),

  ('bbbb6001-1111-4111-8111-bbbbbbbb6001','de','PDF-Dokumente','pdf-dokumente',NULL,NULL),
  ('bbbb6002-1111-4111-8111-bbbbbbbb6002','de','Bildergalerie','bildergalerie',NULL,NULL),
  ('bbbb6003-1111-4111-8111-bbbbbbbb6003','de','Videoinhalte','videoinhalte',NULL,NULL),

  -- ABOUT (aaaa7001)
  ('bbbb7001-1111-4111-8111-bbbbbbbb7001','de','Hakkımızda','hakkimizda',NULL,NULL),
  ('bbbb7002-1111-4111-8111-bbbbbbbb7002','de','Misyon & Vizyon','misyon-vizyon',NULL,NULL),
  ('bbbb7003-1111-4111-8111-bbbbbbbb7003','de','İnsan Kaynakları','insan-kaynaklari',NULL,NULL),

  ('bbbb7001-1111-4111-8111-bbbbbbbb7001','en','About Us','about-us-page',NULL,NULL),
  ('bbbb7002-1111-4111-8111-bbbbbbbb7002','en','Mission & Vision','mission-and-vision',NULL,NULL),
  ('bbbb7003-1111-4111-8111-bbbbbbbb7003','en','Human Resources','human-resources',NULL,NULL),

  ('bbbb7001-1111-4111-8111-bbbbbbbb7001','de','Über uns','ueber-uns',NULL,NULL),
  ('bbbb7002-1111-4111-8111-bbbbbbbb7002','de','Mission & Vision','mission-vision',NULL,NULL),
  ('bbbb7003-1111-4111-8111-bbbbbbbb7003','de','Personal / Karriere','karriere',NULL,NULL),

  -- ABOUT (QUALITY)
  ('bbbb7004-1111-4111-8111-bbbbbbbb7004','de','Kalite & Sertifikalar','kalite-sertifikalar','Ensotek kalite yönetim yaklaşımı ve uluslararası sertifikalarımız.',NULL),
  ('bbbb7004-1111-4111-8111-bbbbbbbb7004','en','Quality & Certificates','quality-certificates','Ensotek quality management approach and internationally recognised certificates.',NULL),
  ('bbbb7004-1111-4111-8111-bbbbbbbb7004','de','Qualität & Zertifikate','qualitaet-zertifikate','Ensotek Qualitätsmanagement-Ansatz und international anerkannte Zertifikate.',NULL),

  -- ABOUT (LEGAL)
  ('bbbb7005-1111-4111-8111-bbbbbbbb7005','de','Gizlilik Politikası','gizlilik-politikasi','Ensotek gizlilik politikası ve kişisel verilerin korunmasına ilişkin yaklaşım.',NULL),
  ('bbbb7005-1111-4111-8111-bbbbbbbb7005','en','Privacy Policy','privacy-policy','Ensotek privacy policy and approach to protecting personal data.',NULL),
  ('bbbb7005-1111-4111-8111-bbbbbbbb7005','de','Datenschutzerklärung','datenschutzerklaerung','Ensotek Datenschutzerklärung und Ansatz zum Schutz personenbezogener Daten.',NULL),

  ('bbbb7006-1111-4111-8111-bbbbbbbb7006','de','KVKK','kvkk','6698 sayılı KVKK kapsamında kişisel verilerin işlenmesine ilişkin bilgilendirme.',NULL),
  ('bbbb7006-1111-4111-8111-bbbbbbbb7006','en','PDPL (KVKK)','pdpl-kvkk','Information regarding processing of personal data under Turkish PDPL (KVKK No. 6698).',NULL),
  ('bbbb7006-1111-4111-8111-bbbbbbbb7006','de','DSGVO / KVKK','dsgvo-kvkk','Information zur Verarbeitung personenbezogener Daten (DSGVO/KVKK-Kontext).',NULL),

  ('bbbb7007-1111-4111-8111-bbbbbbbb7007','de','Kullanım Koşulları','kullanim-kosullari','Web sitesi kullanım koşulları ve sorumluluk sınırları.',NULL),
  ('bbbb7007-1111-4111-8111-bbbbbbbb7007','en','Terms of Use','terms-of-use','Website terms of use and limitation of liability.',NULL),
  ('bbbb7007-1111-4111-8111-bbbbbbbb7007','de','Nutzungsbedingungen','nutzungsbedingungen','Nutzungsbedingungen der Website und Haftungsbeschränkung.',NULL),

  ('bbbb7008-1111-4111-8111-bbbbbbbb7008','de','Çerez Politikası','cerez-politikasi','Çerezlerin kullanımı ve tercih yönetimi.',NULL),
  ('bbbb7008-1111-4111-8111-bbbbbbbb7008','en','Cookie Policy','cookie-policy','Use of cookies and preference management.',NULL),
  ('bbbb7008-1111-4111-8111-bbbbbbbb7008','de','Cookie-Richtlinie','cookie-richtlinie','Verwendung von Cookies und Verwaltung der Einstellungen.',NULL),

  ('bbbb7009-1111-4111-8111-bbbbbbbb7009','de','Aydınlatma Metni','aydinlatma-metni','Kişisel verilerin işlenmesine dair aydınlatma metni.',NULL),
  ('bbbb7009-1111-4111-8111-bbbbbbbb7009','en','Information Notice','information-notice','Information notice regarding processing of personal data.',NULL),
  ('bbbb7009-1111-4111-8111-bbbbbbbb7009','de','Informationspflicht','informationspflicht','Informationspflichten zur Verarbeitung personenbezogener Daten.',NULL),

  ('bbbb7010-1111-4111-8111-bbbbbbbb7010','de','Yasal Bilgilendirme','yasal-bilgilendirme','Şirket bilgileri, yasal uyarılar ve sorumluluk reddi.',NULL),
  ('bbbb7010-1111-4111-8111-bbbbbbbb7010','en','Legal Notice','legal-notice','Company information, legal notices and disclaimers.',NULL),
  ('bbbb7010-1111-4111-8111-bbbbbbbb7010','de','Impressum / Rechtliche Hinweise','impressum-rechtliche-hinweise','Unternehmensangaben, rechtliche Hinweise und Haftungsausschluss.',NULL),

  -- SERVICES (aaaa8001) long descriptions (kept)
  ('bbbb8001-1111-4111-8111-bbbbbbbb8001','de','Üretim','uretim','Ensotek, endüstriyel su soğutma kuleleri üretiminde uzmandır. Açık ve kapalı devre FRP (cam elyaf takviyeli polyester) malzemeden, dayanıklı, uzun ömürlü ve yüksek kaliteli soğutma kuleleri üretir.',NULL),
  ('bbbb8002-1111-4111-8111-bbbbbbbb8002','de','Bakım ve Onarım','bakim-ve-onarim','Ensotek, endüstriyel su soğutma kulelerinizin sorunsuz çalışmasını sağlamak amacıyla periyodik bakım ve profesyonel onarım hizmetleri sunar. Deneyimli ekibimiz ile sistemlerinizin ömrünü uzatır ve performans kaybını önleriz. Mevcut soğutma kulelerinin verimliliğini sağlamak için düzenli bakım ve onarım hizmetleri sunuyoruz.',NULL),
  ('bbbb8003-1111-4111-8111-bbbbbbbb8003','de','Modernizasyon','modernizasyon','Ensotek, mevcut su soğutma kulelerinin daha verimli ve güncel standartlara uygun çalışabilmesi için modernizasyon çözümleri sunar. Eskiyen sistemlerinizi daha düşük maliyetle yenilemek ve enerji verimliliğini artırmak mümkündür. Eski soğutma kulelerinin performansını artırmak için modernizasyon hizmetleri sunuyoruz.',NULL),
  ('bbbb8004-1111-4111-8111-bbbbbbbb8004','de','Yedek Parçalar ve Bileşenler','yedek-parcalar-ve-bilesenler','Ensotek, su soğutma kuleleri için geniş bir yedek parça ve bileşen portföyü sunar. Tüm yedek parçalarımız, kulelerinizin uzun ömürlü ve verimli çalışması için kaliteli ve güvenilirdir. Soğutma kulelerinin sorunsuz çalışmasını sağlamak için geniş yedek parça ve bileşen seçenekleri sunuyoruz.',NULL),
  ('bbbb8005-1111-4111-8111-bbbbbbbb8005','de','Uygulamalar ve Referanslar','uygulamalar-ve-referanslar','Ensotek, endüstriyel ve ticari alanlarda çok sayıda referans projeye ve uygulamaya sahiptir. Enerji, kimya, gıda, ilaç, otomotiv ve daha birçok sektörde su soğutma kuleleriyle yerli ve yabancı yüzlerce projeye çözüm sunmuştur. Deneyimimiz ve uzman ekibimiz sayesinde müşterilerimizin farklı ihtiyaçlarına uygun, uzun ömürlü ve verimli soğutma sistemleri sağlıyoruz. Referanslarımız ve uygulama örneklerimiz, yüksek kalite ve güvenin göstergesidir.',NULL),
  ('bbbb8006-1111-4111-8111-bbbbbbbb8006','de','Mühendislik Desteği','muhendislik-destegi','Ensotek, projelendirme, danışmanlık, sistem optimizasyonu, performans analizi ve teknik eğitim dahil olmak üzere kapsamlı mühendislik destek hizmetleri sağlar. Uzman mühendislerimiz, projelerin tasarımından devreye alınmasına kadar her aşamada müşterilerimizin yanında olur. En iyi verim, düşük maliyet ve uzun ömürlü çözümler için profesyonel destek sunuyoruz. Ensotek, müşterilerine soğutma kuleleri alanında uzman mühendislik desteği sunar.',NULL),

  ('bbbb8001-1111-4111-8111-bbbbbbbb8001','en','Production','production','Ensotek is specialized in manufacturing industrial water cooling towers. The production covers durable, long life open and closed circuit FRP cooling towers with high quality standards.',NULL),
  ('bbbb8002-1111-4111-8111-bbbbbbbb8002','en','Maintenance & Repair','maintenance-and-repair','Ensotek provides periodic maintenance and professional repair services for industrial water cooling towers, extending system lifetime and preserving performance and efficiency.',NULL),
  ('bbbb8003-1111-4111-8111-bbbbbbbb8003','en','Modernization','modernization','Ensotek offers modernization solutions to bring existing cooling towers up to current efficiency and performance standards, increasing energy efficiency with lower investment costs.',NULL),
  ('bbbb8004-1111-4111-8111-bbbbbbbb8004','en','Spare Parts & Components','spare-parts-and-components','Ensotek supplies a wide portfolio of spare parts and components for cooling towers, ensuring reliable, long life and efficient operation of your systems.',NULL),
  ('bbbb8005-1111-4111-8111-bbbbbbbb8005','en','Applications & References','applications-and-references','Ensotek has many reference projects and applications in industrial and commercial fields, delivering long life and efficient cooling tower solutions for energy, chemical, food, pharmaceutical, automotive and many other sectors.',NULL),
  ('bbbb8006-1111-4111-8111-bbbbbbbb8006','en','Engineering Support','engineering-support','Ensotek provides comprehensive engineering support for cooling tower projects, including design, consulting, system optimisation, performance analysis and technical training from concept to commissioning.',NULL),

  ('bbbb8001-1111-4111-8111-bbbbbbbb8001','de','Produktion','produktion','Ensotek ist spezialisiert auf die Herstellung industrieller Wasserkühltürme. Wir produzieren langlebige, hochwertige offene und geschlossene FRP-Kühltürme nach hohen Qualitätsstandards.',NULL),
  ('bbbb8002-1111-4111-8111-bbbbbbbb8002','de','Wartung & Reparatur','wartung-reparatur','Ensotek bietet regelmäßige Wartung und professionelle Reparatur für industrielle Wasserkühltürme, verlängert die Lebensdauer der Systeme und verhindert Leistungs- und Effizienzverluste.',NULL),
  ('bbbb8003-1111-4111-8111-bbbbbbbb8003','de','Modernisierung','modernisierung','Ensotek bietet Modernisierungslösungen, um bestehende Kühltürme auf aktuelle Effizienz- und Leistungsstandards zu bringen und die Energieeffizienz mit geringeren Investitionskosten zu steigern.',NULL),
  ('bbbb8004-1111-4111-8111-bbbbbbbb8004','de','Ersatzteile & Komponenten','ersatzteile-komponenten','Ensotek liefert ein breites Portfolio an Ersatzteilen und Komponenten für Kühltürme und gewährleistet einen zuverlässigen, langlebigen und effizienten Betrieb Ihrer Anlagen.',NULL),
  ('bbbb8005-1111-4111-8111-bbbbbbbb8005','de','Anwendungen & Referenzen','anwendungen-referenzen','Ensotek verfügt über zahlreiche Referenzprojekte in Industrie und Gewerbe und liefert langlebige, effiziente Kühlturmlösungen für Energie, Chemie, Lebensmittel, Pharma, Automotive und weitere Branchen.',NULL),
  ('bbbb8006-1111-4111-8111-bbbbbbbb8006','de','Engineering-Support','engineering-support','Ensotek bietet umfassenden Engineering-Support für Kühlturmprojekte – von Auslegung und Beratung über Systemoptimierung und Performance-Analyse bis hin zu Schulungen und Inbetriebnahme.',NULL),

  -- FAQ (aaaa9001)
  ('bbbb9001-1111-4111-8111-bbbbbbbb9001','de','Genel Sorular','genel-sorular',NULL,NULL),
  ('bbbb9002-1111-4111-8111-bbbbbbbb9002','de','Ürünler Hakkında','urunler-hakkinda',NULL,NULL),
  ('bbbb9003-1111-4111-8111-bbbbbbbb9003','de','Teknik Destek','teknik-destek',NULL,NULL),
  ('bbbb9004-1111-4111-8111-bbbbbbbb9004','de','Bakım ve Servis','bakim-ve-servis',NULL,NULL),

  ('bbbb9001-1111-4111-8111-bbbbbbbb9001','en','General Questions','general-questions',NULL,NULL),
  ('bbbb9002-1111-4111-8111-bbbbbbbb9002','en','About Products','about-products',NULL,NULL),
  ('bbbb9003-1111-4111-8111-bbbbbbbb9003','en','Technical Support','technical-support',NULL,NULL),
  ('bbbb9004-1111-4111-8111-bbbbbbbb9004','en','Maintenance & Service','maintenance-and-service',NULL,NULL),

  ('bbbb9001-1111-4111-8111-bbbbbbbb9001','de','Allgemeine Fragen','allgemeine-fragen',NULL,NULL),
  ('bbbb9002-1111-4111-8111-bbbbbbbb9002','de','Zu den Produkten','zu-den-produkten',NULL,NULL),
  ('bbbb9003-1111-4111-8111-bbbbbbbb9003','de','Technischer Support','technischer-support',NULL,NULL),
  ('bbbb9004-1111-4111-8111-bbbbbbbb9004','de','Wartung & Service','wartung-service',NULL,NULL),

  -- TEAM (aaaa9101)
  ('bbbb9101-1111-4111-8111-bbbbbbbb9101','de','Yönetim ve Kurucu Ortaklar','yonetim-ve-kurucu-ortaklar',NULL,NULL),
  ('bbbb9102-1111-4111-8111-bbbbbbbb9102','de','Mühendislik Ekibi','muhendislik-ekibi',NULL,NULL),
  ('bbbb9103-1111-4111-8111-bbbbbbbb9103','de','Saha ve Servis Ekibi','saha-ve-servis-ekibi',NULL,NULL),

  ('bbbb9101-1111-4111-8111-bbbbbbbb9101','en','Management & Founders','management-and-founders',NULL,NULL),
  ('bbbb9102-1111-4111-8111-bbbbbbbb9102','en','Engineering Team','engineering-team',NULL,NULL),
  ('bbbb9103-1111-4111-8111-bbbbbbbb9103','en','Field & Service Team','field-and-service-team',NULL,NULL),

  ('bbbb9101-1111-4111-8111-bbbbbbbb9101','de','Management & Gründer','management-gruender',NULL,NULL),
  ('bbbb9102-1111-4111-8111-bbbbbbbb9102','de','Engineering-Team','engineering-team',NULL,NULL),
  ('bbbb9103-1111-4111-8111-bbbbbbbb9103','de','Außendienst & Service-Team','aussendienst-service-team',NULL,NULL)

ON DUPLICATE KEY UPDATE
  `name`        = VALUES(`name`),
  `slug`        = VALUES(`slug`),
  `description` = VALUES(`description`),
  `alt`         = VALUES(`alt`);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
