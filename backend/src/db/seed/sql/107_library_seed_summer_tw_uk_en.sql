-- =============================================================
-- FILE: src/db/seed/sql/107_library_seed_summer_tw_uk_en.sql
-- Ensotek - Library seed (EN) - Summer Design Values (Dry/Wet Bulb) United Kingdom
--  - Idempotent: EN slug üzerinden base id bul / yoksa deterministik ID kullan
--  - Base row: library (single source)
--  - i18n row: library_i18n (EN)
--  - Uses SAME deterministic base id as TR/DE/others
--  - Requires:
--      @LIB_CATEGORY_ID, @LIB_SUBCATEGORY_PDF
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- -------------------------------------------------------------
-- Deterministic base id (keep fixed; shared across locales)
-- -------------------------------------------------------------
SET @LIB_SUMMER_TW := '88888888-8888-8888-8888-888888888888';

-- -------------------------------------------------------------
-- Resolve existing library_id by EN slug (if exists), else deterministic
-- -------------------------------------------------------------
SET @LIB_SUMMER_TW_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'en'
  WHERE i.slug = 'uk-summer-design-values-dry-wet-bulb'
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
  JSON_ARRAY('design','summer','dry-bulb','wet-bulb','uk','united-kingdom','hvac','cooling-tower'),
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
-- Upsert EN i18n (UK)
-- -------------------------------------------------------------
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_SUMMER_TW_ID, 'en',
  'United Kingdom: Summer Design Dry-/Wet-Bulb Values (Tdb/Twb)',
  'uk-summer-design-values-dry-wet-bulb',
  'Reference table with typical summer design dry-bulb and wet-bulb temperatures (Tdb/Twb) for key UK regions and major cities. Useful as a preliminary reference for cooling tower and HVAC design.',
  CONCAT(
    '<p>This table provides typical <strong>summer design</strong> ',
    '<strong>dry-bulb</strong> and <strong>wet-bulb</strong> temperatures (Tdb/Twb) ',
    'for selected major cities and regions in the United Kingdom. It can be used as ',
    'a preliminary reference in <strong>cooling tower selection</strong>, ',
    '<strong>condenser loop design</strong>, and general <strong>HVAC engineering</strong>.</p>',

    '<p><strong>Note:</strong> Values are indicative design/reference values. ',
    'For project-critical sizing, use site-specific datasets and current reference years ',
    '(e.g., UK Met Office / CIBSE weather data) and align with applicable standards.</p>',

    '<table border="1" cellpadding="4" cellspacing="0">',
      '<thead>',
        '<tr>',
          '<th>Region / City</th>',
          '<th>Dry-bulb (Tdb, °C)</th>',
          '<th>Wet-bulb (Twb, °C)</th>',
        '</tr>',
      '</thead>',
      '<tbody>',

        -- England (South / London)
        '<tr><td>London (Greater London)</td><td>32</td><td>21</td></tr>',
        '<tr><td>Birmingham (West Midlands)</td><td>31</td><td>21</td></tr>',
        '<tr><td>Manchester (Greater Manchester)</td><td>30</td><td>21</td></tr>',
        '<tr><td>Leeds (West Yorkshire)</td><td>30</td><td>20</td></tr>',
        '<tr><td>Bristol (South West)</td><td>30</td><td>20</td></tr>',

        -- England (North / Coastal)
        '<tr><td>Newcastle upon Tyne (North East)</td><td>29</td><td>20</td></tr>',
        '<tr><td>Liverpool (Merseyside)</td><td>29</td><td>20</td></tr>',

        -- Scotland
        '<tr><td>Glasgow (Scotland)</td><td>27</td><td>19</td></tr>',
        '<tr><td>Edinburgh (Scotland)</td><td>27</td><td>19</td></tr>',

        -- Wales
        '<tr><td>Cardiff (Wales)</td><td>29</td><td>20</td></tr>',

        -- Northern Ireland
        '<tr><td>Belfast (Northern Ireland)</td><td>27</td><td>19</td></tr>',

      '</tbody>',
    '</table>',

    '<p><em>Source (note):</em> Typical UK summer design/reference values, ',
    'aligned with common HVAC practice and publicly available climate reference frameworks ',
    '(e.g., UK Met Office / CIBSE weather datasets). For site-accurate design, use the ',
    'relevant city/region weather file and project-specific criteria.</p>'
  ),
  'United Kingdom: Summer Design Dry-/Wet-Bulb Values (Tdb/Twb)',
  'Typical UK summer design dry-bulb and wet-bulb temperatures for major cities/regions, intended as a preliminary reference for cooling tower and HVAC design.',
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
