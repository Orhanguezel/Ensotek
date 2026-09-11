# Ensotek checklist uygulaması — 9 Eylül 2026

**11 Eylül güncel durum: 85/107 kabul tamamlandı; 22 açık.** K22 (MOE mobil menü) kullanıcı bildirimiyle eklendi ve aynı gün kapandı. [Kalan koşullar](ENSOTEK-KALAN-KABULLER-2026-09-10.md). Önceki ara sayılar aşağıda tarihsel kayıttır.

Dört sitenin frontend düzeltmeleri ve Tanitio GTM bağlantı testi canlıya alındı. Bu rapor tam checklist kapanışı değildir. Kabulü biten maddeler [ana checklist](ENSOTEK-AILESI-TUM-PROJELER-CHECKLIST-2026-09-09.md) üzerinde işaretlendi; kısmi uygulamalar ayrı notlandı.

## Uygulanan değişiklikler

- Dört sitede ortak çerez tercihi: ölçüm kodu seçimden önce çalışmıyor; kabul ve geri çekme gerçek tarayıcıda doğrulandı. MOE doğrudan GA4 kullanmayı sürdürüyor: GTM canlı sürümünde ölçüm etiketi yok. Almanya mevcut GTM ile çalışıyor.
- Kompozit: sayfalanan içerik envanteri, 72 URL sitemap, gerçek çeviri kimliğiyle canonical/hreflang, yanlış dil slug ve eski blog yönlendirmeleri, tek marka başlığı, liste H1, gerçek pazarlama seçimi, form etiketleri, locale sonuç mesajları, kapalı menü inert ve nginx gzip.
- Kühlturm: custom-pages API sözleşmesi; içerik envanteri ve 1086 URL sitemap; sayfa canonical/alternatifler; 404 ile upstream hata ayrımı; EN sözlük/erişilebilir isimler; gerçek legal footer hedefleri; hizmet alias yönlendirmeleri; mobil hero ve 32 px slider noktaları; schema ve llms.txt; Ensotek alt marka anlatısı. Dil düğmesi HTML'deki gerçek çeviri hedefini kullanıyor.
- DE/Kühlturm ortak veritabanında kaynak seed ile eşleşen dokuz example.com demo yorum yayından kaldırıldı. Kayıtlar silinmedi; değişen bayraklar yedeklendi. İki seed dosyası artık bu demo yorumları onaylı yayımlamıyor.
- Tanitio: taze GTM container erişimi; public ID doğrulamalı numeric path; GA4-only tenantlarda opsiyonel GTM kartı. MOE ve Ensotek canlı Test Et başarılı; TR/Kühlturm düğmesiz opsiyonel. Sosyal gönderi veya Google container yayını yapılmadı.

## Doğrulama ve kanıt

| Kontrol | Sonuç / kanıt |
|---|---|
| Dört frontend production build / TypeScript | Geçti. Kühlturm son paket build'i: `/tmp/kuhl-checklist-final-build.log` |
| MOE / Kühlturm lint | 0 hata; sırasıyla 2 / 1 uyarı. Tema kapısı ayrı başarısız, aşağıda açık |
| Tanitio | 18 test: 15 Bun + 3 Vitest; backend build/scope guard ve dashboard build geçti |
| Kompozit tüm sitemap | [72 URL canlı tarama](output/checklist-2026-09-09/kompozit-full-live-crawl.json): tamamı 200 ve self canonical |
| Sayfa türü / locale örneklemi | [82 yerel aday URL](output/checklist-2026-09-09/route-acceptance.json); bu dosya tam canlı site taraması değildir |
| Çerez ve analitik | [MOE/TR/DE canlı önce/kabul/geri çekme](output/checklist-2026-09-09/family-live-consent.txt), [Kühlturm canlı](output/checklist-2026-09-09/kuhlturm-live-browser.txt) |
| MOE formu | [TR/EN izole canlı UI](output/checklist-2026-09-09/kompozit-isolated-form.txt): seçim true/false ve başarı/hata dili doğru; istek tarayıcıda yakalandı, DB/mail teslimi sınanmadı |
| Tanitio gerçek ekran | [Dört tenant canlı UI](output/checklist-2026-09-09/tanitio-live-ui.txt) |
| Host ve sıkıştırma | [nginx canlı kanıt](output/checklist-2026-09-09/nginx-live.json) |
| Demo temizliği | [İki public çıktı](output/checklist-2026-09-09/demo-reviews-live.json) |

`tr-de-candidate.json` ilk DE adayında yanlış yerel internal API ile alınmış tarihsel başarısız kontroldür; canlı kabul olarak kullanılmaz. Son DE build'i doğru API ile tekrar yapıldı; esas kanıt `family-live-consent.txt` içindedir. İlk Kühlturm mobil kanıtındaki eski `/solutions/water-cooling-towers` hedefi son pakette `/solutions` olarak düzeltildi.

## Canlı işletim ve geri dönüş

Ensotek SSH: `vps-Ensotek`, kök `/var/www/Ensotek`.

| Proje | PM2 frontend | Port | Çalışma biçimi |
|---|---|---|---|
| kompozit | kompozit-frontend | 3020 | `.next/standalone/kompozit/frontend/server.js` |
| kuhlturm | kuhlturm-frontend | 3025 | `.next/standalone/kuhlturm/frontend/server.js` |
| ensotek_de | ensotek-frontend | 3011 | `.next/standalone/ensotek_de/frontend/server.js` |
| ensotek_com_tr | ensotek-com-tr-frontend | 3021 | bun run start, tam `.next` |

**Ortak DB gerçeği:** Almanya backend 8086 ve Kühlturm backend 8089 aynı `ensotek` veritabanını kullanıyor. Kühlturm nginx, ürün/hizmet API'lerini 8086'ya; diğer API'leri 8089'a yönlendiriyor. Bu nedenle Kühlturm SSR'ı doğrudan 8089'a çevirmek doğru değildir; build `https://kuhlturm.com/api` yönlendirme sözleşmesini kullanır. İzolasyon işi ORT01 hâlâ açıktır.

Dağıtım scriptleri: `scripts/deploy-checklist-frontend.sh`, `scripts/deploy-checklist-tr-frontend.sh`. Paketlere `.env` dahil edilmedi; canlı env korundu. Eski statik hash'ler açık tarayıcılar için saklandı. Restart sonrası sağlık kontrolü ve hata halinde geri dönüş bulunuyor.

Yedekler:

- MOE: `.next/standalone.before-checklist-20260909T191755Z`
- Kühlturm ilk: `.next/standalone.before-checklist-20260909T191826Z`; son paket öncesi: `.next/standalone.before-checklist-20260909T194403Z`
- TR: `.next.before-checklist-20260909T192215Z`
- DE: `.next/standalone.before-checklist-20260909T192444Z`
- Tanitio: `vps-vistainsaat:/var/backups/tanitio-gtm-20260909T193220Z`. Yalnız ilgili backend modülleri ve doğrulanmış dashboard dağıtıldı; canlı Shopify dosyaları korundu.
- nginx: Kühlturm `/var/backups/ensotek-checklist/nginx/kuhlturm.com.before-checklist-20260909T191920Z`; MOE `/etc/nginx/sites-available/karbonkompozit.com.tr.before-checklist-20260909T191920Z`.

Build dağıtımı ile tüm repo kaynaklarının canlı eşitliği aynı kabul değildir. Ensotek'te seçili kaynak senkronizasyonu ve tüm eski belgelerin mutabakatı ORT14 kapsamında açıktır. Çalışma ağaçlarında önceden gelen kullanıcı değişiklikleri korundu; toplu commit/reset yapılmadı.

## Kalan işler ve bağımlılıklar

- **Uygulama/doğrulama:** ortak DB izolasyonu, boş kalite içeriği, gerçek talep/ek dosya/PDF/admin kabulü, SMTP teslimi, tekil generate_lead ve kaynak atfı; DE eski SEO maddelerinin güncel kabulü; Tanitio aile domain/marka sorgusu sınıflandırması ve GSC önbelleği.
- **Kalite kapıları:** Kompozit tema testi OG/global-error ve dört bileşende sabit renkler, ayrıca eksik `.surface-dark-link` bildiriyor. Kapı gevşetilmedi. İki sitenin karşılaştırılabilir yeni Lighthouse/CWV ölçümü ve tüm klavye/ekran okuyucu akışları açık.
- **İşletme verisi:** doğrulanmış künye/sertifika/kapasite/minimum adet/teslim süreleri ve izinli gerçek görseller. Sayısal iddialar veya sertifika içeriği uydurulmadı.
- **Hesap erişimi:** gerçek sosyal hesap URL'leri ve OAuth; Ensotek ikinci GA etiketi `G-XECX77LB6M` sahipliği; abonelik kapsam kararı. URL bilgisi OAuth sayılmaz.
- **İçerik üretimi:** dört sitenin planlanan rehber/revizyon ve görselli sosyal taslak paketleri henüz tam üretilmedi. Kühlturm yayıncı hesabı tek Ensotek hesabı olacak.
- **Zamana bağlı kabul:** 28 gün ve 30/60/90 gün karşılaştırmaları bugün tamamlanmış sayılamaz. Google canonical/index tercihi teknik dağıtımla aynı anda değişmiş kabul edilmedi.

