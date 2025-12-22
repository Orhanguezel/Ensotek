-- =============================================================
-- FILE: 011.1_catalog_categories_de.sql
-- CATEGORY I18N (DE) extension for existing 011_catalog_categories.sql
-- Not: categories(base) aynı kalır, burada sadece category_i18n 'de' eklenir
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

INSERT INTO category_i18n
(
  category_id,
  locale,
  name,
  slug,
  description,
  alt
)
VALUES
  -- ==========================================================
  -- PRODUCT modülü – Kühl­türme Lösungen (DE)
  -- ==========================================================
  ('aaaa0001-1111-4111-8111-aaaaaaaa0001', 'de',
    'KÜHLTÜRME', 'kuehltuerme',
    NULL, NULL
  ),
  ('aaaa0002-1111-4111-8111-aaaaaaaa0002', 'de',
    'OFFENE KREISLAUF-KÜHLTÜRME', 'offene-kreislauf-kuehltuerme',
    NULL, NULL
  ),
  ('aaaa0003-1111-4111-8111-aaaaaaaa0003', 'de',
    'GESCHLOSSENE KREISLAUF-KÜHLTÜRME', 'geschlossene-kreislauf-kuehltuerme',
    NULL, NULL
  ),
  ('aaaa0004-1111-4111-8111-aaaaaaaa0004', 'de',
    'HYBRID-KÜHLSYSTEME', 'hybrid-kuehlsysteme',
    NULL, NULL
  ),
  ('aaaa0005-1111-4111-8111-aaaaaaaa0005', 'de',
    'WÄRMEÜBERTRAGUNGS-LÖSUNGEN', 'waermeuebertragungs-loesungen',
    NULL, NULL
  ),

  -- ==========================================================
  -- SPAREPART modülü – Ersatzteile (DE)
  -- ==========================================================
  ('aaaa1001-1111-4111-8111-aaaaaaaa1001', 'de',
    'ERSATZTEILE FÜR KÜHLTÜRME', 'ersatzteile-fuer-kuehltuerme',
    NULL, NULL
  ),

  -- =====================
  -- NEWS modülü (DE)
  -- =====================
  ('aaaa2001-1111-4111-8111-aaaaaaaa2001', 'de',
    'ALLGEMEINE NEWS', 'allgemeine-news',
    NULL, NULL
  ),
  ('aaaa2002-1111-4111-8111-aaaaaaaa2002', 'de',
    'UNTERNEHMENSNEWS', 'unternehmensnews',
    NULL, NULL
  ),
  ('aaaa2003-1111-4111-8111-aaaaaaaa2003', 'de',
    'ANKÜNDIGUNGEN', 'ankuendigungen',
    NULL, NULL
  ),
  ('aaaa2004-1111-4111-8111-aaaaaaaa2004', 'de',
    'ENSOTEK IN DEN MEDIEN', 'ensotek-in-den-medien',
    NULL, NULL
  ),

  -- =====================
  -- BLOG modülü (DE)
  -- =====================
  ('aaaa3001-1111-4111-8111-aaaaaaaa3001', 'de',
    'ALLGEMEINE BLOGBEITRÄGE', 'allgemeine-blogbeitraege',
    NULL, NULL
  ),
  ('aaaa3002-1111-4111-8111-aaaaaaaa3002', 'de',
    'TECHNISCHE ARTIKEL', 'technische-artikel',
    NULL, NULL
  ),
  ('aaaa3003-1111-4111-8111-aaaaaaaa3003', 'de',
    'BRANCHENARTIKEL', 'branchenartikel',
    NULL, NULL
  ),
  ('aaaa3004-1111-4111-8111-aaaaaaaa3004', 'de',
    'ENERGIEEFFIZIENZ & ALLGEMEINE ARTIKEL', 'energieeffizienz-allgemeine-artikel',
    NULL, NULL
  ),

  -- =====================
  -- SLIDER modülü (DE)
  -- =====================
  ('aaaa4001-1111-4111-8111-aaaaaaaa4001', 'de',
    'HAUPTSLIDER', 'hauptslider',
    NULL, NULL
  ),

  -- =====================
  -- REFERENCES modülü (DE)
  -- =====================
  ('aaaa5001-1111-4111-8111-aaaaaaaa5001', 'de',
    'REFERENZEN', 'referenzen',
    NULL, NULL
  ),
  ('aaaa5002-1111-4111-8111-aaaaaaaa5002', 'de',
    'KRAFTWERKE', 'kraftwerke',
    NULL, NULL
  ),
  ('aaaa5003-1111-4111-8111-aaaaaaaa5003', 'de',
    'PETROCHEMIE & CHEMIEANLAGEN', 'petrochemie-chemieanlagen',
    NULL, NULL
  ),
  ('aaaa5004-1111-4111-8111-aaaaaaaa5004', 'de',
    'ZEMENT & BERGBAU', 'zement-bergbau',
    NULL, NULL
  ),
  ('aaaa5005-1111-4111-8111-aaaaaaaa5005', 'de',
    'LEBENSMITTEL- & GETRÄNKEANLAGEN', 'lebensmittel-getraenkeanlagen',
    NULL, NULL
  ),
  ('aaaa5006-1111-4111-8111-aaaaaaaa5006', 'de',
    'STAHL- & METALLINDUSTRIE', 'stahl-metallindustrie',
    NULL, NULL
  ),
  ('aaaa5007-1111-4111-8111-aaaaaaaa5007', 'de',
    'AUTOMOBIL- & ZULIEFERINDUSTRIE', 'automobil-zulieferindustrie',
    NULL, NULL
  ),
  ('aaaa5008-1111-4111-8111-aaaaaaaa5008', 'de',
    'EINKAUFSZENTREN & GEWERBEGEBÄUDE', 'einkaufszentren-gewerbegebaeude',
    NULL, NULL
  ),
  ('aaaa5009-1111-4111-8111-aaaaaaaa5009', 'de',
    'RECHENZENTREN & KRANKENHÄUSER', 'rechenzentren-krankenhaeuser',
    NULL, NULL
  ),
  ('aaaa5010-1111-4111-8111-aaaaaaaa5010', 'de',
    'SONSTIGE PROJEKTE', 'sonstige-projekte',
    NULL, NULL
  ),

  -- =====================
  -- LIBRARY modülü (DE)
  -- =====================
  ('aaaa6001-1111-4111-8111-aaaaaaaa6001', 'de',
    'DOKUMENTENBIBLIOTHEK', 'dokumentenbibliothek',
    NULL, NULL
  ),

  -- =====================
  -- ABOUT modülü (DE)
  -- =====================
  ('aaaa7001-1111-4111-8111-aaaaaaaa7001', 'de',
    'UNTERNEHMEN', 'unternehmen',
    NULL, NULL
  ),
  ('aaaa7002-1111-4111-8111-aaaaaaaa7002', 'de',
    'ÜBER UNS', 'ueber-uns',
    NULL, NULL
  ),
  ('aaaa7003-1111-4111-8111-aaaaaaaa7003', 'de',
    'UNSERE MISSION', 'unsere-mission',
    NULL, NULL
  ),
  ('aaaa7004-1111-4111-8111-aaaaaaaa7004', 'de',
    'UNSERE VISION', 'unsere-vision',
    NULL, NULL
  ),

  -- =====================
  -- SERVICES modülü (DE)
  -- =====================
  ('aaaa8001-1111-4111-8111-aaaaaaaa8001', 'de',
    'DIENSTLEISTUNGEN', 'dienstleistungen',
    'Ensotek bietet Produktion, Wartung und Reparatur, Modernisierung, Ersatzteile, Anwendungen und Engineering-Support für industrielle Kühltürme.',
    NULL
  ),

  -- =====================
  -- FAQ modülü (DE)
  -- =====================
  ('aaaa9001-1111-4111-8111-aaaaaaaa9001', 'de',
    'HÄUFIG GESTELLTE FRAGEN', 'haeufig-gestellte-fragen',
    NULL, NULL
  ),

  -- =====================
  -- TEAM modülü (DE)
  -- =====================
  ('aaaa9101-1111-4111-8111-aaaaaaaa9101', 'de',
    'UNSER TEAM', 'unser-team',
    'Unser Expertenteam bei Ensotek besteht aus Fachkräften aus Engineering, Projektleitung, Außendienst und Service.',
    NULL
  )
ON DUPLICATE KEY UPDATE
  name        = VALUES(name),
  slug        = VALUES(slug),
  description = VALUES(description),
  alt         = VALUES(alt);

COMMIT;
