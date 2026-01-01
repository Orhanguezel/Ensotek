-- =============================================================
-- FILE: src/db/seed/sql/services/071_001_service__maintenance_repair.sql
-- Ensotek – SERVICES Seed (SINGLE SERVICE / NO SET)
-- Service: Maintenance & Repair (SRV_001)
-- - NO SET, NO variables
-- - Idempotent: ON DUPLICATE KEY UPDATE
-- - Includes: services + services_i18n (tr/en/de) + service_images + service_images_i18n (tr/en/de)
-- - Cover: services.image_url (and featured_image optional legacy null)
-- - Gallery: 3 images (display_order 10/20/30)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------
-- 1) services (parent)
-- -------------------------------------------------------------
INSERT INTO `services`
(
  `id`,
  `type`,
  `category_id`,
  `sub_category_id`,
  `featured`,
  `is_active`,
  `display_order`,
  `featured_image`,
  `image_url`,
  `image_asset_id`,
  `area`,
  `duration`,
  `maintenance`,
  `season`,
  `thickness`,
  `equipment`,
  `created_at`,
  `updated_at`
)
VALUES
(
  '90000001-1111-4111-8111-900000000001',
  'maintenance_and_repair',
  'aaaa8001-1111-4111-8111-aaaaaaaa8001',
  'bbbb8002-1111-4111-8111-bbbbbbbb8002',
  1,
  1,
  10,
  NULL,
  'https://www.ensotek.de/uploads/services/maintenance_and_repair.png',
  NULL,
  'Existing cooling towers / plants / commercial buildings',
  '1 day – 4 weeks (scope dependent)',
  'Optional periodic maintenance contract',
  'All seasons',
  NULL,
  'Nozzles, fills, drift eliminators, fan, motor, gearbox, mechanical components',
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
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

-- -------------------------------------------------------------
-- 2) services_i18n (tr/en/de)
-- -------------------------------------------------------------
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
  '91000001-1111-4111-8111-910000000001',
  '90000001-1111-4111-8111-900000000001',
  'tr',
  'maintenance-repair',
  'Periyodik Bakım ve Onarım',
  'Ensotek, su soğutma kulelerinizde dolgu, nozül, damla tutucu (drift eliminator), fan grubu, motor-redüktör ve mekanik aksamların performansını saha kontrolleriyle doğrular. Titreşim/ses analizi, hizalama, sızdırmazlık ve su dağıtım homojenliği ölçümleri ile arıza önleyici bakım planı oluşturur. Amaç; duruşları azaltmak, yaklaşım sıcaklığını stabilize etmek ve ekipman ömrünü uzatmaktır.',
  'Dolgu, nozül, drift eliminator, fan, motor/redüktör, mekanik parçalar (kapsama göre)',
  'Kapsama göre tekliflendirilir',
  'Kontrol & raporlama, temizlik, mekanik bakım, kritik parça değişimi, saha testleri',
  'İşçilik ve ekipman bazlı garanti koşulları',
  'Soğutma kulesi bakım ve onarım hizmeti',
  'bakım, onarım, periyodik kontrol, titreşim analizi, mekanik bakım',
  'Periyodik Bakım ve Onarım | Ensotek',
  'Ensotek, su soğutma kulelerinde bakım ve onarım hizmeti ile duruşları azaltır, verimliliği artırır ve ekipman ömrünü uzatır.',
  'soğutma kulesi bakım, kule onarım, fan motor bakım, drift eliminator',
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
),
-- EN
(
  '91000001-1111-4111-8111-910000000101',
  '90000001-1111-4111-8111-900000000001',
  'en',
  'maintenance-repair',
  'Periodic Maintenance & Repair',
  'Ensotek maintains cooling towers by verifying the performance of fills, spray nozzles, drift eliminators, fan group, motor-gearbox and mechanical assemblies. Vibration/noise checks, alignment, sealing and water distribution uniformity are validated on-site. The goal is to reduce downtime, stabilize approach temperature and extend equipment life.',
  'Fills, nozzles, drift eliminators, fan, motor/gearbox, mechanical parts (scope dependent)',
  'Quoted per scope',
  'Inspection & reporting, cleaning, mechanical maintenance, critical part replacement, field testing',
  'Per scope',
  'Cooling tower maintenance and repair service',
  'maintenance, repair, periodic inspection, vibration analysis, mechanical service',
  'Maintenance & Repair | Ensotek',
  'Ensotek reduces downtime and improves efficiency with periodic cooling tower maintenance and repair services.',
  'cooling tower maintenance, cooling tower repair, fan motor service, drift eliminator',
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
),
-- DE
(
  '91000001-1111-4111-8111-910000000201',
  '90000001-1111-4111-8111-900000000001',
  'de',
  'maintenance-repair',
  'Periodische Wartung & Reparatur',
  'Ensotek wartet Kühltürme durch Prüfung von Füllkörpern, Sprühdüsen, Drift Eliminatoren, Ventilatorgruppe, Motor-Getriebe und mechanischen Baugruppen. Schwingungs-/Geräuschprüfungen, Ausrichtung, Dichtheit und gleichmäßige Wasserverteilung werden vor Ort verifiziert. Ziel: Stillstände reduzieren, Approach stabilisieren und die Lebensdauer erhöhen.',
  NULL,
  'Nach Umfang',
  'Inspektion & Reporting, Reinigung, mechanische Wartung, Teiletausch, Feldtests',
  'Nach Projekt',
  'Wartung und Reparatur von Kühltürmen',
  'wartung, reparatur, inspektion, schwingung, service',
  'Wartung & Reparatur | Ensotek',
  'Ensotek reduziert Stillstände und steigert Effizienz durch periodische Wartung und Reparatur von Kühltürmen.',
  'kühlturm wartung, kühlturm reparatur, ventilator motor service',
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
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

-- -------------------------------------------------------------
-- 3) service_images (gallery 3)
-- -------------------------------------------------------------
INSERT INTO `service_images`
(
  `id`,`service_id`,`image_asset_id`,`image_url`,
  `is_active`,`display_order`,`created_at`,`updated_at`
)
VALUES
(
  '92000001-1111-4111-8111-920000000001',
  '90000001-1111-4111-8111-900000000001',
  NULL,
  'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1600&q=80',
  1,
  10,
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
),
(
  '92000001-1111-4111-8111-920000000002',
  '90000001-1111-4111-8111-900000000001',
  NULL,
  'https://images.unsplash.com/photo-1516575150278-77136aed6920?auto=format&fit=crop&w=1600&q=80',
  1,
  20,
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
),
(
  '92000001-1111-4111-8111-920000000003',
  '90000001-1111-4111-8111-900000000001',
  NULL,
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80',
  1,
  30,
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
)
ON DUPLICATE KEY UPDATE
  `service_id` = VALUES(`service_id`),
  `image_asset_id` = VALUES(`image_asset_id`),
  `image_url` = VALUES(`image_url`),
  `is_active` = VALUES(`is_active`),
  `display_order` = VALUES(`display_order`),
  `updated_at` = CURRENT_TIMESTAMP(3);

