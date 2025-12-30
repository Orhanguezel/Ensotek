-- ============================================================
-- FILE: 171_menu_items_seed.sql (FINAL / STANDARD)  ✅ UPDATED
-- menu_items (parent) + menu_items_i18n (tr, en, de)
-- Ensotek – Header + Footer (FINAL, no inactive)
-- Standard:
--  ✅ NO constants for submenu ids (no SET @...)
--  ✅ menu_items_i18n.id => UUID() (CHAR(36))
--  ✅ Re-runnable UPSERT relies on UNIQUE(menu_item_id, locale)
--  ✅ Service submenu URLs use stable service slugs (same across locales)
--  ✅ Library submenu URLs are locale-specific and live under /library/{slug}
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;

-- ============================================================
-- 1) PARENT (menu_items)
-- ============================================================
INSERT INTO `menu_items`
(`id`, `parent_id`, `location`, `section_id`, `type`, `page_id`, `icon`, `order_num`, `is_active`)
VALUES
-- ------------------------
-- HEADER ROOT
-- ------------------------
('fe8120b3-919a-49b8-8035-df6fd2a2433f', NULL, 'header', NULL, 'custom', NULL, NULL, 0, 1), -- Home
('25740da6-c0f2-4c1d-b131-998018699bfd', NULL, 'header', NULL, 'custom', NULL, NULL, 1, 1), -- About
('c47a1c3f-cea1-4780-9381-77336bc8ac59', NULL, 'header', NULL, 'custom', NULL, NULL, 2, 1), -- Services
('f2570596-db46-4028-902c-d6fe2c9a8312', NULL, 'header', NULL, 'custom', NULL, NULL, 3, 1), -- Products
('ceed431a-aafb-4aba-bf1f-6217b3960c01', NULL, 'header', NULL, 'custom', NULL, NULL, 6, 1), -- Library
('33333333-4444-5555-6666-777777777777', NULL, 'header', NULL, 'custom', NULL, NULL, 7, 1), -- News
('555c6ddf-658b-4c0f-8a9e-0b104708dd07', NULL, 'header', NULL, 'custom', NULL, NULL, 8, 1), -- Blog
('455c6ddf-658b-4c0f-8a9e-0b104708dd07', NULL, 'header', NULL, 'custom', NULL, NULL, 9, 1), -- Contact

-- ------------------------
-- ABOUT SUBMENUS
-- ------------------------
('aaaa1111-2222-3333-4444-555555555555', '25740da6-c0f2-4c1d-b131-998018699bfd', 'header', NULL, 'custom', NULL, NULL, 0, 1), -- About
('aaaa1111-2222-3333-4444-666666666666', '25740da6-c0f2-4c1d-b131-998018699bfd', 'header', NULL, 'custom', NULL, NULL, 1, 1), -- Mission & Vision
('aaaa1111-2222-3333-4444-777777777777', '25740da6-c0f2-4c1d-b131-998018699bfd', 'header', NULL, 'custom', NULL, NULL, 2, 1), -- Quality
('aaaa1111-2222-3333-4444-888888888888', '25740da6-c0f2-4c1d-b131-998018699bfd', 'header', NULL, 'custom', NULL, NULL, 3, 1), -- Team
('aaaa1111-2222-3333-4444-999999999999', '25740da6-c0f2-4c1d-b131-998018699bfd', 'header', NULL, 'custom', NULL, NULL, 4, 1), -- FAQs

