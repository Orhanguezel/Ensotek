-- =============================================================
-- FILE: 071.0_services_base.sql
-- Ensotek services – BASE (PARENT + IMAGES)
-- - Idempotent (UPSERT)
-- - Locale independent: services + service_images only
-- - Slugs live in services_i18n per locale files
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------------
-- FIXED SERVICE IDS (keep stable)
-- -------------------------------------------------------------------
SET @SRV_001 := '90000001-1111-4111-8111-900000000001'; -- Maintenance & Repair
SET @SRV_002 := '90000002-1111-4111-8111-900000000002'; -- Modernization & Retrofit
SET @SRV_003 := '90000003-1111-4111-8111-900000000003'; -- Spare Parts & Components
SET @SRV_004 := '90000004-1111-4111-8111-900000000004'; -- Automation & SCADA (repurpose old "appsrefs" concept -> automation)
SET @SRV_005 := '90000005-1111-4111-8111-900000000005'; -- Engineering Support

-- NEW services (added for slider consistency)
SET @SRV_006 := '90000006-1111-4111-8111-900000000006'; -- Site Survey & Engineering
SET @SRV_007 := '90000007-1111-4111-8111-900000000007'; -- Performance Optimization
SET @SRV_008 := '90000008-1111-4111-8111-900000000008'; -- Commissioning & Startup
SET @SRV_009 := '90000009-1111-4111-8111-900000000009'; -- Emergency Response

-- -------------------------------------------------------------------
-- CATEGORY + SUBCATEGORY IDS (from 011/012)
-- -------------------------------------------------------------------
SET @CAT_SERVICES := 'aaaa8001-1111-4111-8111-aaaaaaaa8001';

SET @SUB_SVC_MAINTENANCE   := 'bbbb8002-1111-4111-8111-bbbbbbbb8002';
SET @SUB_SVC_MODERNIZATION := 'bbbb8003-1111-4111-8111-bbbbbbbb8003';
SET @SUB_SVC_SPAREPARTS    := 'bbbb8004-1111-4111-8111-bbbbbbbb8004';
SET @SUB_SVC_ENGINEERING   := 'bbbb8006-1111-4111-8111-bbbbbbbb8006';

-- -------------------------------------------------------------------
-- IMAGE IDS (shared across locales)
-- Pattern: 92<service><A/B/C> (keep stable)
-- -------------------------------------------------------------------
-- SRV_001
SET @IMG_001A := '92000001-1111-4111-8111-920000000001';
SET @IMG_001B := '92000001-1111-4111-8111-920000000002';
SET @IMG_001C := '92000001-1111-4111-8111-920000000003';

-- SRV_002
SET @IMG_002A := '92000002-1111-4111-8111-920000000001';
SET @IMG_002B := '92000002-1111-4111-8111-920000000002';
SET @IMG_002C := '92000002-1111-4111-8111-920000000003';

-- SRV_003
SET @IMG_003A := '92000003-1111-4111-8111-920000000001';
SET @IMG_003B := '92000003-1111-4111-8111-920000000002';
SET @IMG_003C := '92000003-1111-4111-8111-920000000003';

-- SRV_004
SET @IMG_004A := '92000004-1111-4111-8111-920000000001';
SET @IMG_004B := '92000004-1111-4111-8111-920000000002';
SET @IMG_004C := '92000004-1111-4111-8111-920000000003';

-- SRV_005
SET @IMG_005A := '92000005-1111-4111-8111-920000000001';
SET @IMG_005B := '92000005-1111-4111-8111-920000000002';
SET @IMG_005C := '92000005-1111-4111-8111-920000000003';

-- SRV_006
SET @IMG_006A := '92000006-1111-4111-8111-920000000001';
SET @IMG_006B := '92000006-1111-4111-8111-920000000002';
SET @IMG_006C := '92000006-1111-4111-8111-920000000003';

-- SRV_007
SET @IMG_007A := '92000007-1111-4111-8111-920000000001';
SET @IMG_007B := '92000007-1111-4111-8111-920000000002';
SET @IMG_007C := '92000007-1111-4111-8111-920000000003';

-- SRV_008
SET @IMG_008A := '92000008-1111-4111-8111-920000000001';
SET @IMG_008B := '92000008-1111-4111-8111-920000000002';
SET @IMG_008C := '92000008-1111-4111-8111-920000000003';

-- SRV_009
SET @IMG_009A := '92000009-1111-4111-8111-920000000001';
SET @IMG_009B := '92000009-1111-4111-8111-920000000002';
SET @IMG_009C := '92000009-1111-4111-8111-920000000003';

-- -------------------------------------------------------------------
-- 1) PARENT: services (UPSERT)
-- -------------------------------------------------------------------
INSERT INTO `services`
(`id`,`type`,`category_id`,`sub_category_id`,
 `featured`,`is_active`,`display_order`,
 `featured_image`,`image_url`,`image_asset_id`,
 `area`,`duration`,`maintenance`,`season`,`thickness`,`equipment`,
 `created_at`,`updated_at`)
