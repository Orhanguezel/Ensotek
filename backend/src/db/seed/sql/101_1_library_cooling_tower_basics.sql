-- =============================================================
-- 101_1_library_cooling_tower_basics.sql
-- Su Soğutma Kulesi Nedir, Çeşitleri Nelerdir, Nasıl Çalışır?
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

-- Su Soğutma Kulesi Nedir, Çeşitleri Nelerdir, Nasıl Çalışır?
SET @LIB_CT_BASICS_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'su-sogutma-kulesi-nedir-cesitleri-nelerdir-nasil-calisir'
  LIMIT 1
);
SET @LIB_CT_BASICS_ID := COALESCE(@LIB_CT_BASICS_ID, UUID());

INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json,
 category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(
  @LIB_CT_BASICS_ID,
  1, 1, 40,
  '{
    "tr":[
      "su soğutma kulesi",
      "soğutma kulesi nedir",
      "soğutma kulesi çeşitleri",
      "açık devre kule",
      "kapalı devre kule",
      "karşı akışlı kule",
      "çapraz akışlı kule",
      "buharlaşma kaybı",
      "soğutma kulesi çalışma prensibi"
    ],
    "en":[
      "cooling tower",
      "what is a cooling tower",
      "cooling tower types",
      "open circuit cooling tower",
      "closed circuit cooling tower",
      "counter flow cooling tower",
      "cross flow cooling tower",
      "evaporation loss",
      "cooling tower working principle"
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
  UUID(), @LIB_CT_BASICS_ID, 'tr',
  'Su Soğutma Kulesi Nedir, Çeşitleri Nelerdir, Nasıl Çalışır?',
  'su-sogutma-kulesi-nedir-cesitleri-nelerdir-nasil-calisir',
  'Su soğutma kulesinin ne olduğu, çeşitleri ve çalışma prensipleri ile buharlaşma kaybı hesaplamasına dair özet teknik doküman.',
  CONCAT(
    '<h2>Su Soğutma Kulesi Nedir? Ne İşe Yarar?</h2>',
    '<p>',
      'Su soğutma kulesi; sistemden ısınarak gelen sıcak suyu bir kısmını buharlaştırıp ',
      'atmosfere vererek soğutan, gerekli sıcaklığa ulaşmış kalan kısmını ise tesiste tekrar ',
      'kullanılmak üzere alttaki havuzda biriktiren bir <strong>ısı uzaklaştırma ünitesidir</strong>. ',
      'Su soğutma kuleleri; hemen her sektörden endüstriyel tesislerde ve HVAC sistemlerde ',
      'soğutulmuş su elde etmek için kullanılır.',
    '</p>',

    '<h2>Su Soğutma Kulesi Çeşitleri</h2>',
    '<p>Su soğutma kuleleri temel olarak iki ana başlıkta sınıflandırılabilir:</p>',
    '<ol>',
      '<li>Çalışma prensibine göre kule çeşitleri</li>',
      '<li>Soğutma tipine göre kule çeşitleri</li>',
    '</ol>',

    '<h3>A. Çalışma Prensiplerine Göre Su Soğutma Kuleleri</h3>',
    '<ul>',
      '<li>Karşı akışlı kuleler (Counter flow towers)</li>',
      '<li>Çapraz akışlı kuleler (Cross flow towers)</li>',
    '</ul>',

    '<h4>1. Karşı Akışlı Kuleler</h4>',
    '<p>',
      'Karşı akışlı su soğutma kulelerinde su, dolgular üzerinde yukarıdan aşağıya süzülürken, ',
      'hava aşağıdan yukarıya doğru hareket eder. Günümüzde endüstride en çok tercih edilen kule tipidir.',
    '</p>',
    '<p>İki temel tipi vardır:</p>',
    '<ul>',
      '<li>',
        '<strong>Cebri çekişli kuleler (Induced draft towers)</strong>: Fanlar kulenin üst kısmındadır. ',
        'Hava, yandaki hava panjurlarından içeri alınır ve üstteki fan yardımıyla yukarı doğru çekilerek ',
        'soğutma sağlanır.',
      '</li>',
      '<li>',
        '<strong>Cebri itişli kuleler (Forced draft towers)</strong>: Fanlar yanda konumlanır. ',
        'Hava, fan yardımıyla alttan yukarı doğru itilerek kule içerisinden geçirilir ve soğutma sağlanır.',
      '</li>',
    '</ul>',

    '<h4>2. Çapraz Akışlı Kuleler</h4>',
    '<p>',
      'Çapraz akışlı su soğutma kulelerinde su, dolgular üzerinde yukarıdan aşağıya inerken, ',
      'hava akımı suya göre yatay veya çapraz yöndedir. Bu tip kulelerde de cebri itişli ve cebri çekişli ',
      'uygulama çeşitleri bulunur.',
    '</p>',

    '<h3>B. Soğutma Tipine Göre Kule Çeşitleri</h3>',

    '<h4>1. Açık Çevrim (Açık Tip) Su Soğutma Kuleleri</h4>',
    '<p>',
      'Açık çevrim kulelerde soğutma suyu doğrudan kule içerisindeki dolgular üzerine püskürtülerek ',
      'soğutma gerçekleştirilir. Su, hava ile doğrudan temas ettiğinden ısı transferi verimliliği yüksektir. ',
      'Buna karşılık, su ortam ile temas ettiği için kirlilik ve kirlenme riski daha fazladır.',
    '</p>',
    '<p><em>Açık tip soğutma kulesi çalışma prensibi, detaylı şemalar ve örnek proseslerle ayrı bir teknik dokümanda gösterilebilir.</em></p>',

    '<h4>2. Kapalı Çevrim (Kapalı Tip) Su Soğutma Kuleleri</h4>',
    '<p>',
      'Kapalı tip kulelerde soğutma suyu kule içerisindeki metal serpantinler (eşanjör) içerisinde dolaşır. ',
      'Serpantin içerisindeki su, soğuk hava ve kulenin sirkülasyon suyu ile boru dış yüzeyinden ',
      'dolaylı olarak soğutulur. Bu tip kulelerde proses suyu ortam ile temas etmediği için temizliğini ',
      'korur. Ancak dolaylı ısı transferi sebebiyle kule verimliliği, açık tip kulelere göre daha düşüktür.',
    '</p>',
    '<p><em>Kapalı tip soğutma kulesi çalışma prensibi de benzer şekilde ayrı bir teknik dokümanda şematik olarak açıklanabilir.</em></p>',

    '<h2>Su Soğutma Kuleleri Nerelerde Kullanılır?</h2>',
    '<p>Su soğutma kuleleri, sıcak suyun oluştuğu hemen her sektörde suyun soğutulması için kullanılabilir. Örnek uygulama alanları:</p>',
    '<ul>',
      '<li>Gıda üretim tesisleri: süt, yoğurt, peynir, yağ, çikolata, bisküvi, şeker ve salça fabrikaları</li>',
      '<li>Kimya ve boya tesisleri</li>',
      '<li>Çimento fabrikaları</li>',
      '<li>Dökümhaneler, haddehaneler, çelikhaneler</li>',
      '<li>Alüminyum ve demir-çelik fabrikaları</li>',
      '<li>Tel çekme ve kablo fabrikaları</li>',
      '<li>Plastik, ambalaj ve kâğıt üretim tesisleri</li>',
      '<li>Otomotiv ve yan sanayi tesisleri</li>',
      '<li>HVAC sistemleri: AVM''ler, rezidanslar, oteller, hastaneler</li>',
      '<li>Su soğutmalı chiller sistemleri</li>',
      '<li>Isı pompası sistemleri</li>',
      '<li>Elektrikli eşya üretim tesisleri</li>',
      '<li>Tekstil fabrikaları</li>',
      '<li>Enerji üretim tesisleri: biyokütle, atık yakma, hidroelektrik ve termik santraller</li>',
    '</ul>',
    '<p>Görüldüğü gibi, su soğutma kuleleri çok geniş bir yelpazede endüstriyel ve ticari uygulamada kullanılmaktadır.</p>',

    '<h2>Soğutma Kuleleri Nasıl Çalışır?</h2>',
    '<p>',
      'Karşı akışlı cebri çekişli tipteki klasik bir su soğutma kulesinin çalışma prensibi özetle şöyledir:',
    '</p>',
    '<ul>',
      '<li>',
        'İşletmeden ısınıp gelen sıcak su, özel olarak tasarlanmış su dağıtım sistemi ve fıskiyeler ',
        'yardımıyla kulenin tüm kesitine yukarıdan aşağıya doğru homojen bir şekilde püskürtülür.',
      '</li>',
      '<li>',
        'Püskürtülen su kütleleri, kule dolguları arasından süzülürken küçük damlacıklara ayrılır ve ',
        'ısı transferi yüzeyi büyütülür.',
      '</li>',
      '<li>',
        'Dış ortamın nem değerine sahip hava, üstte bulunan motor-fan grubu yardımıyla dolgular üzerinden ',
        'aşağıdan yukarıya doğru emilir.',
      '</li>',
      '<li>',
        'Dolgu yüzeyinde hava ile karşılaşan su, havaya ısı vererek soğur ve suyun küçük bir kısmı buharlaşır.',
      '</li>',
      '<li>',
        'Soğuyan su kulenin soğuk su havuzunda toplanır ve pompa yardımıyla tekrar tesise gönderilir.',
      '</li>',
      '<li>',
        'Buharlaşma sonucu nemi artan ve doyma noktasına yaklaşan hava, kulenin üst kısmındaki fan bacasından atmosfere atılır.',
      '</li>',
    '</ul>',
    '<p>',
      'Islak tip (evaporatif) kuleler olarak da adlandırılan bu kulelerde, soğutma esnasında suyun bir bölümü ',
      'buharlaşarak sistemden uzaklaşır.',
    '</p>',

    '<h2>Buharlaşma Kaybı ve Hesabı</h2>',
    '<p>',
      'Termodinamik esaslara göre; buharlaşan her bir gram suyun faz (hal) değişimini gerçekleştirebilmesi için ',
      'yaklaşık 540 kalori enerji sistemden emilir. Bu nedenle, sistemde dolaşan suyun her 6&nbsp;°C soğuması için ',
      'yaklaşık olarak sirküle olan su debisinin %0,9''unun buharlaşması beklenir. Bu değere ',
      '<strong>su soğutma kulesi buharlaşma kaybı</strong> denir.',
    '</p>',
    '<p>Buharlaşma kaybı pratik olarak aşağıdaki formülle hesaplanabilir:</p>',
    '<p><code>Buharlaşma Miktarı (m³/h) = 0.00085 × 1.8 × Debi (m³/h) × (T<sub>g</sub> − T<sub>ç</sub>)</code></p>',
    '<p>Örnek:</p>',
    '<p>',
      '40&nbsp;°C dereceden 30&nbsp;°C dereceye, saatte 100&nbsp;m³ suyu soğutacak bir kulede ',
      'buharlaşma kaybı yaklaşık olarak:',
    '</p>',
    '<p><code>Buharlaşma Miktarı (m³/h) = 0.00085 × 1.8 × 100 × 10 ≈ 1.53&nbsp;m³/h</code></p>',

    '<p>',
      'Soğutma kulelerinde buharlaşma kaybına ek olarak sürüklenme (drift) kaybı ve blöf (purge) kaybı da ',
      'vardır. Doğru tasarlanmış ve sürüklenme tutucuları (drift eliminator) uygun seçilmiş bir soğutma ',
      'kulesinde sürüklenme kaybı ihmal edilebilir seviyededir.',
    '</p>',

    '<p><em>"Su Soğutma Kulesi Nedir, Çeşitleri Nelerdir, Nasıl Çalışır?" konulu detaylı PDF dokümanı indirilebilir versiyon olarak ayrıca kütüphaneye eklenebilir.</em></p>'
  ),
  'Su soğutma kulesi nedir, çeşitleri nelerdir, nasıl çalışır?',
  'Su soğutma kulelerinin temel tanımı, çeşitleri, çalışma prensipleri, kullanım alanları ve buharlaşma kaybı hesabını özetleyen teknik bilgilendirme dokümanı.',
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
  UUID(), @LIB_CT_BASICS_ID, 'en',
  'What is a Cooling Tower? Types and Working Principle',
  'what-is-cooling-tower-types-working-principle',
  'Technical overview explaining what a cooling tower is, main types and working principles, together with a simple evaporation loss calculation.',
  CONCAT(
    '<h2>What is a Cooling Tower? What Does It Do?</h2>',
    '<p>',
      'A cooling tower is a <strong>heat rejection device</strong> that cools down hot water returning ',
      'from the process by evaporating a portion of it and rejecting this heat to the atmosphere. ',
      'The cooled water that reaches the required temperature is collected in the cold-water basin at ',
      'the bottom of the tower and pumped back to the plant or HVAC system.',
    '</p>',
    '<p>',
      'Cooling towers are widely used in almost all industrial plants and HVAC systems where chilled ',
      'or cooled water is required.',
    '</p>',

    '<h2>Cooling Tower Types</h2>',
    '<p>Cooling towers can be classified under two main headings:</p>',
    '<ol>',
      '<li>Types according to the flow/working principle</li>',
      '<li>Types according to the cooling method (open / closed circuit)</li>',
    '</ol>',

    '<h3>A. Cooling Tower Types by Flow Arrangement</h3>',
    '<ul>',
      '<li>Counter flow cooling towers</li>',
      '<li>Cross flow cooling towers</li>',
    '</ul>',

    '<h4>1. Counter Flow Cooling Towers</h4>',
    '<p>',
      'In counter flow cooling towers, water flows downward over the fill media while the air moves upward ',
      'from the bottom to the top. This is currently the most common tower type used in industrial ',
      'applications.',
    '</p>',
    '<p>There are two basic subtypes:</p>',
    '<ul>',
      '<li>',
        '<strong>Induced draft towers</strong>: The fans are located at the top of the tower. ',
        'Air enters through the side louvers and is drawn upward through the fill by the fan, providing cooling.',
      '</li>',
      '<li>',
        '<strong>Forced draft towers</strong>: The fans are located on the side. ',
        'Air is pushed into the tower at a low level and forced upward through the fill by the fan.',
      '</li>',
    '</ul>',

    '<h4>2. Cross Flow Cooling Towers</h4>',
    '<p>',
      'In cross flow cooling towers, water again flows downward over the fill, but the air moves horizontally ',
      'or diagonally across the water stream. Cross flow towers can also be designed as induced draft or forced draft.',
    '</p>',

    '<h3>B. Cooling Tower Types by Cooling Method</h3>',

    '<h4>1. Open Circuit Cooling Towers</h4>',
    '<p>',
      'In open circuit cooling towers, the circulating water is sprayed directly over the fill media inside ',
      'the tower. The water comes into direct contact with the ambient air and is cooled by a combination of ',
      'evaporation and sensible heat transfer. This direct contact provides high heat transfer efficiency, ',
      'but also increases the risk of contamination and fouling in the circulating water.',
    '</p>',

    '<h4>2. Closed Circuit Cooling Towers</h4>',
    '<p>',
      'In closed circuit cooling towers, the process water flows inside metal coils or heat exchangers. ',
      'The outside of the coils is cooled by ambient air and spraying water, so the process fluid is cooled ',
      'indirectly through the coil wall. The process water does not come into direct contact with the air, ',
      'therefore it remains clean; however, the indirect heat transfer reduces the overall cooling efficiency ',
      'compared to open circuit towers.',
    '</p>',

    '<h2>Where are Cooling Towers Used?</h2>',
    '<p>Cooling towers are used in any sector where hot water must be cooled. Typical applications include:</p>',
    '<ul>',
      '<li>Food processing plants: dairy, oil, chocolate, biscuit, sugar and tomato-paste factories</li>',
      '<li>Chemical and paint plants</li>',
      '<li>Cement factories</li>',
      '<li>Foundries, rolling mills and steel works</li>',
      '<li>Aluminium and ferrous metallurgy plants</li>',
      '<li>Wire drawing and cable factories</li>',
      '<li>Plastic, packaging and paper production plants</li>',
      '<li>Automotive and automotive sub-industry</li>',
      '<li>HVAC systems: shopping malls, residences, hotels, hospitals</li>',
      '<li>Water-cooled chillers</li>',
      '<li>Heat pump systems</li>',
      '<li>Electrical appliance manufacturing plants</li>',
      '<li>Textile factories</li>',
      '<li>Power generation plants: biomass, waste-to-energy, hydroelectric and thermal plants</li>',
    '</ul>',

    '<h2>How Do Cooling Towers Work?</h2>',
    '<p>',
      'The working principle of a typical counter flow induced draft cooling tower can be summarized as follows:',
    '</p>',
    '<ul>',
      '<li>',
        'Hot water from the process enters the tower at the top and is distributed uniformly ',
        'over the fill through a spray distribution system and nozzles.',
      '</li>',
      '<li>',
        'As the water flows downward over the fill, it is broken into small droplets and thin films, ',
        'increasing the contact surface area.',
      '</li>',
      '<li>',
        'Ambient air is drawn upward from the bottom to the top by the fan located at the top of the tower, ',
        'passing through the fill in counter flow to the water.',
      '</li>',
      '<li>',
        'The water gives up heat to the air and a small portion of the water evaporates, which provides the major ',
        'cooling effect.',
      '</li>',
      '<li>',
        'Cooled water is collected in the cold-water basin at the bottom of the tower and pumped back to the process.',
      '</li>',
      '<li>',
        'The warm, moisture-laden air, close to saturation, is discharged to the atmosphere through the fan stack.',
      '</li>',
    '</ul>',
    '<p>',
      'These towers are also called <strong>wet cooling towers</strong> or <strong>evaporative cooling towers</strong>, ',
      'because a fraction of the circulating water is evaporated during the cooling process.',
    '</p>',

    '<h2>Evaporation Loss and Calculation</h2>',
    '<p>',
      'From a thermodynamic point of view, approximately 540&nbsp;kcal of latent heat is required for each gram of water ',
      'to change phase from liquid to vapor. Therefore, for every 6&nbsp;°C reduction in water temperature, ',
      'roughly 0.9% of the circulating flow rate must be evaporated. This is referred to as ',
      '<strong>cooling tower evaporation loss</strong>.',
    '</p>',
    '<p>The evaporation loss can be estimated using the following practical formula:</p>',
    '<p><code>Evaporation (m³/h) = 0.00085 × 1.8 × Flow (m³/h) × (T<sub>h</sub> − T<sub>c</sub>)</code></p>',
    '<p>Example:</p>',
    '<p>',
      'For a tower that cools 100&nbsp;m³/h of water from 40&nbsp;°C down to 30&nbsp;°C, the evaporation loss is approximately:',
    '</p>',
    '<p><code>Evaporation (m³/h) = 0.00085 × 1.8 × 100 × 10 ≈ 1.53&nbsp;m³/h</code></p>',

    '<p>',
      'In addition to evaporation loss, there are also drift (carry-over) losses and blowdown (purge) losses ',
      'in cooling towers. In a properly designed cooling tower with correctly selected drift eliminators, ',
      'drift loss is negligible.',
    '</p>',

    '<p><em>A more detailed PDF version of this article titled "What is a Cooling Tower, Types and Working Principle" can be added to the library as a downloadable document.</em></p>'
  ),
  'What is a cooling tower, types and working principle?',
  'Technical article summarizing the basic definition, types, working principles, application areas and evaporation loss calculation of cooling towers.',
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
