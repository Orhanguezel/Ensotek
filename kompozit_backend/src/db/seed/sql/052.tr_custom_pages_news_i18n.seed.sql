-- =============================================================
-- FILE: 052.tr_custom_pages_news_i18n.seed.sql
-- Ensotek – NEWS i18n TÜRKÇE (tüm haberler)
-- Parent kayıtları → 052_custom_pages_news.seed.sql
-- =============================================================
-- İçerik:
--   22220001  Web Sitemiz Yenilendi
--   22220003  Egypt HVAC-R 2025
--   22220004  Aquatherm Bakü 2025
--   22220005  Hotel-Tech Antalya 2025
--   22220006  ALUEXPO 2025
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- i18n ID sabitleri (TR)
SET @I18N_WEB_TR         := '66662001-0001-4001-8001-666666662001';
SET @I18N_EGYPT_TR       := '66662003-0001-4001-8001-666666662003';
SET @I18N_BAKU_TR        := '66662004-0001-4001-8001-666666662004';
SET @I18N_HOTEL_TR       := '66662005-0001-4001-8001-666666662005';
SET @I18N_ALUEXPO_TR     := '66662006-0001-4001-8001-666666662006';

-- page ID sabitleri
SET @PAGE_WEB            := '22220001-2222-4222-8222-222222220001';
SET @PAGE_EGYPT          := '22220003-2222-4222-8222-222222220003';
SET @PAGE_BAKU           := '22220004-2222-4222-8222-222222220004';
SET @PAGE_HOTEL          := '22220005-2222-4222-8222-222222220005';
SET @PAGE_ALUEXPO        := '22220006-2222-4222-8222-222222220006';

-- =============================================================
-- i18n UPSERT — TÜRKÇE
-- =============================================================

INSERT INTO `custom_pages_i18n`
  (`id`, `page_id`, `locale`,
   `title`, `slug`, `content`, `summary`,
   `featured_image_alt`, `meta_title`, `meta_description`, `tags`,
   `created_at`, `updated_at`)
VALUES

-- ============================================================
-- 01 — Web Sitemiz Yenilendi
-- ============================================================
(
  @I18N_WEB_TR, @PAGE_WEB, 'tr',
  'Ensotek Web Sitemiz Yenilendi!',
  'ensotek-web-sitemiz-yenilendi',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-8">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Ensotek Web Sitemiz Yenilendi!</h1>',
        '<p class="text-slate-700 mb-4">',
          'Dijital dönüşüm vizyonumuz doğrultusunda, Ensotek web sitemizi tamamen yeniledik. ',
          'Yeni arayüzümüzle sizlere daha hızlı, modern ve etkileşimli bir kullanıcı deneyimi sunmayı hedefliyoruz.',
        '</p>',
        '<p class="text-slate-700 mb-4">',
          'Artık çok dilli altyapımızla global erişim sağlıyor, güncel haberlerimizi ve teknolojik gelişmelerimizi ',
          'daha kolay duyurabiliyoruz.',
        '</p>',
        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">Neler Değişti?</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Modern ve hızlı kullanıcı arayüzü</li>',
            '<li>Çok dilli içerik altyapısı (TR/EN/DE)</li>',
            '<li>Haberler ve duyurular için güçlendirilmiş içerik yönetimi</li>',
            '<li>Mobil uyumluluk ve SEO iyileştirmeleri</li>',
          '</ul>',
        '</div>',
      '</section>'
    )
  ),
  'Modern arayüz, çok dilli destek ve kullanıcı odaklı tasarımıyla yeni Ensotek web sitemiz yayında!',
  'Ensotek web sitesi yenilendi – duyuru görseli',
  'Ensotek Web Sitemiz Yenilendi! | Ensotek',
  'Ensotek web sitesi yenilendi: modern arayüz, çok dilli altyapı, daha hızlı ve etkileşimli deneyim.',
  'ensotek,web sitesi,yenilendi,duyuru,çok dilli,etkileşim',
  NOW(3), NOW(3)
),

