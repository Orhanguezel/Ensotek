-- =============================================================
-- 071.3_services_de.sql  (Ensotek services – DE i18n)
--  - Parent zaten 071 ile insert edildi (TR üzerinden service_id bulunur)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- 1) Bakım ve Onarım → DE
SET @SRV_MAINT_ID := (
  SELECT s.id
  FROM services s
  JOIN services_i18n i ON i.service_id = s.id AND i.locale = 'tr'
  WHERE i.slug = 'bakim-ve-onarim'
  LIMIT 1
);

INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
SELECT
  UUID(),
  @SRV_MAINT_ID,
  'de',
  'wartung-und-reparatur',
  'Wartung und Reparatur',
  'Wir bieten umfassende Wartungs- und Reparaturleistungen, um einen effizienten und zuverlässigen Betrieb Ihrer Kühltürme sicherzustellen. Ensotek erstellt vorbeugende Wartungspläne, führt Fehlerdiagnosen durch und leistet Vor-Ort-Einsätze. Mechanik-Checks, Reinigung von Füllkörpern und Verteilern, Wartung von Ventilator–Motor–Getriebe, Korrosionskontrollen sowie Leistungsprüfungen werden nach standardisierten Prozessen dokumentiert. So werden ungeplante Ausfälle reduziert und die Kühlleistung stabil gehalten.',
  'FRP-Gehäuse, verzinkter Stahlrahmen, PVC/PVDF-Füllkörper, Edelstahlbefestigungen',
  'Preis nach Projektumfang und Turmkapazität',
  'Periodische Inspektion und Reporting, mechanische Wartung, Reinigung, Prüfung der Wasser-/Chemiebedingungen, Austausch kritischer Ersatzteile',
  'Bis zu 12 Monate auf Arbeitsleistung; Ersatzteile gemäß Herstellergarantie',
  'Wartungs- und Reparaturservice für Industriekühltürme',
  'wartung,reparatur,periodische wartung,service,industriekühlturm',
  'Wartung und Reparatur | Ensotek',
  'Ensotek bietet geplante Wartung, Fehlerdiagnose und professionelle Reparaturen für industrielle Wasserkühltürme. Periodische Wartungsprogramme minimieren Leistungsabfälle und ungeplante Stillstände.',
  'kühlturm wartung,kühlturm reparatur,industrielle wartung,wartungsprogramm',
  NOW(3),
  NOW(3)
FROM DUAL
WHERE @SRV_MAINT_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
 `slug`             = VALUES(`slug`),
 `name`             = VALUES(`name`),
 `description`      = VALUES(`description`),
 `material`         = VALUES(`material`),
 `price`            = VALUES(`price`),
 `includes`         = VALUES(`includes`),
 `warranty`         = VALUES(`warranty`),
 `image_alt`        = VALUES(`image_alt`),
 `tags`             = VALUES(`tags`),
 `meta_title`       = VALUES(`meta_title`),
 `meta_description` = VALUES(`meta_description`),
 `meta_keywords`    = VALUES(`meta_keywords`),
 `updated_at`       = VALUES(`updated_at`);


-- 2) Modernizasyon → DE
SET @SRV_MOD_ID := (
  SELECT s.id
  FROM services s
  JOIN services_i18n i ON i.service_id = s.id AND i.locale = 'tr'
  WHERE i.slug = 'modernizasyon'
  LIMIT 1
);

INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
SELECT
  UUID(),
  @SRV_MOD_ID,
  'de',
  'modernisierung',
  'Modernisierung',
  'Wir modernisieren bestehende Kühltürme, um die Energieeffizienz zu erhöhen, Betriebskosten zu senken und aktuelle Standards zu erfüllen. Durch neue Ventilator–Motor-Kombinationen, effiziente Füllkörper, optimierte Wasserverteilung und Automatisierung kann bei geringerem Energieverbrauch die gleiche oder eine höhere Kühlleistung erreicht werden. So lassen sich Leistungs- und Sicherheitsverbesserungen häufig ohne Neubau realisieren.',
  'Energieeffiziente Ventilatoren und Motoren, moderne PVC/PVDF-Füllkörper, korrosionsbeständige Komponenten',
  'Preis nach Vor-Ort-Analyse und Leistungsbewertung',
  'Leistungsanalyse, Modernisierungskonzept, Lieferung von Komponenten, Montage und Inbetriebnahme, Vor-Ort-Tests',
  'Je nach Komponenten 12–24 Monate (Arbeitsleistung/Equipment)',
  'Modernisierte Industriekühltürme',
  'modernisierung,energieeffizienz,retrofit,performance,upgrade',
  'Modernisierung | Ensotek',
  'Ensotek bietet energieeffizienzorientierte Modernisierungen für Wasserkühltürme. Upgrades von Ventilatoren, Füllkörpern, Verteilungssystemen und Automatisierung erhöhen die Performance bei niedrigerem Energieverbrauch.',
  'kühlturm modernisierung,retrofit,energie sparen,performance upgrade',
  NOW(3),
  NOW(3)
FROM DUAL
WHERE @SRV_MOD_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
 `slug`             = VALUES(`slug`),
 `name`             = VALUES(`name`),
 `description`      = VALUES(`description`),
 `material`         = VALUES(`material`),
 `price`            = VALUES(`price`),
 `includes`         = VALUES(`includes`),
 `warranty`         = VALUES(`warranty`),
 `image_alt`        = VALUES(`image_alt`),
 `tags`             = VALUES(`tags`),
 `meta_title`       = VALUES(`meta_title`),
 `meta_description` = VALUES(`meta_description`),
 `meta_keywords`    = VALUES(`meta_keywords`),
 `updated_at`       = VALUES(`updated_at`);


-- 3) Yedek Parçalar ve Bileşenler → DE
SET @SRV_SPARE_ID := (
  SELECT s.id
  FROM services s
  JOIN services_i18n i ON i.service_id = s.id AND i.locale = 'tr'
  WHERE i.slug = 'yedek-parcalar-ve-bilesenler'
  LIMIT 1
);

INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
SELECT
  UUID(),
  @SRV_SPARE_ID,
  'de',
  'ersatzteile-und-komponenten',
  'Ersatzteile und Komponenten',
  'Wir bieten ein breites Ersatzteilportfolio – von kritischen Antriebskomponenten bis zu strukturellen Teilen – um Stillstandszeiten zu minimieren. Ensotek liefert Ventilatoren, Motoren, Getriebe, Füllkörper, Düsen, Tropfenabscheider, Beckenkomponenten und Befestigungsteile aus Lager oder mit kurzen Lieferzeiten. Unser Team unterstützt bei der Auswahl geeigneter Teile anhand von Marke/Modell, Betriebsbedingungen und Prozessanforderungen.',
  'FRP- und verzinkte Stahlteile, PVC/PVDF-Füllkörper, Tropfenabscheider, Düsen, Ventilator–Motor–Getriebe',
  'Preis nach Teiletyp und Menge',
  'Technische Auswahlunterstützung, Alternativen (kompatible Lösungen), schnelle Beschaffung, optional Vor-Ort-Montage',
  'Herstellergarantie je Produkt; optionale Zusatzgarantie für Montage möglich',
  'Ersatzteile und Komponenten für Kühltürme',
  'ersatzteile,komponenten,ventilator,füllkörper,tropfenabscheider,düsen',
  'Ersatzteile und Komponenten | Ensotek',
  'Ensotek liefert Ersatzteile für Kühltürme – z. B. Ventilatoren, Motoren, Füllkörper, Tropfenabscheider und Düsen. Durch passende Auswahl und schnelle Beschaffung werden Stillstandszeiten reduziert.',
  'kühlturm ersatzteile,kühlturm komponenten,industrielle ersatzteilversorgung',
  NOW(3),
  NOW(3)
