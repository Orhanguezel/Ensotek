// =============================================================
// FILE: src/components/admin/newsletter/NewsletterHeader.tsx
// Admin Newsletter – Filtre / Toolbar (dynamic locale)
// =============================================================

import React from 'react';
import type { NewsletterOrderBy } from '@/integrations/types';

export type LocaleOption = { value: string; label: string };

interface NewsletterHeaderProps {
  search: string;
  onSearchChange: (val: string) => void;

  email: string;
  onEmailChange: (val: string) => void;

  locale: string; // "" => all
  onLocaleChange: (val: string) => void;
  locales: LocaleOption[];
  localesLoading?: boolean;

  onlyVerified: boolean;
  onOnlyVerifiedChange: (val: boolean) => void;

  onlySubscribed: boolean;
  onOnlySubscribedChange: (val: boolean) => void;

  orderBy: NewsletterOrderBy;
  order: 'asc' | 'desc';
  onOrderByChange: (val: NewsletterOrderBy) => void;
  onOrderChange: (val: 'asc' | 'desc') => void;

  loading: boolean;
  onRefresh: () => void;
  total: number;
}

export const NewsletterHeader: React.FC<NewsletterHeaderProps> = ({
  search,
  onSearchChange,
  email,
  onEmailChange,
  locale,
  onLocaleChange,
  locales,
  localesLoading,
  onlyVerified,
  onOnlyVerifiedChange,
  onlySubscribed,
  onOnlySubscribedChange,
  orderBy,
  order,
  onOrderByChange,
  onOrderChange,
  loading,
  onRefresh,
  total,
}) => {
  return (
    <div className="card mb-3">
      <div className="card-body py-2">
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <label className="form-label small mb-1">Ara (email / genel)</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Arama..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label small mb-1">Email</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Tam email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <label className="form-label small mb-1">
              Dil (locale){' '}
              {localesLoading && <span className="spinner-border spinner-border-sm ms-1" />}
            </label>
            <select
              className="form-select form-select-sm"
              value={locale}
              onChange={(e) => onLocaleChange(e.target.value)}
              disabled={!!localesLoading && !locales.length}
            >
              {(locales ?? []).map((opt) => (
                <option key={`${opt.value}:${opt.label}`} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2 d-flex flex-column">
            <div className="form-check form-switch small mb-1">
              <input
                className="form-check-input"
                type="checkbox"
                id="newsletter-filter-verified"
                checked={onlyVerified}
                onChange={(e) => onOnlyVerifiedChange(e.target.checked)}
              />
              <label className="form-check-label ms-1" htmlFor="newsletter-filter-verified">
                Sadece doğrulanmış
              </label>
            </div>

            <div className="form-check form-switch small">
              <input
                className="form-check-input"
                type="checkbox"
                id="newsletter-filter-subscribed"
                checked={onlySubscribed}
                onChange={(e) => onOnlySubscribedChange(e.target.checked)}
              />
              <label className="form-check-label ms-1" htmlFor="newsletter-filter-subscribed">
                Sadece aboneler
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="row g-1">
              <div className="col-7">
                <label className="form-label small mb-1">Sırala (orderBy)</label>
                <select
                  className="form-select form-select-sm"
                  value={orderBy}
                  onChange={(e) => onOrderByChange(e.target.value as NewsletterOrderBy)}
                >
                  <option value="created_at">Oluşturma</option>
                  <option value="updated_at">Güncelleme</option>
                  <option value="email">Email</option>
                  <option value="verified">Doğrulama</option>
                  <option value="locale">Dil</option>
                </select>
              </div>
              <div className="col-5">
                <label className="form-label small mb-1">Yön (order)</label>
                <select
                  className="form-select form-select-sm"
                  value={order}
                  onChange={(e) => onOrderChange(e.target.value as 'asc' | 'desc')}
                >
                  <option value="asc">Artan</option>
                  <option value="desc">Azalan</option>
                </select>
              </div>
            </div>
          </div>

          <div className="col-md-12 d-flex justify-content-between align-items-center mt-1">
            <div className="small text-muted">
              Toplam <span className="fw-semibold">{total.toLocaleString('de-DE')}</span> kayıt
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={onRefresh}
                disabled={loading}
              >
                {loading ? 'Yenileniyor...' : 'Yenile'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
