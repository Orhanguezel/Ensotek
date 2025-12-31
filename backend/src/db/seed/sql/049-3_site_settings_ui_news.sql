-- =============================================================
-- 049-3_site_settings_ui_news.sql
-- Ensotek – UI News (site_settings.ui_news)
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Upsert: ON DUPLICATE KEY UPDATE
--
-- IMPORTANT:
--  - JSON_OBJECT içinde SQL yorumları (--) veya (/* */) kullanmayın.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_news',
  'tr',
  CAST(
    JSON_OBJECT(
      'ui_news_page_title',               'Haberler',
      'ui_news_detail_page_title',        'Haber Detayı',

      'ui_news_subprefix',                'Ensotek',
      'ui_news_sublabel',                 'Haberler',
      'ui_news_title_prefix',             'Güncel',
      'ui_news_title_mark',               'Haberler',

      'ui_news_page_intro',               'Ensotek ile ilgili güncel haberler, duyurular ve basın paylaşımlarımız.',
      'ui_news_read_more',                'Devamını oku',
      'ui_news_read_more_aria',           'haberin detayını görüntüle',
      'ui_news_view_all',                 'Tüm Haberler',

      'ui_news_untitled',                 'Başlıksız haber',
      'ui_news_empty',                    'Şu anda görüntülenecek haber bulunmamaktadır.',

      'ui_news_load_more',                'Daha fazla yükle',

      'ui_news_back_to_list',             'Tüm haberlere dön',
      'ui_news_loading',                  'Haber yükleniyor...',
      'ui_news_not_found',                'Haber bulunamadı.',

      'ui_news_more_title',               'Diğer Haberler',
      'ui_news_more_read_more',           'Devamını oku',
      'ui_news_more_image_alt',           'haber görseli',
      'ui_news_view_news',                'Habere git',

      'ui_news_gallery_title',            'Galeri',
      'ui_news_share_title',              'Paylaş',
      'ui_news_sidebar_contact_title',    'İletişim Bilgileri',

      'ui_news_reviews_title',            'Yorumlar',
      'ui_news_write_comment',            'Yorum Gönder',

      'ui_news_meta_title',               'Haberler',
      'ui_news_meta_description',         'Ensotek ile ilgili haberler, duyurular ve basın paylaşımları.',
      'ui_news_filter_all',              'Tümü',
      'ui_news_other_title',               'Diğer Haberler'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),

  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_news',
  'en',
  CAST(
    JSON_OBJECT(
      'ui_news_page_title',               'News',
      'ui_news_detail_page_title',        'News Detail',

      'ui_news_subprefix',                'Ensotek',
      'ui_news_sublabel',                 'News',
      'ui_news_title_prefix',             'Latest',
      'ui_news_title_mark',               'News',

      'ui_news_page_intro',               'Latest news, announcements and press releases about Ensotek.',
      'ui_news_read_more',                'Read more',
      'ui_news_read_more_aria',           'view news details',
      'ui_news_view_all',                 'All news',

      'ui_news_untitled',                 'Untitled news',
      'ui_news_empty',                    'There are no news items to display at the moment.',

      'ui_news_load_more',                'Load more',

      'ui_news_back_to_list',             'Back to all news',
      'ui_news_loading',                  'Loading news...',
      'ui_news_not_found',                'News not found.',

      'ui_news_more_title',               'More News',
      'ui_news_more_read_more',           'Read more',
      'ui_news_more_image_alt',           'news image',
      'ui_news_view_news',                'View news',

      'ui_news_gallery_title',            'Gallery',
      'ui_news_share_title',              'Share',
      'ui_news_sidebar_contact_title',    'Contact Info',

      'ui_news_reviews_title',            'Reviews',
      'ui_news_write_comment',            'Write a review',

      'ui_news_meta_title',               'News',
      'ui_news_meta_description',         'News, announcements and press releases about Ensotek.',
      'ui_news_filter_all',              'All',
      'ui_news_other_title',               'More News'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_news',
  'de',
  CAST(
    JSON_OBJECT(
      'ui_news_page_title',               'Neuigkeiten',
      'ui_news_detail_page_title',        'News-Detail',

      'ui_news_subprefix',                'Ensotek',
      'ui_news_sublabel',                 'Neuigkeiten',
      'ui_news_title_prefix',             'Aktuelle',
      'ui_news_title_mark',               'Neuigkeiten',

      'ui_news_page_intro',               'Aktuelle Neuigkeiten, Ankündigungen und Pressemitteilungen über Ensotek.',
      'ui_news_read_more',                'Weiterlesen',
      'ui_news_read_more_aria',           'News-Details anzeigen',
      'ui_news_view_all',                 'Alle News',

      'ui_news_untitled',                 'News ohne Titel',
      'ui_news_empty',                    'Derzeit sind keine News verfügbar.',

      'ui_news_load_more',                'Mehr laden',

      'ui_news_back_to_list',             'Zurück zu allen News',
      'ui_news_loading',                  'News werden geladen...',
      'ui_news_not_found',                'News nicht gefunden.',

      'ui_news_more_title',               'Weitere News',
      'ui_news_more_read_more',           'Weiterlesen',
      'ui_news_more_image_alt',           'News-Bild',
      'ui_news_view_news',                'Zur News',

      'ui_news_gallery_title',            'Galerie',
      'ui_news_share_title',              'Teilen',
      'ui_news_sidebar_contact_title',    'Kontaktinfo',

      'ui_news_reviews_title',            'Bewertungen',
      'ui_news_write_comment',            'Bewertung schreiben',

      'ui_news_meta_title',               'Neuigkeiten',
      'ui_news_meta_description',         'Neuigkeiten, Ankündigungen und Pressemitteilungen über Ensotek.',
      'ui_news_filter_all',              'Alle',
      'ui_news_other_title',               'Weitere News'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);
