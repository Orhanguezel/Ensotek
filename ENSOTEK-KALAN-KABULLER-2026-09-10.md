# Ensotek ailesi — kalan kabul koşulları

10 Eylül 2026; 11 Eylül güncellemesi. Ana checklist: **105 madde, 82 kabul tamamlandı/kapsamdan çıkarıldı, 23 açık** (K22 MOE mobil menü 11 Eylül'de eklendi ve kapandı). Kullanıcının devam talebindeki 62 açık maddeden 39'u kapandı. Bu dosya yeni veya ikinci bir checkbox sayacı değildir; açık kimliklerin somut kapanış koşuludur.

Kühlturm Ensotek alt markası ve tek sosyal yayıncı `ensotek` olarak korunur. DE/EN/TR indekslenebilir içerik korunur. İşletme belgeleri mevcut Ensotek kaynaklarından alındı; bulunmayan sosyal kanallar kullanıcı kararıyla atlandı. Ensotek belgeleri MOE sertifikası/kapasitesi olarak kullanılmadı.

| Kimlik | Yapılan iş / kanıt | Açık kalan somut koşul |
|---|---|---|
| ORT05 | Dört gerçek DB kayıt akışı, test filtreleri ve GA4 `generate_lead` key event sözleşmesi doğrulandı. | Test olmayan yeni talebin GA4 ile DB mutabakatı; mevcut gerçek dönüşüm örneği yok. |
| ORT07 | Dört SMTP transport bağlantısı doğrulandı; teklif/katalog alıcı ve PDF akışları süreç içi mail yakalama ile geçti. | Yetkili gerçek alıcıda gelen kutusu teslim kabulü ve mevcut Gmail / eski Hostinger işletim tercihinin netliği. Bu çalışma dış alıcıya test e-postası göndermedi. |
| ORT10 | Güncel Ensotek belgeleri kaynaklandı; MOE ana/kurumsal sayfalardaki çelişkili sayaçlar, sertifika iddiaları ve koşulsuz malzeme değerleri kaldırıldı. | Projeye özgü kapasite, teslim/SLA, teknik değer ve izinli referansların işletme/uzman teyidi. |
| ORT14 | MOE ifşa olmuş DB/JWT/cookie sırları değişti; DB yetkisi ayrıldı; env dosyaları Git indeksinden çıkarıldı. Dört sitede kayıt rolü ve reset kodu açıkları canlı kabul edildi. **11 Eylül:** 9–11 Eylül'ün tüm kaynak/doküman/kanıt değişiklikleri beş repoda commit edilip push edildi (root 4eebb7b, DE fc02999, TR 653b149, Kühl 6b6d869, MOE 0df724e `[skip ci]`); çalışma ağaçları temiz, repo-runtime kaynak eşitliği kapandı. MOE `deploy.yml` push tetikleyicisi Haziran'dan beri her koşuda başarısız; canlı dağıtım standalone paketle yapılıyor. | Ortak Cloudinary anahtarının sağlayıcı hesabında değiştirilmesi/iptali (hesap sahibi). Git geçmişi temizliği `git push --force` gerektirir; deny listesinde ve kullanıcı kararı — sırlar zaten rotasyona uğradığı için aciliyet düşük. MOE push-deploy workflow'u ya onarılmalı ya kaldırılmalı. [Güvenlik raporları](docs/GUVENLIK-MOE-SIR-KABUL-2026-09-10.md). |
| TR07 | 8 TR Instagram taslağı, görseller ve Reel kapakları hazır ve tek Ensotek yayıncısında kayıtlı; LinkedIn atlandı. | Teknik/editoryal onay, mevcut web görsellerinin kampanya kullanım izni ve gerçek üretim görüntüsü/video kabulü. Kapak video değildir. |
| TR08 | Başlangıç kaynakları ve ölçüm takvimi yazıldı. | İlk onaylı sosyal yayından itibaren 28 günlük gerçek örneklem; henüz yayın yok. |
| DE09 | Türk tüzel adı, telefon, güncel belge/kalite kaynağı bulundu; yanlış GmbH ifadesi düzeltildi. | Kayıt/vergi bilgisi, yetkili temsil ve eski ofis adresi ile yeni sertifika adresi çelişkisinin doğrulanmış çözümü. |
| DE11 | Gerçek Türkiye adresi korunuyor; Alman şubesi/telefonu uydurulmadı. | Gerçek Almanya işletme konumu uygunluğu ve işletme profili yetkisi. |
| DE13 | ISO 9001/10002 ve belirli CTP modelleri için CE kaynakları, mevcut ENK05 katalog ve doğru şartlı model bilgileri erişilebilir. | Ürün bazlı güncel teknik koşullar, performans/SLA ve uzman teyidi. |
| DE14 | Çalışan katalog/PDF akışları ve mevcut belgeler kontrol edildi. | Güncel ürün datasheet'leri ve izinli, doğrulanmış vaka anlatıları; genel katalog tek başına bunların yerine geçmez. |
| DE15 | Dört Almanca teknik web taslağı ve gerçek CTA bağlantıları hazır. | Teknik Almanca uzman kabulü; taslaklar yayına alınmadı. |
| DE16 | Ürün SSR/metadata, ikon/font, kullanılmayan JS/CSS ve gereksiz teklif listesi sorguları düzeltildi. Aynı son sürümün 3 mobil koşusu: ortanca performans 81, LCP 3,718 sn, TBT 254 ms; puan 76–86, LCP 3,567–3,743 sn, TBT 188,5–465 ms. A11y/BP/SEO 100. [Tekrarlı ölçüm](output/checklist-2026-09-10-profile/repeatability.json). | Tek koşudaki 90 puan / 2,186 sn kalıcı kabul değildir. LCP/TBT hâlâ iyileştirme gerektiriyor; gerçek kullanıcı INP/CWV örneklemi yok. |
| K19 | 12 MOE Instagram taslağı Tanitio'da, 8 Facebook uyarlaması yerelde hazır; resmi Facebook yoksa atlama kararı uygulandı. | Uzman/editoryal ve görsel yeniden kullanım/gerçek üretim çekimi kabulü; OAuth ayrı TAN04. |
| K20 | Mevcut MOE ürün kataloğu ve talep akışı kullanıldı. | MOE'ye ait kapasite, minimum sipariş, marj/kârlılık ve teslim bölgesi verisi. Ensotek verisi MOE'ye mal edilmedi. |
| K21 | 30/60/90 gün ölçüm takvimi hazır. | 10 Ekim / 9 Kasım / 9 Aralık tarihli gerçek sonuçlar. |
| T22 | Alt marka/tek yayıncı kararı işlendi; yeni DE/Kühl taslaklarında niyet ayrımı yapıldı. | Eski yayımlanmış ortak metinlerin teknik uzman kabulüyle ayrıştırılması. |
| T25 | Dört Almanca Kühlturm sosyal taslağı Ensotek yayıncısında hazır. | Yayın/uzman/görsel kabulü ve ilk yayın sonrası gerçek dönem ölçümü. |
| T26 | Ensotek tüzel kimliği ve kaynaklı kalite gövdesi işlendi. | DE09 ile aynı resmi kayıt/adres teyidi, izinli referans derinliği. |
| TAN03 | GTM sürüm geçmişi okundu: tag 22 hedefi v9’da değişmiş, doğru tag 23 v10’da eklenmiş. Bilinmeyen betik 404; testte yalnız doğru hedefe bir page_view. Silinmişler dahil Ensotek hesabında 14 mülk/akış okundu; sahiplik bulunamadı. | İkinci etiketin sahibinin doğrulanması; bilinmeyen etiket silinmedi. **11 Eylül:** Tanitio'nun GTM OAuth kapsamı yalnız `tagmanager.readonly`; tag 22'yi duraklatma/yayın Tanitio'dan yapılamaz. Somut adım hesap sahibinde: GTM arayüzünde tag 22'yi duraklatıp yeni sürüm yayınlamak (v11 geri dönüş referansı). |
| TAN04 | Tek yayıncı, resmi eski site hesapları ve marka eşlemeleri kayıtlı. | Meta hesap sahibinin OAuth yetkilendirmesi; URL bilmek erişim yetkisi değildir. |
| TAN08 | Eldeki tarihli kaynaklar/takvim korundu; eksik metrikler sıfırla doldurulmadı. | Yeterli tarihli sosyal/rakip örneklemi ve erişim. |
| TAN10 | Üç trial için 23 Eylül; Ensotek managed için 9 Ekim tarihi doğrulandı. | İşletmenin abonelik devam tercihi. Ücretli geçiş yapılmadı. |
| TAN12 | Koşullu Ads işi olarak korundu. | Reklam yönetimi talebi, hesap yetkisi ve bütçe; bu çalışma kampanya/harcama başlatmadı. |

Taslak paketleri: [16 web taslağı](docs/content/first-month-2026-09-10/README.md), [24 Instagram + 8 Facebook uyarlaması / 8 Reel kapağı](docs/content/social-first-month-2026-09-10/README.md). [Ölçüm takvimi](docs/content/OLCUM-VE-ONAY-TAKVIMI-2026-09-10.md). [Auth güvenlik kabulü](docs/GUVENLIK-AUTH-KABUL-2026-09-10.md).

Gerçek eksik belge/erişim, gelecekte oluşacak ölçüm veya yüksek kalan LCP tamamlanmış sayılmadı. Sosyal yayın, zamanlama, dış alıcıya e-posta, ücretli abonelik ve reklam işlemi yapılmadı.
