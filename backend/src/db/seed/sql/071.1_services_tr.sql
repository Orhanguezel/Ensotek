-- =============================================================
-- FILE: 071.1_services_tr.sql
-- Ensotek services – PARENT + TR i18n + images + TR image i18n
-- - Category/Subcategory aligned with 011/012 seeds
-- - Production REMOVED (bbbb8001 is not used)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------------
-- FIXED SERVICE IDS (do not change; other locale files will reference)
-- -------------------------------------------------------------------
SET @SRV_001 := '90000001-1111-4111-8111-900000000001'; -- Bakım ve Onarım
SET @SRV_002 := '90000002-1111-4111-8111-900000000002'; -- Modernizasyon
SET @SRV_003 := '90000003-1111-4111-8111-900000000003'; -- Yedek Parçalar ve Bileşenler
SET @SRV_004 := '90000004-1111-4111-8111-900000000004'; -- Uygulamalar ve Referanslar
SET @SRV_005 := '90000005-1111-4111-8111-900000000005'; -- Mühendislik Desteği

-- -------------------------------------------------------------------
-- CATEGORY + SUBCATEGORY IDS (from 011/012)
-- -------------------------------------------------------------------
SET @CAT_SERVICES := 'aaaa8001-1111-4111-8111-aaaaaaaa8001';

-- IMPORTANT: Production removed => bbbb8001 NOT USED
SET @SUB_SVC_MAINTENANCE   := 'bbbb8002-1111-4111-8111-bbbbbbbb8002'; -- Bakım ve Onarım
SET @SUB_SVC_MODERNIZATION := 'bbbb8003-1111-4111-8111-bbbbbbbb8003'; -- Modernizasyon
SET @SUB_SVC_SPAREPARTS    := 'bbbb8004-1111-4111-8111-bbbbbbbb8004'; -- Yedek Parçalar ve Bileşenler
SET @SUB_SVC_APPSREFS      := 'bbbb8005-1111-4111-8111-bbbbbbbb8005'; -- Uygulamalar ve Referanslar
SET @SUB_SVC_ENGINEERING   := 'bbbb8006-1111-4111-8111-bbbbbbbb8006'; -- Mühendislik Desteği

-- -------------------------------------------------------------------
-- FIXED IMAGE IDS (shared across locales)
-- -------------------------------------------------------------------
-- SRV_001
SET @IMG_001A := '92000001-1111-4111-8111-920000000001';
SET @IMG_001B := '92000001-1111-4111-8111-920000000002';
SET @IMG_001C := '92000001-1111-4111-8111-920000000003';

-- SRV_002
SET @IMG_002A := '92000002-1111-4111-8111-920000000001';
SET @IMG_002B := '92000002-1111-4111-8111-920000000002';
SET @IMG_002C := '92000002-1111-4111-8111-920000000003';

-- SRV_003
SET @IMG_003A := '92000003-1111-4111-8111-920000000001';
SET @IMG_003B := '92000003-1111-4111-8111-920000000002';
SET @IMG_003C := '92000003-1111-4111-8111-920000000003';

-- SRV_004
SET @IMG_004A := '92000004-1111-4111-8111-920000000001';
SET @IMG_004B := '92000004-1111-4111-8111-920000000002';
SET @IMG_004C := '92000004-1111-4111-8111-920000000003';

-- SRV_005
SET @IMG_005A := '92000005-1111-4111-8111-920000000001';
SET @IMG_005B := '92000005-1111-4111-8111-920000000002';
SET @IMG_005C := '92000005-1111-4111-8111-920000000003';

-- -------------------------------------------------------------------
-- 1) PARENT: services (insert only; DB is fresh)
-- -------------------------------------------------------------------
INSERT INTO `services`
(`id`,`type`,`category_id`,`sub_category_id`,
 `featured`,`is_active`,`display_order`,
 `featured_image`,`image_url`,`image_asset_id`,
 `area`,`duration`,`maintenance`,`season`,`thickness`,`equipment`,
 `created_at`,`updated_at`)
