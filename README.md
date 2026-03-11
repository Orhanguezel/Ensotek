# Ensotek

Ensotek, sogutma kulesi cozumleri icin gelistirilen bir B2B platformdur. Bu workspace icinde birden fazla frontend varyanti, yonetim paneli ve Fastify backend bulunur.

## Workspace Yapisi

- `backend/`: Fastify tabanli API, MySQL ve Drizzle ORM
- `admin_panel/`: Next.js tabanli yonetim paneli
- `de_frontend/`: Next.js tabanli frontend varyanti
- `kuhlturm-frontend/`: ayri frontend uygulamasi
- `com_frontend/`, `com.tr_frontend/`, `prime-frontend-nextjs/`, `packages/`: diger uygulama veya paylasilan workspace parcasi klasorleri

## Dogrulanmis Teknoloji Yigini

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Fastify, Drizzle ORM, MySQL, Bun, Zod
- Platform: JWT, Cloudinary, Swagger, i18n
- Operasyon: Docker, Nginx, CI/CD

## Komutlar

Kok dizinde:

```bash
bun run dev:de
bun run build:de
bun run dev:kuhlturm
bun run build:kuhlturm
```

Backend:

```bash
cd backend
bun run dev
bun run build
bun run start
bun run db:seed
```

Admin panel:

```bash
cd admin_panel
bun run dev
bun run build
bun run start
bun run check:fix
```

## Dokumantasyon Notu

Bu projede portfolio kaynak dosyasi `project.portfolio.json`'dur. Proje ozeti, teknoloji yigini, servisler veya domain bilgisi degisirse once bu dosya guncellenmeli; sonra `README.md` ve `CLAUDE.md` senkron tutulmalidir.