VALUES
-- 001 Maintenance & Repair
(@SRV_001,'maintenance_and_repair',@CAT_SERVICES,@SUB_SVC_MAINTENANCE,
 1,1,10,
 NULL,'http://localhost:8086/uploads/services/maintenance_and_repair.png',NULL,
 'Existing cooling towers / plants / commercial buildings',
 '1 day – 4 weeks (scope dependent)',
 'Optional periodic maintenance contract',
 'All seasons',
 NULL,
 'Nozzles, fills, drift eliminators, fan, motor, gearbox, mechanical components',
 NOW(3), NOW(3)),

-- 002 Modernization & Retrofit
(@SRV_002,'modernization',@CAT_SERVICES,@SUB_SVC_MODERNIZATION,
 1,1,20,
 NULL,'http://localhost:8086/uploads/services/modernization_and_retrofit.png',NULL,
 'Capacity increase / efficiency improvement',
 '1–6 weeks (analysis + implementation)',
 'Recommended together with maintenance planning',
 'All seasons',
 NULL,
 'Fill/nozzle upgrades, fan-motor optimization, VFD, drift reduction, hydraulic improvements',
 NOW(3), NOW(3)),

-- 003 Spare Parts & Components
(@SRV_003,'spare_parts_and_components',@CAT_SERVICES,@SUB_SVC_SPAREPARTS,
 1,1,30,
 NULL,'http://localhost:8086/uploads/services/spare_parts_and_components.png',NULL,
 'Supply of critical parts / components',
 'Depends on stock and lead times',
 'Inspection plan recommended for critical parts',
 'All seasons',
 NULL,
 'Fills, spray nozzles, drift eliminators, fan blades, motors, gearboxes, belts/pulleys, fittings',
 NOW(3), NOW(3)),

-- 004 Automation & SCADA
(@SRV_004,'automation_scada',@CAT_SERVICES,@SUB_SVC_ENGINEERING,
 1,1,40,
 NULL,'http://localhost:8086/uploads/services/automation_and_scada.png',NULL,
 'Monitoring / control / reporting',
 '2–8 weeks (scope dependent)',
 'Periodic calibration & verification recommended',
 'All seasons',
 NULL,
 'Flow, temperature, conductivity, level, vibration switch, energy monitoring, alarms, remote access',
 NOW(3), NOW(3)),

-- 005 Engineering Support
(@SRV_005,'engineering_support',@CAT_SERVICES,@SUB_SVC_ENGINEERING,
 1,1,50,
 NULL,'http://localhost:8086/uploads/services/engineering_support.png',NULL,
 'Design / consulting / optimization',
 '2–8 weeks (scope dependent)',
 'Optional periodic review + reporting',
 'All seasons',
 NULL,
 'Heat load analysis, sizing, hydraulic balancing, performance assessment, documentation, technical training',
 NOW(3), NOW(3)),

-- 006 Site Survey & Engineering
(@SRV_006,'site_survey_engineering',@CAT_SERVICES,@SUB_SVC_ENGINEERING,
 1,1,60,
 NULL,'http://localhost:8086/uploads/services/site_survey_and_engineering.png',NULL,
 'On-site survey / mechanical layout / selection',
 '1 day – 3 weeks (survey + design)',
 'Optional: integration plan with maintenance',
 'All seasons',
 NULL,
 'Site survey, process conditions, selection & sizing, piping concept, access platforms, safety checklist',
 NOW(3), NOW(3)),

-- 007 Performance Optimization
(@SRV_007,'performance_optimization',@CAT_SERVICES,@SUB_SVC_ENGINEERING,
 1,1,70,
 NULL,'http://localhost:8086/uploads/services/performance_optimization.png',NULL,
 'Measurement / reporting / optimization',
 '1 day – 4 weeks (measure + actions)',
 'Best results with periodic monitoring',
 'All seasons',
 NULL,
 'Approach temperature, fan efficiency, distribution quality, drift loss, water chemistry baseline, reporting',
 NOW(3), NOW(3)),

-- 008 Commissioning & Startup
(@SRV_008,'commissioning_startup',@CAT_SERVICES,@SUB_SVC_ENGINEERING,
 1,1,80,
 NULL,'http://localhost:8086/uploads/services/commissioning_and_startup.png',NULL,
 'Installation coordination / commissioning / training',
 '1 day – 2 weeks (project dependent)',
 'Handover checklist & initial maintenance plan included',
 'All seasons',
 NULL,
 'Pre-start checks, test runs, vibration checks, water distribution tests, handover documentation, operator training',
 NOW(3), NOW(3)),

-- 009 Emergency Response
(@SRV_009,'emergency_response',@CAT_SERVICES,@SUB_SVC_MAINTENANCE,
 1,1,90,
 NULL,'http://localhost:8086/uploads/services/emergency_response.png',NULL,
 'Urgent troubleshooting / safe restart',
 'Same day – 7 days (depending on fault)',
 'Follow-up maintenance action plan recommended',
 'All seasons',
 NULL,
 'Rapid diagnostics, part replacement, safe restart, temporary bypass planning, incident report',
 NOW(3), NOW(3))
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
  `updated_at` = NOW(3);