-- ============================================================
-- 02 — Egypt HVAC-R 2025
-- ============================================================
(
  @I18N_EGYPT_TR, @PAGE_EGYPT, 'tr',
  'Mısır HVAC-R Fuarını Başarıyla Tamamladık!',
  'misir-hvacr-fuarini-basarili-tamamladik',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Mısır HVAC-R Fuarını Başarıyla Tamamladık!</h1>',
          '<p class="text-slate-700 mb-5">',
            'ENSOTEK olarak Egypt HVAC-R 2025 Fuarı''nı başarıyla tamamlamanın gururunu yaşıyoruz. ',
            'Fuar boyunca soğutma kuleleri ve endüstriyel soğutma çözümlerimiz hakkında ziyaretçilerimize detaylı bilgi sunduk.',
          '</p>',
          '<p class="text-slate-700 mb-5">',
            'Kahire, İskenderiye ve farklı şehirlerden gelen profesyonellerle bir araya gelerek; ',
            'proje ihtiyaçlarını dinledik, uygulama senaryolarını değerlendirdik ve yeni iş birlikleri için güçlü bir zemin oluşturduk.',
          '</p>',
          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Öne Çıkan Başlıklar</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Yeni proje görüşmeleri ve teknik ön değerlendirmeler</li>',
                '<li>Verimlilik ve enerji optimizasyonu odağında sunumlar</li>',
                '<li>Ürün gamımızın farklı sektörlerdeki uygulamaları</li>',
                '<li>İhracat ağımızı büyüten yeni bağlantılar</li>',
              '</ul>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Sırada Ne Var?</h2>',
              '<p class="text-slate-700">',
                'Fuar sonrası süreçte, standımızda görüşme yaptığımız firmalarla teknik doküman paylaşımı ve keşif planlamaları ',
                'başlattık. Çözümlerimizi yerinde analiz ederek en doğru sistemi tasarlamayı hedefliyoruz.',
              '</p>',
            '</div>',
          '</div>',
          '<div class="bg-slate-900 text-white rounded-2xl p-6 mb-6">',
            '<h2 class="text-xl font-semibold mb-2">Teşekkürler</h2>',
            '<p class="text-white/90">',
              'Standımızı ziyaret eden tüm misafirlerimize ve iş ortaklarımıza içten teşekkür ederiz. ',
              'ENSOTEK olarak global çözümler sunmaya ve sürdürülebilir büyümeyi desteklemeye devam edeceğiz.',
            '</p>',
          '</div>',
          '<p class="text-slate-700">',
            'Daha fazla bilgi için ',
            '<a class="text-slate-900 underline" href="https://www.hvacrexpo.com.eg/" target="_blank" rel="noopener noreferrer">Egypt HVAC-R Fuarı web sitesi</a>',
            ' adresini ziyaret edebilirsiniz.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Mısır HVAC-R 2025 Fuarı''nda standımıza gösterilen yoğun ilgi için teşekkür ederiz. Kahire, İskenderiye ve farklı şehirlerden gelen tüm ziyaretçilerimizle verimli görüşmeler gerçekleştirdik.',
  'Egypt HVAC-R 2025 fuarında ENSOTEK standı ve ziyaretçiler',
  'Mısır HVAC-R 2025 Fuarını Başarıyla Tamamladık! | Ensotek',
  'ENSOTEK, Egypt HVAC-R 2025 Fuarı''nı başarıyla tamamladı. Soğutma kuleleri ve endüstriyel çözümlerimizle ziyaretçilerle buluştuk; yeni iş bağlantıları kurduk.',
  'ensotek,fuar,misir,hvacr,etkinlik,sogutma kuleleri,duyuru,uluslararasi',
  '2025-07-19 17:20:06.428', '2025-07-19 20:49:51.752'
),

