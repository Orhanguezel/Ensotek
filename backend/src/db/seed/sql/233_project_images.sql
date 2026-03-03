-- =============================================================
-- 233_project_images.sql
-- Ensotek proje galeri görselleri
-- Kaynak: ensotek.com/upload/ CDN (gerçek proje fotoğrafları)
-- =============================================================
-- UUID kalıpları:
--   project_images:       77777001-00NN-4777-8777-77770000NNNN
--   asset_id (placeholder): a0000001-00NN-4a00-8a00-a00000000NNN
--   images_i18n TR:       88881001-00NN-4888-8888-888810000NNN
--   images_i18n EN:       88882001-00NN-4888-8888-888820000NNN
--   images_i18n DE:       88883001-00NN-4888-8888-888830000NNN
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

-- =============================================================
-- 1. project_images  (27 görsel, 15 proje)
-- =============================================================

INSERT INTO `project_images`
  (id, project_id, asset_id, image_url, display_order, is_active, created_at, updated_at)
VALUES

-- ---- Proje 01 — İstanbul Plaza (CTP Kaportalı Açık Tip, 130 m çatı) --------
('77777001-0001-4777-8777-777700000001',
 '33333001-0001-4333-8333-333300000001',
 'a0000001-0001-4a00-8a00-a00000000001',
 'https://www.ensotek.com/upload/18/fabrika-gece-foto-1920x1080x50.jpg',
 10, 1, NOW(3), NOW(3)),

