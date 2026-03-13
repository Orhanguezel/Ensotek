-- =============================================================
-- 232_projects_i18n_de.sql
-- Ensotek proje i18n kayıtları — DEUTSCH (de)
-- kuhlturm.com / ensotek.de hedef kitle
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

INSERT INTO `projects_i18n`
(
  id, project_id, locale,
  title, slug, summary, content,
  featured_image_alt, meta_title, meta_description,
  created_at, updated_at
)
VALUES

-- 1. İstanbul Plaza
(
  '66666001-0001-4666-8666-666600000001',
  '33333001-0001-4333-8333-333300000001',
  'de',
  'Istanbul Hochhaus-Plaza — 2× FRP-Kühlturm (Offener Kreislauf, Dachmontage 130 m)',
  'istanbul-hochhaus-plaza-frp-kuehlturm-offener-kreislauf-130m',
  'Zwei offene FRP-Kühltürme mit Schutzdach (je 2 Ventilatoren), gefertigt im ENSOTEK-Werk Istanbul, wurden erfolgreich auf dem 130 Meter hohen Dach eines Hochhauses in Istanbul installiert.',
  '{"html":"<p>Zwei <strong>FRP-Kühltürme (CTP-Kaportali, offener Kreislauf)</strong> mit je 2 Ventilatoren, produziert im ENSOTEK-Werk Istanbul, wurden erfolgreich auf dem Dach eines kommerziellen Hochhauses in <strong>Istanbul in 130 Meter Höhe</strong> montiert.</p><h3>Projektdaten</h3><ul><li>Typ: Offener Kühlturm mit FRP-Schutzdach</li><li>Anzahl: 2 Einheiten</li><li>Ventilatoren je Einheit: 2</li><li>Montagehöhe: 130 m (Dachmontage)</li><li>Produktionsstandort: ENSOTEK-Werk Istanbul</li></ul><p>Die Konstruktion aus glasfaserverstärktem Polyester (GFK/FRP) gewährleistet hervorragende Beständigkeit gegenüber Umwelteinflüssen und ermöglicht einen zuverlässigen Langzeitbetrieb selbst auf extremen Dachhöhen.</p>","description":"Zwei FRP-Kühltürme (offener Kreislauf, je 2 Ventilatoren) auf einem 130 m hohen Plaza-Dach in Istanbul montiert."}',
  'Istanbul Hochhaus-Plaza — FRP-Kühlturm Dachmontage 130 m',
  'Istanbul Plaza Dach FRP-Kühlturm 130 m — ENSOTEK',
  'Zwei offene FRP-Kühltürme mit je 2 Ventilatoren auf einem 130 m hohen Hochhausdach in Istanbul installiert. ENSOTEK Türkei Kühlturmprojekt.',
  NOW(3), NOW(3)
),

-- 2. Kahramanmaraş
(
  '66666001-0002-4666-8666-666600000002',
  '33333001-0002-4333-8333-333300000002',
  'de',
  'Kahramanmaraş Industrieanlage — FRP-Kühlturm mit Schutzdach (Offener Kreislauf)',
  'kahramanmaras-industrieanlage-frp-kuehlturm-offener-kreislauf',
  'Im ENSOTEK-Werk Ankara gefertigte FRP-Kühltürme mit Schutzdach wurden erfolgreich an eine Industrieanlage in Kahramanmaraş geliefert und in Betrieb genommen.',
  '{"html":"<p>Im ENSOTEK-Werk <strong>Ankara</strong> — dem größten Kühlturmproduktionswerk der Türkei — gefertigte <strong>FRP-Kühltürme mit Schutzdach (offener Kreislauf)</strong> wurden erfolgreich an eine Industrieanlage in <strong>Kahramanmaraş</strong> geliefert und in Betrieb genommen.</p><h3>Projektdetails</h3><ul><li>Typ: Offener Kühlturm mit FRP-Schutzdach</li><li>Produktionsstandort: ENSOTEK-Werk Ankara</li><li>Standort: Kahramanmaraş, Türkei</li><li>Anwendung: Industrielle Prozesskühlung</li></ul><p>Das ENSOTEK-Werk Ankara umfasst die gesamte Wertschöpfungskette: GFK-Fertigung, Schlangenwärmetauscherfertigung und Komplettmontage — alles aus einer Hand.</p>","description":"Im ENSOTEK-Werk Ankara gefertigte FRP-Kühltürme für Industrieanlage in Kahramanmaraş."}',
  'Kahramanmaraş — FRP-Kühlturm mit Schutzdach (Offener Kreislauf)',
  'Kahramanmaraş Industriekühlturm — ENSOTEK Werk Ankara',
  'ENSOTEK Werk Ankara FRP-Kühltürme für Industrieanlage in Kahramanmaraş geliefert und in Betrieb genommen.',
  NOW(3), NOW(3)
),

