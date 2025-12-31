-- =============================================================
-- FILE: src/db/seed/sql/library/101_001_library__ct_basics.sql
-- Ensotek - Library Item Seed (CT BASICS)
-- FINAL / CLEAN / IDEMPOTENT (DETERMINISTIC IDS) / SCHEMA-SAFE
--
-- ✅ NO variables, NO SELECT, NO dynamic/formula
-- ✅ Fixed UUIDs + ON DUPLICATE KEY UPDATE
-- ✅ 3 locales: tr / en / de (FULL CONTENT IN EACH)
-- ✅ Schema uyumlu: library / library_i18n / library_images / library_images_i18n
-- ✅ Çoklu görsel: library_images içinde 3 kayıt (+ her biri için i18n)
--
-- Fix:
--  - library_i18n VALUES count fixed (image_alt eklendi)
--  - tags + meta_keywords <= 255 (STRICT mode safe)
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
  '11111111-1111-1111-1111-111111111111',
  'other',

  'aaaa6001-1111-4111-8111-aaaaaaaa6001',
  'bbbb6001-1111-4111-8111-bbbbbbbb6001',

  0,
  1,
  1,
  40,

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
  '11111111-1111-4111-8111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'tr',

  'su-sogutma-kulesi-nedir-cesitleri-nelerdir-nasil-calisir',
  'Su Soğutma Kulesi Temelleri: Tipler, Çalışma Prensibi, Kayıplar ve Tasarım Parametreleri',
  CONCAT(
    '<h2>Su Soğutma Kulesi Nedir?</h2>',
    '<p>Su soğutma kulesi; proses veya HVAC sisteminden ısınarak dönen suyun ısısını atmosfere atan bir <strong>ısı uzaklaştırma</strong> ekipmanıdır. Temel mekanizma, su ile havanın temas etmesi ve suyun küçük bir kısmının buharlaşarak ısıyı taşımasıdır. Soğuyan su, soğuk su havuzunda toplanır ve tekrar sisteme pompalanır.</p>',

    '<h2>Temel Çalışma Prensibi</h2>',
    '<ol>',
      '<li><strong>Dağıtım:</strong> Sıcak su, dağıtım boruları/nozullar ile dolgu üzerine homojen yayılır.</li>',
      '<li><strong>Temas Yüzeyi:</strong> Dolgu üzerinde film/damlacık oluşur; yüzey alanını artırır.</li>',
      '<li><strong>Hava Akışı:</strong> Fan (veya doğal çekiş) ile hava kule içine alınır.</li>',
      '<li><strong>Isı Transferi:</strong> Duyulur ısı transferi + <em>kısmi buharlaşma</em> suyu soğutur.</li>',
      '<li><strong>Toplama:</strong> Soğuyan su havuzda toplanır ve prosese geri gönderilir.</li>',
    '</ol>',

    '<h2>Sınıflandırma: Karşı Akış / Çapraz Akış</h2>',
    '<p><strong>Karşı akışlı</strong> kulelerde su aşağı inerken hava yukarı çıkar; genelde yüksek performans sağlar. <strong>Çapraz akışlı</strong> kulelerde hava suya göre yatay/çapraz yönde ilerler.</p>',

    '<h2>Açık Devre / Kapalı Devre</h2>',
    '<p><strong>Açık devre</strong> kulelerde proses suyu hava ile doğrudan temas eder. <strong>Kapalı devre</strong> kulelerde proses suyu serpantin içinde dolaşır; dıştaki püskürtme suyu ve hava ile ısı atılır.</p>',

    '<h2>Kritik Parametreler</h2>',
    '<ul>',
      '<li><strong>Range:</strong> giriş (sıcak) ve çıkış (soğuk) su sıcaklık farkı.</li>',
      '<li><strong>Approach:</strong> çıkış suyu ile <em>yaş termometre</em> sıcaklığı farkı.</li>',
      '<li><strong>Wet-bulb:</strong> evaporatif kulelerde erişilebilir minimuma yakın sınır.</li>',
    '</ul>',

    '<h2>Su Kayıpları</h2>',
    '<ul>',
      '<li><strong>Buharlaşma:</strong> ısı atımının doğal sonucu.</li>',
      '<li><strong>Sürüklenme (Drift):</strong> egzoz havası ile taşınan damlacıklar; drift eliminator ile azaltılır.</li>',
      '<li><strong>Blöf (Blowdown):</strong> TDS birikimini sınırlamak için kontrollü tahliye.</li>',
    '</ul>',

    '<h2>İşletme ve Bakım</h2>',
    '<ul>',
      '<li>Su şartlandırma (korozyon/kireç/biyolojik kontrol) süreklilik için kritiktir.</li>',
      '<li>Nozul/dolgu/drift eliminator/fan-motor grubu periyodik kontrol edilmelidir.</li>',
    '</ul>'
  ),
  'Su soğutma kulesi teknik içerik görseli', -- image_alt (FIX: eklendi, NULL da olabilir)
  'su sogutma kulesi, acik devre, kapali devre, karsi akis, capraz akis, buharlasma, drift, blof, wet bulb, approach', -- tags (<=255)
  'Su soğutma kulesi temelleri',
  'Su soğutma kulelerinin çalışma prensibi, sınıflandırması ve tasarım/işletme parametreleri.',
  'su sogutma kulesi, acik devre, kapali devre, karsi akis, capraz akis, buharlasma, drift, blof, wet bulb', -- meta_keywords (<=255)

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
-- 3) I18N: EN (FULL CONTENT)
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
  '11111111-1111-4111-8111-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'en',

  'what-is-a-cooling-tower-types-and-how-it-works',
  'Cooling Tower Basics: Types, Working Principle, Losses, and Design Parameters',
  CONCAT(
    '<h2>What Is a Cooling Tower?</h2>',
    '<p>A cooling tower is a <strong>heat rejection</strong> device that removes heat from warm process or HVAC water and releases it to the atmosphere. A small portion of water evaporates and carries away heat. The cooled water is collected in a basin and returned to the system.</p>',

    '<h2>How It Works</h2>',
    '<ol>',
      '<li><strong>Distribution:</strong> warm water is distributed over fill media.</li>',
      '<li><strong>Surface area:</strong> film/droplet formation increases heat transfer area.</li>',
      '<li><strong>Airflow:</strong> fan (or natural draft) moves air through wetted surfaces.</li>',
      '<li><strong>Heat transfer:</strong> sensible + <em>partial evaporation</em> cools the water.</li>',
      '<li><strong>Collection:</strong> cooled water returns to the loop.</li>',
    '</ol>',

    '<h2>Counterflow vs Crossflow</h2>',
    '<p><strong>Counterflow</strong>: air moves upward while water moves downward. <strong>Crossflow</strong>: air moves horizontally/diagonally relative to falling water.</p>',

    '<h2>Open vs Closed Circuit</h2>',
    '<p><strong>Open circuit</strong> towers directly expose process water to air. <strong>Closed circuit</strong> towers keep process fluid inside a coil while spray water + air reject heat.</p>',

    '<h2>Key Design Metrics</h2>',
    '<ul>',
      '<li><strong>Range:</strong> hot-water inlet minus cold-water outlet.</li>',
      '<li><strong>Approach:</strong> cold-water outlet minus <em>wet-bulb</em> temperature.</li>',
      '<li><strong>Wet-bulb:</strong> practical performance limit for evaporative cooling.</li>',
    '</ul>',

    '<h2>Water Losses</h2>',
    '<ul>',
      '<li><strong>Evaporation:</strong> inherent heat removal mechanism.</li>',
      '<li><strong>Drift:</strong> droplets carried out with exhaust air; reduced by drift eliminators.</li>',
      '<li><strong>Blowdown:</strong> controlled purge to manage dissolved solids (TDS).</li>',
    '</ul>',

    '<h2>Operation and Maintenance</h2>',
    '<ul>',
      '<li>Water treatment (scale/corrosion/biological control) is essential.</li>',
      '<li>Periodic inspections: nozzles, fill, drift eliminators, fan/motor group, basin hygiene.</li>',
    '</ul>'
  ),
  'Cooling tower technical article image',
  'cooling tower, counterflow, crossflow, drift, blowdown',
  'Cooling tower basics',
  'Cooling tower working principle, classifications, key design parameters, and operating losses.',
  'cooling tower, open circuit, closed circuit, counterflow, crossflow, evaporation, drift, blowdown, wet bulb, approach',

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
-- 4) I18N: DE (FULL CONTENT)
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
  '11111111-1111-4111-8111-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'de',

  'was-ist-ein-kuehlturm-arten-und-funktionsweise',
  'Kühlturm-Grundlagen: Bauarten, Funktionsprinzip, Verluste und Auslegungsparameter',
  CONCAT(
    '<h2>Was ist ein Kühlturm?</h2>',
    '<p>Ein Kühlturm ist eine Anlage zur <strong>Wärmeabfuhr</strong>, die erwärmtes Prozess- oder HVAC-Wasser abkühlt und Wärme an die Atmosphäre abgibt. Ein kleiner Teil des Wassers verdunstet und trägt Wärme ab. Das abgekühlte Wasser wird im Becken gesammelt und in den Kreislauf zurückgepumpt.</p>',

    '<h2>Funktionsprinzip</h2>',
    '<ol>',
      '<li><strong>Verteilung:</strong> Warmwasser wird gleichmäßig über den Füllkörper verteilt.</li>',
      '<li><strong>Oberfläche:</strong> Film/Tropfen erhöhen die Austauschfläche.</li>',
      '<li><strong>Luftstrom:</strong> Ventilator (oder Naturzug) führt Luft durch benetzte Bereiche.</li>',
      '<li><strong>Wärmeübertragung:</strong> fühlbare Wärme + <em>Teilverdunstung</em> kühlen das Wasser.</li>',
      '<li><strong>Sammlung:</strong> Kaltwasser wird gesammelt und zurückgeführt.</li>',
    '</ol>',

    '<h2>Gegenstrom vs Kreuzstrom</h2>',
    '<p><strong>Gegenstrom</strong>: Luft nach oben, Wasser nach unten. <strong>Kreuzstrom</strong>: Luft horizontal/diagonal relativ zum Wasser.</p>',

    '<h2>Offener vs Geschlossener Kreislauf</h2>',
    '<p><strong>Offener Kreislauf</strong> mit Direktkontakt von Prozesswasser und Luft. <strong>Geschlossener Kreislauf</strong>: Prozessmedium im Wärmetauscher/Coil, Wärmeabfuhr über Sprühwasser + Luft.</p>',

    '<h2>Wichtige Kenngrößen</h2>',
    '<ul>',
      '<li><strong>Range:</strong> Differenz Heißwasser-Eintritt minus Kaltwasser-Austritt.</li>',
      '<li><strong>Approach:</strong> Kaltwasser-Austritt minus <em>Feuchtkugeltemperatur</em>.</li>',
      '<li><strong>Feuchtkugel:</strong> praktische Untergrenze bei Verdunstungskühlung.</li>',
    '</ul>',

    '<h2>Wasserverluste</h2>',
    '<ul>',
      '<li><strong>Verdunstung:</strong> grundlegender Mechanismus der Wärmeabfuhr.</li>',
      '<li><strong>Drift:</strong> Tropfenmitriss in der Abluft; Tropfenabscheider reduzieren dies.</li>',
      '<li><strong>Abschlämmung (Blowdown):</strong> kontrollierte Spülung zur TDS-Begrenzung.</li>',
    '</ul>',

    '<h2>Betrieb und Wartung</h2>',
    '<ul>',
      '<li>Wasseraufbereitung ist für nachhaltige Leistung wesentlich.</li>',
      '<li>Regelmäßige Kontrollen: Düsen, Füllkörper, Tropfenabscheider, Ventilator/Motor, Beckenhygiene.</li>',
    '</ul>'
  ),
  'Technischer Beitrag über Kühlturm-Grundlagen',
  'kuehlturm, gegenstrom, kreuzstrom, drift, blowdown',
  'Kühlturm-Grundlagen',
  'Kühlturm-Funktionsprinzip, Einteilung, Auslegungsgrößen und Verluste im Betrieb.',
  'kuehlturm, offener kreislauf, geschlossener kreislauf, gegenstrom, kreuzstrom, verdunstung, drift, blowdown, feuchtkugel, approach',

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
  '22222222-2222-4222-8222-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  NULL,
  'http://localhost:8086/uploads/library/ensotek-cooling-tower-working-operating-principle.gif',
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
  '22222222-2222-4222-8222-bbbbbbbbbbbb',
  '11111111-1111-1111-1111-111111111111',
  NULL,
  'http://localhost:8086/uploads/library/ensotek-cooling-tower-working-operating-principle.gif',
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
  '22222222-2222-4222-8222-cccccccccccc',
  '11111111-1111-1111-1111-111111111111',
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

