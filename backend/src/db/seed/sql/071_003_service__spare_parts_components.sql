-- =============================================================
-- FILE: src/db/seed/sql/services/071_003_service__spare_parts_components.sql
-- Service: Spare Parts & Components (SRV_003)
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
  '90000003-1111-4111-8111-900000000003',
  'spare_parts_and_components',
  'aaaa8001-1111-4111-8111-aaaaaaaa8001',
  'bbbb8004-1111-4111-8111-bbbbbbbb8004',
  1,1,30,
  NULL,'http://localhost:8086/uploads/services/spare_parts_and_components.png',NULL,
  'Supply of critical parts / components',
  'Depends on stock and lead times',
  'Inspection plan recommended for critical parts',
  'All seasons',
  NULL,
  'Fills, spray nozzles, drift eliminators, fan blades, motors, gearboxes, belts/pulleys, fittings',
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
  '91000003-1111-4111-8111-910000000003',
  '90000003-1111-4111-8111-900000000003',
  'tr',
  'spare-parts-components',
  'Yedek Parçalar ve Kritik Bileşenler',
  'Katalogdaki ana komponentlerle uyumlu şekilde; nozül tipleri, su dağıtım elemanları, PVC film dolgu / PP dolgu, damla tutucu, fan kanatları, motor-redüktör ve mekanik bağlantı elemanları için doğru parça eşleştirmesi yapılır. Hızlı tedarik + opsiyonel montaj/devreye alma desteği ile işletme riski azaltılır.',
  'Dolgu, nozül, drift eliminator, fan, motor, redüktör, mekanik parçalar',
  'Parça ve tedarik durumuna göre',
  'Parça seçimi danışmanlığı, tedarik, opsiyonel montaj ve devreye alma desteği',
  'Ürün bazlı garanti',
  'Soğutma kulesi yedek parça ve bileşenler',
  'yedek parça, dolgu, nozül, fan, motor, redüktör',
  'Yedek Parçalar ve Bileşenler | Ensotek',
  'Ensotek, soğutma kuleleri için yedek parça ve bileşen tedariki sağlar; doğru parça seçimi ile arıza riskini azaltır.',
  'soğutma kulesi yedek parça, dolgu, nozül, fan motor, redüktör',
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
),
-- EN
(
  '91000003-1111-4111-8111-910000000103',
  '90000003-1111-4111-8111-900000000003',
  'en',
  'spare-parts-components',
  'Spare Parts & Critical Components',
  'We match and supply catalog-aligned components: nozzle types, water distribution parts, PVC film fills / PP fills, drift eliminators, fan blades, motor-gearbox and mechanical fittings. Fast supply with optional installation/commissioning minimizes operational risk.',
  'Fills, nozzles, drift eliminators, fan, motor, gearbox, mechanical parts',
  'Depends on stock and lead time',
  'Part matching, supply, optional installation and commissioning',
  'Product-based warranty',
  'Cooling tower spare parts and components',
  'spare parts, fills, nozzles, fan, motor, gearbox',
  'Spare Parts & Components | Ensotek',
  'Ensotek supplies cooling tower parts and components and reduces failure risks through correct matching.',
  'cooling tower spare parts, fill, nozzle, fan motor, gearbox',
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
),
-- DE
(
  '91000003-1111-4111-8111-910000000203',
  '90000003-1111-4111-8111-900000000003',
  'de',
  'spare-parts-components',
  'Ersatzteile & Kritische Komponenten',
  'Lieferung und Matching von katalogkonformen Komponenten: Düsentypen, Wasserverteilung, PVC/PP Füllkörper, Drift Eliminatoren, Ventilatorblätter, Motor-Getriebe und mechanische Verbindungselemente. Schnelle Versorgung mit optionaler Montage/Inbetriebnahme reduziert Betriebsrisiken.',
  NULL,
  'Nach Verfügbarkeit',
  'Matching, Lieferung, optionale Montage und Inbetriebnahme',
  'Produktabhängig',
  'Ersatzteile für Kühltürme',
  'ersatzteile, füllkörper, düsen, ventilator, motor, getriebe',
  'Ersatzteile & Komponenten | Ensotek',
  'Ensotek liefert Ersatzteile und Komponenten für Kühltürme und reduziert Ausfallrisiken durch korrektes Matching.',
  'kühlturm ersatzteile, füllkörper, düse, motor getriebe',
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
('92000003-1111-4111-8111-920000000001','90000003-1111-4111-8111-900000000003',NULL,'https://images.unsplash.com/photo-1581091215367-59ab6b26d0f6?auto=format&fit=crop&w=1600&q=80',1,10,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('92000003-1111-4111-8111-920000000002','90000003-1111-4111-8111-900000000003',NULL,'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',1,20,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('92000003-1111-4111-8111-920000000003','90000003-1111-4111-8111-900000000003',NULL,'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1600&q=80',1,30,CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
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
('93000003-1111-4111-8111-930000000001','92000003-1111-4111-8111-920000000001','tr','Parça Eşleştirme','Doğru parça seçimi','Kule tipine göre nozül/dolgu/drift eliminator seçimi.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000003-1111-4111-8111-930000000101','92000003-1111-4111-8111-920000000001','en','Part Matching','Correct matching','Nozzle/fill/drift eliminator selection by tower type.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000003-1111-4111-8111-930000000201','92000003-1111-4111-8111-920000000001','de','Matching','Matching','Auswahl von Düsen/Füllkörpern/Drift Eliminatoren.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
-- IMG B
('93000003-1111-4111-8111-930000000002','92000003-1111-4111-8111-920000000002','tr','Hızlı Tedarik','Tedarik ve lojistik','Stok ve teslimat planlaması.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000003-1111-4111-8111-930000000102','92000003-1111-4111-8111-920000000002','en','Fast Supply','Supply and logistics','Stock and delivery planning.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000003-1111-4111-8111-930000000202','92000003-1111-4111-8111-920000000002','de','Lieferung','Lieferung','Bestand und Lieferplanung.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
-- IMG C
('93000003-1111-4111-8111-930000000003','92000003-1111-4111-8111-920000000003','tr','Uygulama Desteği','Montaj desteği','Opsiyonel montaj ve devreye alma.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000003-1111-4111-8111-930000000103','92000003-1111-4111-8111-920000000003','en','Installation Support','Installation support','Optional installation and commissioning.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3)),
('93000003-1111-4111-8111-930000000203','92000003-1111-4111-8111-920000000003','de','Montage-Support','Support','Optionale Montage und Inbetriebnahme.',CURRENT_TIMESTAMP(3),CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `alt` = VALUES(`alt`),
  `caption` = VALUES(`caption`),
  `updated_at` = CURRENT_TIMESTAMP(3);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
