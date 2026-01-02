-- =============================================================
-- FILE: src/db/seed/sql/services/071_007_service__performance_optimization.sql
-- Ensotek – SERVICES Seed (SINGLE SERVICE / NO SET)
-- Service: Performance Optimization (SRV_007)
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
  '90000007-1111-4111-8111-900000000007',
  'performance_optimization',
  'aaaa8001-1111-4111-8111-aaaaaaaa8001',
  'bbbb8006-1111-4111-8111-bbbbbbbb8006',
  1,1,70,
  NULL,'https://res.cloudinary.com/dbozv7wqd/image/upload/v1767321149/services/cover/performance_optimization.png',NULL,
  'Measurement / reporting / optimization',
  '1 day – 4 weeks (measure + actions)',
  'Best results with periodic monitoring',
  'All seasons',
  NULL,
  'Approach temperature, fan efficiency, distribution quality, drift loss, water chemistry baseline, reporting',
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
('91000007-1111-4111-8111-910000000007','90000007-1111-4111-8111-900000000007','tr','performance-optimization','Performans Optimizasyonu ve Enerji Verimliliği','Yaklaşım sıcaklığı, fan verimi, su dağıtım homojenliği, drift kaybı ve su kimyası parametreleri ölçülür. Dolgu/nozül dağıtımı, fan grubu ayarları ve operasyon setleri iyileştirilerek enerji maliyetleri düşürülür; raporlanabilir KPI seti oluşturulur.',NULL,'Kapsama göre tekliflendirilir','Yerinde ölçüm, analiz, aksiyon planı, raporlama, doğrulama testleri','Projeye göre','Soğutma kulesi performans optimizasyonu','performans, verimlilik, enerji, ölçüm, raporlama','Performans Optimizasyonu | Ensotek','Ensotek, yerinde ölçümler ve raporlama ile soğutma kulelerinde performansı iyileştirir, enerji tüketimini düşürür.','soğutma kulesi performans optimizasyon, enerji verimliliği',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('91000007-1111-4111-8111-910000000107','90000007-1111-4111-8111-900000000007','en','performance-optimization','Performance Optimization & Energy Efficiency','Measure approach temperature, fan efficiency, water distribution uniformity, drift loss and water chemistry. Optimize fills/nozzles, fan settings and operating setpoints to reduce energy costs and create a reportable KPI set.',NULL,'Quoted per scope','On-site measurement, analysis, action plan, reporting, validation tests','Per project','Cooling tower performance optimization','performance, efficiency, energy, measurement, reporting','Performance Optimization | Ensotek','Ensotek improves cooling tower performance and reduces energy consumption with measurement-driven optimization.','cooling tower performance optimization, energy efficiency',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('91000007-1111-4111-8111-910000000207','90000007-1111-4111-8111-900000000007','de','performance-optimization','Performance-Optimierung & Energieeffizienz','Messung von Approach, Ventilatoreffizienz, Verteilungsqualität, Driftverlust und Wasserchemie. Optimierung von Füllkörpern/Düsen, Ventilatoreinstellungen und Betriebsparametern zur Senkung der Energiekosten – mit KPI-Reporting.',NULL,'Nach Umfang','Vor-Ort-Messung, Analyse, Maßnahmenplan, Reporting, Validierung','Nach Projekt','Kühlturm Performance-Optimierung','performance, energie, effizienz, messung, reporting','Performance-Optimierung | Ensotek','Ensotek verbessert die Performance und senkt den Energieverbrauch durch messdatenbasierte Optimierung.','kühlturm performance optimierung, energieeffizienz',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
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
('92000007-1111-4111-8111-920000000001','90000007-1111-4111-8111-900000000007',NULL,'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',1,10,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('92000007-1111-4111-8111-920000000002','90000007-1111-4111-8111-900000000007',NULL,'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80',1,20,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('92000007-1111-4111-8111-920000000003','90000007-1111-4111-8111-900000000007',NULL,'https://images.unsplash.com/photo-1581092795360-0dc3e2b31d08?auto=format&fit=crop&w=1600&q=80',1,30,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
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
('93000007-1111-4111-8111-930000000001','92000007-1111-4111-8111-920000000001','tr','KPI Ölçümleri','KPI ölçümü','Yaklaşım sıcaklığı ve verim metrikleri.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000007-1111-4111-8111-930000000101','92000007-1111-4111-8111-920000000001','en','KPI Measurements','KPI measurement','Approach temperature and efficiency metrics.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000007-1111-4111-8111-930000000201','92000007-1111-4111-8111-920000000001','de','KPI','KPI','Approach und Effizienzmetriken.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),

('93000007-1111-4111-8111-930000000002','92000007-1111-4111-8111-920000000002','tr','Raporlama','Raporlama','Öncesi/sonrası kıyas ve aksiyon planı.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000007-1111-4111-8111-930000000102','92000007-1111-4111-8111-920000000002','en','Reporting','Reporting','Before/after comparison and action plan.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000007-1111-4111-8111-930000000202','92000007-1111-4111-8111-920000000002','de','Reporting','Reporting','Vorher/Nachher und Maßnahmenplan.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),

('93000007-1111-4111-8111-930000000003','92000007-1111-4111-8111-920000000003','tr','İyileştirme Uygulaması','İyileştirme','Fan/dağıtım/dolgu optimizasyonu.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000007-1111-4111-8111-930000000103','92000007-1111-4111-8111-920000000003','en','Optimization Actions','Optimization','Fan/distribution/fill optimization steps.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000007-1111-4111-8111-930000000203','92000007-1111-4111-8111-920000000003','de','Maßnahmen','Maßnahmen','Ventilator/Verteilung/Füllkörper optimieren.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `alt` = VALUES(`alt`),
  `caption` = VALUES(`caption`),
  `updated_at` = CURRENT_TIMESTAMP(3);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
