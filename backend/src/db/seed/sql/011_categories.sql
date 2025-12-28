-- =============================================================
-- FILE: 011_categories.sql  (FIXED / RE-RUNNABLE / FINAL)
-- Ensotek – Categories seed + category_i18n (TR/EN/DE)
--
-- Özellikler:
--  - Diğer kategorileri SİLMEDEN çalışır (idempotent / upsert-safe)
--  - Product + Sparepart kategorileri düzenli
--  - References tarafında: "Yurt İçi / Yurt Dışı" category olarak
--  - Legal sayfalar için ayrı module_key: 'legal'
--    * Quality ABOUT içinde kalır
--    * KVKK, Gizlilik, Çerez, Aydınlatma, Yasal Bilgi vb. LEGAL altında
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
-- =========================
INSERT INTO `category_i18n`
(
  `id`,
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
  ('cati0001-1111-4111-8111-cati00000001','aaaa0001-1111-4111-8111-aaaaaaaa0001','tr','SOĞUTMA KULELERİ','sogutma-kuleleri',NULL,NULL),
  ('cati0002-1111-4111-8111-cati00000002','aaaa0002-1111-4111-8111-aaaaaaaa0002','tr','AÇIK DEVRE SOĞUTMA KULELERİ','acik-devre-sogutma-kuleleri',NULL,NULL),
  ('cati0003-1111-4111-8111-cati00000003','aaaa0003-1111-4111-8111-aaaaaaaa0003','tr','KAPALI DEVRE SOĞUTMA KULELERİ','kapali-devre-sogutma-kuleleri',NULL,NULL),
  ('cati0004-1111-4111-8111-cati00000004','aaaa0004-1111-4111-8111-aaaaaaaa0004','tr','HİBRİT SOĞUTMA SİSTEMLERİ','hibrit-sogutma-sistemleri',NULL,NULL),
  ('cati0005-1111-4111-8111-cati00000005','aaaa0005-1111-4111-8111-aaaaaaaa0005','tr','ISI TRANSFER ÇÖZÜMLERİ','isi-transfer-cozumleri',NULL,NULL),

  ('cati0011-1111-4111-8111-cati00000011','aaaa0001-1111-4111-8111-aaaaaaaa0001','en','Cooling Towers','cooling-towers',NULL,NULL),
  ('cati0012-1111-4111-8111-cati00000012','aaaa0002-1111-4111-8111-aaaaaaaa0002','en','Open Circuit Cooling Towers','open-circuit-cooling-towers',NULL,NULL),
  ('cati0013-1111-4111-8111-cati00000013','aaaa0003-1111-4111-8111-aaaaaaaa0003','en','Closed Circuit Cooling Towers','closed-circuit-cooling-towers',NULL,NULL),
  ('cati0014-1111-4111-8111-cati00000014','aaaa0004-1111-4111-8111-aaaaaaaa0004','en','Hybrid Cooling Systems','hybrid-cooling-systems',NULL,NULL),
  ('cati0015-1111-4111-8111-cati00000015','aaaa0005-1111-4111-8111-aaaaaaaa0005','en','Heat Transfer Solutions','heat-transfer-solutions',NULL,NULL),

  -- (FIX) DE locale gerçekten 'de' olmalıydı
  ('cati0021-1111-4111-8111-cati00000021','aaaa0001-1111-4111-8111-aaaaaaaa0001','de','KÜHLTÜRME','kuehltuerme',NULL,NULL),
  ('cati0022-1111-4111-8111-cati00000022','aaaa0002-1111-4111-8111-aaaaaaaa0002','de','OFFENE KREISLAUF-KÜHLTÜRME','offene-kreislauf-kuehltuerme',NULL,NULL),
  ('cati0023-1111-4111-8111-cati00000023','aaaa0003-1111-4111-8111-aaaaaaaa0003','de','GESCHLOSSENE KREISLAUF-KÜHLTÜRME','geschlossene-kreislauf-kuehltuerme',NULL,NULL),
  ('cati0024-1111-4111-8111-cati00000024','aaaa0004-1111-4111-8111-aaaaaaaa0004','de','HYBRID-KÜHLSYSTEME','hybrid-kuehlsysteme',NULL,NULL),
  ('cati0025-1111-4111-8111-cati00000025','aaaa0005-1111-4111-8111-aaaaaaaa0005','de','WÄRMEÜBERTRAGUNGS-LÖSUNGEN','waermeuebertragungs-loesungen',NULL,NULL),

  -- ==========================================================
  -- SPAREPART
  -- ==========================================================
  ('cati0101-1111-4111-8111-cati00000101','aaaa1001-1111-4111-8111-aaaaaaaa1001','tr','SOĞUTMA KULESİ YEDEK PARÇALARI','sogutma-kulesi-yedek-parcalari',NULL,NULL),
  ('cati0111-1111-4111-8111-cati00000111','aaaa1001-1111-4111-8111-aaaaaaaa1001','en','Cooling Tower Spare Parts','cooling-tower-spare-parts',NULL,NULL),
  ('cati0121-1111-4111-8111-cati00000121','aaaa1001-1111-4111-8111-aaaaaaaa1001','de','ERSATZTEILE FÜR KÜHLTÜRME','ersatzteile-fuer-kuehltuerme',NULL,NULL),

  -- ==========================================================
  -- NEWS
  -- ==========================================================
  ('cati0201-1111-4111-8111-cati00000201','aaaa2001-1111-4111-8111-aaaaaaaa2001','tr','GENEL HABERLER','genel-haberler',NULL,NULL),
  ('cati0202-1111-4111-8111-cati00000202','aaaa2002-1111-4111-8111-aaaaaaaa2002','tr','ŞİRKET HABERLERİ','sirket-haberleri',NULL,NULL),
  ('cati0203-1111-4111-8111-cati00000203','aaaa2003-1111-4111-8111-aaaaaaaa2003','tr','DUYURULAR','duyurular',NULL,NULL),
  ('cati0204-1111-4111-8111-cati00000204','aaaa2004-1111-4111-8111-aaaaaaaa2004','tr','BASINDA ENSOTEK','basinda-ensotek',NULL,NULL),

  ('cati0211-1111-4111-8111-cati00000211','aaaa2001-1111-4111-8111-aaaaaaaa2001','en','General News','general-news',NULL,NULL),
  ('cati0212-1111-4111-8111-cati00000212','aaaa2002-1111-4111-8111-aaaaaaaa2002','en','Company News','company-news',NULL,NULL),
  ('cati0213-1111-4111-8111-cati00000213','aaaa2003-1111-4111-8111-aaaaaaaa2003','en','Announcements','announcements',NULL,NULL),
  ('cati0214-1111-4111-8111-cati00000214','aaaa2004-1111-4111-8111-aaaaaaaa2004','en','Ensotek in the Media','ensotek-in-the-media',NULL,NULL),

  ('cati0221-1111-4111-8111-cati00000221','aaaa2001-1111-4111-8111-aaaaaaaa2001','de','ALLGEMEINE NEWS','allgemeine-news',NULL,NULL),
  ('cati0222-1111-4111-8111-cati00000222','aaaa2002-1111-4111-8111-aaaaaaaa2002','de','UNTERNEHMENSNEWS','unternehmensnews',NULL,NULL),
  ('cati0223-1111-4111-8111-cati00000223','aaaa2003-1111-4111-8111-aaaaaaaa2003','de','ANKÜNDIGUNGEN','ankuendigungen',NULL,NULL),
  ('cati0224-1111-4111-8111-cati00000224','aaaa2004-1111-4111-8111-aaaaaaaa2004','de','ENSOTEK IN DEN MEDIEN','ensotek-in-den-medien',NULL,NULL),

  -- ==========================================================
  -- BLOG
  -- ==========================================================
  ('cati0301-1111-4111-8111-cati00000301','aaaa3001-1111-4111-8111-aaaaaaaa3001','tr','GENEL BLOG YAZILARI','genel-blog-yazilari',NULL,NULL),
  ('cati0302-1111-4111-8111-cati00000302','aaaa3002-1111-4111-8111-aaaaaaaa3002','tr','TEKNİK YAZILAR','teknik-yazilar',NULL,NULL),
  ('cati0303-1111-4111-8111-cati00000303','aaaa3003-1111-4111-8111-aaaaaaaa3003','tr','SEKTÖREL YAZILAR','sektorel-yazilar',NULL,NULL),
  ('cati0304-1111-4111-8111-cati00000304','aaaa3004-1111-4111-8111-aaaaaaaa3004','tr','ENERJİ VERİMLİLİĞİ & GENEL YAZILAR','enerji-verimliligi-genel-yazilar',NULL,NULL),

  ('cati0311-1111-4111-8111-cati00000311','aaaa3001-1111-4111-8111-aaaaaaaa3001','en','General Blog Posts','general-blog-posts',NULL,NULL),
  ('cati0312-1111-4111-8111-cati00000312','aaaa3002-1111-4111-8111-aaaaaaaa3002','en','Technical Articles','technical-articles',NULL,NULL),
  ('cati0313-1111-4111-8111-cati00000313','aaaa3003-1111-4111-8111-aaaaaaaa3003','en','Sector Articles','sector-articles',NULL,NULL),
  ('cati0314-1111-4111-8111-cati00000314','aaaa3004-1111-4111-8111-aaaaaaaa3004','en','Energy Efficiency & General Articles','energy-efficiency-general-articles',NULL,NULL),

  ('cati0321-1111-4111-8111-cati00000321','aaaa3001-1111-4111-8111-aaaaaaaa3001','de','ALLGEMEINE BLOGBEITRÄGE','allgemeine-blogbeitraege',NULL,NULL),
  ('cati0322-1111-4111-8111-cati00000322','aaaa3002-1111-4111-8111-aaaaaaaa3002','de','TECHNISCHE ARTIKEL','technische-artikel',NULL,NULL),
  ('cati0323-1111-4111-8111-cati00000323','aaaa3003-1111-4111-8111-aaaaaaaa3003','de','BRANCHENARTIKEL','branchenartikel',NULL,NULL),
  ('cati0324-1111-4111-8111-cati00000324','aaaa3004-1111-4111-8111-aaaaaaaa3004','de','ENERGIEEFFIZIENZ & ALLGEMEINE ARTIKEL','energieeffizienz-allgemeine-artikel',NULL,NULL),

  -- ==========================================================
  -- SLIDER
  -- ==========================================================
  ('cati0401-1111-4111-8111-cati00000401','aaaa4001-1111-4111-8111-aaaaaaaa4001','tr','ANA SLIDER','ana-slider',NULL,NULL),
  ('cati0411-1111-4111-8111-cati00000411','aaaa4001-1111-4111-8111-aaaaaaaa4001','en','Main Slider','main-slider',NULL,NULL),
  ('cati0421-1111-4111-8111-cati00000421','aaaa4001-1111-4111-8111-aaaaaaaa4001','de','HAUPTSLIDER','hauptslider',NULL,NULL),

  -- ==========================================================
  -- REFERENCES (UPDATED)
  -- ==========================================================
  ('cati0502-1111-4111-8111-cati00000502','aaaa5002-1111-4111-8111-aaaaaaaa5002','tr','YURT İÇİ REFERANSLAR','yurt-ici-referanslar',NULL,NULL),
  ('cati0503-1111-4111-8111-cati00000503','aaaa5003-1111-4111-8111-aaaaaaaa5003','tr','YURT DIŞI REFERANSLAR','yurt-disi-referanslar',NULL,NULL),

  ('cati0512-1111-4111-8111-cati00000512','aaaa5002-1111-4111-8111-aaaaaaaa5002','en','Domestic References','domestic-references',NULL,NULL),
  ('cati0513-1111-4111-8111-cati00000513','aaaa5003-1111-4111-8111-aaaaaaaa5003','en','International References','international-references',NULL,NULL),

  ('cati0522-1111-4111-8111-cati00000522','aaaa5002-1111-4111-8111-aaaaaaaa5002','de','INLANDSREFERENZEN','inlandsreferenzen',NULL,NULL),
  ('cati0523-1111-4111-8111-cati00000523','aaaa5003-1111-4111-8111-aaaaaaaa5003','de','AUSLANDSREFERENZEN','auslandsreferenzen',NULL,NULL),

  -- ==========================================================
  -- LIBRARY
  -- ==========================================================
  ('cati0601-1111-4111-8111-cati00000601','aaaa6001-1111-4111-8111-aaaaaaaa6001','tr','DÖKÜMAN KÜTÜPHANESİ','dokuman-kutuphanesi',NULL,NULL),
  ('cati0611-1111-4111-8111-cati00000611','aaaa6001-1111-4111-8111-aaaaaaaa6001','en','Document Library','document-library',NULL,NULL),
  ('cati0621-1111-4111-8111-cati00000621','aaaa6001-1111-4111-8111-aaaaaaaa6001','de','DOKUMENTENBIBLIOTHEK','dokumentenbibliothek',NULL,NULL),

  -- ==========================================================
  -- ABOUT
  -- ==========================================================
  ('cati0701-1111-4111-8111-cati00000701','aaaa7001-1111-4111-8111-aaaaaaaa7001','tr','KURUMSAL','kurumsal',NULL,NULL),


  ('cati0711-1111-4111-8111-cati00000711','aaaa7001-1111-4111-8111-aaaaaaaa7001','en','Corporate','corporate',NULL,NULL),

  ('cati0721-1111-4111-8111-cati00000721','aaaa7001-1111-4111-8111-aaaaaaaa7001','de','UNTERNEHMEN','unternehmen',NULL,NULL),

  -- ==========================================================
  -- LEGAL (Yeni module_key = 'legal')
  -- ==========================================================
  ('cati0731-1111-4111-8111-cati00000731','aaaa7101-1111-4111-8111-aaaaaaaa7101','tr','YASAL & KVKK','yasal-ve-kvkk',NULL,NULL),
  ('cati0732-1111-4111-8111-cati00000732','aaaa7101-1111-4111-8111-aaaaaaaa7101','en','Legal & Compliance','legal-and-compliance',NULL,NULL),
  ('cati0733-1111-4111-8111-cati00000733','aaaa7101-1111-4111-8111-aaaaaaaa7101','de','RECHTLICHES & DATENSCHUTZ','rechtliches-und-datenschutz',NULL,NULL),

  -- ==========================================================
  -- SERVICES
  -- ==========================================================
  ('cati0801-1111-4111-8111-cati00000801','aaaa8001-1111-4111-8111-aaaaaaaa8001','tr','HİZMETLER','hizmetler',
    'Ensotek, su soğutma kuleleri için bakım ve onarım, modernizasyon, yedek parça tedariki, uygulamalar ve mühendislik desteği sunar.',
    NULL
  ),
  ('cati0811-1111-4111-8111-cati00000811','aaaa8001-1111-4111-8111-aaaaaaaa8001','en','Services','services',
    'Ensotek provides maintenance and repair, modernization, spare parts, applications and engineering support for industrial cooling towers.',
    NULL
  ),
  ('cati0821-1111-4111-8111-cati00000821','aaaa8001-1111-4111-8111-aaaaaaaa8001','de','DIENSTLEISTUNGEN','dienstleistungen',
    'Ensotek bietet Wartung und Reparatur, Modernisierung, Ersatzteile, Anwendungen und Engineering-Support für industrielle Kühltürme.',
    NULL
  ),

  -- ==========================================================
  -- FAQ
  -- ==========================================================
  ('cati0901-1111-4111-8111-cati00000901','aaaa9001-1111-4111-8111-aaaaaaaa9001','tr','SIKÇA SORULAN SORULAR','sikca-sorulan-sorular',NULL,NULL),
  ('cati0911-1111-4111-8111-cati00000911','aaaa9001-1111-4111-8111-aaaaaaaa9001','en','Frequently Asked Questions','frequently-asked-questions',NULL,NULL),
  ('cati0921-1111-4111-8111-cati00000921','aaaa9001-1111-4111-8111-aaaaaaaa9001','de','HÄUFIG GESTELLTE FRAGEN','haeufig-gestellte-fragen',NULL,NULL),

  -- ==========================================================
  -- TEAM
  -- ==========================================================
  ('cati9101-1111-4111-8111-cati00009101','aaaa9101-1111-4111-8111-aaaaaaaa9101','tr','EKİBİMİZ','ekibimiz',
    'Ensotek mühendislik, proje, saha ve servis ekiplerinden oluşan uzman kadromuz.',
    NULL
  ),
  ('cati9111-1111-4111-8111-cati00009111','aaaa9101-1111-4111-8111-aaaaaaaa9101','en','Our Team','our-team',
    'Our expert team consisting of engineering, project, field and service professionals at Ensotek.',
    NULL
  ),
  ('cati9121-1111-4111-8111-cati00009121','aaaa9101-1111-4111-8111-aaaaaaaa9101','de','UNSER TEAM','unser-team',
    'Unser Expertenteam bei Ensotek besteht aus Fachkräften aus Engineering, Projektleitung, Außendienst und Service.',
    NULL
  )
ON DUPLICATE KEY UPDATE
  `category_id`    = VALUES(`category_id`),
  `locale`         = VALUES(`locale`),
  `name`           = VALUES(`name`),
  `slug`           = VALUES(`slug`),
  `description`    = VALUES(`description`),
  `alt`            = VALUES(`alt`);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
