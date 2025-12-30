-- =============================================================
-- FILE: 071.1_services_tr.sql
-- Ensotek services – TR i18n + TR image i18n
-- - Idempotent (UPSERT)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

SET @SRV_001 := '90000001-1111-4111-8111-900000000001';
SET @SRV_002 := '90000002-1111-4111-8111-900000000002';
SET @SRV_003 := '90000003-1111-4111-8111-900000000003';
SET @SRV_004 := '90000004-1111-4111-8111-900000000004';
SET @SRV_005 := '90000005-1111-4111-8111-900000000005';
SET @SRV_006 := '90000006-1111-4111-8111-900000000006';
SET @SRV_007 := '90000007-1111-4111-8111-900000000007';
SET @SRV_008 := '90000008-1111-4111-8111-900000000008';
SET @SRV_009 := '90000009-1111-4111-8111-900000000009';

-- images
SET @IMG_001A := '92000001-1111-4111-8111-920000000001';
SET @IMG_001B := '92000001-1111-4111-8111-920000000002';
SET @IMG_001C := '92000001-1111-4111-8111-920000000003';

SET @IMG_002A := '92000002-1111-4111-8111-920000000001';
SET @IMG_002B := '92000002-1111-4111-8111-920000000002';
SET @IMG_002C := '92000002-1111-4111-8111-920000000003';

SET @IMG_003A := '92000003-1111-4111-8111-920000000001';
SET @IMG_003B := '92000003-1111-4111-8111-920000000002';
SET @IMG_003C := '92000003-1111-4111-8111-920000000003';

SET @IMG_004A := '92000004-1111-4111-8111-920000000001';
SET @IMG_004B := '92000004-1111-4111-8111-920000000002';
SET @IMG_004C := '92000004-1111-4111-8111-920000000003';

SET @IMG_005A := '92000005-1111-4111-8111-920000000001';
SET @IMG_005B := '92000005-1111-4111-8111-920000000002';
SET @IMG_005C := '92000005-1111-4111-8111-920000000003';

SET @IMG_006A := '92000006-1111-4111-8111-920000000001';
SET @IMG_006B := '92000006-1111-4111-8111-920000000002';
SET @IMG_006C := '92000006-1111-4111-8111-920000000003';

SET @IMG_007A := '92000007-1111-4111-8111-920000000001';
SET @IMG_007B := '92000007-1111-4111-8111-920000000002';
SET @IMG_007C := '92000007-1111-4111-8111-920000000003';

SET @IMG_008A := '92000008-1111-4111-8111-920000000001';
SET @IMG_008B := '92000008-1111-4111-8111-920000000002';
SET @IMG_008C := '92000008-1111-4111-8111-920000000003';

SET @IMG_009A := '92000009-1111-4111-8111-920000000001';
SET @IMG_009B := '92000009-1111-4111-8111-920000000002';
SET @IMG_009C := '92000009-1111-4111-8111-920000000003';

