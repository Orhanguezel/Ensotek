-- =============================================================
-- FILE: 014.2_product_bbbb0001_en.sql (FINAL)
-- PRODUCT bbbb0001 i18n + specs + faqs + reviews + options (EN)
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- i18n (EN)
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb0001-2222-4222-8222-bbbbbbbb0001',
  'en',
  'Closed Circuit Cooling Towers – CC CTP / CC DCTP Series',
  'closed-circuit-cooling-towers-cc-ctp-cc-dctp',
  'Closed circuit systems are preferred in processes where the water to be cooled is susceptible to contamination. The water required to remain clean is cooled as it passes through the pipe coils in the closed type tower. Hot water flows inside the coil, while cold air and circulating water remove heat from the coil surface. Closed circuit cooling towers are commonly used in processes containing sensitive equipment such as air compressors, induction furnaces and chillers.',
  'Closed circuit cooling tower – CC CTP / CC DCTP series',
  JSON_ARRAY('closed circuit', 'cooling tower', 'coil', 'process cooling', 'ensotek'),
  JSON_OBJECT(
    'principle', 'Process fluid flows inside the coil; it is cooled from the outside by air and circulating water.',
    'useCases', JSON_ARRAY('Air compressors', 'Induction furnaces', 'Chillers'),
    'series', JSON_ARRAY('CC CTP', 'CC DCTP')
  ),
  'Closed Circuit Cooling Towers | CC CTP / CC DCTP | Ensotek',
  'Closed circuit cooling towers for contamination-sensitive process waters. CC CTP / CC DCTP series with a broad model range and technical highlights.'
)
ON DUPLICATE KEY UPDATE
  title            = VALUES(title),
  slug             = VALUES(slug),
  description      = VALUES(description),
  alt              = VALUES(alt),
  tags             = VALUES(tags),
  specifications   = VALUES(specifications),
  meta_title       = VALUES(meta_title),
  meta_description = VALUES(meta_description),
  updated_at       = CURRENT_TIMESTAMP(3);

-- SPECS (EN)
DELETE FROM product_specs
WHERE product_id='bbbb0001-2222-4222-8222-bbbbbbbb0001' AND locale='en';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11110001-bbbb-4bbb-8bbb-bbbb0001en01','bbbb0001-2222-4222-8222-bbbbbbbb0001','en','Series / Model Family','CC CTP (single fan) and CC DCTP (double fan)','custom',10),
  ('11110001-bbbb-4bbb-8bbb-bbbb0001en02','bbbb0001-2222-4222-8222-bbbbbbbb0001','en','Fan Diameter (Ø)','930 / 1100 / 1250 / 1500 (incl. double-fan models)','physical',20),
  ('11110001-bbbb-4bbb-8bbb-bbbb0001en03','bbbb0001-2222-4222-8222-bbbbbbbb0001','en','Fan Motors','From 3 kW up to 2×5.5 kW (depending on model)','physical',30),
  ('11110001-bbbb-4bbb-8bbb-bbbb0001en04','bbbb0001-2222-4222-8222-bbbbbbbb0001','en','Spray Pump','1.1 kW – 5.5 kW (depending on model)','physical',40),
  ('11110001-bbbb-4bbb-8bbb-bbbb0001en05','bbbb0001-2222-4222-8222-bbbbbbbb0001','en','Sample Weights','CC CTP-3C/3: 1400 kg empty, 2300 kg operating; CC DCTP-6C/6: 9645 kg empty, 15650 kg operating','physical',50);

-- FAQS (EN)
DELETE FROM product_faqs
WHERE product_id='bbbb0001-2222-4222-8222-bbbbbbbb0001' AND locale='en';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22220001-bbbb-4bbb-8bbb-bbbb0001en01','bbbb0001-2222-4222-8222-bbbbbbbb0001','en','When should a closed circuit tower be preferred?','It is preferred when the water to be cooled is sensitive to contamination and the process fluid must remain clean.',10,1),
  ('22220001-bbbb-4bbb-8bbb-bbbb0001en02','bbbb0001-2222-4222-8222-bbbbbbbb0001','en','What is the cooling principle?','The process fluid flows inside the coil. Air flow and circulating water remove heat from the coil surface and cool the fluid inside.',20,1),
  ('22220001-bbbb-4bbb-8bbb-bbbb0001en03','bbbb0001-2222-4222-8222-bbbbbbbb0001','en','Typical application areas?','Used in processes with sensitive equipment such as air compressors, induction furnaces and chillers.',30,1);

-- REVIEWS (EN) — ID bazlı reset
DELETE FROM product_reviews
WHERE id IN (
  '33330001-bbbb-4bbb-8bbb-bbbb0001en01',
  '33330001-bbbb-4bbb-8bbb-bbbb0001en02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33330001-bbbb-4bbb-8bbb-bbbb0001en01','bbbb0001-2222-4222-8222-bbbbbbbb0001',NULL,5,'Reliable, stable performance for contamination-sensitive process water.',1,'Plant Engineering'),
  ('33330001-bbbb-4bbb-8bbb-bbbb0001en02','bbbb0001-2222-4222-8222-bbbbbbbb0001',NULL,4,'Wide model range; efficient when properly selected.',1,'Operations');

-- OPTIONS (EN) — ID bazlı reset
DELETE FROM product_options
WHERE id = '44440001-bbbb-4bbb-8bbb-bbbb0001en01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44440001-bbbb-4bbb-8bbb-bbbb0001en01','bbbb0001-2222-4222-8222-bbbbbbbb0001','Model', JSON_ARRAY(
    'CC CTP-3C/3','CC CTP-3C/4','CC CTP-3C/5',
    'CC CTP-4C/4','CC CTP-4C/5',
    'CC CTP-5C/4','CC CTP-5C/5','CC CTP-5C/6',
    'CC CTP-5.5C/5','CC CTP-5.5C/6',
    'CC CTP-6C/5','CC CTP-6C/6',
    'CC DCTP-5C/4','CC DCTP-5C/5','CC DCTP-5C/6',
    'CC DCTP-5.5C/5','CC DCTP-5.5C/6',
    'CC DCTP-6C/5','CC DCTP-6C/6'
  ));

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
