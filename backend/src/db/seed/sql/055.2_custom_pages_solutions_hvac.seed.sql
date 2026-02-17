-- =============================================================
-- FILE: 055.2_custom_pages_solutions_hvac.seed.sql (FINAL)
-- Ensotek – Solution Detail: HVAC Cooling Solutions
-- Route: /solutions/hvac-cooling-solutions
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

SET @PAGE := '11111111-2222-3333-4444-555555555592';
SET @MODULE_KEY := 'solutions';

SET @CAT_SOLUTIONS := 'aaaa1501-1111-4111-8111-aaaaaaaa1501';
SET @SUB_HVAC := 'bbbb2002-1111-4111-8111-bbbbbbbb2002';

SET @IMG_MAIN :=
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80';
SET @IMG_2 :=
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80';
SET @IMG_3 :=
  'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80';

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
  42,
  42,
  @IMG_MAIN,
  NULL,
  @IMG_MAIN,
  NULL,
  JSON_ARRAY(@IMG_MAIN,@IMG_2,@IMG_3),
  JSON_ARRAY(),
  @CAT_SOLUTIONS,
  @SUB_HVAC,
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

-- I18N UPSERT
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
  'HVAC Soğutma Çözümleri',
  'hvac-cooling-solutions',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>HVAC uygulamalarında (AVM, otel, hastane, ofis, veri merkezi vb.) hedef; <strong>stabil soğutma suyu sıcaklığı</strong>, <strong>düşük ses</strong> ve <strong>yüksek enerji verimliliğidir</strong>. Ensotek, proje koşullarına göre kule seçimi ve ekipman optimizasyonu ile işletme maliyetlerini düşürmeyi amaçlar.</p>',

      '<h2>HVAC için Doğru Kule Seçimi</h2>',
      '<ul>',
        '<li><strong>Açık devre</strong>: Standart HVAC kondenser suyu uygulamalarında yaygın, ekonomik ve verimli çözüm.</li>',
        '<li><strong>Kapalı devre</strong>: Kirlilik riskinin azaltılması istenen veya devre ayrımı tercih edilen projelerde.</li>',
      '</ul>',

      '<h2>Ses ve Enerji Optimizasyonu</h2>',
      '<ul>',
        '<li><strong>Fan/motor seçimi:</strong> Uygun fan çevre hızı ve motor seçimi ile enerji tüketimi dengelenir.</li>',
        '<li><strong>VFD opsiyonu:</strong> Kısmi yüklerde fan hız kontrolü ile enerji tasarrufu ve konfor.</li>',
        '<li><strong>Resirkülasyon önleme:</strong> Cebri çekişli tasarım ve doğru yerleşim ile performans sürekliliği.</li>',
      '</ul>',

      '<h2>Su Kimyası ve İşletme Sürekliliği</h2>',
      '<p>HVAC kulelerinde su şartlandırma ve periyodik bakım; dolgu tıkanması, korozyon ve biyolojik riskleri azaltır. Doğru dolgu/nozul seçimi ve bakım planı ile performans stabil kalır.</p>',

      '<h2>Projelendirme ve Devreye Alma</h2>',
      '<p>Keşif, kapasite/ısı yükü analizi, yerleşim ve erişim kriterleri ile kule konfigürasyonu belirlenir. Kurulum ve devreye alma hizmetleri ile güvenli ilk çalıştırma ve operatör eğitimleri tamamlanır.</p>',

      '<p><a href=\"/offer\"><strong>Teklif Al</strong></a> veya <a href=\"/services\"><strong>Hizmetlerimizi İncele</strong></a>.</p>'
    )
  ),
  'AVM/otel/ofis gibi HVAC projelerinde düşük ses, enerji verimliliği, stabil yaklaşım sıcaklığı ve bakım odaklı kule çözümleri.',
  'HVAC soğutma kulesi çözümleri',
  'HVAC Soğutma Çözümleri | Ensotek',
  'Ensotek, HVAC projeleri için açık/kapalı devre soğutma kulesi çözümleri; ses/enerji optimizasyonu, su kimyası ve devreye alma desteği sunar.',
  'ensotek,hvac,solutions,sogutma kulesi,dusuk ses,vfd,enerji verimliligi,kondenser suyu',
  NOW(3),
  NOW(3)
),

