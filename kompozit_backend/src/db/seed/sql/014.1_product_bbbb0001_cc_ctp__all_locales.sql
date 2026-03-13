-- =============================================================
-- FILE: 014.1_product_bbbb0001_cc_ctp__all_locales.sql (FINAL / VALIDATION ALIGNED)
-- Ensotek – Product Seed (01/..)
-- Product: Closed Circuit Cooling Towers – CC CTP / CC DCTP Series
--
-- FIXES:
--  - products.image_url: FULL URL
--  - products.images: MULTI IMAGE JSON_ARRAY
--  - product_i18n.description: PLAIN TEXT (NO HTML)
--  - TR/EN/DE in ONE FILE
--  - product_specs uses order_num (NO display_order)
--  - all child IDs: CHAR(36) safe
--  - ✅ product_i18n.specifications: RECORD<string,string> (NO JSON_ARRAY values) (validation.ts aligned)
--
-- RULES:
--  - products.item_type = 'product'
--  - category_id / sub_category_id as given
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =============================================================
-- BASE PRODUCT (product)
-- =============================================================
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
VALUES (
  'bbbb0001-2222-4222-8222-bbbbbbbb0001',
  'product',
  'aaaa0003-1111-4111-8111-aaaaaaaa0003',
  'bbbb0201-1111-4111-8111-bbbbbbbb0201',
  0.00,
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1767321365/products/cover/closed-circuit-cooling-tower-1-250x250-1.png',
  NULL,
  JSON_ARRAY(
    'https://www.ensotek.de/uploads/material/closed-circuit-cooling-tower-1-250x250-1.jpg',
    'https://www.ensotek.de/uploads/material/closed-circuit-cooling-tower-2-250x250-1.jpg',
    'https://www.ensotek.de/uploads/material/closed-circuit-cooling-tower-3-250x250-1.jpg'
  ),
  JSON_ARRAY(),
  1,
  1,
  100,
  'CC-CTP',
  0,
  5.00,
  0
)
ON DUPLICATE KEY UPDATE
  item_type          = VALUES(item_type),
  category_id        = VALUES(category_id),
  sub_category_id    = VALUES(sub_category_id),
  price              = VALUES(price),
  image_url          = VALUES(image_url),
  storage_asset_id   = VALUES(storage_asset_id),
  images             = VALUES(images),
  storage_image_ids  = VALUES(storage_image_ids),
  is_active          = VALUES(is_active),
  is_featured        = VALUES(is_featured),
  order_num          = VALUES(order_num),
  product_code       = VALUES(product_code),
  stock_quantity     = VALUES(stock_quantity),
  rating             = VALUES(rating),
  review_count       = VALUES(review_count);

-- =============================================================
-- I18N (TR)
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb0001-2222-4222-8222-bbbbbbbb0001',
  'tr',
  'Kapalı Tip Su Soğutma Kuleleri – CC CTP / CC DCTP Serisi',
  'kapali-tip-su-sogutma-kuleleri-cc-ctp-cc-dctp',
  'Kapalı sistemler, soğutulacak suyun kirliliğe karşı hassas olduğu proseslerde tercih edilir. Temiz kalması istenen su, kapalı tip kule içindeki serpantinlerden geçerken soğutulur. Sıcak su boru içerisinden geçerken, soğuk hava ve kulenin sirkülasyon suyu boru yüzeyinden içerideki suyu soğutur. Kapalı sistem soğutma kuleleri; hava kompresörleri, indüksiyon ocakları ve chiller grupları gibi hassas ekipmanlar içeren proseslerde kullanılır.',
  'Kapalı tip su soğutma kulesi (closed circuit cooling tower) – CC CTP / CC DCTP',
  JSON_ARRAY('kapalı tip', 'closed circuit', 'soğutma kulesi', 'serpantin', 'proses soğutma', 'ensotek'),
  -- ✅ validation.ts: Record<string,string> -> ALL VALUES MUST BE STRING
  JSON_OBJECT(
    'principle', 'Proses akışkanı serpantin/boru içinden geçer; dıştan hava + sirkülasyon suyu ile boru yüzeyinden soğutulur.',
    'useCases', 'Hava kompresörleri | İndüksiyon ocakları | Chiller grupları',
    'series', 'CC CTP | CC DCTP'
  ),
  'Kapalı Tip Su Soğutma Kuleleri | CC CTP / CC DCTP | Ensotek',
  'Kirliliğe hassas proses suları için kapalı tip (closed circuit) su soğutma kuleleri. CC CTP / CC DCTP serileri, model seçenekleri ve teknik özet.'
)
ON DUPLICATE KEY UPDATE
  title            = VALUES(title),
  slug             = VALUES(slug),
  description      = VALUES(description),
  alt              = VALUES(alt),
  tags             = VALUES(tags),
  specifications   = VALUES(specifications),
  meta_title       = VALUES(meta_title),
  meta_description = VALUES(meta_description),
  updated_at       = CURRENT_TIMESTAMP(3);

