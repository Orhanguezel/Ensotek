-- =============================================================
-- 022_references_i18n.seeds.sql  (TR/EN/DE)  [IDEMPOTENT]  [BINARY-COLLATION-FIX]  (FIXED)
-- Requires:
--   - 021_references_tr_companies.seeds.sql
--   - 021.1_references_tr_domestic.reset_and_seeds.sql
-- Notes:
--   - Generates TR i18n for ALL Domestic references (category aaaa5002)
--   - Then auto-copies to EN/DE if missing (slug prefixed)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

-- Domestic category
SET @CAT_DOMESTIC := 'aaaa5002-1111-4111-8111-aaaaaaaa5002';

-- Helpers
SET @NOW := NOW(3);

-- =============================================================
-- 1) TR UPSERT (AUTO) for all Domestic references
--    - title/slug derived from website_url
--    - summary/content/meta templated by sub_category_id
-- =============================================================

INSERT INTO references_i18n
(
  id, reference_id, locale,
  title, slug,
  summary, content,
  featured_image_alt,
  meta_title, meta_description,
  created_at, updated_at
)
SELECT
  COALESCE(
    (
      SELECT id
      FROM references_i18n t
      WHERE BINARY t.reference_id = BINARY r.id
        AND BINARY t.locale       = BINARY 'tr'
      LIMIT 1
    ),
    UUID()
  ) AS id,

  r.id AS reference_id,
  'tr' AS locale,

  -- title
  (
    CASE
      WHEN r.website_url LIKE '%enerjisa%'        THEN 'Enerjisa'
      WHEN r.website_url LIKE '%aksaenerji%'      THEN 'Aksa Enerji'
      WHEN r.website_url LIKE '%zorluenerji%'     THEN 'Zorlu Enerji'
      WHEN r.website_url LIKE '%tupras%'          THEN 'Tüpraş'
      WHEN r.website_url LIKE '%petkim%'          THEN 'Petkim'
      WHEN r.website_url LIKE '%sasa%'            THEN 'SASA'
      WHEN r.website_url LIKE '%oyakcimento%'     THEN 'OYAK Çimento'
      WHEN r.website_url LIKE '%akcansa%'         THEN 'Akçansa'
      WHEN r.website_url LIKE '%cimsa%'           THEN 'Çimsa'
      WHEN r.website_url LIKE '%nuhcimento%'      THEN 'Nuh Çimento'
      WHEN r.website_url LIKE '%ulker%'           THEN 'Ülker'
      WHEN r.website_url LIKE '%etietieti%'       THEN 'Eti'
      WHEN r.website_url LIKE '%sutas%'           THEN 'Sütaş'
      WHEN r.website_url LIKE '%pinar%'           THEN 'Pınar'
      WHEN r.website_url LIKE '%anadoluefes%'     THEN 'Anadolu Efes'
      WHEN r.website_url LIKE '%erdemir%'         THEN 'Erdemir'
      WHEN r.website_url LIKE '%tosyali%'         THEN 'Tosyalı'
      WHEN r.website_url LIKE '%isdemir%'         THEN 'İsdemir'
      WHEN r.website_url LIKE '%kardemir%'        THEN 'Kardemir'
      WHEN r.website_url LIKE '%colakoglu%'       THEN 'Çolakoğlu Metalurji'
      WHEN r.website_url LIKE '%fordotosan%'      THEN 'Ford Otosan'
      WHEN r.website_url LIKE '%tofas%'           THEN 'Tofaş'
      WHEN r.website_url LIKE '%togg%'            THEN 'TOGG'
      WHEN r.website_url LIKE '%mercedes-benz%'   THEN 'Mercedes-Benz Türk'
      WHEN r.website_url LIKE '%ece%'             THEN 'ECE'
      WHEN r.website_url LIKE '%renesans%'        THEN 'Rönesans'
      WHEN r.website_url LIKE '%zorlu.com.tr%'    THEN 'Zorlu'
      WHEN r.website_url LIKE '%enka%'            THEN 'ENKA'
      WHEN r.website_url LIKE '%tepeinsaat%'      THEN 'Tepe İnşaat'
      WHEN r.website_url LIKE '%turkcell%'        THEN 'Turkcell'
      WHEN r.website_url LIKE '%turktelekom%'     THEN 'Türk Telekom'
      WHEN r.website_url LIKE '%acibadem%'        THEN 'Acıbadem'
      WHEN r.website_url LIKE '%kocsistem%'       THEN 'KoçSistem'
      WHEN r.website_url LIKE '%sisecam%'         THEN 'Şişecam'
      WHEN r.website_url LIKE '%aselsan%'         THEN 'ASELSAN'
      WHEN r.website_url LIKE '%turkishairlines%' THEN 'Türk Hava Yolları'
      WHEN r.website_url LIKE '%arcelik%'         THEN 'Arçelik'
      WHEN r.website_url LIKE '%vestel%'          THEN 'Vestel'
      WHEN r.website_url LIKE '%socar%'           THEN 'SOCAR Turkey'
      WHEN r.website_url LIKE '%aygaz%'           THEN 'Aygaz'
      ELSE
        UPPER(
          SUBSTRING_INDEX(
            REPLACE(REPLACE(REPLACE(r.website_url,'https://',''),'http://',''),'www.',''),
            '.', 1
          )
        )
    END
  ) AS title,

  -- slug
  (
    CASE
      WHEN r.website_url LIKE '%enerjisa%'        THEN 'enerjisa'
      WHEN r.website_url LIKE '%aksaenerji%'      THEN 'aksa-enerji'
      WHEN r.website_url LIKE '%zorluenerji%'     THEN 'zorlu-enerji'
      WHEN r.website_url LIKE '%tupras%'          THEN 'tupras'
      WHEN r.website_url LIKE '%petkim%'          THEN 'petkim'
      WHEN r.website_url LIKE '%sasa%'            THEN 'sasa'
      WHEN r.website_url LIKE '%oyakcimento%'     THEN 'oyak-cimento'
      WHEN r.website_url LIKE '%akcansa%'         THEN 'akcansa'
      WHEN r.website_url LIKE '%cimsa%'           THEN 'cimsa'
      WHEN r.website_url LIKE '%nuhcimento%'      THEN 'nuh-cimento'
      WHEN r.website_url LIKE '%ulker%'           THEN 'ulker'
      WHEN r.website_url LIKE '%etietieti%'       THEN 'eti'
      WHEN r.website_url LIKE '%sutas%'           THEN 'sutas'
      WHEN r.website_url LIKE '%pinar%'           THEN 'pinar'
      WHEN r.website_url LIKE '%anadoluefes%'     THEN 'anadolu-efes'
      WHEN r.website_url LIKE '%erdemir%'         THEN 'erdemir'
      WHEN r.website_url LIKE '%tosyali%'         THEN 'tosyali'
      WHEN r.website_url LIKE '%isdemir%'         THEN 'isdemir'
      WHEN r.website_url LIKE '%kardemir%'        THEN 'kardemir'
      WHEN r.website_url LIKE '%colakoglu%'       THEN 'colakoglu-metalurji'
      WHEN r.website_url LIKE '%fordotosan%'      THEN 'ford-otosan'
      WHEN r.website_url LIKE '%tofas%'           THEN 'tofas'
      WHEN r.website_url LIKE '%togg%'            THEN 'togg'
      WHEN r.website_url LIKE '%mercedes-benz%'   THEN 'mercedes-benz-turk'
      WHEN r.website_url LIKE '%ece%'             THEN 'ece'
      WHEN r.website_url LIKE '%renesans%'        THEN 'renesans'
      WHEN r.website_url LIKE '%enka%'            THEN 'enka'
      WHEN r.website_url LIKE '%tepeinsaat%'      THEN 'tepe-insaat'
      WHEN r.website_url LIKE '%turkcell%'        THEN 'turkcell'
      WHEN r.website_url LIKE '%turktelekom%'     THEN 'turk-telekom'
      WHEN r.website_url LIKE '%acibadem%'        THEN 'acibadem'
      WHEN r.website_url LIKE '%kocsistem%'       THEN 'koc-sistem'
      WHEN r.website_url LIKE '%sisecam%'         THEN 'sisecam'
      WHEN r.website_url LIKE '%aselsan%'         THEN 'aselsan'
      WHEN r.website_url LIKE '%turkishairlines%' THEN 'thy'
      WHEN r.website_url LIKE '%arcelik%'         THEN 'arcelik'
      WHEN r.website_url LIKE '%vestel%'          THEN 'vestel'
      WHEN r.website_url LIKE '%socar%'           THEN 'socar-turkey'
      WHEN r.website_url LIKE '%aygaz%'           THEN 'aygaz'
      ELSE
        LOWER(
          REPLACE(
            SUBSTRING_INDEX(
              REPLACE(REPLACE(REPLACE(r.website_url,'https://',''),'http://',''),'www.',''),
              '.', 1
            ),
            '_','-'
          )
        )
    END
  ) AS slug,

  -- summary (TR)
  (
    CASE
      WHEN r.sub_category_id = 'bbbb5201-1111-4111-8111-bbbbbbbb5201' THEN 'Enerji santrali ve üretim altyapıları için kurumsal referans.'
      WHEN r.sub_category_id = 'bbbb5202-1111-4111-8111-bbbbbbbb5202' THEN 'Petrokimya ve kimya tesisleri için kurumsal referans.'
      WHEN r.sub_category_id = 'bbbb5203-1111-4111-8111-bbbbbbbb5203' THEN 'Çimento ve madencilik operasyonları için kurumsal referans.'
      WHEN r.sub_category_id = 'bbbb5204-1111-4111-8111-bbbbbbbb5204' THEN 'Gıda ve içecek üretim tesisleri için kurumsal referans.'
      WHEN r.sub_category_id = 'bbbb5205-1111-4111-8111-bbbbbbbb5205' THEN 'Çelik ve metal sanayi uygulamaları için kurumsal referans.'
      WHEN r.sub_category_id = 'bbbb5206-1111-4111-8111-bbbbbbbb5206' THEN 'Otomotiv ve yan sanayi üretim hatları için kurumsal referans.'
      WHEN r.sub_category_id = 'bbbb5207-1111-4111-8111-bbbbbbbb5207' THEN 'AVM ve ticari binalar için kurumsal referans.'
      WHEN r.sub_category_id = 'bbbb5208-1111-4111-8111-bbbbbbbb5208' THEN 'Veri merkezi ve hastane altyapıları için kurumsal referans.'
      ELSE 'Kurumsal projeler kapsamında referans kaydı.'
    END
  ) AS summary,

  -- content (TR, HTML)
  (
    CASE
      WHEN r.sub_category_id = 'bbbb5201-1111-4111-8111-bbbbbbbb5201' THEN
        '<p>Enerji üretim tesislerinde iklimlendirme, proses soğutma ve endüstriyel altyapı ihtiyaçları kapsamında uygulanan çözümler için referans kaydı.</p>'
      WHEN r.sub_category_id = 'bbbb5202-1111-4111-8111-bbbbbbbb5202' THEN
        '<p>Petrokimya ve kimya tesislerinde proses güvenliği, verimlilik ve sürdürülebilirlik odaklı endüstriyel çözümler kapsamında referans kaydı.</p>'
      WHEN r.sub_category_id = 'bbbb5203-1111-4111-8111-bbbbbbbb5203' THEN
        '<p>Çimento ve madencilik tesislerinde zorlu saha koşullarına uygun, yüksek dayanımlı endüstriyel uygulamalar kapsamında referans kaydı.</p>'
      WHEN r.sub_category_id = 'bbbb5204-1111-4111-8111-bbbbbbbb5204' THEN
        '<p>Gıda ve içecek üretim tesislerinde hijyen, enerji verimliliği ve operasyon sürekliliği odaklı uygulamalar kapsamında referans kaydı.</p>'
      WHEN r.sub_category_id = 'bbbb5205-1111-4111-8111-bbbbbbbb5205' THEN
        '<p>Çelik ve metal sanayi tesislerinde yüksek ısı yükleri ve proses gereksinimlerine uygun endüstriyel çözümler için referans kaydı.</p>'
      WHEN r.sub_category_id = 'bbbb5206-1111-4111-8111-bbbbbbbb5206' THEN
        '<p>Otomotiv üretim hatlarında proses stabilitesi, kalite ve enerji optimizasyonu hedefleri doğrultusunda uygulanan çözümler için referans kaydı.</p>'
      WHEN r.sub_category_id = 'bbbb5207-1111-4111-8111-bbbbbbbb5207' THEN
        '<p>AVM ve ticari binalarda konfor, enerji verimliliği ve işletme sürekliliği hedefleriyle uygulanan çözümler için referans kaydı.</p>'
      WHEN r.sub_category_id = 'bbbb5208-1111-4111-8111-bbbbbbbb5208' THEN
        '<p>Veri merkezleri ve hastanelerde yüksek süreklilik, yedeklilik ve kritik altyapı yönetimi hedefleriyle uygulanan çözümler için referans kaydı.</p>'
      ELSE
        '<p>Kurumsal projelerde kullanılan endüstriyel çözümler kapsamında referans kaydı.</p>'
    END
  ) AS content,

  -- featured_image_alt (TR)
  (
    CASE
      WHEN r.sub_category_id = 'bbbb5201-1111-4111-8111-bbbbbbbb5201' THEN 'Enerji tesisi görseli'
      WHEN r.sub_category_id = 'bbbb5202-1111-4111-8111-bbbbbbbb5202' THEN 'Petrokimya/kimya tesisi görseli'
      WHEN r.sub_category_id = 'bbbb5203-1111-4111-8111-bbbbbbbb5203' THEN 'Çimento/madencilik tesisi görseli'
      WHEN r.sub_category_id = 'bbbb5204-1111-4111-8111-bbbbbbbb5204' THEN 'Gıda üretim tesisi görseli'
      WHEN r.sub_category_id = 'bbbb5205-1111-4111-8111-bbbbbbbb5205' THEN 'Çelik/metal tesis görseli'
      WHEN r.sub_category_id = 'bbbb5206-1111-4111-8111-bbbbbbbb5206' THEN 'Otomotiv üretim tesisi görseli'
      WHEN r.sub_category_id = 'bbbb5207-1111-4111-8111-bbbbbbbb5207' THEN 'Ticari bina/AVM görseli'
      WHEN r.sub_category_id = 'bbbb5208-1111-4111-8111-bbbbbbbb5208' THEN 'Veri merkezi/hastane görseli'
      ELSE 'Kurumsal proje görseli'
    END
  ) AS featured_image_alt,

  -- meta_title (TR)
  CONCAT(
    (
      CASE
        WHEN r.website_url LIKE '%turkishairlines%' THEN 'Türk Hava Yolları'
        WHEN r.website_url LIKE '%turktelekom%'     THEN 'Türk Telekom'
        ELSE
          (
            CASE
              WHEN r.website_url LIKE '%enerjisa%' THEN 'Enerjisa'
              WHEN r.website_url LIKE '%aksaenerji%' THEN 'Aksa Enerji'
              WHEN r.website_url LIKE '%zorluenerji%' THEN 'Zorlu Enerji'
              WHEN r.website_url LIKE '%tupras%' THEN 'Tüpraş'
              WHEN r.website_url LIKE '%petkim%' THEN 'Petkim'
              WHEN r.website_url LIKE '%sasa%' THEN 'SASA'
              WHEN r.website_url LIKE '%sisecam%' THEN 'Şişecam'
              WHEN r.website_url LIKE '%aselsan%' THEN 'ASELSAN'
              ELSE 'Referans'
            END
          )
      END
    ),
    ' | Referans'
  ) AS meta_title,

  -- meta_description (TR)
  (
    CASE
      WHEN r.sub_category_id = 'bbbb5201-1111-4111-8111-bbbbbbbb5201' THEN 'Enerji santralleri için endüstriyel uygulamalar kapsamında referans kaydı.'
      WHEN r.sub_category_id = 'bbbb5202-1111-4111-8111-bbbbbbbb5202' THEN 'Petrokimya ve kimya tesisleri için endüstriyel uygulamalar kapsamında referans kaydı.'
      WHEN r.sub_category_id = 'bbbb5203-1111-4111-8111-bbbbbbbb5203' THEN 'Çimento ve madencilik tesisleri için endüstriyel uygulamalar kapsamında referans kaydı.'
      WHEN r.sub_category_id = 'bbbb5204-1111-4111-8111-bbbbbbbb5204' THEN 'Gıda ve içecek tesisleri için endüstriyel uygulamalar kapsamında referans kaydı.'
      WHEN r.sub_category_id = 'bbbb5205-1111-4111-8111-bbbbbbbb5205' THEN 'Çelik ve metal sanayi için endüstriyel uygulamalar kapsamında referans kaydı.'
      WHEN r.sub_category_id = 'bbbb5206-1111-4111-8111-bbbbbbbb5206' THEN 'Otomotiv ve yan sanayi için endüstriyel uygulamalar kapsamında referans kaydı.'
      WHEN r.sub_category_id = 'bbbb5207-1111-4111-8111-bbbbbbbb5207' THEN 'AVM ve ticari binalar için endüstriyel uygulamalar kapsamında referans kaydı.'
      WHEN r.sub_category_id = 'bbbb5208-1111-4111-8111-bbbbbbbb5208' THEN 'Veri merkezi ve hastane altyapıları için endüstriyel uygulamalar kapsamında referans kaydı.'
      ELSE 'Kurumsal projeler için endüstriyel uygulamalar kapsamında referans kaydı.'
    END
  ) AS meta_description,

  @NOW AS created_at,
  @NOW AS updated_at

