

-- =============================================================
-- 071_services_seed.sql  (Ensotek services – parent + i18n)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- =========================================================
-- 1) Bakım ve Onarım / Maintenance & Repair
-- =========================================================

SET @SRV_MAINT_ID := (
  SELECT s.id
  FROM services s
  JOIN services_i18n i ON i.service_id = s.id AND i.locale = 'tr'
  WHERE i.slug = 'bakim-ve-onarim'
  LIMIT 1
);
SET @SRV_MAINT_ID := COALESCE(@SRV_MAINT_ID, UUID());

INSERT INTO `services`
(`id`,
 `type`,
 `category_id`, `sub_category_id`,
 `featured`, `is_active`, `display_order`,
 `featured_image`, `image_url`, `image_asset_id`,
 `area`, `duration`, `maintenance`, `season`, `thickness`, `equipment`,
 `created_at`, `updated_at`)
VALUES
(
  @SRV_MAINT_ID,
  'maintenance_repair',
  'aaaa8001-1111-4111-8111-aaaaaaaa8001', -- SERVICES category
  'bbbb8002-1111-4111-8111-bbbbbbbb8002', -- Bakım ve Onarım
  1, 1, 10,
  NULL, NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `type`            = VALUES(`type`),
 `category_id`     = VALUES(`category_id`),
 `sub_category_id` = VALUES(`sub_category_id`),
 `featured`        = VALUES(`featured`),
 `is_active`       = VALUES(`is_active`),
 `display_order`   = VALUES(`display_order`),
 `featured_image`  = VALUES(`featured_image`),
 `image_url`       = VALUES(`image_url`),
 `image_asset_id`  = VALUES(`image_asset_id`),
 `area`            = VALUES(`area`),
 `duration`        = VALUES(`duration`),
 `maintenance`     = VALUES(`maintenance`),
 `season`          = VALUES(`season`),
 `thickness`       = VALUES(`thickness`),
 `equipment`       = VALUES(`equipment`),
 `updated_at`      = VALUES(`updated_at`);

-- TR
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
VALUES
(
  UUID(),
  @SRV_MAINT_ID,
  'tr',
  'bakim-ve-onarim',
  'Bakım ve Onarım',
  'Mevcut soğutma kulelerinin verimliliğini sağlamak için düzenli bakım ve onarım hizmetleri sunuyoruz. Ensotek, endüstriyel su soğutma kulelerinizin sorunsuz çalışmasını sağlamak amacıyla periyodik bakım ve profesyonel onarım hizmetleri sunar. Deneyimli ekibimiz ile sistemlerinizin ömrünü uzatır ve performans kaybını önleriz.',
  NULL, NULL,
  NULL, NULL,
  'Bakım ve onarım hizmeti',
  NULL,
  'Bakım ve Onarım | Ensotek',
  'Ensotek, endüstriyel su soğutma kuleleri için profesyonel bakım ve onarım hizmetleri sunar. Periyodik bakım ve uzman onarım ile sistemlerinizin ömrünü uzatır.',
  NULL,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `slug`             = VALUES(`slug`),
 `name`             = VALUES(`name`),
 `description`      = VALUES(`description`),
 `material`         = VALUES(`material`),
 `price`            = VALUES(`price`),
 `includes`         = VALUES(`includes`),
 `warranty`         = VALUES(`warranty`),
 `image_alt`        = VALUES(`image_alt`),
 `tags`             = VALUES(`tags`),
 `meta_title`       = VALUES(`meta_title`),
 `meta_description` = VALUES(`meta_description`),
 `meta_keywords`    = VALUES(`meta_keywords`),
 `updated_at`       = VALUES(`updated_at`);

-- EN
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
VALUES
(
  UUID(),
  @SRV_MAINT_ID,
  'en',
  'maintenance-and-repair',
  'Maintenance & Repair',
  'Periodic maintenance and professional repair services for industrial cooling towers.',
  NULL, NULL,
  NULL, NULL,
  'Maintenance & repair service',
  NULL,
  'Maintenance & Repair | Ensotek',
  'Ensotek provides periodic maintenance and professional repair services for industrial cooling towers to ensure long-term performance.',
  NULL,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `slug`             = VALUES(`slug`),
 `name`             = VALUES(`name`),
 `description`      = VALUES(`description`),
 `material`         = VALUES(`material`),
 `price`            = VALUES(`price`),
 `includes`         = VALUES(`includes`),
 `warranty`         = VALUES(`warranty`),
 `image_alt`        = VALUES(`image_alt`),
 `tags`             = VALUES(`tags`),
 `meta_title`       = VALUES(`meta_title`),
 `meta_description` = VALUES(`meta_description`),
 `meta_keywords`    = VALUES(`meta_keywords`),
 `updated_at`       = VALUES(`updated_at`);


-- =========================================================
-- 2) Modernizasyon / Modernization
-- =========================================================

SET @SRV_MOD_ID := (
  SELECT s.id
  FROM services s
  JOIN services_i18n i ON i.service_id = s.id AND i.locale = 'tr'
  WHERE i.slug = 'modernizasyon'
  LIMIT 1
);
SET @SRV_MOD_ID := COALESCE(@SRV_MOD_ID, UUID());

INSERT INTO `services`
(`id`,
 `type`,
 `category_id`, `sub_category_id`,
 `featured`, `is_active`, `display_order`,
 `featured_image`, `image_url`, `image_asset_id`,
 `area`, `duration`, `maintenance`, `season`, `thickness`, `equipment`,
 `created_at`, `updated_at`)
VALUES
(
  @SRV_MOD_ID,
  'modernization',
  'aaaa8001-1111-4111-8111-aaaaaaaa8001',
  'bbbb8003-1111-4111-8111-bbbbbbbb8003',
  1, 1, 20,
  NULL, NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `type`            = VALUES(`type`),
 `category_id`     = VALUES(`category_id`),
 `sub_category_id` = VALUES(`sub_category_id`),
 `featured`        = VALUES(`featured`),
 `is_active`       = VALUES(`is_active`),
 `display_order`   = VALUES(`display_order`),
 `featured_image`  = VALUES(`featured_image`),
 `image_url`       = VALUES(`image_url`),
 `image_asset_id`  = VALUES(`image_asset_id`),
 `area`            = VALUES(`area`),
 `duration`        = VALUES(`duration`),
 `maintenance`     = VALUES(`maintenance`),
 `season`          = VALUES(`season`),
 `thickness`       = VALUES(`thickness`),
 `equipment`       = VALUES(`equipment`),
 `updated_at`      = VALUES(`updated_at`);

-- TR
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
VALUES
(
  UUID(),
  @SRV_MOD_ID,
  'tr',
  'modernizasyon',
  'Modernizasyon',
  'Eski soğutma kulelerinin performansını artırmak için modernizasyon hizmetleri sunuyoruz. Ensotek, mevcut su soğutma kulelerinin daha verimli ve güncel standartlara uygun çalışabilmesi için modernizasyon çözümleri sunar. Eskiyen sistemlerinizi daha düşük maliyetle yenilemek ve enerji verimliliğini artırmak mümkündür.',
  NULL, NULL,
  NULL, NULL,
  'Modernizasyon hizmeti',
  NULL,
  'Modernizasyon | Ensotek',
  'Ensotek, mevcut su soğutma kulelerinin performansını artırmak için modernizasyon çözümleri ve enerji verimliliği odaklı iyileştirmeler sunar.',
  NULL,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `slug`             = VALUES(`slug`),
 `name`             = VALUES(`name`),
 `description`      = VALUES(`description`),
 `material`         = VALUES(`material`),
 `price`            = VALUES(`price`),
 `includes`         = VALUES(`includes`),
 `warranty`         = VALUES(`warranty`),
 `image_alt`        = VALUES(`image_alt`),
 `tags`             = VALUES(`tags`),
 `meta_title`       = VALUES(`meta_title`),
 `meta_description` = VALUES(`meta_description`),
 `meta_keywords`    = VALUES(`meta_keywords`),
 `updated_at`       = VALUES(`updated_at`);

-- EN
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
VALUES
(
  UUID(),
  @SRV_MOD_ID,
  'en',
  'modernization',
  'Modernization',
  'Modernization solutions to upgrade existing cooling towers to current efficiency and performance standards.',
  NULL, NULL,
  NULL, NULL,
  'Modernization service',
  NULL,
  'Modernization | Ensotek',
  'Ensotek provides modernization solutions to upgrade cooling towers for higher efficiency and modern performance standards.',
  NULL,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `slug`             = VALUES(`slug`),
 `name`             = VALUES(`name`),
 `description`      = VALUES(`description`),
 `material`         = VALUES(`material`),
 `price`            = VALUES(`price`),
 `includes`         = VALUES(`includes`),
 `warranty`         = VALUES(`warranty`),
 `image_alt`        = VALUES(`image_alt`),
 `tags`             = VALUES(`tags`),
 `meta_title`       = VALUES(`meta_title`),
 `meta_description` = VALUES(`meta_description`),
 `meta_keywords`    = VALUES(`meta_keywords`),
 `updated_at`       = VALUES(`updated_at`);


-- =========================================================
-- 3) Yedek Parçalar ve Bileşenler / Spare Parts & Components
-- =========================================================

SET @SRV_SPARE_ID := (
  SELECT s.id
  FROM services s
  JOIN services_i18n i ON i.service_id = s.id AND i.locale = 'tr'
  WHERE i.slug = 'yedek-parcalar-ve-bilesenler'
  LIMIT 1
);
SET @SRV_SPARE_ID := COALESCE(@SRV_SPARE_ID, UUID());

INSERT INTO `services`
(`id`,
 `type`,
 `category_id`, `sub_category_id`,
 `featured`, `is_active`, `display_order`,
 `featured_image`, `image_url`, `image_asset_id`,
 `area`, `duration`, `maintenance`, `season`, `thickness`, `equipment`,
 `created_at`, `updated_at`)
VALUES
(
  @SRV_SPARE_ID,
  'spare_parts_components',
  'aaaa8001-1111-4111-8111-aaaaaaaa8001',
  'bbbb8004-1111-4111-8111-bbbbbbbb8004',
  1, 1, 30,
  NULL, NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `type`            = VALUES(`type`),
 `category_id`     = VALUES(`category_id`),
 `sub_category_id` = VALUES(`sub_category_id`),
 `featured`        = VALUES(`featured`),
 `is_active`       = VALUES(`is_active`),
 `display_order`   = VALUES(`display_order`),
 `featured_image`  = VALUES(`featured_image`),
 `image_url`       = VALUES(`image_url`),
 `image_asset_id`  = VALUES(`image_asset_id`),
 `area`            = VALUES(`area`),
 `duration`        = VALUES(`duration`),
 `maintenance`     = VALUES(`maintenance`),
 `season`          = VALUES(`season`),
 `thickness`       = VALUES(`thickness`),
 `equipment`       = VALUES(`equipment`),
 `updated_at`      = VALUES(`updated_at`);

-- TR
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
VALUES
(
  UUID(),
  @SRV_SPARE_ID,
  'tr',
  'yedek-parcalar-ve-bilesenler',
  'Yedek Parçalar ve Bileşenler',
  'Soğutma kulelerinin sorunsuz çalışmasını sağlamak için geniş yedek parça ve bileşen seçenekleri sunuyoruz. Ensotek, su soğutma kuleleri için geniş bir yedek parça ve bileşen portföyü sunar. Tüm yedek parçalarımız, kulelerinizin uzun ömürlü ve verimli çalışması için kaliteli ve güvenilirdir.',
  NULL, NULL,
  NULL, NULL,
  'Yedek parça ve bileşen hizmeti',
  NULL,
  'Yedek Parçalar ve Bileşenler | Ensotek',
  'Ensotek, endüstriyel su soğutma kuleleri için geniş yedek parça ve bileşen portföyü sunar. Kaliteli parçalarla uzun ömürlü ve verimli çalışma sağlanır.',
  NULL,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `slug`             = VALUES(`slug`),
 `name`             = VALUES(`name`),
 `description`      = VALUES(`description`),
 `material`         = VALUES(`material`),
 `price`            = VALUES(`price`),
 `includes`         = VALUES(`includes`),
 `warranty`         = VALUES(`warranty`),
 `image_alt`        = VALUES(`image_alt`),
 `tags`             = VALUES(`tags`),
 `meta_title`       = VALUES(`meta_title`),
 `meta_description` = VALUES(`meta_description`),
 `meta_keywords`    = VALUES(`meta_keywords`),
 `updated_at`       = VALUES(`updated_at`);

-- EN
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
VALUES
(
  UUID(),
  @SRV_SPARE_ID,
  'en',
  'spare-parts-and-components',
  'Spare Parts & Components',
  'Wide portfolio of high-quality spare parts and components for cooling towers.',
  NULL, NULL,
  NULL, NULL,
  'Spare parts & components',
  NULL,
  'Spare Parts & Components | Ensotek',
  'Ensotek supplies a wide range of high-quality spare parts and components to ensure reliable operation of cooling towers.',
  NULL,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `slug`             = VALUES(`slug`),
 `name`             = VALUES(`name`),
 `description`      = VALUES(`description`),
 `material`         = VALUES(`material`),
 `price`            = VALUES(`price`),
 `includes`         = VALUES(`includes`),
 `warranty`         = VALUES(`warranty`),
 `image_alt`        = VALUES(`image_alt`),
 `tags`             = VALUES(`tags`),
 `meta_title`       = VALUES(`meta_title`),
 `meta_description` = VALUES(`meta_description`),
 `meta_keywords`    = VALUES(`meta_keywords`),
 `updated_at`       = VALUES(`updated_at`);


-- =========================================================
-- 4) Uygulamalar ve Referanslar / Applications & References
-- =========================================================

SET @SRV_APPREF_ID := (
  SELECT s.id
  FROM services s
  JOIN services_i18n i ON i.service_id = s.id AND i.locale = 'tr'
  WHERE i.slug = 'uygulamalar-ve-referanslar'
  LIMIT 1
);
SET @SRV_APPREF_ID := COALESCE(@SRV_APPREF_ID, UUID());

INSERT INTO `services`
(`id`,
 `type`,
 `category_id`, `sub_category_id`,
 `featured`, `is_active`, `display_order`,
 `featured_image`, `image_url`, `image_asset_id`,
 `area`, `duration`, `maintenance`, `season`, `thickness`, `equipment`,
 `created_at`, `updated_at`)
VALUES
(
  @SRV_APPREF_ID,
  'applications_references',
  'aaaa8001-1111-4111-8111-aaaaaaaa8001',
  'bbbb8005-1111-4111-8111-bbbbbbbb8005',
  1, 1, 40,
  NULL, NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `type`            = VALUES(`type`),
 `category_id`     = VALUES(`category_id`),
 `sub_category_id` = VALUES(`sub_category_id`),
 `featured`        = VALUES(`featured`),
 `is_active`       = VALUES(`is_active`),
 `display_order`   = VALUES(`display_order`),
 `featured_image`  = VALUES(`featured_image`),
 `image_url`       = VALUES(`image_url`),
 `image_asset_id`  = VALUES(`image_asset_id`),
 `area`            = VALUES(`area`),
 `duration`        = VALUES(`duration`),
 `maintenance`     = VALUES(`maintenance`),
 `season`          = VALUES(`season`),
 `thickness`       = VALUES(`thickness`),
 `equipment`       = VALUES(`equipment`),
 `updated_at`      = VALUES(`updated_at`);

-- TR
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
VALUES
(
  UUID(),
  @SRV_APPREF_ID,
  'tr',
  'uygulamalar-ve-referanslar',
  'Uygulamalar ve Referanslar',
  'Ensotek, endüstriyel ve ticari alanlarda çok sayıda referans projeye ve uygulamaya sahiptir. Ensotek; enerji, kimya, gıda, ilaç, otomotiv ve daha birçok sektörde su soğutma kuleleriyle yerli ve yabancı yüzlerce projeye çözüm sunmuştur. Deneyimimiz ve uzman ekibimiz sayesinde müşterilerimizin farklı ihtiyaçlarına uygun, uzun ömürlü ve verimli soğutma sistemleri sağlıyoruz. Referanslarımız ve uygulama örneklerimiz, yüksek kalite ve güvenin göstergesidir.',
  NULL, NULL,
  NULL, NULL,
  'Uygulamalar ve referanslar',
  NULL,
  'Uygulamalar ve Referanslar | Ensotek',
  'Ensotek, farklı sektörlerde çok sayıda referans projeye sahiptir. Enerji, kimya, gıda, ilaç ve otomotiv gibi alanlarda su soğutma kuleleri ile çözüm sunar.',
  NULL,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `slug`             = VALUES(`slug`),
 `name`             = VALUES(`name`),
 `description`      = VALUES(`description`),
 `material`         = VALUES(`material`),
 `price`            = VALUES(`price`),
 `includes`         = VALUES(`includes`),
 `warranty`         = VALUES(`warranty`),
 `image_alt`        = VALUES(`image_alt`),
 `tags`             = VALUES(`tags`),
 `meta_title`       = VALUES(`meta_title`),
 `meta_description` = VALUES(`meta_description`),
 `meta_keywords`    = VALUES(`meta_keywords`),
 `updated_at`       = VALUES(`updated_at`);

-- EN
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
VALUES
(
  UUID(),
  @SRV_APPREF_ID,
  'en',
  'applications-and-references',
  'Applications & References',
  'Extensive reference projects and applications in industrial and commercial sectors.',
  NULL, NULL,
  NULL, NULL,
  'Applications & references',
  NULL,
  'Applications & References | Ensotek',
  'Ensotek has extensive reference projects and applications in various industrial and commercial sectors.',
  NULL,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `slug`             = VALUES(`slug`),
 `name`             = VALUES(`name`),
 `description`      = VALUES(`description`),
 `material`         = VALUES(`material`),
 `price`            = VALUES(`price`),
 `includes`         = VALUES(`includes`),
 `warranty`         = VALUES(`warranty`),
 `image_alt`        = VALUES(`image_alt`),
 `tags`             = VALUES(`tags`),
 `meta_title`       = VALUES(`meta_title`),
 `meta_description` = VALUES(`meta_description`),
 `meta_keywords`    = VALUES(`meta_keywords`),
 `updated_at`       = VALUES(`updated_at`);


-- =========================================================
-- 5) Mühendislik Desteği / Engineering Support
-- =========================================================

SET @SRV_ENGSUP_ID := (
  SELECT s.id
  FROM services s
  JOIN services_i18n i ON i.service_id = s.id AND i.locale = 'tr'
  WHERE i.slug = 'muhendislik-destegi'
  LIMIT 1
);
SET @SRV_ENGSUP_ID := COALESCE(@SRV_ENGSUP_ID, UUID());

INSERT INTO `services`
(`id`,
 `type`,
 `category_id`, `sub_category_id`,
 `featured`, `is_active`, `display_order`,
 `featured_image`, `image_url`, `image_asset_id`,
 `area`, `duration`, `maintenance`, `season`, `thickness`, `equipment`,
 `created_at`, `updated_at`)
VALUES
(
  @SRV_ENGSUP_ID,
  'engineering_support',
  'aaaa8001-1111-4111-8111-aaaaaaaa8001',
  'bbbb8006-1111-4111-8111-bbbbbbbb8006',
  1, 1, 50,
  NULL, NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `type`            = VALUES(`type`),
 `category_id`     = VALUES(`category_id`),
 `sub_category_id` = VALUES(`sub_category_id`),
 `featured`        = VALUES(`featured`),
 `is_active`       = VALUES(`is_active`),
 `display_order`   = VALUES(`display_order`),
 `featured_image`  = VALUES(`featured_image`),
 `image_url`       = VALUES(`image_url`),
 `image_asset_id`  = VALUES(`image_asset_id`),
 `area`            = VALUES(`area`),
 `duration`        = VALUES(`duration`),
 `maintenance`     = VALUES(`maintenance`),
 `season`          = VALUES(`season`),
 `thickness`       = VALUES(`thickness`),
 `equipment`       = VALUES(`equipment`),
 `updated_at`      = VALUES(`updated_at`);

-- TR
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
VALUES
(
  UUID(),
  @SRV_ENGSUP_ID,
  'tr',
  'muhendislik-destegi',
  'Mühendislik Desteği',
  'Ensotek, müşterilerine soğutma kuleleri alanında uzman mühendislik desteği sunar. Ensotek, projelendirme, danışmanlık, sistem optimizasyonu, performans analizi ve teknik eğitim dahil olmak üzere kapsamlı mühendislik destek hizmetleri sağlar. Uzman mühendislerimiz, projelerin tasarımından devreye alınmasına kadar her aşamada müşterilerimizin yanında olur. En iyi verim, düşük maliyet ve uzun ömürlü çözümler için profesyonel destek sunuyoruz.',
  NULL, NULL,
  NULL, NULL,
  'Mühendislik desteği hizmeti',
  NULL,
  'Mühendislik Desteği | Ensotek',
  'Ensotek, soğutma kuleleri için projelendirme, danışmanlık, optimizasyon ve teknik eğitim içeren kapsamlı mühendislik desteği sağlar.',
  NULL,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `slug`             = VALUES(`slug`),
 `name`             = VALUES(`name`),
 `description`      = VALUES(`description`),
 `material`         = VALUES(`material`),
 `price`            = VALUES(`price`),
 `includes`         = VALUES(`includes`),
 `warranty`         = VALUES(`warranty`),
 `image_alt`        = VALUES(`image_alt`),
 `tags`             = VALUES(`tags`),
 `meta_title`       = VALUES(`meta_title`),
 `meta_description` = VALUES(`meta_description`),
 `meta_keywords`    = VALUES(`meta_keywords`),
 `updated_at`       = VALUES(`updated_at`);

-- EN
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
VALUES
(
  UUID(),
  @SRV_ENGSUP_ID,
  'en',
  'engineering-support',
  'Engineering Support',
  'Comprehensive engineering support, consulting and optimization services for cooling tower projects.',
  NULL, NULL,
  NULL, NULL,
  'Engineering support service',
  NULL,
  'Engineering Support | Ensotek',
  'Ensotek delivers comprehensive engineering support, consulting and optimization services for industrial cooling tower projects.',
  NULL,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `slug`             = VALUES(`slug`),
 `name`             = VALUES(`name`),
 `description`      = VALUES(`description`),
 `material`         = VALUES(`material`),
 `price`            = VALUES(`price`),
 `includes`         = VALUES(`includes`),
 `warranty`         = VALUES(`warranty`),
 `image_alt`        = VALUES(`image_alt`),
 `tags`             = VALUES(`tags`),
 `meta_title`       = VALUES(`meta_title`),
 `meta_description` = VALUES(`meta_description`),
 `meta_keywords`    = VALUES(`meta_keywords`),
 `updated_at`       = VALUES(`updated_at`);


-- =========================================================
-- 6) Üretim / Production
-- =========================================================

SET @SRV_PROD_ID := (
  SELECT s.id
  FROM services s
  JOIN services_i18n i ON i.service_id = s.id AND i.locale = 'tr'
  WHERE i.slug = 'uretim'
  LIMIT 1
);
SET @SRV_PROD_ID := COALESCE(@SRV_PROD_ID, UUID());

INSERT INTO `services`
(`id`,
 `type`,
 `category_id`, `sub_category_id`,
 `featured`, `is_active`, `display_order`,
 `featured_image`, `image_url`, `image_asset_id`,
 `area`, `duration`, `maintenance`, `season`, `thickness`, `equipment`,
 `created_at`, `updated_at`)
VALUES
(
  @SRV_PROD_ID,
  'production',
  'aaaa8001-1111-4111-8111-aaaaaaaa8001',
  'bbbb8001-1111-4111-8111-bbbbbbbb8001',
  1, 1, 60,
  NULL, NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `type`            = VALUES(`type`),
 `category_id`     = VALUES(`category_id`),
 `sub_category_id` = VALUES(`sub_category_id`),
 `featured`        = VALUES(`featured`),
 `is_active`       = VALUES(`is_active`),
 `display_order`   = VALUES(`display_order`),
 `featured_image`  = VALUES(`featured_image`),
 `image_url`       = VALUES(`image_url`),
 `image_asset_id`  = VALUES(`image_asset_id`),
 `area`            = VALUES(`area`),
 `duration`        = VALUES(`duration`),
 `maintenance`     = VALUES(`maintenance`),
 `season`          = VALUES(`season`),
 `thickness`       = VALUES(`thickness`),
 `equipment`       = VALUES(`equipment`),
 `updated_at`      = VALUES(`updated_at`);

-- TR
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
VALUES
(
  UUID(),
  @SRV_PROD_ID,
  'tr',
  'uretim',
  'Üretim',
  'Ensotek, endüstriyel su soğutma kuleleri üretiminde uzmandır. Ensotek, açık ve kapalı devre FRP (Cam elyaf takviyeli polyester) malzemeden endüstriyel su soğutma kulelerinin üretiminde uzmanlaşmıştır. Üretim sürecimiz, dayanıklı, uzun ömürlü ve kaliteli soğutma kulelerinin imalatını kapsar.',
  NULL, NULL,
  NULL, NULL,
  'Endüstriyel soğutma kulesi üretimi',
  NULL,
  'Üretim | Ensotek',
  'Ensotek, endüstriyel FRP su soğutma kuleleri üretiminde uzman olup dayanıklı ve uzun ömürlü çözümler sunar.',
  NULL,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `slug`             = VALUES(`slug`),
 `name`             = VALUES(`name`),
 `description`      = VALUES(`description`),
 `material`         = VALUES(`material`),
 `price`            = VALUES(`price`),
 `includes`         = VALUES(`includes`),
 `warranty`         = VALUES(`warranty`),
 `image_alt`        = VALUES(`image_alt`),
 `tags`             = VALUES(`tags`),
 `meta_title`       = VALUES(`meta_title`),
 `meta_description` = VALUES(`meta_description`),
 `meta_keywords`    = VALUES(`meta_keywords`),
 `updated_at`       = VALUES(`updated_at`);

-- EN
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
VALUES
(
  UUID(),
  @SRV_PROD_ID,
  'en',
  'production',
  'Production',
  'Specialized in manufacturing industrial FRP cooling towers for open and closed circuit systems.',
  NULL, NULL,
  NULL, NULL,
  'Cooling tower production',
  NULL,
  'Production | Ensotek',
  'Ensotek specializes in manufacturing industrial FRP cooling towers for open and closed circuit systems.',
  NULL,
  '2024-01-01 00:00:00.000',
  '2024-01-01 00:00:00.000'
)
ON DUPLICATE KEY UPDATE
 `slug`             = VALUES(`slug`),
 `name`             = VALUES(`name`),
 `description`      = VALUES(`description`),
 `material`         = VALUES(`material`),
 `price`            = VALUES(`price`),
 `includes`         = VALUES(`includes`),
 `warranty`         = VALUES(`warranty`),
 `image_alt`        = VALUES(`image_alt`),
 `tags`             = VALUES(`tags`),
 `meta_title`       = VALUES(`meta_title`),
 `meta_description` = VALUES(`meta_description`),
 `meta_keywords`    = VALUES(`meta_keywords`),
 `updated_at`       = VALUES(`updated_at`);


-- ---------------------------------------------------------
-- GENERIC: Eksik EN kayıtları için TR'den kopya (opsiyonel)
-- ---------------------------------------------------------
INSERT INTO `services_i18n`
(`id`,`service_id`,`locale`,
 `slug`,`name`,
 `description`,`material`,`price`,
 `includes`,`warranty`,`image_alt`,
 `tags`,`meta_title`,`meta_description`,`meta_keywords`,
 `created_at`,`updated_at`)
SELECT
  UUID(), s.service_id, 'en',
  s.slug, s.name, s.description, s.material, s.price,
  s.includes, s.warranty, s.image_alt,
  s.tags, s.meta_title, s.meta_description, s.meta_keywords,
  NOW(3), NOW(3)
FROM `services_i18n` s
WHERE s.locale = 'tr'
  AND NOT EXISTS (
    SELECT 1 FROM `services_i18n` t
    WHERE t.service_id = s.service_id
      AND t.locale = 'en'
  );

COMMIT;

