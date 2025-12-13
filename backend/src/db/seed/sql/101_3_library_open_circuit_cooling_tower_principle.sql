-- =============================================================
-- 101_3_library_open_circuit_cooling_tower_principle.sql
-- Açık Tip Su Soğutma Kulesi Çalışma Prensibi
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

-- Açık Tip Su Soğutma Kulesi Çalışma Prensibi
SET @LIB_CT_OPEN_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'acik-tip-su-sogutma-kulesi-calisma-prensibi'
  LIMIT 1
);
SET @LIB_CT_OPEN_ID := COALESCE(@LIB_CT_OPEN_ID, UUID());

INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json,
 category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(
  @LIB_CT_OPEN_ID,
  1, 1, 60,
  '{
    "tr":[
      "açık tip soğutma kulesi",
      "su soğutma kulesi çalışma prensibi",
      "karşı akışlı kule",
      "cebri çekişli kule",
      "buharlaşma kaybı",
      "soğutma kulesi hesabı"
    ],
    "en":[
      "open circuit cooling tower",
      "cooling tower working principle",
      "counter flow tower",
      "induced draft tower",
      "evaporation loss",
      "cooling tower calculation"
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
  UUID(), @LIB_CT_OPEN_ID, 'tr',
  'Açık Tip Su Soğutma Kulesi Çalışma Prensibi',
  'acik-tip-su-sogutma-kulesi-calisma-prensibi',
  'Açık tip (açık devre) su soğutma kulelerinde suyun soğutulma prensibi, karşı akışlı cebri çekişli kulelerde çalışma adımları ve buharlaşma kaybı hesabını özetleyen teknik doküman.',
  CONCAT(
    '<h2>Açık Tip Su Soğutma Kulesi Çalışma Prensibi</h2>',
    '<h3>Su Soğutma Kulesi Nasıl Çalışır?</h3>',
    '<p>',
      'Su soğutma kuleleri çalışma prensiplerine göre temel olarak iki ana gruba ayrılır: ',
      '<strong>karşı akışlı kuleler</strong> ve <strong>çapraz akışlı kuleler</strong>. ',
      'Karşı akışlı su soğutma kulelerinde su, kule dolguları üzerinden yukarıdan aşağıya doğru süzülürken, ',
      'hava aşağıdan yukarıya doğru hareket eder. Çapraz akışlı kulelerde ise su yine yukarıdan aşağı inerken, ',
      'hava akımı suya göre yatay veya çapraz yöndedir. Son yıllarda, verimlilik ve kompakt tasarım avantajları ',
      'sebebiyle karşı akışlı kuleler daha çok tercih edilmektedir.',
    '</p>',

    '<p>',
      '<strong>Cebri çekişli karşı akışlı tip su soğutma kulelerinde</strong>, işletmeden ısınıp gelen sıcak su, ',
      'özel olarak imal edilmiş su dağıtım sistemi ve fıskiyeler yardımıyla kulenin tüm kesitine yukarıdan aşağıya ',
      'doğru homojen bir şekilde püskürtülür. Püskürtülen su kütleleri, kule dolguları arasından süzülerek ',
      'küçük damlacıklara ve ince filmlere ayrılır, böylece ısı transfer yüzeyi artar.',
    '</p>',

    '<p>',
      'Dış ortamın nemine sahip hava, kulenin üst kısmında bulunan motor–fan grubu yardımıyla, ',
      'dolgular üzerinden aşağıdan yukarıya doğru emilir. Dolgu soğutma yüzeyinde hava ile temas eden su, ',
      'havaya ısı vererek soğur ve suyun az bir kısmı buharlaşır. Soğuyan su kulenin soğuk su havuzunda toplanarak ',
      'pompa vasıtasıyla tekrar işletmeye gönderilir. Suyun buharlaşması sonucu nemi artan ve doyma oranına yaklaşan hava, ',
      'kule üstündeki fan bacasından atmosfere atılır.',
    '</p>',

    '<h3>Açık Tip (Açık Devre) Kulelerde Isı Uzaklaştırma</h3>',
    '<p>',
      'Açık tip su soğutma kulelerinde proses suyu, kule içerisinde hava ile doğrudan temas halindedir. ',
      'Su, dolgular üzerinden serbest düşme ve yüzey akışı ile ilerlerken, hava akımı ile karşılaşır ve şu iki mekanizma ile soğutulur:',
    '</p>',
    '<ul>',
      '<li><strong>Duyulur ısı transferi</strong>: Su ile hava arasındaki sıcaklık farkı sayesinde, sudan havaya ısı geçişi.</li>',
      '<li><strong>Gizli ısı / buharlaşma</strong>: Suyun bir kısmı buharlaşarak hal değiştirir ve sudan ilave ısı çeker.</li>',
    '</ul>',
    '<p>',
      'Bu iki etki birlikte, su soğutma kulelerinin yüksek verimle çalışmasını sağlar. Soğutmanın büyük kısmı, ',
      'buharlaşma ile gizli ısı taşınımından kaynaklanır.',
    '</p>',

    '<h3>Buharlaşma Kaybı ve Termodinamik Yaklaşım</h3>',
    '<p>',
      'Termodinamik esaslara göre; buharlaşan her bir gram suyun faz (hal) değişimini gerçekleştirebilmesi için ',
      'yaklaşık <strong>540 kalori</strong> enerji sistemden emilir. Bu sebeple, suyun buharlaşması soğutma kulelerinde ',
      'en önemli ısı uzaklaştırma mekanizmasıdır.',
    '</p>',
    '<p>',
      'Pratik bir mühendislik yaklaşımı olarak; sistemde dolaşan suyun her ',
      '<strong>6&nbsp;°C soğuması</strong> için, yaklaşık olarak sirküle olan su debisinin ',
      '<strong>%0,9</strong>&apos;unun buharlaşması gerektiği kabul edilir. ',
      'Bu miktara <strong>su soğutma kulesi buharlaşma kaybı</strong> denir.',
    '</p>',

    '<p>Buharlaşma miktarı, aşağıdaki bağıntı ile yaklaşık olarak hesaplanabilir:</p>',
    '<p>',
      '<code>',
        'Buharlaşma Miktarı (m³/h) = 0.00085 × 1.8 × Debi (m³/h) × (T',
        '<sub>g</sub> − T',
        '<sub>ç</sub>)',
      '</code>',
    '</p>',

    '<p>Burada:</p>',
    '<ul>',
      '<li><strong>Debi (m³/h)</strong>: Kulede sirküle edilen su debisi,</li>',
      '<li><strong>T<sub>g</sub></strong>: Giriş suyu sıcaklığı (°C),</li>',
      '<li><strong>T<sub>ç</sub></strong>: Çıkış (soğutulmuş) su sıcaklığı (°C).</li>',
    '</ul>',

    '<p>Bu formül, ön boyutlandırma ve kaba tasarım hesaplarında yaygın olarak kullanılır.</p>',

    '<h3>Özet</h3>',
    '<p>',
      'Açık tip su soğutma kulelerinde, sıcak su doğrudan hava ile temas ederek soğutulur. ',
      'Karşı akışlı cebri çekişli kule tasarımında su yukarıdan aşağıya, hava ise aşağıdan yukarıya hareket eder. ',
      'Dolgu malzemesi, suyu küçük damlacıklara ayırarak ısı transfer yüzeyini büyütür; buharlaşma ile yüksek ',
      'verimli bir soğutma sağlanır. Doğru tasarlanmış bir kulede buharlaşma kaybı tasarım hesabı ile öngörülebilir, ',
      'sürüklenme ve blöf kayıpları ise uygun ekipman ve işletme stratejileri ile kontrol altında tutulabilir.',
    '</p>'
  ),
  'Açık tip su soğutma kulesi çalışma prensibi',
  'Açık tip su soğutma kulelerinin çalışma prensibi, karşı akışlı cebri çekişli kulelerde işletme adımları ve buharlaşma kaybı hesabını özetleyen teknik bilgilendirme dokümanı.',
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
  UUID(), @LIB_CT_OPEN_ID, 'en',
  'Open Circuit Cooling Tower Working Principle',
  'open-circuit-cooling-tower-working-principle',
  'Technical note describing the working principle of open circuit cooling towers, counter flow induced draft operation steps and evaporation loss calculation.',
  CONCAT(
    '<h2>Open Circuit Cooling Tower Working Principle</h2>',
    '<h3>How Does a Cooling Tower Work?</h3>',
    '<p>',
      'From the standpoint of flow arrangement, cooling towers are commonly classified into ',
      '<strong>counter flow</strong> and <strong>cross flow</strong> types. ',
      'In counter flow cooling towers, water flows downward over the fill media while the air moves upward ',
      'from the bottom to the top. In cross flow towers, water still flows downward, but the air passes horizontally ',
      'or diagonally across the water stream. In recent years, counter flow towers have become the preferred choice ',
      'due to their higher efficiency and compact design.',
    '</p>',

    '<p>',
      'In <strong>counter flow, induced draft cooling towers</strong>, hot water returning from the process enters ',
      'the tower at the top and is distributed over the entire plan area by a specially designed distribution system ',
      'and spray nozzles. The water is sprayed downward and, while passing through the fill, it breaks into ',
      'small droplets and thin films, which greatly increases the effective heat transfer surface area.',
    '</p>',

    '<p>',
      'Ambient air is drawn upward through the fill by the fan located at the top of the tower. ',
      'As the air passes over the wetted surfaces of the fill, the water gives up heat to the air and a small portion ',
      'of the water evaporates. The cooled water is collected in the cold-water basin at the bottom of the tower ',
      'and is pumped back to the process. ',
      'The warm, moisture-laden air with increased humidity (close to saturation) is finally discharged to the ',
      'atmosphere through the fan stack.',
    '</p>',

    '<h3>Heat Rejection in Open Circuit Towers</h3>',
    '<p>',
      'In open circuit cooling towers, the process water is in direct contact with the air inside the tower. ',
      'While the water flows downward through the fill, it encounters the air stream and is cooled by two mechanisms:',
    '</p>',
    '<ul>',
      '<li><strong>Sensible heat transfer</strong>: Heat transfer from water to air due to the temperature difference.</li>',
      '<li><strong>Latent heat / evaporation</strong>: A portion of the water evaporates and removes additional heat from the liquid water.</li>',
    '</ul>',
    '<p>',
      'The combined effect of sensible and latent heat transfer enables high cooling efficiency. ',
      'In most cooling towers, the dominant cooling mechanism is the latent heat of evaporation.',
    '</p>',

    '<h3>Evaporation Loss and Thermodynamic Basis</h3>',
    '<p>',
      'From thermodynamic principles, approximately <strong>540&nbsp;kcal</strong> of latent heat is required for each gram ',
      'of water to change phase from liquid to vapor. ',
      'Therefore, water evaporation is the key mechanism of heat rejection in evaporative cooling towers.',
    '</p>',
    '<p>',
      'As a practical engineering rule, for every ',
      '<strong>6&nbsp;°C reduction</strong> in circulating water temperature, roughly ',
      '<strong>0.9% of the circulating flow rate</strong> must be evaporated. ',
      'This is referred to as the <strong>cooling tower evaporation loss</strong>.',
    '</p>',

    '<p>The evaporation loss can be estimated using the following empirical formula:</p>',
    '<p>',
      '<code>',
        'Evaporation (m³/h) = 0.00085 × 1.8 × Flow (m³/h) × (T',
        '<sub>h</sub> − T',
        '<sub>c</sub>)',
      '</code>',
    '</p>',

    '<p>Where:</p>',
    '<ul>',
      '<li><strong>Flow (m³/h)</strong>: Circulating water flow rate through the tower,</li>',
      '<li><strong>T<sub>h</sub></strong>: Hot water inlet temperature (°C),</li>',
      '<li><strong>T<sub>c</sub></strong>: Cooled water outlet temperature (°C).</li>',
    '</ul>',

    '<p>',
      'This formula is widely used for preliminary design and sizing calculations. ',
      'In addition to evaporation loss, there are also drift and blowdown losses, which are controlled by proper ',
      'tower design, drift eliminators and water treatment strategy.',
    '</p>',

    '<h3>Summary</h3>',
    '<p>',
      'In open circuit cooling towers, hot process water is cooled by direct contact with ambient air. ',
      'In a counter flow induced draft configuration, water travels from the top to the bottom while air flows ',
      'from the bottom to the top. The fill media breaks the water into small droplets and films, increasing the ',
      'contact surface and enabling efficient heat transfer. ',
      'Evaporation loss can be estimated by simple formulas, and well-designed towers keep drift and blowdown ',
      'within acceptable limits while providing reliable and efficient cooling for industrial and HVAC applications.',
    '</p>'
  ),
  'Open circuit cooling tower working principle',
  'Technical explanation of the working principle of open circuit cooling towers, including counter flow induced draft operation and evaporation loss calculation.',
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
