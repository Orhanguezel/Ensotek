-- =============================================================
-- FILE: src/db/seed/sql/services/071_008_service__commissioning_startup.sql
-- Ensotek – SERVICES Seed (SINGLE SERVICE / NO SET)
-- Service: Commissioning & Startup (SRV_008)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

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
  '90000008-1111-4111-8111-900000000008',
  'commissioning_startup',
  'aaaa8001-1111-4111-8111-aaaaaaaa8001',
  'bbbb8006-1111-4111-8111-bbbbbbbb8006',
  1,1,80,
  NULL,'https://www.ensotek.de/uploads/services/commissioning_and_startup.png',NULL,
  'Installation coordination / commissioning / training',
  '1 day – 2 weeks (project dependent)',
  'Handover checklist & initial maintenance plan included',
  'All seasons',
  NULL,
  'Pre-start checks, test runs, vibration checks, water distribution tests, handover documentation, operator training',
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

INSERT INTO `services_i18n`
(
  `id`,`service_id`,`locale`,
  `slug`,`name`,`description`,
  `material`,`price`,`includes`,`warranty`,`image_alt`,
  `tags`,`meta_title`,`meta_description`,`meta_keywords`,
  `created_at`,`updated_at`
)
VALUES
('91000008-1111-4111-8111-910000000008','90000008-1111-4111-8111-900000000008','tr','commissioning-startup','Kurulum & Devreye Alma','Montaj koordinasyonu, kontrol listeleri, test çalıştırmaları, titreşim kontrolleri, su dağıtım testleri ve güvenli ilk çalıştırma adımları yürütülür. Operatör eğitimi ve devreye alma tutanakları ile sistem çalışır şekilde teslim edilir.',NULL,'Kapsama göre tekliflendirilir','Kurulum koordinasyonu, devreye alma, testler, eğitim, teslim dokümantasyonu','Projeye göre','Soğutma kulesi devreye alma ve eğitim','devreye alma, kurulum, test, eğitim, check-list','Kurulum ve Devreye Alma | Ensotek','Ensotek, kurulum koordinasyonu ve devreye alma ile sistemi güvenli şekilde çalıştırır; operatör eğitimini tamamlar.','soğutma kulesi devreye alma, kurulum, operatör eğitimi',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('91000008-1111-4111-8111-910000000108','90000008-1111-4111-8111-900000000008','en','commissioning-startup','Commissioning & Startup','Coordinate installation, run checklists, test runs, vibration checks, water distribution tests and safe first startup. Deliver operator training and commissioning documentation.',NULL,'Quoted per scope','Installation coordination, commissioning, tests, training, handover documentation','Per project','Cooling tower commissioning and training','commissioning, startup, tests, training, checklists','Commissioning & Startup | Ensotek','Ensotek commissions systems safely and completes operator training with documented handover.','cooling tower commissioning, startup, operator training',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('91000008-1111-4111-8111-910000000208','90000008-1111-4111-8111-900000000008','de','commissioning-startup','Inbetriebnahme & Startup','Montagekoordination, Checklisten, Testläufe, Schwingungsprüfungen, Wasserverteilungstests und sicherer Erststart. Übergabe mit Operator-Training und Inbetriebnahmedokumentation.',NULL,'Nach Umfang','Montagekoordination, Inbetriebnahme, Tests, Training, Übergabedokumentation','Nach Projekt','Kühlturm Inbetriebnahme und Training','inbetriebnahme, startup, tests, training, checklisten','Inbetriebnahme & Startup | Ensotek','Ensotek nimmt Systeme sicher in Betrieb und schließt Operator-Training mit dokumentierter Übergabe ab.','kühlturm inbetriebnahme, startup, operator training',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
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

INSERT INTO `service_images`
(`id`,`service_id`,`image_asset_id`,`image_url`,`is_active`,`display_order`,`created_at`,`updated_at`)
VALUES
('92000008-1111-4111-8111-920000000001','90000008-1111-4111-8111-900000000008',NULL,'https://images.unsplash.com/photo-1581092334555-1f9b6b3f6d2c?auto=format&fit=crop&w=1600&q=80',1,10,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('92000008-1111-4111-8111-920000000002','90000008-1111-4111-8111-900000000008',NULL,'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1600&q=80',1,20,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('92000008-1111-4111-8111-920000000003','90000008-1111-4111-8111-900000000008',NULL,'https://images.unsplash.com/photo-1581092919535-7146a4c2f5f0?auto=format&fit=crop&w=1600&q=80',1,30,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `service_id` = VALUES(`service_id`),
  `image_asset_id` = VALUES(`image_asset_id`),
  `image_url` = VALUES(`image_url`),
  `is_active` = VALUES(`is_active`),
  `display_order` = VALUES(`display_order`),
  `updated_at` = CURRENT_TIMESTAMP(3);

INSERT INTO `service_images_i18n`
(`id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`)
VALUES
('93000008-1111-4111-8111-930000000001','92000008-1111-4111-8111-920000000001','tr','Kontrol Listeleri','Kontrol listeleri','Ön devreye alma kontrolleri.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000008-1111-4111-8111-930000000101','92000008-1111-4111-8111-920000000001','en','Checklists','Checklists','Pre-commissioning checks.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000008-1111-4111-8111-930000000201','92000008-1111-4111-8111-920000000001','de','Checklisten','Checklisten','Pre-Commissioning Checks.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),

('93000008-1111-4111-8111-930000000002','92000008-1111-4111-8111-920000000002','tr','Test Çalıştırması','Test','Titreşim ve güvenli çalıştırma adımları.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000008-1111-4111-8111-930000000102','92000008-1111-4111-8111-920000000002','en','Test Run','Test run','Vibration checks and safe startup steps.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000008-1111-4111-8111-930000000202','92000008-1111-4111-8111-920000000002','de','Testlauf','Testlauf','Schwingungsprüfung und sicherer Start.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),

('93000008-1111-4111-8111-930000000003','92000008-1111-4111-8111-920000000003','tr','Eğitim & Teslim','Eğitim','Operatör eğitimi ve dokümantasyon.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000008-1111-4111-8111-930000000103','92000008-1111-4111-8111-920000000003','en','Training & Handover','Handover','Operator training and documentation.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000008-1111-4111-8111-930000000203','92000008-1111-4111-8111-920000000003','de','Übergabe','Übergabe','Training und Dokumentation.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `alt` = VALUES(`alt`),
  `caption` = VALUES(`caption`),
  `updated_at` = CURRENT_TIMESTAMP(3);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
