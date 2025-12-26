-- =============================================================
-- FILE: src/db/seed/sql/102_library_seed_en.sql
-- Ensotek - Library seed (EN) - base + i18n + images + files
--   - EN içerikler: önceki EN metinleri KISALTMADAN
--   - Idempotent: EN slug üzerinden id bul / yoksa deterministik ID kullan
--   - NOTE:
--       * 101(TR) ile aynı base id set'leri kullanılır (single base row, multi-locale i18n)
--       * Bu dosya EN için library + library_i18n + (opsiyonel) images/files + file_i18n ekler
--       * storage_assets varsa asset_id kullan; yoksa image_url/file_url ile de çalışır.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- -------------------------------------------------------------
-- Deterministic base ids (101 ile aynı)
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

-- -------------------------------------------------------------
-- Optional: Assets (kullanıyorsan). Yoksa NULL bırak.
-- -------------------------------------------------------------
-- SET @ASSET_IMG_CT        := 'aaaaaaaa-0000-0000-0000-aaaaaaaa0001';
-- SET @ASSET_FILE_BROCHURE := 'bbbbbbbb-0000-0000-0000-bbbbbbbb0001';
-- SET @ASSET_FILE_GUIDE    := 'cccccccc-0000-0000-0000-cccccccc0001';

-- =============================================================
-- 1) Cooling Tower Basics (EN)
-- =============================================================

