-- =============================================================
-- FILE: 055_custom_pages_solutions.seed.sql (FINAL)
-- Ensotek Çözümler Sayfası – Solutions (Landing)
-- ✅ module_key PARENT: custom_pages.module_key = 'solutions'
-- ✅ categories + sub_categories ile ilişkili (SOLUTIONS)
-- - category_id: aaaa1501-... (ÇÖZÜMLER / Solutions / Lösungen)
-- - sub_category_id: bbbb2001-... (Industrial Cooling Solutions) [landing placeholder]
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------
-- SABİT SAYFA ID (custom_pages.id)
-- -------------------------------------------------------------
SET @PAGE_SOLUTIONS := '11111111-2222-3333-4444-555555555590';

-- -------------------------------------------------------------
-- PARENT MODULE KEY
-- -------------------------------------------------------------
SET @MODULE_KEY := 'solutions';

-- -------------------------------------------------------------
-- KATEGORİ & ALT KATEGORİ (SOLUTIONS)
-- -------------------------------------------------------------
-- Category base id (categories.id)
SET @CAT_SOLUTIONS_ROOT := 'aaaa1501-1111-4111-8111-aaaaaaaa1501';

-- Sub-category base id (sub_categories.id)
-- Landing için şimdilik Endüstriyel Soğutma Çözümleri seçildi (sen değiştirebilirsin)
SET @SUB_SOLUTIONS_PAGE := 'bbbb2001-1111-4111-8111-bbbbbbbb2001';

-- -------------------------------------------------------------
-- GÖRSEL URL’LERİ
-- -------------------------------------------------------------
SET @IMG_SOLUTIONS_MAIN :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752786288/uploads/metahub/about-images/closed-circuit-water-cooling-towers1-1752786287184-840184158.webp';
SET @IMG_SOLUTIONS_2 :=
  'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&q=80';
SET @IMG_SOLUTIONS_3 :=
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80';

-- -------------------------------------------------------------
-- PARENT UPSERT (custom_pages)
-- -------------------------------------------------------------
INSERT INTO `custom_pages`
  (`id`,
   `module_key`,
   `is_published`,
   `display_order`,
   `order_num`,
   `featured_image`,
   `featured_image_asset_id`,
   `image_url`,
   `storage_asset_id`,
   `images`,
   `storage_image_ids`,
   `category_id`,
   `sub_category_id`,
   `created_at`,
   `updated_at`)
VALUES
  (
    @PAGE_SOLUTIONS,
    @MODULE_KEY,
    1,
    40,
    40,
    @IMG_SOLUTIONS_MAIN,
    NULL,
    @IMG_SOLUTIONS_MAIN,
    NULL,
    JSON_ARRAY(
      @IMG_SOLUTIONS_MAIN,
      @IMG_SOLUTIONS_2,
      @IMG_SOLUTIONS_3
    ),
    JSON_ARRAY(),
    @CAT_SOLUTIONS_ROOT,
    @SUB_SOLUTIONS_PAGE,
    NOW(3),
    NOW(3)
  )
ON DUPLICATE KEY UPDATE
  `module_key`               = VALUES(`module_key`),
  `is_published`             = VALUES(`is_published`),
  `display_order`            = VALUES(`display_order`),
  `order_num`                = VALUES(`order_num`),
  `featured_image`           = VALUES(`featured_image`),
  `featured_image_asset_id`  = VALUES(`featured_image_asset_id`),
  `image_url`                = VALUES(`image_url`),
  `storage_asset_id`         = VALUES(`storage_asset_id`),
  `images`                   = VALUES(`images`),
  `storage_image_ids`        = VALUES(`storage_image_ids`),
  `category_id`              = VALUES(`category_id`),
  `sub_category_id`          = VALUES(`sub_category_id`),
  `updated_at`               = VALUES(`updated_at`);

