-- =============================================================
-- FILE: src/db/seed/sql/library/101_003_library__ct_open_circuit.sql
-- Ensotek - Library Item Seed (CT OPEN CIRCUIT / OPEN TYPE WORKING PRINCIPLE)
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
  '33333333-3333-3333-3333-333333333333',
  'other',

  NULL,
  NULL,

  0,
  1,
  1,
  60,

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
-- 2) I18N: TR
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
  '33333333-3333-4333-8333-111111111111',
  '33333333-3333-3333-3333-333333333333',
  'tr',

  'acik-tip-su-sogutma-kulesi-calisma-prensibi',
  'Açık Tip Su Soğutma Kulesi Çalışma Prensibi',
  CONCAT(
    '<h2>Açık Tip Su Soğutma Kulesi Çalışma Prensibi</h2>',

    '<h3>Açık Tip (Açık Devre) Kule Nedir?</h3>',
    '<p>',
      'Açık tip su soğutma kulelerinde proses suyu, kule içerisinde hava ile <strong>doğrudan temas</strong> eder. ',
      'Isı uzaklaştırmanın büyük bölümü buharlaşma ile sağlanır. Bu nedenle verim yüksektir; ancak su kalitesi, ',
      'kireçlenme ve kirlenme yönetimi doğru yapılmalıdır.',
    '</p>',

    '<h3>Temel Çalışma Mekanizması</h3>',
    '<p>',
      'Su, üst dağıtım sisteminden nozullar ile dolgu üzerine yayılır. Fan ile kule içine alınan hava, ',
      'dolgu yüzeyinde su ile temas eder. Bu temas sırasında:',
    '</p>',
    '<ul>',
      '<li><strong>Duyulur ısı transferi</strong>: Su ile hava arasındaki sıcaklık farkı ile sudan havaya ısı geçer.</li>',
      '<li><strong>Gizli ısı (buharlaşma)</strong>: Suyun bir kısmı buharlaşarak hal değiştirir ve sudan ek ısı çeker.</li>',
    '</ul>',
    '<p>',
      'Soğuyan su alt havuzda toplanır ve pompalanarak tekrar prosese gönderilir. Nemlenen hava ise fan bacasından atmosfere atılır.',
    '</p>',

    '<h3>Karşı Akışlı ve Çapraz Akışlı Düzen</h3>',
    '<p>',
      'Su soğutma kuleleri, hava-su akış yönlerine göre temel olarak ikiye ayrılır: ',
      '<strong>karşı akışlı</strong> ve <strong>çapraz akışlı</strong>. ',
      'Karşı akışlı kulelerde su aşağı inerken hava aşağıdan yukarı çıkar. Çapraz akışlı kulelerde hava, suya göre yatay/çapraz akar.',
    '</p>',

    '<h3>Cebri Çekişli Karşı Akışlı Kulelerde Adım Adım İşleyiş</h3>',
    '<ol>',
      '<li><strong>Sıcak su girişi:</strong> Prosesten gelen sıcak su, dağıtım hattına alınır.</li>',
      '<li><strong>Dağıtım ve püskürtme:</strong> Nozullar suyu dolgu üzerine homojen şekilde yayar.</li>',
      '<li><strong>Dolgu üzerinde film/damlacık oluşumu:</strong> Su, dolgu yüzeyinde ince film ve küçük damlacıklar oluşturarak ısı transfer alanını artırır.</li>',
      '<li><strong>Hava emişi:</strong> Fan, dış havayı hava panjurlarından içeri alır ve dolgudan geçirir.</li>',
      '<li><strong>Isı uzaklaştırma:</strong> Su, havaya ısı verir; bir kısmı buharlaşır ve su sıcaklığı düşer.</li>',
      '<li><strong>Soğuk su havuzu:</strong> Soğuyan su havuzda toplanır.</li>',
      '<li><strong>Deşarj:</strong> Nemli hava fan bacasından atılır; su ise pompalanarak prosese geri döner.</li>',
    '</ol>',

    '<h3>Açık Tip Kulelerin Temel Bileşenleri</h3>',
    '<ul>',
      '<li><strong>Gövde ve havuz:</strong> Su toplama ve taşıyıcı yapı.</li>',
      '<li><strong>Su dağıtım sistemi ve nozullar:</strong> Suyun homojen yayılması.</li>',
      '<li><strong>Dolgu (fill):</strong> Isı transfer yüzeyini büyütür; film veya sıçratma tipi olabilir.</li>',
      '<li><strong>Fan-motor grubu:</strong> Hava akışını sağlar (cebri çekişli/itme seçenekleri).</li>',
      '<li><strong>Sürüklenme tutucu (drift eliminator):</strong> Su damlacıklarının hava ile taşınmasını azaltır.</li>',
      '<li><strong>Hava panjurları (louvers):</strong> Hava girişini düzenler, su sıçramasını azaltır.</li>',
    '</ul>',

    '<h3>Performans Terimleri: Range, Approach ve Yaş Termometre</h3>',
    '<ul>',
      '<li><strong>Range (Soğutma aralığı):</strong> T<sub>g</sub> − T<sub>ç</sub> (giriş-çıkış suyu sıcaklık farkı).</li>',
      '<li><strong>Approach (Yaklaşım):</strong> T<sub>ç</sub> − T<sub>wb</sub> (çıkış suyu ile yaş termometre arasındaki fark).</li>',
      '<li><strong>Yaş termometre (Wet-bulb):</strong> Kule performansını doğrudan etkileyen temel iklim parametresidir.</li>',
    '</ul>',

    '<h3>Buharlaşma, Sürüklenme ve Blöf Kayıpları</h3>',
    '<p>Su kaybı üç ana başlıkta değerlendirilir:</p>',
    '<ul>',
      '<li><strong>Buharlaşma kaybı:</strong> Soğutmanın doğal sonucudur; ısı uzaklaştırmanın temel mekanizmasıdır.</li>',
      '<li><strong>Sürüklenme (drift) kaybı:</strong> Hava ile taşınan su damlacıklarıdır; drift eliminator ile minimize edilir.</li>',
      '<li><strong>Blöf (purge / blowdown):</strong> İletkenlik/katı madde kontrolü için sistemden su atılmasıdır.</li>',
    '</ul>',

    '<h3>İşletme Notları</h3>',
    '<ul>',
      '<li><strong>Su şartlandırma:</strong> Kireçlenme/korozyon/biyolojik kontrol için su kimyası yönetimi gerekir.</li>',
      '<li><strong>Dolgu seçimi:</strong> Su kalitesi ve kirlilik durumuna göre film veya sıçratma dolgu seçilmelidir.</li>',
      '<li><strong>Drift kontrolü:</strong> Doğru sürüklenme tutucu ile su tüketimi ve çevresel etki azaltılır.</li>',
    '</ul>',

    '<h3>Özet</h3>',
    '<p>',
      'Açık tip kulelerde soğutma, suyun hava ile doğrudan temas etmesi ve kısmi buharlaşma ile gerçekleşir. ',
      'Karşı akışlı cebri çekişli tasarımda su aşağı inerken hava yukarı çıkar; dolgu ısı transfer alanını büyütür. ',
      'Su kayıpları (buharlaşma, sürüklenme, blöf) doğru tasarım ve işletme ile kontrol altında tutulur.',
    '</p>'
  ),
  'Açık tip su soğutma kulesi çalışma prensibi şeması',
  'acik tip, acik devre, karsı akis, induced draft, drift, blowdown',
  'Açık Tip Su Soğutma Kulesi Çalışma Prensibi',
  'Açık tip (açık devre) kule çalışma prensibi: adımlar, bileşenler, performans terimleri ve su kayıpları.',
  'acik tip kule, acik devre, sogutma kulesi, karsi akis, buharlasma, drift, blof, wet bulb',

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
-- 3) I18N: EN
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
  '33333333-3333-4333-8333-222222222222',
  '33333333-3333-3333-3333-333333333333',
  'en',

  'open-circuit-cooling-tower-working-principle',
  'Open-Circuit Cooling Tower Working Principle',
  CONCAT(
    '<h2>Open-Circuit Cooling Tower Working Principle</h2>',

    '<h3>What Is an Open-Circuit Cooling Tower?</h3>',
    '<p>',
      'In an open-circuit (open-loop) cooling tower, the process water comes into <strong>direct contact</strong> with air. ',
      'Most heat rejection is achieved through evaporation, which typically provides high thermal performance. ',
      'Because the water is exposed to the environment, water quality management (scaling, fouling, biological control) is essential.',
    '</p>',

    '<h3>Core Heat-Rejection Mechanisms</h3>',
    '<ul>',
      '<li><strong>Sensible heat transfer:</strong> heat moves from water to air due to temperature difference.</li>',
      '<li><strong>Latent heat (evaporation):</strong> a small portion of water evaporates and removes additional heat via phase change.</li>',
    '</ul>',

    '<h3>Counterflow vs. Crossflow Arrangements</h3>',
    '<p>',
      '<strong>Counterflow</strong>: air rises while water falls. ',
      '<strong>Crossflow</strong>: air moves horizontally/diagonally across the falling water.',
    '</p>',

    '<h3>Induced-Draft Counterflow: Step-by-Step</h3>',
    '<ol>',
      '<li><strong>Hot water enters</strong> the distribution header.</li>',
      '<li><strong>Nozzles distribute</strong> water evenly over the fill.</li>',
      '<li><strong>Fill increases surface area</strong> by creating films and droplets.</li>',
      '<li><strong>Fan induces airflow</strong> through louvers and across the fill zone.</li>',
      '<li><strong>Heat is rejected</strong>: water cools; a fraction evaporates.</li>',
      '<li><strong>Cooled water collects</strong> in the cold-water basin.</li>',
      '<li><strong>Moist air discharges</strong> through the fan stack; cooled water recirculates back to the process.</li>',
    '</ol>',

    '<h3>Key Components</h3>',
    '<ul>',
      '<li><strong>Structure & basin</strong></li>',
      '<li><strong>Water distribution & nozzles</strong></li>',
      '<li><strong>Fill media</strong> (film or splash)</li>',
      '<li><strong>Fan & motor</strong></li>',
      '<li><strong>Drift eliminators</strong> to reduce droplet carryover</li>',
      '<li><strong>Louvers</strong> for airflow control</li>',
    '</ul>',

    '<h3>Performance Terms</h3>',
    '<ul>',
      '<li><strong>Range:</strong> T<sub>in</sub> − T<sub>out</sub>.</li>',
      '<li><strong>Approach:</strong> T<sub>out</sub> − T<sub>wb</sub>.</li>',
      '<li><strong>Wet-bulb:</strong> dominant climate parameter for tower capacity.</li>',
    '</ul>',

    '<h3>Water Losses</h3>',
    '<ul>',
      '<li><strong>Evaporation</strong></li>',
      '<li><strong>Drift</strong></li>',
      '<li><strong>Blowdown</strong></li>',
    '</ul>',

    '<h3>Summary</h3>',
    '<p>',
      'Open-circuit towers cool by direct contact and partial evaporation. ',
      'With proper design and operation, high performance is achievable while controlling water losses via drift elimination and blowdown strategy.',
    '</p>'
  ),
  'Open-circuit cooling tower working principle diagram',
  'open circuit, open loop, counterflow, induced draft, drift, blowdown',
  'Open-Circuit Cooling Tower Working Principle',
  'Expanded technical description: operation steps, components, performance metrics, and water losses in open-circuit cooling towers.',
  'open circuit cooling tower, working principle, counterflow, induced draft, evaporation, drift, blowdown, wet bulb',

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
-- 4) I18N: DE
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
  '33333333-3333-4333-8333-333333333333',
  '33333333-3333-3333-3333-333333333333',
  'de',

  'funktionsprinzip-offener-kuehlturm',
  'Funktionsprinzip eines offenen Kühlturms',
  CONCAT(
    '<h2>Funktionsprinzip eines offenen Kühlturms</h2>',

    '<h3>Was ist ein offener Kühlturm?</h3>',
    '<p>',
      'Beim offenen Kühlturm (offener Kreislauf) steht das Prozesswasser im <strong>direkten Kontakt</strong> mit der Luft. ',
      'Die Wärmeabfuhr erfolgt zu einem großen Teil über Verdunstung. ',
      'Da das Wasser der Umgebung ausgesetzt ist, sind Wasserqualität und Aufbereitung (Verkalkung, Verschmutzung, Biologie) besonders wichtig.',
    '</p>',

    '<h3>Grundmechanismen</h3>',
    '<ul>',
      '<li><strong>Fühlbare Wärme:</strong> Wärmeübergang durch Temperaturdifferenz.</li>',
      '<li><strong>Latente Wärme (Verdunstung):</strong> Teilverdunstung entzieht dem Wasser zusätzliche Energie.</li>',
    '</ul>',

    '<h3>Gegenstrom vs. Kreuzstrom</h3>',
    '<p>',
      '<strong>Gegenstrom</strong>: Luft nach oben, Wasser nach unten. ',
      '<strong>Kreuzstrom</strong>: Luft quer/diagonal zum Wasserfilm.',
    '</p>',

    '<h3>Induzierter Zug im Gegenstrom: Ablauf</h3>',
    '<ol>',
      '<li><strong>Warmwasserzulauf</strong> in die Verteilereinheit.</li>',
      '<li><strong>Düsenverteilung</strong> über die Füllkörper.</li>',
      '<li><strong>Füllkörper</strong> erhöhen die benetzte Oberfläche.</li>',
      '<li><strong>Ventilator saugt Luft an</strong> und führt sie durch den Wärmeübertragerbereich.</li>',
      '<li><strong>Wärmeabfuhr</strong> durch Abkühlung und Teilverdunstung.</li>',
      '<li><strong>Kaltwasserbecken</strong> sammelt das abgekühlte Wasser.</li>',
      '<li><strong>Abluftaustritt</strong> über den Ventilatorstapel; Wasser wird zurück in den Prozess gefördert.</li>',
    '</ol>',

    '<h3>Hauptkomponenten</h3>',
    '<ul>',
      '<li><strong>Gehäuse & Becken</strong></li>',
      '<li><strong>Wasserverteilung & Düsen</strong></li>',
      '<li><strong>Füllkörper</strong></li>',
      '<li><strong>Ventilator & Motor</strong></li>',
      '<li><strong>Driftabscheider</strong></li>',
      '<li><strong>Lamellen/Louvers</strong></li>',
    '</ul>',

    '<h3>Leistungsbegriffe</h3>',
    '<ul>',
      '<li><strong>Range:</strong> T<sub>ein</sub> − T<sub>aus</sub>.</li>',
      '<li><strong>Approach:</strong> T<sub>aus</sub> − T<sub>wb</sub>.</li>',
      '<li><strong>Feuchtkugel:</strong> wichtiger Klimaparameter für die Leistung.</li>',
    '</ul>',

    '<h3>Wasserverluste</h3>',
    '<ul>',
      '<li><strong>Verdunstung</strong></li>',
      '<li><strong>Drift (Tropfenmitriss)</strong></li>',
      '<li><strong>Abschlämmung (Blowdown)</strong></li>',
    '</ul>',

    '<h3>Zusammenfassung</h3>',
    '<p>',
      'Offene Kühltürme kühlen durch direkten Luftkontakt und Teilverdunstung. ',
      'Bei Gegenstrom mit induziertem Zug sind hohe Leistungen erreichbar, wenn Wasserverluste über Driftabscheider und Abschlämmstrategie kontrolliert werden.',
    '</p>'
  ),
  'Schema: Funktionsprinzip offener Kühlturm',
  'offener kuehlturm, offener kreislauf, gegenstrom, drift, blowdown',
  'Funktionsprinzip eines offenen Kühlturms',
  'Erweiterte technische Beschreibung: Ablauf, Komponenten, Leistungskennzahlen und Wasserverluste bei offenen Kühltürmen.',
  'offener kuehlturm, funktionsprinzip, gegenstrom, induced draft, verdunstung, drift, abschlaemmung, feuchtkugel',

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
  '33333333-4444-4555-8666-aaaaaaaaaaaa',
  '33333333-3333-3333-3333-333333333333',
  NULL,
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752786288/uploads/metahub/about-images/closed-circuit-water-cooling-towers1-1752786287184-840184158.webp',
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
  '33333333-4444-4555-8666-bbbbbbbbbbbb',
  '33333333-3333-3333-3333-333333333333',
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
  '33333333-4444-4555-8666-cccccccccccc',
  '33333333-3333-3333-3333-333333333333',
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
  '33333333-5555-4666-8777-111111111111',
  '33333333-4444-4555-8666-aaaaaaaaaaaa',
  'tr',
  'Açık tip soğutma kulesi çalışma prensibi',
  'Açık tip su soğutma kulesi çalışma prensibi görseli',
  'Açık devre kule – karşı akışlı çalışma prensibi',
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
  '33333333-5555-4666-8777-222222222222',
  '33333333-4444-4555-8666-aaaaaaaaaaaa',
  'en',
  'Open-circuit cooling tower working principle',
  'Open-circuit cooling tower working principle image',
  'Open loop tower – induced-draft counterflow principle',
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
  '33333333-5555-4666-8777-333333333333',
  '33333333-4444-4555-8666-aaaaaaaaaaaa',
  'de',
  'Funktionsprinzip offener Kühlturm',
  'Bild: Funktionsprinzip eines offenen Kühlturms',
  'Offener Kreislauf – Gegenstrom mit induziertem Zug',
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
  '33333333-5555-4666-8777-444444444444',
  '33333333-4444-4555-8666-bbbbbbbbbbbb',
  'tr',
  'Dolgu bölgesi ve hava akışı',
  'Soğutma kulesi dolgu bölgesi ve hava akışı görseli',
  'Dolgu bölgesi – ısı transferinde kritik alan',
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
  '33333333-5555-4666-8777-555555555555',
  '33333333-4444-4555-8666-bbbbbbbbbbbb',
  'en',
  'Fill section and airflow',
  'Cooling tower fill section and airflow image',
  'Fill section – critical area for heat transfer',
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
  '33333333-5555-4666-8777-666666666666',
  '33333333-4444-4555-8666-bbbbbbbbbbbb',
  'de',
  'Füllkörperbereich und Luftströmung',
  'Bild vom Füllkörperbereich und der Luftströmung im Kühlturm',
  'Füllkörper – kritischer Bereich für den Wärmeaustausch',
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
  '33333333-5555-4666-8777-777777777777',
  '33333333-4444-4555-8666-cccccccccccc',
  'tr',
  'Saha kurulumu örneği',
  'Endüstriyel tesiste soğutma kulesi saha kurulumu görseli',
  'Soğutma kulesi – saha uygulaması ve işletme',
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
  '33333333-5555-4666-8777-888888888888',
  '33333333-4444-4555-8666-cccccccccccc',
  'en',
  'Field installation example',
  'Cooling tower field installation image',
  'Cooling tower – field application and operation',
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
  '33333333-5555-4666-8777-999999999999',
  '33333333-4444-4555-8666-cccccccccccc',
  'de',
  'Beispiel einer Vor-Ort-Installation',
  'Bild einer Kühlturm-Installation im industriellen Einsatz',
  'Kühlturm – Vor-Ort-Anwendung und Betrieb',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),`alt`=VALUES(`alt`),`caption`=VALUES(`caption`),`updated_at`=VALUES(`updated_at`);

COMMIT;
