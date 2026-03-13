'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ALLOWED_PREFIXES = [
  '/admin',
  '/admin/dashboard',
  '/admin/products',
  '/admin/categories',
  '/admin/subcategories',
  '/admin/gallery',
  '/admin/offer',
  '/admin/custompage',
  '/admin/reviews',
  '/admin/site-settings',
  '/admin/contacts',
  '/admin/menuitem',
  '/admin/library',
  '/admin/references',
  '/admin/users',
  '/admin/notifications',
  '/admin/storage',
  '/admin/audit',
  '/admin/profile',
] as const;

function isAllowed(pathname: string | null): boolean {
  if (!pathname) return true;
  return ALLOWED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function KompozitAdminRouteGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isAllowed(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-3xl items-center justify-center">
      <Card className="w-full border-orange-200 bg-orange-50/60">
        <CardHeader>
          <CardTitle>Bu ekran MOE Kompozit panelinde aktif değil</CardTitle>
          <CardDescription>
            Bu admin panel kompozit operasyonlari icin sadeleştirildi. Su anki route shared Ensotek panelinden kalan bir ekrana ait.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/admin/dashboard">Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/site-settings">Site Settings</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