-- 3. Arçelik
(
  '66666001-0003-4666-8666-666600000003',
  '33333001-0003-4333-8333-333300000003',
  'de',
  'Arçelik — 2× CTP 6C Offene Kühltürme',
  'arcelik-ctp-6c-offene-kuehlturme',
  'Zwei offene GFK-Kühltürme vom Typ CTP 6C wurden für das Produktionswerk von Arçelik A.Ş. in Gebze, Kocaeli, geliefert und in Betrieb genommen.',
  '{"html":"<p>Zwei <strong>CTP 6C offene GFK-Kühltürme</strong> wurden für das Produktionswerk von <strong>Arçelik A.Ş.</strong> — einem der größten Konsumgüter- und Elektronikhersteller der Türkei — entworfen, gefertigt und in Betrieb genommen.</p><h3>Projektdaten</h3><ul><li>Modell: CTP 6C (Offener Kreislauf)</li><li>Anzahl: 2 Einheiten</li><li>Standort: Gebze, Kocaeli</li><li>Branche: Konsumgüter / Elektronikfertigung</li></ul><p>Der GFK-Korpus des CTP 6C bietet hervorragenden Schutz gegen Korrosion, UV-Strahlung und chemische Einflüsse — ideal für den langfristigen Industrieeinsatz.</p>","description":"2× CTP 6C offene GFK-Kühltürme für Arçelik-Produktionswerk in Gebze, Kocaeli."}',
  'Arçelik — 2× CTP 6C Offene GFK-Kühltürme',
  'Arçelik CTP 6C Kühlturm — ENSOTEK',
  'Zwei CTP 6C offene GFK-Kühltürme von ENSOTEK für Arçelik-Produktionswerk in Gebze, Kocaeli, Türkei.',
  NOW(3), NOW(3)
),

-- 4. Eczacıbaşı
(
  '66666001-0004-4666-8666-666600000004',
  '33333001-0004-4333-8333-333300000004',
  'de',
  'Eczacıbaşı — 3× DCTP 5C Geschlossene Kreislauf-Kühltürme',
  'eczacibasi-dctp-5c-geschlossene-kreislauf-kuehlturme',
  'Drei geschlossene GFK-Kühltürme vom Typ DCTP 5C wurden für eine Produktionsanlage von Eczacıbaşı in Istanbul installiert.',
  '{"html":"<p>Drei <strong>DCTP 5C geschlossene Kreislauf-GFK-Kühltürme</strong> wurden für eine Produktionsanlage der <strong>Eczacıbaşı</strong>-Gruppe — einem der bedeutendsten Pharma- und Chemiekonzerne der Türkei — in Istanbul installiert.</p><h3>Projektdetails</h3><ul><li>Modell: DCTP 5C (Geschlossener Kreislauf)</li><li>Anzahl: 3 Einheiten</li><li>Standort: Istanbul</li><li>Branche: Pharmazeutik / Chemie</li></ul><h3>Warum geschlossener Kreislauf in der Pharmaindustrie?</h3><p>In der pharmazeutischen und chemischen Produktion ist die Isolierung der Prozessflüssigkeit von der Außenumgebung entscheidend. Der Schlangenwärmetauscher des DCTP 5C verhindert jeden Kontakt zwischen Prozessflüssigkeit und Kühlwasser — Produktqualität und Hygiene bleiben gewährleistet.</p>","description":"3× DCTP 5C geschlossene GFK-Kühltürme für Eczacıbaşı Pharmaanlage in Istanbul."}',
  'Eczacıbaşı — 3× DCTP 5C Geschlossene GFK-Kühltürme',
  'Eczacıbaşı DCTP 5C Geschlossener Kreislauf Kühlturm — ENSOTEK',
  'Drei DCTP 5C geschlossene GFK-Kühltürme von ENSOTEK für Eczacıbaşı Pharmaanlage in Istanbul installiert.',
  NOW(3), NOW(3)
),