Ek inceleme adayı: public review yanıtında e-posta alanı ve public detay/onay sınırlarının ayrıca güvenlik doğrulaması gerekiyor. Demo yayından kaldırma bunu çözmüş sayılmaz; gerçek kişisel veri kanıt dosyalarına taşınmadı.

## Tam taramada bulunan ek nedenler ve düzeltme

İlk 1086 URL taramasında 919 adres 200, 166 adres geçici 500, bir adres 404 döndü. Başarısızlıklar saklandı: `output/checklist-2026-09-09/kuhlturm-live-crawl-before-runtime-fix.json`. Başarılı küçük örneklemin tam site kabulü olmadığı böylece doğrulandı.

- PM2 logu 350 MB sınırında Kühlturm backend'ini tekrar tekrar durduruyor; nginx aynı saniyelerde 8089 bağlantı reddi / 502, frontend 500 kaydediyor. Sunucuda yaklaşık 1 GB kullanılabilir RAM kontrol edilerek yalnız Kühlturm sınırı 512 MB yapıldı. Ayar repo ve canlı ecosystem dosyasında aynı; PM2 kaydedildi. Bu, bellek sızıntısı olmadığının kanıtı değildir; uzun dönem izleme açık.
- Public katalog/navigasyon API okumaları 60 saniye yeniden doğrulamalı cache kullanıyor; açık `no-store` tercihi korunuyor. Upstream başarısızlığı içeriksiz 200'e dönüştürülmüyor.
- `ü` içeren proje slug'ı Next parametresinde kodlu gelip tekrar kodlandığı için `%25C3%25BC` oluşuyordu. Route parametreleri bir kez çözülüyor; gerçek proje URL'si artık 200. Middleware'in slug'ı kopyalayan alternatif HTTP Link başlığı kapatıldı; gerçek ID eşlemesi HTML metadata'da korunuyor.
- Son frontend paketi yedeği: `.next/standalone.before-checklist-20260909T195243Z`. Build: `/tmp/kuhl-checklist-runtime-build.log`. Backend ayar yedeği: `kuhlturm/backend/ecosystem.config.cjs.before-checklist-20260909`.
- Form etiketleri altı canlı locale/form ekranında ayrıca ölçüldü: `output/checklist-2026-09-09/live-form-labels.txt`.
- Mobil 320/390 px CTA geometri ve dokunma sonuçları: `output/checklist-2026-09-09/kuhlturm-mobile-final.txt`. Slider geçişi tamamlandıktan sonra ölçülür; 400 ms ara ölçümü 2 saniyelik animasyonun kabulü değildir.

### Son tam Kühlturm kabulü

[1086 URL canlı sonuç](output/checklist-2026-09-09/kuhlturm-full-live-crawl.json): **1086/1086 HTTP 200, self canonical, tek H1 ve en az bir schema**. [Özet](output/checklist-2026-09-09/kuhlturm-full-live-summary.json). Unicode URL karşılaştırması percent-encoding eşdeğerliğini dikkate alır; kodlu canonical ile aynı Unicode adres yanlış uyuşmazlık sayılmaz. Backend restart sayısı son tarama boyunca 172'de sabit kaldı; RSS yaklaşık 393 MiB. Bellek uzun dönem gözlemi sürer.

[12 yokluk örneği](output/checklist-2026-09-09/kuhlturm-missing-details.json) 404. [6 eski hizmet adresi](output/checklist-2026-09-09/kuhlturm-service-redirects.json) 308 → 200. [Gerçek dil düğmesi](output/checklist-2026-09-09/kuhlturm-language-switch.txt) DE legal içeriğini karşılık gelen EN slug'a taşıdı.

### Son Kompozit ve aile sağlık kabulü

Kompozit dosya alanına seçili dilde erişilebilir ad eklendi; [iki dil canlı tekrar kontrolü](output/checklist-2026-09-09/kompozit-file-label-final.txt). Son paket yedeği `.next/standalone.before-checklist-20260909T195921Z`. Önceki form etiket kanıtındaki adsız dosya alanı bu paketle düzeldi. [Dört site son sağlık kontrolü](output/checklist-2026-09-09/family-final-health.json): tamamı 200 ve tek H1. Build logları `output/checklist-2026-09-09/builds/` altında saklandı.

Bu tur **26 yeni madde** kapatıldı; önceki 8 kabul ile toplam **34 tamamlanmış, 70 açık** madde var. Açık işler yalnız dış bağımlılıklardan oluşmuyor: raporun kalan işler bölümündeki teknik uygulama ve doğrulamalar da henüz tamamlanmadı. Tüm checklist tamamlandı diye sunulmamalıdır.

## Kalanlarla devam turu — 9 Eylül 2026

**TAN06 canlıda tamamlandı:** Kühlturm kaydında zaten `gsc.brandTerms=["ensotek"]` vardı. GSC route'u tenant adını tekrar ekliyordu; discovery de kayıtlı listeyi dikkate almıyordu. Ortak resolver açıkça kayıtlı listeyi (boş liste dahil) esas alıyor; liste olmayan tenantlarda mevcut çıkarım korunuyor. Tenant kayıtları/Google etiketleri değiştirilmedi.

- 5 politika testi + gerçek GSC KPI oluşturucusuyla 1 entegrasyon testi geçti; backend build ve tenant-scope guard geçti.
- İki değişen modül ve yeni helper, kaynak hash kontrolü ve yedekle canlıya alındı. Yedek: `/var/backups/tanitio-brand-policy-20260909T201735Z`.
- [Canlı API kabulü](output/checklist-2026-09-09/continuation/tanitio-brand-policy-live.jsonl): Kühlturm 14 sorgu/64 gösterim markasız; bunların 7'si genel kategori sorgusu. Türkiye 3 markalı sorgu/34 tıklama/292 gösterim ve 28 markasız sorgu/2 tıklama/120 gösterim; bağımsız hesaplanan toplamla birebir. Kısa ömürlü test kimliği rapora yazılmadı; geçici sunucu scriptleri kaldırıldı.

**Kompozit tema ve mobil menü:** Dört bileşenin renkleri semantic CSS değişkenlerine taşındı. Tema kontrolünde OG ImageResponse ve kök hata ekranı, stylesheet olmadan çalıştıkları için mevcut görsel renderer istisnalarıyla aynı şekilde açıklamalı istisna olarak tanımlandı. Kullanılmayan `surface-dark-link` şartı yerine gerçek kullanılan tokenların varlığı kontrol ediliyor. Bu istisnalar genel bileşenlerde sabit renk kontrolünü kaldırmaz.

Mobil menü açılınca odak içeri taşınır; Tab son kontrolden menü içine döner, Escape kapatır, odak açan düğmeye döner; arka sayfa kaydırması açıkken kilitlenip kapanışta geri yüklenir. [Yerel aday](output/checklist-2026-09-09/continuation/kompozit-theme-focus-candidate.txt) ve [canlı tarayıcı](output/checklist-2026-09-09/continuation/kompozit-theme-focus-live.txt) kabulü geçti. Açık/koyu ekran görüntüleri görsel olarak kontrol edildi.

**Denetim komutları:** `check-release-html`, `check-admin-content-flow`, `crawl-seo-report`, `prepare-standalone` ve Lighthouse başlangıç yolu gerçek `standalone/kompozit/frontend` çıktısına bağlandı. Release kapısı tema tercihini zorunlu light saymak yerine geçerli dark/light durumunu kabul eder. Yeni `bun run test:seo-inventory`, API'den sayfaladığı blog/ürünleri ID bazında sitemap ve HTML hreflang ile eşleştirir; 32 yayınlanmış detay adresi geçti. `test:theme`, `test:release`, build ve lint (0 hata/2 eski uyarı) geçti.

