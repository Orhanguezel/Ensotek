-- =============================================================
-- 232_projects_i18n_tr.sql
-- Ensotek proje i18n kayıtları — TÜRKÇE (tr)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

INSERT INTO `projects_i18n`
(
  id, project_id, locale,
  title, slug, summary, content,
  featured_image_alt, meta_title, meta_description,
  created_at, updated_at
)
VALUES

-- 1. İstanbul Plaza — CTP Kaportalı, 2 adet, 2 fanlı, 130m
(
  '44444001-0001-4444-8444-444400000001',
  '33333001-0001-4333-8333-333300000001',
  'tr',
  'İstanbul Plaza Çatısı — 2 Adet CTP Kaportalı Açık Tip Su Soğutma Kulesi',
  'istanbul-plaza-catisi-ctp-kapotali-acik-tip-su-sogutma-kulesi',
  'İstanbul\'da 130 metre yüksekliğindeki bir plaza binasının çatısına 2 adet, 2 fanlı CTP Kaportalı Açık Tip su soğutma kulesi başarıyla monte edildi.',
  '{"html":"<p>ENSOTEK İstanbul Fabrikasında üretilen <strong>CTP Kaportalı; 2 adet, 2 fanlı Açık Tip Su Soğutma Kuleleri</strong>, İstanbul\'da 130 metre yüksekliğe sahip bir plaza binasının çatısına başarıyla monte edilmiştir.</p><p>Projenin gerçekleştirildiği bina, şehir merkezinde yüksek katlı bir ticari yapıdır. Soğutma kuleleri, binanın iklimlendirme ve proses soğutma ihtiyacını karşılamak üzere özel olarak projelendirilmiş ve imal edilmiştir.</p><h3>Proje Özellikleri</h3><ul><li>Ürün tipi: CTP Kaportalı Açık Tip Su Soğutma Kulesi</li><li>Adet: 2 ünite</li><li>Fan sayısı: Ünite başına 2 fan</li><li>Kurulum yüksekliği: 130 metre (çatı montajı)</li><li>Üretim tesisi: ENSOTEK İstanbul Fabrikası</li></ul><p>FRP (Cam Elyaf Takviyeli Polyester) gövde yapısı sayesinde kuleler, çevre koşullarına karşı üstün dayanıklılık göstermekte ve uzun yıllar sorunsuz hizmet vermektedir.</p>","description":"İstanbul plaça çatısına 2 adet 2 fanlı CTP Kaportalı açık tip su soğutma kulesi montajı."}',
  'İstanbul Plaza Çatısı — CTP Kaportalı Açık Tip Su Soğutma Kulesi Montajı',
  'İstanbul Plaza Çatısı CTP Su Soğutma Kulesi — ENSOTEK',
  'İstanbul\'da 130 metre yüksekliğindeki plaza çatısına 2 adet 2 fanlı CTP Kaportalı Açık Tip su soğutma kulesi montajı. ENSOTEK Türkiye.',
  NOW(3), NOW(3)
),

