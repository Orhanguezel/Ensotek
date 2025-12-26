-- =============================================================
-- FILE: src/db/seed/sql/103_library_seed_de.sql
-- Ensotek - Library seed (DE) - base + i18n + images + files
--   - DE içerikler: KISALTMADAN, eksiksiz
--   - Idempotent: DE slug üzerinden id bul / yoksa deterministik ID kullan
--   - NOTE:
--       * 101(TR) ve 102(EN) ile aynı base id set'leri kullanılır
--       * Bu dosya DE için library + library_i18n + file_i18n ekler
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- -------------------------------------------------------------
-- Deterministic base ids (101/102 ile aynı)
-- -------------------------------------------------------------
SET @LIB_CT_BASICS          := '11111111-1111-1111-1111-111111111111';
SET @LIB_CT_FEATURES        := '22222222-2222-2222-2222-222222222222';
SET @LIB_OPEN_CIRCUIT       := '33333333-3333-3333-3333-333333333333';
SET @LIB_CLOSED_CIRCUIT     := '44444444-4444-4444-4444-444444444444';
SET @LIB_SELECTION          := '55555555-5555-5555-5555-555555555555';

SET @LIB_BROCHURE           := '66666666-6666-6666-6666-666666666666';
SET @LIB_SERVICE_GUIDE      := '77777777-7777-7777-7777-777777777777';
SET @LIB_TURKEY_SUMMER_TW   := '88888888-8888-8888-8888-888888888888';

-- -------------------------------------------------------------
-- File ids (101 ile aynı - library_files PK)
-- -------------------------------------------------------------
SET @FILE_BROCHURE := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
SET @FILE_GUIDE    := 'cccccccc-cccc-cccc-cccc-cccccccccccc';

-- =============================================================
-- 1) Was ist ein Wasserkühlturm? Arten und Funktionsprinzip (DE)
-- =============================================================

SET @LIB_CT_BASICS_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'de'
  WHERE i.slug = 'was-ist-ein-wasser-kuehlturm-arten-und-funktionsprinzip'
  LIMIT 1
);
SET @LIB_CT_BASICS_ID := COALESCE(@LIB_CT_BASICS_ID, @LIB_CT_BASICS);

INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json, category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(
  @LIB_CT_BASICS_ID,
  1, 1, 40,
  NULL,
  @LIB_CATEGORY_ID, @LIB_SUBCATEGORY_PDF,
  'Ensotek', 0, 0,
  NOW(3), NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 is_published    = VALUES(is_published),
 is_active       = VALUES(is_active),
 display_order   = VALUES(display_order),
 category_id     = VALUES(category_id),
 sub_category_id = VALUES(sub_category_id),
 author          = VALUES(author),
 published_at    = VALUES(published_at),
 updated_at      = VALUES(updated_at);

INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_CT_BASICS_ID, 'de',
  'Was ist ein Wasserkühlturm? Arten und Funktionsprinzip',
  'was-ist-ein-wasser-kuehlturm-arten-und-funktionsprinzip',
  'Technischer Überblick: Was ist ein Wasserkühlturm, welche Haupttypen gibt es, wie funktioniert er, und wie lässt sich der Verdunstungsverlust näherungsweise abschätzen.',
  CONCAT(
    '<h2>Was ist ein Wasserkühlturm? Wofür wird er eingesetzt?</h2>',
    '<p>',
      'Ein Wasserkühlturm ist eine <strong>Wärmeabfuhr-/Wärmeabgabeeinheit</strong>, die erwärmtes Prozesswasser abkühlt, ',
      'indem ein kleiner Teil des Wassers verdunstet und die Wärme an die Atmosphäre abgegeben wird. ',
      'Das verbleibende, abgekühlte Wasser wird im Becken gesammelt und wieder in den Prozess zurückgeführt. ',
      'Kühltürme werden in zahlreichen Industriezweigen sowie in HVAC-Systemen eingesetzt, um Kühlwasser bereitzustellen.',
    '</p>',

    '<h2>Kühlturmtypen</h2>',
    '<p>Kühltürme lassen sich im Wesentlichen in zwei Kategorien einteilen:</p>',
    '<ol>',
      '<li>Typen nach Luft-/Wasserströmungsanordnung</li>',
      '<li>Typen nach Kühlverfahren</li>',
    '</ol>',

    '<h3>A. Typen nach Strömungsanordnung</h3>',
    '<ul>',
      '<li>Gegenstrom-Kühltürme (Counterflow)</li>',
      '<li>Kreuzstrom-Kühltürme (Crossflow)</li>',
    '</ul>',

    '<h4>1. Gegenstrom-Kühltürme</h4>',
    '<p>',
      'Bei Gegenstrom-Kühltürmen rieselt das Wasser über die Füllkörper von oben nach unten, während die Luft von unten nach oben strömt. ',
      'Diese Ausführung ist heute in industriellen Anwendungen besonders verbreitet.',
    '</p>',
    '<p>Typische Ventilator-Anordnungen sind:</p>',
    '<ul>',
      '<li>',
        '<strong>Saugzug-Kühltürme (Induced Draft)</strong>: Der Ventilator sitzt oben. Luft tritt über Lamellen ein und wird vom Ventilator nach oben abgesaugt.',
      '</li>',
      '<li>',
        '<strong>Druckzug-Kühltürme (Forced Draft)</strong>: Der Ventilator sitzt seitlich. Luft wird in den Turm gedrückt und strömt durch den Kühlturm.',
      '</li>',
    '</ul>',

    '<h4>2. Kreuzstrom-Kühltürme</h4>',
    '<p>',
      'Bei Kreuzstrom-Kühltürmen fließt das Wasser nach unten, während die Luft horizontal bzw. quer über die Füllkörper strömt. ',
      'Auch hier gibt es Saugzug- und Druckzug-Ausführungen.',
    '</p>',

    '<h3>B. Typen nach Kühlverfahren</h3>',

    '<h4>1. Offener Kreislauf (Offener Typ)</h4>',
    '<p>',
      'Bei offenen Kühltürmen wird das Prozesswasser direkt über die Füllkörper verteilt und durch direkten Kontakt mit Luft gekühlt. ',
      'Der Wärmeübergang ist sehr effizient; gleichzeitig steigt jedoch das Risiko von Verunreinigung und Verschmutzung, da das Wasser mit der Umgebung in Kontakt kommt.',
    '</p>',
    '<p><em>Das Funktionsprinzip des offenen Typs kann bei Bedarf auch separat mit Schemata und Prozessbeispielen dargestellt werden.</em></p>',

    '<h4>2. Geschlossener Kreislauf (Geschlossener Typ)</h4>',
    '<p>',
      'Bei geschlossenen Kühltürmen zirkuliert das Prozessmedium in einer Rohrschlange/Spirale (Wärmetauscher) innerhalb des Kühlturms. ',
      'Die Abkühlung erfolgt indirekt durch Umgebungsluft und einen Sprühwasserkreislauf auf der Außenseite der Rohrschlange. ',
      'Dadurch hat das Prozesswasser keinen direkten Kontakt zur Luft und bleibt sauber. ',
      'Aufgrund des indirekten Wärmeübergangs kann die Effizienz gegenüber offenen Systemen geringer sein.',
    '</p>',
    '<p><em>Auch das Funktionsprinzip des geschlossenen Typs kann in einem separaten Dokument schematisch erläutert werden.</em></p>',

    '<h2>Wo werden Kühltürme eingesetzt?</h2>',
    '<p>Kühltürme können überall dort eingesetzt werden, wo warmes Wasser abgeführt und abgekühlt werden muss. Beispiele:</p>',
    '<ul>',
      '<li>Lebensmittelindustrie (Molkereien, Schokolade, Kekse, Zucker, Tomatenpaste usw.)</li>',
      '<li>Chemie- und Lack-/Farbindustrie</li>',
      '<li>Zementwerke</li>',
      '<li>Gießereien, Walzwerke, Stahlwerke</li>',
      '<li>Aluminium- und Eisen-/Stahlindustrie</li>',
      '<li>Drahtziehen und Kabelwerke</li>',
      '<li>Kunststoff-, Verpackungs- und Papierindustrie</li>',
      '<li>Automobilindustrie und Zulieferer</li>',
      '<li>HVAC-Systeme (Einkaufszentren, Wohnanlagen, Hotels, Krankenhäuser)</li>',
      '<li>Wassergekühlte Kaltwassersätze (Chiller)</li>',
      '<li>Wärmepumpensysteme</li>',
      '<li>Textilindustrie</li>',
      '<li>Energieerzeugung (Biomasse, Abfallverbrennung, Wasserkraft, thermische Kraftwerke)</li>',
    '</ul>',

    '<h2>Wie funktioniert ein Kühlturm?</h2>',
    '<p>',
      'Das Funktionsprinzip eines typischen Saugzug-Gegenstrom-Kühlturms lässt sich wie folgt zusammenfassen:',
    '</p>',
    '<ul>',
      '<li>Erwärmtes Wasser aus dem Prozess wird über ein Verteilsystem und Düsen gleichmäßig von oben auf die Turmquerschnittsfläche aufgebracht.</li>',
      '<li>Das Wasser rieselt durch die Füllkörper und wird in Tropfen/Filme aufgeteilt – die Wärmeübertragungsfläche wird vergrößert.</li>',
      '<li>Umgebungsluft wird durch den Ventilator von unten nach oben durch die Füllkörper angesaugt.</li>',
      '<li>Das Wasser gibt Wärme an die Luft ab und ein kleiner Teil verdunstet.</li>',
      '<li>Das abgekühlte Wasser sammelt sich im Kaltwasserbecken und wird zurück in den Prozess gepumpt.</li>',
      '<li>Die feuchte Abluft verlässt den Kühlturm über den Ventilator-/Abluftstutzen in die Atmosphäre.</li>',
    '</ul>',

    '<h2>Verdunstungsverlust und Näherungsformel</h2>',
    '<p>',
      'Als praxisnahe Ingenieur-Näherung gilt: Pro <strong>6&nbsp;°C</strong> Abkühlung des Umlaufwassers können etwa ',
      '<strong>0,9%</strong> des Umlaufvolumenstroms als Verdunstung auftreten. Dieser Anteil wird als ',
      '<strong>Verdunstungsverlust im Kühlturm</strong> bezeichnet.',
    '</p>',
    '<p>Eine häufig verwendete Faustformel lautet:</p>',
    '<p><code>Verdunstung (m³/h) ≈ 0.00085 × 1.8 × Volumenstrom (m³/h) × (T_ein − T_aus)</code></p>',
    '<p><em>Eine herunterladbare PDF-Version zu diesem Thema kann bei Bedarf zusätzlich als Datei in der Bibliothek hinterlegt werden.</em></p>'
  ),
  'Was ist ein Wasserkühlturm? Arten und Funktionsprinzip',
  'Kühlturm-Grundlagen: Definition, Typen, Funktionsprinzip, Einsatzbereiche und Näherung zur Abschätzung des Verdunstungsverlustes.',
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

-- =============================================================
-- 2) Eigenschaften der Ensotek-Kühltürme (DE)
-- =============================================================