-- EN
(
  UUID(),
  @PAGE,
  'en',
  'HVAC Cooling Solutions',
  'hvac-cooling-solutions',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>In HVAC applications (shopping malls, hotels, hospitals, offices, data centers, etc.), the goal is <strong>stable cooling water temperature</strong>, <strong>low noise</strong>, and <strong>high energy efficiency</strong>. Ensotek optimizes tower selection and key components to reduce total cost of ownership.</p>',

      '<h2>Selecting the Right Tower for HVAC</h2>',
      '<ul>',
        '<li><strong>Open circuit</strong>: Common and efficient solution for condenser water systems.</li>',
        '<li><strong>Closed circuit</strong>: Preferred when reduced contamination risk or circuit separation is required.</li>',
      '</ul>',

      '<h2>Noise & Energy Optimization</h2>',
      '<ul>',
        '<li><strong>Fan/motor engineering:</strong> Balancing fan tip speed and motor selection for efficiency.</li>',
        '<li><strong>VFD option:</strong> Variable speed control at partial loads for energy savings and comfort.</li>',
        '<li><strong>Recirculation prevention:</strong> Induced draft design and proper layout to sustain performance.</li>',
      '</ul>',

      '<h2>Water Chemistry & Reliability</h2>',
      '<p>Water treatment and periodic maintenance reduce fouling, corrosion and biological risks. Correct fill/nozzle choices and a maintenance plan keep performance stable.</p>',

      '<h2>Engineering & Commissioning</h2>',
      '<p>We define configuration based on survey, heat load analysis, layout constraints and service access. Installation and commissioning ensure safe startup and operator training.</p>',

      '<p><a href=\"/offer\"><strong>Get a Quote</strong></a> or <a href=\"/services\"><strong>Explore Our Services</strong></a>.</p>'
    )
  ),
  'HVAC cooling tower solutions focusing on low noise, energy efficiency, stable approach temperature and maintenance-based reliability.',
  'HVAC cooling tower solutions',
  'HVAC Cooling Solutions | Ensotek',
  'Ensotek provides HVAC cooling tower solutions with open/closed circuit options, noise/energy optimization, water chemistry guidance and commissioning support.',
  'ensotek,hvac,solutions,cooling tower,low noise,vfd,energy efficiency,condenser water',
  NOW(3),
  NOW(3)
),

-- DE
(
  UUID(),
  @PAGE,
  'de',
  'HVAC-Kühllösungen',
  'hvac-cooling-solutions',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Bei HVAC-Anwendungen (Einkaufszentren, Hotels, Krankenhäuser, Büros, Rechenzentren usw.) stehen <strong>stabile Kühlwassertemperaturen</strong>, <strong>geringe Geräuschentwicklung</strong> und <strong>hohe Energieeffizienz</strong> im Vordergrund. Ensotek optimiert Turmauswahl und Komponenten, um die Betriebskosten zu senken.</p>',

      '<h2>Die richtige Turmauswahl für HVAC</h2>',
      '<ul>',
        '<li><strong>Offener Kreislauf</strong>: Gängig und effizient für Kondensatorwassersysteme.</li>',
        '<li><strong>Geschlossener Kreislauf</strong>: Wenn geringeres Kontaminationsrisiko oder Kreislauftrennung gefordert ist.</li>',
      '</ul>',

      '<h2>Geräusch- & Energieoptimierung</h2>',
      '<ul>',
        '<li><strong>Ventilator/Motor-Auslegung:</strong> Effizienz durch abgestimmte Umfangsgeschwindigkeit und Motorauswahl.</li>',
        '<li><strong>VFD-Option:</strong> Drehzahlregelung bei Teillast für Einsparungen und Komfort.</li>',
        '<li><strong>Resirkulation vermeiden:</strong> Saugzug-Design und korrekte Aufstellung zur Leistungsstabilität.</li>',
      '</ul>',

      '<h2>Wasserchemie & Betriebssicherheit</h2>',
      '<p>Wasseraufbereitung und regelmäßige Wartung reduzieren Fouling, Korrosion und biologische Risiken. Passende Füllkörper/Düsen und ein Wartungsplan stabilisieren die Leistung.</p>',

      '<h2>Engineering & Inbetriebnahme</h2>',
      '<p>Konfiguration wird anhand Begehung, Wärmelastanalyse, Layout und Servicezugang definiert. Installation und Inbetriebnahme sichern einen sicheren Start inkl. Schulung.</p>',

      '<p><a href=\"/offer\"><strong>Angebot anfordern</strong></a> oder <a href=\"/services\"><strong>Unsere Services ansehen</strong></a>.</p>'
    )
  ),
  'HVAC-Kühlturm-Lösungen mit Fokus auf geringe Geräusche, Energieeffizienz, stabile Approach-Temperatur und wartungsbasierte Zuverlässigkeit.',
  'HVAC Kühlturm-Lösungen',
  'HVAC-Kühllösungen | Ensotek',
  'Ensotek bietet HVAC-Kühlturm-Lösungen mit offen/geschlossen Optionen, Geräusch-/Energieoptimierung, Wasserchemie und Inbetriebnahme-Support.',
  'ensotek,hvac,solutions,kuehlturm,geraeuscharm,vfd,energieeffizienz,kondensatorwasser',
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