-- -------------------------------------------------------------------
-- 1) TR i18n: services_i18n (UPSERT)
-- Slugs are stable across locales for link consistency
-- -------------------------------------------------------------------
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,`description`,
 `material`,`price`,`includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
VALUES
-- 001
('91000001-1111-4111-8111-910000000001', @SRV_001,'tr',
 'maintenance-repair',
 'Periyodik Bakım ve Onarım',
 'Ensotek, su soğutma kulelerinizde dolgu, nozül, damla tutucu (drift eliminator), fan grubu, motor-redüktör ve mekanik aksamların performansını saha kontrolleriyle doğrular. Titreşim/ses analizi, hizalama, sızdırmazlık ve su dağıtım homojenliği ölçümleri ile arıza önleyici bakım planı oluşturur. Amaç; duruşları azaltmak, yaklaşım sıcaklığını stabilize etmek ve ekipman ömrünü uzatmaktır.',
 'Dolgu, nozül, drift eliminator, fan, motor/redüktör, mekanik parçalar (kapsama göre)',
 'Kapsama göre tekliflendirilir',
 'Kontrol & raporlama, temizlik, mekanik bakım, kritik parça değişimi, saha testleri',
 'İşçilik ve ekipman bazlı garanti koşulları',
 'Soğutma kulesi bakım ve onarım hizmeti',
 'bakım, onarım, periyodik kontrol, titreşim analizi, mekanik bakım',
 'Periyodik Bakım ve Onarım | Ensotek',
 'Ensotek, su soğutma kulelerinde bakım ve onarım hizmeti ile duruşları azaltır, verimliliği artırır ve ekipman ömrünü uzatır.',
 'soğutma kulesi bakım, kule onarım, fan motor bakım, drift eliminator',
 NOW(3), NOW(3)),

-- 002
('91000002-1111-4111-8111-910000000002', @SRV_002,'tr',
 'modernization-retrofit',
 'Modernizasyon ve Retrofit',
 'Mevcut kulelerde kapasite ve verimlilik kazanımı için dolgu/nozül upgrade, fan kanadı optimizasyonu, motor-redüktör grubu revizyonu, VFD entegrasyonu ve drift kaybı iyileştirmeleri uygulanır. Hidrolik dengeleme ve su dağıtım revizyonu ile kule kesitinde homojen dağılım hedeflenir.',
 'Retrofit bileşenleri (dolgu/nozül/fan-motor/VFD vb.) projeye göre',
 'Kapsama göre tekliflendirilir',
 'Analiz, projelendirme, uygulama, test ve performans doğrulama',
 'Projeye göre',
 'Soğutma kulesi modernizasyon ve retrofit',
 'modernizasyon, retrofit, vfd, dolgu değişimi, fan upgrade',
 'Modernizasyon ve Retrofit | Ensotek',
 'Ensotek, soğutma kulelerinde retrofit modernizasyon ile kapasiteyi artırır, enerji tüketimini düşürür ve performansı stabilize eder.',
 'soğutma kulesi modernizasyon, retrofit, vfd, dolgu değişimi',
 NOW(3), NOW(3)),

-- 003
('91000003-1111-4111-8111-910000000003', @SRV_003,'tr',
 'spare-parts-components',
 'Yedek Parçalar ve Kritik Bileşenler',
 'Katalogdaki ana komponentlerle uyumlu şekilde; nozül tipleri, su dağıtım elemanları, PVC film dolgu / PP dolgu, damla tutucu, fan kanatları, motor-redüktör ve mekanik bağlantı elemanları için doğru parça eşleştirmesi yapılır. Hızlı tedarik + opsiyonel montaj/devreye alma desteği ile işletme riski azaltılır.',
 'Dolgu, nozül, drift eliminator, fan, motor, redüktör, mekanik parçalar',
 'Parça ve tedarik durumuna göre',
 'Parça seçimi danışmanlığı, tedarik, opsiyonel montaj ve devreye alma desteği',
 'Ürün bazlı garanti',
 'Soğutma kulesi yedek parça ve bileşenler',
 'yedek parça, dolgu, nozül, fan, motor, redüktör',
 'Yedek Parçalar ve Bileşenler | Ensotek',
 'Ensotek, soğutma kuleleri için yedek parça ve bileşen tedariki sağlar; doğru parça seçimi ile arıza riskini azaltır.',
 'soğutma kulesi yedek parça, dolgu, nozül, fan motor, redüktör',
 NOW(3), NOW(3)),

-- 004
('91000004-1111-4111-8111-910000000004', @SRV_004,'tr',
 'automation-scada',
 'Otomasyon, SCADA ve Uzaktan İzleme',
 'Debi, sıcaklık, iletkenlik, seviye, enerji tüketimi ve titreşim şalteri gibi kritik parametreler izlenerek alarm/raporlama altyapısı kurulabilir. Hedef; arızayı erken yakalamak, verim düşüşünü görünür kılmak ve bakım aksiyonlarını veriye dayalı yönetmektir.',
 NULL,
 'Kapsama göre tekliflendirilir',
 'Sensör seçimi, pano/otomasyon, SCADA ekranları, alarm senaryoları, uzaktan erişim',
 'Projeye göre',
 'Soğutma kulesi otomasyon ve SCADA',
 'otomasyon, scada, uzaktan izleme, alarm, enerji izleme',
 'Otomasyon ve SCADA | Ensotek',
 'Ensotek, soğutma kuleleri için otomasyon ve SCADA çözümleri ile kritik parametreleri gerçek zamanlı izleme ve raporlama altyapısı kurar.',
 'soğutma kulesi otomasyon, scada, uzaktan izleme',
 NOW(3), NOW(3)),

-- 005
('91000005-1111-4111-8111-910000000005', @SRV_005,'tr',
 'engineering-support',
 'Mühendislik Desteği',
 'Isı yükü analizi, seçim/boyutlandırma, hidrolik dengeleme, performans analizi ve teknik dokümantasyon süreçleri Ensotek mühendisliği ile yürütülür. Uygulama öncesi ve sonrası ölçümlerle hedef performans doğrulanır.',
 'Proje ihtiyacına göre mühendislik hesapları ve saha ekipmanları',
 'Kapsama göre tekliflendirilir',
 'Keşif, hesaplar, tasarım, devreye alma desteği, performans doğrulama, eğitim',
 'Hizmet kapsamına göre',
 'Soğutma kulesi mühendislik desteği',
 'mühendislik, optimizasyon, performans, devreye alma, eğitim',
 'Mühendislik Desteği | Ensotek',
 'Ensotek, soğutma kulelerinde mühendislik desteği ile doğru tasarım, optimizasyon ve performans doğrulama sunar.',
 'soğutma kulesi mühendislik, performans analizi, optimizasyon',
 NOW(3), NOW(3)),

-- 006
('91000006-1111-4111-8111-910000000006', @SRV_006,'tr',
 'site-survey-engineering',
 'Keşif, Projelendirme ve Saha Mühendisliği',
 'Saha keşfi ile proses koşulları, yerleşim, erişim platformları, su dağıtım mimarisi, fan grubu ve mekanik entegrasyon gereksinimleri analiz edilir. Çıktı: seçim/boyutlandırma, yerleşim önerisi, uygulama planı ve risk/iş güvenliği kontrol listeleri.',
 NULL,
 'Kapsama göre tekliflendirilir',
 'Keşif, ölçüm, raporlama, seçim/boyutlandırma, mekanik konsept, uygulama planı',
 'Projeye göre',
 'Soğutma kulesi keşif ve projelendirme',
 'keşif, projelendirme, boyutlandırma, seçim, uygulama planı',
 'Keşif ve Projelendirme | Ensotek',
 'Ensotek, saha keşfi ve mühendislik ile doğru kule seçimi, yerleşim ve uygulama planını uçtan uca yönetir.',
 'soğutma kulesi keşif, projelendirme, boyutlandırma',
 NOW(3), NOW(3)),

-- 007
('91000007-1111-4111-8111-910000000007', @SRV_007,'tr',
 'performance-optimization',
 'Performans Optimizasyonu ve Enerji Verimliliği',
 'Yaklaşım sıcaklığı, fan verimi, su dağıtım homojenliği, drift kaybı ve su kimyası parametreleri ölçülür. Dolgu/nozül dağıtımı, fan grubu ayarları ve operasyon setleri iyileştirilerek enerji maliyetleri düşürülür; raporlanabilir KPI seti oluşturulur.',
 NULL,
 'Kapsama göre tekliflendirilir',
 'Yerinde ölçüm, analiz, aksiyon planı, raporlama, doğrulama testleri',
 'Projeye göre',
 'Soğutma kulesi performans optimizasyonu',
 'performans, verimlilik, enerji, ölçüm, raporlama',
 'Performans Optimizasyonu | Ensotek',
 'Ensotek, yerinde ölçümler ve raporlama ile soğutma kulelerinde performansı iyileştirir, enerji tüketimini düşürür.',
 'soğutma kulesi performans optimizasyon, enerji verimliliği',
 NOW(3), NOW(3)),

-- 008
('91000008-1111-4111-8111-910000000008', @SRV_008,'tr',
 'commissioning-startup',
 'Kurulum & Devreye Alma',
 'Montaj koordinasyonu, kontrol listeleri, test çalıştırmaları, titreşim kontrolleri, su dağıtım testleri ve güvenli ilk çalıştırma adımları yürütülür. Operatör eğitimi ve devreye alma tutanakları ile sistem çalışır şekilde teslim edilir.',
 NULL,
 'Kapsama göre tekliflendirilir',
 'Kurulum koordinasyonu, devreye alma, testler, eğitim, teslim dokümantasyonu',
 'Projeye göre',
 'Soğutma kulesi devreye alma ve eğitim',
 'devreye alma, kurulum, test, eğitim, check-list',
 'Kurulum ve Devreye Alma | Ensotek',
 'Ensotek, kurulum koordinasyonu ve devreye alma ile sistemi güvenli şekilde çalıştırır; operatör eğitimini tamamlar.',
 'soğutma kulesi devreye alma, kurulum, operatör eğitimi',
 NOW(3), NOW(3)),

-- 009
('91000009-1111-4111-8111-910000000009', @SRV_009,'tr',
 'emergency-response',
 'Acil Servis ve Arıza Müdahalesi',
 'Kritik duruşlarda hızlı teşhis, parça değişimi (fan/motor/redüktör, nozül, dolgu, drift eliminator vb.), güvenli yeniden çalıştırma ve olay raporu ile süreç yönetilir. Sonrasında kök neden analizi ve önleyici bakım planı sunulur.',
 NULL,
 'Kapsama göre',
 'Hızlı müdahale, teşhis, parça değişimi, güvenli restart, raporlama',
 'Projeye göre',
 'Soğutma kulesi acil servis',
 'acil servis, arıza, müdahale, restart, raporlama',
 'Acil Servis ve Arıza Müdahalesi | Ensotek',
 'Ensotek, soğutma kulelerinde kritik arızalara hızlı müdahale eder; güvenli yeniden devreye alma süreçlerini yönetir.',
 'soğutma kulesi acil servis, arıza müdahale',
 NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `slug` = VALUES(`slug`),
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `material` = VALUES(`material`),
  `price` = VALUES(`price`),
  `includes` = VALUES(`includes`),
  `warranty` = VALUES(`warranty`),
  `image_alt` = VALUES(`image_alt`),
  `tags` = VALUES(`tags`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`),
  `meta_keywords` = VALUES(`meta_keywords`),
  `updated_at` = NOW(3);

