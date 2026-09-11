# Ensotek ailesi — birleşik denetim ve Tanitio eksikleri checklist’i

**Derleme tarihi:** 9 Eylül 2026. **Kapsam:** `ensotek_com_tr`, `ensotek_de`, `kompozit`, `kuhlturm`; ortak `packages/` ve ilgili Tanitio işleri (`../ekosistem-sosyal-medya`).

Bu dosya dört projenin **ortak takip noktasıdır**. Site denetimleri ile Tanitio’nun bulduğu hata, veri kalitesi, entegrasyon ve içerik eksikleri birleştirildi. İlk derlemeden sonra kullanıcı talebiyle uygulama ve canlı kabul yapıldı. 9 Eylül kapanış kanıtları [S17] altında; yalnız kabulü tamamlanan kutular işaretlidir. Açık kalanlar arasında yazılım işleri, işletme verisi, hesap erişimi ve ileri tarih ölçümleri vardır.

## 9 Eylül uygulama kararları

- Kullanıcı kararı: Kühlturm, Ensotek alt markasıdır; sosyal yayınlar tek Ensotek hesabından yürütülür. Ayrı sosyal hesap açılmayacak.
- Kullanıcı kararı: ensotek.de DE, EN ve TR sayfaları indekslemeye açık kalır. Dil kaldırma veya genel EN/TR noindex uygulanmayacak.
- Dört frontend ve Tanitio GTM düzeltmesi canlıya alındı. Kısmi kabul, yeni canlı ölçüm veya kullanıcı verisi bekleyen kutular açık bırakıldı.

## Kullanım ve durum kuralları

- `[ ]` açık iş / karar / doğrulama; `[x]` kaynakta tamamlandığı kanıtlı iş. Açık kutu her zaman kanıtlanmış canlı hata anlamına gelmez.
- **Doğrulandı:** 9 Eylül site denetiminde kanıtlı. **Kaynak bulgusu:** Tanitio veya eski raporda bildirilmiş; uygulama öncesi güncel örnek tekrar doğrulanır. **Hazır, deploy bekliyor:** yerel değişiklik mevcut, canlı kabul yapılmamış. **Doğrulama / karar:** henüz sonuçlandırılmamış iş.
- **P0:** veri/marka izolasyonu veya temel erişim/indexleme engeli. **P1:** SEO, talep, ölçüm ve güven kaybı. **P2:** içerik/erişilebilirlik/işletim iyileştirmesi. **P3:** kanal/işletme tercihine bağlı genişleme.
- Ortak sorun tek kez **ORT** veya **TAN** bölümünde takip edilir; proje bölümleri ilgili kimliğe referans verir. Eski raporların K/T kimlikleri korunmuştur.
- Bir iş ancak ilgili kaynak düzeltmesi ve gerçek hedef URL/akış kabulüyle kapanır. Yerel başarı, canlıya alındı anlamına gelmez. Yayın/hesap/plan kararları bu checklist’in yazılmasıyla alınmış olmaz.
- Eski fresh-seed önerileri canlı DB’de otomatik uygulanacak adım değildir. Özellikle ensotek.de/Kühlturm ortak DB gerçeği çözülmeden ayrı site sanılarak reset yapılmaz.

**Takip özeti:** 22 açık iş/karar/doğrulama, 85 tamamlanmış veya kullanıcı kararıyla kapsamdan çıkarılmış kabul (107 madde; TR09 blog i18n 11 Eylül'de eklendi ve kapandı; K23 hero ürün mozaiği 11 Eylül'de eklendi ve kapandı; K22 11 Eylül'de eklendi ve kapandı, ORT14 11 Eylül'de kullanıcı kararıyla kapandı). Açık öncelikler: P0: 0, P1: 11, P2: 10, P3: 1.

**10 Eylül son durum:** [23 açık maddenin somut kapanış koşulları](ENSOTEK-KALAN-KABULLER-2026-09-10.md). Başlangıçtaki 62 açıktan 39 kabul kapandı; kaynakta olmayan işletme verileri ve gelecek dönemler tamamlanmış sayılmadı.

## Proje ve tenant eşlemeleri

| Proje | Site | Gerçek Tanitio tenant | GA4 mülk / ölçüm | GSC seçimi |
|---|---|---|---|---|
| `ensotek_com_tr` | www.ensotek.com.tr | `ensotek-9d0af55c` | 553429329 / G-6FRMLLS0J9 | https://www.ensotek.com.tr/ |
| `ensotek_de` | ensotek.de | `ensotek` | 504406901 / G-7S6TW9CNRJ | sc-domain:ensotek.de |
| `kompozit` | www.karbonkompozit.com.tr | `moe-kompozit-4de92704` | 547431151 / G-S8V8GTJHZV | https://www.karbonkompozit.com.tr/ |
| `kuhlturm` | kuhlturm.com | `kuhlturm` | 553360294 / G-KXDKCDY0ET | https://kuhlturm.com/ |

Kaynak: [S1]. 8 Eylül seed belgelerindeki `ensotek-comtr` / `karbonkompozit` isimleri yeni tenant açma gerekçesi değildir. Dört site için güncel içerik kontratı **Bearer + `/api/integrations/tanitio`**; eski `X-Api-Key` önerisinin yerini [S10] aldı.

## Çelişkili/eski notların çözümü

| Eski iddia | Bu checklist’te esas alınan durum |
|---|---|
| GA4 / GSC yok, yeniden OAuth gerekli | [S1] son kabulünde dört tenant GA4/GSC API 200; page_view collect 204. Yeniden kurulum açık iş değil. Dönüşüm ve consent ayrı açık. |
| Dört içerik kaynağı yok / configured=false | [S1] son **İçerik API bağlantısı — tamamlandı** bölümü ve [S10]: dördü bağlı, configured=true; auto_sync=false bilinçli. |
| MOE logo, renk, künye ve hashtag boş | [S2] sonrası tamamlandı. İddia tutarlılığı ve sosyal OAuth hâlâ açık. |
| Türkiye sektör/hedef kitle genel yer tutucu | [S3] strateji revision 1 ile tamamlandı; company/logo/renk/hashtag kalanları ayrıca doğrulanacak. |
| Üç sitede posta adresi hiç yok | 9 Eylül Kompozit/Kühlturm denetimleri görünür adres doğruladı. Genel “adres ekle” işi yerine profil/site/kurumsal bilgi mutabakatı var. |
| Kühlturm canonical mutlaka www | [S8] son host kontrolünde canonical apex; iki host da 200. Güncel sorun host konsolidasyonu ve alt sayfa canonical mirası. |
| Kompozit sitemap 62 URL | [S7] son tarama 60 URL; sekiz makale dışarıda. |
| Kühlturm 140 kalıcı boş sayfa | [S8] yeniden kontrolde 125 referans toparlandı; 13 gerçek boş adres + 2 kontrollü olmayan legal slug kaldı. API hatasını boş-200 gösterme sorunu açık. |
| GTM token var → test başarılı | Taze container testi canlıya alındı; iki Test Et başarılı, TR/Kühlturm opsiyonel kart. [S17] yeni kabulü esas alınır. |
| Eski checklist tüm frontend işlerini tamamlandı gösteriyor | Scaffold tamamlanması güncel akış/SEO kabulü değildir; eski tarihli açık kontroller doğrulama olarak taşındı. |

## 1. Ortak işler — tek uygulama, dört siteye ayrı kabul

- [x] **ORT01 · P0 · ensotek_de + kuhlturm / backend · Doğrulandı — DB ve site izolasyonu (T01)** Canlı iki backend DB_NAME=ensotek. Ortak/ayrı mimari kararı, veri/ayar sahipliği ve güvenli geçiş planı çıkar; doküman/seed/runtime eşleşsin. Bir sitenin ayarı diğerini etkilemesin. Kaynak: [S1], [S8]. **10 Eylül kabulü:** `kuhlturm_live` + sınırlı DB hesabı + bağımsız 249 medya dosyası canlıda; tüm API yolları 8089. 10 iş tablosu geçiş eşitliği, 253 dosya/yetki kontrolü ve 1086/1086 public URL kontrolü geçti. Eski DB’ler/yedek korundu. [İşletim kaydı](kuhlturm/docs/runtime-isolation-2026-09-10.md), [kanıt](output/checklist-2026-09-09/isolation/cutover.json).

- [x] **ORT02 · P0 · kuhlturm + ensotek_de / veri, seed · Kaynak bulgusu — Üretime çıkmış demo yorumları ayır** [S9] onaylı example.com yorumlarını canlıda bildirmiş. Önce kayıt kimliği ve demo kaynağını yeniden doğrula; gerçek yorumları koruyarak demo kayıtların yayını/üretim seed’i düzelsin. Ortak DB nedeniyle iki sitenin görünür çıktısı birlikte kontrol edilsin. Kaynak: [S9], [S8]. **9 Eylül kabulü:** Dokuz doğrulanmış demo kaydın onay/yayın bayrağı yedekli işlemle kapatıldı; DE/Kühlturm public liste boş. İki üretim seed dosyasında demo onayı kaldırıldı. [S17].

- [x] **ORT03 · P1 · ensotek_de + kuhlturm / içerik · Kaynak bulgusu — Yayımlanmış Almanca kalite sayfasının boş HTML gövdesi** Tanitio içerik kabulünde gövde boş. Gerçek belge/kalite içeriği doldurulsun veya yayın durumu bilinçli değişsin; iki web görünümü ve Tanitio pages/article type=page yanıtında boşluk kalmasın. Kaynak: [S1], [S10]. **10 Eylül kabulü:** Eski Ensotek kaynağındaki ISO 9001/10002 (21.10.2026) ve 12.02.2025 CE beyanı okunarak gövde dolduruldu; eski 14001/45001 güncel sayılmadı. İki site DE/EN HTML ve 8 Tanitio pages/articles yanıtı dolu. [Kanıt](output/checklist-2026-09-09/business-sources/quality-contract-live.jsonl).

- [x] **ORT04 · P1 · dört frontend + Tanitio / ölçüm · Doğrulama; K16 ve T19 canlı gözlem — Çerez tercihi ve Consent Mode kabul/ret davranışı** Kompozit/Kühlturm tercihten önce GA çerezi yazıyor. Mevcut tercih akışı ve hedef pazar gereksinimleriyle dört site kabul/ret ağ-cookie testi yapılsın; hukuki uygunluk kanıtsız ilan edilmesin. Kaynak: [S1], [S7], [S8]. **9 Eylül kabulü:** Dört canlı sitede tercih öncesi izleyici/GA çerezi yok; kabulde doğru GA, geri çekmede çerez temizliği ve yeniden yükleme doğrulandı. Bu teknik kabul hukuki uygunluk sertifikası değildir. [S17]. **10 Eylül kullanıcı düzeltmesi:** Sürekli sol alt tercih düğmesi kaldırıldı; normal footer bağlantısı var. Dört temiz tarayıcıda ilk ziyaret/seçim/yenileme/navigasyon kabulü geçti. [Kanıt](output/checklist-2026-09-10-cookie/README.md).

- [ ] **ORT05 · P1 · dört backend/frontend + Tanitio / ölçüm · Açık kabul — Başarılı gerçek kayıt için tekil generate_lead** Teklif/iletişim kayıt başarısı ile event ilişkilendirilsin; başarısız/tekrar/test kayıtlar ayrışsın. GA4 anahtar etkinlik tanımı, doğru mülk ve DB kayıt sayısıyla mutabakat kanıtlansın. Secret varlığı MP event üretimi değildir. Kaynak: [S1], [S3], [S4], [S5].