-- 2. Kahramanmaraş — CTP Kaportalı Açık Tip
(
  '44444001-0002-4444-8444-444400000002',
  '33333001-0002-4333-8333-333300000002',
  'tr',
  'Kahramanmaraş Sanayi Tesisi — CTP Kaportalı Açık Tip Su Soğutma Kulesi',
  'kahramanmaras-sanayi-tesisi-ctp-kapotali-acik-tip-su-sogutma-kulesi',
  'ENSOTEK Ankara Fabrikasında üretilen CTP Kaportalı Açık Tip su soğutma kuleleri Kahramanmaraş\'ta faaliyet gösteren sanayi tesisine başarıyla teslim edildi.',
  '{"html":"<p>ENSOTEK <strong>Ankara Fabrikasında üretilen CTP Kaportalı Açık Tip Su Soğutma Kuleleri</strong>, Kahramanmaraş\'ta faaliyet gösteren bir sanayi tesisi için başarıyla imal edilmiş ve devreye alınmıştır.</p><p>Ankara\'daki üretim tesisimiz, Türkiye\'nin en büyük su soğutma kulesi üretim kapasitesine sahip olup; CTP imalatı, serpantin üretimi ve montaj süreçlerinin tamamı kendi bünyemizde gerçekleştirilmektedir.</p><h3>Proje Özellikleri</h3><ul><li>Ürün tipi: CTP Kaportalı Açık Tip Su Soğutma Kulesi</li><li>Üretim tesisi: ENSOTEK Ankara Fabrikası</li><li>Lokasyon: Kahramanmaraş</li><li>Uygulama: Endüstriyel proses soğutma</li></ul><p>ENSOTEK olarak her projede, müşterilerimizin ihtiyaçlarına özel çözümler sunmakta; tasarımdan üretime, montajdan işletmeye kadar tüm süreçlerde yanlarında olmaktayız.</p>","description":"Kahramanmaraş sanayi tesisi için Ankara Fabrika yapımı CTP Kaportalı Açık Tip su soğutma kulesi projesi."}',
  'Kahramanmaraş — CTP Kaportalı Açık Tip Su Soğutma Kulesi',
  'Kahramanmaraş Sanayi Tesisi Su Soğutma Kulesi — ENSOTEK',
  'ENSOTEK Ankara Fabrikası yapımı CTP Kaportalı Açık Tip su soğutma kuleleri Kahramanmaraş sanayi tesisine teslim edildi.',
  NOW(3), NOW(3)
),

-- 3. Arçelik — 2× CTP 6C
(
  '44444001-0003-4444-8444-444400000003',
  '33333001-0003-4333-8333-333300000003',
  'tr',
  'Arçelik — 2 Adet CTP 6C Açık Tip Su Soğutma Kulesi',
  'arcelik-ctp-6c-acik-tip-su-sogutma-kulesi',
  'Türkiye\'nin önde gelen elektronik ve dayanıklı tüketim malları üreticisi Arçelik\'in üretim tesisine 2 adet CTP 6C model açık tip su soğutma kulesi temin edildi.',
  '{"html":"<p>Türkiye\'nin köklü sanayi kuruluşlarından <strong>Arçelik A.Ş.</strong> bünyesindeki üretim tesisi için <strong>2 adet CTP 6C model Açık Tip Su Soğutma Kulesi</strong> tasarlanmış, üretilmiş ve devreye alınmıştır.</p><h3>Uygulama Detayları</h3><ul><li>Model: CTP 6C (Açık Devre)</li><li>Adet: 2 ünite</li><li>Lokasyon: Gebze, Kocaeli</li><li>Sektör: Dayanıklı Tüketim / Elektronik Üretim</li></ul><h3>CTP 6C Özellikleri</h3><p>CTP 6C, orta-büyük kapasiteli açık devre su soğutma kulesidir. FRP gövde yapısı; korozyona, UV radyasyona ve kimyasal etkilere karşı yüksek direnç göstermektedir.</p>","description":"Arçelik üretim tesisi için 2 adet CTP 6C model açık tip su soğutma kulesi projesi — Gebze, Kocaeli."}',
  'Arçelik Tesisi — 2 Adet CTP 6C Su Soğutma Kulesi',
  'Arçelik CTP 6C Su Soğutma Kulesi Projesi — ENSOTEK',
  'Arçelik üretim tesisi için ENSOTEK tarafından 2 adet CTP 6C model açık tip su soğutma kulesi temin edildi. Gebze, Kocaeli.',
  NOW(3), NOW(3)
),

