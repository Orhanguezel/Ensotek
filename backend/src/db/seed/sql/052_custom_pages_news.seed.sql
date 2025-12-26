-- =============================================================
-- FILE: 052_custom_pages_news.seed.sql
-- NEWS – custom_pages + custom_pages_i18n
-- 011_catalog_categories.sql & 012_catalog_subcategories.sql ile uyumlu
-- Bu seed: TEK HABER (TR/EN/DE) – “Ensotek Web Sitemiz Yenilendi!”
-- Yeni haberler için ayrı dosya açılacak (053..., 054...).
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

/* KATEGORİ ID’LERİ (011 & 012 ile hizalı) */
SET @CAT_NEWS_GENERAL  := 'aaaa2001-1111-4111-8111-aaaaaaaa2001'; -- GENEL HABERLER
SET @CAT_NEWS_DUYS     := 'aaaa2003-1111-4111-8111-aaaaaaaa2003'; -- DUYURULAR
SET @CAT_NEWS_PRESS    := 'aaaa2004-1111-4111-8111-aaaaaaaa2004'; -- BASINDA ENSOTEK

/* ALT KATEGORİLER (012_catalog_subcategories.sql) */
SET @SUB_NEWS_GENERAL_ANN  := 'bbbb2001-1111-4111-8111-bbbbbbbb2001'; -- Duyurular (genel)

/* SABİT PAGE ID (deterministik) */
SET @NEWS_ANNOUNCE_1 := '22220001-2222-4222-8222-222222220001';

/* FEATURED IMAGE (Cloudinary) */
SET @IMG_NEWS_RENEWED :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1753280071/uploads/metahub/news-images/untitled-1753280071057-80939909.webp';

-- -------------------------------------------------------------
-- PARENT UPSERT (custom_pages)
-- -------------------------------------------------------------
INSERT INTO `custom_pages`
  (`id`, `is_published`, `display_order`,
   `featured_image`, `featured_image_asset_id`,
   `category_id`, `sub_category_id`,
   `created_at`, `updated_at`)
VALUES
  (
    @NEWS_ANNOUNCE_1,
    1,
    101,
    @IMG_NEWS_RENEWED,
    NULL,
    @CAT_NEWS_DUYS,
    @SUB_NEWS_GENERAL_ANN,
    NOW(3),
    NOW(3)
  )
ON DUPLICATE KEY UPDATE
  `is_published`    = VALUES(`is_published`),
  `display_order`   = VALUES(`display_order`),
  `category_id`     = VALUES(`category_id`),
  `sub_category_id` = VALUES(`sub_category_id`),
  `featured_image`  = VALUES(`featured_image`),
  `updated_at`      = VALUES(`updated_at`);

-- =============================================================
-- I18N – NEWS_ANNOUNCE_1 (TR/EN/DE)
-- content JSON_OBJECT('html', '<...>') formatında tutulur.
-- tags: CSV string (mevcut kolon tipine göre).
-- =============================================================
INSERT INTO `custom_pages_i18n`
  (`id`, `page_id`, `locale`,
   `title`, `slug`, `content`,
   `summary`,
   `featured_image_alt`, `meta_title`, `meta_description`,
   `tags`,
   `created_at`, `updated_at`)
VALUES

-- -------------------------------------------------------------
-- TR
-- -------------------------------------------------------------
(
  UUID(),
  @NEWS_ANNOUNCE_1,
  'tr',
  'Ensotek Web Sitemiz Yenilendi!',
  'ensotek-web-sitemiz-yenilendi',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Dijital dönüşüm vizyonumuz doğrultusunda, Ensotek web sitemizi tamamen yeniledik. ',
      'Yeni arayüzümüzle sizlere daha hızlı, modern ve etkileşimli bir kullanıcı deneyimi sunmayı hedefliyoruz.</p>',
      '<p>Artık çok dilli altyapımızla global erişim sağlıyor, güncel haberlerimizi ve teknolojik gelişmelerimizi ',
      'kolayca duyurabiliyoruz. Ziyaretçilerimiz; ürünlerimiz, çözümlerimiz ve sektörel haberler hakkında detaylı bilgi alabilir, ',
      'üye olarak görüş ve önerilerini paylaşabilir.</p>',
      '<p>Sizi Ensotek ailesine katılmaya, yeni web sitemizi keşfetmeye ve platformumuza yorum bırakmaya davet ediyoruz!</p>',
      '<p><strong>Daha fazlası için hemen üye olun, iletişimde kalın!</strong></p>'
    )
  ),
  'Modern arayüz, çok dilli destek ve kullanıcı odaklı tasarımıyla yeni Ensotek web sitemiz yayında! Artık daha hızlı, etkileşimli ve size daha yakın bir platformdayız.',
  'Ensotek web sitesi yenilendi – duyuru görseli',
  'Ensotek Web Sitemiz Yenilendi! | Ensotek',
  'Ensotek web sitesi yenilendi: modern arayüz, çok dilli altyapı, daha hızlı ve etkileşimli deneyim. Güncel haberler ve gelişmeler için bizi takip edin.',
  'ensotek,web sitesi,yenilendi,duyuru,çok dilli,etkileşim',
  NOW(3),
  NOW(3)
),

