-- =============================================================
-- FILE: 016.3_sparepart_bbbb1513_air_inlet_louvers__all_locales.sql (FINAL / VALIDATION ALIGNED)
-- Ensotek – Sparepart Seed (13/14)
-- Sparepart: Hava Giriş Panjuru / Air Inlet Louvers / Lufteinlasslamellen
--
-- ✅ FIXES (schema + validation aligned to corrected pattern):
--  - product_i18n.description: PLAIN TEXT (NO HTML)
--  - image urls: FULL URL
--  - product_i18n.specifications: Record<string,string> => ALL VALUES STRING
--    (NO JSON_ARRAY / NO nested JSON_OBJECT inside specifications)
--  - product_specs/product_faqs: locale-based reset with DELETE
--  - product_reviews: id-based reset
--  - product_options is locale-less => TR/EN/DE separate option rows with different IDs
--  - all child IDs: CHAR(36) safe
--
-- RULES (SABIT):
--  - products.item_type        = 'sparepart'
--  - products.category_id      = 'aaaa1001-1111-4111-8111-aaaaaaaa1001'
--  - products.sub_category_id  = 'bbbb1001-1111-4111-8111-bbbbbbbb1001'  (Tower Main Components)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =============================================================
-- BASE PRODUCT (sparepart)
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
  'bbbb1513-2222-4222-8222-bbbbbbbb1513',
  'sparepart',
  'aaaa1001-1111-4111-8111-aaaaaaaa1001',
  'bbbb1001-1111-4111-8111-bbbbbbbb1001',
  0.00,
  'http://localhost:8086/uploads/material/hava-giris-panjuru2-250x250-1.jpg',
  NULL,
  JSON_ARRAY(
    'http://localhost:8086/uploads/material/hava-giris-panjuru2-250x250-1.jpg'
  ),
  JSON_ARRAY(),
  1,
  1,
  1513,
  'SP-AIR-INLET-LOUVERS',
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
-- I18N (TR) — PLAIN TEXT + specifications: Record<string,string>
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1513-2222-4222-8222-bbbbbbbb1513',
  'tr',
  'Hava Giriş Panjuru',
  'hava-giris-panjuru',
  'Hava giriş panjurları, kulenin gövdesinde soğuk su havuzu ile dolgu seviyesi arasında, kulenin dışında yer alır. Görevi; kuleye giren havayı yönlendirerek dolgu yüzeyine daha homojen dağılmasını sağlamak, havuzdan sıçrayan su kaybını azaltmak ve güneş ışınlarını belirli ölçüde keserek yosun oluşumunu azaltmaktır. Lameller 1. sınıf PVC’den çekme sistemiyle üretilir ve minimum hava direnci sağlayan özel bir forma sahiptir. Rüzgârla yerinden çıkmayı önleyici önlemler alınır. İstenirse FRP (CTP) malzemeden de üretilebilir. Yerli ve ithal paket kule tiplerine uygulanabilir.',
  'Soğutma kulesi hava giriş panjuru (louver) yedek parça',
  JSON_ARRAY('yedek parça', 'hava giriş panjuru', 'louver', 'lamel', 'su kaybı azaltma', 'ensotek'),
  JSON_OBJECT(
    'konum', 'Kule gövdesi; soğuk su havuzu ile dolgu seviyesi arası (dış)',
    'amac', 'Hava yönlendirme; sıçrama kaybını azaltma; yosun oluşumunu azaltma',
    'malzeme', 'PVC (1. sınıf) / opsiyon: FRP (CTP)',
    'tasarim', 'Minimum hava direnci sağlayan özel lamel formu',
    'uyumluluk', 'Yerli ve ithal paket kule tipleri'
  ),
  'Hava Giriş Panjuru | Soğutma Kulesi Yedek Parça | Ensotek',
  'Hava giriş panjuru: havayı yönlendirir, su sıçrama kaybını azaltır ve yosun oluşumunu düşürür. PVC lamel; opsiyonel FRP/CTP; paket kule uyumlu.'
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