-- 4. Eczacıbaşı — 3× DCTP 5C
(
  '44444001-0004-4444-8444-444400000004',
  '33333001-0004-4333-8333-333300000004',
  'tr',
  'Eczacıbaşı — 3 Adet DCTP 5C Kapalı Devre Su Soğutma Kulesi',
  'eczacibasi-dctp-5c-kapali-devre-su-sogutma-kulesi',
  'Türkiye\'nin köklü ilaç ve kimya grubu Eczacıbaşı\'nın tesisine 3 adet DCTP 5C model kapalı devre su soğutma kulesi kuruldu.',
  '{"html":"<p><strong>Eczacıbaşı</strong> bünyesindeki üretim tesisi için <strong>3 adet DCTP 5C model Kapalı Devre Su Soğutma Kulesi</strong> sistemi devreye alınmıştır.</p><h3>Proje Detayları</h3><ul><li>Model: DCTP 5C (Kapalı Devre)</li><li>Adet: 3 ünite</li><li>Lokasyon: İstanbul</li><li>Sektör: İlaç / Kimya</li></ul><h3>Kapalı Devre Soğutmanın Avantajları</h3><p>İlaç ve kimya sektöründe süreç sıvısının dış ortamdan izole edilmesi kritik önem taşır. DCTP 5C modelinde kullanılan serpantinli ısı değiştirici sistemi, proses sıvısının soğutma suyu ile hiçbir zaman temas etmemesini sağlar. Bu sayede ürün kalitesi ve hijyen koşulları korunur.</p>","description":"Eczacıbaşı ilaç tesisi için 3 adet DCTP 5C kapalı devre su soğutma kulesi projesi — İstanbul."}',
  'Eczacıbaşı — 3 Adet DCTP 5C Kapalı Devre Soğutma Kulesi',
  'Eczacıbaşı DCTP 5C Kapalı Devre Su Soğutma Kulesi — ENSOTEK',
  'Eczacıbaşı ilaç tesisi için ENSOTEK tarafından 3 adet DCTP 5C kapalı devre su soğutma kulesi kuruldu. İstanbul.',
  NOW(3), NOW(3)
),

-- 5. Linde Gaz — TCTP 26B + DCTP 12C — Gebze
(
  '44444001-0005-4444-8444-444400000005',
  '33333001-0005-4333-8333-333300000005',
  'tr',
  'Linde Gaz — TCTP 26B ve DCTP 12C Kapalı Devre Su Soğutma Sistemi — Gebze',
  'linde-gaz-tctp-26b-dctp-12c-kapali-devre-su-sogutma-kulesi-gebze',
  'Küresel gaz endüstrisi devi Linde Gaz\'ın Gebze tesisi için 3 adet TCTP 26B ve 1 adet DCTP 12C model yüksek kapasiteli kapalı devre su soğutma sistemi kuruldu.',
  '{"html":"<p>Küresel gaz endüstrisinin önde gelen kuruluşu <strong>Linde Gaz Türkiye</strong>\'nin Gebze\'deki proses tesisi için yüksek kapasiteli bir soğutma sistemi kurulmuştur.</p><h3>Sistem Bileşenleri</h3><ul><li>3 adet TCTP 26B — Yüksek kapasiteli ters akışlı kapalı devre soğutma kulesi</li><li>1 adet DCTP 12C — Çift hücreli kapalı devre soğutma kulesi</li><li>Toplam: 4 ünite</li><li>Lokasyon: Gebze, Kocaeli</li><li>Sektör: Endüstriyel Gaz / Kimya</li></ul><h3>TCTP 26B Modeli</h3><p>TCTP serisi, yüksek ısı atma kapasitesi gerektiren proses uygulamaları için tasarlanmış ters akışlı (counter-flow) kapalı devre soğutma kulesidir. FRP gövde yapısı ve yüksek verimli serpantin sistemi ile uzun ömürlü ve düşük bakım maliyetli çalışma imkânı sunar.</p>","description":"Linde Gaz Gebze tesisi için 3×TCTP 26B + 1×DCTP 12C yüksek kapasiteli kapalı devre soğutma sistemi."}',
  'Linde Gaz Gebze — TCTP 26B + DCTP 12C Su Soğutma Sistemi',
  'Linde Gaz TCTP 26B DCTP 12C Kapalı Devre Soğutma — ENSOTEK Gebze',
  'Linde Gaz Türkiye Gebze tesisi için ENSOTEK tarafından 3 adet TCTP 26B ve 1 adet DCTP 12C kapalı devre su soğutma sistemi kuruldu.',
  NOW(3), NOW(3)
),

