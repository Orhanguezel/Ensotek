-- =============================================================
-- 200_storage.seeds.sql  (PRODUCTION ASSETS)
-- Ensotek - Storage Assets (Logo, Favicon, Icons, Company Logos)
-- ✅ Production-ready
--
-- Contents:
-- - Site Assets (5): logo, favicon, apple-touch-icon, app-icon-512, OG image
-- - Company Logos (32): Vestel, Arçelik, Koç, Ford, Zorlu, etc.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------
-- TABLE GUARD
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `storage_assets` (
  id                       CHAR(36)      NOT NULL,
  user_id                  CHAR(36)      DEFAULT NULL,

  `name`                   VARCHAR(255)  NOT NULL,
  bucket                   VARCHAR(64)   NOT NULL,
  `path`                   VARCHAR(512)  NOT NULL,
  folder                   VARCHAR(255)  DEFAULT NULL,

  mime                     VARCHAR(127)  NOT NULL,
  size                     BIGINT UNSIGNED NOT NULL,

  width                    INT UNSIGNED  DEFAULT NULL,
  height                   INT UNSIGNED  DEFAULT NULL,

  url                      TEXT          DEFAULT NULL,
  hash                     VARCHAR(64)   DEFAULT NULL,

  provider                 VARCHAR(16)   NOT NULL DEFAULT 'cloudinary',
  provider_public_id       VARCHAR(255)  DEFAULT NULL,
  provider_resource_type   VARCHAR(16)   DEFAULT NULL,
  provider_format          VARCHAR(32)   DEFAULT NULL,
  provider_version         INT UNSIGNED  DEFAULT NULL,
  etag                     VARCHAR(64)   DEFAULT NULL,

  metadata                 JSON          DEFAULT NULL,

  created_at               DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at               DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),
  UNIQUE KEY uniq_bucket_path (bucket, path),
  KEY idx_storage_bucket (bucket),
  KEY idx_storage_folder (folder),
  KEY idx_storage_created (created_at),
  KEY idx_provider_pubid (provider_public_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- STORAGE ASSETS
-- -------------------------------------------------------------

INSERT INTO storage_assets
  (id, user_id, name, bucket, path, folder, mime, size, width, height, url, hash, provider, provider_public_id, provider_resource_type, provider_format, provider_version, etag, metadata, created_at, updated_at)
VALUES
  -- Site Assets
  ('aaaaaaaa-0001-0001-0001-000000000001', NULL, 'logo.png', 'public', 'site-media/logo.png', 'site-media', 'image/png', 5000, 160, 60, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587346/site-media/logo.png', 'logo_ensotek_2024', 'cloudinary', 'site-media/logo', 'image', 'png', 1770587346, 'logo_ensotek_2024', NULL, NOW(3), NOW(3)),
  ('aaaaaaaa-0002-0002-0002-000000000002', NULL, 'favicon', 'public', 'site-media/favicon', 'site-media', 'image/x-icon', 15000, 32, 32, 'https://res.cloudinary.com/dbozv7wqd/raw/upload/v1767244774/site-media/favicon', 'favicon_ensotek', 'cloudinary', 'site-media/favicon', 'raw', 'ico', 1767244774, 'favicon_ensotek', NULL, NOW(3), NOW(3)),
  ('aaaaaaaa-0003-0003-0003-000000000003', NULL, 'apple-touch-icon.png', 'public', 'site-media/apple-touch-icon.png', 'site-media', 'image/png', 8000, 180, 180, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1767249207/site-media/apple-touch-icon.png', 'apple_touch_icon_ensotek', 'cloudinary', 'site-media/apple-touch-icon', 'image', 'png', 1767249207, 'apple_touch_icon_ensotek', NULL, NOW(3), NOW(3)),
  ('aaaaaaaa-0004-0004-0004-000000000004', NULL, 'ensotek-apple-icon-512.png', 'public', 'site-media/ensotek-apple-icon-512.png', 'site-media', 'image/png', 20000, 512, 512, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1767249213/site-media/ensotek-apple-icon-512.png', 'app_icon_512_ensotek', 'cloudinary', 'site-media/ensotek-apple-icon-512', 'image', 'png', 1767249213, 'app_icon_512_ensotek', NULL, NOW(3), NOW(3)),
  ('aaaaaaaa-0005-0005-0005-000000000005', NULL, '2.jpg', 'public', 'site-media/2.jpg', 'site-media', 'image/jpeg', 150000, 1200, 630, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1767249482/site-media/2.jpg', 'og_default_ensotek', 'cloudinary', 'site-media/2', 'image', 'jpg', 1767249482, 'og_default_ensotek', NULL, NOW(3), NOW(3)),

  -- Company Logos (References)
  ('306bb102-0a73-41b2-8a78-09a9874753a7', NULL, 'acibadem.png', 'public', 'references/acibadem.png', 'references', 'image/png', 7164, 355, 142, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587688/uploads/ensotek/acibadem.png', '27b1cd069252b1d6a7b8968fa2c47650', 'cloudinary', 'uploads/ensotek/acibadem', 'image', 'png', 1770587688, '27b1cd069252b1d6a7b8968fa2c47650', NULL, NOW(3), NOW(3)),
  ('6c8b1596-cb17-4545-9971-5ac59d934c4c', NULL, 'aksaenerji.jpg', 'public', 'references/aksaenerji.jpg', 'references', 'image/jpeg', 28410, 900, 900, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587787/uploads/ensotek/aksaenerji.jpg', '5777838447c45a3f8093cf2b31ab5901', 'cloudinary', 'uploads/ensotek/aksaenerji', 'image', 'jpg', 1770587787, '5777838447c45a3f8093cf2b31ab5901', NULL, NOW(3), NOW(3)),
  ('00c1817a-9a71-4a3a-bd5c-ee5bed434164', NULL, 'anadoluefes.png', 'public', 'references/anadoluefes.png', 'references', 'image/png', 6435, 275, 183, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587703/uploads/ensotek/anadoluefes.png', '57a452d69b38fa248b51fd9fc63c2213', 'cloudinary', 'uploads/ensotek/anadoluefes', 'image', 'png', 1770587703, '57a452d69b38fa248b51fd9fc63c2213', NULL, NOW(3), NOW(3)),
  ('b7e6a3c1-4cd3-4a1a-ac86-fab3731adc37', NULL, 'arcelik_ece81e6627.webp', 'public', 'references/arcelik_ece81e6627.webp', 'references', 'image/webp', 5600, 640, 257, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587685/uploads/ensotek/arcelik_ece81e6627.webp', 'f98bb10b8801e05fc6d1bdb5f0a2498d', 'cloudinary', 'uploads/ensotek/arcelik_ece81e6627', 'image', 'webp', 1770587685, 'f98bb10b8801e05fc6d1bdb5f0a2498d', NULL, NOW(3), NOW(3)),
  ('c78e882b-7cdc-4907-a2f8-cacf797a6e00', NULL, 'aselsan.png', 'public', 'references/aselsan.png', 'references', 'image/png', 3234, 355, 142, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587685/uploads/ensotek/aselsan.png', 'a81ac55abf194d86cf809bfaa85b41d8', 'cloudinary', 'uploads/ensotek/aselsan', 'image', 'png', 1770587685, 'a81ac55abf194d86cf809bfaa85b41d8', NULL, NOW(3), NOW(3)),
  ('ddc8e94d-14d4-46ef-bfeb-ffea178a4019', NULL, 'aygaz-798.webp', 'public', 'references/aygaz-798.webp', 'references', 'image/webp', 10994, 1200, 675, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587783/uploads/ensotek/aygaz-798.webp', '11fe5f2de556851e6869b75fa4580b9f', 'cloudinary', 'uploads/ensotek/aygaz-798', 'image', 'webp', 1770587783, '11fe5f2de556851e6869b75fa4580b9f', NULL, NOW(3), NOW(3)),
  ('4acd298d-43e9-4cfc-b0a3-edbe76f3244e', NULL, 'cimsa-logo.jpg', 'public', 'references/cimsa-logo.jpg', 'references', 'image/jpeg', 8700, 800, 800, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587707/uploads/ensotek/cimsa-logo.jpg', '7345a478f0b2e96d65ce0f20728d4e65', 'cloudinary', 'uploads/ensotek/cimsa-logo', 'image', 'jpg', 1770587707, '7345a478f0b2e96d65ce0f20728d4e65', NULL, NOW(3), NOW(3)),
  ('fcf96f1f-7b7c-42fe-bc72-473332cecf7c', NULL, 'Enerjisa_Logo_1_.jpg', 'public', 'references/Enerjisa_Logo_1_.jpg', 'references', 'image/jpeg', 41918, 1500, 784, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587788/uploads/ensotek/Enerjisa_Logo_1_.jpg', '595c726806f6febfd0b69449f1a0fe7b', 'cloudinary', 'uploads/ensotek/Enerjisa_Logo_1_', 'image', 'jpg', 1770587788, '595c726806f6febfd0b69449f1a0fe7b', NULL, NOW(3), NOW(3)),
  ('058b6e96-5adb-4c49-bd73-e8812449a40f', NULL, 'enka-insaat-600.png', 'public', 'references/enka-insaat-600.png', 'references', 'image/png', 3675, 600, 600, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587690/uploads/ensotek/enka-insaat--600.png', '63ddac51e2f0e2c137ce2f010cb5a7f5', 'cloudinary', 'uploads/ensotek/enka-insaat--600', 'image', 'png', 1770587690, '63ddac51e2f0e2c137ce2f010cb5a7f5', NULL, NOW(3), NOW(3)),
  ('6d10e7c7-527b-45f9-9c9b-25474260f352', NULL, 'erdemir.png', 'public', 'references/erdemir.png', 'references', 'image/png', 5053, 306, 165, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587702/uploads/ensotek/erdemir.png', 'df9bc0984359dd25a9a828220c9fb5fe', 'cloudinary', 'uploads/ensotek/erdemir', 'image', 'png', 1770587702, 'df9bc0984359dd25a9a828220c9fb5fe', NULL, NOW(3), NOW(3)),
  ('3014b944-c72a-4a85-b4ec-a019974a1ac2', NULL, 'Eti_logosu.jpg', 'public', 'references/Eti_logosu.jpg', 'references', 'image/jpeg', 11526, 250, 156, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587706/uploads/ensotek/Eti_logosu.jpg', '1936a802ec4805a698efb113b8ea6da7', 'cloudinary', 'uploads/ensotek/Eti_logosu', 'image', 'jpg', 1770587706, '1936a802ec4805a698efb113b8ea6da7', NULL, NOW(3), NOW(3)),
  ('9514ba66-7b03-4326-b5f0-bf5e6c682f06', NULL, 'ford.jpeg', 'public', 'references/ford.jpeg', 'references', 'image/jpeg', 9473, 300, 168, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587699/uploads/ensotek/ford.jpg', '2aa971086d0574cee7a1e171286d75cd', 'cloudinary', 'uploads/ensotek/ford', 'image', 'jpg', 1770587699, '2aa971086d0574cee7a1e171286d75cd', NULL, NOW(3), NOW(3)),
  ('70e41d7e-c4b1-4834-8356-35c08dfb9438', NULL, 'kardemir.png', 'public', 'references/kardemir.png', 'references', 'image/png', 4157, 435, 116, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587700/uploads/ensotek/kardemir.png', 'ce99250d1426a257deb76d99a0e445fe', 'cloudinary', 'uploads/ensotek/kardemir', 'image', 'png', 1770587700, 'ce99250d1426a257deb76d99a0e445fe', NULL, NOW(3), NOW(3)),
  ('ec69065e-b801-43a8-a190-7e367683b4d7', NULL, 'koc.png', 'public', 'references/koc.png', 'references', 'image/png', 3393, 224, 224, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587687/uploads/ensotek/koc.png', '6e555db148c4b13f7880427a5bbdffb7', 'cloudinary', 'uploads/ensotek/koc', 'image', 'png', 1770587687, '6e555db148c4b13f7880427a5bbdffb7', NULL, NOW(3), NOW(3)),
  ('7501323b-92b8-4de1-bb67-1b3953b7780f', NULL, 'limak.jpeg', 'public', 'references/limak.jpeg', 'references', 'image/jpeg', 8551, 300, 168, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587786/uploads/ensotek/limak.jpg', '3725d01b2f0d3120b224ca6780b77505', 'cloudinary', 'uploads/ensotek/limak', 'image', 'jpg', 1770587786, '3725d01b2f0d3120b224ca6780b77505', NULL, NOW(3), NOW(3)),
  ('bba6a47f-6b51-41bb-8807-01251357083f', NULL, 'nuhcimonto.png', 'public', 'references/nuhcimonto.png', 'references', 'image/png', 6389, 225, 225, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587707/uploads/ensotek/nuhcimonto.png', '750758e67ec7b8889629c9cfc3b5825e', 'cloudinary', 'uploads/ensotek/nuhcimonto', 'image', 'png', 1770587707, '750758e67ec7b8889629c9cfc3b5825e', NULL, NOW(3), NOW(3)),
  ('88313607-2b52-4489-975a-3533ef69c0db', NULL, 'oyak.png', 'public', 'references/oyak.png', 'references', 'image/png', 5264, 304, 166, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587697/uploads/ensotek/oyak.png', 'ef526fec67e747d4e0e7fe6aa4a9aaa8', 'cloudinary', 'uploads/ensotek/oyak', 'image', 'png', 1770587697, 'ef526fec67e747d4e0e7fe6aa4a9aaa8', NULL, NOW(3), NOW(3)),
  ('0f7c6038-e98b-42b0-a49b-c0d56b43c33a', NULL, 'oyakcimonto.jpeg', 'public', 'references/oyakcimonto.jpeg', 'references', 'image/jpeg', 5827, 225, 225, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587708/uploads/ensotek/oyakcimonto.jpg', '2023f4dee7ba85c892d2fbc140560e5f', 'cloudinary', 'uploads/ensotek/oyakcimonto', 'image', 'jpg', 1770587708, '2023f4dee7ba85c892d2fbc140560e5f', NULL, NOW(3), NOW(3)),
  ('8ead5b3b-9e47-44fc-aed9-442fed7e9629', NULL, 'petkim.jpeg', 'public', 'references/petkim.jpeg', 'references', 'image/jpeg', 30992, 401, 400, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587783/uploads/ensotek/petkim.jpg', 'bd66443bb099146ec59a82aae80105e4', 'cloudinary', 'uploads/ensotek/petkim', 'image', 'jpg', 1770587783, 'bd66443bb099146ec59a82aae80105e4', NULL, NOW(3), NOW(3)),
  ('6faf7ac9-bc48-462b-9a93-74fa4822be82', NULL, 'pinar.png', 'public', 'references/pinar.png', 'references', 'image/png', 4817, 272, 186, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587703/uploads/ensotek/pinar.png', '2b1b2d1c46bcd3a7bd00beb5ef3b1e92', 'cloudinary', 'uploads/ensotek/pinar', 'image', 'png', 1770587703, '2b1b2d1c46bcd3a7bd00beb5ef3b1e92', NULL, NOW(3), NOW(3)),
  ('6ed84a45-ec1f-4e3d-8220-fe8ac166ae69', NULL, 'r_nasans.png', 'public', 'references/r_nasans.png', 'references', 'image/png', 4927, 349, 219, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587694/uploads/ensotek/r_nasans.png', '38b725ee01247c520ec421f6e3953332', 'cloudinary', 'uploads/ensotek/r_nasans', 'image', 'png', 1770587694, '38b725ee01247c520ec421f6e3953332', NULL, NOW(3), NOW(3)),
  ('51d30fa6-475a-40a3-9cee-8a6cf691c8c2', NULL, 's_tas.png', 'public', 'references/s_tas.png', 'references', 'image/png', 8905, 225, 225, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587705/uploads/ensotek/s_tas.png', '4685561e2d86c3f134dacc5e6e81caff', 'cloudinary', 'uploads/ensotek/s_tas', 'image', 'png', 1770587705, '4685561e2d86c3f134dacc5e6e81caff', NULL, NOW(3), NOW(3)),
  ('4d7c3795-4569-4660-b937-60b8a59067bd', NULL, 'sisecam.png', 'public', 'references/sisecam.png', 'references', 'image/png', 3439, 300, 168, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587686/uploads/ensotek/sisecam.png', 'f320efe70158c77dc766ab21f58d2c54', 'cloudinary', 'uploads/ensotek/sisecam', 'image', 'png', 1770587686, 'f320efe70158c77dc766ab21f58d2c54', NULL, NOW(3), NOW(3)),
  ('7e3a7426-072f-48cc-86a6-0b3c410985b5', NULL, 'socar.jpg', 'public', 'references/socar.jpg', 'references', 'image/jpeg', 31073, 900, 900, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587782/uploads/ensotek/socar.jpg', '9707fd3bd4a4699d0e92e9a2da5231e6', 'cloudinary', 'uploads/ensotek/socar', 'image', 'jpg', 1770587782, '9707fd3bd4a4699d0e92e9a2da5231e6', NULL, NOW(3), NOW(3)),
  ('7b1fb451-42e7-4e73-9030-9717c47f6918', NULL, 't_rkcell.png', 'public', 'references/t_rkcell.png', 'references', 'image/png', 4174, 267, 189, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587690/uploads/ensotek/t_rkcell.png', '95278c2ea050a905fb3cd6010d07d3ed', 'cloudinary', 'uploads/ensotek/t_rkcell', 'image', 'png', 1770587690, '95278c2ea050a905fb3cd6010d07d3ed', NULL, NOW(3), NOW(3)),
  ('e7789ddf-db73-4a0a-b837-ee692ea20821', NULL, 'telekom.png', 'public', 'references/telekom.png', 'references', 'image/png', 5340, 386, 130, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587689/uploads/ensotek/telekom.png', '2988ba4c1fe5068601b391927e49b419', 'cloudinary', 'uploads/ensotek/telekom', 'image', 'png', 1770587689, '2988ba4c1fe5068601b391927e49b419', NULL, NOW(3), NOW(3)),
  ('ceb284a3-ad02-480e-bb93-763480eda6d6', NULL, 'tofas.png', 'public', 'references/tofas.png', 'references', 'image/png', 5752, 350, 144, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587698/uploads/ensotek/tofas.png', 'e66860eac1a3375b4fe2f446a544270d', 'cloudinary', 'uploads/ensotek/tofas', 'image', 'png', 1770587698, 'e66860eac1a3375b4fe2f446a544270d', NULL, NOW(3), NOW(3)),
  ('d9d2b0a8-f5c0-4447-8f2a-56953af8a4e6', NULL, 'tupras-logo.webp', 'public', 'references/tupras-logo.webp', 'references', 'image/webp', 10346, 1394, 628, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587784/uploads/ensotek/tupras-logo.webp', 'fe18da5d75c4c1c8fbf3ed304d4e64d1', 'cloudinary', 'uploads/ensotek/tupras-logo', 'image', 'webp', 1770587784, 'fe18da5d75c4c1c8fbf3ed304d4e64d1', NULL, NOW(3), NOW(3)),
  ('dfb443eb-7584-49c2-be45-0a39ad6cba89', NULL, 'ulker_logo.jpeg', 'public', 'references/ulker_logo.jpeg', 'references', 'image/jpeg', 5326, 200, 200, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587706/uploads/ensotek/ulker_logo.jpg', '28972fa41244636ce967a40e0101f7c3', 'cloudinary', 'uploads/ensotek/ulker_logo', 'image', 'jpg', 1770587706, '28972fa41244636ce967a40e0101f7c3', NULL, NOW(3), NOW(3)),
  ('42f9b9ce-c9df-43b2-8259-94aefd7fc38b', NULL, 'vestel.png', 'public', 'references/vestel.png', 'references', 'image/png', 1709, 225, 225, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587684/uploads/ensotek/vestel.png', 'efc1859f32627db02b289a0108ab5c6a', 'cloudinary', 'uploads/ensotek/vestel', 'image', 'png', 1770587684, 'efc1859f32627db02b289a0108ab5c6a', NULL, NOW(3), NOW(3)),
  ('667b59fd-28e6-404e-98be-c880e2189921', NULL, 'zorlu.jpg', 'public', 'references/zorlu.jpg', 'references', 'image/jpeg', 10944, 300, 250, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587691/uploads/ensotek/zorlu.jpg', 'bb9dae95dc296b33e77f6cf940ee368f', 'cloudinary', 'uploads/ensotek/zorlu', 'image', 'jpg', 1770587691, 'bb9dae95dc296b33e77f6cf940ee368f', NULL, NOW(3), NOW(3)),
  ('e17bb656-26b8-4d70-83a4-9e4c19a3b6b4', NULL, 'zorluenerji.png', 'public', 'references/zorluenerji.png', 'references', 'image/png', 7521, 308, 163, 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587786/uploads/ensotek/zorluenerji.png', '0d1e7ecafd653e6f5a9d7ab567b999c3', 'cloudinary', 'uploads/ensotek/zorluenerji', 'image', 'png', 1770587786, '0d1e7ecafd653e6f5a9d7ab567b999c3', NULL, NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  url = VALUES(url),
  provider_version = VALUES(provider_version),
  updated_at = VALUES(updated_at);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
