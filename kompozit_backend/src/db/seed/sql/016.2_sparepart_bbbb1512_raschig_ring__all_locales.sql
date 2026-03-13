-- =============================================================
-- FILE: 016.2_sparepart_bbbb1512_raschig_ring__all_locales.sql (FINAL / VALIDATION ALIGNED)
-- Ensotek – Sparepart Seed (12/14)
-- Sparepart: Rashing Halkası / Raschig Ring / Raschig-Ring
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
--  - products.sub_category_id  = 'bbbb1003-1111-4111-8111-bbbbbbbb1003'  (Fill Media)
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
  'bbbb1512-2222-4222-8222-bbbbbbbb1512',
  'sparepart',
  'aaaa1001-1111-4111-8111-aaaaaaaa1001',
  'bbbb1003-1111-4111-8111-bbbbbbbb1003',
  0.00,
  'https://www.ensotek.de/uploads/material/rashing-halkasi-250x250-1.jpg',
  NULL,
  JSON_ARRAY(
    'https://www.ensotek.de/uploads/material/rashing-halkasi-250x250-1.jpg',
    'https://www.ensotek.de/uploads/material/scrubber-rashing-halkasi2-250x250-1.jpg',
    'https://www.ensotek.de/uploads/material/scrubber-rashing-halkasi-250x250-1.jpg'
  ),
  JSON_ARRAY(),
  1,
  1,
  1512,
  'SP-RASCHIG-RING',
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
  'bbbb1512-2222-4222-8222-bbbbbbbb1512',
  'tr',
  'Rashing Halkası (PP Raschig Ring)',
  'rashing-halkasi-pp-raschig-ring',
  'Rashing halkaları, PP (polipropilen) malzemeden enjeksiyon yöntemiyle üretilir. Su soğutma kulelerinde ve scrubber (yıkayıcı) sistemlerinde kullanılır. Soğutma kulelerinde dolgu malzemesi olarak görev yapar. Scrubber sistemlerinde ise gazın sıvı ile temas yüzeyini artırarak yıkama ve yoğuşturma ile koku giderimi sağlar ve tehlikeli atıkların arıtımına yardımcı olur.',
  'Soğutma kulesi ve scrubber sistemleri için PP rashing halkası yedek parça',
  JSON_ARRAY('yedek parça', 'rashing halkası', 'raschig ring', 'pp', 'dolgu', 'scrubber', 'ensotek'),
  JSON_OBJECT(
    'urunAdi', 'PP Rashing Halkası',
    'malzeme', 'PP (Polipropilen)',
    'kullanimAlanlari', 'Soğutma kulesi dolgu; scrubber/yıkayıcı sistemler',
    'fonksiyon', 'Temas yüzeyini artırır; dolgu/arıtım performansını destekler',
    'olculer', 'Ø 37 mm x 37 mm',
    'paket', '5.000 adet / torba',
    'adet', '18.500 adet/m³',
    'yogunluk', '0,95 – 1,00 gr/cm³'
  ),
  'Rashing Halkası | Soğutma Kulesi Yedek Parça | Ensotek',
  'PP rashing halkası (raschig ring): soğutma kulesi dolgu ve scrubber sistemlerinde temas yüzeyini artırır. Ø 37x37 mm; 18.500 adet/m³; 5.000 adet/torba.'
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
WHERE product_id='bbbb1512-2222-4222-8222-bbbbbbbb1512' AND locale='tr';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111512-aaaa-4aaa-8aaa-bbbb1512tr01','bbbb1512-2222-4222-8222-bbbbbbbb1512','tr','Ürün Adı','PP Rashing Halkası','custom',10),
  ('11111512-aaaa-4aaa-8aaa-bbbb1512tr02','bbbb1512-2222-4222-8222-bbbbbbbb1512','tr','Malzeme','PP (Polipropilen)','material',20),
  ('11111512-aaaa-4aaa-8aaa-bbbb1512tr03','bbbb1512-2222-4222-8222-bbbbbbbb1512','tr','Yoğunluk','0,95 – 1,00 gr/cm³','physical',30),
  ('11111512-aaaa-4aaa-8aaa-bbbb1512tr04','bbbb1512-2222-4222-8222-bbbbbbbb1512','tr','Ölçü','Ø 37 mm x 37 mm','physical',40),
  ('11111512-aaaa-4aaa-8aaa-bbbb1512tr05','bbbb1512-2222-4222-8222-bbbbbbbb1512','tr','Paket','5.000 adet / torba','custom',50),
  ('11111512-aaaa-4aaa-8aaa-bbbb1512tr06','bbbb1512-2222-4222-8222-bbbbbbbb1512','tr','Miktar','18.500 adet/m³','physical',60),
  ('11111512-aaaa-4aaa-8aaa-bbbb1512tr07','bbbb1512-2222-4222-8222-bbbbbbbb1512','tr','Kullanım','Soğutma kulesi dolgu; scrubber sistemler','custom',70);