-- 6. HES Kablo — DCTP 12 + DCTP 12C
(
  '44444001-0006-4444-8444-444400000006',
  '33333001-0006-4333-8333-333300000006',
  'tr',
  'HES Kablo — DCTP 12 ve DCTP 12C Kapalı Devre Su Soğutma Kulesi',
  'hes-kablo-dctp-12-dctp-12c-kapali-devre-su-sogutma-kulesi',
  'Kablo üretim sektörünün önde gelen firmalarından HES Kablo\'nun tesisi için DCTP 12 (merdiven aksesuarlı) ve DCTP 12C model kapalı devre su soğutma kuleleri devreye alındı.',
  '{"html":"<p><strong>HES Kablo</strong>\'nun üretim tesisine, proses soğutma ihtiyacını karşılamak üzere <strong>2 adet DCTP serisi Kapalı Devre Su Soğutma Kulesi</strong> temin edilmiştir.</p><h3>Sistem Özellikleri</h3><ul><li>DCTP 12 — Tek hücreli kapalı devre soğutma kulesi (servis merdiveni aksesuarlı)</li><li>DCTP 12C — Çift hücreli kapalı devre soğutma kulesi</li><li>Sektör: Kablo Üretimi / Elektrik</li><li>Özel: Bakım ve servis erişimi için özel merdiven aksesuarı</li></ul><p>Kablo üretiminde kullanılan proses ekipmanlarının soğutulması, ürün kalitesi açısından kritik öneme sahiptir. Kapalı devre sistemimiz, soğutma suyunun dış ortamla temasını engelleyerek kirlenme riskini sıfıra indirmektedir.</p>","description":"HES Kablo üretim tesisi için DCTP 12 (merdiven aksesuarlı) ve DCTP 12C kapalı devre soğutma kulesi."}',
  'HES Kablo — DCTP 12 + DCTP 12C Kapalı Devre Soğutma Kulesi',
  'HES Kablo DCTP Kapalı Devre Su Soğutma Kulesi — ENSOTEK',
  'HES Kablo üretim tesisi için ENSOTEK tarafından DCTP 12 ve DCTP 12C kapalı devre su soğutma kuleleri devreye alındı.',
  NOW(3), NOW(3)
),

-- 7. Green Park Otel — 2× CTP 3C
(
  '44444001-0007-4444-8444-444400000007',
  '33333001-0007-4333-8333-333300000007',
  'tr',
  'Green Park Oteli — 2 Adet CTP 3C Açık Tip Su Soğutma Kulesi',
  'green-park-otel-ctp-3c-acik-tip-su-sogutma-kulesi',
  'Green Park Oteller bünyesindeki otel tesisinin iklimlendirme sistemine 2 adet CTP 3C model açık tip su soğutma kulesi entegre edildi.',
  '{"html":"<p><strong>Green Park Hotels</strong> zincirindeki otel tesisi için <strong>2 adet CTP 3C model Açık Tip Su Soğutma Kulesi</strong> sistemi kurulmuştur.</p><h3>Proje Özellikleri</h3><ul><li>Model: CTP 3C (Açık Devre)</li><li>Adet: 2 ünite</li><li>Sektör: Otel / Konaklama / HVAC</li><li>Uygulama: Otel merkezi iklimlendirme soğutma sistemi</li></ul><h3>Otel Uygulamalarında CTP Serisi</h3><p>CTP serisi soğutma kuleleri; düşük gürültü seviyesi, kompakt boyutları ve estetik görünümleri ile otel ve konaklama işletmeleri için ideal çözüm sunar. Fiberglas gövde yapısı, bakım gereksinimini minimize ederek işletme maliyetlerini düşürür.</p>","description":"Green Park Oteli iklimlendirme sistemine 2 adet CTP 3C açık tip su soğutma kulesi entegrasyonu."}',
  'Green Park Otel — 2 Adet CTP 3C Su Soğutma Kulesi',
  'Green Park Otel CTP 3C Açık Tip Su Soğutma Kulesi — ENSOTEK',
  'Green Park Oteli için ENSOTEK tarafından 2 adet CTP 3C açık tip su soğutma kulesi kuruldu. HVAC otel soğutma sistemi.',
  NOW(3), NOW(3)
),