-- SPECS (TR) — locale reset
DELETE FROM product_specs
WHERE product_id='bbbb1513-2222-4222-8222-bbbbbbbb1513' AND locale='tr';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111513-aaaa-4aaa-8aaa-bbbb1513tr01','bbbb1513-2222-4222-8222-bbbbbbbb1513','tr','Konum','Kule gövdesi; soğuk su havuzu ile dolgu seviyesi arası (dış)','custom',10),
  ('11111513-aaaa-4aaa-8aaa-bbbb1513tr02','bbbb1513-2222-4222-8222-bbbbbbbb1513','tr','Fonksiyon','Hava yönlendirme, su sıçrama kaybını azaltma, yosun oluşumunu azaltma','custom',20),
  ('11111513-aaaa-4aaa-8aaa-bbbb1513tr03','bbbb1513-2222-4222-8222-bbbbbbbb1513','tr','Standart Malzeme','PVC (1. sınıf)','material',30),
  ('11111513-aaaa-4aaa-8aaa-bbbb1513tr04','bbbb1513-2222-4222-8222-bbbbbbbb1513','tr','Opsiyonel Malzeme','FRP/CTP','material',40),
  ('11111513-aaaa-4aaa-8aaa-bbbb1513tr05','bbbb1513-2222-4222-8222-bbbbbbbb1513','tr','Tasarım','Minimum hava direnci sağlayan özel lamel formu','physical',50);

-- FAQS (TR) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb1513-2222-4222-8222-bbbbbbbb1513' AND locale='tr';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221513-aaaa-4aaa-8aaa-bbbb1513tr01','bbbb1513-2222-4222-8222-bbbbbbbb1513','tr','Hava giriş panjuru ne işe yarar?','Kuleye giren havayı yönlendirerek dolguya daha homojen yayılmasını sağlar; sıçrama su kaybını ve yosun oluşumunu azaltmaya yardımcı olur.',10,1),
  ('22221513-aaaa-4aaa-8aaa-bbbb1513tr02','bbbb1513-2222-4222-8222-bbbbbbbb1513','tr','Hangi malzemeden üretilir?','Standart olarak 1. sınıf PVC lameller kullanılır. İstenirse FRP/CTP malzemeden de üretilebilir.',20,1),
  ('22221513-aaaa-4aaa-8aaa-bbbb1513tr03','bbbb1513-2222-4222-8222-bbbbbbbb1513','tr','Hangi kule tipleriyle uyumludur?','Yerli ve ithal paket kule tiplerine uygulanabilir.',30,1);

-- REVIEWS (TR) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '33331513-aaaa-4aaa-8aaa-bbbb1513tr01',
  '33331513-aaaa-4aaa-8aaa-bbbb1513tr02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331513-aaaa-4aaa-8aaa-bbbb1513tr01','bbbb1513-2222-4222-8222-bbbbbbbb1513',NULL,5,'Su sıçrama kaybını belirgin azalttı, çevre daha kuru kaldı.',1,'Saha Ekibi'),
  ('33331513-aaaa-4aaa-8aaa-bbbb1513tr02','bbbb1513-2222-4222-8222-bbbbbbbb1513',NULL,4,'Hava akışını düzenleyip dolgu performansını iyileştirdi.',1,'Operasyon');

-- OPTIONS (TR) — locale-less table => separate row
DELETE FROM product_options
WHERE id='44441513-aaaa-4aaa-8aaa-bbbb1513tr01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441513-aaaa-4aaa-8aaa-bbbb1513tr01','bbbb1513-2222-4222-8222-bbbbbbbb1513','Malzeme', JSON_ARRAY('PVC (standart)','FRP/CTP (opsiyonel)'));

-- =============================================================
-- I18N (EN) — PLAIN TEXT + specifications: Record<string,string>
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1513-2222-4222-8222-bbbbbbbb1513',
  'en',
  'Air Inlet Louvers',
  'air-inlet-louvers',
  'Air inlet louvers are installed on the tower casing between the cold-water basin and the fill level, on the outside of the tower. Their role is to direct incoming air for more uniform distribution across the fill, reduce splash water losses from the basin, and limit sunlight to help reduce algae formation. Louvers are manufactured from first-grade PVC with a pull-trusion/traction process and a special profile to minimize air resistance. Measures are taken to prevent displacement by wind. On request, they can also be produced from FRP. Suitable for both local and imported packaged tower types.',
  'Cooling tower air inlet louvers spare part',
  JSON_ARRAY('spare part', 'air inlet louvers', 'louver', 'splash loss', 'algae reduction', 'ensotek'),
  JSON_OBJECT(
    'location', 'Tower casing; between cold-water basin and fill level (outside)',
    'purpose', 'Air guidance; reduce splash loss; reduce algae formation',
    'material', 'First-grade PVC / optional: FRP',
    'design', 'Special low-resistance louver profile',
    'compatibility', 'Local and imported packaged tower types'
  ),
  'Air Inlet Louvers | Cooling Tower Spare Parts | Ensotek',
  'Air inlet louvers guide airflow, reduce splash losses and help limit algae growth. PVC as standard; optional FRP; compatible with packaged towers.'
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

