-- =============================================================
-- 014_products_seed.sql
-- Örnek ürünler + specs + faqs + reviews + stock (tr + en)
--  - products: TR + EN
--  - specs/faqs/reviews/options/stock: şimdilik sadece TR ürünlere bağlı
-- =============================================================

START TRANSACTION;

-- =========================
-- PRODUCTS – ÖRNEK KAYITLAR
-- =========================

INSERT INTO products (
  id,
  locale,
  title,
  slug,
  price,
  description,
  category_id,
  sub_category_id,
  image_url,
  storage_asset_id,
  alt,
  images,
  storage_image_ids,
  is_active,
  is_featured,
  tags,
  specifications,
  product_code,
  stock_quantity,
  rating,
  review_count,
  meta_title,
  meta_description
)
VALUES
  -- ÜRÜN 1 TR: Modern Mermer Mezar Modeli
  (
    'bbbb0001-2222-4222-8222-bbbbbbbb0001',
    'tr',
    'Modern Mermer Mezar Modeli',
    'modern-mermer-mezar-modeli',
    15000.00,
    'Modern çizgilere sahip, dayanıklı mermerden üretilmiş mezar modeli. İstanbul ve çevresi için özel ölçülendirme ve montaj dahildir.',
    'aaaa0001-1111-4111-8111-aaaaaaaa0001', -- MEZAR MODELLERİ
    NULL,
    'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    'Modern mermer mezar modeli',
    JSON_ARRAY(
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80',
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80',
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80'
    ),
    JSON_ARRAY(), -- storage_image_ids (şimdilik boş)
    1,
    1,
    JSON_ARRAY('mezar', 'mermer', 'modern', 'istanbul'),
    JSON_OBJECT(
      'dimensions', '100 x 200 cm',
      'weight', '450 kg',
      'thickness', '8 cm',
      'surfaceFinish', 'Parlak cilalı mermer',
      'warranty', '2 yıl işçilik garantisi',
      'installationTime', '3-5 iş günü'
    ),
    'MM-001',
    5,
    4.90,
    2,
    'Modern Mermer Mezar Modeli | Mezarisim',
    'Modern çizgilerle tasarlanmış, dayanıklı mermer mezar modeli. İstanbul içi montaj ve ölçülendirme dahildir.'
  ),

  -- ÜRÜN 1 EN: Modern Marble Grave Model
  (
    'bbbb0101-2222-4222-8222-bbbbbbbb0101',
    'en',
    'Modern Marble Grave Model',
    'modern-marble-grave-model',
    15000.00,
    'A durable marble grave model with modern lines. Includes custom sizing and installation for Istanbul and surrounding areas.',
    'aaaa0001-1111-4111-8111-aaaaaaaa0001',
    NULL,
    'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    'Modern marble grave model',
    JSON_ARRAY(
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80',
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80',
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80'
    ),
    JSON_ARRAY(),
    1,
    1,
    JSON_ARRAY('grave', 'marble', 'modern', 'istanbul'),
    JSON_OBJECT(
      'dimensions', '100 x 200 cm',
      'weight', '450 kg',
      'thickness', '8 cm',
      'surfaceFinish', 'Polished marble finish',
      'warranty', '2-year workmanship warranty',
      'installationTime', '3–5 business days'
    ),
    'MM-001',
    5,
    4.90,
    2,
    'Modern Marble Grave Model | Mezarisim',
    'A modern, durable marble grave model. Installation and custom sizing are included within Istanbul.'
  ),

  -- ÜRÜN 2 TR: Granit Mezar Modeli
  (
    'bbbb0002-2222-4222-8222-bbbbbbbb0002',
    'tr',
    'Granit Mezar Modeli',
    'granit-mezar-modeli',
    18500.00,
    'Uzun ömürlü ve çizilmeye dayanıklı granit malzemeden üretilmiş mezar modeli. Farklı renk ve desen seçenekleri mevcuttur.',
    'aaaa0001-1111-4111-8111-aaaaaaaa0001', -- MEZAR MODELLERİ
    NULL,
    'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    'Granit mezar modeli',
    JSON_ARRAY(
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80',
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80'
    ),
    JSON_ARRAY(),
    1,
    0,
    JSON_ARRAY('mezar', 'granit', 'dayanikli'),
    JSON_OBJECT(
      'dimensions', '90 x 190 cm',
      'weight', '520 kg',
      'thickness', '10 cm',
      'surfaceFinish', 'Mat / Yarı parlak granit',
      'warranty', '5 yıl malzeme garantisi',
      'installationTime', '4-7 iş günü'
    ),
    'GM-001',
    3,
    4.75,
    1,
    'Granit Mezar Modeli | Mezarisim',
    'Uzun ömürlü ve çizilmeye dayanıklı granit mezar modeli. Farklı renk ve desen seçenekleriyle mezarlığınıza değer katar.'
  ),

  -- ÜRÜN 2 EN: Granite Grave Model
  (
    'bbbb0102-2222-4222-8222-bbbbbbbb0102',
    'en',
    'Granite Grave Model',
    'granite-grave-model',
    18500.00,
    'A long-lasting, scratch-resistant grave model made of high-quality granite. Available in different colors and patterns.',
    'aaaa0001-1111-4111-8111-aaaaaaaa0001',
    NULL,
    'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80',
    NULL,
    'Granite grave model',
    JSON_ARRAY(
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80',
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=600&q=80'
    ),
    JSON_ARRAY(),
    1,
    0,
    JSON_ARRAY('grave', 'granite', 'durable'),
    JSON_OBJECT(
      'dimensions', '90 x 190 cm',
      'weight', '520 kg',
      'thickness', '10 cm',
      'surfaceFinish', 'Mat / semi-gloss granite',
      'warranty', '5-year material warranty',
      'installationTime', '4–7 business days'
    ),
    'GM-001',
    3,
    4.75,
    1,
    'Granite Grave Model | Mezarisim',
    'A durable granite grave model with various color and pattern options to add value to your cemetery.'
  )

