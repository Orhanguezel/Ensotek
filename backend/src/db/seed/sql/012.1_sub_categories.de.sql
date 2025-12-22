-- =============================================================
-- FILE: 012.1_catalog_subcategories_de.sql
-- SUB CATEGORY I18N (DE) extension for existing 012_catalog_subcategories.sql
-- Not: sub_categories(base) aynı kalır, burada sadece sub_category_i18n 'de' eklenir
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

INSERT INTO sub_category_i18n
(
  sub_category_id,
  locale,
  name,
  slug,
  description,
  alt
)
VALUES
  -- ==========================================================
  -- PRODUCT: SOĞUTMA KULELERİ (aaaa0001) – DE
  -- ==========================================================
  ('bbbb0001-1111-4111-8111-bbbbbbbb0001', 'de',
    'Industrielle Kühltürme', 'industrielle-kuehltuerme',
    NULL, NULL
  ),
  ('bbbb0002-1111-4111-8111-bbbbbbbb0002', 'de',
    'HVAC-Kühltürme', 'hvac-kuehltuerme',
    NULL, NULL
  ),
  ('bbbb0003-1111-4111-8111-bbbbbbbb0003', 'de',
    'Prozesskühlung Anwendungen', 'prozesskuehlung-anwendungen',
    NULL, NULL
  ),
  ('bbbb0004-1111-4111-8111-bbbbbbbb0004', 'de',
    'Hochleistungstürme', 'hochleistungstuerme',
    NULL, NULL
  ),
  ('bbbb0005-1111-4111-8111-bbbbbbbb0005', 'de',
    'Kompakte Dachaufbau-Türme', 'kompakte-dachaufbau-tuerme',
    NULL, NULL
  ),

  -- ==========================================================
  -- PRODUCT: AÇIK DEVRE SOĞUTMA KULELERİ (aaaa0002) – DE
  -- ==========================================================
  ('bbbb0101-1111-4111-8111-bbbbbbbb0101', 'de',
    'Offene Kühltürme mit Direktkontakt', 'offene-kuehltuerme-direktkontakt',
    NULL, NULL
  ),
  ('bbbb0102-1111-4111-8111-bbbbbbbb0102', 'de',
    'Mechanisch belüftete offene Kühltürme', 'mechanisch-belueftete-offene-kuehltuerme',
    NULL, NULL
  ),
  ('bbbb0103-1111-4111-8111-bbbbbbbb0103', 'de',
    'Naturzug offene Kühltürme', 'naturzug-offene-kuehltuerme',
    NULL, NULL
  ),

  -- ==========================================================
  -- PRODUCT: KAPALI DEVRE SOĞUTMA KULELERİ (aaaa0003) – DE
  -- ==========================================================
  ('bbbb0201-1111-4111-8111-bbbbbbbb0201', 'de',
    'Sprüh-Typ geschlossene Kühltürme', 'sprueh-typ-geschlossene-kuehltuerme',
    NULL, NULL
  ),
  ('bbbb0202-1111-4111-8111-bbbbbbbb0202', 'de',
    'Film-Typ geschlossene Kühltürme', 'film-typ-geschlossene-kuehltuerme',
    NULL, NULL
  ),
  ('bbbb0203-1111-4111-8111-bbbbbbbb0203', 'de',
    'Adiabatische Lösungen (geschlossen)', 'adiabatische-loesungen-geschlossen',
    NULL, NULL
  ),

  -- ==========================================================
  -- PRODUCT: HİBRİT SOĞUTMA SİSTEMLERİ (aaaa0004) – DE
  -- ==========================================================
  ('bbbb0301-1111-4111-8111-bbbbbbbb0301', 'de',
    'Hybrid-adiabatische Systeme', 'hybrid-adiabatische-systeme',
    NULL, NULL
  ),
  ('bbbb0302-1111-4111-8111-bbbbbbbb0302', 'de',
    'Hybridturm + Trockenkühler', 'hybridturm-trockenkuehler',
    NULL, NULL
  ),
  ('bbbb0303-1111-4111-8111-bbbbbbbb0303', 'de',
    'Saisonale Hybridlösungen', 'saisonale-hybridloesungen',
    NULL, NULL
  ),

  -- ==========================================================
  -- PRODUCT: ISI TRANSFER ÇÖZÜMLERİ (aaaa0005) – DE
  -- ==========================================================
  ('bbbb0401-1111-4111-8111-bbbbbbbb0401', 'de',
    'Plattenwärmetauscher', 'plattenwaermetauscher',
    NULL, NULL
  ),
  ('bbbb0402-1111-4111-8111-bbbbbbbb0402', 'de',
    'Dampfkondensatoren', 'dampfkondensatoren',
    NULL, NULL
  ),

  -- ==========================================================
  -- SPAREPART: SOĞUTMA KULESİ YEDEK PARÇALARI (aaaa1001) – DE
  -- ==========================================================
  ('bbbb1001-1111-4111-8111-bbbbbbbb1001', 'de',
    'Turm-Hauptprodukte', 'turm-hauptprodukte',
    NULL, NULL
  ),
  ('bbbb1002-1111-4111-8111-bbbbbbbb1002', 'de',
    'Ersatzteile & Zubehör', 'ersatzteile-zubehoer',
    NULL, NULL
  ),
  ('bbbb1003-1111-4111-8111-bbbbbbbb1003', 'de',
    'Füllkörper / Füllmaterial', 'fuellkoerper-fuellmaterial',
    NULL, NULL
  ),
  ('bbbb1004-1111-4111-8111-bbbbbbbb1004', 'de',
    'Ventilator- & Motorgruppe', 'ventilator-motorgruppe',
    NULL, NULL
  ),
  ('bbbb1005-1111-4111-8111-bbbbbbbb1005', 'de',
    'Wärmeübertragung & Wärmetauscher', 'waermeuebertragung-waermetauscher',
    NULL, NULL
  ),
  ('bbbb1006-1111-4111-8111-bbbbbbbb1006', 'de',
    'Pumpe & Umwälzung', 'pumpe-umwaelzung',
    NULL, NULL
  ),

  -- =====================
  -- NEWS: GENEL HABERLER (aaaa2001) – DE
  -- =====================
  ('bbbb2001-1111-4111-8111-bbbbbbbb2001', 'de',
    'Ankündigungen', 'ankuendigungen',
    NULL, NULL
  ),
  ('bbbb2002-1111-4111-8111-bbbbbbbb2002', 'de',
    'Pressemitteilungen', 'pressemitteilungen',
    NULL, NULL
  ),
  ('bbbb2003-1111-4111-8111-bbbbbbbb2003', 'de',
    'Branchennachrichten', 'branchennachrichten',
    NULL, NULL
  ),

  -- NEWS: ŞİRKET HABERLERİ (aaaa2002) – DE
  ('bbbb2101-1111-4111-8111-bbbbbbbb2101', 'de',
    'Neue Projekte', 'neue-projekte',
    NULL, NULL
  ),
  ('bbbb2102-1111-4111-8111-bbbbbbbb2102', 'de',
    'Auszeichnungen & Erfolge', 'auszeichnungen-erfolge',
    NULL, NULL
  ),

  -- NEWS: DUYURULAR (aaaa2003) – DE
  ('bbbb2201-1111-4111-8111-bbbbbbbb2201', 'de',
    'Allgemeine Ankündigungen', 'allgemeine-ankuendigungen',
    NULL, NULL
  ),
  ('bbbb2202-1111-4111-8111-bbbbbbbb2202', 'de',
    'Wartung / Service Hinweise', 'wartung-service-hinweise',
    NULL, NULL
  ),

  -- NEWS: BASINDA ENSOTEK (aaaa2004) – DE
  ('bbbb2301-1111-4111-8111-bbbbbbbb2301', 'de',
    'Zeitung & Magazin', 'zeitung-magazin',
    NULL, NULL
  ),
  ('bbbb2302-1111-4111-8111-bbbbbbbb2302', 'de',
    'Online-News', 'online-news',
    NULL, NULL
  ),

  -- =====================
  -- BLOG: GENEL BLOG YAZILARI (aaaa3001) – DE
  -- =====================
  ('bbbb3001-1111-4111-8111-bbbbbbbb3001', 'de',
    'Wartungsleitfäden', 'wartungsleitfaeden',
    NULL, NULL
  ),
  ('bbbb3002-1111-4111-8111-bbbbbbbb3002', 'de',
    'Design-Tipps', 'design-tipps',
    NULL, NULL
  ),
  ('bbbb3003-1111-4111-8111-bbbbbbbb3003', 'de',
    'Häufige Fragen', 'haeufige-fragen-blog',
    NULL, NULL
  ),

  -- BLOG: TEKNİK YAZILAR (aaaa3002) – DE
  ('bbbb3101-1111-4111-8111-bbbbbbbb3101', 'de',
    'Technische Leitfäden', 'technische-leitfaeden',
    NULL, NULL
  ),
  ('bbbb3102-1111-4111-8111-bbbbbbbb3102', 'de',
    'Fehlersuche', 'fehlersuche',
    NULL, NULL
  ),

  -- BLOG: SEKTÖREL YAZILAR (aaaa3003) – DE
  ('bbbb3201-1111-4111-8111-bbbbbbbb3201', 'de',
    'Marktanalyse', 'marktanalyse',
    NULL, NULL
  ),
  ('bbbb3202-1111-4111-8111-bbbbbbbb3202', 'de',
    'Trends & Entwicklungen', 'trends-entwicklungen',
    NULL, NULL
  ),

  -- BLOG: GENEL YAZILAR (aaaa3004) – DE
  ('bbbb3301-1111-4111-8111-bbbbbbbb3301', 'de',
    'Allgemeine Leitfäden', 'allgemeine-leitfaeden',
    NULL, NULL
  ),
  ('bbbb3302-1111-4111-8111-bbbbbbbb3302', 'de',
    'Inspirierende Geschichten', 'inspirierende-geschichten',
    NULL, NULL
  ),

  -- =====================
  -- SLIDER: ANA SLIDER (aaaa4001) – DE
  -- =====================
  ('bbbb4001-1111-4111-8111-bbbbbbbb4001', 'de',
    'Startseiten-Slider', 'startseiten-slider',
    NULL, NULL
  ),
  ('bbbb4002-1111-4111-8111-bbbbbbbb4002', 'de',
    'Kampagnen-Slider', 'kampagnen-slider',
    NULL, NULL
  ),

  -- =====================
  -- REFERENCES: REFERANSLAR (aaaa5001) – DE
  -- =====================
  ('bbbb5001-1111-4111-8111-bbbbbbbb5001', 'de',
    'Private Referenzen', 'private-referenzen',
    NULL, NULL
  ),
  ('bbbb5002-1111-4111-8111-bbbbbbbb5002', 'de',
    'Unternehmensreferenzen', 'unternehmensreferenzen',
    NULL, NULL
  ),

  -- =====================
  -- LIBRARY: DÖKÜMAN KÜTÜPHANESİ (aaaa6001) – DE
  -- =====================
  ('bbbb6001-1111-4111-8111-bbbbbbbb6001', 'de',
    'PDF-Dokumente', 'pdf-dokumente',
    NULL, NULL
  ),
  ('bbbb6002-1111-4111-8111-bbbbbbbb6002', 'de',
    'Bildergalerie', 'bildergalerie',
    NULL, NULL
  ),
  ('bbbb6003-1111-4111-8111-bbbbbbbb6003', 'de',
    'Videoinhalte', 'videoinhalte',
    NULL, NULL
  ),

  -- =====================
  -- ABOUT: KURUMSAL (aaaa7001) – DE
  -- =====================
  ('bbbb7001-1111-4111-8111-bbbbbbbb7001', 'de',
    'Über uns', 'ueber-uns',
    NULL, NULL
  ),
  ('bbbb7002-1111-4111-8111-bbbbbbbb7002', 'de',
    'Mission & Vision', 'mission-vision',
    NULL, NULL
  ),
  ('bbbb7003-1111-4111-8111-bbbbbbbb7003', 'de',
    'Personal / Karriere', 'karriere',
    NULL, NULL
  ),

  -- =====================
  -- SERVICES: HİZMETLER (aaaa8001) – DE
  -- =====================
  ('bbbb8001-1111-4111-8111-bbbbbbbb8001', 'de',
    'Produktion', 'produktion',
    'Ensotek ist spezialisiert auf die Herstellung industrieller Wasserkühltürme. Wir produzieren langlebige, hochwertige offene und geschlossene FRP-Kühltürme nach hohen Qualitätsstandards.',
    NULL
  ),
  ('bbbb8002-1111-4111-8111-bbbbbbbb8002', 'de',
    'Wartung & Reparatur', 'wartung-reparatur',
    'Ensotek bietet regelmäßige Wartung und professionelle Reparatur für industrielle Wasserkühltürme, verlängert die Lebensdauer der Systeme und verhindert Leistungs- und Effizienzverluste.',
    NULL
  ),
  ('bbbb8003-1111-4111-8111-bbbbbbbb8003', 'de',
    'Modernisierung', 'modernisierung',
    'Ensotek bietet Modernisierungslösungen, um bestehende Kühltürme auf aktuelle Effizienz- und Leistungsstandards zu bringen und die Energieeffizienz mit geringeren Investitionskosten zu steigern.',
    NULL
  ),
  ('bbbb8004-1111-4111-8111-bbbbbbbb8004', 'de',
    'Ersatzteile & Komponenten', 'ersatzteile-komponenten',
    'Ensotek liefert ein breites Portfolio an Ersatzteilen und Komponenten für Kühltürme und gewährleistet einen zuverlässigen, langlebigen und effizienten Betrieb Ihrer Anlagen.',
    NULL
  ),
  ('bbbb8005-1111-4111-8111-bbbbbbbb8005', 'de',
    'Anwendungen & Referenzen', 'anwendungen-referenzen',
    'Ensotek verfügt über zahlreiche Referenzprojekte in Industrie und Gewerbe und liefert langlebige, effiziente Kühlturmlösungen für Energie, Chemie, Lebensmittel, Pharma, Automotive und weitere Branchen.',
    NULL
  ),
  ('bbbb8006-1111-4111-8111-bbbbbbbb8006', 'de',
    'Engineering-Support', 'engineering-support',
    'Ensotek bietet umfassenden Engineering-Support für Kühlturmprojekte – von Auslegung und Beratung über Systemoptimierung und Performance-Analyse bis hin zu Schulungen und Inbetriebnahme.',
    NULL
  ),

  -- =====================
  -- FAQ: SIKÇA SORULAN SORULAR (aaaa9001) – DE
  -- =====================
  ('bbbb9001-1111-4111-8111-bbbbbbbb9001', 'de',
    'Allgemeine Fragen', 'allgemeine-fragen',
    NULL, NULL
  ),
  ('bbbb9002-1111-4111-8111-bbbbbbbb9002', 'de',
    'Zu den Produkten', 'zu-den-produkten',
    NULL, NULL
  ),
  ('bbbb9003-1111-4111-8111-bbbbbbbb9003', 'de',
    'Technischer Support', 'technischer-support',
    NULL, NULL
  ),
  ('bbbb9004-1111-4111-8111-bbbbbbbb9004', 'de',
    'Wartung & Service', 'wartung-service',
    NULL, NULL
  ),

  -- =====================
  -- TEAM: EKİBİMİZ (aaaa9101) – DE
  -- =====================
  ('bbbb9101-1111-4111-8111-bbbbbbbb9101', 'de',
    'Management & Gründer', 'management-gruender',
    NULL, NULL
  ),
  ('bbbb9102-1111-4111-8111-bbbbbbbb9102', 'de',
    'Engineering-Team', 'engineering-team',
    NULL, NULL
  ),
  ('bbbb9103-1111-4111-8111-bbbbbbbb9103', 'de',
    'Außendienst & Service-Team', 'aussendienst-service-team',
    NULL, NULL
  )
ON DUPLICATE KEY UPDATE
  name        = VALUES(name),
  slug        = VALUES(slug),
  description = VALUES(description),
  alt         = VALUES(alt);

COMMIT;