DELETE FROM product_specs
WHERE product_id='bbbb0001-2222-4222-8222-bbbbbbbb0001' AND locale='tr';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11110001-aaaa-4aaa-8aaa-bbbb0001tr01','bbbb0001-2222-4222-8222-bbbbbbbb0001','tr','Seri / Model Ailesi','CC CTP (tek fan) ve CC DCTP (çift fan)','custom',10),
  ('11110001-aaaa-4aaa-8aaa-bbbb0001tr02','bbbb0001-2222-4222-8222-bbbbbbbb0001','tr','Fan Çapı (Ø)','930 / 1100 / 1250 / 1500 (çift fanlı modeller dahil)','physical',20),
  ('11110001-aaaa-4aaa-8aaa-bbbb0001tr03','bbbb0001-2222-4222-8222-bbbbbbbb0001','tr','Fan Motoru','3 kW’dan 2×5,5 kW’a kadar (modele göre)','physical',30),
  ('11110001-aaaa-4aaa-8aaa-bbbb0001tr04','bbbb0001-2222-4222-8222-bbbbbbbb0001','tr','Sprey Pompası','1,1 kW – 5,5 kW (modele göre)','physical',40),
  ('11110001-aaaa-4aaa-8aaa-bbbb0001tr05','bbbb0001-2222-4222-8222-bbbbbbbb0001','tr','Örnek Ağırlıklar','CC CTP-3C/3: 1400 kg boş, 2300 kg çalışır; CC DCTP-6C/6: 9645 kg boş, 15650 kg çalışır','physical',50);

DELETE FROM product_faqs
WHERE product_id='bbbb0001-2222-4222-8222-bbbbbbbb0001' AND locale='tr';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22220001-aaaa-4aaa-8aaa-bbbb0001tr01','bbbb0001-2222-4222-8222-bbbbbbbb0001','tr','Kapalı tip kule ne zaman tercih edilir?','Soğutulacak suyun kirliliğe/partiküle karşı hassas olduğu ve proses akışkanının temiz kalmasının istendiği uygulamalarda tercih edilir.',10,1),
  ('22220001-aaaa-4aaa-8aaa-bbbb0001tr02','bbbb0001-2222-4222-8222-bbbbbbbb0001','tr','Soğutma prensibi nedir?','Proses akışkanı serpantin/boru içinden geçer. Dış tarafta hava akışı ve kulenin sirkülasyon suyu boru yüzeyinden ısıyı alarak içerideki akışkanı soğutur.',20,1),
  ('22220001-aaaa-4aaa-8aaa-bbbb0001tr03','bbbb0001-2222-4222-8222-bbbbbbbb0001','tr','Hangi proseslerde kullanılır?','Hava kompresörleri, indüksiyon ocakları ve chiller grupları gibi hassas ekipman içeren proseslerde kullanılır.',30,1);

DELETE FROM product_reviews
WHERE id IN (
  '33330001-aaaa-4aaa-8aaa-bbbb0001tr01',
  '33330001-aaaa-4aaa-8aaa-bbbb0001tr02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33330001-aaaa-4aaa-8aaa-bbbb0001tr01','bbbb0001-2222-4222-8222-bbbbbbbb0001',NULL,5,'Hassas proses suyu için stabil ve güvenilir performans.',1,'Tesis Mühendisliği'),
  ('33330001-aaaa-4aaa-8aaa-bbbb0001tr02','bbbb0001-2222-4222-8222-bbbbbbbb0001',NULL,4,'Model seçenekleri geniş; doğru seçimle verim yüksek.',1,'Bakım & Operasyon');

