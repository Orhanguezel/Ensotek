-- =============================================================
-- FILE: 071.3_services_de.sql
-- Ensotek services – DE i18n + DE image i18n
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
('91000001-1111-4111-8111-910000000201', @SRV_001,'de',
 'maintenance-repair',
 'Periodische Wartung & Reparatur',
 'Ensotek wartet Kühltürme durch Prüfung von Füllkörpern, Sprühdüsen, Drift Eliminatoren, Ventilatorgruppe, Motor-Getriebe und mechanischen Baugruppen. Schwingungs-/Geräuschprüfungen, Ausrichtung, Dichtheit und gleichmäßige Wasserverteilung werden vor Ort verifiziert. Ziel: Stillstände reduzieren, Approach stabilisieren und die Lebensdauer erhöhen.',
 NULL,
 'Nach Umfang',
 'Inspektion & Reporting, Reinigung, mechanische Wartung, Teiletausch, Feldtests',
 'Nach Projekt',
 'Wartung und Reparatur von Kühltürmen',
 'wartung, reparatur, inspektion, schwingung, service',
 'Wartung & Reparatur | Ensotek',
 'Ensotek reduziert Stillstände und steigert Effizienz durch periodische Wartung und Reparatur von Kühltürmen.',
 'kühlturm wartung, kühlturm reparatur, ventilator motor service',
 NOW(3), NOW(3)),

('91000002-1111-4111-8111-910000000202', @SRV_002,'de',
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
 NOW(3), NOW(3)),

('91000003-1111-4111-8111-910000000203', @SRV_003,'de',
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
 NOW(3), NOW(3)),

('91000004-1111-4111-8111-910000000204', @SRV_004,'de',
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
 NOW(3), NOW(3)),

('91000005-1111-4111-8111-910000000205', @SRV_005,'de',
 'engineering-support',
 'Engineering Support',
 'Wärmelastanalyse, Auslegung/Selektion, hydraulischer Abgleich, Performancebewertung und technische Dokumentation. Vorher/Nachher-Messungen validieren die Zielperformance.',
 NULL,
 'Nach Umfang',
 'Begehung, Berechnungen, Design, Inbetriebnahme-Support, Validierung, Training',
 'Nach Projekt',
 'Engineering Support für Kühltürme',
 'engineering, optimierung, performance, inbetriebnahme, training',
 'Engineering Support | Ensotek',
 'Ensotek liefert Engineering Support für richtige Auslegung, Optimierung und Performance-Validierung.',
 'kühlturm engineering, performance analyse, optimierung',
 NOW(3), NOW(3)),

('91000006-1111-4111-8111-910000000206', @SRV_006,'de',
 'site-survey-engineering',
 'Begehung & Engineering',
 'Vor-Ort-Begehung für Prozessbedingungen, Layout, Zugang/Plattformen, Wasserverteilung, Ventilatorintegration und mechanische Anforderungen. Ergebnisse: Auslegung, Layoutvorschlag, Umsetzungsplan und Sicherheits-Checklisten.',
 NULL,
 'Nach Umfang',
 'Begehung, Messung, Reporting, Auslegung, mechanisches Konzept, Umsetzungsplan',
 'Nach Projekt',
 'Kühlturm Begehung und Engineering',
 'begehung, engineering, auslegung, selektion, umsetzungsplan',
 'Begehung & Engineering | Ensotek',
 'Ensotek steuert Selektion, Layout und Umsetzungsplanung durch Vor-Ort-Begehung und Engineering.',
 'kühlturm begehung, engineering, auslegung',
 NOW(3), NOW(3)),