-- -------------------------------------------------------------------
-- 2) service_images (UPSERT)
-- -------------------------------------------------------------------
INSERT INTO `service_images`
(`id`,`service_id`,`image_asset_id`,`image_url`,`is_active`,`display_order`,`created_at`,`updated_at`)
VALUES
-- SRV_001
(@IMG_001A,@SRV_001,NULL,'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1600&q=80',1,10,NOW(3),NOW(3)),
(@IMG_001B,@SRV_001,NULL,'https://images.unsplash.com/photo-1516575150278-77136aed6920?auto=format&fit=crop&w=1600&q=80',1,20,NOW(3),NOW(3)),
(@IMG_001C,@SRV_001,NULL,'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80',1,30,NOW(3),NOW(3)),

-- SRV_002
(@IMG_002A,@SRV_002,NULL,'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1600&q=80',1,10,NOW(3),NOW(3)),
(@IMG_002B,@SRV_002,NULL,'https://images.unsplash.com/photo-1582719478185-2f0e4e2cdb4a?auto=format&fit=crop&w=1600&q=80',1,20,NOW(3),NOW(3)),
(@IMG_002C,@SRV_002,NULL,'https://images.unsplash.com/photo-1581092795360-0dc3e2b31d08?auto=format&fit=crop&w=1600&q=80',1,30,NOW(3),NOW(3)),

-- SRV_003
(@IMG_003A,@SRV_003,NULL,'https://images.unsplash.com/photo-1581091215367-59ab6b26d0f6?auto=format&fit=crop&w=1600&q=80',1,10,NOW(3),NOW(3)),
(@IMG_003B,@SRV_003,NULL,'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',1,20,NOW(3),NOW(3)),
(@IMG_003C,@SRV_003,NULL,'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1600&q=80',1,30,NOW(3),NOW(3)),

-- SRV_004
(@IMG_004A,@SRV_004,NULL,'https://images.unsplash.com/photo-1581092334555-1f9b6b3f6d2c?auto=format&fit=crop&w=1600&q=80',1,10,NOW(3),NOW(3)),
(@IMG_004B,@SRV_004,NULL,'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1600&q=80',1,20,NOW(3),NOW(3)),
(@IMG_004C,@SRV_004,NULL,'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',1,30,NOW(3),NOW(3)),

-- SRV_005
(@IMG_005A,@SRV_005,NULL,'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1600&q=80',1,10,NOW(3),NOW(3)),
(@IMG_005B,@SRV_005,NULL,'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1600&q=80',1,20,NOW(3),NOW(3)),
(@IMG_005C,@SRV_005,NULL,'https://images.unsplash.com/photo-1581092919535-7146a4c2f5f0?auto=format&fit=crop&w=1600&q=80',1,30,NOW(3),NOW(3)),

-- SRV_006
(@IMG_006A,@SRV_006,NULL,'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80',1,10,NOW(3),NOW(3)),
(@IMG_006B,@SRV_006,NULL,'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80',1,20,NOW(3),NOW(3)),
(@IMG_006C,@SRV_006,NULL,'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80',1,30,NOW(3),NOW(3)),

-- SRV_007
(@IMG_007A,@SRV_007,NULL,'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',1,10,NOW(3),NOW(3)),
(@IMG_007B,@SRV_007,NULL,'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80',1,20,NOW(3),NOW(3)),
(@IMG_007C,@SRV_007,NULL,'https://images.unsplash.com/photo-1581092795360-0dc3e2b31d08?auto=format&fit=crop&w=1600&q=80',1,30,NOW(3),NOW(3)),

-- SRV_008
(@IMG_008A,@SRV_008,NULL,'https://images.unsplash.com/photo-1581092334555-1f9b6b3f6d2c?auto=format&fit=crop&w=1600&q=80',1,10,NOW(3),NOW(3)),
(@IMG_008B,@SRV_008,NULL,'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1600&q=80',1,20,NOW(3),NOW(3)),
(@IMG_008C,@SRV_008,NULL,'https://images.unsplash.com/photo-1581092919535-7146a4c2f5f0?auto=format&fit=crop&w=1600&q=80',1,30,NOW(3),NOW(3)),

-- SRV_009
(@IMG_009A,@SRV_009,NULL,'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80',1,10,NOW(3),NOW(3)),
(@IMG_009B,@SRV_009,NULL,'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',1,20,NOW(3),NOW(3)),
(@IMG_009C,@SRV_009,NULL,'https://images.unsplash.com/photo-1516575150278-77136aed6920?auto=format&fit=crop&w=1600&q=80',1,30,NOW(3),NOW(3))
ON DUPLICATE KEY UPDATE
  `service_id` = VALUES(`service_id`),
  `image_asset_id` = VALUES(`image_asset_id`),
  `image_url` = VALUES(`image_url`),
  `is_active` = VALUES(`is_active`),
  `display_order` = VALUES(`display_order`),
  `updated_at` = NOW(3);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
