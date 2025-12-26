-- =============================================================
-- FILE: 071.2_services_en.sql
-- Ensotek services – EN i18n + EN image i18n
-- (Parent tables are inserted in 071.1 TR file)
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

-- -------------------------------------------------------------------
-- EN i18n: services_i18n
-- Slugs aligned with 012 sub_category_i18n EN slugs
-- -------------------------------------------------------------------
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,`description`,
 `material`,`price`,`includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
VALUES
('94000001-1111-4111-8111-940000000001', @SRV_001,'en',
 'maintenance-and-repair',
 'Maintenance & Repair',
 'Ensotek provides periodic maintenance and professional repair services for industrial water cooling towers. Planned inspections cover fill/nozzle distribution, fan-motor efficiency, vibration/noise checks, mechanical alignment, sealing points and water treatment controls. A preventive approach reduces downtime, preserves performance and extends equipment lifetime.',
 'Nozzles, fill media, drift eliminators, fan/motor/gearbox, mechanical parts (scope-dependent)',
 'Quoted based on maintenance scope',
 'Inspection & reporting, cleaning, mechanical maintenance, critical part replacement, on-site testing',
 'Workmanship and equipment-specific warranty',
 'Cooling tower maintenance and repair',
 'maintenance, repair, periodic inspection, efficiency, vibration analysis',
 'Maintenance & Repair | Ensotek',
 'Ensotek reduces downtime and improves efficiency with periodic maintenance and repair services for cooling towers.',
 'cooling tower maintenance, cooling tower repair, periodic maintenance, fan motor service',
 NOW(3), NOW(3)),

('94000002-1111-4111-8111-940000000002', @SRV_002,'en',
 'modernization',
 'Modernization',
 'Ensotek delivers modernization (retrofit) solutions to keep existing cooling towers efficient and aligned with current performance requirements. Typical scope includes fill/nozzle upgrades, fan-motor optimisation, VFD integration, drift-loss improvements and water distribution revisions. The goal is lower energy consumption, stable process operation and higher capacity.',
 'Retrofit components (fill/nozzle/fan-motor/VFD etc.) depending on the project',
 'Quoted based on modernization scope',
 'Assessment, engineering, implementation, testing and performance verification',
 'Workmanship and equipment-specific warranty',
 'Cooling tower modernization and retrofit',
 'modernization, retrofit, vfd, fan upgrade, fill replacement',
 'Modernization | Ensotek',
 'Ensotek improves capacity and reduces energy consumption with cooling tower modernization (retrofit) services.',
 'cooling tower modernization, retrofit, vfd, fill replacement, fan upgrade',
 NOW(3), NOW(3)),

('94000003-1111-4111-8111-940000000003', @SRV_003,'en',
 'spare-parts-and-components',
 'Spare Parts & Components',
 'Ensotek supplies a broad portfolio of spare parts and components for cooling towers. Critical parts such as fill media, nozzles, drift eliminators, fan blades, motors/gearboxes and mechanical fittings are selected with a quality-first approach to ensure reliable operation and long service life.',
 'Fill media, nozzles, drift eliminators, fans, motors, gearboxes, mechanical parts',
 'Quoted based on parts and lead time',
 'Parts selection support, supply, optional installation and commissioning support',
 'Product-specific warranty terms',
 'Cooling tower spare parts and components',
 'spare parts, fill media, nozzles, fan, motor, gearbox, drift eliminator',
 'Spare Parts | Ensotek',
 'Ensotek provides spare parts and components for cooling towers to reduce failure risk and maintain efficiency.',
 'cooling tower spare parts, fill media, nozzles, fan motor, gearbox',
 NOW(3), NOW(3)),

('94000004-1111-4111-8111-940000000004', @SRV_004,'en',
 'applications-and-references',
 'Applications & References',
 'Ensotek has extensive applications and reference projects across industrial and commercial environments. Solutions cover energy, chemical, food, pharmaceutical, automotive and many other sectors, addressing different process requirements with the right configuration and performance targets.',
 NULL,
 'Quoted based on project scope',
 'Application assessment, reference presentation, site survey and project planning support',
 'Project-dependent',
 'Sector applications and reference projects',
 'applications, references, sector solutions, project experience',
 'Applications & References | Ensotek',
 'Ensotek is a reliable partner for cooling tower solutions backed by sector applications and proven references.',
 'cooling tower references, applications, industrial cooling projects',
 NOW(3), NOW(3)),

('94000005-1111-4111-8111-940000000005', @SRV_005,'en',
 'engineering-support',
 'Engineering Support',
 'Ensotek provides comprehensive engineering support including design, consulting, system optimisation, performance analysis and technical training. Heat-load analysis, hydraulic balancing, equipment selection and commissioning support are delivered with structured documentation and measurable outcomes.',
 'Engineering calculations and site equipment depending on project needs',
 'Quoted based on scope',
 'Site survey, calculations, design, commissioning support, performance verification, training',
 'Scope-dependent',
 'Cooling tower engineering support',
 'engineering, optimisation, performance analysis, commissioning, training',
 'Engineering Support | Ensotek',
 'Ensotek delivers end-to-end engineering support for cooling towers, from analysis and optimisation to commissioning and training.',
 'cooling tower engineering, performance analysis, optimisation, commissioning',
 NOW(3), NOW(3));

-- -------------------------------------------------------------------
-- EN image i18n: service_images_i18n
-- -------------------------------------------------------------------
INSERT INTO `service_images_i18n`
(`id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`)
VALUES
('94010001-1111-4111-8111-940100000001',@IMG_001A,'en','Periodic Inspections','Periodic maintenance inspections','Planned inspections and reporting to reduce downtime.',NOW(3),NOW(3)),
('94010001-1111-4111-8111-940100000002',@IMG_001B,'en','Mechanical Service','Mechanical service work','Fan-motor checks, alignment and critical component controls.',NOW(3),NOW(3)),
('94010001-1111-4111-8111-940100000003',@IMG_001C,'en','On-site Repair','On-site repair and verification','Measurements, tests and performance verification.',NOW(3),NOW(3)),

('94010002-1111-4111-8111-940100000001',@IMG_002A,'en','Capacity Increase','Capacity increase via modernization','Fill/nozzle optimisation and distribution improvements.',NOW(3),NOW(3)),
('94010002-1111-4111-8111-940100000002',@IMG_002B,'en','Energy Optimisation','Energy optimisation','Fan-motor upgrade and VFD integration to reduce consumption.',NOW(3),NOW(3)),
('94010002-1111-4111-8111-940100000003',@IMG_002C,'en','Field Implementation','Modernization on site','Testing and verification for a working delivery.',NOW(3),NOW(3)),

('94010003-1111-4111-8111-940100000001',@IMG_003A,'en','Parts Selection','Spare parts selection','Selecting the right parts for tower type and capacity.',NOW(3),NOW(3)),
('94010003-1111-4111-8111-940100000002',@IMG_003B,'en','Supply & Logistics','Spare parts supply','Managing stock and lead times effectively.',NOW(3),NOW(3)),
('94010003-1111-4111-8111-940100000003',@IMG_003C,'en','Installation Support','Installation and commissioning support','Optional field support for smooth operation.',NOW(3),NOW(3)),

('94010004-1111-4111-8111-940100000001',@IMG_004A,'en','Sector Solutions','Sector applications','Configurations adapted to different industries.',NOW(3),NOW(3)),
('94010004-1111-4111-8111-940100000002',@IMG_004B,'en','Reference Projects','Reference projects','Experience and outcomes from real sites.',NOW(3),NOW(3)),
('94010004-1111-4111-8111-940100000003',@IMG_004C,'en','Application Planning','Application planning','Site survey and planning for proper project delivery.',NOW(3),NOW(3)),

('94010005-1111-4111-8111-940100000001',@IMG_005A,'en','Heat Load Analysis','Heat load analysis','Analysis for correct capacity and tower selection.',NOW(3),NOW(3)),
('94010005-1111-4111-8111-940100000002',@IMG_005B,'en','Performance Analysis','Performance analysis','Trends and measurements to identify optimisation opportunities.',NOW(3),NOW(3)),
('94010005-1111-4111-8111-940100000003',@IMG_005C,'en','Commissioning & Training','Commissioning and training','On-site verification and operator training.',NOW(3),NOW(3));

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
