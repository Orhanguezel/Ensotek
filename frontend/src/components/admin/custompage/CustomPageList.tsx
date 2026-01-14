// =============================================================
// FILE: src/components/admin/custompage/CustomPageList.tsx
// Ensotek – Admin Custom Pages Listesi + Drag & Drop Reorder
//
// FULL-WIDTH FIX:
// - This screen must be full width (no clamp / no left gap)
// - Remove container paddings (px-0)
// - Disable .ensotek-admin-page__inner max-width via modifier
// - Keep: Default cards, >=1700px table + DnD
// - No style-jsx / no inline styles
// =============================================================

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

import type { CustomPageDto } from '@/integrations/types';
import { useDeleteCustomPageAdminMutation } from '@/integrations/rtk/hooks';

export type CustomPageListProps = {
  items?: CustomPageDto[];
  loading: boolean;

  onReorder?: (next: CustomPageDto[]) => void;
  onSaveOrder?: () => void;
  savingOrder?: boolean;

  activeLocale?: string;
};

const VERY_LARGE_BP = 1700;

const formatDate = (value: string | null | undefined): string => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
};

const normLocale = (v: unknown): string =>
  String(v || '')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0]
    .trim();

const safeText = (v: unknown) => (v === null || v === undefined ? '' : String(v));

