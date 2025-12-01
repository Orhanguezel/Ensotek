// =============================================================
// FILE: src/components/admin/site-settings/tabs/FooterSettingsTab.tsx
// Ensotek – Footer Bölümleri / Footer Settings Tab
// =============================================================

import React from "react";
import { toast } from "sonner";

import {
  useListFooterSectionsAdminQuery,
  useCreateFooterSectionAdminMutation,
  useUpdateFooterSectionAdminMutation,
  useDeleteFooterSectionAdminMutation,
} from "@/integrations/rtk/endpoints/admin/footer_sections_admin.endpoints";

import type { FooterSectionDto } from "@/integrations/types/footer_sections.types";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export type FooterSettingsTabProps = {
  locale: string;
};

type FooterSectionForm = {
  title: string;
  slug: string;
  description: string;
  display_order: string; // input için string, backend'e gönderirken number'a çeviriyoruz
  is_active: boolean;
  locale: string;
};

const EMPTY_FORM: FooterSectionForm = {
  title: "",
  slug: "",
  description: "",
  display_order: "0",
  is_active: true,
  locale: "",
};

export const FooterSettingsTab: React.FC<FooterSettingsTabProps> = ({
  locale,
}) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useListFooterSectionsAdminQuery({
    sort: "display_order",
    orderDir: "asc",
    limit: 200,
  });

  const [createFooterSection, { isLoading: isCreating }] =
    useCreateFooterSectionAdminMutation();
  const [updateFooterSection, { isLoading: isUpdating }] =
    useUpdateFooterSectionAdminMutation();
  const [deleteFooterSection, { isLoading: isDeleting }] =
    useDeleteFooterSectionAdminMutation();

  const items: FooterSectionDto[] = data?.items ?? [];
  const loading = isLoading || isFetching;
  const busy = loading || isCreating || isUpdating || isDeleting;

  const [showModal, setShowModal] = React.useState(false);
  const [editing, setEditing] = React.useState<FooterSectionDto | null>(null);
  const [form, setForm] = React.useState<FooterSectionForm>({
    ...EMPTY_FORM,
    locale: locale || "",
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      locale: locale || "",
      // varsayılan sıralama sonuna ekle
      display_order: String(items.length),
    });
    setShowModal(true);
  };

  const openEdit = (item: FooterSectionDto) => {
    setEditing(item);
    setForm({
      title: item.title || "",
      slug: item.slug || "",
      description: item.description || "",
      display_order: String(item.display_order ?? 0),
      is_active: !!item.is_active,
      locale: item.locale || locale || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    if (busy) return;
    setShowModal(false);
    setEditing(null);
  };

  const handleChange = (field: keyof FooterSectionForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleActive = () => {
    setForm((prev) => ({ ...prev, is_active: !prev.is_active }));
  };

  const handleSave = async () => {
    const title = form.title.trim();
    const slug = form.slug.trim();

    if (!title || !slug) {
      toast.error("Başlık ve slug alanları zorunludur.");
      return;
    }

    const displayOrderNum = Number(form.display_order);
    const payload = {
      title,
      slug,
      description: form.description.trim()
        ? form.description
        : null,
      locale: form.locale.trim() || undefined,
      is_active: form.is_active,
      display_order: Number.isFinite(displayOrderNum)
        ? displayOrderNum
        : undefined,
    };

    try {
      if (editing) {
        await updateFooterSection({
          id: editing.id,
          data: payload,
        }).unwrap();
        toast.success("Footer bölümü güncellendi.");
      } else {
        await createFooterSection(payload).unwrap();
        toast.success("Footer bölümü oluşturuldu.");
      }

      closeModal();
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Footer bölümü kaydedilirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleDelete = async (item: FooterSectionDto) => {
    const label = item.title || item.slug || item.id;
    if (
      !window.confirm(
        `"${label}" footer bölümünü silmek istediğinize emin misiniz?`,
      )
    ) {
      return;
    }

    try {
      await deleteFooterSection(item.id).unwrap();
      toast.success("Footer bölümü silindi.");
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Footer bölümü silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const quickToggleActive = async (item: FooterSectionDto, next: boolean) => {
    try {
      await updateFooterSection({
        id: item.id,
        data: { is_active: next },
      }).unwrap();
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Durum güncellenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header py-2 d-flex align-items-center justify-content-between">
          <span className="small fw-semibold">
            Footer Bölümleri / Link Alanları
          </span>
          <div className="d-flex align-items-center gap-2">
            {loading && (
              <span className="badge bg-secondary">Yükleniyor...</span>
            )}
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => refetch()}
              disabled={busy}
            >
              Yenile
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={openCreate}
              disabled={busy}
            >
              Yeni Footer Bölümü
            </button>
          </div>
        </div>

        <div className="card-body p-0">
          {/* Desktop / tablet */}
          <div className="d-none d-md-block">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th style={{ width: "25%" }}>Başlık</th>
                  <th style={{ width: "20%" }}>Slug</th>
                  <th style={{ width: "10%" }}>Sıra</th>
                  <th style={{ width: "10%" }}>Aktif</th>
                  <th style={{ width: "15%" }}>Dil (resolve)</th>
                  <th style={{ width: "15%" }}>Güncellenme</th>
                  <th style={{ width: "10%" }} className="text-end">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.length ? (
                  items.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="text-muted small align-middle">
                        {idx + 1}
                      </td>
                      <td className="align-middle">
                        <div className="fw-semibold small">
                          {item.title || <span className="text-muted">-</span>}
                        </div>
                      </td>
                      <td className="align-middle">
                        <code className="small">
                          {item.slug || <span className="text-muted">-</span>}
                        </code>
                      </td>
                      <td className="align-middle">
                        <span className="badge bg-light text-dark border small">
                          {item.display_order ?? 0}
                        </span>
                      </td>
                      <td className="align-middle">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={!!item.is_active}
                            onChange={(e) =>
                              quickToggleActive(item, e.target.checked)
                            }
                          />
                        </div>
                      </td>
                      <td className="align-middle">
                        {item.locale || (
                          <span className="text-muted small">-</span>
                        )}
                      </td>
                      <td className="align-middle">
                        <span className="text-muted small">
                          {item.updated_at
                            ? new Date(item.updated_at).toLocaleString()
                            : "-"}
                        </span>
                      </td>
                      <td className="align-middle text-end">
                        <div className="d-inline-flex gap-1">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => openEdit(item)}
                          >
                            Düzenle
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(item)}
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8}>
                      <div className="text-center text-muted small py-3">
                        Kayıt bulunamadı.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              <caption className="px-3 py-2 text-start">
                <span className="text-muted small">
                  Footer&apos;da gösterilen sütun / blok alanları buradan
                  yönetilir. Her kayıt, başlık + slug + isteğe bağlı açıklama
                  içerir. Çoklu dil için aynı slug ile farklı locale kayıtları
                  ekleyebilirsin.
                </span>
              </caption>
            </table>
          </div>

          {/* Mobil – card görünümü */}
          <div className="d-block d-md-none">
            {items.length ? (
              items.map((item, idx) => (
                <div key={item.id} className="border-bottom px-3 py-2">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div>
                      <div className="fw-semibold small">
                        #{idx + 1} – {item.title || <span className="text-muted">Adsız</span>}
                      </div>
                      <div className="text-muted small">
                        <code>{item.slug || "-"}</code>
                      </div>
                      <div className="text-muted small mt-1">
                        <span className="me-1">Sıra:</span>
                        <span>{item.display_order ?? 0}</span>
                        <span className="ms-2 me-1">Dil:</span>
                        {item.locale || <span className="text-muted">-</span>}
                      </div>
                      {item.description && (
                        <div className="text-muted small mt-1">
                          {item.description.length > 80
                            ? item.description.slice(0, 77) + "..."
                            : item.description}
                        </div>
                      )}
                      <div className="text-muted small mt-1">
                        <span className="me-1">Güncellenme:</span>
                        {item.updated_at
                          ? new Date(item.updated_at).toLocaleString()
                          : "-"}
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-1 align-items-end">
                      <div className="form-check form-switch small">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={!!item.is_active}
                          onChange={(e) =>
                            quickToggleActive(item, e.target.checked)
                          }
                        />
                        <label className="form-check-label">Aktif</label>
                      </div>
                      <div className="d-flex gap-1 mt-1">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => openEdit(item)}
                        >
                          Düzenle
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item)}
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-3 py-3 text-center text-muted small">
                Kayıt bulunamadı.
              </div>
            )}

            <div className="px-3 py-2 border-top">
              <span className="text-muted small">
                Mobil görünümde footer bölümleri kart olarak listelenir. Düzenle
                veya sil butonları ile işlemleri yapabilirsin.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Modal: Ekle / Düzenle ---------------- */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show" />
          <div className="modal d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header py-2">
                  <h5 className="modal-title small mb-0">
                    {editing ? "Footer Bölümü Düzenle" : "Yeni Footer Bölümü"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Kapat"
                    onClick={closeModal}
                    disabled={busy}
                  />
                </div>

                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small">Başlık</label>
                      <Input
                        value={form.title}
                        onChange={(e) =>
                          handleChange("title", e.target.value)
                        }
                        placeholder="Örn: Kurumsal, Ürünler, Destek..."
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">Slug</label>
                      <Input
                        value={form.slug}
                        onChange={(e) =>
                          handleChange("slug", e.target.value)
                        }
                        placeholder="ornek-slug"
                      />
                      <small className="text-muted">
                        Sadece küçük harf, rakam ve tire kullan. Örn:
                        <code> hakkimizda</code>, <code> destek</code>,
                        <code> urunler</code>.
                      </small>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small">Sıra</label>
                      <Input
                        value={form.display_order}
                        onChange={(e) =>
                          handleChange("display_order", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small">Dil (locale)</label>
                      <Input
                        value={form.locale}
                        onChange={(e) =>
                          handleChange("locale", e.target.value)
                        }
                        placeholder="tr / en / de ..."
                      />
                    </div>

                    <div className="col-md-4 d-flex align-items-end">
                      <div className="form-check">
                        <input
                          id="footer-active"
                          type="checkbox"
                          className="form-check-input"
                          checked={form.is_active}
                          onChange={handleToggleActive}
                        />
                        <label
                          htmlFor="footer-active"
                          className="form-check-label small"
                        >
                          Aktif
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label small">Açıklama</label>
                      <Textarea
                        rows={4}
                        value={form.description}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                        placeholder="İsteğe bağlı açıklama / HTML içermeyen metin."
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer py-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={closeModal}
                    disabled={busy}
                  >
                    İptal
                  </button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSave}
                    disabled={busy}
                  >
                    {busy
                      ? "Kaydediliyor..."
                      : editing
                      ? "Güncelle"
                      : "Oluştur"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
