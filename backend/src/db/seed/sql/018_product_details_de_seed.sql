-- =============================================================
-- FILE: 018_product_details_de_seed.sql
-- Products: Specs + FAQs (DE)
--  - Ana ürünler (bbbb0001..0003)
--  - Spareparts (bbbb1001..1002)
--  - DE için specs & FAQs (locale = 'de')
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =============================================================
-- 1) PRODUCT SPECS – DE
-- =============================================================

DELETE FROM product_specs
WHERE product_id IN (
  'bbbb0001-2222-4222-8222-bbbbbbbb0001',
  'bbbb0002-2222-4222-8222-bbbbbbbb0002',
  'bbbb0003-2222-4222-8222-bbbbbbbb0003',
  'bbbb1001-2222-4222-8222-bbbbbbbb1001',
  'bbbb1002-2222-4222-8222-bbbbbbbb1002'
)
AND locale = 'de';

INSERT INTO product_specs (
  id,
  product_id,
  locale,
  name,
  value,
  category,
  order_num
)
VALUES
  -- ===== PRODUKT 1: Industrieller Offener Kühlturm (Open Circuit) =====
  ('pspc0d01-1111-4111-8111-dddddddd0001',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   'de',
   'Durchsatzleistung',
   'Verschiedene Modelle zwischen 1.500 m³/h und 4.500 m³/h',
   'physical',
   1),
  ('pspc0d02-1111-4111-8111-dddddddd0002',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   'de',
   'Ventilatortyp',
   'Mechanischer Axialventilator mit niedrigem Geräuschpegel',
   'physical',
   2),
  ('pspc0d03-1111-4111-8111-dddddddd0003',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   'de',
   'Gehäusematerial',
   'Feuerverzinkter Stahl und GFK-Paneele',
   'material',
   3),
  ('pspc0d04-1111-4111-8111-dddddddd0004',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   'de',
   'Füllkörpertyp',
   'Hocheffiziente PVC-Füllkörper (Filmtyp)',
   'material',
   4),
  ('pspc0d05-1111-4111-8111-dddddddd0005',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   'de',
   'Garantiezeit',
   '2 Jahre Systemgarantie',
   'service',
   5),

  -- ===== PRODUKT 2: Geschlossener Kühlturm (Closed Circuit, Filmtyp) =====
  ('pspc0d11-1111-4111-8111-dddddddd0011',
   'bbbb0002-2222-4222-8222-bbbbbbbb0002',
   'de',
   'Kühlleistung',
   'Standardmodelle zwischen 500 kW und 2.000 kW',
   'physical',
   1),
  ('pspc0d12-1111-4111-8111-dddddddd0012',
   'bbbb0002-2222-4222-8222-bbbbbbbb0002',
   'de',
   'Wärmetauscherrohr (Coil) Material',
   'Feuerverzinkter Stahl oder optional Edelstahl-Coil',
   'material',
   2),
  ('pspc0d13-1111-4111-8111-dddddddd0013',
   'bbbb0002-2222-4222-8222-bbbbbbbb0002',
   'de',
   'Kreislaufkonfiguration',
   'Geschlossener Prozesskreislauf + offener Turmkreislauf',
   'custom',
   3),
  ('pspc0d14-1111-4111-8111-dddddddd0014',
   'bbbb0002-2222-4222-8222-bbbbbbbb0002',
   'de',
   'Anwendungen',
   'Prozesskühlung, Verflüssigerkreisläufe von Chillern, Wärmerückgewinnungssysteme',
   'custom',
   4),
  ('pspc0d15-1111-4111-8111-dddddddd0015',
   'bbbb0002-2222-4222-8222-bbbbbbbb0002',
   'de',
   'Garantiezeit',
   '3 Jahre Garantie auf Dichtheit des Coils',
   'service',
   5),

  -- ===== PRODUKT 3: Hybrides Adiabatisches Kühlsystem =====
  ('pspc0d21-1111-4111-8111-dddddddd0021',
   'bbbb0003-2222-4222-8222-bbbbbbbb0003',
   'de',
   'Betriebsarten',
   'Automatischer Wechsel zwischen Trocken-, Adiabatik- und Hybridbetrieb',
   'custom',
   1),
  ('pspc0d22-1111-4111-8111-dddddddd0022',
   'bbbb0003-2222-4222-8222-bbbbbbbb0003',
   'de',
   'Wassereinsparung',
   'Bis zu 60% Wassereinsparung gegenüber konventionellen Kühltürmen',
   'physical',
   2),
  ('pspc0d23-1111-4111-8111-dddddddd0023',
   'bbbb0003-2222-4222-8222-bbbbbbbb0003',
   'de',
   'Anwendungen',
   'Rechenzentren, Krankenhäuser, industrielle Prozesse und Bürogebäude',
   'custom',
   3),
  ('pspc0d24-1111-4111-8111-dddddddd0024',
   'bbbb0003-2222-4222-8222-bbbbbbbb0003',
   'de',
   'Garantiezeit',
   '2 Jahre Systemgarantie',
   'service',
   4),

  -- ===== ERSATZTEIL 1: Ventilatormotor =====
  ('pspc0d31-1111-4111-8111-dddddddd0031',
   'bbbb1001-2222-4222-8222-bbbbbbbb1001',
   'de',
   'Leistungsbereich',
   '7,5 kW – 30 kW',
   'physical',
   1),
  ('pspc0d32-1111-4111-8111-dddddddd0032',
   'bbbb1001-2222-4222-8222-bbbbbbbb1001',
   'de',
   'Schutzart',
   'IP55, für Außenbedingungen geeignet',
   'material',
   2),
  ('pspc0d33-1111-4111-8111-dddddddd0033',
   'bbbb1001-2222-4222-8222-bbbbbbbb1001',
   'de',
   'Stromversorgung',
   '400V / 3 Phasen / 50 Hz',
   'physical',
   3),
  ('pspc0d34-1111-4111-8111-dddddddd0034',
   'bbbb1001-2222-4222-8222-bbbbbbbb1001',
   'de',
   'Montageart',
   'Flanschmontage, kompatibel mit Kühlturm-Ventilatornabe',
   'custom',
   4),

  -- ===== ERSATZTEIL 2: PVC-Füllkörperblock =====
  ('pspc0d41-1111-4111-8111-dddddddd0041',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   'de',
   'Material',
   'PVC mit hoher Temperatur- und Chemikalienbeständigkeit',
   'material',
   1),
  ('pspc0d42-1111-4111-8111-dddddddd0042',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   'de',
   'Betriebstemperatur',
   'Maximal 60 °C im Dauerbetrieb',
   'physical',
   2),
  ('pspc0d43-1111-4111-8111-dddddddd0043',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   'de',
   'Typ',
   'Füllkörperblock (Filmtyp)',
   'custom',
   3)
