-- =============================================================
-- 021_references_tr_companies.seeds.sql  (TR Companies / Domestic)
--  category_id = aaaa5002 (Domestic)
--  sub_category_id = bbbb5201..5209 (sectors)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

-- Domestic category
SET @CAT_DOMESTIC := 'aaaa5002-1111-4111-8111-aaaaaaaa5002';

-- Domestic sector sub_categories
SET @SC_POWER   := 'bbbb5201-1111-4111-8111-bbbbbbbb5201';
SET @SC_PETRO   := 'bbbb5202-1111-4111-8111-bbbbbbbb5202';
SET @SC_CEMENT  := 'bbbb5203-1111-4111-8111-bbbbbbbb5203';
SET @SC_FOOD    := 'bbbb5204-1111-4111-8111-bbbbbbbb5204';
SET @SC_STEEL   := 'bbbb5205-1111-4111-8111-bbbbbbbb5205';
SET @SC_AUTO    := 'bbbb5206-1111-4111-8111-bbbbbbbb5206';
SET @SC_MALL    := 'bbbb5207-1111-4111-8111-bbbbbbbb5207';
SET @SC_DC_HOSP := 'bbbb5208-1111-4111-8111-bbbbbbbb5208';
SET @SC_OTHER   := 'bbbb5209-1111-4111-8111-bbbbbbbb5209';

-- ============================
-- STABLE REFERENCE IDS (36-char UUID format)
-- ============================
-- POWER
SET @REF_TR_ENERJISA := '7b1b0001-2222-4222-8222-7b1b7b1b0001';
SET @REF_TR_AKSA     := '7b1b0001-2222-4222-8222-7b1b7b1b0002';
SET @REF_TR_ZORLU    := '7b1b0001-2222-4222-8222-7b1b7b1b0003';

-- PETRO/CHEM
SET @REF_TR_TUPRAS   := '7b1b0002-2222-4222-8222-7b1b7b1b0001';
SET @REF_TR_PETKIM   := '7b1b0002-2222-4222-8222-7b1b7b1b0002';
SET @REF_TR_SASA     := '7b1b0002-2222-4222-8222-7b1b7b1b0003';

-- CEMENT/MINING
SET @REF_TR_OYAKC    := '7b1b0003-2222-4222-8222-7b1b7b1b0001';
SET @REF_TR_AKCANSA  := '7b1b0003-2222-4222-8222-7b1b7b1b0002';
SET @REF_TR_LIMAKC   := '7b1b0003-2222-4222-8222-7b1b7b1b0003';

-- FOOD/BEV
SET @REF_TR_ULKER    := '7b1b0004-2222-4222-8222-7b1b7b1b0001';
SET @REF_TR_ETI      := '7b1b0004-2222-4222-8222-7b1b7b1b0002';
SET @REF_TR_SUTAS    := '7b1b0004-2222-4222-8222-7b1b7b1b0003';

-- STEEL/METAL
SET @REF_TR_ERDEMIR  := '7b1b0005-2222-4222-8222-7b1b7b1b0001';
SET @REF_TR_TOSYALI  := '7b1b0005-2222-4222-8222-7b1b7b1b0002';
SET @REF_TR_ISDEMIR  := '7b1b0005-2222-4222-8222-7b1b7b1b0003';

-- AUTO
SET @REF_TR_FORD     := '7b1b0006-2222-4222-8222-7b1b7b1b0001';
SET @REF_TR_TOFAS    := '7b1b0006-2222-4222-8222-7b1b7b1b0002';
SET @REF_TR_TOGG     := '7b1b0006-2222-4222-8222-7b1b7b1b0003';

-- MALL/COMMERCIAL
SET @REF_TR_ECE      := '7b1b0007-2222-4222-8222-7b1b7b1b0001';
SET @REF_TR_RENESANS := '7b1b0007-2222-4222-8222-7b1b7b1b0002';
SET @REF_TR_ZORLUC   := '7b1b0007-2222-4222-8222-7b1b7b1b0003';

-- DC/HOSP
SET @REF_TR_TURKCELL := '7b1b0008-2222-4222-8222-7b1b7b1b0001';
SET @REF_TR_TT       := '7b1b0008-2222-4222-8222-7b1b7b1b0002';
SET @REF_TR_ACIB     := '7b1b0008-2222-4222-8222-7b1b7b1b0003';

