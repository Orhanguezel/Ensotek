-- =============================================================
-- FILE: src/db/seed/sql/library/101_002_library__ct_features.sql
-- Ensotek - Library Item Seed (CT FEATURES)
-- FINAL / CLEAN / IDEMPOTENT (DETERMINISTIC IDS) / SCHEMA-SAFE
--
-- ✅ NO variables, NO SELECT, NO dynamic/formula
-- ✅ Fixed UUIDs + ON DUPLICATE KEY UPDATE
-- ✅ 3 locales: tr / en / de (FULL CONTENT IN EACH)
-- ✅ Schema uyumlu: library / library_i18n / library_images / library_images_i18n
-- ✅ Images: 3 adet + her biri için TR/EN/DE i18n
-- ✅ FIX: library.featured_image + library.image_url artık dolu (hero/kapak için)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- =============================================================
-- 1) PARENT: library (fixed id)
--  ✅ FIX: featured_image + image_url set edildi (kapak görseli)
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
  '22222222-2222-2222-2222-222222222222',
  'other',

  'aaaa6001-1111-4111-8111-aaaaaaaa6001',  -- category (LIBRARY)
  'bbbb6001-1111-4111-8111-bbbbbbbb6001',  -- subcategory (PDF Documents)

  0,
  1,
  1,
  50,

  -- ✅ Kapak görseli (hero)
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752786288/uploads/metahub/about-images/closed-circuit-water-cooling-towers1-1752786287184-840184158.webp',
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752786288/uploads/metahub/about-images/closed-circuit-water-cooling-towers1-1752786287184-840184158.webp',
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

  -- ✅ Kapak görseli (hero)
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
  '22222222-2222-4222-8222-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'tr',

  'ensotek-sogutma-kulelerinin-ozellikleri',
  'Ensotek Soğutma Kulelerimizin Özellikleri',
  CONCAT(
    '<h2>Ensotek Soğutma Kulelerimizin Özellikleri</h2>',

    '<h3>Gövde ve Malzeme Yapısı</h3>',
    '<ol>',
      '<li><strong>CTP gövde yapısı:</strong> Ensotek soğutma kuleleri camelyaf takviyeli polyester (CTP) malzemeden imal edilir. Boyama ihtiyacı duymaz; uzun yıllar korozyona uğramadan görünümünü ve mekanik dayanımını korur.</li>',
      '<li><strong>Kimyasallara ve korozyona dayanıklılık:</strong> CTP yapı kimyasallara ve korozyona karşı yüksek direnç sağlar; metal kulelerde görülen paslanma ve yüzey bozulmaları bu yapıda minimize edilir.</li>',
      '<li><strong>Alev ilerletmeyen reçine seçeneği:</strong> Otel, hastane, AVM, rezidans gibi hassas tesislerde alev ilerletmeyen reçine ile yangın güvenliği artırılabilir.</li>',
    '</ol>',

    '<h3>Dolgu Seçenekleri</h3>',
    '<p>Proses suyunun temizliği ve işletme koşullarına göre aşağıdaki dolgu tipleri tercih edilebilir:</p>',
    '<ol>',
      '<li><strong>PVC petek dolgu (film fill):</strong> Temiz su uygulamalarında yüksek ıslak yüzey alanı sayesinde yüksek performans sağlar.</li>',
      '<li><strong>PP bigudi dolgu (splash fill):</strong> Kirli/yağlı/tufallı su ve tozlu ortamlarda tıkanma riski düşüktür; temizlenebilir ve tekrar kullanılabilir. PP, yüksek sıcaklıklı proseslerde (~100&nbsp;°C) tercih edilebilir.</li>',
      '<li><strong>PP grid dolgu:</strong> Çok kirli su koşullarında sıçratma tipi yapı ile bakım kolaylığı ve tıkanma dayanımı sağlar.</li>',
    '</ol>',

    '<h3>Dayanıklılık ve İşletme Ekonomisi</h3>',
    '<ul>',
      '<li><strong>Uzun ömür:</strong> Kompozit yapı, korozyon kaynaklı degradasyonu azaltır.</li>',
      '<li><strong>Düşük bakım maliyeti:</strong> Doğru dolgu seçimi ve korozyonun minimize edilmesi ile periyodik bakım ihtiyacı azalır.</li>',
    '</ul>',

    '<h3>Fan Konfigürasyonu ve Enerji Verimliliği</h3>',
    '<ul>',
      '<li><strong>Üstten fanlı, karşı akışlı, cebri çekişli tasarım:</strong> Nemli hava daha hızlı uzaklaşır; resirkülasyon riski azaltılabilir.</li>',
      '<li><strong>Enerji avantajı:</strong> Uygun tasarım ve işletme şartlarında cebri çekişli tasarım, cebri itişli yapılara göre enerji tüketiminde avantaj sağlayabilir.</li>',
    '</ul>',

    '<h3>Performans ve İşletme Avantajları</h3>',
    '<ul>',
      '<li><strong>Yüksek soğutma performansı:</strong> Yaş termometre değerine yaklaşım iyileşebilir; proses kararlılığı artar.</li>',
      '<li><strong>Toplam sahip olma maliyeti:</strong> Yaşam döngüsü maliyeti, enerji ve bakım avantajları ile optimize edilebilir.</li>',
      '<li><strong>Yedek parça erişimi:</strong> Fan, dolgu, nozullar ve yardımcı ekipmanlarda yedek parça temini hızlıdır.</li>',
    '</ul>'
  ),
  'Ensotek soğutma kulesi özellikleri teknik içerik görseli',
  'ensotek, ctp, grp, pvc film fill, pp splash fill, enerji verimliligi',
  'Ensotek soğutma kulelerinin özellikleri',
  'Ensotek soğutma kulelerinin CTP/GFK malzeme yapısı, dolgu seçenekleri, enerji verimliliği ve işletme avantajları.',
  'ensotek sogutma kulesi, ctp, gfk, pvc petek dolgu, pp bigudi dolgu, grid dolgu, induced draft, enerji verimliligi',

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
  '22222222-2222-4222-8222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  'en',

  'features-of-ensotek-cooling-towers',
  'Features of Ensotek Cooling Towers',
  CONCAT(
    '<h2>Features of Ensotek Cooling Towers</h2>',

    '<h3>Body and Material Structure</h3>',
    '<ul>',
      '<li><strong>GRP body:</strong> Ensotek cooling towers are made of fiberglass reinforced polyester (GRP), so painting is not required. The structure remains corrosion-resistant over long service life.</li>',
      '<li><strong>Chemical/corrosion resistance:</strong> GRP offers strong resistance to chemicals and corrosion compared to conventional metal constructions.</li>',
      '<li><strong>Flame-retardant resin option:</strong> For sensitive facilities (hotels, hospitals, malls, residences), a flame-retardant resin can be selected to improve fire safety.</li>',
    '</ul>',

    '<h3>Fill Options</h3>',
    '<p>Depending on water quality and operating conditions, the following fill types may be used:</p>',
    '<ol>',
      '<li><strong>PVC film fill:</strong> for clean circulating water; high wetted surface area supports strong thermal performance.</li>',
      '<li><strong>PP splash fill (bigudi type):</strong> preferred for dirty/oily water and dusty environments; lower clogging risk, often washable and reusable; PP can withstand high temperatures (around 100°C).</li>',
      '<li><strong>PP grid splash fill:</strong> for very dirty water where maintainability and clogging resistance are critical.</li>',
    '</ol>',

    '<h3>Durability and Operating Economy</h3>',
    '<ul>',
      '<li><strong>Long service life:</strong> composite construction reduces corrosion-related deterioration.</li>',
      '<li><strong>Lower maintenance cost:</strong> GRP body and correct fill selection help reduce routine maintenance.</li>',
    '</ul>',

    '<h3>Fan Configuration and Energy Efficiency</h3>',
    '<ul>',
      '<li><strong>Top-mounted induced-draft, counterflow design:</strong> airflow management can reduce recirculation of moist discharge air.</li>',
      '<li><strong>Energy advantage:</strong> under suitable conditions, induced-draft designs can be more energy-efficient than forced-draft layouts.</li>',
    '</ul>',

    '<h3>Performance and Operational Advantages</h3>',
    '<ul>',
      '<li><strong>High cooling performance:</strong> improved approach to wet-bulb can support stable processes and energy savings.</li>',
      '<li><strong>Total cost of ownership:</strong> lifecycle economics may be optimized through reduced maintenance and energy consumption.</li>',
      '<li><strong>Spare parts availability:</strong> fans, fills, nozzles and auxiliaries can be supplied to support uptime.</li>',
    '</ul>'
  ),
  'Technical image for cooling tower materials and fill options',
  'ensotek, grp, fill options, pvc film fill, pp splash fill, energy saving',
  'Features of Ensotek cooling towers',
  'GRP construction, fill options, fan configuration, and operational benefits of Ensotek cooling towers.',
  'ensotek cooling tower, grp, fiberglass, pvc film fill, pp splash fill, grid fill, induced draft, energy efficiency',

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
  '22222222-2222-4222-8222-333333333333',
  '22222222-2222-2222-2222-222222222222',
  'de',

  'merkmale-der-ensotek-kuehltuerme',
  'Merkmale der Ensotek Kühltürme',
  CONCAT(
    '<h2>Merkmale der Ensotek Kühltürme</h2>',

    '<h3>Gehäuse- und Materialaufbau</h3>',
    '<ul>',
      '<li><strong>CTP/GFK-Gehäuse:</strong> Ensotek Kühltürme werden aus glasfaserverstärktem Polyester gefertigt und benötigen keine Lackierung. Das Gehäuse bleibt langfristig korrosionsarm.</li>',
      '<li><strong>Beständigkeit:</strong> Hohe Beständigkeit gegen Chemikalien und Korrosion im Vergleich zu Metallkonstruktionen.</li>',
      '<li><strong>Flammhemmende Harz-Option:</strong> Für sensible Anlagen kann ein flammhemmendes Harz gewählt werden, um den Brandschutz zu erhöhen.</li>',
    '</ul>',

    '<h3>Füllkörper-Optionen</h3>',
    '<p>Je nach Wasserqualität und Betriebsbedingungen können folgende Füllkörper eingesetzt werden:</p>',
    '<ol>',
      '<li><strong>PVC-Filmfüllung:</strong> für sauberes Umlaufwasser; hohe Leistung durch große benetzte Oberfläche.</li>',
      '<li><strong>PP-Spritzfüllung (Bigudi-Typ):</strong> für verschmutztes/öliges Wasser und staubige Umgebungen; geringere Verstopfungsneigung, oft reinigbar und wiederverwendbar; temperaturbeständig (ca. 100°C).</li>',
      '<li><strong>PP-Gitter/Spritzfüllung:</strong> für sehr schmutzige Wässer in anspruchsvollen Anwendungen.</li>',
    '</ol>',

    '<h3>Haltbarkeit und Betriebskosten</h3>',
    '<ul>',
      '<li><strong>Lange Lebensdauer:</strong> Composite-Bauweise reduziert korrosionsbedingte Schäden.</li>',
      '<li><strong>Geringere Wartungskosten:</strong> Geeignete Füllkörperwahl und GFK/CTP-Gehäuse reduzieren Wartungsaufwand.</li>',
    '</ul>',

    '<h3>Ventilator-Konfiguration und Energieeffizienz</h3>',
    '<ul>',
      '<li><strong>Induzierter Zug, Gegenstrom, Ventilator oben:</strong> Luft wird angesaugt; Rezirkulationsrisiken können reduziert werden.</li>',
      '<li><strong>Energie-Vorteile:</strong> Unter passenden Bedingungen können induzierte Designs energieeffizient sein.</li>',
    '</ul>',

    '<h3>Leistung und betriebliche Vorteile</h3>',
    '<ul>',
      '<li><strong>Hohe Kühlleistung:</strong> Verbesserte Annäherung an die Feuchtkugeltemperatur kann Prozessstabilität unterstützen.</li>',
      '<li><strong>Lebenszykluskosten:</strong> Wirtschaftlichkeit kann über reduzierte Wartungs- und Energiekosten erreicht werden.</li>',
      '<li><strong>Ersatzteile:</strong> Ventilator, Füllkörper, Düsen und Zubehör sind verfügbar und unterstützen Verfügbarkeit.</li>',
    '</ul>'
  ),
  'Technisches Bild zu Materialien und Füllkörpern',
  'ensotek, kuehlturm, gfk, fuellkoerper, pvc filmfuellung, energie',
  'Merkmale der Ensotek Kühltürme',
  'CTP/GFK-Bauweise, Füllkörper-Optionen, Ventilator-Konfiguration und betriebliche Vorteile der Ensotek Kühltürme.',
  'ensotek kuehlturm, gfk, glasfaser, pvc filmfuellung, pp spritzfuellung, gitterfuellung, induced draft, energieeffizienz',

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
--  ✅ URL NULL değil, is_active=1, display_order 10/20/30
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
  '22222222-2222-4222-8222-aaaaaaaaaaaa',
  '22222222-2222-2222-2222-222222222222',
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
  '22222222-2222-4222-8222-bbbbbbbbbbbb',
  '22222222-2222-2222-2222-222222222222',
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
  '22222222-2222-4222-8222-cccccccccccc',
  '22222222-2222-2222-2222-222222222222',
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