('91000007-1111-4111-8111-910000000207', @SRV_007,'de',
 'performance-optimization',
 'Performance-Optimierung & Energieeffizienz',
 'Messung von Approach, Ventilatoreffizienz, Verteilungsqualität, Driftverlust und Wasserchemie. Optimierung von Füllkörpern/Düsen, Ventilatoreinstellungen und Betriebsparametern zur Senkung der Energiekosten – mit KPI-Reporting.',
 NULL,
 'Nach Umfang',
 'Vor-Ort-Messung, Analyse, Maßnahmenplan, Reporting, Validierung',
 'Nach Projekt',
 'Kühlturm Performance-Optimierung',
 'performance, energie, effizienz, messung, reporting',
 'Performance-Optimierung | Ensotek',
 'Ensotek verbessert die Performance und senkt den Energieverbrauch durch messdatenbasierte Optimierung.',
 'kühlturm performance optimierung, energieeffizienz',
 NOW(3), NOW(3)),

('91000008-1111-4111-8111-910000000208', @SRV_008,'de',
 'commissioning-startup',
 'Inbetriebnahme & Startup',
 'Montagekoordination, Checklisten, Testläufe, Schwingungsprüfungen, Wasserverteilungstests und sicherer Erststart. Übergabe mit Operator-Training und Inbetriebnahmedokumentation.',
 NULL,
 'Nach Umfang',
 'Montagekoordination, Inbetriebnahme, Tests, Training, Übergabedokumentation',
 'Nach Projekt',
 'Kühlturm Inbetriebnahme und Training',
 'inbetriebnahme, startup, tests, training, checklisten',
 'Inbetriebnahme & Startup | Ensotek',
 'Ensotek nimmt Systeme sicher in Betrieb und schließt Operator-Training mit dokumentierter Übergabe ab.',
 'kühlturm inbetriebnahme, startup, operator training',
 NOW(3), NOW(3)),