Kompozit son build canlıya alındı: `.next/standalone.before-checklist-20260909T202448Z`. Bu turun 14 kaynak/denetim dosyası da canlı kaynakla eşitlendi; kaynak yedeği `/var/backups/ensotek-checklist/kompozit-sources-20260909T202541Z.tgz`. Diğer repo kaynaklarının tümünü eşitleme işi ORT14 altında açıktır.

### Mobil performans tekrar ölçümü

Lighthouse 12.8.2, Chrome 152, aynı mobil ekran ve throttling profili kullanıldı. [Karşılaştırma kanıtı](output/checklist-2026-09-09/continuation/performance-comparison.json). Tek önce/sonra laboratuvar örneğidir; ağ, cache ve CPU değişkenleri nedeniyle bütün fark tek düzeltmeye atfedilmez. Gerçek kullanıcı CWV kabulü değildir.

| Site | Performans önce → sonra | LCP önce → sonra | TBT önce → sonra | Erişilebilirlik | CLS |
|---|---|---|---|---|---|
| Kompozit | 49 → 87 | 8,764 → 3,351 sn | 505 → 230,5 ms | 97 → 100 | 0 |
| Kühlturm | 69 → 83 | 5,556 → 4,112 sn | 337,5 → 52 ms | 96 → 100 | 0 |

Her iki yeni ölçümde SEO ve best practices 100. Performans maddeleri açık: Kompozit LCP görselinde ek fetchpriority ipucu ve kalan ana-thread maliyeti; Kühlturm ilk hero görselinin teslim süresi ve SSR ilk yanıtı hâlâ iyileştirilebilir.

**Devam turu kapanışı:** TAN06, K09, K13, K15 ve T17 olmak üzere **5 ek madde kapandı**. Toplam **39 tamamlanmış, 65 açık** madde. Altı canlı form/locale ekranında 50 label tıklamasının tamamı doğru alana odaklandı; görünür adsız alan yok: [kanıt](output/checklist-2026-09-09/continuation/live-form-label-focus.txt). Bu kabul formun DB/mail teslimi değildir; ORT12 açık kalır.


## İkinci devam turu — Search Console kanıtı ve canonical yeniden denetimi

MOE için mevcut, tenant kapsamlı `/marketing/gsc/index` ve `/marketing/gsc/index/refresh` akışı kullanıldı. İlk okuma önbelleğin artık boş olmadığını gösterdi: 60 kayıt, 37 dizinde / 11 dizinde değil / 12 sorun. İlk 12 URL çağrısı 24 saat önbelleğini koruyarak Google'a tekrar gitmedi. Ardından teknik düzeltmeler sonrası yeniden değerlendirme için güncel 72 URL bir kez zorunlu yenilendi; **72/72 Inspection başarılı, 0 hata**. Sonuç **38 dizinde, 18 dizinde değil, 16 sorun**. Bu sayılar yalnızca denetlenen URL kümesini kapsar; sitenin Google'daki toplam indeks sayısı değildir.

- [Önbellek öncesi/sonrası ve atlanan 12 tekrar](output/checklist-2026-09-09/continuation/moe-gsc-cache-refresh.jsonl)
- [72 güncel Google Inspection sonucu](output/checklist-2026-09-09/continuation/moe-gsc-inspection-current.jsonl)
- [Google canonical karşılaştırması](output/checklist-2026-09-09/continuation/moe-gsc-canonical-summary.json)
- [17 güncel sayfanın canlı HTML kontrolü](output/checklist-2026-09-09/continuation/moe-google-vs-current-html.json)
- [17 eski Google canonical adresinin yönlendirme kontrolü](output/checklist-2026-09-09/continuation/moe-google-canonical-redirects.json)

**Canonical sonucu:** Google 17 URL'de farklı canonical tutuyor; CTP/karbon fiber blogları ve dil alternatifleri de denetlendi. Güncel 17 sayfanın tamamı HTTP 200 + self-canonical; Google'ın seçtiği eski 17 adresin tamamı beklenen güncel adrese yönleniyor. Teknik yönlendirme/canonical sinyalleri tutarlı. Google'ın eski `/blog` ve diğer canonical seçimleri henüz değişmiş değildir; sonraki GSC ölçümünde yeniden karşılaştırılmalıdır. K17'nin yeniden değerlendirme kabulü bu kanıttır, bütün URL'lerin indeks sorununun çözüldüğü iddiası değildir.

**TAN05 ön inceleme:** [Canlı tenant kapsamlı sorgu](output/checklist-2026-09-09/continuation/domain-classification-preflight.jsonl), 49 aile sonucunun rakip olarak işaretlendiğini doğruladı: Türkiye'de 43 `ensotek.com`; Almanya'da 3 `ensotek.com` ve 3 `kuhlturm.com`. Bu turda discovery geçmişi veya sınıflandırma kodu değiştirilmedi. TAN05 açık: tenant marka sınırı, şirket/grup eşlemesi ve geçmiş sıralamaları koruyan uygulama birlikte tamamlanmalı.


**Panel kabulü ve dağıtım:** `GscAnalysis.tsx` boş veri kartlarını “—” gösterir ve örneklem sınırını açıklar. Sitemap listesi zaten “indexed=0” alanını toplam indeks sayısı olarak göstermiyor. Build/TypeScript geçti. [Gerçek API ile aday](output/checklist-2026-09-09/continuation/gsc-panel-candidate.txt), [yalnız tarayıcıda boş cevap senaryosu](output/checklist-2026-09-09/continuation/gsc-panel-empty-candidate.txt) ve [canlı kabul](output/checklist-2026-09-09/continuation/gsc-panel-live.txt) geçti.

İlk dağıtımda build ortamındaki eksik API değişkeni tarayıcıda yakalandı ve önceki çalışan sürüm geri yüklendi. Production public ayarlarıyla yeniden build edildi; API bundle kontrolü build scriptine eklendi. İlk geniş kontrol ekrandaki localhost OAuth örneğini de eşleştirdiğinden tam API taban adresini denetleyecek şekilde daraltıldı. Son dağıtım kaynak hash kapısından geçti; eşzamanlı SEO/GTM ve önceki Shopify kodu korundu. Nihai yedek: `/var/backups/tanitio-gsc-evidence-20260909T205818Z`. Gerçek canlı panelde 72 kayıt / 38–18–16–0 kartları doğrulandı. [Dağıtım](output/checklist-2026-09-09/continuation/gsc-evidence-deploy.txt), [build](output/checklist-2026-09-09/continuation/tanitio-gsc-evidence-build.log). Sosyal gönderi, e-posta veya indeksleme talebi gönderilmedi.

**İkinci devam turu kapanışı:** TAN07 ve K17 yeniden denetim kabulü kapandı: **41 tamamlanmış, 63 açık**. Google canonical yakınsaması sonraki ölçümde takip edilecek; 49 yanlış aile sınıflandırması TAN05 altında açık.


## Üçüncü devam turu — TAN05 alan adı sahipliği ve şirket gruplaması

**TAN05 tamamlandı.** Tanitio `domain-policy.ts`, ana website host'u ve `marketing_json.discovery.ownedDomains` listesini kullanır. Ensotek DE/TR/Kühlturm dört aile alan adını paylaşır; MOE kendi karbonkompozit.com.tr markası olarak kalır. Benzer ad içeren sahte domainler, başka tenant siteleri veya domain sonuna eklenen yabancı hostlar eşleşmez. Yeni SERP satırları aynı yardımcıyla sınıflanır; dört tenant'ın kendi domainini `/track` ile rakibe eklemesi HTTP 400 `OWN_DOMAIN` ile reddedilir. Kaldırma yolu açıktır.

