-- =============================================================
-- FILE: src/db/seed/sql/services/071_005_service__engineering_support.sql
-- Service: Engineering Support (SRV_005)
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
  '90000005-1111-4111-8111-900000000005',
  'engineering_support',
  'aaaa8001-1111-4111-8111-aaaaaaaa8001',
  'bbbb8006-1111-4111-8111-bbbbbbbb8006',
  1,1,50,
  NULL,'http://localhost:8086/uploads/services/engineering_support.png',NULL,
  'Design / consulting / optimization',
  '2–8 weeks (scope dependent)',
  'Optional periodic review + reporting',
  'All seasons',
  NULL,
  'Heat load analysis, sizing, hydraulic balancing, performance assessment, documentation, technical training',
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
('91000005-1111-4111-8111-910000000005','90000005-1111-4111-8111-900000000005','tr','engineering-support','Mühendislik Desteği','Isı yükü analizi, seçim/boyutlandırma, hidrolik dengeleme, performans analizi ve teknik dokümantasyon süreçleri Ensotek mühendisliği ile yürütülür. Uygulama öncesi ve sonrası ölçümlerle hedef performans doğrulanır.','Proje ihtiyacına göre mühendislik hesapları ve saha ekipmanları','Kapsama göre tekliflendirilir','Keşif, hesaplar, tasarım, devreye alma desteği, performans doğrulama, eğitim','Hizmet kapsamına göre','Soğutma kulesi mühendislik desteği','mühendislik, optimizasyon, performans, devreye alma, eğitim','Mühendislik Desteği | Ensotek','Ensotek, soğutma kulelerinde mühendislik desteği ile doğru tasarım, optimizasyon ve performans doğrulama sunar.','soğutma kulesi mühendislik, performans analizi, optimizasyon',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('91000005-1111-4111-8111-910000000105','90000005-1111-4111-8111-900000000005','en','engineering-support','Engineering Support','We provide heat load analysis, sizing/selection, hydraulic balancing, performance assessment and technical documentation. Before/after measurements validate the target performance.',NULL,'Quoted per scope','Survey, calculations, design, commissioning support, performance validation, training','Per scope','Cooling tower engineering support','engineering, optimization, performance, commissioning, training','Engineering Support | Ensotek','Ensotek delivers engineering support for correct design, optimization and performance validation.','cooling tower engineering, performance analysis, optimization',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('91000005-1111-4111-8111-910000000205','90000005-1111-4111-8111-900000000005','de','engineering-support','Engineering Support','Wärmelastanalyse, Auslegung/Selektion, hydraulischer Abgleich, Performancebewertung und technische Dokumentation. Vorher/Nachher-Messungen validieren die Zielperformance.',NULL,'Nach Umfang','Begehung, Berechnungen, Design, Inbetriebnahme-Support, Validierung, Training','Nach Projekt','Engineering Support für Kühltürme','engineering, optimierung, performance, inbetriebnahme, training','Engineering Support | Ensotek','Ensotek liefert Engineering Support für richtige Auslegung, Optimierung und Performance-Validierung.','kühlturm engineering, performance analyse, optimierung',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
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
('92000005-1111-4111-8111-920000000001','90000005-1111-4111-8111-900000000005',NULL,'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1600&q=80',1,10,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('92000005-1111-4111-8111-920000000002','90000005-1111-4111-8111-900000000005',NULL,'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1600&q=80',1,20,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('92000005-1111-4111-8111-920000000003','90000005-1111-4111-8111-900000000005',NULL,'https://images.unsplash.com/photo-1581092919535-7146a4c2f5f0?auto=format&fit=crop&w=1600&q=80',1,30,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
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
('93000005-1111-4111-8111-930000000001','92000005-1111-4111-8111-920000000001','tr','Isı Yükü Analizi','Isı yükü hesabı','Doğru kule seçimi için hesaplama.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000005-1111-4111-8111-930000000101','92000005-1111-4111-8111-920000000001','en','Heat Load Analysis','Heat load','Sizing calculations for correct selection.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000005-1111-4111-8111-930000000201','92000005-1111-4111-8111-920000000001','de','Wärmelast','Wärmelast','Berechnung für korrekte Auslegung.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),

('93000005-1111-4111-8111-930000000002','92000005-1111-4111-8111-920000000002','tr','Performans Değerlendirme','Performans analizi','Ölçüm ve kıyaslama ile optimizasyon fırsatları.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000005-1111-4111-8111-930000000102','92000005-1111-4111-8111-920000000002','en','Performance Assessment','Performance','Benchmarking and optimization opportunities.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000005-1111-4111-8111-930000000202','92000005-1111-4111-8111-920000000002','de','Bewertung','Bewertung','Benchmarking und Optimierungspotenziale.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),

('93000005-1111-4111-8111-930000000003','92000005-1111-4111-8111-920000000003','tr','Teknik Eğitim','Operatör eğitimi','Dokümantasyon ve eğitim oturumları.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000005-1111-4111-8111-930000000103','92000005-1111-4111-8111-920000000003','en','Technical Training','Training','Documentation and training sessions.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000005-1111-4111-8111-930000000203','92000005-1111-4111-8111-920000000003','de','Training','Training','Dokumentation und Schulungen.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `alt` = VALUES(`alt`),
  `caption` = VALUES(`caption`),
  `updated_at` = CURRENT_TIMESTAMP(3);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
