-- =============================================================
-- FILE: src/db/seed/sql/library/101_005_library__ct_selection.sql
-- Ensotek - Library Item Seed (CT SELECTION / REQUIRED DATA FOR TOWER SELECTION)
-- FINAL / CLEAN / IDEMPOTENT (DETERMINISTIC IDS) / SCHEMA-SAFE (0100_library.sql)
--
-- ✅ NO variables, NO SELECT, NO dynamic/formula
-- ✅ Fixed UUIDs + ON DUPLICATE KEY UPDATE
-- ✅ 3 locales: tr / en / de (FULL CONTENT IN EACH)
-- ✅ Schema uyumlu: library / library_i18n / library_images / library_images_i18n
-- ✅ Images: 3 adet (display_order=10/20/30) + each has TR/EN/DE i18n
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- =============================================================
-- 1) PARENT: library (fixed id)
-- =============================================================
INSERT INTO `library`
(
  `id`,
  `type`,

  `category_id`,
  `sub_category_id`,

  `featured`,
  `is_published`,
  `is_active`,
  `display_order`,

  `featured_image`,
  `image_url`,
  `image_asset_id`,

  `views`,
  `download_count`,
  `published_at`,

  `created_at`,
  `updated_at`
)
VALUES
(
  '55555555-5555-5555-5555-555555555555',
  'other',

  NULL,
  NULL,

  0,
  1,
  1,
  80,

  NULL,
  NULL,
  NULL,

  0,
  0,
  NOW(3),

  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `type`            = VALUES(`type`),

  `category_id`     = VALUES(`category_id`),
  `sub_category_id` = VALUES(`sub_category_id`),

  `featured`        = VALUES(`featured`),
  `is_published`    = VALUES(`is_published`),
  `is_active`       = VALUES(`is_active`),
  `display_order`   = VALUES(`display_order`),

  `featured_image`  = VALUES(`featured_image`),
  `image_url`       = VALUES(`image_url`),
  `image_asset_id`  = VALUES(`image_asset_id`),

  `views`           = VALUES(`views`),
  `download_count`  = VALUES(`download_count`),
  `published_at`    = VALUES(`published_at`),

  `updated_at`      = VALUES(`updated_at`);

-- =============================================================
-- 2) I18N: TR (FULL CONTENT)
-- =============================================================
INSERT INTO `library_i18n`
(
  `id`,
  `library_id`,
  `locale`,

  `slug`,
  `name`,
  `description`,
  `image_alt`,

  `tags`,
  `meta_title`,
  `meta_description`,
  `meta_keywords`,

  `created_at`,
  `updated_at`
)
VALUES
(
  '55555555-5555-4555-8666-111111111111',
  '55555555-5555-5555-5555-555555555555',
  'tr',

  'kule-secimi-icin-gerekli-bilgiler',
  'Kule Seçimi İçin Gerekli Bilgiler',
  CONCAT(
    '<h2>Kule Seçimi İçin Gerekli Bilgiler</h2>',
    '<p>',
      'Su soğutma kuleleri, aksi özel talep olmadığı sürece, <strong>en sıcak yaz günlerine ait meteorolojik tasarım şartlarına</strong> göre seçilir. ',
      'Doğru kule seçimi; kapasite, iklim verisi ve proses tarafı şartlarının birlikte değerlendirilmesini gerektirir. ',
      'Aşağıdaki girdiler ne kadar net verilirse, kule seçimi o kadar doğru ve ekonomik olur.',
    '</p>',

    '<h3>1) Proses Verileri (Zorunlu)</h3>',
    '<p>Bir kule seçimi için aşağıdaki bilgiler mutlaka net olmalıdır:</p>',
    '<ul>',
      '<li><strong>Soğutulacak su miktarı (Debi)</strong>: m³/h (tercihen) veya kapasite (kW, kcal/h)</li>',
      '<li><strong>Kuleye giren su sıcaklığı</strong> (Sıcak su, T<sub>g</sub>, °C)</li>',
      '<li><strong>Kuleden çıkan su sıcaklığı</strong> (Soğuk su, T<sub>ç</sub>, °C)</li>',
      '<li><strong>Çalışma rejimi</strong>: Sürekli mi, vardiyalı mı; yük sabit mi değişken mi?</li>',
    '</ul>',

    '<h3>2) İklim Verileri (Tasarım Şartı)</h3>',
    '<p>',
      'Kule kapasitesi doğrudan iklim verilerine bağlıdır. En kritik parametre <strong>yaş termometre (wet-bulb)</strong> değeridir. ',
      'Tasarım için genellikle lokasyonun en sıcak dönemine ait veriler kullanılır.',
    '</p>',
    '<ul>',
      '<li><strong>Yaş termometre sıcaklığı (°C)</strong> – zorunlu</li>',
      '<li><strong>Kuru termometre sıcaklığı (°C)</strong> – önerilir</li>',
      '<li><strong>Bağıl nem (%)</strong> – önerilir</li>',
      '<li><strong>Rakım / barometrik basınç</strong> – özellikle yüksek rakımda önemlidir</li>',
    '</ul>',

    '<h3>3) Temel Kavramlar: Range ve Approach</h3>',
    '<p>',
      '<strong>Range</strong>, kuleye giren sıcak su ile kuleden çıkan soğuk su arasındaki sıcaklık farkıdır: ',
      '<code>Range = T<sub>g</sub> − T<sub>ç</sub></code>.',
    '</p>',
    '<p>',
      '<strong>Approach</strong>, kuleden çıkan soğuk su sıcaklığı ile yaş termometre arasındaki farktır: ',
      '<code>Approach = T<sub>ç</sub> − T<sub>wb</sub></code>. ',
      'Approach ne kadar düşük istenirse, kule boyutu ve maliyeti genellikle artar.',
    '</p>',

    '<h3>4) Su Kalitesi ve İşletme Koşulları</h3>',
    '<p>',
      'Seçim sadece kapasiteye göre yapılmaz; suyun kirlilik düzeyi, yağ/tortu, kireçlenme potansiyeli ve işletme ortamının tozlu olması gibi etkenler dolgu/nozul seçimlerini belirler.',
    '</p>',
    '<ul>',
      '<li><strong>Proses suyu analizi</strong>: iletkenlik, sertlik, pH, askıda katı madde (TSS)</li>',
      '<li><strong>Kirlenme kaynakları</strong>: yağ, tufal, lif, organik yük, biyolojik oluşum</li>',
      '<li><strong>Kimyasal şartlandırma</strong>: inhibitör, biyosit, pH kontrolü</li>',
      '<li><strong>Blöf (purge/blowdown)</strong> stratejisi</li>',
    '</ul>',

    '<h3>5) Mekanik ve Kurulum Parametreleri</h3>',
    '<ul>',
      '<li><strong>Kurulum yeri</strong>: İç/dış ortam, hava sirkülasyonu, resirkülasyon riski</li>',
      '<li><strong>Alan kısıtı</strong>: uzunluk/genişlik/yükseklik limitleri, servis boşlukları</li>',
      '<li><strong>Gürültü limiti</strong>: yerleşim bölgeleri veya hassas tesisler için</li>',
      '<li><strong>Elektrik</strong>: besleme, frekans invertörü (VFD) ihtiyacı</li>',
      '<li><strong>Donma riski</strong>: kış koşulları, ısıtıcı, antifriz, kontrol senaryosu</li>',
    '</ul>',

    '<h3>6) Örnek Veri Seti (Tek Satır)</h3>',
    '<p>',
      'Örnek: Debi 120 m³/h, T<sub>g</sub>=40°C, T<sub>ç</sub>=30°C, T<sub>wb</sub>=24°C, rakım 200 m, sürekli çalışma, su orta kirlilikte.',
    '</p>',

    '<h3>Özet</h3>',
    '<p>',
      'Doğru kule seçimi için debi ve sıcaklıklar, yaş termometre (tasarım), su kalitesi ve kurulum koşulları birlikte değerlendirilmelidir. ',
      'Bu veriler net olduğunda; açık/kapalı tip, dolgu tipi, fan/pompa seçimi ve kontrol stratejisi doğru belirlenir.',
    '</p>'
  ),
  'Soğutma kulesi seçimi için gerekli veriler – kontrol listesi',
  'kule seçimi, soğutma kulesi seçimi, debi, yaş termometre, range, approach, su kalitesi, blöf',
  'Kule seçimi için gerekli bilgiler',
  'Soğutma kulesi seçimi için gerekli proses girdileri (debi/sıcaklıklar), iklim verileri (yaş termometre), range/approach, su kalitesi ve kurulum parametreleri.',
  'kule seçimi, soğutma kulesi, debi, yaş termometre, range, approach, su kalitesi, blöf',

  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `slug`             = VALUES(`slug`),
  `name`             = VALUES(`name`),
  `description`      = VALUES(`description`),
  `image_alt`        = VALUES(`image_alt`),
  `tags`             = VALUES(`tags`),
  `meta_title`       = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`),
  `meta_keywords`    = VALUES(`meta_keywords`),
  `updated_at`       = VALUES(`updated_at`);

-- =============================================================
-- 3) I18N: EN (FULL CONTENT)  ✅ meta_keywords shortened <= 255
-- =============================================================
INSERT INTO `library_i18n`
(
  `id`,
  `library_id`,
  `locale`,

  `slug`,
  `name`,
  `description`,
  `image_alt`,

  `tags`,
  `meta_title`,
  `meta_description`,
  `meta_keywords`,

  `created_at`,
  `updated_at`
)
VALUES
(
  '55555555-5555-4555-8666-222222222222',
  '55555555-5555-5555-5555-555555555555',
  'en',

  'required-data-for-cooling-tower-selection',
  'Required Data for Cooling Tower Selection',
  CONCAT(
    '<h2>Required Data for Cooling Tower Selection</h2>',
    '<p>',
      'Cooling towers are typically selected for the <strong>hottest design summer conditions</strong> unless stated otherwise. ',
      'Accurate selection requires combining process duty, climate conditions, and site constraints. ',
      'The clearer the inputs, the more reliable and economical the tower sizing will be.',
    '</p>',

    '<h3>1) Process Inputs (Mandatory)</h3>',
    '<ul>',
      '<li><strong>Circulating water flow rate</strong>: m³/h (preferred) or heat duty (kW, kcal/h)</li>',
      '<li><strong>Hot water inlet temperature</strong>: T<sub>in</sub> (°C)</li>',
      '<li><strong>Cold water outlet temperature</strong>: T<sub>out</sub> (°C)</li>',
      '<li><strong>Operating profile</strong>: continuous vs. intermittent; constant vs. variable load</li>',
    '</ul>',

    '<h3>2) Climate Data (Design Condition)</h3>',
    '<p>',
      'Tower capacity is strongly driven by <strong>wet-bulb temperature</strong>, which represents the practical cooling limit for evaporative systems.',
    '</p>',
    '<ul>',
      '<li><strong>Wet-bulb temperature (°C)</strong> – mandatory</li>',
      '<li><strong>Dry-bulb temperature (°C)</strong> – recommended</li>',
      '<li><strong>Relative humidity (%)</strong> – recommended</li>',
      '<li><strong>Altitude / barometric pressure</strong> – important at high elevations</li>',
    '</ul>',

    '<h3>3) Key Concepts: Range and Approach</h3>',
    '<p><strong>Range</strong> is the temperature drop across the tower: <code>Range = T<sub>in</sub> − T<sub>out</sub></code>.</p>',
    '<p><strong>Approach</strong> is the difference between cold water temperature and wet-bulb: <code>Approach = T<sub>out</sub> − T<sub>wb</sub></code>. Lower approach usually means a larger tower and higher cost.</p>',

    '<h3>4) Water Quality and Fouling Factors</h3>',
    '<p>',
      'Selection is not only thermal. Water quality and fouling potential affect fill/nozzle configuration and maintenance needs.',
    '</p>',
    '<ul>',
      '<li><strong>Water analysis</strong>: conductivity, hardness, pH, total suspended solids (TSS)</li>',
      '<li><strong>Contamination sources</strong>: oil, scale, solids, biological growth</li>',
      '<li><strong>Water treatment</strong>: inhibitors, biocides, pH control</li>',
      '<li><strong>Blowdown strategy</strong> to control cycles of concentration</li>',
    '</ul>',

    '<h3>5) Mechanical and Site Constraints</h3>',
    '<ul>',
      '<li><strong>Location and airflow</strong>: risk of recirculation, obstructions, intake/exhaust clearance</li>',
      '<li><strong>Footprint limits</strong>: length/width/height constraints and service access</li>',
      '<li><strong>Noise limit</strong>: sensitive sites may require low-noise options</li>',
      '<li><strong>Electrical</strong>: supply and VFD requirement</li>',
      '<li><strong>Freeze risk</strong>: winter operation plan (heaters, glycol, controls)</li>',
    '</ul>',

    '<h3>Example Input Set</h3>',
    '<p>',
      'Example: Flow 120 m³/h, T<sub>in</sub>=40°C, T<sub>out</sub>=30°C, wet-bulb=24°C, altitude 200 m, continuous operation, moderately fouling water.',
    '</p>',

    '<h3>Summary</h3>',
    '<p>',
      'Provide flow and temperatures, wet-bulb design, water quality, and site constraints together. ',
      'With complete inputs, tower type and configuration (open/closed circuit, fill, fan/pump, controls) can be selected reliably.',
    '</p>'
  ),
  'Cooling tower selection inputs – checklist',
  'cooling tower selection, tower sizing, design inputs, flow rate, wet-bulb, range, approach, water quality, blowdown',
  'Required data for cooling tower selection',
  'Checklist for cooling tower selection: flow and temperatures, wet-bulb design, range/approach, water quality, blowdown strategy, and site constraints.',
  'cooling tower selection, sizing, wet-bulb, flow rate, range, approach, water quality, blowdown',

  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `slug`             = VALUES(`slug`),
  `name`             = VALUES(`name`),
  `description`      = VALUES(`description`),
  `image_alt`        = VALUES(`image_alt`),
  `tags`             = VALUES(`tags`),
  `meta_title`       = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`),
  `meta_keywords`    = VALUES(`meta_keywords`),
  `updated_at`       = VALUES(`updated_at`);

