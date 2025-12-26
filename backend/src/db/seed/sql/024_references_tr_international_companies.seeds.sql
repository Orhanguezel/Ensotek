-- =============================================================
-- 024_references_tr_international_companies.seeds.sql  (TR Companies / International)
-- category_id = aaaa5003 (International)
-- sub_category_id = bbbb5301..5309
-- Each sub-category: 3 sample references (TOTAL 27)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

SET @CAT_INTL := 'aaaa5003-1111-4111-8111-aaaaaaaa5003';

-- International sector sub_categories
SET @SC_INTL_POWER   := 'bbbb5301-1111-4111-8111-bbbbbbbb5301';
SET @SC_INTL_PETRO   := 'bbbb5302-1111-4111-8111-bbbbbbbb5302';
SET @SC_INTL_CEMENT  := 'bbbb5303-1111-4111-8111-bbbbbbbb5303';
SET @SC_INTL_FOOD    := 'bbbb5304-1111-4111-8111-bbbbbbbb5304';
SET @SC_INTL_STEEL   := 'bbbb5305-1111-4111-8111-bbbbbbbb5305';
SET @SC_INTL_AUTO    := 'bbbb5306-1111-4111-8111-bbbbbbbb5306';
SET @SC_INTL_MALL    := 'bbbb5307-1111-4111-8111-bbbbbbbb5307';
SET @SC_INTL_DC_HOSP := 'bbbb5308-1111-4111-8111-bbbbbbbb5308';
SET @SC_INTL_OTHER   := 'bbbb5309-1111-4111-8111-bbbbbbbb5309';

-- ============================
-- STABLE REFERENCE IDS
-- ============================
-- POWER (5301)
SET @REF_INTL_ENKA_ENERGY   := '7b1b1001-2222-4222-8222-7b1b7b1b1001';
SET @REF_INTL_TEKFEN_ENERGY := '7b1b1001-2222-4222-8222-7b1b7b1b1002';
SET @REF_INTL_CALIK_ENERGY  := '7b1b1001-2222-4222-8222-7b1b7b1b1003';

-- PETRO/CHEM (5302)
SET @REF_INTL_SISECAM_INTL  := '7b1b1002-2222-4222-8222-7b1b7b1b2001';
SET @REF_INTL_SASA_INTL     := '7b1b1002-2222-4222-8222-7b1b7b1b2002';
SET @REF_INTL_PETKIM_INTL   := '7b1b1002-2222-4222-8222-7b1b7b1b2003';

-- CEMENT/MINING (5303)
SET @REF_INTL_OYAKC_INTL    := '7b1b1003-2222-4222-8222-7b1b7b1b3001';
SET @REF_INTL_LIMAKC_INTL   := '7b1b1003-2222-4222-8222-7b1b7b1b3002';
SET @REF_INTL_AKCANSA_INTL  := '7b1b1003-2222-4222-8222-7b1b7b1b3003';

-- FOOD/BEV (5304)
SET @REF_INTL_ULKER_INTL    := '7b1b1004-2222-4222-8222-7b1b7b1b4001';
SET @REF_INTL_ETI_INTL      := '7b1b1004-2222-4222-8222-7b1b7b1b4002';
SET @REF_INTL_SUTAS_INTL    := '7b1b1004-2222-4222-8222-7b1b7b1b4003';

-- STEEL/METAL (5305)
SET @REF_INTL_ERDEMIR_INTL  := '7b1b1005-2222-4222-8222-7b1b7b1b5001';
SET @REF_INTL_TOSYALI_INTL  := '7b1b1005-2222-4222-8222-7b1b7b1b5002';
SET @REF_INTL_ISDEMIR_INTL  := '7b1b1005-2222-4222-8222-7b1b7b1b5003';

-- AUTO (5306)
SET @REF_INTL_FORD_INTL     := '7b1b1006-2222-4222-8222-7b1b7b1b6001';
SET @REF_INTL_TOFAS_INTL    := '7b1b1006-2222-4222-8222-7b1b7b1b6002';
SET @REF_INTL_ARCELIK_INTL  := '7b1b1006-2222-4222-8222-7b1b7b1b6003';

