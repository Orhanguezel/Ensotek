-- =============================================================
-- 101_3_library_open_circuit_cooling_tower_principle_de.sql
-- DE i18n: Offener Kreislauf – Funktionsprinzip
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

SET @LIB_CT_OPEN_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'acik-tip-su-sogutma-kulesi-calisma-prensibi'
  LIMIT 1
);

INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_CT_OPEN_ID, 'de',
  'Offener Kühlturm: Funktionsprinzip',
  'offener-kuehlturm-funktionsprinzip',
  'Technische Notiz: Funktionsprinzip offener (offener Kreislauf) Kühltürme, Gegenstrom-Induced-Draft Betrieb und Verdunstungsverlust.',
  CONCAT(
    '<h2>Offener Kühlturm: Funktionsprinzip</h2>',
    '<p>',
      'Bei offenen Kühltürmen steht das Umlaufwasser in direktem Kontakt mit der Umgebungsluft. ',
      'Das warme Wasser wird oben verteilt, rieselt über Füllkörper nach unten, während Luft (typisch) von unten nach oben strömt.',
    '</p>',

    '<h3>Wesentliche Schritte (Gegenstrom, Induced Draft)</h3>',
    '<ul>',
      '<li>Warmwasser wird über Düsen/Verteiler gleichmäßig auf die Füllkörper aufgebracht.</li>',
      '<li>Die Füllkörper erhöhen die Benetzungsfläche und verbessern den Wärme- und Stoffübergang.</li>',
      '<li>Der Ventilator zieht Luft durch den Turm; Wasser kühlt ab, ein Teil verdunstet.</li>',
      '<li>Kaltwasser sammelt sich im Becken und wird zurückgepumpt.</li>',
    '</ul>',

    '<h3>Wärmeabfuhr: fühlbar + latent</h3>',
    '<ul>',
      '<li><strong>Fühlbare Wärme</strong>: Wärmeübertragung aufgrund der Temperaturdifferenz Wasser/Luft.</li>',
      '<li><strong>Latente Wärme (Verdunstung)</strong>: Verdunstung entzieht dem Wasser zusätzliche Wärme.</li>',
    '</ul>',

    '<h3>Verdunstungsverlust (Näherung)</h3>',
    '<p><code>Verdunstung (m³/h) = 0.00085 × 1.8 × Volumenstrom (m³/h) × (T<sub>heiss</sub> − T<sub>kalt</sub>)</code></p>',
    '<p>',
      'Drift- und Blowdown-Verluste sind zusätzlich zu berücksichtigen und werden durch Auslegung und Wasseraufbereitung gesteuert.',
    '</p>'
  ),
  'Offener Kühlturm: Funktionsprinzip | Ensotek',
  'Funktionsprinzip offener Kühltürme (Gegenstrom/Induced Draft), Verdunstungskühlung und Verlustgrößen in der Praxis.',
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
