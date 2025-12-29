-- =============================================================
-- 049-94_site_settings_ui_blog.sql  [FINAL]
-- ui_blog (Blog list + blog detail UI strings)
--  - Key: ui_blog
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Upsert: ON DUPLICATE KEY UPDATE
--  - NO ALTER / NO PATCH
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
VALUES
(
  UUID(),
  'ui_blog',
  'tr',
  CAST(
    JSON_OBJECT(
      -- Generic / states
      'ui_blog_loading',                 'Blog yükleniyor...',
      'ui_blog_not_found',               'Blog yazısı bulunamadı.',
      'ui_blog_untitled',                'Başlıksız içerik',
      'ui_blog_empty',                   'Şu anda görüntülenecek blog yazısı bulunmuyor.',

      -- Navigation
      'ui_blog_back_to_list',            'Tüm blog yazılarına dön',

      -- Page titles
      'ui_blog_page_title',              'Blog',
      'ui_blog_detail_page_title',       'Blog Detayı',

      -- Section header (BlogPageContent)
      'ui_blog_subprefix',               'Ensotek',
      'ui_blog_sublabel',                'Blog',
      'ui_blog_page_intro',
        'Ensotek blog yazıları: teknik içerikler, duyurular ve güncellemeler.',

      -- Buttons / labels
      'ui_blog_read_more',               'Devamını oku',
      'ui_blog_read_more_aria',          'blog detayını görüntüle',
      'ui_blog_share_title',             'Paylaş',
      'ui_blog_write_comment',           'Yorum yaz',
      'ui_blog_tags',                    'Etiketler',

      -- Sidebar
      'ui_blog_other_blogs_title',       'Diğer yazılar',
      'ui_blog_sidebar_contact_title',   'İletişim Bilgileri',

      -- Legacy fallback sidebar items (optional; keep empty if you don’t want)
      'ui_blog_sidebar_item_1',          '',
      'ui_blog_sidebar_item_2',          '',
      'ui_blog_sidebar_item_3',          '',

      -- JSON-based sidebar items fallback (stringified JSON supported by your parser)
      -- Example formats accepted:
      --   ["item1","item2"]  OR  {"items":["item1","item2"]}
      'ui_blog_sidebar_items',
        JSON_ARRAY(
          'Teknik Bilgiler',
          'Ürün Notları',
          'Bakım Önerileri',
          'Verimlilik',
          'Saha Uygulamaları'
        ),

      -- Accordion items (BlogDetailsArea) — JSON array of {title, body}
      -- Example formats accepted:
      --   [{"title":"...","body":"..."}] OR {"items":[...]}
      'ui_blog_accordion_items',
        JSON_ARRAY(
          JSON_OBJECT(
            'title', 'Bu içerik ne anlatıyor?',
            'body',  'Bu yazıda ele alınan konunun kapsamını, özetini ve pratikte nasıl uygulanacağını bulabilirsiniz.'
          ),
          JSON_OBJECT(
            'title', 'Uygulamada nelere dikkat edilmeli?',
            'body',  'Kurulum/uygulama sırasında güvenlik, bakım ve performans açısından dikkat edilmesi gereken temel noktaları inceleyin.'
          ),
          JSON_OBJECT(
            'title', 'Sık sorulan sorular',
            'body',  'Bu konu hakkında en çok merak edilen soruların kısa yanıtlarını burada bulabilirsiniz.'
          )
        ),

      -- SEO (blog index page uses these)
      'ui_blog_meta_title',              'Blog | Ensotek',
      'ui_blog_meta_description',
        'Ensotek blog: teknik içerikler, ürün duyuruları, bakım önerileri ve sektör güncellemeleri.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_blog',
  'en',
  CAST(
    JSON_OBJECT(
      -- Generic / states
      'ui_blog_loading',                 'Loading blog...',
      'ui_blog_not_found',               'Blog post not found.',
      'ui_blog_untitled',                'Untitled post',
      'ui_blog_empty',                   'There are no blog posts to display at the moment.',

      -- Navigation
      'ui_blog_back_to_list',            'Back to all blog posts',

      -- Page titles
      'ui_blog_page_title',              'Blog',
      'ui_blog_detail_page_title',       'Blog Detail',

      -- Section header (BlogPageContent)
      'ui_blog_subprefix',               'Ensotek',
      'ui_blog_sublabel',                'Blog',
      'ui_blog_page_intro',
        'Ensotek blog posts, technical content, announcements and updates.',

      -- Buttons / labels
      'ui_blog_read_more',               'Read more',
      'ui_blog_read_more_aria',          'view blog details',
      'ui_blog_share_title',             'Share',
      'ui_blog_write_comment',           'Write a review',
      'ui_blog_tags',                    'Tags',

      -- Sidebar
      'ui_blog_other_blogs_title',       'Other blogs',
      'ui_blog_sidebar_contact_title',   'Contact Info',

      -- Legacy fallback sidebar items
      'ui_blog_sidebar_item_1',          '',
      'ui_blog_sidebar_item_2',          '',
      'ui_blog_sidebar_item_3',          '',

      -- JSON-based sidebar items fallback
      'ui_blog_sidebar_items',
        JSON_ARRAY(
          'Technical Notes',
          'Product Updates',
          'Maintenance Tips',
          'Efficiency',
          'Field Practices'
        ),

      -- Accordion items (detail)
      'ui_blog_accordion_items',
        JSON_ARRAY(
          JSON_OBJECT(
            'title', 'What is this post about?',
            'body',  'You can find the scope, a short summary, and how to apply the topic in practice.'
          ),
          JSON_OBJECT(
            'title', 'What to consider in implementation?',
            'body',  'Review the key points regarding safety, maintenance and performance during installation and operation.'
          ),
          JSON_OBJECT(
            'title', 'Frequently asked questions',
            'body',  'Short answers to the most common questions about this topic.'
          )
        ),

      -- SEO
      'ui_blog_meta_title',              'Blog | Ensotek',
      'ui_blog_meta_description',
        'Ensotek blog: technical content, product announcements, maintenance recommendations and industry updates.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_blog',
  'de',
  CAST(
    JSON_OBJECT(
      -- Generic / states
      'ui_blog_loading',                 'Blog wird geladen...',
      'ui_blog_not_found',               'Blogbeitrag nicht gefunden.',
      'ui_blog_untitled',                'Ohne Titel',
      'ui_blog_empty',                   'Derzeit sind keine Blogbeiträge verfügbar.',

      -- Navigation
      'ui_blog_back_to_list',            'Zurück zu allen Blogbeiträgen',

      -- Page titles
      'ui_blog_page_title',              'Blog',
      'ui_blog_detail_page_title',       'Blog-Details',

      -- Section header
      'ui_blog_subprefix',               'Ensotek',
      'ui_blog_sublabel',                'Blog',
      'ui_blog_page_intro',
        'Ensotek Blogbeiträge: technische Inhalte, Ankündigungen und Updates.',

      -- Buttons / labels
      'ui_blog_read_more',               'Mehr lesen',
      'ui_blog_read_more_aria',          'Blogdetails anzeigen',
      'ui_blog_share_title',             'Teilen',
      'ui_blog_write_comment',           'Bewertung schreiben',
      'ui_blog_tags',                    'Tags',

      -- Sidebar
      'ui_blog_other_blogs_title',       'Weitere Beiträge',
      'ui_blog_sidebar_contact_title',   'Kontaktinformationen',

      -- Legacy fallback sidebar items
      'ui_blog_sidebar_item_1',          '',
      'ui_blog_sidebar_item_2',          '',
      'ui_blog_sidebar_item_3',          '',

      -- JSON-based sidebar items fallback
      'ui_blog_sidebar_items',
        JSON_ARRAY(
          'Technische Hinweise',
          'Produkt-Updates',
          'Wartungstipps',
          'Effizienz',
          'Praxisbeispiele'
        ),

      -- Accordion items
      'ui_blog_accordion_items',
        JSON_ARRAY(
          JSON_OBJECT(
            'title', 'Worum geht es in diesem Beitrag?',
            'body',  'Hier finden Sie den Umfang, eine kurze Zusammenfassung und die praktische Anwendung des Themas.'
          ),
          JSON_OBJECT(
            'title', 'Worauf sollte man bei der Umsetzung achten?',
            'body',  'Wichtige Punkte zu Sicherheit, Wartung und Leistung bei Installation und Betrieb.'
          ),
          JSON_OBJECT(
            'title', 'Häufig gestellte Fragen',
            'body',  'Kurze Antworten auf die häufigsten Fragen zu diesem Thema.'
          )
        ),

      -- SEO
      'ui_blog_meta_title',              'Blog | Ensotek',
      'ui_blog_meta_description',
        'Ensotek Blog: technische Inhalte, Produktankündigungen, Wartungsempfehlungen und Branchen-Updates.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

COMMIT;