SET @LIB_CT_FEATURES_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'de'
  WHERE i.slug = 'eigenschaften-der-ensotek-kuehltuerme'
  LIMIT 1
);
SET @LIB_CT_FEATURES_ID := COALESCE(@LIB_CT_FEATURES_ID, @LIB_CT_FEATURES);

INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json, category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(
  @LIB_CT_FEATURES_ID,
  1, 1, 50,
  NULL,
  @LIB_CATEGORY_ID, @LIB_SUBCATEGORY_PDF,
  'Ensotek', 0, 0,
  NOW(3), NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 is_published    = VALUES(is_published),
 is_active       = VALUES(is_active),
 display_order   = VALUES(display_order),
 category_id     = VALUES(category_id),
 sub_category_id = VALUES(sub_category_id),
 author          = VALUES(author),
 published_at    = VALUES(published_at),
 updated_at      = VALUES(updated_at);

INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_CT_FEATURES_ID, 'de',
  'Eigenschaften der Ensotek-Kühltürme',
  'eigenschaften-der-ensotek-kuehltuerme',
  'Technischer Überblick über Ensotek-Kühltürme: GFK/CTP-Konstruktion, Füllkörper-Optionen, Energieeffizienz, Langlebigkeit und Betriebsvorteile.',
  CONCAT(
    '<h2>Eigenschaften der Ensotek-Kühltürme</h2>',
    '<ol>',
      '<li>',
        '<strong>CTP/GFK-Gehäuse:</strong> Ensotek-Kühltürme werden aus glasfaserverstärktem Polyester (CTP/GFK) gefertigt. ',
        'Dadurch ist kein Anstrich erforderlich, und die Konstruktion bleibt über viele Jahre korrosionsbeständig und mechanisch stabil.',
      '</li>',
      '<li>',
        '<strong>Beständigkeit gegen Chemikalien und Korrosion:</strong> Die CTP-Struktur bietet hohe Widerstandsfähigkeit gegen Chemikalien und Korrosion. ',
        'Im Gegensatz zu Metalltürmen, die innerhalb weniger Jahre rosten können, wird eine lange Lebensdauer erreicht.',
      '</li>',
      '<li>',
        '<strong>Option mit flammhemmendem Harz:</strong> Für sensible Einrichtungen (Hotel, Krankenhaus, Einkaufszentrum, Wohnanlagen) ',
        'kann flammhemmendes CTP-Harz eingesetzt werden, um die Brandsicherheit zu erhöhen.',
      '</li>',
    '</ol>',

    '<h3>Füllkörper-Optionen</h3>',
    '<p>Je nach Wasserqualität und Betriebsbedingungen kommen in Ensotek-Kühltürmen drei grundlegende Füllkörpertypen zum Einsatz:</p>',
    '<ol start="4">',
      '<li>',
        '<strong>PVC-Wabenfüllkörper (Film-Fill):</strong> Für sauberes Wasser und relativ saubere Umgebungen. ',
        'Hohe benetzte Oberfläche – dadurch sehr gute Kühlleistung.',
      '</li>',
      '<li>',
        '<strong>PP-Spulenfüllkörper (Bigudi/Splash-Fill):</strong> Für verschmutztes/ölhaltiges Wasser und staubige Umgebungen. ',
        'PP ist bis ca. 100&nbsp;°C temperaturbeständig, lässt sich reinigen und hat ein geringes Verstopfungsrisiko.',
      '</li>',
      '<li>',
        '<strong>PP-Grid/Spritzfüllkörper:</strong> Für stark verschmutzte Prozesswässer – häufig in anspruchsvollen Industrieprozessen eingesetzt.',
      '</li>',
    '</ol>',

    '<ol start="7">',
      '<li>',
        '<strong>Materialkompatibilität und lange Lebensdauer:</strong> Im Turminneren werden keine tragenden Metall- oder Holzteile verwendet. ',
        'Die Stabilität wird durch geeignete CTP-Laminatstrukturen (z. B. Coremat-Schichten) erreicht, wodurch eine Lebensdauer von 30–40 Jahren möglich ist.',
      '</li>',
      '<li>',
        '<strong>Geringe Wartungskosten:</strong> Durch CTP-Gehäuse und korrekt ausgewählte Füllkörper sinken die periodischen Wartungskosten im Vergleich zu Metalltürmen deutlich.',
      '</li>',
    '</ol>',

    '<h3>Ventilator-Konfiguration und Energieeffizienz</h3>',
    '<ol start="9">',
      '<li>',
        '<strong>Obenliegender Ventilator, Saugzug, Gegenstrom:</strong> Der Ventilator ist oben angeordnet; der Turm ist als Gegenstrom-Saugzug ausgeführt. ',
        'Im Vergleich zu Druckzug-Lösungen kann dies zu geringerem Energiebedarf führen. Die hohe Austrittsgeschwindigkeit der Abluft reduziert das Risiko der Rezirkulation.',
      '</li>',
      '<li>',
        '<strong>Energieeinsparung gegenüber Druckzug-Türmen:</strong> Saugzug-Konzepte können unter vergleichbaren Bedingungen einen Energie-Vorteil von etwa ',
        '<strong>1,5–2×</strong> bieten.',
      '</li>',
    '</ol>',

    '<h3>Leistung und Betriebsvorteile</h3>',
    '<ol start="11">',
      '<li>',
        '<strong>Hohe Kühlleistung:</strong> Gute Annäherung an die Feuchtkugeltemperatur (Wet-Bulb) unterstützt Prozessstabilität und Energieeinsparungen.',
      '</li>',
      '<li>',
        '<strong>Amortisation:</strong> Die Investition in CTP/GFK kann initial höher sein, jedoch können geringere Wartungs- und Betriebskosten die Gesamtbetriebskosten reduzieren.',
      '</li>',
      '<li>',
        '<strong>Einfache Ersatzteilversorgung:</strong> Ventilatoren, Füllkörper, Düsen und Komponenten sind typischerweise gut verfügbar und wirtschaftlich – das unterstützt die Anlagenverfügbarkeit.',
      '</li>',
    '</ol>'
  ),
  'Eigenschaften der Ensotek-Kühltürme',
  'Ensotek-Kühltürme: CTP/GFK-Konstruktion, Füllkörper-Optionen, Energieeffizienz, Langlebigkeit und Betriebsvorteile.',
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

-- =============================================================
-- 3) Offener Kühlturm (Offener Kreislauf) - Funktionsprinzip (DE)
-- =============================================================

