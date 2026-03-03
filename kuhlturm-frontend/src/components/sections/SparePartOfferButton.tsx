'use client';

import Link from 'next/link';
import { Package } from 'lucide-react';

interface Props {
  locale: string;
  partId: string;
  partTitle: string;
  partCode?: string;
  label: string;
}

export function SparePartOfferButton({ locale, partId, partTitle, partCode, label }: Props) {
  const params = new URLSearchParams({ type: 'sparepart', partId, partTitle });
  if (partCode) params.set('partCode', partCode);

  return (
    <Link
      href={`/${locale}/offer?${params.toString()}`}
      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
    >
      <Package size={16} />
      {label}
    </Link>
  );
}