- [x] **ORT06 · P1 · dört frontend + Tanitio / ölçüm · Açık kabul — Telefon/WhatsApp mikro dönüşümleri ve kaynak atfı** Tıklamaları gerçek lead’den ayrı ölç; UTM/kaynak → ilgili ürün/rehber → talep kaydı akışı doğrulansın. Sosyal satış katkısı kayıt mutabakatı olmadan raporlanmasın. Kaynak: [S1], [S4]. **10 Eylül kabulü:** Dört canlı sitede telefon/WhatsApp/e-posta mikro etkinlikleri doğru GA4 hedefine gidiyor; izin öncesi etkinlik yok. Ürün/rehber → form gezinmesinde UTM korunuyor ve gerçek DB/admin kabulünde kayıtla eşleşiyor. Tarayıcı testinde GA gönderimi yakalandı; satış katkısı iddiası yok. [S17].

- [ ] **ORT07 · P1 · dört backend + packages/shared-backend · Eski brief; yeniden doğrulama — SMTP ve gerçek alıcıya talep teslimi** Hostinger SMTP kararını koru; güncel DB-driven resolver, domain/from, izlenen admin alıcısı ve müşteri yanıtını doğrula. Eski eksik seed/dead SMTP config iddiaları önce güncel kaynakta kontrol edilsin. Contact/offer/katalog/varsa orders akışının teslim kanıtı ayrı olsun. Kaynak: [S16], [S7], [S8].

- [x] **ORT08 · P1 · packages/shared-backend / mail · Eski brief; yeniden doğrulama — Eksik admin bildirim yolları** Contact admin alıcısının noreply kutusuna düşmediğini; orders admin e-postası ve katalog yeni-talep bildirimini kontrol et, yalnız eksik yolları tamamla. Orders müşteriye yeni mail veya SMS/WhatsApp/Telegram genişletme bu iş değildir. Kaynak: [S16]. **10 Eylül kabulü:** Contact ve katalog gerçek DB + izole mail yakalama kabulünde izlenen admin alıcısına ulaşıyor. Dört uygulamanın aktif route kayıtlarında orders modülü yok; kullanılmayan ortak orders controller mevcut admin bildirimini içeriyor. Yeni sipariş veya müşteri mail akışı eklenmedi. Kanıt: lead-db ve catalog-native/db kabul dosyaları.

- [x] **ORT09 · P1 · ensotek_de + ensotek_com_tr / footer, Tanitio · Kaynak bulgusu — Kırık @ensotek YouTube bağlantısı** 8 Eylül 404 bulgusunu gerçek kanal kimliğiyle yeniden doğrula; varsa doğru URL, yoksa bağlantının kaldırılması. Ortak listeden Kühlturm’a taşınan aynı link de kontrol edilsin. HTTP 200 tek başına sosyal hesap sahipliği kabulü değil. Kaynak: [S9]. **10 Eylül kabulü:** Eski resmi sitedeki UCX22ErWzyT4wDqDRGN9zYmg kanal kimliği ve Ensotek kanal başlığı HTTP 200 doğrulandı. DE/TR/Kühlturm ayar, footer, TR sameAs ve Tanitio profil URL’leri düzeltildi; eski @ensotek bağlantısı public HTML’de yok. [Kanıt](output/checklist-2026-09-09/business-sources/public-final.json).

- [ ] **ORT10 · P1 · dört site / içerik + işletme · Karar/doğrulama — Deneyim, üretim, kurulum ve sertifika iddiaları** Kuruluş/ülke/proje sayısı, gerçek kapasite, sertifika geçerliliği ve izinli referanslar belgelensin. MOE 15+/500+ ile 10+/250+ çelişkisi giderilsin; sayısal malzeme değerleri tüm ürünlere genellenmesin. CTI/Eurovent varmış gibi yazılmasın. Kaynak: [S2], [S4], [S13]. **10 Eylül:** MOE TR/EN ana ve kurumsal sayfalardaki doğrulanmamış sayaç/sertifika ve koşulsuz malzeme değerleri temizlendi. Ensotek verileri MOE kapasitesi sayılmadı. [Canlı kabul](output/checklist-2026-09-09/continuation/moe-claim-acceptance.json).

- [x] **ORT11 · P1 · dört site + Tanitio / profil · Doğrulama — Şirket künyesi ve sabit marka varlıklarını eşleştir** Sitedeki gerçek adres/telefon/tüzel ad ile tenant company/contact/logo/renk alanları tutarlı olsun. Sabit marka URL’si kullan; hash’li build dosyasına kalıcı profil bağlama. MOE tamamlanan profilini yeniden boş sayma. Kaynak: [S1], [S2], [S9]. **10 Eylül kabulü:** Dört tenant company/contact/branding/sabit logo kaynakları API üzerinden okundu, üç Ensotek künyesi eski resmi site ile eşleştirildi, MOE profili korundu. profile-api-proof.jsonl ve profile-logo-proof.json. Adresin ticaret sicili niteliği DE09 altında ayrı açık.

- [x] **ORT12 · P1 · dört site / talep akışları · Doğrulama — Teklif, iletişim, ek dosya, PDF ve katalog uçtan uca kabulü** Önce mevcut uygulama ve kayıt yolunu incele; kontrollü kabulde kayıt, dosya, doğru marka/locale, admin görünümü ve izin verilen teslim zincirini kanıtla. Bu belge test mesajı göndermiş sayılmaz. Kaynak: [S7], [S8], [S11], [S16]. **10 Eylül kabulü:** Dört sitede gerçek contact/offer DB ve admin görünümü, marka/locale kabulü; TR gerçek admin teklif PDF üretimi/indirmesi; TR/DE katalog doğrulama yarışında yalnız bir gönderim (200/410), Kühlturm admin katalog eki; MOE gerçek dosya yükleme→teklif→admin→indirme kabulü geçti. Test kayıt/dosyaları temizlendi. Bildirimler izole yakalandı; dış SMTP teslimi ORT07 altında açık.

- [x] **ORT13 · P2 · dört frontend / SEO, kalite · Doğrulama — Kapanışta gerçek URL ve mobil regresyon denetimi** Sitemap/indexlenebilir küme, canonical, hreflang, 404/5xx ayrımı, görünür içerik, 390 px CTA/odak ve sayfa türü bazlı schema kontrolü yap. TypeScript/Lighthouse ana sayfa SEO 100 tüm sitenin kabulü değildir. Kaynak: [S7], [S8], [S12]. **9 Eylül ilerleme:** 82 sayfa türü/locale örneği ve Kompozit tüm 72 URL kontrol edildi. Kühlturm 1086/1086 canlı URL kabulü de geçti; TR/DE kapsamlı regresyon ayrı takip ediliyor. [S17]. **10 Eylül kabulü:** DE 1165, Kühlturm 1086, MOE 72 ve düzeltilen TR 74 gerçek URL kümesi tarandı. TR canonical/H1/slug/hreflang düzeltmeleri sonrası 74/74 sorunsuz; dört yeni 390 px örnek de geçti. DE eski adresler 200 hedefe yönleniyor, gerçek eksik 404. Schema/locale/API 5xx ayrımı önceki kanıtlarla birlikte değerlendirildi. tr-full-crawl-ready-summary.json, tr-seo-mobile.txt.

- [x] **ORT14 · P1 · dört repo + kök / işletim · Doğrulama — Repo-runtime dokümanlarını ve secret hijyenini doğrula** DB/port/PM2/env kaynağı ve doküman drift’i kapanmalı; gerçek secret Git/rapora taşınmamalı. Eski client_secret ignore, placeholder alıcı ve etkisiz SMTP config maddeleri yalnız güncel kanıtla kapatılsın. Kaynak: [S9], [S16], [S8]. **9 Eylül ilerleme:** Çalışan port/PM2/nginx haritası [S17] içinde. Build dağıtımı tamamlandı; tüm repo-runtime kaynak/doküman eşleşmesi ve kapsamlı secret denetimi kapanmadı. [S17]. **10 Eylül ek kabul:** MOE DB/JWT/cookie rotasyonu ve hesap izolasyonu, dört sitede signup rolü ve reset kodu sızıntısı düzeltmesi canlıda doğrulandı. **11 Eylül kapanış:** 9–11 Eylül kaynak/doküman/kanıt değişiklikleri beş repoda commit+push edildi, çalışma ağaçları temiz. Beş reponun tam Git geçmişi tarandı: canlı ortamla eşleşen tek gerçek değer eski Cloudinary anahtar/sır çifti (root, DE, MOE, Kühlturm geçmişinde seed SQL/DB snapshot/eski `.env.production` içinde; TR temiz); diğer tüm sır görünümlü satırlar `change-me` tipi yer tutucu. **Kullanıcı kararı (11 Eylül): Cloudinary sızıntısı önemsiz, uğraşılmayacak.** Dört backend `STORAGE_DRIVER=local`; Cloudinary aktif yükleme yolu değil. Bu kararla geçmiş yeniden yazımı gerekmedi; kapsam dışı. [Auth kabulü](docs/GUVENLIK-AUTH-KABUL-2026-09-10.md), [sır olayı](docs/GUVENLIK-MOE-SIR-KABUL-2026-09-10.md).

## 2. ensotek_com_tr — site ve içerik checklist’i

Ortak bağımlılıklar: ORT04–ORT14; Tanitio bağlantı/test işleri TAN01–TAN10. Kaynak [S11] Mayıs scaffold durumudur, bugünkü tam saha denetimi değildir.

- [x] **TR01 · P1 · ensotek_com_tr / site / frontend-backend · Doğrulama — Eski teklif portunun canlı kabulünü kapat** Mevcut route, schema ve kayıt zincirini doğrula; eski fresh-seed kutusunu canlı DB reset talimatına çevirmeden eksik kabulü tamamla. Kaynak: [S11], ORT12. **10 Eylül kabulü:** Canlı EN teklif formu, pazarlama seçimi false/true, koşul onayı, gerçek DB kaydı ve admin GET aynı ID kabulü geçti. Canlı DB sıfırlanmadı; izole test kayıtları temizlendi. [S17].

- [x] **TR02 · P1 · ensotek_com_tr / admin_panel · Doğrulama — Teklif listesi, detay ve PDF indirme** Mayıs checklist’inde açık. Gerçek mevcut veriyle liste/detay/PDF bağlantısı ve doğru marka/locale kabulünü kaydet. Kaynak: [S11]. **10 Eylül kabulü:** Gerçek kontrollü teklif için admin liste/detay/PDF üretimi 200, indirilen 66.451 bayt dosya geçerli PDF. İngilizce teklif metni ve Ensotek adı PDF metin çıkarımıyla doğrulandı. Admin bileşeni aynı origin /uploads yolunu kullanıyor. E-posta uç noktası çağrılmadı; test teklif satırı silindi. [S17].

- [x] **TR03 · P2 · ensotek_com_tr / backend + admin_panel · Doğrulama — Seed sonrası login ve güncel admin erişim kabulü** Eski lokal DB ECONNREFUSED nedeniyle kapanmayan kontrolü uygun izole ortamda tamamla; çalışan canlı erişimi yeniden hesap açarak bozma. Kaynak: [S11]. **10 Eylül kabulü:** 001/002 mevcut seed geçici DB üzerinde çalıştırıldı; doğru login/admin 200, yanlış parola/anonim 401. Geçici DB ve kullanıcı temizlendi; canlı hesaplar korunmuştur. tr-seed-login.jsonl.

