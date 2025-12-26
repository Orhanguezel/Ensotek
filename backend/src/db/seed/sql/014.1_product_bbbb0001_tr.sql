-- =============================================================
-- FILE: 014.1_product_bbbb0001_tr.sql
-- PRODUCT bbbb0001 i18n + specs + faqs + reviews + options (TR)
-- Closed Circuit Cooling Towers (CC CTP / CC DCTP)
-- Source: Catalog p.10-11
-- =============================================================

SET NAMES utf8mb4;

START TRANSACTION;

-- i18n (TR)
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
  JSON_OBJECT(
    'principle', 'Proses akışkanı serpantin/boru içinden geçer; dıştan hava + sirkülasyon suyu ile boru yüzeyinden soğutulur.',
    'useCases', JSON_ARRAY('Hava kompresörleri', 'İndüksiyon ocakları', 'Chiller grupları'),
    'series', JSON_ARRAY('CC CTP', 'CC DCTP')
  ),
  'Kapalı Tip Su Soğutma Kuleleri | CC CTP / CC DCTP | Ensotek',
  'Kirliliğe hassas proses suları için kapalı tip (closed circuit) su soğutma kuleleri. CC CTP / CC DCTP serileri, model seçenekleri ve teknik özet.'
)
ON DUPLICATE KEY UPDATE
  title=VALUES(title),
  slug=VALUES(slug),
  description=VALUES(description),
  alt=VALUES(alt),
  tags=VALUES(tags),
  specifications=VALUES(specifications),
  meta_title=VALUES(meta_title),
  meta_description=VALUES(meta_description);

-- TECHNICAL SPECS (TR) – derived from p.11 table
INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11110001-aaaa-4aaa-8aaa-bbbb0001tr01','bbbb0001-2222-4222-8222-bbbbbbbb0001','tr','Seri / Model Ailesi','CC CTP (tek fan) ve CC DCTP (çift fan)','custom',10),
  ('11110001-aaaa-4aaa-8aaa-bbbb0001tr02','bbbb0001-2222-4222-8222-bbbbbbbb0001','tr','Fan Çapı (Ø)','930 / 1100 / 1250 / 1500 (çift fanlı modeller dahil)','physical',20),
  ('11110001-aaaa-4aaa-8aaa-bbbb0001tr03','bbbb0001-2222-4222-8222-bbbbbbbb0001','tr','Fan Motoru','3 kW’dan 2×5,5 kW’a kadar (modele göre)','physical',30),
  ('11110001-aaaa-4aaa-8aaa-bbbb0001tr04','bbbb0001-2222-4222-8222-bbbbbbbb0001','tr','Sprey Pompası','1,1 kW – 5,5 kW (modele göre)','physical',40),
  ('11110001-aaaa-4aaa-8aaa-bbbb0001tr05','bbbb0001-2222-4222-8222-bbbbbbbb0001','tr','Örnek Ağırlıklar','CC CTP-3C/3: 1400 kg boş, 2300 kg çalışır; CC DCTP-6C/6: 9645 kg boş, 15650 kg çalışır','physical',50)
ON DUPLICATE KEY UPDATE
  name=VALUES(name), value=VALUES(value), category=VALUES(category), order_num=VALUES(order_num);

-- FAQS (TR)
INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22220001-aaaa-4aaa-8aaa-bbbb0001tr01','bbbb0001-2222-4222-8222-bbbbbbbb0001','tr','Kapalı tip kule ne zaman tercih edilir?','Soğutulacak suyun kirliliğe/partiküle karşı hassas olduğu ve proses akışkanının temiz kalmasının istendiği uygulamalarda tercih edilir.',10,1),
  ('22220001-aaaa-4aaa-8aaa-bbbb0001tr02','bbbb0001-2222-4222-8222-bbbbbbbb0001','tr','Soğutma prensibi nedir?','Proses akışkanı serpantin/boru içinden geçer. Dış tarafta hava akışı ve kulenin sirkülasyon suyu boru yüzeyinden ısıyı alarak içerideki akışkanı soğutur.',20,1),
  ('22220001-aaaa-4aaa-8aaa-bbbb0001tr03','bbbb0001-2222-4222-8222-bbbbbbbb0001','tr','Hangi proseslerde kullanılır?','Hava kompresörleri, indüksiyon ocakları ve chiller grupları gibi hassas ekipman içeren proseslerde kullanılır.',30,1)
ON DUPLICATE KEY UPDATE
  question=VALUES(question), answer=VALUES(answer), display_order=VALUES(display_order), is_active=VALUES(is_active);

-- REVIEWS (TR) – sample
INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33330001-aaaa-4aaa-8aaa-bbbb0001tr01','bbbb0001-2222-4222-8222-bbbbbbbb0001',NULL,5,'Hassas proses suyu için stabil ve güvenilir performans.',1,'Tesis Mühendisliği'),
  ('33330001-aaaa-4aaa-8aaa-bbbb0001tr02','bbbb0001-2222-4222-8222-bbbbbbbb0001',NULL,4,'Model seçenekleri geniş; doğru seçimle verim yüksek.',1,'Bakım & Operasyon')
ON DUPLICATE KEY UPDATE
  rating=VALUES(rating), comment=VALUES(comment), is_active=VALUES(is_active), customer_name=VALUES(customer_name);

-- OPTIONS (TR) – models list from p.11
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
  ))
ON DUPLICATE KEY UPDATE
  option_name=VALUES(option_name), option_values=VALUES(option_values);

COMMIT;