SET @LIB_CT_BASICS_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'en'
  WHERE i.slug = 'what-is-a-water-cooling-tower-types-and-working-principle'
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
  UUID(), @LIB_CT_BASICS_ID, 'en',
  'What Is a Water Cooling Tower? Types and Working Principle',
  'what-is-a-water-cooling-tower-types-and-working-principle',
  'A technical overview of what a water cooling tower is, its main types, working principle, and an engineering rule-of-thumb to estimate evaporation loss.',
  CONCAT(
    '<h2>What Is a Water Cooling Tower? What Is It Used For?</h2>',
    '<p>',
      'A water cooling tower is a <strong>heat rejection unit</strong> that cools down warm process water by ',
      'evaporating a small portion of it and releasing heat to the atmosphere. The remaining cooled water is ',
      'collected in the basin and recirculated back to the facility. Cooling towers are widely used across ',
      'industrial plants and HVAC systems to provide cooled water.',
    '</p>',

    '<h2>Cooling Tower Types</h2>',
    '<p>Cooling towers can be classified under two main categories:</p>',
    '<ol>',
      '<li>Types by airflow / water flow arrangement</li>',
      '<li>Types by cooling method</li>',
    '</ol>',

    '<h3>A. Types by Air/Water Flow Arrangement</h3>',
    '<ul>',
      '<li>Counterflow towers</li>',
      '<li>Crossflow towers</li>',
    '</ul>',

    '<h4>1. Counterflow Towers</h4>',
    '<p>',
      'In counterflow cooling towers, water flows downward through the fill while air moves upward. ',
      'This is one of the most commonly preferred tower configurations in industrial applications today.',
    '</p>',
    '<p>Two typical fan arrangements are used:</p>',
    '<ul>',
      '<li>',
        '<strong>Induced draft towers</strong>: The fan is located at the top. Air enters through the louvers and ',
        'is pulled upward by the top-mounted fan to achieve cooling.',
      '</li>',
      '<li>',
        '<strong>Forced draft towers</strong>: The fan is mounted on the side. Air is pushed through the tower, ',
        'typically from the bottom upward, to provide cooling.',
      '</li>',
    '</ul>',

    '<h4>2. Crossflow Towers</h4>',
    '<p>',
      'In crossflow towers, water flows downward while air moves horizontally or diagonally across the fill. ',
      'Both induced and forced draft implementations exist in this category as well.',
    '</p>',

    '<h3>B. Types by Cooling Method</h3>',

    '<h4>1. Open Circuit (Open Type) Cooling Towers</h4>',
    '<p>',
      'In open circuit towers, process water is distributed over the fill and is cooled by direct contact with air. ',
      'Heat transfer is efficient due to direct contact; however, water is more prone to contamination and fouling.',
    '</p>',
    '<p><em>The open circuit working principle can also be illustrated separately with diagrams and example processes.</em></p>',

    '<h4>2. Closed Circuit (Closed Type) Cooling Towers</h4>',
    '<p>',
      'In closed circuit towers, the process fluid circulates inside a coil (heat exchanger). The coil is cooled indirectly ',
      'by ambient air and a recirculating spray water loop. The process fluid does not directly contact air, preserving water quality. ',
      'Due to indirect heat transfer, efficiency can be lower than open circuit towers.',
    '</p>',
    '<p><em>The closed circuit working principle can similarly be explained with schematic visuals in a separate document.</em></p>',

    '<h2>Where Are Cooling Towers Used?</h2>',
    '<p>Cooling towers can be used in almost any sector where warm water must be cooled. Examples include:</p>',
    '<ul>',
      '<li>Food production plants (dairy, chocolate, biscuits, sugar, tomato paste, etc.)</li>',
      '<li>Chemical and paint facilities</li>',
      '<li>Cement plants</li>',
      '<li>Foundries, rolling mills, steel plants</li>',
      '<li>Aluminum and iron/steel facilities</li>',
      '<li>Wire drawing and cable plants</li>',
      '<li>Plastics, packaging, paper production</li>',
      '<li>Automotive and suppliers</li>',
      '<li>HVAC systems (malls, residences, hotels, hospitals)</li>',
      '<li>Water-cooled chiller systems</li>',
      '<li>Heat pump systems</li>',
      '<li>Textile factories</li>',
      '<li>Power generation (biomass, waste-to-energy, hydro, thermal plants)</li>',
    '</ul>',

    '<h2>How Do Cooling Towers Work?</h2>',
    '<p>',
      'For a typical induced-draft counterflow cooling tower, the operating steps can be summarized as follows:',
    '</p>',
    '<ul>',
      '<li>Warm water from the process is distributed uniformly over the tower cross-section via nozzles.</li>',
      '<li>Water passes through fill media, breaking into droplets/films and increasing heat transfer surface area.</li>',
      '<li>Ambient air is drawn upward through the fill by the fan assembly.</li>',
      '<li>Water transfers heat to air and a small portion evaporates.</li>',
      '<li>Cooled water is collected in the basin and recirculated back to the facility.</li>',
      '<li>Warm, humid air exits to the atmosphere through the fan stack.</li>',
    '</ul>',

    '<h2>Evaporation Loss and a Practical Estimate</h2>',
    '<p>',
      'As a practical engineering approximation, for every <strong>6&nbsp;°C</strong> (≈10&nbsp;°F) drop in circulating water temperature, ',
      'the expected evaporation can be around <strong>0.9%</strong> of the recirculation flow rate. This is commonly referred to as ',
      '<strong>cooling tower evaporation loss</strong>.',
    '</p>',
    '<p>A commonly used rule-of-thumb form is:</p>',
    '<p><code>Evaporation (m³/h) ≈ 0.00085 × 1.8 × Flow (m³/h) × (T_in − T_out)</code></p>',
    '<p><em>A downloadable PDF version of this topic can also be added as a separate library file.</em></p>'
  ),
  'What is a water cooling tower? Types and working principle',
  'Technical overview of cooling tower basics: definition, types, operating principle, use cases, and evaporation-loss estimation.',
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
-- 2) Ensotek Cooling Towers - Features (EN)
-- =============================================================