- [x] **TR04 · P2 · ensotek_com_tr / frontend + backend · Eski not; doğrulama — Newsletter public uç ve başarı akışı** Scaffold notundaki yalnız admin route iddiasını güncel kaynakla kontrol et; kullanıcı formu çalışıyorsa yeni paralel endpoint kurma, eksikse mevcut akışa bağla. Kaynak: [S11]. **10 Eylül kabulü:** Var olan shared newsletter modülü public rotaya bağlandı; yeni paralel backend yok. TR/EN footer formunda açık izin, hata/başarı, 390px taşmasız görünüm. Gerçek DB tekil yeniden abonelik, locale/izin, unverified korunması ve unsubscribe geçti; Telegram izole süreçte yakalandı. [S17].

- [x] **TR05 · P1 · ensotek_com_tr / Tanitio / tenant profili · Kaynak bulgusu — Company, logo/renk ve hashtag kalanlarını tamamla** Sektör/hedef kitle [S3] ile güncellendi. Diğer boş alanları mevcut tenant readback ile doğrula ve gerçek işletme bilgisiyle tamamla. Kaynak: [S1], [S3]. **10 Eylül kabulü:** Doğru tenant ensotek-9d0af55c üzerinde company, kalıcı logo, tema renkleri ve hashtag alanları tamamlandı. Eski seed ensotek-comtr anahtarını hedeflediği için canlı kayda uygulanmamıştı. Tenant kapsamlı API 200 readback geçti. [Kanıt](output/checklist-2026-09-09/business-sources/profile-api-proof.jsonl).

- [x] **TR06 · P1 · ensotek_com_tr / site / içerik · Plan, taslak üretilecek — İlk ay iki mevcut revizyon + iki rehber** Kule seçim girdileri, açık/kapalı karşılaştırması, bakım/revizyon briefi, dolgu/nozul/damla tutucu değişimi. Mevcut niyetle çakışan yeni yazı açma; gerçek ürün ve /tr/teklif-al hedefini URL testiyle bağla. Kaynak: [S3]. **10 Eylül kabulü:** İki mevcut revizyon + iki yeni rehber taslağı hazır; gerçek ürün ve teklif CTA bağlantıları HTTP 200. docs/content/first-month-2026-09-10/README.md. Yayın ve uzman onayı verilmedi.

- [ ] **TR07 · P2 · ensotek_com_tr / Tanitio / içerik · Plan, hesap kararına bağlı — LinkedIn ve Instagram taslak paketi** Öneri haftada 2 LinkedIn + 2 Instagram. Gerçek üretim görseli, teknik uzman kontrolü, doğru Reel kapağı ve editoryal onay; yayın otomatik kabul edilmiş değildir. Kaynak: [S3], TAN04. **10 Eylül:** 8 TR Instagram taslağı tek Ensotek yayıncısında; görseller ve kapaklar hazır, LinkedIn kullanıcı kararıyla atlandı. Uzman/görsel/gerçek video kabulü açık. [Paket](docs/content/social-first-month-2026-09-10/README.md).

- [ ] **TR08 · P2 · ensotek_com_tr / Tanitio / analitik · Açık ölçüm — Tarihli sosyal başlangıç ve 28 gün karşılaştırması** İlk gönderi örneklemini al; 56 tıklama/999 gösterim GSC başlangıcını tarihli referans olarak koru. Eksik takipçi/etkileşimi sıfır veya tahmin yazma. Kaynak: [S3], TAN08.

- [x] **TR09 · P1 · ensotek_com_tr / içerik + frontend / i18n · Kullanıcı bulgusu 11 Eylül — /en/blog Türkçe içerik ve slug gösteriyordu** 9 Bilgi Bankası yazısının yalnız TR çevirisi vardı; ortak backend sessizce TR'ye düşüyor, frontend `locale` alanına bakmıyordu, kök layout `lang="tr"` sabitti. **11 Eylül kabulü:** 9 EN satırı seed + canlı DB (6 ensotek.de kütüphanesinden, 3 çeviri); liste/sitemap/hreflang yalnız istenen dildeki kayıtlar; yabancı slug 308, karşılığı yoksa 404; `<html lang>` istekten. Canlı kabul 8 kontrolde geçti; rollback `.next.before-checklist-20260911T161958Z`. Aynı fallback DE/Kühlturm/MOE'de ayrıca doğrulanmalı. [Kanıt](output/checklist-2026-09-11-tr-blog-i18n/README.md).

## 3. ensotek_de — site ve içerik checklist’i

Ortak bağımlılıklar: ORT01–ORT14. Haziran SEO sayıları tarihsel bulgulardır; bugünkü Google durumu olarak sunulmaz.

- [x] **DE01 · P1 · ensotek_de / frontend / SEO · 26 Haziran bulgusu; yenilenecek — 13 unknown-to-Google URL için discovery** Öncelikli /en ve /tr ürün/kurumsal/çözüm sayfalarına menü/footer/ilgili içerikten en az iki anlamlı bağlantı sağla. Sitemap endpoint kapsamını doğrula; teknik kabulden sonra Inspection değişimini ayrı izle. Kaynak: [S14]. **10 Eylül kabulü:** Önceki brief + erişilebilir GSC önbelleğindeki indekslenebilir önceliklerin her biri en az iki anlamlı iç bağlantı aldı. /tr/faqs ana sayfa ve kurumsal sayfadan bağlı. Kasıtlı noindex /tr/legal/kvkk organik hedef sayılmadı. Sitemap 1165 URL; Google yeniden tarama/Inspection sonucu ayrı ölçümdür. [S17].

- [x] **DE02 · P1 · ensotek_de / frontend / SEO · 26 Haziran bulgusu; yenilenecek — /en/nutzungsbedingungen ve legal boş-200** Güncel çıktıyı yeniden kontrol et; gerçek EN içerik veya doğru 301/404 kararıyla boş-200’ü gider. API arızasıyla yokluğu ayır; /en/legal ve /tr/legal kasıtlı noindex’ine dokunma. Kaynak: [S14], [S12]. **10 Eylül kabulü:** Eski /en/nutzungsbedingungen 308 ile dolu /en/legal/terms-of-use sayfasına gidiyor. EN/TR legal noindex korunuyor; bulunmayan legal/genel adres 404, API arızası ayrı hata. Canlı kabul geçti. [S17].

- [x] **DE03 · P1 · ensotek_de / işletme + frontend · Sahip kararı — EN/TR organik hedefi ve locale-slug stratejisi** Ensotek.de’de hangi dillerin organik hedef olduğuna karar ver; buna göre gerçek çeviri/hreflang veya bilinçli kapsam azaltımı planla. Slug yabancı dilde diye tek başına değiştirme. Kaynak: [S14]. **9 Eylül ilerleme:** Kullanıcı DE/EN/TR indekslemeye açık kalsın kararını verdi. Tüm çeviri/slug stratejisi uygulama ve kabulü devam ediyor. [S17]. **10 Eylül kabulü:** DE/EN/TR organik kapsamı korundu. İçerik ID eşleşmesiyle gerçek çevrilmiş slug/hreflang üretiliyor; eski yabancı ürün slugı doğru locale slugına 308. 1165 URL tam tarama + son 32 sayfa keşif kabulü geçti. [S17].

- [x] **DE04 · P1 · ensotek_de / DB içerik + admin URL doğrulama · Eski açık iş; doğrulama — Literal [slug]/[locale] linkleri** Menü/içerik kayıtlarını ve admin URL girişini tara; gerçek placeholder link kalmasın. Değişiklik kayıt ve kaynak seed’de tutarlı olsun. Kaynak: [S12]. **10 Eylül kabulü:** Canlı menü/içerik/footer tablolarındaki 22 metin kolonu tarandı, literal/URL-encoded [slug]/[locale] bulunmadı. Admin create/patch şeması placeholder URL kabul etmiyor; iki canlı geçersiz POST 400, gerçek URL şemada kabul. Kayıt/seed düzeltmesi gerektiren satır yok. [S17].

- [x] **DE05 · P1 · ensotek_de / frontend / SEO · Eski açık iş; doğrulama — 404 envanteri ve API-SSR 5xx ayrımı** Güncel GSC örnekleri ile değerli eski adres/gerçek ölü adres ayrımı yap; kaynak iç linkleri düzelt. Haziran 70 adet 404 ve 15 adet 5xx’i güncel adet sayma; eski SSR fix’ini yeniden yapmadan doğrula. Kaynak: [S12], [S14]. **10 Eylül kabulü:** 80 güncel Google URL Inspection sonucu alındı; Google crawl tarihleri eski olduğu için mevcut canlı URL kabulü ayrıca yapıldı. Eski kalite/about çift canonical kaydı tek gerçek module URL’ye, /contact DE iletişime yönlendirildi; iki eski Soft404 örneği artık gerçek içerik hedefinde 200. Gerçek olmayan adres 404, API 5xx hata olarak korunur. de-legacy-redirect-acceptance.json.

- [x] **DE06 · P2 · ensotek_de / frontend / SEO · Eski açık iş; doğrulama — Meta description kapsamı ve Almanca metin kalitesi** Public sayfa türleri için özgün metadata, doğru umlaut ve mevcut title/canonical/hreflang kabulü. Sabit karakter kotasını arama başarısı garantisi sayma. Kaynak: [S12]. **10 Eylül kabulü:** 1165 URL kabulünde açıklama kapsamı tam; 543 DE URL içinde 12 sektör açıklamasını tekrar eden referans metadata’sı gerçek referans adıyla ayrıldı ve canlıya alındı. Almanca sözlükte kaba ASCII umlaut kalıpları bulunmadı. Uzman teknik metin onayı DE15 altında ayrı açık; karakter sayısı/sıralama garantisi verilmedi.

- [x] **DE07 · P2 · ensotek_de / frontend / SEO · Karar, DE03 sonrası — Almanca statik route stratejisi** /about, /contact, /product gibi yolların yerelleştirilmesini değer/riske göre kararlaştır; değişirse 301/308 ve tüm link/metadata/sitemap eşlemesini birlikte uygula. Kaynak: [S12], [S14]. **10 Eylül karar:** DE/EN/TR için mevcut sabit modül yolları (/about, /contact, /product vb.) korunur. Yalnız dil biçimi uğruna URL göçü yapılmaz; içerik çevirileri mevcut kayıt ID’si üzerinden gerçek slug/hreflang ile eşlenir. Gereksiz yönlendirme zinciri oluşturulmaz; içerik keşfi DE01/DE03 kapsamında doğrulanır.

- [x] **DE08 · P1 · ensotek_de / site + Tanitio / GSC · Doğrulama — Sitemap kayıt ve keşif kabulü** Önceki gönderilmedi notunu güncel sitemap listesiyle yenile; 200 canonical URL kapsamını ve indirme/hata durumunu doğrula. GSC OAuth erişiminin tamam olması sitemap gönderim kanıtı değildir. Kaynak: [S12], [S1]. **10 Eylül kabulü:** Mevcut kayıt Google API ile okundu: 9 Eylül indirmesinde 0 hata/uyarı, eski 135 URL. 1165 URL sürümü Tanitio değişiklik kaydıyla 10 Eylül 00:05:18 UTC yeniden gönderildi ve readBackVerified=true. Google yeniden indirme/indeksleme sonucu ayrı izlenir. [S17].