Şirket/grup üyelikleri tenant konfigürasyonundadır. [CTP'nin birincil sitesi](https://susogutmakulesi.com.tr/) ile ctpmuhendislik.com, susogutmakulesi.com.tr ve susogutmakuleleri.com doğrulandı. [Form'un kurumsal sayfası](https://formmerkeziklima.com/en/about) üzerinden grup alan adları doğrulandı. Form grup olarak etiketlenir; ayrı tüzel kişilerin tek şirket olduğu söylenmez. Doğrulanmayan ctpmuhendislik.com.tr veya yalnız adı benzeyen siteler birleştirilmedi. Grup üyeliği sıralama/gösterim değerlerini toplamaz; ham domain satırları korunur. Panel doğrulanmış grupları, kalan bağımsız domainleri ve marka kapsamını açıklar.

**Geçmiş düzeltmesi:** Ön okuma MOE'nin 15:36'dan kalan `running` kaydını buldu. Normal discovery GET akışı mevcut 45 dakika bayat-koşu kuralını uygulayarak bunu hata durumuna geçirdi; yeni tarama başlatılmadı. Sonraki sınıflandırma işlemi, çalışan koşu varsa duracak şekilde transaction içinde yapıldı. Önceki discovery ayarı ve 49 eski bayrak `/var/backups/ensotek-discovery-domain-correction-20260909.json` dosyasına 0600 izinle, üzerine yazmadan kaydedildi. Yalnız 43 TR ensotek.com + 3 DE ensotek.com + 3 DE kuhlturm.com `is_ours` bayrağı düzeltildi. **2.597 sonuç ve 9 koşunun sınıflandırma öncesi/sonrası ham hash'leri aynı.** İkinci dry-run 0 düzeltme buldu. Diğer marketing JSON alanlarına dokunulmadı.

- [Dry-run](output/checklist-2026-09-09/domain-policy/dry-run.jsonl), [apply / hash kabulü](output/checklist-2026-09-09/domain-policy/apply.jsonl), [idempotency](output/checklist-2026-09-09/domain-policy/idempotency.jsonl).
- [Önceki API görünümü](output/checklist-2026-09-09/domain-policy/api-before.jsonl), [sonraki görünüm](output/checklist-2026-09-09/domain-policy/api-after.jsonl), [9 koşu + 4 takip reddi](output/checklist-2026-09-09/domain-policy/all-runs-acceptance.jsonl).
- [8 politika testi](output/checklist-2026-09-09/domain-policy/policy-tests.txt), [backend build/scope guard](output/checklist-2026-09-09/domain-policy/backend-build.log), [dashboard build / production API kapısı](output/checklist-2026-09-09/domain-policy/dashboard-build.log).
- [Gerçek API ile aday tarayıcı](output/checklist-2026-09-09/domain-policy/browser-candidate.txt), [canlı tarayıcı](output/checklist-2026-09-09/domain-policy/browser-live.txt).

TR son koşusu **48 alan adı / 46 grup**: CTP üç domain tek grupta. Form'un her iki domaininin bulunduğu önceki iki koşuda da tek grupta sayıldığı API ile doğrulandı. Dokuz koşunun hiçbirinde own-domain rakip listesine sızmadı.

Backend yedeği `/var/backups/tanitio-domain-policy-20260909T212013Z`, dashboard yedeği `/var/backups/tanitio-domain-dashboard-20260909T212419Z`. Kaynak hash kapısı mevcut değişiklikleri korudu; önceki GSC/GTM/Shopify düzenlemeleri korundu. Normal deploy health yeniden denemeleri geçti; gerçek giriş sonrası discovery ekranı doğrulandı. Paid SERP sorgusu, sosyal yayın veya e-posta gönderimi yapılmadı.

Bakım ve tekrar uygulama sözleşmesi: Tanitio `backend/docs/discovery-domain-policy.md`; kapsamlı, yedek zorunlu script `backend/scripts/repair-ensotek-discovery-domains.ts`. Gelecekte konfigürasyonu değiştirmek eski bayrakları otomatik değiştirmez; geçmişe uygulanacak değişiklik ayrıca yedekli ve tutarlı yapılmalıdır.

**Takip toplamı: 42 tamamlanmış, 62 açık.**


## Dördüncü devam — 10 Eylül, ORT01 canlı izolasyon

Kühlturm `ensotek` ortak DB’sinden, yeni `kuhlturm_live` DB’sine geçirildi. Eski `kuhlturm` arşivi (5 eski teklif) ve Ensotek DE DB’si korunur. Ürün/servis native modülleri mevcut sözleşmeyle port edildi; genel shared services Zod/Ajv ve rol koruması uyumlandı. Nginx 8086 istisnaları 8089’a, upload alias’ı kendi dizinine çevrildi. 37 Cloudinary dosyası ayrı yerel kopyaya alındı; toplam 249 medya erişimi doğrulandı.

- [Hazırlık](output/checklist-2026-09-09/isolation/prepare.json), [medya](output/checklist-2026-09-09/isolation/media-copy.json), [geçiş](output/checklist-2026-09-09/isolation/cutover.json).
- [42 API eşitliği](output/checklist-2026-09-09/isolation/api-parity.json), [253 canlı dosya/yetki kontrolü](output/checklist-2026-09-09/isolation/live-assets-auth.json), [1086 URL tekrar kabulü](output/checklist-2026-09-09/isolation/public-crawl-summary.json). Unicode canonical karşılaştırması URL decode ile yapıldı; ilk Python ASCII isteği hatası site hatası değildi.
- [Runtime/geri dönüş](kuhlturm/docs/runtime-isolation-2026-09-10.md). DB credential’ları yalnız sunucuda 0600/0700 özel yedekte.

ORT01 kapandı: **43 tamamlanmış, 61 açık**. Diğer maddelerin çalışması sürüyor; bu ara durum genel görev kapanışı değildir.


### Eski Ensotek kaynağı, kalite ve profil kabulü

Kullanıcı bilgilerin Ensotek’ten alınmasını, eski sitede bulunmayan sosyal kanalların atlanmasını istedi. [Eski site kaynak bağlantıları](output/checklist-2026-09-09/business-sources/old-site-links.json), [belge incelemesi](output/checklist-2026-09-09/business-sources/certificate-review.json) ve [YouTube kanal kimliği](output/checklist-2026-09-09/business-sources/youtube-channel.json) kaydedildi. ISO 9001/10002 belgelerinde 21.10.2026, CE beyanında 12.02.2025 tarihi okunuyor; ISO 14001/45001 görselleri 27.01.2021 tarihli olduğundan güncel sayılmadı. Sertifika kuruluşunun ayrıca online kayıt teyidi yapılmış sayılmaz.

ORT03 gövdesi iki DB’ye üç dilde yazıldı. DE frontend mevcut sunucu içeriğini PageSwitch’e aktarıyor; locale cache anahtarına dahil edildi. İçerik API 404 dışındaki arızaları artık yokluk gibi dönmüyor. İki build ve içerik kontratı testleri geçti. [8 Tanitio API kabulü](output/checklist-2026-09-09/business-sources/quality-contract-live.jsonl), [public son kontrol](output/checklist-2026-09-09/business-sources/public-final.json).

ORT09: Eski resmi site Instagram ensotek_tr, Facebook Ensotek, X Ensotek_Cooling ve UCX22ErWzyT4wDqDRGN9zYmg YouTube kanalını gösteriyor. Kanal başlığı Ensotek kimliğiyle eşleşti. DB ayarları ve footer menüleri düzeltildi; TR footer/sameAs artık aynı site_settings kaynağını kullanıyor. LinkedIn/TikTok eski sitede bulunmadığından tahmini bağlantılar gösterilmedi. MOE ek kanalları da kullanıcı kararıyla atlandı (TAN14); mevcut Instagram korunur. OAuth kurulmuş değildir.

TR05 ve T23: Üç Ensotek tenant’ının company/branding/socialProfiles alanları yedekli scriptle eşlendi. Yanlış GmbH (Ltd.) çevirisi, belgede yazılı Türk tüzel adıyla değiştirildi. Kalıcı logo URL’leri 200/image/png; TR/Kühl renkleri mevcut CSS paletinden alındı. [Tenant API readback](output/checklist-2026-09-09/business-sources/profile-api-proof.jsonl), [yedekli uygulama](output/checklist-2026-09-09/business-sources/profile-apply.json). `socialPublishing` alanı sahip kararını kaydeder; yayın motoruna yeni hesap yetkisi sağlamaz.

Kurumsal kaynaklar iki adres biçimi içeriyor: iletişim sayfasındaki No:41 ve 2025 belgelerindeki No:10M iç kapı 209. İletişim adresi korunur; kayıtlı adres/vergisel kayıt yeterliliği henüz doğrulanmış sayılmaz. Sayısal üretim/çalışan iddiaları ve MOE kapasitesi ayrıca açık.

Güncel ara toplam **48 tamamlanmış, 56 açık**. Üç trial bitişi yeniden doğrulandı: 23 Eylül; Ensotek managed dönem sonu 9 Ekim. Ücretli geçiş yapılmadı.


## 10 Eylül — schema, marka ve URL kararı

**T12:** **10 Eylül kabul:** 34 ürün/yedek parça URL’sinde HTTP 200, tek H1 ve gerçek ürün adı/Ensotek markasıyla Product schema doğrulandı. Organization legalName ve sosyal kaynaklarla eşleşiyor; fiyat/yorum uydurulmadı. Kanıt: `output/checklist-2026-09-09/business-sources/kuhlturm-product-schema-live.json`.

**T15:** **10 Eylül kabul:** Site Ensotek alt marka kimliği, logo/iletişim ve Tanitio tenant profili eşlendi. Dört sosyal URL eski resmi Ensotek sitesinden alındı; tek Ensotek yayıncısı metadata olarak kaydedildi. OAuth eksikliği ayrıca TAN04’te açık; yayın yetkisi var denmiyor. Kanıt: `business-sources/profile-api-proof.jsonl`, `public-after-revalidation.json`.

**T21:** **10 Eylül kabul:** AGENTS/README/portfolio ve iki eski Codex belgesine güncel DB/API/native modül/alt marka kararları işlendi. İşletim kaydı, rollback/delta uyarısı, sitemap/API/locale/soft-404 ve mobil kontroller mevcut. Build/deploy betikleri üretim origin kontrolü olmadan sürüm değiştirmiyor. Önceki gerçek lint sonucu 0 hata/1 uyarı; yeni üretim build’i geçti.

**DE12:** **10 Eylül kapsam kararı:** Kullanıcının “eski sitede varsa al yoksa atla” talimatı uygulandı. Eski resmi Ensotek sitesinde doğrulanabilir LinkedIn yok; tahmini şirket hesabı kaldırıldı. sameAs yalnız kaynaklı Instagram/Facebook/X/YouTube içerir. Yeni LinkedIn hesabı açılmadı; OAuth TAN04’te ayrı.

**DE07:** **10 Eylül karar:** DE/EN/TR için mevcut sabit modül yolları (/about, /contact, /product vb.) korunur. Yalnız dil biçimi uğruna URL göçü yapılmaz; içerik çevirileri mevcut kayıt ID’si üzerinden gerçek slug/hreflang ile eşlenir. Gereksiz yönlendirme zinciri oluşturulmaz; içerik keşfi DE01/DE03 kapsamında doğrulanır.

Ara toplam: **54 kapalı, 50 açık**. Ölçüm/OAuth ve teknik inceleme sürüyor.


## 10 Eylül — Tanitio ölçüm kabulü ve TR iletişim hatası

TAN09/TAN11 kapandı; [ölçüm raporu](docs/TANITIO-ENSOTEK-OLCUM-KABUL-2026-09-10.md) ve canlı API kanıtları kaydedildi. Güncel toplam **56 kapalı / 48 açık**.

TR iletişim formunun `/contact` 404’ü `/contacts` ile giderildi; telefon doğrulaması ve yerelleştirilmiş konu/Accept-Language eklendi. Başarı için response ID zorunlu. Canlı tarayıcıda 400 ve ID içermeyen 201 başarı göstermiyor; ID içeren 201 gösteriyor. Bu kontrollü istekler tarayıcıda yakalandı; gerçek DB yazma/mail teslimi kabulü değildir. Kanıt `business-sources/tr-contact-browser-contract.txt`; canlı build yedeği `.next.before-checklist-20260909T225908Z`. ORT12 kapsamındaki gerçek uçtan uca doğrulama devam ediyor.


## 10 Eylül — Gerçek kayıt, kaynak atfı, DE SEO ve katalog kabulü

Güncel ara toplam **63 kapalı / 41 açık**. ORT06, TR01, DE01/02/03/10 ve K08 kanıtla kapandı. ORT05'in teknik bölümü tamamlandı: dört mülkte `generate_lead` anahtar etkinliği oluşturulup doğrudan GA4 config API ile okundu. Canlı arayüzde yalnız 201 + DB ID başarı sayılıyor; izin yok/hata/honeypot/test kayıtlarında lead olayı yok. GA test gönderimleri tarayıcıda yakalandı; gerçek organik GA4–DB dönüşüm mutabakatı henüz oluşmadığı için ORT05 açık tutuldu.

- `business-sources/lead-db-{site}.jsonl`: dört gerçek DB, iletişim + iki rıza seçimiyle teklif; admin aynı ID. Mail/Telegram yalnız izole süreçte yakalandı, dış mesaj gönderilmedi. Test satırları silindi, teklif sayacı geri alınmadı.
- `business-sources/family-lead-browser-acceptance.json`, `family-micro-browser.txt`, `tr-offer-browser.txt`: dört canlı frontend ve kaynak/izin/başarı sözleşmesi.
- `business-sources/ga4-lead-key-events-apply.jsonl`, `ga4-lead-key-event-readback.jsonl`: gerçek dört GA4 anahtar etkinlik kaynağı. Bu, gerçek lead teslimi veya satış kanıtı değildir.
- `business-sources/de-discovery-acceptance.json`, `de-schema-live.json`: her indekslenebilir önceliğe ≥2 bağlantı, 32 sayfa türü kabulü; 1165 URL önceki tam tarama. FAQ 8 görünür soru/yanıt, Breadcrumb ve Article şeması canlı. LocalBusiness adres ülkesi TR; Almanya şubesi varsayılmadı.

Katalog akışları aynı değildir: TR ortak `lead_catalog_downloads` ile doğrulamalı; DE native `catalog_requests` ile doğrulamalı; Kühlturm native `catalog_requests` ile admin gönderimli. MOE'de katalog talep modülü yoktur. İlk ortak modül denemesi DE/K/MOE için yanlış kabul hedefiydi ve tablo yok hatası verdi; veri yaratmadı. Script TR ile sınırlandı, DE/K için native kabul yazıldı. MOE'ye gereksiz paralel talep modülü kurulmadı.

TR/DE/K katalog kabulünde gerçek DB/admin, çalışan PDF, doğru dil/marka ve admin alıcısı doğrulandı. TR/DE kullanılmış doğrulama bağlantısı 410 veriyor, tekrar mail üretmiyor. Test mesajları yalnız süreç içinde yakalandı; SMTP teslimi ORT07 altında açıktır. Kühlturm'un eski ortak e-posta şeması ile native DB uyumsuzluğu ve DE müşteri şablonundaki yanlış Kühlturm adı giderildi. Kanıt: `catalog/catalog-db-ensotek_com_tr.jsonl`, `catalog/catalog-native-de.jsonl`, `catalog/catalog-native-kuhlturm.jsonl`.

MOE için yayımlanmış 12 ürünün kendi ad/görsel/URL'lerinden TR/EN 7 sayfalık portföy PDF'i üretildi. 24 ürün bağlantısı 200, PDF imzası ve sayfa görselleri kontrol edildi. Bu yeni portföy teknik datasheet, kapasite veya sertifika kanıtı değildir. Dosyalar: `output/checklist-2026-09-09/catalog/moe-kompozit-portfolio-{tr,en}-20260910.pdf`; kaynak envanteri aynı dizindedir. Kamusal dosyalar kendi MOE `/uploads/catalog/` yoluna yüklendi; sosyal yayın yapılmadı.


## 10 Eylül — Teklif PDF, bülten ve Google sitemap

Ara toplam **67 kapalı / 37 açık**. TR02/TR04/DE04/DE08 kapandı. `tr-offer-pdf.jsonl` ve `tr-offer-acceptance.pdf` gerçek admin PDF üretimi/indirmesini kanıtlar. TR bülten `tr-newsletter-db.jsonl`, `tr-newsletter-browser.txt` ve mobil ekran görüntüsüyle doğrulandı. Backend build komutundaki `;` nedeniyle TypeScript hatası maskeleniyordu; `&&` ile gerçek hata kapısı kuruldu, newsletter defaultLocale tipi düzeltildi ve build temiz geçti.

DE menü/içerik/footer 22 kolon placeholder taramasında bulgu yok (`de-placeholder-db.json`). Yeni admin URL doğrulaması literal ve encoded placeholder'a 400 verdi (`de-placeholder-admin.jsonl`). Google sitemap mevcut kayıt/son indirme ve yeniden gönderim kanıtları `de-gsc-sitemaps-live.jsonl`, `de-gsc-sitemap-validation.jsonl`, `de-gsc-sitemap-apply.jsonl`. Değişiklik UUID `e99f830a-0146-45fc-a91c-fa87c55fb95d`; Google readback geçti. Son Google indirmesinin 135 URL göstermesi yeni 1165 URL sürümünün henüz yeniden işlenmediğini gösterir; indekslenme garantisi yazılmadı.

## 10 Eylül — Son uygulama ve kabul durumu

**104 maddede 81 kabul tamamlandı/kapsamdan çıkarıldı, 23 açık.** Devam talebindeki 62 açıktan 39'u kapandı. Aşağıdaki önceki ara toplamlar tarihsel kayıttır. Güncel tek sayaç ana checklist'tedir; [23 açık koşulun tamamı](ENSOTEK-KALAN-KABULLER-2026-09-10.md) kimliğiyle ayrılandı.

### Site ve veri kabulü

- TR 74 sitemap URL'si tam tarandı: canonical, H1, description ve JSON-LD sorun sayısı sıfır. Türkçe `ğ` içeren ürün ve galeri adreslerinde decode/routing düzeltmesi gerçek mobil sayfalarda geçti. Ortak sayfa metadata'sı route'un kendi adresini kullanıyor.
- DE 1165 URL ve sayfa türü kabulü; 80 güncel Google Inspection sonucunda 43 indexed, 16 crawled-not-indexed, 8 unknown, 2 soft-404, 5 discovered, 3 duplicate, 2 alternate, 1 noindex. Google'ın eski soft-404 bildirdiği iki URL bugün doğru gövdeye 308/200; Google'ın yeni taraması beklenir. 543 DE referans sayfasındaki tekrarlı sektör açıklamaları referans adıyla ayrıldı. Google kayıtları başarılı canlı URL kontrolüyle karıştırılmadı.
- MOE TR/EN ana ve kurumsal sayfalarında çelişkili 10+/15+ yıl, 250+/500+ proje, doğrulanmamış AS9100/ISO 9001 ve koşulsuz 3500 MPa gibi malzeme iddiaları temizlendi. `kompozit__` prefix'li gerçek DB ayarları, seed ve locale fallback birlikte düzeltildi. Doğrulanmamış kapasite yerine proje bazlı teknik değerlendirme yazıldı.
- K İngilizce arayüz eksikleri tamamlandı; ilk hero görseli dışında gereksiz ilk yük kaldırıldı, otomatik slayt kullanıcı tercihiyle çalışıyor, azaltılmış hareket/gizli sekme davranışı korundu.
- TR/DE katalog doğrulamasında gerçek DB atomik tüketim: eşzamanlı 200/410, tekrar 410 ve ek mail yok. K native admin gönderim akışı ayrı doğrulandı. MOE teklif eki gerçek upload/download/admin zincirinde geçti. Sentetik teklif/PDF/DB dosyaları doğrulanarak temizlendi. Dış alıcıya test mesajı gönderilmedi.

Kanıt kökü `output/checklist-2026-09-09/`: `continuation/tr-full-crawl-ready-summary.json`, `tr-seo-mobile.txt`, `moe-claim-acceptance.json`, `moe-offer-attachment.jsonl`, `test-pdf-cleanup.json`, `business-sources/de-gsc-inspection-current.jsonl`, `catalog/`.

### İçerik ve tek yayıncı

16 web taslağı: TR/MOE/Kühlturm/DE dörder. Gerçek CTA bağlantıları kontrol edildi. Ayrıca 24 Instagram, 8 opsiyonel Facebook uyarlaması, 32 kart ve 8 Reel kapağı hazır. Tanitio'da 24 Instagram kaydı **draft**, `scheduled_at=NULL`: tek Ensotek yayıncısında 12 (TR 8 + K 4), MOE'de 12. Tekrar kontrolde mevcut 24 kayıt bulundu; ikinci kayıt oluşmadı. Panel üzerinden 24 PNG HTTP 200. Facebook/LinkedIn için doğrulanmayan kanal atlandı; yeni hesap açılmadı.

Teknik/editoryal onay ve kampanya görsel izni bu dosyaların üretilmesiyle sağlanmış sayılmaz. Mevcut site görselleri gerçek üretim fotoğrafı olarak bağımsız doğrulanmadı; 8 kapak tamamlanmış video değildir. Yayın/zamanlama yapılmadı. Web ve sosyal ölçüm başlangıçları ayrılarak 28/30/60/90 gün takvimi yazıldı.

### Güvenlik

MOE'nin takip edilmiş üretim env dosyaları indeks dışına alındı, güvenli örnekler eklendi. İfşa olmuş DB/JWT/cookie sırları değiştirildi, MOE sınırlı DB hesabına geçirildi, 147 refresh oturumu iptal edildi. Eski DB parolası reddediliyor, yeni MOE hesabı diğer DB'lere giremiyor. **Ortak Cloudinary anahtarı diğer üç sitede kullanılıyor; sağlayıcı iptali henüz yok.** Git geçmişi otomatik yeniden yazılmadı. [Sır olayı kabulü](docs/GUVENLIK-MOE-SIR-KABUL-2026-09-10.md).

Dört sitede public kaydın admin/editor rolü üretmesi engellendi; mevcut admin girişi korunuyor. DE Google e-postası doğrulanmadan hesap eşlemesi yapılmıyor. Anonim şifre sıfırlama yanıtındaki JWT sızıntısı, tekrar kullanım ve reset JWT'sinin normal oturum yerine kabulü kapatıldı. Tek kullanımlık, parola/e-posta bağı olan ayrı kod ve gerçek reset ekranı canlıda. Dört backend build, izole gerçek HTTP+DB kontrolleri, dört canlı rol/legacy-token kontrolü ve dört mobil form kabulü geçti. [Auth kabulü ve komutlar](docs/GUVENLIK-AUTH-KABUL-2026-09-10.md).

### Son mobil laboratuvar ölçümleri

| Site / örnek | Performans | LCP | TBT | CLS |
|---|---:|---:|---:|---:|
| MOE ana sayfa | 90 | 3,173 sn | 194 ms | 0 |
| Kühlturm ana sayfa | 87 | 3,384 sn | 179 ms | 0 |
| DE gerçek ürün | 65 | 5,699 sn | 328 ms | 0 |

Üç ölçümde A11y/Best Practices/SEO 100. Bunlar aynı mobil Lighthouse profilindeki son boşta örneklerdir, gerçek kullanıcı CWV/INP sertifikası değildir. DE bozuk 3 Pro font yerine geçerli, lisansı eklenmiş küçük ikon alt kümeleri kullanıyor. Ürün LCP'si ilk yaklaşık 9,98 sn örneğinden iyileşti, hâlâ yüksektir. Layout dinamik ayırma denemesi fayda göstermediği için geri alındı; 74 puanlık ara örnek son sonuç olarak seçilmedi. DE16 açık kaldı. Tüm ara ölçümler ve `continuation/performance-final-summary.json` korunur.

### Kalanlar ve işlem sınırı

23 açıkta gerçek talep/SMTP teslimi, belge/uzman/görsel onayı, Cloudinary iptali, Meta OAuth, ikinci GA etiketinin sahipliği, abonelik/Ads kararı, yüksek DE mobil LCP ve ileri tarih ölçümleri bulunur. Gerçek Almanya şubesi, MOE kapasitesi, vergi/kayıt numarası veya gelecekteki metrik uydurulmadı. Sosyal yayın, dış alıcıya e-posta, reklam harcaması ve ücretli abonelik yapılmadı. ERP süreçleri ve önceki çalışma değişiklikleri korundu; toplu commit/reset yapılmadı.

## 10 Eylül — Çerez düğmesi kullanıcı düzeltmesi

Kullanıcının ekrandaki sürekli sol alt “Cookie preferences” düğmesini kaldırma talebi üzerine ortak `ConsentGate` içindeki koşulsuz sabit düğme kaldırıldı. İlk ziyarette seçim penceresi gelir; geçerli kayıtlı kabul/ret varsa açılmaz. Mevcut 180 günlük saklama ve izleyicilerin yalnız izinle çalışması korunur. Tercih değiştirme, dört sitenin normal footer akışındaki bağlantıya taşındı; sabit/floating kontrol yoktur.

Aynı kabul sırasında MOE'nin kapalı mobil menüsündeki uzun e-posta adresinin min-content genişliğiyle sayfayı 390 px'den 437 px'e taşırdığı bulundu. İlgili flex satırlarına `min-w-0`, e-postaya `overflow-wrap:anywhere` uygulandı; içerik gizlenmedi. DE katalog modalı ilk sayfa yükünden çıkarıldı, ilk açma isteğinde yüklenir; kapatma sonrası odak tetikleyici düğmeye döner.

Üretim build scripti dört siteyi kapsayacak şekilde tamamlandı. TR/MOE yerel API varsayımıyla başarısız olursa bu durum canlıya taşınmaz; doğru public HTTPS origin ve sitemap kapısıyla build yapılır. Cookie düzeltmesi yeni bir checklist maddesi sayılmadı; ORT04/ORT13/DE16 kanıtlarına eklenir. Son kabul dosyaları `output/checklist-2026-09-10-cookie/` altındadır.

MOE taşma kabulünde ikinci neden sayısal sayaçların yerini alan metinlerin eski 3,5 rem / 1,8 rem boyutlarında kalmasıydı. StatsBar ve MaterialCards metinleri responsive boyut, satır yüksekliği ve gerektiğinde satır bölme ile düzeltildi; içerik veya doğrulanmış değer değiştirilmedi.

Son DE ürün Lighthouse örneği: performans 65, erişilebilirlik/BP/SEO 100, LCP 4,860 sn, TBT 453 ms, CLS 0. Önceki örneğe göre LCP 5,699 → 4,860 sn, TBT 328 → 453 ms; toplam skor artmadı. Tek örnekten bütün performansın iyileştiği sonucu çıkarılmadı; DE16 açık. Kanıt: `output/checklist-2026-09-10-cookie/de-performance-summary.json`.


## 10 Eylül 09:10 UTC — DE16 layout aktarımı ve mobil animasyon yükü

- Header/Footer/SiteLogo yalnızca kullanılan 7 anahtarı tek paylaşılan, locale içeren query ile alıyor. Tam ayar listesiyle DE/EN/TR değer eşitliği doğrulandı; DE 83.965 → 2.377 bayt (%97,2 azalma). Diğer içerik sayfalarının tam ayar sorgusu korundu.
- Küçük ekran ve azaltılmış hareket tercihinde AOS import edilmiyor. Canlı Playwright: mobil/desktop/reduced-motion profilleri geçti; AOS chunk yalnızca masaüstünde, logolar görünür, footer tercih düğmesi 1, taşma ve JS hatası yok.
- İlk build public API 429 nedeniyle durdu, yayına alınmadı. Build guard isteğe bağlı SSH iç API tüneli desteği aldı; public bundle origin sabit kaldı. Başarılı build: 1.165 sitemap URL; TypeScript ve production origin kontrolü geçti. Tünel portu client bundle içinde yok.
- Frontend canlıya alındı; rollback: `.next/standalone.before-checklist-20260910T090825Z`. Altı kaynak dosyası da canlı repo ile eşitlendi.
- Aynı ürün URL’si, aynı mobil Lighthouse profili: **65 → 70**, LCP **4,860 → 4,386 sn**, TBT **453 → 471 ms**, CLS **0**; A11y/BP/SEO **100**. Tek laboratuvar karşılaştırması nedensellik veya gerçek kullanıcı CWV kanıtı değildir. TBT düzelmedi ve LCP hâlâ yüksek olduğundan **DE16 açık**.
- İkon CSS’nin kalan yaklaşık 78 KB yükü henüz azaltılmadı; CMS ikon eşlemeleri kontrol edilmeden budanmadı.
- Sayım değişmedi: **81 kapalı/kapsam kararı, 23 açık**. Kanıt: [performans paketi](output/checklist-2026-09-10-performance/README.md).


## 10 Eylül 09:29 UTC — DE16 ikon CSS ayrımı

- 470.470 bayt açılmış ikon CSS yerine ilk açılışta 29.531 bayt çekirdek dosya yükleniyor. Son Lighthouse ağ kaydında aktarım **4.277 bayt**; önceki tam CSS yaklaşık **78 KB** idi.
- Kaynakta kullanılan 53 sınıfın kuralları korunuyor; yardımcı stiller/font-face kuralları tutuluyor. 6.140 kullanılmayan eşleme ilk dosyadan ayrıldı. Yönetim panelinden farklı bir `fa-*` sınıfı gelirse mevcut tam dosya yalnızca gerektiğinde yükleniyor.
- Canlı DE/EN/TR ana sayfa + ürün + iletişim karşılaştırmasında 23/23/23/25/28 ikonun sınıf, karakter ve font ailesi değişmedi. Taşma/JS hatası yok. Dinamik CMS denemesinde `fa-fish` eşlemesi tam CSS bir kez indirilerek doğrulandı; DB veya içerik değiştirilmedi.
- Üretim build/TypeScript ve 1.165 sitemap URL kabulü geçti. Canlı rollback: `.next/standalone.before-checklist-20260910T092810Z`. Kaynak/CSS hash eşitliği doğrulandı. Üretim build yardımcısı artık küçük CSS ve manifesti kaynaktan yeniliyor.
- Aynı ürün ve mobil Lighthouse profili, tek yeni koşu: **70 → 65**, LCP **4,386 → 4,309 sn**, TBT **471 → 645 ms**, CLS **0**; A11y/BP/SEO **100**. CSS aktarımı azaldı ancak toplam skor/TBT kazanımı yok. Tek koşu değişimin nedenini kanıtlamaz; sonuç gizlenmedi ve **DE16 açık bırakıldı**.
- Sayım **81 kapalı/kapsam kararı, 23 açık**. Kanıt: [ikon kabul paketi](output/checklist-2026-09-10-icons/README.md).


## 10 Eylül 09:36 UTC — DE16 sunucuda sayfa iskeleti

- Hook/olay işleyicisi içermeyen `Layout` istemci sınırından çıkarıldı. Böylece kullanılmayan alternatif Header/Footer şablonları normal sayfanın JS yüküne taşınmıyor; etkileşimli Header/Footer/ScrollProgress kendi istemci sınırlarında kaldı.
- Layout'u istemciye tekrar taşıyan locale 404 ekranı `getTranslations` ile sunucuda render ediliyor. Çeviri ve 404 akışı korunuyor.
- Canlı mobil menü → iletişim geçişi, footer çerez tercihinin açılması, DE/EN/TR bilinmeyen ürünlerde gerçek HTTP 404 ve noindex (390/1440 px) geçti. Taşma veya JS hatası yok. İlk test yanlışlıkla masaüstü butonunu aradı; gerçek mobil `Toggle Sidebar` seçicisiyle yeniden geçti.
- Build/TypeScript, 1.165 sitemap ve production origin kabulü geçti. Rollback: `.next/standalone.before-checklist-20260910T093438Z`; iki kaynak dosyası canlı ile hash eşit.
- Aynı ürün, tek yeni mobil Lighthouse: JS **349.337 → 279.281 bayt**, **22 → 17 dosya**; performans **65 → 83**, LCP **4,309 → 3,721 sn**, TBT **645 → 168,5 ms**, CLS **0**; A11y/BP/SEO **100**. Önceki başarısız skorlar raporda korunuyor. Bu laboratuvar koşusu gerçek kullanıcı INP/CWV kabulü değildir.
- **DE16 açık**, çünkü LCP hâlâ hedef üzerinde ve saha örneklemi yok. Toplam **81 kapalı/kapsam kararı, 23 açık**. [Kanıt paketi](output/checklist-2026-09-10-layout/README.md).


## 10 Eylül 09:50 UTC — DE16 kullanılmayan tema CSS

- Root layout artık kullanılmayan `.fourth-page` Bootstrap/tema kopyasını her sayfaya yüklemiyor. Mevcut `:root` renk/değişkenleri, box-sizing, azaltılmış hareket koşullu scroll ve farklı progress-bar keyframe'i küçük `bootstrap-theme.scss` içinde aynı tutuldu. Aktif route'larda `header={4}` yok; orijinal tema kaynağı silinmedi.
- On ekran (DE/EN/TR ana sayfa, ürün, iletişim × 390/1440 px), toplam 562 öğenin renk/font/yerleşim özellikleri önce/sonra aynı. Taşma ve JS hatası yok. İlk okumada bir offscreen container'ın çözümlenmiş otomatik margin'i zamanlamaya göre 0/60 px değişti; capture öncesi `getBoundingClientRect()` ile layout tamamlatılınca tüm karşılaştırmalar geçti.
- Üretim derleme/TypeScript, 1.165 sitemap ve origin kontrolü geçti. Rollback: `.next/standalone.before-checklist-20260910T094547Z`; iki kaynak dosyası canlı hash eşit.
- CSS: **84.413 → 58.062 bayt aktarım**, **592.789 → 388.783 bayt açılmış içerik**, 4 → 3 dosya.
- Aynı ürün ve mobil Lighthouse profili, tek yeni koşu: performans **83 → 90**, LCP **3,721 → 2,186 sn**, TBT **168,5 → 369 ms**, CLS **0 → 0,00038**; A11y/BP/SEO **100**. Bu koşuda LCP 2,5 sn altında, ancak TBT kötüleşti. Sonuçlar saklanmadı/cherry-pick yapılmadı; gerçek kullanıcı CWV kabulü verilmedi.
- **DE16 açık**: TBT maliyeti ve saha INP/CWV kabulü. Toplam **81 kapalı/kapsam kararı, 23 açık**. [Kanıt paketi](output/checklist-2026-09-10-theme/README.md).


## 10 Eylül 10:10 UTC sonrası — teklif sorguları ve tekrarlanabilirlik

- CPU profili alındı; bir uygulama bileşenine kesin TBT nedeni atanmadı. Paket başlatma ve React süreleri ayrı kanıt olarak saklandı.
- OfferForm artık genel türde ürün/hizmet listelerini indirmiyor; yalnızca seçilen türün sorgusu etkin. Ürün query key locale içeriyor; diğer hook çağrılarının varsayılan davranışı korundu.
- Canlı DE/EN/TR genel → ürün → hizmet → ürün → genel geçişleri geçti. İlk açılış 0 liste isteği; her tür bir kez yükleniyor, cache yeniden kullanılıyor, girilen e-posta korunuyor. Ürün detayındaki hazır seçim korundu, hizmet isteği 0. Test POST göndermedi.
- Build/TypeScript, 1.165 sitemap ve origin kabulü; rollback `.next/standalone.before-checklist-20260910T101002Z`; üç kaynak dosyası canlı hash eşit.
- İlk yeni mobil koşu 86 / LCP 3,567 sn / TBT 188,5 ms. Önceki tek 90 puan/2,186 sn koşusuna göre dalgalanma sürdüğü için aynı sürümde iki ek sıralı koşu alındı: 76 / 3,743 sn / 465 ms ve 81 / 3,718 sn / 254 ms.
- **Ortanca: 81 puan, LCP 3,718 sn, TBT 254 ms.** Puan aralığı 76–86. A11y/BP/SEO üç koşuda 100. Sonuç seçilmedi; eski 90 puan kalıcı başarı olarak sunulmuyor. LCP/TBT ve gerçek kullanıcı CWV kabulü açık.
- Toplam **81 kapalı/kapsam kararı, 23 açık**. [Profil, sorgu ve tekrar ölçüm kanıtları](output/checklist-2026-09-10-profile/README.md).


## 10 Eylül — sıradaki TAN03, ikinci GA4 etiketi

- Performans çalışmasına devam edilmedi; TAN03 için yeni GTM sürüm geçmişi, silinmiş mülkler dahil GA4 akış taraması ve collection-engellemeli tarayıcı kontrolü yapıldı.
- **Yeni bulgu:** tag 22 / `G-XECX77LB6M` betiği 404. Hedef v8 → v9 arasında değişmiş; doğru tag 23 v10’da eklenmiş. Doğru `G-7S6TW9CNRJ` betiği 200.
- Aynı Ensotek hesabında 14 mülk/14 akış, hata 0; bilinmeyen kimlik için eşleşme yok. Başka hesaplara dair sahiplik çıkarımı yapılmadı.
- Reddedilen consentte ölçüm/betik isteği yok. İzin sonrası 5 saniyede doğru hedefe tek page_view; collection istekleri Google'a gitmeden yakalandı. Çift sayım iddiası yazılmadı.
- GTM sürümü/ayarları değiştirilmedi. TAN03 sahiplik ve tag 22’nin duraklatılması/düzeltilmesi kararı nedeniyle açık. **81 kapalı/kapsam kararı, 23 açık**.
- [TAN03 raporu ve somut değişiklik sınırı](docs/analytics/ENSOTEK-IKINCI-GA4-ETIKETI-2026-09-10.md).


## 11 Eylül — K22 MOE mobil menü (kullanıcı bildirimi)

- Belirti: kaydırılmış ana sayfada menü açılınca görünmüyor. Canlı CSS'te `.header-shell-scrolled` yalnız `-webkit-backdrop-filter:blur(20px)` taşıyor; Safari bunu uygulayıp header'ı containing block yapıyor, header içindeki `fixed` menü 69 px kutuda kalıyor. Chromium öneki tanımadığı için önceki tüm Chromium kabulleri hatayı göremedi.
- Düzeltme: `Header.tsx` içinde `<nav>` header dışına (fragment kardeşi) alındı; odak tuzağı, `inert`, scroll kilidi ve ref'ler değişmedi.
- Kabul: Chromium'a `backdrop-filter` enjekte ederek Safari taklidi. Canlı önce nav 68 px (hata), yerel aday ve canlı sonra 857 px tam ekran. K13 regresyonu canlıda geçti. Build (72 URL), tema, release kapıları geçti; lint 0 hata/2 eski uyarı.
- Canlı rollback `.next/standalone.before-checklist-20260911T112616Z`; `Header.tsx` canlı kaynakla hash eşit. Gerçek iPhone kabulü kullanıcıda. Diğer üç sitede aynı kalıp bulunmadı. [Kanıt](output/checklist-2026-09-11-moe-menu/README.md).
- Sayım: **82 kapalı / 23 açık (105 madde)**.


## 11 Eylül — ORT14 kapanışı ve Cloudinary kararı

- Beş repo (root, DE, TR, MOE, Kühlturm) commit+push edildi; MOE `[skip ci]` ile, push tetikli deploy workflow'u çalışmadı (o workflow Haziran'dan beri her koşuda başarısız).
- Tam Git geçmişi taraması: canlı ortamla eşleşen tek gerçek sır eski Cloudinary anahtar/sır çifti; root 5 uzak commit (seed SQL + DB snapshot), DE 1, MOE 3 (eski `.env.production` + seed), Kühlturm 1 (seed); TR temiz. MOE'nin geçmişteki `.env.production` dosyalarında DB/JWT/SMTP/Google alanları `change-me` yer tutucu. Root'ta yalnız yerel `refs/stash` içinde eski Kühlturm DB parolası var; uzakta yok ve DB `kuhlturm_live`'a taşındı.
- Dört canlı backend `STORAGE_DRIVER=local`; MOE env'inde Cloudinary anahtarı boş, DE/TR/K env'inde eski çift duruyor ama aktif yükleme yolu değil. Tanitio env'lerinde Cloudinary yok; Tanitio depolama ayarı `file_storage_config` tablosunda şifreli tutulur.
- **Kullanıcı kararı:** Cloudinary sızıntısı önemsiz, uğraşılmayacak; işletme belgeleri sonra. Bu kararla geçmiş yeniden yazımı ve force push yapılmadı. ORT14 kapandı.
- Sayım: **83 kapalı / 22 açık (105 madde)**.


