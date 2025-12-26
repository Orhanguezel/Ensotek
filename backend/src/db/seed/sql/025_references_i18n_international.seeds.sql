-- =============================================================
-- 025_references_i18n_international.seeds.sql  (TR/EN/DE) [IDEMPOTENT] [BINARY-FIX]
-- Requires: 024_references_tr_international_companies.seeds.sql
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

SET @NOW := NOW(3);

-- =============================================================
-- TR i18n (no SELECT id needed; UUID() + unique(reference_id, locale) + ODKU)
-- =============================================================
INSERT INTO references_i18n
(
  id, reference_id, locale,
  title, slug,
  summary, content,
  featured_image_alt, meta_title, meta_description,
  created_at, updated_at
)
VALUES
  -- POWER
  (UUID(),'7b1b1001-2222-4222-8222-7b1b7b1b1001','de','ENKA','enka-yurt-disi',
   'Yurt dışı enerji/altyapı projeleri için referans örneği.',
   '<p>Yurt dışı enerji santrali ve altyapı projelerinde kullanılan endüstriyel çözümler kapsamında referans kaydı.</p>',
   'Enerji santrali görseli','ENKA | Referans','Yurt dışı enerji santrali projeleri için referans kaydı.',@NOW,@NOW),

  (UUID(),'7b1b1001-2222-4222-8222-7b1b7b1b1002','de','Tekfen','tekfen-yurt-disi',
   'Yurt dışı enerji ve endüstriyel tesis projeleri için referans örneği.',
   '<p>Yurt dışı enerji ve endüstriyel tesis projelerinde kullanılan çözümler kapsamında referans kaydı.</p>',
   'Endüstriyel tesis görseli','Tekfen | Referans','Yurt dışı enerji/endüstriyel projeler için referans kaydı.',@NOW,@NOW),

  (UUID(),'7b1b1001-2222-4222-8222-7b1b7b1b1003','de','Çalık Enerji','calik-enerji-yurt-disi',
   'Yurt dışı enerji üretimi ve altyapı uygulamaları için referans örneği.',
   '<p>Yurt dışı enerji üretimi ve altyapı uygulamalarında kullanılan çözümler kapsamında referans kaydı.</p>',
   'Enerji altyapısı görseli','Çalık Enerji | Referans','Yurt dışı enerji altyapı projeleri için referans kaydı.',@NOW,@NOW),

  -- PETRO/CHEM
  (UUID(),'7b1b1002-2222-4222-8222-7b1b7b1b2001','de','Şişecam','sisecam-yurt-disi',
   'Yurt dışı üretim ve proses tesisleri için referans örneği.',
   '<p>Yurt dışı üretim/proses tesislerinde kullanılan endüstriyel çözümler kapsamında referans kaydı.</p>',
   'Proses tesisi görseli','Şişecam | Referans','Yurt dışı proses/üretim projeleri için referans kaydı.',@NOW,@NOW),

  (UUID(),'7b1b1002-2222-4222-8222-7b1b7b1b2002','de','SASA','sasa-yurt-disi',
   'Yurt dışı kimya ve üretim hatları için referans örneği.',
   '<p>Yurt dışı kimya ve üretim hatlarında kullanılan çözümler kapsamında referans kaydı.</p>',
   'Kimya tesisi görseli','SASA | Referans','Yurt dışı kimya/üretim projeleri için referans kaydı.',@NOW,@NOW),

  (UUID(),'7b1b1002-2222-4222-8222-7b1b7b1b2003','de','Petkim','petkim-yurt-disi',
   'Yurt dışı petrokimya tesisleri için referans örneği.',
   '<p>Yurt dışı petrokimya tesislerinde kullanılan çözümler kapsamında referans kaydı.</p>',
   'Petrokimya tesisi görseli','Petkim | Referans','Yurt dışı petrokimya projeleri için referans kaydı.',@NOW,@NOW),

  -- CEMENT/MINING
  (UUID(),'7b1b1003-2222-4222-8222-7b1b7b1b3001','de','Oyak Çimento','oyak-cimento-yurt-disi',
   'Yurt dışı çimento ve ağır sanayi projeleri için referans örneği.',
   '<p>Yurt dışı çimento/ağır sanayi tesislerinde kullanılan çözümler kapsamında referans kaydı.</p>',
   'Çimento tesisi görseli','Oyak Çimento | Referans','Yurt dışı çimento/ağır sanayi projeleri için referans kaydı.',@NOW,@NOW),

  (UUID(),'7b1b1003-2222-4222-8222-7b1b7b1b3002','de','Limak','limak-yurt-disi',
   'Yurt dışı altyapı ve endüstriyel tesis projeleri için referans örneği.',
   '<p>Yurt dışı altyapı ve endüstriyel tesis uygulamalarında kullanılan çözümler kapsamında referans kaydı.</p>',
   'Altyapı projesi görseli','Limak | Referans','Yurt dışı altyapı/endüstriyel projeler için referans kaydı.',@NOW,@NOW),

  (UUID(),'7b1b1003-2222-4222-8222-7b1b7b1b3003','de','Akçansa','akcansa-yurt-disi',
   'Yurt dışı üretim ve tesis uygulamaları için referans örneği.',
   '<p>Yurt dışı üretim ve tesis uygulamalarında kullanılan çözümler kapsamında referans kaydı.</p>',
   'Tesis görseli','Akçansa | Referans','Yurt dışı tesis/üretim projeleri için referans kaydı.',@NOW,@NOW),

  -- FOOD/BEV
  (UUID(),'7b1b1004-2222-4222-8222-7b1b7b1b4001','de','Ülker','ulker-yurt-disi',
   'Yurt dışı gıda üretim tesisleri için referans örneği.',
   '<p>Yurt dışı gıda üretim tesislerinde kullanılan çözümler kapsamında referans kaydı.</p>',
   'Gıda üretim tesisi görseli','Ülker | Referans','Yurt dışı gıda üretim projeleri için referans kaydı.',@NOW,@NOW),

  (UUID(),'7b1b1004-2222-4222-8222-7b1b7b1b4002','de','Eti','eti-yurt-disi',
   'Yurt dışı gıda/ambalaj üretim uygulamaları için referans örneği.',
   '<p>Yurt dışı gıda/ambalaj üretim uygulamalarında kullanılan çözümler kapsamında referans kaydı.</p>',
   'Üretim hattı görseli','Eti | Referans','Yurt dışı gıda üretim projeleri için referans kaydı.',@NOW,@NOW),

  (UUID(),'7b1b1004-2222-4222-8222-7b1b7b1b4003','de','Sütaş','sutas-yurt-disi',
   'Yurt dışı süt ve gıda üretim tesisleri için referans örneği.',
   '<p>Yurt dışı süt/gıda üretim tesislerinde kullanılan çözümler kapsamında referans kaydı.</p>',
   'Gıda tesisi görseli','Sütaş | Referans','Yurt dışı gıda üretim projeleri için referans kaydı.',@NOW,@NOW),

  -- STEEL/METAL
  (UUID(),'7b1b1005-2222-4222-8222-7b1b7b1b5001','de','Erdemir','erdemir-yurt-disi',
   'Yurt dışı çelik ve metal sanayi projeleri için referans örneği.',
   '<p>Yurt dışı çelik/metal sanayi uygulamalarında kullanılan çözümler kapsamında referans kaydı.</p>',
   'Çelik üretim görseli','Erdemir | Referans','Yurt dışı çelik/metal projeleri için referans kaydı.',@NOW,@NOW),

  (UUID(),'7b1b1005-2222-4222-8222-7b1b7b1b5002','de','Tosyalı','tosyali-yurt-disi',
   'Yurt dışı metal sanayi ve üretim tesisleri için referans örneği.',
   '<p>Yurt dışı metal sanayi ve üretim tesislerinde kullanılan çözümler kapsamında referans kaydı.</p>',
   'Metal sanayi görseli','Tosyalı | Referans','Yurt dışı metal sanayi projeleri için referans kaydı.',@NOW,@NOW),

  (UUID(),'7b1b1005-2222-4222-8222-7b1b7b1b5003','de','İsdemir','isdemir-yurt-disi',
   'Yurt dışı ağır sanayi projeleri için referans örneği.',
   '<p>Yurt dışı ağır sanayi tesislerinde kullanılan çözümler kapsamında referans kaydı.</p>',
   'Ağır sanayi görseli','İsdemir | Referans','Yurt dışı ağır sanayi projeleri için referans kaydı.',@NOW,@NOW),

  -- AUTO
  (UUID(),'7b1b1006-2222-4222-8222-7b1b7b1b6001','de','Ford Otosan','ford-otosan-yurt-disi',
   'Yurt dışı otomotiv üretim projeleri için referans örneği.',
   '<p>Yurt dışı otomotiv üretim tesislerinde kullanılan çözümler kapsamında referans kaydı.</p>',
   'Otomotiv üretim tesisi görseli','Ford Otosan | Referans','Yurt dışı otomotiv üretim projeleri için referans kaydı.',@NOW,@NOW),

  (UUID(),'7b1b1006-2222-4222-8222-7b1b7b1b6002','de','Tofaş','tofas-yurt-disi',
   'Yurt dışı otomotiv ve tedarik zinciri projeleri için referans örneği.',
   '<p>Yurt dışı otomotiv ve yan sanayi süreçlerinde kullanılan çözümler kapsamında referans kaydı.</p>',
   'Otomotiv görseli','Tofaş | Referans','Yurt dışı otomotiv projeleri için referans kaydı.',@NOW,@NOW),

  (UUID(),'7b1b1006-2222-4222-8222-7b1b7b1b6003','de','Arçelik','arcelik-yurt-disi',
   'Yurt dışı üretim ve endüstriyel otomasyon projeleri için referans örneği.',
   '<p>Yurt dışı üretim ve endüstriyel otomasyon uygulamalarında kullanılan çözümler kapsamında referans kaydı.</p>',
   'Üretim hattı görseli','Arçelik | Referans','Yurt dışı üretim/otomasyon projeleri için referans kaydı.',@NOW,@NOW),

  -- MALL/COMMERCIAL
  (UUID(),'7b1b1007-2222-4222-8222-7b1b7b1b7001','de','Rönesans','ronesans-yurt-disi',
   'Yurt dışı ticari bina ve büyük ölçekli projeler için referans örneği.',
   '<p>Yurt dışı ticari bina ve büyük ölçekli projelerde kullanılan çözümler kapsamında referans kaydı.</p>',
   'Ticari bina görseli','Rönesans | Referans','Yurt dışı ticari bina projeleri için referans kaydı.',@NOW,@NOW),

  (UUID(),'7b1b1007-2222-4222-8222-7b1b7b1b7002','de','ENKA İnşaat','enka-insaat-yurt-disi',
   'Yurt dışı inşaat ve tesis projeleri için referans örneği.',
   '<p>Yurt dışı inşaat ve tesis projelerinde kullanılan çözümler kapsamında referans kaydı.</p>',
   'İnşaat projesi görseli','ENKA İnşaat | Referans','Yurt dışı inşaat/tesis projeleri için referans kaydı.',@NOW,@NOW),

  (UUID(),'7b1b1007-2222-4222-8222-7b1b7b1b7003','de','TAV Havalimanları','tav-yurt-disi',
   'Yurt dışı havalimanı ve ticari alan projeleri için referans örneği.',
   '<p>Yurt dışı havalimanı ve ticari alan projelerinde kullanılan çözümler kapsamında referans kaydı.</p>',
   'Havalimanı görseli','TAV | Referans','Yurt dışı havalimanı projeleri için referans kaydı.',@NOW,@NOW),

  -- DC/HOSP
  (UUID(),'7b1b1008-2222-4222-8222-7b1b7b1b8001','de','Turkcell','turkcell-yurt-disi',
   'Yurt dışı telekom ve veri merkezi odaklı projeler için referans örneği.',
   '<p>Yurt dışı telekom/veri merkezi projelerinde kullanılan çözümler kapsamında referans kaydı.</p>',
   'Veri merkezi görseli','Turkcell | Referans','Yurt dışı telekom/veri merkezi projeleri için referans kaydı.',@NOW,@NOW),

  (UUID(),'7b1b1008-2222-4222-8222-7b1b7b1b8002','de','Türk Telekom','turk-telekom-yurt-disi',
   'Yurt dışı altyapı ve iletişim projeleri için referans örneği.',
   '<p>Yurt dışı iletişim altyapısı projelerinde kullanılan çözümler kapsamında referans kaydı.</p>',
   'İletişim altyapısı görseli','Türk Telekom | Referans','Yurt dışı iletişim altyapısı projeleri için referans kaydı.',@NOW,@NOW),

  (UUID(),'7b1b1008-2222-4222-8222-7b1b7b1b8003','de','Acıbadem','acibadem-yurt-disi',
   'Yurt dışı hastane ve sağlık kampüsü projeleri için referans örneği.',
   '<p>Yurt dışı hastane/sağlık kampüsü projelerinde kullanılan çözümler kapsamında referans kaydı.</p>',
   'Hastane görseli','Acıbadem | Referans','Yurt dışı sağlık projeleri için referans kaydı.',@NOW,@NOW),

  -- OTHER
  (UUID(),'7b1b1009-2222-4222-8222-7b1b7b1b9001','de','Türk Hava Yolları','thy-yurt-disi',
   'Yurt dışı operasyon ve lojistik süreçleri için referans örneği.',
   '<p>Yurt dışı operasyon/lojistik süreçlerinde kullanılan çözümler kapsamında referans kaydı.</p>',
   'Uçak görseli','THY | Referans','Yurt dışı operasyon/lojistik projeleri için referans kaydı.',@NOW,@NOW),

  (UUID(),'7b1b1009-2222-4222-8222-7b1b7b1b9002','de','Aselsan','aselsan-yurt-disi',
   'Yurt dışı teknoloji ve savunma sanayi projeleri için referans örneği.',
   '<p>Yurt dışı teknoloji çözümleri ve kritik altyapı projelerinde kullanılan çözümler kapsamında referans kaydı.</p>',
   'Teknoloji görseli','Aselsan | Referans','Yurt dışı teknoloji projeleri için referans kaydı.',@NOW,@NOW),

  (UUID(),'7b1b1009-2222-4222-8222-7b1b7b1b9003','de','Vestel','vestel-yurt-disi',
   'Yurt dışı üretim ve teknoloji projeleri için referans örneği.',
   '<p>Yurt dışı üretim ve teknoloji projelerinde kullanılan çözümler kapsamında referans kaydı.</p>',
   'Üretim görseli','Vestel | Referans','Yurt dışı üretim/teknoloji projeleri için referans kaydı.',@NOW,@NOW)