-- MALL/COMMERCIAL (5307)
SET @REF_INTL_RENESANS_INTL := '7b1b1007-2222-4222-8222-7b1b7b1b7001';
SET @REF_INTL_ENKA_CONS_INTL:= '7b1b1007-2222-4222-8222-7b1b7b1b7002';
SET @REF_INTL_TAV_INTL      := '7b1b1007-2222-4222-8222-7b1b7b1b7003';

-- DC/HOSP (5308)
SET @REF_INTL_TURKCELL_INTL := '7b1b1008-2222-4222-8222-7b1b7b1b8001';
SET @REF_INTL_TT_INTL       := '7b1b1008-2222-4222-8222-7b1b7b1b8002';
SET @REF_INTL_ACIB_INTL     := '7b1b1008-2222-4222-8222-7b1b7b1b8003';

-- OTHER (5309)
SET @REF_INTL_THY_INTL      := '7b1b1009-2222-4222-8222-7b1b7b1b9001';
SET @REF_INTL_ASELSAN_INTL  := '7b1b1009-2222-4222-8222-7b1b7b1b9002';
SET @REF_INTL_VESTEL_INTL   := '7b1b1009-2222-4222-8222-7b1b7b1b9003';

-- ============================
-- INSERT REFERENCES (base)
-- ============================
INSERT INTO `references`
(
  id, is_published, is_featured, display_order,
  featured_image, featured_image_asset_id,
  website_url,
  category_id, sub_category_id,
  created_at, updated_at
)
VALUES
  -- POWER (5301)
  (@REF_INTL_ENKA_ENERGY,   1, 1, 1101,
   'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.enka.com', @CAT_INTL, @SC_INTL_POWER, NOW(3), NOW(3)),
  (@REF_INTL_TEKFEN_ENERGY, 1, 0, 1102,
   'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.tekfen.com.tr', @CAT_INTL, @SC_INTL_POWER, NOW(3), NOW(3)),
  (@REF_INTL_CALIK_ENERGY,  1, 0, 1103,
   'https://images.unsplash.com/photo-1487875961445-47a00398c267?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.calikenerji.com', @CAT_INTL, @SC_INTL_POWER, NOW(3), NOW(3)),

  -- PETRO/CHEM (5302)
  (@REF_INTL_SISECAM_INTL,  1, 1, 1201,
   'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.sisecam.com', @CAT_INTL, @SC_INTL_PETRO, NOW(3), NOW(3)),
  (@REF_INTL_SASA_INTL,     1, 0, 1202,
   'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.sasa.com.tr', @CAT_INTL, @SC_INTL_PETRO, NOW(3), NOW(3)),
  (@REF_INTL_PETKIM_INTL,   1, 0, 1203,
   'https://images.unsplash.com/photo-1581092919535-7146c1f6df2e?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.petkim.com.tr', @CAT_INTL, @SC_INTL_PETRO, NOW(3), NOW(3)),

  -- CEMENT/MINING (5303)
  (@REF_INTL_OYAKC_INTL,    1, 1, 1301,
   'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.oyakcimento.com', @CAT_INTL, @SC_INTL_CEMENT, NOW(3), NOW(3)),
  (@REF_INTL_LIMAKC_INTL,   1, 0, 1302,
   'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.limak.com.tr', @CAT_INTL, @SC_INTL_CEMENT, NOW(3), NOW(3)),
  (@REF_INTL_AKCANSA_INTL,  1, 0, 1303,
   'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.akcansa.com.tr', @CAT_INTL, @SC_INTL_CEMENT, NOW(3), NOW(3)),

  -- FOOD/BEV (5304)
  (@REF_INTL_ULKER_INTL,    1, 1, 1401,
   'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.ulker.com.tr', @CAT_INTL, @SC_INTL_FOOD, NOW(3), NOW(3)),
  (@REF_INTL_ETI_INTL,      1, 0, 1402,
   'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.etietieti.com', @CAT_INTL, @SC_INTL_FOOD, NOW(3), NOW(3)),
  (@REF_INTL_SUTAS_INTL,    1, 0, 1403,
   'https://images.unsplash.com/photo-1524594157365-5a4d7d2b3a7b?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.sutas.com.tr', @CAT_INTL, @SC_INTL_FOOD, NOW(3), NOW(3)),

  -- STEEL/METAL (5305)
  (@REF_INTL_ERDEMIR_INTL,  1, 1, 1501,
   'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.erdemir.com.tr', @CAT_INTL, @SC_INTL_STEEL, NOW(3), NOW(3)),
  (@REF_INTL_TOSYALI_INTL,  1, 0, 1502,
   'https://images.unsplash.com/photo-1589792923962-537704632910?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.tosyali.com.tr', @CAT_INTL, @SC_INTL_STEEL, NOW(3), NOW(3)),
  (@REF_INTL_ISDEMIR_INTL,  1, 0, 1503,
   'https://images.unsplash.com/photo-1581091215367-59ab6d79d6f5?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.isdemir.com.tr', @CAT_INTL, @SC_INTL_STEEL, NOW(3), NOW(3)),

  -- AUTO (5306)
  (@REF_INTL_FORD_INTL,     1, 1, 1601,
   'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.fordotosan.com.tr', @CAT_INTL, @SC_INTL_AUTO, NOW(3), NOW(3)),
  (@REF_INTL_TOFAS_INTL,    1, 0, 1602,
   'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.tofas.com.tr', @CAT_INTL, @SC_INTL_AUTO, NOW(3), NOW(3)),
  (@REF_INTL_ARCELIK_INTL,  1, 0, 1603,
   'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.arcelikglobal.com', @CAT_INTL, @SC_INTL_AUTO, NOW(3), NOW(3)),

  -- MALL/COMMERCIAL (5307)
  (@REF_INTL_RENESANS_INTL, 1, 1, 1701,
   'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.renesans.com', @CAT_INTL, @SC_INTL_MALL, NOW(3), NOW(3)),
  (@REF_INTL_ENKA_CONS_INTL,1, 0, 1702,
   'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.enka.com', @CAT_INTL, @SC_INTL_MALL, NOW(3), NOW(3)),
  (@REF_INTL_TAV_INTL,      1, 0, 1703,
   'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.tavhavalimanlari.com.tr', @CAT_INTL, @SC_INTL_MALL, NOW(3), NOW(3)),

  -- DC/HOSP (5308)
  (@REF_INTL_TURKCELL_INTL, 1, 1, 1801,
   'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.turkcell.com.tr', @CAT_INTL, @SC_INTL_DC_HOSP, NOW(3), NOW(3)),
  (@REF_INTL_TT_INTL,       1, 0, 1802,
   'https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.turktelekom.com.tr', @CAT_INTL, @SC_INTL_DC_HOSP, NOW(3), NOW(3)),
  (@REF_INTL_ACIB_INTL,     1, 0, 1803,
   'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.acibadem.com.tr', @CAT_INTL, @SC_INTL_DC_HOSP, NOW(3), NOW(3)),

  -- OTHER (5309)
  (@REF_INTL_THY_INTL,      1, 1, 1901,
   'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.turkishairlines.com', @CAT_INTL, @SC_INTL_OTHER, NOW(3), NOW(3)),
  (@REF_INTL_ASELSAN_INTL,  1, 0, 1902,
   'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.aselsan.com.tr', @CAT_INTL, @SC_INTL_OTHER, NOW(3), NOW(3)),
  (@REF_INTL_VESTEL_INTL,   1, 0, 1903,
   'https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=1600&h=900&q=80', NULL,
   'https://www.vestel.com.tr', @CAT_INTL, @SC_INTL_OTHER, NOW(3), NOW(3))

ON DUPLICATE KEY UPDATE
  is_published            = VALUES(is_published),
  is_featured             = VALUES(is_featured),
  display_order           = VALUES(display_order),
  featured_image          = VALUES(featured_image),
  featured_image_asset_id = VALUES(featured_image_asset_id),
  website_url             = VALUES(website_url),
  category_id             = VALUES(category_id),
  sub_category_id         = VALUES(sub_category_id),
  updated_at              = VALUES(updated_at);

COMMIT;
