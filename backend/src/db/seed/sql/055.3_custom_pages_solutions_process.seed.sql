-- =============================================================
-- FILE: 055.3_custom_pages_solutions_process.seed.sql (FINAL)
-- Ensotek – Solution Detail: Process Cooling Solutions
-- Route: /solutions/process-cooling-solutions
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

SET @PAGE := '11111111-2222-3333-4444-555555555593';
SET @MODULE_KEY := 'solutions';

SET @CAT_SOLUTIONS := 'aaaa1501-1111-4111-8111-aaaaaaaa1501';
SET @SUB_PROCESS := 'bbbb2003-1111-4111-8111-bbbbbbbb2003';

SET @IMG_MAIN :=
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=80';
SET @IMG_2 :=
  'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1400&q=80';
SET @IMG_3 :=
  'https://images.unsplash.com/photo-1516575150278-77136aed6920?auto=format&fit=crop&w=1400&q=80';

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
  43,
  43,
  @IMG_MAIN,
  NULL,
  @IMG_MAIN,
  NULL,
  JSON_ARRAY(@IMG_MAIN,@IMG_2,@IMG_3),
  JSON_ARRAY(),
  @CAT_SOLUTIONS,
  @SUB_PROCESS,
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
  'Proses Soğutma Çözümleri',
  'process-cooling-solutions',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Proses soğutmada hedef; ürün kalitesi ve proses stabilitesi için <strong>kontrollü sıcaklık</strong> ve <strong>su kalitesinin korunmasıdır</strong>. Ensotek, prosesinize göre açık/kapalı devre kule seçimi ve yardımcı ekipmanlarla güvenilir işletmeyi destekler.</p>',

      '<h2>Su Kalitesi Kritikse: Kapalı Devre Yaklaşımı</h2>',
      '<p>Proses suyunun kirlilikten etkilenmemesi gereken uygulamalarda <strong>kapalı devre</strong> kuleler tercih edilir. Proses suyu serpantin içerisinden geçerek soğutulur; kule suyu ve dış ortam etkileri proses devresinden izole edilir.</p>',

      '<h2>Açık Devre + Filtrasyon / Şartlandırma</h2>',
      '<p>Proses koşulları uygunsa <strong>açık devre</strong> çözümler ekonomik ve yüksek verimli olabilir. Bu senaryoda su şartlandırma, filtrasyon ve periyodik bakım performansı korumada kritik rol oynar.</p>',

      '<h2>Dolgu, Nozul ve Kirlilik Yönetimi</h2>',
      '<ul>',
        '<li><strong>Dolgu seçimi:</strong> Su sıcaklığı ve kirlilik seviyesine göre film / bigudi / grid dolgu alternatifleri.</li>',
        '<li><strong>Dağıtım:</strong> Nozul ve kolektör tasarımı ile homojen dağıtım ve tıkanma riskinin azaltılması.</li>',
        '<li><strong>Bakım planı:</strong> Dolgu/nozul temizliği, drift kontrolü ve mekanik kontrollerle süreklilik.</li>',
      '</ul>',

      '<h2>İzleme ve Devreye Alma</h2>',
      '<p>Sıcaklık, debi, iletkenlik ve seviye gibi parametreler izlenerek proses güvenliği artırılır. Kurulum ve devreye alma adımlarında kontrol listeleri, testler ve operatör eğitimi ile güvenli ilk çalıştırma sağlanır.</p>',

      '<p><a href=\"/offer\"><strong>Teklif Al</strong></a> veya <a href=\"/services\"><strong>Hizmetlerimizi İncele</strong></a>.</p>'
    )
  ),
  'Proses stabilitesi için su kalitesi odaklı açık/kapalı devre kule seçimi, dolgu/nozul yönetimi, izleme ve devreye alma yaklaşımı.',
  'Proses soğutma çözümleri',
  'Proses Soğutma Çözümleri | Ensotek',
  'Ensotek, proses soğutmada su kalitesi kritik uygulamalar için kapalı devre yaklaşımı; açık devrede filtrasyon/şartlandırma, dolgu seçimi ve izleme ile güvenilir performans sunar.',
  'ensotek,proses sogutma,solutions,kapali devre,acik devre,filtrasyon,su kalitesi,dolgu,nozul,izleme',
  NOW(3),
  NOW(3)
),