VALUES
(@SRV_001,'maintenance_and_repair',@CAT_SERVICES,@SUB_SVC_MAINTENANCE,
 1,1,10,
 NULL,'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80',NULL,
 'Mevcut kuleler / tesisler / ticari binalar','1 gün – 4 hafta (kapsama göre)','Periyodik bakım sözleşmesi opsiyonel','4 mevsim',NULL,'Nozul, dolgu, fan, motor, redüktör, mekanik komponentler',
 NOW(3), NOW(3)),

(@SRV_002,'modernization',@CAT_SERVICES,@SUB_SVC_MODERNIZATION,
 1,1,20,
 NULL,'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1600&q=80',NULL,
 'Kapasite artırımı / verimlilik iyileştirme','1–6 hafta (analiz + uygulama)','Bakım planı ile birlikte önerilir','4 mevsim',NULL,'Dolgu/nozul upgrade, fan-motor optimizasyonu, VFD, drift iyileştirme',
 NOW(3), NOW(3)),

(@SRV_003,'spare_parts_and_components',@CAT_SERVICES,@SUB_SVC_SPAREPARTS,
 1,1,30,
 NULL,'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',NULL,
 'Yedek parça / bileşen tedariki','Stok ve tedarik süresine bağlı','Kritik parçalar için kontrol planı önerilir','4 mevsim',NULL,'Dolgu, nozul, damla tutucu, fan kanadı, motor, redüktör, kayış-kasnak, ekipman',
 NOW(3), NOW(3)),

(@SRV_004,'applications_and_references',@CAT_SERVICES,@SUB_SVC_APPSREFS,
 1,1,40,
 NULL,'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80',NULL,
 'Sektörel uygulamalar / referans projeler','Proje kapsamına bağlı','Opsiyonel bakım ve performans izleme','4 mevsim',NULL,'Enerji, kimya, gıda, otomotiv, AVM, veri merkezi vb. uygulama senaryoları',
 NOW(3), NOW(3)),

(@SRV_005,'engineering_support',@CAT_SERVICES,@SUB_SVC_ENGINEERING,
 1,1,50,
 NULL,'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1600&q=80',NULL,
 'Projelendirme / danışmanlık / optimizasyon','2–8 hafta (kapsama göre)','Alarm/raporlama + periyodik kontrol opsiyonel','4 mevsim',NULL,'Isı yükü analizi, hidrolik dengeleme, performans analizi, teknik eğitim, devreye alma',
 NOW(3), NOW(3));

