-- =============================================================
-- FILE: 014.3_product_bbbb0001_de.sql
-- PRODUCT bbbb0001 i18n + specs + faqs + reviews + options (DE)
-- Geschlossene Kühltürme (Closed Circuit) – CC CTP / CC DCTP
-- Source: Catalog p.10-11
-- =============================================================

SET NAMES utf8mb4;

START TRANSACTION;

-- i18n (DE)
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
  JSON_OBJECT(
    'prinzip', 'Prozessmedium strömt im Coil; Kühlung von außen durch Luft und Umlaufwasser über die Coil-Oberfläche.',
    'einsatz', JSON_ARRAY('Luftkompressoren', 'Induktionsöfen', 'Chiller'),
    'serien', JSON_ARRAY('CC CTP', 'CC DCTP')
  ),
  'Geschlossene Kühltürme | CC CTP / CC DCTP | Ensotek',
  'Geschlossene (Closed-Circuit) Kühltürme für kontaminationssensitive Prozessmedien. CC CTP / CC DCTP mit umfangreicher Modellauswahl und technischen Eckdaten.'
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

-- TECHNICAL SPECS (DE)
INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11110001-cccc-4ccc-8ccc-bbbb0001de01','bbbb0001-2222-4222-8222-bbbbbbbb0001','de','Serie / Modellfamilie','CC CTP (Einzellüfter) und CC DCTP (Doppellüfter)','custom',10),
  ('11110001-cccc-4ccc-8ccc-bbbb0001de02','bbbb0001-2222-4222-8222-bbbbbbbb0001','de','Ventilator-Durchmesser (Ø)','930 / 1100 / 1250 / 1500 (inkl. Doppellüfter-Modelle)','physical',20),
  ('11110001-cccc-4ccc-8ccc-bbbb0001de03','bbbb0001-2222-4222-8222-bbbbbbbb0001','de','Ventilatormotor(en)','von 3 kW bis 2×5,5 kW (modellabhängig)','physical',30),
  ('11110001-cccc-4ccc-8ccc-bbbb0001de04','bbbb0001-2222-4222-8222-bbbbbbbb0001','de','Sprühpumpe','1,1 kW – 5,5 kW (modellabhängig)','physical',40),
  ('11110001-cccc-4ccc-8ccc-bbbb0001de05','bbbb0001-2222-4222-8222-bbbbbbbb0001','de','Beispielgewichte','CC CTP-3C/3: 1400 kg leer, 2300 kg Betrieb; CC DCTP-6C/6: 9645 kg leer, 15650 kg Betrieb','physical',50)
ON DUPLICATE KEY UPDATE
  name=VALUES(name), value=VALUES(value), category=VALUES(category), order_num=VALUES(order_num);

-- FAQS (DE)
INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22220001-cccc-4ccc-8ccc-bbbb0001de01','bbbb0001-2222-4222-8222-bbbbbbbb0001','de','Wann ist ein geschlossener Kühlturm sinnvoll?','Wenn das zu kühlende Wasser empfindlich gegenüber Verunreinigungen ist und das Prozessmedium sauber bleiben muss.',10,1),
  ('22220001-cccc-4ccc-8ccc-bbbb0001de02','bbbb0001-2222-4222-8222-bbbbbbbb0001','de','Wie funktioniert das Kühlprinzip?','Das Prozessmedium strömt im Coil. Außenluft und Umlaufwasser entziehen über die Coil-Oberfläche Wärme und kühlen das Medium.',20,1),
  ('22220001-cccc-4ccc-8ccc-bbbb0001de03','bbbb0001-2222-4222-8222-bbbbbbbb0001','de','Typische Einsatzbereiche?','Häufig in Prozessen mit sensibler Ausrüstung: Luftkompressoren, Induktionsöfen und Chiller-Anlagen.',30,1)
ON DUPLICATE KEY UPDATE
  question=VALUES(question), answer=VALUES(answer), display_order=VALUES(display_order), is_active=VALUES(is_active);

-- REVIEWS (DE) – sample
INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33330001-cccc-4ccc-8ccc-bbbb0001de01','bbbb0001-2222-4222-8222-bbbbbbbb0001',NULL,5,'Sehr stabiler Betrieb bei kontaminationssensitiven Prozessmedien.',1,'Anlagenbau'),
  ('33330001-cccc-4ccc-8ccc-bbbb0001de02','bbbb0001-2222-4222-8222-bbbbbbbb0001',NULL,4,'Große Modellvielfalt; Auswahl passend zum Prozess ist entscheidend.',1,'Betrieb')
ON DUPLICATE KEY UPDATE
  rating=VALUES(rating), comment=VALUES(comment), is_active=VALUES(is_active), customer_name=VALUES(customer_name);

-- OPTIONS (DE) – models list
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
  ))
ON DUPLICATE KEY UPDATE
  option_name=VALUES(option_name), option_values=VALUES(option_values);

COMMIT;
