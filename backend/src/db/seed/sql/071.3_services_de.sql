-- =============================================================
-- FILE: 071.3_services_de.sql
-- Ensotek services – DE i18n + DE image i18n
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
-- DE i18n: services_i18n
-- Slugs aligned with 012 sub_category_i18n DE slugs
-- -------------------------------------------------------------------
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,`description`,
 `material`,`price`,`includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
VALUES
('95000001-1111-4111-8111-950000000001', @SRV_001,'de',
 'wartung-reparatur',
 'Wartung & Reparatur',
 'Ensotek bietet regelmäßige Wartung und professionelle Reparatur für industrielle Wasserkühltürme. Geplante Kontrollen umfassen Füllkörper-/Düsenverteilung, Ventilator-Motor-Effizienz, Schwingungs-/Geräuschanalyse, mechanische Ausrichtung, Dichtstellen sowie Wasseraufbereitungskontrollen. Ein präventiver Ansatz reduziert Stillstände, erhält die Leistung und verlängert die Lebensdauer der Anlagen.',
 'Düsen, Füllkörper, Tropfenabscheider, Ventilator/Motor/Getriebe, mechanische Teile (je nach Umfang)',
 'Angebot je nach Leistungsumfang',
 'Inspektion & Reporting, Reinigung, mechanische Wartung, Austausch kritischer Teile, Vor-Ort-Tests',
 'Gewährleistung je nach Arbeit und Komponenten',
 'Wartung und Reparatur von Kühltürmen',
 'wartung, reparatur, regelmäßige kontrolle, effizienz, schwingungsanalyse',
 'Wartung & Reparatur | Ensotek',
 'Ensotek reduziert Stillstände und steigert die Effizienz mit Wartungs- und Reparaturleistungen für Kühltürme.',
 'kühlturm wartung, kühlturm reparatur, regelmäßige wartung, ventilator motor service',
 NOW(3), NOW(3)),

('95000002-1111-4111-8111-950000000002', @SRV_002,'de',
 'modernisierung',
 'Modernisierung',
 'Ensotek bietet Modernisierungslösungen (Retrofit), um bestehende Kühltürme effizient und auf aktuelle Anforderungen abgestimmt zu betreiben. Typische Maßnahmen sind Füllkörper-/Düsen-Upgrades, Ventilator-Motor-Optimierung, VFD-Integration, Reduzierung von Drift-Verlusten und Anpassungen der Wasserverteilung. Ziel sind geringerer Energieverbrauch, stabile Prozessbedingungen und höhere Kapazität.',
 'Retrofit-Komponenten (Füllkörper/Düsen/Ventilator-Motor/VFD usw.) je nach Projekt',
 'Angebot je nach Modernisierungsumfang',
 'Analyse, Engineering, Umsetzung, Tests und Performance-Verifizierung',
 'Gewährleistung je nach Arbeit und Komponenten',
 'Modernisierung und Retrofit für Kühltürme',
 'modernisierung, retrofit, vfd, ventilator upgrade, fuellkoerper wechsel',
 'Modernisierung | Ensotek',
 'Ensotek steigert Kapazität und senkt Energieverbrauch durch Modernisierung (Retrofit) von Kühltürmen.',
 'kühlturm modernisierung, retrofit, vfd, fuellkoerper, ventilator upgrade',
 NOW(3), NOW(3)),

('95000003-1111-4111-8111-950000000003', @SRV_003,'de',
 'ersatzteile-komponenten',
 'Ersatzteile & Komponenten',
 'Ensotek liefert ein breites Portfolio an Ersatzteilen und Komponenten für Kühltürme. Kritische Bauteile wie Füllkörper, Düsen, Tropfenabscheider, Ventilatorflügel, Motoren/Getriebe und mechanische Verbindungselemente werden qualitätsorientiert ausgewählt, um einen zuverlässigen Betrieb und lange Standzeiten sicherzustellen.',
 'Füllkörper, Düsen, Tropfenabscheider, Ventilatoren, Motoren, Getriebe, mechanische Teile',
 'Angebot je nach Teilen und Lieferzeit',
 'Unterstützung bei der Teileauswahl, Lieferung, optionale Montage- und Inbetriebnahmeunterstützung',
 'Produktspezifische Garantiebedingungen',
 'Ersatzteile und Komponenten für Kühltürme',
 'ersatzteile, fuellkoerper, duesen, ventilator, motor, getriebe, tropfenabscheider',
 'Ersatzteile | Ensotek',
 'Ensotek stellt Ersatzteile und Komponenten für Kühltürme bereit, um Ausfallrisiken zu senken und Effizienz zu sichern.',
 'kühlturm ersatzteile, fuellkoerper, duesen, ventilator motor, getriebe',
 NOW(3), NOW(3)),

('95000004-1111-4111-8111-950000000004', @SRV_004,'de',
 'anwendungen-referenzen',
 'Anwendungen & Referenzen',
 'Ensotek verfügt über zahlreiche Anwendungen und Referenzprojekte in Industrie und Gewerbe. Lösungen decken Energie, Chemie, Lebensmittel, Pharma, Automotive und viele weitere Branchen ab und erfüllen unterschiedliche Prozessanforderungen durch passende Konfigurationen und Performance-Ziele.',
 NULL,
 'Angebot je nach Projektumfang',
 'Anwendungsanalyse, Referenzdarstellung, Vor-Ort-Termin und Projektplanungsunterstützung',
 'Projektabhängig',
 'Anwendungen und Referenzprojekte',
 'anwendungen, referenzen, branchenloesungen, projekterfahrung',
 'Anwendungen & Referenzen | Ensotek',
 'Ensotek ist ein zuverlässiger Partner für Kühlturmlösungen mit nachweisbaren Referenzen und Branchenerfahrung.',
 'kühlturm referenzen, anwendungen, industrielle kuehlprojekte',
 NOW(3), NOW(3)),

('95000005-1111-4111-8111-950000000005', @SRV_005,'de',
 'engineering-support',
 'Engineering-Support',
 'Ensotek bietet umfassenden Engineering-Support inklusive Auslegung, Beratung, Systemoptimierung, Performance-Analyse und technischer Schulung. Wärmelastanalyse, hydraulischer Abgleich, Komponentenauswahl und Inbetriebnahmeunterstützung werden mit strukturierter Dokumentation und messbaren Ergebnissen umgesetzt.',
 'Engineering-Berechnungen und Vor-Ort-Komponenten je nach Projektbedarf',
 'Angebot je nach Umfang',
 'Vor-Ort-Termin, Berechnungen, Design, Inbetriebnahmeunterstützung, Performance-Verifizierung, Schulung',
 'Umfangsabhängig',
 'Engineering-Support für Kühltürme',
 'engineering, optimierung, performance analyse, inbetriebnahme, schulung',
 'Engineering-Support | Ensotek',
 'Ensotek liefert Engineering-Support für Kühltürme – von Analyse und Optimierung bis Inbetriebnahme und Schulung.',
 'kühlturm engineering, performance analyse, optimierung, inbetriebnahme',
 NOW(3), NOW(3));

-- -------------------------------------------------------------------
-- DE image i18n: service_images_i18n
-- -------------------------------------------------------------------
INSERT INTO `service_images_i18n`
(`id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`)
VALUES
('95010001-1111-4111-8111-950100000001',@IMG_001A,'de','Regelmäßige Kontrollen','Regelmäßige Wartungskontrollen','Geplante Kontrollen und Reporting zur Reduktion von Stillständen.',NOW(3),NOW(3)),
('95010001-1111-4111-8111-950100000002',@IMG_001B,'de','Mechanischer Service','Mechanische Servicearbeiten','Ventilator-Motor-Checks, Ausrichtung und Kontrollen kritischer Komponenten.',NOW(3),NOW(3)),
('95010001-1111-4111-8111-950100000003',@IMG_001C,'de','Vor-Ort-Reparatur','Vor-Ort-Reparatur und Verifizierung','Messungen, Tests und Performance-Verifizierung.',NOW(3),NOW(3)),

('95010002-1111-4111-8111-950100000001',@IMG_002A,'de','Kapazitätssteigerung','Kapazitätssteigerung durch Modernisierung','Optimierung von Füllkörpern/Düsen und Verteilungsverbesserungen.',NOW(3),NOW(3)),
('95010002-1111-4111-8111-950100000002',@IMG_002B,'de','Energieoptimierung','Energieoptimierung','Ventilator-Motor-Upgrade und VFD-Integration zur Verbrauchsreduktion.',NOW(3),NOW(3)),
('95010002-1111-4111-8111-950100000003',@IMG_002C,'de','Umsetzung vor Ort','Modernisierung vor Ort','Tests und Verifizierung für eine funktionierende Übergabe.',NOW(3),NOW(3)),

('95010003-1111-4111-8111-950100000001',@IMG_003A,'de','Teileauswahl','Auswahl von Ersatzteilen','Passende Teile je nach Turmtyp und Kapazität auswählen.',NOW(3),NOW(3)),
('95010003-1111-4111-8111-950100000002',@IMG_003B,'de','Lieferung & Logistik','Ersatzteilversorgung','Bestände und Lieferzeiten effizient steuern.',NOW(3),NOW(3)),
('95010003-1111-4111-8111-950100000003',@IMG_003C,'de','Montageunterstützung','Montage- und Inbetriebnahmeunterstützung','Optionale Unterstützung vor Ort für einen reibungslosen Betrieb.',NOW(3),NOW(3)),

('95010004-1111-4111-8111-950100000001',@IMG_004A,'de','Branchenspezifische Lösungen','Branchenspezifische Anwendungen','Konfigurationen für unterschiedliche Branchen.',NOW(3),NOW(3)),
('95010004-1111-4111-8111-950100000002',@IMG_004B,'de','Referenzprojekte','Referenzprojekte','Erfahrung und Ergebnisse aus realen Standorten.',NOW(3),NOW(3)),
('95010004-1111-4111-8111-950100000003',@IMG_004C,'de','Anwendungsplanung','Anwendungsplanung','Vor-Ort-Termin und Planung für saubere Projektabwicklung.',NOW(3),NOW(3)),

('95010005-1111-4111-8111-950100000001',@IMG_005A,'de','Wärmelastanalyse','Wärmelastanalyse','Analyse für richtige Kapazität und Turmauswahl.',NOW(3),NOW(3)),
('95010005-1111-4111-8111-950100000002',@IMG_005B,'de','Performance-Analyse','Performance-Analyse','Trends und Messwerte zur Identifikation von Optimierungspotenzialen.',NOW(3),NOW(3)),
('95010005-1111-4111-8111-950100000003',@IMG_005C,'de','Inbetriebnahme & Schulung','Inbetriebnahme und Schulung','Vor-Ort-Verifizierung und Schulung der Bediener.',NOW(3),NOW(3));

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