-- ------------------------
-- SERVICES SUBMENUS (9 items)  ✅ stable ids, NO vars
-- ------------------------
('5a000001-1111-4111-8111-5a0000000001', 'c47a1c3f-cea1-4780-9381-77336bc8ac59', 'header', NULL, 'custom', NULL, NULL, 0, 1),
('5a000002-1111-4111-8111-5a0000000002', 'c47a1c3f-cea1-4780-9381-77336bc8ac59', 'header', NULL, 'custom', NULL, NULL, 1, 1),
('5a000003-1111-4111-8111-5a0000000003', 'c47a1c3f-cea1-4780-9381-77336bc8ac59', 'header', NULL, 'custom', NULL, NULL, 2, 1),
('5a000004-1111-4111-8111-5a0000000004', 'c47a1c3f-cea1-4780-9381-77336bc8ac59', 'header', NULL, 'custom', NULL, NULL, 3, 1),
('5a000005-1111-4111-8111-5a0000000005', 'c47a1c3f-cea1-4780-9381-77336bc8ac59', 'header', NULL, 'custom', NULL, NULL, 4, 1),
('5a000006-1111-4111-8111-5a0000000006', 'c47a1c3f-cea1-4780-9381-77336bc8ac59', 'header', NULL, 'custom', NULL, NULL, 5, 1),
('5a000007-1111-4111-8111-5a0000000007', 'c47a1c3f-cea1-4780-9381-77336bc8ac59', 'header', NULL, 'custom', NULL, NULL, 6, 1),
('5a000008-1111-4111-8111-5a0000000008', 'c47a1c3f-cea1-4780-9381-77336bc8ac59', 'header', NULL, 'custom', NULL, NULL, 7, 1),
('5a000009-1111-4111-8111-5a0000000009', 'c47a1c3f-cea1-4780-9381-77336bc8ac59', 'header', NULL, 'custom', NULL, NULL, 8, 1),

-- ------------------------
-- PRODUCTS SUBMENUS
-- ------------------------
('88888888-1111-2222-3333-444444444444', 'f2570596-db46-4028-902c-d6fe2c9a8312', 'header', NULL, 'custom', NULL, NULL, 0, 1),
('88888888-1111-2222-3333-555555555555', 'f2570596-db46-4028-902c-d6fe2c9a8312', 'header', NULL, 'custom', NULL, NULL, 1, 1),

-- ------------------------
-- LIBRARY SUBMENUS (4 items) ✅ NEW
-- ------------------------
('7b000001-1111-4111-8111-7b0000000001', 'ceed431a-aafb-4aba-bf1f-6217b3960c01', 'header', NULL, 'custom', NULL, NULL, 0, 1),
('7b000002-1111-4111-8111-7b0000000002', 'ceed431a-aafb-4aba-bf1f-6217b3960c01', 'header', NULL, 'custom', NULL, NULL, 1, 1),
('7b000003-1111-4111-8111-7b0000000003', 'ceed431a-aafb-4aba-bf1f-6217b3960c01', 'header', NULL, 'custom', NULL, NULL, 2, 1),

-- ------------------------
-- FOOTER: QUICK ACCESS
-- ------------------------
('6a4f6b37-ed99-4d98-8c54-d658096aacde', NULL, 'footer', '59583ef1-0ba1-4c7c-b806-84fd204b52b9', 'custom', NULL, NULL, 0, 1), -- FAQs
('b0d7d0c1-2c5d-4a9c-9d7f-0e2a6c6f1111', NULL, 'footer', '59583ef1-0ba1-4c7c-b806-84fd204b52b9', 'custom', NULL, NULL, 1, 1), -- About
('b0d7d0c1-2c5d-4a9c-9d7f-0e2a6c6f1112', NULL, 'footer', '59583ef1-0ba1-4c7c-b806-84fd204b52b9', 'custom', NULL, NULL, 2, 1), -- Services
('b0d7d0c1-2c5d-4a9c-9d7f-0e2a6c6f1113', NULL, 'footer', '59583ef1-0ba1-4c7c-b806-84fd204b52b9', 'custom', NULL, NULL, 3, 1), -- Products
('b0d7d0c1-2c5d-4a9c-9d7f-0e2a6c6f1114', NULL, 'footer', '59583ef1-0ba1-4c7c-b806-84fd204b52b9', 'custom', NULL, NULL, 4, 1), -- Library
('b0d7d0c1-2c5d-4a9c-9d7f-0e2a6c6f1115', NULL, 'footer', '59583ef1-0ba1-4c7c-b806-84fd204b52b9', 'custom', NULL, NULL, 5, 1), -- News
('b0d7d0c1-2c5d-4a9c-9d7f-0e2a6c6f1116', NULL, 'footer', '59583ef1-0ba1-4c7c-b806-84fd204b52b9', 'custom', NULL, NULL, 6, 1), -- Blog
('b0d7d0c1-2c5d-4a9c-9d7f-0e2a6c6f1117', NULL, 'footer', '59583ef1-0ba1-4c7c-b806-84fd204b52b9', 'custom', NULL, NULL, 7, 1), -- Contact