ON DUPLICATE KEY UPDATE
  title              = VALUES(title),
  slug               = VALUES(slug),
  summary            = VALUES(summary),
  content            = VALUES(content),
  featured_image_alt = VALUES(featured_image_alt),
  meta_title         = VALUES(meta_title),
  meta_description   = VALUES(meta_description),
  updated_at         = VALUES(updated_at);

-- =============================================================
-- EN/DE auto-copy from TR if missing
-- slug: prefix en- / de-
-- =============================================================

-- EN
INSERT INTO references_i18n
(
  id, reference_id, locale,
  title, slug,
  summary, content,
  featured_image_alt, meta_title, meta_description,
  created_at, updated_at
)
SELECT
  UUID(),
  tr.reference_id,
  'en',
  tr.title,
  CONCAT('en-', tr.slug),
  tr.summary,
  tr.content,
  tr.featured_image_alt,
  CONCAT(tr.title, ' | Reference'),
  tr.meta_description,
  @NOW, @NOW
FROM references_i18n tr
WHERE BINARY tr.locale = BINARY 'de'
  AND NOT EXISTS (
    SELECT 1 FROM references_i18n en
    WHERE BINARY en.reference_id = BINARY tr.reference_id
      AND BINARY en.locale       = BINARY 'en'
  )
