-- =============================================================
-- 101_2_library_cooling_tower_features.sql
-- Ensotek Soğutma Kulelerimizin Özellikleri
--   - library + library_i18n (TR / EN)
--   - category: module_key='library'
--   - sub_category: slug='pdf-dokumanlar' (TR)
-- =============================================================

/* ================= KATEGORİ / ALT KATEGORİ ================= */

SET @LIB_CATEGORY_ID := (
  SELECT c.id
  FROM categories c
  WHERE c.module_key = 'library'
  LIMIT 1
);

SET @LIB_SUBCATEGORY_PDF := (
  SELECT sc.id
  FROM sub_categories sc
  JOIN sub_category_i18n sci
    ON sci.sub_category_id = sc.id
   AND sci.locale = 'tr'
   AND sci.slug   = 'pdf-dokumanlar'
  WHERE sc.category_id = @LIB_CATEGORY_ID
  LIMIT 1
);

/* ================= PARENT: library ================= */

-- Ensotek Soğutma Kulelerimizin Özellikleri
SET @LIB_CT_FEATURES_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'ensotek-sogutma-kulelerinin-ozellikleri'
  LIMIT 1
);
SET @LIB_CT_FEATURES_ID := COALESCE(@LIB_CT_FEATURES_ID, UUID());

INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json,
 category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(
  @LIB_CT_FEATURES_ID,
  1, 1, 50,
  '{
    "tr":[
      "ensotek soğutma kulesi",
      "soğutma kulesi özellikleri",
      "camelyaf takviyeli polyester",
      "ctp soğutma kulesi",
      "pvc petek dolgu",
      "pp bigudi dolgu",
      "grid dolgu",
      "enerji tasarrufu"
    ],
    "en":[
      "ensotek cooling tower",
      "cooling tower features",
      "fiberglass reinforced polyester",
      "frp cooling tower",
      "pvc film fill",
      "pp splash fill",
      "grid fill",
      "energy saving"
    ]
  }',
  @LIB_CATEGORY_ID, @LIB_SUBCATEGORY_PDF,
  'Ensotek', 0, 0,
  NOW(3), NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 is_published    = VALUES(is_published),
 is_active       = VALUES(is_active),
 display_order   = VALUES(display_order),
 tags_json       = VALUES(tags_json),
 category_id     = VALUES(category_id),
 sub_category_id = VALUES(sub_category_id),
 author          = VALUES(author),
 published_at    = VALUES(published_at),
 updated_at      = VALUES(updated_at);

/* ================= I18N: TR ================= */

INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_CT_FEATURES_ID, 'tr',
  'Ensotek Soğutma Kulelerimizin Özellikleri',
  'ensotek-sogutma-kulelerinin-ozellikleri',
  'Ensotek su soğutma kulelerinin malzeme yapısı, dolgu tipleri, enerji verimliliği ve işletme avantajlarını özetleyen teknik doküman.',
  CONCAT(
    '<h2>Ensotek Soğutma Kulelerimizin Özellikleri</h2>',
    '<ol>',
      '<li>',
        '<strong>CTP gövde yapısı:</strong> Ensotek soğutma kuleleri camelyaf takviyeli polyester (CTP) ',
        'malzemeden imal edildiğinden boyama ihtiyacı duymaz. Kule gövdesi uzun yıllar boyunca korozyona ',
        'uğramadan görünümünü ve mekanik dayanımını korur.',
      '</li>',
      '<li>',
        '<strong>Kimyasallara ve korozyona dayanıklılık:</strong> Kulelerin CTP yapısı kimyasallara ve korozyona ',
        'karşı yüksek direnç sağlar; birkaç yılda paslanıp dökülebilen metal kulelerin aksine, uzun hizmet ömrü sunar.',
      '</li>',
      '<li>',
        '<strong>Alev ilerletmeyen reçine seçeneği:</strong> Otel, hastane, AVM, rezidans gibi hassas tesislerde ',
        'alev ilerletmeyen CTP reçine kullanılarak yanıcılık minimuma indirilebilir ve yangın güvenliği artırılır.',
      '</li>',
    '</ol>',

    '<h3>Dolgu Seçenekleri</h3>',
    '<p>Ensotek soğutma kulelerinde proses suyunun temizliği ve işletme koşullarına göre üç temel dolgu tipi kullanılır:</p>',
    '<ol start="4">',
      '<li>',
        '<strong>PVC petek dolgu (film fill):</strong> ',
        'Suyun temiz olduğu (yağ, tortu, kireç ve pislikten arındırılmış) ve işletme ortamının toz ve kirden ',
        'görece arındırıldığı tesislerde PVC petek dolgu kullanılır. ',
        'Islak yüzey alanı yüksek olduğundan, soğutma performansı diğer dolgu tiplerine göre oldukça iyidir.',
      '</li>',
      '<li>',
        '<strong>PP bigudi dolgu:</strong> ',
        'Suyun kirli, yağlı, tufallı, kireçlenmeye müsait olduğu ve işletme ortamının çok tozlu olduğu tesislerde ',
        'PP (Polipropilen) malzemeden imal edilen bigudi dolgular tercih edilir. ',
        'PP malzeme, 100&nbsp;°C sıcaklığa kadar olan proses sularında dahi başarıyla kullanılabilir. ',
        'Tıkanma riski düşüktür, yeniden kullanılmak üzere temizlenmesi mümkündür ve bakımı görece kolaydır.',
      '</li>',
      '<li>',
        '<strong>PP grid (sıçratma) dolgu:</strong> ',
        'Suyun çok kirli olduğu işletmelerde yine polipropilen malzemeden sıçratma tipi grid dolgular kullanılır. ',
        'Bu tip dolgular; şeker fabrikaları, salça fabrikaları, yağ fabrikalarının vakum prosesleri ve çelikhaneler gibi ',
        'çok kirli proses suyuna sahip tesislerde tercih edilir.',
      '</li>',
    '</ol>',

    '<ol start="7">',
      '<li>',
        '<strong>Malzeme uyumu ve uzun ömür:</strong> Kulelerde kullanılan malzemeler birbiriyle uyumludur. ',
        'CTP yapı içerisinde taşıyıcı olarak metal veya ahşap malzeme bulunmaz; dayanıklılık, ',
        'yaklaşık 3&nbsp;mm kalınlıktaki ithal Coremat malzeme ile sağlanır. ',
        'Bu yapı sayesinde kulelerin 30–40 yıl hizmet vermesi mümkündür.',
      '</li>',
      '<li>',
        '<strong>Düşük bakım maliyeti:</strong> CTP gövde ve doğru seçilmiş dolgu kombinasyonları sayesinde, ',
        'Ensotek soğutma kulelerinin periyodik bakım maliyetleri klasik metal kulelere kıyasla belirgin ölçüde düşüktür.',
      '</li>',
    '</ol>',

    '<h3>Fan Konfigürasyonu ve Enerji Verimliliği</h3>',
    '<ol start="9">',
      '<li>',
        '<strong>Üstten fanlı, karşı akışlı cebri çekişli kuleler:</strong> ',
        'Ensotek kulelerinde fanlar üstte konumlandırılmıştır ve kuleler karşı akışlı cebri çekişli tiptedir. ',
        'Havayı üstten emen bu tasarımda fanın tükettiği enerji, havayı alttan iten kulelere göre daha düşüktür. ',
        'Kuleden atılan nemli havanın çıkış hızı yüksek olduğundan, nemli hava kule çevresinden hızla uzaklaşır ve ',
        'fan tarafından tekrar emilme (resirkülasyon) riski minimize edilir.',
      '</li>',
      '<li>',
        '<strong>Alttan itmeli kulelere göre enerji tasarrufu:</strong> ',
        'Alttan itmeli kulelerde, kuleden atılan nemli havanın çıkış hızı düşük ve yoğunluğu yüksek olduğu için ',
        'hava kule çevresinden yeterince uzaklaştırılamaz; bu da nemli havanın tekrar kuleye emilmesine yol açar. ',
        'Bu sebeple havayı üstten emen Ensotek kuleleri, alttan itmeli kulelere göre yaklaşık ',
        '<strong>1,5–2 kat enerji tasarrufu</strong> sağlayabilmektedir.',
      '</li>',
    '</ol>',

    '<h3>Performans ve İşletme Avantajları</h3>',
    '<ol start="11">',
      '<li>',
        '<strong>Yüksek soğutma performansı:</strong> ',
        'Soğutma performansı ve yaş termometre sıcaklığına yaklaşımı (ortam havasına yakın soğutma yapabilme) ',
        'iyi olduğundan, işletmelerin proses verimini artırır ve enerji tasarrufu sağlar.',
      '</li>',
      '<li>',
        '<strong>Yatırımın geri dönüşü:</strong> ',
        'CTP kulelerin ilk yatırım maliyetleri metal kulelere göre nispeten daha yüksek olabilir ',
        '(hammadde maliyetinin metale göre yüksek olması sebebiyle); ancak kısa sürede, ',
        'düşük bakım giderleri ve enerji tasarrufu sayesinde toplam sahip olma maliyetinde avantaj sunar.',
      '</li>',
      '<li>',
        '<strong>Kolay ve ekonomik yedek parça temini:</strong> ',
        'Fan, dolgu, nozullar ve yardımcı ekipmanlar dahil olmak üzere yedek parça temini kolay ve ekonomiktir; ',
        'bu da işletme sürekliliğini destekler.',
      '</li>',
    '</ol>'
  ),
  'Ensotek soğutma kulelerimizin özellikleri',
  'Ensotek su soğutma kulelerinin malzeme yapısı, dolgu seçenekleri, enerji verimliliği ve uzun ömürlü tasarım avantajlarını özetleyen teknik bilgilendirme dokümanı.',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 title            = VALUES(title),
 slug             = VALUES(slug),
 summary          = VALUES(summary),
 content          = VALUES(content),
 meta_title       = VALUES(meta_title),
 meta_description = VALUES(meta_description),
 updated_at       = VALUES(updated_at);