-- =============================================================
-- 4) I18N: DE (FULL CONTENT)  ✅ meta_keywords shortened <= 255
-- =============================================================
INSERT INTO `library_i18n`
(
  `id`,
  `library_id`,
  `locale`,

  `slug`,
  `name`,
  `description`,
  `image_alt`,

  `tags`,
  `meta_title`,
  `meta_description`,
  `meta_keywords`,

  `created_at`,
  `updated_at`
)
VALUES
(
  '55555555-5555-4555-8666-333333333333',
  '55555555-5555-5555-5555-555555555555',
  'de',

  'erforderliche-daten-fuer-kuehlturm-auswahl',
  'Erforderliche Daten für die Kühlturm-Auswahl',
  CONCAT(
    '<h2>Erforderliche Daten für die Kühlturm-Auswahl</h2>',
    '<p>',
      'Kühltürme werden in der Regel für die <strong>wärmsten Auslegungs-Sommerbedingungen</strong> ausgewählt. ',
      'Für eine korrekte Auslegung müssen Prozessleistung, Klimadaten und Standortbedingungen gemeinsam betrachtet werden. ',
      'Je eindeutiger die Eingaben, desto zuverlässiger und wirtschaftlicher ist die Auslegung.',
    '</p>',

    '<h3>1) Prozessdaten (Zwingend)</h3>',
    '<ul>',
      '<li><strong>Umlauf-Volumenstrom</strong>: m³/h (bevorzugt) oder Kühlleistung (kW, kcal/h)</li>',
      '<li><strong>Heißwasser-Eintrittstemperatur</strong>: T<sub>ein</sub> (°C)</li>',
      '<li><strong>Kaltwasser-Austrittstemperatur</strong>: T<sub>aus</sub> (°C)</li>',
      '<li><strong>Betriebsprofil</strong>: kontinuierlich vs. intermittierend; konstante vs. variable Last</li>',
    '</ul>',

    '<h3>2) Klimadaten (Auslegungsbedingung)</h3>',
    '<p>',
      'Die Kühlturmleistung hängt maßgeblich von der <strong>Feuchtkugeltemperatur</strong> ab, da sie die praktische Grenze für Verdunstungskühlung beschreibt.',
    '</p>',
    '<ul>',
      '<li><strong>Feuchtkugeltemperatur (°C)</strong> – zwingend</li>',
      '<li><strong>Trockenkugeltemperatur (°C)</strong> – empfohlen</li>',
      '<li><strong>Relative Luftfeuchte (%)</strong> – empfohlen</li>',
      '<li><strong>Höhenlage / Luftdruck</strong> – wichtig bei großen Höhen</li>',
    '</ul>',

    '<h3>3) Grundbegriffe: Range und Approach</h3>',
    '<p><strong>Range</strong> ist die Temperaturdifferenz über den Kühlturm: <code>Range = T<sub>ein</sub> − T<sub>aus</sub></code>.</p>',
    '<p><strong>Approach</strong> ist die Differenz zwischen Kaltwasser und Feuchtkugel: <code>Approach = T<sub>aus</sub> − T<sub>wb</sub></code>. Ein kleinerer Approach bedeutet in der Regel einen größeren Kühlturm und höhere Kosten.</p>',

    '<h3>4) Wasserqualität und Verschmutzung</h3>',
    '<p>',
      'Neben der Thermik beeinflussen Wasserqualität und Verschmutzungsneigung die Auswahl von Füllkörpern/Düsen und den Wartungsaufwand.',
    '</p>',
    '<ul>',
      '<li><strong>Wasseranalyse</strong>: Leitfähigkeit, Härte, pH, Schwebstoffe (TSS)</li>',
      '<li><strong>Verschmutzungsquellen</strong>: Öl, Kalk, Feststoffe, Biofilm</li>',
      '<li><strong>Wasseraufbereitung</strong>: Inhibitoren, Biozide, pH-Regelung</li>',
      '<li><strong>Abschlämmung (Blowdown)</strong> zur Begrenzung der Eindickung</li>',
    '</ul>',

    '<h3>5) Mechanik und Standortbedingungen</h3>',
    '<ul>',
      '<li><strong>Aufstellort und Luftführung</strong>: Rezirkulation, Hindernisse, Ein-/Ausblasabstände</li>',
      '<li><strong>Platzbedarf</strong>: Grundfläche, Höhe, Servicezugänge</li>',
      '<li><strong>Geräuschgrenzen</strong>: ggf. leise Ausführungen erforderlich</li>',
      '<li><strong>Elektrik</strong>: Versorgung, ggf. Frequenzumrichter (VFD)</li>',
      '<li><strong>Frostgefahr</strong>: Winterbetrieb (Heizung, Glykol, Regelung)</li>',
    '</ul>',

    '<h3>Beispiel-Datensatz</h3>',
    '<p>',
      'Beispiel: Volumenstrom 120 m³/h, T<sub>ein</sub>=40°C, T<sub>aus</sub>=30°C, Feuchtkugel=24°C, Höhe 200 m, Dauerbetrieb, mäßig verschmutztes Wasser.',
    '</p>',

    '<h3>Zusammenfassung</h3>',
    '<p>',
      'Volumenstrom und Temperaturen, Feuchtkugel-Auslegung, Wasserqualität sowie Standortbedingungen müssen gemeinsam angegeben werden. ',
      'Damit lassen sich Kühlturmtyp und Konfiguration (offen/geschlossen, Füllkörper, Ventilator/Pumpe, Regelung) sicher auswählen.',
    '</p>'
  ),
  'Checkliste für Kühlturm-Auslegung – Eingabedaten',
  'kuehlturm auswahl, auslegung, volumenstrom, feuchtkugel, range, approach, wasserqualitaet, abschlaemmung',
  'Erforderliche Daten für die Kühlturm-Auswahl',
  'Checkliste für die Kühlturm-Auslegung: Volumenstrom/Temperaturen, Feuchtkugel, Range/Approach, Wasserqualität, Abschlämmung und Standortbedingungen.',
  'kuehlturm auswahl, auslegung, feuchtkugel, volumenstrom, range, approach, wasserqualitaet, blowdown',

  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `slug`             = VALUES(`slug`),
  `name`             = VALUES(`name`),
  `description`      = VALUES(`description`),
  `image_alt`        = VALUES(`image_alt`),
  `tags`             = VALUES(`tags`),
  `meta_title`       = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`),
  `meta_keywords`    = VALUES(`meta_keywords`),
  `updated_at`       = VALUES(`updated_at`);

-- =============================================================
-- 5) IMAGES: library_images (3 ADET)
-- =============================================================

-- IMAGE #1 (display_order=10)
INSERT INTO `library_images`
(
  `id`,
  `library_id`,
  `image_asset_id`,
  `image_url`,
  `display_order`,
  `is_active`,
  `created_at`,
  `updated_at`
)
VALUES
(
  '55555555-6666-4777-8888-aaaaaaaaaaaa',
  '55555555-5555-5555-5555-555555555555',
  NULL,
  'https://www.ensotek.de/uploads/library/su-sogutma-kulesi-ozellikleri-1.jpg',
  10,
  1,
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `image_asset_id` = VALUES(`image_asset_id`),
  `image_url`      = VALUES(`image_url`),
  `display_order`  = VALUES(`display_order`),
  `is_active`      = VALUES(`is_active`),
  `updated_at`     = VALUES(`updated_at`);

-- IMAGE #2 (display_order=20)
INSERT INTO `library_images`
(
  `id`,
  `library_id`,
  `image_asset_id`,
  `image_url`,
  `display_order`,
  `is_active`,
  `created_at`,
  `updated_at`
)
VALUES
(
  '55555555-6666-4777-8888-bbbbbbbbbbbb',
  '55555555-5555-5555-5555-555555555555',
  NULL,
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752786288/uploads/metahub/about-images/closed-circuit-water-cooling-towers1-1752786287184-840184158.webp',
  20,
  1,
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `image_asset_id` = VALUES(`image_asset_id`),
  `image_url`      = VALUES(`image_url`),
  `display_order`  = VALUES(`display_order`),
  `is_active`      = VALUES(`is_active`),
  `updated_at`     = VALUES(`updated_at`);

-- IMAGE #3 (display_order=30)
INSERT INTO `library_images`
(
  `id`,
  `library_id`,
  `image_asset_id`,
  `image_url`,
  `display_order`,
  `is_active`,
  `created_at`,
  `updated_at`
)
VALUES
(
  '55555555-6666-4777-8888-cccccccccccc',
  '55555555-5555-5555-5555-555555555555',
  NULL,
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752786288/uploads/metahub/about-images/closed-circuit-water-cooling-towers1-1752786287184-840184158.webp',
  30,
  1,
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `image_asset_id` = VALUES(`image_asset_id`),
  `image_url`      = VALUES(`image_url`),
  `display_order`  = VALUES(`display_order`),
  `is_active`      = VALUES(`is_active`),
  `updated_at`     = VALUES(`updated_at`);

-- =============================================================
-- 6) IMAGE I18N (TR/EN/DE) for each image
-- =============================================================

-- -------------------------
-- IMAGE #1 I18N
-- -------------------------
INSERT INTO `library_images_i18n`
(
  `id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`
)
VALUES
(
  '55555555-7777-4888-9999-111111111111',
  '55555555-6666-4777-8888-aaaaaaaaaaaa',
  'tr',
  'Kule seçimi için gerekli bilgiler',
  'Soğutma kulesi seçimi için gerekli veriler kontrol listesi',
  'Debi, sıcaklıklar, yaş termometre, su kalitesi ve kurulum parametreleri',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),`alt`=VALUES(`alt`),`caption`=VALUES(`caption`),`updated_at`=VALUES(`updated_at`);

INSERT INTO `library_images_i18n`
(
  `id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`
)
VALUES
(
  '55555555-7777-4888-9999-222222222222',
  '55555555-6666-4777-8888-aaaaaaaaaaaa',
  'en',
  'Required data for cooling tower selection',
  'Cooling tower selection checklist and required inputs',
  'Flow and temperatures, wet-bulb design, water quality, blowdown and site constraints',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),`alt`=VALUES(`alt`),`caption`=VALUES(`caption`),`updated_at`=VALUES(`updated_at`);

INSERT INTO `library_images_i18n`
(
  `id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`
)
VALUES
(
  '55555555-7777-4888-9999-333333333333',
  '55555555-6666-4777-8888-aaaaaaaaaaaa',
  'de',
  'Erforderliche Daten für die Kühlturm-Auswahl',
  'Checkliste für die Kühlturm-Auswahl: erforderliche Eingabedaten',
  'Volumenstrom/Temperaturen, Feuchtkugel-Auslegung, Wasserqualität, Abschlämmung und Standortbedingungen',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),`alt`=VALUES(`alt`),`caption`=VALUES(`caption`),`updated_at`=VALUES(`updated_at`);

-- -------------------------
-- IMAGE #2 I18N
-- -------------------------
INSERT INTO `library_images_i18n`
(
  `id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`
)
VALUES
(
  '55555555-7777-4888-9999-444444444444',
  '55555555-6666-4777-8888-bbbbbbbbbbbb',
  'tr',
  'Tasarım verileri ve yaklaşım (approach)',
  'Kule seçimi için tasarım verileri: yaş termometre, range ve approach',
  'Yaş termometre ve yaklaşım hedefi, kule boyutu ve maliyetini doğrudan etkiler',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),`alt`=VALUES(`alt`),`caption`=VALUES(`caption`),`updated_at`=VALUES(`updated_at`);

INSERT INTO `library_images_i18n`
(
  `id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`
)
VALUES
(
  '55555555-7777-4888-9999-555555555555',
  '55555555-6666-4777-8888-bbbbbbbbbbbb',
  'en',
  'Design data and approach target',
  'Selection design inputs: wet-bulb, range and approach',
  'Wet-bulb and approach targets directly affect tower size and cost',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),`alt`=VALUES(`alt`),`caption`=VALUES(`caption`),`updated_at`=VALUES(`updated_at`);

INSERT INTO `library_images_i18n`
(
  `id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`
)
VALUES
(
  '55555555-7777-4888-9999-666666666666',
  '55555555-6666-4777-8888-bbbbbbbbbbbb',
  'de',
  'Auslegungsdaten und Approach-Ziel',
  'Auswahl-Eingaben: Feuchtkugel, Range und Approach',
  'Feuchtkugel und Approach-Ziel beeinflussen Kühlturmgröße und Kosten direkt',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),`alt`=VALUES(`alt`),`caption`=VALUES(`caption`),`updated_at`=VALUES(`updated_at`);

-- -------------------------
-- IMAGE #3 I18N
-- -------------------------
INSERT INTO `library_images_i18n`
(
  `id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`
)
VALUES
(
  '55555555-7777-4888-9999-777777777777',
  '55555555-6666-4777-8888-cccccccccccc',
  'tr',
  'Su kalitesi ve işletme parametreleri',
  'Kule seçimi için su kalitesi, blöf ve kirlenme faktörleri',
  'Su analizi ve blöf stratejisi; dolgu/nozul seçimi ve bakım ihtiyacını belirler',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),`alt`=VALUES(`alt`),`caption`=VALUES(`caption`),`updated_at`=VALUES(`updated_at`);

INSERT INTO `library_images_i18n`
(
  `id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`
)
VALUES
(
  '55555555-7777-4888-9999-888888888888',
  '55555555-6666-4777-8888-cccccccccccc',
  'en',
  'Water quality and operating factors',
  'Water quality, blowdown and fouling factors for tower selection',
  'Water analysis and blowdown strategy drive fill/nozzle choice and maintenance needs',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),`alt`=VALUES(`alt`),`caption`=VALUES(`caption`),`updated_at`=VALUES(`updated_at`);

INSERT INTO `library_images_i18n`
(
  `id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`
)
VALUES
(
  '55555555-7777-4888-9999-999999999999',
  '55555555-6666-4777-8888-cccccccccccc',
  'de',
  'Wasserqualität und Betriebsparameter',
  'Wasserqualität, Abschlämmung und Verschmutzungsfaktoren für die Auswahl',
  'Wasseranalyse und Blowdown-Strategie bestimmen Füllkörper/Düsen und den Wartungsaufwand',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),`alt`=VALUES(`alt`),`caption`=VALUES(`caption`),`updated_at`=VALUES(`updated_at`);

COMMIT;
