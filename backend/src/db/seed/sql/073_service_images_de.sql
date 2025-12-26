-- =============================================================
-- 073_service_images_de.sql
-- Ensotek Services gallery görselleri (DE i18n)
--  - service_images satırları 073 ile var (display_order=1)
--  - image_id'ler service_id + display_order üzerinden bulunur
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- SERVICE ID’leri (TR slug üzerinden)
SET @SRV_MAINT_ID := (SELECT s.id FROM services s JOIN services_i18n i ON i.service_id=s.id AND i.locale='de' WHERE i.slug='bakim-ve-onarim' LIMIT 1);
SET @SRV_MOD_ID   := (SELECT s.id FROM services s JOIN services_i18n i ON i.service_id=s.id AND i.locale='de' WHERE i.slug='modernizasyon' LIMIT 1);
SET @SRV_SPARE_ID := (SELECT s.id FROM services s JOIN services_i18n i ON i.service_id=s.id AND i.locale='de' WHERE i.slug='yedek-parcalar-ve-bilesenler' LIMIT 1);
SET @SRV_APPREF_ID:= (SELECT s.id FROM services s JOIN services_i18n i ON i.service_id=s.id AND i.locale='de' WHERE i.slug='uygulamalar-ve-referanslar' LIMIT 1);
SET @SRV_ENGSUP_ID:= (SELECT s.id FROM services s JOIN services_i18n i ON i.service_id=s.id AND i.locale='de' WHERE i.slug='muhendislik-destegi' LIMIT 1);
SET @SRV_PROD_ID  := (SELECT s.id FROM services s JOIN services_i18n i ON i.service_id=s.id AND i.locale='de' WHERE i.slug='uretim' LIMIT 1);

-- image_id’leri (display_order=1)
SET @IMG_MAINT_ID := (SELECT si.id FROM service_images si WHERE si.service_id=@SRV_MAINT_ID AND si.display_order=1 LIMIT 1);
SET @IMG_MOD_ID   := (SELECT si.id FROM service_images si WHERE si.service_id=@SRV_MOD_ID   AND si.display_order=1 LIMIT 1);
SET @IMG_SPARE_ID := (SELECT si.id FROM service_images si WHERE si.service_id=@SRV_SPARE_ID AND si.display_order=1 LIMIT 1);
SET @IMG_APPREF_ID:= (SELECT si.id FROM service_images si WHERE si.service_id=@SRV_APPREF_ID AND si.display_order=1 LIMIT 1);
SET @IMG_ENGSUP_ID:= (SELECT si.id FROM service_images si WHERE si.service_id=@SRV_ENGSUP_ID AND si.display_order=1 LIMIT 1);
SET @IMG_PROD_ID  := (SELECT si.id FROM service_images si WHERE si.service_id=@SRV_PROD_ID  AND si.display_order=1 LIMIT 1);

-- 1) Wartung und Reparatur (DE)
INSERT INTO `service_images_i18n`
(`id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`)
SELECT
  UUID(),
  @IMG_MAINT_ID,
  'de',
  'Wartung und Reparatur – Hauptbild',
  'Wartungs- und Reparaturservice für Kühltürme',
  'Industriekühlturm – Wartung vor Ort',
  NOW(3),
  NOW(3)
FROM DUAL
WHERE @IMG_MAINT_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  `title`      = VALUES(`title`),
  `alt`        = VALUES(`alt`),
  `caption`    = VALUES(`caption`),
  `updated_at` = VALUES(`updated_at`);

-- 2) Modernisierung (DE)
INSERT INTO `service_images_i18n`
(`id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`)
SELECT
  UUID(),
  @IMG_MOD_ID,
  'de',
  'Modernisierung – Hauptbild',
  'Modernisierte Kühltürme und Upgrades',
  'Upgrade eines Kühlsystems durch Modernisierung',
  NOW(3),
  NOW(3)
FROM DUAL
WHERE @IMG_MOD_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  `title`      = VALUES(`title`),
  `alt`        = VALUES(`alt`),
  `caption`    = VALUES(`caption`),
  `updated_at` = VALUES(`updated_at`);

-- 3) Ersatzteile und Komponenten (DE)
INSERT INTO `service_images_i18n`
(`id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`)
SELECT
  UUID(),
  @IMG_SPARE_ID,
  'de',
  'Ersatzteile und Komponenten – Hauptbild',
  'Ersatzteile und Komponenten für Kühltürme',
  'Auswahl an Ersatzteilen für Industriekühltürme',
  NOW(3),
  NOW(3)
FROM DUAL
WHERE @IMG_SPARE_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  `title`      = VALUES(`title`),
  `alt`        = VALUES(`alt`),
  `caption`    = VALUES(`caption`),
  `updated_at` = VALUES(`updated_at`);

-- 4) Anwendungen und Referenzen (DE)
INSERT INTO `service_images_i18n`
(`id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`)
SELECT
  UUID(),
  @IMG_APPREF_ID,
  'de',
  'Anwendungen und Referenzen – Hauptbild',
  'Ensotek Anwendungen und Referenzprojekte',
  'Kühlturm-Anwendungen in verschiedenen Industrieanlagen',
  NOW(3),
  NOW(3)
FROM DUAL
WHERE @IMG_APPREF_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  `title`      = VALUES(`title`),
  `alt`        = VALUES(`alt`),
  `caption`    = VALUES(`caption`),
  `updated_at` = VALUES(`updated_at`);

-- 5) Engineering-Support (DE)
INSERT INTO `service_images_i18n`
(`id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`)
SELECT
  UUID(),
  @IMG_ENGSUP_ID,
  'de',
  'Engineering-Support – Hauptbild',
  'Engineering-Support-Team für Kühltürme',
  'Projektplanung und Analyse mit Ensotek Engineering',
  NOW(3),
  NOW(3)
FROM DUAL
WHERE @IMG_ENGSUP_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  `title`      = VALUES(`title`),
  `alt`        = VALUES(`alt`),
  `caption`    = VALUES(`caption`),
  `updated_at` = VALUES(`updated_at`);

-- 6) Produktion (DE)
INSERT INTO `service_images_i18n`
(`id`,`image_id`,`locale`,`title`,`alt`,`caption`,`created_at`,`updated_at`)
SELECT
  UUID(),
  @IMG_PROD_ID,
  'de',
  'Produktion – Hauptbild',
  'Produktion von industriellen FRP-Wasserkühltürmen',
  'FRP-Kühlturmproduktion in den Ensotek Anlagen',
  NOW(3),
  NOW(3)
FROM DUAL
WHERE @IMG_PROD_ID IS NOT NULL
ON DUPLICATE KEY UPDATE
  `title`      = VALUES(`title`),
  `alt`        = VALUES(`alt`),
  `caption`    = VALUES(`caption`),
  `updated_at` = VALUES(`updated_at`);

COMMIT;