-- -------------------------------------------------------------------
-- 2) TR i18n: services_i18n
-- -------------------------------------------------------------------
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,`description`,
 `material`,`price`,`includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
VALUES
('91000001-1111-4111-8111-910000000001', @SRV_001,'de',
 'bakim-ve-onarim',
 'Bakım ve Onarım',
 'Ensotek, endüstriyel su soğutma kulelerinizin sorunsuz çalışmasını sağlamak amacıyla periyodik bakım ve profesyonel onarım hizmetleri sunar. Programlı kontroller; dolgu/nozul dağıtımı, fan-motor verimi, titreşim/ses analizi, mekanik hizalama, sızdırmazlık ve su şartlandırma kontrollerini kapsar. Arıza önleyici yaklaşım ile duruş süreleri azalır, performans kaybı önlenir ve ekipman ömrü uzar.',
 'Nozul, dolgu, damla tutucu, fan/motor/redüktör, mekanik parçalar (kapsama göre)',
 'Bakım kapsamına göre tekliflendirilir',
 'Kontrol & raporlama, temizlik, mekanik bakım, kritik parça değişimi, saha testleri',
 'İşçilik ve ekipman bazlı garanti',
 'Soğutma kulesi bakım ve onarım',
 'bakım, onarım, periyodik kontrol, verimlilik, titreşim analizi',
 'Bakım ve Onarım | Ensotek',
 'Ensotek, soğutma kuleleri için periyodik bakım ve onarım hizmetleri ile duruşları azaltır, verimliliği artırır ve ekipman ömrünü uzatır.',
 'soğutma kulesi bakımı, kule onarım, periyodik bakım, fan motor bakım',
 NOW(3), NOW(3)),

('91000002-1111-4111-8111-910000000002', @SRV_002,'de',
 'modernizasyon',
 'Modernizasyon',
 'Ensotek, mevcut su soğutma kulelerinin daha verimli ve güncel standartlara uygun çalışabilmesi için modernizasyon çözümleri sunar. Retrofit kapsamında dolgu/nozul upgrade, fan-motor optimizasyonu, VFD entegrasyonu, drift kaybı iyileştirmeleri ve su dağıtım mimarisi revizyonları uygulanabilir. Amaç; daha düşük enerji tüketimi, daha stabil proses ve daha yüksek kapasitedir.',
 'Retrofit bileşenleri (dolgu/nozul/fan-motor/VFD vb.) projeye göre',
 'Modernizasyon kapsamına göre tekliflendirilir',
 'Analiz, projelendirme, uygulama, test ve performans doğrulama',
 'İşçilik ve ekipman bazlı garanti',
 'Soğutma kulesi modernizasyon ve retrofit',
 'modernizasyon, retrofit, vfd, fan upgrade, dolgu değişimi',
 'Modernizasyon | Ensotek',
 'Ensotek, soğutma kulelerinde modernizasyon (retrofit) ile kapasiteyi artırır, enerji tüketimini düşürür ve performansı stabilize eder.',
 'soğutma kulesi modernizasyon, retrofit, vfd, dolgu değişimi, fan upgrade',
 NOW(3), NOW(3)),

('91000003-1111-4111-8111-910000000003', @SRV_003,'de',
 'yedek-parcalar-ve-bilesenler',
 'Yedek Parçalar ve Bileşenler',
 'Ensotek, su soğutma kuleleri için geniş bir yedek parça ve bileşen portföyü sunar. Dolgu, nozul, damla tutucu, fan kanatları, motor/redüktör ve mekanik bağlantı elemanları gibi kritik parçalar uzun ömür ve güvenilir işletme için kalite odaklı seçilir.',
 'Dolgu, nozul, drift eliminator, fan, motor, redüktör, mekanik parçalar',
 'Parça ve tedarik durumuna göre tekliflendirilir',
 'Parça seçimi danışmanlığı, tedarik, opsiyonel montaj ve devreye alma desteği',
 'Ürün bazlı garanti koşulları',
 'Soğutma kulesi yedek parça ve bileşenler',
 'yedek parça, dolgu, nozul, fan, motor, redüktör, drift eliminator',
 'Yedek Parçalar | Ensotek',
 'Ensotek, soğutma kuleleri için yedek parça ve bileşen tedariki sağlar; doğru parça seçimi ile verimliliği artırır ve arıza riskini azaltır.',
 'soğutma kulesi yedek parça, dolgu, nozul, fan motor, redüktör',
 NOW(3), NOW(3)),

('91000004-1111-4111-8111-910000000004', @SRV_004,'de',
 'uygulamalar-ve-referanslar',
 'Uygulamalar ve Referanslar',
 'Ensotek, endüstriyel ve ticari alanlarda çok sayıda referans projeye ve uygulamaya sahiptir. Enerji, kimya, gıda, ilaç, otomotiv ve daha birçok sektörde su soğutma kuleleriyle farklı ihtiyaçlara uygun çözümler sunar.',
 NULL,
 'Proje kapsamına göre tekliflendirilir',
 'Uygulama analizi, referans sunumu, keşif ve proje planlama desteği',
 'Projeye göre',
 'Sektörel uygulamalar ve referans projeler',
 'uygulamalar, referanslar, sektör çözümleri, proje deneyimi',
 'Uygulamalar & Referanslar | Ensotek',
 'Ensotek, farklı sektörlerdeki referans projeleri ve uygulama deneyimi ile soğutma kulesi çözümlerinde güvenilir iş ortağıdır.',
 'soğutma kulesi referanslar, uygulamalar, endüstriyel soğutma projeleri',
 NOW(3), NOW(3)),

('91000005-1111-4111-8111-910000000005', @SRV_005,'de',
 'muhendislik-destegi',
 'Mühendislik Desteği',
 'Ensotek; projelendirme, danışmanlık, sistem optimizasyonu, performans analizi ve teknik eğitim dahil olmak üzere kapsamlı mühendislik destek hizmetleri sağlar. Isı yükü analizi, hidrolik dengeleme, ekipman seçimi ve devreye alma süreçleri dokümantasyon ile yürütülür.',
 'Proje ihtiyacına göre mühendislik hesapları ve saha ekipmanları',
 'Kapsama göre tekliflendirilir',
 'Keşif, hesaplar, tasarım, devreye alma desteği, performans doğrulama, eğitim',
 'Hizmet kapsamına göre',
 'Soğutma kulesi mühendislik desteği',
 'mühendislik, optimizasyon, performans analizi, devreye alma, eğitim',
 'Mühendislik Desteği | Ensotek',
 'Ensotek, soğutma kulelerinde mühendislik desteği ile doğru tasarım, optimizasyon, performans doğrulama ve eğitim hizmetlerini uçtan uca sunar.',
 'soğutma kulesi mühendislik, performans analizi, optimizasyon, devreye alma',
 NOW(3), NOW(3));

-- -------------------------------------------------------------------
-- 3) service_images (parent)
-- -------------------------------------------------------------------
INSERT INTO `service_images`
(`id`,`service_id`,`image_asset_id`,`image_url`,`is_active`,`display_order`,`created_at`,`updated_at`)
VALUES
(@IMG_001A,@SRV_001,NULL,'https://images.unsplash.com/photo-1516575150278-77136aed6920?auto=format&fit=crop&w=1600&q=80',1,10,NOW(3),NOW(3)),
(@IMG_001B,@SRV_001,NULL,'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1600&q=80',1,20,NOW(3),NOW(3)),
(@IMG_001C,@SRV_001,NULL,'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80',1,30,NOW(3),NOW(3)),

(@IMG_002A,@SRV_002,NULL,'https://images.unsplash.com/photo-1582719478185-2f0e4e2cdb4a?auto=format&fit=crop&w=1600&q=80',1,10,NOW(3),NOW(3)),
(@IMG_002B,@SRV_002,NULL,'https://images.unsplash.com/photo-1581092795360-0dc3e2b31d08?auto=format&fit=crop&w=1600&q=80',1,20,NOW(3),NOW(3)),
(@IMG_002C,@SRV_002,NULL,'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1600&q=80',1,30,NOW(3),NOW(3)),

(@IMG_003A,@SRV_003,NULL,'https://images.unsplash.com/photo-1581091215367-59ab6b26d0f6?auto=format&fit=crop&w=1600&q=80',1,10,NOW(3),NOW(3)),
(@IMG_003B,@SRV_003,NULL,'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1600&q=80',1,20,NOW(3),NOW(3)),
(@IMG_003C,@SRV_003,NULL,'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',1,30,NOW(3),NOW(3)),

(@IMG_004A,@SRV_004,NULL,'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80',1,10,NOW(3),NOW(3)),
(@IMG_004B,@SRV_004,NULL,'https://images.unsplash.com/photo-1581092334555-1f9b6b3f6d2c?auto=format&fit=crop&w=1600&q=80',1,20,NOW(3),NOW(3)),
(@IMG_004C,@SRV_004,NULL,'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80',1,30,NOW(3),NOW(3)),

(@IMG_005A,@SRV_005,NULL,'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1600&q=80',1,10,NOW(3),NOW(3)),
(@IMG_005B,@SRV_005,NULL,'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1600&q=80',1,20,NOW(3),NOW(3)),
(@IMG_005C,@SRV_005,NULL,'https://images.unsplash.com/photo-1581092919535-7146a4c2f5f0?auto=format&fit=crop&w=1600&q=80',1,30,NOW(3),NOW(3));

-- -------------------------------------------------------------------
-- 4) TR image i18n: service_images_i18n
-- -------------------------------------------------------------------
INSERT INTO `service_images_i18n`
(`id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`)
VALUES
-- SRV_001
('93000001-1111-4111-8111-930000000001',@IMG_001A,'de','Periyodik Kontroller','Periyodik bakım kontrolleri','Planlı kontrol ve raporlama ile duruşları azaltma.',NOW(3),NOW(3)),
('93000001-1111-4111-8111-930000000002',@IMG_001B,'de','Mekanik Bakım','Mekanik bakım çalışması','Fan-motor, hizalama ve kritik komponent kontrolleri.',NOW(3),NOW(3)),
('93000001-1111-4111-8111-930000000003',@IMG_001C,'de','Saha Onarım','Yerinde onarım ve doğrulama','Ölçümler, testler ve performans doğrulama.',NOW(3),NOW(3)),

-- SRV_002
('93000002-1111-4111-8111-930000000001',@IMG_002A,'de','Kapasite Artırımı','Modernizasyon ile kapasite artışı','Dolgu/nozul optimizasyonu ve dağıtım iyileştirme.',NOW(3),NOW(3)),
('93000002-1111-4111-8111-930000000002',@IMG_002B,'de','Enerji Optimizasyonu','Enerji optimizasyonu','Fan-motor upgrade ve VFD ile tüketimi düşürme.',NOW(3),NOW(3)),
('93000002-1111-4111-8111-930000000003',@IMG_002C,'de','Saha Uygulaması','Saha modernizasyon uygulaması','Testler ve performans doğrulama ile çalışır teslim.',NOW(3),NOW(3)),

-- SRV_003
('93000003-1111-4111-8111-930000000001',@IMG_003A,'de','Parça Seçimi','Yedek parça seçimi','Kule tipine ve kapasiteye göre doğru parça seçimi.',NOW(3),NOW(3)),
('93000003-1111-4111-8111-930000000002',@IMG_003B,'de','Tedarik ve Lojistik','Yedek parça tedariki','Stok ve tedarik süreçlerinin yönetimi.',NOW(3),NOW(3)),
('93000003-1111-4111-8111-930000000003',@IMG_003C,'de','Uygulama Desteği','Montaj ve devreye alma desteği','Opsiyonel saha desteği ile sorunsuz işletme.',NOW(3),NOW(3)),

-- SRV_004
('93000004-1111-4111-8111-930000000001',@IMG_004A,'de','Sektörel Çözümler','Sektörel uygulamalar','Farklı sektörlere uygun konfigürasyonlar.',NOW(3),NOW(3)),
('93000004-1111-4111-8111-930000000002',@IMG_004B,'de','Referans Projeler','Referans projeler','Gerçek sahalardan deneyim ve çıktılar.',NOW(3),NOW(3)),
('93000004-1111-4111-8111-930000000003',@IMG_004C,'de','Uygulama Planlama','Uygulama planlama','Keşif ve planlama ile doğru proje yönetimi.',NOW(3),NOW(3)),

-- SRV_005
('93000005-1111-4111-8111-930000000001',@IMG_005A,'de','Isı Yükü Analizi','Isı yükü analizi','Doğru kapasite ve kule seçimi için analiz.',NOW(3),NOW(3)),
('93000005-1111-4111-8111-930000000002',@IMG_005B,'de','Performans Analizi','Performans analizi','Trend ve ölçümlerle optimizasyon fırsatları.',NOW(3),NOW(3)),
('93000005-1111-4111-8111-930000000003',@IMG_005C,'de','Devreye Alma & Eğitim','Devreye alma ve eğitim','Saha doğrulama ve operatör eğitimleri.',NOW(3),NOW(3));

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
