-- =============================================================
-- FILE: 055.1_custom_pages_solutions_industrial.seed.sql (FINAL)
-- Ensotek – Solution Detail: Industrial Cooling Solutions
-- Route: /solutions/industrial-cooling-solutions
-- module_key: solutions
-- category_id: aaaa1501-... (ÇÖZÜMLER)
-- sub_category_id: bbbb2001-... (Industrial Cooling Solutions)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

SET @PAGE := '11111111-2222-3333-4444-555555555591';
SET @MODULE_KEY := 'solutions';

SET @CAT_SOLUTIONS := 'aaaa1501-1111-4111-8111-aaaaaaaa1501';
SET @SUB_INDUSTRIAL := 'bbbb2001-1111-4111-8111-bbbbbbbb2001';

SET @IMG_MAIN :=
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1400&q=80';
SET @IMG_2 :=
  'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1400&q=80';
SET @IMG_3 :=
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=80';

-- PARENT UPSERT
INSERT INTO `custom_pages`
(`id`,`module_key`,`is_published`,`featured`,`display_order`,`order_num`,
 `featured_image`,`featured_image_asset_id`,
 `image_url`,`storage_asset_id`,
 `images`,`storage_image_ids`,
 `category_id`,`sub_category_id`,
 `created_at`,`updated_at`)
VALUES
(
  @PAGE,
  @MODULE_KEY,
  1,
  0,
  41,
  41,
  @IMG_MAIN,
  NULL,
  @IMG_MAIN,
  NULL,
  JSON_ARRAY(@IMG_MAIN,@IMG_2,@IMG_3),
  JSON_ARRAY(),
  @CAT_SOLUTIONS,
  @SUB_INDUSTRIAL,
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `module_key`              = VALUES(`module_key`),
  `is_published`            = VALUES(`is_published`),
  `featured`                = VALUES(`featured`),
  `display_order`           = VALUES(`display_order`),
  `order_num`               = VALUES(`order_num`),
  `featured_image`          = VALUES(`featured_image`),
  `featured_image_asset_id` = VALUES(`featured_image_asset_id`),
  `image_url`               = VALUES(`image_url`),
  `storage_asset_id`        = VALUES(`storage_asset_id`),
  `images`                  = VALUES(`images`),
  `storage_image_ids`       = VALUES(`storage_image_ids`),
  `category_id`             = VALUES(`category_id`),
  `sub_category_id`         = VALUES(`sub_category_id`),
  `updated_at`              = VALUES(`updated_at`);

-- I18N UPSERT (slug same for all locales -> stable routing)
INSERT INTO `custom_pages_i18n`
(`id`,`page_id`,`locale`,
 `title`,`slug`,`content`,
 `summary`,`featured_image_alt`,
 `meta_title`,`meta_description`,`tags`,
 `created_at`,`updated_at`)
VALUES

-- TR
(
  UUID(),
  @PAGE,
  'tr',
  'Endüstriyel Soğutma Çözümleri',
  'industrial-cooling-solutions',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Endüstriyel tesislerde soğutma kuleleri, yüksek ısı yükleri ve değişken proses koşullarında <strong>stabil yaklaşım sıcaklığı</strong> ve <strong>güvenilir işletme</strong> sağlamak için kritik rol oynar. Ensotek; cebri çekişli, karşı akışlı kule mimarisi ile yüksek verim ve düşük enerji tüketimini hedefler.</p>',

      '<h2>Tip Seçimi: Açık / Kapalı Devre</h2>',
      '<p><strong>Açık devre</strong> çözümler; yüksek ısı transferi ve geniş kapasite aralığıyla yaygın endüstriyel uygulamalarda tercih edilir. <strong>Kapalı devre</strong> çözümler ise proses suyunun kirlenmeye hassas olduğu durumlarda serpantin üzerinden soğutma sağlayarak daha temiz ve kararlı işletme sunar.</p>',

      '<h2>Malzeme ve Dayanım</h2>',
      '<ul>',
        '<li><strong>CTP/FRP gövde:</strong> Korozyona dayanıklı, jel-coat dış yüzey ile boyasız ve uzun ömürlü yapı.</li>',
        '<li><strong>Taşıyıcı sistem:</strong> Pultruzyon CTP profiller, merdiven ve platformlarla bakım erişimi.</li>',
        '<li><strong>Bağlantılar:</strong> Uygulamaya göre paslanmaz bağlantı elemanları ve kimyasal uyum.</li>',
      '</ul>',

      '<h2>Performans Tasarımı</h2>',
      '<ul>',
        '<li><strong>Fan grubu:</strong> Aksiyal fan ve uygun motor/redüktör seçimi ile verimli hava debisi.</li>',
        '<li><strong>Su dağıtımı:</strong> Homojen dağıtım; nozul ve kolektör tasarımıyla kuru bölge riskinin azaltılması.</li>',
        '<li><strong>Dolgu seçimi:</strong> Su sıcaklığı ve kirlilik seviyesine göre PVC film / PP bigudi / grid dolgu alternatifleri.</li>',
      '</ul>',

      '<h2>Saha Koşulları ve Entegrasyon</h2>',
      '<p>Isı yükü, çevre sıcaklığı, su kimyası, yerleşim kısıtları ve bakım erişimi değerlendirilerek doğru kule tipi ve konfigürasyon belirlenir. Gerekirse modernizasyon/retrofit ve otomasyon izleme altyapılarıyla sistem performansı sürdürülebilir hale getirilir.</p>',

      '<p><a href=\"/offer\"><strong>Teklif Al</strong></a> veya <a href=\"/services\"><strong>Hizmetlerimizi İncele</strong></a>.</p>'
    )
  ),
  'Yüksek ısı yükleri için açık/kapalı devre kule seçimi, malzeme dayanımı, dolgu ve fan grubu optimizasyonu ile endüstriyel soğutma çözümü.',
  'Endüstriyel soğutma kulesi çözümleri',
  'Endüstriyel Soğutma Çözümleri | Ensotek',
  'Ensotek, endüstriyel tesisler için açık/kapalı devre su soğutma kulesi çözümleri; dayanıklı FRP/CTP gövde, doğru dolgu ve verimli fan grubu ile yüksek performans sağlar.',
  'ensotek,endustriyel sogutma,solutions,su sogutma kulesi,frp,ctp,kapali devre,acik devre,dolgu,fansistem',
  NOW(3),
  NOW(3)
),

