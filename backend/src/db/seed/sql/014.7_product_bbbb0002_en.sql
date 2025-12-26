-- =============================================================
-- FILE: 014.7_product_bbbb0002_en.sql
-- PRODUCT bbbb0002 i18n + specs + faqs + reviews + options (EN)
-- Open Circuit Cooling Towers – Single Cell (CTP Series)
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
  'en',
  'Open Circuit Cooling Towers – Single Cell (CTP Series)',
  'open-circuit-cooling-towers-single-cell-ctp-series',
  'CTP single-cell open circuit cooling towers provide a wide model range to match different capacity and flow requirements. Capacity and flow rate values are provided in the catalog table for 35/30/25°C and 40/30/24°C operating conditions.',
  'Open circuit cooling tower – single cell CTP series',
  JSON_ARRAY('open circuit', 'single cell', 'CTP', 'cooling tower', 'ensotek'),
  JSON_OBJECT(
    'cellType', 'Single cell',
    'series', 'CTP',
    'capacityConditions', JSON_ARRAY('35/30/25°C', '40/30/24°C')
  ),
  'Open Circuit Cooling Towers | Single Cell CTP Series | Ensotek',
  'Single-cell open circuit cooling towers (CTP series). Model options from CTP-1 to CTP-35; dimensions, weights, capacities and flow rates are listed in the catalog table.'
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
  ('55550002-bbbb-4bbb-8bbb-bbbb0002en01','bbbb0002-2222-4222-8222-bbbbbbbb0002','en','Series / Cell Type','CTP – single cell open circuit towers','custom',10),
  ('55550002-bbbb-4bbb-8bbb-bbbb0002en02','bbbb0002-2222-4222-8222-bbbbbbbb0002','en','Model Range','CTP-1 … CTP-35','custom',20),
  ('55550002-bbbb-4bbb-8bbb-bbbb0002en03','bbbb0002-2222-4222-8222-bbbbbbbb0002','en','Capacity Conditions','35/30/25°C and 40/30/24°C (catalog table)','service',30),
  ('55550002-bbbb-4bbb-8bbb-bbbb0002en04','bbbb0002-2222-4222-8222-bbbbbbbb0002','en','Capacity Range (35/30/25°C)','90,000 – 3,500,000 kcal/h (model dependent)','service',40),
  ('55550002-bbbb-4bbb-8bbb-bbbb0002en05','bbbb0002-2222-4222-8222-bbbbbbbb0002','en','Flow Rate Range (35/30/25°C)','18 – 700 m³/h (model dependent)','service',50),
  ('55550002-bbbb-4bbb-8bbb-bbbb0002en06','bbbb0002-2222-4222-8222-bbbbbbbb0002','en','Fan Diameter (Ø) Range','630 – 3700 mm (model dependent)','physical',60)
ON DUPLICATE KEY UPDATE
  name=VALUES(name), value=VALUES(value), category=VALUES(category), order_num=VALUES(order_num);

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('66660002-bbbb-4bbb-8bbb-bbbb0002en01','bbbb0002-2222-4222-8222-bbbbbbbb0002','en','What does the CTP series represent?','CTP refers to the single-cell open circuit tower family. Models scale from CTP-1 up to CTP-35.',10,1),
  ('66660002-bbbb-4bbb-8bbb-bbbb0002en02','bbbb0002-2222-4222-8222-bbbbbbbb0002','en','Under which conditions are capacities provided?','The catalog table provides capacity and flow rates for 35/30/25°C and 40/30/24°C operating conditions.',20,1),
  ('66660002-bbbb-4bbb-8bbb-bbbb0002en03','bbbb0002-2222-4222-8222-bbbbbbbb0002','en','How do I choose the right model?','Select based on target operating condition, required flow rate (m³/h), and installation constraints such as base area and height.',30,1)
ON DUPLICATE KEY UPDATE
  question=VALUES(question), answer=VALUES(answer), display_order=VALUES(display_order), is_active=VALUES(is_active);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('77770002-bbbb-4bbb-8bbb-bbbb0002en01','bbbb0002-2222-4222-8222-bbbbbbbb0002',NULL,5,'Very broad model range; sizing became straightforward.',1,'Project Team'),
  ('77770002-bbbb-4bbb-8bbb-bbbb0002en02','bbbb0002-2222-4222-8222-bbbbbbbb0002',NULL,4,'Catalog table is practical for quick pre-sizing.',1,'Operations')
ON DUPLICATE KEY UPDATE
  rating=VALUES(rating), comment=VALUES(comment), is_active=VALUES(is_active), customer_name=VALUES(customer_name);

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('88880002-bbbb-4bbb-8bbb-bbbb0002en01','bbbb0002-2222-4222-8222-bbbbbbbb0002','Model', JSON_ARRAY(
    'CTP-1','CTP-2','CTP-3','CTP-4','CTP-5','CTP-5.5','CTP-6','CTP-7','CTP-9',
    'CTP-12','CTP-14','CTP-16','CTP-20','CTP-24','CTP-26','CTP-30','CTP-35'
  ))
ON DUPLICATE KEY UPDATE
  option_name=VALUES(option_name), option_values=VALUES(option_values);

COMMIT;