-- IMAGE #1
INSERT INTO `library_images_i18n`
(
  `id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`
)
VALUES
(
  '33333333-3333-4333-8333-111111111111',
  '22222222-2222-4222-8222-aaaaaaaaaaaa',
  'tr',
  'Kapalı devre su soğutma kulesi',
  'Kapalı devre su soğutma kulesi görseli',
  'Su soğutma kulesi – kapalı devre örneği',
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
  '33333333-3333-4333-8333-222222222222',
  '22222222-2222-4222-8222-aaaaaaaaaaaa',
  'en',
  'Closed circuit cooling tower',
  'Closed circuit water cooling tower image',
  'Cooling tower – closed circuit example',
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
  '33333333-3333-4333-8333-333333333333',
  '22222222-2222-4222-8222-aaaaaaaaaaaa',
  'de',
  'Geschlossener Wasserkühlturm',
  'Bild eines geschlossenen Wasserkühlturms (Closed Circuit)',
  'Kühlturm – Beispiel geschlossener Kreislauf',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),`alt`=VALUES(`alt`),`caption`=VALUES(`caption`),`updated_at`=VALUES(`updated_at`);

-- IMAGE #2
INSERT INTO `library_images_i18n`
(
  `id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`
)
VALUES
(
  '33333333-3333-4333-8333-444444444444',
  '22222222-2222-4222-8222-bbbbbbbbbbbb',
  'tr',
  'Hava-su temas bölgesi',
  'Su soğutma kulesi hava-su temas bölgesi',
  'Dolgu bölgesinde hava-su teması – karşı akışlı kule örneği',
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
  '33333333-3333-4333-8333-555555555555',
  '22222222-2222-4222-8222-bbbbbbbbbbbb',
  'en',
  'Fill and air–water contact zone',
  'Cooling tower fill and air–water contact zone',
  'Counterflow cooling tower – fill section and airflow interaction',
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
  '33333333-3333-4333-8333-666666666666',
  '22222222-2222-4222-8222-bbbbbbbbbbbb',
  'de',
  'Füllkörperbereich',
  'Füllkörperbereich eines Kühlturms mit Luft-Wasser-Kontakt',
  'Gegenstrom-Kühlturm – Füllkörper und Luftströmung',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),`alt`=VALUES(`alt`),`caption`=VALUES(`caption`),`updated_at`=VALUES(`updated_at`);

-- IMAGE #3
INSERT INTO `library_images_i18n`
(
  `id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`
)
VALUES
(
  '33333333-3333-4333-8333-777777777777',
  '22222222-2222-4222-8222-cccccccccccc',
  'tr',
  'Saha uygulaması',
  'Su soğutma kulesi saha uygulaması',
  'Endüstriyel tesiste çalışan su soğutma kuleleri',
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
  '33333333-3333-4333-8333-888888888888',
  '22222222-2222-4222-8222-cccccccccccc',
  'en',
  'Field installation',
  'Cooling tower field installation',
  'Industrial cooling towers in operation at a process plant',
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
  '33333333-3333-4333-8333-999999999999',
  '22222222-2222-4222-8222-cccccccccccc',
  'de',
  'Industrieller Einsatz',
  'Kühlturm-Anlage im industriellen Einsatz',
  'In einem Industrieprozess betriebene Kühltürme',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),`alt`=VALUES(`alt`),`caption`=VALUES(`caption`),`updated_at`=VALUES(`updated_at`);

COMMIT;
