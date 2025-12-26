-- =============================================================
-- FILE: 014.91_product_bbbb0003_tr.sql  (FIXED)
-- DCTP – İki Hücreli Kuleler (TR)
-- Fix: ids -> UUID(36) compatible (CHAR(36))
-- =============================================================

SET NAMES utf8mb4;
START TRANSACTION;

-- =============================================================
-- I18N
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb0003-2222-4222-8222-bbbbbbbb0003',
  'de',
  'Açık Tip Su Soğutma Kuleleri – İki Hücreli (DCTP Serisi)',
  'acik-tip-su-sogutma-kuleleri-iki-hucreli-dctp-serisi',
  'DCTP serisi iki hücreli açık tip su soğutma kuleleri, yüksek kapasite ve debi ihtiyaçlarında çift hücreli yapı ile çözüm sunar. Katalog tablosunda her model için ölçüler, ağırlıklar, kapasite ve debi değerleri 35/30/25°C ve 40/30/24°C koşullarında verilmiştir.',
  'Açık tip su soğutma kulesi – İki hücreli DCTP serisi',
  JSON_ARRAY('açık tip','open circuit','iki hücreli','DCTP','soğutma kulesi','ensotek'),
  JSON_OBJECT(
    'cellType','İki hücreli',
    'series','DCTP',
    'capacityConditions', JSON_ARRAY('35/30/25°C','40/30/24°C')
  ),
  'Açık Tip Su Soğutma Kuleleri | İki Hücreli DCTP Serisi | Ensotek',
  'İki hücreli açık tip kuleler (DCTP serisi). DCTP-3’ten DCTP-35’e model seçenekleri; ölçü, ağırlık, kapasite ve debi değerleri katalog tablosuna göre.'
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

-- =============================================================
-- Specs (TR)
-- =============================================================
INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('dctp0003-0000-0000-0000-000000000001','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Seri / Hücre Tipi','DCTP – iki hücreli açık tip kuleler','custom',10),
  ('dctp0003-0000-0000-0000-000000000002','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Model Aralığı','DCTP-3 … DCTP-35','custom',20),
  ('dctp0003-0000-0000-0000-000000000003','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Fan Grubu','2×930 … 2×3150 (mm)','physical',30),
  ('dctp0003-0000-0000-0000-000000000004','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Kapasite (35/30/25°C)','500.000 – 7.000.000 kcal/h','service',40),
  ('dctp0003-0000-0000-0000-000000000005','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Debi (35/30/25°C)','100 – 1400 m³/h','service',50),
  ('dctp0003-0000-0000-0000-000000000006','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Kapasite (40/30/24°C)','720.000 – 10.500.000 kcal/h','service',60),
  ('dctp0003-0000-0000-0000-000000000007','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Debi (40/30/24°C)','72 – 1050 m³/h','service',70),
  ('dctp0003-0000-0000-0000-000000000008','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Ağırlık (Boş/Çalışır)','780–8900 kg / 2500–45000 kg (modele göre)','physical',80)
ON DUPLICATE KEY UPDATE
  name=VALUES(name),
  value=VALUES(value),
  category=VALUES(category),
  order_num=VALUES(order_num);

-- =============================================================
-- FAQs (TR)
-- =============================================================
INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('dctp0003-0000-0000-0000-000000010001','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','İki hücreli kule ne zaman tercih edilir?','Yüksek kapasite/debi ihtiyaçlarında ve işletme sürekliliği için çift hücreli yapı istenen projelerde tercih edilir.',10,1),
  ('dctp0003-0000-0000-0000-000000010002','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Kapasite değerleri hangi koşullarda veriliyor?','Katalog tablosunda 35/30/25°C ve 40/30/24°C koşullarına göre kapasite (kcal/h) ve debi (m³/h) verilir.',20,1),
  ('dctp0003-0000-0000-0000-000000010003','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Model seçimi nasıl yapılır?','Hedef koşul, istenen debi, saha ölçüleri (taban alanı/yükseklik) ve ağırlık/kaldırma şartları birlikte değerlendirilir.',30,1)
ON DUPLICATE KEY UPDATE
  question=VALUES(question),
  answer=VALUES(answer),
  display_order=VALUES(display_order),
  is_active=VALUES(is_active);

-- =============================================================
-- Reviews (TR) – sample
-- =============================================================
INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('dctp0003-0000-0000-0000-000000020001','bbbb0003-2222-4222-8222-bbbbbbbb0003',NULL,5,'Çift hücreli yapı sayesinde yüksek debide stabil performans aldık.',1,'Proje Mühendisliği'),
  ('dctp0003-0000-0000-0000-000000020002','bbbb0003-2222-4222-8222-bbbbbbbb0003',NULL,4,'Katalog tablosu seçimde çok iş gördü; montaj planı netleşti.',1,'Saha Ekibi')
ON DUPLICATE KEY UPDATE
  rating=VALUES(rating),
  comment=VALUES(comment),
  is_active=VALUES(is_active),
  customer_name=VALUES(customer_name);

-- =============================================================
-- Options (TR) – model list
-- =============================================================
INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('dctp0003-0000-0000-0000-000000030001','bbbb0003-2222-4222-8222-bbbbbbbb0003','Model', JSON_ARRAY(
    'DCTP-3','DCTP-4','DCTP-5','DCTP-5.5','DCTP-6','DCTP-7','DCTP-9',
    'DCTP-12','DCTP-14','DCTP-16','DCTP-20','DCTP-24','DCTP-26','DCTP-30','DCTP-35'
  ))
ON DUPLICATE KEY UPDATE
  option_name=VALUES(option_name),
  option_values=VALUES(option_values);

COMMIT;