-- 5. Linde Gaz
(
  '66666001-0005-4666-8666-666600000005',
  '33333001-0005-4333-8333-333300000005',
  'de',
  'Linde Gas — 3× TCTP 26B + 1× DCTP 12C Hochleistungs-Kühlsystem — Gebze',
  'linde-gas-tctp-26b-dctp-12c-hochleistungs-kuehlsystem-gebze',
  'Ein Hochleistungs-Kühlsystem mit 3× TCTP 26B und 1× DCTP 12C wurde für das Prozesswerk von Linde Gas Türkiye in Gebze, Kocaeli, installiert.',
  '{"html":"<p>Für das Prozesswerk von <strong>Linde Gas Türkiye</strong> in Gebze wurde ein großes geschlossenes Kreislauf-Kühlsystem mit den leistungsstärksten ENSOTEK-Modellen installiert.</p><h3>Systemkomponenten</h3><ul><li>3× TCTP 26B — Hochleistungs-Gegenstrom-Kühlturm (geschlossener Kreislauf)</li><li>1× DCTP 12C — Doppelzellen-Kühlturm (geschlossener Kreislauf)</li><li>Gesamt: 4 Einheiten</li><li>Standort: Gebze, Kocaeli</li><li>Branche: Industriegase / Chemie</li></ul><h3>TCTP 26B im Überblick</h3><p>Die TCTP-Serie ist für anspruchsvolle Prozessanwendungen mit hohem Wärmeabfuhrbedarf im Gegenstromverfahren konzipiert. GFK-Gehäuse und hocheffizienter Schlangenwärmetauscher gewährleisten lange Betriebsdauer bei minimalem Wartungsaufwand.</p>","description":"3× TCTP 26B + 1× DCTP 12C Hochleistungs-Kühlsystem für Linde Gas Türkiye in Gebze."}',
  'Linde Gas Gebze — TCTP 26B + DCTP 12C Hochleistungs-Kühlsystem',
  'Linde Gas TCTP 26B DCTP 12C Kühlturm — ENSOTEK Gebze',
  'Hochleistungs-Kühlsystem 3× TCTP 26B + 1× DCTP 12C von ENSOTEK für Linde Gas Türkiye in Gebze, Kocaeli.',
  NOW(3), NOW(3)
),

-- 6. HES Kablo
(
  '66666001-0006-4666-8666-666600000006',
  '33333001-0006-4333-8333-333300000006',
  'de',
  'HES Kablo — DCTP 12 + DCTP 12C Geschlossene Kreislauf-Kühltürme',
  'hes-kablo-dctp-12-dctp-12c-geschlossene-kreislauf-kuehlturme',
  'Ein DCTP 12 (mit Serviceleiter-Zubehör) und ein DCTP 12C geschlossener Kreislauf-Kühlturm wurden für das Kabelfertigungswerk von HES Kablo in Betrieb genommen.',
  '{"html":"<p>Für das Kabelfertigungswerk von <strong>HES Kablo</strong> wurden zwei <strong>DCTP-Kühltürme im geschlossenen Kreislauf</strong> geliefert.</p><h3>Systemdetails</h3><ul><li>DCTP 12 — Einzelliger Kühlturm, geschlossener Kreislauf (mit Serviceleiter-Zubehör)</li><li>DCTP 12C — Doppelzelliger Kühlturm, geschlossener Kreislauf</li><li>Branche: Kabelherstellung / Elektrotechnik</li><li>Besonderheit: Maßgefertigtes Serviceleiter-Zubehör für optimalen Wartungszugang</li></ul><p>In der Kabelproduktion ist die Kühlung von Zieh- und Extrusionsmaschinen entscheidend für die Produktqualität. Das geschlossene Kreislaufsystem verhindert Kühlwasserkontaminierung und schafft eine saubere, kontrollierte Produktionsumgebung.</p>","description":"DCTP 12 + DCTP 12C geschlossene Kreislauf-Kühltürme für HES Kablo Kabelfertigungswerk."}',
  'HES Kablo — DCTP 12 + DCTP 12C Geschlossener Kreislauf-Kühlturm',
  'HES Kablo DCTP Kühlturm — ENSOTEK',
  'DCTP 12 und DCTP 12C geschlossene Kreislauf-Kühltürme von ENSOTEK für HES Kablo Kabelfertigungswerk in Betrieb genommen.',
  NOW(3), NOW(3)
),