## 11 Eylül — K23 MOE hero ürün mozaiği (kullanıcı isteği)

- Stok karbon kumaş görseli yerine gerçek ürünler: farklı kategorilerden öne çıkan 3 ürün kartı, "12 ürünün tümünü gör", 5 kategori çipi. Sunucu bileşeni; ürün/marka adı koddan gelmez; API boşsa fallback, 2'den az ürünse eski görsel.
- Görseller `next/image` optimizer ile AVIF; ilk kart LCP öncelikli. Yerel adayda `/uploads` olmadığı için kabul betiği görsel isteklerini canlıya yönlendirir.
- Canlı masaüstü/mobil, koyu/açık kabul geçti; build (72 URL), tsc, lint, tema, release kapıları geçti. Rollback `standalone.before-checklist-20260911T140020Z`; kaynaklar canlıyla hash eşit; commit `c43e9d0` `[skip ci]`.
- Sayım: **84 kapalı / 22 açık (106 madde)**. [Kanıt](output/checklist-2026-09-11-moe-hero/README.md).


## 11 Eylül — TR09 ensotek.com.tr Bilgi Bankası dil sorunu (kullanıcı bildirimi)

- `/en/blog` TR başlık ve TR slug basıyordu. Üç katmanlı neden: 9 yazının yalnız TR i18n satırı; ortak backend istenen dil yoksa sessizce TR döndürür; frontend yanıttaki `locale`'e bakmıyordu, `<html lang>` sabit "tr".
- Düzeltme: 017 seed ile 9 EN satırı (6 ensotek.de kütüphanesinin mevcut EN metni, 3 çeviri) canlı DB'ye yedekli uygulandı; liste/sitemap/hreflang envanteri `locale` filtreli; yabancı slug aynı içerik kimliğinin doğru slug'ına 308, karşılığı yoksa 404; kök layout dili next-intl başlığından alıyor.
- Kabul yerel aday ve canlıda 8 kontrolle geçti (EN liste, TR liste, EN/TR detay, çapraz slug 308'ler, 404, hreflang, sitemap 9+9). Build 74 URL; rollback `.next.before-checklist-20260911T161958Z`; commit `814ab1f`.
- Sayım: **85 kapalı / 22 açık (107 madde)**. [Kanıt](output/checklist-2026-09-11-tr-blog-i18n/README.md).
