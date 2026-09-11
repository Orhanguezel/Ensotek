# Ölçüm ve onay takvimi — 10 Eylül 2026

Başlangıç, canlı teknik kabul ve tarihli Tanitio/GA4/GSC kanıtlarıdır. Henüz sosyal yayın yapılmadığı için sosyal yayın sonrası 28 günlük pencere başlamadı. Web teknik başlangıcı 10 Eylül; sosyal başlangıç tarihi ilk onaylı yayın günü olarak ayrıca kaydedilecek.

| Kontrol | Tarih / tetikleyici | Kaynak ve kabul |
|---|---|---|
| Trial kararı | 23 Eylül 2026'dan önce | TR, Kühlturm, MOE; devam/plan seçimi işletme kararı. Otomatik ücretli geçiş yapılmadı. |
| Ensotek managed kararı | 9 Ekim 2026'dan önce | Geçerli modül/hesap kapsamı ayrıca karşılaştırılır. |
| Web 28 gün | 8 Ekim 2026 | Önceki eşit pencereyle GA4 ürün/servis ziyareti, gerçek generate_lead, DB test dışı talep ve GSC sorgu/URL karşılaştırması. |
| MOE 30 gün | 10 Ekim 2026 | Nitelikli talep, ürün kategorisi, kapasite ve teklif kapsamı üzerinden içerik önceliği. |
| MOE 60 gün | 9 Kasım 2026 | Nitelikli talep getiren konu/kanal, İngilizce içerik ve izinli vaka kapsamı. |
| MOE 90 gün | 9 Aralık 2026 | Dönüşüm ve operasyon kapasitesiyle kanal kararı. Reklam ayrı yetkilendirme kapsamı. |
| Sosyal 28 gün | İlk yayın +28 gün | Aynı hesap ve format penceresi; erişilen son 10 gönderi, tarih, konu, kaynak, CTA, erişim/tıklama. OAuth olmayan metrik `null`. |
| CWV | Yeterli CrUX/RUM örneklemi oluştuğunda | LCP/CLS/INP p75; laboratuvar TBT, INP yerine yazılmaz. |

Başlangıç kanıtları: `output/checklist-2026-09-09/business-sources/measurement-summary.json`, `output/checklist-2026-09-09/business-sources/measurement-live-proof-after.jsonl`, `continuation/performance-final-summary.json`, `business-sources/de-gsc-inspection-current.jsonl`. Dosya yolları köke göredir; API çağrı zamanı ile Google'ın son crawl zamanı ayrı tutulur.

TR'nin önceki 56 tıklama / 999 gösterim kaydı tarihli eski GSC referansıdır; bugün alınmış sayı gibi kullanılmaz. Bilinmeyen sosyal takipçi ve etkileşim değerleri sıfır değildir. Düşük örneklemli otomatik CTR kayıp tahminleri kapalı; en az 300 gösterim bandı kabulü yürürlükte.

İşletme girdileri: MOE için ürün bazında adet/ay, minimum sipariş, numune-kalıp-seri ayrımı, teslim yeri ve lojistik kapsamı, tarihli tekliflerden nitelikli talep/kârlılık; Ensotek için güncel sicil-vergi ve adres çelişkisinin çözümü, garanti/SLA, ürün çalışma koşulu ve izinli vaka kapsamı. Mevcut Ensotek belgesi MOE'ye mal edilemez.

Yayın öncesi: teknik uzman, görselin gerçek üretim kaynağı ve yeniden kullanım izni, editoryal onay. 16 web taslağı ve 32 sosyal metin/40 görsel kompozisyon dosyası hazır; bunlar bu onayların verildiği anlamına gelmez. LinkedIn ve doğrulanmayan MOE Facebook kanalı kullanıcı kararıyla atlanır. Tek Ensotek yayıncısı kuralı korunur.