FROM `references` r
WHERE BINARY r.category_id = BINARY @CAT_DOMESTIC

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
-- 2) EN copy (slug = CONCAT('en-', tr.slug)) if missing
-- =============================================================
INSERT INTO references_i18n
(id, reference_id, locale, title, slug, summary, content, featured_image_alt, meta_title, meta_description, created_at, updated_at)
SELECT
  COALESCE(
    (SELECT id
     FROM references_i18n t
     WHERE BINARY t.reference_id = BINARY s.reference_id
       AND BINARY t.locale       = BINARY 'en'
     LIMIT 1),
    UUID()
  ),
  s.reference_id,
  'en',
  s.title,
  CONCAT('en-', s.slug),
  s.summary,
  s.content,
  s.featured_image_alt,
  CONCAT(s.title, ' | Reference'),
  s.meta_description,
  NOW(3), NOW(3)
FROM references_i18n s
JOIN `references` r ON BINARY r.id = BINARY s.reference_id
WHERE BINARY r.category_id = BINARY @CAT_DOMESTIC
  AND BINARY s.locale      = BINARY 'tr'
  AND NOT EXISTS (
    SELECT 1
    FROM references_i18n t
    WHERE BINARY t.reference_id = BINARY s.reference_id
      AND BINARY t.locale       = BINARY 'en'
  );

-- =============================================================
-- 3) DE copy (slug = CONCAT('de-', tr.slug)) if missing
-- =============================================================
INSERT INTO references_i18n
(id, reference_id, locale, title, slug, summary, content, featured_image_alt, meta_title, meta_description, created_at, updated_at)
SELECT
  COALESCE(
    (SELECT id
     FROM references_i18n t
     WHERE BINARY t.reference_id = BINARY s.reference_id
       AND BINARY t.locale       = BINARY 'de'
     LIMIT 1),
    UUID()
  ),
  s.reference_id,
  'de',
  s.title,
  CONCAT('de-', s.slug),
  s.summary,
  s.content,
  s.featured_image_alt,
  CONCAT(s.title, ' | Referenz'),
  s.meta_description,
  NOW(3), NOW(3)
FROM references_i18n s
JOIN `references` r ON BINARY r.id = BINARY s.reference_id
WHERE BINARY r.category_id = BINARY @CAT_DOMESTIC
  AND BINARY s.locale      = BINARY 'tr'
  AND NOT EXISTS (
    SELECT 1
    FROM references_i18n t
    WHERE BINARY t.reference_id = BINARY s.reference_id
      AND BINARY t.locale       = BINARY 'de'
  );

COMMIT;
