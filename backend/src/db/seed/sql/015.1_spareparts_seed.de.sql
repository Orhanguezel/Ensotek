-- =============================================================
-- FILE: 015_spareparts_seed_de.sql
-- Ensotek Spare Parts – DE i18n extension (product_i18n)
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
  -- --------- SPAREPART 1: Fan Motoru (DE) ---------
  (
    'bbbb1001-2222-4222-8222-bbbbbbbb1001',
    'de',
    'Ventilatormotor für Kühltürme',
    'ventilatormotor-kuehlturm',
    'Hocheffizienter Ventilatormotor für Kühltürme mit Schutzart IP55. Verfügbar in unterschiedlichen Leistungs- und Drehzahlvarianten.',
    'Ventilatormotor für Kühltürme',
    JSON_ARRAY('ersatzteil', 'ventilatormotor', 'kuehlturm', 'ip55', 'ensotek'),
    JSON_OBJECT(
      'powerRange', '7,5 kW – 30 kW',
      'protectionClass', 'IP55',
      'voltage', '400V / 3 Phasen / 50 Hz',
      'mounting', 'Flanschmontage',
      'warranty', '2 Jahre Motorgarantie'
    ),
    'Ventilatormotor für Kühltürme | Ensotek Ersatzteile',
    'Hocheffizienter Ventilatormotor mit IP55 für Kühltürme – für den industriellen Einsatz geeignet, in verschiedenen Leistungsstufen verfügbar.'
  ),

  -- --------- SPAREPART 2: PVC Dolgu Bloğu (DE) ---------
  (
    'bbbb1002-2222-4222-8222-bbbbbbbb1002',
    'de',
    'PVC-Füllkörperblock (Filmtyp)',
    'pvc-fuellkoerperblock-filmtyp',
    'PVC-Füllkörperblock zur Vergrößerung der Wärmeübertragungsfläche in Kühltürmen. Hohe Temperatur- und Chemikalienbeständigkeit durch Filmtyp-Design.',
    'PVC-Füllkörperblock für Kühltürme',
    JSON_ARRAY('ersatzteil', 'fuellkoerper', 'pvc', 'filmtyp'),
    JSON_OBJECT(
      'material', 'PVC',
      'maxTemp', '60 °C',
      'type', 'Filmtyp-Füllkörper',
      'dimensions', '600 x 300 x 150 mm (Beispiel)',
      'warranty', '1 Jahr Garantie gegen Herstellungsfehler'
    ),
    'PVC-Füllkörperblock | Ensotek Ersatzteile',
    'Filmtyp-PVC-Füllkörperblock für Kühltürme – erhöht die Wärmeübertragungsfläche und bietet gute Temperatur- sowie Chemikalienbeständigkeit.'
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