('77777001-0002-4777-8777-777700000002',
 '33333001-0001-4333-8333-333300000001',
 'a0000001-0002-4a00-8a00-a00000000002',
 'https://www.ensotek.com/upload/18/ensotek-sogutma-kulesi-ankara-gorsel-1.jpeg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 02 — Kahramanmaraş (Ankara Fab üretimi) -------------------------
('77777001-0003-4777-8777-777700000003',
 '33333001-0002-4333-8333-333300000002',
 'a0000001-0003-4a00-8a00-a00000000003',
 'https://www.ensotek.com/upload/18/ensok-sigutma-kulesi-fabrika-245x163.jpg',
 10, 1, NOW(3), NOW(3)),

('77777001-0004-4777-8777-777700000004',
 '33333001-0002-4333-8333-333300000002',
 'a0000001-0004-4a00-8a00-a00000000004',
 'https://www.ensotek.com/upload/11/5a-1-1920x1080x50.jpg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 03 — Arçelik (2× CTP 6C, Gebze) --------------------------------
('77777001-0005-4777-8777-777700000005',
 '33333001-0003-4333-8333-333300000003',
 'a0000001-0005-4a00-8a00-a00000000005',
 'https://www.ensotek.com/upload/12/arcelik-2-x-ctp-6c.jpg',
 10, 1, NOW(3), NOW(3)),

('77777001-0006-4777-8777-777700000006',
 '33333001-0003-4333-8333-333300000003',
 'a0000001-0006-4a00-8a00-a00000000006',
 'https://www.ensotek.com/upload/11/2-x-ctp-6c-250x250-1.jpg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 04 — Eczacıbaşı (3× DCTP 5C, İstanbul) -------------------------
('77777001-0007-4777-8777-777700000007',
 '33333001-0004-4333-8333-333300000004',
 'a0000001-0007-4a00-8a00-a00000000007',
 'https://www.ensotek.com/upload/17/eczacibasi-3xdctp-5c.jpg',
 10, 1, NOW(3), NOW(3)),

('77777001-0008-4777-8777-777700000008',
 '33333001-0004-4333-8333-333300000004',
 'a0000001-0008-4a00-8a00-a00000000008',
 'https://www.ensotek.com/upload/12/dctp-55c-gri-250x250-1.jpg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 05 — Linde Gaz (3× TCTP 26B + DCTP 12C, Gebze) -----------------
('77777001-0009-4777-8777-777700000009',
 '33333001-0005-4333-8333-333300000005',
 'a0000001-0009-4a00-8a00-a00000000009',
 'https://www.ensotek.com/upload/17/linde-gaz-tctp-26b-3.jpg',
 10, 1, NOW(3), NOW(3)),

('77777001-0010-4777-8777-777700000010',
 '33333001-0005-4333-8333-333300000005',
 'a0000001-0010-4a00-8a00-a00000000010',
 'https://www.ensotek.com/upload/17/linde-gaz-gebze.jpg',
 20, 1, NOW(3), NOW(3)),

('77777001-0011-4777-8777-777700000011',
 '33333001-0005-4333-8333-333300000005',
 'a0000001-0011-4a00-8a00-a00000000011',
 'https://www.ensotek.com/upload/9/tctp-26.jpg',
 30, 1, NOW(3), NOW(3)),

-- ---- Proje 06 — HES Kablo (DCTP 12 + DCTP 12C) ----------------------------
('77777001-0012-4777-8777-777700000012',
 '33333001-0006-4333-8333-333300000006',
 'a0000001-0012-4a00-8a00-a00000000012',
 'https://www.ensotek.com/upload/17/hes-kablo-dctp-12-merdiven.png',
 10, 1, NOW(3), NOW(3)),

('77777001-0013-4777-8777-777700000013',
 '33333001-0006-4333-8333-333300000006',
 'a0000001-0013-4a00-8a00-a00000000013',
 'https://www.ensotek.com/upload/17/hes-kablo-dctp-12c.jpg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 07 — Green Park Otel (2× CTP 3C) --------------------------------
('77777001-0014-4777-8777-777700000014',
 '33333001-0007-4333-8333-333300000007',
 'a0000001-0014-4a00-8a00-a00000000014',
 'https://www.ensotek.com/upload/7/green-park-otel-2x-ctp-3c.jpg',
 10, 1, NOW(3), NOW(3)),

('77777001-0015-4777-8777-777700000015',
 '33333001-0007-4333-8333-333300000007',
 'a0000001-0015-4a00-8a00-a00000000015',
 'https://www.ensotek.com/upload/17/greenpark-otel-2x-ctp-3c-mail.jpg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 08 — Orion AVM (TCTP 9C) ----------------------------------------
('77777001-0016-4777-8777-777700000016',
 '33333001-0008-4333-8333-333300000008',
 'a0000001-0016-4a00-8a00-a00000000016',
 'https://www.ensotek.com/upload/17/orion-avm-tctp-9c.jpg',
 10, 1, NOW(3), NOW(3)),

-- ---- Proje 09 — Plastifay (CTP 9) ------------------------------------------
('77777001-0017-4777-8777-777700000017',
 '33333001-0009-4333-8333-333300000009',
 'a0000001-0017-4a00-8a00-a00000000017',
 'https://www.ensotek.com/upload/17/plastifay-ctp-9.jpg',
 10, 1, NOW(3), NOW(3)),

-- ---- Proje 10 — Aves Yağ Mersin (TCTP 9B + DCTP 9B) -----------------------
('77777001-0018-4777-8777-777700000018',
 '33333001-0010-4333-8333-333300000010',
 'a0000001-0018-4a00-8a00-a00000000018',
 'https://www.ensotek.com/upload/17/aves-yag-mersin-tctp-9b-2.jpg',
 10, 1, NOW(3), NOW(3)),

('77777001-0019-4777-8777-777700000019',
 '33333001-0010-4333-8333-333300000010',
 'a0000001-0019-4a00-8a00-a00000000019',
 'https://www.ensotek.com/upload/17/aves-yag-tctp-9b-dctp-9b.jpg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 11 — TAT Tekstil Gaziantep (CTP Kaportalı Açık Tip) -------------
('77777001-0020-4777-8777-777700000020',
 '33333001-0011-4333-8333-333300000011',
 'a0000001-0020-4a00-8a00-a00000000020',
 'https://www.ensotek.com/upload/17/su-sogutma-kulesi-gaziantep.jpg',
 10, 1, NOW(3), NOW(3)),

-- ---- Proje 12 — Suudi Arabistan (FRP/GRP, ihracat) -------------------------
('77777001-0021-4777-8777-777700000021',
 '33333001-0012-4333-8333-333300000012',
 'a0000001-0021-4a00-8a00-a00000000021',
 'https://www.ensotek.com/upload/18/suudi-arabistan-sogutma-kulesi.jpg',
 10, 1, NOW(3), NOW(3)),

('77777001-0022-4777-8777-777700000022',
 '33333001-0012-4333-8333-333300000012',
 'a0000001-0022-4a00-8a00-a00000000022',
 'https://www.ensotek.com/upload/17/suudi-arabistan-su-sogutma-kulesi.jpg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 13 — İran (FRP/GRP, ihracat) ------------------------------------
('77777001-0023-4777-8777-777700000023',
 '33333001-0013-4333-8333-333300000013',
 'a0000001-0023-4a00-8a00-a00000000023',
 'https://www.ensotek.com/upload/17/iran-cooling-tower-sogutma-kulesi.jpg',
 10, 1, NOW(3), NOW(3)),

-- ---- Proje 14 — Tüpraş İzmit Rafinerisi (FRP/GRP Açık & Kapalı) -----------
('77777001-0024-4777-8777-777700000024',
 '33333001-0014-4333-8333-333300000014',
 'a0000001-0024-4a00-8a00-a00000000024',
 'https://www.ensotek.com/upload/14/closed-circuit-cooling-tower-kapali-tip-sogutma-kulesi.jpg',
 10, 1, NOW(3), NOW(3)),

('77777001-0025-4777-8777-777700000025',
 '33333001-0014-4333-8333-333300000014',
 'a0000001-0025-4a00-8a00-a00000000025',
 'https://www.ensotek.com/upload/14/closed-cycle-counter-flow-induced-draft-cooling-tower.jpg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 15 — TOFAS Bursa (CTP Kaportalı Açık Tip) ----------------------
('77777001-0026-4777-8777-777700000026',
 '33333001-0015-4333-8333-333300000015',
 'a0000001-0026-4a00-8a00-a00000000026',
 'https://www.ensotek.com/upload/17/sogutma-kulesi-bursa.jpg',
 10, 1, NOW(3), NOW(3)),

('77777001-0027-4777-8777-777700000027',
 '33333001-0015-4333-8333-333300000015',
 'a0000001-0027-4a00-8a00-a00000000027',
 'https://www.ensotek.com/upload/18/ensotek-sogutma-kulesi-mardin-kucuk-1920x1080x50.jpg',
 20, 1, NOW(3), NOW(3));


-- =============================================================
-- 2. project_images_i18n  — TÜRKÇE (tr)
-- =============================================================

INSERT INTO `project_images_i18n`
  (id, image_id, locale, alt, caption, created_at, updated_at)
VALUES

-- img 01 (İstanbul Plaza — fabrika gece)
('88881001-0001-4888-8888-888810000001',
 '77777001-0001-4777-8777-777700000001', 'tr',
 'CTP kaportalı soğutma kulesi fabrika gece görünümü',
 'İstanbul Fabrikamızda üretilen CTP Kaportalı Açık Tip soğutma kuleleri — İstanbul Plaza projesi öncesi üretim aşaması',
 NOW(3), NOW(3)),

-- img 02 (İstanbul Plaza — ankara gorsel)
('88881001-0002-4888-8888-888810000002',
 '77777001-0002-4777-8777-777700000002', 'tr',
 'İstanbul Plaza çatı soğutma kulesi montajı 130 m',
 'İstanbul Plaza binasının 130 metre yüksekliğindeki çatısına monte edilen 2 adet CTP Kaportalı Açık Tip soğutma kulesi',
 NOW(3), NOW(3)),

-- img 03 (Kahramanmaraş — fabrika)
('88881001-0003-4888-8888-888810000003',
 '77777001-0003-4777-8777-777700000003', 'tr',
 'Ensotek soğutma kulesi fabrika üretim tesisi',
 'Ankara Fabrikamızda üretilen CTP soğutma kuleleri — Kahramanmaraş sanayi projesi hazırlık aşaması',
 NOW(3), NOW(3)),

-- img 04 (Kahramanmaraş — saha)
('88881001-0004-4888-8888-888810000004',
 '77777001-0004-4777-8777-777700000004', 'tr',
 'CTP kaportalı açık tip soğutma kulesi saha montajı',
 'Kahramanmaraş sanayi tesisinde saha montajı tamamlanan CTP Kaportalı Açık Tip soğutma kulesi',
 NOW(3), NOW(3)),

-- img 05 (Arçelik — proje fotoğrafı)
('88881001-0005-4888-8888-888810000005',
 '77777001-0005-4777-8777-777700000005', 'tr',
 'Arçelik Gebze 2 adet CTP 6C su soğutma kulesi',
 'Arçelik A.Ş. Gebze tesisine kurulan 2 adet CTP 6C model su soğutma kulesi — endüstriyel proses soğutma',
 NOW(3), NOW(3)),

-- img 06 (Arçelik — model görseli)
('88881001-0006-4888-8888-888810000006',
 '77777001-0006-4777-8777-777700000006', 'tr',
 'CTP 6C model açık tip su soğutma kulesi',
 'CTP 6C model — FRP/GRP gövdeli, çift fan gruplu, yüksek verimli açık tip soğutma kulesi',
 NOW(3), NOW(3)),

-- img 07 (Eczacıbaşı — proje fotoğrafı)
('88881001-0007-4888-8888-888810000007',
 '77777001-0007-4777-8777-777700000007', 'tr',
 'Eczacıbaşı 3 adet DCTP 5C kapalı devre soğutma kulesi',
 'Eczacıbaşı tesisine teslim edilen 3 adet DCTP 5C model kapalı devre su soğutma kulesi — ilaç ve kimya endüstrisi',
 NOW(3), NOW(3)),

-- img 08 (Eczacıbaşı — model görseli)
('88881001-0008-4888-8888-888810000008',
 '77777001-0008-4777-8777-777700000008', 'tr',
 'DCTP 5C kapalı devre soğutma kulesi model görseli',
 'DCTP 5C model — serpantinli kapalı devre sistemi, ilaç ve gıda endüstrisi için yüksek hijyen standardında',
 NOW(3), NOW(3)),

-- img 09 (Linde Gaz — tctp-26b-3)
('88881001-0009-4888-8888-888810000009',
 '77777001-0009-4777-8777-777700000009', 'tr',
 'Linde Gaz Gebze 3 adet TCTP 26B soğutma kulesi',
 'Linde Gaz Türkiye Gebze tesisine kurulan 3 adet TCTP 26B kapalı devre soğutma kulesi — proses gazı soğutma',
 NOW(3), NOW(3)),

-- img 10 (Linde Gaz — gebze genel)
('88881001-0010-4888-8888-888810000010',
 '77777001-0010-4777-8777-777700000010', 'tr',
 'Linde Gaz Gebze kombine soğutma sistemi genel görünümü',
 'Linde Gaz Gebze tesisi — TCTP 26B ve DCTP 12C kombine soğutma sisteminin tesis içi genel görünümü',
 NOW(3), NOW(3)),

-- img 11 (Linde Gaz — tctp-26 model)
('88881001-0011-4888-8888-888810000011',
 '77777001-0011-4777-8777-777700000011', 'tr',
 'TCTP 26B yüksek kapasiteli kapalı devre soğutma kulesi',
 'TCTP 26B model — büyük kapasiteli endüstriyel proses soğutma, gaz üretim tesisleri için özel tasarım',
 NOW(3), NOW(3)),

-- img 12 (HES Kablo — merdiven)
('88881001-0012-4888-8888-888810000012',
 '77777001-0012-4777-8777-777700000012', 'tr',
 'HES Kablo DCTP 12 merdiven aksesuarlı soğutma kulesi',
 'HES Kablo tesisine kurulan DCTP 12 model soğutma kulesi — özel merdiven ve platform aksesuarı ile donatılmış',
 NOW(3), NOW(3)),

-- img 13 (HES Kablo — dctp-12c)
('88881001-0013-4888-8888-888810000013',
 '77777001-0013-4777-8777-777700000013', 'tr',
 'HES Kablo DCTP 12C kapalı devre soğutma kulesi',
 'HES Kablo tesisindeki DCTP 12C model kapalı devre soğutma kulesi — kablo üretimi için proses soğutma',
 NOW(3), NOW(3)),

-- img 14 (Green Park — proje fotoğrafı)
('88881001-0014-4888-8888-888810000014',
 '77777001-0014-4777-8777-777700000014', 'tr',
 'Green Park Otel 2 adet CTP 3C açık tip soğutma kulesi',
 'Green Park Hotels tesisine kurulan 2 adet CTP 3C model açık tip soğutma kulesi — otel HVAC uygulaması',
 NOW(3), NOW(3)),

-- img 15 (Green Park — mail görseli)
('88881001-0015-4888-8888-888810000015',
 '77777001-0015-4777-8777-777700000015', 'tr',
 'Green Park Hotels CTP 3C soğutma sistemi',
 'Green Park Hotels için tasarlanan CTP 3C soğutma sistemi — sessiz çalışma ve estetik tasarım ön planda',
 NOW(3), NOW(3)),

-- img 16 (Orion AVM)
('88881001-0016-4888-8888-888810000016',
 '77777001-0016-4777-8777-777700000016', 'tr',
 'Orion AVM TCTP 9C kapalı devre soğutma kulesi',
 'Orion AVM için kurulan TCTP 9C kapalı devre soğutma kulesi — alışveriş merkezi yıl boyu soğutma hizmeti',
 NOW(3), NOW(3)),

-- img 17 (Plastifay)
('88881001-0017-4888-8888-888810000017',
 '77777001-0017-4777-8777-777700000017', 'tr',
 'Plastifay CTP 9 açık tip su soğutma kulesi',
 'Plastifay tesisine kurulan CTP 9 model açık tip soğutma kulesi — plastik sektörü proses soğutma ihtiyacı için',
 NOW(3), NOW(3)),

-- img 18 (Aves Yağ — mersin 2)
('88881001-0018-4888-8888-888810000018',
 '77777001-0018-4777-8777-777700000018', 'tr',
 'Aves Yağ Mersin TCTP 9B soğutma kulesi',
 'Aves Yağ Mersin tesisinde 2 adet TCTP 9B ve DCTP 9B kombine soğutma sistemi — gıda endüstrisi proses soğutma',
 NOW(3), NOW(3)),

-- img 19 (Aves Yağ — tctp-9b-dctp-9b)
('88881001-0019-4888-8888-888810000019',
 '77777001-0019-4777-8777-777700000019', 'tr',
 'Aves Yağ TCTP 9B ve DCTP 9B kombine soğutma sistemi',
 'Mersin Aves Yağ tesisi — TCTP 9B ve DCTP 9B model soğutma kulelerinin yan yana kombine çalışması',
 NOW(3), NOW(3)),

-- img 20 (TAT Tekstil Gaziantep)
('88881001-0020-4888-8888-888810000020',
 '77777001-0020-4777-8777-777700000020', 'tr',
 'Gaziantep tekstil fabrikası su soğutma kulesi kurulumu',
 'TAT Tekstil Gaziantep fabrikasına kurulan CTP Kaportalı Açık Tip soğutma kulesi — tekstil endüstrisi proses soğutma',
 NOW(3), NOW(3)),

-- img 21 (Suudi Arabistan — 1)
('88881001-0021-4888-8888-888810000021',
 '77777001-0021-4777-8777-777700000021', 'tr',
 'Suudi Arabistan endüstriyel soğutma kulesi ihracat projesi',
 'Suudi Arabistan''a ihraç edilen Ensotek FRP/GRP soğutma kulesi — çöl iklimi yüksek sıcaklık koşullarına dayanıklı tasarım',
 NOW(3), NOW(3)),

-- img 22 (Suudi Arabistan — 2)
('88881001-0022-4888-8888-888810000022',
 '77777001-0022-4777-8777-777700000022', 'tr',
 'Suudi Arabistan su soğutma kulesi montajı',
 'Suudi Arabistan projesi saha montaj görünümü — Ensotek ihracat referansı, FRP/GRP açık tip endüstriyel soğutma',
 NOW(3), NOW(3)),

-- img 23 (İran)
('88881001-0023-4888-8888-888810000023',
 '77777001-0023-4777-8777-777700000023', 'tr',
 'İran endüstriyel soğutma kulesi ihracat projesi',
 'İran''a ihraç edilen Ensotek FRP/GRP soğutma kulesi — uluslararası endüstriyel proses soğutma referansı',
 NOW(3), NOW(3)),

-- img 24 (Tüpraş — kapalı tip)
('88881001-0024-4888-8888-888810000024',
 '77777001-0024-4777-8777-777700000024', 'tr',
 'Tüpraş İzmit rafinerisi kapalı devre soğutma kulesi',
 'Tüpraş İzmit Rafinerisi için üretilen FRP/GRP kapalı devre soğutma sistemi — petrokimya proses soğutma',
 NOW(3), NOW(3)),

-- img 25 (Tüpraş — counter-flow)
('88881001-0025-4888-8888-888810000025',
 '77777001-0025-4777-8777-777700000025', 'tr',
 'Rafineri endüstriyel soğutma sistemi FRP karşı akışlı',
 'Tüpraş İzmit — yüksek sıcaklık ve korozif ortam için tasarlanan FRP/GRP karşı akışlı soğutma kulesi sistemi',
 NOW(3), NOW(3)),

-- img 26 (TOFAS Bursa — bursa)
('88881001-0026-4888-8888-888810000026',
 '77777001-0026-4777-8777-777700000026', 'tr',
 'TOFAS Bursa otomotiv fabrikası soğutma kulesi',
 'TOFAS Bursa otomotiv fabrikasına kurulan CTP Kaportalı Açık Tip soğutma kulesi — boya ve kalıp proses soğutma',
 NOW(3), NOW(3)),

-- img 27 (TOFAS — endüstriyel)
('88881001-0027-4888-8888-888810000027',
 '77777001-0027-4777-8777-777700000027', 'tr',
 'CTP soğutma kulesi otomotiv endüstrisi saha kurulumu',
 'Otomotiv endüstrisi için yüksek debili CTP soğutma kulesi — fabrika çatı ve tesis içi saha montajı',
 NOW(3), NOW(3));


-- =============================================================
-- 3. project_images_i18n  — ENGLISH (en)
-- =============================================================

INSERT INTO `project_images_i18n`
  (id, image_id, locale, alt, caption, created_at, updated_at)
VALUES

-- img 01
('88882001-0001-4888-8888-888820000001',
 '77777001-0001-4777-8777-777700000001', 'en',
 'CTP covered cooling tower factory night view',
 'CTP covered open-type cooling towers produced at Ensotek Istanbul Factory — manufacturing stage for the Istanbul Plaza project',
 NOW(3), NOW(3)),

-- img 02
('88882001-0002-4888-8888-888820000002',
 '77777001-0002-4777-8777-777700000002', 'en',
 'Istanbul Plaza rooftop cooling tower installation at 130 m',
 '2× CTP covered open-type cooling towers installed on the Istanbul Plaza rooftop at 130 metres height',
 NOW(3), NOW(3)),

-- img 03
('88882001-0003-4888-8888-888820000003',
 '77777001-0003-4777-8777-777700000003', 'en',
 'Ensotek cooling tower factory production facility',
 'CTP cooling towers manufactured at Ankara Factory — production stage for the Kahramanmaraş industrial project',
 NOW(3), NOW(3)),

-- img 04
('88882001-0004-4888-8888-888820000004',
 '77777001-0004-4777-8777-777700000004', 'en',
 'CTP covered open-type cooling tower field installation',
 'CTP covered open-type cooling tower with completed field installation at Kahramanmaraş industrial facility',
 NOW(3), NOW(3)),

-- img 05
('88882001-0005-4888-8888-888820000005',
 '77777001-0005-4777-8777-777700000005', 'en',
 'Arçelik Gebze 2× CTP 6C water cooling towers',
 '2× CTP 6C model water cooling towers installed at Arçelik A.Ş. Gebze facility — industrial process cooling',
 NOW(3), NOW(3)),

-- img 06
('88882001-0006-4888-8888-888820000006',
 '77777001-0006-4777-8777-777700000006', 'en',
 'CTP 6C model open-type water cooling tower',
 'CTP 6C model — FRP/GRP body, dual fan groups, high-efficiency open-type cooling tower',
 NOW(3), NOW(3)),

-- img 07
('88882001-0007-4888-8888-888820000007',
 '77777001-0007-4777-8777-777700000007', 'en',
 'Eczacıbaşı 3× DCTP 5C closed-circuit cooling towers',
 '3× DCTP 5C model closed-circuit water cooling towers delivered to Eczacıbaşı facility — pharmaceutical and chemical industry',
 NOW(3), NOW(3)),

-- img 08
('88882001-0008-4888-8888-888820000008',
 '77777001-0008-4777-8777-777700000008', 'en',
 'DCTP 5C closed-circuit cooling tower model',
 'DCTP 5C model — coil closed-circuit system with high hygiene standards, ideal for pharmaceutical and food industries',
 NOW(3), NOW(3)),

-- img 09
('88882001-0009-4888-8888-888820000009',
 '77777001-0009-4777-8777-777700000009', 'en',
 'Linde Gas Gebze 3× TCTP 26B cooling towers',
 '3× TCTP 26B closed-circuit cooling towers installed at Linde Gas Turkey Gebze facility — process gas cooling',
 NOW(3), NOW(3)),

-- img 10
('88882001-0010-4888-8888-888820000010',
 '77777001-0010-4777-8777-777700000010', 'en',
 'Linde Gas Gebze combined cooling system general view',
 'Linde Gas Gebze facility — general view of the combined TCTP 26B and DCTP 12C cooling system on-site',
 NOW(3), NOW(3)),

-- img 11
('88882001-0011-4888-8888-888820000011',
 '77777001-0011-4777-8777-777700000011', 'en',
 'TCTP 26B high-capacity closed-circuit cooling tower',
 'TCTP 26B model — large-capacity industrial process cooling, specially designed for gas production facilities',
 NOW(3), NOW(3)),

-- img 12
('88882001-0012-4888-8888-888820000012',
 '77777001-0012-4777-8777-777700000012', 'en',
 'HES Kablo DCTP 12 cooling tower with ladder accessory',
 'DCTP 12 model cooling tower installed at HES Kablo facility — equipped with custom ladder and platform accessory',
 NOW(3), NOW(3)),

-- img 13
('88882001-0013-4888-8888-888820000013',
 '77777001-0013-4777-8777-777700000013', 'en',
 'HES Kablo DCTP 12C closed-circuit cooling tower',
 'DCTP 12C model closed-circuit cooling tower at HES Kablo facility — process cooling for cable manufacturing',
 NOW(3), NOW(3)),

-- img 14
('88882001-0014-4888-8888-888820000014',
 '77777001-0014-4777-8777-777700000014', 'en',
 'Green Park Hotel 2× CTP 3C open-type cooling towers',
 '2× CTP 3C model open-type cooling towers installed at Green Park Hotels — hotel HVAC application',
 NOW(3), NOW(3)),

-- img 15
('88882001-0015-4888-8888-888820000015',
 '77777001-0015-4777-8777-777700000015', 'en',
 'Green Park Hotels CTP 3C cooling system',
 'CTP 3C cooling system designed for Green Park Hotels — quiet operation and aesthetic design prioritised',
 NOW(3), NOW(3)),

-- img 16
('88882001-0016-4888-8888-888820000016',
 '77777001-0016-4777-8777-777700000016', 'en',
 'Orion Shopping Mall TCTP 9C closed-circuit cooling tower',
 'TCTP 9C model closed-circuit cooling tower installed at Orion Mall — year-round cooling for the shopping centre',
 NOW(3), NOW(3)),

-- img 17
('88882001-0017-4888-8888-888820000017',
 '77777001-0017-4777-8777-777700000017', 'en',
 'Plastifay CTP 9 open-type water cooling tower',
 'CTP 9 model open-type cooling tower installed at Plastifay facility — process cooling for the plastics industry',
 NOW(3), NOW(3)),

-- img 18
('88882001-0018-4888-8888-888820000018',
 '77777001-0018-4777-8777-777700000018', 'en',
 'Aves Yağ Mersin TCTP 9B cooling tower',
 'Combined cooling system at Aves Yağ Mersin facility with 2× TCTP 9B and DCTP 9B — food industry process cooling',
 NOW(3), NOW(3)),

-- img 19
('88882001-0019-4888-8888-888820000019',
 '77777001-0019-4777-8777-777700000019', 'en',
 'Aves Yağ TCTP 9B and DCTP 9B combined cooling system',
 'Mersin Aves Yağ facility — TCTP 9B and DCTP 9B model cooling towers operating side-by-side in combined configuration',
 NOW(3), NOW(3)),

-- img 20
('88882001-0020-4888-8888-888820000020',
 '77777001-0020-4777-8777-777700000020', 'en',
 'Gaziantep textile factory water cooling tower installation',
 'CTP covered open-type cooling tower installed at TAT Tekstil Gaziantep factory — textile industry process cooling',
 NOW(3), NOW(3)),

-- img 21
('88882001-0021-4888-8888-888820000021',
 '77777001-0021-4777-8777-777700000021', 'en',
 'Saudi Arabia industrial cooling tower export project',
 'Ensotek FRP/GRP cooling tower exported to Saudi Arabia — designed for desert climate high-temperature conditions',
 NOW(3), NOW(3)),

-- img 22
('88882001-0022-4888-8888-888820000022',
 '77777001-0022-4777-8777-777700000022', 'en',
 'Saudi Arabia water cooling tower site installation',
 'Saudi Arabia project site view — Ensotek export reference, FRP/GRP open-type industrial cooling tower',
 NOW(3), NOW(3)),

-- img 23
('88882001-0023-4888-8888-888820000023',
 '77777001-0023-4777-8777-777700000023', 'en',
 'Iran industrial cooling tower export project',
 'Ensotek FRP/GRP cooling tower exported to Iran — international industrial process cooling reference project',
 NOW(3), NOW(3)),

-- img 24
('88882001-0024-4888-8888-888820000024',
 '77777001-0024-4777-8777-777700000024', 'en',
 'Tüpraş İzmit refinery closed-circuit cooling tower',
 'FRP/GRP closed-circuit cooling system manufactured for Tüpraş İzmit Refinery — petrochemical process cooling',
 NOW(3), NOW(3)),

-- img 25
('88882001-0025-4888-8888-888820000025',
 '77777001-0025-4777-8777-777700000025', 'en',
 'Refinery industrial FRP counter-flow cooling system',
 'Tüpraş İzmit — FRP/GRP counter-flow induced-draft cooling tower system designed for high-temperature and corrosive environments',
 NOW(3), NOW(3)),

-- img 26
('88882001-0026-4888-8888-888820000026',
 '77777001-0026-4777-8777-777700000026', 'en',
 'TOFAS Bursa automotive factory cooling tower',
 'CTP covered open-type cooling tower installed at TOFAS Bursa automotive factory — paint and mould process cooling',
 NOW(3), NOW(3)),

-- img 27
('88882001-0027-4888-8888-888820000027',
 '77777001-0027-4777-8777-777700000027', 'en',
 'CTP cooling tower automotive industry field installation',
 'High-flow CTP cooling tower for the automotive industry — factory rooftop and on-site field installation',
 NOW(3), NOW(3));


-- =============================================================
-- 4. project_images_i18n  — DEUTSCH (de)
-- =============================================================

INSERT INTO `project_images_i18n`
  (id, image_id, locale, alt, caption, created_at, updated_at)
VALUES

-- img 01
('88883001-0001-4888-8888-888830000001',
 '77777001-0001-4777-8777-777700000001', 'de',
 'CTP-Kühlturm mit Haube — Fabrik Nachtansicht',
 'CTP-Kühltürme mit Haube, produziert im Ensotek-Werk Istanbul — Produktionsphase für das Istanbul-Plaza-Projekt',
 NOW(3), NOW(3)),

-- img 02
('88883001-0002-4888-8888-888830000002',
 '77777001-0002-4777-8777-777700000002', 'de',
 'Istanbul Plaza Dachinstallation Kühlturm 130 m Höhe',
 '2× CTP-Kühltürme mit Haube, auf dem Dach des Istanbul Plaza in 130 Metern Höhe montiert',
 NOW(3), NOW(3)),

-- img 03
('88883001-0003-4888-8888-888830000003',
 '77777001-0003-4777-8777-777700000003', 'de',
 'Ensotek Kühlturm Fabrik Produktionswerk',
 'CTP-Kühltürme im Werk Ankara produziert — Produktionsphase für das Industrieprojekt Kahramanmaraş',
 NOW(3), NOW(3)),

-- img 04
('88883001-0004-4888-8888-888830000004',
 '77777001-0004-4777-8777-777700000004', 'de',
 'CTP-Kühlturm mit Haube Feldinstallation abgeschlossen',
 'CTP-Kühlturm mit Haube nach abgeschlossener Feldmontage im Industriewerk Kahramanmaraş',
 NOW(3), NOW(3)),

-- img 05
('88883001-0005-4888-8888-888830000005',
 '77777001-0005-4777-8777-777700000005', 'de',
 'Arçelik Gebze 2× CTP 6C Wasserkühlturm',
 '2× CTP-6C-Kühltürme im Werk Arçelik A.Ş. Gebze installiert — industrielle Prozesskühlung',
 NOW(3), NOW(3)),

-- img 06
('88883001-0006-4888-8888-888830000006',
 '77777001-0006-4777-8777-777700000006', 'de',
 'CTP 6C Modell offener Kühlturm',
 'CTP-6C-Modell — FRP/GRP-Gehäuse, doppelte Lüftergruppen, hocheffizienter offener Kühlturm',
 NOW(3), NOW(3)),

-- img 07
('88883001-0007-4888-8888-888830000007',
 '77777001-0007-4777-8777-777700000007', 'de',
 'Eczacıbaşı 3× DCTP 5C Kreislaufkühlung',
 '3× DCTP-5C-Kühltürme im geschlossenen Kreislauf, geliefert an das Eczacıbaşı-Werk — Pharma- und Chemieindustrie',
 NOW(3), NOW(3)),

-- img 08
('88883001-0008-4888-8888-888830000008',
 '77777001-0008-4777-8777-777700000008', 'de',
 'DCTP 5C Kreislaufkühlturm Modellansicht',
 'DCTP-5C-Modell — Rippenrohr-Kreislaufsystem mit hohem Hygienestandard, ideal für die Pharma- und Lebensmittelindustrie',
 NOW(3), NOW(3)),

-- img 09
('88883001-0009-4888-8888-888830000009',
 '77777001-0009-4777-8777-777700000009', 'de',
 'Linde Gas Gebze 3× TCTP 26B Kühltürme',
 '3× TCTP-26B-Kühltürme im geschlossenen Kreislauf im Werk Linde Gas Türkei Gebze — Prozesgaskühlung',
 NOW(3), NOW(3)),

-- img 10
('88883001-0010-4888-8888-888830000010',
 '77777001-0010-4777-8777-777700000010', 'de',
 'Linde Gas Gebze kombiniertes Kühlsystem Gesamtansicht',
 'Werk Linde Gas Gebze — Gesamtansicht des kombinierten TCTP-26B- und DCTP-12C-Kühlsystems auf dem Werksgelände',
 NOW(3), NOW(3)),

-- img 11
('88883001-0011-4888-8888-888830000011',
 '77777001-0011-4777-8777-777700000011', 'de',
 'TCTP 26B Hochleistungs-Kreislaufkühlturm',
 'TCTP-26B-Modell — Großkapazitäts-Industrieprozesskühlung, speziell konzipiert für Gasproduktionsanlagen',
 NOW(3), NOW(3)),

-- img 12
('88883001-0012-4888-8888-888830000012',
 '77777001-0012-4777-8777-777700000012', 'de',
 'HES Kablo DCTP 12 Kühlturm mit Leiteranlagen',
 'DCTP-12-Kühlturm im Werk HES Kablo installiert — mit Sonderanfertigung Leiter- und Plattformzubehör',
 NOW(3), NOW(3)),

-- img 13
('88883001-0013-4888-8888-888830000013',
 '77777001-0013-4777-8777-777700000013', 'de',
 'HES Kablo DCTP 12C Kreislaufkühlturm',
 'DCTP-12C-Kreislaufkühlturm im Werk HES Kablo — Prozesskühlung für die Kabelproduktion',
 NOW(3), NOW(3)),

-- img 14
('88883001-0014-4888-8888-888830000014',
 '77777001-0014-4777-8777-777700000014', 'de',
 'Green Park Hotel 2× CTP 3C offene Kühltürme',
 '2× CTP-3C-Kühltürme im Green Park Hotels installiert — Hotel-HVAC-Anwendung',
 NOW(3), NOW(3)),

-- img 15
('88883001-0015-4888-8888-888830000015',
 '77777001-0015-4777-8777-777700000015', 'de',
 'Green Park Hotels CTP 3C Kühlsystem',
 'CTP-3C-Kühlsystem für Green Park Hotels — geräuscharmer Betrieb und ästhetisches Design im Vordergrund',
 NOW(3), NOW(3)),

-- img 16
('88883001-0016-4888-8888-888830000016',
 '77777001-0016-4777-8777-777700000016', 'de',
 'Orion Einkaufszentrum TCTP 9C Kreislaufkühlturm',
 'TCTP-9C-Kreislaufkühlturm im Orion-Einkaufszentrum installiert — ganzjährige Klimatisierung des Einkaufszentrums',
 NOW(3), NOW(3)),

-- img 17
('88883001-0017-4888-8888-888830000017',
 '77777001-0017-4777-8777-777700000017', 'de',
 'Plastifay CTP 9 offener Wasserkühlturm',
 'CTP-9-Kühlturm im Werk Plastifay installiert — Prozesskühlung für die Kunststoffindustrie',
 NOW(3), NOW(3)),

-- img 18
('88883001-0018-4888-8888-888830000018',
 '77777001-0018-4777-8777-777700000018', 'de',
 'Aves Yağ Mersin TCTP 9B Kühlturm',
 'Kombiniertes Kühlsystem im Werk Aves Yağ Mersin mit 2× TCTP 9B und DCTP 9B — Prozesskühlung für die Lebensmittelindustrie',
 NOW(3), NOW(3)),

-- img 19
('88883001-0019-4888-8888-888830000019',
 '77777001-0019-4777-8777-777700000019', 'de',
 'Aves Yağ TCTP 9B und DCTP 9B kombiniertes Kühlsystem',
 'Werk Aves Yağ Mersin — kombinierter Betrieb der Kühltürme TCTP 9B und DCTP 9B nebeneinander',
 NOW(3), NOW(3)),

-- img 20
('88883001-0020-4888-8888-888830000020',
 '77777001-0020-4777-8777-777700000020', 'de',
 'Gaziantep Textilwerk Kühlturm Installation',
 'CTP-Kühlturm mit Haube im TAT-Textilwerk Gaziantep installiert — Prozesskühlung für die Textilindustrie',
 NOW(3), NOW(3)),

-- img 21
('88883001-0021-4888-8888-888830000021',
 '77777001-0021-4777-8777-777700000021', 'de',
 'Saudi-Arabien Industriekühlturm Exportprojekt',
 'Ensotek FRP/GRP-Kühlturm nach Saudi-Arabien exportiert — für Wüstenklima und Hochtemperaturbedingungen ausgelegt',
 NOW(3), NOW(3)),

-- img 22
('88883001-0022-4888-8888-888830000022',
 '77777001-0022-4777-8777-777700000022', 'de',
 'Saudi-Arabien Wasserkühlturm Standortmontage',
 'Projekt Saudi-Arabien Standortansicht — Ensotek Exportreferenz, offener FRP/GRP-Industriekühlturm',
 NOW(3), NOW(3)),

-- img 23
('88883001-0023-4888-8888-888830000023',
 '77777001-0023-4777-8777-777700000023', 'de',
 'Iran Industriekühlturm Exportprojekt',
 'Ensotek FRP/GRP-Kühlturm nach Iran exportiert — internationale Referenz für industrielle Prozesskühlung',
 NOW(3), NOW(3)),

-- img 24
('88883001-0024-4888-8888-888830000024',
 '77777001-0024-4777-8777-777700000024', 'de',
 'Tüpraş İzmit Raffinerie Kreislaufkühlturm',
 'FRP/GRP-Kreislaufkühlsystem für die Tüpraş-Raffinerie İzmit gefertigt — petrochemische Prozesskühlung',
 NOW(3), NOW(3)),

-- img 25
('88883001-0025-4888-8888-888830000025',
 '77777001-0025-4777-8777-777700000025', 'de',
 'Raffinerie FRP Gegenstrom-Kühlturmsystem',
 'Tüpraş İzmit — FRP/GRP-Gegenstrom-Kühlturmsystem für Hochtemperatur- und korrosive Betriebsbedingungen',
 NOW(3), NOW(3)),

-- img 26
('88883001-0026-4888-8888-888830000026',
 '77777001-0026-4777-8777-777700000026', 'de',
 'TOFAS Bursa Automobilfabrik Kühlturm',
 'CTP-Kühlturm mit Haube in der TOFAS-Automobilfabrik Bursa installiert — Prozesskühlung für Lackier- und Gießprozesse',
 NOW(3), NOW(3)),

-- img 27
('88883001-0027-4888-8888-888830000027',
 '77777001-0027-4777-8777-777700000027', 'de',
 'CTP-Kühlturm Automobilindustrie Feldinstallation',
 'Hochdurchsatz-CTP-Kühlturm für die Automobilindustrie — Fabrikdach- und Geländeinstallation',
 NOW(3), NOW(3));


COMMIT;
