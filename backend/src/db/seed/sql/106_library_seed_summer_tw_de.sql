-- =============================================================
-- FILE: src/db/seed/sql/106_library_seed_summer_tw_de.sql
-- Ensotek - Library seed (DE) - Sommer Auslegungswerte (Trocken-/Feuchtkugel) Deutschland
--  - Idempotent: DE slug üzerinden base id bul / yoksa deterministik ID kullan
--  - Base row: library (single source)
--  - i18n row: library_i18n (DE)
--  - Requires:
--      @LIB_CATEGORY_ID, @LIB_SUBCATEGORY_PDF
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- -------------------------------------------------------------
-- Deterministic base id (TR ile aynı; tek base row, çoklu locale i18n)
-- -------------------------------------------------------------
SET @LIB_SUMMER_TW := '88888888-8888-8888-8888-888888888888';

-- -------------------------------------------------------------
-- Resolve existing library_id by DE slug (if exists), else deterministic
-- -------------------------------------------------------------
SET @LIB_SUMMER_TW_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'de'
  WHERE i.slug = 'sommer-auslegungswerte-trocken-feuchtkugel-deutschland'
  LIMIT 1
);
SET @LIB_SUMMER_TW_ID := COALESCE(@LIB_SUMMER_TW_ID, @LIB_SUMMER_TW);

-- -------------------------------------------------------------
-- Ensure parent exists (base row upsert)
-- -------------------------------------------------------------
INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json, category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(
  @LIB_SUMMER_TW_ID,
  1, 1, 110,
  JSON_ARRAY('design','summer','dry-bulb','wet-bulb','germany','deutschland','hvac','cooling-tower'),
  @LIB_CATEGORY_ID, @LIB_SUBCATEGORY_PDF,
  'Ensotek', 0, 0,
  NOW(3), NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  is_published    = VALUES(is_published),
  is_active       = VALUES(is_active),
  display_order   = VALUES(display_order),
  tags_json       = VALUES(tags_json),
  category_id     = VALUES(category_id),
  sub_category_id = VALUES(sub_category_id),
  author          = VALUES(author),
  published_at    = VALUES(published_at),
  updated_at      = VALUES(updated_at);

-- -------------------------------------------------------------
-- Upsert DE i18n
-- -------------------------------------------------------------
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_SUMMER_TW_ID, 'de',
  'Deutschland: Sommer-Auslegungswerte Trocken-/Feuchtkugel (Tdb/Twb)',
  'sommer-auslegungswerte-trocken-feuchtkugel-deutschland',
  'Referenztabelle mit typischen Sommer-Auslegungswerten für Trocken- und Feuchtkugeltemperaturen (Tdb/Twb) für wichtige Bundesländer und Großstädte in Deutschland. Geeignet als Orientierung für Kühlturm- und HVAC-Auslegung.',
  CONCAT(
    '<p>Diese Tabelle enthält typische <strong>Sommer-Auslegungswerte</strong> für ',
    'die <strong>Trocken-</strong> und <strong>Feuchtkugeltemperatur</strong> (Tdb/Twb) ',
    'für ausgewählte Großstädte bzw. Regionen in Deutschland. Sie kann als ',
    'Orientierung bei der <strong>Kühlturmauslegung</strong>, bei ',
    '<strong>Kondensatorkreisläufen</strong> und in der <strong>HVAC-Planung</strong> dienen.</p>',
    '<p><strong>Hinweis:</strong> Werte sind als typische Planungs-/Referenzwerte zu verstehen. ',
    'Für verbindliche Projekte sollten aktuelle Standortdaten (z.B. DWD/TRY) sowie ',
    'Normen/Leitfäden (z.B. DIN/VDI/ASHRAE) herangezogen werden.</p>',

    '<table border="1" cellpadding="4" cellspacing="0">',
      '<thead>',
        '<tr>',
          '<th>Region / Stadt</th>',
          '<th>Trocken (Tdb, °C)</th>',
          '<th>Feucht (Twb, °C)</th>',
        '</tr>',
      '</thead>',
      '<tbody>',

        -- Nord / Küste
        '<tr><td>Hamburg</td><td>30</td><td>22</td></tr>',
        '<tr><td>Bremen</td><td>29</td><td>22</td></tr>',
        '<tr><td>Kiel (Schleswig-Holstein)</td><td>28</td><td>21</td></tr>',

        -- Ost
        '<tr><td>Berlin</td><td>32</td><td>22</td></tr>',
        '<tr><td>Dresden (Sachsen)</td><td>33</td><td>22</td></tr>',
        '<tr><td>Leipzig (Sachsen)</td><td>32</td><td>22</td></tr>',

        -- West / NRW
        '<tr><td>Köln (NRW)</td><td>32</td><td>23</td></tr>',
        '<tr><td>Düsseldorf (NRW)</td><td>32</td><td>23</td></tr>',
        '<tr><td>Essen (NRW)</td><td>32</td><td>23</td></tr>',

        -- Südwest
        '<tr><td>Frankfurt am Main (Hessen)</td><td>34</td><td>23</td></tr>',
        '<tr><td>Stuttgart (Baden-Württemberg)</td><td>33</td><td>22</td></tr>',
        '<tr><td>Mannheim / Rhein-Neckar</td><td>34</td><td>23</td></tr>',

        -- Süd / Bayern
        '<tr><td>München (Bayern)</td><td>32</td><td>21</td></tr>',
        '<tr><td>Nürnberg (Bayern)</td><td>33</td><td>22</td></tr>',

      '</tbody>',
    '</table>',

    '<p><em>Quelle (Hinweis):</em> Typische Auslegungs-/Klimareferenzwerte in Anlehnung an ',
    'DWD Klimareferenz/TRY (Test Reference Year) sowie gängige HVAC-Praxis (DIN/VDI/ASHRAE). ',
    'Für standortgenaue Auslegung bitte projektspezifische DWD-TRY/Stationsdaten verwenden.</p>'
  ),
  'Deutschland: Sommer-Auslegungswerte Trocken-/Feuchtkugel (Tdb/Twb)',
  'Typische Sommer-Auslegungswerte (Trocken-/Feuchtkugel) für wichtige Bundesländer und Großstädte in Deutschland als Referenz für Kühlturm- und HVAC-Planung.',
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
