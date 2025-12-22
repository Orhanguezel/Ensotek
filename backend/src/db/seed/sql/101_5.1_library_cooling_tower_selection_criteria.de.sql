-- =============================================================
-- 101_5_library_cooling_tower_selection_criteria_de.sql
-- DE i18n: Erforderliche Daten zur Kühlturmauswahl
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

SET @LIB_CT_SELECTION_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'kule-secimi-icin-gerekli-bilgiler'
  LIMIT 1
);

INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_CT_SELECTION_ID, 'de',
  'Erforderliche Daten zur Kühlturmauswahl',
  'erforderliche-daten-zur-kuehlturm-auswahl',
  'Technische Notiz: Prozess- und Klimadaten für Kühlturmauswahl/-auslegung (Volumenstrom, Temperaturen, Sommer-Feuchttemperatur, Trockenlufttemperatur, Wasserqualität, Aufstellhöhe).',
  CONCAT(
    '<h2>Erforderliche Daten zur Kühlturmauswahl</h2>',
    '<p>',
      'Kühltürme werden – sofern nicht anders gefordert – typischerweise auf Basis der <strong>Sommer-Auslegungsbedingungen</strong> ausgelegt. ',
      'Eine belastbare Auswahl erfordert konsistente Prozess- und Klimadaten.',
    '</p>',

    '<h3>Grunddaten (zwingend erforderlich)</h3>',
    '<ul>',
      '<li><strong>Volumenstrom</strong> (m³/h) oder thermische Last (kW, kcal/h)</li>',
      '<li><strong>Warmwasser-Eintrittstemperatur</strong> in den Turm (°C)</li>',
      '<li><strong>Kaltwasser-Austrittstemperatur</strong> aus dem Turm (°C)</li>',
      '<li><strong>Sommer-Feuchttemperatur (Wet-Bulb)</strong> des Standorts (°C)</li>',
    '</ul>',

    '<p>',
      'Diese vier Größen bestimmen Kapazität, Range und den Approach zur Wet-Bulb. ',
      'Die Feuchttemperatur ist für Verdunstungskühlung die wichtigste Klimakenngröße.',
    '</p>',

    '<h3>Zusatzdaten (für optimierte Auslegung)</h3>',
    '<ul>',
      '<li><strong>Anwendungsbereich</strong> (Prozessindustrie, HVAC, etc.)</li>',
      '<li><strong>Wasserqualität</strong> (Verschmutzung, Öl, Feststoffe, Fouling/Scaling)</li>',
      '<li><strong>Sommer-Trockenlufttemperatur (Dry-Bulb)</strong> (°C)</li>',
      '<li><strong>Aufstellhöhe</strong> über NN (m)</li>',
    '</ul>',

    '<h3>Häufige Fehler in Anfragen</h3>',
    '<ul>',
      '<li>Nur eine „Kapazität“ (kW/kcal/h) ohne Volumenstrom und Temperaturen anzugeben.</li>',
      '<li>Wet-Bulb/Standortdaten nicht zu spezifizieren.</li>',
      '<li>Wasserqualität nicht zu berücksichtigen (wichtig für offene/geschlossene Systeme und Füllkörperauswahl).</li>',
    '</ul>',

    '<p>',
      'Empfehlung: In jeder Anfrage sollten Volumenstrom, Warm-/Kaltwassertemperaturen sowie Sommer-Wet-Bulb explizit angegeben werden. ',
      'Ein Tabellenblatt mit Sommer-Dry-/Wet-Bulb Auslegungswerten je Stadt/Region erhöht die Qualität der Auslegung deutlich.',
    '</p>'
  ),
  'Erforderliche Daten zur Kühlturmauswahl | Ensotek',
  'Welche Daten benötigt man für die Kühlturmauswahl? Volumenstrom, Temperaturen, Sommer-Wet-Bulb, Wasserqualität, Dry-Bulb und Aufstellhöhe.',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 title            = VALUES(title),
 slug             = VALUES(slug),
 summary          = VALUES(summary),
 content          = VALUES(content),
 meta_title       = VALUES(meta_title),
 meta_description = VALUES(meta_description),
 updated_at       = VALUES(updated_at);

COMMIT;