-- 8. Orion AVM — TCTP 9C
(
  '44444001-0008-4444-8444-444400000008',
  '33333001-0008-4333-8333-333300000008',
  'tr',
  'Orion AVM — TCTP 9C Kapalı Devre Su Soğutma Kulesi',
  'orion-avm-tctp-9c-kapali-devre-su-sogutma-kulesi',
  'Alışveriş merkezi uygulaması için TCTP 9C model kapalı devre su soğutma kulesi sistemi kuruldu.',
  '{"html":"<p><strong>Orion AVM</strong>\'nin merkezi iklimlendirme altyapısına <strong>TCTP 9C model Kapalı Devre Su Soğutma Kulesi</strong> entegre edilmiştir.</p><h3>Proje Özellikleri</h3><ul><li>Model: TCTP 9C (Ters Akışlı — Kapalı Devre)</li><li>Adet: 1 ünite</li><li>Sektör: Ticari / Alışveriş Merkezi</li><li>Uygulama: Merkezi soğutma sistemi (chiller soğutma suyu)</li></ul><p>Alışveriş merkezlerinde yıl boyu sürdürülebilir ve güvenilir soğutma kapasitesi sunmak için tasarlanan TCTP 9C, kompakt boyutları ve yüksek verimliliği ile öne çıkar.</p>","description":"Orion AVM merkezi iklimlendirme sistemi için TCTP 9C kapalı devre su soğutma kulesi."}',
  'Orion AVM — TCTP 9C Kapalı Devre Soğutma Kulesi',
  'Orion AVM TCTP 9C Su Soğutma Kulesi — ENSOTEK',
  'Orion AVM için ENSOTEK tarafından TCTP 9C kapalı devre su soğutma kulesi kuruldu.',
  NOW(3), NOW(3)
),

-- 9. Plastifay — CTP 9
(
  '44444001-0009-4444-8444-444400000009',
  '33333001-0009-4333-8333-333300000009',
  'tr',
  'Plastifay — CTP 9 Açık Tip Su Soğutma Kulesi',
  'plastifay-ctp-9-acik-tip-su-sogutma-kulesi',
  'Plastik sektöründe faaliyet gösteren Plastifay\'ın üretim tesisi için CTP 9 model açık tip su soğutma kulesi sistemi devreye alındı.',
  '{"html":"<p><strong>Plastifay</strong>\'ın üretim tesisine proses soğutma ihtiyacı için <strong>CTP 9 model Açık Tip Su Soğutma Kulesi</strong> sistemi kurulmuştur.</p><h3>Proje Özellikleri</h3><ul><li>Model: CTP 9 (Açık Devre)</li><li>Sektör: Plastik / Kimya</li><li>Uygulama: Proses ekipmanı soğutma</li></ul><p>Plastik enjeksiyon ve ekstrüzyon makinelerinin soğutulmasında açık devre soğutma sistemi yaygın olarak tercih edilir. CTP 9 modeli, bu uygulamalar için optimize edilmiş kapasite ve verimlilik sunar.</p>","description":"Plastifay üretim tesisi için CTP 9 açık tip su soğutma kulesi proje çözümü."}',
  'Plastifay — CTP 9 Açık Tip Su Soğutma Kulesi',
  'Plastifay CTP 9 Açık Tip Su Soğutma Kulesi — ENSOTEK',
  'Plastifay plastik üretim tesisi için ENSOTEK CTP 9 açık tip su soğutma kulesi devreye alındı.',
  NOW(3), NOW(3)
),

