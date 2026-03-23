'use client';

import Link from 'next/link';
import { Wrench } from 'lucide-react';

interface Props {
  locale: string;
  serviceId: string;
  serviceName: string;
  label: string;
}

export function ServiceOfferButton({ locale, serviceId, serviceName, label }: Props) {
  const params = new URLSearchParams({ type: 'service', serviceId, serviceName });

  return (
    <Link
      href={`/${locale}/offer?${params.toString()}`}
      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
    >
      <Wrench size={16} />
      {label}
    </Link>
  );
}
