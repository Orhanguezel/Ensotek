-- =============================================================
-- 049-3_site_settings_ui_news.sql
-- Ensotek – UI News (site_settings.ui_news)
--   - Home section, list page, detail page, more news
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
  'ui_news',
  'tr',
  JSON_OBJECT(
    -- HOME SECTION (src/components/containers/news/News.tsx)
    'ui_news_subprefix',        'Ensotek',
    'ui_news_sublabel',         'Haberler',
    'ui_news_title_prefix',     'Güncel',
    'ui_news_title_mark',       'Haberler',
    'ui_news_read_more',        'Devamını oku',
    'ui_news_read_more_aria',   'haberin detayını görüntüle',
    'ui_news_untitled',         'Başlıksız haber',
    'ui_news_sample_one',       'Örnek haber 1',
    'ui_news_sample_two',       'Örnek haber 2',
    'ui_news_view_all',         'Tüm Haberler',

    -- LIST PAGE (src/components/containers/news/NewsPageContent.tsx)
    'ui_news_page_title',       'Haberler',
    'ui_news_page_intro',
      'Ensotek ile ilgili güncel haberler, duyurular ve basın paylaşımlarımız.',
    'ui_news_empty',
      'Şu anda görüntülenecek haber bulunmamaktadır.',

    -- DETAIL PAGE (src/components/containers/news/NewsDetail.tsx)
    'ui_news_detail_page_title','Haber Detayı',
    'ui_news_back_to_list',     'Tüm haberlere dön',
    'ui_news_loading',          'Haber yükleniyor...',
    'ui_news_not_found',        'Haber bulunamadı.',

    -- MORE NEWS (src/components/containers/news/NewsMore.tsx)
    'ui_news_more_title',       'Diğer Haberler'
  ),
  NOW(3),
  NOW(3)
),
-- -------------------------------------------------------------
-- EN
-- -------------------------------------------------------------
(
  UUID(),
  'ui_news',
  'en',
  JSON_OBJECT(
    -- HOME SECTION
    'ui_news_subprefix',        'Ensotek',
    'ui_news_sublabel',         'News',
    'ui_news_title_prefix',     'Latest',
    'ui_news_title_mark',       'News',
    'ui_news_read_more',        'Read more',
    'ui_news_read_more_aria',   'view news details',
    'ui_news_untitled',         'Untitled news',
    'ui_news_sample_one',       'Sample news 1',
    'ui_news_sample_two',       'Sample news 2',
    'ui_news_view_all',         'All news',

    -- LIST PAGE
    'ui_news_page_title',       'News',
    'ui_news_page_intro',
      'Latest news, announcements and press releases about Ensotek.',
    'ui_news_empty',
      'There are no news items to display at the moment.',

    -- DETAIL PAGE
    'ui_news_detail_page_title','News',
    'ui_news_back_to_list',     'Back to all news',
    'ui_news_loading',          'Loading news...',
    'ui_news_not_found',        'News not found.',

    -- MORE NEWS
    'ui_news_more_title',       'More News'
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
  AND s.`key` = 'ui_news'
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE t.`key` = s.`key`
      AND t.locale = 'de'
  );
