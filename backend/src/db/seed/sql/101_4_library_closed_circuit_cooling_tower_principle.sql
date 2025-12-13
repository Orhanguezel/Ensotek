-- =============================================================
-- 101_4_library_closed_circuit_cooling_tower_principle.sql
-- Kapalı Çevrim Su Soğutma Kulesi Çalışma Prensibi
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

-- Kapalı Çevrim Su Soğutma Kulesi Çalışma Prensibi
SET @LIB_CT_CLOSED_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'kapali-cevrim-su-sogutma-kulesi-calisma-prensibi'
  LIMIT 1
);
SET @LIB_CT_CLOSED_ID := COALESCE(@LIB_CT_CLOSED_ID, UUID());

INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json,
 category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(
  @LIB_CT_CLOSED_ID,
  1, 1, 70,
  '{
    "tr":[
      "kapalı çevrim soğutma kulesi",
      "kapalı tip soğutma kulesi",
      "serpantinli kule",
      "eşanjör donma",
      "free cooling",
      "buharlaşma kaybı",
      "enerji tüketimi"
    ],
    "en":[
      "closed circuit cooling tower",
      "closed type cooling tower",
      "coil cooling tower",
      "heat exchanger freeze protection",
      "free cooling",
      "evaporation loss",
      "energy consumption"
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
  UUID(), @LIB_CT_CLOSED_ID, 'tr',
  'Kapalı Çevrim Su Soğutma Kulesi Çalışma Prensibi',
  'kapali-cevrim-su-sogutma-kulesi-calisma-prensibi',
  'Kapalı tip su soğutma kulelerinin çalışma prensibi, buharlaşma kaybı, kuru soğutucu (free cooling) modu ve eşanjör donma riskine karşı alınabilecek önlemleri özetleyen teknik doküman.',
  CONCAT(
    '<h2>Kapalı Çevrim Su Soğutma Kulesi Çalışma Prensibi</h2>',
    '<h3>Kapalı Tip Su Soğutma Kuleleri Nasıl Çalışır?</h3>',
    '<p>',
      'Kapalı sistemler, soğutulacak suyun kirliliğe karşı hassas olduğu proseslerde tercih edilir. ',
      'Temiz kalması istenen su, kapalı tip kule içindeki metal serpantinlerden (eşanjör) geçerken soğutulur. ',
      'Bu sayede proses suyunun hava ile doğrudan teması önlenir ve su kalitesi korunur.',
    '</p>',

    '<p>',
      'Kapalı tip bir su soğutma kulesinde; sıcak su metal boru içerisinden (eşanjör serpantini) geçerken, ',
      'kule üzerindeki fan yardımıyla ortam havası emilerek eşanjör üzerinden geçirilir. Aynı zamanda, ',
      'sirkülasyon pompası yardımıyla kulenin havuzunda bulunan sirkülasyon suyu, fıskiyeler ile eşanjörün ',
      'üzerine püskürtülür. Emilen ortam havası ve püskürtülen su, serpantin dış yüzeyinden ısı alarak ',
      'eşanjör içindeki suyu soğutur.',
    '</p>',

    '<h3>Kapalı Tip Soğutma Kulelerinde Buharlaşma Kaybı Olur mu?</h3>',
    '<p>',
      'Kapalı tip soğutma kulelerinde proses suyu kapalı boru devresi içinde dolaşır; ancak serpantin üzerine ',
      'püskürtülen sprey suyu, açık tip kulelerde olduğu gibi hava ile doğrudan temastadır. ',
      'Dolayısıyla, <strong>sprey suyu devresinde</strong> belirli oranda buharlaşma kaybı oluşur. ',
      'Bu kayıp miktarı, kule yükü, su sıcaklıkları ve iklim koşullarına bağlıdır.',
    '</p>',

    '<h3>Kapalı Çevrim Soğutma Kulesi Kuru Soğutucu Gibi Çalışır mı?</h3>',
    '<p>',
      'Kapalı tip kuleler, soğuk mevsimlerde sprey suyu devresi kapatılarak sadece hava emişi ile ',
      '<strong>kuru soğutucu (dry cooler)</strong> gibi çalıştırılabilir. Bu işletme moduna genellikle ',
      '<strong>free cooling</strong> de denir. Bu durumda su kaybı neredeyse sıfıra iner, su tüketimi ve ',
      'kimyasal tüketimi önemli ölçüde azalır.',
    '</p>',

    '<p>',
      'Kuru soğutucu modu ile verimli free cooling yapılabilmesi için, kule içerisindeki eşanjörün ',
      'kule hava emiş menfezlerinin üzerinde ve hava akışının içine yerleştirilmiş olması gerekir. ',
      'Piyasadaki bazı modellerde soğutma eşanjörü hava emiş menfezlerinin altına monte edilmekte, ',
      'bu durumda kuru çalışma modu yeterince etkin olamamaktadır.',
    '</p>',

    '<h3>Kapalı Çevrim Soğutma Kulesinde Eşanjör Donması Nasıl Engellenir?</h3>',
    '<p>',
      'Kış mevsiminde, soğutma kulesi durdurulduğunda eşanjör içerisindeki akışkanın donma riski vardır. ',
      'Özellikle bayram tatilleri, hafta sonu tatilleri ve planlı bakım dönemleri gibi kulelerin uzun süre ',
      'kapalı kaldığı zaman aralıkları risklidir. Donma sebebiyle serpantin boruları çatlayabilir ve ciddi ',
      'hasarlar oluşabilir.',
    '</p>',

    '<p>Donma riskini azaltmak için uygulanabilecek başlıca yöntemler şunlardır:</p>',
    '<ul>',
      '<li>',
        '<strong>Eşanjörün boşaltılması:</strong> Soğutma prosesi uzun süreli durdurulacaksa, ',
        'eşanjördeki su boşaltma vanaları kullanılarak tamamen sistemden tahliye edilebilir.',
      '</li>',
      '<li>',
        '<strong>Düşük debide sirkülasyon:</strong> Proses dursa bile eşanjör içindeki akışkan düşük debide ',
        'sirküle edilerek hareketli tutulabilir; bu sayede lokal donma riski azaltılır.',
      '</li>',
      '<li>',
        '<strong>Antifriz kullanımı:</strong> Soğutma akışkanına etilen glikol vb. antifriz sıvısı eklenerek ',
        'donma noktası daha düşük sıcaklıklara çekilir ve donma riski önemli ölçüde azaltılır.',
      '</li>',
    '</ul>',

    '<h3>Kapalı Devre Soğutma Kulesinde Elektrik Tüketimi</h3>',
    '<p>',
      'Kapalı devre soğutma kulelerinde; fan motoru ve kule sirkülasyon pompası elektrik tüketimi oluşturur. ',
      'Ensotek tarafından tasarlanan kulelerde, fan ve pompa seçimi düşük elektrik tüketimi hedeflenerek yapılır; ',
      'böylece müşterilerimizin işletme maliyetleri minimize edilir.',
    '</p>',

    '<p>',
      'Kapalı çevrim su soğutma kuleleri, benzer kapasitedeki chiller gruplarına kıyasla birçok koşulda ',
      'yaklaşık <strong>8–10 kat daha düşük elektrik tüketimiyle</strong> çalışabilmektedir. ',
      'Bu sebeple, uygun proseslerde önemli enerji tasarrufu ve kısa geri ödeme süresi sağlar.',
    '</p>',

    '<p>',
      'Ayrıca, kapalı tip kulelerin çalışma prensibini gösteren şemalar ve animasyonlar, tasarım ve işletme ',
      'eğitimlerinde önemli bir görsel araç olarak kullanılabilir.',
    '</p>'
  ),
  'Kapalı çevrim su soğutma kulesi çalışma prensibi',
  'Kapalı devre su soğutma kulelerinin çalışma prensibi, buharlaşma kaybı, free cooling (kuru çalışma) imkânı, eşanjör donma riskine karşı önlemler ve enerji tüketimi hakkında teknik açıklamalar içeren doküman.',
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
  UUID(), @LIB_CT_CLOSED_ID, 'en',
  'Closed Circuit Cooling Tower Working Principle',
  'closed-circuit-cooling-tower-working-principle',
  'Technical note describing the working principle of closed circuit cooling towers, evaporation loss on the spray loop, free cooling operation and freeze protection methods for the coil heat exchanger.',
  CONCAT(
    '<h2>Closed Circuit Cooling Tower Working Principle</h2>',
    '<h3>How Do Closed Circuit Cooling Towers Work?</h3>',
    '<p>',
      'Closed circuit systems are preferred in applications where the process fluid is sensitive to contamination ',
      'and must remain clean. The process water to be cooled flows inside metal coils (heat exchanger tubes) ',
      'located within the cooling tower. The process fluid does not come into direct contact with ambient air.',
    '</p>',

    '<p>',
      'In a typical closed circuit cooling tower, hot process water enters the coil bundle and flows inside the tubes. ',
      'At the same time, the tower fan draws ambient air through the coil, and a circulation pump sprays water ',
      'from the basin over the external surface of the coil. The combination of air flow and spray water over the ',
      'tube surface removes heat from the process fluid inside the coil.',
    '</p>',

    '<h3>Is There Evaporation Loss in Closed Circuit Towers?</h3>',
    '<p>',
      'Although the process fluid circulates in a closed loop, the spray water that is pumped from the basin and ',
      'distributed over the coil is in direct contact with the air. Therefore, there is still an ',
      '<strong>evaporation loss on the spray water circuit</strong>. ',
      'The amount of evaporation depends on tower load, water temperatures and ambient conditions.',
    '</p>',

    '<h3>Can a Closed Circuit Tower Operate Like a Dry Cooler?</h3>',
    '<p>',
      'In cold seasons, closed circuit cooling towers can be operated with the spray water system shut off, ',
      'using only fan-driven air flow over the coils. In this mode, the tower works similarly to a ',
      '<strong>dry cooler</strong>, often referred to as <strong>free cooling</strong>. ',
      'Water consumption becomes negligible and chemical usage is significantly reduced.',
    '</p>',

    '<p>',
      'For effective dry cooler operation, the coil heat exchanger must be installed above the air inlet louvers, ',
      'directly in the air stream. In some market designs, the coil is located below the inlets; ',
      'in such configurations, the free cooling mode is much less effective.',
    '</p>',

    '<h3>How to Prevent Coil Freezing in Closed Circuit Towers?</h3>',
    '<p>',
      'During winter, when the cooling tower is stopped, the fluid inside the coil can freeze and damage the tubes. ',
      'This risk is particularly high during long shutdowns such as public holidays, weekends and maintenance periods.',
    '</p>',

    '<p>Several measures can be taken to reduce or eliminate the freezing risk:</p>',
    '<ul>',
      '<li>',
        '<strong>Draining the coil:</strong> If the cooling process will be stopped for an extended period, ',
        'the water in the coil can be completely drained through dedicated drain valves.',
      '</li>',
      '<li>',
        '<strong>Low-flow circulation:</strong> Even if the process is off, circulating the fluid at low flow rate ',
        'through the coil helps maintain movement and reduces local freezing risk.',
      '</li>',
      '<li>',
        '<strong>Use of antifreeze:</strong> Adding ethylene glycol or similar antifreeze to the process fluid ',
        'lowers the freezing point and provides robust freeze protection.',
      '</li>',
    '</ul>',

    '<h3>Power Consumption of Closed Circuit Cooling Towers</h3>',
    '<p>',
      'In closed circuit cooling towers, power consumption mainly comes from the fan motor and the spray ',
      'water circulation pump. Ensotek cooling towers are designed with energy-efficient fans and pumps to ',
      'minimize operating costs for the end user.',
    '</p>',

    '<p>',
      'Compared with chiller systems providing similar cooling capacity, closed circuit cooling towers can operate ',
      'with approximately <strong>8–10 times lower electrical energy consumption</strong> under many conditions. ',
      'This makes them an attractive solution for energy-efficient process and HVAC cooling.',
    '</p>',

    '<p>',
      'In addition, diagrams and animations showing the operating principle of closed circuit cooling towers ',
      'are very useful tools for design, commissioning and operator training.',
    '</p>'
  ),
  'Closed circuit cooling tower working principle',
  'Technical explanation of the working principle of closed circuit cooling towers, including spray water evaporation loss, free cooling operation, coil freeze protection and comparative energy consumption.',
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
