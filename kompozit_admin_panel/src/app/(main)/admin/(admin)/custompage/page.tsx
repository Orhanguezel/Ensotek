// =============================================================
// FILE: src/app/(main)/admin/(admin)/siteSettings/page.tsx
// FINAL — Admin Site Settings Page
// =============================================================

import AdminCustomPagesClient from './admin-custom-pages-client';

type SearchParams = Promise<{ module?: string | string[] }> | { module?: string | string[] };

export default async function Page({ searchParams }: { searchParams?: SearchParams }) {
  const params = (await searchParams) ?? {};
  const rawModule = Array.isArray(params.module) ? params.module[0] : params.module;
  return (
    <AdminCustomPagesClient
      initialModuleKey={typeof rawModule === 'string' ? rawModule.trim() : ''}
    />
  );
}
