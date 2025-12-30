-- =============================================================
-- FILE: 071.2_services_en.sql
-- Ensotek services – EN i18n + EN image i18n
-- - Idempotent (UPSERT)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

SET @SRV_001 := '90000001-1111-4111-8111-900000000001';
SET @SRV_002 := '90000002-1111-4111-8111-900000000002';
SET @SRV_003 := '90000003-1111-4111-8111-900000000003';
SET @SRV_004 := '90000004-1111-4111-8111-900000000004';
SET @SRV_005 := '90000005-1111-4111-8111-900000000005';
SET @SRV_006 := '90000006-1111-4111-8111-900000000006';
SET @SRV_007 := '90000007-1111-4111-8111-900000000007';
SET @SRV_008 := '90000008-1111-4111-8111-900000000008';
SET @SRV_009 := '90000009-1111-4111-8111-900000000009';

SET @IMG_001A := '92000001-1111-4111-8111-920000000001';
SET @IMG_001B := '92000001-1111-4111-8111-920000000002';
SET @IMG_001C := '92000001-1111-4111-8111-920000000003';

SET @IMG_002A := '92000002-1111-4111-8111-920000000001';
SET @IMG_002B := '92000002-1111-4111-8111-920000000002';
SET @IMG_002C := '92000002-1111-4111-8111-920000000003';

SET @IMG_003A := '92000003-1111-4111-8111-920000000001';
SET @IMG_003B := '92000003-1111-4111-8111-920000000002';
SET @IMG_003C := '92000003-1111-4111-8111-920000000003';

SET @IMG_004A := '92000004-1111-4111-8111-920000000001';
SET @IMG_004B := '92000004-1111-4111-8111-920000000002';
SET @IMG_004C := '92000004-1111-4111-8111-920000000003';

SET @IMG_005A := '92000005-1111-4111-8111-920000000001';
SET @IMG_005B := '92000005-1111-4111-8111-920000000002';
SET @IMG_005C := '92000005-1111-4111-8111-920000000003';

SET @IMG_006A := '92000006-1111-4111-8111-920000000001';
SET @IMG_006B := '92000006-1111-4111-8111-920000000002';
SET @IMG_006C := '92000006-1111-4111-8111-920000000003';

SET @IMG_007A := '92000007-1111-4111-8111-920000000001';
SET @IMG_007B := '92000007-1111-4111-8111-920000000002';
SET @IMG_007C := '92000007-1111-4111-8111-920000000003';

SET @IMG_008A := '92000008-1111-4111-8111-920000000001';
SET @IMG_008B := '92000008-1111-4111-8111-920000000002';
SET @IMG_008C := '92000008-1111-4111-8111-920000000003';

SET @IMG_009A := '92000009-1111-4111-8111-920000000001';
SET @IMG_009B := '92000009-1111-4111-8111-920000000002';
SET @IMG_009C := '92000009-1111-4111-8111-920000000003';

INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,`description`,
 `material`,`price`,`includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
VALUES
('91000001-1111-4111-8111-910000000101', @SRV_001,'en',
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
 NOW(3), NOW(3)),

('91000002-1111-4111-8111-910000000102', @SRV_002,'en',
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
 NOW(3), NOW(3)),

('91000003-1111-4111-8111-910000000103', @SRV_003,'en',
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
 NOW(3), NOW(3)),

('91000004-1111-4111-8111-910000000104', @SRV_004,'en',
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
 NOW(3), NOW(3)),

('91000005-1111-4111-8111-910000000105', @SRV_005,'en',
 'engineering-support',
 'Engineering Support',
 'We provide heat load analysis, sizing/selection, hydraulic balancing, performance assessment and technical documentation. Before/after measurements validate the target performance.',
 NULL,
 'Quoted per scope',
 'Survey, calculations, design, commissioning support, performance validation, training',
 'Per scope',
 'Cooling tower engineering support',
 'engineering, optimization, performance, commissioning, training',
 'Engineering Support | Ensotek',
 'Ensotek delivers engineering support for correct design, optimization and performance validation.',
 'cooling tower engineering, performance analysis, optimization',
 NOW(3), NOW(3)),

('91000006-1111-4111-8111-910000000106', @SRV_006,'en',
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
 NOW(3), NOW(3)),

('91000007-1111-4111-8111-910000000107', @SRV_007,'en',
 'performance-optimization',
 'Performance Optimization & Energy Efficiency',
 'Measure approach temperature, fan efficiency, water distribution uniformity, drift loss and water chemistry. Optimize fills/nozzles, fan settings and operating setpoints to reduce energy costs and create a reportable KPI set.',
 NULL,
 'Quoted per scope',
 'On-site measurement, analysis, action plan, reporting, validation tests',
 'Per project',
 'Cooling tower performance optimization',
 'performance, efficiency, energy, measurement, reporting',
 'Performance Optimization | Ensotek',
 'Ensotek improves cooling tower performance and reduces energy consumption with measurement-driven optimization.',
 'cooling tower performance optimization, energy efficiency',
 NOW(3), NOW(3)),

('91000008-1111-4111-8111-910000000108', @SRV_008,'en',
 'commissioning-startup',
 'Commissioning & Startup',
 'Coordinate installation, run checklists, test runs, vibration checks, water distribution tests and safe first startup. Deliver operator training and commissioning documentation.',
 NULL,
 'Quoted per scope',
 'Installation coordination, commissioning, tests, training, handover documentation',
 'Per project',
 'Cooling tower commissioning and training',
 'commissioning, startup, tests, training, checklists',
 'Commissioning & Startup | Ensotek',
 'Ensotek commissions systems safely and completes operator training with documented handover.',
 'cooling tower commissioning, startup, operator training',
 NOW(3), NOW(3)),

('91000009-1111-4111-8111-910000000109', @SRV_009,'en',
 'emergency-response',
 'Emergency Service & Troubleshooting',
 'Rapid diagnostics, replacement of critical parts (fan/motor/gearbox, nozzles, fills, drift eliminators) and safe restart. Followed by root cause analysis and preventive maintenance plan.',
 NULL,
 'Depends on case',
 'Rapid response, diagnostics, part replacement, safe restart, incident reporting',
 'Per project',
 'Cooling tower emergency service',
 'emergency, troubleshooting, response, restart, reporting',
 'Emergency Service | Ensotek',
 'Ensotek responds quickly to critical cooling tower failures and manages safe restart procedures.',
 'cooling tower emergency service, troubleshooting',
 NOW(3), NOW(3))
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
  `updated_at` = NOW(3);

INSERT INTO `service_images_i18n`
(`id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`)
VALUES
('93000001-1111-4111-8111-930000000101',@IMG_001A,'en','Periodic Checks','Periodic checks','Fan group, motor-gearbox and mechanical inspections.',NOW(3),NOW(3)),
('93000001-1111-4111-8111-930000000102',@IMG_001B,'en','Cleaning & Distribution','Water distribution','Nozzle and distribution uniformity validation.',NOW(3),NOW(3)),
('93000001-1111-4111-8111-930000000103',@IMG_001C,'en','Field Repair','On-site repair','Critical replacement and safe restart.',NOW(3),NOW(3)),

('93000002-1111-4111-8111-930000000101',@IMG_002A,'en','Retrofit Analysis','Modernization analysis','Fill/nozzle upgrade and hydraulic revision plan.',NOW(3),NOW(3)),
('93000002-1111-4111-8111-930000000102',@IMG_002B,'en','Efficiency Improvements','Energy efficiency','Fan-motor optimization and VFD scenarios.',NOW(3),NOW(3)),
('93000002-1111-4111-8111-930000000103',@IMG_002C,'en','Field Implementation','Implementation','Testing and performance validation.',NOW(3),NOW(3)),

('93000003-1111-4111-8111-930000000101',@IMG_003A,'en','Part Matching','Correct matching','Nozzle/fill/drift eliminator selection by tower type.',NOW(3),NOW(3)),
('93000003-1111-4111-8111-930000000102',@IMG_003B,'en','Fast Supply','Supply and logistics','Stock and delivery planning.',NOW(3),NOW(3)),
('93000003-1111-4111-8111-930000000103',@IMG_003C,'en','Installation Support','Installation support','Optional installation and commissioning.',NOW(3),NOW(3)),

('93000004-1111-4111-8111-930000000101',@IMG_004A,'en','Sensors & Alarms','Alarm design','Flow/temperature/conductivity and vibration monitoring.',NOW(3),NOW(3)),
('93000004-1111-4111-8111-930000000102',@IMG_004B,'en','SCADA Screens','SCADA screens','Live monitoring and reporting for operators.',NOW(3),NOW(3)),
('93000004-1111-4111-8111-930000000103',@IMG_004C,'en','Remote Access','Remote monitoring','Secure remote access and notifications.',NOW(3),NOW(3)),

('93000005-1111-4111-8111-930000000101',@IMG_005A,'en','Heat Load Analysis','Heat load','Sizing calculations for correct selection.',NOW(3),NOW(3)),
('93000005-1111-4111-8111-930000000102',@IMG_005B,'en','Performance Assessment','Performance','Benchmarking and optimization opportunities.',NOW(3),NOW(3)),
('93000005-1111-4111-8111-930000000103',@IMG_005C,'en','Technical Training','Training','Documentation and training sessions.',NOW(3),NOW(3)),

('93000006-1111-4111-8111-930000000101',@IMG_006A,'en','Site Survey','Site survey','Layout, access and safety checklists.',NOW(3),NOW(3)),
('93000006-1111-4111-8111-930000000102',@IMG_006B,'en','Engineering','Engineering design','Selection/sizing and implementation plan.',NOW(3),NOW(3)),
('93000006-1111-4111-8111-930000000103',@IMG_006C,'en','Preparation','Preparation','Planning for installation coordination.',NOW(3),NOW(3)),

('93000007-1111-4111-8111-930000000101',@IMG_007A,'en','KPI Measurements','KPI measurement','Approach temperature and efficiency metrics.',NOW(3),NOW(3)),
('93000007-1111-4111-8111-930000000102',@IMG_007B,'en','Reporting','Reporting','Before/after comparison and action plan.',NOW(3),NOW(3)),
('93000007-1111-4111-8111-930000000103',@IMG_007C,'en','Optimization Actions','Optimization','Fan/distribution/fill optimization steps.',NOW(3),NOW(3)),

('93000008-1111-4111-8111-930000000101',@IMG_008A,'en','Checklists','Checklists','Pre-commissioning checks.',NOW(3),NOW(3)),
('93000008-1111-4111-8111-930000000102',@IMG_008B,'en','Test Run','Test run','Vibration checks and safe startup steps.',NOW(3),NOW(3)),
('93000008-1111-4111-8111-930000000103',@IMG_008C,'en','Training & Handover','Handover','Operator training and documentation.',NOW(3),NOW(3)),

('93000009-1111-4111-8111-930000000101',@IMG_009A,'en','Rapid Response','Rapid response','Fast diagnostics in critical downtime.',NOW(3),NOW(3)),
('93000009-1111-4111-8111-930000000102',@IMG_009B,'en','Part Replacement','Replacement','Fan/motor/gearbox and critical component replacement.',NOW(3),NOW(3)),
('93000009-1111-4111-8111-930000000103',@IMG_009C,'en','Safe Restart','Safe restart','Checks, tests and incident reporting.',NOW(3),NOW(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `alt` = VALUES(`alt`),
  `caption` = VALUES(`caption`),
  `updated_at` = NOW(3);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
