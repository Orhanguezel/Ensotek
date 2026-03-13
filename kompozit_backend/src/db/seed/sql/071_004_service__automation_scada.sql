-- =============================================================
-- FILE: src/db/seed/sql/services/071_004_service__automation_scada.sql
-- Service: Automation & SCADA (SRV_004)
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
  '90000004-1111-4111-8111-900000000004',
  'automation_scada',
  'aaaa8001-1111-4111-8111-aaaaaaaa8001',
  'bbbb8006-1111-4111-8111-bbbbbbbb8006',
  1,1,40,
  NULL,'https://res.cloudinary.com/dbozv7wqd/image/upload/v1767320750/services/cover/automation_and_scada.png',NULL,
  'Monitoring / control / reporting',
  '2–8 weeks (scope dependent)',
  'Periodic calibration & verification recommended',
  'All seasons',
  NULL,
  'Flow, temperature, conductivity, level, vibration switch, energy monitoring, alarms, remote access',
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
  '91000004-1111-4111-8111-910000000004',
  '90000004-1111-4111-8111-900000000004',
  'tr',
  'automation-scada',
  'Otomasyon, SCADA ve Uzaktan İzleme',
  'Debi, sıcaklık, iletkenlik, seviye, enerji tüketimi ve titreşim şalteri gibi kritik parametreler izlenerek alarm/raporlama altyapısı kurulabilir. Hedef; arızayı erken yakalamak, verim düşüşünü görünür kılmak ve bakım aksiyonlarını veriye dayalı yönetmektir.',
  NULL,
  'Kapsama göre tekliflendirilir',
  'Sensör seçimi, pano/otomasyon, SCADA ekranları, alarm senaryoları, uzaktan erişim',
  'Projeye göre',
  'Soğutma kulesi otomasyon ve SCADA',
  'otomasyon, scada, uzaktan izleme, alarm, enerji izleme',
  'Otomasyon ve SCADA | Ensotek',
  'Ensotek, soğutma kuleleri için otomasyon ve SCADA çözümleri ile kritik parametreleri gerçek zamanlı izleme ve raporlama altyapısı kurar.',
  'soğutma kulesi otomasyon, scada, uzaktan izleme',
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
),
-- EN
(
  '91000004-1111-4111-8111-910000000104',
  '90000004-1111-4111-8111-900000000004',
  'en',
  'automation-scada',
  'Automation, SCADA & Remote Monitoring',
  'Monitor critical parameters such as flow, temperature, conductivity, level, energy consumption and vibration switch status. Build alarms and reporting to detect failures early and manage maintenance based on data.',
  NULL,
  'Quoted per scope',
  'Sensor selection, panels/automation, SCADA screens, alarm scenarios, remote access',
  'Per project',
  'Cooling tower automation and SCADA',
  'automation, scada, remote monitoring, alarms, energy monitoring',
  'Automation & SCADA | Ensotek',
  'Ensotek implements automation and SCADA systems to monitor critical cooling tower parameters in real time.',
  'cooling tower automation, scada, remote monitoring',
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
),
-- DE
(
  '91000004-1111-4111-8111-910000000204',
  '90000004-1111-4111-8111-900000000004',
  'de',
  'automation-scada',
  'Automatisierung, SCADA & Fernüberwachung',
  'Überwachung von Durchfluss, Temperatur, Leitfähigkeit, Füllstand, Energieverbrauch und Schwingungsschalter-Status. Alarmierung und Reporting zur Früherkennung von Störungen und datenbasierter Wartungssteuerung.',
  NULL,
  'Nach Umfang',
  'Sensorik, Schaltschrank/Automation, SCADA-Bilder, Alarmkonzepte, Remote-Zugriff',
  'Nach Projekt',
  'Kühlturm Automatisierung und SCADA',
  'automation, scada, fernüberwachung, alarm, energie',
  'Automatisierung & SCADA | Ensotek',
  'Ensotek implementiert Automatisierungs- und SCADA-Systeme zur Echtzeitüberwachung kritischer Kühlturmparameter.',
  'kühlturm automation, scada, fernüberwachung',
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
('92000004-1111-4111-8111-920000000001','90000004-1111-4111-8111-900000000004',NULL,'https://images.unsplash.com/photo-1581092334555-1f9b6b3f6d2c?auto=format&fit=crop&w=1600&q=80',1,10,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('92000004-1111-4111-8111-920000000002','90000004-1111-4111-8111-900000000004',NULL,'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1600&q=80',1,20,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('92000004-1111-4111-8111-920000000003','90000004-1111-4111-8111-900000000004',NULL,'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',1,30,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
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
('93000004-1111-4111-8111-930000000001','92000004-1111-4111-8111-920000000001','tr','Sensör & Alarm Tasarımı','Alarm altyapısı','Debi/sıcaklık/iletkenlik ve titreşim izleme.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000004-1111-4111-8111-930000000101','92000004-1111-4111-8111-920000000001','en','Sensors & Alarms','Alarm design','Flow/temperature/conductivity and vibration monitoring.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000004-1111-4111-8111-930000000201','92000004-1111-4111-8111-920000000001','de','Sensorik & Alarme','Alarme','Durchfluss/Temperatur/Leitfähigkeit und Schwingung.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),

('93000004-1111-4111-8111-930000000002','92000004-1111-4111-8111-920000000002','tr','SCADA Ekranları','SCADA ekranları','Operatör için canlı izleme ve raporlama.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000004-1111-4111-8111-930000000102','92000004-1111-4111-8111-920000000002','en','SCADA Screens','SCADA screens','Live monitoring and reporting for operators.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000004-1111-4111-8111-930000000202','92000004-1111-4111-8111-920000000002','de','SCADA','SCADA','Live Monitoring und Reporting.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),

('93000004-1111-4111-8111-930000000003','92000004-1111-4111-8111-920000000003','tr','Uzaktan Erişim','Uzaktan izleme','Güvenli uzaktan bağlantı ve bildirimler.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000004-1111-4111-8111-930000000103','92000004-1111-4111-8111-920000000003','en','Remote Access','Remote monitoring','Secure remote access and notifications.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000004-1111-4111-8111-930000000203','92000004-1111-4111-8111-920000000003','de','Remote','Remote','Sicherer Fernzugriff und Benachrichtigungen.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `alt` = VALUES(`alt`),
  `caption` = VALUES(`caption`),
  `updated_at` = CURRENT_TIMESTAMP(3);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
