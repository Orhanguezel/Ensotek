-- =============================================================
-- FILE: 015_spareparts_seed_1_7.sql (FINAL / FULL)
-- Ensotek – Spareparts seed (1..7) + i18n (TR + EN + DE)
-- FIX:
--  - products.item_type => 'sparepart'
--  - specifications JSON normalized: specs + options + faqs + reviews
-- NOTES:
--  - products: assumes PRIMARY/UNIQUE key on products.id
--  - product_i18n: assumes UNIQUE(product_id, locale)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =========================
-- 1) BASE PRODUCTS (SPAREPARTS 1..7)
-- =========================

INSERT INTO products (
  id,
  item_type,
  category_id,
  sub_category_id,
  price,
  image_url,
  storage_asset_id,
  images,
  storage_image_ids,
  is_active,
  is_featured,
  order_num,
  product_code,
  stock_quantity,
  rating,
  review_count
)
VALUES
  -- SPAREPART 1: Fan Motoru
  (
    'bbbb1001-2222-4222-8222-bbbbbbbb1001',
    'sparepart',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1004-1111-4111-8111-bbbbbbbb1004',
    9500.00,
    'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    1,
    1,
    'SP-FAN-001',
    10,
    4.80,
    3
  ),

  -- SPAREPART 2: PVC Dolgu Bloğu
  (
    'bbbb1002-2222-4222-8222-bbbbbbbb1002',
    'sparepart',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1003-1111-4111-8111-bbbbbbbb1003',
    4200.00,
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    2,
    'SP-FILL-001',
    50,
    4.90,
    5
  ),

  -- SPAREPART 3: Motor ve Redüktör
  (
    'bbbb1003-2222-4222-8222-bbbbbbbb1003',
    'sparepart',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1004-1111-4111-8111-bbbbbbbb1004',
    17500.00,
    'https://images.unsplash.com/photo-1581092335397-9fa341108c0c?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581092335397-9fa341108c0c?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    1,
    3,
    'SP-DRV-001',
    6,
    4.70,
    4
  ),

  -- SPAREPART 4: Titreşim Şalteri
  (
    'bbbb1004-2222-4222-8222-bbbbbbbb1004',
    'sparepart',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1004-1111-4111-8111-bbbbbbbb1004',
    2850.00,
    'https://images.unsplash.com/photo-1581091870622-2c6ef11b4d2b?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581091870622-2c6ef11b4d2b?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    4,
    'SP-VIB-001',
    25,
    4.60,
    7
  ),

  -- SPAREPART 5: Fan (Vantilatör)
  (
    'bbbb1005-2222-4222-8222-bbbbbbbb1005',
    'sparepart',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1004-1111-4111-8111-bbbbbbbb1004',
    9800.00,
    'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    1,
    5,
    'SP-FAN-002',
    12,
    4.75,
    6
  ),

  -- SPAREPART 6: Servis Penceresi / Dolgu Boşaltma Kapağı
  (
    'bbbb1006-2222-4222-8222-bbbbbbbb1006',
    'sparepart',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1002-1111-4111-8111-bbbbbbbb1002',
    1650.00,
    'https://images.unsplash.com/photo-1581579185169-7b8b0d0a3f4f?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581579185169-7b8b0d0a3f4f?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    6,
    'SP-SRV-001',
    40,
    4.55,
    9
  ),

  -- SPAREPART 7: Su Dağıtım Sistemi
  (
    'bbbb1007-2222-4222-8222-bbbbbbbb1007',
    'sparepart',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1001-1111-4111-8111-bbbbbbbb1001',
    7400.00,
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    1,
    7,
    'SP-WDS-001',
    18,
    4.65,
    5
  )
ON DUPLICATE KEY UPDATE
  item_type         = VALUES(item_type),
  category_id       = VALUES(category_id),
  sub_category_id   = VALUES(sub_category_id),
  price             = VALUES(price),
  image_url         = VALUES(image_url),
  storage_asset_id  = VALUES(storage_asset_id),
  images            = VALUES(images),
  storage_image_ids = VALUES(storage_image_ids),
  is_active         = VALUES(is_active),
  is_featured       = VALUES(is_featured),
  order_num         = VALUES(order_num),
  product_code      = VALUES(product_code),
  stock_quantity    = VALUES(stock_quantity),
  rating            = VALUES(rating),
  review_count      = VALUES(review_count);

-- =========================
-- 2) PRODUCT I18N (TR + EN + DE) for 1..7
--  - specifications JSON schema:
--    {
--      "specs": {...},
--      "options": [...],
--      "faqs": [...],
--      "reviews": {"avg":..., "count":..., "top":"..."}
--    }
-- =========================

