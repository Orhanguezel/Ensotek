-- =============================================================
-- FILE: src/db/seed/sql/101_library_seed_tr.sql
-- Ensotek - Library seed (TR) - base + i18n + images + files
--   - TR içerikler: Kullanıcının paylaştığı içerikler BİREBİR
--   - Idempotent: slug üzerinden id bul / yoksa deterministik ID kullan
--   - NOT: Bu dosya SADECE TR içerir (tags_json içinde EN yok)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- -------------------------------------------------------------
-- ثابت base id'ler (deterministik)
-- NOT: Idempotency için yine de slug ile lookup yapıyoruz.
-- Eğer DB'de ilgili slug zaten varsa, mevcut id kullanılacak.
-- -------------------------------------------------------------
SET @LIB_CT_BASICS          := '11111111-1111-1111-1111-111111111111';
SET @LIB_CT_FEATURES        := '22222222-2222-2222-2222-222222222222';
SET @LIB_OPEN_CIRCUIT       := '33333333-3333-3333-3333-333333333333';
SET @LIB_CLOSED_CIRCUIT     := '44444444-4444-4444-4444-444444444444';
SET @LIB_SELECTION          := '55555555-5555-5555-5555-555555555555';

SET @LIB_BROCHURE           := '66666666-6666-6666-6666-666666666666';
SET @LIB_SERVICE_GUIDE      := '77777777-7777-7777-7777-777777777777';
SET @LIB_TURKEY_SUMMER_TW   := '88888888-8888-8888-8888-888888888888';

-- -------------------------------------------------------------
-- Assets (library_images / library_files için zorunlu)
-- NOT: assets tablosunu 104 ile seed ediyorsan bu id'ler orada olmalı.
-- -------------------------------------------------------------
SET @ASSET_IMG_CT        := 'aaaaaaaa-0000-0000-0000-aaaaaaaa0001';
SET @ASSET_FILE_BROCHURE := 'bbbbbbbb-0000-0000-0000-bbbbbbbb0001';
SET @ASSET_FILE_GUIDE    := 'cccccccc-0000-0000-0000-cccccccc0001';

-- =============================================================
-- 1) PARENT: library
--    1.1 Su Soğutma Kulesi Nedir, Çeşitleri Nelerdir, Nasıl Çalışır?
-- =============================================================

SET @LIB_CT_BASICS_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'su-sogutma-kulesi-nedir-cesitleri-nelerdir-nasil-calisir'
  LIMIT 1
);
SET @LIB_CT_BASICS_ID := COALESCE(@LIB_CT_BASICS_ID, @LIB_CT_BASICS);

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

-- =============================================================
-- 1.2 Ensotek Soğutma Kulelerimizin Özellikleri
-- =============================================================

SET @LIB_CT_FEATURES_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'ensotek-sogutma-kulelerinin-ozellikleri'
  LIMIT 1
);
SET @LIB_CT_FEATURES_ID := COALESCE(@LIB_CT_FEATURES_ID, @LIB_CT_FEATURES);

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

-- =============================================================
-- 1.3 Açık Tip Su Soğutma Kulesi Çalışma Prensibi
-- =============================================================

SET @LIB_CT_OPEN_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'acik-tip-su-sogutma-kulesi-calisma-prensibi'
  LIMIT 1
);
SET @LIB_CT_OPEN_ID := COALESCE(@LIB_CT_OPEN_ID, @LIB_OPEN_CIRCUIT);

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

-- =============================================================
-- 1.4 Kapalı Çevrim Su Soğutma Kulesi Çalışma Prensibi
-- =============================================================

SET @LIB_CT_CLOSED_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'kapali-cevrim-su-sogutma-kulesi-calisma-prensibi'
  LIMIT 1
);
SET @LIB_CT_CLOSED_ID := COALESCE(@LIB_CT_CLOSED_ID, @LIB_CLOSED_CIRCUIT);

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
      '<li><strong>Eşanjörün boşaltılması:</strong> Soğutma prosesi uzun süreli durdurulacaksa, eşanjördeki su boşaltılarak tahliye edilebilir.</li>',
      '<li><strong>Düşük debide sirkülasyon:</strong> Akışkan düşük debide sirküle edilerek hareketli tutulabilir.</li>',
      '<li><strong>Antifriz kullanımı:</strong> Etilen glikol vb. eklenerek donma noktası düşürülebilir.</li>',
    '</ul>',

    '<h3>Kapalı Devre Soğutma Kulesinde Elektrik Tüketimi</h3>',
    '<p>',
      'Kapalı devre soğutma kulelerinde; fan motoru ve kule sirkülasyon pompası elektrik tüketimi oluşturur. ',
      'Ensotek tarafından tasarlanan kulelerde, fan ve pompa seçimi düşük elektrik tüketimi hedeflenerek yapılır.',
    '</p>',

    '<p>',
      'Kapalı çevrim su soğutma kuleleri, benzer kapasitedeki chiller gruplarına kıyasla birçok koşulda ',
      'yaklaşık <strong>8–10 kat daha düşük elektrik tüketimiyle</strong> çalışabilmektedir.',
    '</p>'
  ),
  'Kapalı çevrim su soğutma kulesi çalışma prensibi',
  'Kapalı devre su soğutma kulelerinin çalışma prensibi, buharlaşma kaybı, free cooling imkânı, donma riskine karşı önlemler ve enerji tüketimi hakkında teknik açıklamalar içeren doküman.',
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

-- =============================================================
-- 1.5 Kule Seçimi İçin Gerekli Bilgiler
-- =============================================================