-- 7. Green Park Otel
(
  '66666001-0007-4666-8666-666600000007',
  '33333001-0007-4333-8333-333300000007',
  'de',
  'Green Park Hotel — 2× CTP 3C Offene GFK-Kühltürme',
  'green-park-hotel-ctp-3c-offene-gfk-kuehlturme',
  'Zwei offene GFK-Kühltürme vom Typ CTP 3C wurden in das zentrale Klimakühlsystem eines Green Park Hotels integriert.',
  '{"html":"<p>Zwei <strong>CTP 3C offene GFK-Kühltürme</strong> wurden in die zentrale Klimaanlage eines <strong>Green Park Hotels</strong> integriert.</p><h3>Projektdetails</h3><ul><li>Modell: CTP 3C (Offener Kreislauf)</li><li>Anzahl: 2 Einheiten</li><li>Branche: Hotel / Hospitality / HLK</li><li>Anwendung: Zentrale Kälteanlagen-Rückkühlung</li></ul><h3>CTP-Serie für Hotels</h3><p>ENSOTEK CTP-Kühltürme zeichnen sich durch niedrige Geräuschpegel, kompakte Abmessungen und ein ästhetisches Erscheinungsbild aus — ideal für Hotelbetriebe. Der GFK-Korpus minimiert den Wartungsaufwand und senkt die Betriebskosten über die gesamte Lebensdauer.</p>","description":"2× CTP 3C offene GFK-Kühltürme im HLK-System eines Green Park Hotels integriert."}',
  'Green Park Hotel — 2× CTP 3C Offene GFK-Kühltürme',
  'Green Park Hotel CTP 3C Kühlturm — ENSOTEK HLK',
  'Zwei CTP 3C offene GFK-Kühltürme von ENSOTEK für Green Park Hotel HLK-Kühlsystem installiert.',
  NOW(3), NOW(3)
),

-- 8. Orion AVM
(
  '66666001-0008-4666-8666-666600000008',
  '33333001-0008-4333-8333-333300000008',
  'de',
  'Orion Einkaufszentrum — TCTP 9C Geschlossener Kreislauf-Kühlturm',
  'orion-einkaufszentrum-tctp-9c-geschlossener-kreislauf-kuehlturm',
  'Ein TCTP 9C Gegenstrom-Kühlturm (geschlossener Kreislauf) wurde für das zentrale HLK-System des Orion Einkaufszentrums installiert.',
  '{"html":"<p>Ein <strong>TCTP 9C Kühlturm im geschlossenen Kreislauf</strong> wurde in die zentrale HLK-Infrastruktur des <strong>Orion Einkaufszentrums</strong> integriert.</p><h3>Projektdetails</h3><ul><li>Modell: TCTP 9C (Gegenstrom — geschlossener Kreislauf)</li><li>Anzahl: 1 Einheit</li><li>Branche: Einzelhandel / Einkaufszentrum</li><li>Anwendung: Zentrale Kälteanlagen-Rückkühlung (ganzjährig)</li></ul><p>Der kompakte Stellbedarf und die zuverlässige Leistung des TCTP 9C machen ihn ideal für Handels- und Gewerbegebäude mit ganzjährigem Kühlbedarf. Die GFK-Konstruktion von ENSOTEK garantiert lange Betriebsdauer bei minimalem Wartungsaufwand.</p>","description":"TCTP 9C geschlossener Kreislauf-Kühlturm für zentrale HLK-Rückkühlung im Orion Einkaufszentrum."}',
  'Orion Einkaufszentrum — TCTP 9C Geschlossener Kreislauf-Kühlturm',
  'Orion Einkaufszentrum TCTP 9C Kühlturm — ENSOTEK',
  'TCTP 9C geschlossener Kreislauf-Kühlturm von ENSOTEK für Orion Einkaufszentrum HLK-System installiert.',
  NOW(3), NOW(3)
),

