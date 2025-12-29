-- =============================================================
-- FILE: 015.4_sparepart_bbbb1504_service_window__all_locales.sql (FINAL)
-- Ensotek – Sparepart Seed (04/14)
-- Sparepart: Servis Penceresi / Service Window / Servicefenster
--
-- RULES (SABIT):
--  - products.item_type   = 'sparepart'
--  - products.category_id = 'aaaa1001-1111-4111-8111-aaaaaaaa1001'
--  - products.sub_category_id = 'bbbb1002-1111-4111-8111-bbbbbbbb1002'  (Spare Parts & Accessories)
--
-- FIXES:
--  - product_i18n.description: PLAIN TEXT (NO HTML)
--  - image urls: FULL URL (http://localhost:8086/uploads/material/...)
--  - all child IDs: CHAR(36) safe (uuid-like, 36 chars)
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
  'bbbb1504-2222-4222-8222-bbbbbbbb1504',
  'sparepart',
  'aaaa1001-1111-4111-8111-aaaaaaaa1001',
  'bbbb1002-1111-4111-8111-bbbbbbbb1002',
  0.00,
  'http://localhost:8086/uploads/material/metal-servis-penceresi-250x250-1.jpg',
  NULL,
  JSON_ARRAY(
    'http://localhost:8086/uploads/material/metal-servis-penceresi-250x250-1.jpg',
    'http://localhost:8086/uploads/material/ctp-servis-penceresi-250x250-1.jpg'
  ),
  JSON_ARRAY(),
  1,
  1,
  1504,
  'SP-SERVICE-WINDOW',
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
-- I18N (TR) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1504-2222-4222-8222-bbbbbbbb1504',
  'tr',
  'Servis Penceresi',
  'servis-penceresi',
  'Servis penceresi, kulenin dış gövdesinde yan duvar üzerinde konumlanır. Su dağıtım sisteminin gözlemlenmesini ve gerektiğinde kolay müdahaleyi sağlar. Arıza ve kontrol durumlarında iç bölgeye bakış imkânı verir ve bakım personelinin erişimini kolaylaştırır. Ayrıca, dolgu malzemelerinin boşaltılması gibi işlemler için dolgu alt kotuna yakın bölgede de kullanılabilir. Kolay açılıp kapanır ve su sızdırmaz yapıda tasarlanır. Korozyon dayanımı için paslanmaz çelik veya CTP (FRP) seçenekleriyle üretilebilir.',
  'Soğutma kulesi servis penceresi yedek parça',
  JSON_ARRAY('yedek parça', 'servis penceresi', 'bakım kapağı', 'erişim', 'soğutma kulesi', 'ensotek'),
  JSON_OBJECT(
    'konum', 'Kule gövdesi dış yüzeyi, yan duvar',
    'amac', 'Gözlem ve bakım erişimi; su dağıtım sistemi kontrolü',
    'kullanim', JSON_ARRAY('Kontrol ve arıza inceleme', 'Bakım erişimi', 'Dolgu boşaltma/temizlik işlemleri'),
    'ozellikler', JSON_ARRAY('Kolay aç/kapa', 'Su sızdırmaz', 'Korozyona dayanıklı'),
    'malzemeSecenekleri', JSON_ARRAY('Paslanmaz çelik', 'CTP (FRP)')
  ),
  'Servis Penceresi | Soğutma Kulesi Yedek Parça | Ensotek',
  'Soğutma kulesi servis penceresi: yan duvarda bakım ve gözlem erişimi sağlar. Su sızdırmaz, kolay aç/kapa; paslanmaz çelik veya CTP seçenekleri.'
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

-- SPECS (TR)
DELETE FROM product_specs
WHERE product_id='bbbb1504-2222-4222-8222-bbbbbbbb1504' AND locale='tr';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111504-aaaa-4aaa-8aaa-bbbb1504tr01','bbbb1504-2222-4222-8222-bbbbbbbb1504','tr','Konum','Kule gövdesi dış yüzeyi, yan duvar','custom',10),
  ('11111504-aaaa-4aaa-8aaa-bbbb1504tr02','bbbb1504-2222-4222-8222-bbbbbbbb1504','tr','Amaç','Gözlem ve bakım erişimi; su dağıtım sistemi kontrolü','custom',20),
  ('11111504-aaaa-4aaa-8aaa-bbbb1504tr03','bbbb1504-2222-4222-8222-bbbbbbbb1504','tr','Özellikler','Kolay aç/kapa; su sızdırmaz; korozyona dayanıklı','physical',30),
  ('11111504-aaaa-4aaa-8aaa-bbbb1504tr04','bbbb1504-2222-4222-8222-bbbbbbbb1504','tr','Malzeme Seçenekleri','Paslanmaz çelik / CTP (FRP)','material',40),
  ('11111504-aaaa-4aaa-8aaa-bbbb1504tr05','bbbb1504-2222-4222-8222-bbbbbbbb1504','tr','Ek Kullanım','Dolgu boşaltma/temizlik için alt kota yakın montaj seçeneği','custom',50);

-- FAQS (TR)
DELETE FROM product_faqs
WHERE product_id='bbbb1504-2222-4222-8222-bbbbbbbb1504' AND locale='tr';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221504-aaaa-4aaa-8aaa-bbbb1504tr01','bbbb1504-2222-4222-8222-bbbbbbbb1504','tr','Servis penceresi ne işe yarar?','Kule içinin gözlemlenmesini ve bakım personelinin gerekli bölgelere kolay erişimini sağlar.',10,1),
  ('22221504-aaaa-4aaa-8aaa-bbbb1504tr02','bbbb1504-2222-4222-8222-bbbbbbbb1504','tr','Nereye montajlanır?','Genellikle kulenin yan duvarına; ihtiyaca göre dolgu alt kotuna yakın bölgeye de uygulanabilir.',20,1),
  ('22221504-aaaa-4aaa-8aaa-bbbb1504tr03','bbbb1504-2222-4222-8222-bbbbbbbb1504','tr','Hangi malzemelerden üretilir?','Korozyon dayanımı için paslanmaz çelik veya CTP (FRP) seçenekleri tercih edilir.',30,1);

-- REVIEWS (TR)
DELETE FROM product_reviews
WHERE id IN (
  '33331504-aaaa-4aaa-8aaa-bbbb1504tr01',
  '33331504-aaaa-4aaa-8aaa-bbbb1504tr02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331504-aaaa-4aaa-8aaa-bbbb1504tr01','bbbb1504-2222-4222-8222-bbbbbbbb1504',NULL,5,'Bakım sırasında kule içine erişimi ciddi hızlandırdı. Sızdırmazlık iyi.',1,'Bakım Ekibi'),
  ('33331504-aaaa-4aaa-8aaa-bbbb1504tr02','bbbb1504-2222-4222-8222-bbbbbbbb1504',NULL,4,'CTP versiyon hafif ve korozyona dayanıklı; montajı rahat.',1,'Tesis Operasyon');

-- OPTIONS (shared)
DELETE FROM product_options
WHERE id='44441504-aaaa-4aaa-8aaa-bbbb1504op01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441504-aaaa-4aaa-8aaa-bbbb1504op01','bbbb1504-2222-4222-8222-bbbbbbbb1504','Material', JSON_ARRAY('Stainless Steel','FRP (CTP)'));

