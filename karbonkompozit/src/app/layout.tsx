import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import { SITE_URL } from '@/lib/utils';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