- [ ] **DE09 · P1 · ensotek_de / site / kurumsal içerik · Veri/doğrulama — Impressum ve kurumsal kimlik bütünlüğü** Gerçek tüzel ad, yetkili, adres, kayıt/vergisel bilgiler uygulanabilir kapsamıyla işletmeden doğrulansın. Footer/iletişim/schema aynı bilgiyi kullansın; hukuki yeterlilik varsayılmasın. Kaynak: [S12], [S13].

- [x] **DE10 · P2 · ensotek_de / frontend / schema · Eski kısmi iş; doğrulama — LocalBusiness, FAQ, Breadcrumb ve Article schema** Organization/Product mevcut kabul kayıtlarını koru; açık türleri uygun sayfalarda gerçek veriyle tamamla ve doğrula. Kaynak: [S12]. **10 Eylül kabulü:** Doğrulanmış Türkiye adresiyle Organization/LocalBusiness, görünür breadcrumb, SSR 8 gerçek soru/yanıt ile FAQPage ve gerçek başlık/görsel ile Article/NewsArticle eklendi. Canlı JSON-LD ayrıştırma kanıtı mevcut; Almanya adresi veya hayali yazar/puan üretilmedi. [S17].

- [ ] **DE11 · P2 · ensotek_de / işletme + web / yerel görünürlük · Karar/doğrulama — Almanya Business Profile ve yerel iletişim** Gerçek hizmet/işletme uygunluğuna göre mevcut GBP kaydını doğrula; gerçek yerel telefon varsa kullan, uydurma numara/adres ekleme. Kaynak: [S12], [S9].

- [x] **DE12 · P2 · ensotek_de / site + Tanitio / sosyal · Doğrulama — LinkedIn profilini ve sameAs eşlemesini doğrula** Gerçek şirket hesabı kimliği, site linki ve schema eşleşsin; yayıncı/hesap yetkisi TAN04 kapsamında kararlaştırılsın. Kaynak: [S12], [S1]. **10 Eylül kapsam kararı:** Kullanıcının “eski sitede varsa al yoksa atla” talimatı uygulandı. Eski resmi Ensotek sitesinde doğrulanabilir LinkedIn yok; tahmini şirket hesabı kaldırıldı. sameAs yalnız kaynaklı Instagram/Facebook/X/YouTube içerir. Yeni LinkedIn hesabı açılmadı; OAuth TAN04’te ayrı.

- [ ] **DE13 · P1 · ensotek_de / site / belge-içerik · Veri/doğrulama — Kalite belgeleri, performans ve ürün teknik kanıtı** 2020–2023 görsellerinin güncel belgelerini edin; gerçek kapasite, çalışma koşulu, garanti/SLA ve yedek parça kapsamını açıkla. Boş Almanca kalite gövdesi ORT03 altında tek iş olarak takip edilir. Kaynak: [S13], ORT03, ORT10.

- [ ] **DE14 · P2 · ensotek_de / site / ürün-içerik · Eski açık iş; doğrulama — Datasheet/PDF ve doğrulanmış vaka anlatıları** Mevcut doküman/katalog akışını tekrar kurmadan eksik ürün belgelerini tamamla; referans isim diakritikleri, logo izinleri ve gerçek proje kapsamını doğrula. Kaynak: [S12], [S13], ORT12.

- [ ] **DE15 · P2 · ensotek_de / site / içerik · Plan — Teknik Almanca içerik ve talep CTA’sı** Seçim, su hijyeni/bakım, malzeme ve mühendislik içeriklerini gerçek uzman incelemesiyle hazırla; ürün/servis/teklif bağlantıları ve bülten/Wartung planen akışı birbirine bağlansın. Kaynak: [S12], [S13].

- [ ] **DE16 · P1 · ensotek_de / frontend / performans · Doğrulama — SSR gövde ve güncel mobil CWV kabulü** Son karşılaştırma örneğindeki Wird geladen SSR gövdesini gerçek ürün route’unda incele; eski SSR başarı notunu bugüne varsayma. LCP/CLS/INP, büyük GIF/video ve JS yükünü güncel ölçümle değerlendir. Kaynak: [S8], [S12]. **10 Eylül son ölçüm:** SSR, ikon, kullanılmayan JS/CSS ve gereksiz teklif listesi sorguları düzeltildi. Aynı son sürümde üç mobil Lighthouse koşusu: **ortanca 81 puan / LCP 3,718 sn / TBT 254 ms**; puan 76–86, LCP 3,567–3,743 sn, TBT 188,5–465 ms. A11y/BP/SEO 100. Önceki tek koşudaki 90 puan ve 2,186 sn sürdürülebilir kabul olarak kullanılmadı. LCP/TBT ve gerçek kullanıcı INP/CWV kabulü açık. [Kanıt](output/checklist-2026-09-10-profile/repeatability.json).

## 4. kompozit — 9 Eylül doğrulanmış site bulguları

Ortak kayda taşınanlar: **K16 → ORT04**. Diğer ortak kabul ve Tanitio işleri aşağıdaki kaynakların eksiklerini de kapsar.

- [x] **K01 · P1 · kompozit · Doğrulandı — Makaleler sitemap’te yok** **Kabul:** API sözleşmesine uygun limit/sayfalama ve yayın filtresi; sekiz makale sitemap’e girsin, API hatası sessiz boş liste olmasın. Ürün, galeri, çözüm ve yasal sayfa kapsamı korunarak API yayımlanmış URL kümesiyle birebir karşılaştırılsın. Kaynak: [S7] / K01. **9 Eylül kabulü:** Canlı sitemap 72 URL; sekiz blog dahil. 72/72 URL 200 ve kendine canonical. [S17].

- [x] **K02 · P1 · kompozit · Doğrulandı — Sitemap yanlış dil slug’ları üretiyor** **Kabul:** Alternatifler içerik kimliği üzerinden gerçek çevrilmiş slug’a bağlansın; 6 hedef 200, doğru dil, kendine canonical ve karşılıklı dönüş bağlantısı sağlasın. Kaynak: [S7] / K02. **9 Eylül kabulü:** Kimlik bazlı locale envanteri HTML/sitemap alternatiflerinde kullanılıyor; 72 canlı adresin dil haritaları kaydedildi. [S17].

- [x] **K03 · P1 · kompozit · Doğrulandı — Detay sayfalarında HTML hreflang eksik** **Kabul:** Gerçek çeviri eşlemesinden sayfa bazında karşılıklı hreflang üret; olmayan çeviriyi ilan etme. HTML ve sitemap aynı eşlemeyi kullansın. Kaynak: [S7] / K03. **9 Eylül kabulü:** 72 canlı sayfanın hreflang ve canonical çıktıları kanıt dosyasında. [S17].

- [x] **K04 · P1 · kompozit · Doğrulandı — Farklı dil slug’ı yanlış dilde içerik açıyor** **Kabul:** Eski URL → doğru dilde gerçek içerik kararını çıkar; mevcut indeksli adresleri incelemeden silme. Canonical, yönlendirme, dil düğmesi ve sitemap tek eşlemeye bağlansın. Kaynak: [S7] / K04. **9 Eylül kabulü:** Yabancı locale slug gerçek çevrilmiş adrese 308 döner; EN karbon-fiber ve TR ürün örnekleri canlı doğrulandı. [S17].

- [x] **K05 · P2 · kompozit · Doğrulandı — Eski dil öneksiz makale geçişi geçici yönlendirme** **Kabul:** Eski içerik adreslerini envanterle; gerçekten kalıcı taşınanları uygun tek hedefe kalıcı yönlendir ve zinciri test et. Kaynak: [S7] / K05. **9 Eylül kabulü:** Dil öneksiz eski blog adresi kalıcı locale hedefine yönleniyor; canlı redirect kabulü geçti. [S17].

- [x] **K06 · P2 · kompozit · Doğrulandı — 50 title içinde marka iki defa** **Kabul:** Markayı tek katman eklesin; örnek ve 50 URL tekrar tarandığında yinelenme kalmasın. Kaynak: [S7] / K06. **9 Eylül kabulü:** Başlık absolute metadata ile tek marka katmanından geliyor; 72 URL başlığı tekrar tarandı. [S17].

- [x] **K07 · P2 · kompozit · Doğrulandı — Blog/referans liste sayfalarında H1 yok** **Kabul:** Her listeye konuya uygun tek ana başlık ekle; alt başlık hiyerarşisini koru. Kaynak: [S7] / K07. **9 Eylül kabulü:** Blog/referans listelerinde tek H1 canlı taramada doğrulandı. [S17].

- [x] **K08 · P1 · kompozit · Doğrulandı — Ana sayfa formu kullanıcı seçmeden pazarlama rızası gönderiyor** **Kabul:** Pazarlama tercihi açık kullanıcı seçimine bağlı olsun; seçimsiz durumda true gönderilmesin. Aydınlatma/koşul akışı ayrı tanımlansın. Kontrollü testte kayıt alanları seçimi doğru yansıtsın. Kaynak: [S7] / K08. **9 Eylül ilerleme:** Varsayılan pazarlama rızası kaldırıldı; izole canlı UI isteğinde seçimsiz false, seçili true kanıtlandı. Gerçek DB kayıt mutabakatı ORT12 ile açık. [S17]. **10 Eylül kabulü:** MOE gerçek DB kabulünde seçimsiz pazarlama 0, seçili 1; koşullar ayrı 1. Önceki canlı UI testiyle birlikte kayıt/admin mutabakatı tamamlandı; test kayıtları silindi. [S17].

- [x] **K09 · P2 · kompozit · Doğrulandı — Form etiketlerinin alanlarla programatik bağı eksik** **Kabul:** Alanların kalıcı adı programatik olarak bağlansın; etiket tıklaması alanı odaklasın, ekran okuyucu kontrolü geçsin. Kaynak: [S7] / K09. **Devam turu kabulü:** Ana form ve teklif etiketleri programatik bağlı. İki canlı teklif dilinde 28 label tıklaması doğru alana odaklandı; dosya alanı dahil adsız görünür kontrol yok. Önceki ana form kabulü korunuyor. Kanıt: [S17], `output/checklist-2026-09-09/continuation/`.

- [x] **K10 · P2 · kompozit · Doğrulandı — İngilizce ana sayfa formunun sonuç mesajları Türkçe** **Kabul:** Başarı/hata/pending durumları seçili locale mesajlarından gelsin; iki dilde izole yanıt testinde doğrulansın. Kaynak: [S7] / K10. **9 Eylül kabulü:** TR/EN başarı ve hata mesajları gerçek canlı UI üzerinde yakalanan, sunucuya gönderilmeyen izole yanıtlarla doğrulandı. [S17].

- [x] **K11 · P1 · kompozit · Doğrulandı — Statik CSS/JS sıkıştırması eksik** **Kabul:** Statik dosyaları sunan gerçek katmanda sıkıştırma etkinleşsin; CSS/JS yanıtı uygun encoding/Vary ile gelsin. Ölçüm dosyası: `compression.json`. Kaynak: [S7] / K11. **9 Eylül kabulü:** Canlı nginx CSS yanıtında gzip ve Vary: Accept-Encoding doğrulandı. [S17].

