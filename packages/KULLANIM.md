# packages/ — Kullanim Rehberi

Ensotek workspace'inde paylasilan paketler. Root `package.json` `"packages/*"` glob'u ile tum paketler workspace'e dahil edilir.

## Paket Listesi

| Paket | NPM Adi | Amac |
|-------|---------|------|
| `core` | `@ensotek/core` | Frontend API katmani — servisler, tipler, endpoint sabitleri, i18n |
| `shared-backend` | `@agro/shared-backend` | Ortak Fastify modulleri (auth, products, gallery vb.) |
| `shared-types` | `@agro/shared-types` | Ekosistem TypeScript tipleri |
| `shared-config` | `@agro/shared-config` | Paylasilan tsconfig, Tailwind token'lari |
| `shared-ui` | `@agro/shared-ui` | Ortak React UI bilesenler |

---

## @ensotek/core — Frontend Paketini Kullanma

`kuhlturm-frontend` ve `de_frontend` bu paketi kullanir.

### Kurulum

```json
// frontend/package.json
{
  "dependencies": {
    "@ensotek/core": "workspace:*"
  }
}
```

Root'tan `bun install` calistir, workspace linkleri kurulur.

### Import Ornekleri

```typescript
// Tipler
import type { Product, Category, Service } from '@ensotek/core/types';

// Servisler (Next.js RSC icin fetch wrapperlari)
import { getProducts, getProductBySlug } from '@ensotek/core/services';

// Endpoint sabitleri
import { API_ENDPOINTS } from '@ensotek/core/endpoints';

// i18n — runtime locale ayarlari
import { getRuntimeLocaleSettings } from '@ensotek/core/i18n';
```

### Servis Kullanimi (Next.js RSC)

```typescript
// app/[locale]/products/page.tsx
import { getProducts } from '@ensotek/core/services';

export default async function ProductsPage({ params }: { params: { locale: string } }) {
  const products = await getProducts({ locale: params.locale, limit: 20 });
  return <ProductList items={products.data} />;
}
```

### Fetch Caching Stratejisi

```typescript
// apiFetch opsiyonlari
import { apiFetch } from '@ensotek/core/lib';

// ISR — 5 dakikada bir yenile
const data = await apiFetch(BASE_URL, '/products', params, {
  next: { revalidate: 300 }
});

// Her istekte taze veri
const data = await apiFetch(BASE_URL, '/products', params, {
  cache: 'no-store'
});

// Tag-based revalidate
const data = await apiFetch(BASE_URL, '/products', params, {
  next: { tags: ['products'] }
});
```

### Locale Ayarlari (Runtime)

```typescript
// Backend'den aktif dilleri cek, hardcode etme
import { getRuntimeLocaleSettings } from '@ensotek/core/i18n';

const localeSettings = await getRuntimeLocaleSettings(
  process.env.NEXT_PUBLIC_API_URL!,
  ['tr', 'en', 'de'],  // desteklenen diller
  'de'                  // fallback
);
// localeSettings.activeLocales, localeSettings.defaultLocale
```

---

## @ensotek/core'a Yeni Endpoint/Servis Ekleme

### Adim 1: Tip ekle

```typescript
// packages/core/src/types/new-entity.type.ts
export interface NewEntity {
  id: number;
  name: string;
  // ...
}
```

`packages/core/src/types/index.ts`'e export ekle.

### Adim 2: Endpoint sabiti ekle

```typescript
// packages/core/src/endpoints/api-endpoints.ts
NEW_ENTITY: {
  LIST: '/new-entities',
  BY_ID: (id: number) => `/new-entities/${id}`,
}
```

### Adim 3: Servis fonksiyonu yaz

```typescript
// packages/core/src/services/new-entity.service.ts
import { apiFetch } from '../lib/fetch';
import type { NewEntity } from '../types';

export async function getNewEntities(baseUrl: string, locale: string) {
  return apiFetch<NewEntity[]>(baseUrl, API_ENDPOINTS.NEW_ENTITY.LIST, { locale });
}
```

`packages/core/src/services/index.ts`'e export ekle.

---

## Yeni Frontend Workspace'e Ekleme

```json
// root package.json
{
  "workspaces": [
    "packages/*",
    "kuhlturm-frontend",
    "de_frontend",
    "yeni-frontend"   // ekle
  ]
}
```

```json
// yeni-frontend/package.json
{
  "name": "yeni-frontend",
  "dependencies": {
    "@ensotek/core": "workspace:*"
  }
}
```

```bash
bun install
```

---

## Gunluk Calisma Akisi

```bash
# Root'tan tum bagimliliklar
cd /home/orhan/Documents/Projeler/Ensotek
bun install

# Frontend gelistirme
bun run dev:kuhlturm   # port 3010
bun run dev:de         # port 3002

# Typecheck — paket degisikliginden sonra
cd packages/core && npx tsc --noEmit
cd kuhlturm-frontend && bun run type-check
cd de_frontend && bun run type-check
```

---

## Kurallar

- `@ensotek/core` tip ve endpoint degisikligi tum frontendleri etkiler — typecheck yap
- Hardcoded API URL YASAK — her zaman `NEXT_PUBLIC_API_URL` env degiskeninden al
- 2+ frontend'de kullanilan servis → `packages/core/src/services/`'a tasindi
- Frontend-spesifik logic → ilgili frontend'in `src/features/` dizininde kalir
- Locale hardcode YASAK — `getRuntimeLocaleSettings` kullan
