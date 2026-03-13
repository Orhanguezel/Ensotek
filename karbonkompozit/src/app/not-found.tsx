import Link from 'next/link';
import { BrandCtaPanel } from '@/components/patterns/BrandCtaPanel';
import { SeoIssueBeacon } from '@/components/monitoring/SeoIssueBeacon';

export default function NotFound() {
  return (
    <main className="section-py">
      <SeoIssueBeacon type="404" pathname="/404" reason="app-router-not-found" />
      <div className="mx-auto max-w-2xl px-4 text-center lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">
          404
        </p>
        <div className="mt-6">
          <BrandCtaPanel
            title="Sayfa bulunamadi"
            description="Isteginiz URL artik mevcut olmayabilir veya yanlis yazilmis olabilir."
            action={(
              <Link
                href="/tr"
                className="btn-contrast mt-5 inline-flex rounded-lg px-5 py-3 font-medium transition-colors"
              >
                Ana sayfaya don
              </Link>
            )}
          />
        </div>
      </div>
    </main>
  );
}