-- 10. Aves Yağ — TCTP 9B + DCTP 9B — Mersin
(
  '44444001-0010-4444-8444-444400000010',
  '33333001-0010-4333-8333-333300000010',
  'tr',
  'Aves Yağ — TCTP 9B + DCTP 9B Kombine Soğutma Sistemi — Mersin',
  'aves-yag-tctp-9b-dctp-9b-kombine-sogutma-sistemi-mersin',
  'Mersin\'de faaliyet gösteren Aves Yağ\'ın gıda üretim tesisi için TCTP 9B ve DCTP 9B model kapalı devre su soğutma kulesi kombine sistemi kuruldu.',
  '{"html":"<p><strong>Aves Yağ</strong>\'ın Mersin\'deki gıda üretim tesisi için <strong>TCTP 9B ve DCTP 9B model Kapalı Devre Su Soğutma Kulesi</strong> kombine sistemi devreye alınmıştır.</p><h3>Sistem Bileşenleri</h3><ul><li>1 adet TCTP 9B — Ters akışlı kapalı devre soğutma kulesi</li><li>1 adet DCTP 9B — Çift hücreli kapalı devre soğutma kulesi</li><li>Lokasyon: Mersin</li><li>Sektör: Gıda / Bitkisel Yağ Üretimi</li></ul><h3>Gıda Endüstrisinde Kapalı Devre Soğutma</h3><p>Gıda üretiminde hijyen ve ürün güvenliği en öncelikli unsurdur. Kapalı devre soğutma sistemi, süreç sıvısının dış etkenlerle temasını önleyerek hijyenik bir üretim ortamı sağlar. TCTP 9B ve DCTP 9B\'nin kombinasyonu, farklı kapasite ihtiyaçlarını dengeli şekilde karşılar.</p>","description":"Aves Yağ Mersin gıda tesisi için TCTP 9B ve DCTP 9B kombine kapalı devre soğutma sistemi."}',
  'Aves Yağ Mersin — TCTP 9B + DCTP 9B Kombine Soğutma Sistemi',
  'Aves Yağ Mersin TCTP DCTP Kapalı Devre Su Soğutma — ENSOTEK',
  'Aves Yağ Mersin gıda üretim tesisi için ENSOTEK TCTP 9B ve DCTP 9B kombine kapalı devre su soğutma kulesi sistemi devreye alındı.',
  NOW(3), NOW(3)
),

-- 11. TAT Tekstil — Gaziantep
(
  '44444001-0011-4444-8444-444400000011',
  '33333001-0011-4333-8333-333300000011',
  'tr',
  'TAT Tekstil — CTP Kaportalı Açık Tip Su Soğutma Kulesi — Gaziantep',
  'tat-tekstil-ctp-kapotali-acik-tip-su-sogutma-kulesi-gaziantep',
  'Gaziantep\'te faaliyet gösteren TAT Tekstil\'in üretim tesisi için CTP Kaportalı Açık Tip su soğutma kulesi sistemi kuruldu.',
  '{"html":"<p><strong>TAT Tekstil</strong>\'in Gaziantep\'teki üretim tesisine <strong>CTP Kaportalı Açık Tip Su Soğutma Kulesi</strong> sistemi temin edilmiştir.</p><h3>Proje Özellikleri</h3><ul><li>Lokasyon: Gaziantep</li><li>Sektör: Tekstil / İplik Üretimi</li><li>Uygulama: Tekstil makineleri proses soğutma</li></ul><h3>Tekstil Sektöründe Soğutma</h3><p>Tekstil üretiminde boya, yıkama ve dokuma makineleri yoğun ısı açığa çıkarır. CTP Kaportalı Açık Tip soğutma kulesi, bu uygulamalar için maliyet etkin ve verimli bir çözüm sunmaktadır.</p>","description":"TAT Tekstil Gaziantep üretim tesisi için CTP Kaportalı Açık Tip su soğutma kulesi."}',
  'TAT Tekstil Gaziantep — CTP Kaportalı Açık Tip Su Soğutma Kulesi',
  'TAT Tekstil Gaziantep CTP Su Soğutma Kulesi — ENSOTEK',
  'TAT Tekstil Gaziantep üretim tesisi için ENSOTEK CTP Kaportalı Açık Tip su soğutma kulesi devreye alındı.',
  NOW(3), NOW(3)
),

