import Link from 'next/link';
import { ArrowRight, BookOpen, Eye, FileText, Wrench } from 'lucide-react';
import type { LibraryItem } from '@ensotek/core/types';

interface Props {
  items: LibraryItem[];
  locale: string;
  title: string;
  subtitle: string;
  viewAllLabel: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

const TYPE_STYLES: Record<string, { label: string; className: string }> = {
  article:    { label: 'Artikel',   className: 'bg-blue-50 text-blue-700' },
  guide:      { label: 'Anleitung', className: 'bg-emerald-50 text-emerald-700' },
  manual:     { label: 'Handbuch',  className: 'bg-violet-50 text-violet-700' },
  faq:        { label: 'FAQ',       className: 'bg-amber-50 text-amber-700' },
  whitepaper: { label: 'Whitepaper',className: 'bg-slate-100 text-slate-700' },
};

function TypeBadge({ type }: { type: string }) {
  const style = TYPE_STYLES[type] ?? { label: type, className: 'bg-slate-100 text-slate-600' };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${style.className}`}>
      {style.label}
    </span>
  );
}

function TypeIcon({ type }: { type: string }) {
  if (type === 'guide' || type === 'manual') return <Wrench size={16} className="text-slate-400" />;
  if (type === 'whitepaper') return <FileText size={16} className="text-slate-400" />;
  return <BookOpen size={16} className="text-slate-400" />;
}

export function LibrarySection({ items, locale, title, subtitle, viewAllLabel }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="py-(--section-py) bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900">{title}</h2>
            <p className="mt-2 text-slate-500">{subtitle}</p>
          </div>
          <Link
            href={`/${locale}/library`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 shrink-0"
          >
            {viewAllLabel}
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const excerpt = item.description ? stripHtml(item.description).slice(0, 160) : null;
            const tags = item.tags ? item.tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 3) : [];

            return (
              <Link
                key={item.id}
                href={item.slug ? `/${locale}/library/${item.slug}` : '#'}
                className="group flex flex-col bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all p-5 gap-3"
              >
                {/* Top row: icon + type badge */}
                <div className="flex items-center justify-between">
                  <TypeIcon type={item.type} />
                  <TypeBadge type={item.type} />
                </div>

                {/* Title */}
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                  {item.name ?? '—'}
                </h3>

                {/* Excerpt */}
                {excerpt && (
                  <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed flex-1">
                    {excerpt}
                  </p>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[11px] rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer: views + arrow */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  {item.views > 0 ? (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Eye size={12} />
                      {item.views.toLocaleString('de-DE')}
                    </span>
                  ) : (
                    <span />
                  )}
                  <ArrowRight
                    size={15}
                    className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