INSERT INTO product_i18n (
  product_id,
  locale,
  title,
  slug,
  description,
  alt,
  tags,
  specifications,
  meta_title,
  meta_description
)
VALUES
  -- =========================================================
  -- SPAREPART 1: Fan Motoru
  -- =========================================================
  (
    'bbbb1001-2222-4222-8222-bbbbbbbb1001',
    'tr',
    'Kule Fan Motoru',
    'kule-fan-motoru',
    'Soğutma kuleleri için yüksek verimli fan motoru. Endüstriyel çalışmaya uygun, uzun ömürlü ve düşük bakım gereksinimli yapı.',
    'Soğutma kulesi fan motoru',
    JSON_ARRAY('sparepart','fan motoru','fan','motor','ensotek'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'powerRange','7,5 kW – 30 kW',
        'protectionClass','IP55 / IP56 (projeye göre)',
        'insulationClass','F',
        'mounting','Düşey flanşlı (V1)',
        'notes','Fan çapı Ø ≤ 1600 mm olan kulelerde yalnız motor; daha büyük kulelerde motor + redüktör kombinasyonu önerilir.'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','power','label','Güç seçimi','values',JSON_ARRAY('7,5 kW','11 kW','15 kW','18,5 kW','22 kW','30 kW')),
        JSON_OBJECT('key','voltage','label','Gerilim','values',JSON_ARRAY('400V 3 Faz 50Hz','(opsiyon) 60Hz'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Hangi kulelerde redüktör gerekir?','a','Fan çapı büyüdükçe motorla birlikte redüktör kullanımı tercih edilir. Proje debi ve fan çapına göre netleştirilir.'),
        JSON_OBJECT('q','Koruma/izolasyon sınıfı nedir?','a','Endüstriyel ortamlar için IP sınıfı ve F sınıfı izolasyon tercih edilir.')
      ),
      'reviews', JSON_OBJECT('avg',4.8,'count',3,'top','Sessiz çalışma ve stabil performans')
    ),
    'Kule Fan Motoru | Ensotek Yedek Parçalar',
    'Soğutma kuleleri için yüksek verimli fan motoru. V1 montaj, F sınıfı izolasyon ve IP koruma ile endüstriyel kullanıma uygundur.'
  ),
  (
    'bbbb1001-2222-4222-8222-bbbbbbbb1001',
    'en',
    'Cooling Tower Fan Motor',
    'cooling-tower-fan-motor',
    'High-efficiency fan motor for cooling towers. Built for industrial operation with long service life and low maintenance needs.',
    'Cooling tower fan motor',
    JSON_ARRAY('sparepart','fan motor','fan','motor','ensotek'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'powerRange','7.5 kW – 30 kW',
        'protectionClass','IP55 / IP56 (project-dependent)',
        'insulationClass','F',
        'mounting','Vertical flange (V1)',
        'notes','For fan diameter Ø ≤ 1600 mm, motor-only is commonly used; for larger sizes, motor + reducer is recommended.'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','power','label','Power selection','values',JSON_ARRAY('7.5 kW','11 kW','15 kW','18.5 kW','22 kW','30 kW')),
        JSON_OBJECT('key','frequency','label','Frequency','values',JSON_ARRAY('50 Hz','(optional) 60 Hz'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','When do I need a reducer?','a','As fan diameter increases, a motor + reducer combination is preferred. Final selection depends on project requirements.'),
        JSON_OBJECT('q','What insulation/protection classes are used?','a','Industrial-grade IP protection and Class F insulation are commonly specified.')
      ),
      'reviews', JSON_OBJECT('avg',4.8,'count',3,'top','Stable, efficient operation')
    ),
    'Cooling Tower Fan Motor | Ensotek Spare Parts',
    'High-efficiency cooling tower fan motor with vertical flange mounting, Class F insulation and industrial-grade IP protection.'
  ),
  (
    'bbbb1001-2222-4222-8222-bbbbbbbb1001',
    'de',
    'Ventilatormotor für Kühltürme',
    'kuehlturm-ventilatormotor',
    'Hocheffizienter Ventilatormotor für Kühltürme. Ausgelegt für den Industrieeinsatz mit langer Lebensdauer und geringem Wartungsaufwand.',
    'Ventilatormotor für Kühlturm',
    JSON_ARRAY('ersatzteil','ventilatormotor','kuehlturm','motor','ensotek'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'powerRange','7,5 kW – 30 kW',
        'protectionClass','IP55 / IP56 (projektabhängig)',
        'insulationClass','F',
        'mounting','Vertikaler Flansch (V1)',
        'notes','Bei Ø ≤ 1600 mm häufig nur Motor; bei größeren Durchmessern Motor + Getriebe/Reduzierer empfohlen.'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','power','label','Leistung','values',JSON_ARRAY('7,5 kW','11 kW','15 kW','18,5 kW','22 kW','30 kW')),
        JSON_OBJECT('key','netz','label','Netz','values',JSON_ARRAY('400V 3~ 50Hz','(optional) 60Hz'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Wann wird ein Getriebe benötigt?','a','Mit zunehmendem Ventilatordurchmesser wird oft Motor + Getriebe eingesetzt. Die Auslegung erfolgt projektspezifisch.'),
        JSON_OBJECT('q','Welche Schutz-/Isolationsklassen sind üblich?','a','Industrieüblich sind IP-Schutz und Isolationsklasse F.')
      ),
      'reviews', JSON_OBJECT('avg',4.8,'count',3,'top','Ruhiger Lauf, stabiler Betrieb')
    ),
    'Ventilatormotor für Kühltürme | Ensotek Ersatzteile',
    'Hocheffizienter Ventilatormotor für Kühltürme mit V1-Flanschmontage, Isolationsklasse F und IP-Schutz für den Industrieeinsatz.'
  ),

  -- =========================================================
  -- SPAREPART 2: PVC Dolgu Bloğu
  -- =========================================================
  (
    'bbbb1002-2222-4222-8222-bbbbbbbb1002',
    'tr',
    'PVC Film Dolgu (Dolgu Bloğu)',
    'pvc-film-dolgu-blogu',
    'Düşük sıcaklıklı proses sularında (maks. ~55°C) ısı transfer yüzeyini artıran PVC film dolgu. Temiz veya çok temiz su uygulamalarında tercih edilir.',
    'Soğutma kulesi PVC film dolgu',
    JSON_ARRAY('sparepart','dolgu','pvc','film dolgu','ısı transfer'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'material','PVC',
        'maxProcessTemp','~55°C',
        'application','Temiz / çok temiz proses suyu',
        'performance','Geniş ısı transfer yüzeyi sayesinde yüksek performans'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','type','label','Tip','values',JSON_ARRAY('PVC CF-12','PVC CF-19','PVC CF-30')),
        JSON_OBJECT('key','blockSize','label','Blok ölçüsü','values',JSON_ARRAY('Projeye göre özel'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Kirli suda kullanılabilir mi?','a','Çok kirli su uygulamalarında grid dolgu veya PP bigudi tercih edilir.'),
        JSON_OBJECT('q','Hangi tip seçilmeli?','a','CF-12/19/30 seçimleri kule ve proses koşullarına göre yapılır.')
      ),
      'reviews', JSON_OBJECT('avg',4.9,'count',5,'top','Performans artışı ve kolay bakım')
    ),
    'PVC Film Dolgu | Ensotek Yedek Parçalar',
    'Maks. ~55°C proses sularında kullanılan PVC film dolgu. Temiz su uygulamalarında yüksek ısı transfer performansı sunar.'
  ),
  (
    'bbbb1002-2222-4222-8222-bbbbbbbb1002',
    'en',
    'PVC Film Fill (Fill Block)',
    'pvc-film-fill-block',
    'PVC film fill that increases heat transfer surface for low-temperature process waters (max ~55°C). Preferred for clean or very clean water applications.',
    'Cooling tower PVC film fill',
    JSON_ARRAY('sparepart','fill media','pvc','film fill','heat transfer'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'material','PVC',
        'maxProcessTemp','~55°C',
        'application','Clean / very clean process water',
        'performance','High performance due to large heat transfer surface'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','type','label','Type','values',JSON_ARRAY('PVC CF-12','PVC CF-19','PVC CF-30')),
        JSON_OBJECT('key','blockSize','label','Block size','values',JSON_ARRAY('Custom per project'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Can it be used with dirty water?','a','For very dirty water, splash grid fill or PP ring fill is recommended.'),
        JSON_OBJECT('q','Which type should I choose?','a','CF-12/19/30 selection depends on tower and process conditions.')
      ),
      'reviews', JSON_OBJECT('avg',4.9,'count',5,'top','Efficient heat exchange')
    ),
    'PVC Film Fill | Ensotek Spare Parts',
    'PVC film fill for max ~55°C process waters. Provides high heat-transfer performance for clean-water applications.'
  ),
  (
    'bbbb1002-2222-4222-8222-bbbbbbbb1002',
    'de',
    'PVC-Film-Füllkörper (Füllblock)',
    'pvc-film-fuellkoerper-block',
    'PVC-Film-Füllkörper zur Vergrößerung der Wärmeübertragungsfläche bei niedrigen Prozesstemperaturen (max. ~55°C). Geeignet für sauberes bzw. sehr sauberes Wasser.',
    'PVC-Film-Füllkörper für Kühlturm',
    JSON_ARRAY('ersatzteil','fuellkoerper','pvc','filmfuellung','waermeuebertragung'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'material','PVC',
        'maxProcessTemp','~55°C',
        'application','Sauberes / sehr sauberes Prozesswasser',
        'performance','Hohe Leistung dank großer Wärmeübertragungsfläche'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','type','label','Typ','values',JSON_ARRAY('PVC CF-12','PVC CF-19','PVC CF-30')),
        JSON_OBJECT('key','blockSize','label','Blockgröße','values',JSON_ARRAY('Projektabhängig'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Für stark verschmutztes Wasser geeignet?','a','Bei stark verschmutztem Wasser werden Grid-Füllkörper oder PP-Ringfüllkörper empfohlen.'),
        JSON_OBJECT('q','Wie wähle ich den Typ?','a','CF-12/19/30 wird je nach Prozess- und Anlagenbedingungen ausgewählt.')
      ),
      'reviews', JSON_OBJECT('avg',4.9,'count',5,'top','Sehr gute Wärmeübertragung')
    ),
    'PVC-Film-Füllkörper | Ensotek Ersatzteile',
    'PVC-Film-Füllkörper für Prozesswasser bis ca. 55°C. Hohe Wärmeübertragungsleistung bei sauberen Wasseranwendungen.'
  ),

  -- =========================================================
  -- SPAREPART 3: Motor ve Redüktör
  -- =========================================================
  (
    'bbbb1003-2222-4222-8222-bbbbbbbb1003',
    'tr',
    'Motor ve Redüktör Grubu',
    'motor-ve-reduktor-grubu',
    'Kulenin çatı bölümünde fan ve fan bacası ile birlikte çalışan motor-redüktör grubu. Fan grubunun ana tahrik ekipmanıdır.',
    'Soğutma kulesi motor ve redüktör',
    JSON_ARRAY('sparepart','redüktör','gear unit','tahrik','fan grubu'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'mounting','V1 konumunda düşey flanşlı tip',
        'protectionClass','IP56',
        'insulationClass','F',
        'fanSpeed','52–60 m/s çevre hızı (CTI standart aralığında)',
        'notes','Ø ≤ 1600 mm fan çapında motor-only; daha büyük fanlarda motor + redüktör kullanımı yaygındır.'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','ratio','label','Redüksiyon oranı','values',JSON_ARRAY('Projeye göre')),
        JSON_OBJECT('key','service','label','Bakım paketi','values',JSON_ARRAY('Standart','Periyodik bakım + yedek yağ kiti'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Redüktörlü sistemin avantajı nedir?','a','Büyük fan çaplarında torku optimize ederek güvenilir ve verimli tahrik sağlar.'),
        JSON_OBJECT('q','Montaj konumu nedir?','a','Düşey flanşlı (V1) konum yaygın kullanımdır.')
      ),
      'reviews', JSON_OBJECT('avg',4.7,'count',4,'top','Yük altında stabil çalışma')
    ),
    'Motor ve Redüktör | Ensotek Yedek Parçalar',
    'Kule fan grubunun ana tahrik ekipmanı: motor ve redüktör grubu. IP56 ve F sınıfı izolasyon ile endüstriyel dayanım.'
  ),
  (
    'bbbb1003-2222-4222-8222-bbbbbbbb1003',
    'en',
    'Motor & Reducer Assembly',
    'motor-reducer-assembly',
    'Motor-reducer assembly working together with the fan and fan stack on the tower deck. The primary drive equipment of the fan group.',
    'Cooling tower motor and reducer',
    JSON_ARRAY('sparepart','reducer','gear unit','drive','fan group'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'mounting','Vertical flange (V1)',
        'protectionClass','IP56',
        'insulationClass','F',
        'fanSpeed','52–60 m/s tip speed (within CTI range)',
        'notes','Motor-only is typical for Ø ≤ 1600 mm; motor + reducer is preferred for larger fans.'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','ratio','label','Reduction ratio','values',JSON_ARRAY('Project-dependent')),
        JSON_OBJECT('key','service','label','Service package','values',JSON_ARRAY('Standard','Periodic service + oil kit'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Why use a reducer?','a','It optimizes torque for larger fans and improves reliability under load.'),
        JSON_OBJECT('q','What mounting position is used?','a','Vertical flange mounting (V1) is commonly applied.')
      ),
      'reviews', JSON_OBJECT('avg',4.7,'count',4,'top','Reliable under continuous duty')
    ),
    'Motor & Reducer | Ensotek Spare Parts',
    'Primary fan drive equipment for cooling towers: motor and reducer assembly with IP56 protection and Class F insulation.'
  ),
  (
    'bbbb1003-2222-4222-8222-bbbbbbbb1003',
    'de',
    'Motor- und Getriebeeinheit',
    'motor-getriebeeinheit',
    'Motor-Getriebeeinheit, die zusammen mit Ventilator und Ventilatorhaube im oberen Bereich arbeitet. Zentrales Antriebselement der Ventilatorgruppe.',
    'Motor und Getriebe für Kühlturm',
    JSON_ARRAY('ersatzteil','getriebe','antrieb','ventilatorgruppe','kuehlturm'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'mounting','Vertikaler Flansch (V1)',
        'protectionClass','IP56',
        'insulationClass','F',
        'fanSpeed','52–60 m/s Umfangsgeschwindigkeit (CTI-Bereich)',
        'notes','Bei Ø ≤ 1600 mm oft Motor-only; bei größeren Ventilatoren Motor + Getriebe üblich.'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','ratio','label','Übersetzung','values',JSON_ARRAY('Projektabhängig')),
        JSON_OBJECT('key','service','label','Servicepaket','values',JSON_ARRAY('Standard','Wartung + Öl-Kit'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Warum ein Getriebe einsetzen?','a','Für größere Ventilatoren wird das Drehmoment optimiert und die Betriebssicherheit erhöht.'),
        JSON_OBJECT('q','Welche Montageposition?','a','Vertikale Flanschmontage (V1) ist gängiger Standard.')
      ),
      'reviews', JSON_OBJECT('avg',4.7,'count',4,'top','Stabil im Dauerbetrieb')
    ),
    'Motor & Getriebe | Ensotek Ersatzteile',
    'Zentrale Antriebseinheit für Kühlturmventilatoren: Motor und Getriebe mit IP56-Schutz und Isolationsklasse F.'
  ),

  -- =========================================================
  -- SPAREPART 4: Titreşim Şalteri
  -- =========================================================
  (
    'bbbb1004-2222-4222-8222-bbbbbbbb1004',
    'tr',
    'Titreşim Şalteri',
    'titresim-salteri',
    'Fan grubunda oluşan titreşimi algılayarak elektrik motorunun devreden çıkmasını sağlar. Alüminyum gövdeli; siviç kontaklı, cıva kontaklı ve manyetik tip seçenekleri bulunur.',
    'Soğutma kulesi titreşim şalteri',
    JSON_ARRAY('sparepart','titreşim','vibration switch','koruma','fan'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'function','Titreşimi algılar, motoru korumak için devreyi keser',
        'body','Alüminyum gövde'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','type','label','Tip','values',JSON_ARRAY('Siviç kontaklı','Cıva kontaklı','Manyetik tip')),
        JSON_OBJECT('key','mounting','label','Montaj','values',JSON_ARRAY('Fan bacası yanında (kule üstü)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Neden titreşim şalteri gerekli?','a','Anormal titreşimlerde motoru devreden çıkararak hasarı ve plansız duruşu azaltır.'),
        JSON_OBJECT('q','Hangi tip tercih edilmeli?','a','Saha koşulları ve güvenlik prosedürlerine göre belirlenir.')
      ),
      'reviews', JSON_OBJECT('avg',4.6,'count',7,'top','Koruma amaçlı güvenilir ekipman')
    ),
    'Titreşim Şalteri | Ensotek Yedek Parçalar',
    'Fan grubunda titreşimi algılayarak motoru koruyan titreşim şalteri. Siviç, cıva ve manyetik tip seçenekleri.'
  ),
  (
    'bbbb1004-2222-4222-8222-bbbbbbbb1004',
    'en',
    'Vibration Switch',
    'vibration-switch',
    'Detects vibration in the fan group and shuts down the electric motor for protection. Available in switch-contact, mercury-contact and magnetic types.',
    'Cooling tower vibration switch',
    JSON_ARRAY('sparepart','vibration switch','protection','fan group'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'function','Detects abnormal vibration and trips motor circuit',
        'body','Aluminum body'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','type','label','Type','values',JSON_ARRAY('Switch contact','Mercury contact','Magnetic type')),
        JSON_OBJECT('key','mounting','label','Mounting','values',JSON_ARRAY('Near fan stack (tower top)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Why do I need a vibration switch?','a','It reduces risk of damage and unplanned downtime by stopping the motor under abnormal vibration.'),
        JSON_OBJECT('q','Which type should I select?','a','Selection depends on site conditions and safety requirements.')
      ),
      'reviews', JSON_OBJECT('avg',4.6,'count',7,'top','Effective protection against failures')
    ),
    'Vibration Switch | Ensotek Spare Parts',
    'Vibration switch for fan groups that trips the motor circuit under abnormal vibration. Multiple contact type options available.'
  ),
  (
    'bbbb1004-2222-4222-8222-bbbbbbbb1004',
    'de',
    'Vibrationsschalter',
    'vibrationsschalter',
    'Erkennt Vibrationen in der Ventilatorgruppe und schaltet den Motor zum Schutz ab. Verfügbar als Schaltkontakt-, Quecksilberkontakt- und Magnettyp.',
    'Vibrationsschalter für Kühlturm',
    JSON_ARRAY('ersatzteil','vibration','schutz','ventilatorgruppe'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'function','Erkennt unzulässige Vibration und trennt den Motorstromkreis',
        'body','Aluminiumgehäuse'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','type','label','Typ','values',JSON_ARRAY('Schaltkontakt','Quecksilberkontakt','Magnettyp')),
        JSON_OBJECT('key','mounting','label','Montage','values',JSON_ARRAY('Neben der Ventilatorhaube (oben)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Warum ist ein Vibrationsschalter sinnvoll?','a','Er schützt Motor und Anlage, indem er bei abnormaler Vibration abschaltet.'),
        JSON_OBJECT('q','Welcher Typ ist der richtige?','a','Die Auswahl erfolgt anhand der Einsatzbedingungen und Sicherheitsanforderungen.')
      ),
      'reviews', JSON_OBJECT('avg',4.6,'count',7,'top','Zuverlässiger Anlagenschutz')
    ),
    'Vibrationsschalter | Ensotek Ersatzteile',
    'Vibrationsschalter für Ventilatorgruppen: schaltet bei abnormaler Vibration ab und schützt Motor und Anlage. Mehrere Typen verfügbar.'
  ),

  -- =========================================================
  -- SPAREPART 5: Fan
  -- =========================================================
  (
    'bbbb1005-2222-4222-8222-bbbbbbbb1005',
    'tr',
    'Kule Fanı (Vantilatör)',
    'kule-fani-vantilator',
    'Soğutma kulelerinde, tahrik grubundan aldığı hareket ile kule içindeki havanın akışını sağlayan fan. Fan kanatları ayarlanabilir açıya sahiptir; uygulamaya göre malzeme seçimi yapılır.',
    'Soğutma kulesi fanı (vantilatör)',
    JSON_ARRAY('sparepart','fan','vantilatör','fan kanadı','ensotek'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'function','Kule içinde hava akışı sağlar',
        'blade','Ayarlanabilir kanat açısı',
        'materials','Alüminyum / Camelyaf takviyeli PP (uygulamaya göre)',
        'notes','Fan çapı ve kanat açısı seçimleri kapasite ve ses hedeflerine göre yapılır.'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Malzeme','values',JSON_ARRAY('Alüminyum','Camelyaf takviyeli PP')),
        JSON_OBJECT('key','bladeAngle','label','Kanat açısı','values',JSON_ARRAY('Projeye göre ayarlanır'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Kanat açısı neden ayarlanır?','a','Hava debisi, basınç ve ses seviyesini optimize etmek için kanat açısı ayarlanır.'),
        JSON_OBJECT('q','Hangi malzeme tercih edilmeli?','a','Çevre koşulları, kimyasal etkiler ve hedef ömür dikkate alınarak seçilir.')
      ),
      'reviews', JSON_OBJECT('avg',4.75,'count',6,'top','Debi/ses optimizasyonu kolay')
    ),
    'Kule Fanı | Ensotek Yedek Parçalar',
    'Ayarlanabilir kanat açılı kule fanı. Alüminyum veya camelyaf takviyeli PP seçenekleriyle hava akışını optimize eder.'
  ),
  (
    'bbbb1005-2222-4222-8222-bbbbbbbb1005',
    'en',
    'Cooling Tower Fan',
    'cooling-tower-fan',
    'Fan that provides airflow inside the cooling tower by transmitting motion from the drive group. Features adjustable blade angle; material is selected based on application.',
    'Cooling tower fan',
    JSON_ARRAY('sparepart','fan','cooling tower','fan blades','ensotek'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'function','Provides airflow inside the tower',
        'blade','Adjustable blade angle',
        'materials','Aluminum / Glass-fiber reinforced PP (application-dependent)',
        'notes','Fan diameter and blade angle are selected based on capacity and noise targets.'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Material','values',JSON_ARRAY('Aluminum','Glass-fiber reinforced PP')),
        JSON_OBJECT('key','bladeAngle','label','Blade angle','values',JSON_ARRAY('Adjustable per project'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Why is blade angle adjustable?','a','To optimize airflow, pressure and noise level.'),
        JSON_OBJECT('q','Which material should I choose?','a','Chosen according to ambient conditions, chemical exposure and expected service life.')
      ),
      'reviews', JSON_OBJECT('avg',4.75,'count',6,'top','Easy airflow/noise tuning')
    ),
    'Cooling Tower Fan | Ensotek Spare Parts',
    'Cooling tower fan with adjustable blade angle. Aluminum or glass-fiber reinforced PP options for airflow optimization.'
  ),
  (
    'bbbb1005-2222-4222-8222-bbbbbbbb1005',
    'de',
    'Kühlturmventilator',
    'kuehlturmventilator',
    'Ventilator, der durch den Antrieb die Luftströmung im Kühlturm erzeugt. Die Schaufelstellung ist verstellbar; die Materialauswahl erfolgt anwendungsabhängig.',
    'Ventilator für Kühlturm',
    JSON_ARRAY('ersatzteil','ventilator','kuehlturm','schaufeln','ensotek'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'function','Erzeugt Luftströmung im Turm',
        'blade','Verstellbarer Schaufelwinkel',
        'materials','Aluminium / glasfaserverstärktes PP (anwendungsabhängig)',
        'notes','Durchmesser und Winkel werden nach Leistungs- und Geräuschziel ausgelegt.'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Material','values',JSON_ARRAY('Aluminium','Glasfaserverstärktes PP')),
        JSON_OBJECT('key','bladeAngle','label','Schaufelwinkel','values',JSON_ARRAY('Projektabhängig einstellbar'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Warum ist der Schaufelwinkel verstellbar?','a','Zur Optimierung von Volumenstrom, Druck und Geräusch.'),
        JSON_OBJECT('q','Welches Material ist geeignet?','a','Auswahl je nach Umgebung, chemischer Belastung und gewünschter Lebensdauer.')
      ),
      'reviews', JSON_OBJECT('avg',4.75,'count',6,'top','Gute Anpassbarkeit')
    ),
    'Kühlturmventilator | Ensotek Ersatzteile',
    'Kühlturmventilator mit verstellbarem Schaufelwinkel. Aluminium oder glasfaserverstärktes PP zur Luftstromoptimierung.'
  ),

  -- =========================================================
  -- SPAREPART 6: Servis Penceresi / Dolgu Boşaltma Kapağı
  -- =========================================================
  (
    'bbbb1006-2222-4222-8222-bbbbbbbb1006',
    'tr',
    'Servis Penceresi / Dolgu Boşaltma Kapağı',
    'servis-penceresi-dolgu-bosaltma-kapagi',
    'Kule alt haznesinde dolgu malzemelerine erişim ve bakım için kullanılan servis penceresi. Dolgu bloklarının söküm/boşaltımını kolaylaştırır; gövde malzemesi FRP olup bağlantı elemanları paslanmaz seçeneklidir.',
    'Soğutma kulesi servis penceresi',
    JSON_ARRAY('sparepart','servis penceresi','bakım','dolgu boşaltma','frp'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'function','Bakım ve dolgu sökümü için erişim',
        'body','FRP (CTP) gövde',
        'fasteners','AISI 304 paslanmaz (opsiyon)',
        'notes','Mevcut kule ölçülerine göre özel ebat üretilebilir.'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','size','label','Ölçü','values',JSON_ARRAY('Standart','Projeye göre özel')),
        JSON_OBJECT('key','fasteners','label','Bağlantı','values',JSON_ARRAY('Standart','AISI 304 paslanmaz'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Hangi durumda servis penceresi gerekir?','a','Dolgu değişimi, temizlik ve periyodik bakım süreçlerinde hızlı erişim için önerilir.'),
        JSON_OBJECT('q','Paslanmaz bağlantı ne sağlar?','a','Korozyon dayanımını artırır ve servis ömrünü uzatır.')
      ),
      'reviews', JSON_OBJECT('avg',4.55,'count',9,'top','Bakım süresini ciddi azaltıyor')
    ),
    'Servis Penceresi | Ensotek Yedek Parçalar',
    'FRP gövdeli servis penceresi. Dolgu bakımı ve sökümü için hızlı erişim sağlar; AISI 304 paslanmaz bağlantı opsiyonu.'
  ),
  (
    'bbbb1006-2222-4222-8222-bbbbbbbb1006',
    'en',
    'Service Window / Fill Drain Hatch',
    'service-window-fill-drain-hatch',
    'Service window for accessing fill media in the tower basin during maintenance. Facilitates removal/draining of fill blocks; FRP body with optional stainless fasteners.',
    'Cooling tower service window',
    JSON_ARRAY('sparepart','service window','maintenance','fill drain','frp'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'function','Access for maintenance and fill replacement',
        'body','FRP body',
        'fasteners','AISI 304 stainless (optional)',
        'notes','Can be manufactured in custom sizes based on tower dimensions.'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','size','label','Size','values',JSON_ARRAY('Standard','Custom')),
        JSON_OBJECT('key','fasteners','label','Fasteners','values',JSON_ARRAY('Standard','AISI 304 stainless'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','When do I need a service window?','a','Recommended for fast access during fill replacement, cleaning and periodic maintenance.'),
        JSON_OBJECT('q','Why choose stainless fasteners?','a','Improves corrosion resistance and extends service life.')
      ),
      'reviews', JSON_OBJECT('avg',4.55,'count',9,'top','Significantly reduces downtime')
    ),
    'Service Window | Ensotek Spare Parts',
    'FRP service window for quick access to fill media. Optional AISI 304 stainless fasteners for enhanced corrosion resistance.'
  ),
  (
    'bbbb1006-2222-4222-8222-bbbbbbbb1006',
    'de',
    'Servicefenster / Füllkörper-Entleerklappe',
    'servicefenster-fuellkoerper-klappe',
    'Servicefenster im unteren Bereich für Wartung und Zugriff auf die Füllkörper. Erleichtert Demontage/Entleerung; FRP-Gehäuse mit optionalen Edelstahlschrauben.',
    'Servicefenster für Kühlturm',
    JSON_ARRAY('ersatzteil','servicefenster','wartung','fuellkoerper','frp'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'function','Zugang für Wartung und Füllkörperwechsel',
        'body','FRP-Gehäuse',
        'fasteners','AISI 304 Edelstahl (optional)',
        'notes','Fertigung in Sondermaßen nach Turmabmessungen möglich.'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','size','label','Abmessung','values',JSON_ARRAY('Standard','Sondermaß')),
        JSON_OBJECT('key','fasteners','label','Befestigung','values',JSON_ARRAY('Standard','AISI 304 Edelstahl'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Wann ist ein Servicefenster sinnvoll?','a','Für schnellen Zugriff bei Füllkörperwechsel, Reinigung und periodischer Wartung.'),
        JSON_OBJECT('q','Vorteil von Edelstahlbefestigung?','a','Bessere Korrosionsbeständigkeit und längere Lebensdauer.')
      ),
      'reviews', JSON_OBJECT('avg',4.55,'count',9,'top','Wartung deutlich schneller')
    ),
    'Servicefenster | Ensotek Ersatzteile',
    'FRP-Servicefenster für schnellen Zugang. Optional AISI 304 Edelstahlbefestigung für höhere Korrosionsbeständigkeit.'
  ),

  -- =========================================================
  -- SPAREPART 7: Su Dağıtım Sistemi
  -- =========================================================
  (
    'bbbb1007-2222-4222-8222-bbbbbbbb1007',
    'tr',
    'Su Dağıtım Sistemi',
    'su-dagitim-sistemi',
    'Sıcak suyun dolgu yüzeyine dengeli şekilde dağıtılmasını sağlar. Kule modeline göre PVC, PP veya CTP borulama çözümleri ile tasarlanır.',
    'Soğutma kulesi su dağıtım sistemi',
    JSON_ARRAY('sparepart','su dağıtım','borulama','nozul','ensotek'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'function','Suyu dolgu üzerine homojen dağıtır',
        'materials','PVC / PP / CTP',
        'notes','Temiz su uygulamalarında film dolgu performansını artırmak için uniform dağıtım kritik önemdedir.'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Malzeme','values',JSON_ARRAY('PVC','PP','CTP')),
        JSON_OBJECT('key','layout','label','Yerleşim','values',JSON_ARRAY('Kuleye özel proje'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Dağıtım sistemi neden önemlidir?','a','Eşit dağıtım ısı transferini artırır, kuru noktaları ve kireçlenmeyi azaltır.'),
        JSON_OBJECT('q','Hangi malzeme seçilmeli?','a','Su kimyası, sıcaklık ve mekanik şartlara göre seçilir.')
      ),
      'reviews', JSON_OBJECT('avg',4.65,'count',5,'top','Daha stabil ısı transferi')
    ),
    'Su Dağıtım Sistemi | Ensotek Yedek Parçalar',
    'PVC/PP/CTP seçenekli su dağıtım sistemi. Dolgu üzerinde homojen dağıtım sağlayarak ısı transferini optimize eder.'
  ),
  (
    'bbbb1007-2222-4222-8222-bbbbbbbb1007',
    'en',
    'Water Distribution System',
    'water-distribution-system',
    'Ensures uniform distribution of hot water over the fill surface. Designed per tower model using PVC, PP or FRP piping solutions.',
    'Cooling tower water distribution system',
    JSON_ARRAY('sparepart','water distribution','piping','nozzle','ensotek'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'function','Uniformly distributes water over fill',
        'materials','PVC / PP / FRP',
        'notes','Uniform distribution is critical to maximize film fill performance and avoid dry spots.'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Material','values',JSON_ARRAY('PVC','PP','FRP')),
        JSON_OBJECT('key','layout','label','Layout','values',JSON_ARRAY('Custom per tower'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Why is distribution important?','a','Uniform wetting improves heat transfer and reduces scaling and dry zones.'),
        JSON_OBJECT('q','Which material should I use?','a','Selected based on water chemistry, temperature and mechanical constraints.')
      ),
      'reviews', JSON_OBJECT('avg',4.65,'count',5,'top','More consistent cooling')
    ),
    'Water Distribution System | Ensotek Spare Parts',
    'Water distribution system with PVC/PP/FRP options. Optimizes heat transfer by ensuring uniform wetting of the fill.'
  ),
  (
    'bbbb1007-2222-4222-8222-bbbbbbbb1007',
    'de',
    'Wasserverteilersystem',
    'wasserverteilersystem',
    'Sorgt für eine gleichmäßige Verteilung des warmen Wassers auf der Füllkörperoberfläche. Je nach Turm als PVC-, PP- oder FRP-Rohrsystem ausgeführt.',
    'Wasserverteilersystem für Kühlturm',
    JSON_ARRAY('ersatzteil','wasserverteilung','rohrsystem','duesen','ensotek'),
    JSON_OBJECT(
      'specs', JSON_OBJECT(
        'function','Gleichmäßige Benetzung der Füllkörper',
        'materials','PVC / PP / FRP',
        'notes','Gleichmäßige Verteilung ist entscheidend für hohe Wärmeübertragung und weniger Trockenstellen.'
      ),
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Material','values',JSON_ARRAY('PVC','PP','FRP')),
        JSON_OBJECT('key','layout','label','Ausführung','values',JSON_ARRAY('Turmspezifisch'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Warum ist die Verteilung wichtig?','a','Gleichmäßige Benetzung erhöht die Wärmeübertragung und reduziert Verkalkung.'),
        JSON_OBJECT('q','Welches Material ist geeignet?','a','Auswahl nach Wasserchemie, Temperatur und mechanischen Bedingungen.')
      ),
      'reviews', JSON_OBJECT('avg',4.65,'count',5,'top','Konstant gute Benetzung')
    ),
    'Wasserverteilersystem | Ensotek Ersatzteile',
    'Wasserverteilersystem mit PVC/PP/FRP Optionen. Optimiert die Wärmeübertragung durch gleichmäßige Benetzung.'
  )

ON DUPLICATE KEY UPDATE
  title            = VALUES(title),
  slug             = VALUES(slug),
  description      = VALUES(description),
  alt              = VALUES(alt),
  tags             = VALUES(tags),
  specifications   = VALUES(specifications),
  meta_title       = VALUES(meta_title),
  meta_description = VALUES(meta_description);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
