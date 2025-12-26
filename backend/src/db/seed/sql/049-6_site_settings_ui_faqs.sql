-- =============================================================
-- 049-6_site_settings_ui_faqs.sql
-- Ensotek – UI FAQ / SSS (site_settings.ui_faqs)
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Extendable: clone from tr as bootstrap (collation-safe)
--
-- IMPORTANT:
--  - JSON_OBJECT içinde SQL yorumları (--) veya (/* */) kullanmayın.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_faqs',
  'de',
  CAST(
    JSON_OBJECT(
      'ui_faqs_subprefix',            'Ensotek',
      'ui_faqs_sublabel',             'Sıkça Sorulan Sorular',
      'ui_faqs_title_prefix',         'Müşterilerimizden gelen',
      'ui_faqs_title_mark',           'sorular',

      'ui_faqs_sample_one_q',         'Örnek soru 1 nedir?',
      'ui_faqs_sample_one_a',         'Bu bir örnek SSS içeriğidir.',
      'ui_faqs_sample_two_q',         'Örnek soru 2 nedir?',
      'ui_faqs_sample_two_a',         'İçerik girilene kadar bu alan placeholder olarak kullanılır.',

      'ui_faqs_cover_alt',            'SSS kapak görseli',
      'ui_faqs_view_detail_aria',     'SSS detayını görüntüle',
      'ui_faqs_view_detail',          'Detayları görüntüle',
      'ui_faqs_view_all',             'Tüm soruları görüntüle',

      'ui_faqs_page_title',           'Sıkça Sorulan Sorular',
      'ui_faqs_kicker_prefix',        'Ensotek',
      'ui_faqs_kicker_label',         'Sıkça Sorulan Sorular',

      'ui_faqs_empty',                'Şu anda görüntülenecek soru bulunmamaktadır.',
      'ui_faqs_intro',                'Ensotek ürünleri, hizmetleri ve süreçleri hakkında sıkça sorulan soruların yanıtlarını burada bulabilirsiniz.',
      'ui_faqs_untitled',             'Başlıksız soru',
      'ui_faqs_no_answer',            'Bu soru için henüz cevap girilmemiştir.',
      'ui_faqs_footer_note',          'Aradığınız cevabı bulamadıysanız lütfen bizimle iletişime geçin.',

      'ui_faqs_page_title_prefix',    'Merak edilen',
      'ui_faqs_page_title_mark',      'sorular',

      'ui_faqs_page_description',     'Ensotek hakkında sıkça sorulan sorular ve cevapları.',
      'ui_faqs_meta_title',           'Sıkça Sorulan Sorular',
      'ui_faqs_meta_description',     'Ensotek hakkında sıkça sorulan sorular ve cevapları.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_faqs',
  'en',
  CAST(
    JSON_OBJECT(
      'ui_faqs_subprefix',            'Ensotek',
      'ui_faqs_sublabel',             'Frequently Asked Questions',
      'ui_faqs_title_prefix',         'Frequently asked',
      'ui_faqs_title_mark',           'questions',

      'ui_faqs_sample_one_q',         'What is sample question 1?',
      'ui_faqs_sample_one_a',         'This is a sample FAQ entry.',
      'ui_faqs_sample_two_q',         'What is sample question 2?',
      'ui_faqs_sample_two_a',         'Placeholder content until real FAQs are added.',

      'ui_faqs_cover_alt',            'FAQ cover image',
      'ui_faqs_view_detail_aria',     'view details',
      'ui_faqs_view_detail',          'View details',
      'ui_faqs_view_all',             'View all questions',

      'ui_faqs_page_title',           'FAQs',
      'ui_faqs_kicker_prefix',        'Ensotek',
      'ui_faqs_kicker_label',         'Frequently Asked Questions',

      'ui_faqs_empty',                'There are no FAQs to display at the moment.',
      'ui_faqs_intro',                'Find answers to the most common questions about Ensotek products, services and processes.',
      'ui_faqs_untitled',             'Untitled question',
      'ui_faqs_no_answer',            'No answer has been provided for this question yet.',
      'ui_faqs_footer_note',          'If you cannot find the answer you are looking for, please contact us.',

      'ui_faqs_page_title_prefix',    'Common',
      'ui_faqs_page_title_mark',      'questions',

      'ui_faqs_page_description',     'Frequently asked questions and answers about Ensotek.',
      'ui_faqs_meta_title',           'FAQs',
      'ui_faqs_meta_description',     'Frequently asked questions and answers about Ensotek.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_faqs',
  'de',
  CAST(
    JSON_OBJECT(
      'ui_faqs_subprefix',            'Ensotek',
      'ui_faqs_sublabel',             'Häufig gestellte Fragen',
      'ui_faqs_title_prefix',         'Häufig gestellte',
      'ui_faqs_title_mark',           'Fragen',

      'ui_faqs_sample_one_q',         'Was ist Beispiel-Frage 1?',
      'ui_faqs_sample_one_a',         'Dies ist ein Beispiel für einen FAQ-Eintrag.',
      'ui_faqs_sample_two_q',         'Was ist Beispiel-Frage 2?',
      'ui_faqs_sample_two_a',         'Platzhalterinhalt, bis echte FAQs hinzugefügt werden.',

      'ui_faqs_cover_alt',            'FAQ-Titelbild',
      'ui_faqs_view_detail_aria',     'Details anzeigen',
      'ui_faqs_view_detail',          'Details anzeigen',
      'ui_faqs_view_all',             'Alle Fragen anzeigen',

      'ui_faqs_page_title',           'FAQs',
      'ui_faqs_kicker_prefix',        'Ensotek',
      'ui_faqs_kicker_label',         'Häufig gestellte Fragen',

      'ui_faqs_empty',                'Derzeit sind keine FAQs verfügbar.',
      'ui_faqs_intro',                'Hier finden Sie Antworten auf die häufigsten Fragen zu Ensotek Produkten, Dienstleistungen und Prozessen.',
      'ui_faqs_untitled',             'Frage ohne Titel',
      'ui_faqs_no_answer',            'Für diese Frage wurde noch keine Antwort hinterlegt.',
      'ui_faqs_footer_note',          'Wenn Sie die gesuchte Antwort nicht finden, kontaktieren Sie uns bitte.',

      'ui_faqs_page_title_prefix',    'Häufige',
      'ui_faqs_page_title_mark',      'Fragen',

      'ui_faqs_page_description',     'Häufig gestellte Fragen und Antworten über Ensotek.',
      'ui_faqs_meta_title',           'FAQs',
      'ui_faqs_meta_description',     'Häufig gestellte Fragen und Antworten über Ensotek.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

SET @TARGET_LOCALE := 'de';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
SELECT
  UUID(),
  s.`key`,
  CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci,
  s.`value`,
  NOW(3),
  NOW(3)
FROM site_settings s
WHERE (s.locale COLLATE utf8mb4_unicode_ci) = ('de' COLLATE utf8mb4_unicode_ci)
  AND (s.`key`  COLLATE utf8mb4_unicode_ci) = ('ui_faqs' COLLATE utf8mb4_unicode_ci)
  AND (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci) <> ('de' COLLATE utf8mb4_unicode_ci)
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE (t.`key`  COLLATE utf8mb4_unicode_ci) = (s.`key` COLLATE utf8mb4_unicode_ci)
      AND (t.locale COLLATE utf8mb4_unicode_ci) = (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci)
  );
