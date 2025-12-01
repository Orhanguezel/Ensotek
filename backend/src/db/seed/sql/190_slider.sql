-- 190_slider.sql  (Drizzle şemasıyla birebir uyumlu - locale + storage destekli)

DROP TABLE IF EXISTS `slider`;
CREATE TABLE `slider` (
  `id`                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`              CHAR(36)     NOT NULL,
  `locale`            VARCHAR(8)   NOT NULL DEFAULT 'tr',

  `name`              VARCHAR(255) NOT NULL,
  `slug`              VARCHAR(255) NOT NULL,
  `description`       TEXT,

  `image_url`         TEXT,
  `image_asset_id`    CHAR(36),
  `alt`               VARCHAR(255),
  `button_text`       VARCHAR(100),
  `button_link`       VARCHAR(255),

  `featured`          TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
  `is_active`         TINYINT(1) UNSIGNED NOT NULL DEFAULT 1,

  `display_order`     INT UNSIGNED NOT NULL DEFAULT 0,

  `created_at`        DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`        DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),

  UNIQUE KEY `uniq_slider_slug_locale` (`slug`,`locale`),
  UNIQUE KEY `uniq_slider_uuid`        (`uuid`),

  KEY `idx_slider_active`       (`is_active`),
  KEY `idx_slider_order`        (`display_order`),
  KEY `idx_slider_image_asset`  (`image_asset_id`),
  KEY `idx_slider_locale`       (`locale`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================
-- SEED: Ensotek – Su Soğutma Kuleleri Slider İçeriği (TR)
-- =============================================================

INSERT INTO `slider`
(`id`,`uuid`,`locale`,
 `name`,`slug`,`description`,
 `image_url`,`image_asset_id`,`alt`,`button_text`,`button_link`,
 `featured`,`is_active`,`display_order`,
 `created_at`,`updated_at`)
VALUES
-- slide-1 (Ana vurgu)
(1, UUID(), 'tr',
 'Endüstriyel Su Soğutma Kulelerinde Uzman Çözüm Ortağınız',
 'endustriyel-su-sogutma-kulelerinde-uzman-cozum-ortaginiz',
 'Enerji santralleri, endüstriyel tesisler ve ticari binalar için yüksek verimli su soğutma kulesi çözümleri sunuyoruz.',
 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&h=600&fit=crop',
 NULL,
 'Endüstriyel su soğutma kulesi çözümleri',
 'Teklif Al',
 'iletisim',
 1, 1, 1,
 '2024-01-20 00:00:00.000','2024-01-20 00:00:00.000'),

-- slide-2 (Ürün tipleri)
(2, UUID(), 'tr',
 'Açık ve Kapalı Devre Su Soğutma Kuleleri',
 'acik-ve-kapali-devre-su-sogutma-kuleleri',
 'FRP, galvanizli çelik ve betonarme gövdeli su soğutma kuleleri ile prosesinize en uygun çözümü tasarlıyoruz.',
 'https://images.unsplash.com/photo-1553177265-4563e44c7af9?w=1200&h=600&fit=crop',
 NULL,
 'Açık / kapalı devre su soğutma kuleleri',
 'Çözümleri İncele',
 'cozumler/su-sogutma-kulesi',
 0, 1, 2,
 '2024-01-21 00:00:00.000','2024-01-21 00:00:00.000'),

-- slide-3 (Projelendirme)
(3, UUID(), 'tr',
 'Keşif, Projelendirme ve Anahtar Teslim Montaj',
 'kesif-projelendirme-ve-anahtar-teslim-montaj',
 'Saha keşfi, ısı yükü hesapları, mekanik tasarım ve devreye alma süreçlerinin tamamını Ensotek mühendisliği ile yönetiyoruz.',
 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=1200&h=600&fit=crop',
 NULL,
 'Su soğutma kulesi keşif ve projelendirme',
 'Keşif Talep Et',
 'hizmetler/kesif-projelendirme',
 0, 1, 3,
 '2024-01-22 00:00:00.000','2024-01-22 00:00:00.000'),

-- slide-4 (Bakım / revizyon)
(4, UUID(), 'tr',
 'Periyodik Bakım ve Revizyon Hizmetleri',
 'periyodik-bakim-ve-revizyon-hizmetleri',
 'Mevcut su soğutma kuleleriniz için nozül, dolgu, fan ve mekanik aksam yenileme ile kapasite ve verimlilik iyileştirmeleri sağlıyoruz.',
 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=600&fit=crop',
 NULL,
 'Su soğutma kulesi bakım ve revizyon hizmetleri',
 'Bakım Planla',
 'hizmetler/bakim-revizyon',
 0, 1, 4,
 '2024-01-23 00:00:00.000','2024-01-23 00:00:00.000'),

-- slide-5 (Otomasyon / SCADA)
(5, UUID(), 'tr',
 'Otomasyon, SCADA ve Uzaktan İzleme Çözümleri',
 'otomasyon-scada-ve-uzaktan-izleme-cozumleri',
 'Su soğutma kulelerinizi enerji tüketimi, debi, sıcaklık ve arıza durumlarına göre gerçek zamanlı izleyebileceğiniz otomasyon altyapısı kuruyoruz.',
 'https://images.unsplash.com/photo-1582719478250-cc70d3d45ba1?w=1200&h=600&fit=crop',
 NULL,
 'Su soğutma kulesi otomasyon ve SCADA çözümleri',
 'Detaylı Bilgi Al',
 'hizmetler/otomasyon-scada',
 0, 1, 5,
 '2024-01-24 00:00:00.000','2024-01-24 00:00:00.000');