SET @LIB_CT_FEATURES_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'en'
  WHERE i.slug = 'features-of-ensotek-cooling-towers'
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
  UUID(), @LIB_CT_FEATURES_ID, 'en',
  'Features of Ensotek Cooling Towers',
  'features-of-ensotek-cooling-towers',
  'A technical overview of Ensotek cooling towers: FRP construction, fill options, energy efficiency, durability, and operational advantages.',
  CONCAT(
    '<h2>Features of Ensotek Cooling Towers</h2>',
    '<ol>',
      '<li><strong>FRP body construction:</strong> Ensotek towers are manufactured from fiberglass reinforced polyester (FRP), ',
      'which eliminates the need for painting and provides long-term corrosion resistance.</li>',
      '<li><strong>Chemical and corrosion resistance:</strong> FRP structure offers high durability against chemicals and corrosion, ',
      'unlike metal towers that may rust within a few years.</li>',
      '<li><strong>Flame-retardant resin option:</strong> For sensitive facilities (hotels, hospitals, malls, residences), ',
      'a flame-retardant FRP resin option can improve fire safety.</li>',
    '</ol>',

    '<h3>Fill Options</h3>',
    '<p>Ensotek cooling towers can be equipped with three primary fill types depending on water quality and operating conditions:</p>',
    '<ol start="4">',
      '<li><strong>PVC film fill:</strong> For clean water and relatively clean environments; provides high wet surface area and strong cooling performance.</li>',
      '<li><strong>PP splash (spool) fill:</strong> For oily/dirty water and dusty environments; resistant up to 100&nbsp;°C, easy to clean, low clogging risk.</li>',
      '<li><strong>PP grid (splash) fill:</strong> For heavily contaminated process water; commonly used in demanding industrial processes.</li>',
    '</ol>',

    '<ol start="7">',
      '<li><strong>Material compatibility and long life:</strong> No metal/wood structural parts inside; durability supported by imported Coremat layers, enabling 30–40 years of service life in suitable conditions.</li>',
      '<li><strong>Low maintenance cost:</strong> FRP body and correct fill selection significantly reduce periodic maintenance compared to metal towers.</li>',
    '</ol>',

    '<h3>Fan Configuration and Energy Efficiency</h3>',
    '<ol start="9">',
      '<li><strong>Top-fan, induced-draft, counterflow design:</strong> Top-mounted fans typically require less energy than bottom-push arrangements; high exit velocity reduces recirculation risk.</li>',
      '<li><strong>Energy savings vs. forced-draft configurations:</strong> Induced-draft designs can offer approximately <strong>1.5–2×</strong> energy advantage under comparable conditions.</li>',
    '</ol>',

    '<h3>Performance and Operational Benefits</h3>',
    '<ol start="11">',
      '<li><strong>High cooling performance:</strong> Better approach to wet-bulb temperature supports process efficiency and energy savings.</li>',
      '<li><strong>Return on investment:</strong> While initial FRP investment can be higher, lower maintenance and operating costs can improve total cost of ownership.</li>',
      '<li><strong>Availability of spare parts:</strong> Fans, fills, nozzles, and components are typically accessible and economical, supporting operational continuity.</li>',
    '</ol>'
  ),
  'Features of Ensotek cooling towers',
  'Ensotek cooling towers: FRP construction, fill options, energy efficiency, durability and operational advantages.',
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
-- 3) Open Circuit Cooling Tower - Working Principle (EN)
-- =============================================================

SET @LIB_CT_OPEN_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'en'
  WHERE i.slug = 'open-circuit-cooling-tower-working-principle'
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
  UUID(), @LIB_CT_OPEN_ID, 'en',
  'Open Circuit Cooling Tower Working Principle',
  'open-circuit-cooling-tower-working-principle',
  'An overview of how open circuit cooling towers work, operating steps in induced-draft counterflow towers, and an evaporation-loss estimation approach.',
  CONCAT(
    '<h2>Open Circuit Cooling Tower Working Principle</h2>',
    '<h3>How Does a Cooling Tower Work?</h3>',
    '<p>',
      'Cooling towers are commonly categorized by flow arrangement as <strong>counterflow</strong> or <strong>crossflow</strong>. ',
      'In counterflow towers, water moves downward while air rises upward; in crossflow towers, air moves horizontally across the falling water. ',
      'Counterflow towers are often preferred due to efficiency and compact design.',
    '</p>',

    '<p>',
      'In an <strong>induced-draft counterflow</strong> open circuit tower, warm water is distributed uniformly from the top via nozzles. ',
      'As the water passes through fill media, it breaks into droplets/films, increasing heat transfer surface area.',
    '</p>',

    '<p>',
      'Ambient air is drawn upward through the fill by the fan assembly. Water transfers heat to air and a small portion evaporates. ',
      'Cooled water is collected in the basin and pumped back to the process. Humid exhaust air is released to the atmosphere.',
    '</p>',

    '<h3>Heat Rejection Mechanisms</h3>',
    '<p>Open circuit towers cool water through two combined mechanisms:</p>',
    '<ul>',
      '<li><strong>Sensible heat transfer</strong>: Heat transfer due to temperature difference between water and air.</li>',
      '<li><strong>Latent heat via evaporation</strong>: A fraction of water evaporates and removes additional heat (dominant effect).</li>',
    '</ul>',

    '<h3>Evaporation Loss (Rule of Thumb)</h3>',
    '<p>',
      'A widely used engineering approximation is that a <strong>6&nbsp;°C</strong> reduction in circulating water temperature ',
      'corresponds to roughly <strong>0.9%</strong> evaporation of the recirculation flow rate.',
    '</p>',
    '<p><code>Evaporation (m³/h) ≈ 0.00085 × 1.8 × Flow (m³/h) × (T_in − T_out)</code></p>',

    '<h3>Summary</h3>',
    '<p>',
      'In open circuit towers, warm water contacts air directly and is cooled primarily by evaporation. ',
      'Proper fill selection increases heat transfer area, and evaporation loss can be estimated for preliminary sizing. ',
      'Additional losses such as drift and blowdown should be managed through correct design and operational strategy.',
    '</p>'
  ),
  'Open circuit cooling tower working principle',
  'Open circuit cooling towers: operating steps, heat rejection mechanisms, and evaporation loss estimation.',
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
-- 4) Closed Circuit Cooling Tower - Working Principle (EN)
-- =============================================================

