-- 011_catalog_categories.sql
-- Kategoriler (üst) - FINAL (çoklu dil + module_key hizalı)

START TRANSACTION;

-- =========================
-- CATEGORIES (TOP LEVEL)
-- =========================
INSERT INTO categories
  (
    id,
    locale,
    module_key,
    name,
    slug,
    description,
    image_url,
    storage_asset_id,
    alt,
    icon,
    is_active,
    is_featured,
    display_order
  )
VALUES
  -- =====================
  -- PRODUCT modülü (mezar sitesi için)
  -- =====================
  ('aaaa0001-1111-4111-8111-aaaaaaaa0001', 'tr', 'product',
    'MEZAR MODELLERİ', 'mezar-modelleri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('aaaa0002-1111-4111-8111-aaaaaaaa0002', 'tr', 'product',
    'MEZAR BAŞ TAŞI MODELLERİ', 'mezar-bas-tasi-modelleri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),
  ('aaaa0003-1111-4111-8111-aaaaaaaa0003', 'tr', 'product',
    'MEZAR AKSESUARLARI', 'mezar-aksesuarlari',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 30
  ),
  ('aaaa0004-1111-4111-8111-aaaaaaaa0004', 'tr', 'product',
    'MEZAR ÇİÇEKLENDİRME', 'mezar-ciceklendirme',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 40
  ),
  ('aaaa0005-1111-4111-8111-aaaaaaaa0005', 'tr', 'product',
    'MEZAR TOPRAK DOLUMU', 'mezar-toprak-dolumu',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 50
  ),

  -- =====================
  -- SPAREPART modülü
  -- =====================
  ('aaaa1001-1111-4111-8111-aaaaaaaa1001', 'tr', 'sparepart',
    'YEDEK PARÇA KATEGORİLERİ', 'yedek-parca-kategorileri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),

  -- =====================
  -- NEWS modülü (genel + detay)
  -- =====================
  ('aaaa2001-1111-4111-8111-aaaaaaaa2001', 'tr', 'news',
    'GENEL HABERLER', 'genel-haberler',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('aaaa2002-1111-4111-8111-aaaaaaaa2002', 'tr', 'news',
    'ŞİRKET HABERLERİ', 'sirket-haberleri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),
  ('aaaa2003-1111-4111-8111-aaaaaaaa2003', 'tr', 'news',
    'DUYURULAR', 'duyurular',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 30
  ),
  ('aaaa2004-1111-4111-8111-aaaaaaaa2004', 'tr', 'news',
    'BASINDA BİZ', 'basinda-biz',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 40
  ),

  -- =====================
  -- BLOG modülü (genel + detay)
  -- =====================
  ('aaaa3001-1111-4111-8111-aaaaaaaa3001', 'tr', 'blog',
    'GENEL BLOG YAZILARI', 'genel-blog-yazilari',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('aaaa3002-1111-4111-8111-aaaaaaaa3002', 'tr', 'blog',
    'TEKNİK YAZILAR', 'teknik-yazilar',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),
  ('aaaa3003-1111-4111-8111-aaaaaaaa3003', 'tr', 'blog',
    'SEKTÖREL YAZILAR', 'sektorel-yazilar',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 30
  ),
  ('aaaa3004-1111-4111-8111-aaaaaaaa3004', 'tr', 'blog',
    'GENEL YAZILAR', 'genel-yazilar',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 40
  ),

  -- =====================
  -- SLIDER modülü
  -- =====================
  ('aaaa4001-1111-4111-8111-aaaaaaaa4001', 'tr', 'slider',
    'ANA SLIDER', 'ana-slider',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),

  -- =====================
  -- REFERENCES modülü (sektörel)
  -- =====================
  ('aaaa5001-1111-4111-8111-aaaaaaaa5001', 'tr', 'references',
    'REFERANSLAR', 'referanslar',
    NULL, NULL, NULL, NULL, NULL,
    1, 1, 10
  ),
  ('aaaa5002-1111-4111-8111-aaaaaaaa5002', 'tr', 'references',
    'ENERJİ SANTRALLERİ', 'enerji-santralleri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),
  ('aaaa5003-1111-4111-8111-aaaaaaaa5003', 'tr', 'references',
    'PETROKİMYA & KİMYA TESİSLERİ', 'petrokimya-kimya-tesisleri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 30
  ),
  ('aaaa5004-1111-4111-8111-aaaaaaaa5004', 'tr', 'references',
    'ÇİMENTO & MADENCİLİK', 'cimento-madencilik',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 40
  ),
  ('aaaa5005-1111-4111-8111-aaaaaaaa5005', 'tr', 'references',
    'GIDA & İÇECEK TESİSLERİ', 'gida-icecek-tesisleri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 50
  ),
  ('aaaa5006-1111-4111-8111-aaaaaaaa5006', 'tr', 'references',
    'ÇELİK & METAL SANAYİ', 'celik-metal-sanayi',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 60
  ),
  ('aaaa5007-1111-4111-8111-aaaaaaaa5007', 'tr', 'references',
    'OTOMOTİV & YAN SANAYİ', 'otomotiv-yan-sanayi',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 70
  ),
  ('aaaa5008-1111-4111-8111-aaaaaaaa5008', 'tr', 'references',
    'AVM & TİCARİ BİNALAR', 'avm-ticari-binalar',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 80
  ),
  ('aaaa5009-1111-4111-8111-aaaaaaaa5009', 'tr', 'references',
    'VERİ MERKEZİ & HASTANE', 'veri-merkezi-hastane',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 90
  ),
  ('aaaa5010-1111-4111-8111-aaaaaaaa5010', 'tr', 'references',
    'DİĞER PROJELER', 'diger-projeler',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 100
  ),

  -- =====================
  -- LIBRARY modülü (doküman/medya)
  -- =====================
  ('aaaa6001-1111-4111-8111-aaaaaaaa6001', 'tr', 'library',
    'DÖKÜMAN KÜTÜPHANESİ', 'dokuman-kutuphanesi',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),

  -- =====================
  -- ABOUT modülü (kurumsal sayfalar)
  -- =====================
  ('aaaa7001-1111-4111-8111-aaaaaaaa7001', 'tr', 'about',
    'KURUMSAL', 'kurumsal',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('aaaa7002-1111-4111-8111-aaaaaaaa7002', 'tr', 'about',
    'HAKKIMIZDA', 'hakkimizda',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),
  ('aaaa7003-1111-4111-8111-aaaaaaaa7003', 'tr', 'about',
    'MİSYONUMUZ', 'misyonumuz',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 30
  ),
  ('aaaa7004-1111-4111-8111-aaaaaaaa7004', 'tr', 'about',
    'VİZYONUMUZ', 'vizyonumuz',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 40
  ),

  -- =====================
  -- SERVICES modülü
  -- =====================
  ('aaaa8001-1111-4111-8111-aaaaaaaa8001', 'tr', 'services',
    'HİZMETLER', 'hizmetler',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  )

ON DUPLICATE KEY UPDATE
  -- id aynı kalır; slug+locale+module_key unique olduğu için
  name          = VALUES(name),
  locale        = VALUES(locale),
  module_key    = VALUES(module_key),
  description   = VALUES(description),
  is_active     = VALUES(is_active),
  is_featured   = VALUES(is_featured),
  display_order = VALUES(display_order);

COMMIT;
