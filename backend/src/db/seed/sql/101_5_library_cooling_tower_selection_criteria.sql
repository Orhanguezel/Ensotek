-- =============================================================
-- 101_5_library_cooling_tower_selection_criteria.sql
-- Kule Seçimi İçin Gerekli Bilgiler
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

-- Kule Seçimi İçin Gerekli Bilgiler
SET @LIB_CT_SELECTION_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'kule-secimi-icin-gerekli-bilgiler'
  LIMIT 1
);
SET @LIB_CT_SELECTION_ID := COALESCE(@LIB_CT_SELECTION_ID, UUID());

INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json,
 category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(
  @LIB_CT_SELECTION_ID,
  1, 1, 80,
  '{
    "tr":[
      "kule seçimi",
      "soğutma kulesi tasarımı",
      "kule kapasitesi",
      "soğutulacak su miktarı",
      "yaş termometre sıcaklığı",
      "kuru termometre sıcaklığı",
      "iklim verisi"
    ],
    "en":[
      "cooling tower selection",
      "cooling tower sizing",
      "tower capacity",
      "water flow rate",
      "wet-bulb temperature",
      "dry-bulb temperature",
      "climate design data"
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
  UUID(), @LIB_CT_SELECTION_ID, 'tr',
  'Kule Seçimi İçin Gerekli Bilgiler',
  'kule-secimi-icin-gerekli-bilgiler',
  'Su soğutma kulesi seçimi ve tasarımı için gereken temel kapasite ve iklim bilgilerinin, yaş/kuru termometre değerlerinin ve dikkat edilmesi gereken hususların özetlendiği teknik doküman.',
  CONCAT(
    '<h2>Kule Seçimi İçin Gerekli Bilgiler</h2>',
    '<p>',
      'Su soğutma kuleleri, aksi özel talep olmadığı sürece, <strong>en sıcak yaz günlerine ait meteorolojik ',
      'tasarım şartlarına</strong> göre seçilir. Doğru kule seçimi; kapasite, iklim verisi ve proses tarafı ',
      'şartlarının birlikte değerlendirilmesini gerektirir.',
    '</p>',

    '<h3>Temel Girdiler – Zorunlu Bilgiler</h3>',
    '<p>Bir su soğutma kulesi seçimi veya tasarımı için aşağıdaki temel bilgilerin net olarak verilmesi gerekir:</p>',
    '<ul>',
      '<li><strong>Soğutulacak su miktarı (Debi)</strong>: m³/h veya kapasite (kcal/h, kW)</li>',
      '<li><strong>Kuleye girecek suyun sıcaklığı</strong> (sıcak su sıcaklığı, °C)</li>',
      '<li><strong>Kuleden çıkacak soğutulmuş su sıcaklığı</strong> (soğuk su sıcaklığı, °C)</li>',
      '<li><strong>Bulunulan ile ait yaş termometre (wet-bulb) değeri</strong> (°C)</li>',
    '</ul>',

    '<p>',
      'Bu dört parametre; kule kapasitesinin, kule yaklaşım değerinin (approach) ve kule tipinin belirlenmesi için ',
      'ana girdi olarak kullanılır. Yaş termometre sıcaklığı, özellikle evaporatif soğutma yapan kuleler için ',
      'en kritik iklim verisidir.',
    '</p>',

    '<h3>Yardımcı Bilgiler (Tasarımı İyileştiren Ek Veriler)</h3>',
    '<p>',
      'Aşağıdaki veriler, kule tasarımını optimize etmek ve doğru ekipman seçimini kolaylaştırmak için önemli ',
      'yardımcı bilgilerdir:',
    '</p>',
    '<ul>',
      '<li><strong>Soğutma suyunun kullanıldığı tesis</strong> (proses tipi, sektör, HVAC vb.)</li>',
      '<li><strong>Sirkülasyon suyunun kalitesi</strong> (kirlilik miktarı, yağ, tufal, kireçlenme eğilimi, partikül)</li>',
      '<li><strong>Bölgeye ait kuru termometre (dry-bulb) değeri</strong> (°C)</li>',
      '<li><strong>Deniz seviyesine göre yükseklik</strong> (rakım, m)</li>',
    '</ul>',

    '<p>',
      'Tesis tipi ve su kalitesi; kule tipinin (açık/kapalı devre), dolgu tipinin (PVC petek, PP bigudi, grid dolgu vb.) ',
      've malzeme seçiminin (CTP, galvaniz, paslanmaz vb.) belirlenmesinde doğrudan etkilidir. ',
      'Kuru termometre ve rakım bilgisi ise, bölgesel iklim kondisyonunun daha doğru modellenmesini sağlar.',
    '</p>',

    '<h3>Su Soğutma Kulesi Talebinde Dikkat Edilecek Hususlar</h3>',
    '<p>',
      'Kule teklif ve talep aşamasında sık yapılan hata, sadece kapasite değeri (örneğin sadece kW veya kcal/h) ',
      'bildirilmesidir. Bu yaklaşım, sağlıklı bir kule seçimi için yetersizdir.',
    '</p>',

    '<ul>',
      '<li>',
        '<strong>Kule talebi yalnızca kapasite bildirilerek yapılmamalıdır.</strong> ',
        'Kapasite ile birlikte mutlaka su debisi ve sıcaklıklar verilmelidir.',
      '</li>',
      '<li>',
        '<strong>Kulede dolaşacak su debisi</strong> (m³/h) ile ',
        '<strong>kuleye giren ve çıkan su sıcaklıkları</strong> (sıcak/soğuk su sıcaklıkları) açıkça belirtilmelidir.',
      '</li>',
      '<li>',
        '<strong>En kritik husus</strong>; soğutulmuş su sıcaklığının, ortam yaş termometre sıcaklığına ',
        'yaklaşım değeridir (approach). Aynı kule gövdesi ile; ',
        'su debisi, su giriş-çıkış sıcaklık farkı ve yaklaşım değeri değiştirilerek çok farklı kapasitelere ',
        'ulaşmak mümkündür.',
      '</li>',
    '</ul>',

    '<p>',
      'Bu nedenle, doğru tasarım için; debi, sıcak su sıcaklığı, soğuk su sıcaklığı ve ',
      'yaş termometre sıcaklığı dörtlüsü, proje veya teklif talebinde mutlaka netleştirilmelidir. ',
      'İlgili ile/şehir için <strong>yaz kuru ve yaş termometre tasarım değerleri tablosu</strong> de ',
      'kule seçim çalışmasına eklenmelidir.',
    '</p>'
  ),
  'Kule seçimi için gerekli bilgiler',
  'Su soğutma kulesi seçimi için gerekli debi, sıcaklıklar, yaş/kuru termometre ve diğer tasarım parametrelerini açıklayan teknik doküman.',
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
  UUID(), @LIB_CT_SELECTION_ID, 'en',
  'Required Data for Cooling Tower Selection',
  'required-data-for-cooling-tower-selection',
  'Technical note summarizing the basic process and climate information required for cooling tower selection and design, including water flow rate, temperatures and wet-/dry-bulb design data.',
  CONCAT(
    '<h2>Required Data for Cooling Tower Selection</h2>',
    '<p>',
      'Unless otherwise specified, cooling towers are normally selected based on the ',
      '<strong>meteorological design conditions of the hottest summer days</strong>. ',
      'Proper tower selection requires a consistent set of process and climate design data.',
    '</p>',

    '<h3>Basic Inputs – Mandatory Information</h3>',
    '<p>The following basic information must be clearly defined to select and design a cooling tower:</p>',
    '<ul>',
      '<li><strong>Water flow rate to be cooled</strong>: m³/h, or thermal load (kcal/h, kW)</li>',
      '<li><strong>Hot water temperature entering the tower</strong> (°C)</li>',
      '<li><strong>Cold water temperature leaving the tower</strong> (°C)</li>',
      '<li><strong>Summer design wet-bulb temperature for the site/city</strong> (°C)</li>',
    '</ul>',

    '<p>',
      'These four parameters are the main inputs to determine the tower capacity, the approach to wet-bulb, ',
      'and the appropriate tower type. The wet-bulb temperature is the most critical climate parameter ',
      'for evaporative cooling towers.',
    '</p>',

    '<h3>Additional Data (Helpful for Optimized Design)</h3>',
    '<p>',
      'The following information is also very useful for optimizing the design and choosing the most suitable ',
      'tower configuration:',
    '</p>',
    '<ul>',
      '<li><strong>Type of plant and process</strong> where the cooling water will be used (process industry, HVAC, etc.)</li>',
      '<li><strong>Quality of the circulating water</strong> (contamination level, oil, scale, solids, fouling tendency)</li>',
      '<li><strong>Summer design dry-bulb temperature</strong> (°C) for the region</li>',
      '<li><strong>Site elevation above sea level</strong> (m)</li>',
    '</ul>',

    '<p>',
      'The plant type and water quality influence the choice of tower type (open / closed circuit), ',
      'fill type (film fill, splash fill, PP grid, etc.) and construction materials (FRP, galvanized steel, stainless steel, etc.). ',
      'Dry-bulb temperature and elevation are important for defining the local climate conditions more accurately.',
    '</p>',

    '<h3>Points to Consider When Requesting a Cooling Tower</h3>',
    '<p>',
      'A common mistake during inquiry and quotation phases is to specify only a nominal capacity ',
      '(for example, only kW or kcal/h) without providing the associated temperatures and flow rate. ',
      'This is not sufficient for a reliable tower selection.',
    '</p>',

    '<ul>',
      '<li>',
        '<strong>The tower request should not be based on capacity alone.</strong> ',
        'The circulating water flow rate and temperatures must also be specified.',
      '</li>',
      '<li>',
        '<strong>The water flow rate through the tower</strong> (m³/h) and the ',
        '<strong>hot and cold water temperatures</strong> (tower inlet and outlet temperatures) ',
        'must be clearly stated.',
      '</li>',
      '<li>',
        '<strong>The most critical parameter</strong> is the approach of the cold water temperature to the ',
        'ambient <strong>wet-bulb temperature</strong>. By changing the water flow rate, the hot–cold temperature ',
        'difference (range) and the approach value, very different capacities can be obtained from the same ',
        'physical tower size.',
      '</li>',
    '</ul>',

    '<p>',
      'Therefore, for a proper design, the combination of flow rate, hot water temperature, cold water temperature ',
      'and design wet-bulb temperature must always be clarified in the project specification or inquiry. ',
      'A <strong>summer dry- and wet-bulb design temperature table</strong> for the relevant city or region ',
      'should also be attached to the cooling tower selection study.',
    '</p>'
  ),
  'Required data for cooling tower selection',
  'Technical document explaining the required flow, temperatures and wet-/dry-bulb design data, as well as key considerations when requesting a cooling tower.',
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
