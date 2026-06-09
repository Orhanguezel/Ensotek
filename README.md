# Ensotek Workspace

Ensotek, soğutma kulesi çözümleri için geliştirilen B2B platform ailesidir. Bu workspace; ortak paketleri ve her biri **kendi git reposu** olan birden çok site projesini bir arada tutar (poly-repo).

## Workspace Yapısı

| Klasör | Açıklama | Git reposu |
|--------|----------|------------|
| `packages/` | Ortak paketler: `shared-backend`, `shared-config`, `shared-types`, `shared-ui`, `core` | Ensotek (workspace) |
| `ensotek_de/` | ensotek.de — frontend + backend + admin_panel | `Orhanguezel/ensotek_de` |
| `ensotek_com_tr/` | ensotek.com.tr — frontend + backend + admin_panel | `Orhanguezel/ensotek_com_tr` |
| `kompozit/` | karbonkompozit.com.tr — frontend + backend + admin_panel | `Orhanguezel/kompozit` |
| `kuhlturm/` | kuhlturm.com — frontend (kendi backend'i planlanıyor) | `Orhanguezel/kuhlturm` |
| `ensotek_com/` | ensotek.com — planlanıyor | — |
| `docs/` | Workspace dökümantasyonu, planlar, görseller | Ensotek (workspace) |

Her site projesi kendi git reposu olarak ayrı takip edilir ve **kendi veritabanına** sahiptir. Ortak kod `packages/` altında durur; root `bun` workspace ile tüm projelere bağlanır.

## Teknoloji Yığını

- **Frontend:** Next.js 16, React 19, TypeScript, next-intl, Tailwind CSS v4, React Query
- **Backend:** Fastify 5, Drizzle ORM, MySQL, Bun, Zod
- **Admin:** Next.js 16, Redux Toolkit, Tailwind CSS v4
- **Platform:** JWT, Cloudinary, Swagger, i18n
- **Operasyon:** Docker, Nginx, PM2, GitHub Actions

## Komutlar

Root dizinde (`bun` workspace):

```bash
bun install
bun run dev:de              # ensotek_de/frontend
bun run dev:kuhlturm        # kuhlturm/frontend
bun run dev:ensotek-com-tr  # ensotek_com_tr/frontend
```

Her proje kendi klasöründe de çalıştırılabilir; ayrıntılar projenin kendi `README.md` dosyasındadır.

## Server / Deploy

- **Domain:** ensotek.de (nginx reverse proxy)
- Deploy ve PM2 ayrıntıları: [`CLAUDE.md`](CLAUDE.md)

> ⚠️ `.github/workflows/deploy.yml` hâlâ eski flat yapıyı (`backend/`, `de_frontend/`) referans alıyor — VPS yeni yapıya taşınmadan tetiklenmemeli.

## Dökümantasyon

- Mimari kararlar, planlar ve görseller: [`docs/`](docs/)
- Portfolyo metadata: `project.portfolio.json` (workspace) + her projenin kendi `project.portfolio.json` dosyası
- Bu dosya, `CLAUDE.md` ve `project.portfolio.json` birbiriyle uyumlu tutulur.