DELETE FROM product_options
WHERE id = '44440001-aaaa-4aaa-8aaa-bbbb0001tr01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44440001-aaaa-4aaa-8aaa-bbbb0001tr01','bbbb0001-2222-4222-8222-bbbbbbbb0001','Model', JSON_ARRAY(
    'CC CTP-3C/3','CC CTP-3C/4','CC CTP-3C/5',
    'CC CTP-4C/4','CC CTP-4C/5',
    'CC CTP-5C/4','CC CTP-5C/5','CC CTP-5C/6',
    'CC CTP-5.5C/5','CC CTP-5.5C/6',
    'CC CTP-6C/5','CC CTP-6C/6',
    'CC DCTP-5C/4','CC DCTP-5C/5','CC DCTP-5C/6',
    'CC DCTP-5.5C/5','CC DCTP-5.5C/6',
    'CC DCTP-6C/5','CC DCTP-6C/6'
  ));

-- =============================================================
-- I18N (EN)
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb0001-2222-4222-8222-bbbbbbbb0001',
  'en',
  'Closed Circuit Cooling Towers – CC CTP / CC DCTP Series',
  'closed-circuit-cooling-towers-cc-ctp-cc-dctp',
  'Closed circuit systems are preferred in processes where the water to be cooled is susceptible to contamination. The water required to remain clean is cooled as it passes through the pipe coils in the closed type tower. Hot water flows inside the coil, while cold air and circulating water remove heat from the coil surface. Closed circuit cooling towers are commonly used in processes containing sensitive equipment such as air compressors, induction furnaces and chillers.',
  'Closed circuit cooling tower – CC CTP / CC DCTP series',
  JSON_ARRAY('closed circuit', 'cooling tower', 'coil', 'process cooling', 'ensotek'),
  -- ✅ validation.ts: Record<string,string> -> ALL VALUES MUST BE STRING
  JSON_OBJECT(
    'principle', 'Process fluid flows inside the coil; it is cooled from the outside by air and circulating water.',
    'useCases', 'Air compressors | Induction furnaces | Chillers',
    'series', 'CC CTP | CC DCTP'
  ),
  'Closed Circuit Cooling Towers | CC CTP / CC DCTP | Ensotek',
  'Closed circuit cooling towers for contamination-sensitive process waters. CC CTP / CC DCTP series with a broad model range and technical highlights.'
)
ON DUPLICATE KEY UPDATE
  title            = VALUES(title),
  slug             = VALUES(slug),
  description      = VALUES(description),
  alt              = VALUES(alt),
  tags             = VALUES(tags),
  specifications   = VALUES(specifications),
  meta_title       = VALUES(meta_title),
  meta_description = VALUES(meta_description),
  updated_at       = CURRENT_TIMESTAMP(3);

DELETE FROM product_specs
WHERE product_id='bbbb0001-2222-4222-8222-bbbbbbbb0001' AND locale='en';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11110001-bbbb-4bbb-8bbb-bbbb0001en01','bbbb0001-2222-4222-8222-bbbbbbbb0001','en','Series / Model Family','CC CTP (single fan) and CC DCTP (double fan)','custom',10),
  ('11110001-bbbb-4bbb-8bbb-bbbb0001en02','bbbb0001-2222-4222-8222-bbbbbbbb0001','en','Fan Diameter (Ø)','930 / 1100 / 1250 / 1500 (incl. double-fan models)','physical',20),
  ('11110001-bbbb-4bbb-8bbb-bbbb0001en03','bbbb0001-2222-4222-8222-bbbbbbbb0001','en','Fan Motors','From 3 kW up to 2×5.5 kW (depending on model)','physical',30),
  ('11110001-bbbb-4bbb-8bbb-bbbb0001en04','bbbb0001-2222-4222-8222-bbbbbbbb0001','en','Spray Pump','1.1 kW – 5.5 kW (depending on model)','physical',40),
  ('11110001-bbbb-4bbb-8bbb-bbbb0001en05','bbbb0001-2222-4222-8222-bbbbbbbb0001','en','Sample Weights','CC CTP-3C/3: 1400 kg empty, 2300 kg operating; CC DCTP-6C/6: 9645 kg empty, 15650 kg operating','physical',50);