-- -------------------------------------------------------------
-- I18N UPSERT – TR / EN / DE
-- ✅ module_key kolonu YOK
-- Content: Ensotek katalog (counter-flow induced draft, open/closed circuit,
-- material properties, components, fill selection logic)
-- -------------------------------------------------------------
INSERT INTO `custom_pages_i18n`
  (`id`,
   `page_id`,
   `locale`,
   `title`,
   `slug`,
   `content`,
   `summary`,
   `featured_image_alt`,
   `meta_title`,
   `meta_description`,
   `tags`,
   `created_at`,
   `updated_at`)
VALUES

-- =============================================================
-- TR
-- =============================================================
(
  UUID(),
  @PAGE_SOLUTIONS,
  'tr',
  'Çözümler',
  'cozumler',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Ensotek su soğutma kuleleri; <strong>cebri çekişli (induced draft), karşı akışlı (counter-flow)</strong> kule prensibiyle, işletmeden gelen sıcak suyu üstten alta homojen dağıtarak soğutur. ',
      'Dış ortam havası yan hava giriş panjurlarından emilir; ısı ve nem yükünü alarak fan bacasından atmosfere atılır ve soğumuş su kule alt havuzunda toplanır.</p>',

      '<p>Modüler tasarım sayesinde kuleler, kurulum sonrası ihtiyaç halinde kaldırılıp taşınabilecek yapıda kurgulanır. ',
      'Malzeme uyumu ve korozyon dayanımı (CTP/FRP, PVC, PP, paslanmaz bağlantılar vb.) uzun ömür ve düşük işletme/bakım maliyeti sağlar.</p>',

      '<h2>Çözüm Başlıkları</h2>',
      '<ul>',
        '<li><strong>Endüstriyel Soğutma:</strong> Üretim tesisleri, enerji santralleri ve ağır çalışma koşulları için yüksek verimli kule çözümleri.</li>',
        '<li><strong>HVAC Soğutma:</strong> Ticari binalar, AVM ve otel uygulamalarında stabil yaklaşım sıcaklığı ve enerji optimizasyonu.</li>',
        '<li><strong>Proses Soğutma:</strong> Su kalitesinin kritik olduğu proseslerde açık/kapalı devre kule seçimi ve yardımcı ekipmanlar.</li>',
      '</ul>',

      '<h2>Açık Devre ve Kapalı Devre Seçimi</h2>',
      '<p><strong>Açık devre kuleler</strong>, yüksek ısı transferi ve geniş kapasite aralığıyla yaygın uygulama alanına sahiptir. ',
      '<strong>Kapalı devre kuleler</strong> ise proses suyunun kirliliğe hassas olduğu uygulamalarda tercih edilir; proses suyu kule içerisindeki serpantinlerden geçerken soğutulur ve daha temiz/kararlı işletme hedeflenir.</p>',

      '<h2>Enerji ve Performans Yaklaşımı</h2>',
      '<p>Cebri çekişli kulelerde fanın tükettiği enerji, alttan itmeli (forced draft) çözümlere kıyasla daha düşüktür; ',
      'nemli havanın üstten yüksek hızla atılması resirkülasyon riskini azaltır ve performansı korur. Bu nedenle cebri çekişli tasarım, alttan itmeli kulelere göre yaklaşık <strong>1,5 – 2 kat</strong> enerji tasarrufu sağlayabilir.</p>',

      '<h2>Malzeme ve Bileşen Standardımız</h2>',
      '<ul>',
        '<li><strong>Kule gövdesi:</strong> CTP/FRP sandviç panel, kaburga takviyeli; ihtiyaç halinde izoftalik/vinilester ve alev iletmez üretim opsiyonu.</li>',
        '<li><strong>Dış yüzey:</strong> UV/kimyasal/korozyona dayanıklı, boyasız jel-coat.</li>',
        '<li><strong>Taşıyıcı sistem:</strong> Pultruzyon CTP profiller; merdiven ve yürüyüş platformlarıyla birlikte.</li>',
        '<li><strong>Fan grubu:</strong> Aksiyal fan; fan çevre hızları <strong>52–60 m/s</strong> aralığında.</li>',
        '<li><strong>Motor/Redüktör:</strong> IP56 koruma, F sınıfı izolasyon, V1 konumunda düşey flanşlı tip; fan çapına göre motor veya motor+redüktör.</li>',
        '<li><strong>Su dağıtım sistemi:</strong> PVC / PP / CTP; yaklaşık <strong>55°C</strong> altı PVC, üzeri PP/CTP tercihleri.</li>',
        '<li><strong>Dolgu seçimi:</strong> Temiz sularda PVC film dolgu (maks. ~55°C), yüksek sıcaklıkta (~100°C) PP bigudi dolgu; çok kirli sularda sıçratma tipi grid dolgu.</li>',
      '</ul>',

      '<h2>Keşif ve Teklif</h2>',
      '<p>Isı yükü, çevresel koşullar, su kimyası, yerleşim kısıtları ve bakım erişimi gibi kriterleri değerlendirerek doğru kule tipini ve konfigürasyonu belirliyoruz. ',
      'Projeniz için teklif talep edebilir veya hizmetlerimiz (bakım, modernizasyon/retrofit, devreye alma) ile uçtan uca destek alabilirsiniz.</p>',

      '<p><a href=\"/offer\"><strong>Teklif Al</strong></a> veya <a href=\"/services\"><strong>Hizmetlerimizi İncele</strong></a>.</p>'
    )
  ),
  'Açık/kapalı devre kule çözümleri, cebri çekişli karşı akış prensibi, malzeme-bileşen standardı, dolgu seçimi ve keşif/teklif yaklaşımı özetlenir.',
  'Ensotek su soğutma kulesi çözümleri',
  'Çözümler | Ensotek',
  'Ensotek; cebri çekişli karşı akışlı açık/kapalı devre su soğutma kulesi çözümleri, malzeme-bileşen standardı ve dolgu seçimiyle prosesinize uygun mühendislik sunar.',
  'ensotek,cozumler,su sogutma kulesi,acik devre,kapali devre,cebri cekisli,karsi akis,frp,cti,retrofit',
  NOW(3),
  NOW(3)
),

