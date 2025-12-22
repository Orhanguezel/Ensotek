-- =============================================================
-- 101_4_library_closed_circuit_cooling_tower_principle_de.sql
-- DE i18n: Geschlossener Kreislauf – Funktionsprinzip
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

SET @LIB_CT_CLOSED_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'kapali-cevrim-su-sogutma-kulesi-calisma-prensibi'
  LIMIT 1
);

INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_CT_CLOSED_ID, 'de',
  'Geschlossener Kühlturm: Funktionsprinzip',
  'geschlossener-kuehlturm-funktionsprinzip',
  'Technische Notiz: Funktionsprinzip geschlossener Kühltürme, Verdunstung im Sprühkreislauf, Free Cooling und Frostschutz für den Coil-Wärmetauscher.',
  CONCAT(
    '<h2>Geschlossener Kühlturm: Funktionsprinzip</h2>',
    '<p>',
      'Bei geschlossenen Kühltürmen fließt das Prozessmedium in Rohrschlangen (Coils) und kommt nicht direkt mit der Luft in Kontakt. ',
      'Die Abkühlung erfolgt indirekt über die Coil-Oberfläche, die durch Luftstrom und Sprühwasser gekühlt wird.',
    '</p>',

    '<h3>Gibt es Verdunstungsverluste?</h3>',
    '<p>',
      'Das Prozessmedium ist geschlossen geführt; jedoch ist das Sprühwasser außen am Coil luftberührt. ',
      'Daher entstehen Verdunstungsverluste im <strong>Sprühwasserkreislauf</strong> – abhängig von Last, Temperaturen und Klima.',
    '</p>',

    '<h3>Free Cooling (Trockenkühlbetrieb)</h3>',
    '<p>',
      'In kalten Jahreszeiten kann das Sprühsystem abgeschaltet werden, sodass der Turm wie ein <strong>Dry Cooler</strong> arbeitet ',
      '(häufig als <strong>Free Cooling</strong> bezeichnet). Wasser- und Chemikalienverbrauch sinken dabei deutlich.',
    '</p>',

    '<h3>Frostschutz des Coils</h3>',
    '<ul>',
      '<li><strong>Entleeren:</strong> Bei längeren Stillständen Coil vollständig ablassen.</li>',
      '<li><strong>Niedrigdurchfluss:</strong> Umlauf in geringem Volumenstrom aufrechterhalten.</li>',
      '<li><strong>Frostschutzmittel:</strong> Glykol o. ä. zur Absenkung des Gefrierpunkts.</li>',
    '</ul>',

    '<h3>Energieverbrauch</h3>',
    '<p>',
      'Hauptverbraucher sind Ventilator und Sprühwasserpumpe. Eine effiziente Auslegung reduziert Betriebskosten. ',
      'In passenden Anwendungen können geschlossene Kühltürme gegenüber klassischen Kältemaschinen deutlich weniger elektrische Energie benötigen.',
    '</p>'
  ),
  'Geschlossener Kühlturm: Funktionsprinzip | Ensotek',
  'Funktionsprinzip geschlossener Kühltürme: Coil-Kühlung, Sprühwasser-Verdunstung, Free Cooling und Frostschutzmaßnahmen.',
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
