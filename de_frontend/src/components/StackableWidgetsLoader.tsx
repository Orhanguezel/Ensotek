'use client';

import dynamic from 'next/dynamic';

const StackableWidgets = dynamic(
  () => import('@/features/catalog').then((m) => m.StackableWidgets),
  { ssr: false }
);

export default function StackableWidgetsLoader() {
  return <StackableWidgets />;
}
