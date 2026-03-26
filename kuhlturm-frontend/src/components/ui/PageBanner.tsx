import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBannerProps {
  locale: string;
  breadcrumbs: BreadcrumbItem[];
  homeLabel?: string;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'compact';
  children?: ReactNode;
}

export function PageBanner({
  locale,
  breadcrumbs,
  homeLabel = 'Startseite',
  title,
  subtitle,
  variant = 'default',
  children,
}: PageBannerProps) {
  const py = variant === 'compact' ? 'py-8' : 'py-12 md:py-20';

  return (
    <div className={`bg-slate-900 text-white ${py}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-slate-400 flex-wrap mb-4">
          <Link href={`/${locale}`} className="hover:text-white transition-colors">
            {homeLabel}
          </Link>
          {breadcrumbs.map((item, i) => (
            <span key={i} className="contents">
              <ChevronRight size={14} className="shrink-0" />
              {item.href ? (
                <Link href={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-white truncate max-w-xs">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
        {title && (
          <h1 className="font-display text-4xl md:text-5xl font-bold">{title}</h1>
        )}
        {subtitle && (
          <p className="mt-3 text-slate-300 text-lg max-w-2xl">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  );
}