-- =============================================================
-- I18N (EN) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1504-2222-4222-8222-bbbbbbbb1504',
  'en',
  'Service Window',
  'service-window',
  'The service window is installed on the outer tower casing, typically on a side wall. It enables observation of the water distribution system and provides easy access for inspection and maintenance. In fault or control situations, it allows personnel to look inside and reach the interior during servicing. It can also be used near the lower fill level for operations such as draining or removing fouled fill media. It is designed to open and close easily and to be water-tight. For corrosion resistance, it can be manufactured in stainless steel or FRP (CTP) options.',
  'Cooling tower service window spare part',
  JSON_ARRAY('spare part', 'service window', 'access hatch', 'maintenance', 'cooling tower', 'ensotek'),
  JSON_OBJECT(
    'location', 'Outer tower casing, side wall',
    'purpose', 'Observation and maintenance access; water distribution inspection',
    'useCases', JSON_ARRAY('Inspection and troubleshooting', 'Maintenance access', 'Fill draining/cleaning operations'),
    'features', JSON_ARRAY('Easy open/close', 'Water-tight', 'Corrosion resistant'),
    'materialOptions', JSON_ARRAY('Stainless steel', 'FRP (CTP)')
  ),
  'Service Window | Cooling Tower Spare Parts | Ensotek',
  'Cooling tower service window: provides observation and maintenance access from the side wall. Water-tight, easy open/close; stainless steel or FRP options.'
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

