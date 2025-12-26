-- =============================================================
-- FILE: 019.93_product_bbbb0003_de.sql (FIXED)
-- DCTP – Doppelte Zelle (DE)
-- Fix: shorten ids to <= 32 chars
-- =============================================================

SET NAMES utf8mb4;
START TRANSACTION;

INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb0003-2222-4222-8222-bbbbbbbb0003',
  'de',
  'Offene Kühltürme – Doppelzelle (DCTP-Serie)',
  'offene-kuehltuerme-doppelzelle-dctp-serie',
  'Die DCTP-Serie (Doppelzelle) der offenen Kühltürme ist für höhere Kapazitäts- und Volumenstromanforderungen ausgelegt. Die Katalogtabelle enthält Abmessungen, Gewichte sowie Kapazitäts- und Volumenstromwerte für 35/30/25°C und 40/30/24°C.',
  'Offener Kühlturm – Doppelzelle DCTP-Serie',
  JSON_ARRAY('offener kühlturm','open circuit','doppelzelle','DCTP','ensotek'),
  JSON_OBJECT('zelltyp','Doppelzelle','serie','DCTP','betriebsbedingungen',JSON_ARRAY('35/30/25°C','40/30/24°C')),
  'Offene Kühltürme | DCTP Doppelzelle | Ensotek',
  'Doppelzellige offene Kühltürme (DCTP-Serie). Modelle DCTP-3 bis DCTP-35; Abmessungen, Gewichte, Kapazitäten und Volumenströme gemäß Katalogtabelle.'
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
  ('dctp0003de000000000000000000000001','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Serie / Zelltyp','DCTP – offene Kühltürme, Doppelzelle','custom',10),
  ('dctp0003de000000000000000000000002','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Modellbereich','DCTP-3 … DCTP-35','custom',20),
  ('dctp0003de000000000000000000000003','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Ventilatorgruppe','2×930 … 2×3150 (mm)','physical',30),
  ('dctp0003de000000000000000000000004','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Kapazität (35/30/25°C)','500.000 – 7.000.000 kcal/h','service',40),
  ('dctp0003de000000000000000000000005','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Volumenstrom (35/30/25°C)','100 – 1400 m³/h','service',50),
  ('dctp0003de000000000000000000000006','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Kapazität (40/30/24°C)','720.000 – 10.500.000 kcal/h','service',60),
  ('dctp0003de000000000000000000000007','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Volumenstrom (40/30/24°C)','72 – 1050 m³/h','service',70),
  ('dctp0003de000000000000000000000008','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Gewichte (leer/Betrieb)','780–8900 kg / 2500–45000 kg (modellabhängig)','physical',80)
ON DUPLICATE KEY UPDATE
  name=VALUES(name),
  value=VALUES(value),
  category=VALUES(category),
  order_num=VALUES(order_num);

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('dctp0003defaq00000000000000000001','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Wann ist eine Doppelzelle sinnvoll?','Bei hohen Kapazitäts-/Volumenstromanforderungen und wenn eine Doppelzellen-Ausführung für Betriebssicherheit/Redundanz gewünscht ist.',10,1),
  ('dctp0003defaq00000000000000000002','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Unter welchen Bedingungen sind die Werte angegeben?','Kapazität (kcal/h) und Volumenstrom (m³/h) sind für 35/30/25°C und 40/30/24°C in der Katalogtabelle angegeben.',20,1),
  ('dctp0003defaq00000000000000000003','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Wie wähle ich das passende Modell?','Auswahl anhand Zielzustand, benötigtem Volumenstrom sowie Einbauraum (Grundfläche/Höhe) und Gewichts-/Handlinganforderungen.',30,1)
ON DUPLICATE KEY UPDATE
  question=VALUES(question),
  answer=VALUES(answer),
  display_order=VALUES(display_order),
  is_active=VALUES(is_active);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('dctp0003derev00000000000000000001','bbbb0003-2222-4222-8222-bbbbbbbb0003',NULL,5,'Sehr stabil bei hohen Volumenströmen – Doppelzelle zahlt sich aus.',1,'Planung'),
  ('dctp0003derev00000000000000000002','bbbb0003-2222-4222-8222-bbbbbbbb0003',NULL,4,'Die Tabellenwerte sind hilfreich für Vor-Auslegung und Layout.',1,'Betrieb')
ON DUPLICATE KEY UPDATE
  rating=VALUES(rating),
  comment=VALUES(comment),
  is_active=VALUES(is_active),
  customer_name=VALUES(customer_name);

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('dctp0003deopt00000000000000000001','bbbb0003-2222-4222-8222-bbbbbbbb0003','Modell', JSON_ARRAY(
    'DCTP-3','DCTP-4','DCTP-5','DCTP-5.5','DCTP-6','DCTP-7','DCTP-9',
    'DCTP-12','DCTP-14','DCTP-16','DCTP-20','DCTP-24','DCTP-26','DCTP-30','DCTP-35'
  ))
ON DUPLICATE KEY UPDATE
  option_name=VALUES(option_name),
  option_values=VALUES(option_values);

COMMIT;
