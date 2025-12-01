-- 062_catalog_subcategories.sql
-- Alt Kategoriler - FINAL (çoklu dil, locale = 'tr')

START TRANSACTION;

INSERT INTO sub_categories
  (
    id,
    category_id,
    locale,
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
  -- PRODUCT: MEZAR MODELLERİ
  -- =====================
  ('bbbb0001-1111-4111-8111-bbbbbbbb0001', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'tr',
    'Tek Kişilik Mezarlar', 'tek-kisilik-mezarlar',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('bbbb0002-1111-4111-8111-bbbbbbbb0002', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'tr',
    'Çift Kişilik Mezarlar', 'cift-kisilik-mezarlar',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),
  ('bbbb0003-1111-4111-8111-bbbbbbbb0003', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'tr',
    'Aile Mezarları', 'aile-mezarlari',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 30
  ),
  ('bbbb0004-1111-4111-8111-bbbbbbbb0004', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'tr',
    'Granit Mezar Modelleri', 'granit-mezar-modelleri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 40
  ),
  ('bbbb0005-1111-4111-8111-bbbbbbbb0005', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'tr',
    'Mermer Mezar Modelleri', 'mermer-mezar-modelleri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 50
  ),

  -- =====================
  -- PRODUCT: MEZAR BAŞ TAŞI MODELLERİ
  -- =====================
  ('bbbb0101-1111-4111-8111-bbbbbbbb0101', 'aaaa0002-1111-4111-8111-aaaaaaaa0002', 'tr',
    'Klasik Baş Taşı', 'klasik-bas-tasi',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('bbbb0102-1111-4111-8111-bbbbbbbb0102', 'aaaa0002-1111-4111-8111-aaaaaaaa0002', 'tr',
    'Modern Baş Taşı', 'modern-bas-tasi',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),
  ('bbbb0103-1111-4111-8111-bbbbbbbb0103', 'aaaa0002-1111-4111-8111-aaaaaaaa0002', 'tr',
    'Özel Tasarım Baş Taşı', 'ozel-tasarim-bas-tasi',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 30
  ),

  -- =====================
  -- PRODUCT: MEZAR AKSESUARLARI
  -- =====================
  ('bbbb0201-1111-4111-8111-bbbbbbbb0201', 'aaaa0003-1111-4111-8111-aaaaaaaa0003', 'tr',
    'Vazo Modelleri', 'vazo-modelleri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('bbbb0202-1111-4111-8111-bbbbbbbb0202', 'aaaa0003-1111-4111-8111-aaaaaaaa0003', 'tr',
    'Fener ve Aydınlatma', 'fener-aydinlatma',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),
  ('bbbb0203-1111-4111-8111-bbbbbbbb0203', 'aaaa0003-1111-4111-8111-aaaaaaaa0003', 'tr',
    'Süsleme Aksesuarları', 'susleme-aksesuarlari',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 30
  ),

  -- =====================
  -- PRODUCT: MEZAR ÇİÇEKLENDİRME
  -- =====================
  ('bbbb0301-1111-4111-8111-bbbbbbbb0301', 'aaaa0004-1111-4111-8111-aaaaaaaa0004', 'tr',
    'Canlı Çiçek Uygulamaları', 'canli-cicek-uygulamalari',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('bbbb0302-1111-4111-8111-bbbbbbbb0302', 'aaaa0004-1111-4111-8111-aaaaaaaa0004', 'tr',
    'Yapay Çiçek Düzenlemeleri', 'yapay-cicek-duzenlemeleri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),
  ('bbbb0303-1111-4111-8111-bbbbbbbb0303', 'aaaa0004-1111-4111-8111-aaaaaaaa0004', 'tr',
    'Kalıcı Peyzaj Çözümleri', 'kalici-peyzaj-cozumleri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 30
  ),

  -- =====================
  -- PRODUCT: MEZAR TOPRAK DOLUMU
  -- =====================
  ('bbbb0401-1111-4111-8111-bbbbbbbb0401', 'aaaa0005-1111-4111-8111-aaaaaaaa0005', 'tr',
    'Standart Toprak Dolumu', 'standart-toprak-dolumu',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('bbbb0402-1111-4111-8111-bbbbbbbb0402', 'aaaa0005-1111-4111-8111-aaaaaaaa0005', 'tr',
    'Bitki Toprağı Dolumu', 'bitki-topragi-dolumu',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),

  -- =====================
  -- SPAREPART: YEDEK PARÇA KATEGORİLERİ
  -- =====================
  ('bbbb1001-1111-4111-8111-bbbbbbbb1001', 'aaaa1001-1111-4111-8111-aaaaaaaa1001', 'tr',
    'Elektrik Aksamı', 'elektrik-aksami',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('bbbb1002-1111-4111-8111-bbbbbbbb1002', 'aaaa1001-1111-4111-8111-aaaaaaaa1001', 'tr',
    'Mekanik Parçalar', 'mekanik-parcalar',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),
  ('bbbb1003-1111-4111-8111-bbbbbbbb1003', 'aaaa1001-1111-4111-8111-aaaaaaaa1001', 'tr',
    'Montaj Aksesuarları', 'montaj-aksesuarlari',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 30
  ),

  -- =====================
  -- NEWS: GENEL HABERLER (aaaa2001)
  -- =====================
  ('bbbb2001-1111-4111-8111-bbbbbbbb2001', 'aaaa2001-1111-4111-8111-aaaaaaaa2001', 'tr',
    'Duyurular', 'duyurular',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('bbbb2002-1111-4111-8111-bbbbbbbb2002', 'aaaa2001-1111-4111-8111-aaaaaaaa2001', 'tr',
    'Basın Bültenleri', 'basin-bultenleri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),
  ('bbbb2003-1111-4111-8111-bbbbbbbb2003', 'aaaa2001-1111-4111-8111-aaaaaaaa2001', 'tr',
    'Sektör Haberleri', 'sektor-haberleri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 30
  ),

  -- =====================
  -- NEWS: ŞİRKET HABERLERİ (aaaa2002)
  -- =====================
  ('bbbb2101-1111-4111-8111-bbbbbbbb2101', 'aaaa2002-1111-4111-8111-aaaaaaaa2002', 'tr',
    'Yeni Projeler', 'yeni-projeler',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('bbbb2102-1111-4111-8111-bbbbbbbb2102', 'aaaa2002-1111-4111-8111-aaaaaaaa2002', 'tr',
    'Ödül ve Başarılar', 'odul-ve-basarilar',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),

  -- =====================
  -- NEWS: DUYURULAR (aaaa2003)
  -- =====================
  ('bbbb2201-1111-4111-8111-bbbbbbbb2201', 'aaaa2003-1111-4111-8111-aaaaaaaa2003', 'tr',
    'Genel Duyurular', 'genel-duyurular',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('bbbb2202-1111-4111-8111-bbbbbbbb2202', 'aaaa2003-1111-4111-8111-aaaaaaaa2003', 'tr',
    'Bakım / Servis Duyuruları', 'bakim-servis-duyurulari',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),

  -- =====================
  -- NEWS: BASINDA BİZ (aaaa2004)
  -- =====================
  ('bbbb2301-1111-4111-8111-bbbbbbbb2301', 'aaaa2004-1111-4111-8111-aaaaaaaa2004', 'tr',
    'Gazete & Dergi', 'gazete-dergi',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('bbbb2302-1111-4111-8111-bbbbbbbb2302', 'aaaa2004-1111-4111-8111-aaaaaaaa2004', 'tr',
    'Online Haberler', 'online-haberler',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),

  -- =====================
  -- BLOG: GENEL BLOG YAZILARI (aaaa3001)
  -- =====================
  ('bbbb3001-1111-4111-8111-bbbbbbbb3001', 'aaaa3001-1111-4111-8111-aaaaaaaa3001', 'tr',
    'Bakım Rehberleri', 'bakim-rehberleri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('bbbb3002-1111-4111-8111-bbbbbbbb3002', 'aaaa3001-1111-4111-8111-aaaaaaaa3001', 'tr',
    'Tasarım Önerileri', 'tasarim-onerileri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),
  ('bbbb3003-1111-4111-8111-bbbbbbbb3003', 'aaaa3001-1111-4111-8111-aaaaaaaa3001', 'tr',
    'Sık Sorulan Sorular', 'sik-sorulan-sorular-blog',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 30
  ),

  -- =====================
  -- BLOG: TEKNİK YAZILAR (aaaa3002)
  -- =====================
  ('bbbb3101-1111-4111-8111-bbbbbbbb3101', 'aaaa3002-1111-4111-8111-aaaaaaaa3002', 'tr',
    'Teknik Rehberler', 'teknik-rehberler',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('bbbb3102-1111-4111-8111-bbbbbbbb3102', 'aaaa3002-1111-4111-8111-aaaaaaaa3002', 'tr',
    'Arıza Çözümleri', 'ariza-cozumleri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),

  -- =====================
  -- BLOG: SEKTÖREL YAZILAR (aaaa3003)
  -- =====================
  ('bbbb3201-1111-4111-8111-bbbbbbbb3201', 'aaaa3003-1111-4111-8111-aaaaaaaa3003', 'tr',
    'Pazar Analizi', 'pazar-analizi',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('bbbb3202-1111-4111-8111-bbbbbbbb3202', 'aaaa3003-1111-4111-8111-aaaaaaaa3003', 'tr',
    'Trendler & Gelişmeler', 'trendler-gelismeler',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),

  -- =====================
  -- BLOG: GENEL YAZILAR (aaaa3004)
  -- =====================
  ('bbbb3301-1111-4111-8111-bbbbbbbb3301', 'aaaa3004-1111-4111-8111-aaaaaaaa3004', 'tr',
    'Genel Rehberler', 'genel-rehberler',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('bbbb3302-1111-4111-8111-bbbbbbbb3302', 'aaaa3004-1111-4111-8111-aaaaaaaa3004', 'tr',
    'İlham Veren Hikayeler', 'ilham-veren-hikayeler',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),

  -- =====================
  -- SLIDER: ANA SLIDER
  -- =====================
  ('bbbb4001-1111-4111-8111-bbbbbbbb4001', 'aaaa4001-1111-4111-8111-aaaaaaaa4001', 'tr',
    'Ana Sayfa Sliderı', 'ana-sayfa-slideri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('bbbb4002-1111-4111-8111-bbbbbbbb4002', 'aaaa4001-1111-4111-8111-aaaaaaaa4001', 'tr',
    'Kampanya Sliderı', 'kampanya-slideri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),

  -- =====================
  -- REFERENCES: REFERANSLAR
  -- =====================
  ('bbbb5001-1111-4111-8111-bbbbbbbb5001', 'aaaa5001-1111-4111-8111-aaaaaaaa5001', 'tr',
    'Bireysel Referanslar', 'bireysel-referanslar',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('bbbb5002-1111-4111-8111-bbbbbbbb5002', 'aaaa5001-1111-4111-8111-aaaaaaaa5001', 'tr',
    'Kurumsal Referanslar', 'kurumsal-referanslar',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),

  -- =====================
  -- LIBRARY: DÖKÜMAN KÜTÜPHANESİ
  -- =====================
  ('bbbb6001-1111-4111-8111-bbbbbbbb6001', 'aaaa6001-1111-4111-8111-aaaaaaaa6001', 'tr',
    'PDF Dokümanlar', 'pdf-dokumanlar',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('bbbb6002-1111-4111-8111-bbbbbbbb6002', 'aaaa6001-1111-4111-8111-aaaaaaaa6001', 'tr',
    'Görsel Galeri', 'gorsel-galeri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),
  ('bbbb6003-1111-4111-8111-bbbbbbbb6003', 'aaaa6001-1111-4111-8111-aaaaaaaa6001', 'tr',
    'Video İçerikler', 'video-icerikler',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 30
  ),

  -- =====================
  -- ABOUT: KURUMSAL
  -- =====================
  ('bbbb7001-1111-4111-8111-bbbbbbbb7001', 'aaaa7001-1111-4111-8111-aaaaaaaa7001', 'tr',
    'Hakkımızda', 'hakkimizda',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('bbbb7002-1111-4111-8111-bbbbbbbb7002', 'aaaa7001-1111-4111-8111-aaaaaaaa7001', 'tr',
    'Misyon & Vizyon', 'misyon-vizyon',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),
  ('bbbb7003-1111-4111-8111-bbbbbbbb7003', 'aaaa7001-1111-4111-8111-aaaaaaaa7001', 'tr',
    'İnsan Kaynakları', 'insan-kaynaklari',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 30
  ),

  -- =====================
  -- SERVICES: HİZMETLER
  -- =====================
  ('bbbb8001-1111-4111-8111-bbbbbbbb8001', 'aaaa8001-1111-4111-8111-aaaaaaaa8001', 'tr',
    'Bakım Hizmetleri', 'bakim-hizmetleri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 10
  ),
  ('bbbb8002-1111-4111-8111-bbbbbbbb8002', 'aaaa8001-1111-4111-8111-aaaaaaaa8001', 'tr',
    'Temizlik Hizmetleri', 'temizlik-hizmetleri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 20
  ),
  ('bbbb8003-1111-4111-8111-bbbbbbbb8003', 'aaaa8001-1111-4111-8111-aaaaaaaa8001', 'tr',
    'Peyzaj Hizmetleri', 'peyzaj-hizmetleri',
    NULL, NULL, NULL, NULL, NULL,
    1, 0, 30
  )

ON DUPLICATE KEY UPDATE
  -- category_id + locale + slug unique; mevcutsa sadece güvenli alanları güncelle
  name          = VALUES(name),
  locale        = VALUES(locale),
  description   = VALUES(description),
  is_active     = VALUES(is_active),
  is_featured   = VALUES(is_featured),
  display_order = VALUES(display_order);

COMMIT;