SET @LIB_CT_OPEN_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'de'
  WHERE i.slug = 'offener-kuehlturm-funktionsprinzip'
  LIMIT 1
);
SET @LIB_CT_OPEN_ID := COALESCE(@LIB_CT_OPEN_ID, @LIB_OPEN_CIRCUIT);

INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json, category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(
  @LIB_CT_OPEN_ID,
  1, 1, 60,
  NULL,
  @LIB_CATEGORY_ID, @LIB_SUBCATEGORY_PDF,
  'Ensotek', 0, 0,
  NOW(3), NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 is_published    = VALUES(is_published),
 is_active       = VALUES(is_active),
 display_order   = VALUES(display_order),
 category_id     = VALUES(category_id),
 sub_category_id = VALUES(sub_category_id),
 author          = VALUES(author),
 published_at    = VALUES(published_at),
 updated_at      = VALUES(updated_at);

INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_CT_OPEN_ID, 'de',
  'Offener Kühlturm – Funktionsprinzip',
  'offener-kuehlturm-funktionsprinzip',
  'Überblick über das Funktionsprinzip offener Kühltürme, Betriebsabläufe im Gegenstrom-Saugzug, sowie ein Ansatz zur Abschätzung des Verdunstungsverlustes.',
  CONCAT(
    '<h2>Offener Kühlturm – Funktionsprinzip</h2>',
    '<h3>Wie arbeitet ein Kühlturm?</h3>',
    '<p>',
      'Kühltürme werden hinsichtlich der Strömungsanordnung häufig in <strong>Gegenstrom</strong> und <strong>Kreuzstrom</strong> eingeteilt. ',
      'Beim Gegenstrom fließt Wasser nach unten, während Luft nach oben strömt; beim Kreuzstrom strömt Luft quer zum Wasserfilm. ',
      'Gegenstrom-Ausführungen werden in vielen Anwendungen aufgrund von Effizienz und kompakter Bauweise bevorzugt.',
    '</p>',

    '<p>',
      'In einem <strong>Gegenstrom-Saugzug</strong>-Kühlturm wird warmes Wasser über ein Verteilsystem und Düsen oben eingebracht. ',
      'Beim Durchströmen der Füllkörper wird es in Tropfen/Filme aufgeteilt, wodurch die Wärmeübertragungsfläche steigt.',
    '</p>',

    '<p>',
      'Umgebungsluft wird durch den Ventilator von unten nach oben angesaugt. Das Wasser gibt Wärme an die Luft ab und ein kleiner Teil verdunstet. ',
      'Das abgekühlte Wasser wird im Becken gesammelt und in den Prozess zurückgepumpt; die feuchte Abluft wird nach außen abgeführt.',
    '</p>',

    '<h3>Mechanismen der Wärmeabfuhr</h3>',
    '<p>Die Abkühlung in offenen Kühltürmen erfolgt über zwei kombinierte Mechanismen:</p>',
    '<ul>',
      '<li><strong>Fühlbare Wärmeübertragung (Sensible Heat)</strong>: Wärmeübergang aufgrund der Temperaturdifferenz zwischen Wasser und Luft.</li>',
      '<li><strong>Latente Wärme durch Verdunstung</strong>: Ein Teil des Wassers verdunstet und entzieht zusätzliche Wärme (dominanter Effekt).</li>',
    '</ul>',

    '<h3>Verdunstungsverlust (Faustformel)</h3>',
    '<p>',
      'Eine gängige Ingenieur-Näherung ist: Bei einer Abkühlung des Umlaufwassers um <strong>6&nbsp;°C</strong> ',
      'liegt der Verdunstungsverlust häufig bei etwa <strong>0,9%</strong> des Umlaufvolumenstroms.',
    '</p>',
    '<p><code>Verdunstung (m³/h) ≈ 0.00085 × 1.8 × Volumenstrom (m³/h) × (T_ein − T_aus)</code></p>',

    '<h3>Zusammenfassung</h3>',
    '<p>',
      'In offenen Kühltürmen wird warmes Wasser durch direkten Luftkontakt abgekühlt; die Verdunstung trägt wesentlich zur Wärmeabfuhr bei. ',
      'Die Füllkörper vergrößern die Wärmeübertragungsfläche und der Verdunstungsverlust kann für eine erste Auslegung näherungsweise abgeschätzt werden. ',
      'Zusätzliche Verluste wie Drift und Abschlämmung (Blowdown) sollten durch geeignete Auslegung und Betriebsführung kontrolliert werden.',
    '</p>'
  ),
  'Offener Kühlturm – Funktionsprinzip',
  'Offene Kühltürme: Betriebsablauf, Mechanismen der Wärmeabfuhr und Abschätzung des Verdunstungsverlustes.',
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

-- =============================================================
-- 4) Geschlossener Kühlturm (Geschlossener Kreislauf) - Funktionsprinzip (DE)
-- =============================================================

