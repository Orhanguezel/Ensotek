-- =============================================================
-- FILE: 015.2_spareparts_seed_16-25.sql  (FULL)
-- Ensotek – Spareparts Seed (16..25)  TR + EN + DE
-- - products + product_i18n
-- - Re-runnable (ON DUPLICATE KEY UPDATE)
-- - JSON helpers: JSON_ARRAY / JSON_OBJECT
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =========================
-- 1) BASE PRODUCTS (SPAREPARTS 16..25)
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
  -- SPAREPART 16: Fan Kayışı (V-Belt)
  (
    'bbbb1016-2222-4222-8222-bbbbbbbb1016',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1004-1111-4111-8111-bbbbbbbb1004', -- Fan ve Motor Grubu
    1250.00,
    'https://images.unsplash.com/photo-1581092160877-ef53b6e7a6c1?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581092160877-ef53b6e7a6c1?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    16,
    'SP-BELT-001',
    120,
    4.55,
    10
  ),

  -- SPAREPART 17: Rulman Seti (Fan Yatağı)
  (
    'bbbb1017-2222-4222-8222-bbbbbbbb1017',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1004-1111-4111-8111-bbbbbbbb1004', -- Fan ve Motor Grubu
    2950.00,
    'https://images.unsplash.com/photo-1581092335397-9fa341108c0c?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581092335397-9fa341108c0c?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    17,
    'SP-BEAR-001',
    60,
    4.60,
    8
  ),

  -- SPAREPART 18: Fan Bacası / Fan Stack (FRP)
  (
    'bbbb1018-2222-4222-8222-bbbbbbbb1018',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1001-1111-4111-8111-bbbbbbbb1001', -- Kule Ana Bileşenleri
    22500.00,
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    1,
    18,
    'SP-STACK-001',
    8,
    4.70,
    6
  ),

  -- SPAREPART 19: Redüktör Yağ Kiti (Gearbox Oil Kit)
  (
    'bbbb1019-2222-4222-8222-bbbbbbbb1019',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1002-1111-4111-8111-bbbbbbbb1002', -- Yedek Parçalar ve Aksesuarlar
    1850.00,
    'https://images.unsplash.com/photo-1581091215367-59ab6b1d9b01?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581091215367-59ab6b1d9b01?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    19,
    'SP-OIL-001',
    90,
    4.65,
    9
  ),

  -- SPAREPART 20: Şamandıra / Seviye Valfi (Float Valve)
  (
    'bbbb1020-2222-4222-8222-bbbbbbbb1020',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1002-1111-4111-8111-bbbbbbbb1002', -- Yedek Parçalar ve Aksesuarlar
    2350.00,
    'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    20,
    'SP-FLOAT-001',
    45,
    4.50,
    7
  ),

  -- SPAREPART 21: Damla Tutucu Klips/Askı Seti (Mounting Kit)
  (
    'bbbb1021-2222-4222-8222-bbbbbbbb1021',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1002-1111-4111-8111-bbbbbbbb1002', -- Yedek Parçalar ve Aksesuarlar
    980.00,
    'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    21,
    'SP-CLIP-001',
    200,
    4.55,
    5
  ),

  -- SPAREPART 22: Paslanmaz Bağlantı Elemanları Kiti (AISI 304 Fastener Kit)
  (
    'bbbb1022-2222-4222-8222-bbbbbbbb1022',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1002-1111-4111-8111-bbbbbbbb1002', -- Yedek Parçalar ve Aksesuarlar
    1650.00,
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    22,
    'SP-BOLT-001',
    150,
    4.60,
    6
  ),

  -- SPAREPART 23: Su Dağıtım Kollektörü (Header / Manifold)
  (
    'bbbb1023-2222-4222-8222-bbbbbbbb1023',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1001-1111-4111-8111-bbbbbbbb1001', -- Kule Ana Bileşenleri
    8900.00,
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    1,
    23,
    'SP-MAN-001',
    14,
    4.65,
    4
  ),

  -- SPAREPART 24: Nozul Yedek Memesi (Orifice / Insert)
  (
    'bbbb1024-2222-4222-8222-bbbbbbbb1024',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1002-1111-4111-8111-bbbbbbbb1002', -- Yedek Parçalar ve Aksesuarlar
    420.00,
    'https://images.unsplash.com/photo-1581092918367-3e41f5b7f1b4?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581092918367-3e41f5b7f1b4?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    0,
    24,
    'SP-ORIF-001',
    500,
    4.50,
    9
  ),

  -- SPAREPART 25: Titreşim Sensörü (Vibration Sensor / Transmitter)
  (
    'bbbb1025-2222-4222-8222-bbbbbbbb1025',
    'aaaa1001-1111-4111-8111-aaaaaaaa1001',
    'bbbb1004-1111-4111-8111-bbbbbbbb1004', -- Fan ve Motor Grubu
    7600.00,
    'https://images.unsplash.com/photo-1581091870622-2c6ef11b4d2b?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    JSON_ARRAY('https://images.unsplash.com/photo-1581091870622-2c6ef11b4d2b?auto=format&fit=crop&w=1200&h=600&q=80'),
    JSON_ARRAY(),
    1,
    1,
    25,
    'SP-SENS-001',
    28,
    4.70,
    6
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
-- 2) PRODUCT I18N (TR + EN + DE)  16..25
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
  -- SPAREPART 16: Fan Kayışı (V-Belt)
  -- =========================================================
  (
    'bbbb1016-2222-4222-8222-bbbbbbbb1016',
    'de',
    'Fan Kayışı (V Kayış)',
    'fan-kayisi-v-kayis',
    'Kayış-kasnak tahrikli fan sistemlerinde kullanılan endüstriyel V-kayış. Doğru gerginlik ve hizalama ile titreşimi azaltır, güç aktarımını stabil tutar.',
    'Soğutma kulesi fan kayışı',
    JSON_ARRAY('sparepart','kayış','v kayış','fan tahrik','bakım'),
    JSON_OBJECT(
      'use','Kayış-kasnak tahrikli fan sistemleri',
      'benefit','Stabil güç aktarımı, daha az kayma',
      'notes','Kayış değişiminde kasnak hizası ve gerginlik ayarı önerilir.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','profile','label','Profil','values',JSON_ARRAY('A','B','C (projeye göre)')),
        JSON_OBJECT('key','length','label','Boy','values',JSON_ARRAY('Projeye göre'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Kayış ne zaman değiştirilir?','a','Aşınma/çatlak, kayma veya titreşim artışında değişim önerilir.'),
        JSON_OBJECT('q','Tek mi set mi değişmeli?','a','Çoklu kayışlı sistemlerde set halinde değişim tavsiye edilir.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.55,'count',10,'top','Bakım sonrası daha sessiz')
    ),
    'Fan Kayışı | Ensotek Yedek Parçalar',
    'Endüstriyel V-kayış. Fan tahrik sistemlerinde stabil güç aktarımı ve düşük kayma için uygun çözüm.'
  ),
  (
    'bbbb1016-2222-4222-8222-bbbbbbbb1016',
    'en',
    'Fan Belt (V-Belt)',
    'fan-belt-v-belt',
    'Industrial V-belt used in belt-pulley driven fan systems. Proper tensioning and alignment reduces vibration and keeps power transmission stable.',
    'Cooling tower fan belt',
    JSON_ARRAY('sparepart','belt','v-belt','fan drive','maintenance'),
    JSON_OBJECT(
      'use','Belt-pulley fan drive systems',
      'benefit','Stable power transmission, reduced slip',
      'notes','Check pulley alignment and tension during replacement.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','profile','label','Profile','values',JSON_ARRAY('A','B','C (project-dependent)')),
        JSON_OBJECT('key','length','label','Length','values',JSON_ARRAY('Project-dependent'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','When should I replace the belt?','a','Replace when cracked/worn, slipping or if vibration/noise increases.'),
        JSON_OBJECT('q','Single belt or full set?','a','For multi-belt drives, replacing as a set is recommended.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.55,'count',10,'top','Smoother operation after service')
    ),
    'Fan Belt | Ensotek Spare Parts',
    'Industrial V-belt for fan drive systems. Supports stable power transfer with reduced slip when properly tensioned.'
  ),
  (
    'bbbb1016-2222-4222-8222-bbbbbbbb1016',
    'de',
    'Ventilatorriemen (Keilriemen)',
    'ventilatorriemen-keilriemen',
    'Industrie-Keilriemen für riemengetriebene Ventilatorsysteme. Bei korrekter Spannung und Ausrichtung weniger Vibration und stabile Kraftübertragung.',
    'Keilriemen für Kühlturmventilator',
    JSON_ARRAY('ersatzteil','keilriemen','riemen','ventilatorantrieb','wartung'),
    JSON_OBJECT(
      'use','Riemen-/Scheibenantrieb',
      'benefit','Stabile Kraftübertragung, weniger Schlupf',
      'notes','Beim Tausch Ausrichtung der Scheiben und Riemenspannung prüfen.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','profile','label','Profil','values',JSON_ARRAY('A','B','C (projektabhängig)')),
        JSON_OBJECT('key','length','label','Länge','values',JSON_ARRAY('Projektabhängig'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Wann tauschen?','a','Bei Rissen/Verschleiß, Schlupf oder erhöhter Vibration/Geräusch.'),
        JSON_OBJECT('q','Einzeln oder als Satz?','a','Bei Mehrfachriemen-Antrieben ist Satztausch empfehlenswert.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.55,'count',10,'top','Nach Wartung deutlich ruhiger')
    ),
    'Ventilatorriemen | Ensotek Ersatzteile',
    'Industrie-Keilriemen für Ventilatorantriebe. Bei korrekter Spannung stabile Leistung und reduzierter Schlupf.'
  ),

  -- =========================================================
  -- SPAREPART 17: Rulman Seti (Fan Yatağı)
  -- =========================================================
  (
    'bbbb1017-2222-4222-8222-bbbbbbbb1017',
    'de',
    'Fan Rulmanı / Yatak Rulman Seti',
    'fan-rulmani-yatak-rulman-seti',
    'Fan mili ve yataklama noktasında kullanılan rulman seti. Doğru yağlama ve montaj ile uzun ömür ve düşük titreşim sağlar.',
    'Soğutma kulesi fan rulmanı',
    JSON_ARRAY('sparepart','rulman','yatak','fan mili','bakım'),
    JSON_OBJECT(
      'use','Fan mili yataklama',
      'benefit','Düşük sürtünme, stabil çalışma',
      'notes','Montajda eksen kaçıklığı ve aşırı gerginlik rulman ömrünü düşürür.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','type','label','Tip','values',JSON_ARRAY('Yataklı rulman','Rulman + sızdırmazlık (kit)')),
        JSON_OBJECT('key','grease','label','Gres','values',JSON_ARRAY('Standart','Yüksek sıcaklık (opsiyon)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Arıza belirtisi nedir?','a','Isınma, ses artışı ve titreşim yükselmesi rulman sorununa işaret edebilir.'),
        JSON_OBJECT('q','Yağlama aralığı nedir?','a','Çalışma koşullarına göre periyodik gresleme önerilir.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.60,'count',8,'top','Titreşim azaldı')
    ),
    'Fan Rulman Seti | Ensotek Yedek Parçalar',
    'Fan mili için rulman/yatak seti. Doğru montaj ve periyodik yağlama ile uzun ömürlü ve stabil çalışma.'
  ),
  (
    'bbbb1017-2222-4222-8222-bbbbbbbb1017',
    'en',
    'Fan Bearing Set',
    'fan-bearing-set',
    'Bearing set used on the fan shaft and bearing housing. Proper lubrication and installation deliver long life and reduced vibration.',
    'Cooling tower fan bearing',
    JSON_ARRAY('sparepart','bearing','housing','fan shaft','maintenance'),
    JSON_OBJECT(
      'use','Fan shaft bearing support',
      'benefit','Low friction, stable operation',
      'notes','Misalignment and over-tensioning can reduce bearing life.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','type','label','Type','values',JSON_ARRAY('Pillow block bearing','Bearing + seal kit')),
        JSON_OBJECT('key','grease','label','Grease','values',JSON_ARRAY('Standard','High-temperature (optional)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','What are failure signs?','a','Overheating, noise increase and rising vibration may indicate bearing issues.'),
        JSON_OBJECT('q','What is the lubrication interval?','a','Periodic greasing is recommended based on operating conditions.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.60,'count',8,'top','Noticeably smoother rotation')
    ),
    'Fan Bearing Set | Ensotek Spare Parts',
    'Bearing set for fan shafts. Supports stable operation and long service life with proper installation and periodic lubrication.'
  ),
  (
    'bbbb1017-2222-4222-8222-bbbbbbbb1017',
    'de',
    'Ventilator-Lagersatz',
    'ventilator-lagersatz',
    'Lagersatz für Ventilatorwelle und Lagergehäuse. Richtige Schmierung und Montage sorgen für lange Lebensdauer und geringere Vibration.',
    'Lager für Kühlturmventilator',
    JSON_ARRAY('ersatzteil','lager','lagergehäuse','ventilatorwelle','wartung'),
    JSON_OBJECT(
      'use','Lagerung der Ventilatorwelle',
      'benefit','Geringe Reibung, stabiler Lauf',
      'notes','Fluchtungsfehler und zu hohe Riemenspannung verkürzen die Lebensdauer.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','type','label','Typ','values',JSON_ARRAY('Stehlager','Lager + Dichtung (Kit)')),
        JSON_OBJECT('key','grease','label','Fett','values',JSON_ARRAY('Standard','Hochtemperatur (optional)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Welche Symptome?','a','Erwärmung, Geräuschzunahme und steigende Vibration können auf Lagerschäden hinweisen.'),
        JSON_OBJECT('q','Schmierintervall?','a','Je nach Betriebsbedingungen wird periodisches Nachfetten empfohlen.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.60,'count',8,'top','Ruhigerer Lauf')
    ),
    'Ventilator-Lagersatz | Ensotek Ersatzteile',
    'Lagersatz für Ventilatorwellen. Stabiler Betrieb und lange Lebensdauer bei korrekter Montage und Schmierung.'
  ),

  -- =========================================================
  -- SPAREPART 18: Fan Bacası / Fan Stack (FRP)
  -- =========================================================
  (
    'bbbb1018-2222-4222-8222-bbbbbbbb1018',
    'de',
    'FRP Fan Bacası (Fan Stack)',
    'frp-fan-bacasi-fan-stack',
    'Fan çıkışında hava akışını düzenleyen FRP fan bacası. Verimi artırmaya, geri dönüşleri azaltmaya ve fan grubunu atmosferik etkilerden korumaya yardımcı olur.',
    'Soğutma kulesi FRP fan bacası',
    JSON_ARRAY('sparepart','fan bacası','fan stack','frp','hava akışı'),
    JSON_OBJECT(
      'material','FRP (CTP)',
      'function','Hava çıkışını düzenler, verimi destekler',
      'notes','Kule çapı ve fan ölçüsüne göre projelendirilir; segmentli üretim mümkündür.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','diameter','label','Çap','values',JSON_ARRAY('Projeye göre')),
        JSON_OBJECT('key','design','label','Tasarım','values',JSON_ARRAY('Tek parça','Segmentli'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Fan bacası ne sağlar?','a','Akış düzeni iyileşir, bazı uygulamalarda verim ve ses performansı daha stabil olur.'),
        JSON_OBJECT('q','Bakımı zor mu?','a','FRP yüzey temizliği genellikle kolaydır; periyodik kontrol önerilir.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.70,'count',6,'top','Akış daha stabil')
    ),
    'FRP Fan Bacası | Ensotek Yedek Parçalar',
    'FRP fan bacası (fan stack). Hava çıkışını düzenleyerek performansı destekler ve fan grubunu korur.'
  ),
  (
    'bbbb1018-2222-4222-8222-bbbbbbbb1018',
    'en',
    'FRP Fan Stack',
    'frp-fan-stack',
    'FRP fan stack that conditions airflow at the fan discharge. Helps improve efficiency, reduce recirculation and protect the fan group from weather exposure.',
    'Cooling tower FRP fan stack',
    JSON_ARRAY('sparepart','fan stack','frp','airflow','cooling tower'),
    JSON_OBJECT(
      'material','FRP',
      'function','Conditions discharge airflow and supports efficiency',
      'notes','Designed per tower diameter and fan size; segmented construction available.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','diameter','label','Diameter','values',JSON_ARRAY('Project-dependent')),
        JSON_OBJECT('key','design','label','Design','values',JSON_ARRAY('Single piece','Segmented'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','What does a fan stack provide?','a','Improves airflow organization; can stabilize performance and noise in many applications.'),
        JSON_OBJECT('q','Is maintenance difficult?','a','FRP surfaces are generally easy to clean; periodic inspection is recommended.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.70,'count',6,'top','More stable discharge flow')
    ),
    'FRP Fan Stack | Ensotek Spare Parts',
    'FRP fan stack for cooling towers. Conditions discharge airflow to support stable performance and protect the fan group.'
  ),
  (
    'bbbb1018-2222-4222-8222-bbbbbbbb1018',
    'de',
    'FRP-Ventilatorhaube (Fan Stack)',
    'frp-ventilatorhaube-fan-stack',
    'FRP-Ventilatorhaube zur Strömungsführung am Ventilator-Austritt. Kann Effizienz unterstützen, Rückströmungen reduzieren und die Ventilatorgruppe vor Witterung schützen.',
    'FRP Fan Stack für Kühlturm',
    JSON_ARRAY('ersatzteil','fan stack','ventilatorhaube','frp','luftstrom'),
    JSON_OBJECT(
      'material','FRP (GFK)',
      'function','Strömungsführung am Austritt, unterstützt Effizienz',
      'notes','Auslegung nach Turm- und Ventilatorabmessungen; segmentierte Ausführung möglich.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','diameter','label','Durchmesser','values',JSON_ARRAY('Projektabhängig')),
        JSON_OBJECT('key','design','label','Ausführung','values',JSON_ARRAY('Einteilig','Segmentiert'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Wozu dient ein Fan Stack?','a','Verbessert die Strömungsführung und kann Leistung sowie Geräuschverhalten stabilisieren.'),
        JSON_OBJECT('q','Wartung?','a','FRP-Oberflächen sind meist leicht zu reinigen; regelmäßige Sichtprüfung empfohlen.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.70,'count',6,'top','Strömung deutlich ruhiger')
    ),
    'FRP Fan Stack | Ensotek Ersatzteile',
    'FRP-Ventilatorhaube (Fan Stack) zur Strömungsführung. Unterstützt stabile Leistung und schützt die Ventilatorgruppe.'
  ),

  -- =========================================================
  -- SPAREPART 19: Redüktör Yağ Kiti
  -- =========================================================
  (
    'bbbb1019-2222-4222-8222-bbbbbbbb1019',
    'de',
    'Redüktör Yağ Kiti',
    'reduktor-yag-kiti',
    'Redüktörlü tahrik sistemlerinde periyodik bakım için yağ kiti. Yağ değişimi ile ısınma ve aşınma riskleri azaltılır; servis ömrü desteklenir.',
    'Soğutma kulesi redüktör yağ kiti',
    JSON_ARRAY('sparepart','reduktor','yağ','bakım kiti','gearbox'),
    JSON_OBJECT(
      'use','Redüktör/dişli kutusu bakımı',
      'benefit','Aşınma ve ısınma riskini azaltır',
      'notes','Yağ tipi ve viskozite proje/ekipman etiketine göre seçilmelidir.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','oilGrade','label','Yağ sınıfı','values',JSON_ARRAY('ISO VG (projeye göre)')),
        JSON_OBJECT('key','kit','label','İçerik','values',JSON_ARRAY('Yağ + conta','Yağ + conta + tapa/filtre (opsiyon)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Yağ değişim periyodu nedir?','a','Çalışma saatine ve ortam sıcaklığına göre bakım planına uyulur.'),
        JSON_OBJECT('q','Yanlış yağ kullanılırsa ne olur?','a','Aşınma, ısınma ve arıza riski artar.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.65,'count',9,'top','Bakım sonrası daha serin çalışıyor')
    ),
    'Redüktör Yağ Kiti | Ensotek Yedek Parçalar',
    'Redüktör bakım yağı kiti. Periyodik yağ değişimi ile tahrik sisteminde stabil ve uzun ömürlü işletim desteklenir.'
  ),
  (
    'bbbb1019-2222-4222-8222-bbbbbbbb1019',
    'en',
    'Gearbox Oil Kit',
    'gearbox-oil-kit',
    'Oil kit for periodic maintenance of reducer/gearbox drive systems. Oil changes reduce overheating and wear risks and support service life.',
    'Cooling tower gearbox oil kit',
    JSON_ARRAY('sparepart','reducer','oil','maintenance kit','gearbox'),
    JSON_OBJECT(
      'use','Reducer/gearbox maintenance',
      'benefit','Reduces wear and overheating risk',
      'notes','Select oil type and viscosity per equipment nameplate/project specification.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','oilGrade','label','Oil grade','values',JSON_ARRAY('ISO VG (project-dependent)')),
        JSON_OBJECT('key','kit','label','Contents','values',JSON_ARRAY('Oil + seals','Oil + seals + plug/filter (optional)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','What is the oil change interval?','a','Follow the maintenance plan based on operating hours and temperature conditions.'),
        JSON_OBJECT('q','What if the wrong oil is used?','a','Wear and overheating risks increase and failures may occur.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.65,'count',9,'top','Helps keep gearbox running cooler')
    ),
    'Gearbox Oil Kit | Ensotek Spare Parts',
    'Oil kit for gearbox maintenance. Supports stable and long-life operation with scheduled oil changes.'
  ),
  (
    'bbbb1019-2222-4222-8222-bbbbbbbb1019',
    'de',
    'Getriebe-Öl-Kit',
    'getriebe-oel-kit',
    'Öl-Kit für die periodische Wartung von Getrieben/Reduzierern. Ölwechsel reduziert Überhitzungs- und Verschleißrisiken und unterstützt die Lebensdauer.',
    'Getriebe-Öl-Kit für Kühlturm',
    JSON_ARRAY('ersatzteil','getriebe','öl','wartung','reduzierer'),
    JSON_OBJECT(
      'use','Getriebe-/Reduziererwartung',
      'benefit','Reduziert Verschleiß und Überhitzung',
      'notes','Öltyp und Viskosität gemäß Typenschild/Projektvorgabe auswählen.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','oilGrade','label','Ölklasse','values',JSON_ARRAY('ISO VG (projektabhängig)')),
        JSON_OBJECT('key','kit','label','Inhalt','values',JSON_ARRAY('Öl + Dichtungen','Öl + Dichtungen + Stopfen/Filter (optional)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Wechselintervall?','a','Gemäß Wartungsplan nach Betriebsstunden und Temperaturbedingungen.'),
        JSON_OBJECT('q','Folgen bei falschem Öl?','a','Höherer Verschleiß, Überhitzung und Ausfallrisiko.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.65,'count',9,'top','Getriebe läuft spürbar ruhiger')
    ),
    'Getriebe-Öl-Kit | Ensotek Ersatzteile',
    'Öl-Kit für Getriebewartung. Unterstützt stabile, langlebige Funktion durch geplante Ölwechsel.'
  ),

  -- =========================================================
  -- SPAREPART 20: Şamandıra / Seviye Valfi
  -- =========================================================
  (
    'bbbb1020-2222-4222-8222-bbbbbbbb1020',
    'de',
    'Şamandıra (Seviye Kontrol) Valfi',
    'samandira-seviye-kontrol-valfi',
    'Kule havuzunda su seviyesini otomatik kontrol eden şamandıra valfi. Şebeke/make-up su beslemesini seviyeye göre açıp kapatır.',
    'Soğutma kulesi şamandıra valfi',
    JSON_ARRAY('sparepart','şamandıra','seviye','valf','make up water'),
    JSON_OBJECT(
      'function','Su seviyesini otomatik regüle eder',
      'use','Havuz/make-up besleme hattı',
      'notes','Korozyon ve kireçlenme koşullarına göre malzeme seçimi önemlidir.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','connection','label','Bağlantı','values',JSON_ARRAY('Projeye göre (dişli)')),
        JSON_OBJECT('key','material','label','Gövde','values',JSON_ARRAY('Pirinç','Paslanmaz (opsiyon)','Polimer (projeye göre)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Seviye dalgalanması olursa?','a','Şamandıra ayarı ve besleme basıncı kontrol edilmelidir.'),
        JSON_OBJECT('q','Bakımı nasıl?','a','Periyodik temizlik, kireç/partikül birikimini azaltır.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.50,'count',7,'top','Seviye daha stabil')
    ),
    'Şamandıra Valfi | Ensotek Yedek Parçalar',
    'Seviye kontrol şamandıra valfi. Havuz su seviyesini otomatik yöneterek make-up beslemeyi düzenler.'
  ),
  (
    'bbbb1020-2222-4222-8222-bbbbbbbb1020',
    'en',
    'Float Valve (Level Control)',
    'float-valve-level-control',
    'Float valve that automatically controls basin water level. Opens/closes make-up water feed depending on the level.',
    'Cooling tower float valve',
    JSON_ARRAY('sparepart','float valve','level control','valve','make-up'),
    JSON_OBJECT(
      'function','Automatically regulates water level',
      'use','Basin / make-up water line',
      'notes','Material selection is important for corrosion and scaling conditions.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','connection','label','Connection','values',JSON_ARRAY('Project-dependent (threaded)')),
        JSON_OBJECT('key','material','label','Body','values',JSON_ARRAY('Brass','Stainless (optional)','Polymer (project-dependent)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','What if the level fluctuates?','a','Check float setting and feed pressure.'),
        JSON_OBJECT('q','How to maintain?','a','Periodic cleaning reduces scale/particle buildup.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.50,'count',7,'top','More stable basin level')
    ),
    'Float Valve | Ensotek Spare Parts',
    'Level control float valve for cooling tower basins. Automatically regulates make-up water feed for stable operation.'
  ),
  (
    'bbbb1020-2222-4222-8222-bbbbbbbb1020',
    'de',
    'Schwimmerventil (Niveauregler)',
    'schwimmerventil-niveauregler',
    'Schwimmerventil zur automatischen Regelung des Wasserstands im Becken. Öffnet/schließt die Nachspeisung abhängig vom Niveau.',
    'Schwimmerventil für Kühlturm',
    JSON_ARRAY('ersatzteil','schwimmer','niveau','ventil','nachspeisung'),
    JSON_OBJECT(
      'function','Automatische Wasserstandsregelung',
      'use','Becken / Nachspeiseleitung',
      'notes','Materialwahl je nach Korrosion und Verkalkung wichtig.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','connection','label','Anschluss','values',JSON_ARRAY('Projektabhängig (Gewinde)')),
        JSON_OBJECT('key','material','label','Gehäuse','values',JSON_ARRAY('Messing','Edelstahl (optional)','Polymer (projektabhängig)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Bei Niveauschwingung?','a','Schwimmereinstellung und Speisedruck prüfen.'),
        JSON_OBJECT('q','Wartung?','a','Regelmäßige Reinigung reduziert Kalk-/Partikelablagerungen.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.50,'count',7,'top','Niveau hält besser')
    ),
    'Schwimmerventil | Ensotek Ersatzteile',
    'Schwimmerventil zur Wasserstandsregelung. Stabilisiert die Nachspeisung und unterstützt einen zuverlässigen Betrieb.'
  ),

  -- =========================================================
  -- SPAREPART 21: Damla Tutucu Montaj Seti
  -- =========================================================
  (
    'bbbb1021-2222-4222-8222-bbbbbbbb1021',
    'de',
    'Damla Tutucu Montaj Seti (Klips/Askı)',
    'damla-tutucu-montaj-seti-klips-aski',
    'Damla tutucu modüllerinin kule içindeki taşıyıcılara sabitlenmesi için klips ve askı seti. Hızlı montaj ve güvenli tutuş sağlar.',
    'Damla tutucu klips askı seti',
    JSON_ARRAY('sparepart','damla tutucu','montaj seti','klips','askı'),
    JSON_OBJECT(
      'use','Damla tutucu modülleri montajı',
      'benefit','Hızlı montaj, güvenli sabitleme',
      'notes','Kule profiline ve damla tutucu tipine göre set içeriği değişebilir.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Malzeme','values',JSON_ARRAY('Paslanmaz','Polimer (projeye göre)')),
        JSON_OBJECT('key','kitSize','label','Set','values',JSON_ARRAY('Standart','Projeye göre'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Her profil ile uyumlu mu?','a','Uyumluluk, damla tutucu profili ve taşıyıcı konstrüksiyona göre seçilmelidir.'),
        JSON_OBJECT('q','Korozyon riski?','a','Islak ortamda paslanmaz tercih edilmesi önerilir.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.55,'count',5,'top','Montajı hızlandırdı')
    ),
    'Damla Tutucu Montaj Seti | Ensotek Yedek Parçalar',
    'Damla tutucu montaj seti. Klips/askı bileşenleriyle hızlı ve güvenli sabitleme sağlar.'
  ),
  (
    'bbbb1021-2222-4222-8222-bbbbbbbb1021',
    'en',
    'Drift Eliminator Mounting Kit (Clips/Hangers)',
    'drift-eliminator-mounting-kit-clips-hangers',
    'Clip and hanger kit for securing drift eliminator modules to internal supports. Enables fast installation and reliable retention.',
    'Drift eliminator mounting kit',
    JSON_ARRAY('sparepart','drift eliminator','mounting kit','clips','hangers'),
    JSON_OBJECT(
      'use','Mounting drift eliminator modules',
      'benefit','Fast installation, secure fixing',
      'notes','Kit contents may vary by tower support profile and eliminator type.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Material','values',JSON_ARRAY('Stainless','Polymer (project-dependent)')),
        JSON_OBJECT('key','kitSize','label','Kit','values',JSON_ARRAY('Standard','Project-dependent'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Is it compatible with all profiles?','a','Select based on eliminator profile and internal support structure.'),
        JSON_OBJECT('q','Corrosion risk?','a','Stainless hardware is recommended for wet environments.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.55,'count',5,'top','Reduced installation time')
    ),
    'Mounting Kit | Ensotek Spare Parts',
    'Mounting kit for drift eliminators. Clips/hangers provide fast and secure installation in cooling towers.'
  ),
  (
    'bbbb1021-2222-4222-8222-bbbbbbbb1021',
    'de',
    'Montageset für Tropfenabscheider (Clips/Aufhängung)',
    'montageset-tropfenabscheider-clips-aufhaengung',
    'Clip- und Aufhängeset zur Befestigung von Tropfenabscheider-Modulen an der Innenkonstruktion. Für schnelle Montage und sicheren Halt.',
    'Montageset für Tropfenabscheider',
    JSON_ARRAY('ersatzteil','tropfenabscheider','montage','clips','aufhängung'),
    JSON_OBJECT(
      'use','Montage von Tropfenabscheider-Modulen',
      'benefit','Schnelle Montage, sichere Fixierung',
      'notes','Inhalt je nach Profil/Abscheider-Typ turmspezifisch.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Material','values',JSON_ARRAY('Edelstahl','Polymer (projektabhängig)')),
        JSON_OBJECT('key','kitSize','label','Set','values',JSON_ARRAY('Standard','Projektabhängig'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Passt es immer?','a','Kompatibilität nach Abscheiderprofil und Tragkonstruktion auswählen.'),
        JSON_OBJECT('q','Korrosion?','a','Für Nassbereiche wird Edelstahl empfohlen.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.55,'count',5,'top','Montage deutlich schneller')
    ),
    'Montageset | Ensotek Ersatzteile',
    'Montageset für Tropfenabscheider. Clips/Aufhängungen ermöglichen schnelle und sichere Installation im Kühlturm.'
  ),

  -- =========================================================
  -- SPAREPART 22: AISI 304 Fastener Kit
  -- =========================================================
  (
    'bbbb1022-2222-4222-8222-bbbbbbbb1022',
    'de',
    'Paslanmaz Bağlantı Elemanları Kiti (AISI 304)',
    'paslanmaz-baglanti-elemanlari-kiti-aisi-304',
    'Kule içi montajlarda korozyon dayanımı için AISI 304 paslanmaz bağlantı elemanları kiti. Civata, somun ve pul seçenekleri ile sahada hızlı servis sağlar.',
    'AISI 304 paslanmaz civata somun pulu',
    JSON_ARRAY('sparepart','paslanmaz','civata','somun','pul','aisi 304'),
    JSON_OBJECT(
      'material','AISI 304',
      'use','Kule içi montaj ve servis',
      'benefit','Korozyon dayanımı, uzun ömür',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','sizes','label','Ebatlar','values',JSON_ARRAY('M6','M8','M10','M12 (projeye göre)')),
        JSON_OBJECT('key','content','label','İçerik','values',JSON_ARRAY('Civata+Somun+Pul','Projeye göre kit'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','AISI 316 gerekir mi?','a','Daha agresif ortam ve kimyasal yükte AISI 316 tercih edilebilir.'),
        JSON_OBJECT('q','Karma kit yapılabilir mi?','a','Evet, kule üzerindeki farklı noktalar için karışık kit hazırlanabilir.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.60,'count',6,'top','Paslanma problemi bitti')
    ),
    'Paslanmaz Bağlantı Kiti | Ensotek Yedek Parçalar',
    'AISI 304 paslanmaz bağlantı elemanları kiti. Kule içi ıslak ortamda korozyon dayanımı ve hızlı servis sağlar.'
  ),
  (
    'bbbb1022-2222-4222-8222-bbbbbbbb1022',
    'en',
    'Stainless Fastener Kit (AISI 304)',
    'stainless-fastener-kit-aisi-304',
    'AISI 304 stainless fastener kit for corrosion resistance in internal tower installations. Supports fast on-site service with bolt/nut/washer options.',
    'AISI 304 stainless fasteners',
    JSON_ARRAY('sparepart','stainless','bolts','nuts','washers','aisi 304'),
    JSON_OBJECT(
      'material','AISI 304',
      'use','Internal tower installation and service',
      'benefit','Corrosion resistance, long life',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','sizes','label','Sizes','values',JSON_ARRAY('M6','M8','M10','M12 (project-dependent)')),
        JSON_OBJECT('key','content','label','Contents','values',JSON_ARRAY('Bolt+Nut+Washer','Project-specific kit'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Do I need AISI 316?','a','For more aggressive environments/chemicals, AISI 316 may be preferred.'),
        JSON_OBJECT('q','Can you provide mixed kits?','a','Yes, mixed kits can be prepared per tower service points.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.60,'count',6,'top','No more rust issues')
    ),
    'Stainless Fastener Kit | Ensotek Spare Parts',
    'AISI 304 stainless fastener kit for wet tower environments. Improves corrosion resistance and supports fast maintenance.'
  ),
  (
    'bbbb1022-2222-4222-8222-bbbbbbbb1022',
    'de',
    'Edelstahl-Befestigungskit (AISI 304)',
    'edelstahl-befestigungskit-aisi-304',
    'AISI 304 Edelstahl-Befestigungskit für korrosionsbeständige Montage im Kühlturm. Schrauben, Muttern und Unterlegscheiben für schnellen Service.',
    'AISI 304 Edelstahl-Schraubenset',
    JSON_ARRAY('ersatzteil','edelstahl','schrauben','muttern','unterlegscheiben','aisi 304'),
    JSON_OBJECT(
      'material','AISI 304',
      'use','Innenmontage und Service',
      'benefit','Korrosionsbeständig, langlebig',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','sizes','label','Größen','values',JSON_ARRAY('M6','M8','M10','M12 (projektabhängig)')),
        JSON_OBJECT('key','content','label','Inhalt','values',JSON_ARRAY('Schraube+Mutter+Scheibe','Projektkit'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Wann AISI 316?','a','Bei aggressiveren Medien/chemischer Belastung kann AISI 316 sinnvoll sein.'),
        JSON_OBJECT('q','Gemischte Kits möglich?','a','Ja, gemischte Kits für unterschiedliche Montagepunkte sind möglich.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.60,'count',6,'top','Sehr robust im Nassbereich')
    ),
    'Edelstahl-Kit | Ensotek Ersatzteile',
    'AISI 304 Edelstahl-Befestigungskit. Ideal für feuchte, korrosive Turmumgebungen und schnelle Wartung.'
  ),

  -- =========================================================
  -- SPAREPART 23: Su Dağıtım Kollektörü
  -- =========================================================
  (
    'bbbb1023-2222-4222-8222-bbbbbbbb1023',
    'de',
    'Su Dağıtım Kollektörü (Header/Manifold)',
    'su-dagitim-kollektoru-header-manifold',
    'Su dağıtım sisteminin ana kollektörü. Nozul hatlarına debiyi dengeli aktarır; kule modeline göre PVC/PP/CTP seçenekleriyle üretilir.',
    'Soğutma kulesi su dağıtım kollektörü',
    JSON_ARRAY('sparepart','kollektör','manifold','su dağıtım','nozul hattı'),
    JSON_OBJECT(
      'function','Nozul hatlarına dengeli su besler',
      'materials','PVC / PP / CTP',
      'notes','Hidrolik denge ve uniform dağıtım için çıkış sayısı ve çaplar projelendirilir.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Malzeme','values',JSON_ARRAY('PVC','PP','CTP')),
        JSON_OBJECT('key','outlets','label','Çıkış sayısı','values',JSON_ARRAY('Projeye göre'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Dengesiz dağıtım neye sebep olur?','a','Kuru noktalar, performans düşüşü ve kireçlenme riskini artırabilir.'),
        JSON_OBJECT('q','Revizyon yapılabilir mi?','a','Mevcut kule ölçülerine göre kolektör revizyonu planlanabilir.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.65,'count',4,'top','Dağıtım daha dengeli')
    ),
    'Su Dağıtım Kollektörü | Ensotek Yedek Parçalar',
    'Header/manifold kollektörü. Nozul hatlarına dengeli besleme sağlayarak dolgu üzerinde uniform dağıtımı destekler.'
  ),
  (
    'bbbb1023-2222-4222-8222-bbbbbbbb1023',
    'en',
    'Water Distribution Header (Manifold)',
    'water-distribution-header-manifold',
    'Main header of the water distribution system. Feeds nozzle lines evenly; manufactured in PVC/PP/FRP options based on tower model.',
    'Cooling tower distribution header',
    JSON_ARRAY('sparepart','header','manifold','water distribution','nozzle lines'),
    JSON_OBJECT(
      'function','Evenly feeds nozzle lines',
      'materials','PVC / PP / FRP',
      'notes','Outlet count and diameters are engineered for hydraulic balance and uniform distribution.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Material','values',JSON_ARRAY('PVC','PP','FRP')),
        JSON_OBJECT('key','outlets','label','Number of outlets','values',JSON_ARRAY('Project-dependent'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','What causes uneven distribution?','a','Dry spots, reduced performance, and higher scaling risk.'),
        JSON_OBJECT('q','Can it be retrofitted?','a','Yes, retrofit can be planned based on existing tower dimensions.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.65,'count',4,'top','Improved uniformity')
    ),
    'Distribution Header | Ensotek Spare Parts',
    'Water distribution header/manifold for cooling towers. Supports uniform wetting by evenly feeding nozzle lines.'
  ),
  (
    'bbbb1023-2222-4222-8222-bbbbbbbb1023',
    'de',
    'Wasserverteilersammler (Header/Manifold)',
    'wasserverteilersammler-header-manifold',
    'Hauptsammler des Wasserverteilersystems. Speist die Düsenleitungen gleichmäßig; Ausführung in PVC/PP/FRP je nach Turm.',
    'Wasserverteilersammler für Kühlturm',
    JSON_ARRAY('ersatzteil','sammler','manifold','wasserverteilung','duesenleitung'),
    JSON_OBJECT(
      'function','Gleichmäßige Speisung der Düsenleitungen',
      'materials','PVC / PP / FRP',
      'notes','Abgänge und Durchmesser werden zur hydraulischen Balance projektiert.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','material','label','Material','values',JSON_ARRAY('PVC','PP','FRP')),
        JSON_OBJECT('key','outlets','label','Abgänge','values',JSON_ARRAY('Projektabhängig'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Folgen ungleichmäßiger Verteilung?','a','Trockenstellen, Leistungsabfall und höhere Verkalkungsgefahr.'),
        JSON_OBJECT('q','Nachrüstung möglich?','a','Ja, je nach Bestandsmaßen ist eine Nachrüstung/Revision möglich.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.65,'count',4,'top','Gleichmäßiger Betrieb')
    ),
    'Wasserverteilersammler | Ensotek Ersatzteile',
    'Header/Manifold für Kühltürme. Unterstützt gleichmäßige Benetzung durch ausgewogene Speisung der Düsenleitungen.'
  ),

  -- =========================================================
  -- SPAREPART 24: Nozul Yedek Memesi
  -- =========================================================
  (
    'bbbb1024-2222-4222-8222-bbbbbbbb1024',
    'de',
    'Nozul Yedek Memesi (Orifis/Insert)',
    'nozul-yedek-memesi-orifis-insert',
    'Nozul debi karakteristiğini belirleyen yedek meme/orifis parçası. Aşınma veya tıkanma sonrası hızlı değişim ile dağıtım performansını geri kazandırır.',
    'Nozul yedek orifis memesi',
    JSON_ARRAY('sparepart','nozul','orifis','yedek parça','debi'),
    JSON_OBJECT(
      'use','Nozul orifis/insert değişimi',
      'benefit','Hızlı servis, dağıtım performansı',
      'notes','Orifis ölçüsü kule debisi ve basınca göre seçilmelidir.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','size','label','Orifis','values',JSON_ARRAY('Projeye göre')),
        JSON_OBJECT('key','material','label','Malzeme','values',JSON_ARRAY('PP','Özel polimer (projeye göre)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Ne zaman değişmeli?','a','Aşınma, çatlak, debi düşüşü veya dağıtım bozulmasında değişim önerilir.'),
        JSON_OBJECT('q','Tıkanma nasıl azaltılır?','a','Ön filtrasyon ve periyodik temizlik/water treatment önerilir.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.50,'count',9,'top','Dağıtım hızla düzeldi')
    ),
    'Nozul Yedek Memesi | Ensotek Yedek Parçalar',
    'Orifis/insert nozul yedek memesi. Hızlı değişimle debi ve dağıtım performansını geri kazandırır.'
  ),
  (
    'bbbb1024-2222-4222-8222-bbbbbbbb1024',
    'en',
    'Nozzle Orifice Insert (Spare)',
    'nozzle-orifice-insert-spare',
    'Replacement orifice/insert that defines nozzle flow characteristics. Quick swap after wear or clogging restores distribution performance.',
    'Nozzle orifice insert spare',
    JSON_ARRAY('sparepart','nozzle','orifice','spare','flow'),
    JSON_OBJECT(
      'use','Nozzle orifice/insert replacement',
      'benefit','Fast service, restored distribution performance',
      'notes','Choose orifice size based on tower flow rate and pressure.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','size','label','Orifice size','values',JSON_ARRAY('Project-dependent')),
        JSON_OBJECT('key','material','label','Material','values',JSON_ARRAY('PP','Engineered polymer (project-dependent)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','When should it be replaced?','a','Replace when worn/cracked, flow decreases or distribution degrades.'),
        JSON_OBJECT('q','How to reduce clogging?','a','Use pre-filtration and periodic cleaning/water treatment.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.50,'count',9,'top','Quick fix for uneven spray')
    ),
    'Nozzle Insert | Ensotek Spare Parts',
    'Nozzle orifice insert spare. Restores flow and distribution with quick replacement after wear or clogging.'
  ),
  (
    'bbbb1024-2222-4222-8222-bbbbbbbb1024',
    'de',
    'Düsen-Orifice/Insert (Ersatz)',
    'duesen-orifice-insert-ersatz',
    'Ersatz-Orifice/Insert, der die Durchflusscharakteristik der Düse bestimmt. Schneller Austausch nach Verschleiß oder Verstopfung stellt die Verteilqualität wieder her.',
    'Ersatz-Orifice für Düse',
    JSON_ARRAY('ersatzteil','düse','orifice','insert','durchfluss'),
    JSON_OBJECT(
      'use','Austausch Orifice/Insert',
      'benefit','Schneller Service, wiederhergestellte Verteilung',
      'notes','Orifice-Größe nach Durchfluss und Druck auslegen.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','size','label','Orifice','values',JSON_ARRAY('Projektabhängig')),
        JSON_OBJECT('key','material','label','Material','values',JSON_ARRAY('PP','Spezialpolymer (projektabhängig)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Wann tauschen?','a','Bei Verschleiß/Rissen, Durchflussabfall oder schlechter Verteilung.'),
        JSON_OBJECT('q','Wie Verstopfung reduzieren?','a','Vorfiltration sowie regelmäßige Reinigung/Wasseraufbereitung.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.50,'count',9,'top','Verteilung schnell wieder ok')
    ),
    'Düsen-Insert | Ensotek Ersatzteile',
    'Ersatz-Insert/Orifice für Düsen. Schneller Austausch stellt Durchfluss und Verteilung wieder her.'
  ),

  -- =========================================================
  -- SPAREPART 25: Titreşim Sensörü
  -- =========================================================
  (
    'bbbb1025-2222-4222-8222-bbbbbbbb1025',
    'de',
    'Titreşim Sensörü (Transmitter)',
    'titresim-sensoru-transmitter',
    'Fan/motor grubunda titreşimi sürekli izleyen titreşim sensörü. Kritik seviyelerde alarm/kapama entegrasyonuna uygundur; kestirimci bakım için veri sağlar.',
    'Soğutma kulesi titreşim sensörü',
    JSON_ARRAY('sparepart','titresim','sensör','kestirimci bakım','alarm'),
    JSON_OBJECT(
      'function','Titreşimi ölçer ve izler',
      'use','Fan/motor yataklama noktaları',
      'integration','Alarm/PLC/SCADA uyumlu (projeye göre)',
      'notes','Sensör seçimi ölçüm aralığı ve montaj tipine göre yapılır.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','output','label','Çıkış','values',JSON_ARRAY('4-20mA (projeye göre)','Dijital (projeye göre)')),
        JSON_OBJECT('key','mounting','label','Montaj','values',JSON_ARRAY('Cıvatalı','Manyetik taban (servis amaçlı)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Şalterden farkı nedir?','a','Şalter eşik aşımında keser; sensör ise sürekli ölçüm ve trend takibi sağlar.'),
        JSON_OBJECT('q','Nereye takılmalı?','a','Yataklama noktaları ve kritik taşıyıcı bölgeler tercih edilir.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.70,'count',6,'top','Trend takibi çok faydalı')
    ),
    'Titreşim Sensörü | Ensotek Yedek Parçalar',
    'Titreşim sensörü/transmitter. Sürekli ölçüm ile kestirimci bakım ve alarm entegrasyonu için uygun çözüm.'
  ),
  (
    'bbbb1025-2222-4222-8222-bbbbbbbb1025',
    'en',
    'Vibration Sensor (Transmitter)',
    'vibration-sensor-transmitter',
    'Vibration sensor that continuously monitors the fan/motor group. Supports alarm/shutdown integration and provides data for predictive maintenance.',
    'Cooling tower vibration sensor',
    JSON_ARRAY('sparepart','vibration','sensor','predictive maintenance','alarm'),
    JSON_OBJECT(
      'function','Measures and monitors vibration',
      'use','Fan/motor bearing points',
      'integration','Alarm/PLC/SCADA compatible (project-dependent)',
      'notes','Select by measurement range and mounting type.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','output','label','Output','values',JSON_ARRAY('4-20mA (project-dependent)','Digital (project-dependent)')),
        JSON_OBJECT('key','mounting','label','Mounting','values',JSON_ARRAY('Bolted','Magnetic base (service)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','How is it different from a vibration switch?','a','A switch trips at a threshold; a sensor provides continuous measurement and trend analysis.'),
        JSON_OBJECT('q','Where should it be installed?','a','Prefer bearing points and critical structural locations.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.70,'count',6,'top','Useful for early fault detection')
    ),
    'Vibration Sensor | Ensotek Spare Parts',
    'Vibration sensor/transmitter for continuous monitoring. Enables predictive maintenance and integration with alarms/control systems.'
  ),
  (
    'bbbb1025-2222-4222-8222-bbbbbbbb1025',
    'de',
    'Vibrationssensor (Transmitter)',
    'vibrationssensor-transmitter',
    'Vibrationssensor zur kontinuierlichen Überwachung der Ventilator-/Motorgruppe. Geeignet für Alarm/Abschalt-Integration und liefert Daten für zustandsorientierte Wartung.',
    'Vibrationssensor für Kühlturm',
    JSON_ARRAY('ersatzteil','vibration','sensor','zustandsüberwachung','alarm'),
    JSON_OBJECT(
      'function','Misst und überwacht Vibration',
      'use','Lagerstellen von Ventilator/Motor',
      'integration','Alarm/PLC/SCADA (projektabhängig)',
      'notes','Auswahl nach Messbereich und Montageart.',
      'options', JSON_ARRAY(
        JSON_OBJECT('key','output','label','Ausgang','values',JSON_ARRAY('4-20mA (projektabhängig)','Digital (projektabhängig)')),
        JSON_OBJECT('key','mounting','label','Montage','values',JSON_ARRAY('Verschraubt','Magnetfuß (Service)'))
      ),
      'faqs', JSON_ARRAY(
        JSON_OBJECT('q','Unterschied zum Vibrationsschalter?','a','Schalter schaltet bei Schwelle ab; Sensor liefert kontinuierliche Messwerte und Trendanalyse.'),
        JSON_OBJECT('q','Montageort?','a','Bevorzugt an Lagerstellen und kritischen Strukturpunkten.')
      ),
      'reviewsSummary', JSON_OBJECT('avg',4.70,'count',6,'top','Früherkennung von Problemen')
    ),
    'Vibrationssensor | Ensotek Ersatzteile',
    'Vibrationssensor/Transmitter für kontinuierliche Zustandsüberwachung. Unterstützt Predictive Maintenance und Alarm-Integration.'
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
