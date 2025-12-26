-- =============================================================
-- FILE: 192_slider_tr_seed.sql
-- SEED: Ensotek – Slider i18n (TR)
-- Only TR rows – idempotent
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

INSERT INTO `slider_i18n`
(`slider_id`,`locale`,
 `name`,`slug`,`description`,
 `alt`,`button_text`,`button_link`)
VALUES
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990001-1111-4111-8111-999999990001'),
  'tr',
  'Endüstriyel Su Soğutma Kulelerinde Uzman Çözüm Ortağınız',
  'endustriyel-su-sogutma-kulelerinde-uzman-cozum-ortaginiz',
  'Enerji santralleri, endüstriyel tesisler ve ticari binalar için yüksek verimli su soğutma kulesi çözümleri sunuyoruz.',
  'Endüstriyel su soğutma kulesi çözümleri',
  'Teklif Al',
  '/contact'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990002-1111-4111-8111-999999990002'),
  'tr',
  'Açık ve Kapalı Devre Su Soğutma Kuleleri',
  'acik-ve-kapali-devre-su-sogutma-kuleleri',
  'FRP, galvanizli çelik ve betonarme gövdeli su soğutma kuleleri ile prosesinize en uygun çözümü tasarlıyoruz.',
  'Açık / kapalı devre su soğutma kuleleri',
  'Çözümleri İncele',
  '/solutions/water-cooling-towers'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990003-1111-4111-8111-999999990003'),
  'tr',
  'Keşif, Projelendirme ve Anahtar Teslim Montaj',
  'kesif-projelendirme-ve-anahtar-teslim-montaj',
  'Saha keşfi, ısı yükü hesapları, mekanik tasarım ve devreye alma süreçlerinin tamamını Ensotek mühendisliği ile yönetiyoruz.',
  'Su soğutma kulesi keşif ve projelendirme',
  'Keşif Talep Et',
  '/services/site-survey-engineering'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990004-1111-4111-8111-999999990004'),
  'tr',
  'Periyodik Bakım ve Revizyon Hizmetleri',
  'periyodik-bakim-ve-revizyon-hizmetleri',
  'Mevcut su soğutma kuleleriniz için nozül, dolgu, fan ve mekanik aksam yenileme ile kapasite ve verimlilik iyileştirmeleri sağlıyoruz.',
  'Su soğutma kulesi bakım ve revizyon hizmetleri',
  'Bakım Planla',
  '/services/maintenance-retrofit'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990005-1111-4111-8111-999999990005'),
  'tr',
  'Otomasyon, SCADA ve Uzaktan İzleme Çözümleri',
  'otomasyon-scada-ve-uzaktan-izleme-cozumleri',
  'Su soğutma kulelerinizi enerji tüketimi, debi, sıcaklık ve arıza durumlarına göre gerçek zamanlı izleyebileceğiniz otomasyon altyapısı kuruyoruz.',
  'Su soğutma kulesi otomasyon ve SCADA çözümleri',
  'Detaylı Bilgi Al',
  '/services/automation-scada'
),

-- =============================================================
-- NEW: SERVICES EXPANSION (TR) – 6 new slides
-- =============================================================
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990006-1111-4111-8111-999999990006'),
  'tr',
  'Yeni Hizmet: Yedek Parçalar ve Kritik Bileşen Tedariği',
  'yeni-hizmet-yedek-parcalar-ve-kritik-bilesen-tedarigi',
  'Nozül, dolgu, fan kanadı, motor, şanzıman, drift eliminator ve mekanik aksamlar için hızlı tedarik ve doğru parça eşleştirme hizmeti sunuyoruz.',
  'Soğutma kulesi yedek parça ve bileşen tedariği',
  'Parça Talep Et',
  '/contact'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990007-1111-4111-8111-999999990007'),
  'tr',
  'Yeni Hizmet: Modernizasyon ve Verimlilik Odaklı Retrofit',
  'yeni-hizmet-modernizasyon-ve-verimlilik-odakli-retrofit',
  'Mevcut kulelerinizi daha düşük enerji tüketimi ve daha yüksek performans için revize ediyoruz: dolgu optimizasyonu, fan grubu yükseltme, hidrolik iyileştirmeler ve kapasite artışı.',
  'Soğutma kulesi modernizasyon ve retrofit',
  'Retrofit İncele',
  '/services/maintenance-retrofit'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990008-1111-4111-8111-999999990008'),
  'tr',
  'Yeni Hizmet: Proje Danışmanlığı ve Mühendislik Desteği',
  'yeni-hizmet-proje-danismanligi-ve-muhendislik-destegi',
  'Isı yükü analizi, seçim / boyutlandırma, malzeme seçimi, saha koşulları ve devreye alma süreçlerinde uçtan uca mühendislik desteği sağlıyoruz.',
  'Soğutma kulesi mühendislik danışmanlığı',
  'Danışmanlık Al',
  '/services/site-survey-engineering'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990009-1111-4111-8111-999999990009'),
  'tr',
  'Yeni Hizmet: Otomasyon, SCADA ve Uzaktan İzleme',
  'yeni-hizmet-otomasyon-scada-ve-uzaktan-izleme',
  'Debi, sıcaklık, iletkenlik, seviye ve enerji tüketimi gibi kritik parametreleri gerçek zamanlı izleyerek arızaları erken yakalayan izleme altyapıları kuruyoruz.',
  'Soğutma kulesi otomasyon ve izleme',
  'Demo İste',
  '/services/automation-scada'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990010-1111-4111-8111-999999990010'),
  'tr',
  'Yeni Hizmet: Performans Optimizasyonu ve Enerji Verimliliği',
  'yeni-hizmet-performans-optimizasyonu-ve-enerji-verimliligi',
  'Yerinde ölçümler ve raporlama ile yaklaşım sıcaklığı, kapasite, fan verimi ve su kimyası parametrelerini iyileştirerek enerji maliyetlerini düşürüyoruz.',
  'Soğutma kulesi performans optimizasyonu',
  'Analiz Talep Et',
  '/services/site-survey-engineering'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = '99990011-1111-4111-8111-999999990011'),
  'tr',
  'Yeni Hizmet: Acil Servis ve Arıza Müdahale',
  'yeni-hizmet-acil-servis-ve-ariza-mudahale',
  'Kritik duruşlara karşı hızlı müdahale, parça değişimi, devreye alma ve güvenli yeniden çalıştırma süreçlerinde uzman saha ekibi ile yanınızdayız.',
  'Soğutma kulesi acil servis ve arıza müdahale',
  'Acil Destek',
  '/contact'
)

ON DUPLICATE KEY UPDATE
  `name`        = VALUES(`name`),
  `slug`        = VALUES(`slug`),
  `description` = VALUES(`description`),
  `alt`         = VALUES(`alt`),
  `button_text` = VALUES(`button_text`),
  `button_link` = VALUES(`button_link`);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