-- SPECS (EN)
DELETE FROM product_specs
WHERE product_id='bbbb1504-2222-4222-8222-bbbbbbbb1504' AND locale='en';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111504-bbbb-4bbb-8bbb-bbbb1504en01','bbbb1504-2222-4222-8222-bbbbbbbb1504','en','Location','Outer tower casing, side wall','custom',10),
  ('11111504-bbbb-4bbb-8bbb-bbbb1504en02','bbbb1504-2222-4222-8222-bbbbbbbb1504','en','Purpose','Observation and maintenance access; water distribution inspection','custom',20),
  ('11111504-bbbb-4bbb-8bbb-bbbb1504en03','bbbb1504-2222-4222-8222-bbbbbbbb1504','en','Features','Easy open/close; water-tight; corrosion resistant','physical',30),
  ('11111504-bbbb-4bbb-8bbb-bbbb1504en04','bbbb1504-2222-4222-8222-bbbbbbbb1504','en','Material Options','Stainless steel / FRP (CTP)','material',40),
  ('11111504-bbbb-4bbb-8bbb-bbbb1504en05','bbbb1504-2222-4222-8222-bbbbbbbb1504','en','Additional Use','Optional mounting near lower fill level for draining/cleaning','custom',50);

-- FAQS (EN)
DELETE FROM product_faqs
WHERE product_id='bbbb1504-2222-4222-8222-bbbbbbbb1504' AND locale='en';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221504-bbbb-4bbb-8bbb-bbbb1504en01','bbbb1504-2222-4222-8222-bbbbbbbb1504','en','What is a service window used for?','It provides observation and easy access to the tower interior for inspection and maintenance.',10,1),
  ('22221504-bbbb-4bbb-8bbb-bbbb1504en02','bbbb1504-2222-4222-8222-bbbbbbbb1504','en','Where is it installed?','Typically on the side wall of the outer casing; it can also be applied near the lower fill level if needed.',20,1),
  ('22221504-bbbb-4bbb-8bbb-bbbb1504en03','bbbb1504-2222-4222-8222-bbbbbbbb1504','en','Which materials are available?','Stainless steel and FRP (CTP) options are used for corrosion resistance.',30,1);

-- REVIEWS (EN)
DELETE FROM product_reviews
WHERE id IN (
  '33331504-bbbb-4bbb-8bbb-bbbb1504en01',
  '33331504-bbbb-4bbb-8bbb-bbbb1504en02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331504-bbbb-4bbb-8bbb-bbbb1504en01','bbbb1504-2222-4222-8222-bbbbbbbb1504',NULL,5,'Makes inspection and maintenance much faster. Sealing performance is solid.',1,'Maintenance Team'),
  ('33331504-bbbb-4bbb-8bbb-bbbb1504en02','bbbb1504-2222-4222-8222-bbbbbbbb1504',NULL,4,'FRP version is lightweight and corrosion-resistant; installation is straightforward.',1,'Operations');

