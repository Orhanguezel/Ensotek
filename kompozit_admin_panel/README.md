# MOE Kompozit Admin Panel

Bu klasor, `admin_panel` uygulamasinin kompozit odakli ayrilmis kopyasidir.

Amac:
- shared admin panelden tenant bazli karisimi kaldirmak
- kompozit icerik, galeri, urun, teklif ve site ayarlarini ayri panelde yonetmek
- shared paneli bozmadan bagimsiz rollout yapmak

Gecici durum:
- iskelet `admin_panel` reposundan klonlandi
- port `3004` olarak ayrildi
- API hedefi `kompozit_backend` (`8186`) olacak sekilde ayarlandi
- sidebar kompozit odakli sadeleştirildi

Calistirma:
```bash
bun install
bun run dev
```