-- SPECS (EN) — locale reset
DELETE FROM product_specs
WHERE product_id='bbbb1513-2222-4222-8222-bbbbbbbb1513' AND locale='en';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111513-bbbb-4bbb-8bbb-bbbb1513en01','bbbb1513-2222-4222-8222-bbbbbbbb1513','en','Location','Tower casing; between basin and fill level (outside)','custom',10),
  ('11111513-bbbb-4bbb-8bbb-bbbb1513en02','bbbb1513-2222-4222-8222-bbbbbbbb1513','en','Function','Guides airflow, reduces splash loss, helps reduce algae formation','custom',20),
  ('11111513-bbbb-4bbb-8bbb-bbbb1513en03','bbbb1513-2222-4222-8222-bbbbbbbb1513','en','Standard Material','First-grade PVC','material',30),
  ('11111513-bbbb-4bbb-8bbb-bbbb1513en04','bbbb1513-2222-4222-8222-bbbbbbbb1513','en','Optional Material','FRP','material',40),
  ('11111513-bbbb-4bbb-8bbb-bbbb1513en05','bbbb1513-2222-4222-8222-bbbbbbbb1513','en','Design','Low air-resistance louver profile','physical',50);

-- FAQS (EN) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb1513-2222-4222-8222-bbbbbbbb1513' AND locale='en';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221513-bbbb-4bbb-8bbb-bbbb1513en01','bbbb1513-2222-4222-8222-bbbbbbbb1513','en','What do air inlet louvers do?','They guide incoming air for uniform distribution across the fill, reduce splash water losses, and help limit algae growth by reducing sunlight.',10,1),
  ('22221513-bbbb-4bbb-8bbb-bbbb1513en02','bbbb1513-2222-4222-8222-bbbbbbbb1513','en','Which materials are available?','First-grade PVC is standard; FRP can be supplied on request.',20,1),
  ('22221513-bbbb-4bbb-8bbb-bbbb1513en03','bbbb1513-2222-4222-8222-bbbbbbbb1513','en','Are they compatible with packaged towers?','Yes. They can be applied to both local and imported packaged tower types.',30,1);

-- REVIEWS (EN) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '33331513-bbbb-4bbb-8bbb-bbbb1513en01',
  '33331513-bbbb-4bbb-8bbb-bbbb1513en02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331513-bbbb-4bbb-8bbb-bbbb1513en01','bbbb1513-2222-4222-8222-bbbbbbbb1513',NULL,5,'Reduced splash losses and improved airflow distribution noticeably.',1,'Site Team'),
  ('33331513-bbbb-4bbb-8bbb-bbbb1513en02','bbbb1513-2222-4222-8222-bbbbbbbb1513',NULL,4,'Good fit and sturdiness; helps keep the basin area cleaner.',1,'Operations');

-- OPTIONS (EN) — locale-less table => separate row
DELETE FROM product_options
WHERE id='44441513-bbbb-4bbb-8bbb-bbbb1513en01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441513-bbbb-4bbb-8bbb-bbbb1513en01','bbbb1513-2222-4222-8222-bbbbbbbb1513','Material', JSON_ARRAY('PVC (standard)','FRP/CTP (optional)'));