-- -------------------------------------------------------------------
-- 2) TR image i18n: service_images_i18n (UPSERT)
-- -------------------------------------------------------------------
INSERT INTO `service_images_i18n`
(`id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`)
VALUES
-- SRV_001
('93000001-1111-4111-8111-930000000001',@IMG_001A,'tr','Periyodik Kontroller','Periyodik bakım kontrolleri','Fan grubu, motor-redüktör ve mekanik aksam kontrolleri.',NOW(3),NOW(3)),
('93000001-1111-4111-8111-930000000002',@IMG_001B,'tr','Temizlik ve Dağıtım Kontrolü','Su dağıtım kontrolü','Nozül ve su dağıtım homojenliği doğrulaması.',NOW(3),NOW(3)),
('93000001-1111-4111-8111-930000000003',@IMG_001C,'tr','Saha Onarımı','Yerinde onarım','Kritik parça değişimi ve güvenli yeniden çalıştırma.',NOW(3),NOW(3)),

-- SRV_002
('93000002-1111-4111-8111-930000000001',@IMG_002A,'tr','Retrofit Analizi','Modernizasyon analizi','Dolgu/nozül upgrade ve hidrolik revizyon planı.',NOW(3),NOW(3)),
('93000002-1111-4111-8111-930000000002',@IMG_002B,'tr','Verimlilik İyileştirme','Enerji verimliliği','Fan-motor optimizasyonu ve VFD senaryoları.',NOW(3),NOW(3)),
('93000002-1111-4111-8111-930000000003',@IMG_002C,'tr','Saha Uygulaması','Saha modernizasyonu','Testler ve performans doğrulama ile teslim.',NOW(3),NOW(3)),

