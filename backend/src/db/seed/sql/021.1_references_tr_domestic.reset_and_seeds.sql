-- =============================================================
-- 021.1_references_tr_domestic.reset_and_seeds.sql
-- Reset + seed (TR / Domestic) - 9 sub_category x 5 = 45 refs
-- Depends: 020_references.schema.sql + categories/sub_categories seeds
-- Notes:
--  - DB zaten sıfırlandığı için DELETE/UPSERT yok
--  - Tüm IDs CHAR(36) uyumlu (8-4-4-4-12)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

-- ----------------------------
-- CATEGORY / SUBCATS (Domestic)
-- ----------------------------
SET @CAT_DOMESTIC := 'aaaa5002-1111-4111-8111-aaaaaaaa5002';

SET @SC_POWER   := 'bbbb5201-1111-4111-8111-bbbbbbbb5201';
SET @SC_PETRO   := 'bbbb5202-1111-4111-8111-bbbbbbbb5202';
SET @SC_CEMENT  := 'bbbb5203-1111-4111-8111-bbbbbbbb5203';
SET @SC_FOOD    := 'bbbb5204-1111-4111-8111-bbbbbbbb5204';
SET @SC_STEEL   := 'bbbb5205-1111-4111-8111-bbbbbbbb5205';
SET @SC_AUTO    := 'bbbb5206-1111-4111-8111-bbbbbbbb5206';
SET @SC_MALL    := 'bbbb5207-1111-4111-8111-bbbbbbbb5207';
SET @SC_DC_HOSP := 'bbbb5208-1111-4111-8111-bbbbbbbb5208';
SET @SC_OTHER   := 'bbbb5209-1111-4111-8111-bbbbbbbb5209';

-- =============================================================
-- STABLE IDs (CHAR(36) safe)
-- Pattern: 7b1b<subcat>-<idx>-4222-8222-<12chars>
-- Example: POWER (5201) idx01 => 7b1b5201-0001-4222-8222-520100000001
-- =============================================================

-- POWER (5201)
SET @R5201_01 := '7b1b5201-0001-4222-8222-520100000001'; -- Enerjisa
SET @R5201_02 := '7b1b5201-0002-4222-8222-520100000002'; -- Aksa Enerji
SET @R5201_03 := '7b1b5201-0003-4222-8222-520100000003'; -- Zorlu Enerji
SET @R5201_04 := '7b1b5201-0004-4222-8222-520100000004'; -- Enerjisa Üretim
SET @R5201_05 := '7b1b5201-0005-4222-8222-520100000005'; -- Limak (corporate)

-- PETRO/CHEM (5202)
SET @R5202_01 := '7b1b5202-0001-4222-8222-520200000001'; -- Tüpraş
SET @R5202_02 := '7b1b5202-0002-4222-8222-520200000002'; -- Petkim
SET @R5202_03 := '7b1b5202-0003-4222-8222-520200000003'; -- SASA
SET @R5202_04 := '7b1b5202-0004-4222-8222-520200000004'; -- Aygaz
SET @R5202_05 := '7b1b5202-0005-4222-8222-520200000005'; -- SOCAR Turkey

-- CEMENT/MINING (5203)
SET @R5203_01 := '7b1b5203-0001-4222-8222-520300000001'; -- OYAK Çimento
SET @R5203_02 := '7b1b5203-0002-4222-8222-520300000002'; -- Akçansa
SET @R5203_03 := '7b1b5203-0003-4222-8222-520300000003'; -- Limak Çimento
SET @R5203_04 := '7b1b5203-0004-4222-8222-520300000004'; -- Çimsa
SET @R5203_05 := '7b1b5203-0005-4222-8222-520300000005'; -- Nuh Çimento

-- FOOD/BEV (5204)
SET @R5204_01 := '7b1b5204-0001-4222-8222-520400000001'; -- Ülker
SET @R5204_02 := '7b1b5204-0002-4222-8222-520400000002'; -- Eti
SET @R5204_03 := '7b1b5204-0003-4222-8222-520400000003'; -- Sütaş
SET @R5204_04 := '7b1b5204-0004-4222-8222-520400000004'; -- Pınar
SET @R5204_05 := '7b1b5204-0005-4222-8222-520400000005'; -- Anadolu Efes