-- ============================================================
-- 03 — Aquatherm Bakü 2025
-- ============================================================
(
  @I18N_BAKU_TR, @PAGE_BAKU, 'tr',
  'Aquatherm Bakü Fuarını Başarıyla Tamamladık!',
  'aquatherm-baku-fuarini-basarili-tamamladik',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Aquatherm Bakü Fuarını Başarıyla Tamamladık!</h1>',
          '<p class="text-slate-700 mb-5">',
            'ENSOTEK olarak Aquatherm Bakü 2025 Fuarı''nı başarıyla tamamladık. ',
            'Fuarda yenilikçi çözümlerimiz yoğun ilgi gördü; teknik toplantılar gerçekleştirdik ve farklı sektörlerden profesyonellerle bir araya geldik.',
          '</p>',
          '<p class="text-slate-700 mb-5">',
            'Bakü''de hem yeni iş bağlantıları kurduk hem de mevcut müşterilerimizle proje süreçlerine ilişkin değerlendirmeler yapma fırsatı yakaladık. ',
            'Bölgesel ihtiyaçlara uygun çözümlerimizi sahada anlatmak, bizim için önemli bir kazanım oldu.',
          '</p>',
          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Fuar Notları</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Yeni potansiyel proje görüşmeleri ve keşif planlamaları</li>',
                '<li>Ürün performansı ve verimlilik odağında teknik anlatımlar</li>',
                '<li>Çözüm odaklı yaklaşım: tasarım, üretim ve servis süreçleri</li>',
                '<li>Bölgesel partnerlikler için stratejik adımlar</li>',
              '</ul>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Sonraki Adımlar</h2>',
              '<p class="text-slate-700">',
                'Fuar sonrası, görüşmelerimizi teknik doküman paylaşımı ve teklif sürecine taşıyoruz. ',
                'Hedefimiz; sahaya uygun, ölçülebilir performans çıktıları sağlayan sistemleri hızlıca devreye almak.',
              '</p>',
            '</div>',
          '</div>',
          '<div class="bg-slate-900 text-white rounded-2xl p-6 mb-6">',
            '<h2 class="text-xl font-semibold mb-2">Teşekkürler</h2>',
            '<p class="text-white/90">',
              'Standımızı ziyaret eden tüm misafirlerimize, değerli müşterilerimize ve Bakü''deki temsilcilerimize teşekkür ederiz. ',
              'ENSOTEK olarak uluslararası platformlarda ülkemizi ve sektörümüzü en iyi şekilde temsil etmeye devam edeceğiz.',
            '</p>',
          '</div>',
          '<p class="text-slate-700">',
            'Daha fazla bilgi için ',
            '<a class="text-slate-900 underline" href="https://www.aquatherm.az/" target="_blank" rel="noopener noreferrer">Aquatherm Bakü Fuarı web sitesi</a>',
            ' adresini ziyaret edebilirsiniz.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Aquatherm Bakü 2025 Fuarı''nda büyük ilgiyle karşılandık. Standımızı ziyaret eden değerli müşterilerimize ve Bakü''deki temsilcilerimize teşekkür ederiz.',
  'Aquatherm Bakü 2025 fuarında ENSOTEK standı ve ziyaretçiler',
  'Aquatherm Bakü 2025 Fuarını Başarıyla Tamamladık! | Ensotek',
  'ENSOTEK, Aquatherm Bakü 2025 Fuarı''ndaki başarılı katılımını tamamladı. Yenilikçi çözümlerimizi tanıttık; yeni bağlantılar kurduk ve mevcut müşterilerimizle buluştuk.',
  'ensotek,fuar,aquatherm,baku,bakü,etkinlik,uluslararasi,duyuru',
  '2025-07-19 17:20:06.428', '2025-07-19 20:51:33.294'
),

-- ============================================================
-- 04 — Hotel-Tech Antalya 2025
-- ============================================================
(
  @I18N_HOTEL_TR, @PAGE_HOTEL, 'tr',
  'Hotel-Tech Antalya Fuarını Başarıyla Tamamladık!',
  'hotel-tech-antalya-fuarini-basarili-tamamladik',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Hotel-Tech Antalya Fuarını Başarıyla Tamamladık!</h1>',
          '<p class="text-slate-700 mb-5">',
            '<strong>Hotel-Tech Antalya</strong> fuarı kapsamında; otel, resort ve konaklama tesislerinin ',
            'teknik altyapı ihtiyaçlarına yönelik çözümlerimizi ziyaretçilerimizle buluşturduk. ',
            'Saha ihtiyaçlarını dinleyerek, farklı tesis tiplerine göre uygulanabilir senaryoları değerlendirdik.',
          '</p>',
          '<p class="text-slate-700 mb-5">',
            'Fuar boyunca gerçekleştirdiğimiz <strong>B2B görüşmeler</strong> ile yeni iş bağlantıları kurduk; ',
            'mevcut iş ortaklarımızla da proje süreçlerini ve teknik gereksinimleri detaylandıran verimli toplantılar yaptık. ',
            'Çözüm yaklaşımımızı "tasarım + üretim + devreye alma + servis" ekseninde anlattık.',
          '</p>',
          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Öne Çıkanlar</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Otel teknik altyapıları için uçtan uca çözüm yaklaşımı</li>',
                '<li>İşletme verimliliğini artıran mühendislik odaklı öneriler</li>',
                '<li>B2B toplantılar: ihtiyaç analizi ve proje ön değerlendirme</li>',
                '<li>Yeni teknoloji ve ürün tanıtımları</li>',
              '</ul>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Sonraki Adımlar</h2>',
              '<p class="text-slate-700">',
                'Fuar sonrası süreçte, görüşmelerimizi teknik doküman paylaşımı ve teklif çalışmalarına taşıyoruz. ',
                'Hedefimiz; tesisin ihtiyacına uygun, ölçülebilir performans çıktıları sunan sistemleri doğru mühendislikle konumlandırmak.',
              '</p>',
            '</div>',
          '</div>',
          '<div class="bg-slate-900 text-white rounded-2xl p-6 mb-6">',
            '<h2 class="text-xl font-semibold mb-2">Teşekkürler</h2>',
            '<p class="text-white/90">',
              'Standımızı ziyaret eden tüm misafirlerimize ve iş ortaklarımıza teşekkür ederiz. ',
              'ENSOTEK olarak sektörde sürdürülebilir çözümler sunmaya ve uluslararası iş birliklerimizi güçlendirmeye devam edeceğiz.',
            '</p>',
          '</div>',
          '<p class="text-slate-700">',
            'Fuar web sitesi için ',
            '<a class="text-slate-900 underline" href="https://www.hoteltechantalya.com/" target="_blank" rel="noopener noreferrer">buraya tıklayınız</a>.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Hotel-Tech Antalya Fuarı''nı başarıyla tamamladık. Standımızı ziyaret eden tüm müşterilerimize ve iş ortaklarımıza teşekkür ederiz.',
  'Hotel-Tech Antalya fuarında ENSOTEK standı ve ziyaretçiler',
  'Hotel-Tech Antalya Fuarını Başarıyla Tamamladık! | Ensotek',
  'ENSOTEK, Hotel-Tech Antalya fuar katılımını başarıyla tamamladı. Otel ve tesislerin teknik ihtiyaçlarına yönelik çözümler, B2B görüşmeler ve yeni teknolojiler öne çıktı.',
  'ensotek,fuar,hotel-tech,antalya,etkinlik,teknoloji,duyuru,b2b,otel',
  '2025-07-19 17:20:06.428', '2025-07-19 20:53:23.466'
),

