-- =============================================================
-- 049-91_site_settings_ui_blog.sql
-- Ensotek – UI Blog (site_settings.ui_blog)
--   - Blog list page SEO: src/pages/blog/index.tsx
--   - Blog detail SEO:     src/pages/blog/[slug].tsx
--   - BlogDetailsArea:     src/components/containers/blog/BlogDetailsArea.tsx
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
  'ui_blog',
  'tr',
  JSON_OBJECT(
    -- PAGE TITLES (SEO & Banner)
    'ui_blog_page_title',              'Blog',
    'ui_blog_detail_page_title',       'Blog Detayı',

    -- BLOG DETAILS AREA (src/components/containers/blog/BlogDetailsArea.tsx)
    'ui_blog_loading',                 'Yükleniyor...',
    'ui_blog_not_found',               'Blog içeriği bulunamadı.',
    'ui_blog_content_soon',            'İçerik yakında eklenecek.',
    'ui_blog_author_fallback',         'Ensotek',
    'ui_blog_author_role_fallback',    'Blog Admin',

    -- OPTIONAL SECTION LABELS (template korunurken)
    'ui_blog_highlights_title',        'Öne Çıkanlar',

    -- TAGS
    'ui_blog_tags_title',              'Etiketler:',

    -- NAV
    'ui_blog_prev_post',               'Önceki Yazı',
    'ui_blog_next_post',               'Sonraki Yazı',

    -- COMMENTS (template form)
    'ui_blog_leave_comment',           'Yorum Bırak',
    'ui_blog_comment_placeholder',     'Yazmaya başlayın...',
    'ui_blog_comment_name_placeholder','adınız',
    'ui_blog_comment_email_placeholder','e-posta adresiniz',
    'ui_blog_comment_submit',          'Yorum Gönder'
  ),
  NOW(3),
  NOW(3)
),
-- -------------------------------------------------------------
-- EN
-- -------------------------------------------------------------
(
  UUID(),
  'ui_blog',
  'en',
  JSON_OBJECT(
    -- PAGE TITLES (SEO & Banner)
    'ui_blog_page_title',              'Blog',
    'ui_blog_detail_page_title',       'Blog Detail',

    -- BLOG DETAILS AREA (src/components/containers/blog/BlogDetailsArea.tsx)
    'ui_blog_loading',                 'Loading...',
    'ui_blog_not_found',               'Blog post not found.',
    'ui_blog_content_soon',            'Content will be added soon.',
    'ui_blog_author_fallback',         'Ensotek',
    'ui_blog_author_role_fallback',    'Blog Admin',

    -- OPTIONAL SECTION LABELS (template preserved)
    'ui_blog_highlights_title',        'Highlights',

    -- TAGS
    'ui_blog_tags_title',              'Tags:',

    -- NAV
    'ui_blog_prev_post',               'Previous Post',
    'ui_blog_next_post',               'Next Post',

    -- COMMENTS (template form)
    'ui_blog_leave_comment',           'Leave A Comment',
    'ui_blog_comment_placeholder',     'Start type...',
    'ui_blog_comment_name_placeholder','your name',
    'ui_blog_comment_email_placeholder','your email',
    'ui_blog_comment_submit',          'Post Comment'
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
  AND s.`key` = 'ui_blog'
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE t.`key` = s.`key`
      AND t.locale = 'de'
  );