- [x] **K12 · P1 · kompozit · Doğrulandı — Mobil ana içerik geç görünüyor** **Kabul:** Önce sıkıştırma ve ana thread yükünü azalt; hero render/fetch önceliğini ölç. Aynı koşulda tekrar laboratuvar ölçümü yap, sonra gerçek kullanıcı verisiyle izle. Tek optimizasyona kesin hız kazancı atfetme. Kaynak: [S7] / K12. **9 Eylül ilerleme:** Statik gzip ve consent öncesi analitik yükünü erteleme canlıda. Karşılaştırılabilir yeni Lighthouse/CWV ölçümü bekliyor. [S17]. **Yeni ölçüm:** mobil Lighthouse 49→87, LCP 8,764→3,351 sn; aynı profil, tek laboratuvar örneği. LCP/ana thread kalan iyileştirmesi açık. **10 Eylül kabulü:** Teknik ve karşılaştırmalı laboratuvar kabulü tamamlandı: mobil performans 49→90, LCP 8,764→3,173 sn, TBT 505→194 ms, CLS 0. Gerçek kullanıcı CWV ve LCP 2,5 sn hedefi henüz kanıtlanmadı; dönem izlemesi K21 altında. performance-final-summary.json.

- [x] **K13 · P2 · kompozit · Doğrulandı — Kapalı mobil menü odaklanabilir kontroller bırakıyor** **Kabul:** Kapalı menü içerikleri inert/unmounted veya uygun odak yönetimiyle erişim dışı olsun; açıldığında klavye ve odak dönüşü çalışsın. Kaynak: [S7] / K13. **Devam turu kabulü:** Canlı 390 px menüde açılışta iç odak, Tab sınırı, Escape kapanışı, açan düğmeye odak dönüşü ve scroll kilidi/geri yükleme geçti. Kapalı içerik inert. Kanıt: [S17], `output/checklist-2026-09-09/continuation/`.

- [x] **K14 · P2 · kompozit · Doğrulandı — Görünür marka fallback’leri repo doktrinine uymuyor** **Kabul:** Görünür marka tek veri zincirinden gelsin; başka seed/marka kurulumunda eski marka kalmasın. Bu bulgu mevcut MOE adının yanlış olduğunu söylemez, yeniden kullanım kuralındaki eksikliği belirtir. Kaynak: [S7] / K14. **10 Eylül kabulü:** Marka site_settings → kurulum ortamı → nötr fallback zincirine alındı; alternatif marka ile 3 test/6 assertion ve canlı MOE başlık/logo kabulü geçti. docs/BRAND-RUNTIME-2026-09-10.md.

- [x] **K15 · P2 · kompozit · Doğrulandı — Denetim kapıları canlı sorunları kapsamıyor; bazıları çalışmıyor** **Kabul:** Lint komutunu mevcut araç zinciriyle çalışır yap; tema kapısını düzelt. Canlı API + sitemap + dil eşleme regresyonları ekle; standalone audit yolu gerçek paket çıktısıyla eşleşsin. Kaynak: [S7] / K15. **Devam turu kabulü:** Tema, lint, production build ve gerçek standalone HTML release kapısı geçti. Kalan eski standalone yolları düzeldi. Yeni API/sitemap/HTML ID-hreflang regresyonu 32 yayınlanmış detayda geçti; tema renderer istisnaları gerekçeleriyle S17 içinde. Kanıt: [S17], `output/checklist-2026-09-09/continuation/`.

- [x] **K17 · P1 · kompozit / site + Tanitio / GSC · Kaynak bulgusu — Google canonical seçimini tekrar değerlendir** Teknik K01–K05 sonrası CTP/karbon fiber ve dil alternatiflerinde URL Inspection’ı yenile. Eski /blog canonical seçimi teknik düzeltmeyle aynı anda değişmiş kabul edilmesin. Kaynak: [S6]. **İkinci devam kabulü (yeniden değerlendirme):** 72 URL Inspection yenilendi. Google 17 farklı canonical tutuyor; güncel 17 HTML self-canonical ve eski 17 adresin güncel karşılığına yönlendirmesi doğrulandı. Google seçimi henüz değişmiş değildir; sonraki ölçümde izlenecek. Kanıt: [S17], `output/checklist-2026-09-09/continuation/moe-gsc-canonical-summary.json`.

- [x] **K18 · P1 · kompozit / site / içerik · Plan — İlk ay dört web içeriği** Mevcut CTP/fiberglass ve karbon fiber yazılarını revize et; lunapark teknik brief ve fiberglass saksı ölçü/teklif rehberi taslaklarını gerçek ürün/çözüm CTA’sıyla hazırla. Kaynak: [S4], [S6]. **10 Eylül kabulü:** İki mevcut revizyon + iki yeni ürün briefi taslağı hazır; gerçek ürün ve teklif CTA bağlantıları HTTP 200. docs/content/first-month-2026-09-10/README.md. Yayın onayı verilmedi.

- [x] **K22 · P1 · kompozit / frontend / mobil · Kullanıcı bulgusu 11 Eylül — Kaydırılmış ana sayfada mobil menü görünmüyor** Safari'de kaydırılmış header'ın `-webkit-backdrop-filter`'ı, header içindeki `fixed` mobil menüyü 69 px'lik header kutusuna hapsediyordu; Chromium bu öneki tanımadığından masaüstünde çıkmıyordu. **11 Eylül kabulü:** `<nav>` header dışına alındı; Safari davranışı Chromium'da enjekte CSS ile taklit edilerek canlıda önce 68 px / sonra 857 px tam ekran doğrulandı. K13 odak/klavye/scroll regresyonu canlıda geçti. Build/tema/release kapıları geçti; rollback `standalone.before-checklist-20260911T112616Z`. Gerçek iPhone cihaz kabulü kullanıcıda. [Kanıt](output/checklist-2026-09-11-moe-menu/README.md).

- [x] **K23 · P2 · kompozit / frontend / hero · Kullanıcı isteği 11 Eylül — Hero'da gerçek ürünlerin gösterilmesi** Stok karbon kumaş görseli yerine API'den gelen öne çıkan ürünlerden mozaik (1 büyük + 2 kart), "N ürünün tümünü gör" ve kategori çipleri; sunucu bileşeni, JS yok, ilk görsel LCP öncelikli AVIF. **11 Eylül kabulü:** Yerel aday + canlı masaüstü/mobil, koyu/açık tema kabulü geçti; build/tema/release kapıları geçti; rollback `standalone.before-checklist-20260911T140020Z`. Ürün/marka adı koddan gelmez; veri yoksa eski görsele düşer. [Kanıt](output/checklist-2026-09-11-moe-hero/README.md).

- [ ] **K19 · P2 · kompozit / Tanitio / içerik · Plan, OAuth/yayın kararına bağlı — 12 Instagram + 8 Facebook uyarlaması** İlk üç metin fikrini bitmiş görselli paket sayma. Logo/palet, gerçek üretim görseli ve Reel kapağıyla editoryal kabul yap; Facebook sayfası doğrulanmadan yayınlama. Kaynak: [S2], [S4]. **10 Eylül:** 12 MOE Instagram taslağı Tanitio draft; 8 isteğe bağlı Facebook uyarlaması yerelde. Resmi sayfa bulunmadığından Facebook aktarılmadı. Uzman/görsel/video kabulü açık. [Paket](docs/content/social-first-month-2026-09-10/README.md).

- [ ] **K20 · P2 · kompozit / işletme / strateji · Karar — Ürün kârlılığı, kapasite, minimum adet ve teslim kapsamı** Lunapark/peyzaj/özel üretim önceliğini gerçek kapasite ve talep verisiyle teyit et; ihracat ülkeleri, görsel izinleri ve ilk 28 gün sonrası KPI hedefi belirlensin. Kaynak: [S4].

- [ ] **K21 · P2 · kompozit / Tanitio / büyüme · Plan — 30–60–90 gün değerlendirmesi** İlk teknik/ölçüm kabulü sonrası nitelikli talep getiren konulara ağırlık ver; vaka, İngilizce kapsam ve LinkedIn kararını veriye göre al. Ücretli reklam ayrı kapsamdır. Kaynak: [S4].

## 5. kuhlturm — 9 Eylül doğrulanmış site bulguları

Ortak kayda taşınanlar: **T01 → ORT01**, **T19 → ORT04**. Diğer ortak kabul ve Tanitio işleri aşağıdaki kaynakların eksiklerini de kapsar.

- [x] **T02 · P0 · kuhlturm · Doğrulandı — Alt sayfa canonical ve hreflang’ları ana sayfaya işaret ediyor** **Kabul:** Statik/dinamik her indexlenebilir sayfada gerçek path canonical; gerçek içerik çevirileriyle karşılıklı alternatifler. Ana sayfa mirası kaldırılsın. Kaynak: [S8] / T02. **9 Eylül kabulü:** Son tam canlı taramada 1086/1086 URL 200, self canonical ve tek H1; percent-encoded Unicode canonical eşdeğerliği normalize edilerek karşılaştırıldı. [S17].

- [x] **T03 · P0 · kuhlturm · Doğrulandı — Çözüm detayları yanlış API adresi nedeniyle içeriksiz** **Kabul:** Hem endpoint hem locale sözleşmesi düzelsin; sekiz liste hedefi gerçek başlık/gövdeyle açılsın, hata boş veri diye yutulmasın. Kaynak: [S8] / T03. **9 Eylül kabulü:** Tam canlı taramada sekiz çözüm hedefinin tamamı 200, gerçek başlık ve self canonical; endpoint/locale düzeltmesi kabul edildi. [S17].

- [x] **T04 · P1 · kuhlturm · Doğrulandı — Eksik veri ve API arızası HTTP 200 “bulunamadı” sayfasına dönüşüyor** **Kabul:** Gerçek yokluk ile timeout/5xx ayrı ele alınsın; yokluk gerçek 404, arıza uygun durum/retry politikası üretsin. Geçici backend hatası indexlenebilir boş sayfa üretmesin. Kaynak: [S8] / T04. **9 Eylül kabulü:** 12 detay türünde olmayan slug gerçek HTTP 404 döndü. Canlı 8089 kesintisinde upstream 502 frontend 500 olarak kaldı; boş 200 üretilmedi. Bellek restart nedeni ayrıca giderilip izlemeye alındı. [S17].

- [x] **T05 · P1 · kuhlturm · Doğrulandı — İngilizce arayüz dosyası bütünüyle Almanca** **Kabul:** EN çeviri seti tamamlanmalı; metadata, buton, form hatası, tarih ve menüler İngilizce olmalı. Aynı teknik terimlerin eşit kalması normaldir; kabul içerik bazında yapılmalı. Kaynak: [S8] / T05. **9 Eylül ilerleme:** 338 EN sözlük anahtarı ve metadata/form/menu çevirileri; son galeri/menü erişilebilir isimleri de İngilizceleştirildi. Tüm içerik ve tarih biçimi editoryal kabulü açık. [S17]. **10 Eylül kabulü:** 338 EN sözlük anahtarı ve kalan katalog/kütüphane/tarih/aria etiketleri tamamlandı; canlı EN kütüphane ve katalog, 390 px kabulü geçti. family-brand-en-browser.txt.

- [x] **T06 · P1 · kuhlturm · Doğrulandı — İngilizce footer dört çalışmayan yasal sayfaya götürüyor** **Kabul:** Her footer öğesi mevcut İngilizce içerik kimliğine bağlansın; karşılık yoksa yanıltıcı link üretilmesin. İçerik + 200 + doğru canonical birlikte doğrulansın. Kaynak: [S8] / T06. **9 Eylül kabulü:** EN footer yasal linkleri içerik ID eşlemesiyle gerçek sayfalara bağlandı; hedefler 200/self canonical. [S17].

