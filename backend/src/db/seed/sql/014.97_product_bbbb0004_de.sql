-- =============================================================
-- FILE: 014.97_product_bbbb0004_de.sql (FINAL)
-- TCTP – Dreifachzelle (DE)
-- Fix: ids CHAR(36) (UUID compatible)
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;

-- =============================================================
-- I18N (DE)
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb0004-2222-4222-8222-bbbbbbbb0004',
  'de',
  'Offene Kühltürme – Dreifachzelle (TCTP-Serie)',
  'offene-kuehltuerme-dreifachzelle-tctp-serie',
  'Die TCTP-Serie (Dreifachzelle) der offenen Kühltürme ist für sehr hohe Kapazitäts- und Volumenstromanforderungen ausgelegt und skaliert über drei Zellen. Die Katalogtabelle enthält Abmessungen, Gewichte sowie Kapazitäts- und Volumenstromwerte für 35/30/25°C und 40/30/24°C.',
  'Offener Kühlturm – Dreifachzelle TCTP-Serie',
  JSON_ARRAY('offener kühlturm','open circuit','dreifachzelle','TCTP','ensotek'),
  JSON_OBJECT(
    'zelltyp','Dreifachzelle',
    'serie','TCTP',
    'betriebsbedingungen',JSON_ARRAY('35/30/25°C','40/30/24°C')
  ),
  'Offene Kühltürme | TCTP Dreifachzelle | Ensotek',
  'Dreizellige offene Kühltürme (TCTP-Serie). Modelle TCTP-3 bis TCTP-35 mit Abmessungen, Gewichten, Kapazitäten und Volumenströmen gemäß Katalogtabelle.'
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

-- =============================================================
-- Specs (DE)  -- id: CHAR(36)
-- =============================================================
INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('tctp04de-0000-0000-0000-000000000001','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Serie / Zelltyp','TCTP – offene Kühltürme, Dreifachzelle','custom',10),
  ('tctp04de-0000-0000-0000-000000000002','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Modellbereich','TCTP-3 … TCTP-35','custom',20),
  ('tctp04de-0000-0000-0000-000000000003','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Ventilatorgruppe','3×930 … 3×3700 (mm)','physical',30),
  ('tctp04de-0000-0000-0000-000000000004','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Kapazität (35/30/25°C)','700.000 – 10.400.000 kcal/h','service',40),
  ('tctp04de-0000-0000-0000-000000000005','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Volumenstrom (35/30/25°C)','140 – 2080 m³/h','service',50),
  ('tctp04de-0000-0000-0000-000000000006','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Kapazität (40/30/24°C)','1.100.000 – 15.300.000 kcal/h','service',60),
  ('tctp04de-0000-0000-0000-000000000007','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Volumenstrom (40/30/24°C)','110 – 1530 m³/h','service',70),
  ('tctp04de-0000-0000-0000-000000000008','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Gewichte (leer/Betrieb)','950–11.500 kg / 3.400–60.000 kg (modellabhängig)','physical',80)
ON DUPLICATE KEY UPDATE
  name      = VALUES(name),
  value     = VALUES(value),
  category  = VALUES(category),
  order_num = VALUES(order_num);

-- =============================================================
-- FAQs (DE)  -- id: CHAR(36)
-- =============================================================
INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('tctp04de-0000-0000-0000-000000010001','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Wann ist eine Dreifachzelle sinnvoll?','Bei sehr hohen Kapazitäts-/Volumenstromanforderungen, wenn skalierbare Leistung über drei Zellen benötigt wird.',10,1),
  ('tctp04de-0000-0000-0000-000000010002','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Unter welchen Bedingungen sind die Werte angegeben?','Kapazität (kcal/h) und Volumenstrom (m³/h) sind für 35/30/25°C und 40/30/24°C in der Katalogtabelle angegeben.',20,1),
  ('tctp04de-0000-0000-0000-000000010003','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Wichtige Auswahlparameter?','Erforderlicher Volumenstrom, Zielzustand, Platzbedarf (Grundfläche/Höhe) sowie Gewichts-/Handlinganforderungen.',30,1)
ON DUPLICATE KEY UPDATE
  question      = VALUES(question),
  answer        = VALUES(answer),
  display_order = VALUES(display_order),
  is_active     = VALUES(is_active);

-- =============================================================
-- Reviews (DE) – sample  -- id: CHAR(36)
-- =============================================================
INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('tctp04de-0000-0000-0000-000000020001','bbbb0004-2222-4222-8222-bbbbbbbb0004',NULL,5,'Auch bei sehr hohen Volumenströmen stabil – Dreifachzelle passt.',1,'Industriebetrieb'),
  ('tctp04de-0000-0000-0000-000000020002','bbbb0004-2222-4222-8222-bbbbbbbb0004',NULL,4,'Große Modellauswahl erleichtert die richtige Dimensionierung.',1,'Planung')
ON DUPLICATE KEY UPDATE
  rating        = VALUES(rating),
  comment       = VALUES(comment),
  is_active     = VALUES(is_active),
  customer_name = VALUES(customer_name);

-- =============================================================
-- Options (DE) – model list  -- id: CHAR(36)
-- =============================================================
INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('tctp04de-0000-0000-0000-000000030001','bbbb0004-2222-4222-8222-bbbbbbbb0004','Modell', JSON_ARRAY(
    'TCTP-3','TCTP-4','TCTP-5','TCTP-5.5','TCTP-6','TCTP-7','TCTP-9',
    'TCTP-12','TCTP-14','TCTP-16','TCTP-20','TCTP-24','TCTP-26','TCTP-30','TCTP-35'
  ))
ON DUPLICATE KEY UPDATE
  option_name   = VALUES(option_name),
  option_values = VALUES(option_values);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