FROM DUAL
WHERE @SRV_SPARE_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
 `slug`             = VALUES(`slug`),
 `name`             = VALUES(`name`),
 `description`      = VALUES(`description`),
 `material`         = VALUES(`material`),
 `price`            = VALUES(`price`),
 `includes`         = VALUES(`includes`),
 `warranty`         = VALUES(`warranty`),
 `image_alt`        = VALUES(`image_alt`),
 `tags`             = VALUES(`tags`),
 `meta_title`       = VALUES(`meta_title`),
 `meta_description` = VALUES(`meta_description`),
 `meta_keywords`    = VALUES(`meta_keywords`),
 `updated_at`       = VALUES(`updated_at`);


-- 4) Uygulamalar ve Referanslar → DE
SET @SRV_APPREF_ID := (
  SELECT s.id
  FROM services s
  JOIN services_i18n i ON i.service_id = s.id AND i.locale = 'tr'
  WHERE i.slug = 'uygulamalar-ve-referanslar'
  LIMIT 1
);

INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
SELECT
  UUID(),
  @SRV_APPREF_ID,
  'de',
  'anwendungen-und-referenzen',
  'Anwendungen und Referenzen',
  'Ensotek hat in vielen Branchen – Energie, Chemie, Lebensmittel, Pharma, Automotive, Stahl, HVAC und Prozesswasser – erfolgreiche Kühlturmprojekte umgesetzt. Wir entwickeln Lösungen für offene/geschlossene FRP-Kühltürme, Meerwasseranwendungen, korrosive Umgebungen sowie Projekte mit begrenztem Platz. Unsere Referenzen stehen für langlebigen Betrieb, niedrige Betriebskosten und nachweisbare Leistungswerte. Auf Anfrage stellen wir branchenbezogene Referenzlisten und Projektbeispiele bereit.',
  NULL,
  'Abhängig von Projekt und Anwendung',
  'Branchenbezogene Referenzlisten, Projektbeispiele, technische Lösungsvorschläge, Vor-Ort-Besichtigung und Beratung',
  NULL,
  'Anwendungs- und Referenzprojekte von Ensotek',
  'referenzen,anwendungen,projekte,prozesswasser,industrie,kühlturm',
  'Anwendungen und Referenzen | Ensotek',
  'Ensotek verfügt über Referenzprojekte mit FRP-Wasserkühltürmen in zahlreichen Industrien. Wir liefern branchenspezifische Lösungen mit hoher Performance und langer Lebensdauer.',
  'kühlturm referenzen,industrielle anwendungen,branchenprojekte',
  NOW(3),
  NOW(3)
FROM DUAL
WHERE @SRV_APPREF_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
 `slug`             = VALUES(`slug`),
 `name`             = VALUES(`name`),
 `description`      = VALUES(`description`),
 `material`         = VALUES(`material`),
 `price`            = VALUES(`price`),
 `includes`         = VALUES(`includes`),
 `warranty`         = VALUES(`warranty`),
 `image_alt`        = VALUES(`image_alt`),
 `tags`             = VALUES(`tags`),
 `meta_title`       = VALUES(`meta_title`),
 `meta_description` = VALUES(`meta_description`),
 `meta_keywords`    = VALUES(`meta_keywords`),
 `updated_at`       = VALUES(`updated_at`);


-- 5) Mühendislik Desteği → DE
SET @SRV_ENGSUP_ID := (
  SELECT s.id
  FROM services s
  JOIN services_i18n i ON i.service_id = s.id AND i.locale = 'tr'
  WHERE i.slug = 'muhendislik-destegi'
  LIMIT 1
);

INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
SELECT
  UUID(),
  @SRV_ENGSUP_ID,
  'de',
  'engineering-support',
  'Engineering-Support',
  'Ensotek bietet Engineering-Support von der Vorplanung bis zur Inbetriebnahme und in der Betriebsphase. Wir unterstützen bei hydraulischen/thermischen Berechnungen, Kapazitäts- und Typauswahl, Materialauslegung sowie Layout- und Montageplanung. Zusätzlich liefern wir Vor-Ort-Performance-Messungen, Bestandsanalysen, Optimierungsvorschläge und technische Schulungen, damit Ihr Betriebsteam das System sicher und effizient betreibt.',
  NULL,
  'Preis nach Umfang der Engineering-Leistungen',
  'Vorprojekt, hydraulische/thermische Berechnungen, Vor-Ort-Aufnahme, Reporting, technische Abstimmungen und Schulungen',
  NULL,
  'Engineering-Support für Kühltürme',
  'engineering,beratung,bemessung,auslegung,performance analyse',
  'Engineering-Support | Ensotek',
  'Ensotek bietet umfassenden Engineering-Support für Kühltürme: Berechnungen, Auslegung, Projektberatung, Performance-Analysen und technische Schulungen.',
  'kühlturm engineering,projektberatung,performance analyse',
  NOW(3),
  NOW(3)