-- 9. Plastifay
(
  '66666001-0009-4666-8666-666600000009',
  '33333001-0009-4333-8333-333300000009',
  'de',
  'Plastifay — CTP 9 Offener GFK-Kühlturm',
  'plastifay-ctp-9-offener-gfk-kuehlturm',
  'Ein CTP 9 offener GFK-Kühlturm wurde für das Kunststoffproduktionswerk von Plastifay in Betrieb genommen.',
  '{"html":"<p>Ein <strong>CTP 9 offener GFK-Kühlturm</strong> wurde für das Produktionswerk von <strong>Plastifay</strong> installiert, um den Prozesskühlbedarf zu decken.</p><h3>Projektdetails</h3><ul><li>Modell: CTP 9 (Offener Kreislauf)</li><li>Branche: Kunststoff / Chemie</li><li>Anwendung: Prozesskühlung (Spritzguss / Extrusion)</li></ul><p>In der Kunststoffverarbeitung werden offene Kreislauf-Kühltürme bevorzugt für die Kühlung von Spritzguss- und Extrusionsmaschinen eingesetzt. Das CTP 9 Modell bietet optimierte Kapazität und Effizienz für diese Anwendungen.</p>","description":"CTP 9 offener GFK-Kühlturm für Plastifay Kunststoffproduktionswerk."}',
  'Plastifay — CTP 9 Offener GFK-Kühlturm',
  'Plastifay CTP 9 Offener Kühlturm — ENSOTEK',
  'CTP 9 offener GFK-Kühlturm von ENSOTEK für Plastifay Kunststoffproduktionswerk in Betrieb genommen.',
  NOW(3), NOW(3)
),

-- 10. Aves Yağ — Mersin
(
  '66666001-0010-4666-8666-666600000010',
  '33333001-0010-4333-8333-333300000010',
  'de',
  'Aves Yağ — TCTP 9B + DCTP 9B Kombiniertes Kühlsystem — Mersin',
  'aves-yag-tctp-9b-dctp-9b-kombiniertes-kuehlsystem-mersin',
  'Ein kombiniertes geschlossenes Kreislauf-Kühlsystem aus TCTP 9B und DCTP 9B wurde für das Speiseölproduktionswerk von Aves Yağ in Mersin installiert.',
  '{"html":"<p>Ein kombiniertes geschlossenes Kreislauf-Kühlsystem wurde für das Speiseöl-Produktionswerk von <strong>Aves Yağ</strong> in <strong>Mersin</strong> in Betrieb genommen.</p><h3>Systemkomponenten</h3><ul><li>1× TCTP 9B — Gegenstrom-Kühlturm (geschlossener Kreislauf)</li><li>1× DCTP 9B — Doppelzelliger Kühlturm (geschlossener Kreislauf)</li><li>Standort: Mersin, Türkei</li><li>Branche: Lebensmittel / Speiseölproduktion</li></ul><h3>Geschlossener Kreislauf in der Lebensmittelindustrie</h3><p>Hygiene und Produktsicherheit haben in der Lebensmittelproduktion höchste Priorität. Ein geschlossenes Kreislaufsystem verhindert den Kontakt der Prozessflüssigkeit mit Außenverunreinigungen. Die Kombination aus TCTP 9B und DCTP 9B deckt unterschiedliche Kapazitätsanforderungen des Werks ausgewogen ab.</p>","description":"TCTP 9B + DCTP 9B kombiniertes Kühlsystem für Aves Yağ Speiseölproduktionswerk in Mersin."}',
  'Aves Yağ Mersin — TCTP 9B + DCTP 9B Kombiniertes Kühlsystem',
  'Aves Yağ Mersin TCTP DCTP Kühlturm — ENSOTEK',
  'Kombiniertes TCTP 9B + DCTP 9B geschlossenes Kreislauf-Kühlsystem von ENSOTEK für Aves Yağ Speiseölwerk in Mersin.',
  NOW(3), NOW(3)
),

-- 11. TAT Tekstil — Gaziantep
(
  '66666001-0011-4666-8666-666600000011',
  '33333001-0011-4333-8333-333300000011',
  'de',
  'TAT Tekstil — FRP-Kühlturm mit Schutzdach (Offener Kreislauf) — Gaziantep',
  'tat-tekstil-frp-kuehlturm-schutzdach-offener-kreislauf-gaziantep',
  'Ein FRP-Kühlturm mit Schutzdach (offener Kreislauf) wurde für das Textilproduktionswerk von TAT Tekstil in Gaziantep installiert.',
  '{"html":"<p>Ein <strong>FRP-Kühlturm mit Schutzdach (offener Kreislauf)</strong> wurde für das Produktionswerk von <strong>TAT Tekstil</strong> in <strong>Gaziantep</strong> geliefert.</p><h3>Projektdetails</h3><ul><li>Standort: Gaziantep, Türkei</li><li>Branche: Textil / Garnproduktion</li><li>Anwendung: Prozesskühlung Textilmaschinen</li></ul><h3>Kühlung in der Textilindustrie</h3><p>Textilprozesse — einschließlich Färben, Waschen und Weben — erzeugen erhebliche Wärmelasten. ENSOTEK FRP-Kühltürme bieten eine kosteneffiziente und leistungsstarke Lösung für diese anspruchsvollen industriellen Anwendungen.</p>","description":"FRP-Kühlturm mit Schutzdach für TAT Tekstil Textilproduktionswerk in Gaziantep."}',
  'TAT Tekstil Gaziantep — FRP-Kühlturm mit Schutzdach',
  'TAT Tekstil Gaziantep Kühlturm — ENSOTEK',
  'FRP-Kühlturm mit Schutzdach von ENSOTEK für TAT Tekstil Textilwerk in Gaziantep, Türkei, installiert.',
  NOW(3), NOW(3)
),

