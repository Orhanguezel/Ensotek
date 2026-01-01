-- =============================================================
-- FILE: 011_categories.sql  (FIXED / RE-RUNNABLE / FINAL / DRIZZLE-ALIGNED)
-- Ensotek – Categories seed + category_i18n (TR/EN/DE)
--
-- Özellikler:
--  - Diğer kayıtları SİLMEDEN çalışır (idempotent / upsert-safe)
--  - Drizzle schema ile uyumlu:
--    * category_i18n: id yok, PK(category_id, locale)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =========================
-- 1) CATEGORIES (BASE)  (UPSERT SAFE)
-- =========================
INSERT INTO `categories`
(
  `id`,
  `module_key`,
  `image_url`,
  `storage_asset_id`,
  `alt`,
  `icon`,
  `is_active`,
  `is_featured`,
  `display_order`
)
VALUES
  -- ==========================================================
  -- PRODUCT (kule ürünleri)
  -- ==========================================================
  ('aaaa0001-1111-4111-8111-aaaaaaaa0001', 'product',   NULL, NULL, NULL, NULL, 1, 1, 10),
  ('aaaa0002-1111-4111-8111-aaaaaaaa0002', 'product',   NULL, NULL, NULL, NULL, 1, 0, 11),
  ('aaaa0003-1111-4111-8111-aaaaaaaa0003', 'product',   NULL, NULL, NULL, NULL, 1, 0, 12),
  ('aaaa0004-1111-4111-8111-aaaaaaaa0004', 'product',   NULL, NULL, NULL, NULL, 1, 0, 13),
  ('aaaa0005-1111-4111-8111-aaaaaaaa0005', 'product',   NULL, NULL, NULL, NULL, 1, 0, 14),

  -- ==========================================================
  -- SPAREPART (yedek parça ana kategorisi)
  -- ==========================================================
  ('aaaa1001-1111-4111-8111-aaaaaaaa1001', 'sparepart', NULL, NULL, NULL, NULL, 1, 0, 15),

  -- ==========================================================
  -- SOLUTIONS
  -- ==========================================================
  ('aaaa1501-1111-4111-8111-aaaaaaaa1501', 'solutions', NULL, NULL, NULL, NULL, 1, 0, 25),

  -- ==========================================================
  -- NEWS
  -- ==========================================================
  ('aaaa2001-1111-4111-8111-aaaaaaaa2001', 'news',      NULL, NULL, NULL, NULL, 1, 0, 16),
  ('aaaa2002-1111-4111-8111-aaaaaaaa2002', 'news',      NULL, NULL, NULL, NULL, 1, 0, 17),
  ('aaaa2003-1111-4111-8111-aaaaaaaa2003', 'news',      NULL, NULL, NULL, NULL, 1, 0, 18),
  ('aaaa2004-1111-4111-8111-aaaaaaaa2004', 'news',      NULL, NULL, NULL, NULL, 1, 0, 19),

  -- ==========================================================
  -- BLOG
  -- ==========================================================
  ('aaaa3001-1111-4111-8111-aaaaaaaa3001', 'blog',      NULL, NULL, NULL, NULL, 1, 0, 20),
  ('aaaa3002-1111-4111-8111-aaaaaaaa3002', 'blog',      NULL, NULL, NULL, NULL, 1, 0, 21),
  ('aaaa3003-1111-4111-8111-aaaaaaaa3003', 'blog',      NULL, NULL, NULL, NULL, 1, 0, 22),
  ('aaaa3004-1111-4111-8111-aaaaaaaa3004', 'blog',      NULL, NULL, NULL, NULL, 1, 0, 23),

  -- ==========================================================
  -- SLIDER
  -- ==========================================================
  ('aaaa4001-1111-4111-8111-aaaaaaaa4001', 'slider',    NULL, NULL, NULL, NULL, 1, 0, 24),

  -- ==========================================================
  -- REFERENCES
  -- ==========================================================
  ('aaaa5002-1111-4111-8111-aaaaaaaa5002', 'references', NULL, NULL, NULL, NULL, 1, 0, 26),
  ('aaaa5003-1111-4111-8111-aaaaaaaa5003', 'references', NULL, NULL, NULL, NULL, 1, 0, 27),

  -- ==========================================================
  -- LIBRARY
  -- ==========================================================
  ('aaaa6001-1111-4111-8111-aaaaaaaa6001', 'library',   NULL, NULL, NULL, NULL, 1, 0, 35),

  -- ==========================================================
  -- ABOUT
  -- ==========================================================
  ('aaaa7001-1111-4111-8111-aaaaaaaa7001', 'about',     NULL, NULL, NULL, NULL, 1, 0, 36),

  -- ==========================================================
  -- LEGAL (Yasal & KVKK – ayrı module_key)
  -- ==========================================================
  ('aaaa7101-1111-4111-8111-aaaaaaaa7101', 'legal',     NULL, NULL, NULL, NULL, 1, 0, 44),

  -- ==========================================================
  -- SERVICES
  -- ==========================================================
  ('aaaa8001-1111-4111-8111-aaaaaaaa8001', 'services',  NULL, NULL, NULL, NULL, 1, 0, 40),

  -- ==========================================================
  -- FAQ
  -- ==========================================================
  ('aaaa9001-1111-4111-8111-aaaaaaaa9001', 'faq',       NULL, NULL, NULL, NULL, 1, 0, 41),

  -- ==========================================================
  -- TEAM
  -- ==========================================================
  ('aaaa9101-1111-4111-8111-aaaaaaaa9101', 'team',      NULL, NULL, NULL, NULL, 1, 0, 42)