-- STEEL/METAL (5205)
SET @R5205_01 := '7b1b5205-0001-4222-8222-520500000001'; -- Erdemir
SET @R5205_02 := '7b1b5205-0002-4222-8222-520500000002'; -- Tosyalı
SET @R5205_03 := '7b1b5205-0003-4222-8222-520500000003'; -- İsdemir
SET @R5205_04 := '7b1b5205-0004-4222-8222-520500000004'; -- Kardemir
SET @R5205_05 := '7b1b5205-0005-4222-8222-520500000005'; -- Çolakoğlu Metalurji

-- AUTO (5206)
SET @R5206_01 := '7b1b5206-0001-4222-8222-520600000001'; -- Ford Otosan
SET @R5206_02 := '7b1b5206-0002-4222-8222-520600000002'; -- Tofaş
SET @R5206_03 := '7b1b5206-0003-4222-8222-520600000003'; -- TOGG
SET @R5206_04 := '7b1b5206-0004-4222-8222-520600000004'; -- Oyak Renault (placeholder)
SET @R5206_05 := '7b1b5206-0005-4222-8222-520600000005'; -- Mercedes-Benz Türk

-- MALL/COMMERCIAL (5207)
SET @R5207_01 := '7b1b5207-0001-4222-8222-520700000001'; -- ECE
SET @R5207_02 := '7b1b5207-0002-4222-8222-520700000002'; -- Rönesans
SET @R5207_03 := '7b1b5207-0003-4222-8222-520700000003'; -- Zorlu Holding
SET @R5207_04 := '7b1b5207-0004-4222-8222-520700000004'; -- ENKA
SET @R5207_05 := '7b1b5207-0005-4222-8222-520700000005'; -- Tepe İnşaat

-- DC/HOSP (5208)
SET @R5208_01 := '7b1b5208-0001-4222-8222-520800000001'; -- Turkcell
SET @R5208_02 := '7b1b5208-0002-4222-8222-520800000002'; -- Türk Telekom
SET @R5208_03 := '7b1b5208-0003-4222-8222-520800000003'; -- Acıbadem
SET @R5208_04 := '7b1b5208-0004-4222-8222-520800000004'; -- KoçSistem
SET @R5208_05 := '7b1b5208-0005-4222-8222-520800000005'; -- Türk Telekom (placeholder)

-- OTHER (5209)
SET @R5209_01 := '7b1b5209-0001-4222-8222-520900000001'; -- Şişecam
SET @R5209_02 := '7b1b5209-0002-4222-8222-520900000002'; -- ASELSAN
SET @R5209_03 := '7b1b5209-0003-4222-8222-520900000003'; -- THY
SET @R5209_04 := '7b1b5209-0004-4222-8222-520900000004'; -- Arçelik
SET @R5209_05 := '7b1b5209-0005-4222-8222-520900000005'; -- Vestel

