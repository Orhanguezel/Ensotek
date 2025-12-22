-- =============================================================
-- FILE: 014_products_seed_de.sql
-- Ensotek Products – DE i18n extension (product_i18n)
-- Not: products(base) aynı; burada sadece product_i18n locale='de' eklenir
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

INSERT INTO product_i18n (
  product_id,
  locale,
  title,
  slug,
  description,
  alt,
  tags,
  specifications,
  meta_title,
  meta_description
)
VALUES
  -- ---------- PRODUCT 1: DE ----------
  (
    'bbbb0001-2222-4222-8222-bbbbbbbb0001',
    'de',
    'Industrieller offener Kühlturm (Offener Kreislauf)',
    'industrieller-offener-kuehlturm',
    'Hocheffizienter offener Kühlturm für industrielle Prozesse, HVAC-Anlagen und Kraftwerke. Durch Direktkontakt-Wärmeübertragung bietet er niedrige Betriebskosten und hohe Leistung.',
    'Industrieller offener Kühlturm',
    JSON_ARRAY('kuehlturm', 'offener kreislauf', 'industrie', 'ensotek'),
    JSON_OBJECT(
      'capacity', '1.500 m³/h – 4.500 m³/h',
      'fanType', 'Mechanisch belüfteter Axialventilator',
      'structure', 'Feuerverzinkter Stahl + GFK-Paneele',
      'fillType', 'PVC-Füllkörper (Filmtyp)',
      'waterLoss', 'Optimierte Tropfenabscheider',
      'warranty', '2 Jahre Systemgarantie'
    ),
    'Industrieller offener Kühlturm | Ensotek',
    'Hocheffizienter offener Kühlturm für Industrie- und HVAC-Anwendungen – niedriger Energieverbrauch, robuste Bauweise und lange Lebensdauer.'
  ),

  -- ---------- PRODUCT 2: DE ----------
  (
    'bbbb0002-2222-4222-8222-bbbbbbbb0002',
    'de',
    'Geschlossener Kühlturm (Filmtyp)',
    'geschlossener-kuehlturm-filmtyp',
    'Geschlossener Kühlturm mit Filmtyp-Wärmetauscheroberflächen, bei dem das Prozessmedium nicht direkt mit der Umgebungsluft in Kontakt kommt. Bietet geringen Wartungsaufwand und hohe Betriebssicherheit.',
    'Geschlossener Kühlturm (Filmtyp)',
    JSON_ARRAY('geschlossener kreislauf', 'kuehlturm', 'filmtyp', 'prozesskuehlung'),
    JSON_OBJECT(
      'capacity', '500 kW – 2.000 kW',
      'coilMaterial', 'Verzinkte oder Edelstahl-Serpentine',
      'waterCircuit', 'Geschlossener Prozesskreis + offener Turmkreis',
      'application', 'Prozesskühlung, Verflüssiger-/Kondensatorkreise von Chillers',
      'warranty', '3 Jahre Dichtheitsgarantie für die Serpentine'
    ),
    'Geschlossener Kühlturm (Filmtyp) | Ensotek',
    'Geschlossener Kühlturm mit Filmtyp-Serpentine – hohe Zuverlässigkeit, geringe Verschmutzungsneigung und reduzierter Wartungsaufwand.'
  ),

  -- ---------- PRODUCT 3: DE ----------
  (
    'bbbb0003-2222-4222-8222-bbbbbbbb0003',
    'de',
    'Hybrides adiabatisches Kühlsystem',
    'hybrides-adiabatisches-kuehlsystem',
    'Hybridsystem, das Trockenkühler-Technologie mit adiabatischer Vorkühlung kombiniert. Bietet Energieeffizienz und flexible Betriebsmodi für Projekte, in denen Wasserverbrauch kritisch ist.',
    'Hybrides adiabatisches Kühlsystem',
    JSON_ARRAY('hybridkuehlung', 'adiabatisch', 'trockenkuehler', 'energieeffizienz'),
    JSON_OBJECT(
      'waterSaving', 'Bis zu 60% Wassereinsparung gegenüber konventionellen Kühltürmen',
      'operationModes', 'Trocken-, adiabatischer und Hybridbetrieb',
      'application', 'Rechenzentren, Krankenhäuser, industrielle Prozesse',
      'warranty', '2 Jahre Systemgarantie'
    ),
    'Hybrides adiabatisches Kühlsystem | Ensotek',
    'Hybrides Kühlsystem mit Trockenkühler und adiabatischer Vorkühlung – entwickelt für wasserarme Projekte mit hoher Effizienz.'
  )
ON DUPLICATE KEY UPDATE
  title            = VALUES(title),
  slug             = VALUES(slug),
  description      = VALUES(description),
  alt              = VALUES(alt),
  tags             = VALUES(tags),
  specifications   = VALUES(specifications),
  meta_title       = VALUES(meta_title),
  meta_description = VALUES(meta_description);

COMMIT;
