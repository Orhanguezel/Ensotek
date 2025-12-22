// =============================================================
// FILE: src/components/admin/custompage/CustomPageList.tsx
// Ensotek – Admin Custom Pages Listesi + Drag & Drop Reorder
//
// Robust Responsive Strategy (NO Bootstrap breakpoint dependency):
// - Default: CARDS (mobile + tablet + normal desktop)
// - Very large screens (min-width: 1700px): TABLE + DnD
// =============================================================

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

import type { CustomPageDto } from '@/integrations/types/custom_pages.types';
import { useDeleteCustomPageAdminMutation } from '@/integrations/rtk/hooks';

export type CustomPageListProps = {
  items?: CustomPageDto[];
  loading: boolean;

  onReorder?: (next: CustomPageDto[]) => void;
  onSaveOrder?: () => void;
  savingOrder?: boolean;

  activeLocale?: string;
};

const VERY_LARGE_BP = 1700; // ✅ sadece çok büyük ekranlarda tablo

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

  const effectiveLocale = useMemo(() => {
    const l = normLocale(activeLocale);
    return l || '';
  }, [activeLocale]);

  // DnD sadece tablodaki satırlarda aktif
  const canReorder = !!onReorder;

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

  const renderCards = () => {
    if (loading) {
      return <div className="px-3 py-3 text-center text-muted small">Sayfalar yükleniyor...</div>;
    }

    if (!hasData) {
      return (
        <div className="px-3 py-3 text-center text-muted small">
          Henüz kayıtlı sayfa bulunmuyor.
        </div>
      );
    }

    return (
      <div className="p-3">
        <div className="row g-3">
          {rows.map((p, idx) => {
            const localeResolved = safeText((p as any).locale_resolved);
            const catName = safeText((p as any).category_name);
            const catSlug = safeText((p as any).category_slug);
            const subName = safeText((p as any).sub_category_name);
            const subSlug = safeText((p as any).sub_category_slug);

            return (
              <div key={p.id} className="col-12 col-xl-6">
                <div className="border rounded-3 p-3 bg-white h-100">
                  <div className="d-flex align-items-start justify-content-between gap-3">
                    <div style={{ minWidth: 0 }}>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span className="badge bg-light text-dark border">#{idx + 1}</span>
                        {renderStatus(p)}
                        {localeResolved ? (
                          <span className="badge bg-light text-dark border">
                            Locale: <code>{localeResolved}</code>
                          </span>
                        ) : null}
                      </div>

                      <div className="fw-semibold mt-2" style={{ wordBreak: 'break-word' }}>
                        {p.title ?? <span className="text-muted">Başlık yok</span>}
                      </div>

                      {p.meta_title ? (
                        <div className="text-muted small mt-1" style={{ wordBreak: 'break-word' }}>
                          SEO: {p.meta_title}
                        </div>
                      ) : null}

                      <div className="text-muted small mt-2" style={{ wordBreak: 'break-word' }}>
                        ID: <code>{p.id}</code>
                      </div>

                      <div className="text-muted small mt-1" style={{ wordBreak: 'break-word' }}>
                        Slug: <code>{p.slug ?? '-'}</code>
                      </div>

                      <div className="mt-2">
                        {catName || catSlug ? (
                          <div className="small">
                            <div className="fw-semibold" style={{ wordBreak: 'break-word' }}>
                              Kategori: {catName || '(Kategori adı yok)'}
                            </div>
                            {catSlug ? (
                              <div className="text-muted small" style={{ wordBreak: 'break-word' }}>
                                Slug: <code>{catSlug}</code>
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <div className="text-muted small">Kategori atanmadı</div>
                        )}

                        {subName || subSlug ? (
                          <div className="small mt-2">
                            <div className="fw-semibold" style={{ wordBreak: 'break-word' }}>
                              Alt Kategori: {subName || '(Alt kategori adı yok)'}
                            </div>
                            {subSlug ? (
                              <div className="text-muted small" style={{ wordBreak: 'break-word' }}>
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

                    <div className="d-flex flex-column gap-2" style={{ width: 140 }}>
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
            Tablet ve normal masaüstünde liste kart görünümündedir. Sıralama (DnD) sadece çok büyük
            ekranlarda (≥ {VERY_LARGE_BP}px) tabloda aktiftir.
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      {/* ✅ Local CSS: breakpoint garanti */}
      <style jsx>{`
        .cpTable {
          display: none;
        }
        .cpCards {
          display: block;
        }

        @media (min-width: ${VERY_LARGE_BP}px) {
          .cpTable {
            display: block;
          }
          .cpCards {
            display: none;
          }
        }
      `}</style>

      <div className="card-header py-2">
        <div className="d-flex align-items-start align-items-md-center justify-content-between gap-2 flex-wrap">
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

      <div className="card-body p-0">
        {/* ===================== TABLE (ONLY VERY LARGE) ===================== */}
        <div className="cpTable">
          <div className="table-responsive">
            <table className="table table-hover table-sm mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 56 }} className="text-muted">
                    #
                  </th>
                  <th style={{ width: '32%' }}>Başlık</th>
                  <th style={{ width: '22%' }}>Slug</th>
                  <th style={{ width: '22%' }}>Kategori</th>
                  <th style={{ width: 110 }}>Durum</th>
                  <th style={{ width: 190 }}>Tarih</th>
                  <th style={{ width: 170 }} className="text-end text-nowrap">
                    İşlemler
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="text-center text-muted small py-3">
                        Sayfalar yükleniyor...
                      </div>
                    </td>
                  </tr>
                ) : hasData ? (
                  rows.map((p, idx) => {
                    const localeResolved = safeText((p as any).locale_resolved);
                    const catName = safeText((p as any).category_name);
                    const catSlug = safeText((p as any).category_slug);
                    const subName = safeText((p as any).sub_category_name);
                    const subSlug = safeText((p as any).sub_category_slug);

                    return (
                      <tr
                        key={p.id}
                        draggable={canReorder}
                        onDragStart={() => canReorder && handleDragStart(p.id)}
                        onDragEnd={canReorder ? handleDragEnd : undefined}
                        onDragOver={canReorder ? (e) => e.preventDefault() : undefined}
                        onDrop={canReorder ? () => handleDropOn(p.id) : undefined}
                        className={draggingId === p.id ? 'table-active' : undefined}
                        style={canReorder ? { cursor: 'move' } : { cursor: 'default' }}
                      >
                        <td className="text-muted small text-nowrap">
                          {canReorder && <span className="me-2">≡</span>}
                          {idx + 1}
                        </td>

                        <td style={{ minWidth: 320 }}>
                          <div style={{ minWidth: 0 }}>
                            <div className="fw-semibold text-truncate" title={safeText(p.title)}>
                              {p.title ?? <span className="text-muted">Başlık yok</span>}
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

                        <td style={{ minWidth: 260 }}>
                          <div className="text-truncate" title={safeText(p.slug)}>
                            <code>{p.slug ?? '-'}</code>
                          </div>
                        </td>

                        <td style={{ minWidth: 280 }}>
                          {catName || catSlug ? (
                            <div style={{ minWidth: 0 }}>
                              <div className="text-truncate" title={catName}>
                                <span className="fw-semibold">
                                  {catName || '(Kategori adı yok)'}
                                </span>
                              </div>

                              {catSlug ? (
                                <div className="text-muted small text-truncate" title={catSlug}>
                                  <span className="me-1">Slug:</span> <code>{catSlug}</code>
                                </div>
                              ) : null}

                              {subName || subSlug ? (
                                <div className="mt-1">
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

                        <td className="text-nowrap">{renderStatus(p)}</td>

                        <td className="small text-nowrap">
                          <div>{formatDate(p.created_at)}</div>
                          <div className="text-muted small">
                            Güncelleme: {formatDate(p.updated_at)}
                          </div>
                        </td>

                        <td className="text-end text-nowrap">
                          <div className="btn-group btn-group-sm" role="group">
                            <Link
                              href={editHrefById(p.id)}
                              className="btn btn-outline-primary btn-sm"
                            >
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
                  })
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <div className="text-center text-muted small py-3">
                        Henüz kayıtlı sayfa bulunmuyor.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>

              <caption className="px-3 py-2 text-start">
                <span className="text-muted small">
                  Sıralama (DnD) sadece çok büyük ekranlarda (≥ {VERY_LARGE_BP}px) tabloda
                  kullanılabilir. Kaydetmek için <strong>&quot;Sıralamayı Kaydet&quot;</strong>.
                </span>
              </caption>
            </table>
          </div>
        </div>

        {/* ===================== CARDS (DEFAULT) ===================== */}
        <div className="cpCards">{renderCards()}</div>
      </div>
    </div>
  );
};