ON DUPLICATE KEY UPDATE
  title              = VALUES(title),
  slug               = VALUES(slug),
  summary            = VALUES(summary),
  content            = VALUES(content),
  featured_image_alt = VALUES(featured_image_alt),
  meta_title         = VALUES(meta_title),
  meta_description   = VALUES(meta_description),
  updated_at         = VALUES(updated_at);

-- DE
INSERT INTO references_i18n
(
  id, reference_id, locale,
  title, slug,
  summary, content,
  featured_image_alt, meta_title, meta_description,
  created_at, updated_at
)
SELECT
  UUID(),
  tr.reference_id,
  'de',
  tr.title,
  CONCAT('de-', tr.slug),
  tr.summary,
  tr.content,
  tr.featured_image_alt,
  CONCAT(tr.title, ' | Referenz'),
  tr.meta_description,
  @NOW, @NOW
FROM references_i18n tr
WHERE BINARY tr.locale = BINARY 'de'
  AND NOT EXISTS (
    SELECT 1 FROM references_i18n de
    WHERE BINARY de.reference_id = BINARY tr.reference_id
      AND BINARY de.locale       = BINARY 'de'
  )
ON DUPLICATE KEY UPDATE
  title              = VALUES(title),
  slug               = VALUES(slug),
  summary            = VALUES(summary),
  content            = VALUES(content),
  featured_image_alt = VALUES(featured_image_alt),
  meta_title         = VALUES(meta_title),
  meta_description   = VALUES(meta_description),
  updated_at         = VALUES(updated_at);

COMMIT;