SET @LIB_CT_CLOSED_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'de'
  WHERE i.slug = 'geschlossener-kuehlturm-funktionsprinzip'
  LIMIT 1
);
SET @LIB_CT_CLOSED_ID := COALESCE(@LIB_CT_CLOSED_ID, @LIB_CLOSED_CIRCUIT);

INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json, category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(
  @LIB_CT_CLOSED_ID,
  1, 1, 70,
  NULL,
  @LIB_CATEGORY_ID, @LIB_SUBCATEGORY_PDF,
  'Ensotek', 0, 0,
  NOW(3), NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 is_published    = VALUES(is_published),
 is_active       = VALUES(is_active),
 display_order   = VALUES(display_order),
 category_id     = VALUES(category_id),
 sub_category_id = VALUES(sub_category_id),
 author          = VALUES(author),
 published_at    = VALUES(published_at),
 updated_at      = VALUES(updated_at);

INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_CT_CLOSED_ID, 'de',
  'Geschlossener Kühlturm – Funktionsprinzip',
  'geschlossener-kuehlturm-funktionsprinzip',
  'Überblick über geschlossene Kühltürme: indirekte Kühlung über Rohrschlange, Verdunstung im Sprühwasserkreis, Free-Cooling-Betrieb, Frostschutz und Energieverbrauch.',
  CONCAT(
    '<h2>Geschlossener Kühlturm – Funktionsprinzip</h2>',
    '<h3>Wie arbeiten geschlossene Kühltürme?</h3>',
    '<p>',
      'Geschlossene Kühltürme werden eingesetzt, wenn die Qualität des Prozessmediums geschützt werden muss. ',
      'Das Prozessmedium zirkuliert in einer Rohrschlange (Wärmetauscher) und wird indirekt durch Umgebungsluft und einen Sprühwasserkreislauf gekühlt.',
    '</p>',

    '<p>',
      'Das warme Prozessmedium strömt durch die Rohrschlange, während der Ventilator Umgebungsluft über die Rohrschlange führt. ',
      'Gleichzeitig wird Sprühwasser über die Rohrschlange verteilt und erhöht den Wärmeübergang. ',
      'So wird das Medium abgekühlt, ohne direkt mit Luft in Kontakt zu kommen.',
    '</p>',

    '<h3>Gibt es Verdunstungsverlust bei geschlossenen Kühltürmen?</h3>',
    '<p>',
      'Das Prozessmedium selbst ist geschlossen, jedoch ist der <strong>Sprühwasserkreislauf</strong> offen gegenüber der Luft. ',
      'Daher treten Verdunstungsverluste im Sprühwasserkreis auf – abhängig von Last und Klimabedingungen.',
    '</p>',

    '<h3>Free Cooling / Trockenbetrieb</h3>',
    '<p>',
      'In kalten Jahreszeiten kann der Sprühwasserkreislauf abgeschaltet werden, sodass das Gerät als <strong>Trockenkühler</strong> arbeitet ',
      '(häufig als <strong>Free Cooling</strong> bezeichnet). Dadurch sinken Wasserverbrauch und Chemikalienverbrauch deutlich.',
    '</p>',

    '<h3>Wie lässt sich ein Einfrieren der Rohrschlange verhindern?</h3>',
    '<p>',
      'Bei Stillständen im Winter (z. B. Feiertage, Wochenenden, Wartungen) besteht das Risiko, dass die Flüssigkeit in der Rohrschlange einfriert. ',
      'Mögliche Maßnahmen:',
    '</p>',
    '<ul>',
      '<li><strong>Entleeren der Rohrschlange</strong> bei längeren Stillständen,</li>',
      '<li><strong>Umlauf bei geringer Durchflussrate</strong>, um das Medium in Bewegung zu halten,</li>',
      '<li><strong>Frostschutzmittel (z. B. Glykol)</strong>, um den Gefrierpunkt zu senken.</li>',
    '</ul>',

    '<h3>Energieverbrauch</h3>',
    '<p>',
      'Der elektrische Energieverbrauch entsteht hauptsächlich durch Ventilator und Sprühwasserpumpe. ',
      'Eine optimierte Auslegung reduziert die Betriebskosten.',
    '</p>',
    '<p>',
      'Unter geeigneten Bedingungen können geschlossene Kühltürme gegenüber mechanischen Kältemaschinen (Chiller) ein hohes Einsparpotenzial bieten.',
    '</p>'
  ),
  'Geschlossener Kühlturm – Funktionsprinzip',
  'Geschlossene Kühltürme: Rohrschlangen-Kühlung, Verdunstung im Sprühkreis, Free Cooling, Frostschutz und Energieaspekte.',
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

-- =============================================================
-- 5) Erforderliche Informationen zur Kühlturm-Auswahl (DE)
-- =============================================================

