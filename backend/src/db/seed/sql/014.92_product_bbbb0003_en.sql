-- =============================================================
-- FILE: 014.92_product_bbbb0003_en.sql (FIXED)
-- DCTP – Double Cell Cooling Towers (EN)
-- Fix: All ids shortened to <= 32 chars to avoid ER_DATA_TOO_LONG
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
  'en',
  'Open Circuit Cooling Towers – Double Cell (DCTP Series)',
  'open-circuit-cooling-towers-double-cell-dctp-series',
  'DCTP double-cell open circuit cooling towers address higher capacity and flow requirements with a dual-cell configuration. The catalog table provides dimensions, weights, capacity and flow rate values for 35/30/25°C and 40/30/24°C operating conditions.',
  'Open circuit cooling tower – double cell DCTP series',
  JSON_ARRAY('open circuit','double cell','DCTP','cooling tower','ensotek'),
  JSON_OBJECT(
    'cellType','Double cell',
    'series','DCTP',
    'capacityConditions',JSON_ARRAY('35/30/25°C','40/30/24°C')
  ),
  'Open Circuit Cooling Towers | Double Cell DCTP Series | Ensotek',
  'Double-cell open circuit towers (DCTP series). Model options from DCTP-3 to DCTP-35; dimensions, weights, capacities and flow rates per catalog table.'
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
-- Specs (EN)
-- =============================================================
INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('dctp0003en000000000000000000000001','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','Series / Cell Type','DCTP – double cell open circuit towers','custom',10),
  ('dctp0003en000000000000000000000002','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','Model Range','DCTP-3 … DCTP-35','custom',20),
  ('dctp0003en000000000000000000000003','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','Fan Group','2×930 … 2×3150 (mm)','physical',30),
  ('dctp0003en000000000000000000000004','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','Capacity (35/30/25°C)','500,000 – 7,000,000 kcal/h','service',40),
  ('dctp0003en000000000000000000000005','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','Flow Rate (35/30/25°C)','100 – 1400 m³/h','service',50),
  ('dctp0003en000000000000000000000006','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','Capacity (40/30/24°C)','720,000 – 10,500,000 kcal/h','service',60),
  ('dctp0003en000000000000000000000007','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','Flow Rate (40/30/24°C)','72 – 1050 m³/h','service',70),
  ('dctp0003en000000000000000000000008','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','Weight (Empty/Operating)','780–8900 kg / 2500–45000 kg (model dependent)','physical',80)
ON DUPLICATE KEY UPDATE
  name=VALUES(name),
  value=VALUES(value),
  category=VALUES(category),
  order_num=VALUES(order_num);

-- =============================================================
-- FAQs (EN)
-- =============================================================
INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('dctp0003enfaq00000000000000000001','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','When should a double-cell tower be preferred?','Preferred for higher capacity/flow projects and when a dual-cell configuration is required for operational continuity.',10,1),
  ('dctp0003enfaq00000000000000000002','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','Under which conditions are capacities listed?','The catalog table lists capacity (kcal/h) and flow rate (m³/h) for 35/30/25°C and 40/30/24°C operating conditions.',20,1),
  ('dctp0003enfaq00000000000000000003','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','How do I choose the right model?','Select based on target condition, required flow rate, site constraints (base area/height) and handling/weight constraints.',30,1)
ON DUPLICATE KEY UPDATE
  question=VALUES(question),
  answer=VALUES(answer),
  display_order=VALUES(display_order),
  is_active=VALUES(is_active);

-- =============================================================
-- Reviews (EN) – sample
-- =============================================================
INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('dctp0003enrev00000000000000000001','bbbb0003-2222-4222-8222-bbbbbbbb0003',NULL,5,'Stable performance at high flow rates thanks to the dual-cell design.',1,'Engineering'),
  ('dctp0003enrev00000000000000000002','bbbb0003-2222-4222-8222-bbbbbbbb0003',NULL,4,'The catalog table made pre-sizing and layout planning straightforward.',1,'Operations')
ON DUPLICATE KEY UPDATE
  rating=VALUES(rating),
  comment=VALUES(comment),
  is_active=VALUES(is_active),
  customer_name=VALUES(customer_name);

-- =============================================================
-- Options (EN) – model list
-- =============================================================
INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('dctp0003enopt00000000000000000001','bbbb0003-2222-4222-8222-bbbbbbbb0003','Model', JSON_ARRAY(
    'DCTP-3','DCTP-4','DCTP-5','DCTP-5.5','DCTP-6','DCTP-7','DCTP-9',
    'DCTP-12','DCTP-14','DCTP-16','DCTP-20','DCTP-24','DCTP-26','DCTP-30','DCTP-35'
  ))
ON DUPLICATE KEY UPDATE
  option_name=VALUES(option_name),
  option_values=VALUES(option_values);

COMMIT;