-- 12. Suudi Arabistan — Uluslararası Proje
(
  '44444001-0012-4444-8444-444400000012',
  '33333001-0012-4333-8333-333300000012',
  'tr',
  'Suudi Arabistan — Endüstriyel FRP Su Soğutma Kulesi İhracat Projesi',
  'suudi-arabistan-endustriyel-frp-su-sogutma-kulesi-ihracat',
  'Orta Doğu\'nun en büyük ekonomileri arasında yer alan Suudi Arabistan\'a endüstriyel FRP/GRP su soğutma kulesi ihracat projesi başarıyla gerçekleştirildi.',
  '{"html":"<p>ENSOTEK, Türkiye\'nin en büyük su soğutma kulesi üreticisi olarak, <strong>Suudi Arabistan</strong>\'a yönelik uluslararası ihracat projelerini de başarıyla hayata geçirmektedir.</p><h3>İhracat Projesi Detayları</h3><ul><li>Ülke: Suudi Arabistan</li><li>Ürün: FRP / GRP Açık Tip Su Soğutma Kulesi</li><li>Uygulama: Endüstriyel proses soğutma</li><li>Sektör: Petrokimya / Enerji / Sanayi</li></ul><h3>Sert İklim Koşullarına Uygunluk</h3><p>Suudi Arabistan\'ın yüksek çevre sıcaklığı ve zorlu iklim koşulları, soğutma kulesi seçiminde özel tasarım gerektirir. ENSOTEK\'in FRP/GRP gövde yapısı, güneş radyasyonuna ve yüksek ısıya karşı üstün dayanıklılık sunmaktadır.</p>","description":"Suudi Arabistan endüstriyel FRP/GRP su soğutma kulesi ihracat projesi. ENSOTEK uluslararası referans."}',
  'Suudi Arabistan — FRP GRP Su Soğutma Kulesi İhracat Projesi',
  'Suudi Arabistan FRP Soğutma Kulesi İhracat — ENSOTEK Uluslararası',
  'ENSOTEK tarafından Suudi Arabistan\'a endüstriyel FRP/GRP su soğutma kulesi ihracat projesi başarıyla tamamlandı.',
  NOW(3), NOW(3)
),

-- 13. İran — Uluslararası Proje
(
  '44444001-0013-4444-8444-444400000013',
  '33333001-0013-4333-8333-333300000013',
  'tr',
  'İran — Endüstriyel FRP Su Soğutma Kulesi İhracat Projesi',
  'iran-endustriyel-frp-su-sogutma-kulesi-ihracat',
  'İran\'daki sanayi tesisi için FRP/GRP açık tip su soğutma kulesi ihracat projesi ENSOTEK tarafından başarıyla tamamlandı.',
  '{"html":"<p>ENSOTEK, Orta Doğu ve çevre bölgelerdeki uluslararası ihracat faaliyetleri kapsamında <strong>İran</strong>\'daki bir sanayi tesisi için su soğutma kulesi sistemi temin etmiştir.</p><h3>Proje Özellikleri</h3><ul><li>Ülke: İran</li><li>Ürün: FRP / GRP Açık Tip Su Soğutma Kulesi</li><li>Uygulama: Endüstriyel proses soğutma</li></ul><p>ENSOTEK, Türkiye pazarındaki 40 yılı aşkın deneyimini uluslararası projelere de taşıyarak, farklı coğrafyalardaki sanayi tesislerine güvenilir soğutma çözümleri sunmaktadır.</p>","description":"İran sanayi tesisi için FRP/GRP açık tip su soğutma kulesi ihracat projesi. ENSOTEK uluslararası referans."}',
  'İran — FRP GRP Su Soğutma Kulesi İhracat Projesi',
  'İran FRP Su Soğutma Kulesi İhracat — ENSOTEK Uluslararası',
  'ENSOTEK tarafından İran sanayi tesisine FRP/GRP açık tip su soğutma kulesi ihracat projesi tamamlandı.',
  NOW(3), NOW(3)
),

