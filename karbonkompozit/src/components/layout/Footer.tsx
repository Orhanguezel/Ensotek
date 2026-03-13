import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface FooterSection {
  title?: string;
  items?: { label?: string; url?: string }[];
  [key: string]: unknown;
}

function normalizeSections(raw: Record<string, unknown>[]): FooterSection[] {
  return raw.map((s) => ({
    title: String(s.title ?? s.name ?? ''),
    items: Array.isArray(s.items)
      ? s.items.map((i: any) => ({
          label: String(i.label ?? i.title ?? ''),
          url: String(i.url ?? i.href ?? '#'),
        }))
      : [],
  }));
}

export function Footer({
  sections,
  locale,
}: {
  sections: Record<string, unknown>[];
  locale: string;
}) {
  const t = useTranslations('footer');
  const normalized = normalizeSections(sections);
  const year = new Date().getFullYear();

  return (
    <footer className="surface-dark-border border-t bg-[var(--color-bg-dark)] text-[var(--color-text-on-dark)]">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <h3
              className="text-lg font-bold font-[var(--font-display)]"
              style={{ color: 'var(--color-text-on-dark)' }}
            >
              MOE Kompozit
            </h3>
            <p className="surface-dark-text text-sm leading-relaxed">
              {t('description')}
            </p>
          </div>

          {/* Dynamic sections */}
          {normalized.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="surface-dark-text text-sm font-semibold uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-1">
                {section.items?.map((item) => (
                  <li key={item.url}>
                    <Link
                      href={item.url!}
                      className="surface-dark-link inline-flex min-h-9 items-center py-1 text-sm transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="surface-dark-border mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="surface-dark-text text-xs">
            &copy; {year} MOE Kompozit. {t('rights')}
          </p>
          <div className="flex gap-4">
            <Link
              href={`/${locale}/legal/privacy`}
              className="surface-dark-link inline-flex min-h-9 items-center py-1 text-xs"
            >
              {t('privacy')}
            </Link>
            <Link
              href={`/${locale}/legal/terms`}
              className="surface-dark-link inline-flex min-h-9 items-center py-1 text-xs"
            >
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