-- 12. Saudi Arabia
(
  '66666001-0012-4666-8666-666600000012',
  '33333001-0012-4333-8333-333300000012',
  'de',
  'Saudi-Arabien — Industrieller GFK-Kühlturm Exportprojekt',
  'saudi-arabien-industrieller-gfk-kuehlturm-exportprojekt',
  'ENSOTEK hat erfolgreich ein industrielles GFK-Kühlturm-Exportprojekt nach Saudi-Arabien, eine der größten Volkswirtschaften des Nahen Ostens, abgeschlossen.',
  '{"html":"<p>ENSOTEK — als größter Kühlturmhersteller der Türkei — hat erfolgreich ein industrielles <strong>GFK/FRP-Kühlturmsystem</strong> nach <strong>Saudi-Arabien</strong> im Rahmen seiner internationalen Exportaktivitäten geliefert.</p><h3>Exportprojektdetails</h3><ul><li>Land: Saudi-Arabien</li><li>Produkt: FRP / GFK Offener Kühlturm</li><li>Anwendung: Industrielle Prozesskühlung</li><li>Branche: Petrochemie / Energie / Industrie</li></ul><h3>Leistung in extremem Klima</h3><p>Die hohen Umgebungstemperaturen und das raue Klima Saudi-Arabiens erfordern besondere Konstruktionsüberlegungen bei Kühltürmen. ENSOTEK\'s GFK-Korpus bietet überlegene Beständigkeit gegen Sonnenstrahlung und extreme Hitze — für zuverlässigen Betrieb auch unter Wüstenbedingungen.</p>","description":"Industrielles GFK-Kühlturm-Exportprojekt nach Saudi-Arabien. ENSOTEK internationale Referenz."}',
  'Saudi-Arabien — GFK-Kühlturm Exportprojekt',
  'Saudi-Arabien GFK Kühlturm Export — ENSOTEK International',
  'ENSOTEK hat erfolgreich ein industrielles GFK-Kühlturmsystem nach Saudi-Arabien exportiert.',
  NOW(3), NOW(3)
),

-- 13. Iran
(
  '66666001-0013-4666-8666-666600000013',
  '33333001-0013-4333-8333-333300000013',
  'de',
  'Iran — Industrieller GFK-Kühlturm Exportprojekt',
  'iran-industrieller-gfk-kuehlturm-exportprojekt',
  'ENSOTEK hat erfolgreich ein GFK-Kühlturm-Exportprojekt für eine Industrieanlage im Iran abgeschlossen.',
  '{"html":"<p>ENSOTEK hat im Rahmen seines regionalen Exportprogramms erfolgreich ein <strong>GFK/FRP-Kühlturmsystem</strong> an eine Industrieanlage im <strong>Iran</strong> geliefert.</p><h3>Projektdetails</h3><ul><li>Land: Iran</li><li>Produkt: FRP / GFK Offener Kühlturm</li><li>Anwendung: Industrielle Prozesskühlung</li></ul><p>ENSOTEK überträgt seine 40-jährige Erfahrung auf dem türkischen Markt auf internationale Projekte und bietet Industrieanlagen in der gesamten Region des Nahen Ostens und darüber hinaus zuverlässige Kühllösungen.</p>","description":"GFK-Kühlturm-Exportprojekt für Industrieanlage im Iran. ENSOTEK internationale Referenz."}',
  'Iran — GFK-Kühlturm Exportprojekt',
  'Iran GFK Kühlturm Export — ENSOTEK International',
  'ENSOTEK hat erfolgreich GFK-Kühltürme an eine Industrieanlage im Iran exportiert.',
  NOW(3), NOW(3)
),

