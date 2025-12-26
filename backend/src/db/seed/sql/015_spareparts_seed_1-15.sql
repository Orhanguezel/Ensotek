-- =============================================================
-- FILE: 015_spareparts_seed.sql (FINAL / FULL)
-- Ensotek – Spareparts seed (1..15) + i18n (TR + EN + DE)
-- Fix: SPAREPART 12 (DE) options.values JSONArray -> JSON_ARRAY
-- Notes:
--  - products: assumes PRIMARY/UNIQUE key on products.id
--  - product_i18n: assumes UNIQUE(product_id, locale)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =========================
-- 1) BASE PRODUCTS (SPAREPARTS 1..15)
-- =========================

INSERT INTO products (
  id,
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
  ),

  -- SPAREPART 8: Fıskiye / Nozul (Set)
  (
    'bbbb1008-2222-4222-8222-bbbbbbbb1008',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1001-1111-4111-8111-bbbbbbbb1001',
    950.00,
    'https://images.unsplash.com/photo-1581092918367-3e41f5b7f1b4?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581092918367-3e41f5b7f1b4?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    8,
    'SP-NOZ-001',
    200,
    4.70,
    12
  ),

  -- SPAREPART 9: Taşıyıcı Profiller (FRP Pultrusion Profiles)
  (
    'bbbb1009-2222-4222-8222-bbbbbbbb1009',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1001-1111-4111-8111-bbbbbbbb1001',
    3200.00,
    'https://images.unsplash.com/photo-1581093804475-1e7b0a3dd1b2?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581093804475-1e7b0a3dd1b2?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    9,
    'SP-FRP-001',
    80,
    4.50,
    8
  ),

  -- SPAREPART 10: Damla Tutucular (Drift Eliminators)
  (
    'bbbb1010-2222-4222-8222-bbbbbbbb1010',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1001-1111-4111-8111-bbbbbbbb1001',
    2600.00,
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    1,
    10,
    'SP-DRF-001',
    120,
    4.65,
    11
  ),

  -- SPAREPART 11: PP Bigudi Dolgu (PP Ring Fills)
  (
    'bbbb1011-2222-4222-8222-bbbbbbbb1011',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1003-1111-4111-8111-bbbbbbbb1003',
    3900.00,
    'https://images.unsplash.com/photo-1581091215367-59ab6b1d9b01?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581091215367-59ab6b1d9b01?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    11,
    'SP-RING-001',
    140,
    4.60,
    10
  ),

  -- SPAREPART 12: Sıçratma Tipi Grid Dolgu (Splash Grid Fill)
  (
    'bbbb1012-2222-4222-8222-bbbbbbbb1012',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1003-1111-4111-8111-bbbbbbbb1003',
    5100.00,
    'https://images.unsplash.com/photo-1581093588401-22d0d6c1b2b1?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581093588401-22d0d6c1b2b1?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    12,
    'SP-GRID-001',
    60,
    4.55,
    6
  ),

  -- SPAREPART 13: Rashing Halkası (Scrubber Packing)
  (
    'bbbb1013-2222-4222-8222-bbbbbbbb1013',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1003-1111-4111-8111-bbbbbbbb1003',
    2400.00,
    'https://images.unsplash.com/photo-1581092334681-0b8f3e2a2d7b?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581092334681-0b8f3e2a2d7b?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    13,
    'SP-RASH-001',
    180,
    4.40,
    5
  ),

  -- SPAREPART 14: Hava Giriş Filtresi
  (
    'bbbb1014-2222-4222-8222-bbbbbbbb1014',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1002-1111-4111-8111-bbbbbbbb1002',
    1950.00,
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    14,
    'SP-FLTR-001',
    55,
    4.45,
    7
  ),

  -- SPAREPART 15: Kule Üstü Platform
  (
    'bbbb1015-2222-4222-8222-bbbbbbbb1015',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1002-1111-4111-8111-bbbbbbbb1002',
    6800.00,
    'https://images.unsplash.com/photo-1541976844346-f18aeac57b06?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1541976844346-f18aeac57b06?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    15,
    'SP-PLAT-001',
    20,
    4.50,
    4
  )