SET @LIB_CT_SELECTION_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'de'
  WHERE i.slug = 'erforderliche-informationen-zur-kuehlturm-auswahl'
  LIMIT 1
);
SET @LIB_CT_SELECTION_ID := COALESCE(@LIB_CT_SELECTION_ID, @LIB_SELECTION);

INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json, category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(
  @LIB_CT_SELECTION_ID,
  1, 1, 80,
  NULL,
  @LIB_CATEGORY_ID, @LIB_SUBCATEGORY_PDF,
  'Ensotek', 0, 0,
  NOW(3), NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 is_published    = VALUES(is_published),
 is_active       = VALUES(is_active),
 display_order   = VALUES(display_order),
 category_id     = VALUES(category_id),
 sub_category_id = VALUES(sub_category_id),
 author          = VALUES(author),
 published_at    = VALUES(published_at),
 updated_at      = VALUES(updated_at);

INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_CT_SELECTION_ID, 'de',
  'Erforderliche Informationen zur Kühlturm-Auswahl',
  'erforderliche-informationen-zur-kuehlturm-auswahl',
  'Checkliste der erforderlichen Kapazitäts- und Klimadaten für eine korrekte Auslegung und Auswahl von Kühltürmen.',
  CONCAT(
    '<h2>Erforderliche Informationen zur Kühlturm-Auswahl</h2>',
    '<p>',
      'Sofern nicht anders gefordert, werden Kühltürme anhand der <strong>heißesten Sommer-Auslegungsbedingungen</strong> ausgewählt. ',
      'Eine korrekte Auswahl erfordert die gemeinsame Bewertung von Kapazität, Klimadaten und Prozessanforderungen.',
    '</p>',

    '<h3>Kernparameter (Zwingend erforderlich)</h3>',
    '<ul>',
      '<li><strong>Umlauf-Volumenstrom</strong> (m³/h) oder Wärmelast (kW, kcal/h)</li>',
      '<li><strong>Eintrittstemperatur (Warmwasser)</strong> (°C)</li>',
      '<li><strong>Austrittstemperatur (Kaltwasser)</strong> (°C)</li>',
      '<li><strong>Auslegungs-Feuchtkugeltemperatur</strong> (Wet-Bulb) (°C)</li>',
    '</ul>',

    '<h3>Zusatzdaten (Verbessern die Auslegung)</h3>',
    '<ul>',
      '<li><strong>Anwendungsfall</strong> (Industrieprozess, HVAC usw.)</li>',
      '<li><strong>Wasserqualität</strong> (Öl, Verschmutzung, Feststoffe, Neigung zur Verkalkung)</li>',
      '<li><strong>Auslegungs-Trockenkugeltemperatur</strong> (Dry-Bulb) (°C)</li>',
      '<li><strong>Standorthöhe</strong> (m)</li>',
    '</ul>',

    '<h3>Häufige Fehler</h3>',
    '<ul>',
      '<li><strong>Kühlturm-Anfragen sollten nicht nur mit einer einzigen Kapazitätszahl erfolgen.</strong> Volumenstrom und Temperaturen sind zwingend anzugeben.</li>',
      '<li><strong>Das zentrale Kriterium</strong> ist die Annäherung an die Feuchtkugeltemperatur (Approach) – also wie nah die Austrittstemperatur an die Wet-Bulb herankommt.</li>',
    '</ul>'
  ),
  'Erforderliche Informationen zur Kühlturm-Auswahl',
  'Eingangsdaten für die Kühlturm-Auswahl: Volumenstrom, Temperaturen, Wet-Bulb sowie zusätzliche Auslegungsparameter.',
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

-- =============================================================
-- 6) PDF Library Items (DE) + file i18n (DE)
-- =============================================================

