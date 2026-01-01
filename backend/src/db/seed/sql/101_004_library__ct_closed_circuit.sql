-- =============================================================
-- FILE: src/db/seed/sql/library/101_004_library__ct_closed_circuit.sql
-- Ensotek - Library Item Seed (CT CLOSED CIRCUIT / CLOSED-LOOP WORKING PRINCIPLE)
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
  '44444444-4444-4444-4444-444444444444',
  'other',

  NULL,
  NULL,

  0,
  1,
  1,
  70,

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
  '44444444-4444-4555-8666-111111111111',
  '44444444-4444-4444-4444-444444444444',
  'tr',

  'kapali-cevrim-su-sogutma-kulesi-calisma-prensibi',
  'Kapalı Çevrim Su Soğutma Kulesi Çalışma Prensibi',
  CONCAT(
    '<h2>Kapalı Çevrim Su Soğutma Kulesi Çalışma Prensibi</h2>',

    '<h3>Kapalı Çevrim (Kapalı Devre) Kule Nedir?</h3>',
    '<p>',
      'Kapalı çevrim kuleler, soğutulacak akışkanın (proses suyu / glikol / özel akışkan) ortam ile teması istenmeyen proseslerde tercih edilir. ',
      'Soğutulacak akışkan <strong>metal serpantin (eşanjör registeri)</strong> içinde dolaşır. ',
      'Kulede dolaşan hava ve serpantin üzerine püskürtülen sprey suyu, serpantin dış yüzeyinden ısı alarak içindeki akışkanı dolaylı şekilde soğutur. ',
      'Böylece proses akışkanı <strong>kirlenmez</strong> ve sistem suyu kalitesi korunur.',
    '</p>',

    '<h3>Temel Çalışma Mantığı</h3>',
    '<ol>',
      '<li><strong>Sıcak proses akışkanı serpantine girer:</strong> Isınmış akışkan serpantin borularından geçer.</li>',
      '<li><strong>Hava akışı sağlanır:</strong> Fan, ortam havasını kule içine alır ve serpantin üzerinden geçirir.</li>',
      '<li><strong>Sprey suyu devresi çalışır:</strong> Kule havuzundaki sirkülasyon suyu pompa ile nozullara basılır ve serpantin üzerine püskürtülür.</li>',
      '<li><strong>Isı transferi:</strong> Serpantin içindeki akışkan ısısını boru duvarından dış yüzeye iletir; sprey suyu ve hava bu ısıyı atmosfere taşır.</li>',
      '<li><strong>Soğuyan akışkan prosese döner:</strong> Serpantinden çıkan akışkan sisteme geri gönderilir.</li>',
    '</ol>',

    '<h3>Kapalı Tip Kulelerde Buharlaşma Kaybı</h3>',
    '<p>',
      'Proses akışkanı serpantin içinde kapalı devrede dolaştığı için proses devresinde buharlaşma kaybı oluşmaz. ',
      'Ancak serpantin üzerine püskürtülen <strong>sprey suyu devresi</strong> hava ile doğrudan temas ettiğinden bu devrede buharlaşma kaybı meydana gelir. ',
      'Bu kayıp proses devresinin su kalitesini etkilemez.',
    '</p>',

    '<h3>Free Cooling (Kuru Soğutucu) Modu</h3>',
    '<p>',
      'Soğuk mevsimlerde sprey suyu devresi kapatılarak kule yalnızca hava akışıyla çalıştırılabilir. ',
      'Bu işletme şekli, kapalı tip kuleyi <strong>kuru soğutucu (dry cooler)</strong> gibi çalıştırır ve <strong>free cooling</strong> olarak adlandırılır. ',
      'Uygun iklim koşullarında enerji tüketimi azaltılabilir.',
    '</p>',

    '<h3>Donma Riski ve Koruma Stratejileri</h3>',
    '<p>',
      'Kış şartlarında sistem durduğunda serpantin içinde kalan akışkan donabilir. Donma, serpantin borularında çatlama riski doğurur. ',
      'Başlıca önlemler:',
    '</p>',
    '<ul>',
      '<li><strong>Serpantinin boşaltılması</strong> (duruşlarda tahliye).</li>',
      '<li><strong>Düşük debide sirkülasyon</strong> ile kritik sıcaklıklarda dolaşım.</li>',
      '<li><strong>Antifriz (glikol)</strong> kullanımı ile donma noktasının düşürülmesi.</li>',
      '<li><strong>Otomasyon</strong>: fan/pompa kademelendirme ve set değerleriyle donma önleyici kontrol.</li>',
    '</ul>',

    '<h3>Enerji Tüketimi</h3>',
    '<p>',
      'Kapalı devre kulelerde enerji tüketimi temel olarak <strong>fan motoru</strong> ve <strong>sprey suyu pompası</strong> kaynaklıdır. ',
      'İklim, hedef yaklaşım ve yük profiline göre doğru seçim ve kontrol ile işletme ekonomisi optimize edilebilir.',
    '</p>',

    '<h3>Kullanım Alanları ve Avantajlar</h3>',
    '<ul>',
      '<li><strong>Proses suyu temizliği:</strong> Hassas ekipmanlarda su kalitesinin korunması.</li>',
      '<li><strong>Daha düşük kirlenme riski:</strong> Proses devresi atmosfere açık değildir.</li>',
      '<li><strong>Free cooling imkânı:</strong> Soğuk iklimlerde enerji avantajı.</li>',
      '<li><strong>Stabil işletme:</strong> Uygun kontrol ile yıl boyu daha kontrollü performans.</li>',
    '</ul>',

    '<h3>Özet</h3>',
    '<p>',
      'Kapalı çevrim kulelerde proses akışkanı serpantin içinde dolaşır ve hava + sprey suyu ile dolaylı soğutulur. ',
      'Proses devresi kirlenmez; sprey devresinde buharlaşma kaybı oluşur. ',
      'Free cooling ile kış işletmesinde enerji avantajı sağlanabilir; donma riskine karşı boşaltma, sirkülasyon, antifriz ve otomasyon önlemleri değerlendirilmelidir.',
    '</p>'
  ),
  'Kapalı çevrim su soğutma kulesi çalışma prensibi şeması',
  'kapali cevrim, kapali devre, serpantin, esanjör, spray, free cooling, donma',
  'Kapalı Çevrim Su Soğutma Kulesi Çalışma Prensibi',
  'Kapalı devre soğutma kulelerinde serpantin üzerinden dolaylı soğutma, sprey devresi, free cooling, donma riskine karşı önlemler ve enerji tüketimi.',
  'kapali cevrim kule, closed circuit, serpantinli kule, esanjör, spray suyu, free cooling, antifriz, donma',

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
  '44444444-4444-4555-8666-222222222222',
  '44444444-4444-4444-4444-444444444444',
  'en',

  'closed-circuit-cooling-tower-working-principle',
  'Closed-Circuit Cooling Tower Working Principle',
  CONCAT(
    '<h2>Closed-Circuit Cooling Tower Working Principle</h2>',

    '<h3>What Is a Closed-Circuit Cooling Tower?</h3>',
    '<p>',
      'Closed-circuit (closed-loop) cooling towers are used when the process fluid must remain clean and isolated from ambient air. ',
      'The process fluid circulates inside a <strong>metal coil (heat exchanger)</strong>. Airflow and a spray-water loop remove heat from the coil surface, ',
      'cooling the internal process fluid <strong>indirectly</strong>.',
    '</p>',

    '<h3>How It Works (Step-by-Step)</h3>',
    '<ol>',
      '<li><strong>Hot process fluid enters the coil</strong> and flows through the heat-exchanger tubes.</li>',
      '<li><strong>Airflow is induced</strong> by the fan and passes over the coil surface.</li>',
      '<li><strong>Spray-water loop operates:</strong> recirculating water is pumped to nozzles and sprayed over the coil.</li>',
      '<li><strong>Heat transfer occurs:</strong> heat moves from the process fluid to the tube wall and then to spray water and air.</li>',
      '<li><strong>Cooled process fluid returns</strong> to the process while spray water returns to the basin.</li>',
    '</ol>',

    '<h3>Does Evaporation Occur?</h3>',
    '<p>',
      'Evaporation does not occur in the closed process loop because the process fluid is contained inside the coil. ',
      'However, the <strong>spray-water loop</strong> is exposed to air, so some evaporation occurs there and contributes to heat rejection.',
    '</p>',

    '<h3>Free Cooling (Dry Cooler) Mode</h3>',
    '<p>',
      'In cold weather, the tower can often be operated with the spray-water system turned off, using air-only heat rejection—similar to a <strong>dry cooler</strong>. ',
      'This is commonly called <strong>free cooling</strong> and can reduce energy consumption under favorable ambient conditions.',
    '</p>',

    '<h3>Freeze Risk and Protection Measures</h3>',
    '<p>',
      'If the system is stopped in winter conditions, fluid inside the coil may freeze and damage tubes. Common mitigation strategies include:',
    '</p>',
    '<ul>',
      '<li><strong>Draining the coil</strong> during shutdown periods.</li>',
      '<li><strong>Low-flow circulation</strong> to keep fluid moving.</li>',
      '<li><strong>Glycol/antifreeze</strong> to lower freezing point.</li>',
      '<li><strong>Control logic</strong> (fan staging, bypass, setpoints) to prevent coil icing.</li>',
    '</ul>',

    '<h3>Energy Consumption</h3>',
    '<p>',
      'Electrical consumption is mainly driven by the <strong>fan</strong> and the <strong>spray-water pump</strong>. ',
      'Optimized equipment selection and controls can improve operating cost depending on climate, load profile, and required approach.',
    '</p>',

    '<h3>Where It Is Used / Key Benefits</h3>',
    '<ul>',
      '<li><strong>Clean process fluid:</strong> ideal for sensitive processes and equipment.</li>',
      '<li><strong>Reduced contamination risk:</strong> process loop is isolated from ambient air.</li>',
      '<li><strong>Seasonal efficiency:</strong> free cooling opportunities in cooler climates.</li>',
      '<li><strong>Stable operation:</strong> controlled process-side water quality.</li>',
    '</ul>',

    '<h3>Summary</h3>',
    '<p>',
      'Closed-circuit towers cool process fluids indirectly through a coil using airflow and spray water. ',
      'Evaporation occurs on the spray-water side, not in the process loop. Free cooling can reduce energy use in cold seasons, ',
      'while freeze protection measures (drain, circulation, glycol, controls) are critical for winter reliability.',
    '</p>'
  ),
  'Closed-circuit cooling tower working principle diagram',
  'closed circuit, closed loop, coil, heat exchanger, spray water, free cooling, freeze',
  'Closed-Circuit Cooling Tower Working Principle',
  'Indirect cooling via coil heat exchanger, spray-water evaporation, free cooling operation, freeze protection and fan/pump energy drivers.',
  'closed circuit cooling tower, coil tower, heat exchanger coil, spray water loop, free cooling, freeze protection, glycol',

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
  '44444444-4444-4555-8666-333333333333',
  '44444444-4444-4444-4444-444444444444',
  'de',

  'funktionsprinzip-geschlossener-kuehlturm',
  'Funktionsprinzip eines geschlossenen Kühlturms',
  CONCAT(
    '<h2>Funktionsprinzip eines geschlossenen Kühlturms</h2>',

    '<h3>Was ist ein geschlossener Kühlturm?</h3>',
    '<p>',
      'Geschlossene Kühltürme (geschlossener Kreislauf) werden eingesetzt, wenn das Prozessmedium sauber bleiben und nicht mit der Umgebungsluft in Kontakt kommen soll. ',
      'Das Medium zirkuliert in einem <strong>metallischen Register (Wärmetauscher)</strong>. Luftstrom und Sprühwasser entziehen dem Register Wärme, ',
      'wodurch das Prozessmedium <strong>indirekt</strong> abgekühlt wird.',
    '</p>',

    '<h3>Ablauf (Schritt für Schritt)</h3>',
    '<ol>',
      '<li><strong>Warmes Prozessmedium</strong> strömt durch die Registerrohre.</li>',
      '<li><strong>Ventilator fördert Luft</strong> über die Registeroberfläche.</li>',
      '<li><strong>Sprühwasserkreislauf:</strong> Umlaufwasser wird gepumpt und über Düsen auf das Register gesprüht.</li>',
      '<li><strong>Wärmeübertragung:</strong> Wärme gelangt vom Medium über die Rohrwand an Sprühwasser und Luft.</li>',
      '<li><strong>Abgekühltes Medium</strong> kehrt in den Prozess zurück; Sprühwasser fließt ins Becken zurück.</li>',
    '</ol>',

    '<h3>Verdunstung</h3>',
    '<p>',
      'Im geschlossenen Prozesskreislauf entstehen keine Verdunstungsverluste, da das Medium im Register eingeschlossen ist. ',
      'Im <strong>Sprühwasserkreislauf</strong> tritt jedoch eine gewisse Verdunstung auf, die zur Wärmeabfuhr beiträgt.',
    '</p>',

    '<h3>Free Cooling / Trockenkühler-Betrieb</h3>',
    '<p>',
      'Bei niedrigen Außentemperaturen kann häufig ohne Sprühwasser im Luftbetrieb gefahren werden – ähnlich einem <strong>Trockenkühler</strong>. ',
      'Diese Betriebsart wird als <strong>Free Cooling</strong> bezeichnet und kann den Energieverbrauch reduzieren.',
    '</p>',

    '<h3>Frostgefahr und Schutzmaßnahmen</h3>',
    '<p>',
      'Bei Stillstand im Winter kann das Medium im Register einfrieren und Schäden verursachen. Typische Gegenmaßnahmen sind:',
    '</p>',
    '<ul>',
      '<li><strong>Register entleeren</strong> bei Stillstand.</li>',
      '<li><strong>Umlauf bei geringer Fördermenge</strong> zur Vermeidung von Eisbildung.</li>',
      '<li><strong>Glykol/Antifreeze</strong> zur Absenkung des Gefrierpunkts.</li>',
      '<li><strong>Regelung</strong> (Ventilatorstufen, Bypass, Sollwerte) zur Frostvermeidung.</li>',
    '</ul>',

    '<h3>Energieverbrauch</h3>',
    '<p>',
      'Der elektrische Verbrauch wird hauptsächlich durch <strong>Ventilator</strong> und <strong>Sprühpumpe</strong> bestimmt. ',
      'Eine optimierte Auslegung und Regelung kann den Betrieb abhängig von Klima, Lastprofil und gefordertem Approach verbessern.',
    '</p>',

    '<h3>Vorteile</h3>',
    '<ul>',
      '<li><strong>Sauberes Prozessmedium</strong> bleibt von der Umgebung getrennt.</li>',
      '<li><strong>Geringeres Verschmutzungsrisiko</strong> im Prozesskreis.</li>',
      '<li><strong>Free-Cooling-Potenzial</strong> in kühlen Perioden.</li>',
      '<li><strong>Stabiler Betrieb</strong> mit geeigneter Regelung.</li>',
    '</ul>',

    '<h3>Zusammenfassung</h3>',
    '<p>',
      'Geschlossene Kühltürme kühlen Prozessmedien indirekt über ein Register mit Luft und Sprühwasser. ',
      'Verdunstung findet im Sprühwasserkreislauf statt, nicht im Prozesskreis. ',
      'Free Cooling kann im Winter Vorteile bringen; Frostschutzmaßnahmen sind für die Betriebssicherheit zentral.',
    '</p>'
  ),
  'Schema: Funktionsprinzip geschlossener Kühlturm',
  'geschlossener kuehlturm, register, waermetauscher, spruehwasser, free cooling, frostschutz',
  'Funktionsprinzip eines geschlossenen Kühlturms',
  'Indirekte Kühlung über Register, Verdunstung im Sprühwasser, Free Cooling und Frostschutz sowie Energieverbrauch (Ventilator/Pumpe).',
  'geschlossener kuehlturm, closed circuit, registerkuehlturm, waermetauscher register, spruehwasser, free cooling, glykol, frostschutz',

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
  '44444444-5555-4666-8777-aaaaaaaaaaaa',
  '44444444-4444-4444-4444-444444444444',
  NULL,
  'https://www.ensotek.de/uploads/library/how-is-closed-circuit-water-cooling-tower-operation.png',
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
  '44444444-5555-4666-8777-bbbbbbbbbbbb',
  '44444444-4444-4444-4444-444444444444',
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
  '44444444-5555-4666-8777-cccccccccccc',
  '44444444-4444-4444-4444-444444444444',
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
  '44444444-6666-4777-8888-111111111111',
  '44444444-5555-4666-8777-aaaaaaaaaaaa',
  'tr',
  'Kapalı çevrim soğutma kulesi çalışma prensibi',
  'Kapalı çevrim su soğutma kulesi çalışma prensibi görseli',
  'Serpantin (eşanjör) üzerinden dolaylı soğutma ve sprey suyu devresi',
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
  '44444444-6666-4777-8888-222222222222',
  '44444444-5555-4666-8777-aaaaaaaaaaaa',
  'en',
  'Closed-circuit cooling tower working principle',
  'Closed-circuit cooling tower working principle image',
  'Indirect cooling via coil heat exchanger and spray-water loop',
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
  '44444444-6666-4777-8888-333333333333',
  '44444444-5555-4666-8777-aaaaaaaaaaaa',
  'de',
  'Funktionsprinzip geschlossener Kühlturm',
  'Bild: Funktionsprinzip eines geschlossenen Kühlturms',
  'Indirekte Kühlung über Register mit Sprühwasserkreislauf; Free Cooling und Frostschutzaspekte',
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
  '44444444-6666-4777-8888-444444444444',
  '44444444-5555-4666-8777-bbbbbbbbbbbb',
  'tr',
  'Sprey suyu devresi ve serpantin yüzeyi',
  'Kapalı devre kulede sprey suyu ve serpantin yüzeyi görseli',
  'Sprey suyu, serpantin yüzeyinden ısı alarak soğutmayı destekler',
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
  '44444444-6666-4777-8888-555555555555',
  '44444444-5555-4666-8777-bbbbbbbbbbbb',
  'en',
  'Spray-water loop and coil surface',
  'Image showing spray-water over the coil surface in a closed-circuit tower',
  'Spray water removes heat from the coil surface to enhance cooling',
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
  '44444444-6666-4777-8888-666666666666',
  '44444444-5555-4666-8777-bbbbbbbbbbbb',
  'de',
  'Sprühwasserkreislauf und Registeroberfläche',
  'Bild: Sprühwasser auf der Registeroberfläche im geschlossenen Kühlturm',
  'Sprühwasser entzieht der Registeroberfläche Wärme und unterstützt die Kühlung',
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
  '44444444-6666-4777-8888-777777777777',
  '44444444-5555-4666-8777-cccccccccccc',
  'tr',
  'Free cooling (kuru çalışma) işletmesi',
  'Kapalı devre kulede free cooling (kuru çalışma) görseli',
  'Soğuk havalarda sprey kapatılarak hava ile kuru soğutma yapılabilir',
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
  '44444444-6666-4777-8888-888888888888',
  '44444444-5555-4666-8777-cccccccccccc',
  'en',
  'Free cooling (dry operation) mode',
  'Image illustrating free cooling (dry operation) in a closed-circuit tower',
  'In cold weather, spray can be turned off and the tower can run air-only like a dry cooler',
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
  '44444444-6666-4777-8888-999999999999',
  '44444444-5555-4666-8777-cccccccccccc',
  'de',
  'Free Cooling (Trockenbetrieb)',
  'Bild: Free Cooling / Trockenbetrieb bei einem geschlossenen Kühlturm',
  'Bei niedrigen Außentemperaturen kann ohne Sprühwasser im Luftbetrieb gekühlt werden (ähnlich Trockenkühler)',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),`alt`=VALUES(`alt`),`caption`=VALUES(`caption`),`updated_at`=VALUES(`updated_at`);

COMMIT;