-- SRV_003
('93000003-1111-4111-8111-930000000001',@IMG_003A,'tr','Parça Eşleştirme','Doğru parça seçimi','Kule tipine göre nozül/dolgu/drift eliminator seçimi.',NOW(3),NOW(3)),
('93000003-1111-4111-8111-930000000002',@IMG_003B,'tr','Hızlı Tedarik','Tedarik ve lojistik','Stok ve teslimat planlaması.',NOW(3),NOW(3)),
('93000003-1111-4111-8111-930000000003',@IMG_003C,'tr','Uygulama Desteği','Montaj desteği','Opsiyonel montaj ve devreye alma.',NOW(3),NOW(3)),

-- SRV_004
('93000004-1111-4111-8111-930000000001',@IMG_004A,'tr','Sensör & Alarm Tasarımı','Alarm altyapısı','Debi/sıcaklık/iletkenlik ve titreşim izleme.',NOW(3),NOW(3)),
('93000004-1111-4111-8111-930000000002',@IMG_004B,'tr','SCADA Ekranları','SCADA ekranları','Operatör için canlı izleme ve raporlama.',NOW(3),NOW(3)),
('93000004-1111-4111-8111-930000000003',@IMG_004C,'tr','Uzaktan Erişim','Uzaktan izleme','Güvenli uzaktan bağlantı ve bildirimler.',NOW(3),NOW(3)),

