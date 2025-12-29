-- =============================================================
-- 049-4_site_settings_ui_product.sql
-- Ensotek – UI Products (site_settings.ui_products) [FINAL]
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Extendable: clone from tr as bootstrap (collation-safe)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_products',
  'tr',
  CAST(
    JSON_OBJECT(
      -- Home / Landing (Product.tsx)
      'ui_products_kicker_prefix',              'Ensotek',
      'ui_products_kicker_label',               'Ürünlerimiz',
      'ui_products_section_title',              'Ürünlerimiz',
      'ui_products_prev',                       'Önceki',
      'ui_products_next',                       'Sonraki',
      'ui_products_read_more',                  'Detayları görüntüle',
      'ui_products_read_more_aria',             'ürün detayını görüntüle',
      'ui_products_view_all',                   'Tüm Ürünler',
      'ui_products_empty',                      'Şu anda görüntülenecek ürün bulunmamaktadır.',

      -- Legacy/optional split title (eski kullanım kalabilir)
      'ui_products_title_prefix',               'Su Soğutma',
      'ui_products_title_mark',                 'Kuleleri',
      'ui_products_price_label',                'Başlangıç fiyatı',

      -- /product (ProductPageContent + ProductPage)
      'ui_products_page_title',                 'Ürünlerimiz',
      'ui_products_page_intro',                 'Endüstriyel su soğutma kuleleri ve tamamlayıcı ekipmanlara ait seçili ürünler.',

      -- SEO (Products list)
      'ui_products_meta_title',                 'Ürünlerimiz',
      'ui_products_meta_description',           'Ensotek ürünleri: endüstriyel su soğutma kuleleri ve tamamlayıcı ekipmanlar. Teknik detaylar ve ürün seçenekleri.',

      -- /product/[slug] page + detail (ProductDetail + ProductDetailPage)
      'ui_products_detail_page_title',          'Ürün',
      'ui_products_back_to_list',               'Tüm ürünlere dön',
      'ui_products_loading',                    'Ürün yükleniyor...',
      'ui_products_not_found',                  'Ürün bulunamadı.',
      'ui_products_specs_title',                'Teknik Özellikler',
      'ui_products_tags_title',                 'Etiketler',
      'ui_products_faqs_title',                 'Sık Sorulan Sorular',
      'ui_products_reviews_title',              'Müşteri Yorumları',
      'ui_products_faqs_empty',                 'Bu ürün için kayıtlı SSS bulunmamaktadır.',
      'ui_products_reviews_empty',              'Bu ürün için henüz yorum yapılmamıştır.',
      'ui_products_request_quote',              'Teklif isteyiniz',

      -- Detail SEO overrides (ProductDetailPage uses *_detail_meta_description)
      'ui_products_detail_meta_title',          'Ürün Detayı',
      'ui_products_detail_meta_description',    'Ürün detayları, teknik özellikler ve teklif talebi için inceleyiniz.',

      -- More carousel (ProductMore.tsx)
      'ui_products_more_title',                 'Diğer Ürünler',
      'ui_products_go_to_item',                 'Ürünü görüntüle',

      -- Reviews block (ProductReviewsBlock i18n)
      'ui_product_reviews_word',                'yorum',
      'ui_product_review_customer_fallback',    'Müşteri',
      'ui_product_review_prev_aria',            'Önceki yorum',
      'ui_product_review_next_aria',            'Sonraki yorum',
      'ui_product_review_summary_tpl',          '{avg} / 5 · {count} {word}'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_products',
  'en',
  CAST(
    JSON_OBJECT(
      -- Home / Landing (Product.tsx)
      'ui_products_kicker_prefix',              'Ensotek',
      'ui_products_kicker_label',               'Our Products',
      'ui_products_section_title',              'Our Products',
      'ui_products_prev',                       'Previous',
      'ui_products_next',                       'Next',
      'ui_products_read_more',                  'View details',
      'ui_products_read_more_aria',             'view product details',
      'ui_products_view_all',                   'All products',
      'ui_products_empty',                      'There are no products to display at the moment.',

      -- Legacy/optional split title
      'ui_products_title_prefix',               'Cooling',
      'ui_products_title_mark',                 'Towers',
      'ui_products_price_label',                'Starting from',

      -- /product (ProductPageContent + ProductPage)
      'ui_products_page_title',                 'Products',
      'ui_products_page_intro',                 'Selected products for industrial cooling towers and related equipment.',

      -- SEO (Products list)
      'ui_products_meta_title',                 'Products',
      'ui_products_meta_description',           'Ensotek products: industrial cooling towers and related equipment. Explore technical details and product options.',

      -- /product/[slug] page + detail
      'ui_products_detail_page_title',          'Product',
      'ui_products_back_to_list',               'Back to all products',
      'ui_products_loading',                    'Loading product...',
      'ui_products_not_found',                  'Product not found.',
      'ui_products_specs_title',                'Technical Specifications',
      'ui_products_tags_title',                 'Tags',
      'ui_products_faqs_title',                 'Frequently Asked Questions',
      'ui_products_reviews_title',              'Customer Reviews',
      'ui_products_faqs_empty',                 'There are no FAQs for this product yet.',
      'ui_products_reviews_empty',              'There are no reviews for this product yet.',
      'ui_products_request_quote',              'Request a quote',

      -- Detail SEO overrides
      'ui_products_detail_meta_title',          'Product Detail',
      'ui_products_detail_meta_description',    'View product details, technical specifications, and request a quote.',

      -- More carousel
      'ui_products_more_title',                 'More Products',
      'ui_products_go_to_item',                 'View product',

      -- Reviews block
      'ui_product_reviews_word',                'reviews',
      'ui_product_review_customer_fallback',    'Customer',
      'ui_product_review_prev_aria',            'Previous review',
      'ui_product_review_next_aria',            'Next review',
      'ui_product_review_summary_tpl',          '{avg} / 5 · {count} {word}'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_products',
  'de',
  CAST(
    JSON_OBJECT(
      -- Home / Landing (Product.tsx)
      'ui_products_kicker_prefix',              'Ensotek',
      'ui_products_kicker_label',               'Unsere Produkte',
      'ui_products_section_title',              'Unsere Produkte',
      'ui_products_prev',                       'Zurück',
      'ui_products_next',                       'Weiter',
      'ui_products_read_more',                  'Details anzeigen',
      'ui_products_read_more_aria',             'Produktdetails anzeigen',
      'ui_products_view_all',                   'Alle Produkte',
      'ui_products_empty',                      'Derzeit sind keine Produkte verfügbar.',

      -- Legacy/optional split title
      'ui_products_title_prefix',               'Kühl',
      'ui_products_title_mark',                 'Türme',
      'ui_products_price_label',                'Ab',

      -- /product
      'ui_products_page_title',                 'Produkte',
      'ui_products_page_intro',                 'Ausgewählte Produkte für industrielle Kühltürme und zugehörige Ausrüstung.',

      -- SEO (Products list)
      'ui_products_meta_title',                 'Produkte',
      'ui_products_meta_description',           'Ensotek Produkte: industrielle Kühltürme und zugehörige Ausrüstung. Technische Details und Produktoptionen entdecken.',

      -- /product/[slug] page + detail
      'ui_products_detail_page_title',          'Produkt',
      'ui_products_back_to_list',               'Zurück zu allen Produkten',
      'ui_products_loading',                    'Produkt wird geladen...',
      'ui_products_not_found',                  'Produkt nicht gefunden.',
      'ui_products_specs_title',                'Technische Spezifikationen',
      'ui_products_tags_title',                 'Tags',
      'ui_products_faqs_title',                 'Häufig gestellte Fragen',
      'ui_products_reviews_title',              'Kundenbewertungen',
      'ui_products_faqs_empty',                 'Für dieses Produkt sind noch keine FAQs vorhanden.',
      'ui_products_reviews_empty',              'Für dieses Produkt gibt es noch keine Bewertungen.',
      'ui_products_request_quote',              'Angebot anfordern',

      -- Detail SEO overrides
      'ui_products_detail_meta_title',          'Produktdetails',
      'ui_products_detail_meta_description',    'Produktdetails, technische Spezifikationen ansehen und ein Angebot anfordern.',

      -- More carousel
      'ui_products_more_title',                 'Weitere Produkte',
      'ui_products_go_to_item',                 'Produkt ansehen',

      -- Reviews block
      'ui_product_reviews_word',                'Bewertungen',
      'ui_product_review_customer_fallback',    'Kunde',
      'ui_product_review_prev_aria',            'Vorherige Bewertung',
      'ui_product_review_next_aria',            'Nächste Bewertung',
      'ui_product_review_summary_tpl',          '{avg} / 5 · {count} {word}'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);