-- OTHER
SET @REF_TR_SISECAM  := '7b1b0009-2222-4222-8222-7b1b7b1b0001';
SET @REF_TR_ASelsan  := '7b1b0009-2222-4222-8222-7b1b7b1b0002';
SET @REF_TR_THY      := '7b1b0009-2222-4222-8222-7b1b7b1b0003';

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
  -- POWER
  (@REF_TR_ENERJISA, 1, 1, 101,
   'https://images.unsplash.com/photo-1487875961445-47a00398c267?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.enerjisa.com.tr',
   @CAT_DOMESTIC, @SC_POWER, NOW(3), NOW(3)),
  (@REF_TR_AKSA, 1, 0, 102,
   'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.aksaenerji.com.tr',
   @CAT_DOMESTIC, @SC_POWER, NOW(3), NOW(3)),
  (@REF_TR_ZORLU, 1, 0, 103,
   'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.zorluenerji.com.tr',
   @CAT_DOMESTIC, @SC_POWER, NOW(3), NOW(3)),

  -- PETRO/CHEM
  (@REF_TR_TUPRAS, 1, 1, 201,
   'https://images.unsplash.com/photo-1581092919535-7146c1f6df2e?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.tupras.com.tr',
   @CAT_DOMESTIC, @SC_PETRO, NOW(3), NOW(3)),
  (@REF_TR_PETKIM, 1, 0, 202,
   'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.petkim.com.tr',
   @CAT_DOMESTIC, @SC_PETRO, NOW(3), NOW(3)),
  (@REF_TR_SASA, 1, 0, 203,
   'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.sasa.com.tr',
   @CAT_DOMESTIC, @SC_PETRO, NOW(3), NOW(3)),

  -- CEMENT/MINING
  (@REF_TR_OYAKC, 1, 1, 301,
   'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.oyakcimento.com',
   @CAT_DOMESTIC, @SC_CEMENT, NOW(3), NOW(3)),
  (@REF_TR_AKCANSA, 1, 0, 302,
   'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.akcansa.com.tr',
   @CAT_DOMESTIC, @SC_CEMENT, NOW(3), NOW(3)),
  (@REF_TR_LIMAKC, 1, 0, 303,
   'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.limak.com.tr',
   @CAT_DOMESTIC, @SC_CEMENT, NOW(3), NOW(3)),

  -- FOOD/BEV
  (@REF_TR_ULKER, 1, 1, 401,
   'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.ulker.com.tr',
   @CAT_DOMESTIC, @SC_FOOD, NOW(3), NOW(3)),
  (@REF_TR_ETI, 1, 0, 402,
   'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.etietieti.com', -- gerektiğinde düzelt
   @CAT_DOMESTIC, @SC_FOOD, NOW(3), NOW(3)),
  (@REF_TR_SUTAS, 1, 0, 403,
   'https://images.unsplash.com/photo-1524594157365-5a4d7d2b3a7b?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.sutas.com.tr',
   @CAT_DOMESTIC, @SC_FOOD, NOW(3), NOW(3)),

  -- STEEL/METAL
  (@REF_TR_ERDEMIR, 1, 1, 501,
   'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.erdemir.com.tr',
   @CAT_DOMESTIC, @SC_STEEL, NOW(3), NOW(3)),
  (@REF_TR_TOSYALI, 1, 0, 502,
   'https://images.unsplash.com/photo-1589792923962-537704632910?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.tosyali.com.tr',
   @CAT_DOMESTIC, @SC_STEEL, NOW(3), NOW(3)),
  (@REF_TR_ISDEMIR, 1, 0, 503,
   'https://images.unsplash.com/photo-1581091215367-59ab6d79d6f5?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.isdemir.com.tr',
   @CAT_DOMESTIC, @SC_STEEL, NOW(3), NOW(3)),

  -- AUTO
  (@REF_TR_FORD, 1, 1, 601,
   'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.fordotosan.com.tr',
   @CAT_DOMESTIC, @SC_AUTO, NOW(3), NOW(3)),
  (@REF_TR_TOFAS, 1, 0, 602,
   'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.tofas.com.tr',
   @CAT_DOMESTIC, @SC_AUTO, NOW(3), NOW(3)),
  (@REF_TR_TOGG, 1, 0, 603,
   'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.togg.com.tr',
   @CAT_DOMESTIC, @SC_AUTO, NOW(3), NOW(3)),

  -- MALL/COMMERCIAL
  (@REF_TR_ECE, 1, 1, 701,
   'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.ece.com',
   @CAT_DOMESTIC, @SC_MALL, NOW(3), NOW(3)),
  (@REF_TR_RENESANS, 1, 0, 702,
   'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.renesans.com',
   @CAT_DOMESTIC, @SC_MALL, NOW(3), NOW(3)),
  (@REF_TR_ZORLUC, 1, 0, 703,
   'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.zorlu.com.tr',
   @CAT_DOMESTIC, @SC_MALL, NOW(3), NOW(3)),

  -- DC/HOSP
  (@REF_TR_TURKCELL, 1, 1, 801,
   'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.turkcell.com.tr',
   @CAT_DOMESTIC, @SC_DC_HOSP, NOW(3), NOW(3)),
  (@REF_TR_TT, 1, 0, 802,
   'https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.turktelekom.com.tr',
   @CAT_DOMESTIC, @SC_DC_HOSP, NOW(3), NOW(3)),
  (@REF_TR_ACIB, 1, 0, 803,
   'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.acibadem.com.tr',
   @CAT_DOMESTIC, @SC_DC_HOSP, NOW(3), NOW(3)),

  -- OTHER
  (@REF_TR_SISECAM, 1, 1, 901,
   'https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.sisecam.com.tr',
   @CAT_DOMESTIC, @SC_OTHER, NOW(3), NOW(3)),
  (@REF_TR_ASelsan, 1, 0, 902,
   'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.aselsan.com.tr',
   @CAT_DOMESTIC, @SC_OTHER, NOW(3), NOW(3)),
  (@REF_TR_THY, 1, 0, 903,
   'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&h=900&q=80',
   NULL,
   'https://www.turkishairlines.com',
   @CAT_DOMESTIC, @SC_OTHER, NOW(3), NOW(3))

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
