-- =============================================================
-- FILE: src/db/seed/sql/services/071_002_service__modernization_retrofit.sql
-- Ensotek – SERVICES Seed (SINGLE SERVICE / NO SET)
-- Service: Modernization & Retrofit (SRV_002)
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
  '90000002-1111-4111-8111-900000000002',
  'modernization',
  'aaaa8001-1111-4111-8111-aaaaaaaa8001',
  'bbbb8003-1111-4111-8111-bbbbbbbb8003',
  1,1,20,
  NULL,'https://res.cloudinary.com/dbozv7wqd/image/upload/v1767320683/services/cover/modernization_and_retrofit.png',NULL,
  'Capacity increase / efficiency improvement',
  '1–6 weeks (analysis + implementation)',
  'Recommended together with maintenance planning',
  'All seasons',
  NULL,
  'Fill/nozzle upgrades, fan-motor optimization, VFD, drift reduction, hydraulic improvements',
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
-- TR
(
  '91000002-1111-4111-8111-910000000002',
  '90000002-1111-4111-8111-900000000002',
  'tr',
  'modernization-retrofit',
  'Modernizasyon ve Retrofit',
  'Mevcut kulelerde kapasite ve verimlilik kazanımı için dolgu/nozül upgrade, fan kanadı optimizasyonu, motor-redüktör grubu revizyonu, VFD entegrasyonu ve drift kaybı iyileştirmeleri uygulanır. Hidrolik dengeleme ve su dağıtım revizyonu ile kule kesitinde homojen dağılım hedeflenir.',
  'Retrofit bileşenleri (dolgu/nozül/fan-motor/VFD vb.) projeye göre',
  'Kapsama göre tekliflendirilir',
  'Analiz, projelendirme, uygulama, test ve performans doğrulama',
  'Projeye göre',
  'Soğutma kulesi modernizasyon ve retrofit',
  'modernizasyon, retrofit, vfd, dolgu değişimi, fan upgrade',
  'Modernizasyon ve Retrofit | Ensotek',
  'Ensotek, soğutma kulelerinde retrofit modernizasyon ile kapasiteyi artırır, enerji tüketimini düşürür ve performansı stabilize eder.',
  'soğutma kulesi modernizasyon, retrofit, vfd, dolgu değişimi',
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
),
-- EN
(
  '91000002-1111-4111-8111-910000000102',
  '90000002-1111-4111-8111-900000000002',
  'en',
  'modernization-retrofit',
  'Modernization & Retrofit',
  'Upgrade existing towers for capacity and efficiency: fill/nozzle upgrades, fan blade optimization, motor-gearbox revision, VFD integration, drift reduction and hydraulic improvements. Water distribution uniformity is targeted across the tower cross-section.',
  'Retrofit components (fill/nozzle/fan-motor/VFD etc.) per project',
  'Quoted per scope',
  'Analysis, engineering, implementation, testing and performance validation',
  'Per project',
  'Cooling tower modernization and retrofit',
  'modernization, retrofit, vfd, fill replacement, fan upgrade',
  'Modernization & Retrofit | Ensotek',
  'Ensotek increases capacity, reduces energy consumption and stabilizes performance with retrofit modernization projects.',
  'cooling tower modernization, retrofit, vfd, fill replacement, fan upgrade',
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
),
-- DE
(
  '91000002-1111-4111-8111-910000000202',
  '90000002-1111-4111-8111-900000000002',
  'de',
  'modernization-retrofit',
  'Modernisierung & Retrofit',
  'Retrofit für mehr Leistung und Effizienz: Füllkörper-/Düsen-Upgrade, Ventilatoroptimierung, Motor-Getriebe-Revision, VFD-Integration, Drift-Reduktion und hydraulische Verbesserungen. Fokus: gleichmäßige Wasserverteilung über den Turmquerschnitt.',
  NULL,
  'Nach Umfang',
  'Analyse, Engineering, Umsetzung, Tests und Performance-Validierung',
  'Nach Projekt',
  'Modernisierung und Retrofit von Kühltürmen',
  'modernisierung, retrofit, vfd, füllkörper, ventilator',
  'Modernisierung & Retrofit | Ensotek',
  'Ensotek erhöht Kapazität, senkt Energieverbrauch und stabilisiert die Performance durch Retrofit-Modernisierung.',
  'kühlturm modernisierung, retrofit, vfd, füllkörper wechsel',
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

INSERT INTO `service_images`
(`id`,`service_id`,`image_asset_id`,`image_url`,`is_active`,`display_order`,`created_at`,`updated_at`)
VALUES
('92000002-1111-4111-8111-920000000001','90000002-1111-4111-8111-900000000002',NULL,'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1600&q=80',1,10,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('92000002-1111-4111-8111-920000000002','90000002-1111-4111-8111-900000000002',NULL,'https://images.unsplash.com/photo-1582719478185-2f0e4e2cdb4a?auto=format&fit=crop&w=1600&q=80',1,20,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('92000002-1111-4111-8111-920000000003','90000002-1111-4111-8111-900000000002',NULL,'https://images.unsplash.com/photo-1581092795360-0dc3e2b31d08?auto=format&fit=crop&w=1600&q=80',1,30,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
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
-- IMG A
('93000002-1111-4111-8111-930000000001','92000002-1111-4111-8111-920000000001','tr','Retrofit Analizi','Modernizasyon analizi','Dolgu/nozül upgrade ve hidrolik revizyon planı.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000002-1111-4111-8111-930000000101','92000002-1111-4111-8111-920000000001','en','Retrofit Analysis','Modernization analysis','Fill/nozzle upgrade and hydraulic revision plan.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000002-1111-4111-8111-930000000201','92000002-1111-4111-8111-920000000001','de','Retrofit-Analyse','Analyse','Füllkörper/Düsen-Upgrade und hydraulischer Plan.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
-- IMG B
('93000002-1111-4111-8111-930000000002','92000002-1111-4111-8111-920000000002','tr','Verimlilik İyileştirme','Enerji verimliliği','Fan-motor optimizasyonu ve VFD senaryoları.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000002-1111-4111-8111-930000000102','92000002-1111-4111-8111-920000000002','en','Efficiency Improvements','Energy efficiency','Fan-motor optimization and VFD scenarios.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000002-1111-4111-8111-930000000202','92000002-1111-4111-8111-920000000002','de','Effizienz','Effizienz','Ventilator/Motor-Optimierung und VFD-Szenarien.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
-- IMG C
('93000002-1111-4111-8111-930000000003','92000002-1111-4111-8111-920000000003','tr','Saha Uygulaması','Saha modernizasyonu','Testler ve performans doğrulama ile teslim.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000002-1111-4111-8111-930000000103','92000002-1111-4111-8111-920000000003','en','Field Implementation','Implementation','Testing and performance validation.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000002-1111-4111-8111-930000000203','92000002-1111-4111-8111-920000000003','de','Umsetzung','Umsetzung','Tests und Performance-Validierung.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `alt` = VALUES(`alt`),
  `caption` = VALUES(`caption`),
  `updated_at` = CURRENT_TIMESTAMP(3);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