ON DUPLICATE KEY UPDATE
  locale           = VALUES(locale),
  title            = VALUES(title),
  price            = VALUES(price),
  description      = VALUES(description),
  category_id      = VALUES(category_id),
  sub_category_id  = VALUES(sub_category_id),
  image_url        = VALUES(image_url),
  storage_asset_id = VALUES(storage_asset_id),
  alt              = VALUES(alt),
  images           = VALUES(images),
  storage_image_ids= VALUES(storage_image_ids),
  is_active        = VALUES(is_active),
  is_featured      = VALUES(is_featured),
  tags             = VALUES(tags),
  specifications   = VALUES(specifications),
  product_code     = VALUES(product_code),
  stock_quantity   = VALUES(stock_quantity),
  rating           = VALUES(rating),
  review_count     = VALUES(review_count),
  meta_title       = VALUES(meta_title),
  meta_description = VALUES(meta_description);


-- =========================
-- PRODUCT SPECS – ÖRNEK (ŞİMDİLİK SADECE TR ÜRÜNLER)
-- =========================

INSERT INTO product_specs (
  id,
  product_id,
  name,
  value,
  category,
  order_num,
  created_at,
  updated_at
)
VALUES
  -- TR specs – product 1
  (
    'cccc0001-3333-4333-8333-cccccccc0001',
    'bbbb0001-2222-4222-8222-bbbbbbbb0001',
    'Malzeme',
    '1. sınıf beyaz mermer',
    'material',
    10,
    NOW(3),
    NOW(3)
  ),
  (
    'cccc0002-3333-4333-8333-cccccccc0002',
    'bbbb0001-2222-4222-8222-bbbbbbbb0001',
    'Baş taşı yüksekliği',
    '90 cm',
    'physical',
    20,
    NOW(3),
    NOW(3)
  ),
  -- TR specs – product 2
  (
    'cccc0003-3333-4333-8333-cccccccc0003',
    'bbbb0002-2222-4222-8222-bbbbbbbb0002',
    'Malzeme',
    'Siyah granit',
    'material',
    10,
    NOW(3),
    NOW(3)
  )

ON DUPLICATE KEY UPDATE
  name      = VALUES(name),
  value     = VALUES(value),
  category  = VALUES(category),
  order_num = VALUES(order_num),
  updated_at= VALUES(updated_at);


-- =========================
-- PRODUCT FAQS – ÖRNEK (SADECE TR ÜRÜNLER)
-- =========================

INSERT INTO product_faqs (
  id,
  product_id,
  question,
  answer,
  display_order,
  is_active,
  created_at,
  updated_at
)
VALUES
  -- TR faqs – product 1
  (
    'dddd0001-4444-4444-8444-dddddddd0001',
    'bbbb0001-2222-4222-8222-bbbbbbbb0001',
    'Montaj süresine neler dahildir?',
    'Mezar alanının hazırlanması, mezarın kurulumu ve son temizlik işlemleri montaj süresine dahildir.',
    10,
    1,
    NOW(3),
    NOW(3)
  ),
  (
    'dddd0002-4444-4444-8444-dddddddd0002',
    'bbbb0001-2222-4222-8222-bbbbbbbb0001',
    'Ödeme koşulları nelerdir?',
    'Sözleşme sırasında kapora, montaj tamamlandıktan sonra kalan ödeme alınmaktadır.',
    20,
    1,
    NOW(3),
    NOW(3)
  ),
  -- TR faqs – product 2
  (
    'dddd0003-4444-4444-8444-dddddddd0003',
    'bbbb0002-2222-4222-8222-bbbbbbbb0002',
    'Granit renk seçenekleri mevcut mu?',
    'Evet, siyah, gri ve açık tonlarda granit seçeneklerimiz mevcuttur.',
    10,
    1,
    NOW(3),
    NOW(3)
  )

