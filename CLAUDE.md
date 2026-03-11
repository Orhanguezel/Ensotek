# CLAUDE.md — Ensotek

## Proje Ozeti

Ensotek, sogutma kulesi cozumleri icin gelistirilen bir B2B platformdur. Mevcut workspace icinde backend, admin panel ve birden fazla frontend varyanti bulunur.

## Workspace Haritasi

- `backend/`: Fastify API, Drizzle ORM, MySQL
- `admin_panel/`: yonetim paneli
- `de_frontend/`, `kuhlturm-frontend/`: aktif frontend varyantlari
- `com_frontend/`, `com.tr_frontend/`, `prime-frontend-nextjs/`, `packages/`: diger workspace bileşenleri

## Calisma Kurallari

- README, `CLAUDE.md` ve `project.portfolio.json` birbiriyle uyumlu tutulur.
- Frontend varyantlari, domain, stack veya servis kapsaminda degisiklik varsa once repo icinden teyit et.
- Calistirma komutlari yazilirken `package.json` scriptleri esas alinir.

## Portfolio Metadata Rule

- Proje kokunde `project.portfolio.json` dosyasi zorunludur.
- B2B platform ozeti, stack, servisler ve domain bilgisi degisirse once bu dosya guncellenir.
- Portfolio seedleri bu metadata dosyasina baglidir; metadata guncellenmeden is tamamlanmis sayilmaz.
