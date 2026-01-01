-- =============================================================
-- FILE: src/db/seed/sql/services/071_006_service__site_survey_engineering.sql
-- Ensotek – SERVICES Seed (SINGLE SERVICE / NO SET)
-- Service: Site Survey & Engineering (SRV_006)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =========================
-- 1) services (base)
-- =========================
INSERT INTO `services`
(
  `id`,`type`,`category_id`,`sub_category_id`,
  `featured`,`is_active`,`display_order`,
  `featured_image`,`image_url`,`image_asset_id`,
  `area`,`duration`,`maintenance`,`season`,`thickness`,`equipment`,
  `created_at`,`updated_at`
)
VALUES
(
  '90000006-1111-4111-8111-900000000006',
  'site_survey_engineering',
  'aaaa8001-1111-4111-8111-aaaaaaaa8001',
  'bbbb8006-1111-4111-8111-bbbbbbbb8006',
  1,1,60,
  NULL,'https://www.ensotek.de/uploads/services/site_survey_and_engineering.png',NULL,
  'On-site survey / mechanical layout / selection',
  '1 day – 3 weeks (survey + design)',
  'Optional: integration plan with maintenance',
  'All seasons',
  NULL,
  'Site survey, process conditions, selection & sizing, piping concept, access platforms, safety checklist',
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
)
ON DUPLICATE KEY UPDATE
  `type` = VALUES(`type`),
  `category_id` = VALUES(`category_id`),
  `sub_category_id` = VALUES(`sub_category_id`),
  `featured` = VALUES(`featured`),
  `is_active` = VALUES(`is_active`),
  `display_order` = VALUES(`display_order`),
  `featured_image` = VALUES(`featured_image`),
  `image_url` = VALUES(`image_url`),
  `image_asset_id` = VALUES(`image_asset_id`),
  `area` = VALUES(`area`),
  `duration` = VALUES(`duration`),
  `maintenance` = VALUES(`maintenance`),
  `season` = VALUES(`season`),
  `thickness` = VALUES(`thickness`),
  `equipment` = VALUES(`equipment`),
  `updated_at` = CURRENT_TIMESTAMP(3);

