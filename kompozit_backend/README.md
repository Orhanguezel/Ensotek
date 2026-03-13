# MOE Kompozit Backend

Bu klasor, `backend` uygulamasinin kompozit odakli ayrilmis kopyasidir.

Amac:
- shared `backend` uzerindeki tenant/site bagimliligini azaltmak
- kompozit modullerini kendi codebase'i icinde temizlemek
- ayni Fastify/Bun iskeletini koruyup ayri rollout yapmak

Gecici durum:
- iskelet `backend` reposundan klonlandi
- port `8186` olarak ayrildi
- CORS ve public URL'ler kompozit frontend/admin icin ayrildi
- sonraki adim modulleri tek tek prune edip kompozit'e ozel hale getirmek

Calistirma:
```bash
bun install
bun run dev
```
