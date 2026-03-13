// =============================================================
// FILE: src/app/(main)/admin/(admin)/offer/page.tsx
// Admin Offers Page (App Router wrapper)
// =============================================================

import AdminOfferClient from './_components/admin-offer-client';

interface Props {
  searchParams: Promise<{ source?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { source } = await searchParams;
  return <AdminOfferClient initialSource={source} />;
}
