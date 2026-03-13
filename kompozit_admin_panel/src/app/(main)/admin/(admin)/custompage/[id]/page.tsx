// =============================================================
// FILE: src/app/(main)/admin/(admin)/custompage/[id]/page.tsx
// FINAL — Admin Custom Page Detail (App Router)
// Route: /admin/custompage/:id  (id: "new" | UUID)
// =============================================================

import AdminCustomPageDetailClient from '../admin-custom-pages-detail-client';

type Params = { id: string };
type SearchParams = Promise<{ module?: string | string[] }> | { module?: string | string[] };

// Next.js bazı sürümlerde params'ı Promise olarak verir (sync-dynamic-apis hatası)
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<Params> | Params;
  searchParams?: SearchParams;
}) {
  const p = (await params) as Params;
  const s = (await searchParams) ?? {};
  const rawModule = Array.isArray(s.module) ? s.module[0] : s.module;
  return (
    <AdminCustomPageDetailClient
      id={p.id}
      initialModuleKey={typeof rawModule === 'string' ? rawModule.trim() : ''}
    />
  );
}
