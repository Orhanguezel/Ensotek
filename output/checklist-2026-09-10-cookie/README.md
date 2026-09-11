# Çerez tercihi ve mobil kabul — 10 Eylül 2026

Dört sitede ortak sabit sol alt düğme kaldırıldı. İlk ziyarette seçim penceresi açılır, geçerli tercih mevcutsa yenileme/navigasyonda açılmaz. Tercih değiştirme yalnız normal footer bağlantısındadır; ekran üstünde sabit düğme yoktur. Mevcut 180 günlük saklama ve izin sınırı korunur.

`browser-acceptance.txt`: dört ayrı temiz tarayıcı bağlamında ilk uyarı, ret/kabulün saklanması, yenileme, başka sayfaya geçiş ve footer bağlantısından yeniden açma PASS. Sabit tercih düğmesi 0, footer bağlantısı 1, mobil taşma yok, pageerror yok. Analitik test istekleri yakalandı.

`*-build.log`: dört üretim build/origin kapısı geçti. Sitemap sayıları DE 1165, TR 74, Kühlturm 1086, MOE 72. `*-deploy.txt` yedekli canlı dağıtımları gösterir; `source-sync-final.json` kaynak hash'lerini içerir. Ortam sırları build arşivlerine alınmadı.

MOE yan bulgusu: kapalı mobil menüdeki e-posta genişliği ve büyük sayı yazı boyutunda kalan yeni metin değerleri. Header, StatsBar, MaterialCards minimum genişlik/satır bölme/duyarlı yazı boyutuyla düzeltildi; iddialar yeniden eklenmedi. İlk `moe-*-debug.txt` dosyaları önceki taşmayı gösterir; son kabul `browser-acceptance.txt` içindedir.

DE katalog formu/modal kodu ilk sayfa yükünde açılmıyor, düğmeye ilk basıldığında yükleniyor. Kapatmada odak tetikleyiciye döner; gerçek form gönderimi yapılmadı. Ayrı katalog browser kabulü ve ürün Lighthouse ölçümü aynı dizindedir. Gerçek kullanıcı CWV kabulü veya dış SMTP teslimi bu testlerle ilan edilmez.

Son DE ürün Lighthouse örneği: performans 65, erişilebilirlik/BP/SEO 100, LCP 4,860 sn, TBT 453 ms, CLS 0. Önceki örneğe göre LCP 5,699 → 4,860 sn, TBT 328 → 453 ms; toplam skor artmadı. Tek örnekten bütün performansın iyileştiği sonucu çıkarılmadı; DE16 açık. Kanıt: `output/checklist-2026-09-10-cookie/de-performance-summary.json`.