ON DUPLICATE KEY UPDATE
  question      = VALUES(question),
  answer        = VALUES(answer),
  display_order = VALUES(display_order),
  is_active     = VALUES(is_active),
  updated_at    = VALUES(updated_at);


-- =========================
-- PRODUCT REVIEWS – ÖRNEK (SADECE TR ÜRÜNLER)
-- =========================

INSERT INTO product_reviews (
  id,
  product_id,
  user_id,
  rating,
  comment,
  is_active,
  customer_name,
  review_date,
  created_at,
  updated_at
)
VALUES
  (
    'eeee0001-5555-4555-8555-eeeeeeee0001',
    'bbbb0001-2222-4222-8222-bbbbbbbb0001',
    NULL,
    5,
    'İşçilik ve ilgi harikaydı, mezar görseldeki gibi çok şık duruyor.',
    1,
    'Ahmet Y.',
    '2025-01-10 10:00:00.000',
    '2025-01-10 10:00:00.000',
    '2025-01-10 10:00:00.000'
  ),
  (
    'eeee0002-5555-4555-8555-eeeeeeee0002',
    'bbbb0001-2222-4222-8222-bbbbbbbb0001',
    NULL,
    4,
    'Teslimat süresi 1 gün gecikti ama sonuçtan memnun kaldık.',
    1,
    'Mehmet K.',
    '2025-01-15 14:30:00.000',
    '2025-01-15 14:30:00.000',
    '2025-01-15 14:30:00.000'
  ),
  (
    'eeee0003-5555-4555-8555-eeeeeeee0003',
    'bbbb0002-2222-4222-8222-bbbbbbbb0002',
    NULL,
    5,
    'Granit kalitesi gerçekten çok iyi, uzun yıllar sorunsuz gidecek gibi duruyor.',
    1,
    'Selma D.',
    '2025-01-20 11:15:00.000',
    '2025-01-20 11:15:00.000',
    '2025-01-20 11:15:00.000'
  )

ON DUPLICATE KEY UPDATE
  rating        = VALUES(rating),
  comment       = VALUES(comment),
  is_active     = VALUES(is_active),
  customer_name = VALUES(customer_name),
  review_date   = VALUES(review_date),
  updated_at    = VALUES(updated_at);


-- =========================
-- PRODUCT OPTIONS – ÖRNEK (SADECE TR ÜRÜNLER)
-- =========================

INSERT INTO product_options (
  id,
  product_id,
  option_name,
  option_values,
  created_at,
  updated_at
)
VALUES
  (
    'ffff0001-6666-4666-8666-ffffffff0001',
    'bbbb0001-2222-4222-8222-bbbbbbbb0001',
    'Baş taşı modeli',
    JSON_ARRAY('Klasik', 'Modern', 'Yuvarlak'),
    NOW(3),
    NOW(3)
  ),
  (
    'ffff0002-6666-4666-8666-ffffffff0002',
    'bbbb0002-2222-4222-8222-bbbbbbbb0002',
    'Granit rengi',
    JSON_ARRAY('Siyah', 'Gri', 'Açık gri'),
    NOW(3),
    NOW(3)
  )

ON DUPLICATE KEY UPDATE
  option_name   = VALUES(option_name),
  option_values = VALUES(option_values),
  updated_at    = VALUES(updated_at);


-- =========================
-- PRODUCT STOCK – ÖRNEK (SADECE TR ÜRÜNLER)
-- =========================

INSERT INTO product_stock (
  id,
  product_id,
  stock_content,
  is_used,
  used_at,
  created_at,
  order_item_id
)
VALUES
  (
    'gggg0001-7777-4777-8777-gggggggg0001',
    'bbbb0001-2222-4222-8222-bbbbbbbb0001',
    'MM-001-STOCK-001',
    0,
    NULL,
    NOW(3),
    NULL
  ),
  (
    'gggg0002-7777-4777-8777-gggggggg0002',
    'bbbb0001-2222-4222-8222-bbbbbbbb0001',
    'MM-001-STOCK-002',
    0,
    NULL,
    NOW(3),
    NULL
  ),
  (
    'gggg0003-7777-4777-8777-gggggggg0003',
    'bbbb0002-2222-4222-8222-bbbbbbbb0002',
    'GM-001-STOCK-001',
    0,
    NULL,
    NOW(3),
    NULL
  )

ON DUPLICATE KEY UPDATE
  stock_content = VALUES(stock_content),
  is_used       = VALUES(is_used),
  used_at       = VALUES(used_at);

COMMIT;