-- IMAGE #1 I18N
INSERT INTO `library_images_i18n`
(
  `id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`
)
VALUES
(
  '33333333-3333-4333-8333-111111111111',
  '22222222-2222-4222-8222-aaaaaaaaaaaa',
  'tr',
  'Ensotek soğutma kulesi malzeme ve dolgu örneği',
  'Ensotek soğutma kulesi gövde ve dolgu örneği görseli',
  'Ensotek soğutma kulesi – malzeme ve dolgu seçenekleri',
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
  'Ensotek tower body and fill example',
  'Image showing tower body and fill examples',
  'Ensotek cooling tower – materials and fill options',
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
  'Beispiel für Gehäuse und Füllkörper',
  'Bild mit Gehäuse- und Füllkörperbeispielen',
  'Ensotek Kühlturm – Materialien und Füllkörper-Optionen',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),`alt`=VALUES(`alt`),`caption`=VALUES(`caption`),`updated_at`=VALUES(`updated_at`);

-- IMAGE #2 I18N
INSERT INTO `library_images_i18n`
(
  `id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`
)
VALUES
(
  '33333333-3333-4333-8333-444444444444',
  '22222222-2222-4222-8222-bbbbbbbbbbbb',
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
  '33333333-3333-4333-8333-555555555555',
  '22222222-2222-4222-8222-bbbbbbbbbbbb',
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
  '33333333-3333-4333-8333-666666666666',
  '22222222-2222-4222-8222-bbbbbbbbbbbb',
  'de',
  'Füllkörperbereich und Luftströmung',
  'Bild vom Füllkörperbereich und der Luftströmung im Kühlturm',
  'Füllkörper – kritischer Bereich für den Wärmeaustausch',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),`alt`=VALUES(`alt`),`caption`=VALUES(`caption`),`updated_at`=VALUES(`updated_at`);

-- IMAGE #3 I18N
INSERT INTO `library_images_i18n`
(
  `id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`
)
VALUES
(
  '33333333-3333-4333-8333-777777777777',
  '22222222-2222-4222-8222-cccccccccccc',
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
  '33333333-3333-4333-8333-888888888888',
  '22222222-2222-4222-8222-cccccccccccc',
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
  '33333333-3333-4333-8333-999999999999',
  '22222222-2222-4222-8222-cccccccccccc',
  'de',
  'Beispiel einer Vor-Ort-Installation',
  'Bild einer Kühlturm-Installation im industriellen Einsatz',
  'Kühlturm – Vor-Ort-Anwendung und Betrieb',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),`alt`=VALUES(`alt`),`caption`=VALUES(`caption`),`updated_at`=VALUES(`updated_at`);

COMMIT;
