-- =============================================================
-- FILE: 191_slider_full.sql
-- Slider – schema + parent + i18n (TR / EN / DE)
-- Drizzle şeması ile birebir uyumlu, idempotent seed
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------
-- DROP & SCHEMA
-- -------------------------------------------------------------

-- Önce i18n sonra parent
DROP TABLE IF EXISTS `slider_i18n`;
DROP TABLE IF EXISTS `slider`;

-- ================= PARENT TABLO: slider ======================
CREATE TABLE IF NOT EXISTS `slider` (
  `id`                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`              CHAR(36)     NOT NULL,

  `image_url`         TEXT,
  `image_asset_id`    CHAR(36),

  `featured`          TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
  `is_active`         TINYINT(1) UNSIGNED NOT NULL DEFAULT 1,

  `display_order`     INT UNSIGNED NOT NULL DEFAULT 0,

  `created_at`        DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`        DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                                    ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),

  UNIQUE KEY `uniq_slider_uuid`        (`uuid`),
  KEY `idx_slider_active`              (`is_active`),
  KEY `idx_slider_order`               (`display_order`),
  KEY `idx_slider_image_asset`         (`image_asset_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================= I18N TABLO: slider_i18n ===================
CREATE TABLE IF NOT EXISTS `slider_i18n` (
  `id`           INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `slider_id`    INT UNSIGNED   NOT NULL,
  `locale`       VARCHAR(8)     NOT NULL,

  `name`         VARCHAR(255)   NOT NULL,
  `slug`         VARCHAR(255)   NOT NULL,
  `description`  TEXT,

  `alt`          VARCHAR(255),
  `button_text`  VARCHAR(100),
  `button_link`  VARCHAR(255),

  PRIMARY KEY (`id`),

  UNIQUE KEY `uniq_slider_i18n_slider_locale` (`slider_id`,`locale`),
  UNIQUE KEY `uniq_slider_i18n_slug_locale`   (`slug`,`locale`),
  KEY `idx_slider_i18n_locale`                (`locale`),

  CONSTRAINT `fk_slider_i18n_slider`
    FOREIGN KEY (`slider_id`) REFERENCES `slider` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- PARENT SEED (slider)
-- -------------------------------------------------------------

INSERT INTO `slider`
(`uuid`,
 `image_url`,`image_asset_id`,
 `featured`,`is_active`,`display_order`,
 `created_at`,`updated_at`)
VALUES
(
  '99990001-1111-4111-8111-999999990001',
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752771273/uploads/metahub/gallery/1-1752771270894-986291286.webp',
  NULL,
  1, 1, 1,
  '2024-01-20 00:00:00.000','2024-01-20 00:00:00.000'
),
(
  '99990002-1111-4111-8111-999999990002',
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752771255/uploads/metahub/gallery/2-1752771253118-97352961.webp',
  NULL,
  0, 1, 2,
  '2024-01-21 00:00:00.000','2024-01-21 00:00:00.000'
),
(
  '99990003-1111-4111-8111-999999990003',
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752771220/uploads/metahub/gallery/3-1752771216789-111437706.webp',
  NULL,
  0, 1, 3,
  '2024-01-22 00:00:00.000','2024-01-22 00:00:00.000'
),
(
  '99990004-1111-4111-8111-999999990004',
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752771195/uploads/metahub/gallery/4-1752771191653-812677165.webp',
  NULL,
  0, 1, 4,
  '2024-01-23 00:00:00.000','2024-01-23 00:00:00.000'
),
(
  '99990005-1111-4111-8111-999999990005',
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752771156/uploads/metahub/gallery/5-1752771151250-964450161.webp',
  NULL,
  0, 1, 5,
  '2024-01-24 00:00:00.000','2024-01-24 00:00:00.000'
),

-- NEW: SERVICES EXPANSION (6 new + 1 extra => total 12 slides)
(
  '99990006-1111-4111-8111-999999990006',
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752771124/uploads/metahub/gallery/6-1752771119350-50918009.webp',
  NULL,
  0, 1, 6,
  '2024-01-25 00:00:00.000','2024-01-25 00:00:00.000'
),
(
  '99990007-1111-4111-8111-999999990007',
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752771102/uploads/metahub/gallery/7-1752771097801-678897496.webp',
  NULL,
  0, 1, 7,
  '2024-01-26 00:00:00.000','2024-01-26 00:00:00.000'
),
(
  '99990008-1111-4111-8111-999999990008',
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752771064/uploads/metahub/gallery/8-1752771062653-586545826.webp',
  NULL,
  0, 1, 8,
  '2024-01-27 00:00:00.000','2024-01-27 00:00:00.000'
),
(
  '99990009-1111-4111-8111-999999990009',
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752771032/uploads/metahub/gallery/9-1752771029999-123456789.webp',
  NULL,
  0, 1, 9,
  '2024-01-28 00:00:00.000','2024-01-28 00:00:00.000'
),
(
  '99990010-1111-4111-8111-999999990010',
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752771000/uploads/metahub/gallery/10-1752770999876-123456789.webp',
  NULL,
  0, 1, 10,
  '2024-01-29 00:00:00.000','2024-01-29 00:00:00.000'
),
(
  '99990011-1111-4111-8111-999999990011',
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752770975/uploads/metahub/gallery/11-1752770975123-123456789.webp',
  NULL,
  0, 1, 11,
  '2024-01-30 00:00:00.000','2024-01-30 00:00:00.000'
),
(
  '99990012-1111-4111-8111-999999990012',
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752770940/uploads/metahub/gallery/12-1752770939876-123456789.webp',
  NULL,
  0, 1, 12,
  '2024-01-31 00:00:00.000','2024-01-31 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
  `image_url`      = VALUES(`image_url`),
  `image_asset_id` = VALUES(`image_asset_id`),
  `featured`       = VALUES(`featured`),
  `is_active`      = VALUES(`is_active`),
  `display_order`  = VALUES(`display_order`),
  `updated_at`     = VALUES(`updated_at`);

-- -------------------------------------------------------------
-- I18N SEED – TR
-- -------------------------------------------------------------

INSERT INTO `slider_i18n`
(`slider_id`,`locale`,
 `name`,`slug`,`description`,
 `alt`,`button_text`,`button_link`)
VALUES
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990001-1111-4111-8111-999999990001'),
  'tr',
  'Endüstriyel Su Soğutma Kulelerinde Uzman Çözüm Ortağınız',
  'endustriyel-su-sogutma-kulelerinde-uzman-cozum-ortaginiz',
  'Enerji santralleri, endüstriyel tesisler ve ticari binalar için yüksek verimli su soğutma kulesi çözümleri sunuyoruz.',
  'Endüstriyel su soğutma kulesi çözümleri',
  'Teklif Al',
  '/offer'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990002-1111-4111-8111-999999990002'),
  'tr',
  'Açık ve Kapalı Devre Su Soğutma Kuleleri',
  'acik-ve-kapali-devre-su-sogutma-kuleleri',
  'FRP, galvanizli çelik ve betonarme gövdeli su soğutma kuleleri ile prosesinize en uygun çözümü tasarlıyoruz.',
  'Açık / kapalı devre su soğutma kuleleri',
  'Çözümleri İncele',
  '/solutions/water-cooling-towers'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990003-1111-4111-8111-999999990003'),
  'tr',
  'Keşif, Projelendirme ve Anahtar Teslim Uygulama',
  'kesif-projelendirme-ve-anahtar-teslim-uygulama',
  'Saha keşfi, ısı yükü hesapları, mekanik tasarım, montaj koordinasyonu ve devreye alma süreçlerini Ensotek mühendisliği ile uçtan uca yönetiyoruz.',
  'Su soğutma kulesi keşif ve projelendirme',
  'Hizmeti İncele',
  '/service/site-survey-engineering'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990004-1111-4111-8111-999999990004'),
  'tr',
  'Periyodik Bakım, Onarım ve Revizyon',
  'periyodik-bakim-onarim-ve-revizyon',
  'Mevcut su soğutma kulelerinizde nozül, dolgu, fan ve mekanik aksam yenileme ile kapasite ve verimlilik iyileştirmeleri sağlıyoruz.',
  'Su soğutma kulesi bakım ve revizyon hizmetleri',
  'Bakım Planla',
  '/service/maintenance-repair'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990005-1111-4111-8111-999999990005'),
  'tr',
  'Otomasyon, SCADA ve Uzaktan İzleme',
  'otomasyon-scada-ve-uzaktan-izleme',
  'Su soğutma kulelerinizi enerji tüketimi, debi, sıcaklık ve arıza durumlarına göre gerçek zamanlı izleyebileceğiniz otomasyon altyapısı kuruyoruz.',
  'Su soğutma kulesi otomasyon ve SCADA çözümleri',
  'Hizmeti İncele',
  '/service/automation-scada'
),

-- SERVICES / SOLUTIONS FOCUS (TR)
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990006-1111-4111-8111-999999990006'),
  'tr',
  'Yedek Parçalar ve Kritik Bileşen Tedariği',
  'yedek-parcalar-ve-kritik-bilesen-tedarigi',
  'Nozül, dolgu, fan kanadı, motor, redüktör, drift eliminator ve mekanik aksamlar için hızlı tedarik ve doğru parça eşleştirme desteği sunuyoruz.',
  'Soğutma kulesi yedek parça ve bileşen tedariği',
  'Hizmeti İncele',
  '/service/spare-parts-components'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990007-1111-4111-8111-999999990007'),
  'tr',
  'Modernizasyon ve Verimlilik Odaklı Retrofit',
  'modernizasyon-ve-verimlilik-odakli-retrofit',
  'Mevcut kulelerinizi daha düşük enerji tüketimi ve daha yüksek performans için yeniliyoruz: dolgu/nozül optimizasyonu, fan grubu yükseltme ve hidrolik iyileştirmeler.',
  'Soğutma kulesi modernizasyon ve retrofit',
  'Hizmeti İncele',
  '/service/modernization-retrofit'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990008-1111-4111-8111-999999990008'),
  'tr',
  'Proje Danışmanlığı ve Mühendislik Desteği',
  'proje-danismanligi-ve-muhendislik-destegi',
  'Isı yükü analizi, seçim/boyutlandırma, malzeme seçimi ve saha koşullarına göre uçtan uca mühendislik desteği sağlıyoruz.',
  'Soğutma kulesi mühendislik danışmanlığı',
  'Hizmeti İncele',
  '/service/engineering-support'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990009-1111-4111-8111-999999990009'),
  'tr',
  'Otomasyon ve Uzaktan İzleme Altyapısı',
  'otomasyon-ve-uzaktan-izleme-altyapisi',
  'Debi, sıcaklık, iletkenlik, seviye ve enerji tüketimi gibi kritik parametreleri izleyerek arızaları erken yakalayan izleme altyapıları kuruyoruz.',
  'Soğutma kulesi otomasyon ve uzaktan izleme',
  'Hizmeti İncele',
  '/service/automation-scada'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990010-1111-4111-8111-999999990010'),
  'tr',
  'Performans Optimizasyonu ve Enerji Verimliliği',
  'performans-optimizasyonu-ve-enerji-verimliligi',
  'Yerinde ölçümler ve raporlama ile yaklaşım sıcaklığı, kapasite, fan verimi ve su kimyası parametrelerini iyileştirerek enerji maliyetlerini düşürüyoruz.',
  'Soğutma kulesi performans optimizasyonu',
  'Hizmeti İncele',
  '/service/performance-optimization'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990011-1111-4111-8111-999999990011'),
  'tr',
  'Kurulum & Devreye Alma',
  'kurulum-ve-devreye-alma',
  'Montaj koordinasyonu, kontrol listeleri, testler ve güvenli ilk çalıştırma adımları ile sistemi devreye alıyor; operatör eğitimini tamamlıyoruz.',
  'Soğutma kulesi kurulum ve devreye alma',
  'Hizmeti İncele',
  '/service/commissioning-startup'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990012-1111-4111-8111-999999990012'),
  'tr',
  'Acil Servis ve Arıza Müdahalesi',
  'acil-servis-ve-ariza-mudahalesi',
  'Kritik duruşlara karşı hızlı müdahale, parça değişimi, devreye alma ve güvenli yeniden çalıştırma süreçlerinde saha ekibimizle yanınızdayız.',
  'Soğutma kulesi acil servis ve arıza müdahalesi',
  'Acil Destek',
  '/service/emergency-response'
)
ON DUPLICATE KEY UPDATE
  `name`        = VALUES(`name`),
  `slug`        = VALUES(`slug`),
  `description` = VALUES(`description`),
  `alt`         = VALUES(`alt`),
  `button_text` = VALUES(`button_text`),
  `button_link` = VALUES(`button_link`);

-- -------------------------------------------------------------
-- I18N SEED – EN
-- -------------------------------------------------------------

INSERT INTO `slider_i18n`
(`slider_id`,`locale`,
 `name`,`slug`,`description`,
 `alt`,`button_text`,`button_link`)
VALUES
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990001-1111-4111-8111-999999990001'),
  'en',
  'Your Expert Partner in Industrial Cooling Tower Solutions',
  'your-expert-partner-in-industrial-cooling-tower-solutions',
  'We deliver high-efficiency cooling tower solutions for power plants, industrial facilities, and commercial buildings.',
  'Industrial cooling tower solutions',
  'Get a Quote',
  '/offer'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990002-1111-4111-8111-999999990002'),
  'en',
  'Open & Closed Circuit Cooling Towers',
  'open-and-closed-circuit-cooling-towers',
  'We design the best-fit solution for your process with FRP, galvanized steel, and reinforced concrete cooling towers.',
  'Open / closed circuit cooling towers',
  'Explore Solutions',
  '/solutions/water-cooling-towers'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990003-1111-4111-8111-999999990003'),
  'en',
  'Site Survey, Engineering & Turnkey Implementation',
  'site-survey-engineering-and-turnkey-implementation',
  'From site survey and heat load calculations to mechanical design, installation coordination, and commissioning—Ensotek manages the full lifecycle end-to-end.',
  'Cooling tower site survey and engineering',
  'View Service',
  '/services/site-survey-engineering'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990004-1111-4111-8111-999999990004'),
  'en',
  'Periodic Maintenance, Repair & Overhaul',
  'periodic-maintenance-repair-and-overhaul',
  'We improve capacity and efficiency through nozzle/fill replacement, fan upgrades, and mechanical refurbishment for your existing cooling towers.',
  'Cooling tower maintenance and overhaul services',
  'Plan Maintenance',
  '/services/maintenance-repair'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990005-1111-4111-8111-999999990005'),
  'en',
  'Automation, SCADA & Remote Monitoring',
  'automation-scada-and-remote-monitoring',
  'We implement automation infrastructure to monitor energy consumption, flow, temperature, and fault conditions in real time.',
  'Cooling tower automation and SCADA solutions',
  'View Service',
  '/services/automation-scada'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990006-1111-4111-8111-999999990006'),
  'en',
  'Spare Parts & Critical Components Supply',
  'spare-parts-and-critical-components-supply',
  'Fast sourcing and accurate part matching for nozzles, fill media, fan blades, motors, gearboxes, drift eliminators, and mechanical components.',
  'Cooling tower spare parts and components supply',
  'View Service',
  '/services/spare-parts-components'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990007-1111-4111-8111-999999990007'),
  'en',
  'Modernization & Efficiency-Focused Retrofit',
  'modernization-and-efficiency-focused-retrofit',
  'Upgrade existing towers for lower energy use and higher performance: fill/nozzle optimization, fan group upgrades, and hydraulic improvements.',
  'Cooling tower modernization and retrofit',
  'View Service',
  '/services/modernization-retrofit'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990008-1111-4111-8111-999999990008'),
  'en',
  'Project Consulting & Engineering Support',
  'project-consulting-and-engineering-support',
  'End-to-end engineering support based on heat load analysis, selection/sizing, material choice, and site conditions.',
  'Cooling tower engineering consulting',
  'View Service',
  '/services/engineering-support'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990009-1111-4111-8111-999999990009'),
  'en',
  'Automation & Remote Monitoring Infrastructure',
  'automation-and-remote-monitoring-infrastructure',
  'Build monitoring systems that detect issues early by tracking critical parameters such as flow, temperature, conductivity, level, and energy consumption.',
  'Cooling tower automation and remote monitoring',
  'View Service',
  '/services/automation-scada'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990010-1111-4111-8111-999999990010'),
  'en',
  'Performance Optimization & Energy Efficiency',
  'performance-optimization-and-energy-efficiency',
  'Reduce energy costs by improving approach temperature, capacity, fan efficiency, and water chemistry through on-site measurements and reporting.',
  'Cooling tower performance optimization',
  'View Service',
  '/services/performance-optimization'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990011-1111-4111-8111-999999990011'),
  'en',
  'Installation & Commissioning',
  'installation-and-commissioning',
  'We deliver commissioning with installation coordination, checklists, testing, safe startup procedures, and operator training.',
  'Cooling tower installation and commissioning',
  'View Service',
  '/services/commissioning-startup'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990012-1111-4111-8111-999999990012'),
  'en',
  'Emergency Service & Breakdown Response',
  'emergency-service-and-breakdown-response',
  'Rapid response for critical shutdowns, part replacement, commissioning support, and safe restart with our field team.',
  'Cooling tower emergency service and breakdown response',
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

-- -------------------------------------------------------------
-- I18N SEED – DE
-- -------------------------------------------------------------

INSERT INTO `slider_i18n`
(`slider_id`,`locale`,
 `name`,`slug`,`description`,
 `alt`,`button_text`,`button_link`)
VALUES
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990001-1111-4111-8111-999999990001'),
  'de',
  'Ihr Partner für industrielle Kühlturmlösungen',
  'ihr-partner-fuer-industrielle-kuehlturmloesungen',
  'Wir bieten hocheffiziente Kühlturmlösungen für Kraftwerke, Industrieanlagen und Gewerbeimmobilien.',
  'Industrielle Kühlturmlösungen',
  'Angebot anfordern',
  '/offer'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990002-1111-4111-8111-999999990002'),
  'de',
  'Offene & geschlossene Kreislauf-Kühltürme',
  'offene-und-geschlossene-kreislauf-kuehltuerme',
  'Wir konzipieren die passende Lösung für Ihren Prozess mit Kühltürmen aus GFK, verzinktem Stahl und Stahlbeton.',
  'Offene / geschlossene Kreislauf-Kühltürme',
  'Lösungen ansehen',
  '/solutions/water-cooling-towers'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990003-1111-4111-8111-999999990003'),
  'de',
  'Standortanalyse, Engineering & schlüsselfertige Umsetzung',
  'standortanalyse-engineering-und-schluesselfertige-umsetzung',
  'Von der Standortanalyse und Wärmeleistungsberechnung über die mechanische Auslegung bis hin zur Montagekoordination und Inbetriebnahme – Ensotek übernimmt alles aus einer Hand.',
  'Kühlturm Standortanalyse und Engineering',
  'Service ansehen',
  '/services/site-survey-engineering'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990004-1111-4111-8111-999999990004'),
  'de',
  'Regelmäßige Wartung, Reparatur & Revision',
  'regelmaessige-wartung-reparatur-und-revision',
  'Wir steigern Kapazität und Effizienz durch Düsen-/Füllkörpertausch, Ventilator-Upgrades und mechanische Überholung Ihrer bestehenden Kühltürme.',
  'Kühlturm Wartung und Revision',
  'Wartung planen',
  '/services/maintenance-repair'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990005-1111-4111-8111-999999990005'),
  'de',
  'Automation, SCADA & Fernüberwachung',
  'automation-scada-und-fernueberwachung',
  'Wir implementieren Automationslösungen zur Echtzeitüberwachung von Energieverbrauch, Durchfluss, Temperatur und Störungen.',
  'Kühlturm Automation und SCADA',
  'Service ansehen',
  '/services/automation-scada'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990006-1111-4111-8111-999999990006'),
  'de',
  'Ersatzteile & kritische Komponenten',
  'ersatzteile-und-kritische-komponenten',
  'Schnelle Beschaffung und passgenaue Zuordnung für Düsen, Füllkörper, Ventilatorflügel, Motoren, Getriebe, Driftabscheider und mechanische Komponenten.',
  'Kühlturm Ersatzteile und Komponenten',
  'Service ansehen',
  '/services/spare-parts-components'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990007-1111-4111-8111-999999990007'),
  'de',
  'Modernisierung & effizienzorientiertes Retrofit',
  'modernisierung-und-effizienzorientiertes-retrofit',
  'Wir modernisieren bestehende Kühltürme für geringeren Energieverbrauch und höhere Leistung: Füllkörper-/Düsenoptimierung, Ventilator-Upgrades und hydraulische Verbesserungen.',
  'Kühlturm Modernisierung und Retrofit',
  'Service ansehen',
  '/services/modernization-retrofit'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990008-1111-4111-8111-999999990008'),
  'de',
  'Projektberatung & Engineering-Support',
  'projektberatung-und-engineering-support',
  'Umfassende Engineering-Unterstützung basierend auf Wärmeleistungsanalyse, Auswahl/Dimensionierung, Materialwahl und Standortbedingungen.',
  'Kühlturm Engineering-Beratung',
  'Service ansehen',
  '/services/engineering-support'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990009-1111-4111-8111-999999990009'),
  'de',
  'Automations- & Fernüberwachungsinfrastruktur',
  'automations-und-fernueberwachungsinfrastruktur',
  'Wir bauen Monitoring-Systeme, die Störungen früh erkennen – durch Überwachung von Durchfluss, Temperatur, Leitfähigkeit, Füllstand und Energieverbrauch.',
  'Kühlturm Automation und Fernüberwachung',
  'Service ansehen',
  '/services/automation-scada'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990010-1111-4111-8111-999999990010'),
  'de',
  'Performance-Optimierung & Energieeffizienz',
  'performance-optimierung-und-energieeffizienz',
  'Durch Vor-Ort-Messungen und Reportings verbessern wir Annäherungstemperatur, Kapazität, Ventilatoreffizienz und Wasserchemie – und senken Ihre Energiekosten.',
  'Kühlturm Performance-Optimierung',
  'Service ansehen',
  '/services/performance-optimization'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990011-1111-4111-8111-999999990011'),
  'de',
  'Montage & Inbetriebnahme',
  'montage-und-inbetriebnahme',
  'Wir realisieren die Inbetriebnahme inklusive Montagekoordination, Checklisten, Tests, sicherem Start-up und Bedienerschulung.',
  'Kühlturm Montage und Inbetriebnahme',
  'Service ansehen',
  '/services/commissioning-startup'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990012-1111-4111-8111-999999990012'),
  'de',
  'Notdienst & Störungsbehebung',
  'notdienst-und-stoerungsbehebung',
  'Schnelle Hilfe bei kritischen Stillständen, Teiletausch, Inbetriebnahme-Unterstützung und sicherem Wiederanlauf durch unser Außendienstteam.',
  'Kühlturm Notdienst und Störungsbehebung',
  'Soforthilfe',
  '/contact'
)
ON DUPLICATE KEY UPDATE
  `name`        = VALUES(`name`),
  `slug`        = VALUES(`slug`),
  `description` = VALUES(`description`),
  `alt`         = VALUES(`alt`),
  `button_text` = VALUES(`button_text`),
  `button_link` = VALUES(`button_link`);

-- -------------------------------------------------------------
-- COMMIT
-- -------------------------------------------------------------

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
