# Tanitio / Ensotek ölçüm kabulü — 10 Eylül 2026

Dört tenantın GSC ve GA4 raporları, tenant yöneticisi kapsamındaki gerçek API üzerinden HTTP 200 döndü. Yetki hatası ile boş veri ayrıldı. Bu kabul, dönüşüm toplamanın veya ticari büyümenin tamamlandığını göstermez.

| Tenant | GA4 kullanıcı | Oturum | Sayfa görüntüleme | Dönüşüm |
| --- | ---: | ---: | ---: | ---: |
| Ensotek DE | 2 | 2 | 3 | 0 |
| Ensotek TR | 3 | 3 | 3 | 0 |
| Kühlturm | 3 | 3 | 4 | 0 |
| MOE Kompozit | 68 | 86 | 178 | 0 |

GA4 penceresi bugün dahil son 28 gün; önceki karşılaştırma bitişik 28 gündür. Bugünün gecikmeli event’leri eksik olabilir. DE/TR/Kühlturm örneklemi çok küçük; Tag Assistant ve doğrulama ziyaretleri görüldü. Yeni sürüme nedensel trafik artışı atfedilmez. MOE önceki dönemi 36 kullanıcı / 50 oturum / 86 görüntülemedir; farklı dönem karşılaştırması tek başına teknik düzeltmenin etkisi değildir.

GSC kendi veri gecikmesine göre ayrı tarih aralığı kullanır; GA4 ile aynı pencere sanılmaz. Toplam KPI, boyutsuz Search Analytics sorgusundan gelir; anonim sorgular nedeniyle sorgu satırlarını toplayarak genel tıklama toplamı üretilmez.

CTR fırsat hesaplaması düzeltildi: 300 gösterimli güvenilir bir sıra grubu yoksa kıyas değeri `null` olur; fırsat kuyruğu satır üretmez. Dört tenantın güncel bütün grupları `reliable=false`, dört fırsat kuyruğu da boştur. Panel ve terim açıklaması seçili dönem için tahmini senaryo der; aylık garanti veya kesin kayıp kazanç iddiası kaldırıldı. 16 deterministik test, tenant-scope guard, backend ve panel üretim build’leri geçti. Canlı backend `bun dist/index.js` çalıştırır; kaynak yanında yalnız derlenmiş `gsc.js` farkı taşındı ve yeniden API kabulü yapıldı.

MOE’nin yalnız `moe` sorgusu nitelikli marka talebi sayılmaz. Tam marka “MOE Kompozit” kullanılır; Kühlturm kategorisi için önceki açık `brandTerms: ["ensotek"]` politikası korunur.

**Collector sınırı:** Mevcut discovery kaynakları Brave (`country=tr`), Yandex (`lr=11508`) ve Bing (`cc=TR`, `setlang=tr`) kullanır. Bunlar Google organik sıra/arama hacmi değildir; DE hedefli sonuçlar Almanya konum doğrulaması sayılmaz. Yeni ücretli sağlayıcı veya otomatik rakip taraması başlatılmadı. Konum parametreleri değişene kadar Alman pazar kıyasları bu sınırlamayla okunmalıdır.

Kanıtlar: `output/checklist-2026-09-09/business-sources/measurement-summary.json`, `measurement-live-proof-after.jsonl`, `tanitio-gsc-reliability-deploy.txt`, `tanitio-gsc-runtime-deploy.txt`. Önceki API çıktısı düzeltme öncesi çalışan derlemenin durumunu korur; son kabul için `-after` kullanılır.

Rollback: panel/kaynak yedeği `/var/backups/tanitio-gsc-reliability-20260909T225701Z`; runtime yedeği `/var/backups/tanitio-gsc-reliability-runtime-20260910.js`. Geri dönüş gerekirse ilgili kaynak/derlenmiş dosyalar birlikte ele alınır. Eşzamanlı başka değişiklikleri ezmemek için hash kontrolü zorunludur.