-- EN
(
  UUID(),
  @PAGE,
  'en',
  'Industrial Cooling Solutions',
  'industrial-cooling-solutions',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>In industrial plants, cooling towers are essential to maintain a <strong>stable approach temperature</strong> and <strong>reliable operation</strong> under high heat loads and variable process conditions. Ensotek focuses on efficient <strong>induced draft, counter-flow</strong> designs to reduce energy consumption while preserving performance.</p>',

      '<h2>System Selection: Open vs. Closed Circuit</h2>',
      '<p><strong>Open circuit</strong> solutions are widely used due to high heat transfer and broad capacity range. <strong>Closed circuit</strong> solutions are preferred when process fluid cleanliness is critical, cooling the process water through coils and reducing contamination risks.</p>',

      '<h2>Materials & Durability</h2>',
      '<ul>',
        '<li><strong>FRP/CTP casing:</strong> Corrosion-resistant structure with paint-free gel-coat exterior.</li>',
        '<li><strong>Structural system:</strong> FRP pultrusion profiles with safe maintenance access (ladders/platforms).</li>',
        '<li><strong>Fasteners:</strong> Application-based stainless and chemical compatibility options.</li>',
      '</ul>',

      '<h2>Performance Engineering</h2>',
      '<ul>',
        '<li><strong>Fan group:</strong> Axial fans with correct motor/gear unit selection for efficient airflow.</li>',
        '<li><strong>Water distribution:</strong> Uniform distribution to minimize dry spots and improve heat transfer.</li>',
        '<li><strong>Fill selection:</strong> PVC film / PP ring / splash grid fills selected based on temperature and water quality.</li>',
      '</ul>',

      '<h2>Site Integration</h2>',
      '<p>We evaluate heat load, ambient conditions, water chemistry, layout constraints and maintenance access to define the optimum tower configuration. Modernization/retrofit and monitoring/automation services can be added to sustain performance over the lifecycle.</p>',

      '<p><a href=\"/offer\"><strong>Get a Quote</strong></a> or <a href=\"/services\"><strong>Explore Our Services</strong></a>.</p>'
    )
  ),
  'Industrial cooling tower selection, materials, fan/fill optimization and engineering approach for high heat-load applications.',
  'Industrial cooling tower solutions',
  'Industrial Cooling Solutions | Ensotek',
  'Ensotek delivers industrial cooling tower solutions with open/closed circuit selection, robust FRP/CTP materials, fill engineering and efficient fan systems.',
  'ensotek,industrial cooling,solutions,water cooling tower,frp,ctp,open circuit,closed circuit,fill selection,fan system',
  NOW(3),
  NOW(3)
),

