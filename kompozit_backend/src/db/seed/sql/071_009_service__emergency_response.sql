-- =============================================================
-- FILE: src/db/seed/sql/services/071_009_service__emergency_response.sql
-- Ensotek – SERVICES Seed (SINGLE SERVICE / NO SET)
-- Service: Emergency Response (SRV_009)
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
  '90000009-1111-4111-8111-900000000009',
  'emergency_response',
  'aaaa8001-1111-4111-8111-aaaaaaaa8001',
  'bbbb8002-1111-4111-8111-bbbbbbbb8002',
  1,1,90,
  NULL,'https://res.cloudinary.com/dbozv7wqd/image/upload/v1767321228/services/cover/emergency_response.png',NULL,
  'Urgent troubleshooting / safe restart',
  'Same day – 7 days (depending on fault)',
  'Follow-up maintenance action plan recommended',
  'All seasons',
  NULL,
  'Rapid diagnostics, part replacement, safe restart, temporary bypass planning, incident report',
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
('91000009-1111-4111-8111-910000000009','90000009-1111-4111-8111-900000000009','tr','emergency-response','Acil Servis ve Arıza Müdahalesi','Kritik duruşlarda hızlı teşhis, parça değişimi (fan/motor/redüktör, nozül, dolgu, drift eliminator vb.), güvenli yeniden çalıştırma ve olay raporu ile süreç yönetilir. Sonrasında kök neden analizi ve önleyici bakım planı sunulur.',NULL,'Kapsama göre','Hızlı müdahale, teşhis, parça değişimi, güvenli restart, raporlama','Projeye göre','Soğutma kulesi acil servis','acil servis, arıza, müdahale, restart, raporlama','Acil Servis ve Arıza Müdahalesi | Ensotek','Ensotek, soğutma kulelerinde kritik arızalara hızlı müdahale eder; güvenli yeniden devreye alma süreçlerini yönetir.','soğutma kulesi acil servis, arıza müdahale',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('91000009-1111-4111-8111-910000000109','90000009-1111-4111-8111-900000000009','en','emergency-response','Emergency Service & Troubleshooting','Rapid diagnostics, replacement of critical parts (fan/motor/gearbox, nozzles, fills, drift eliminators) and safe restart. Followed by root cause analysis and preventive maintenance plan.',NULL,'Depends on case','Rapid response, diagnostics, part replacement, safe restart, incident reporting','Per project','Cooling tower emergency service','emergency, troubleshooting, response, restart, reporting','Emergency Service | Ensotek','Ensotek responds quickly to critical cooling tower failures and manages safe restart procedures.','cooling tower emergency service, troubleshooting',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('91000009-1111-4111-8111-910000000209','90000009-1111-4111-8111-900000000009','de','emergency-response','Notdienst & Störungsbehebung','Schnelldiagnose, Austausch kritischer Teile (Ventilator/Motor/Getriebe, Düsen, Füllkörper, Drift Eliminatoren) und sicherer Restart. Anschließend Root-Cause-Analyse und präventiver Wartungsplan.',NULL,'Nach Fall','Schnelle Reaktion, Diagnose, Teiletausch, sicherer Restart, Incident-Report','Nach Projekt','Kühlturm Notdienst','notdienst, störung, diagnose, restart, reporting','Notdienst | Ensotek','Ensotek reagiert schnell auf kritische Kühlturmausfälle und steuert sichere Restart-Prozesse.','kühlturm notdienst, störungsbehebung',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
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
('92000009-1111-4111-8111-920000000001','90000009-1111-4111-8111-900000000009',NULL,'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80',1,10,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('92000009-1111-4111-8111-920000000002','90000009-1111-4111-8111-900000000009',NULL,'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',1,20,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('92000009-1111-4111-8111-920000000003','90000009-1111-4111-8111-900000000009',NULL,'https://images.unsplash.com/photo-1516575150278-77136aed6920?auto=format&fit=crop&w=1600&q=80',1,30,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
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
('93000009-1111-4111-8111-930000000001','92000009-1111-4111-8111-920000000001','tr','Hızlı Müdahale','Acil müdahale','Kritik duruşlarda hızlı teşhis.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000009-1111-4111-8111-930000000101','92000009-1111-4111-8111-920000000001','en','Rapid Response','Rapid response','Fast diagnostics in critical downtime.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000009-1111-4111-8111-930000000201','92000009-1111-4111-8111-920000000001','de','Schnellreaktion','Reaktion','Schnelldiagnose bei kritischem Stillstand.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),

('93000009-1111-4111-8111-930000000002','92000009-1111-4111-8111-920000000002','tr','Parça Değişimi','Parça değişimi','Fan/motor/redüktör ve kritik komponent değişimi.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000009-1111-4111-8111-930000000102','92000009-1111-4111-8111-920000000002','en','Part Replacement','Replacement','Fan/motor/gearbox and critical component replacement.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000009-1111-4111-8111-930000000202','92000009-1111-4111-8111-920000000002','de','Teiletausch','Tausch','Ventilator/Motor/Getriebe und kritische Teile.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),

('93000009-1111-4111-8111-930000000003','92000009-1111-4111-8111-920000000003','tr','Güvenli Restart','Güvenli yeniden çalıştırma','Kontroller, testler ve olay raporu.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000009-1111-4111-8111-930000000103','92000009-1111-4111-8111-920000000003','en','Safe Restart','Safe restart','Checks, tests and incident reporting.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000009-1111-4111-8111-930000000203','92000009-1111-4111-8111-920000000003','de','Restart','Restart','Checks, Tests und Incident-Report.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `alt` = VALUES(`alt`),
  `caption` = VALUES(`caption`),
  `updated_at` = CURRENT_TIMESTAMP(3);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