-- =============================================================
-- EN
-- =============================================================
(
  UUID(),
  @PAGE_SOLUTIONS,
  'en',
  'Solutions',
  'solutions',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Ensotek cooling towers operate on an <strong>induced draft, counter-flow</strong> principle. ',
      'Hot water from the facility is distributed from top to bottom across the tower cross-section, while ambient air is drawn in through side louvers, absorbs heat and moisture, and is discharged through the fan stack. ',
      'Cooled water is collected in the basin at the bottom.</p>',

      '<p>Thanks to the modular design, towers can be lifted and relocated when required. ',
      'Material compatibility and corrosion resistance (FRP/CTP, PVC, PP, stainless fasteners, etc.) support long service life and reduced operating/maintenance costs.</p>',

      '<h2>Solution Areas</h2>',
      '<ul>',
        '<li><strong>Industrial Cooling:</strong> High-efficiency tower solutions for manufacturing plants, power generation and demanding operating environments.</li>',
        '<li><strong>HVAC Cooling:</strong> Stable approach temperature and energy optimization for commercial buildings, shopping malls and hotels.</li>',
        '<li><strong>Process Cooling:</strong> Open/closed circuit selection and auxiliary components for processes where water quality is critical.</li>',
      '</ul>',

      '<h2>Open vs. Closed Circuit Selection</h2>',
      '<p><strong>Open circuit towers</strong> are widely used due to high heat transfer and broad capacity range. ',
      '<strong>Closed circuit towers</strong> are preferred when the process fluid must remain clean: the process water is cooled through coil pipes, reducing contamination risk and improving operational stability.</p>',

      '<h2>Energy and Performance</h2>',
      '<p>In induced draft towers, fan power consumption is generally lower than forced draft alternatives. ',
      'Because humid air exits at higher velocity from the top, recirculation risk is reduced and performance is preserved. ',
      'Therefore, induced draft designs can provide approximately <strong>1.5–2×</strong> energy savings compared to forced draft towers (application-dependent).</p>',

      '<h2>Materials and Component Standard</h2>',
      '<ul>',
        '<li><strong>Tower body:</strong> FRP/CTP sandwich panels reinforced with ribs; isophthalic/vinylester and flame-retardant options upon request.</li>',
        '<li><strong>Exterior surface:</strong> UV/chemical/corrosion resistant, paint-free gel-coat.</li>',
        '<li><strong>Structural system:</strong> FRP pultrusion profiles including service ladders and platforms.</li>',
        '<li><strong>Fan group:</strong> Axial fans; tip speed typically <strong>52–60 m/s</strong>.</li>',
        '<li><strong>Motor/Gear unit:</strong> IP56 protection, class F insulation, V1 vertical flange type; motor-only or motor+gear depending on fan diameter.</li>',
        '<li><strong>Water distribution:</strong> PVC / PP / FRP; typically PVC below ~<strong>55°C</strong>, PP/FRP for higher temperatures.</li>',
        '<li><strong>Fill selection:</strong> PVC film fills for clean water (max ~55°C), PP ring fills for high temperature (~100°C), splash grid fills for very dirty water.</li>',
      '</ul>',

      '<h2>Survey and Quotation</h2>',
      '<p>We evaluate heat load, ambient conditions, water chemistry, layout constraints and maintenance access to define the optimum tower type and configuration. ',
      'Request a quotation or benefit from our services (maintenance, modernization/retrofit, commissioning) for end-to-end support.</p>',

      '<p><a href=\"/offer\"><strong>Get a Quote</strong></a> or <a href=\"/services\"><strong>Explore Our Services</strong></a>.</p>'
    )
  ),
  'Summarizes induced draft counter-flow cooling tower solutions, open/closed circuit selection, component standards, fill selection and quotation approach.',
  'Ensotek cooling tower solutions',
  'Solutions | Ensotek',
  'Ensotek delivers induced draft counter-flow open and closed circuit cooling tower solutions with robust materials, component standards and engineering-based selection.',
  'ensotek,solutions,water cooling tower,open circuit,closed circuit,induced draft,counter flow,frp,retrofit,commissioning',
  NOW(3),
  NOW(3)
),