-- -------------------------------------------------------------
-- 4) service_images_i18n (tr/en/de for each image)
-- -------------------------------------------------------------
INSERT INTO `service_images_i18n`
(
  `id`,`image_id`,`locale`,
  `title`,`alt`,`caption`,
  `created_at`,`updated_at`
)
VALUES
-- IMG A
('93000001-1111-4111-8111-930000000001','92000001-1111-4111-8111-920000000001','tr','Periyodik Kontroller','Periyodik bakım kontrolleri','Fan grubu, motor-redüktör ve mekanik aksam kontrolleri.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000001-1111-4111-8111-930000000101','92000001-1111-4111-8111-920000000001','en','Periodic Checks','Periodic checks','Fan group, motor-gearbox and mechanical inspections.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000001-1111-4111-8111-930000000201','92000001-1111-4111-8111-920000000001','de','Periodische Checks','Checks','Ventilatorgruppe, Motor-Getriebe und Mechanik prüfen.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),

-- IMG B
('93000001-1111-4111-8111-930000000002','92000001-1111-4111-8111-920000000002','tr','Temizlik ve Dağıtım Kontrolü','Su dağıtım kontrolü','Nozül ve su dağıtım homojenliği doğrulaması.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000001-1111-4111-8111-930000000102','92000001-1111-4111-8111-920000000002','en','Cleaning & Distribution','Water distribution','Nozzle and distribution uniformity validation.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000001-1111-4111-8111-930000000202','92000001-1111-4111-8111-920000000002','de','Reinigung & Verteilung','Verteilung','Düsen und gleichmäßige Wasserverteilung validieren.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),

-- IMG C
('93000001-1111-4111-8111-930000000003','92000001-1111-4111-8111-920000000003','tr','Saha Onarımı','Yerinde onarım','Kritik parça değişimi ve güvenli yeniden çalıştırma.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000001-1111-4111-8111-930000000103','92000001-1111-4111-8111-920000000003','en','Field Repair','On-site repair','Critical replacement and safe restart.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000001-1111-4111-8111-930000000203','92000001-1111-4111-8111-920000000003','de','Vor-Ort-Reparatur','Reparatur','Teiletausch und sicherer Restart.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `alt` = VALUES(`alt`),
  `caption` = VALUES(`caption`),
  `updated_at` = CURRENT_TIMESTAMP(3);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