ON DUPLICATE KEY UPDATE
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
-- 2) PRODUCT I18N (TR + EN + DE) for 1..15
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
    'de',
    'Kule Fan Motoru',
    'kule-fan-motoru',
    'Soğutma kuleleri için yüksek verimli fan motoru. Endüstriyel çalışmaya uygun, uzun ömürlü ve düşük bakım gereksinimli yapı.',
    'Soğutma kulesi fan motoru',
    JSON_ARRAY('sparepart','fan motoru','fan','motor','ensotek'),
    JSON_OBJECT(
      'powerRange','7,5 kW – 30 kW',
      'protectionClass','IP55 / IP56 (projeye göre)',
      'insulationClass','F',
      'mounting','Düşey flanşlı (V1)',
      'notes','Fan çapı Ø ≤ 1600 mm olan kulelerde yalnız motor; daha büyük kulelerde motor + redüktör kombinasyonu önerilir.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','power','label','Güç seçimi','values',JSON_ARRAY('7,5 kW','11 kW','15 kW','18,5 kW','22 kW','30 kW')),
        JSON_OBJECT('key','voltage','label','Gerilim','values',JSON_ARRAY('400V 3 Faz 50Hz','(opsiyon) 60Hz'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Hangi kulelerde redüktör gerekir?','a','Fan çapı büyüdükçe motorla birlikte redüktör kullanımı tercih edilir. Proje debi ve fan çapına göre netleştirilir.'),
        JSON_OBJECT('q','Koruma/izolasyon sınıfı nedir?','a','Endüstriyel ortamlar için IP sınıfı ve F sınıfı izolasyon tercih edilir.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.8,'count',3,'top','Sessiz çalışma ve stabil performans')
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
      'powerRange','7.5 kW – 30 kW',
      'protectionClass','IP55 / IP56 (project-dependent)',
      'insulationClass','F',
      'mounting','Vertical flange (V1)',
      'notes','For fan diameter Ø ≤ 1600 mm, motor-only is commonly used; for larger sizes, motor + reducer is recommended.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','power','label','Power selection','values',JSON_ARRAY('7.5 kW','11 kW','15 kW','18.5 kW','22 kW','30 kW')),
        JSON_OBJECT('key','frequency','label','Frequency','values',JSON_ARRAY('50 Hz','(optional) 60 Hz'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','When do I need a reducer?','a','As fan diameter increases, a motor + reducer combination is preferred. Final selection depends on project requirements.'),
        JSON_OBJECT('q','What insulation/protection classes are used?','a','Industrial-grade IP protection and Class F insulation are commonly specified.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.8,'count',3,'top','Stable, efficient operation')
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
      'powerRange','7,5 kW – 30 kW',
      'protectionClass','IP55 / IP56 (projektabhängig)',
      'insulationClass','F',
      'mounting','Vertikaler Flansch (V1)',
      'notes','Bei Ø ≤ 1600 mm häufig nur Motor; bei größeren Durchmessern Motor + Getriebe/Reduzierer empfohlen.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','power','label','Leistung','values',JSON_ARRAY('7,5 kW','11 kW','15 kW','18,5 kW','22 kW','30 kW')),
        JSON_OBJECT('key','netz','label','Netz','values',JSON_ARRAY('400V 3~ 50Hz','(optional) 60Hz'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Wann wird ein Getriebe benötigt?','a','Mit zunehmendem Ventilatordurchmesser wird oft Motor + Getriebe eingesetzt. Die Auslegung erfolgt projektspezifisch.'),
        JSON_OBJECT('q','Welche Schutz-/Isolationsklassen sind üblich?','a','Industrieüblich sind IP-Schutz und Isolationsklasse F.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.8,'count',3,'top','Ruhiger Lauf, stabiler Betrieb')
    ),
    'Ventilatormotor für Kühltürme | Ensotek Ersatzteile',
    'Hocheffizienter Ventilatormotor für Kühltürme mit V1-Flanschmontage, Isolationsklasse F und IP-Schutz für den Industrieeinsatz.'
  ),

  -- =========================================================
  -- SPAREPART 2: PVC Dolgu Bloğu
  -- =========================================================
  (
    'bbbb1002-2222-4222-8222-bbbbbbbb1002',
    'de',
    'PVC Film Dolgu (Dolgu Bloğu)',
    'pvc-film-dolgu-blogu',
    'Düşük sıcaklıklı proses sularında (maks. ~55°C) ısı transfer yüzeyini artıran PVC film dolgu. Temiz veya çok temiz su uygulamalarında tercih edilir.',
    'Soğutma kulesi PVC film dolgu',
    JSON_ARRAY('sparepart','dolgu','pvc','film dolgu','isi transfer'),
    JSON_OBJECT(
      'material','PVC',
      'maxProcessTemp','~55°C',
      'application','Temiz / çok temiz proses suyu',
      'performance','Geniş ısı transfer yüzeyi sayesinde yüksek performans',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','type','label','Tip','values',JSON_ARRAY('PVC CF-12','PVC CF-19','PVC CF-30')),
        JSON_OBJECT('key','blockSize','label','Blok ölçüsü','values',JSON_ARRAY('Projeye göre özel'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Kirli suda kullanılabilir mi?','a','Çok kirli su uygulamalarında grid dolgu veya PP bigudi tercih edilir.'),
        JSON_OBJECT('q','Hangi tip seçilmeli?','a','CF-12/19/30 seçimleri kule ve proses koşullarına göre yapılır.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.9,'count',5,'top','Performans artışı ve kolay bakım')
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
      'material','PVC',
      'maxProcessTemp','~55°C',
      'application','Clean / very clean process water',
      'performance','High performance due to large heat transfer surface',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','type','label','Type','values',JSON_ARRAY('PVC CF-12','PVC CF-19','PVC CF-30')),
        JSON_OBJECT('key','blockSize','label','Block size','values',JSON_ARRAY('Custom per project'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Can it be used with dirty water?','a','For very dirty water, splash grid fill or PP ring fill is recommended.'),
        JSON_OBJECT('q','Which type should I choose?','a','CF-12/19/30 selection depends on tower and process conditions.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.9,'count',5,'top','Efficient heat exchange')
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
      'material','PVC',
      'maxProcessTemp','~55°C',
      'application','Sauberes / sehr sauberes Prozesswasser',
      'performance','Hohe Leistung dank großer Wärmeübertragungsfläche',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','type','label','Typ','values',JSON_ARRAY('PVC CF-12','PVC CF-19','PVC CF-30')),
        JSON_OBJECT('key','blockSize','label','Blockgröße','values',JSON_ARRAY('Projektabhängig'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Für stark verschmutztes Wasser geeignet?','a','Bei stark verschmutztem Wasser werden Grid-Füllkörper oder PP-Ringfüllkörper empfohlen.'),
        JSON_OBJECT('q','Wie wähle ich den Typ?','a','CF-12/19/30 wird je nach Prozess- und Anlagenbedingungen ausgewählt.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.9,'count',5,'top','Sehr gute Wärmeübertragung')
    ),
    'PVC-Film-Füllkörper | Ensotek Ersatzteile',
    'PVC-Film-Füllkörper für Prozesswasser bis ca. 55°C. Hohe Wärmeübertragungsleistung bei sauberen Wasseranwendungen.'
  ),

  -- =========================================================
  -- SPAREPART 3: Motor ve Redüktör
  -- =========================================================
  (
    'bbbb1003-2222-4222-8222-bbbbbbbb1003',
    'de',
    'Motor ve Redüktör Grubu',
    'motor-ve-reduktor-grubu',
    'Kulenin çatı bölümünde fan ve fan bacası ile birlikte çalışan motor-redüktör grubu. Fan grubunun ana tahrik ekipmanıdır.',
    'Soğutma kulesi motor ve redüktör',
    JSON_ARRAY('sparepart','reduktor','gear unit','tahrik','fan grubu'),
    JSON_OBJECT(
      'mounting','V1 konumunda düşey flanşlı tip',
      'protectionClass','IP56',
      'insulationClass','F',
      'fanSpeed','52–60 m/s çevre hızı (CTI standart aralığında)',
      'notes','Ø ≤ 1600 mm fan çapında motor-only; daha büyük fanlarda motor + redüktör kullanımı yaygındır.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','ratio','label','Redüksiyon oranı','values',JSON_ARRAY('Projeye göre')),
        JSON_OBJECT('key','service','label','Bakım paketi','values',JSON_ARRAY('Standart','Periyodik bakım + yedek yağ kiti'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Redüktörlü sistemin avantajı nedir?','a','Büyük fan çaplarında torku optimize ederek güvenilir ve verimli tahrik sağlar.'),
        JSON_OBJECT('q','Montaj konumu nedir?','a','Düşey flanşlı (V1) konum yaygın kullanımdır.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.7,'count',4,'top','Yük altında stabil çalışma')
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
      'mounting','Vertical flange (V1)',
      'protectionClass','IP56',
      'insulationClass','F',
      'fanSpeed','52–60 m/s tip speed (within CTI range)',
      'notes','Motor-only is typical for Ø ≤ 1600 mm; motor + reducer is preferred for larger fans.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','ratio','label','Reduction ratio','values',JSON_ARRAY('Project-dependent')),
        JSON_OBJECT('key','service','label','Service package','values',JSON_ARRAY('Standard','Periodic service + oil kit'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Why use a reducer?','a','It optimizes torque for larger fans and improves reliability under load.'),
        JSON_OBJECT('q','What mounting position is used?','a','Vertical flange mounting (V1) is commonly applied.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.7,'count',4,'top','Reliable under continuous duty')
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
      'mounting','Vertikaler Flansch (V1)',
      'protectionClass','IP56',
      'insulationClass','F',
      'fanSpeed','52–60 m/s Umfangsgeschwindigkeit (CTI-Bereich)',
      'notes','Bei Ø ≤ 1600 mm oft Motor-only; bei größeren Ventilatoren Motor + Getriebe üblich.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','ratio','label','Übersetzung','values',JSON_ARRAY('Projektabhängig')),
        JSON_OBJECT('key','service','label','Servicepaket','values',JSON_ARRAY('Standard','Wartung + Öl-Kit'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Warum ein Getriebe einsetzen?','a','Für größere Ventilatoren wird das Drehmoment optimiert und die Betriebssicherheit erhöht.'),
        JSON_OBJECT('q','Welche Montageposition?','a','Vertikale Flanschmontage (V1) ist gängiger Standard.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.7,'count',4,'top','Stabil im Dauerbetrieb')
    ),
    'Motor & Getriebe | Ensotek Ersatzteile',
    'Zentrale Antriebseinheit für Kühlturmventilatoren: Motor und Getriebe mit IP56-Schutz und Isolationsklasse F.'
  ),

  -- =========================================================
  -- SPAREPART 4: Titreşim Şalteri
  -- =========================================================
  (
    'bbbb1004-2222-4222-8222-bbbbbbbb1004',
    'de',
    'Titreşim Şalteri',
    'titresim-salteri',
    'Fan grubunda oluşan titreşimi algılayarak elektrik motorunun devreden çıkmasını sağlar. Alüminyum gövdeli; siviç kontaklı, cıva kontaklı ve manyetik tip seçenekleri bulunur.',
    'Soğutma kulesi titreşim şalteri',
    JSON_ARRAY('sparepart','titresim','vibration switch','koruma','fan'),
    JSON_OBJECT(
      'function','Titreşimi algılar, motoru korumak için devreyi keser',
      'body','Alüminyum gövde',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','type','label','Tip','values',JSON_ARRAY('Siviç kontaklı','Cıva kontaklı','Manyetik tip')),
        JSON_OBJECT('key','mounting','label','Montaj','values',JSON_ARRAY('Fan bacası yanında (kule üstü)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Neden titreşim şalteri gerekli?','a','Anormal titreşimlerde motoru devreden çıkararak hasarı ve plansız duruşu azaltır.'),
        JSON_OBJECT('q','Hangi tip tercih edilmeli?','a','Saha koşulları ve güvenlik prosedürlerine göre belirlenir.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.6,'count',7,'top','Koruma amaçlı güvenilir ekipman')
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
      'function','Detects abnormal vibration and trips motor circuit',
      'body','Aluminum body',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','type','label','Type','values',JSON_ARRAY('Switch contact','Mercury contact','Magnetic type')),
        JSON_OBJECT('key','mounting','label','Mounting','values',JSON_ARRAY('Near fan stack (tower top)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Why do I need a vibration switch?','a','It reduces risk of damage and unplanned downtime by stopping the motor under abnormal vibration.'),
        JSON_OBJECT('q','Which type should I select?','a','Selection depends on site conditions and safety requirements.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.6,'count',7,'top','Effective protection against failures')
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
      'function','Erkennt unzulässige Vibration und trennt den Motorstromkreis',
      'body','Aluminiumgehäuse',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','type','label','Typ','values',JSON_ARRAY('Schaltkontakt','Quecksilberkontakt','Magnettyp')),
        JSON_OBJECT('key','mounting','label','Montage','values',JSON_ARRAY('Neben der Ventilatorhaube (oben)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Warum ist ein Vibrationsschalter sinnvoll?','a','Er schützt Motor und Anlage, indem er bei abnormaler Vibration abschaltet.'),
        JSON_OBJECT('q','Welcher Typ ist der richtige?','a','Die Auswahl erfolgt anhand der Einsatzbedingungen und Sicherheitsanforderungen.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.6,'count',7,'top','Zuverlässiger Anlagenschutz')
    ),
    'Vibrationsschalter | Ensotek Ersatzteile',
    'Vibrationsschalter für Ventilatorgruppen: schaltet bei abnormaler Vibration ab und schützt Motor und Anlage. Mehrere Typen verfügbar.'
  ),

  -- =========================================================
  -- SPAREPART 5: Fan
  -- =========================================================
  (
    'bbbb1005-2222-4222-8222-bbbbbbbb1005',
    'de',
    'Kule Fanı (Vantilatör)',
    'kule-fani-vantilator',
    'Soğutma kulelerinde, tahrik grubundan aldığı hareket ile kule içindeki havanın akışını sağlayan fan. Fan kanatları ayarlanabilir açıya sahiptir; uygulamaya göre malzeme seçimi yapılır.',
    'Soğutma kulesi fanı (vantilatör)',
    JSON_ARRAY('sparepart','fan','vantilatör','fan kanadı','ensotek'),
    JSON_OBJECT(
      'function','Kule içinde hava akışı sağlar',
      'blade','Ayarlanabilir kanat açısı',
      'materials','Alüminyum / Camelyaf takviyeli PP (uygulamaya göre)',
      'notes','Fan çapı ve kanat açısı seçimleri kapasite ve ses hedeflerine göre yapılır.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Malzeme','values',JSON_ARRAY('Alüminyum','Camelyaf takviyeli PP')),
        JSON_OBJECT('key','bladeAngle','label','Kanat açısı','values',JSON_ARRAY('Projeye göre ayarlanır'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Kanat açısı neden ayarlanır?','a','Hava debisi, basınç ve ses seviyesini optimize etmek için kanat açısı ayarlanır.'),
        JSON_OBJECT('q','Hangi malzeme tercih edilmeli?','a','Çevre koşulları, kimyasal etkiler ve hedef ömür dikkate alınarak seçilir.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.75,'count',6,'top','Debi/ses optimizasyonu kolay')
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
      'function','Provides airflow inside the tower',
      'blade','Adjustable blade angle',
      'materials','Aluminum / Glass-fiber reinforced PP (application-dependent)',
      'notes','Fan diameter and blade angle are selected based on capacity and noise targets.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Material','values',JSON_ARRAY('Aluminum','Glass-fiber reinforced PP')),
        JSON_OBJECT('key','bladeAngle','label','Blade angle','values',JSON_ARRAY('Adjustable per project'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Why is blade angle adjustable?','a','To optimize airflow, pressure and noise level.'),
        JSON_OBJECT('q','Which material should I choose?','a','Chosen according to ambient conditions, chemical exposure and expected service life.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.75,'count',6,'top','Easy airflow/noise tuning')
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
      'function','Erzeugt Luftströmung im Turm',
      'blade','Verstellbarer Schaufelwinkel',
      'materials','Aluminium / glasfaserverstärktes PP (anwendungsabhängig)',
      'notes','Durchmesser und Winkel werden nach Leistungs- und Geräuschziel ausgelegt.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Material','values',JSON_ARRAY('Aluminium','Glasfaserverstärktes PP')),
        JSON_OBJECT('key','bladeAngle','label','Schaufelwinkel','values',JSON_ARRAY('Projektabhängig einstellbar'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Warum ist der Schaufelwinkel verstellbar?','a','Zur Optimierung von Volumenstrom, Druck und Geräusch.'),
        JSON_OBJECT('q','Welches Material ist geeignet?','a','Auswahl je nach Umgebung, chemischer Belastung und gewünschter Lebensdauer.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.75,'count',6,'top','Gute Anpassbarkeit')
    ),
    'Kühlturmventilator | Ensotek Ersatzteile',
    'Kühlturmventilator mit verstellbarem Schaufelwinkel. Aluminium oder glasfaserverstärktes PP zur Luftstromoptimierung.'
  ),

  -- =========================================================
  -- SPAREPART 6: Servis Penceresi / Dolgu Boşaltma Kapağı
  -- =========================================================
  (
    'bbbb1006-2222-4222-8222-bbbbbbbb1006',
    'de',
    'Servis Penceresi / Dolgu Boşaltma Kapağı',
    'servis-penceresi-dolgu-bosaltma-kapagi',
    'Kule alt haznesinde dolgu malzemelerine erişim ve bakım için kullanılan servis penceresi. Dolgu bloklarının söküm/boşaltımını kolaylaştırır; gövde malzemesi FRP olup bağlantı elemanları paslanmaz seçeneklidir.',
    'Soğutma kulesi servis penceresi',
    JSON_ARRAY('sparepart','servis penceresi','bakım','dolgu boşaltma','frp'),
    JSON_OBJECT(
      'function','Bakım ve dolgu sökümü için erişim',
      'body','FRP (CTP) gövde',
      'fasteners','AISI 304 paslanmaz (opsiyon)',
      'notes','Mevcut kule ölçülerine göre özel ebat üretilebilir.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','size','label','Ölçü','values',JSON_ARRAY('Standart','Projeye göre özel')),
        JSON_OBJECT('key','fasteners','label','Bağlantı','values',JSON_ARRAY('Standart','AISI 304 paslanmaz'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Hangi durumda servis penceresi gerekir?','a','Dolgu değişimi, temizlik ve periyodik bakım süreçlerinde hızlı erişim için önerilir.'),
        JSON_OBJECT('q','Paslanmaz bağlantı ne sağlar?','a','Korozyon dayanımını artırır ve servis ömrünü uzatır.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.55,'count',9,'top','Bakım süresini ciddi azaltıyor')
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
      'function','Access for maintenance and fill replacement',
      'body','FRP body',
      'fasteners','AISI 304 stainless (optional)',
      'notes','Can be manufactured in custom sizes based on tower dimensions.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','size','label','Size','values',JSON_ARRAY('Standard','Custom')),
        JSON_OBJECT('key','fasteners','label','Fasteners','values',JSON_ARRAY('Standard','AISI 304 stainless'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','When do I need a service window?','a','Recommended for fast access during fill replacement, cleaning and periodic maintenance.'),
        JSON_OBJECT('q','Why choose stainless fasteners?','a','Improves corrosion resistance and extends service life.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.55,'count',9,'top','Significantly reduces downtime')
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
      'function','Zugang für Wartung und Füllkörperwechsel',
      'body','FRP-Gehäuse',
      'fasteners','AISI 304 Edelstahl (optional)',
      'notes','Fertigung in Sondermaßen nach Turmabmessungen möglich.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','size','label','Abmessung','values',JSON_ARRAY('Standard','Sondermaß')),
        JSON_OBJECT('key','fasteners','label','Befestigung','values',JSON_ARRAY('Standard','AISI 304 Edelstahl'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Wann ist ein Servicefenster sinnvoll?','a','Für schnellen Zugriff bei Füllkörperwechsel, Reinigung und periodischer Wartung.'),
        JSON_OBJECT('q','Vorteil von Edelstahlbefestigung?','a','Bessere Korrosionsbeständigkeit und längere Lebensdauer.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.55,'count',9,'top','Wartung deutlich schneller')
    ),
    'Servicefenster | Ensotek Ersatzteile',
    'FRP-Servicefenster für schnellen Zugang. Optional AISI 304 Edelstahlbefestigung für höhere Korrosionsbeständigkeit.'
  ),

  -- =========================================================
  -- SPAREPART 7: Su Dağıtım Sistemi
  -- =========================================================
  (
    'bbbb1007-2222-4222-8222-bbbbbbbb1007',
    'de',
    'Su Dağıtım Sistemi',
    'su-dagitim-sistemi',
    'Sıcak suyun dolgu yüzeyine dengeli şekilde dağıtılmasını sağlar. Kule modeline göre PVC, PP veya CTP borulama çözümleri ile tasarlanır.',
    'Soğutma kulesi su dağıtım sistemi',
    JSON_ARRAY('sparepart','su dağıtım','borulama','nozul','ensotek'),
    JSON_OBJECT(
      'function','Suyu dolgu üzerine homojen dağıtır',
      'materials','PVC / PP / CTP',
      'notes','Temiz su uygulamalarında film dolgu performansını artırmak için uniform dağıtım kritik önemdedir.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Malzeme','values',JSON_ARRAY('PVC','PP','CTP')),
        JSON_OBJECT('key','layout','label','Yerleşim','values',JSON_ARRAY('Kuleye özel proje'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Dağıtım sistemi neden önemlidir?','a','Eşit dağıtım ısı transferini artırır, kuru noktaları ve kireçlenmeyi azaltır.'),
        JSON_OBJECT('q','Hangi malzeme seçilmeli?','a','Su kimyası, sıcaklık ve mekanik şartlara göre seçilir.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.65,'count',5,'top','Daha stabil ısı transferi')
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
      'function','Uniformly distributes water over fill',
      'materials','PVC / PP / FRP',
      'notes','Uniform distribution is critical to maximize film fill performance and avoid dry spots.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Material','values',JSON_ARRAY('PVC','PP','FRP')),
        JSON_OBJECT('key','layout','label','Layout','values',JSON_ARRAY('Custom per tower'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Why is distribution important?','a','Uniform wetting improves heat transfer and reduces scaling and dry zones.'),
        JSON_OBJECT('q','Which material should I use?','a','Selected based on water chemistry, temperature and mechanical constraints.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.65,'count',5,'top','More consistent cooling')
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
      'function','Gleichmäßige Benetzung der Füllkörper',
      'materials','PVC / PP / FRP',
      'notes','Gleichmäßige Verteilung ist entscheidend für hohe Wärmeübertragung und weniger Trockenstellen.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Material','values',JSON_ARRAY('PVC','PP','FRP')),
        JSON_OBJECT('key','layout','label','Ausführung','values',JSON_ARRAY('Turmspezifisch'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Warum ist die Verteilung wichtig?','a','Gleichmäßige Benetzung erhöht die Wärmeübertragung und reduziert Verkalkung.'),
        JSON_OBJECT('q','Welches Material ist geeignet?','a','Auswahl nach Wasserchemie, Temperatur und mechanischen Bedingungen.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.65,'count',5,'top','Konstant gute Benetzung')
    ),
    'Wasserverteilersystem | Ensotek Ersatzteile',
    'Wasserverteilersystem mit PVC/PP/FRP Optionen. Optimiert die Wärmeübertragung durch gleichmäßige Benetzung.'
  ),

  -- =========================================================
  -- SPAREPART 8: Nozul / Fıskiye (Set)
  -- =========================================================
  (
    'bbbb1008-2222-4222-8222-bbbbbbbb1008',
    'de',
    'Kule Nozulu / Fıskiye (Spray Nozzle Seti)',
    'kule-nozulu-fiskiye-spray-nozzle-seti',
    'Su dağıtım hattından gelen suyu dolgu üzerine püskürterek dağıtır. Kule ihtiyacına göre farklı nozul tipleri ve debi seçenekleri kullanılır.',
    'Soğutma kulesi nozulu (fıskiye)',
    JSON_ARRAY('sparepart','nozul','fıskiye','spray nozzle','su dağıtım'),
    JSON_OBJECT(
      'function','Suyu dolgu üzerine püskürterek dağıtır',
      'notes','Nozul seçimi: su debisi, basınç ve dağıtım homojenliğine göre yapılır.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','type','label','Tip','values',JSON_ARRAY('Ensotek Nozzle','Daisy Nozzle','Spray Nozzle 1','Spray Nozzle 2','Spray Nozzle 3','Spray Nozzle 4')),
        JSON_OBJECT('key','orifice','label','Orifis/debi','values',JSON_ARRAY('Projeye göre'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Nozul tıkanmasını nasıl azaltırım?','a','Ön filtrasyon ve periyodik temizlik/kimyasal şartlandırma önerilir.'),
        JSON_OBJECT('q','Hangi nozul tipi seçilmeli?','a','Kule tipi, basınç ve istenen dağıtım karakteristiğine göre seçilir.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.70,'count',12,'top','Dağıtım homojenliği iyi')
    ),
    'Kule Nozulu | Ensotek Yedek Parçalar',
    'Farklı tip ve debi seçenekli kule nozulu/fıskiye setleri. Suyu dolgu üzerine homojen dağıtır, ısı transferini destekler.'
  ),
  (
    'bbbb1008-2222-4222-8222-bbbbbbbb1008',
    'en',
    'Tower Nozzle / Spray Nozzle Set',
    'tower-nozzle-spray-nozzle-set',
    'Distributes water over the fill by spraying it from the water distribution line. Different nozzle types and flow options are available depending on tower needs.',
    'Cooling tower spray nozzle',
    JSON_ARRAY('sparepart','nozzle','spray nozzle','water distribution'),
    JSON_OBJECT(
      'function','Sprays and distributes water over fill',
      'notes','Selection depends on flow rate, pressure and distribution uniformity.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','type','label','Type','values',JSON_ARRAY('Ensotek Nozzle','Daisy Nozzle','Spray Nozzle 1','Spray Nozzle 2','Spray Nozzle 3','Spray Nozzle 4')),
        JSON_OBJECT('key','orifice','label','Orifice/flow','values',JSON_ARRAY('Project-dependent'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','How can I reduce nozzle clogging?','a','Pre-filtration and periodic cleaning/water treatment are recommended.'),
        JSON_OBJECT('q','Which nozzle type should I choose?','a','Based on tower type, pressure and required spray pattern.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.70,'count',12,'top','Good spray distribution')
    ),
    'Tower Nozzle | Ensotek Spare Parts',
    'Tower nozzle/spray nozzle sets with multiple types and flow options. Supports uniform wetting and stable cooling performance.'
  ),
  (
    'bbbb1008-2222-4222-8222-bbbbbbbb1008',
    'de',
    'Düse / Sprühdüse (Set)',
    'duese-spruehduese-set',
    'Verteilt das Wasser aus dem Verteilersystem durch Sprühung auf die Füllkörper. Verschiedene Düsentyen und Durchflussoptionen je nach Turmanforderung.',
    'Sprühdüse für Kühlturm',
    JSON_ARRAY('ersatzteil','duese','spruehduese','wasserverteilung'),
    JSON_OBJECT(
      'function','Versprüht und verteilt Wasser auf die Füllkörper',
      'notes','Auswahl nach Durchfluss, Druck und Verteilungsgüte.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','type','label','Typ','values',JSON_ARRAY('Ensotek Nozzle','Daisy Nozzle','Spray Nozzle 1','Spray Nozzle 2','Spray Nozzle 3','Spray Nozzle 4')),
        JSON_OBJECT('key','orifice','label','Bohrung/Durchfluss','values',JSON_ARRAY('Projektabhängig'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Wie vermeide ich Verstopfungen?','a','Vorfiltration sowie regelmäßige Reinigung/Wasseraufbereitung werden empfohlen.'),
        JSON_OBJECT('q','Welcher Düsentyps ist passend?','a','Abhängig von Turmtyp, Druck und gewünschtem Sprühbild.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.70,'count',12,'top','Gleichmäßige Benetzung')
    ),
    'Sprühdüse | Ensotek Ersatzteile',
    'Sprühdüsen-Sets in verschiedenen Ausführungen. Für eine gleichmäßige Wasserverteilung und stabile Kühlleistung.'
  ),

  -- =========================================================
  -- SPAREPART 9: FRP Taşıyıcı Profiller
  -- =========================================================
  (
    'bbbb1009-2222-4222-8222-bbbbbbbb1009',
    'de',
    'FRP Taşıyıcı Profiller (Pultrusion)',
    'frp-tasiyici-profiller-pultrusion',
    'Kule iç aksamında dolgu, damla tutucu ve dağıtım elemanlarını taşıyan, yüksek korozyon dayanımlı FRP profiller. Pultrusion üretim tekniği ile stabil kesit ve yüksek mukavemet sağlar.',
    'FRP taşıyıcı profiller',
    JSON_ARRAY('sparepart','frp','pultrusion','tasiyici profil','korozyon'),
    JSON_OBJECT(
      'material','FRP (CTP)',
      'process','Pultrusion',
      'use','İç konstrüksiyon taşıyıcı elemanları',
      'notes','Saha ölçülerine göre farklı kesitlerde tedarik edilir.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','section','label','Kesit','values',JSON_ARRAY('Projeye göre (U/I/L vb.)')),
        JSON_OBJECT('key','length','label','Boy','values',JSON_ARRAY('Standart','Özel kesim'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','FRP profil neden tercih edilir?','a','Korozyona dayanıklıdır ve kule içi ıslak ortamda uzun ömür sağlar.'),
        JSON_OBJECT('q','Hangi kesit seçilmeli?','a','Taşıma yükleri ve kule geometrisine göre belirlenir.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.50,'count',8,'top','Korozyon problemi yok')
    ),
    'FRP Profiller | Ensotek Yedek Parçalar',
    'Pultrusion FRP taşıyıcı profiller. Kule içi ıslak/korozyonlu ortamda dolgu ve ekipman taşıma için uzun ömürlü çözüm.'
  ),
  (
    'bbbb1009-2222-4222-8222-bbbbbbbb1009',
    'en',
    'FRP Pultrusion Support Profiles',
    'frp-pultrusion-support-profiles',
    'Corrosion-resistant FRP profiles used to support fill, drift eliminators and distribution components inside the tower. Pultrusion manufacturing provides stable cross-sections and high strength.',
    'FRP support profiles',
    JSON_ARRAY('sparepart','frp','pultrusion','support profile','corrosion'),
    JSON_OBJECT(
      'material','FRP',
      'process','Pultrusion',
      'use','Internal structural supports',
      'notes','Supplied in various sections based on tower requirements.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','section','label','Section','values',JSON_ARRAY('Project-dependent (U/I/L etc.)')),
        JSON_OBJECT('key','length','label','Length','values',JSON_ARRAY('Standard','Custom cut'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Why FRP profiles?','a','Excellent corrosion resistance and long life in wet tower environments.'),
        JSON_OBJECT('q','How do I select the section?','a','Based on loads and tower geometry.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.50,'count',8,'top','Durable in wet conditions')
    ),
    'FRP Profiles | Ensotek Spare Parts',
    'Pultruded FRP support profiles for internal tower structures. Long-lasting solution for corrosive/wet environments.'
  ),
  (
    'bbbb1009-2222-4222-8222-bbbbbbbb1009',
    'de',
    'FRP-Tragprofile (Pultrusion)',
    'frp-tragprofile-pultrusion',
    'Korrosionsbeständige FRP-Profile zur Aufnahme von Füllkörpern, Tropfenabscheidern und Verteilkomponenten. Pultrusion sorgt für konstante Querschnitte und hohe Festigkeit.',
    'FRP-Tragprofile',
    JSON_ARRAY('ersatzteil','frp','pultrusion','tragprofil','korrosion'),
    JSON_OBJECT(
      'material','FRP (GFK)',
      'process','Pultrusion',
      'use','Tragkonstruktion im Turminneren',
      'notes','In unterschiedlichen Profilquerschnitten je nach Anforderung lieferbar.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','section','label','Profil','values',JSON_ARRAY('Projektabhängig (U/I/L usw.)')),
        JSON_OBJECT('key','length','label','Länge','values',JSON_ARRAY('Standard','Sonderzuschnitt'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Warum FRP/GFK Profile?','a','Sehr korrosionsbeständig und langlebig im feuchten Turmumfeld.'),
        JSON_OBJECT('q','Welche Profile sind passend?','a','Je nach Lasten und Geometrie wird der Querschnitt gewählt.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.50,'count',8,'top','Sehr langlebig')
    ),
    'FRP-Profile | Ensotek Ersatzteile',
    'Pultrudierte FRP-Tragprofile für Kühltürme. Langlebig in korrosiven, feuchten Umgebungen.'
  ),

  -- =========================================================
  -- SPAREPART 10: Damla Tutucu
  -- =========================================================
  (
    'bbbb1010-2222-4222-8222-bbbbbbbb1010',
    'de',
    'Damla Tutucu (Drift Eliminator)',
    'damla-tutucu-drift-eliminator',
    'Kule içindeki su damlacıklarını tutarak sürüklenmeyi azaltır. Su kaybını ve çevresel etkileri düşürmeye yardımcı olur. Farklı profil seçenekleri mevcuttur.',
    'Soğutma kulesi damla tutucu',
    JSON_ARRAY('sparepart','damla tutucu','drift eliminator','su kaybı','ensotek'),
    JSON_OBJECT(
      'function','Sürüklenme (drift) kaybını azaltır',
      'materials','PVC / özel polimer (projeye göre)',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','profile','label','Profil','values',JSON_ARRAY('PVC CF-18DT','C-145x45','C-70x16')),
        JSON_OBJECT('key','mounting','label','Montaj','values',JSON_ARRAY('Kuleye özel'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Damla tutucu neden gereklidir?','a','Su sürüklenmesini azaltarak su tüketimini ve çevresel etkileri düşürür.'),
        JSON_OBJECT('q','Profil seçimi nasıl yapılır?','a','Kule hava hızı, damlacık yükü ve basınç kaybı hedeflerine göre yapılır.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.65,'count',11,'top','Su kaybı azaldı')
    ),
    'Damla Tutucu | Ensotek Yedek Parçalar',
    'PVC profil seçenekli damla tutucular. Drift kaybını azaltır, su tüketimini düşürür ve çevresel etkiyi iyileştirir.'
  ),
  (
    'bbbb1010-2222-4222-8222-bbbbbbbb1010',
    'en',
    'Drift Eliminator',
    'drift-eliminator',
    'Captures water droplets inside the tower to reduce drift. Helps minimize water loss and environmental impact. Available in multiple profiles.',
    'Cooling tower drift eliminator',
    JSON_ARRAY('sparepart','drift eliminator','water loss','cooling tower','ensotek'),
    JSON_OBJECT(
      'function','Reduces drift and water loss',
      'materials','PVC / engineered polymer (project-dependent)',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','profile','label','Profile','values',JSON_ARRAY('PVC CF-18DT','C-145x45','C-70x16')),
        JSON_OBJECT('key','mounting','label','Mounting','values',JSON_ARRAY('Custom per tower'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Why do I need a drift eliminator?','a','It reduces droplet carryover, lowering make-up water consumption and environmental impact.'),
        JSON_OBJECT('q','How do I choose the profile?','a','Based on air velocity, droplet load and pressure drop targets.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.65,'count',11,'top','Noticeable drift reduction')
    ),
    'Drift Eliminator | Ensotek Spare Parts',
    'Drift eliminators with PVC profile options. Reduce droplet carryover and improve water efficiency.'
  ),
  (
    'bbbb1010-2222-4222-8222-bbbbbbbb1010',
    'de',
    'Tropfenabscheider (Drift Eliminator)',
    'tropfenabscheider-drift-eliminator',
    'Hält Wassertröpfchen im Turm zurück und reduziert Drift. Verringert Wasserverlust und Umweltbelastung. Mehrere Profilvarianten verfügbar.',
    'Tropfenabscheider für Kühlturm',
    JSON_ARRAY('ersatzteil','tropfenabscheider','drift','wasserverlust','ensotek'),
    JSON_OBJECT(
      'function','Reduziert Drift/Wasserverlust',
      'materials','PVC / Spezialpolymer (projektabhängig)',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','profile','label','Profil','values',JSON_ARRAY('PVC CF-18DT','C-145x45','C-70x16')),
        JSON_OBJECT('key','mounting','label','Montage','values',JSON_ARRAY('Turmspezifisch'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Warum braucht man Tropfenabscheider?','a','Reduziert Tropfenaustrag und damit Wasserverbrauch sowie Umweltbelastung.'),
        JSON_OBJECT('q','Wie wird das Profil ausgewählt?','a','Nach Luftgeschwindigkeit, Tropfenbelastung und Druckverlustzielen.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.65,'count',11,'top','Wasserverlust deutlich geringer')
    ),
    'Tropfenabscheider | Ensotek Ersatzteile',
    'Tropfenabscheider mit verschiedenen PVC-Profilen. Reduziert Drift und verbessert die Wassereffizienz.'
  ),

  -- =========================================================
  -- SPAREPART 11: PP Bigudi Dolgu
  -- =========================================================
  (
    'bbbb1011-2222-4222-8222-bbbbbbbb1011',
    'de',
    'PP Bigudi Dolgu (Ring Dolgu)',
    'pp-bigudi-dolgu-ring-dolgu',
    'Kirli/yağlı/kumlu su uygulamalarında tıkanmaya karşı dayanıklı PP bigudi dolgu. Yüksek sıcaklık dayanımı ile (yaklaşık 100°C’ye kadar) zorlu proseslerde tercih edilir.',
    'PP bigudi dolgu',
    JSON_ARRAY('sparepart','pp dolgu','bigudi dolgu','kirli su','100C'),
    JSON_OBJECT(
      'material','PP',
      'application','Kirli / yağlı / kumlu su',
      'maxProcessTemp','~100°C',
      'benefit','Tıkanmaya karşı yüksek dayanım',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','size','label','Boyut','values',JSON_ARRAY('Projeye göre')),
        JSON_OBJECT('key','packing','label','Paketleme','values',JSON_ARRAY('Torba','Koli','Big-bag'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Film dolgu yerine ne zaman PP bigudi seçilir?','a','Kirli ve partiküllü sularda film dolgu tıkanabilir; bigudi dolgu daha dayanıklıdır.'),
        JSON_OBJECT('q','Sıcaklık dayanımı nedir?','a','PP bigudi dolgu yüksek sıcaklıklarda (~100°C) kullanılabilir.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.60,'count',10,'top','Kirli suda tıkanma sorunu azaldı')
    ),
    'PP Bigudi Dolgu | Ensotek Yedek Parçalar',
    'Kirli suya dayanıklı PP bigudi dolgu. ~100°C’ye kadar sıcaklık dayanımı ve tıkanmaya karşı yüksek performans.'
  ),
  (
    'bbbb1011-2222-4222-8222-bbbbbbbb1011',
    'en',
    'PP Ring Fill (Curly/Ring Packing)',
    'pp-ring-fill-packing',
    'Clogging-resistant PP ring fill for dirty/oily/sandy water applications. Preferred for harsh processes with high temperature resistance (up to ~100°C).',
    'PP ring fill media',
    JSON_ARRAY('sparepart','pp fill','ring fill','dirty water','100C'),
    JSON_OBJECT(
      'material','PP',
      'application','Dirty / oily / sandy water',
      'maxProcessTemp','~100°C',
      'benefit','High resistance to clogging',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','size','label','Size','values',JSON_ARRAY('Project-dependent')),
        JSON_OBJECT('key','packing','label','Packing','values',JSON_ARRAY('Bag','Box','Big-bag'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','When should I choose PP ring fill over film fill?','a','Film fill may clog in dirty/particle-laden water; ring fill is more tolerant.'),
        JSON_OBJECT('q','What is the temperature limit?','a','PP ring fill can be used at higher temperatures up to ~100°C.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.60,'count',10,'top','Performs well in dirty water')
    ),
    'PP Ring Fill | Ensotek Spare Parts',
    'Clogging-resistant PP ring fill for dirty water applications. High temperature resistance up to ~100°C for demanding processes.'
  ),
  (
    'bbbb1011-2222-4222-8222-bbbbbbbb1011',
    'de',
    'PP-Ringfüllkörper (Bigudi/Ring-Packing)',
    'pp-ringfuellkoerper-packing',
    'Verstopfungsresistenter PP-Ringfüllkörper für verschmutztes/ölhaltiges/sandiges Wasser. Geeignet für anspruchsvolle Prozesse mit hoher Temperaturbeständigkeit (bis ca. 100°C).',
    'PP-Ringfüllkörper',
    JSON_ARRAY('ersatzteil','pp fuellung','ringfuellung','schmutzwasser','100C'),
    JSON_OBJECT(
      'material','PP',
      'application','Verschmutztes / ölhaltiges / sandiges Wasser',
      'maxProcessTemp','~100°C',
      'benefit','Hohe Verstopfungsresistenz',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','size','label','Größe','values',JSON_ARRAY('Projektabhängig')),
        JSON_OBJECT('key','packing','label','Verpackung','values',JSON_ARRAY('Sack','Karton','Big-Bag'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Wann statt Filmfüllkörper PP-Ringfüllkörper?','a','Filmfüllkörper können bei Schmutzwasser verstopfen; Ringfüllkörper sind toleranter.'),
        JSON_OBJECT('q','Wie hoch ist die Temperaturbeständigkeit?','a','PP-Ringfüllkörper sind bis ca. 100°C einsetzbar.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.60,'count',10,'top','Weniger Verstopfung')
    ),
    'PP-Ringfüllkörper | Ensotek Ersatzteile',
    'Verstopfungsresistente PP-Ringfüllkörper für Schmutzwasser. Temperaturbeständig bis ca. 100°C für anspruchsvolle Anwendungen.'
  ),

  -- =========================================================
  -- SPAREPART 12: Splash Grid Fill  (FIXED: JSON_ARRAY in DE)
  -- =========================================================
  (
    'bbbb1012-2222-4222-8222-bbbbbbbb1012',
    'de',
    'Sıçratma Tipi Grid Dolgu',
    'sicratma-tipi-grid-dolgu',
    'Çok kirli su ve partiküllü akışkanlarda tıkanmaya karşı dayanıklı sıçratma tipi grid dolgu. Açık devre kulelerde zorlu su şartlarında tercih edilir.',
    'Sıçratma tipi grid dolgu',
    JSON_ARRAY('sparepart','grid dolgu','splash fill','kirli su','dayanıklı'),
    JSON_OBJECT(
      'type','Splash grid',
      'application','Çok kirli / partiküllü su',
      'benefit','Tıkanmaya dayanım, kolay temizlenebilir yapı',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Malzeme','values',JSON_ARRAY('PP','Özel polimer (projeye göre)')),
        JSON_OBJECT('key','module','label','Modül','values',JSON_ARRAY('Standart','Özel'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Film dolgu yerine ne zaman grid dolgu?','a','Çok kirli, partiküllü ve biyolojik yükü yüksek sularda grid dolgu tercih edilir.'),
        JSON_OBJECT('q','Temizliği kolay mı?','a','Modüler yapı sayesinde periyodik temizlik ve bakım daha kolaydır.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.55,'count',6,'top','Kirli su prosesinde stabil')
    ),
    'Grid Dolgu | Ensotek Yedek Parçalar',
    'Sıçratma tipi grid dolgu. Çok kirli su uygulamalarında tıkanmaya dayanıklı, modüler ve kolay temizlenebilir çözüm.'
  ),
  (
    'bbbb1012-2222-4222-8222-bbbbbbbb1012',
    'en',
    'Splash Grid Fill',
    'splash-grid-fill',
    'Splash-type grid fill resistant to clogging in very dirty, particle-laden water. Preferred for harsh water conditions in open circuit towers.',
    'Splash grid fill',
    JSON_ARRAY('sparepart','grid fill','splash fill','dirty water','clog resistant'),
    JSON_OBJECT(
      'type','Splash grid',
      'application','Very dirty / particle-laden water',
      'benefit','Clog-resistant, easier cleaning due to modular structure',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Material','values',JSON_ARRAY('PP','Engineered polymer (project-dependent)')),
        JSON_OBJECT('key','module','label','Module','values',JSON_ARRAY('Standard','Custom'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','When should I use grid fill instead of film fill?','a','Use grid fill for very dirty, high-solid or high-bioload water to reduce clogging risk.'),
        JSON_OBJECT('q','Is it easy to clean?','a','Yes, modular design supports easier maintenance and cleaning.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.55,'count',6,'top','Stable in harsh water')
    ),
    'Splash Grid Fill | Ensotek Spare Parts',
    'Splash grid fill for very dirty water. Clog-resistant, modular design for easier maintenance in open circuit towers.'
  ),
  (
    'bbbb1012-2222-4222-8222-bbbbbbbb1012',
    'de',
    'Splash-Grid-Füllkörper',
    'splash-grid-fuellkoerper',
    'Spritz-/Splash-Grid-Füllkörper mit hoher Verstopfungsresistenz für stark verschmutztes, partikelführendes Wasser. Geeignet für offene Kühltürme bei schwierigen Wasserbedingungen.',
    'Splash-Grid-Füllkörper',
    JSON_ARRAY('ersatzteil','grid fuellung','splash fill','schmutzwasser','verstopfung'),
    JSON_OBJECT(
      'type','Splash grid',
      'application','Stark verschmutztes / partikelführendes Wasser',
      'benefit','Verstopfungsarm, modular und gut zu reinigen',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Material','values',JSON_ARRAY('PP','Spezialpolymer (projektabhängig)')),
        JSON_OBJECT('key','module','label','Modul','values',JSON_ARRAY('Standard','Sonder'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Wann Grid statt Filmfüllkörper?','a','Bei stark verschmutztem Wasser mit hohen Feststoff-/Bioanteilen ist Grid-Füllkörper sinnvoll.'),
        JSON_OBJECT('q','Wie ist die Reinigbarkeit?','a','Die modulare Bauweise erleichtert Wartung und Reinigung.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.55,'count',6,'top','Robust im Schmutzwasserbetrieb')
    ),
    'Splash-Grid-Füllkörper | Ensotek Ersatzteile',
    'Splash-Grid-Füllkörper für schwierige Wasserbedingungen. Verstopfungsarm, modular und wartungsfreundlich.'
  ),

  -- =========================================================
  -- SPAREPART 13: Rashing / Raschig Ring
  -- =========================================================
  (
    'bbbb1013-2222-4222-8222-bbbbbbbb1013',
    'de',
    'Rashing Halkası (Scrubber Dolgusu)',
    'rashing-halkasi-scrubber-dolgusu',
    'Scrubber sistemlerinde dolgu olarak kullanılan PP rashing halkası. Gaz-sıvı temas yüzeyini artırarak yıkama verimini destekler.',
    'Rashing halkası',
    JSON_ARRAY('sparepart','rashing','scrubber','pp','dolgu'),
    JSON_OBJECT(
      'material','PP',
      'use','Scrubber packing',
      'benefit','Geniş temas yüzeyi, düşük basınç kaybı',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','size','label','Boyut','values',JSON_ARRAY('Projeye göre')),
        JSON_OBJECT('key','packing','label','Paket','values',JSON_ARRAY('Torba','Big-bag'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Hangi sistemlerde kullanılır?','a','Hava yıkayıcı/scrubber sistemlerinde dolgu malzemesi olarak kullanılır.'),
        JSON_OBJECT('q','Basınç kaybı yüksek olur mu?','a','Uygun boyut ve dolum oranı ile düşük basınç kaybı hedeflenir.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.40,'count',5,'top','Scrubber verimini artırdı')
    ),
    'Rashing Halkası | Ensotek Yedek Parçalar',
    'PP rashing halkası scrubber dolgusu. Gaz-sıvı temasını artırır, yıkama verimini destekler.'
  ),
  (
    'bbbb1013-2222-4222-8222-bbbbbbbb1013',
    'en',
    'Raschig Ring (Scrubber Packing)',
    'raschig-ring-scrubber-packing',
    'PP Raschig ring used as packing in scrubber systems. Increases gas-liquid contact surface to improve scrubbing efficiency.',
    'Raschig ring packing',
    JSON_ARRAY('sparepart','raschig ring','scrubber','pp','packing'),
    JSON_OBJECT(
      'material','PP',
      'use','Scrubber packing',
      'benefit','Large contact surface, low pressure drop',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','size','label','Size','values',JSON_ARRAY('Project-dependent')),
        JSON_OBJECT('key','packing','label','Packing','values',JSON_ARRAY('Bag','Big-bag'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Where is it used?','a','Used as packing media in air scrubber systems.'),
        JSON_OBJECT('q','Will pressure drop be high?','a','With proper size and loading, a low pressure drop can be maintained.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.40,'count',5,'top','Improved scrubbing performance')
    ),
    'Raschig Ring | Ensotek Spare Parts',
    'PP Raschig ring packing for scrubbers. Improves gas-liquid contact and supports efficient scrubbing.'
  ),
  (
    'bbbb1013-2222-4222-8222-bbbbbbbb1013',
    'de',
    'Raschig-Ring (Scrubber-Packung)',
    'raschig-ring-scrubber-packung',
    'PP Raschig-Ringe als Packung für Scrubber-Systeme. Erhöhen die Gas-Flüssig-Kontaktfläche und verbessern die Reinigungsleistung.',
    'Raschig-Ring Packung',
    JSON_ARRAY('ersatzteil','raschig ring','scrubber','pp','packung'),
    JSON_OBJECT(
      'material','PP',
      'use','Scrubber-Packung',
      'benefit','Große Kontaktfläche, geringer Druckverlust',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','size','label','Größe','values',JSON_ARRAY('Projektabhängig')),
        JSON_OBJECT('key','packing','label','Verpackung','values',JSON_ARRAY('Sack','Big-Bag'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Wo wird es eingesetzt?','a','Als Packungsmaterial in Luftwäschern/Scrubber-Systemen.'),
        JSON_OBJECT('q','Wie ist der Druckverlust?','a','Bei richtiger Auslegung kann ein geringer Druckverlust erreicht werden.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.40,'count',5,'top','Gute Reinigungsleistung')
    ),
    'Raschig-Ring | Ensotek Ersatzteile',
    'PP Raschig-Ring Packung für Scrubber. Verbessert die Gas-Flüssig-Kontaktfläche und die Reinigungsleistung.'
  ),

  -- =========================================================
  -- SPAREPART 14: Hava Giriş Filtresi
  -- =========================================================
  (
    'bbbb1014-2222-4222-8222-bbbbbbbb1014',
    'de',
    'Hava Giriş Filtresi',
    'hava-giris-filtresi',
    'Kuleye giren havadaki partikülleri azaltarak dolgu ve iç aksamı korumaya yardımcı olur. Alüminyum muhafaza, PVC destek ve sık gözenekli filtre opsiyonu ile uygulanır.',
    'Soğutma kulesi hava giriş filtresi',
    JSON_ARRAY('sparepart','filtre','hava girişi','partikül','ensotek'),
    JSON_OBJECT(
      'function','Partikülü azaltır, iç aksamı korur',
      'frame','Alüminyum',
      'support','PVC',
      'filter','Sık gözenekli filtre (opsiyon)',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','mesh','label','Filtre yoğunluğu','values',JSON_ARRAY('Standart','Sık gözenekli')),
        JSON_OBJECT('key','size','label','Ölçü','values',JSON_ARRAY('Kuleye özel'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Filtre ne zaman gerekli?','a','Tozlu ortamlarda dolgunun kirlenmesini azaltmak ve bakım aralığını uzatmak için önerilir.'),
        JSON_OBJECT('q','Basınç kaybı artar mı?','a','Sık gözenekli filtrede basınç kaybı artabilir; seçim hedefe göre yapılır.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.45,'count',7,'top','Dolgu kirliliği azaldı')
    ),
    'Hava Giriş Filtresi | Ensotek Yedek Parçalar',
    'Alüminyum çerçeveli hava giriş filtresi. Tozlu ortamlarda iç aksamı korur; sık gözenekli filtre opsiyonu.'
  ),
  (
    'bbbb1014-2222-4222-8222-bbbbbbbb1014',
    'en',
    'Air Inlet Filter',
    'air-inlet-filter',
    'Helps protect fill and internal components by reducing particulates in incoming air. Implemented with aluminum frame, PVC support and optional fine-mesh filter.',
    'Cooling tower air inlet filter',
    JSON_ARRAY('sparepart','filter','air inlet','particulate','ensotek'),
    JSON_OBJECT(
      'function','Reduces particulates, protects internals',
      'frame','Aluminum',
      'support','PVC',
      'filter','Fine mesh (optional)',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','mesh','label','Mesh density','values',JSON_ARRAY('Standard','Fine mesh')),
        JSON_OBJECT('key','size','label','Size','values',JSON_ARRAY('Custom per tower'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','When is an inlet filter recommended?','a','In dusty environments to reduce fouling and extend maintenance intervals.'),
        JSON_OBJECT('q','Will pressure drop increase?','a','Fine mesh can increase pressure drop; selection depends on targets.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.45,'count',7,'top','Cleaner internals, less fouling')
    ),
    'Air Inlet Filter | Ensotek Spare Parts',
    'Air inlet filter with aluminum frame. Protects internals in dusty environments; optional fine-mesh filter available.'
  ),
  (
    'bbbb1014-2222-4222-8222-bbbbbbbb1014',
    'de',
    'Lufteinlassfilter',
    'lufteinlassfilter',
    'Schützt Füllkörper und Innenbauteile durch Reduzierung von Partikeln in der Zuluft. Aluminiumrahmen, PVC-Träger und optional feinmaschiger Filter.',
    'Lufteinlassfilter für Kühlturm',
    JSON_ARRAY('ersatzteil','filter','lufteinlass','partikel','ensotek'),
    JSON_OBJECT(
      'function','Reduziert Partikel und schützt Innenbauteile',
      'frame','Aluminium',
      'support','PVC',
      'filter','Feinmaschig (optional)',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','mesh','label','Maschenweite','values',JSON_ARRAY('Standard','Feinmaschig')),
        JSON_OBJECT('key','size','label','Größe','values',JSON_ARRAY('Turmspezifisch'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Wann ist ein Filter sinnvoll?','a','In staubigen Umgebungen zur Reduzierung von Verschmutzung und längeren Wartungsintervallen.'),
        JSON_OBJECT('q','Steigt der Druckverlust?','a','Bei feinmaschigem Filter kann der Druckverlust steigen; Auswahl nach Zielvorgaben.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.45,'count',7,'top','Weniger Verschmutzung')
    ),
    'Lufteinlassfilter | Ensotek Ersatzteile',
    'Lufteinlassfilter mit Aluminiumrahmen. Schützt Innenbauteile; optional feinmaschiger Filter für staubige Umgebungen.'
  ),

  -- =========================================================
  -- SPAREPART 15: Kule Üstü Servis Platformu
  -- =========================================================
  (
    'bbbb1015-2222-4222-8222-bbbbbbbb1015',
    'de',
    'Kule Üstü Servis Platformu',
    'kule-ustu-servis-platformu',
    'Kule üst bölümünde servis ve bakım için güvenli çalışma alanı sağlar. FRP platform yüzeyi ve AISI 304 paslanmaz bağlantılarla opsiyonlanabilir.',
    'Soğutma kulesi üst servis platformu',
    JSON_ARRAY('sparepart','platform','servis','bakım','frp'),
    JSON_OBJECT(
      'function','Bakım için güvenli erişim alanı',
      'platform','FRP yürüyüş yüzeyi',
      'fasteners','AISI 304 paslanmaz (opsiyon)',
      'notes','Mevcut kule geometrisine göre ölçülendirilir.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','surface','label','Yüzey','values',JSON_ARRAY('FRP','Kaymaz FRP')),
        JSON_OBJECT('key','fasteners','label','Bağlantı','values',JSON_ARRAY('Standart','AISI 304 paslanmaz'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Platform zorunlu mu?','a','Bakım erişimi ve iş güvenliği için önerilir; proje şartnamesine göre uygulanır.'),
        JSON_OBJECT('q','Kaymaz yüzey var mı?','a','Kaymaz FRP yüzey seçeneği sunulabilir.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.50,'count',4,'top','Bakım güvenliği arttı')
    ),
    'Kule Üstü Platform | Ensotek Yedek Parçalar',
    'FRP yüzeyli kule üstü servis platformu. Bakım için güvenli çalışma alanı; AISI 304 paslanmaz bağlantı opsiyonu.'
  ),
  (
    'bbbb1015-2222-4222-8222-bbbbbbbb1015',
    'en',
    'Top Service Platform',
    'top-service-platform',
    'Provides a safe working area for service and maintenance on the tower top. Can be configured with FRP surface and optional AISI 304 stainless fasteners.',
    'Cooling tower top service platform',
    JSON_ARRAY('sparepart','platform','service','maintenance','frp'),
    JSON_OBJECT(
      'function','Safe access area for maintenance',
      'platform','FRP walking surface',
      'fasteners','AISI 304 stainless (optional)',
      'notes','Sized according to tower geometry.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','surface','label','Surface','values',JSON_ARRAY('FRP','Anti-slip FRP')),
        JSON_OBJECT('key','fasteners','label','Fasteners','values',JSON_ARRAY('Standard','AISI 304 stainless'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Is the platform mandatory?','a','Recommended for safe access and maintenance; depends on project specification.'),
        JSON_OBJECT('q','Is anti-slip surface available?','a','Anti-slip FRP surface can be provided as an option.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.50,'count',4,'top','Improved maintenance safety')
    ),
    'Top Service Platform | Ensotek Spare Parts',
    'FRP top service platform for safe maintenance access. Optional AISI 304 stainless fasteners and anti-slip surface.'
  ),
  (
    'bbbb1015-2222-4222-8222-bbbbbbbb1015',
    'de',
    'Serviceplattform (oben)',
    'serviceplattform-oben',
    'Sichere Arbeitsfläche für Service und Wartung am Turmoberteil. FRP-Lauffläche und optional AISI 304 Edelstahlbefestigungen möglich.',
    'Serviceplattform für Kühlturm',
    JSON_ARRAY('ersatzteil','plattform','service','wartung','frp'),
    JSON_OBJECT(
      'function','Sicherer Zugang für Wartung',
      'platform','FRP-Lauffläche',
      'fasteners','AISI 304 Edelstahl (optional)',
      'notes','Abmessungen turmspezifisch.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','surface','label','Oberfläche','values',JSON_ARRAY('FRP','Rutschhemmendes FRP')),
        JSON_OBJECT('key','fasteners','label','Befestigung','values',JSON_ARRAY('Standard','AISI 304 Edelstahl'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Ist die Plattform verpflichtend?','a','Empfohlen für sicheren Wartungszugang; abhängig von Spezifikation.'),
        JSON_OBJECT('q','Gibt es rutschhemmende Ausführung?','a','Rutschhemmendes FRP kann optional geliefert werden.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.50,'count',4,'top','Mehr Arbeitssicherheit')
    ),
    'Serviceplattform | Ensotek Ersatzteile',
    'FRP-Serviceplattform für sicheren Wartungszugang. Optional AISI 304 Edelstahlbefestigung und rutschhemmende Oberfläche.'
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
