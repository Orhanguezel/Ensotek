-- =============================================================
-- FILE: 194_slider_en_seed.sql
-- SEED: Ensotek – Slider i18n (EN)
-- Only EN rows – idempotent
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

INSERT INTO `slider_i18n`
(`slider_id`,`locale`,
 `name`,`slug`,`description`,
 `alt`,`button_text`,`button_link`)
VALUES
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990001-1111-4111-8111-999999990001'),
  'en',
  'Your Expert Partner in Industrial Water Cooling Towers',
  'expert-partner-industrial-water-cooling-towers',
  'We deliver high-efficiency water cooling tower solutions for power plants, industrial facilities and commercial buildings.',
  'Industrial water cooling tower solutions',
  'Request a Quote',
  '/contact'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990002-1111-4111-8111-999999990002'),
  'en',
  'Open and Closed Circuit Water Cooling Towers',
  'open-and-closed-circuit-water-cooling-towers',
  'We design the most suitable solution for your process with FRP, galvanized steel and reinforced concrete cooling tower options.',
  'Open / closed circuit water cooling towers',
  'Explore Solutions',
  '/solutions/water-cooling-towers'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990003-1111-4111-8111-999999990003'),
  'en',
  'Site Survey, Engineering and Turnkey Installation',
  'site-survey-engineering-and-turnkey-installation',
  'We manage the entire process from on-site survey, thermal load calculations and mechanical design to commissioning with Ensotek engineering.',
  'Cooling tower site survey and engineering',
  'Request a Survey',
  '/services/site-survey-engineering'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990004-1111-4111-8111-999999990004'),
  'en',
  'Periodic Maintenance and Retrofit Services',
  'periodic-maintenance-and-retrofit-services',
  'We improve capacity and efficiency of your existing cooling towers with nozzle, fill, fan and mechanical component upgrades.',
  'Cooling tower maintenance and retrofit services',
  'Plan Maintenance',
  '/services/maintenance-retrofit'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990005-1111-4111-8111-999999990005'),
  'en',
  'Automation, SCADA and Remote Monitoring Solutions',
  'automation-scada-and-remote-monitoring-solutions',
  'We build automation infrastructures that enable real-time monitoring of energy consumption, flow, temperature and alarms for your cooling towers.',
  'Cooling tower automation and SCADA solutions',
  'Get Details',
  '/services/automation-scada'
),

-- =============================================================
-- NEW: SERVICES EXPANSION (EN) – 6 new slides
-- =============================================================
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990006-1111-4111-8111-999999990006'),
  'en',
  'New Service: Spare Parts and Critical Components Supply',
  'new-service-spare-parts-and-critical-components-supply',
  'Fast sourcing and correct part matching for nozzles, fill media, fan blades, motors, gearboxes, drift eliminators and mechanical components.',
  'Cooling tower spare parts and components supply',
  'Request Parts',
  '/contact'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990007-1111-4111-8111-999999990007'),
  'en',
  'New Service: Modernization and Efficiency-Focused Retrofit',
  'new-service-modernization-and-efficiency-focused-retrofit',
  'We retrofit existing towers for lower energy consumption and higher performance: fill optimization, fan group upgrades, hydraulic improvements and capacity increase.',
  'Cooling tower modernization and retrofit',
  'View Retrofit',
  '/services/maintenance-retrofit'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990008-1111-4111-8111-999999990008'),
  'en',
  'New Service: Engineering Consulting and Project Support',
  'new-service-engineering-consulting-and-project-support',
  'Thermal load analysis, selection/sizing, material choice, site conditions and commissioning — end-to-end engineering support for your project.',
  'Cooling tower engineering consulting',
  'Get Consulting',
  '/services/site-survey-engineering'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990009-1111-4111-8111-999999990009'),
  'en',
  'New Service: Automation, SCADA and Remote Monitoring',
  'new-service-automation-scada-and-remote-monitoring',
  'Real-time monitoring of critical parameters such as flow, temperature, conductivity, level and energy consumption to detect failures early.',
  'Cooling tower automation and monitoring',
  'Request Demo',
  '/services/automation-scada'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990010-1111-4111-8111-999999990010'),
  'en',
  'New Service: Performance Optimization and Energy Efficiency',
  'new-service-performance-optimization-and-energy-efficiency',
  'On-site measurements and reporting to improve approach temperature, capacity, fan efficiency and water chemistry parameters — reducing operating costs.',
  'Cooling tower performance optimization',
  'Request Analysis',
  '/services/site-survey-engineering'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990011-1111-4111-8111-999999990011'),
  'en',
  'New Service: Emergency Service and Troubleshooting',
  'new-service-emergency-service-and-troubleshooting',
  'Rapid response against critical downtime: part replacement, commissioning and safe restart processes with our field service team.',
  'Cooling tower emergency service and troubleshooting',
  'Emergency Support',
  '/contact'
)

ON DUPLICATE KEY UPDATE
  `name`        = VALUES(`name`),
  `slug`        = VALUES(`slug`),
  `description` = VALUES(`description`),
  `alt`         = VALUES(`alt`),
  `button_text` = VALUES(`button_text`),
  `button_link` = VALUES(`button_link`);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