/* ================= I18N: EN ================= */

INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_CT_FEATURES_ID, 'en',
  'Key Features of Ensotek Cooling Towers',
  'key-features-of-ensotek-cooling-towers',
  'Technical overview of Ensotek cooling towers covering FRP construction, fill types, energy efficiency and long-term operating advantages.',
  CONCAT(
    '<h2>Key Features of Ensotek Cooling Towers</h2>',
    '<ol>',
      '<li>',
        '<strong>FRP casing structure:</strong> Ensotek cooling towers are manufactured from ',
        'fiberglass reinforced polyester (FRP), which does not require painting. ',
        'The tower casing maintains its mechanical strength and appearance for many years without corrosion.',
      '</li>',
      '<li>',
        '<strong>Chemical and corrosion resistance:</strong> ',
        'The FRP structure provides high resistance against chemicals and corrosion. ',
        'Unlike metallic cooling towers that may corrode and fail within a few years, FRP towers offer ',
        'a significantly longer service life.',
      '</li>',
      '<li>',
        '<strong>Low flammability resin option:</strong> ',
        'For sensitive facilities such as hotels, hospitals, shopping malls and residential complexes, ',
        'low flame-spread FRP resins can be used to minimize combustibility and enhance fire safety.',
      '</li>',
    '</ol>',

    '<h3>Fill Media Options</h3>',
    '<p>Depending on process water quality and operating conditions, Ensotek cooling towers use three main fill types:</p>',
    '<ol start="4">',
      '<li>',
        '<strong>PVC film fill:</strong> ',
        'In systems where the circulating water is clean (free from oil, sludge, scale and dirt) and ',
        'the environment is relatively free of dust and contaminants, PVC film (honeycomb) fills are used. ',
        'Because of their large wetted surface area, they provide excellent cooling performance ',
        'compared to other fill types.',
      '</li>',
      '<li>',
        '<strong>PP splash (''bigudi'') fill:</strong> ',
        'In plants where the water is dirty, oily, prone to scaling or where the environment is very dusty, ',
        'splash-type fills manufactured from PP (Polypropylene) are preferred. ',
        'PP material can be used successfully even with process water temperatures up to 100&nbsp;°C. ',
        'The risk of clogging is low, and the fills can be cleaned and reused relatively easily.',
      '</li>',
      '<li>',
        '<strong>PP grid (splash) fill for very dirty water:</strong> ',
        'Where the circulating water is heavily contaminated, grid-type splash fills made of polypropylene are used. ',
        'These fills are typically preferred in plants such as sugar factories, tomato paste and oil factories ',
        'with vacuum processes, and steel mills where the process water is extremely dirty.',
      '</li>',
    '</ol>',

    '<ol start="7">',
      '<li>',
        '<strong>Material compatibility and long service life:</strong> ',
        'All materials used in the tower are mutually compatible. ',
        'There are no structural metallic or wooden members inside the FRP body; structural strength is provided ',
        'by a special Coremat layer of about 3&nbsp;mm thickness. ',
        'Thanks to this design, an overall service life of 30–40 years is achievable under proper operation and maintenance.',
      '</li>',
      '<li>',
        '<strong>Low maintenance cost:</strong> ',
        'Because of the FRP structure and properly selected fill combinations, the periodic maintenance cost ',
        'of Ensotek cooling towers is considerably lower than that of conventional metallic towers.',
      '</li>',
    '</ol>',

    '<h3>Fan Arrangement and Energy Efficiency</h3>',
    '<ol start="9">',
      '<li>',
        '<strong>Counter flow, induced draft with top-mounted fans:</strong> ',
        'Ensotek towers are designed as counter flow induced draft units with fans located on top of the tower. ',
        'In this configuration, the energy consumption of the fan is lower compared to forced draft towers ',
        'that push air from the bottom.',
      '</li>',
      '<li>',
        '<strong>Reduced recirculation and energy saving:</strong> ',
        'The moist air discharged from the top leaves the tower at a relatively high velocity and is quickly ',
        'carried away from the surroundings. This minimizes the risk of the same moist air being re-entrained ',
        'into the tower (recirculation). ',
        'In bottom-blowing forced draft towers, discharge velocity is low and air density is higher, ', 
        'so the moist air tends to remain around the tower and is more likely to be recirculated. ',
        'For this reason, top-draw induced draft towers typically provide about ',
        '<strong>1.5–2 times better energy efficiency</strong> compared to bottom-blowing designs.',
      '</li>',
    '</ol>',

    '<h3>Performance and Operational Advantages</h3>',
    '<ol start="11">',
      '<li>',
        '<strong>High cooling performance:</strong> ',
        'Thanks to the optimized fill configuration and air distribution, Ensotek cooling towers provide ',
        'good approach to the ambient wet-bulb temperature (i.e. the cooled water temperature can be brought ',
        'close to the ambient wet-bulb). This improves overall process efficiency and reduces energy consumption.',
      '</li>',
      '<li>',
        '<strong>Fast payback:</strong> ',
        'Although the initial investment cost of FRP towers may be somewhat higher than that of steel towers ',
        '(due to higher raw material cost), the savings in maintenance and operating costs enable a short payback ',
        'time and lower total cost of ownership.',
      '</li>',
      '<li>',
        '<strong>Easy and economical spare parts:</strong> ',
        'Spare parts, including fans, fills, nozzles and auxiliary components, are readily available and cost-effective, ',
        'which supports high availability and continuous operation of the plant.',
      '</li>',
    '</ol>'
  ),
  'Key features of Ensotek cooling towers',
  'Technical article describing the main features of Ensotek cooling towers, including FRP construction, fill options, high efficiency and long-term operating advantages.',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 title            = VALUES(title),
 slug             = VALUES(slug),
 summary          = VALUES(summary),
 content          = VALUES(content),
 meta_title       = VALUES(meta_title),
 meta_description = VALUES(meta_description),
 updated_at       = VALUES(updated_at);
