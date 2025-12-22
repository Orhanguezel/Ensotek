-- =============================================================
-- 101_2_library_cooling_tower_features_de.sql
-- DE i18n: Key Features of Ensotek Cooling Towers
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

SET @LIB_CT_FEATURES_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'ensotek-sogutma-kulelerinin-ozellikleri'
  LIMIT 1
);

INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_CT_FEATURES_ID, 'de',
  'Merkmale der Ensotek Kühltürme',
  'merkmale-der-ensotek-kuehltuerme',
  'Technischer Überblick zu FRP/CTP-Konstruktion, Füllkörpertypen, Energieeffizienz und Betriebsvorteilen von Ensotek Kühltürmen.',
  CONCAT(
    '<h2>Merkmale der Ensotek Kühltürme</h2>',
    '<ol>',
      '<li><strong>FRP/CTP-Gehäuse:</strong> Korrosionsbeständig, keine Lackierung erforderlich, langlebige Struktur.</li>',
      '<li><strong>Chemikalien- und Korrosionsresistenz:</strong> Hohe Beständigkeit gegen aggressive Umgebungen.</li>',
      '<li><strong>Option harzbasierte Flammhemmung:</strong> Für sensible Anwendungen (z. B. Hotels, Krankenhäuser) möglich.</li>',
    '</ol>',

    '<h3>Füllkörper-Optionen</h3>',
    '<p>Je nach Wasserqualität und Betriebsbedingungen werden geeignete Füllkörpertypen eingesetzt:</p>',
    '<ol>',
      '<li><strong>PVC Film-Füllkörper:</strong> Für sauberes Umlaufwasser, sehr hohe Wärmeübertragungsfläche.</li>',
      '<li><strong>PP Splash-Füllkörper (Bigudi):</strong> Für verschmutztes/ölhaltiges Wasser, geringere Verstopfungsneigung, reinigbar.</li>',
      '<li><strong>PP Grid/Splash-Füllkörper:</strong> Für sehr stark verschmutzte Prozesswässer und hohe Feststoffanteile.</li>',
    '</ol>',

    '<h3>Energieeffizienz und Ventilatorkonzept</h3>',
    '<ul>',
      '<li><strong>Gegenstrom, Induced Draft (Ventilator oben):</strong> Typisch niedrigerer Energiebedarf als Forced Draft.</li>',
      '<li><strong>Reduzierte Rezirkulation:</strong> Hohe Austrittsgeschwindigkeit der feuchten Luft verringert Rückansaugung.</li>',
    '</ul>',

    '<h3>Betriebsvorteile</h3>',
    '<ul>',
      '<li><strong>Geringere Wartungskosten:</strong> Materialwahl und robuste Bauweise reduzieren Instandhaltungsaufwand.</li>',
      '<li><strong>Hohe Verfügbarkeit:</strong> Ersatzteile (Ventilator, Düsen, Füllkörper) gut verfügbar.</li>',
      '<li><strong>Günstige Total Cost of Ownership:</strong> Energie- und Wartungsvorteile können die Investition schnell amortisieren.</li>',
    '</ul>'
  ),
  'Merkmale der Ensotek Kühltürme | Ensotek',
  'FRP/CTP-Konstruktion, Füllkörperoptionen, Energieeffizienz, Betriebsvorteile – technische Übersicht der Ensotek Kühltürme.',
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