-- ------------------------
-- FOOTER: SERVICES (2 links)
-- ------------------------
('c9a7e2a1-0b6b-45e9-9b8c-3f6d2a111111', NULL, 'footer', 'a0e2b2a9-7f0d-4f30-9a64-3ed7bd1d3c10', 'custom', NULL, NULL, 0, 1),
('c9a7e2a1-0b6b-45e9-9b8c-3f6d2a111112', NULL, 'footer', 'a0e2b2a9-7f0d-4f30-9a64-3ed7bd1d3c10', 'custom', NULL, NULL, 1, 1),

-- ------------------------
-- FOOTER: CORPORATE / LEGAL
-- ------------------------
('71c28444-7b6e-47ae-92be-f59206a1b820', NULL, 'footer', 'f942a930-6743-4ecc-b4b3-1fd6b77f9d77', 'custom', NULL, NULL, 0, 1),
('3d325c92-d59e-4730-8301-5c9bcff463bc', NULL, 'footer', 'f942a930-6743-4ecc-b4b3-1fd6b77f9d77', 'custom', NULL, NULL, 1, 1),
('24c49639-01d0-4274-8fb9-c31ed64d0726', NULL, 'footer', 'f942a930-6743-4ecc-b4b3-1fd6b77f9d77', 'custom', NULL, NULL, 2, 1),
('b6a6f5d1-8e1a-4a1c-9b0f-1c7a0d111111', NULL, 'footer', 'f942a930-6743-4ecc-b4b3-1fd6b77f9d77', 'custom', NULL, NULL, 3, 1),
('b6a6f5d1-8e1a-4a1c-9b0f-1c7a0d111112', NULL, 'footer', 'f942a930-6743-4ecc-b4b3-1fd6b77f9d77', 'custom', NULL, NULL, 4, 1),
('b6a6f5d1-8e1a-4a1c-9b0f-1c7a0d111113', NULL, 'footer', 'f942a930-6743-4ecc-b4b3-1fd6b77f9d77', 'custom', NULL, NULL, 5, 1),

-- ------------------------
-- FOOTER: SOCIAL
-- ------------------------
('a9b1c2d3-e4f5-4a66-8b11-111111111111', NULL, 'footer', 'b3b7e7b2-7d75-4c5f-9b9d-8f0d3c1a0d77', 'custom', NULL, 'linkedin', 0, 1),
('a9b1c2d3-e4f5-4a66-8b11-222222222222', NULL, 'footer', 'b3b7e7b2-7d75-4c5f-9b9d-8f0d3c1a0d77', 'custom', NULL, 'instagram', 1, 1),
('a9b1c2d3-e4f5-4a66-8b11-333333333333', NULL, 'footer', 'b3b7e7b2-7d75-4c5f-9b9d-8f0d3c1a0d77', 'custom', NULL, 'youtube', 2, 1),
('a9b1c2d3-e4f5-4a66-8b11-444444444444', NULL, 'footer', 'b3b7e7b2-7d75-4c5f-9b9d-8f0d3c1a0d77', 'custom', NULL, 'x', 3, 1)
ON DUPLICATE KEY UPDATE
  `parent_id`  = VALUES(`parent_id`),
  `location`   = VALUES(`location`),
  `section_id` = VALUES(`section_id`),
  `type`       = VALUES(`type`),
  `page_id`    = VALUES(`page_id`),
  `icon`       = VALUES(`icon`),
  `order_num`  = VALUES(`order_num`),
  `is_active`  = VALUES(`is_active`),
  `updated_at` = CURRENT_TIMESTAMP(3);