-- FAQS (TR) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb1512-2222-4222-8222-bbbbbbbb1512' AND locale='tr';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221512-aaaa-4aaa-8aaa-bbbb1512tr01','bbbb1512-2222-4222-8222-bbbbbbbb1512','tr','Rashing halkası nerelerde kullanılır?','Soğutma kulelerinde dolgu malzemesi olarak, scrubber/yıkayıcı sistemlerde ise gaz-sıvı temas yüzeyini artırmak için kullanılır.',10,1),
  ('22221512-aaaa-4aaa-8aaa-bbbb1512tr02','bbbb1512-2222-4222-8222-bbbbbbbb1512','tr','Scrubber sistemlerinde ne işe yarar?','Gazın temizleme sıvısı ile temas yüzeyini artırır; yıkama ve yoğuşturma ile koku giderimi ve arıtıma katkı sağlar.',20,1),
  ('22221512-aaaa-4aaa-8aaa-bbbb1512tr03','bbbb1512-2222-4222-8222-bbbbbbbb1512','tr','Boyut ve paket bilgisi nedir?','Standart ölçü Ø 37 mm x 37 mm’dir; 5.000 adet/torba ve 18.500 adet/m³ değerleri ile kullanılır.',30,1);

-- REVIEWS (TR) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '33331512-aaaa-4aaa-8aaa-bbbb1512tr01',
  '33331512-aaaa-4aaa-8aaa-bbbb1512tr02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331512-aaaa-4aaa-8aaa-bbbb1512tr01','bbbb1512-2222-4222-8222-bbbbbbbb1512',NULL,5,'Scrubber hattında koku gideriminde belirgin iyileşme sağladı.',1,'Proses Ekibi'),
  ('33331512-aaaa-4aaa-8aaa-bbbb1512tr02','bbbb1512-2222-4222-8222-bbbbbbbb1512',NULL,4,'Dolgu olarak tıkanma sorunu yaşatmadan çalışıyor.',1,'Bakım Ekibi');

-- OPTIONS (TR) — locale-less table => separate row
DELETE FROM product_options
WHERE id='44441512-aaaa-4aaa-8aaa-bbbb1512tr01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441512-aaaa-4aaa-8aaa-bbbb1512tr01','bbbb1512-2222-4222-8222-bbbbbbbb1512','Paket', JSON_ARRAY('5.000 adet / torba'));

-- =============================================================
-- I18N (EN) — PLAIN TEXT + specifications: Record<string,string>
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1512-2222-4222-8222-bbbbbbbb1512',
  'en',
  'Raschig Rings (PP)',
  'raschig-rings-pp',
  'Raschig rings are injection-molded from PP (polypropylene). They are used in water cooling towers and scrubber systems. In cooling towers, they serve as fill media. In scrubbers, they increase the gas–liquid contact area to support washing and condensation for odor removal and treatment of hazardous emissions.',
  'PP Raschig rings for cooling towers and scrubber systems spare part',
  JSON_ARRAY('spare part', 'raschig rings', 'pp', 'fill media', 'scrubber', 'odor control', 'ensotek'),
  JSON_OBJECT(
    'productName', 'PP Raschig Ring',
    'material', 'PP (Polypropylene)',
    'applications', 'Cooling tower fill; scrubber systems',
    'function', 'Increases contact surface area; supports packing/performance',
    'dimensions', 'Ø 37 mm x 37 mm',
    'packaging', '5,000 pcs / bag',
    'quantity', '18,500 pcs/m³',
    'density', '0.95 – 1.00 g/cm³'
  ),
  'Raschig Rings | Cooling Tower Spare Parts | Ensotek',
  'PP Raschig rings for cooling towers and scrubbers: increase contact surface area. Ø 37x37 mm; 18,500 pcs/m³; 5,000 pcs/bag.'
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
WHERE product_id='bbbb1512-2222-4222-8222-bbbbbbbb1512' AND locale='en';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111512-bbbb-4bbb-8bbb-bbbb1512en01','bbbb1512-2222-4222-8222-bbbbbbbb1512','en','Product Name','PP Raschig Ring','custom',10),
  ('11111512-bbbb-4bbb-8bbb-bbbb1512en02','bbbb1512-2222-4222-8222-bbbbbbbb1512','en','Material','PP (Polypropylene)','material',20),
  ('11111512-bbbb-4bbb-8bbb-bbbb1512en03','bbbb1512-2222-4222-8222-bbbbbbbb1512','en','Density','0.95 – 1.00 g/cm³','physical',30),
  ('11111512-bbbb-4bbb-8bbb-bbbb1512en04','bbbb1512-2222-4222-8222-bbbbbbbb1512','en','Dimensions','Ø 37 mm x 37 mm','physical',40),
  ('11111512-bbbb-4bbb-8bbb-bbbb1512en05','bbbb1512-2222-4222-8222-bbbbbbbb1512','en','Packaging','5,000 pcs / bag','custom',50),
  ('11111512-bbbb-4bbb-8bbb-bbbb1512en06','bbbb1512-2222-4222-8222-bbbbbbbb1512','en','Quantity','18,500 pcs/m³','physical',60);

