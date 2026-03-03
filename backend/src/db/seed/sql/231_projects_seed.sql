-- =============================================================
-- 231_projects_seed.sql
-- Ensotek referans proje kayıtları (parent tablo)
-- Kaynak: LinkedIn paylaşımları + ensotek.com ana sayfa galerileri
--         + referans müşteri listesi
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

-- -------------------------------------------------------------
-- UUID tanımları (referans olarak — i18n dosyalarında tekrar kullanılır)
-- Proje prefix: 33333xxx-00NN-4333-8333-333300000NNN
-- -------------------------------------------------------------

INSERT INTO `projects`
(
  id,
  is_published, is_featured, display_order,
  featured_image, featured_image_asset_id,
  category, product_type, location, client_name,
  unit_count, fan_count,
  start_date, complete_date, completion_time_label,
  services, website_url, youtube_url, techs,
  created_at, updated_at
)
VALUES

-- ============================================================
-- 1. İstanbul Plaza — 2 adet, 2 fanlı, CTP Kaportalı Açık Tip, 130m çatı
--    (LinkedIn paylaşımı — İstanbul Fab yapımı)
-- ============================================================
(
  '33333001-0001-4333-8333-333300000001',
  1, 1, 10,
  'https://www.ensotek.com/upload/17/water-cooling-towers-su-sogutma-kuleleri.jpg', NULL,
  'Su Soğutma Kulesi', 'CTP Kaportalı Açık Tip', 'İstanbul', NULL,
  2, 2,
  NULL, '2024-01-01', 'Plaza çatısı · 130 m yükseklik',
  '["Açık devre soğutma","FRP kapor","Çatı montajı","Yükseklik projelendirme"]',
  NULL, NULL,
  '["CTP","FRP","GRP","HVAC","Açık Tip","Su Soğutma"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 2. Kahramanmaraş Sanayi Tesisi — CTP Kaportalı Açık Tip
--    (LinkedIn paylaşımı — Ankara Fab yapımı)
-- ============================================================
(
  '33333001-0002-4333-8333-333300000002',
  1, 0, 20,
  'https://www.ensotek.com/upload/17/ensotek-su-sogutma-kulesi-ensotek-water-cooling-towers.jpg', NULL,
  'Su Soğutma Kulesi', 'CTP Kaportalı Açık Tip', 'Kahramanmaraş', NULL,
  NULL, NULL,
  NULL, '2024-01-01', 'Ankara Fabrika üretimi',
  '["Açık devre soğutma","FRP kapor","Endüstriyel soğutma"]',
  NULL, NULL,
  '["CTP","FRP","GRP","HVAC","Açık Tip","Su Soğutma"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 3. Arçelik — 2× CTP 6C
--    (ensotek.com ana sayfa galeri)
-- ============================================================
(
  '33333001-0003-4333-8333-333300000003',
  1, 1, 30,
  'https://www.ensotek.com/upload/17/water-cooling-towers-su-sogutma-kuleleri.jpg', NULL,
  'Su Soğutma Kulesi', 'CTP 6C — Açık Tip', 'Gebze, Kocaeli', 'Arçelik A.Ş.',
  2, 2,
  NULL, NULL, '2× CTP 6C ünite',
  '["Açık devre soğutma","Endüstriyel soğutma","Montaj ve devreye alma"]',
  'https://www.arcelik.com.tr', NULL,
  '["CTP","FRP","GRP","HVAC","Açık Tip","Endüstriyel"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 4. Eczacıbaşı — 3× DCTP 5C (Kapalı Tip)
--    (ensotek.com ana sayfa galeri)
-- ============================================================
(
  '33333001-0004-4333-8333-333300000004',
  1, 1, 40,
  'https://www.ensotek.com/upload/17/ensotek-su-sogutma-kulesi-ensotek-water-cooling-towers.jpg', NULL,
  'Su Soğutma Kulesi', 'DCTP 5C — Kapalı Devre', 'İstanbul', 'Eczacıbaşı',
  3, 3,
  NULL, NULL, '3× DCTP 5C ünite',
  '["Kapalı devre soğutma","İlaç & kimya soğutma","Serpantinli ısı değiştirici"]',
  'https://www.eczacibasi.com.tr', NULL,
  '["DCTP","FRP","Kapalı Devre","Serpantin","HVAC"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 5. Linde Gaz — TCTP 26B (3 ünite) + DCTP 12C — Gebze
--    (ensotek.com ana sayfa galeri)
-- ============================================================
(
  '33333001-0005-4333-8333-333300000005',
  1, 1, 50,
  'https://www.ensotek.com/upload/9/tctp-26.jpg', NULL,
  'Proses Soğutma', 'TCTP 26B + DCTP 12C — Kapalı Devre', 'Gebze, Kocaeli', 'Linde Gaz Türkiye',
  4, 4,
  NULL, NULL, '3× TCTP 26B + 1× DCTP 12C',
  '["Kapalı devre soğutma","Proses gazı soğutma","Endüstriyel servis soğutma","Yüksek kapasite proje"]',
  'https://www.linde.com.tr', NULL,
  '["TCTP","DCTP","FRP","Kapalı Devre","Proses Soğutma","Gaz Endüstrisi"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 6. HES Kablo — DCTP 12 + DCTP 12C (Kapalı Tip + merdiven aksesuarlı)
--    (ensotek.com ana sayfa galeri)
-- ============================================================
(
  '33333001-0006-4333-8333-333300000006',
  1, 0, 60,
  'https://www.ensotek.com/upload/17/water-cooling-towers-su-sogutma-kuleleri.jpg', NULL,
  'Su Soğutma Kulesi', 'DCTP 12 + DCTP 12C — Kapalı Devre', NULL, 'HES Kablo',
  2, 2,
  NULL, NULL, 'DCTP 12 (merdiven aksesuarlı) + DCTP 12C',
  '["Kapalı devre soğutma","Kablo üretim soğutma","Özel aksesuar montajı"]',
  NULL, NULL,
  '["DCTP","FRP","Kapalı Devre","Özel Aksesuar"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 7. Green Park Otel — 2× CTP 3C (Açık Tip)
--    (ensotek.com ana sayfa galeri)
-- ============================================================
(
  '33333001-0007-4333-8333-333300000007',
  1, 0, 70,
  'https://www.ensotek.com/upload/17/ensotek-su-sogutma-kulesi-ensotek-water-cooling-towers.jpg', NULL,
  'HVAC & Konaklama', 'CTP 3C — Açık Tip', NULL, 'Green Park Hotels',
  2, 2,
  NULL, NULL, '2× CTP 3C ünite',
  '["Otel soğutma","HVAC soğutma","Sessiz çalışma","Estetik tasarım"]',
  NULL, NULL,
  '["CTP","FRP","HVAC","Açık Tip","Otel","Konaklama"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 8. Orion AVM — TCTP 9C (Kapalı Tip)
--    (ensotek.com ana sayfa galeri)
-- ============================================================
(
  '33333001-0008-4333-8333-333300000008',
  1, 0, 80,
  'https://www.ensotek.com/upload/17/water-cooling-towers-su-sogutma-kuleleri.jpg', NULL,
  'HVAC & Ticari', 'TCTP 9C — Kapalı Devre', NULL, 'Orion AVM',
  1, 1,
  NULL, NULL, '1× TCTP 9C',
  '["AVM soğutma","Kapalı devre HVAC","Yıl boyu soğutma hizmeti"]',
  NULL, NULL,
  '["TCTP","FRP","Kapalı Devre","HVAC","AVM"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 9. Plastifay — CTP 9 (Açık Tip)
--    (ensotek.com ana sayfa galeri)
-- ============================================================
(
  '33333001-0009-4333-8333-333300000009',
  1, 0, 90,
  'https://www.ensotek.com/upload/17/ensotek-su-sogutma-kulesi-ensotek-water-cooling-towers.jpg', NULL,
  'Su Soğutma Kulesi', 'CTP 9 — Açık Tip', NULL, 'Plastifay',
  1, 1,
  NULL, NULL, '1× CTP 9',
  '["Açık devre soğutma","Plastik sektörü soğutma","Proses soğutma"]',
  NULL, NULL,
  '["CTP","FRP","Açık Tip","Proses Soğutma"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 10. Aves Yağ — TCTP 9B + DCTP 9B — Mersin
--     (ensotek.com ana sayfa galeri)
-- ============================================================
(
  '33333001-0010-4333-8333-333300000010',
  1, 0, 100,
  'https://www.ensotek.com/upload/17/water-cooling-towers-su-sogutma-kuleleri.jpg', NULL,
  'Gıda & Proses Soğutma', 'TCTP 9B + DCTP 9B — Kapalı Devre', 'Mersin', 'Aves Yağ',
  2, 2,
  NULL, NULL, 'TCTP 9B + DCTP 9B kombine sistem',
  '["Gıda üretimi soğutma","Yağ proses soğutma","Kombine soğutma sistemi","Kapalı devre"]',
  NULL, NULL,
  '["TCTP","DCTP","FRP","Kapalı Devre","Gıda Sektörü","Proses Soğutma"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 11. TAT Tekstil — Gaziantep
--     (ensotek.com galeri: TAT Tekstil Gaziantep fotoğrafları)
-- ============================================================
(
  '33333001-0011-4333-8333-333300000011',
  1, 0, 110,
  'https://www.ensotek.com/upload/17/ensotek-su-sogutma-kulesi-ensotek-water-cooling-towers.jpg', NULL,
  'Su Soğutma Kulesi', 'CTP Kaportalı Açık Tip', 'Gaziantep', 'TAT Tekstil',
  NULL, NULL,
  NULL, NULL, 'Tekstil fabrikası soğutma sistemi',
  '["Tekstil endüstrisi soğutma","Proses soğutma","Süreç sıcaklık kontrolü"]',
  NULL, NULL,
  '["CTP","FRP","GRP","Açık Tip","Tekstil Sektörü"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 12. Suudi Arabistan — Uluslararası Endüstriyel Proje
--     (ensotek.com galeri: Saudi Arabia fotoğrafları)
-- ============================================================
(
  '33333001-0012-4333-8333-333300000012',
  1, 1, 120,
  'https://www.ensotek.com/upload/17/water-cooling-towers-su-sogutma-kuleleri.jpg', NULL,
  'Su Soğutma Kulesi', 'FRP / GRP Açık Tip', 'Suudi Arabistan', NULL,
  NULL, NULL,
  NULL, NULL, 'Uluslararası ihracat projesi',
  '["İhracat projesi","Endüstriyel soğutma","Çöl iklimi","Yüksek kapasite"]',
  NULL, NULL,
  '["FRP","GRP","CTP","Uluslararası","İhracat","Açık Tip"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 13. İran — Uluslararası Endüstriyel Proje
--     (ensotek.com galeri: Iran fotoğrafları)
-- ============================================================
(
  '33333001-0013-4333-8333-333300000013',
  1, 0, 130,
  'https://www.ensotek.com/upload/17/ensotek-su-sogutma-kulesi-ensotek-water-cooling-towers.jpg', NULL,
  'Su Soğutma Kulesi', 'FRP / GRP Açık Tip', 'İran', NULL,
  NULL, NULL,
  NULL, NULL, 'Uluslararası ihracat projesi',
  '["İhracat projesi","Endüstriyel soğutma","Proses soğutma"]',
  NULL, NULL,
  '["FRP","GRP","CTP","Uluslararası","İhracat"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 14. Tüpraş — İzmit Rafinerisi
--     (Ensotek referans müşteri: Tüpraş)
-- ============================================================
(
  '33333001-0014-4333-8333-333300000014',
  1, 1, 140,
  'https://www.ensotek.com/upload/17/water-cooling-towers-su-sogutma-kuleleri.jpg', NULL,
  'Proses Soğutma', 'FRP / GRP Açık & Kapalı Tip', 'İzmit, Kocaeli', 'Tüpraş',
  NULL, NULL,
  NULL, NULL, 'Rafineri proses soğutma sistemi',
  '["Rafineri soğutma","Proses soğutma","Yüksek sıcaklık toleransı","Petrokimya soğutma"]',
  'https://www.tupras.com.tr', NULL,
  '["FRP","GRP","CTP","Proses Soğutma","Rafineri","Petrokimya"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 15. TOFAS — Bursa Otomotiv Tesisi
--     (Ensotek referans müşteri: TOFAS)
-- ============================================================
(
  '33333001-0015-4333-8333-333300000015',
  1, 1, 150,
  'https://www.ensotek.com/upload/17/ensotek-su-sogutma-kulesi-ensotek-water-cooling-towers.jpg', NULL,
  'Su Soğutma Kulesi', 'CTP Kaportalı Açık Tip', 'Bursa', 'TOFAS',
  NULL, NULL,
  NULL, NULL, 'Otomotiv fabrikası soğutma sistemi',
  '["Otomotiv endüstrisi soğutma","Boya & kalıp soğutma","Yüksek debili soğutma sistemi"]',
  'https://www.tofas.com.tr', NULL,
  '["CTP","FRP","GRP","HVAC","Açık Tip","Otomotiv"]',
  NOW(3), NOW(3)
);

COMMIT;
