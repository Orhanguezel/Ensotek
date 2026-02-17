'use client';

import { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/features/auth/auth.store';
import { useLogout } from '@/features/auth/auth.action';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
  const { user, isAuthenticated, hydrated } = useAuthStore();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated || !user) {
      router.push('/login');
    }
  }, [hydrated, isAuthenticated, router, user]);

  if (!hydrated) return null;
  if (!isAuthenticated || !user) return null;

  const links = [
    { href: '/', icon: 'fa-house', label: t('sidebar_home') },
    { href: '/dashboard', icon: 'fa-grid-2', label: t('sidebar_dashboard') },
    { href: '/profile', icon: 'fa-user', label: t('sidebar_profile') },
  ];

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => router.push('/login'),
    });
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <aside className="d-none d-lg-flex flex-column bg-dark text-white" style={{ width: 260 }}>
        <div className="p-4 border-bottom border-secondary">
          <Link href="/" className="text-white fw-bold text-decoration-none">ENSOTEK</Link>
        </div>

        <nav className="flex-grow-1 p-3">
          <ul className="list-unstyled d-flex flex-column gap-2 m-0">
            {links.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`d-flex align-items-center gap-3 rounded px-3 py-2 text-decoration-none ${
                      active ? 'bg-primary text-white' : 'text-white-50'
                    }`}
                  >
                    <i className={`fa-light ${item.icon}`} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 border-top border-secondary">
          <button
            type="button"
            className="btn btn-link text-white-50 text-decoration-none p-0 d-flex align-items-center gap-2"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            <i className="fa-light fa-right-from-bracket" />
            {t('logout')}
          </button>
        </div>
      </aside>

      <div className="flex-grow-1 d-flex flex-column">
        <header className="bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
          <div className="fw-semibold">{t('welcome', { name: user.full_name || user.email })}</div>
          <div className="d-flex align-items-center gap-3">
            <Link href="/" className="btn btn-sm btn-outline-primary">
              <i className="fa-light fa-arrow-left me-1" />
              {t('back_home')}
            </Link>
            <div className="small text-muted text-uppercase">{locale}</div>
          </div>
        </header>

        <main className="flex-grow-1 p-3 p-md-4">{children}</main>
      </div>
    </div>
  );
}