- [x] **T07 · P1 · kuhlturm · Doğrulandı — Ana sayfa ve referanslardan sekiz bozuk hizmet hedefi** **Kabul:** Slider ve referans içerik linklerini gerçek service slug’ına, kullanıcının diliyle bağla. Eski dış URL’ler için içerik bazlı yönlendirme kararı ver; tüm sekiz hedefi ve kaynaklarını yeniden tara. Kaynak: [S8] / T07. **9 Eylül kabulü:** 18 service hedefi ilk tam taramada 200; altı eski hizmet aliası 308 → gerçek hedef 200; sekiz hero CTA geçerli hedeflere bağlandı. [S17].

- [x] **T08 · P1 · kuhlturm · Doğrulandı — Sitemap API limit hataları nedeniyle birçok içerik türünü dışarıda bırakıyor** **Kabul:** Endpoint bazında sözleşme + sayfalama uygula; sitemap’in kapsamını yayımlanmış ve gerçekten indexlenebilir içerikle karşılaştır. Kırık/boş URL’leri sırf sayı artsın diye ekleme. Kaynak: [S8] / T08. **9 Eylül kabulü:** Sayfalanan gerçek envanter 1086 URL; son tam canlı taramada tamamı 200/self canonical/tek H1, schema mevcut. Önceki 166 geçici 500 ve bir Unicode 404 giderildi. [S17].

- [x] **T09 · P2 · kuhlturm · Doğrulandı — Sitemap locale gözetmeden aynı slug kümesini iki dile basıyor** **Kabul:** Her içerik kimliği için gerçek DE/EN adresleri üret; liste linki, dil geçişi ve sitemap aynı eşlemeyi kullansın. Kaynak: [S8] / T09. **9 Eylül kabulü:** Gerçek canlı dil düğmesi /de/legal/datenschutzerklaerung → /en/legal/privacy-policy eşlemesini kullandı; middleware yanlış slug kopyalayan alternatif başlığı kaldırıldı. [S17].

- [x] **T10 · P2 · kuhlturm · Doğrulandı — Sitemap lastmod içerik değişimini yansıtmıyor** **Kabul:** İçeriğin gerçek `updated_at` değeri kullanılsın; bilinmiyorsa lastmod uydurulmasın. İçerik değişmeden iki üretimde tarih sabit kalsın. Kaynak: [S8] / T10. **9 Eylül kabulü:** lastmod envanterde gerçek updated_at/created_at verisinden üretiliyor; derleme zamanı tarih olarak basılmıyor. [S17].

- [x] **T11 · P1 · kuhlturm · Doğrulandı — www/non-www host tek yönlendirmede birleşmiyor** **Kabul:** Tercih edilen host açıkça seçilsin; diğer host path/query koruyan tek 301/308 ile ona gitsin. Runtime/build env, sitemap ve canonical aynı host’u kullansın. Kaynak: [S8] / T11. **9 Eylül kabulü:** www host path/query korunarak apex hosta 301; nginx -t ve canlı yönlendirme geçti. [S17].

- [x] **T12 · P1 · kuhlturm · Doğrulandı — Yapılandırılmış veri yok** **Kabul:** Doğrulanmış şirket ve ürün verisinden uygun schema üret; görünür içerikle tutarlı olsun. Yorum, fiyat ve sertifika bilgisi uydurulmasın. Kaynak: [S8] / T12. **9 Eylül ilerleme:** Organization/WebSite/BreadcrumbList ve gerçek FAQ üzerinden FAQPage eklendi. Ürün schema ve işletme bilgisi tam mutabakatı açık. [S17]. **10 Eylül kabul:** 34 ürün/yedek parça URL’sinde HTTP 200, tek H1 ve gerçek ürün adı/Ensotek markasıyla Product schema doğrulandı. Organization legalName ve sosyal kaynaklarla eşleşiyor; fiyat/yorum uydurulmadı. Kanıt: `output/checklist-2026-09-09/business-sources/kuhlturm-product-schema-live.json`.

- [x] **T13 · P2 · kuhlturm · Doğrulandı — llms.txt erişilemiyor** **Kabul:** Kullanılacaksa şirket rolü, ürün/hizmet ve gerçek kaynak URL’leriyle kısa, güncellenebilir dosya oluştur; root’tan 200 dönsün. Kaynak: [S8] / T13. **9 Eylül kabulü:** Root /llms.txt 200; Ensotek alt markası açıklaması ve gerçek bölüm bağlantıları içeriyor. [S17].

- [x] **T14 · P1 · kuhlturm · Doğrulandı — Mobil hero içeriği ve teklif CTA’sı kesiliyor** **Kabul:** Mobilde içerik yüksekliği/yerleşimi tüm slaytlarda CTA’yı görünür kılsın; sağ araç çubuğu metin ve kontrol üstüne gelmesin. 390 px ve daha dar ekranlarda gerçek geometri + dokunma testi yap. Kaynak: [S8] / T14. **9 Eylül kabulü:** 320/390 px gerçek tarayıcıda CTA geometri ve hit-test geçti; 320 px sekiz farklı slide hedefi kontrol edildi. [S17].

- [x] **T15 · P2 · kuhlturm · Doğrulandı — Marka adı ile gösterilen logo/içerik tutarsız** **Kabul:** Alan adının rolü (Ensotek alt markası / kategori portalı / bağımsız marka) belirlenip logo, erişilebilir isim, şirket anlatısı, sosyal bağlantı ve ayarlar tutarlı hale getirilsin. Kaynak: [S8] / T15. **9 Eylül ilerleme:** Ensotek alt marka kararı logo alt metni ve footer anlatısına uygulandı. Tenant profil/sosyal hesap eşlemesi T23/TAN04 ile açık. [S17]. **10 Eylül kabul:** Site Ensotek alt marka kimliği, logo/iletişim ve Tanitio tenant profili eşlendi. Dört sosyal URL eski resmi Ensotek sitesinden alındı; tek Ensotek yayıncısı metadata olarak kaydedildi. OAuth eksikliği ayrıca TAN04’te açık; yayın yetkisi var denmiyor. Kanıt: `business-sources/profile-api-proof.jsonl`, `public-after-revalidation.json`.

- [x] **T16 · P1 · kuhlturm · Doğrulandı — Mobil görsel yükleme ve JavaScript maliyeti yüksek** **Kabul:** Hero görsel boyutu/teslimi ve öncelik, slider çalışma yükü ve SSR veri yolu ölçülerek iyileştirilsin. Aynı mobil profil tekrar ölçülsün; gerçek kullanıcı verisi ayrı izlensin. Kaynak: [S8] / T16. **9 Eylül ilerleme:** İlk görsel fetchPriority, slider zamanlayıcıları ve consent yükü düzeldi. Aynı mobil profilde yeni performans ölçümü açık. [S17]. **Yeni ölçüm:** mobil Lighthouse 69→83, LCP 5,556→4,112 sn; aynı profil, tek laboratuvar örneği. Görsel teslim/SSR iyileştirmesi açık. **10 Eylül kabulü:** Public SSR/cache, ilk slayt görseli, kullanıcı isteğiyle slider ve optimizer cache koruması canlıda. Mobil performans 69→87, LCP 5,556→3,384 sn, TBT 337,5→179 ms, CLS 0; 390 px next/play/pause kabulü geçti. Alan CWV henüz kanıtlanmadı; dönem ölçümü T25 altında.

- [x] **T17 · P2 · kuhlturm · Doğrulandı — Form kontrolleri erişilebilir etiketle bağlı değil** **Kabul:** Gerçek kullanıcı alanları `label htmlFor / id` ile ilişkilensin; honeypot ayrı ve erişilebilir akış dışında değerlendirilsin. Ekran okuyucu/klavye kontrolü yap. Kaynak: [S8] / T17. **Devam turu kabulü:** DE/EN iletişim ve teklif ekranlarında 22 gerçek label tıklaması doğru alana odaklandı; görünür kontrollerin erişilebilir adı mevcut, honeypot akış dışında. Gönderim yapılmadı. Kanıt: [S17], `output/checklist-2026-09-09/continuation/`.

- [x] **T18 · P2 · kuhlturm · Doğrulandı — Slider dokunma hedefleri çok küçük** **Kabul:** Yeterli hit-area ve aralık sağla; mobil gerçek dokunma ve erişilebilirlik kontrolü geçsin. Kaynak: [S8] / T18. **9 Eylül kabulü:** Slider noktaları 32 px hit-area; canlı mobil kontrolde görünür noktalarda 24 px altı hedef yok, slide seçimleri çalıştı. [S17].

- [x] **T20 · P2 · kuhlturm · Doğrulandı — İki ana sayfada H1 yok** **Kabul:** Sayfanın ana konusunu anlatan tek H1 sağla; slider’ın bütün başlıklarını H1’e dönüştürme. Kaynak: [S8] / T20. **9 Eylül kabulü:** Her iki ana sayfada yalnız ilk slider başlığı H1; diğer slide başlıkları H2. [S17].

- [x] **T21 · P2 · kuhlturm · Doğrulandı — Repo işletim ve kalite belgeleri güncel değil** **Kabul:** DB/servis ve tamamlanma iddiaları canlı kanıtla güncellensin; lint gerçek komutla çalışsın. Canonical, API path/locale, soft-404 ve mobil CTA için anlamlı release kontrolleri oluşturulsun. Kaynak: [S8] / T21. **9 Eylül ilerleme:** Lint 0 hata/1 uyarı; release tarama scriptleri ve runtime notu eklendi. Eski repo belgelerinin tamamı henüz eşleştirilmedi. [S17]. **10 Eylül kabul:** AGENTS/README/portfolio ve iki eski Codex belgesine güncel DB/API/native modül/alt marka kararları işlendi. İşletim kaydı, rollback/delta uyarısı, sitemap/API/locale/soft-404 ve mobil kontroller mevcut. Build/deploy betikleri üretim origin kontrolü olmadan sürüm değiştirmiyor. Önceki gerçek lint sonucu 0 hata/1 uyarı; yeni üretim build’i geçti.

- [ ] **T22 · P1 · kuhlturm / işletme + Tanitio / marka · Karar — Ensotek.de ile alan adı/içerik rolünü ayır** Kühlturm kategori portalı mı, alt marka mı, ayrı marka mı netleşsin; ortak kaynak içerik aynı niyette iki siteye kopyalanmasın. Gerçek sosyal hesabı yoksa kopya yayıncı tenant kurulmasın. Kaynak: [S5], [S9], T15, TAN04. **9 Eylül ilerleme:** Karar kesin: Ensotek alt markası ve tek Ensotek yayıncı hesabı. İki sitenin çakışan içerik niyetini ayrıştırma işi sürüyor. [S17].

- [x] **T23 · P1 · kuhlturm / Tanitio / profil · Kaynak bulgusu — Şirket iletişimi, logo/renk ve hashtag alanları** Mevcut temel marka/dil kaydını koru; gerçek işletme kimliği ve T22 kararına göre eksikleri tamamla, siteyle aynı bilgi kullanılsın. Kaynak: [S1], ORT11. **10 Eylül kabulü:** Doğrulanmış Ensotek işletme/iletişim bilgisi, kalıcı logo, mevcut mavi/koyu palet ve Almanca hashtag’ler tamamlandı. Profil Ensotek yayıncısına bağlı alt marka olarak belgelendi; OAuth oluşturulmadı. [Kanıt](output/checklist-2026-09-09/business-sources/profile-api-proof.jsonl).