-- =============================================================
-- I18N (DE) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1504-2222-4222-8222-bbbbbbbb1504',
  'de',
  'Servicefenster',
  'servicefenster',
  'Das Servicefenster befindet sich an der Außenseite des Turms an der Seitenwand und ermöglicht die Beobachtung des Wasserverteilungssystems sowie einen einfachen Zugang für Kontrolle und Wartung. Im Störungs- und Kontrollfall bietet es einen Blick ins Innere und erleichtert dem Personal den Zugang bei Arbeiten. Zusätzlich kann es nahe der unteren Füllhöhe eingesetzt werden, um verschmutzte Füllkörper zu entleeren oder Reinigungsarbeiten zu unterstützen. Es ist leicht zu öffnen und zu schließen und wird wasserabdichtend ausgeführt. Zur Korrosionsbeständigkeit kann es aus Edelstahl oder FRP (CTP) gefertigt werden.',
  'Servicefenster für Kühltürme Ersatzteil',
  JSON_ARRAY('ersatzteil', 'servicefenster', 'wartung', 'zugang', 'kuehlturm', 'ensotek'),
  JSON_OBJECT(
    'einbauort', 'Außenseite des Turms, Seitenwand',
    'zweck', 'Beobachtung und Wartungszugang; Kontrolle des Wasserverteilungssystems',
    'einsatz', JSON_ARRAY('Kontrolle/Fehlersuche', 'Wartungszugang', 'Entleerung/Reinigung von Füllkörpern'),
    'eigenschaften', JSON_ARRAY('Leicht zu öffnen/schließen', 'Wasserabdichtend', 'Korrosionsbeständig'),
    'material', JSON_ARRAY('Edelstahl', 'FRP (CTP)')
  ),
  'Servicefenster | Kühlturm Ersatzteile | Ensotek',
  'Servicefenster für Kühltürme: Beobachtung und Wartungszugang an der Seitenwand. Wasserabdichtend, leicht zu öffnen; Edelstahl oder FRP Optionen.'
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

-- SPECS (DE)
DELETE FROM product_specs
WHERE product_id='bbbb1504-2222-4222-8222-bbbbbbbb1504' AND locale='de';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111504-cccc-4ccc-8ccc-bbbb1504de01','bbbb1504-2222-4222-8222-bbbbbbbb1504','de','Einbauort','Außenseite des Turms, Seitenwand','custom',10),
  ('11111504-cccc-4ccc-8ccc-bbbb1504de02','bbbb1504-2222-4222-8222-bbbbbbbb1504','de','Zweck','Beobachtung und Wartungszugang; Kontrolle des Wasserverteilungssystems','custom',20),
  ('11111504-cccc-4ccc-8ccc-bbbb1504de03','bbbb1504-2222-4222-8222-bbbbbbbb1504','de','Eigenschaften','Leicht zu öffnen/schließen; wasserabdichtend; korrosionsbeständig','physical',30),
  ('11111504-cccc-4ccc-8ccc-bbbb1504de04','bbbb1504-2222-4222-8222-bbbbbbbb1504','de','Material','Edelstahl / FRP (CTP)','material',40),
  ('11111504-cccc-4ccc-8ccc-bbbb1504de05','bbbb1504-2222-4222-8222-bbbbbbbb1504','de','Zusatz','Optional nahe der unteren Füllhöhe für Entleerung/Reinigung','custom',50);

-- FAQS (DE)
DELETE FROM product_faqs
WHERE product_id='bbbb1504-2222-4222-8222-bbbbbbbb1504' AND locale='de';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221504-cccc-4ccc-8ccc-bbbb1504de01','bbbb1504-2222-4222-8222-bbbbbbbb1504','de','Wofür wird das Servicefenster verwendet?','Es ermöglicht Beobachtung und einen einfachen Zugang ins Turminnere für Kontrolle und Wartung.',10,1),
  ('22221504-cccc-4ccc-8ccc-bbbb1504de02','bbbb1504-2222-4222-8222-bbbbbbbb1504','de','Wo wird es montiert?','Typischerweise an der Seitenwand der Außenverkleidung; je nach Bedarf auch nahe der unteren Füllhöhe.',20,1),
  ('22221504-cccc-4ccc-8ccc-bbbb1504de03','bbbb1504-2222-4222-8222-bbbbbbbb1504','de','Welche Materialien sind möglich?','Edelstahl oder FRP (CTP) für hohe Korrosionsbeständigkeit.',30,1);

-- REVIEWS (DE)
DELETE FROM product_reviews
WHERE id IN (
  '33331504-cccc-4ccc-8ccc-bbbb1504de01',
  '33331504-cccc-4ccc-8ccc-bbbb1504de02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331504-cccc-4ccc-8ccc-bbbb1504de01','bbbb1504-2222-4222-8222-bbbbbbbb1504',NULL,5,'Erleichtert Inspektion und Wartung deutlich. Dichtheit ist sehr gut.',1,'Instandhaltung'),
  ('33331504-cccc-4ccc-8ccc-bbbb1504de02','bbbb1504-2222-4222-8222-bbbbbbbb1504',NULL,4,'FRP-Ausführung ist leicht und korrosionsbeständig – Montage unkompliziert.',1,'Betrieb');

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