SET @LIB_BROCHURE_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'de'
  WHERE i.slug = 'ensotek-unternehmensbroschuere'
  LIMIT 1
);
SET @LIB_BROCHURE_ID := COALESCE(@LIB_BROCHURE_ID, @LIB_BROCHURE);

INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json, category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(
  @LIB_BROCHURE_ID,
  1, 1, 90,
  NULL,
  @LIB_CATEGORY_ID, @LIB_SUBCATEGORY_PDF,
  'Ensotek', 0, 0,
  NOW(3), NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 is_published    = VALUES(is_published),
 is_active       = VALUES(is_active),
 display_order   = VALUES(display_order),
 category_id     = VALUES(category_id),
 sub_category_id = VALUES(sub_category_id),
 author          = VALUES(author),
 published_at    = VALUES(published_at),
 updated_at      = VALUES(updated_at);

INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_BROCHURE_ID, 'de',
  'Unternehmensbroschüre (PDF)',
  'ensotek-unternehmensbroschuere',
  'Ensotek Unternehmensbroschüre als PDF-Datei.',
  CONCAT('<h2>Unternehmensbroschüre (PDF)</h2>','<p>Ensotek Unternehmensbroschüre als PDF-Datei.</p>'),
  'Unternehmensbroschüre (PDF)',
  'Ensotek Unternehmensbroschüre als PDF-Datei.',
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

SET @LIB_SERVICE_GUIDE_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'de'
  WHERE i.slug = 'ensotek-service-leitfaden'
  LIMIT 1
);
SET @LIB_SERVICE_GUIDE_ID := COALESCE(@LIB_SERVICE_GUIDE_ID, @LIB_SERVICE_GUIDE);

INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json, category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(
  @LIB_SERVICE_GUIDE_ID,
  1, 1, 100,
  NULL,
  @LIB_CATEGORY_ID, @LIB_SUBCATEGORY_PDF,
  'Ensotek', 0, 0,
  NOW(3), NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 is_published    = VALUES(is_published),
 is_active       = VALUES(is_active),
 display_order   = VALUES(display_order),
 category_id     = VALUES(category_id),
 sub_category_id = VALUES(sub_category_id),
 author          = VALUES(author),
 published_at    = VALUES(published_at),
 updated_at      = VALUES(updated_at);

INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_SERVICE_GUIDE_ID, 'de',
  'Service-Leitfaden (PDF)',
  'ensotek-service-leitfaden',
  'Ensotek Service-Leitfaden als PDF-Datei.',
  CONCAT('<h2>Service-Leitfaden (PDF)</h2>','<p>Ensotek Service-Leitfaden als PDF-Datei.</p>'),
  'Service-Leitfaden (PDF)',
  'Ensotek Service-Leitfaden als PDF-Datei.',
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

-- -------------------------------------------------------------
-- DE file i18n
-- -------------------------------------------------------------
INSERT INTO library_files_i18n (id, file_id, locale, title, description, created_at, updated_at)
VALUES
  (UUID(), @FILE_BROCHURE, 'de', 'Unternehmensbroschüre (PDF)', 'Ensotek Unternehmensbroschüre als PDF-Datei.', NOW(3), NOW(3)),
  (UUID(), @FILE_GUIDE,    'de', 'Service-Leitfaden (PDF)', 'Ensotek Service-Leitfaden als PDF-Datei.', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  title       = VALUES(title),
  description = VALUES(description),
  updated_at  = VALUES(updated_at);

COMMIT;