-- -------------------------------------------------------------
-- EN
-- -------------------------------------------------------------
(
  UUID(),
  @NEWS_ANNOUNCE_1,
  'en',
  'Our Ensotek Website Has Been Renewed!',
  'ensotek-website-has-been-renewed',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>In line with our digital transformation vision, we have completely renewed our Ensotek website. ',
      'With the new interface, we aim to provide a faster, modern, and more interactive user experience.</p>',
      '<p>Thanks to our multilingual infrastructure, we now reach a broader audience and can share our latest news ',
      'and technological developments more effectively. Visitors can explore our products, solutions, and industry updates, ',
      'and share feedback by registering.</p>',
      '<p>We invite you to join the Ensotek community, discover our new website, and leave your comments on our platform.</p>',
      '<p><strong>Register now and stay connected for more updates.</strong></p>'
    )
  ),
  'Our new Ensotek website is live with a modern interface, multilingual support, and a user-focused experience. Faster, more interactive, and closer to you.',
  'Announcement image for the renewed Ensotek website',
  'Ensotek Website Renewed | Ensotek',
  'Ensotek has renewed its website with a modern UI, multilingual support, and a faster, more interactive experience. Stay connected for updates and news.',
  'ensotek,website,renewed,announcement,multilingual,interactive',
  NOW(3),
  NOW(3)
),

-- -------------------------------------------------------------
-- DE
-- -------------------------------------------------------------
(
  UUID(),
  @NEWS_ANNOUNCE_1,
  'de',
  'Unsere Ensotek-Webseite ist erneuert!',
  'ensotek-webseite-wurde-erneuert',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Im Rahmen unserer Digitalisierungsstrategie haben wir unsere Ensotek-Webseite vollständig erneuert. ',
      'Mit der neuen Oberfläche möchten wir Ihnen ein schnelleres, moderneres und interaktiveres Nutzererlebnis bieten.</p>',
      '<p>Dank unserer mehrsprachigen Infrastruktur erreichen wir nun ein breiteres Publikum und können aktuelle Neuigkeiten ',
      'sowie technologische Entwicklungen einfacher kommunizieren. Besucher finden detaillierte Informationen zu unseren Produkten, ',
      'Lösungen und Branchen-Updates und können nach einer Registrierung Feedback teilen.</p>',
      '<p>Werden Sie Teil der Ensotek-Community, entdecken Sie unsere neue Webseite und hinterlassen Sie einen Kommentar.</p>',
      '<p><strong>Registrieren Sie sich jetzt und bleiben Sie auf dem Laufenden.</strong></p>'
    )
  ),
  'Unsere neue Ensotek-Webseite ist online: modernes Design, mehrsprachige Unterstützung und ein nutzerorientiertes Erlebnis. Schneller, interaktiver und näher bei Ihnen.',
  'Ankündigungsbild zur erneuerten Ensotek-Webseite',
  'Ensotek-Webseite erneuert | Ensotek',
  'Ensotek hat seine Webseite erneuert: moderne Benutzeroberfläche, mehrsprachige Struktur und ein schnelleres, interaktiveres Nutzererlebnis. Bleiben Sie informiert.',
  'ensotek,webseite,erneuert,ankündigung,mehrsprachig,interaktiv',
  NOW(3),
  NOW(3)
)

ON DUPLICATE KEY UPDATE
  `title`              = VALUES(`title`),
  `slug`               = VALUES(`slug`),
  `content`            = VALUES(`content`),
  `summary`            = VALUES(`summary`),
  `featured_image_alt` = VALUES(`featured_image_alt`),
  `meta_title`         = VALUES(`meta_title`),
  `meta_description`   = VALUES(`meta_description`),
  `tags`               = VALUES(`tags`),
  `updated_at`         = VALUES(`updated_at`);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