-- ============================================================
-- 2) I18N (tr)
-- ============================================================
INSERT INTO `menu_items_i18n`
(`id`, `menu_item_id`, `locale`, `title`, `url`, `created_at`, `updated_at`)
VALUES
(UUID(),'fe8120b3-919a-49b8-8035-df6fd2a2433f','tr','Anasayfa','/','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'25740da6-c0f2-4c1d-b131-998018699bfd','tr','Kurumsal','/about','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'c47a1c3f-cea1-4780-9381-77336bc8ac59','tr','Hizmetler','/service','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'f2570596-db46-4028-902c-d6fe2c9a8312','tr','Ürünler','/product','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'ceed431a-aafb-4aba-bf1f-6217b3960c01','tr','Kütüphane','/library','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'33333333-4444-5555-6666-777777777777','tr','Haberler','/news','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'555c6ddf-658b-4c0f-8a9e-0b104708dd07','tr','Blog','/blog','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'455c6ddf-658b-4c0f-8a9e-0b104708dd07','tr','İletişim','/contact','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),'aaaa1111-2222-3333-4444-555555555555','tr','Hakkımızda','/about','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'aaaa1111-2222-3333-4444-666666666666','tr','Misyon & Vizyon','/mission-vision','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'aaaa1111-2222-3333-4444-777777777777','tr','Kalite','/quality','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'aaaa1111-2222-3333-4444-888888888888','tr','Ekip','/team','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'aaaa1111-2222-3333-4444-999999999999','tr','Sıkça Sorulan Sorular','/faqs','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