ON DUPLICATE KEY UPDATE
  locale    = VALUES(locale),
  name      = VALUES(name),
  value     = VALUES(value),
  category  = VALUES(category),
  order_num = VALUES(order_num);

-- =============================================================
-- 2) PRODUCT FAQS – DE
-- =============================================================

DELETE FROM product_faqs
WHERE product_id IN (
  'bbbb0001-2222-4222-8222-bbbbbbbb0001',
  'bbbb0002-2222-4222-8222-bbbbbbbb0002',
  'bbbb0003-2222-4222-8222-bbbbbbbb0003',
  'bbbb1001-2222-4222-8222-bbbbbbbb1001',
  'bbbb1002-2222-4222-8222-bbbbbbbb1002'
)
AND locale = 'de';

INSERT INTO product_faqs (
  id,
  product_id,
  locale,
  question,
  answer,
  display_order,
  is_active
)
VALUES
  -- ===== PRODUKT 1: Offener Kühlturm =====
  ('pfqd0001-1111-4111-8111-dddddddd0001',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   'de',
   'Wie oft sollte ein offener Kühlturm gewartet werden?',
   'Mindestens einmal jährlich wird eine allgemeine Wartung und Reinigung empfohlen; bei schlechter Wasserqualität sind Kontrollen alle 6 Monate sinnvoll.',
   1,
   1),
  ('pfqd0002-1111-4111-8111-dddddddd0002',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   'de',
   'Was ist beim Betrieb im Winter zu beachten?',
   'Ablassstellen sollten auf Frostgefahr geprüft werden; bei Bedarf sind Begleitheizungen oder Bypass-Kreisläufe einzusetzen.',
   2,
   1),
  ('pfqd0003-1111-4111-8111-dddddddd0003',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   'de',
   'Wie lange halten Füllkörper und Tropfenabscheider?',
   'Je nach Betriebsbedingungen beträgt die Lebensdauer typischerweise 5–7 Jahre; regelmäßige Wartung verlängert die Standzeit.',
   3,
   1),

  -- ===== PRODUKT 2: Geschlossener Kühlturm =====
  ('pfqd0011-1111-4111-8111-dddddddd0011',
   'bbbb0002-2222-4222-8222-bbbbbbbb0002',
   'de',
   'Warum bleibt Prozesswasser in geschlossenen Systemen sauberer?',
   'Da das Prozesswasser nicht direkt mit der Umgebungsluft in Kontakt kommt, nimmt es weniger Schmutzpartikel auf; Korrosion und Verkalkung werden reduziert.',
   1,
   1),
  ('pfqd0012-1111-4111-8111-dddddddd0012',
   'bbbb0002-2222-4222-8222-bbbbbbbb0002',
   'de',
   'Wie sollte der Coil gereinigt werden?',
   'Die Reinigung kann per chemischer Spülung oder mit Niederdruckwasser erfolgen; eingesetzte Chemikalien sollten den Herstellerempfehlungen entsprechen.',
   2,
   1),

  -- ===== PRODUKT 3: Hybrides Adiabatisches System =====
  ('pfqd0021-1111-4111-8111-dddddddd0021',
   'bbbb0003-2222-4222-8222-bbbbbbbb0003',
   'de',
   'In welchen Projekten sind hybride adiabatische Systeme besonders vorteilhaft?',
   'Sie sind besonders vorteilhaft, wenn Wasserverfügbarkeit begrenzt ist, Wasserkosten hoch sind oder gesetzliche Limits gelten.',
   1,
   1),
  ('pfqd0022-1111-4111-8111-dddddddd0022',
   'bbbb0003-2222-4222-8222-bbbbbbbb0003',
   'de',
   'Ist ein Betrieb ausschließlich im Trockenmodus möglich?',
   'Je nach Auslegung kann das System bis zu bestimmten Außentemperaturen vollständig im Trockenmodus betrieben werden.',
   2,
   1),

  -- ===== ERSATZTEIL 1: Ventilatormotor =====
  ('pfqd0101-1111-4111-8111-dddddddd0101',
   'bbbb1001-2222-4222-8222-bbbbbbbb1001',
   'de',
   'Wie prüfe ich die Kompatibilität mit dem Motor meines bestehenden Kühlturms?',
   'Leistung, Drehzahl sowie Flanschmaße vom Typenschild sollten mit unserer technischen Dokumentation abgeglichen werden.',
   1,
   1),
  ('pfqd0102-1111-4111-8111-dddddddd0102',
   'bbbb1001-2222-4222-8222-bbbbbbbb1001',
   'de',
   'Kann der Motor mit einem Frequenzumrichter betrieben werden?',
   'Motoren mit geeigneter Isolationsklasse können mit einem Frequenzumrichter betrieben werden; für Details kontaktieren Sie bitte unser Technikteam.',
   2,
   1),

  -- ===== ERSATZTEIL 2: PVC-Füllkörperblock =====
  ('pfqd0111-1111-4111-8111-dddddddd0111',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   'de',
   'Muss der Kühlturm für den Austausch der Füllkörper abgeschaltet werden?',
   'Aus Sicherheitsgründen sollte der Kühlturm während des Austauschs außer Betrieb genommen werden.',
   1,
   1),
  ('pfqd0112-1111-4111-8111-dddddddd0112',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   'de',
   'Wie lange ist die durchschnittliche Lebensdauer von PVC-Füllkörpern?',
   'Abhängig von Wasserqualität und Betriebsbedingungen kann mit einer durchschnittlichen Lebensdauer von etwa 5 Jahren gerechnet werden.',
   2,
   1)
ON DUPLICATE KEY UPDATE
  locale        = VALUES(locale),
  question      = VALUES(question),
  answer        = VALUES(answer),
  display_order = VALUES(display_order),
  is_active     = VALUES(is_active);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