-- DE
(
  UUID(),
  @PAGE,
  'de',
  'Industrielle Kühllösungen',
  'industrial-cooling-solutions',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>In Industrieanlagen sind Kühltürme entscheidend, um bei hohen Wärmelasten und wechselnden Prozessbedingungen eine <strong>stabile Approach-Temperatur</strong> und <strong>zuverlässigen Betrieb</strong> sicherzustellen. Ensotek setzt auf effiziente <strong>Saugzug-Gegenstrom</strong>-Konzepte, um Energieverbrauch zu reduzieren und Performance zu sichern.</p>',

      '<h2>Systemwahl: Offener vs. geschlossener Kreislauf</h2>',
      '<p><strong>Offene Systeme</strong> werden häufig eingesetzt (hohe Wärmeübertragung, großer Leistungsbereich). <strong>Geschlossene Systeme</strong> sind ideal, wenn das Prozessmedium sauber bleiben muss; die Kühlung erfolgt über Rohrschlangen und reduziert Kontamination.</p>',

      '<h2>Material & Beständigkeit</h2>',
      '<ul>',
        '<li><strong>GFK/CTP-Gehäuse:</strong> Korrosionsbeständig mit lackfreiem Gelcoat.</li>',
        '<li><strong>Tragwerk:</strong> GFK-Pultrusionsprofile, sichere Wartungszugänge (Leiter/Plattform).</li>',
        '<li><strong>Verbindungselemente:</strong> Je nach Anwendung Edelstahl- und Chemie-Kompatibilitätsoptionen.</li>',
      '</ul>',

      '<h2>Performance-Engineering</h2>',
      '<ul>',
        '<li><strong>Ventilatorgruppe:</strong> Axialventilatoren mit passender Motor/Getriebeauswahl.</li>',
        '<li><strong>Wasserverteilung:</strong> Homogene Verteilung zur Minimierung von Trockenstellen.</li>',
        '<li><strong>Füllkörperauswahl:</strong> PVC-Film / PP-Ring / Splash-Grid je nach Temperatur und Wasserqualität.</li>',
      '</ul>',

      '<h2>Integration am Standort</h2>',
      '<p>Wir bewerten Wärmelast, Umgebungsbedingungen, Wasserchemie, Layoutrestriktionen und Wartungszugang, um die optimale Konfiguration festzulegen. Modernisierung/Retrofit sowie Monitoring/Automatisierung können ergänzt werden, um die Lebenszyklus-Performance zu sichern.</p>',

      '<p><a href=\"/offer\"><strong>Angebot anfordern</strong></a> oder <a href=\"/services\"><strong>Unsere Services ansehen</strong></a>.</p>'
    )
  ),
  'Auswahl industrieller Kühlturm-Lösungen, Materialkonzept sowie Optimierung von Ventilator und Füllkörper für hohe Wärmelasten.',
  'Industrielle Kühlturm-Lösungen',
  'Industrielle Kühllösungen | Ensotek',
  'Ensotek bietet industrielle Kühlturm-Lösungen mit offen/geschlossen Auswahl, robusten GFK/CTP Materialien, Füllkörperauslegung und effizienten Ventilatorsystemen.',
  'ensotek,industrielle kuehlloesungen,solutions,wasserkuehlturm,gfk,ctp,offen,geschlossen,fuellkoerper,ventilator',
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`              = VALUES(`title`),
  `slug`               = VALUES(`slug`),
  `content`            = VALUES(`content`),
  `summary`            = VALUES(`summary`),
  `featured_image_alt` = VALUES(`featured_image_alt`),
  `meta_title`         = VALUES(`meta_title`),
  `meta_description`   = VALUES(`meta_description`),
  `tags`               = VALUES(`tags`),
  `updated_at`         = VALUES(`updated_at`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