-- Services submenu URLs = stable slugs
(UUID(),'5a000001-1111-4111-8111-5a0000000001','tr','Bakım & Onarım','/service/maintenance-repair','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000002-1111-4111-8111-5a0000000002','tr','Modernizasyon','/service/modernization-retrofit','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000003-1111-4111-8111-5a0000000003','tr','Yedek Parçalar','/service/spare-parts-components','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000004-1111-4111-8111-5a0000000004','tr','Otomasyon & SCADA','/service/automation-scada','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000005-1111-4111-8111-5a0000000005','tr','Mühendislik','/service/engineering-support','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000006-1111-4111-8111-5a0000000006','tr','Keşif & Proje','/service/site-survey-engineering','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000007-1111-4111-8111-5a0000000007','tr','Optimizasyon','/service/performance-optimization','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000008-1111-4111-8111-5a0000000008','tr','Kurulum & Devreye Alma','/service/commissioning-startup','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000009-1111-4111-8111-5a0000000009','tr','Acil Servis','/service/emergency-response','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

-- ✅ Library submenu (TR) under /library/{slug}
(UUID(),'7b000001-1111-4111-8111-7b0000000001','tr','Su Soğutma Kulesi','/library/su-sogutma-kulesi-nedir-cesitleri-nelerdir-nasil-calisir','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'7b000002-1111-4111-8111-7b0000000002','tr','Kule Özellikleri','/library/ensotek-sogutma-kulelerinin-ozellikleri','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'7b000003-1111-4111-8111-7b0000000003','tr','Kule Seçimi','/library/kule-secimi-icin-gerekli-bilgiler','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),'88888888-1111-2222-3333-444444444444','tr','Tüm Ürünler','/product','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'88888888-1111-2222-3333-555555555555','tr','Yedek Parçalar','/sparepart','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),'6a4f6b37-ed99-4d98-8c54-d658096aacde','tr','SSS','/faqs','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'b0d7d0c1-2c5d-4a9c-9d7f-0e2a6c6f1111','tr','Hakkımızda','/about','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'b0d7d0c1-2c5d-4a9c-9d7f-0e2a6c6f1112','tr','Hizmetler','/service','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'b0d7d0c1-2c5d-4a9c-9d7f-0e2a6c6f1113','tr','Ürünler','/product','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'b0d7d0c1-2c5d-4a9c-9d7f-0e2a6c6f1114','tr','Kütüphane','/library','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'b0d7d0c1-2c5d-4a9c-9d7f-0e2a6c6f1115','tr','Haberler','/news','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'b0d7d0c1-2c5d-4a9c-9d7f-0e2a6c6f1116','tr','Blog','/blog','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'b0d7d0c1-2c5d-4a9c-9d7f-0e2a6c6f1117','tr','İletişim','/contact','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),'c9a7e2a1-0b6b-45e9-9b8c-3f6d2a111111','tr','Periyodik Bakım ve Onarım','/service/maintenance-repair','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'c9a7e2a1-0b6b-45e9-9b8c-3f6d2a111112','tr','Modernizasyon ve Retrofit','/service/modernization-retrofit','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),'71c28444-7b6e-47ae-92be-f59206a1b820','tr','Gizlilik Politikası','/privacy-policy','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'3d325c92-d59e-4730-8301-5c9bcff463bc','tr','KVKK','/kvkk','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'24c49639-01d0-4274-8fb9-c31ed64d0726','tr','Kullanım Koşulları','/terms','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'b6a6f5d1-8e1a-4a1c-9b0f-1c7a0d111111','tr','Çerez Politikası','/cookie-policy','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'b6a6f5d1-8e1a-4a1c-9b0f-1c7a0d111112','tr','Aydınlatma Metni','/privacy-notice','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'b6a6f5d1-8e1a-4a1c-9b0f-1c7a0d111113','tr','Yasal Bilgilendirme','/legal-notice','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),'a9b1c2d3-e4f5-4a66-8b11-111111111111','tr','LinkedIn','https://www.linkedin.com/company/ensotek','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'a9b1c2d3-e4f5-4a66-8b11-222222222222','tr','Instagram','https://www.instagram.com/ensotek','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'a9b1c2d3-e4f5-4a66-8b11-333333333333','tr','YouTube','https://www.youtube.com/@ensotek','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'a9b1c2d3-e4f5-4a66-8b11-444444444444','tr','X','https://x.com/ensotek','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
  `title`      = VALUES(`title`),
  `url`        = VALUES(`url`),
  `updated_at` = CURRENT_TIMESTAMP(3);

-- ============================================================
-- 3) I18N (en)
-- ============================================================
INSERT INTO `menu_items_i18n`
(`id`, `menu_item_id`, `locale`, `title`, `url`, `created_at`, `updated_at`)
VALUES
(UUID(),'fe8120b3-919a-49b8-8035-df6fd2a2433f','en','Home','/','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'25740da6-c0f2-4c1d-b131-998018699bfd','en','Organisation','/about','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'c47a1c3f-cea1-4780-9381-77336bc8ac59','en','Services','/service','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'f2570596-db46-4028-902c-d6fe2c9a8312','en','Products','/product','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'ceed431a-aafb-4aba-bf1f-6217b3960c01','en','Library','/library','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'33333333-4444-5555-6666-777777777777','en','News','/news','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'555c6ddf-658b-4c0f-8a9e-0b104708dd07','en','Blog','/blog','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'455c6ddf-658b-4c0f-8a9e-0b104708dd07','en','Contact','/contact','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),'aaaa1111-2222-3333-4444-555555555555','en','About','/about','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'aaaa1111-2222-3333-4444-666666666666','en','Mission & Vision','/mission-vision','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'aaaa1111-2222-3333-4444-777777777777','en','Quality','/quality','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'aaaa1111-2222-3333-4444-888888888888','en','Team','/team','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'aaaa1111-2222-3333-4444-999999999999','en','FAQs','/faqs','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),'5a000001-1111-4111-8111-5a0000000001','en','Maintenance','/service/maintenance-repair','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000002-1111-4111-8111-5a0000000002','en','Modernization','/service/modernization-retrofit','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000003-1111-4111-8111-5a0000000003','en','Spare Parts','/service/spare-parts-components','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000004-1111-4111-8111-5a0000000004','en','Automation / SCADA','/service/automation-scada','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000005-1111-4111-8111-5a0000000005','en','Engineering','/service/engineering-support','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000006-1111-4111-8111-5a0000000006','en','Survey & Design','/service/site-survey-engineering','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000007-1111-4111-8111-5a0000000007','en','Optimization','/service/performance-optimization','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000008-1111-4111-8111-5a0000000008','en','Commissioning','/service/commissioning-startup','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000009-1111-4111-8111-5a0000000009','en','Emergency','/service/emergency-response','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

-- ✅ Library submenu (EN) under /library/{slug}
(UUID(),'7b000001-1111-4111-8111-7b0000000001','en','Cooling Tower','/library/what-is-a-water-cooling-tower-types-and-working-principle','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'7b000002-1111-4111-8111-7b0000000002','en','Tower Features','/library/features-of-ensotek-cooling-towers','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'7b000003-1111-4111-8111-7b0000000003','en','Selection Info','/library/information-required-for-cooling-tower-selection','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),'88888888-1111-2222-3333-444444444444','en','All Products','/product','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'88888888-1111-2222-3333-555555555555','en','Spare Parts','/sparepart','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
  `title`      = VALUES(`title`),
  `url`        = VALUES(`url`),
  `updated_at` = CURRENT_TIMESTAMP(3);

-- ============================================================
-- 4) I18N (de)
-- ============================================================
INSERT INTO `menu_items_i18n`
(`id`, `menu_item_id`, `locale`, `title`, `url`, `created_at`, `updated_at`)
VALUES
(UUID(),'fe8120b3-919a-49b8-8035-df6fd2a2433f','de','Startseite','/','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'25740da6-c0f2-4c1d-b131-998018699bfd','de','Organisation','/about','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'c47a1c3f-cea1-4780-9381-77336bc8ac59','de','Leistungen','/service','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'f2570596-db46-4028-902c-d6fe2c9a8312','de','Produkte','/product','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'ceed431a-aafb-4aba-bf1f-6217b3960c01','de','Bibliothek','/library','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'33333333-4444-5555-6666-777777777777','de','Nachrichten','/news','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'555c6ddf-658b-4c0f-8a9e-0b104708dd07','de','Blog','/blog','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'455c6ddf-658b-4c0f-8a9e-0b104708dd07','de','Kontakt','/contact','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),'aaaa1111-2222-3333-4444-555555555555','de','Über uns','/about','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'aaaa1111-2222-3333-4444-666666666666','de','Mission & Vision','/mission-vision','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'aaaa1111-2222-3333-4444-777777777777','de','Qualität','/quality','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'aaaa1111-2222-3333-4444-888888888888','de','Team','/team','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'aaaa1111-2222-3333-4444-999999999999','de','FAQ','/faqs','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),'5a000001-1111-4111-8111-5a0000000001','de','Wartung','/service/maintenance-repair','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000002-1111-4111-8111-5a0000000002','de','Modernisierung','/service/modernization-retrofit','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000003-1111-4111-8111-5a0000000003','de','Ersatzteile','/service/spare-parts-components','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000004-1111-4111-8111-5a0000000004','de','Automation / SCADA','/service/automation-scada','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000005-1111-4111-8111-5a0000000005','de','Engineering','/service/engineering-support','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000006-1111-4111-8111-5a0000000006','de','Planung & Analyse','/service/site-survey-engineering','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000007-1111-4111-8111-5a0000000007','de','Optimierung','/service/performance-optimization','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000008-1111-4111-8111-5a0000000008','de','Inbetriebnahme','/service/commissioning-startup','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'5a000009-1111-4111-8111-5a0000000009','de','Notfallservice','/service/emergency-response','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

-- ✅ Library submenu (DE) under /library/{slug}
(UUID(),'7b000001-1111-4111-8111-7b0000000001','de','Wasserkühlturm','/library/was-ist-ein-wasser-kuehlturm-arten-und-funktionsprinzip','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'7b000002-1111-4111-8111-7b0000000002','de','Eigenschaften','/library/eigenschaften-der-ensotek-kuehltuerme','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'7b000003-1111-4111-8111-7b0000000003','de','Auswahl Infos','/library/erforderliche-informationen-zur-kuehlturm-auswahl','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'7b000004-1111-4111-8111-7b0000000004','de','Montage','/library/kuehlturm-montage-und-betrieb','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),'88888888-1111-2222-3333-444444444444','de','Alle Produkte','/product','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'88888888-1111-2222-3333-555555555555','de','Ersatzteile','/sparepart','2024-01-01 00:00:00.000','2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
  `title`      = VALUES(`title`),
  `url`        = VALUES(`url`),
  `updated_at` = CURRENT_TIMESTAMP(3);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