DELETE FROM product_faqs
WHERE product_id='bbbb0001-2222-4222-8222-bbbbbbbb0001' AND locale='en';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22220001-bbbb-4bbb-8bbb-bbbb0001en01','bbbb0001-2222-4222-8222-bbbbbbbb0001','en','When should a closed circuit tower be preferred?','It is preferred when the water to be cooled is sensitive to contamination and the process fluid must remain clean.',10,1),
  ('22220001-bbbb-4bbb-8bbb-bbbb0001en02','bbbb0001-2222-4222-8222-bbbbbbbb0001','en','What is the cooling principle?','The process fluid flows inside the coil. Air flow and circulating water remove heat from the coil surface and cool the fluid inside.',20,1),
  ('22220001-bbbb-4bbb-8bbb-bbbb0001en03','bbbb0001-2222-4222-8222-bbbbbbbb0001','en','Typical application areas?','Used in processes with sensitive equipment such as air compressors, induction furnaces and chillers.',30,1);

DELETE FROM product_reviews
WHERE id IN (
  '33330001-bbbb-4bbb-8bbb-bbbb0001en01',
  '33330001-bbbb-4bbb-8bbb-bbbb0001en02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33330001-bbbb-4bbb-8bbb-bbbb0001en01','bbbb0001-2222-4222-8222-bbbbbbbb0001',NULL,5,'Reliable, stable performance for contamination-sensitive process water.',1,'Plant Engineering'),
  ('33330001-bbbb-4bbb-8bbb-bbbb0001en02','bbbb0001-2222-4222-8222-bbbbbbbb0001',NULL,4,'Wide model range; efficient when properly selected.',1,'Operations');

DELETE FROM product_options
WHERE id = '44440001-bbbb-4bbb-8bbb-bbbb0001en01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44440001-bbbb-4bbb-8bbb-bbbb0001en01','bbbb0001-2222-4222-8222-bbbbbbbb0001','Model', JSON_ARRAY(
    'CC CTP-3C/3','CC CTP-3C/4','CC CTP-3C/5',
    'CC CTP-4C/4','CC CTP-4C/5',
    'CC CTP-5C/4','CC CTP-5C/5','CC CTP-5C/6',
    'CC CTP-5.5C/5','CC CTP-5.5C/6',
    'CC CTP-6C/5','CC CTP-6C/6',
    'CC DCTP-5C/4','CC DCTP-5C/5','CC DCTP-5C/6',
    'CC DCTP-5.5C/5','CC DCTP-5.5C/6',
    'CC DCTP-6C/5','CC DCTP-6C/6'
  ));

-- =============================================================
-- I18N (DE)
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb0001-2222-4222-8222-bbbbbbbb0001',
  'de',
  'Geschlossene Kühltürme – CC CTP / CC DCTP Serie',
  'geschlossene-kuehltuerme-cc-ctp-cc-dctp',
  'Geschlossene Systeme werden in Prozessen bevorzugt, in denen das zu kühlende Wasser gegenüber Verunreinigungen empfindlich ist. Das Medium, das sauber bleiben soll, wird gekühlt, während es durch die Rohrschlangen (Coils) im geschlossenen Turm strömt. Das heiße Prozesswasser fließt im Rohr, während Außenluft und Umlaufwasser Wärme über die Rohr-/Coil-Oberfläche abführen. Geschlossene Kühltürme werden u. a. bei Luftkompressoren, Induktionsöfen und Kältemaschinen (Chiller) eingesetzt.',
  'Geschlossener Kühlturm – CC CTP / CC DCTP Serie',
  JSON_ARRAY('geschlossener kühlturm', 'closed circuit', 'coil', 'prozesskühlung', 'ensotek'),
  -- ✅ validation.ts: Record<string,string> -> ALL VALUES MUST BE STRING
  JSON_OBJECT(
    'prinzip', 'Prozessmedium strömt im Coil; Kühlung von außen durch Luft und Umlaufwasser über die Coil-Oberfläche.',
    'einsatz', 'Luftkompressoren | Induktionsöfen | Chiller',
    'serien', 'CC CTP | CC DCTP'
  ),
  'Geschlossene Kühltürme | CC CTP / CC DCTP | Ensotek',
  'Geschlossene (Closed-Circuit) Kühltürme für kontaminationssensitive Prozessmedien. CC CTP / CC DCTP mit umfangreicher Modellauswahl und technischen Eckdaten.'
)
ON DUPLICATE KEY UPDATE
  title            = VALUES(title),
  slug             = VALUES(slug),
  description      = VALUES(description),
  alt              = VALUES(alt),
  tags             = VALUES(tags),
  specifications   = VALUES(specifications),
  meta_title       = VALUES(meta_title),
  meta_description = VALUES(meta_description),
  updated_at       = CURRENT_TIMESTAMP(3);