SET @LIB_CT_CLOSED_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'en'
  WHERE i.slug = 'closed-circuit-cooling-tower-working-principle'
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
  UUID(), @LIB_CT_CLOSED_ID, 'en',
  'Closed Circuit Cooling Tower Working Principle',
  'closed-circuit-cooling-tower-working-principle',
  'An overview of closed circuit cooling towers: coil-based indirect cooling, evaporation in the spray loop, free cooling mode, freeze protection, and energy consumption.',
  CONCAT(
    '<h2>Closed Circuit Cooling Tower Working Principle</h2>',
    '<h3>How Do Closed Circuit Towers Work?</h3>',
    '<p>',
      'Closed circuit cooling towers are preferred where process fluid quality must be protected. The process fluid circulates inside a coil (heat exchanger) and is cooled indirectly by ambient air and a recirculating spray-water loop.',
    '</p>',

    '<p>',
      'Warm process fluid flows through the coil, while the fan draws ambient air across the coil surface. At the same time, spray water is distributed over the coil, enhancing heat transfer. The process fluid is cooled without direct contact with air.',
    '</p>',

    '<h3>Is There Evaporation Loss in Closed Circuit Towers?</h3>',
    '<p>',
      'While the process fluid is in a closed loop, the <strong>spray water loop</strong> is exposed to air; therefore, evaporation loss occurs on the spray-water side, depending on load and climatic conditions.',
    '</p>',

    '<h3>Free Cooling (Dry Operation)</h3>',
    '<p>',
      'In cold seasons, spray water can be turned off and the unit can operate as a <strong>dry cooler</strong> (often called <strong>free cooling</strong>). Water consumption and chemical usage are significantly reduced in this mode.',
    '</p>',

    '<h3>How to Prevent Coil Freezing?</h3>',
    '<p>',
      'During shutdown periods in winter (holidays, weekends, maintenance), there is a risk of freezing inside the coil. Mitigation methods include:',
    '</p>',
    '<ul>',
      '<li><strong>Draining the coil</strong> using drain valves for extended shutdowns,</li>',
      '<li><strong>Low-flow circulation</strong> to keep fluid moving,</li>',
      '<li><strong>Antifreeze (e.g., glycol)</strong> to lower freezing point.</li>',
    '</ul>',

    '<h3>Energy Consumption</h3>',
    '<p>',
      'Electrical consumption is mainly due to fan motor and spray-water pump. Optimized fan/pump selection reduces operating cost.',
    '</p>',
    '<p>',
      'Under suitable conditions, closed circuit towers can operate with significantly lower power consumption than mechanical chillers, offering strong energy-saving potential.',
    '</p>'
  ),
  'Closed circuit cooling tower working principle',
  'Closed circuit cooling towers: coil-based cooling, spray-loop evaporation, free cooling, freeze protection and energy considerations.',
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
-- 5) Information Required for Cooling Tower Selection (EN)
-- =============================================================

