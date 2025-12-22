-- =============================================================
-- 101_1_library_cooling_tower_basics_de.sql
-- DE i18n: Was ist ein Kühlturm? Typen und Funktionsprinzip
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

SET @LIB_CT_BASICS_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'su-sogutma-kulesi-nedir-cesitleri-nelerdir-nasil-calisir'
  LIMIT 1
);

INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_CT_BASICS_ID, 'de',
  'Was ist ein Kühlturm? Typen und Funktionsprinzip',
  'was-ist-ein-kuehlturm-typen-funktionsprinzip',
  'Technischer Überblick: Definition, Bauarten und Funktionsprinzip eines Kühlturms inklusive vereinfachter Abschätzung des Verdunstungsverlustes.',
  CONCAT(
    '<h2>Was ist ein Kühlturm? Wozu dient er?</h2>',
    '<p>',
      'Ein Kühlturm ist eine <strong>Wärmeabfuhr-Einheit</strong>, die warmes Wasser aus dem Prozess oder aus HVAC-Systemen ',
      'durch Verdunstung und Wärmeübergang an die Umgebung abkühlt. Ein Teil des Wassers verdunstet und führt dabei Wärme ab; ',
      'das abgekühlte Wasser wird im Kaltwasserbecken gesammelt und in den Kreislauf zurückgepumpt.',
    '</p>',

    '<h2>Typen von Kühltürmen</h2>',
    '<p>Kühltürme lassen sich u. a. nach Strömungsführung und nach Kühlmethode klassifizieren:</p>',
    '<ol>',
      '<li>Nach Strömungsführung: <strong>Gegenstrom</strong> und <strong>Kreuzstrom</strong></li>',
      '<li>Nach Kühlmethode: <strong>Offener Kreislauf</strong> und <strong>Geschlossener Kreislauf</strong></li>',
    '</ol>',

    '<h3>A. Strömungsführung</h3>',
    '<ul>',
      '<li><strong>Gegenstrom-Kühlturm</strong>: Wasser nach unten, Luft nach oben</li>',
      '<li><strong>Kreuzstrom-Kühlturm</strong>: Wasser nach unten, Luft horizontal/diagonal</li>',
    '</ul>',

    '<h3>B. Offener und geschlossener Kreislauf</h3>',
    '<h4>1) Offener Kreislauf</h4>',
    '<p>',
      'Das Umlaufwasser wird direkt über Füllkörper verteilt und steht in direktem Kontakt mit der Luft. ',
      'Die Wärmeabfuhr ist sehr effizient, jedoch ist die Wasserqualität stärker von Verschmutzung/Fouling beeinflusst.',
    '</p>',

    '<h4>2) Geschlossener Kreislauf</h4>',
    '<p>',
      'Das Prozessmedium fließt in Rohrschlangen/Coils (Wärmetauscher) und hat keinen direkten Kontakt zur Luft. ',
      'Die Kühlung erfolgt indirekt über die Coil-Wand; dies schützt die Medienqualität, kann aber die Effizienz gegenüber offenen Systemen reduzieren.',
    '</p>',

    '<h2>Wo werden Kühltürme eingesetzt?</h2>',
    '<p>Kühltürme werden in nahezu allen Industrien und Gebäudetechnikanwendungen eingesetzt, z. B.:</p>',
    '<ul>',
      '<li>Lebensmittelindustrie, Chemie, Stahl/Metallurgie, Automotive, Papier/Verpackung</li>',
      '<li>HVAC: Einkaufszentren, Hotels, Krankenhäuser, Rechenzentren (je nach Systemkonzept)</li>',
      '<li>Wassergekühlte Kältemaschinen (Chiller) und Prozesskühlung</li>',
    '</ul>',

    '<h2>Vereinfachte Abschätzung des Verdunstungsverlustes</h2>',
    '<p>',
      'Bei Verdunstungskühltürmen entsteht ein Verdunstungsverlust. Als praxisnahe Näherung wird häufig verwendet:',
    '</p>',
    '<p><code>Verdunstung (m³/h) = 0.00085 × 1.8 × Volumenstrom (m³/h) × (T<sub>heiss</sub> − T<sub>kalt</sub>)</code></p>',
    '<p>',
      'Beispiel: 100&nbsp;m³/h von 40&nbsp;°C auf 30&nbsp;°C ergibt ca. ',
      '<code>0.00085 × 1.8 × 100 × 10 ≈ 1.53&nbsp;m³/h</code>.',
    '</p>',
    '<p>',
      'Zusätzlich können Drift- und Blowdown-Verluste auftreten; diese werden durch geeignete Auslegung (Drift-Eliminatoren) ',
      'und Wasseraufbereitung kontrolliert.',
    '</p>'
  ),
  'Was ist ein Kühlturm? Typen und Funktionsprinzip | Ensotek',
  'Definition, Typen (Gegenstrom/Kreuzstrom, offen/geschlossen) und Funktionsprinzip von Kühltürmen inklusive Verdunstungsverlust-Näherung.',
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
