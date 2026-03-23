// =============================================================
// FILE: src/app/(main)/admin/(admin)/custompage/[id]/page.tsx
// FINAL — Admin Custom Page Detail (App Router)
// Route: /admin/custompage/:id  (id: "new" | UUID)
// =============================================================

import AdminCustomPageDetailClient from "../admin-custom-pages-detail-client";

type Params = { id: string };
type SearchParams = { module?: string };

// Next.js bazı surumlerinde params'i Promise olarak verir (sync-dynamic-apis hatasi)
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<Params> | Params;
  searchParams: Promise<SearchParams> | SearchParams;
}) {
  const p = (await params) as Params;
  const sp = (await searchParams) as SearchParams;
  return <AdminCustomPageDetailClient id={p.id} initialModuleKey={sp.module || ""} />;
}