-- =============================================================
-- DE
-- =============================================================
(
  UUID(),
  @PAGE_SOLUTIONS,
  'de',
  'Lösungen',
  'loesungen',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Ensotek Kühltürme arbeiten nach dem Prinzip <strong>Gegenstrom (counter-flow) mit Saugzug (induced draft)</strong>. ',
      'Das warme Wasser wird von oben nach unten über den Querschnitt verteilt; Umgebungsluft wird über seitliche Luftansaugjalousien angesaugt, nimmt Wärme und Feuchte auf und wird über den Ventilatorstapel abgeführt. ',
      'Das abgekühlte Wasser sammelt sich im Becken am Turmboden.</p>',

      '<p>Die modulare Bauweise ermöglicht bei Bedarf ein einfaches Anheben und Umsetzen nach der Installation. ',
      'Materialverträglichkeit und Korrosionsbeständigkeit (GFK/CTP, PVC, PP, Edelstahl-Verbindungselemente usw.) unterstützen eine lange Lebensdauer sowie geringere Betriebs- und Wartungskosten.</p>',

      '<h2>Lösungsbereiche</h2>',
      '<ul>',
        '<li><strong>Industrielle Kühllösungen:</strong> Effiziente Kühlturm-Lösungen für Produktionsanlagen, Energieerzeugung und anspruchsvolle Betriebsbedingungen.</li>',
        '<li><strong>HVAC-Kühllösungen:</strong> Stabile Approach-Temperatur und Energieoptimierung für Gewerbeobjekte, Einkaufszentren und Hotels.</li>',
        '<li><strong>Prozesskühlung:</strong> Auswahl von offen/geschlossen sowie Zusatzkomponenten für prozesskritische Wasserqualität.</li>',
      '</ul>',

      '<h2>Offener vs. geschlossener Kreislauf</h2>',
      '<p><strong>Offene Kühltürme</strong> werden häufig eingesetzt (hohe Wärmeübertragung, großer Leistungsbereich). ',
      '<strong>Geschlossene Kühltürme</strong> sind ideal, wenn das Prozessmedium sauber bleiben muss: Das Prozesswasser wird über Rohrschlangen (Serpentinen) gekühlt; Kontaminationsrisiken werden reduziert.</p>',

      '<h2>Energie und Performance</h2>',
      '<p>Bei Saugzug-Kühltürmen ist der Ventilatorenergiebedarf typischerweise geringer als bei Drucklüfter-/Forced-Draft-Lösungen. ',
      'Durch die hohe Austrittsgeschwindigkeit der feuchten Luft wird Resirkulation reduziert und die Leistung stabil gehalten. ',
      'Daher kann der Saugzug-Ansatz je nach Anwendung ca. <strong>1,5–2×</strong> Energieeinsparung gegenüber Forced-Draft ermöglichen.</p>',

      '<h2>Material- und Komponentenstandard</h2>',
      '<ul>',
        '<li><strong>Turmkörper:</strong> GFK/CTP-Sandwichpaneele mit Rippenverstärkung; isophthalische/vinylester Ausführung und flammhemmende Option bei Bedarf.</li>',
        '<li><strong>Außenoberfläche:</strong> UV-/Chemikalien-/Korrosionsbeständiger, lackfreier Gelcoat.</li>',
        '<li><strong>Tragwerk:</strong> GFK-Pultrusionsprofile inkl. Leiter- und Wartungsplattformen.</li>',
        '<li><strong>Ventilatorgruppe:</strong> Axialventilatoren; Umfangsgeschwindigkeit typischerweise <strong>52–60 m/s</strong>.</li>',
        '<li><strong>Motor/Getriebe:</strong> IP56, Isolationsklasse F, V1-Position (vertikaler Flansch); je nach Ventilatordurchmesser Motor oder Motor+Getriebe.</li>',
        '<li><strong>Wasserverteilung:</strong> PVC / PP / GFK; häufig PVC unter ~<strong>55°C</strong>, PP/GFK bei höheren Temperaturen.</li>',
        '<li><strong>Füllkörper-Auswahl:</strong> PVC-Filmfüllkörper für sauberes Wasser (max ~55°C), PP-Ringfüllkörper für hohe Temperaturen (~100°C), Splash-Grid-Füllkörper für sehr verschmutztes Wasser.</li>',
      '</ul>',

      '<h2>Auslegung, Begehung und Angebot</h2>',
      '<p>Wir bewerten Wärmelast, Umgebungsbedingungen, Wasserchemie, Platz-/Layoutrestriktionen und Wartungszugang, um Typ und Konfiguration optimal festzulegen. ',
      'Fordern Sie ein Angebot an oder nutzen Sie unsere Services (Wartung, Modernisierung/Retrofit, Inbetriebnahme) für End-to-End Support.</p>',

      '<p><a href=\"/offer\"><strong>Angebot anfordern</strong></a> oder <a href=\"/services\"><strong>Unsere Services ansehen</strong></a>.</p>'
    )
  ),
  'Zusammenfassung der Saugzug-Gegenstrom-Kühlturm-Lösungen, Auswahl offen/geschlossen, Komponentenstandard, Füllkörperlogik und Angebotsprozess.',
  'Ensotek Wasserkühlturm-Lösungen',
  'Lösungen | Ensotek',
  'Ensotek bietet Saugzug-Gegenstrom Kühlturm-Lösungen (offen/geschlossen) mit robusten Materialien, Komponentenstandard und engineering-basierter Auslegung.',
  'ensotek,loesungen,wasserkuehlturm,offen,geschlossen,saugzug,gegenstrom,gfk,retrofit,inbetriebnahme',
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`              = VALUES(`title`),
  `slug`               = VALUES(`slug`),
  `content`            = VALUES(`content`),
  `summary`            = VALUES(`summary`),
  `featured_image_alt` = VALUES(`featured_image_alt`),
  `meta_title`         = VALUES(`meta_title`),
  `meta_description`   = VALUES(`meta_description`),
  `tags`               = VALUES(`tags`),
  `updated_at`         = VALUES(`updated_at`);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