FROM DUAL
WHERE @SRV_ENGSUP_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
 `slug`             = VALUES(`slug`),
 `name`             = VALUES(`name`),
 `description`      = VALUES(`description`),
 `material`         = VALUES(`material`),
 `price`            = VALUES(`price`),
 `includes`         = VALUES(`includes`),
 `warranty`         = VALUES(`warranty`),
 `image_alt`        = VALUES(`image_alt`),
 `tags`             = VALUES(`tags`),
 `meta_title`       = VALUES(`meta_title`),
 `meta_description` = VALUES(`meta_description`),
 `meta_keywords`    = VALUES(`meta_keywords`),
 `updated_at`       = VALUES(`updated_at`);


-- 6) Üretim → DE
SET @SRV_PROD_ID := (
  SELECT s.id
  FROM services s
  JOIN services_i18n i ON i.service_id = s.id AND i.locale = 'tr'
  WHERE i.slug = 'uretim'
  LIMIT 1
);

INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
SELECT
  UUID(),
  @SRV_PROD_ID,
  'de',
  'produktion',
  'Produktion',
  'Ensotek ist auf die Konstruktion und Produktion von offenen und geschlossenen FRP-Wasserkühltürmen spezialisiert. Wir verwenden korrosionsbeständige Materialien, hochwertige Harze und langlebige Metallkomponenten. Neben Standardtypen entwickeln wir auch kundenspezifische Designs gemäß Prozessanforderungen und Standortbedingungen. Alle Schritte – vom Design über Fertigung und mechanische Montage bis zu Qualitätskontrollen – werden nach internationalen Standards dokumentiert.',
  'FRP-Paneele, verzinkte Stahlkonstruktion, Edelstahlbefestigungen, PVC/PVDF-Füllkörper und Tropfenabscheider',
  'Projektbasierte Preisgestaltung nach Typ, Kapazität und Optionen',
  'Standard- oder Sonderproduktion, Werksmontage, Vorabtests, Montage und Inbetriebnahme vor Ort',
  'Material-/Gehäusegarantie je Ausführung; Komponenten gemäß Herstellergarantie',
  'Produktion von industriellen FRP-Wasserkühltürmen',
  'produktion,frp,kühlturm,industrie,offener kreislauf,geschlossener kreislauf',
  'Produktion | Ensotek',
  'Ensotek produziert offene und geschlossene FRP-Wasserkühltürme nach hohen Qualitätsstandards. Korrosionsbeständige Materialien und effiziente Konstruktionen sorgen für langlebigen und wirtschaftlichen Betrieb.',
  'frp kühlturm produktion,industrielle produktion,sonderkonstruktion',
  NOW(3),
  NOW(3)
FROM DUAL
WHERE @SRV_PROD_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
 `slug`             = VALUES(`slug`),
 `name`             = VALUES(`name`),
 `description`      = VALUES(`description`),
 `material`         = VALUES(`material`),
 `price`            = VALUES(`price`),
 `includes`         = VALUES(`includes`),
 `warranty`         = VALUES(`warranty`),
 `image_alt`        = VALUES(`image_alt`),
 `tags`             = VALUES(`tags`),
 `meta_title`       = VALUES(`meta_title`),
 `meta_description` = VALUES(`meta_description`),
 `meta_keywords`    = VALUES(`meta_keywords`),
 `updated_at`       = VALUES(`updated_at`);

COMMIT;