-- FAQS (EN) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb1512-2222-4222-8222-bbbbbbbb1512' AND locale='en';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221512-bbbb-4bbb-8bbb-bbbb1512en01','bbbb1512-2222-4222-8222-bbbbbbbb1512','en','Where are Raschig rings used?','They are used as fill media in cooling towers and as packing media in scrubber systems.',10,1),
  ('22221512-bbbb-4bbb-8bbb-bbbb1512en02','bbbb1512-2222-4222-8222-bbbbbbbb1512','en','What do they do in scrubbers?','They increase gas–liquid contact area to support washing/condensation for odor control and treatment.',20,1),
  ('22221512-bbbb-4bbb-8bbb-bbbb1512en03','bbbb1512-2222-4222-8222-bbbbbbbb1512','en','What are the standard size and packaging?','Standard size is Ø 37 mm x 37 mm; packaging is 5,000 pcs/bag; typical bulk is 18,500 pcs/m³.',30,1);

-- REVIEWS (EN) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '33331512-bbbb-4bbb-8bbb-bbbb1512en01',
  '33331512-bbbb-4bbb-8bbb-bbbb1512en02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331512-bbbb-4bbb-8bbb-bbbb1512en01','bbbb1512-2222-4222-8222-bbbbbbbb1512',NULL,5,'Noticeable improvement in odor control performance in the scrubber line.',1,'Process Team'),
  ('33331512-bbbb-4bbb-8bbb-bbbb1512en02','bbbb1512-2222-4222-8222-bbbbbbbb1512',NULL,4,'Works well as fill media without frequent clogging.',1,'Maintenance');

-- OPTIONS (EN) — locale-less table => separate row
DELETE FROM product_options
WHERE id='44441512-bbbb-4bbb-8bbb-bbbb1512en01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441512-bbbb-4bbb-8bbb-bbbb1512en01','bbbb1512-2222-4222-8222-bbbbbbbb1512','Packaging', JSON_ARRAY('5,000 pcs / bag'));