SET @LIB_CT_SELECTION_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'kule-secimi-icin-gerekli-bilgiler'
  LIMIT 1
);
SET @LIB_CT_SELECTION_ID := COALESCE(@LIB_CT_SELECTION_ID, @LIB_SELECTION);

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

-- =============================================================
-- 2) PARENT: library (BROCHURE + SERVICE GUIDE)  [FK FIX]
-- =============================================================

SET @LIB_BROCHURE_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'ensotek-kurumsal-brosur'
  LIMIT 1
);
SET @LIB_BROCHURE_ID := COALESCE(@LIB_BROCHURE_ID, @LIB_BROCHURE);

INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json,
 category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(
  @LIB_BROCHURE_ID,
  1, 1, 90,
  '{
    "tr":["kurumsal broşür","ensotek broşür","pdf","katalog"]
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

INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_BROCHURE_ID, 'tr',
  'Kurumsal Broşür (PDF)',
  'ensotek-kurumsal-brosur',
  'Ensotek kurumsal broşür PDF dosyası.',
  CONCAT('<h2>Kurumsal Broşür (PDF)</h2>','<p>Ensotek kurumsal broşür PDF dosyası.</p>'),
  'Kurumsal Broşür (PDF)',
  'Ensotek kurumsal broşür PDF dosyası.',
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

SET @LIB_SERVICE_GUIDE_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'ensotek-hizmet-rehberi'
  LIMIT 1
);
SET @LIB_SERVICE_GUIDE_ID := COALESCE(@LIB_SERVICE_GUIDE_ID, @LIB_SERVICE_GUIDE);

INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json,
 category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(
  @LIB_SERVICE_GUIDE_ID,
  1, 1, 100,
  '{
    "tr":["hizmet rehberi","ensotek hizmet","pdf","rehber"]
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

INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_SERVICE_GUIDE_ID, 'tr',
  'Hizmet Rehberi (PDF)',
  'ensotek-hizmet-rehberi',
  'Ensotek hizmet rehberi PDF dosyası.',
  CONCAT('<h2>Hizmet Rehberi (PDF)</h2>','<p>Ensotek hizmet rehberi PDF dosyası.</p>'),
  'Hizmet Rehberi (PDF)',
  'Ensotek hizmet rehberi PDF dosyası.',
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

-- =============================================================
-- 3) images
-- =============================================================
SET @IMG_CT := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

INSERT INTO library_images
(id, library_id, asset_id, image_url, thumb_url, webp_url, display_order, is_active, created_at, updated_at)
VALUES
  (@IMG_CT, @LIB_CT_BASICS_ID, @ASSET_IMG_CT, NULL, NULL, NULL, 10, 1, NOW(3), NOW(3))

ON DUPLICATE KEY UPDATE
  asset_id      = VALUES(asset_id),
  image_url     = VALUES(image_url),
  thumb_url     = VALUES(thumb_url),
  webp_url      = VALUES(webp_url),
  display_order = VALUES(display_order),
  is_active     = VALUES(is_active),
  updated_at    = VALUES(updated_at);

INSERT INTO library_images_i18n
(id, image_id, locale, alt, caption, created_at, updated_at)
VALUES
  (UUID(), @IMG_CT, 'tr', 'Soğutma kulesi çalışma prensibi görseli', 'Soğutma kulesi temelleri', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  alt        = VALUES(alt),
  caption    = VALUES(caption),
  updated_at = VALUES(updated_at);

-- =============================================================
-- 4) files  [FK FIX: library_id parent ID kullanır]
-- =============================================================
SET @FILE_BROCHURE := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
SET @FILE_GUIDE    := 'cccccccc-cccc-cccc-cccc-cccccccccccc';

INSERT INTO library_files
(id, library_id, asset_id, file_url, name, size_bytes, mime_type, tags_json, display_order, is_active, created_at, updated_at)
VALUES
  (@FILE_BROCHURE, @LIB_BROCHURE_ID,      @ASSET_FILE_BROCHURE, 'https://cdn.example.com/library/ensotek-kurumsal-brosur.pdf', 'Ensotek Kurumsal Broşür', NULL, 'application/pdf', NULL, 10, 1, NOW(3), NOW(3)),
  (@FILE_GUIDE,    @LIB_SERVICE_GUIDE_ID, @ASSET_FILE_GUIDE,    'https://cdn.example.com/library/ensotek-hizmet-rehberi.pdf',  'Ensotek Hizmet Rehberi',  NULL, 'application/pdf', NULL, 10, 1, NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  asset_id      = VALUES(asset_id),
  file_url      = VALUES(file_url),
  name          = VALUES(name),
  size_bytes    = VALUES(size_bytes),
  mime_type     = VALUES(mime_type),
  tags_json     = VALUES(tags_json),
  display_order = VALUES(display_order),
  is_active     = VALUES(is_active),
  updated_at    = VALUES(updated_at);

INSERT INTO library_files_i18n (id, file_id, locale, title, description, created_at, updated_at)
VALUES
  (UUID(), @FILE_BROCHURE, 'tr', 'Kurumsal Broşür (PDF)', 'Ensotek kurumsal broşür PDF dosyası.', NOW(3), NOW(3)),
  (UUID(), @FILE_GUIDE,    'tr', 'Hizmet Rehberi (PDF)', 'Ensotek hizmet rehberi PDF dosyası.', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  title       = VALUES(title),
  description = VALUES(description),
  updated_at  = VALUES(updated_at);

COMMIT;