-- ============================================================
-- 05 — ALUEXPO 2025
-- ============================================================
(
  @I18N_ALUEXPO_TR, @PAGE_ALUEXPO, 'tr',
  'ALUEXPO 2025 – Uluslararası Alüminyum Fuarına Katılıyoruz!',
  'aluexpo-2025-uluslararasi-aluminyum-fuarina-katiliyoruz',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">ALUEXPO 2025 – Uluslararası Alüminyum Fuarına Katılıyoruz!</h1>',
          '<p class="text-slate-700 mb-5">',
            '<strong>ALUEXPO 2025</strong> kapsamında; <strong>18–20 Eylül 2025</strong> tarihlerinde ',
            '<strong>İstanbul Fuar Merkezi</strong>''nde, <strong>2. Salon</strong> <strong>E155</strong> nolu standımızda sizleri bekliyoruz.',
          '</p>',
          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Online Davetiye</h2>',
              '<p class="text-slate-700 mb-2">Ziyaretçi kaydınızı online olarak oluşturabilirsiniz:</p>',
              '<p class="text-slate-700">',
                '<a class="text-slate-900 underline" href="https://aluexpo.com/visitor-register-form" target="_blank" rel="noopener noreferrer">',
                  'ALUEXPO Ziyaretçi Kaydı',
                '</a>',
              '</p>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Stand Bilgisi</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>İstanbul Fuar Merkezi</li>',
                '<li>2. Salon</li>',
                '<li>Stand: E155</li>',
                '<li>Tarih: 18–20 Eylül 2025</li>',
              '</ul>',
            '</div>',
          '</div>',
          '<p class="text-slate-700 mb-5">',
            'Fuar; alüminyumun üretim ve işleme süreçlerini uçtan uca kapsayan kapsamlı bir etkinliktir. ',
            'Ergitme, döküm, ısıl işlem, yeniden ısıtma teknolojileri, endüstri 4.0, geri dönüşüm ile test ve ölçüm teknolojileri gibi başlıklarda ',
            'sektör profesyonellerini bir araya getirir.',
          '</p>',
          '<div class="bg-slate-900 text-white rounded-2xl p-6">',
            '<p class="text-white/90">',
              '<strong>Sizleri standımıza bekliyoruz.</strong> Projelerinizi konuşmak ve ihtiyaçlarınıza uygun çözümleri paylaşmak için bizimle görüşebilirsiniz.',
            '</p>',
          '</div>',
        '</div>',
      '</section>'
    )
  ),
  'ALUEXPO 2025 Fuarı''na katılıyoruz. 18-20 Eylül 2025 tarihlerinde İstanbul Fuar Merkezi''nde 2. Salon E155 nolu standımızda sizleri bekliyoruz.',
  'ALUEXPO 2025 duyurusu – Ensotek standı (İFM, Hall 2, E155)',
  'ALUEXPO 2025 | Ensotek – Fuar Katılım Duyurusu',
  'ENSOTEK, ALUEXPO 2025 Uluslararası Alüminyum Fuarı''na katılıyor. 18–20 Eylül 2025 tarihlerinde İstanbul Fuar Merkezi, 2. Salon, E155 standında buluşalım.',
  'ensotek,fuar,aluminyum,etkinlik,aluexpo,2025,istanbul,duyuru,stand e155',
  '2025-07-19 17:20:06.428', '2025-07-19 20:46:40.260'
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