-- =============================================================
-- I18N (DE) — PLAIN TEXT + specifications: Record<string,string>
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1512-2222-4222-8222-bbbbbbbb1512',
  'de',
  'Raschig-Ringe (PP)',
  'raschig-ringe-pp',
  'Raschig-Ringe werden im Spritzgussverfahren aus PP (Polypropylen) hergestellt. Sie werden in Wasserkühltürmen und in Wäscheranlagen (Scrubber) eingesetzt. In Kühltürmen dienen sie als Füllkörper. In Wäscheranlagen vergrößern sie die Kontaktfläche zwischen Gas und Waschflüssigkeit und unterstützen Geruchsminderung sowie die Abreinigung belasteter Abluft.',
  'PP Raschig-Ringe für Kühltürme und Wäscheranlagen Ersatzteil',
  JSON_ARRAY('ersatzteil', 'raschig ringe', 'pp', 'fuellkoerper', 'scrubber', 'waescheranlage', 'ensotek'),
  JSON_OBJECT(
    'produktname', 'PP Raschig-Ring',
    'material', 'PP (Polypropylen)',
    'einsatz', 'Kühlturm-Füllkörper; Wäscheranlagen/Scrubber',
    'funktion', 'Vergrößert Kontaktfläche; unterstützt Packungs-/Abscheideleistung',
    'abmessungen', 'Ø 37 mm x 37 mm',
    'verpackung', '5.000 Stück / Beutel',
    'menge', '18.500 Stück/m³',
    'dichte', '0,95 – 1,00 g/cm³'
  ),
  'Raschig-Ringe | Kühlturm Ersatzteile | Ensotek',
  'PP Raschig-Ringe für Kühltürme und Wäscheranlagen: vergrößern die Kontaktfläche. Ø 37x37 mm; 18.500 Stück/m³; 5.000 Stück/Beutel.'
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
WHERE product_id='bbbb1512-2222-4222-8222-bbbbbbbb1512' AND locale='de';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111512-cccc-4ccc-8ccc-bbbb1512de01','bbbb1512-2222-4222-8222-bbbbbbbb1512','de','Produktname','PP Raschig-Ring','custom',10),
  ('11111512-cccc-4ccc-8ccc-bbbb1512de02','bbbb1512-2222-4222-8222-bbbbbbbb1512','de','Material','PP (Polypropylen)','material',20),
  ('11111512-cccc-4ccc-8ccc-bbbb1512de03','bbbb1512-2222-4222-8222-bbbbbbbb1512','de','Dichte','0,95 – 1,00 g/cm³','physical',30),
  ('11111512-cccc-4ccc-8ccc-bbbb1512de04','bbbb1512-2222-4222-8222-bbbbbbbb1512','de','Abmessungen','Ø 37 mm x 37 mm','physical',40),
  ('11111512-cccc-4ccc-8ccc-bbbb1512de05','bbbb1512-2222-4222-8222-bbbbbbbb1512','de','Verpackung','5.000 Stück / Beutel','custom',50),
  ('11111512-cccc-4ccc-8ccc-bbbb1512de06','bbbb1512-2222-4222-8222-bbbbbbbb1512','de','Menge','18.500 Stück/m³','physical',60);

-- FAQS (DE) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb1512-2222-4222-8222-bbbbbbbb1512' AND locale='de';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221512-cccc-4ccc-8ccc-bbbb1512de01','bbbb1512-2222-4222-8222-bbbbbbbb1512','de','Wo werden Raschig-Ringe eingesetzt?','Als Füllkörper in Kühltürmen und als Packung in Wäscheranlagen (Scrubber).',10,1),
  ('22221512-cccc-4ccc-8ccc-bbbb1512de02','bbbb1512-2222-4222-8222-bbbbbbbb1512','de','Welche Funktion haben sie im Scrubber?','Sie vergrößern die Gas-Flüssig-Kontaktfläche und unterstützen Geruchs- und Emissionsminderung.',20,1),
  ('22221512-cccc-4ccc-8ccc-bbbb1512de03','bbbb1512-2222-4222-8222-bbbbbbbb1512','de','Welche Standarddaten gelten?','Ø 37 mm x 37 mm, 5.000 Stück/Beutel und 18.500 Stück/m³.',30,1);

-- REVIEWS (DE) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '33331512-cccc-4ccc-8ccc-bbbb1512de01',
  '33331512-cccc-4ccc-8ccc-bbbb1512de02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331512-cccc-4ccc-8ccc-bbbb1512de01','bbbb1512-2222-4222-8222-bbbbbbbb1512',NULL,5,'Im Scrubber deutlich bessere Leistung bei Geruchsreduktion.',1,'Prozessteam'),
  ('33331512-cccc-4ccc-8ccc-bbbb1512de02','bbbb1512-2222-4222-8222-bbbbbbbb1512',NULL,4,'Als Füllkörper robust, wenig Verstopfung im Betrieb.',1,'Instandhaltung');

-- OPTIONS (DE) — locale-less table => separate row
DELETE FROM product_options
WHERE id='44441512-cccc-4ccc-8ccc-bbbb1512de01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441512-cccc-4ccc-8ccc-bbbb1512de01','bbbb1512-2222-4222-8222-bbbbbbbb1512','Verpackung', JSON_ARRAY('5.000 Stück / Beutel'));

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
