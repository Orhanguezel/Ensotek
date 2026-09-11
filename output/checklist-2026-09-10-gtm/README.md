# TAN03 canlı kanıtları

`container-history.jsonl`: sadece okunmuş canlı v11 ve erişilebilir eski sürümlerin kimlik/tag/tetikleyici özeti; sırlar veya OAuth tokenları yok.

`legacy-streams.json`: sadece doğrulanmış Ensotek hesabı; silinmiş mülkler dahil, sayfalama tam. 14 mülk/14 akış, hata yok, bilinmeyen kimlik eşleşmedi.

`public-tag-responses.json`: bilinmeyen gtag 404 / doğru gtag 200.

`browser-destinations.json`: önce denied sonra granted; Google collection istekleri yerelde engellenmiş. Beş saniyelik gözlem, tüm olaylar için genelleme değildir.

GTM/GA4 ayarı, tag, workspace veya yayınlanmış sürüm değiştirilmedi. Tanitio sunucusuna yalnız bu okumaları yapan iki denetim scripti aktarıldı, PM2 restart yapılmadı.

İş bitiminde iki geçici script sunucudan kaldırıldı; yeniden çalıştırma kaynakları Ensotek `scripts/` dizininde korundu.
