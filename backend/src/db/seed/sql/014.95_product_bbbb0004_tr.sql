-- =============================================================
-- FILE: 014.95_product_bbbb0004_tr.sql (FIXED)
-- TCTP – Üç Hücreli Kuleler (TR)
-- Fix: shorten ids to <= 32 chars
-- =============================================================

SET NAMES utf8mb4;
START TRANSACTION;

INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb0004-2222-4222-8222-bbbbbbbb0004',
  'tr',
  'Açık Tip Su Soğutma Kuleleri – Üç Hücreli (TCTP Serisi)',
  'acik-tip-su-sogutma-kuleleri-uc-hucreli-tctp-serisi',
  'TCTP serisi üç hücreli açık tip su soğutma kuleleri, çok yüksek kapasite ve debi gerektiren uygulamalarda üç hücreli yapı ile ölçeklenebilir çözüm sağlar. Katalog tablosunda her modelin ölçüleri, ağırlıkları, kapasite ve debi değerleri 35/30/25°C ve 40/30/24°C koşullarına göre verilmiştir.',
  'Açık tip su soğutma kulesi – Üç hücreli TCTP serisi',
  JSON_ARRAY('açık tip','open circuit','üç hücreli','TCTP','soğutma kulesi','ensotek'),
  JSON_OBJECT(
    'cellType','Üç hücreli',
    'series','TCTP',
    'capacityConditions', JSON_ARRAY('35/30/25°C','40/30/24°C')
  ),
  'Açık Tip Su Soğutma Kuleleri | Üç Hücreli TCTP Serisi | Ensotek',
  'Üç hücreli açık tip kuleler (TCTP serisi). TCTP-3’ten TCTP-35’e model seçenekleri; ölçü, ağırlık, kapasite ve debi değerleri katalog tablosuna göre.'
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

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('tctp0004tr000000000000000000000001','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Seri / Hücre Tipi','TCTP – üç hücreli açık tip kuleler','custom',10),
  ('tctp0004tr000000000000000000000002','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Model Aralığı','TCTP-3 … TCTP-35','custom',20),
  ('tctp0004tr000000000000000000000003','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Fan Grubu','3×930 … 3×3700 (mm)','physical',30),
  ('tctp0004tr000000000000000000000004','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Kapasite (35/30/25°C)','700.000 – 10.400.000 kcal/h','service',40),
  ('tctp0004tr000000000000000000000005','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Debi (35/30/25°C)','140 – 2080 m³/h','service',50),
  ('tctp0004tr000000000000000000000006','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Kapasite (40/30/24°C)','1.100.000 – 15.300.000 kcal/h','service',60),
  ('tctp0004tr000000000000000000000007','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Debi (40/30/24°C)','110 – 1530 m³/h','service',70),
  ('tctp0004tr000000000000000000000008','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Ağırlık (Boş/Çalışır)','950–11500 kg / 3400–60000 kg (modele göre)','physical',80)
ON DUPLICATE KEY UPDATE
  name=VALUES(name),
  value=VALUES(value),
  category=VALUES(category),
  order_num=VALUES(order_num);

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('tctp0004trfaq00000000000000000001','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Üç hücreli kule ne zaman tercih edilir?','Çok yüksek kapasite ve debi gereksinimlerinde, üç hücreli yapı ile ölçeklenebilir performans istendiğinde tercih edilir.',10,1),
  ('tctp0004trfaq00000000000000000002','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Kapasite/debi değerleri hangi koşullarda veriliyor?','Katalog tablosunda 35/30/25°C ve 40/30/24°C koşullarına göre kapasite (kcal/h) ve debi (m³/h) verilir.',20,1),
  ('tctp0004trfaq00000000000000000003','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Model seçerken nelere bakılmalı?','İstenen debi, hedef koşul, taban alanı/yükseklik ve sahadaki kaldırma/taşıma şartları birlikte değerlendirilmelidir.',30,1)
ON DUPLICATE KEY UPDATE
  question=VALUES(question),
  answer=VALUES(answer),
  display_order=VALUES(display_order),
  is_active=VALUES(is_active);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('tctp0004trrev00000000000000000001','bbbb0004-2222-4222-8222-bbbbbbbb0004',NULL,5,'Çok yüksek debide bile kararlı; üç hücreli yapı işimizi çözdü.',1,'Endüstri Tesisi'),
  ('tctp0004trrev00000000000000000002','bbbb0004-2222-4222-8222-bbbbbbbb0004',NULL,4,'Büyük model seçenekleri sayesinde doğru kapasiteye hızlı ulaştık.',1,'Proje Ekibi')
ON DUPLICATE KEY UPDATE
  rating=VALUES(rating),
  comment=VALUES(comment),
  is_active=VALUES(is_active),
  customer_name=VALUES(customer_name);

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('tctp0004tropt00000000000000000001','bbbb0004-2222-4222-8222-bbbbbbbb0004','Model', JSON_ARRAY(
    'TCTP-3','TCTP-4','TCTP-5','TCTP-5.5','TCTP-6','TCTP-7','TCTP-9',
    'TCTP-12','TCTP-14','TCTP-16','TCTP-20','TCTP-24','TCTP-26','TCTP-30','TCTP-35'
  ))
ON DUPLICATE KEY UPDATE
  option_name=VALUES(option_name),
  option_values=VALUES(option_values);

COMMIT;
