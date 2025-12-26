-- =============================================================
-- FILE: 014.8_product_bbbb0002_de.sql
-- PRODUCT bbbb0002 i18n + specs + faqs + reviews + options (DE)
-- Offene Kühltürme – Einzellelle (CTP-Serie)
-- Source: Catalog p.7
-- =============================================================

SET NAMES utf8mb4;

START TRANSACTION;

INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb0002-2222-4222-8222-bbbbbbbb0002',
  'de',
  'Offene Kühltürme – Einzellelle (CTP-Serie)',
  'offene-kuehltuerme-einzellelle-ctp-serie',
  'Die CTP-Serie (Einzellelle) der offenen Kühltürme bietet eine breite Modellauswahl für unterschiedliche Kapazitäts- und Volumenstromanforderungen. Kapazität und Volumenstrom sind in der Katalogtabelle für die Betriebsbedingungen 35/30/25°C und 40/30/24°C angegeben.',
  'Offener Kühlturm – Einzellelle CTP-Serie',
  JSON_ARRAY('offener kühlturm', 'open circuit', 'einzellelle', 'CTP', 'ensotek'),
  JSON_OBJECT(
    'zelltyp', 'Einzellelle',
    'serie', 'CTP',
    'betriebsbedingungen', JSON_ARRAY('35/30/25°C', '40/30/24°C')
  ),
  'Offene Kühltürme | Einzellelle CTP-Serie | Ensotek',
  'Einzellige offene Kühltürme (CTP-Serie) von CTP-1 bis CTP-35. Abmessungen, Gewichte, Kapazitäten und Volumenströme sind in der Katalogtabelle gelistet.'
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
  ('55550002-cccc-4ccc-8ccc-bbbb0002de01','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Serie / Zelltyp','CTP – offene Kühltürme, Einzellelle','custom',10),
  ('55550002-cccc-4ccc-8ccc-bbbb0002de02','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Modellbereich','CTP-1 … CTP-35','custom',20),
  ('55550002-cccc-4ccc-8ccc-bbbb0002de03','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Betriebsbedingungen','35/30/25°C und 40/30/24°C (Katalogtabelle)','service',30),
  ('55550002-cccc-4ccc-8ccc-bbbb0002de04','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Kapazitätsbereich (35/30/25°C)','90.000 – 3.500.000 kcal/h (modellabhängig)','service',40),
  ('55550002-cccc-4ccc-8ccc-bbbb0002de05','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Volumenstrombereich (35/30/25°C)','18 – 700 m³/h (modellabhängig)','service',50),
  ('55550002-cccc-4ccc-8ccc-bbbb0002de06','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Ventilator-Ø Bereich','630 – 3700 mm (modellabhängig)','physical',60)
ON DUPLICATE KEY UPDATE
  name=VALUES(name), value=VALUES(value), category=VALUES(category), order_num=VALUES(order_num);

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('66660002-cccc-4ccc-8ccc-bbbb0002de01','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Wofür steht die CTP-Serie?','CTP bezeichnet die Einzellelle-Produktfamilie der offenen Kühltürme. Die Modelle skalieren von CTP-1 bis CTP-35.',10,1),
  ('66660002-cccc-4ccc-8ccc-bbbb0002de02','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Unter welchen Bedingungen sind die Kapazitäten angegeben?','Die Katalogtabelle enthält Kapazität und Volumenstrom für 35/30/25°C sowie 40/30/24°C.',20,1),
  ('66660002-cccc-4ccc-8ccc-bbbb0002de03','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Wie wähle ich das richtige Modell?','Auswahl anhand Ziel-Betriebsbedingung, benötigtem Volumenstrom (m³/h) und Einbaubedingungen (Grundfläche/Höhe).',30,1)
ON DUPLICATE KEY UPDATE
  question=VALUES(question), answer=VALUES(answer), display_order=VALUES(display_order), is_active=VALUES(is_active);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('77770002-cccc-4ccc-8ccc-bbbb0002de01','bbbb0002-2222-4222-8222-bbbbbbbb0002',NULL,5,'Sehr große Modellbandbreite – schnelle Vor-Auslegung möglich.',1,'Planung'),
  ('77770002-cccc-4ccc-8ccc-bbbb0002de02','bbbb0002-2222-4222-8222-bbbbbbbb0002',NULL,4,'Tabellenwerte sind für die Projektierung sehr hilfreich.',1,'Betrieb')
ON DUPLICATE KEY UPDATE
  rating=VALUES(rating), comment=VALUES(comment), is_active=VALUES(is_active), customer_name=VALUES(customer_name);

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('88880002-cccc-4ccc-8ccc-bbbb0002de01','bbbb0002-2222-4222-8222-bbbbbbbb0002','Modell', JSON_ARRAY(
    'CTP-1','CTP-2','CTP-3','CTP-4','CTP-5','CTP-5.5','CTP-6','CTP-7','CTP-9',
    'CTP-12','CTP-14','CTP-16','CTP-20','CTP-24','CTP-26','CTP-30','CTP-35'
  ))
ON DUPLICATE KEY UPDATE
  option_name=VALUES(option_name), option_values=VALUES(option_values);

COMMIT;
