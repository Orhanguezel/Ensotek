-- =============================================================
-- FILE: 014.96_product_bbbb0004_en.sql (FINAL)
-- TCTP – Triple Cell Cooling Towers (EN)
-- Fix: ids CHAR(36) (UUID compatible)
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;

-- =============================================================
-- I18N (EN)
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb0004-2222-4222-8222-bbbbbbbb0004',
  'en',
  'Open Circuit Cooling Towers – Triple Cell (TCTP Series)',
  'open-circuit-cooling-towers-triple-cell-tctp-series',
  'TCTP triple-cell open circuit cooling towers provide scalable performance for very high capacity and flow requirements. The catalog table lists dimensions, weights, capacity and flow rate values for 35/30/25°C and 40/30/24°C operating conditions.',
  'Open circuit cooling tower – triple cell TCTP series',
  JSON_ARRAY('open circuit','triple cell','TCTP','cooling tower','ensotek'),
  JSON_OBJECT(
    'cellType','Triple cell',
    'series','TCTP',
    'capacityConditions',JSON_ARRAY('35/30/25°C','40/30/24°C')
  ),
  'Open Circuit Cooling Towers | Triple Cell TCTP Series | Ensotek',
  'Triple-cell open circuit towers (TCTP series). Models from TCTP-3 to TCTP-35 with catalog-based dimensions, weights, capacities and flow rates.'
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
-- Specs (EN)  -- id: CHAR(36)
-- =============================================================
INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('tctp04en-0000-0000-0000-000000000001','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Series / Cell Type','TCTP – triple cell open circuit towers','custom',10),
  ('tctp04en-0000-0000-0000-000000000002','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Model Range','TCTP-3 … TCTP-35','custom',20),
  ('tctp04en-0000-0000-0000-000000000003','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Fan Group','3×930 … 3×3700 (mm)','physical',30),
  ('tctp04en-0000-0000-0000-000000000004','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Capacity (35/30/25°C)','700,000 – 10,400,000 kcal/h','service',40),
  ('tctp04en-0000-0000-0000-000000000005','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Flow Rate (35/30/25°C)','140 – 2080 m³/h','service',50),
  ('tctp04en-0000-0000-0000-000000000006','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Capacity (40/30/24°C)','1,100,000 – 15,300,000 kcal/h','service',60),
  ('tctp04en-0000-0000-0000-000000000007','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Flow Rate (40/30/24°C)','110 – 1530 m³/h','service',70),
  ('tctp04en-0000-0000-0000-000000000008','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Weight (Empty/Operating)','950–11,500 kg / 3,400–60,000 kg (model dependent)','physical',80)
ON DUPLICATE KEY UPDATE
  name      = VALUES(name),
  value     = VALUES(value),
  category  = VALUES(category),
  order_num = VALUES(order_num);

-- =============================================================
-- FAQs (EN)  -- id: CHAR(36)
-- =============================================================
INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('tctp04en-0000-0000-0000-000000010001','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','When should a triple-cell tower be preferred?','Preferred for very high capacity/flow requirements where scalable performance with three cells is needed.',10,1),
  ('tctp04en-0000-0000-0000-000000010002','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Under which conditions are values listed?','Capacity (kcal/h) and flow rate (m³/h) are listed for 35/30/25°C and 40/30/24°C in the catalog table.',20,1),
  ('tctp04en-0000-0000-0000-000000010003','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Key parameters for model selection?','Required flow rate, target condition, footprint/height constraints, and handling/weight constraints should be evaluated together.',30,1)
ON DUPLICATE KEY UPDATE
  question      = VALUES(question),
  answer        = VALUES(answer),
  display_order = VALUES(display_order),
  is_active     = VALUES(is_active);

-- =============================================================
-- Reviews (EN) – sample  -- id: CHAR(36)
-- =============================================================
INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('tctp04en-0000-0000-0000-000000020001','bbbb0004-2222-4222-8222-bbbbbbbb0004',NULL,5,'Stable even at very high flow rates; the triple-cell layout delivered.',1,'Industrial Plant'),
  ('tctp04en-0000-0000-0000-000000020002','bbbb0004-2222-4222-8222-bbbbbbbb0004',NULL,4,'Model range made it easy to match our capacity requirements.',1,'Project Team')
ON DUPLICATE KEY UPDATE
  rating        = VALUES(rating),
  comment       = VALUES(comment),
  is_active     = VALUES(is_active),
  customer_name = VALUES(customer_name);

-- =============================================================
-- Options (EN) – model list  -- id: CHAR(36)
-- =============================================================
INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('tctp04en-0000-0000-0000-000000030001','bbbb0004-2222-4222-8222-bbbbbbbb0004','Model', JSON_ARRAY(
    'TCTP-3','TCTP-4','TCTP-5','TCTP-5.5','TCTP-6','TCTP-7','TCTP-9',
    'TCTP-12','TCTP-14','TCTP-16','TCTP-20','TCTP-24','TCTP-26','TCTP-30','TCTP-35'
  ))
ON DUPLICATE KEY UPDATE
  option_name   = VALUES(option_name),
  option_values = VALUES(option_values);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
