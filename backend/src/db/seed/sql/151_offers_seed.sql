-- =============================================================
-- FILE: 151_offers_seed.sql
-- Ensotek – Offers Seed Data (test/demo)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- Sayaç: 2026 yılı, 5 kayıt eklenecek
INSERT INTO `offer_number_counters` (`year`, `last_seq`, `prefix`)
VALUES (2026, 5, 'ENS')
ON DUPLICATE KEY UPDATE `last_seq` = VALUES(`last_seq`), `prefix` = VALUES(`prefix`);

-- =========================
-- DEMO OFFERS
-- =========================

INSERT INTO `offers`
(
  `id`, `offer_no`, `status`, `locale`, `country_code`,
  `customer_name`, `company_name`, `email`, `phone`,
  `subject`, `message`, `product_id`, `service_id`,
  `form_data`,
  `consent_marketing`, `consent_terms`,
  `currency`, `net_total`, `vat_rate`, `vat_total`, `shipping_total`, `gross_total`,
  `valid_until`, `admin_notes`, `pdf_url`, `pdf_asset_id`, `email_sent_at`,
  `created_at`, `updated_at`
)
VALUES

-- 1) Yeni teklif (new) – TR
(
  'ff000001-0001-4000-8000-000000000001',
  'ENS-2026-0001',
  'new',
  'tr',
  'Türkiye',
  'Ahmet Yılmaz',
  'Yılmaz Endüstri A.Ş.',
  'ahmet@yilmazendustri.com.tr',
  '+90 532 111 2233',
  'Açık Devre Soğutma Kulesi Teklif Talebi',
  'Fabrikamız için 500 m³/h kapasiteli açık devre soğutma kulesi teklifi almak istiyoruz.',
  NULL, NULL,
  '{"relatedType":"product","process":"Plastik Enjeksiyon","city":"Bursa","district":"Nilüfer","waterFlow":"500","inletTemp":"45","outletTemp":"32","wetBulb":"24","capacity":"7500 kW","waterQuality":"Şehir suyu","referralSource":"Google"}',
  1, 1,
  'EUR', 45000.00, 20.00, 9000.00, 1500.00, 55500.00,
  DATE_ADD(NOW(), INTERVAL 30 DAY),
  NULL, NULL, NULL, NULL,
  DATE_SUB(NOW(), INTERVAL 2 DAY),
  DATE_SUB(NOW(), INTERVAL 2 DAY)
),

-- 2) İncelemede (in_review) – DE
(
  'ff000001-0001-4000-8000-000000000002',
  'ENS-2026-0002',
  'in_review',
  'de',
  'Deutschland',
  'Thomas Müller',
  'Müller Chemie GmbH',
  'thomas@mueller-chemie.de',
  '+49 170 123 4567',
  'Angebot für geschlossenen Kühlturm',
  'Wir benötigen ein Angebot für einen geschlossenen Kreislauf-Kühlturm für unsere chemische Produktionsanlage.',
  NULL, NULL,
  '{"relatedType":"product","process":"Chemische Produktion","city":"München","waterFlow":"300","inletTemp":"40","outletTemp":"28","wetBulb":"21","capacity":"4200 kW","waterQuality":"Prozesswasser"}',
  0, 1,
  'EUR', 62000.00, 19.00, 11780.00, 2800.00, 76580.00,
  DATE_ADD(NOW(), INTERVAL 45 DAY),
  'Teknik ekip kapasiteyi inceliyor.',
  NULL, NULL, NULL,
  DATE_SUB(NOW(), INTERVAL 5 DAY),
  DATE_SUB(NOW(), INTERVAL 3 DAY)
),

-- 3) Fiyatlandırıldı (quoted) – EN
(
  'ff000001-0001-4000-8000-000000000003',
  'ENS-2026-0003',
  'quoted',
  'en',
  'United Kingdom',
  'James Wilson',
  'Wilson Engineering Ltd.',
  'james@wilson-eng.co.uk',
  '+44 7700 900123',
  'Hybrid Cooling System Quote',
  'We are looking for a hybrid cooling system for our HVAC plant. Please provide a detailed quotation.',
  NULL, NULL,
  '{"relatedType":"product","process":"HVAC","city":"Manchester","waterFlow":"200","inletTemp":"38","outletTemp":"30","wetBulb":"19","capacity":"1860 kW","waterQuality":"Mains water","poolType":"Open","location":"Rooftop"}',
  1, 1,
  'EUR', 38500.00, 20.00, 7700.00, 3200.00, 49400.00,
  DATE_ADD(NOW(), INTERVAL 60 DAY),
  'PDF hazırlandı, müşteriye gönderilecek.',
  NULL, NULL, NULL,
  DATE_SUB(NOW(), INTERVAL 10 DAY),
  DATE_SUB(NOW(), INTERVAL 1 DAY)
),

-- 4) Gönderildi (sent) – TR
(
  'ff000001-0001-4000-8000-000000000004',
  'ENS-2026-0004',
  'sent',
  'tr',
  'Türkiye',
  'Fatma Demir',
  'Demir Gıda San. Tic. Ltd.',
  'fatma@demirgida.com.tr',
  '+90 544 555 6677',
  'Soğutma Kulesi Yedek Parça Teklifi',
  'Mevcut soğutma kulemiz için fan, dolgu malzemesi ve nozul yedek parçaları teklif istiyoruz.',
  NULL, NULL,
  '{"relatedType":"sparepart","existingTower":"Ensotek CTP-150 (2019)","notes":"Acil ihtiyaç, 2 hafta içinde teslimat bekleniyor."}',
  1, 1,
  'EUR', 8750.00, 20.00, 1750.00, 500.00, 11000.00,
  DATE_ADD(NOW(), INTERVAL 15 DAY),
  'PDF gönderildi, müşteri dönüş bekliyor.',
  '/uploads/offers/ENS-2026-0004.pdf',
  NULL,
  DATE_SUB(NOW(), INTERVAL 1 DAY),
  DATE_SUB(NOW(), INTERVAL 14 DAY),
  DATE_SUB(NOW(), INTERVAL 1 DAY)
),

-- 5) Kabul edildi (accepted) – DE
(
  'ff000001-0001-4000-8000-000000000005',
  'ENS-2026-0005',
  'accepted',
  'de',
  'Österreich',
  'Anna Schneider',
  'Schneider Technik AG',
  'anna@schneider-technik.at',
  '+43 660 123 4567',
  'Wartungsvertrag Kühlturm',
  'Wir möchten einen jährlichen Wartungsvertrag für unseren bestehenden Ensotek-Kühlturm abschließen.',
  NULL, '90000001-1111-4111-8111-900000000001',
  '{"relatedType":"service","serviceName":"Wartung & Reparatur","existingTower":"Ensotek DCTP-200 (2021)","city":"Wien","referralSource":"Messe Aquatherm"}',
  1, 1,
  'EUR', 12000.00, 20.00, 2400.00, 0.00, 14400.00,
  NULL,
  'Yıllık bakım sözleşmesi onaylandı. Sözleşme hazırlanıyor.',
  '/uploads/offers/ENS-2026-0005.pdf',
  NULL,
  DATE_SUB(NOW(), INTERVAL 7 DAY),
  DATE_SUB(NOW(), INTERVAL 30 DAY),
  DATE_SUB(NOW(), INTERVAL 2 DAY)
)

ON DUPLICATE KEY UPDATE
  `offer_no`     = VALUES(`offer_no`),
  `status`       = VALUES(`status`),
  `updated_at`   = VALUES(`updated_at`);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