-- =============================================================
-- I18N (DE) — PLAIN TEXT + specifications: Record<string,string>
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1513-2222-4222-8222-bbbbbbbb1513',
  'de',
  'Lufteinlasslamellen',
  'lufteinlasslamellen',
  'Lufteinlasslamellen befinden sich am Turmkörper zwischen Kaltwasserbecken und Füllhöhe, außerhalb des Turms. Ihre Aufgabe ist es, die einströmende Luft so auszurichten, dass sie sich gleichmäßig über den Füllkörper verteilt, Wasserverluste durch Spritzwasser zu reduzieren und durch eine begrenzte Abschattung die Algenbildung zu verringern. Die Lamellen werden aus PVC der 1. Klasse mit einem Zug-/Tractionsystem gefertigt und besitzen eine spezielle Form mit minimalem Luftwiderstand. Maßnahmen verhindern ein Aufwirbeln durch Wind. Auf Wunsch ist auch eine Ausführung aus FRP möglich. Geeignet für lokale und importierte Paketkühltürme.',
  'Lufteinlasslamellen (Louver) für Kühltürme Ersatzteil',
  JSON_ARRAY('ersatzteil', 'lufteinlasslamellen', 'louver', 'spritzwasser', 'algen', 'kuehlturm', 'ensotek'),
  JSON_OBJECT(
    'einbauort', 'Turmkörper; zwischen Kaltwasserbecken und Füllhöhe (außen)',
    'zweck', 'Luftführung; Spritzwasserverluste reduzieren; Algenbildung verringern',
    'material', 'PVC (1. Klasse) / optional: FRP',
    'design', 'Lamellenprofil mit minimalem Luftwiderstand',
    'kompatibilitaet', 'Lokale und importierte Paketkühltürme'
  ),
  'Lufteinlasslamellen | Kühlturm Ersatzteile | Ensotek',
  'Lufteinlasslamellen: führen die Luft, reduzieren Spritzwasserverluste und helfen gegen Algenbildung. PVC Standard, optional FRP, für Paketkühltürme geeignet.'
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

-- SPECS (DE) — locale reset
DELETE FROM product_specs
WHERE product_id='bbbb1513-2222-4222-8222-bbbbbbbb1513' AND locale='de';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111513-cccc-4ccc-8ccc-bbbb1513de01','bbbb1513-2222-4222-8222-bbbbbbbb1513','de','Einbauort','Turmkörper; zwischen Kaltwasserbecken und Füllhöhe (außen)','custom',10),
  ('11111513-cccc-4ccc-8ccc-bbbb1513de02','bbbb1513-2222-4222-8222-bbbbbbbb1513','de','Funktion','Luftführung, Spritzwasserverluste reduzieren, Algenbildung verringern','custom',20),
  ('11111513-cccc-4ccc-8ccc-bbbb1513de03','bbbb1513-2222-4222-8222-bbbbbbbb1513','de','Standardmaterial','PVC 1. Klasse','material',30),
  ('11111513-cccc-4ccc-8ccc-bbbb1513de04','bbbb1513-2222-4222-8222-bbbbbbbb1513','de','Optionales Material','FRP','material',40),
  ('11111513-cccc-4ccc-8ccc-bbbb1513de05','bbbb1513-2222-4222-8222-bbbbbbbb1513','de','Design','Lamellenprofil mit geringem Luftwiderstand','physical',50);

-- FAQS (DE) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb1513-2222-4222-8222-bbbbbbbb1513' AND locale='de';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221513-cccc-4ccc-8ccc-bbbb1513de01','bbbb1513-2222-4222-8222-bbbbbbbb1513','de','Wozu dienen Lufteinlasslamellen?','Sie richten die einströmende Luft aus, reduzieren Spritzwasserverluste und helfen, die Algenbildung durch Abschattung zu verringern.',10,1),
  ('22221513-cccc-4ccc-8ccc-bbbb1513de02','bbbb1513-2222-4222-8222-bbbbbbbb1513','de','Aus welchem Material bestehen sie?','Standard ist PVC der 1. Klasse; auf Wunsch sind FRP-Ausführungen möglich.',20,1),
  ('22221513-cccc-4ccc-8ccc-bbbb1513de03','bbbb1513-2222-4222-8222-bbbbbbbb1513','de','Für welche Kühltürme sind sie geeignet?','Für lokale und importierte Paketkühltürme.',30,1);

-- REVIEWS (DE) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '33331513-cccc-4ccc-8ccc-bbbb1513de01',
  '33331513-cccc-4ccc-8ccc-bbbb1513de02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331513-cccc-4ccc-8ccc-bbbb1513de01','bbbb1513-2222-4222-8222-bbbbbbbb1513',NULL,5,'Spritzwasser deutlich reduziert und die Luftverteilung verbessert.',1,'Außendienst'),
  ('33331513-cccc-4ccc-8ccc-bbbb1513de02','bbbb1513-2222-4222-8222-bbbbbbbb1513',NULL,4,'Stabil und passgenau, hilft den Bereich sauberer zu halten.',1,'Betrieb');

-- OPTIONS (DE) — locale-less table => separate row
DELETE FROM product_options
WHERE id='44441513-cccc-4ccc-8ccc-bbbb1513de01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441513-cccc-4ccc-8ccc-bbbb1513de01','bbbb1513-2222-4222-8222-bbbbbbbb1513','Material', JSON_ARRAY('PVC (Standard)','FRP/CTP (optional)'));

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
