-- =============================================================
-- FILE: 193_slider_de_seed.sql
-- SEED: Ensotek – Slider i18n (DE)
-- Only DE rows – idempotent
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
  'de',
  'Ihr Expertenpartner für industrielle Wasserkühltürme',
  'ihr-expertenpartner-fuer-industrielle-wasserkuehltuerme',
  'Wir liefern hocheffiziente Wasserkühlturm-Lösungen für Kraftwerke, Industrieanlagen und Gewerbeimmobilien.',
  'Industrielle Wasserkühlturm-Lösungen',
  'Angebot anfordern',
  '/contact'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990002-1111-4111-8111-999999990002'),
  'de',
  'Offene und geschlossene Kreislauf-Wasserkühltürme',
  'offene-und-geschlossene-kreislauf-wasserkuehltuerme',
  'Wir entwickeln die passende Lösung für Ihren Prozess – mit Optionen aus GFK (FRP), verzinktem Stahl und Stahlbeton.',
  'Offene / geschlossene Kreislauf-Wasserkühltürme',
  'Lösungen ansehen',
  '/solutions/water-cooling-towers'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990003-1111-4111-8111-999999990003'),
  'de',
  'Vor-Ort-Begehung, Engineering und schlüsselfertige Montage',
  'vor-ort-begehung-engineering-und-schluesselfertige-montage',
  'Wir übernehmen den gesamten Prozess – von der Begehung über Wärmelastberechnungen und mechanische Auslegung bis zur Inbetriebnahme.',
  'Kühlturm Begehung und Engineering',
  'Begehung anfragen',
  '/services/site-survey-engineering'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990004-1111-4111-8111-999999990004'),
  'de',
  'Regelmäßige Wartung und Retrofit-Services',
  'regelmaessige-wartung-und-retrofit-services',
  'Wir steigern Kapazität und Effizienz Ihrer bestehenden Kühltürme durch Upgrades von Düsen, Füllkörpern, Ventilatoren und mechanischen Komponenten.',
  'Wartung und Retrofit für Kühltürme',
  'Wartung planen',
  '/services/maintenance-retrofit'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990005-1111-4111-8111-999999990005'),
  'de',
  'Automatisierung, SCADA und Fernüberwachung',
  'automatisierung-scada-und-fernüberwachung',
  'Wir implementieren Automatisierungs- und Monitoring-Lösungen zur Echtzeitüberwachung von Energieverbrauch, Durchfluss, Temperatur und Alarmzuständen.',
  'Kühlturm Automatisierung und SCADA',
  'Details anfordern',
  '/services/automation-scada'
),

-- =============================================================
-- NEW: SERVICES EXPANSION (DE) – 6 new slides
-- =============================================================
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990006-1111-4111-8111-999999990006'),
  'de',
  'Neuer Service: Ersatzteile und kritische Komponenten',
  'neuer-service-ersatzteile-und-kritische-komponenten',
  'Schnelle Beschaffung und passgenaue Zuordnung für Düsen, Füllkörper, Ventilatoren, Motoren, Getriebe, Driftabscheider und mechanische Komponenten.',
  'Ersatzteile und Komponenten für Kühltürme',
  'Teile anfragen',
  '/contact'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990007-1111-4111-8111-999999990007'),
  'de',
  'Neuer Service: Modernisierung und Retrofit für höhere Effizienz',
  'neuer-service-modernisierung-und-retrofit-fuer-hoehere-effizienz',
  'Wir modernisieren bestehende Kühltürme für geringeren Energieverbrauch und höhere Leistung: Füllkörper-Optimierung, Ventilator-Upgrade, hydraulische Verbesserungen und Kapazitätssteigerung.',
  'Modernisierung und Retrofit von Kühltürmen',
  'Retrofit ansehen',
  '/services/maintenance-retrofit'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990008-1111-4111-8111-999999990008'),
  'de',
  'Neuer Service: Engineering-Beratung und Projektunterstützung',
  'neuer-service-engineering-beratung-und-projektunterstuetzung',
  'Wärmelastanalyse, Auswahl und Auslegung, Materialwahl, Standortbedingungen und Inbetriebnahme – wir liefern End-to-End Engineering-Support.',
  'Engineering-Beratung für Kühltürme',
  'Beratung anfragen',
  '/services/site-survey-engineering'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990009-1111-4111-8111-999999990009'),
  'de',
  'Neuer Service: Automatisierung, SCADA und Fernüberwachung',
  'neuer-service-automatisierung-scada-und-fernüberwachung',
  'Echtzeit-Monitoring kritischer Parameter wie Durchfluss, Temperatur, Leitfähigkeit, Füllstand und Energieverbrauch – zur frühzeitigen Fehlererkennung.',
  'Automatisierung und Monitoring für Kühltürme',
  'Demo anfordern',
  '/services/automation-scada'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990010-1111-4111-8111-999999990010'),
  'de',
  'Neuer Service: Performance-Optimierung und Energieeffizienz',
  'neuer-service-performance-optimierung-und-energieeffizienz',
  'Mit Vor-Ort-Messungen und Reporting optimieren wir Annäherungstemperatur, Kapazität, Ventilatorwirkungsgrad und Wasserchemie – für niedrigere Betriebskosten.',
  'Performance-Optimierung für Kühltürme',
  'Analyse anfragen',
  '/services/site-survey-engineering'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990011-1111-4111-8111-999999990011'),
  'de',
  'Neuer Service: Notfallservice und Störungsbehebung',
  'neuer-service-notfallservice-und-stoerungsbehebung',
  'Schnelle Vor-Ort-Unterstützung bei kritischen Stillständen: Teiletausch, Inbetriebnahme und sichere Wiederanlaufprozesse durch unser Serviceteam.',
  'Notfallservice für Kühltürme',
  'Notfallkontakt',
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