-- =============================================================
-- INSERT BASE REFERENCES (45)
-- =============================================================
INSERT INTO `references`
(
  id, is_published, is_featured, display_order,
  featured_image, featured_image_asset_id,
  website_url,
  category_id, sub_category_id,
  created_at, updated_at
)
VALUES
  -- POWER (5201)
  (@R5201_01, 1, 1, 101, 'https://images.unsplash.com/photo-1487875961445-47a00398c267?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.enerjisa.com.tr',       @CAT_DOMESTIC, @SC_POWER,   NOW(3), NOW(3)),
  (@R5201_02, 1, 0, 102, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.aksaenerji.com.tr',    @CAT_DOMESTIC, @SC_POWER,   NOW(3), NOW(3)),
  (@R5201_03, 1, 0, 103, 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.zorluenerji.com.tr',   @CAT_DOMESTIC, @SC_POWER,   NOW(3), NOW(3)),
  (@R5201_04, 1, 0, 104, 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.enerjisauretim.com.tr',@CAT_DOMESTIC, @SC_POWER,   NOW(3), NOW(3)),
  (@R5201_05, 1, 0, 105, 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.limak.com.tr',         @CAT_DOMESTIC, @SC_POWER,   NOW(3), NOW(3)),

  -- PETRO/CHEM (5202)
  (@R5202_01, 1, 1, 201, 'https://images.unsplash.com/photo-1581092919535-7146c1f6df2e?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.tupras.com.tr',        @CAT_DOMESTIC, @SC_PETRO,   NOW(3), NOW(3)),
  (@R5202_02, 1, 0, 202, 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.petkim.com.tr',        @CAT_DOMESTIC, @SC_PETRO,   NOW(3), NOW(3)),
  (@R5202_03, 1, 0, 203, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.sasa.com.tr',          @CAT_DOMESTIC, @SC_PETRO,   NOW(3), NOW(3)),
  (@R5202_04, 1, 0, 204, 'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.aygaz.com.tr',         @CAT_DOMESTIC, @SC_PETRO,   NOW(3), NOW(3)),
  (@R5202_05, 1, 0, 205, 'https://images.unsplash.com/photo-1604908554162-45f7f4d6c0a8?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.socar.com.tr',         @CAT_DOMESTIC, @SC_PETRO,   NOW(3), NOW(3)),

  -- CEMENT/MINING (5203)
  (@R5203_01, 1, 1, 301, 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.oyakcimento.com',      @CAT_DOMESTIC, @SC_CEMENT,  NOW(3), NOW(3)),
  (@R5203_02, 1, 0, 302, 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.akcansa.com.tr',      @CAT_DOMESTIC, @SC_CEMENT,  NOW(3), NOW(3)),
  (@R5203_03, 1, 0, 303, 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.limak.com.tr',        @CAT_DOMESTIC, @SC_CEMENT,  NOW(3), NOW(3)),
  (@R5203_04, 1, 0, 304, 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.cimsa.com.tr',        @CAT_DOMESTIC, @SC_CEMENT,  NOW(3), NOW(3)),
  (@R5203_05, 1, 0, 305, 'https://images.unsplash.com/photo-1611270639973-3d7d6b5f76d2?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.nuhcimento.com.tr',  @CAT_DOMESTIC, @SC_CEMENT,  NOW(3), NOW(3)),

  -- FOOD/BEV (5204)
  (@R5204_01, 1, 1, 401, 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.ulker.com.tr',         @CAT_DOMESTIC, @SC_FOOD,    NOW(3), NOW(3)),
  (@R5204_02, 1, 0, 402, 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.etietieti.com',        @CAT_DOMESTIC, @SC_FOOD,    NOW(3), NOW(3)),
  (@R5204_03, 1, 0, 403, 'https://images.unsplash.com/photo-1524594157365-5a4d7d2b3a7b?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.sutas.com.tr',         @CAT_DOMESTIC, @SC_FOOD,    NOW(3), NOW(3)),
  (@R5204_04, 1, 0, 404, 'https://images.unsplash.com/photo-1541976844346-f18aeac57b06?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.pinar.com.tr',         @CAT_DOMESTIC, @SC_FOOD,    NOW(3), NOW(3)),
  (@R5204_05, 1, 0, 405, 'https://images.unsplash.com/photo-1514361892635-eae31c7a226f?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.anadoluefes.com',      @CAT_DOMESTIC, @SC_FOOD,    NOW(3), NOW(3)),

  -- STEEL/METAL (5205)
  (@R5205_01, 1, 1, 501, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.erdemir.com.tr',       @CAT_DOMESTIC, @SC_STEEL,   NOW(3), NOW(3)),
  (@R5205_02, 1, 0, 502, 'https://images.unsplash.com/photo-1589792923962-537704632910?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.tosyali.com.tr',       @CAT_DOMESTIC, @SC_STEEL,   NOW(3), NOW(3)),
  (@R5205_03, 1, 0, 503, 'https://images.unsplash.com/photo-1581091215367-59ab6d79d6f5?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.isdemir.com.tr',       @CAT_DOMESTIC, @SC_STEEL,   NOW(3), NOW(3)),
  (@R5205_04, 1, 0, 504, 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.kardemir.com.tr',      @CAT_DOMESTIC, @SC_STEEL,   NOW(3), NOW(3)),
  (@R5205_05, 1, 0, 505, 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.colakoglu.com.tr',    @CAT_DOMESTIC, @SC_STEEL,   NOW(3), NOW(3)),

  -- AUTO (5206)
  (@R5206_01, 1, 1, 601, 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.fordotosan.com.tr',    @CAT_DOMESTIC, @SC_AUTO,    NOW(3), NOW(3)),
  (@R5206_02, 1, 0, 602, 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.tofas.com.tr',         @CAT_DOMESTIC, @SC_AUTO,    NOW(3), NOW(3)),
  (@R5206_03, 1, 0, 603, 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.togg.com.tr',          @CAT_DOMESTIC, @SC_AUTO,    NOW(3), NOW(3)),
  (@R5206_04, 1, 0, 604, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.oyak.com.tr',          @CAT_DOMESTIC, @SC_AUTO,    NOW(3), NOW(3)),
  (@R5206_05, 1, 0, 605, 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.mercedes-benz.com.tr', @CAT_DOMESTIC, @SC_AUTO,    NOW(3), NOW(3)),

  -- MALL/COMMERCIAL (5207)
  (@R5207_01, 1, 1, 701, 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.ece.com',              @CAT_DOMESTIC, @SC_MALL,    NOW(3), NOW(3)),
  (@R5207_02, 1, 0, 702, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.renesans.com',         @CAT_DOMESTIC, @SC_MALL,    NOW(3), NOW(3)),
  (@R5207_03, 1, 0, 703, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.zorlu.com.tr',         @CAT_DOMESTIC, @SC_MALL,    NOW(3), NOW(3)),
  (@R5207_04, 1, 0, 704, 'https://images.unsplash.com/photo-1523419409543-a5e549c1faa0?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.enka.com',             @CAT_DOMESTIC, @SC_MALL,    NOW(3), NOW(3)),
  (@R5207_05, 1, 0, 705, 'https://images.unsplash.com/photo-1486326658981-ed68abe5868e?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.tepeinsaat.com.tr',    @CAT_DOMESTIC, @SC_MALL,    NOW(3), NOW(3)),

  -- DC/HOSP (5208)
  (@R5208_01, 1, 1, 801, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.turkcell.com.tr',        @CAT_DOMESTIC, @SC_DC_HOSP, NOW(3), NOW(3)),
  (@R5208_02, 1, 0, 802, 'https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.turktelekom.com.tr',   @CAT_DOMESTIC, @SC_DC_HOSP, NOW(3), NOW(3)),
  (@R5208_03, 1, 0, 803, 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.acibadem.com.tr',      @CAT_DOMESTIC, @SC_DC_HOSP, NOW(3), NOW(3)),
  (@R5208_04, 1, 0, 804, 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.kocsistem.com.tr',     @CAT_DOMESTIC, @SC_DC_HOSP, NOW(3), NOW(3)),
  (@R5208_05, 1, 0, 805, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.turktelekom.com.tr',   @CAT_DOMESTIC, @SC_DC_HOSP, NOW(3), NOW(3)),

  -- OTHER (5209)
  (@R5209_01, 1, 1, 901, 'https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.sisecam.com.tr',        @CAT_DOMESTIC, @SC_OTHER,   NOW(3), NOW(3)),
  (@R5209_02, 1, 0, 902, 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.aselsan.com.tr',       @CAT_DOMESTIC, @SC_OTHER,   NOW(3), NOW(3)),
  (@R5209_03, 1, 0, 903, 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.turkishairlines.com',  @CAT_DOMESTIC, @SC_OTHER,   NOW(3), NOW(3)),
  (@R5209_04, 1, 0, 904, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.arcelik.com.tr',       @CAT_DOMESTIC, @SC_OTHER,   NOW(3), NOW(3)),
  (@R5209_05, 1, 0, 905, 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1600&h=900&q=80', NULL, 'https://www.vestel.com.tr',        @CAT_DOMESTIC, @SC_OTHER,   NOW(3), NOW(3));

COMMIT;
