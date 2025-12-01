-- 140_faqs.sql
-- Multilingual FAQs (faqs + faqs_i18n)

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Eski yapıyı temizle (önce child, sonra parent)
DROP TABLE IF EXISTS `faqs_i18n`;
DROP TABLE IF EXISTS `faqs`;

-- =============================================================
-- PARENT TABLO: faqs (dil bağımsız)
-- =============================================================
CREATE TABLE IF NOT EXISTS `faqs` (
  `id`            CHAR(36)     NOT NULL,
  `is_active`     TINYINT(1)   NOT NULL DEFAULT 1,
  `display_order` INT          NOT NULL DEFAULT 0,
  `created_at`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                                ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `faqs_active_idx`(`is_active`),
  KEY `faqs_order_idx`(`display_order`),
  KEY `faqs_created_idx`(`created_at`),
  KEY `faqs_updated_idx`(`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- I18N TABLO: faqs_i18n (locale + soru/cevap vs.)
-- =============================================================
CREATE TABLE IF NOT EXISTS `faqs_i18n` (
  `id`        CHAR(36)     NOT NULL,
  `faq_id`    CHAR(36)     NOT NULL,
  `locale`    VARCHAR(10)  NOT NULL,
  `question`  VARCHAR(500) NOT NULL,
  `answer`    LONGTEXT     NOT NULL,
  `slug`      VARCHAR(255) NOT NULL,
  `category`  VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                              ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_faqs_i18n_parent_locale` (`faq_id`, `locale`),
  UNIQUE KEY `ux_faqs_i18n_locale_slug`   (`locale`, `slug`),
  KEY `faqs_i18n_locale_idx`   (`locale`),
  KEY `faqs_i18n_slug_idx`     (`slug`),
  KEY `faqs_i18n_category_idx` (`category`),

  CONSTRAINT `fk_faqs_i18n_faq`
    FOREIGN KEY (`faq_id`) REFERENCES `faqs`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- SEED: PARENT KAYITLAR (faqs)
-- =============================================================

INSERT INTO `faqs`
(`id`,                                `is_active`, `display_order`, `created_at`,                `updated_at`)
VALUES
('11111111-1111-1111-1111-111111111111', 1, 1, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('22222222-2222-2222-2222-222222222222', 1, 2, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('33333333-3333-3333-3333-333333333333', 1, 3, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('44444444-4444-4444-4444-444444444444', 1, 4, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('55555555-5555-5555-5555-555555555555', 1, 5, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('66666666-6666-6666-6666-666666666666', 1, 6, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
  `is_active`     = VALUES(`is_active`),
  `display_order` = VALUES(`display_order`),
  `updated_at`    = VALUES(`updated_at`);

-- =============================================================
-- SEED: I18N KAYITLAR (faqs_i18n) – locale = 'tr'
-- =============================================================

INSERT INTO `faqs_i18n`
(`id`,
 `faq_id`,
 `locale`,
 `question`,
 `answer`,
 `slug`,
 `category`,
 `created_at`,
 `updated_at`)
VALUES
-- 1) Teslimat
('aaaa1111-1111-1111-1111-111111111111',
 '11111111-1111-1111-1111-111111111111',
 'tr',
 'Ürünler ne kadar sürede teslim edilir?',
 'Ödemeniz onaylandıktan sonra ürününüz otomatik olarak anında e-posta adresinize ve üye panelinize teslim edilir. Ortalama teslimat süresi 1-2 dakikadır.',
 'urunler-ne-kadar-surede-teslim-edilir',
 'Teslimat',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

-- 2) Ödeme yöntemleri
('bbbb2222-2222-2222-2222-222222222222',
 '22222222-2222-2222-2222-222222222222',
 'tr',
 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
 'Kredi kartı, banka havalesi, Papara, PayTR, Shopier ve kripto para (Coinbase Commerce) ile ödeme yapabilirsiniz. Tüm ödemeler SSL sertifikası ile güvence altındadır.',
 'hangi-odeme-yontemlerini-kabul-ediyorsunuz',
 'Ödeme',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

-- 3) Ürün çalışmazsa / iade & garanti
('cccc3333-3333-3333-3333-333333333333',
 '33333333-3333-3333-3333-333333333333',
 'tr',
 'Ürün çalışmazsa ne olur?',
 'Satın aldığınız ürün çalışmaz veya hatalı ise 7 gün içinde destek ekibimizle iletişime geçerek değişim veya iade talebinde bulunabilirsiniz. Tüm ürünlerimiz garanti kapsamındadır.',
 'urun-calismazsa-ne-olur',
 'İade & Garanti',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

-- 4) Toplu alım / indirim
('dddd4444-4444-4444-4444-444444444444',
 '44444444-4444-4444-4444-444444444444',
 'tr',
 'Toplu alımlarda indirim var mı?',
 'Evet! 5+ ürün alımlarında %5, 10+ ürün alımlarında %10 indirim otomatik olarak uygulanır. Daha fazla bilgi için müşteri hizmetlerimizle iletişime geçebilirsiniz.',
 'toplu-alimlarda-indirim-var-mi',
 'İndirim & Kampanya',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

-- 5) Lisans kullanımı
('eeee5555-5555-5555-5555-555555555555',
 '55555555-5555-5555-5555-555555555555',
 'tr',
 'Lisanslar kaç cihazda kullanılabilir?',
 'Her ürünün kullanım koşulları farklıdır. Ürün detay sayfasında lisans türü ve kaç cihazda kullanılabileceği belirtilmiştir. Tek kullanımlık, çoklu kullanım ve süreli lisanslar mevcuttur.',
 'lisanslar-kac-cihazda-kullanilabilir',
 'Lisans',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

-- 6) Destek kanalları
('ffff6666-6666-6666-6666-666666666666',
 '66666666-6666-6666-6666-666666666666',
 'tr',
 'Müşteri desteği nasıl alırım?',
 '7/24 canlı destek, e-posta, WhatsApp ve Telegram üzerinden bizimle iletişime geçebilirsiniz. Üye panelinizden destek talebi oluşturabilir veya SSS bölümünü inceleyebilirsiniz.',
 'musteri-destegi-nasil-alirim',
 'Destek',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
  `question`   = VALUES(`question`),
  `answer`     = VALUES(`answer`),
  `slug`       = VALUES(`slug`),
  `category`   = VALUES(`category`),
  `updated_at` = VALUES(`updated_at`);