- [x] **T24 · P1 · kuhlturm / site / içerik · Plan — İlk ay dört teknik içerik işi** Automation/SCADA içeriği revizyonu; açık/kapalı kule ve teklif girdileri; bakım/revizyon tesis briefi; dolgu/damla tutucu/nozul model-ölçü rehberi. İki revizyon + iki rehber eşlemesi mevcut envanterden yapılsın. Kaynak: [S5]. **10 Eylül kabulü:** Mevcut SCADA ve bakım içeriğine iki revizyon, seçim ve parça tanımına iki yeni rehber hazır; gerçek URL/CTA kabulü geçti. docs/content/first-month-2026-09-10/README.md. Yayınlanmadı.

- [ ] **T25 · P2 · kuhlturm / Tanitio / içerik · Plan, hesap kararına bağlı — Almanca sosyal taslak ve ilk dönem değerlendirmesi** Öneri haftada 2 LinkedIn + 1 Instagram taslağı; %35 seçim/%30 bakım/%20 komponent/%15 doğrulanmış üretim dağılımı başlangıç planıdır. Ticari sorgu/ürün-servis ziyareti ve nitelikli talebi 28 günde ölç. Kaynak: [S5], TAN04, TAN08. **10 Eylül:** 4 Almanca Kühlturm taslağı tek Ensotek yayıncısında, tarihsiz draft. Yayın sonrası dönem henüz başlamadı. [Paket](docs/content/social-first-month-2026-09-10/README.md).

- [ ] **T26 · P1 · kuhlturm / site / kurumsal içerik · Veri/doğrulama — Impressum tüzel kimliği ve gerçek referans derinliği** Mevcut genel telif/bağlantı metnine sorumlu işletmenin doğrulanmış kimliği ve uygulanabilir bilgileri sağla; kısa jenerik referans metinlerini izinli gerçek vaka kapsamıyla güçlendir. Yorum temizliği ORT02, iddialar ORT10 altında. Kaynak: [S8].

## 6. Tanitio / ekosistem-sosyal-medya — uygulama yeri bu repo olan işler

Aşağıdaki işler web frontend’lerine paralel panel kodu yazılarak çözülmez. Sahip repo: `../ekosistem-sosyal-medya`.

- [x] **TAN01 · P1 · Tanitio / dört tenant / backend+dashboard · Hazır, deploy bekliyor — GTM bağlantı testi düzeltmesini canlı kabulden geçir** /marketing/gtm-access taze container GET kullansın; token varlığını erişim kabulü saymasın. GA4-only Türkiye/Kühlturm applicable:false, opsiyonel kart ve test düğmesiz; eski yanlış hatalar yeni arıza gibi görünmesin. [S1] son takipte 4+7 test ve typecheck/scope guard geçmiş, canlı UI kabulü yok. Kaynak: [S1]. **9 Eylül kabulü:** Canlı API ve dört tenant tarayıcı kabulü geçti: iki gerçek Test Et başarılı, iki opsiyonel kart düğmesiz. 18 regresyon testi ve build/scope guard geçti. [S17].

- [x] **TAN02 · P1 · Tanitio / ensotek + moe-kompozit / bağlantı · Hazır, apply bekliyor — Doğrulanmış numeric GTM container path eşlemesini kaydet** verify-ensotek-gtm-paths.ts dry-run ve publicId kontrolü sonrası tenant eşlemesi: Ensotek accounts/6330619450/containers/238844696; MOE accounts/6330619450/containers/259635545. Yanlış publicId/gerçek erişim reddi başarısız kalmalı. TAN01 sonrası iki Test Et başarılı ve GA4/GSC regresyonsuz olsun. Kaynak: [S1]. **9 Eylül kabulü:** İki numeric path public ID ve taze Google erişimi doğrulanarak kaydedildi; gerçek UI Test Et başarılı, GA4/GSC durumları korundu. [S17].

- [ ] **TAN03 · P1 · Tanitio / ensotek.de / GTM · Doğrulama/karar — İkinci G-XECX77LB6M etiketinin sahipliğini incele** Mevcut GTM’de hedef G-7S6TW9CNRJ dışında eski tag var. İşlev/sahiplik ve event akışını teyit et; kanıtsız silme veya çift page_view iddiası yazma. Kaynak: [S1], [S15]. **10 Eylül ilerleme:** Tag 22 hedefi v9’da bilinmeyen kimliğe değişmiş; doğru tag 23 v10’da eklenmiş. Bilinmeyen gtag betiği 404, doğru hedef 200. 5 sn tarayıcı gözleminde yalnız doğru hedefte tek page_view; test collection istekleri engellendi. Silinmişler dahil aynı hesapta 14 mülk/akış tarandı, sahiplik eşleşmedi. Tag silinmedi; sahiplik/amaç kararı açık. [Ayrıntılı kabul](docs/analytics/ENSOTEK-IKINCI-GA4-ETIKETI-2026-09-10.md).

- [ ] **TAN04 · P1 · Tanitio / dört tenant / sosyal · Sahip kararı + OAuth gerekli — Tek yayıncı, marka-hesap eşlemesi ve gerçek yetkilendirme** Ensotek FB/IG pasif token’sız yer tutucuları ve ortak DE/TR/Kühlturm hesap sahipliğini çöz. MOE @moe_kompozit Meta OAuth, Facebook gerçek sayfa URL/ID doğrulaması; yalnız onaylı tenant kapsamına bağla. Profil URL’si OAuth değildir. Kaynak: [S1], [S2], [S3], [S5]. **9 Eylül ilerleme:** Kühlturm için tek Ensotek sosyal hesap kararı alındı; gerçek hesap URL/OAuth erişimi bekleniyor. [S17].

- [x] **TAN05 · P1 · Tanitio / discovery / ortak backend · Kaynak bulgusu — Aile alan adlarını is_ours altında grupla** ensotek.com, ensotek.de, ensotek.com.tr ve ilgili aile siteleri bağımsız rakip diye sayılmasın; gerçek marka sınırını tanımla. CTP Mühendislik’in üç domaini/Form grubu gibi çok-domain şirketleri firma sayısında tekilleştir. Tarihsel koşuların anlamını koru. Kaynak: [S3], [S5]. **İkinci devam incelemesi:** 49 aile sonucu yanlış `is_ours=0`: TR 43 ensotek.com; DE 3 ensotek.com + 3 kuhlturm.com. Canlı ön inceleme kaydedildi. **Üçüncü devam kabulü:** Açık tenant alan adı politikası ve doğrulanmış şirket/grup eşlemeleri canlıya alındı. 49 yanlış işaret düzeltildi; 2.597 sonuç ve 9 koşunun sınıflandırma dışındaki alanları hash ile aynı. 9 canlı koşu ve 4 kendi-domain takip reddi geçti. TR son koşu 48 alan adı / 46 grup; CTP üç domain tek grup; önceki iki koşuda Form iki domain tek grup. İkinci çalıştırma 0 değişiklik. Kanıt: [S17], `output/checklist-2026-09-09/domain-policy/`.

- [x] **TAN06 · P1 · Tanitio / kuhlturm / GSC sınıflandırma · Kaynak bulgusu — Genel kategori kelimesini otomatik marka sayma** marketing/routes.ts tenant adından ku(h)lturm terimini markaya ekleyebiliyor. Almanca kategori sorgularını yanlış markalı sınıflamadan kullanıcı marka setiyle ayır; panel/API KPI aynı tanımı kullansın. Kaynak: [S5]. **Devam turu kabulü:** Kayıtlı marka listesi GSC ve discovery için esas alındı; tenant adı listeye tekrar eklenmiyor. 5 politika + 1 gerçek GSC KPI testi, build/scope guard geçti. Canlı Kühlturm 14 sorgu / 64 gösterim markasız; 7 kategori sorgusu marka sayılmadı. Türkiye mutabakatı da geçti. Kanıt: `output/checklist-2026-09-09/continuation/tanitio-brand-policy-live.jsonl`.

- [x] **TAN07 · P1 · Tanitio / MOE / GSC önbellek · Kaynak bulgusu — gsc_url_index boşluğunu mevcut denetim akışıyla doldur** Boş önbellek Google’da indeks yok diye sunulmasın. Doğrudan Inspection kanıtını mevcut akışla ilişkilendir; sitemap indexed=0 alanını toplam indeks sayısı gibi yorumlama. Kaynak: [S6], [S4]. **İkinci devam kabulü:** Mevcut akışta 72/72 Inspection başarılı. Canlı panel/API: 38 dizinde, 18 dizinde değil, 16 sorun. Boş önbellekte kartlar “—” gösterir; bu kümenin Google toplam indeksi olmadığı açık. Gerçek ve boş veri tarayıcı kabulü geçti. Kanıt: [S17], `output/checklist-2026-09-09/continuation/`.

- [ ] **TAN08 · P2 · Tanitio / TR + MOE + Kühlturm / rakip ölçümü · Eksik örneklem — Tarihli rakip ve sosyal başlangıç örneklemi al** Web ürün/teknik belge/CTA değişimleri ile erişilebilen son 10 sosyal gönderinin tarih-format-konu-kanıt-CTA verisini kaydet. Sonraki aynı 28 gün penceresiyle kıyasla; erişilemeyen metrik sıfır değildir. Otomatik haftalık takip istenirse mevcut scheduler üzerinden ayrı kurulum kabulü yap. Kaynak: [S3], [S4], [S5].

- [x] **TAN09 · P2 · Tanitio / GSC/discovery / ölçüm kalitesi · Kaynak bulgusu — Belirsiz marka ve düşük örneklem raporlama kuralları** MOE kısa moe sorgusunu tümüyle nitelikli marka talebi sayma; reliable=false CTR fırsatını kesin kazanç sunma. Anonim sorgu toplamlarını boyutsuz KPI ile karıştırma; Brave/Yandex sırasını Google sırası/hacmi sayma. DE hedefli collector konum sınırlamasını raporla veya mevcut akışta düzelt. Kaynak: [S6], [S3], [S4], [S5]. **10 Eylül canlı kabul:** Güvenilir CTR grubu yoksa tahmin üretilmiyor; dört tenantın kuyruğu boş. MOE kısa sorgu ve KPI ayrımı 16 testle doğrulandı. Panel tahmin diline geçirildi; collector TR konum/Google olmayan kaynak sınırı raporlandı. [Ölçüm kabulü](docs/TANITIO-ENSOTEK-OLCUM-KABUL-2026-09-10.md).

- [ ] **TAN10 · P1 · Tanitio / Türkiye + Kühlturm + MOE / abonelik · İşletme kararı — 23 Eylül trial devam planı** [S1] üç trial bitişini 23 Eylül, Ensotek managed dönem sonunu 9 Ekim 2026 kaydediyor. Güncel aboneliği doğrula; 8 trial modülü ile 13 managed modülünü eşit kapsam gibi sunma. Ücretli plan geçişi bu dokümanla yapılmış değildir. Kaynak: [S1].

- [x] **TAN11 · P2 · Tanitio / dört tenant / GA4 raporları · İzleme — Boş rapor ile yetki arızasını ayır** Son kabulde MOE veri döndürdü, diğer üç seçili GA4 raporu boş ama HTTP 200. Veri birikimi/filtre/tarih penceresini takip et; bağlantı başarılı diye dönüşüm tamamlandı sayma. Kaynak: [S1]. **10 Eylül canlı kabul:** Dört GA4 raporu HTTP 200 ve veri içeriyor: DE/TR/K kullanıcı 2/3/3, MOE 68; dört dönüşüm metriği sıfır. Hata alt alanları boş, küçük örneklem/test trafiği ve pencere sınırı kaydedildi. Dönüşüm uygulaması ORT05’te açık. [Ölçüm kabulü](docs/TANITIO-ENSOTEK-OLCUM-KABUL-2026-09-10.md).