-- EN
(
  UUID(),
  @PAGE,
  'en',
  'Process Cooling Solutions',
  'process-cooling-solutions',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>In process cooling, the priority is <strong>controlled temperature</strong> and <strong>protecting water quality</strong> to maintain product quality and process stability. Ensotek supports your process with open/closed circuit selection and the right auxiliary equipment.</p>',

      '<h2>When Water Quality Is Critical: Closed Circuit</h2>',
      '<p><strong>Closed circuit</strong> towers are preferred when the process fluid must remain clean. The process water is cooled through coils while tower water and ambient effects are isolated from the process loop.</p>',

      '<h2>Open Circuit with Filtration / Treatment</h2>',
      '<p>Where applicable, <strong>open circuit</strong> solutions can be cost-effective and efficient. In that scenario, water treatment, filtration and periodic maintenance are essential to preserve performance.</p>',

      '<h2>Fill/Nozzle Strategy & Fouling Control</h2>',
      '<ul>',
        '<li><strong>Fill selection:</strong> Film / ring / splash grid options based on temperature and water quality.</li>',
        '<li><strong>Distribution:</strong> Uniform distribution and reduced clogging risk via correct nozzle/collector design.</li>',
        '<li><strong>Maintenance plan:</strong> Fill/nozzle cleaning, drift control and mechanical inspections.</li>',
      '</ul>',

      '<h2>Monitoring & Commissioning</h2>',
      '<p>Monitoring temperature, flow, conductivity and level improves process reliability. Installation and commissioning follow checklists and testing, concluding with safe startup and operator training.</p>',

      '<p><a href=\"/offer\"><strong>Get a Quote</strong></a> or <a href=\"/services\"><strong>Explore Our Services</strong></a>.</p>'
    )
  ),
  'Process cooling solutions with water-quality driven open/closed circuit selection, fill/nozzle strategy, monitoring and commissioning.',
  'Process cooling solutions',
  'Process Cooling Solutions | Ensotek',
  'Ensotek delivers process cooling solutions with closed circuit options for clean loops, open circuit systems with treatment/filtration, and engineering-based fill selection and monitoring.',
  'ensotek,process cooling,solutions,closed circuit,open circuit,filtration,water quality,fill selection,nozzles,monitoring',
  NOW(3),
  NOW(3)
),

-- DE
(
  UUID(),
  @PAGE,
  'de',
  'Prozesskühllösungen',
  'process-cooling-solutions',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Bei der Prozesskühlung stehen <strong>kontrollierte Temperaturen</strong> und der <strong>Schutz der Wasserqualität</strong> im Mittelpunkt, um Produktqualität und Prozessstabilität sicherzustellen. Ensotek unterstützt mit offen/geschlossen Auswahl und passenden Zusatzkomponenten.</p>',

      '<h2>Wenn Wasserqualität kritisch ist: Geschlossener Kreislauf</h2>',
      '<p><strong>Geschlossene</strong> Systeme werden bevorzugt, wenn das Prozessmedium sauber bleiben muss. Die Prozessflüssigkeit wird über Rohrschlangen gekühlt; Turmwasser und Umgebungseinflüsse bleiben vom Prozesskreislauf getrennt.</p>',

      '<h2>Offener Kreislauf mit Filtration / Aufbereitung</h2>',
      '<p>Wo möglich, sind <strong>offene</strong> Systeme wirtschaftlich und effizient. Dann sind Wasseraufbereitung, Filtration und regelmäßige Wartung entscheidend, um die Leistung zu erhalten.</p>',

      '<h2>Füllkörper/Düsen-Strategie & Fouling-Kontrolle</h2>',
      '<ul>',
        '<li><strong>Füllkörperauswahl:</strong> Film / Ring / Splash-Grid je nach Temperatur und Wasserqualität.</li>',
        '<li><strong>Verteilung:</strong> Homogene Verteilung, geringeres Verstopfungsrisiko durch Düsen-/Kollektorauslegung.</li>',
        '<li><strong>Wartungsplan:</strong> Reinigung von Füllkörpern/Düsen, Drift-Kontrolle und mechanische Inspektionen.</li>',
      '</ul>',

      '<h2>Monitoring & Inbetriebnahme</h2>',
      '<p>Monitoring von Temperatur, Durchfluss, Leitfähigkeit und Füllstand erhöht die Prozesssicherheit. Installation und Inbetriebnahme folgen Checklisten und Tests – inklusive sicherem Start und Bedienerschulung.</p>',

      '<p><a href=\"/offer\"><strong>Angebot anfordern</strong></a> oder <a href=\"/services\"><strong>Unsere Services ansehen</strong></a>.</p>'
    )
  ),
  'Prozesskühlung mit wasserqualitätsorientierter offen/geschlossen Auswahl, Füllkörper/Düsen-Strategie, Monitoring und Inbetriebnahme.',
  'Prozesskühllösungen',
  'Prozesskühllösungen | Ensotek',
  'Ensotek bietet Prozesskühllösungen mit geschlossenen Systemen für saubere Kreisläufe, offenen Systemen mit Aufbereitung/Filtration sowie engineering-basierter Füllkörperauslegung und Monitoring.',
  'ensotek,prozesskuehlung,solutions,geschlossen,offen,filtration,wasserqualitaet,fuellkoerper,duesen,monitoring',
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