SET @LIB_CT_SELECTION_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'en'
  WHERE i.slug = 'information-required-for-cooling-tower-selection'
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
  UUID(), @LIB_CT_SELECTION_ID, 'en',
  'Information Required for Cooling Tower Selection',
  'information-required-for-cooling-tower-selection',
  'A concise checklist of capacity and climatic design parameters required for proper cooling tower sizing and selection.',
  CONCAT(
    '<h2>Information Required for Cooling Tower Selection</h2>',
    '<p>',
      'Unless specified otherwise, cooling towers are selected based on the <strong>hottest summer design conditions</strong>. ',
      'Accurate selection requires evaluating capacity, climatic data, and process requirements together.',
    '</p>',

    '<h3>Core Inputs (Required)</h3>',
    '<ul>',
      '<li><strong>Circulation flow rate</strong> (m³/h) or heat load (kW, kcal/h)</li>',
      '<li><strong>Hot water inlet temperature</strong> (°C)</li>',
      '<li><strong>Cold water outlet temperature</strong> (°C)</li>',
      '<li><strong>Design wet-bulb temperature</strong> (°C)</li>',
    '</ul>',

    '<h3>Additional Inputs (Improve Design)</h3>',
    '<ul>',
      '<li><strong>Application type</strong> (process industry, HVAC, etc.)</li>',
      '<li><strong>Water quality</strong> (oil, scale tendency, solids, fouling level)</li>',
      '<li><strong>Design dry-bulb temperature</strong> (°C)</li>',
      '<li><strong>Site altitude</strong> (m)</li>',
    '</ul>',

    '<h3>Common Mistakes</h3>',
    '<ul>',
      '<li><strong>Do not request towers using only a single capacity value.</strong> Provide flow rate and temperatures.</li>',
      '<li><strong>The key criterion</strong> is the approach to wet-bulb temperature (how close the outlet water gets to wet-bulb).</li>',
    '</ul>'
  ),
  'Information required for cooling tower selection',
  'Required inputs for proper cooling tower selection: flow, temperatures, wet-bulb, and design considerations.',
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
-- 6) Parent library entries for PDF items (EN) + file i18n (EN)
--    NOTE: If you seed assets/files elsewhere, you can skip file_url/asset_id here.
-- =============================================================

SET @LIB_BROCHURE_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'en'
  WHERE i.slug = 'ensotek-corporate-brochure'
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
  UUID(), @LIB_BROCHURE_ID, 'en',
  'Corporate Brochure (PDF)',
  'ensotek-corporate-brochure',
  'Ensotek corporate brochure PDF file.',
  CONCAT('<h2>Corporate Brochure (PDF)</h2>','<p>Ensotek corporate brochure PDF file.</p>'),
  'Corporate Brochure (PDF)',
  'Ensotek corporate brochure PDF file.',
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
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'en'
  WHERE i.slug = 'ensotek-service-guide'
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
  UUID(), @LIB_SERVICE_GUIDE_ID, 'en',
  'Service Guide (PDF)',
  'ensotek-service-guide',
  'Ensotek service guide PDF file.',
  CONCAT('<h2>Service Guide (PDF)</h2>','<p>Ensotek service guide PDF file.</p>'),
  'Service Guide (PDF)',
  'Ensotek service guide PDF file.',
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
-- EN file i18n (does NOT duplicate library_files rows)
-- Requires UNIQUE key on (file_id, locale) OR equivalent
-- -------------------------------------------------------------
INSERT INTO library_files_i18n (id, file_id, locale, title, description, created_at, updated_at)
VALUES
  (UUID(), @FILE_BROCHURE, 'en', 'Corporate Brochure (PDF)', 'Ensotek corporate brochure PDF file.', NOW(3), NOW(3)),
  (UUID(), @FILE_GUIDE,    'en', 'Service Guide (PDF)', 'Ensotek service guide PDF file.', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  title       = VALUES(title),
  description = VALUES(description),
  updated_at  = VALUES(updated_at);

COMMIT;