-- 14. Tüpraş
(
  '66666001-0014-4666-8666-666600000014',
  '33333001-0014-4333-8333-333300000014',
  'de',
  'Tüpraş Raffinerie İzmit — Prozesskühlturmsystem',
  'tupras-raffinerie-izmit-prozesskühlturmsystem',
  'Ein Hochleistungs-Prozesskühlturmsystem wurde für die Tüpraş Raffinerie İzmit — Türkiens größte Ölraffinerie — geliefert.',
  '{"html":"<p>Ein <strong>Prozesskühlturmsystem</strong> wurde von ENSOTEK für die <strong>Tüpraş Raffinerie İzmit</strong> — betrieben von der Türkiye Petrol Rafinerileri A.Ş., einem der größten Industrieunternehmen der Türkei — geliefert.</p><h3>Projektdetails</h3><ul><li>Kunde: Tüpraş (Türkiye Petrol Rafinerileri A.Ş.)</li><li>Standort: İzmit, Kocaeli</li><li>Branche: Petrochemie / Ölraffinierung</li><li>Anwendung: Raffinerie-Prozesskühlung</li></ul><h3>Kühlung in der Ölraffinierung</h3><p>Raffinerieeinheiten — einschließlich Destillation, Cracken und andere Prozesse — erzeugen extreme Wärmelasten, die großvolumige Kühlsysteme erfordern. ENSOTEK-Kühltürme liefern zuverlässige, hochkapazitive Wärmeabfuhr für diese anspruchsvollen Anwendungen. Das GFK-Material bietet hervorragende Beständigkeit gegen chemische und korrosive Raffinerieumgebungen.</p>","description":"Hochleistungs-Prozesskühlturmsystem für Tüpraş Raffinerie İzmit — Petrochemie-Referenz."}',
  'Tüpraş Raffinerie İzmit — Prozesskühlturmsystem',
  'Tüpraş İzmit Raffinerie Kühlturm — ENSOTEK',
  'Hochleistungs-Prozesskühlturmsystem von ENSOTEK für Tüpraş İzmit Raffinerie, Türkiens größte Ölraffinerie.',
  NOW(3), NOW(3)
),

-- 15. TOFAS — Bursa
(
  '66666001-0015-4666-8666-666600000015',
  '33333001-0015-4333-8333-333300000015',
  'de',
  'TOFAS Automobilwerk Bursa — GFK-Kühlturm mit Schutzdach (Offener Kreislauf)',
  'tofas-automobilwerk-bursa-gfk-kuehlturm-schutzdach-offener-kreislauf',
  'Ein FRP-Kühlturmsystem mit Schutzdach wurde für das Automobilproduktionswerk von TOFAS in Bursa in Betrieb genommen.',
  '{"html":"<p>Ein <strong>FRP-Kühlturm mit Schutzdach (offener Kreislauf)</strong> wurde für das großangelegte Automobilproduktionswerk von <strong>TOFAS</strong> (Türk Otomobil Fabrikası A.Ş.) in <strong>Bursa</strong> geliefert.</p><h3>Projektdetails</h3><ul><li>Kunde: TOFAS (Türk Otomobil Fabrikası A.Ş.)</li><li>Standort: Bursa, Türkei</li><li>Branche: Automobil / Fahrzeugproduktion</li><li>Anwendung: Lackierstraßen, Formkühlung und Prozesskühlung</li></ul><h3>Kühlung in der Automobilfertigung</h3><p>Automobilwerke — einschließlich Lackierstraßen, Schweißstationen und Formkühlsysteme — benötigen hohe Kühlkapazitäten. ENSOTEK\'s FRP-Kühltürme bieten hohe Durchflusskapazität, lange Lebensdauer und niedrige Wartungskosten.</p>","description":"FRP-Kühlturm mit Schutzdach für TOFAS Automobilproduktionswerk in Bursa."}',
  'TOFAS Automobilwerk Bursa — FRP-Kühlturm mit Schutzdach',
  'TOFAS Bursa Automobilwerk Kühlturm — ENSOTEK',
  'FRP-Kühlturm mit Schutzdach von ENSOTEK für TOFAS Automobilproduktionswerk in Bursa, Türkei, in Betrieb genommen.',
  NOW(3), NOW(3)
);

COMMIT;