ON DUPLICATE KEY UPDATE
  `module_key`       = VALUES(`module_key`),
  `image_url`        = VALUES(`image_url`),
  `storage_asset_id` = VALUES(`storage_asset_id`),
  `alt`              = VALUES(`alt`),
  `icon`             = VALUES(`icon`),
  `is_active`        = VALUES(`is_active`),
  `is_featured`      = VALUES(`is_featured`),
  `display_order`    = VALUES(`display_order`);

-- =========================
-- 2) CATEGORY I18N (TR + EN + DE)  (UPSERT SAFE)
--  - Drizzle uyumu: id yok
--  - PK: (category_id, locale)
-- =========================
INSERT INTO `category_i18n`
(
  `category_id`,
  `locale`,
  `name`,
  `slug`,
  `description`,
  `alt`
)
VALUES
  -- ==========================================================
  -- PRODUCT
  -- ==========================================================
  ('aaaa0001-1111-4111-8111-aaaaaaaa0001','tr','SOĞUTMA KULELERİ','sogutma-kuleleri',NULL,NULL),
  ('aaaa0002-1111-4111-8111-aaaaaaaa0002','tr','AÇIK DEVRE SOĞUTMA KULELERİ','acik-devre-sogutma-kuleleri',NULL,NULL),
  ('aaaa0003-1111-4111-8111-aaaaaaaa0003','tr','KAPALI DEVRE SOĞUTMA KULELERİ','kapali-devre-sogutma-kuleleri',NULL,NULL),
  ('aaaa0004-1111-4111-8111-aaaaaaaa0004','tr','HİBRİT SOĞUTMA SİSTEMLERİ','hibrit-sogutma-sistemleri',NULL,NULL),
  ('aaaa0005-1111-4111-8111-aaaaaaaa0005','tr','ISI TRANSFER ÇÖZÜMLERİ','isi-transfer-cozumleri',NULL,NULL),

  ('aaaa0001-1111-4111-8111-aaaaaaaa0001','en','Cooling Towers','cooling-towers',NULL,NULL),
  ('aaaa0002-1111-4111-8111-aaaaaaaa0002','en','Open Circuit Cooling Towers','open-circuit-cooling-towers',NULL,NULL),
  ('aaaa0003-1111-4111-8111-aaaaaaaa0003','en','Closed Circuit Cooling Towers','closed-circuit-cooling-towers',NULL,NULL),
  ('aaaa0004-1111-4111-8111-aaaaaaaa0004','en','Hybrid Cooling Systems','hybrid-cooling-systems',NULL,NULL),
  ('aaaa0005-1111-4111-8111-aaaaaaaa0005','en','Heat Transfer Solutions','heat-transfer-solutions',NULL,NULL),

  ('aaaa0001-1111-4111-8111-aaaaaaaa0001','de','KÜHLTÜRME','kuehltuerme',NULL,NULL),
  ('aaaa0002-1111-4111-8111-aaaaaaaa0002','de','OFFENE KREISLAUF-KÜHLTÜRME','offene-kreislauf-kuehltuerme',NULL,NULL),
  ('aaaa0003-1111-4111-8111-aaaaaaaa0003','de','GESCHLOSSENE KREISLAUF-KÜHLTÜRME','geschlossene-kreislauf-kuehltuerme',NULL,NULL),
  ('aaaa0004-1111-4111-8111-aaaaaaaa0004','de','HYBRID-KÜHLSYSTEME','hybrid-kuehlsysteme',NULL,NULL),
  ('aaaa0005-1111-4111-8111-aaaaaaaa0005','de','WÄRMEÜBERTRAGUNGS-LÖSUNGEN','waermeuebertragungs-loesungen',NULL,NULL),

  -- ==========================================================
  -- SPAREPART
  -- ==========================================================
  ('aaaa1001-1111-4111-8111-aaaaaaaa1001','tr','SOĞUTMA KULESİ YEDEK PARÇALARI','sogutma-kulesi-yedek-parcalari',NULL,NULL),
  ('aaaa1001-1111-4111-8111-aaaaaaaa1001','en','Cooling Tower Spare Parts','cooling-tower-spare-parts',NULL,NULL),
  ('aaaa1001-1111-4111-8111-aaaaaaaa1001','de','ERSATZTEILE FÜR KÜHLTÜRME','ersatzteile-fuer-kuehltuerme',NULL,NULL),

  -- ==========================================================
  -- SOLUTIONS
  -- ==========================================================
  ('aaaa1501-1111-4111-8111-aaaaaaaa1501','tr','ÇÖZÜMLER','cozumler',NULL,NULL),
  ('aaaa1501-1111-4111-8111-aaaaaaaa1501','en','Solutions','solutions',NULL,NULL),
  ('aaaa1501-1111-4111-8111-aaaaaaaa1501','de','LÖSUNGEN','loesungen',NULL,NULL),

  -- ==========================================================
  -- NEWS
  -- ==========================================================
  ('aaaa2001-1111-4111-8111-aaaaaaaa2001','tr','GENEL HABERLER','genel-haberler',NULL,NULL),
  ('aaaa2002-1111-4111-8111-aaaaaaaa2002','tr','ŞİRKET HABERLERİ','sirket-haberleri',NULL,NULL),
  ('aaaa2003-1111-4111-8111-aaaaaaaa2003','tr','DUYURULAR','duyurular',NULL,NULL),
  ('aaaa2004-1111-4111-8111-aaaaaaaa2004','tr','BASINDA ENSOTEK','basinda-ensotek',NULL,NULL),

  ('aaaa2001-1111-4111-8111-aaaaaaaa2001','en','General News','general-news',NULL,NULL),
  ('aaaa2002-1111-4111-8111-aaaaaaaa2002','en','Company News','company-news',NULL,NULL),
  ('aaaa2003-1111-4111-8111-aaaaaaaa2003','en','Announcements','announcements',NULL,NULL),
  ('aaaa2004-1111-4111-8111-aaaaaaaa2004','en','Ensotek in the Media','ensotek-in-the-media',NULL,NULL),

  ('aaaa2001-1111-4111-8111-aaaaaaaa2001','de','ALLGEMEINE NEWS','allgemeine-news',NULL,NULL),
  ('aaaa2002-1111-4111-8111-aaaaaaaa2002','de','UNTERNEHMENSNEWS','unternehmensnews',NULL,NULL),
  ('aaaa2003-1111-4111-8111-aaaaaaaa2003','de','ANKÜNDIGUNGEN','ankuendigungen',NULL,NULL),
  ('aaaa2004-1111-4111-8111-aaaaaaaa2004','de','ENSOTEK IN DEN MEDIEN','ensotek-in-den-medien',NULL,NULL),

  -- ==========================================================
  -- BLOG
  -- ==========================================================
  ('aaaa3001-1111-4111-8111-aaaaaaaa3001','tr','GENEL BLOG YAZILARI','genel-blog-yazilari',NULL,NULL),
  ('aaaa3002-1111-4111-8111-aaaaaaaa3002','tr','TEKNİK YAZILAR','teknik-yazilar',NULL,NULL),
  ('aaaa3003-1111-4111-8111-aaaaaaaa3003','tr','SEKTÖREL YAZILAR','sektorel-yazilar',NULL,NULL),
  ('aaaa3004-1111-4111-8111-aaaaaaaa3004','tr','ENERJİ VERİMLİLİĞİ & GENEL YAZILAR','enerji-verimliligi-genel-yazilar',NULL,NULL),

  ('aaaa3001-1111-4111-8111-aaaaaaaa3001','en','General Blog Posts','general-blog-posts',NULL,NULL),
  ('aaaa3002-1111-4111-8111-aaaaaaaa3002','en','Technical Articles','technical-articles',NULL,NULL),
  ('aaaa3003-1111-4111-8111-aaaaaaaa3003','en','Sector Articles','sector-articles',NULL,NULL),
  ('aaaa3004-1111-4111-8111-aaaaaaaa3004','en','Energy Efficiency & General Articles','energy-efficiency-general-articles',NULL,NULL),

  ('aaaa3001-1111-4111-8111-aaaaaaaa3001','de','ALLGEMEINE BLOGBEITRÄGE','allgemeine-blogbeitraege',NULL,NULL),
  ('aaaa3002-1111-4111-8111-aaaaaaaa3002','de','TECHNISCHE ARTIKEL','technische-artikel',NULL,NULL),
  ('aaaa3003-1111-4111-8111-aaaaaaaa3003','de','BRANCHENARTIKEL','branchenartikel',NULL,NULL),
  ('aaaa3004-1111-4111-8111-aaaaaaaa3004','de','ENERGIEEFFIZIENZ & ALLGEMEINE ARTIKEL','energieeffizienz-allgemeine-artikel',NULL,NULL),

  -- ==========================================================
  -- SLIDER
  -- ==========================================================
  ('aaaa4001-1111-4111-8111-aaaaaaaa4001','tr','ANA SLIDER','ana-slider',NULL,NULL),
  ('aaaa4001-1111-4111-8111-aaaaaaaa4001','en','Main Slider','main-slider',NULL,NULL),
  ('aaaa4001-1111-4111-8111-aaaaaaaa4001','de','HAUPTSLIDER','hauptslider',NULL,NULL),

  -- ==========================================================
  -- REFERENCES
  -- ==========================================================
  ('aaaa5002-1111-4111-8111-aaaaaaaa5002','tr','YURT İÇİ REFERANSLAR','yurt-ici-referanslar',NULL,NULL),
  ('aaaa5003-1111-4111-8111-aaaaaaaa5003','tr','YURT DIŞI REFERANSLAR','yurt-disi-referanslar',NULL,NULL),

  ('aaaa5002-1111-4111-8111-aaaaaaaa5002','en','Domestic References','domestic-references',NULL,NULL),
  ('aaaa5003-1111-4111-8111-aaaaaaaa5003','en','International References','international-references',NULL,NULL),

  ('aaaa5002-1111-4111-8111-aaaaaaaa5002','de','INLANDSREFERENZEN','inlandsreferenzen',NULL,NULL),
  ('aaaa5003-1111-4111-8111-aaaaaaaa5003','de','AUSLANDSREFERENZEN','auslandsreferenzen',NULL,NULL),

  -- ==========================================================
  -- LIBRARY
  -- ==========================================================
  ('aaaa6001-1111-4111-8111-aaaaaaaa6001','tr','DÖKÜMAN KÜTÜPHANESİ','dokuman-kutuphanesi',NULL,NULL),
  ('aaaa6001-1111-4111-8111-aaaaaaaa6001','en','Document Library','document-library',NULL,NULL),
  ('aaaa6001-1111-4111-8111-aaaaaaaa6001','de','DOKUMENTENBIBLIOTHEK','dokumentenbibliothek',NULL,NULL),

  -- ==========================================================
  -- ABOUT
  -- ==========================================================
  ('aaaa7001-1111-4111-8111-aaaaaaaa7001','tr','KURUMSAL','kurumsal',NULL,NULL),
  ('aaaa7001-1111-4111-8111-aaaaaaaa7001','en','Corporate','corporate',NULL,NULL),
  ('aaaa7001-1111-4111-8111-aaaaaaaa7001','de','UNTERNEHMEN','unternehmen',NULL,NULL),

  -- ==========================================================
  -- LEGAL
  -- ==========================================================
  ('aaaa7101-1111-4111-8111-aaaaaaaa7101','tr','YASAL & KVKK','yasal-ve-kvkk',NULL,NULL),
  ('aaaa7101-1111-4111-8111-aaaaaaaa7101','en','Legal & Compliance','legal-and-compliance',NULL,NULL),
  ('aaaa7101-1111-4111-8111-aaaaaaaa7101','de','RECHTLICHES & DATENSCHUTZ','rechtliches-und-datenschutz',NULL,NULL),

  -- ==========================================================
  -- SERVICES
  -- ==========================================================
  ('aaaa8001-1111-4111-8111-aaaaaaaa8001','tr','HİZMETLER','hizmetler',
    'Ensotek, su soğutma kuleleri için bakım ve onarım, modernizasyon, yedek parça tedariki, uygulamalar ve mühendislik desteği sunar.',
    NULL
  ),
  ('aaaa8001-1111-4111-8111-aaaaaaaa8001','en','Services','services',
    'Ensotek provides maintenance and repair, modernization, spare parts, applications and engineering support for industrial cooling towers.',
    NULL
  ),
  ('aaaa8001-1111-4111-8111-aaaaaaaa8001','de','DIENSTLEISTUNGEN','dienstleistungen',
    'Ensotek bietet Wartung und Reparatur, Modernisierung, Ersatzteile, Anwendungen und Engineering-Support für industrielle Kühltürme.',
    NULL
  ),

  -- ==========================================================
  -- FAQ
  -- ==========================================================
  ('aaaa9001-1111-4111-8111-aaaaaaaa9001','tr','SIKÇA SORULAN SORULAR','sikca-sorulan-sorular',NULL,NULL),
  ('aaaa9001-1111-4111-8111-aaaaaaaa9001','en','Frequently Asked Questions','frequently-asked-questions',NULL,NULL),
  ('aaaa9001-1111-4111-8111-aaaaaaaa9001','de','HÄUFIG GESTELLTE FRAGEN','haeufig-gestellte-fragen',NULL,NULL),

  -- ==========================================================
  -- TEAM
  -- ==========================================================
  ('aaaa9101-1111-4111-8111-aaaaaaaa9101','tr','EKİBİMİZ','ekibimiz',
    'Ensotek mühendislik, proje, saha ve servis ekiplerinden oluşan uzman kadromuz.',
    NULL
  ),
  ('aaaa9101-1111-4111-8111-aaaaaaaa9101','en','Our Team','our-team',
    'Our expert team consisting of engineering, project, field and service professionals at Ensotek.',
    NULL
  ),
  ('aaaa9101-1111-4111-8111-aaaaaaaa9101','de','UNSER TEAM','unser-team',
    'Unser Expertenteam bei Ensotek besteht aus Fachkräften aus Engineering, Projektleitung, Außendienst und Service.',
    NULL
  )
ON DUPLICATE KEY UPDATE
  `name`        = VALUES(`name`),
  `slug`        = VALUES(`slug`),
  `description` = VALUES(`description`),
  `alt`         = VALUES(`alt`);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