export const CustomPageList: React.FC<CustomPageListProps> = ({
  items,
  loading,
  onReorder,
  onSaveOrder,
  savingOrder,
  activeLocale,
}) => {
  const rows = items ?? [];
  const hasData = rows.length > 0;

  const [deletePage, { isLoading: isDeleting }] = useDeleteCustomPageAdminMutation();
  const busy = loading || isDeleting || !!savingOrder;

  const [draggingId, setDraggingId] = useState<string | null>(null);

  const effectiveLocale = useMemo(() => normLocale(activeLocale) || '', [activeLocale]);
  const canReorder = !!onReorder;

  const editHrefById = (id: string) => ({
    pathname: `/admin/custompage/${encodeURIComponent(id)}`,
    query: effectiveLocale ? { locale: effectiveLocale } : undefined,
  });

  const renderStatus = (p: CustomPageDto) =>
    p.is_published ? (
      <span className="badge bg-success-subtle text-success border border-success-subtle">
        Yayında
      </span>
    ) : (
      <span className="badge bg-warning-subtle text-warning border border-warning-subtle">
        Taslak
      </span>
    );

  const handleDelete = async (page: CustomPageDto) => {
    const ok = window.confirm(
      `Bu sayfayı silmek üzeresin.\n\n` +
        `Başlık: ${page.title ?? '(başlık yok)'}\n` +
        `ID: ${page.id}\n` +
        `Slug: ${page.slug ?? '(slug yok)'}\n\n` +
        `Devam etmek istiyor musun?`,
    );
    if (!ok) return;

    try {
      await deletePage(page.id).unwrap();
      toast.success('Sayfa başarıyla silindi.');
    } catch (err: unknown) {
      const msg =
        (err as { data?: { error?: { message?: string } } })?.data?.error?.message ??
        'Sayfa silinirken bir hata oluştu.';
      toast.error(msg);
    }
  };

  const handleDragStart = (id: string) => setDraggingId(id);
  const handleDragEnd = () => setDraggingId(null);

  const handleDropOn = (targetId: string) => {
    if (!draggingId || draggingId === targetId || !onReorder) return;

    const currentIndex = rows.findIndex((r) => r.id === draggingId);
    const targetIndex = rows.findIndex((r) => r.id === targetId);
    if (currentIndex === -1 || targetIndex === -1) return;

    const next = [...rows];
    const [moved] = next.splice(currentIndex, 1);
    next.splice(targetIndex, 0, moved);
    onReorder(next);
  };

  const renderEmptyOrLoading = () => {
    if (loading) return <div className="ensotek-cp-list__state">Sayfalar yükleniyor...</div>;
    return <div className="ensotek-cp-list__state">Henüz kayıtlı sayfa bulunmuyor.</div>;
  };

  const renderCards = () => {
    if (!hasData) return renderEmptyOrLoading();

    return (
      <div className="ensotek-cp-list__cards p-3">
        <div className="row g-3">
          {rows.map((p, idx) => {
            const localeResolved = safeText((p as any).locale_resolved);

            const catName = safeText((p as any).category_name);
            const catSlug = safeText((p as any).category_slug);
            const subName = safeText((p as any).sub_category_name);
            const subSlug = safeText((p as any).sub_category_slug);

            return (
              <div key={p.id} className="col-12 col-xxl-6">
                <div className="ensotek-cp-card border rounded-3 bg-white h-100 p-3">
                  <div className="d-flex align-items-start justify-content-between gap-3">
                    <div className="ensotek-cp-card__main">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span className="badge bg-light text-dark border">#{idx + 1}</span>
                        {renderStatus(p)}
                        {localeResolved ? (
                          <span className="badge bg-light text-dark border">
                            Locale: <code>{localeResolved}</code>
                          </span>
                        ) : null}
                      </div>

                      <div className="fw-semibold mt-2 ensotek-cp-card__title">
                        {p.title ?? <span className="text-muted">Başlık yok</span>}
                      </div>

                      {p.meta_title ? (
                        <div className="text-muted small mt-1 ensotek-cp-card__seo">
                          SEO: {p.meta_title}
                        </div>
                      ) : null}

                      <div className="text-muted small mt-2 ensotek-cp-card__line">
                        ID: <code>{p.id}</code>
                      </div>

                      <div className="text-muted small mt-1 ensotek-cp-card__line">
                        Slug: <code>{p.slug ?? '-'}</code>
                      </div>

                      <div className="mt-2">
                        {catName || catSlug ? (
                          <div className="small">
                            <div className="fw-semibold ensotek-cp-card__line">
                              Kategori: {catName || '(Kategori adı yok)'}
                            </div>
                            {catSlug ? (
                              <div className="text-muted small ensotek-cp-card__line">
                                Slug: <code>{catSlug}</code>
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <div className="text-muted small">Kategori atanmadı</div>
                        )}

                        {subName || subSlug ? (
                          <div className="small mt-2">
                            <div className="fw-semibold ensotek-cp-card__line">
                              Alt Kategori: {subName || '(Alt kategori adı yok)'}
                            </div>
                            {subSlug ? (
                              <div className="text-muted small ensotek-cp-card__line">
                                Slug: <code>{subSlug}</code>
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>

                      <div className="text-muted small mt-2">
                        <div>Oluşturulma: {formatDate(p.created_at)}</div>
                        <div>Güncelleme: {formatDate(p.updated_at)}</div>
                      </div>
                    </div>

                    <div className="ensotek-cp-card__actions">
                      <Link
                        href={editHrefById(p.id)}
                        className="btn btn-outline-primary btn-sm w-100"
                      >
                        Düzenle
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm w-100"
                        disabled={busy}
                        onClick={() => handleDelete(p)}
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3">
          <span className="text-muted small">
            Varsayılan görünüm karttır. Sıralama (DnD) sadece çok büyük ekranlarda (≥{' '}
            {VERY_LARGE_BP}
            px) tabloda aktiftir.
          </span>
        </div>
      </div>
    );
  };

  const renderTable = () => {
    if (!hasData) return renderEmptyOrLoading();

    return (
      <div className="ensotek-cp-list__table">
        <div className="table-responsive ensotek-cp-tablewrap">
          <table className="table table-hover table-sm mb-0 align-middle ensotek-cp-table">
            <thead className="table-light">
              <tr>
                <th className="ensotek-cp-col--index text-muted">#</th>
                <th className="ensotek-cp-col--title">Başlık</th>
                <th className="ensotek-cp-col--slug">Slug</th>
                <th className="ensotek-cp-col--cat">Kategori</th>
                <th className="ensotek-cp-col--status">Durum</th>
                <th className="ensotek-cp-col--date">Tarih</th>
                <th className="ensotek-cp-col--actions text-end text-nowrap">İşlemler</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((p, idx) => {
                const localeResolved = safeText((p as any).locale_resolved);

                const catName = safeText((p as any).category_name);
                const catSlug = safeText((p as any).category_slug);
                const subName = safeText((p as any).sub_category_name);
                const subSlug = safeText((p as any).sub_category_slug);

                const rowIsDragging = draggingId === p.id;

                return (
                  <tr
                    key={p.id}
                    draggable={canReorder}
                    onDragStart={() => canReorder && handleDragStart(p.id)}
                    onDragEnd={canReorder ? handleDragEnd : undefined}
                    onDragOver={canReorder ? (e) => e.preventDefault() : undefined}
                    onDrop={canReorder ? () => handleDropOn(p.id) : undefined}
                    className={[
                      rowIsDragging ? 'table-active' : '',
                      canReorder ? 'ensotek-cp-dnd' : '',
                    ].join(' ')}
                  >
                    <td className="ensotek-cp-col--index text-muted small text-nowrap">
                      {canReorder ? <span className="ensotek-cp-dnd__handle me-2">≡</span> : null}
                      {idx + 1}
                    </td>

                    <td className="ensotek-cp-col--title">
                      <div className="ensotek-minw-0">
                        <div className="fw-semibold text-truncate" title={safeText(p.title)}>
                          {p.title ?? 'Başlık yok'}
                        </div>

                        {p.meta_title ? (
                          <div className="text-muted small text-truncate" title={p.meta_title}>
                            SEO: {p.meta_title}
                          </div>
                        ) : null}

                        <div className="text-muted small text-truncate" title={p.id}>
                          ID: <code>{p.id}</code>
                          {localeResolved ? (
                            <>
                              {' '}
                              • Locale: <code>{localeResolved}</code>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    <td className="ensotek-cp-col--slug">
                      <div className="text-truncate" title={safeText(p.slug)}>
                        <code>{p.slug ?? '-'}</code>
                      </div>
                    </td>

                    <td className="ensotek-cp-col--cat">
                      {catName || catSlug ? (
                        <div className="ensotek-minw-0">
                          <div className="text-truncate" title={catName}>
                            <span className="fw-semibold">{catName || '(Kategori adı yok)'}</span>
                          </div>

                          {catSlug ? (
                            <div className="text-muted small text-truncate" title={catSlug}>
                              <span className="me-1">Slug:</span> <code>{catSlug}</code>
                            </div>
                          ) : null}

                          {subName || subSlug ? (
                            <div className="mt-1 ensotek-minw-0">
                              <div className="text-truncate" title={subName}>
                                <span className="text-muted small me-1">Alt:</span>
                                <span className="fw-semibold">
                                  {subName || '(Alt kategori adı yok)'}
                                </span>
                              </div>

                              {subSlug ? (
                                <div className="text-muted small text-truncate" title={subSlug}>
                                  <span className="me-1">Slug:</span> <code>{subSlug}</code>
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div className="text-muted small">Kategori atanmadı</div>
                      )}
                    </td>

                    <td className="ensotek-cp-col--status text-nowrap">{renderStatus(p)}</td>

                    <td className="ensotek-cp-col--date small text-nowrap">
                      <div className="text-truncate" title={formatDate(p.created_at)}>
                        {formatDate(p.created_at)}
                      </div>
                      <div
                        className="text-muted small text-truncate"
                        title={formatDate(p.updated_at)}
                      >
                        Güncelleme: {formatDate(p.updated_at)}
                      </div>
                    </td>

                    <td className="ensotek-cp-col--actions text-end text-nowrap">
                      <div className="btn-group btn-group-sm" role="group">
                        <Link href={editHrefById(p.id)} className="btn btn-outline-primary btn-sm">
                          Düzenle
                        </Link>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          disabled={busy}
                          onClick={() => handleDelete(p)}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <caption className="ensotek-cp-caption">
              <span className="text-muted small">
                Sıralama (DnD) sadece çok büyük ekranlarda (≥ {VERY_LARGE_BP}px) tabloda
                kullanılabilir.
              </span>
            </caption>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="ensotek-admin-page ensotek-admin-page--full">
      {/* FULL WIDTH: remove horizontal padding */}
      <div className="container-fluid px-0">
        {/* FULL WIDTH: disable clamp */}
        <div className="ensotek-admin-page__inner ensotek-admin-page__inner--full">
          <div className="card ensotek-cp-list ensotek-cp-list--full">
            <div className="card-header py-2">
              <div className="d-flex align-items-start align-items-md-center justify-content-between gap-2 flex-wrap px-2 px-lg-3">
                <span className="small fw-semibold">Sayfa Listesi</span>

                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {loading && <span className="badge bg-secondary small">Yükleniyor...</span>}

                  {onSaveOrder && (
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={onSaveOrder}
                      disabled={savingOrder || !hasData}
                    >
                      {savingOrder ? 'Sıralama kaydediliyor...' : 'Sıralamayı Kaydet'}
                    </button>
                  )}

                  <span className="text-muted small">
                    Toplam: <strong>{rows.length}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="card-body p-0 ensotek-cp-list__body">
              <div className="ensotek-cp-view ensotek-cp-view--table">{renderTable()}</div>
              <div className="ensotek-cp-view ensotek-cp-view--cards">{renderCards()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