-- =========================
-- 2) services_i18n (tr/en/de)
-- =========================
INSERT INTO `services_i18n`
(
  `id`,`service_id`,`locale`,
  `slug`,`name`,`description`,
  `material`,`price`,`includes`,`warranty`,`image_alt`,
  `tags`,`meta_title`,`meta_description`,`meta_keywords`,
  `created_at`,`updated_at`
)
VALUES
-- TR
(
  '91000006-1111-4111-8111-910000000006',
  '90000006-1111-4111-8111-900000000006',
  'tr',
  'site-survey-engineering',
  'Keşif, Projelendirme ve Saha Mühendisliği',
  'Saha keşfi ile proses koşulları, yerleşim, erişim platformları, su dağıtım mimarisi, fan grubu ve mekanik entegrasyon gereksinimleri analiz edilir. Çıktı: seçim/boyutlandırma, yerleşim önerisi, uygulama planı ve risk/iş güvenliği kontrol listeleri.',
  NULL,
  'Kapsama göre tekliflendirilir',
  'Keşif, ölçüm, raporlama, seçim/boyutlandırma, mekanik konsept, uygulama planı',
  'Projeye göre',
  'Soğutma kulesi keşif ve projelendirme',
  'keşif, projelendirme, boyutlandırma, seçim, uygulama planı',
  'Keşif ve Projelendirme | Ensotek',
  'Ensotek, saha keşfi ve mühendislik ile doğru kule seçimi, yerleşim ve uygulama planını uçtan uca yönetir.',
  'soğutma kulesi keşif, projelendirme, boyutlandırma',
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
),
-- EN
(
  '91000006-1111-4111-8111-910000000106',
  '90000006-1111-4111-8111-900000000006',
  'en',
  'site-survey-engineering',
  'Site Survey & Engineering',
  'On-site survey defines process conditions, layout, access platforms, water distribution architecture, fan group integration and mechanical requirements. Deliverables: selection/sizing, layout proposal, implementation plan and safety checklists.',
  NULL,
  'Quoted per scope',
  'Survey, measurement, reporting, selection/sizing, mechanical concept, implementation plan',
  'Per project',
  'Cooling tower site survey and engineering',
  'site survey, engineering, sizing, selection, implementation plan',
  'Site Survey & Engineering | Ensotek',
  'Ensotek manages tower selection, layout and implementation planning with on-site survey and engineering.',
  'cooling tower site survey, engineering, sizing',
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
),
-- DE
(
  '91000006-1111-4111-8111-910000000206',
  '90000006-1111-4111-8111-900000000006',
  'de',
  'site-survey-engineering',
  'Begehung & Engineering',
  'Vor-Ort-Begehung für Prozessbedingungen, Layout, Zugang/Plattformen, Wasserverteilung, Ventilatorintegration und mechanische Anforderungen. Ergebnisse: Auslegung, Layoutvorschlag, Umsetzungsplan und Sicherheits-Checklisten.',
  NULL,
  'Nach Umfang',
  'Begehung, Messung, Reporting, Auslegung, mechanisches Konzept, Umsetzungsplan',
  'Nach Projekt',
  'Kühlturm Begehung und Engineering',
  'begehung, engineering, auslegung, selektion, umsetzungsplan',
  'Begehung & Engineering | Ensotek',
  'Ensotek steuert Selektion, Layout und Umsetzungsplanung durch Vor-Ort-Begehung und Engineering.',
  'kühlturm begehung, engineering, auslegung',
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
)
ON DUPLICATE KEY UPDATE
  `slug` = VALUES(`slug`),
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `material` = VALUES(`material`),
  `price` = VALUES(`price`),
  `includes` = VALUES(`includes`),
  `warranty` = VALUES(`warranty`),
  `image_alt` = VALUES(`image_alt`),
  `tags` = VALUES(`tags`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`),
  `meta_keywords` = VALUES(`meta_keywords`),
  `updated_at` = CURRENT_TIMESTAMP(3);

-- =========================
-- 3) service_images (3)
-- =========================
INSERT INTO `service_images`
(`id`,`service_id`,`image_asset_id`,`image_url`,`is_active`,`display_order`,`created_at`,`updated_at`)
VALUES
('92000006-1111-4111-8111-920000000001','90000006-1111-4111-8111-900000000006',NULL,'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80',1,10,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('92000006-1111-4111-8111-920000000002','90000006-1111-4111-8111-900000000006',NULL,'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80',1,20,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('92000006-1111-4111-8111-920000000003','90000006-1111-4111-8111-900000000006',NULL,'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80',1,30,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `service_id` = VALUES(`service_id`),
  `image_asset_id` = VALUES(`image_asset_id`),
  `image_url` = VALUES(`image_url`),
  `is_active` = VALUES(`is_active`),
  `display_order` = VALUES(`display_order`),
  `updated_at` = CURRENT_TIMESTAMP(3);

-- =========================
-- 4) service_images_i18n (tr/en/de)
-- =========================
INSERT INTO `service_images_i18n`
(`id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`)
VALUES
-- IMG A
('93000006-1111-4111-8111-930000000001','92000006-1111-4111-8111-920000000001','tr','Saha Keşfi','Saha keşfi','Yerleşim, erişim ve güvenlik kontrol listeleri.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000006-1111-4111-8111-930000000101','92000006-1111-4111-8111-920000000001','en','Site Survey','Site survey','Layout, access and safety checklists.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000006-1111-4111-8111-930000000201','92000006-1111-4111-8111-920000000001','de','Begehung','Begehung','Layout, Zugang und Sicherheitschecklisten.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
-- IMG B
('93000006-1111-4111-8111-930000000002','92000006-1111-4111-8111-920000000002','tr','Projelendirme','Mekanik tasarım','Seçim/boyutlandırma ve uygulama planı.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000006-1111-4111-8111-930000000102','92000006-1111-4111-8111-920000000002','en','Engineering','Engineering design','Selection/sizing and implementation plan.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000006-1111-4111-8111-930000000202','92000006-1111-4111-8111-920000000002','de','Engineering','Engineering','Auslegung und Umsetzungsplan.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
-- IMG C
('93000006-1111-4111-8111-930000000003','92000006-1111-4111-8111-920000000003','tr','Uygulama Hazırlığı','Uygulama hazırlığı','Montaj koordinasyonu için planlama.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000006-1111-4111-8111-930000000103','92000006-1111-4111-8111-920000000003','en','Preparation','Preparation','Planning for installation coordination.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000006-1111-4111-8111-930000000203','92000006-1111-4111-8111-920000000003','de','Vorbereitung','Vorbereitung','Planung für Montagekoordination.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `alt` = VALUES(`alt`),
  `caption` = VALUES(`caption`),
  `updated_at` = CURRENT_TIMESTAMP(3);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
