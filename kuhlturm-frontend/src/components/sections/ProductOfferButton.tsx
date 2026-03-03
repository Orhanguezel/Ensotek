'use client';

import Link from 'next/link';
import { Settings2 } from 'lucide-react';

interface Props {
  locale: string;
  productId: string;
  productTitle: string;
  label: string;
}

export function ProductOfferButton({ locale, productId, productTitle, label }: Props) {
  const params = new URLSearchParams({ type: 'product', productId, productTitle });

  return (
    <Link
      href={`/${locale}/offer?${params.toString()}`}
      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
    >
      <Settings2 size={16} />
      {label}
    </Link>
  );
}