-- SRV_005
('93000005-1111-4111-8111-930000000001',@IMG_005A,'tr','Isı Yükü Analizi','Isı yükü hesabı','Doğru kule seçimi için hesaplama.',NOW(3),NOW(3)),
('93000005-1111-4111-8111-930000000002',@IMG_005B,'tr','Performans Değerlendirme','Performans analizi','Ölçüm ve kıyaslama ile optimizasyon fırsatları.',NOW(3),NOW(3)),
('93000005-1111-4111-8111-930000000003',@IMG_005C,'tr','Teknik Eğitim','Operatör eğitimi','Dokümantasyon ve eğitim oturumları.',NOW(3),NOW(3)),

-- SRV_006
('93000006-1111-4111-8111-930000000001',@IMG_006A,'tr','Saha Keşfi','Saha keşfi','Yerleşim, erişim ve güvenlik kontrol listeleri.',NOW(3),NOW(3)),
('93000006-1111-4111-8111-930000000002',@IMG_006B,'tr','Projelendirme','Mekanik tasarım','Seçim/boyutlandırma ve uygulama planı.',NOW(3),NOW(3)),
('93000006-1111-4111-8111-930000000003',@IMG_006C,'tr','Uygulama Hazırlığı','Uygulama hazırlığı','Montaj koordinasyonu için planlama.',NOW(3),NOW(3)),

-- SRV_007
('93000007-1111-4111-8111-930000000001',@IMG_007A,'tr','KPI Ölçümleri','KPI ölçümü','Yaklaşım sıcaklığı ve verim metrikleri.',NOW(3),NOW(3)),
('93000007-1111-4111-8111-930000000002',@IMG_007B,'tr','Raporlama','Raporlama','Öncesi/sonrası kıyas ve aksiyon planı.',NOW(3),NOW(3)),
('93000007-1111-4111-8111-930000000003',@IMG_007C,'tr','İyileştirme Uygulaması','İyileştirme','Fan/dağıtım/dolgu optimizasyonu.',NOW(3),NOW(3)),

-- SRV_008
('93000008-1111-4111-8111-930000000001',@IMG_008A,'tr','Kontrol Listeleri','Kontrol listeleri','Ön devreye alma kontrolleri.',NOW(3),NOW(3)),
('93000008-1111-4111-8111-930000000002',@IMG_008B,'tr','Test Çalıştırması','Test','Titreşim ve güvenli çalıştırma adımları.',NOW(3),NOW(3)),
('93000008-1111-4111-8111-930000000003',@IMG_008C,'tr','Eğitim & Teslim','Eğitim','Operatör eğitimi ve dokümantasyon.',NOW(3),NOW(3)),

-- SRV_009
('93000009-1111-4111-8111-930000000001',@IMG_009A,'tr','Hızlı Müdahale','Acil müdahale','Kritik duruşlarda hızlı teşhis.',NOW(3),NOW(3)),
('93000009-1111-4111-8111-930000000002',@IMG_009B,'tr','Parça Değişimi','Parça değişimi','Fan/motor/redüktör ve kritik komponent değişimi.',NOW(3),NOW(3)),
('93000009-1111-4111-8111-930000000003',@IMG_009C,'tr','Güvenli Restart','Güvenli yeniden çalıştırma','Kontroller, testler ve olay raporu.',NOW(3),NOW(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `alt` = VALUES(`alt`),
  `caption` = VALUES(`caption`),
  `updated_at` = NOW(3);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