('91000009-1111-4111-8111-910000000209', @SRV_009,'de',
 'emergency-response',
 'Notdienst & Störungsbehebung',
 'Schnelldiagnose, Austausch kritischer Teile (Ventilator/Motor/Getriebe, Düsen, Füllkörper, Drift Eliminatoren) und sicherer Restart. Anschließend Root-Cause-Analyse und präventiver Wartungsplan.',
 NULL,
 'Nach Fall',
 'Schnelle Reaktion, Diagnose, Teiletausch, sicherer Restart, Incident-Report',
 'Nach Projekt',
 'Kühlturm Notdienst',
 'notdienst, störung, diagnose, restart, reporting',
 'Notdienst | Ensotek',
 'Ensotek reagiert schnell auf kritische Kühlturmausfälle und steuert sichere Restart-Prozesse.',
 'kühlturm notdienst, störungsbehebung',
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
('93000001-1111-4111-8111-930000000201',@IMG_001A,'de','Periodische Checks','Checks','Ventilatorgruppe, Motor-Getriebe und Mechanik prüfen.',NOW(3),NOW(3)),
('93000001-1111-4111-8111-930000000202',@IMG_001B,'de','Reinigung & Verteilung','Verteilung','Düsen und gleichmäßige Wasserverteilung validieren.',NOW(3),NOW(3)),
('93000001-1111-4111-8111-930000000203',@IMG_001C,'de','Vor-Ort-Reparatur','Reparatur','Teiletausch und sicherer Restart.',NOW(3),NOW(3)),

('93000002-1111-4111-8111-930000000201',@IMG_002A,'de','Retrofit-Analyse','Analyse','Füllkörper/Düsen-Upgrade und hydraulischer Plan.',NOW(3),NOW(3)),
('93000002-1111-4111-8111-930000000202',@IMG_002B,'de','Effizienz','Effizienz','Ventilator/Motor-Optimierung und VFD-Szenarien.',NOW(3),NOW(3)),
('93000002-1111-4111-8111-930000000203',@IMG_002C,'de','Umsetzung','Umsetzung','Tests und Performance-Validierung.',NOW(3),NOW(3)),

('93000003-1111-4111-8111-930000000201',@IMG_003A,'de','Matching','Matching','Auswahl von Düsen/Füllkörpern/Drift Eliminatoren.',NOW(3),NOW(3)),
('93000003-1111-4111-8111-930000000202',@IMG_003B,'de','Lieferung','Lieferung','Bestand und Lieferplanung.',NOW(3),NOW(3)),
('93000003-1111-4111-8111-930000000203',@IMG_003C,'de','Montage-Support','Support','Optionale Montage und Inbetriebnahme.',NOW(3),NOW(3)),

('93000004-1111-4111-8111-930000000201',@IMG_004A,'de','Sensorik & Alarme','Alarme','Durchfluss/Temperatur/Leitfähigkeit und Schwingung.',NOW(3),NOW(3)),
('93000004-1111-4111-8111-930000000202',@IMG_004B,'de','SCADA','SCADA','Live Monitoring und Reporting.',NOW(3),NOW(3)),
('93000004-1111-4111-8111-930000000203',@IMG_004C,'de','Remote','Remote','Sicherer Fernzugriff und Benachrichtigungen.',NOW(3),NOW(3)),

('93000005-1111-4111-8111-930000000201',@IMG_005A,'de','Wärmelast','Wärmelast','Berechnung für korrekte Auslegung.',NOW(3),NOW(3)),
('93000005-1111-4111-8111-930000000202',@IMG_005B,'de','Bewertung','Bewertung','Benchmarking und Optimierungspotenziale.',NOW(3),NOW(3)),
('93000005-1111-4111-8111-930000000203',@IMG_005C,'de','Training','Training','Dokumentation und Schulungen.',NOW(3),NOW(3)),

('93000006-1111-4111-8111-930000000201',@IMG_006A,'de','Begehung','Begehung','Layout, Zugang und Sicherheitschecklisten.',NOW(3),NOW(3)),
('93000006-1111-4111-8111-930000000202',@IMG_006B,'de','Engineering','Engineering','Auslegung und Umsetzungsplan.',NOW(3),NOW(3)),
('93000006-1111-4111-8111-930000000203',@IMG_006C,'de','Vorbereitung','Vorbereitung','Planung für Montagekoordination.',NOW(3),NOW(3)),

('93000007-1111-4111-8111-930000000201',@IMG_007A,'de','KPI','KPI','Approach und Effizienzmetriken.',NOW(3),NOW(3)),
('93000007-1111-4111-8111-930000000202',@IMG_007B,'de','Reporting','Reporting','Vorher/Nachher und Maßnahmenplan.',NOW(3),NOW(3)),
('93000007-1111-4111-8111-930000000203',@IMG_007C,'de','Maßnahmen','Maßnahmen','Ventilator/Verteilung/Füllkörper optimieren.',NOW(3),NOW(3)),

('93000008-1111-4111-8111-930000000201',@IMG_008A,'de','Checklisten','Checklisten','Pre-Commissioning Checks.',NOW(3),NOW(3)),
('93000008-1111-4111-8111-930000000202',@IMG_008B,'de','Testlauf','Testlauf','Schwingungsprüfung und sicherer Start.',NOW(3),NOW(3)),
('93000008-1111-4111-8111-930000000203',@IMG_008C,'de','Übergabe','Übergabe','Training und Dokumentation.',NOW(3),NOW(3)),

('93000009-1111-4111-8111-930000000201',@IMG_009A,'de','Schnellreaktion','Reaktion','Schnelldiagnose bei kritischem Stillstand.',NOW(3),NOW(3)),
('93000009-1111-4111-8111-930000000202',@IMG_009B,'de','Teiletausch','Tausch','Ventilator/Motor/Getriebe und kritische Teile.',NOW(3),NOW(3)),
('93000009-1111-4111-8111-930000000203',@IMG_009C,'de','Restart','Restart','Checks, Tests und Incident-Report.',NOW(3),NOW(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `alt` = VALUES(`alt`),
  `caption` = VALUES(`caption`),
  `updated_at` = NOW(3);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