DELETE FROM product_specs
WHERE product_id='bbbb0001-2222-4222-8222-bbbbbbbb0001' AND locale='de';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11110001-cccc-4ccc-8ccc-bbbb0001de01','bbbb0001-2222-4222-8222-bbbbbbbb0001','de','Serie / Modellfamilie','CC CTP (Einzellüfter) und CC DCTP (Doppellüfter)','custom',10),
  ('11110001-cccc-4ccc-8ccc-bbbb0001de02','bbbb0001-2222-4222-8222-bbbbbbbb0001','de','Ventilator-Durchmesser (Ø)','930 / 1100 / 1250 / 1500 (inkl. Doppellüfter-Modelle)','physical',20),
  ('11110001-cccc-4ccc-8ccc-bbbb0001de03','bbbb0001-2222-4222-8222-bbbbbbbb0001','de','Ventilatormotor(en)','von 3 kW bis 2×5,5 kW (modellabhängig)','physical',30),
  ('11110001-cccc-4ccc-8ccc-bbbb0001de04','bbbb0001-2222-4222-8222-bbbbbbbb0001','de','Sprühpumpe','1,1 kW – 5,5 kW (modellabhängig)','physical',40),
  ('11110001-cccc-4ccc-8ccc-bbbb0001de05','bbbb0001-2222-4222-8222-bbbbbbbb0001','de','Beispielgewichte','CC CTP-3C/3: 1400 kg leer, 2300 kg Betrieb; CC DCTP-6C/6: 9645 kg leer, 15650 kg Betrieb','physical',50);

DELETE FROM product_faqs
WHERE product_id='bbbb0001-2222-4222-8222-bbbbbbbb0001' AND locale='de';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22220001-cccc-4ccc-8ccc-bbbb0001de01','bbbb0001-2222-4222-8222-bbbbbbbb0001','de','Wann ist ein geschlossener Kühlturm sinnvoll?','Wenn das zu kühlende Wasser empfindlich gegenüber Verunreinigungen ist und das Prozessmedium sauber bleiben muss.',10,1),
  ('22220001-cccc-4ccc-8ccc-bbbb0001de02','bbbb0001-2222-4222-8222-bbbbbbbb0001','de','Wie funktioniert das Kühlprinzip?','Das Prozessmedium strömt im Coil. Außenluft und Umlaufwasser entziehen über die Coil-Oberfläche Wärme und kühlen das Medium.',20,1),
  ('22220001-cccc-4ccc-8ccc-bbbb0001de03','bbbb0001-2222-4222-8222-bbbbbbbb0001','de','Typische Einsatzbereiche?','Häufig in Prozessen mit sensibler Ausrüstung: Luftkompressoren, Induktionsöfen und Chiller-Anlagen.',30,1);

DELETE FROM product_reviews
WHERE id IN (
  '33330001-cccc-4ccc-8ccc-bbbb0001de01',
  '33330001-cccc-4ccc-8ccc-bbbb0001de02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33330001-cccc-4ccc-8ccc-bbbb0001de01','bbbb0001-2222-4222-8222-bbbbbbbb0001',NULL,5,'Sehr stabiler Betrieb bei kontaminationssensitiven Prozessmedien.',1,'Anlagenbau'),
  ('33330001-cccc-4ccc-8ccc-bbbb0001de02','bbbb0001-2222-4222-8222-bbbbbbbb0001',NULL,4,'Große Modellvielfalt; Auswahl passend zum Prozess ist entscheidend.',1,'Betrieb');

DELETE FROM product_options
WHERE id = '44440001-cccc-4ccc-8ccc-bbbb0001de01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44440001-cccc-4ccc-8ccc-bbbb0001de01','bbbb0001-2222-4222-8222-bbbbbbbb0001','Modell', JSON_ARRAY(
    'CC CTP-3C/3','CC CTP-3C/4','CC CTP-3C/5',
    'CC CTP-4C/4','CC CTP-4C/5',
    'CC CTP-5C/4','CC CTP-5C/5','CC CTP-5C/6',
    'CC CTP-5.5C/5','CC CTP-5.5C/6',
    'CC CTP-6C/5','CC CTP-6C/6',
    'CC DCTP-5C/4','CC DCTP-5C/5','CC DCTP-5C/6',
    'CC DCTP-5.5C/5','CC DCTP-5.5C/6',
    'CC DCTP-6C/5','CC DCTP-6C/6'
  ));

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