-- 14. Tüpraş — İzmit Rafinerisi
(
  '44444001-0014-4444-8444-444400000014',
  '33333001-0014-4333-8333-333300000014',
  'tr',
  'Tüpraş İzmit Rafinerisi — Proses Soğutma Kulesi Sistemi',
  'tupras-izmit-rafinerisi-proses-sogutma-kulesi',
  'Türkiye\'nin en büyük petrol rafinerisi Tüpraş İzmit Rafinerisi\'ne yüksek kapasiteli proses soğutma kulesi sistemi temin edildi.',
  '{"html":"<p>Türkiye\'nin en büyük sanayi kuruluşlarından <strong>Tüpraş</strong>\'ın İzmit Rafinerisi\'ne yönelik <strong>proses soğutma kulesi sistemi</strong> ENSOTEK tarafından sağlanmıştır.</p><h3>Proje Detayları</h3><ul><li>Müşteri: Tüpraş (Türkiye Petrol Rafinerileri A.Ş.)</li><li>Lokasyon: İzmit, Kocaeli</li><li>Sektör: Petrokimya / Rafineri</li><li>Uygulama: Rafineri proses soğutma</li></ul><h3>Rafineri Uygulamalarında Soğutma</h3><p>Petrol rafinerilerinde distilasyon, kraking ve diğer proses ekipmanları yüksek ısı açığa çıkarır. ENSOTEK soğutma kuleleri, bu yüksek kapasiteli ısı atma uygulamalarında güvenilir ve verimli performans sunar. FRP/GRP malzeme yapısı, kimyasal ve korozif ortamlara karşı üstün dayanıklılık sağlar.</p>","description":"Tüpraş İzmit Rafinerisi için ENSOTEK proses soğutma kulesi sistemi — petrokimya sektörü referans."}',
  'Tüpraş İzmit Rafinerisi — Proses Soğutma Kulesi',
  'Tüpraş İzmit Rafineri Proses Soğutma Kulesi — ENSOTEK',
  'Tüpraş İzmit Rafinerisi için ENSOTEK tarafından yüksek kapasiteli proses soğutma kulesi sistemi temin edildi.',
  NOW(3), NOW(3)
),

-- 15. TOFAS — Bursa Otomotiv Tesisi
(
  '44444001-0015-4444-8444-444400000015',
  '33333001-0015-4333-8333-333300000015',
  'tr',
  'TOFAS Bursa Otomotiv Tesisi — CTP Kaportalı Açık Tip Su Soğutma Kulesi',
  'tofas-bursa-otomotiv-tesisi-ctp-kapotali-acik-tip-su-sogutma-kulesi',
  'Türkiye\'nin önde gelen otomobil üreticisi TOFAS\'ın Bursa\'daki otomotiv üretim tesisi için CTP Kaportalı Açık Tip su soğutma kulesi sistemi devreye alındı.',
  '{"html":"<p><strong>TOFAS</strong>\'ın Bursa\'daki geniş kapsamlı otomotiv üretim tesisi için <strong>CTP Kaportalı Açık Tip Su Soğutma Kulesi</strong> sistemi temin edilmiştir.</p><h3>Proje Detayları</h3><ul><li>Müşteri: TOFAS (Türk Otomobil Fabrikası A.Ş.)</li><li>Lokasyon: Bursa</li><li>Sektör: Otomotiv / Araç Üretimi</li><li>Uygulama: Boya hatları, kalıp ve proses ekipmanı soğutma</li></ul><h3>Otomotiv Sektöründe Soğutma</h3><p>Otomotiv fabrikalarında boya hatları, kaynak istasyonları ve kalıp soğutma sistemleri yüksek soğutma kapasitesi gerektirir. ENSOTEK\'in CTP Kaportalı açık tip soğutma kuleleri; yüksek debi kapasitesi, uzun ömür ve düşük bakım maliyeti ile bu talepleri karşılar.</p>","description":"TOFAS Bursa otomotiv üretim tesisi için CTP Kaportalı Açık Tip su soğutma kulesi projesi."}',
  'TOFAS Bursa — CTP Kaportalı Açık Tip Su Soğutma Kulesi',
  'TOFAS Bursa Otomotiv Tesisi Su Soğutma Kulesi — ENSOTEK',
  'TOFAS Bursa otomotiv üretim tesisi için ENSOTEK CTP Kaportalı Açık Tip su soğutma kulesi sistemi devreye alındı.',
  NOW(3), NOW(3)
);

COMMIT;