- [ ] **TAN12 · P3 · Tanitio / dört tenant / Ads · Reklam yönetimi istenirse — Ads müşteri ve dönüşüm bağlantısı** Doğru customer hesapları, erişim, GA4 bağları ve dönüşüm eşlemesi doğrulanmalı; bütçe/kampanya kendiliğinden açılmasın. Eksik Ads kimliği temel web/Tanitio kurulum arızası değildir. Kaynak: [S1].

- [x] **TAN13 · P3 · Tanitio / Kühlturm / Google metadata · İsteğe bağlı tamlık — Eksik GA4 stream ID** Gerçek stream kimliği gerekirse mevcut mülkten doğrulanıp kaydedilsin; page_view’ın çalışması için eksik zorunlu alan diye gösterilmesin. Kaynak: [S1]. **10 Eylül kabulü:** Google Admin API properties/553360294/dataStreams/15747723840 kaydını, G-KXDKCDY0ET ve https://kuhlturm.com eşleşmesini döndürdü; /marketing/ga4/config panel API’sinde mevcut. [Kanıt](output/checklist-2026-09-09/business-sources/ga4-config-proof.jsonl).

- [x] **TAN14 · P3 · Tanitio / MOE / kanal kapsamı · İşletme kararı — LinkedIn/YouTube/X ve diğer ek kanal ihtiyaçları** Sahipliği doğrulanmış hesap ve sürdürülebilir içerik ihtiyacı varsa kapsam belirle; yokluklarını otomatik ürün hatası veya yeni hesap açma talimatı sayma. Kaynak: [S2], [S4]. **10 Eylül kapsam kararı:** Kullanıcı “eski sitede varsa al yoksa atla” dedi. MOE mevcut resmi Instagram hesabı korundu; doğrulanmış LinkedIn/YouTube/X bulunmadığından ek kanal açma/bağlama işi atlandı. Bu kutu hesapların var olduğu anlamına gelmez.

## 7. Kaynaklarda tamamlananlar — yeniden açık iş üretilmez

- [x] **OK01 · — · kaynak kabulü · Tamamlandı kaydı — Dört doğru aktif tenant, yönetici üyelikleri ve şifreli bağlantı kayıtları** Eski seed adlarıyla ikiz Türkiye/MOE tenant açılmadı; Hamdi dört tenant’ta tenant_admin. Kaynak: [S1].

- [x] **OK02 · — · kaynak kabulü · Tamamlandı kaydı — Dört sitede hedef GA4 page_view gönderimi** Her hedefe tek page_view, collect HTTP 204 kaynakta kanıtlı. GA4-only siteler için zorunlu GTM kurulumu yok. Kaynak: [S1], [S15].

- [x] **OK03 · — · kaynak kabulü · Tamamlandı kaydı — Dört tenant GA4 rapor ve GSC erişimi** Her tenant kendi resolver’ıyla Google API HTTP 200; GSC veri döndü. Yeni OAuth ihtiyacı bildirilmemiş. Kaynak: [S1].

- [x] **OK04 · — · kaynak kabulü · Tamamlandı kaydı — Dört içerik kaynağı canlı bağlı** ensotek-family-content@1.0: articles/products/pages ve detayları; doğru anahtar 200, kimliksiz/diğer site anahtarı 401, geçersiz dil 400. auto_sync=false korunmuş. Kaynak: [S1], [S10].

- [x] **OK05 · — · kaynak kabulü · Tamamlandı kaydı — MOE marka profili ve üç hashtag grubu** Logo/favicon, renk, iletişim, hedef kitle ve mevcut gerçek tenant eşleşmesi kaydedilmiş. Kaynak: [S2].

- [x] **OK06 · — · kaynak kabulü · Tamamlandı kaydı — TR / MOE / Kühlturm rakip setleri ve başlangıç stratejileri** TR revision 1, Kühlturm revision 1; MOE ilk revision 2’den sonraki araştırmada revision 3. Takip listesi hazır; sosyal ölçüm ve tam içerik paketi değil. Kaynak: [S3], [S4], [S5], [S6].

- [x] **OK07 · — · kaynak kabulü · Tamamlandı kaydı — Ensotek.de eski teknik düzeltmeleri tarihli kayıtlı** Haziran şablon temizliği, SSR axios düzeltmesi, canonical/hreflang, llms ve referans import’u tamamlanmış kaydı var. Yeni keşif/kalite/SSR gözlemleri ayrı kabul işleri olarak korunuyor. Kaynak: [S12].

- [x] **OK08 · — · kaynak kabulü · Tamamlandı kaydı — Kompozit/Kühlturm 9 Eylül denetimi ve typecheck** 16 + 21 sorun grubunun kanıt raporları yazıldı; her iki projede frontend/backend/admin TypeScript geçti. Sorunların düzeltildiği anlamına gelmez. Kaynak: [S7], [S8].

## 8. Uygulama sırası ve kapanış kaydı

1. **Önce ORT01–ORT03:** ortak DB, demo yorumlar ve boş kalite içeriği; etkileyen site/kayıt sahipliği kesinleşsin.
2. **Temel web engelleri:** Kühlturm T02–T08 ve Kompozit K01–K04; Ensotek.de DE01–DE05 güncel örnek doğrulaması.
3. **Ölçüm ve gerçek talep:** TAN01–TAN03, ORT04–ORT08, ORT12; bağlantı testi, lead/UTM ve teslim kabulü.
4. **Mobil/SEO/erişilebilirlik:** kalan K/T bulguları, DE06–DE16; ortak regresyon ORT13.
5. **Tenant hazırlığı ve içerik:** TAN04–TAN11, TR05–TR08, K18–K21, T22–T26. İçerik API’lerini yeniden kurma; mevcut kaynaktan çalış.
6. **Opsiyonel genişleme:** TAN12–TAN14 yalnız işletme kapsam kararıyla.

Kapatılan her iş için bu tabloya kayıt eklenir; tarihli kaynak raporlar geriye dönük değiştirilmez. Uygulama başlamadan sorumlu kişi atanır. Aynı ortak işin dört site kabulü gerekli ise tek sitenin başarısıyla iş kapatılmaz.

| İş kimliği | Sorumlu kişi / repo | Değişiklik / commit | Yerel kontrol | Canlı kabul URL/akış / tarih | Son durum |
|---|---|---|---|---|---|
| 9 Eylül uygulaması | Dört frontend + Tanitio | Ayrı canlı build paketleri; commit oluşturulmadı | Dört build, iki lint, 18 Tanitio testi | [S17] ve bağlı ham kanıtlar | Kabulü geçen kutular işaretlendi; kalanlar açık |

## 9. Kaynaklar

Kaynak önceliği: aynı belgedeki son kabul/takip bölümü → tarihli yeni denetim → eski brief. Eski rakamlar güncel canlı durum diye yeniden üretilmedi; uygulama turunda yapılan yeni canlı kontroller [S17] içinde ayrıca kayıtlıdır.

- **S1:** [Tanitio dört tenant son analitik, içerik API ve GTM takip durumu](../ekosistem-sosyal-medya/ENSOTEK-AILESI-ANALITIK-DURUM-2026-09-09.md)
- **S2:** [MOE tenant, sosyal ve iddia eksikleri](../ekosistem-sosyal-medya/MOE-KOMPOZIT-TENANT-KONTROL-2026-09-09.md)
- **S3:** [Ensotek Türkiye rakip/strateji ve kalanlar](../ekosistem-sosyal-medya/ENSOTEK-TR-RAKIP-STRATEJI-2026-09-09.md)
- **S4:** [MOE web/sosyal büyüme planı](../ekosistem-sosyal-medya/MOE-KOMPOZIT-RAKIP-STRATEJI-2026-09-09.md)
- **S5:** [Kühlturm rakip/strateji ve ölçüm eksikleri](../ekosistem-sosyal-medya/KUHLTURM-RAKIP-STRATEJI-2026-09-09.md)
- **S6:** [MOE GSC Inspection ve Tanitio kod işleri](kompozit/SEO-GSC-BULGULAR-VE-DUZELTME-CHECKLIST-2026-09-09.md)
- **S7:** [Kompozit 16 bulgu ve ham kanıtları](kompozit/DENETIM-RAPORU-2026-09-09.md)
- **S8:** [Kühlturm 21 bulgu ve tekrar kontrolleri](kuhlturm/DENETIM-RAPORU-2026-09-09.md)
- **S9:** [Tanitio ilk site denetimi; eski kapananlar ayıklanmıştır](TANITIO-TENANT-ENTEGRASYON-ISLERI-2026-09-08.md)
- **S10:** [Dört site içerik kontratı ve canlı kabul](docs/integrations/TANITIO-CONTENT-API-v1.md)
- **S11:** [Türkiye eski scaffold/offer/admin açık kontrolleri](ensotek_com_tr/docs/FRONTEND_CHECKLIST.md)
- **S12:** [Almanya master SEO/içerik planı](ensotek_de/docs/ensotek-de-master-aksiyon-plani.md)
- **S13:** [Almanya kanıt, sertifika ve ürün içeriği stratejisi](ensotek_de/docs/ensotek-icerik-konumlandirma-stratejisi.md)
- **S14:** [26 Haziran Almanya discovery ve legal soft-404 briefi](docs/CODEX-BRIEF-seo-indexleme.md)
- **S15:** [Almanya GA4/GTM ve eski ikinci tag kaydı](ensotek_de/docs/qa/2026-09-09-ga4-activation.md)
- **S16:** [Dört site SMTP/bildirim briefi; güncel kabul gerektirir](docs/CODEX-BRIEF-smtp-mail-bildirim.md)

[S1]: ../ekosistem-sosyal-medya/ENSOTEK-AILESI-ANALITIK-DURUM-2026-09-09.md
[S2]: ../ekosistem-sosyal-medya/MOE-KOMPOZIT-TENANT-KONTROL-2026-09-09.md
[S3]: ../ekosistem-sosyal-medya/ENSOTEK-TR-RAKIP-STRATEJI-2026-09-09.md
[S4]: ../ekosistem-sosyal-medya/MOE-KOMPOZIT-RAKIP-STRATEJI-2026-09-09.md
[S5]: ../ekosistem-sosyal-medya/KUHLTURM-RAKIP-STRATEJI-2026-09-09.md
[S6]: kompozit/SEO-GSC-BULGULAR-VE-DUZELTME-CHECKLIST-2026-09-09.md
[S7]: kompozit/DENETIM-RAPORU-2026-09-09.md
[S8]: kuhlturm/DENETIM-RAPORU-2026-09-09.md
[S9]: TANITIO-TENANT-ENTEGRASYON-ISLERI-2026-09-08.md
[S10]: docs/integrations/TANITIO-CONTENT-API-v1.md
[S11]: ensotek_com_tr/docs/FRONTEND_CHECKLIST.md
[S12]: ensotek_de/docs/ensotek-de-master-aksiyon-plani.md
[S13]: ensotek_de/docs/ensotek-icerik-konumlandirma-stratejisi.md
[S14]: docs/CODEX-BRIEF-seo-indexleme.md
[S15]: ensotek_de/docs/qa/2026-09-09-ga4-activation.md
[S16]: docs/CODEX-BRIEF-smtp-mail-bildirim.md

- **S17:** [9 Eylül uygulama ve canlı kabul raporu](ENSOTEK-CHECKLIST-UYGULAMA-2026-09-09.md)

[S17]: ENSOTEK-CHECKLIST-UYGULAMA-2026-09-09.md
