-- 024_reference_images_i18n_en.seeds.sql (EN) [NO VARS] (FK-SAFE)
SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

CREATE TABLE IF NOT EXISTS `reference_images_i18n`
(
  `id`          CHAR(36)     NOT NULL,
  `image_id`    CHAR(36)     NOT NULL,
  `locale`      VARCHAR(10)  NOT NULL,

  `title`       VARCHAR(200) DEFAULT NULL,
  `alt`         VARCHAR(255) DEFAULT NULL,

  `created_at`  DATETIME(3)  NOT NULL,
  `updated_at`  DATETIME(3)  NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_ref_image_i18n_parent_locale` (`image_id`, `locale`),
  KEY `ix_ref_image_i18n_image_id` (`image_id`),
  KEY `ix_ref_image_i18n_locale` (`locale`),

  CONSTRAINT `fk_ref_image_i18n_image`
    FOREIGN KEY (`image_id`) REFERENCES `reference_images` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- FK-SAFE INSERT:
-- Sadece reference_images'ta gerçekten var olan image_id'ler yazılır.
-- -------------------------------------------------------------
INSERT INTO `reference_images_i18n`
(
  id, image_id, locale,
  title, alt,
  created_at, updated_at
)
SELECT
  v.id, v.image_id, v.locale,
  v.title, v.alt,
  NOW(3), NOW(3)
FROM
(
  SELECT
    '7b7b5201-0001-4222-8222-520100000001' AS id,
    '9d9d5201-0001-4222-8222-520100000001' AS image_id,
    'en' AS locale,
    'Enerjisa – Image 1' AS title,
    'Enerjisa – reference image' AS alt

  UNION ALL SELECT
    '7b7b5201-0002-4222-8222-520100000001',
    '9d9d5201-0002-4222-8222-520100000001',
    'en',
    'Enerjisa – Image 2',
    'Enerjisa – reference image'

  UNION ALL SELECT
    '7b7b5201-0003-4222-8222-520100000001',
    '9d9d5201-0003-4222-8222-520100000001',
    'en',
    'Enerjisa – Image 3',
    'Enerjisa – reference image'

  -- ... (EN dosyandaki tüm satırları aynı UNION ALL patterniyle buraya ekle)

  UNION ALL SELECT
    '7b7b5209-0003-4222-8222-520900000005',
    '9d9d5209-0003-4222-8222-520900000005',
    'en',
    'Vestel – Image 3',
    'Vestel – reference image'
) v
INNER JOIN `reference_images` ri ON ri.id = v.image_id
ON DUPLICATE KEY UPDATE
  title      = VALUES(title),
  alt        = VALUES(alt),
  updated_at = VALUES(updated_at);

COMMIT;
