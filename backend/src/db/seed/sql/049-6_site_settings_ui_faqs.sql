-- =============================================================
-- 049-6_site_settings_ui_faqs.sql
-- Ensotek – UI FAQ / SSS (site_settings.ui_faqs)
--   - Home FAQ section (Faq.tsx)
--   - Full FAQ page (FaqsPageContent.tsx + pages/faqs.tsx)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- -------------------------------------------------------------
-- TR
-- -------------------------------------------------------------
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
VALUES
(
  UUID(),
  'ui_faqs',
  'tr',
  JSON_OBJECT(
    -- HOME SECTION (src/components/containers/faq/Faq.tsx)
    'ui_faqs_subprefix',        'Ensotek',
    'ui_faqs_sublabel',         'Sıkça Sorulan Sorular',
    'ui_faqs_title_prefix',     'Müşterilerimizden gelen',
    'ui_faqs_title_mark',       'sorular',
    'ui_faqs_sample_one_q',     'Örnek soru 1 nedir?',
    'ui_faqs_sample_one_a',     'Bu bir örnek SSS içeriğidir.',
    'ui_faqs_sample_two_q',     'Örnek soru 2 nedir?',
    'ui_faqs_sample_two_a',
      'İçerik girilene kadar bu alan placeholder olarak kullanılır.',
    'ui_faqs_cover_alt',        'SSS kapak görseli',
    'ui_faqs_view_detail_aria', 'SSS detayını görüntüle',
    'ui_faqs_view_detail',      'Detayları görüntüle',
    'ui_faqs_view_all',         'Tüm soruları görüntüle',

    -- FULL PAGE HEADER (src/pages/faqs.tsx)
    'ui_faqs_page_title',       'Sıkça Sorulan Sorular',

    -- FULL PAGE CONTENT (src/components/containers/faqs/FaqsPageContent.tsx)
    'ui_faqs_kicker_prefix',    'Ensotek',
    'ui_faqs_kicker_label',     'Sıkça Sorulan Sorular',
    -- Burada prefix/mark home section ile uyumlu olsun
    'ui_faqs_empty',
      'Şu anda görüntülenecek soru bulunmamaktadır.',
    'ui_faqs_intro',
      'Ensotek ürünleri, hizmetleri ve süreçleri hakkında sıkça sorulan soruların yanıtlarını burada bulabilirsiniz.',
    'ui_faqs_untitled',         'Başlıksız soru',
    'ui_faqs_no_answer',
      'Bu soru için henüz cevap girilmemiştir.',
    'ui_faqs_footer_note',
      'Aradığınız cevabı bulamadıysanız lütfen bizimle iletişime geçin.'
  ),
  NOW(3),
  NOW(3)
),
-- -------------------------------------------------------------
-- EN
-- -------------------------------------------------------------
(
  UUID(),
  'ui_faqs',
  'en',
  JSON_OBJECT(
    -- HOME SECTION (src/components/containers/faq/Faq.tsx)
    'ui_faqs_subprefix',        'Ensotek',
    'ui_faqs_sublabel',         'Frequently Asked Questions',
    'ui_faqs_title_prefix',     'Frequently asked',
    'ui_faqs_title_mark',       'questions',
    'ui_faqs_sample_one_q',     'What is sample question 1?',
    'ui_faqs_sample_one_a',     'This is a sample FAQ entry.',
    'ui_faqs_sample_two_q',     'What is sample question 2?',
    'ui_faqs_sample_two_a',
      'Placeholder content until real FAQs are added.',
    'ui_faqs_cover_alt',        'FAQ cover image',
    'ui_faqs_view_detail_aria', 'view details',
    'ui_faqs_view_detail',      'View details',
    'ui_faqs_view_all',         'View all questions',

    -- FULL PAGE HEADER (src/pages/faqs.tsx)
    'ui_faqs_page_title',       'FAQs',

    -- FULL PAGE CONTENT (src/components/containers/faqs/FaqsPageContent.tsx)
    'ui_faqs_kicker_prefix',    'Ensotek',
    'ui_faqs_kicker_label',     'Frequently Asked Questions',
    'ui_faqs_empty',
      'There are no FAQs to display at the moment.',
    'ui_faqs_intro',
      'Find answers to the most common questions about Ensotek products, services and processes.',
    'ui_faqs_untitled',         'Untitled question',
    'ui_faqs_no_answer',
      'No answer has been provided for this question yet.',
    'ui_faqs_footer_note',
      'If you cannot find the answer you are looking for, please contact us.'
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`    = VALUES(`value`),
  updated_at = VALUES(updated_at);

-- -------------------------------------------------------------
-- TR → DE otomatik kopya (Almanca özel çeviri gelene kadar)
-- -------------------------------------------------------------
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
SELECT UUID(), s.`key`, 'de', s.`value`, NOW(3), NOW(3)
FROM site_settings s
WHERE s.locale = 'tr'
  AND s.`key` = 'ui_faqs'
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE t.`key` = s.`key`
      AND t.locale = 'de'
  );
