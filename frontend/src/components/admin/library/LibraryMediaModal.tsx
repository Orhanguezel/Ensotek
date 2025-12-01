// =============================================================
// FILE: src/components/admin/library/LibraryMediaModal.tsx
// Ensotek – Library Medya Modal (Images + Files tabları)
// =============================================================

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

import type {
  LibraryDto,
  LibraryImageDto,
  LibraryFileDto,
} from "@/integrations/types/library.types";

import {
  useListLibraryImagesAdminQuery,
  useCreateLibraryImageAdminMutation,
  useUpdateLibraryImageAdminMutation,
  useRemoveLibraryImageAdminMutation,
  useListLibraryFilesAdminQuery,
  useCreateLibraryFileAdminMutation,
  useUpdateLibraryFileAdminMutation,
  useRemoveLibraryFileAdminMutation,
} from "@/integrations/rtk/endpoints/admin/library_admin.endpoints";

/* Küçük yardımcılar */

const boolLabel = (v: unknown) =>
  v === true || v === 1 || v === "1" ? "Evet" : "Hayır";

const isTruthy = (v: unknown): boolean =>
  v === true || v === 1 || v === "1";

const toNumberOrNull = (v: string): number | null => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export type LibraryMediaModalProps = {
  open: boolean;
  onClose: () => void;
  library: LibraryDto | null;
};

/**
 * Library kaydına bağlı görseller + dosyalar yönetimi
 */
export const LibraryMediaModal: React.FC<LibraryMediaModalProps> = ({
  open,
  onClose,
  library,
}) => {
  const [activeTab, setActiveTab] = useState<"images" | "files">("images");

  const libraryId = library?.id ?? "";

  const title = useMemo(() => {
    if (!library) return "";
    return library.title || library.slug || library.id;
  }, [library]);

  // Modal kapalıysa hiç render etme (RTK query tetiklenmesin)
  if (!open || !library || !libraryId) return null;

  return (
    <>
      <div className="modal-backdrop fade show" />

      <div
        className="modal d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header py-2">
              <div>
                <h5 className="modal-title small mb-1">
                  Library Medya Yönetimi
                </h5>
                <div className="text-muted small">
                  <span className="fw-semibold me-1">İçerik:</span>
                  {title}
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label="Kapat"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              {/* Tab header */}
              <ul className="nav nav-tabs small mb-3">
                <li className="nav-item">
                  <button
                    type="button"
                    className={
                      "nav-link py-1 px-2 " +
                      (activeTab === "images" ? "active" : "")
                    }
                    onClick={() => setActiveTab("images")}
                  >
                    Görseller
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={
                      "nav-link py-1 px-2 " +
                      (activeTab === "files" ? "active" : "")
                    }
                    onClick={() => setActiveTab("files")}
                  >
                    Dosyalar
                  </button>
                </li>
              </ul>

              {/* Tab content */}
              {activeTab === "images" ? (
                <ImagesTab libraryId={libraryId} />
              ) : (
                <FilesTab libraryId={libraryId} />
              )}
            </div>

            <div className="modal-footer py-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={onClose}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ============================================================= */
/* IMAGES TAB                                                    */
/* ============================================================= */

type ImagesTabProps = {
  libraryId: string;
};

const ImagesTab: React.FC<ImagesTabProps> = ({ libraryId }) => {
  const {
    data: images,
    isLoading,
    isFetching,
    refetch,
  } = useListLibraryImagesAdminQuery(libraryId);

  const [createImage, { isLoading: isCreating }] =
    useCreateLibraryImageAdminMutation();
  const [updateImage, { isLoading: isUpdating }] =
    useUpdateLibraryImageAdminMutation();
  const [removeImage, { isLoading: isDeleting }] =
    useRemoveLibraryImageAdminMutation();

  const busy = isLoading || isFetching || isCreating || isUpdating || isDeleting;

  /* Yeni görsel form state */

  const [assetId, setAssetId] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [displayOrder, setDisplayOrder] = useState<string>("0");
  const [isActive, setIsActive] = useState(true);

  const handleCreate = async () => {
    if (!assetId.trim()) {
      toast.error("Önce asset_id alanını doldurmalısın.");
      return;
    }

    try {
      await createImage({
        id: libraryId,
        payload: {
          asset_id: assetId.trim(),
          alt: alt.trim() || null,
          caption: caption.trim() || null,
          display_order: toNumberOrNull(displayOrder) ?? 0,
          is_active: isActive,
          // image_url/thumb_url/webp_url istersen buraya ekleyebilirsin
          // locale / replicate_all_locales backend defaultlarına bırakılıyor
        },
      }).unwrap();

      setAssetId("");
      setAlt("");
      setCaption("");
      setDisplayOrder("0");
      setIsActive(true);

      toast.success("Görsel eklendi.");
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Görsel eklenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleActive = async (image: LibraryImageDto, value: boolean) => {
    try {
      await updateImage({
        id: libraryId,
        imageId: image.id,
        patch: {
          is_active: value,
        },
      }).unwrap();
      // refetch arkaplanda
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Durum güncellenirken hata oluştu.";
      toast.error(msg);
    }
  };

  const handleOrderChange = async (
    image: LibraryImageDto,
    value: string,
  ) => {
    const n = toNumberOrNull(value);
    if (n === null) return;
    try {
      await updateImage({
        id: libraryId,
        imageId: image.id,
        patch: {
          display_order: n,
        },
      }).unwrap();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Sıralama güncellenirken hata oluştu.";
      toast.error(msg);
    }
  };

  const handleDelete = async (image: LibraryImageDto) => {
    if (
      !window.confirm(
        `Bu görseli silmek üzeresin. Devam etmek istiyor musun?\n\nID: ${image.id}`,
      )
    ) {
      return;
    }
    try {
      await removeImage({
        id: libraryId,
        imageId: image.id,
      }).unwrap();
      toast.success("Görsel silindi.");
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Görsel silinirken hata oluştu.";
      toast.error(msg);
    }
  };

  const rows = images || [];

  return (
    <div className="d-flex flex-column gap-3">
      {/* Yeni görsel formu */}
      <div className="border rounded p-2 bg-light">
        <div className="small fw-semibold mb-2">Yeni Görsel Ekle</div>

        <div className="row g-2 align-items-end">
          <div className="col-md-4">
            <label className="form-label small">
              Asset ID <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              placeholder="storage_assets.id"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label small">Alt (opsiyonel)</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label small">Caption (opsiyonel)</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <div className="col-md-1">
            <label className="form-label small">Sıra</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
            />
          </div>

          <div className="col-md-1 d-flex flex-column align-items-start">
            <div className="form-check form-switch mt-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                id="new-image-active"
              />
              <label
                className="form-check-label small"
                htmlFor="new-image-active"
              >
                Aktif
              </label>
            </div>
          </div>

          <div className="col-12 col-md-auto ms-auto">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleCreate}
              disabled={busy}
            >
              {busy ? "Ekle..." : "Görsel Ekle"}
            </button>
          </div>
        </div>
      </div>

      {/* Liste */}
      <div className="border rounded">
        <div className="d-flex justify-content-between align-items-center px-2 py-1 border-bottom">
          <span className="small fw-semibold">Görseller</span>
          {busy && (
            <span className="badge bg-secondary small">Yükleniyor...</span>
          )}
        </div>

        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle mb-0">
            <thead className="small">
              <tr>
                <th style={{ width: "6%" }}>Sıra</th>
                <th style={{ width: "8%" }}>Önizleme</th>
                <th>Alt / Caption</th>
                <th style={{ width: "20%" }}>Asset</th>
                <th style={{ width: "12%" }}>Durum</th>
                <th style={{ width: "10%" }} className="text-end">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((img) => {
                  const url =
                    (img as any).thumbnail ||
                    (img as any).url ||
                    (img as any).webp ||
                    null;
                  const assetInfo = img.asset as any;
                  return (
                    <tr key={img.id}>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          defaultValue={img.display_order ?? 0}
                          onBlur={(e) =>
                            handleOrderChange(img, e.target.value)
                          }
                        />
                      </td>
                      <td>
                        {url ? (
                          <Image
                            src={url}
                            alt={img.alt ?? ""}
                            style={{
                              width: 60,
                              height: 40,
                              objectFit: "cover",
                              borderRadius: 4,
                            }}
                          />
                        ) : (
                          <span className="text-muted small">Yok</span>
                        )}
                      </td>
                      <td className="small">
                        <div>
                          <span className="text-muted me-1">Alt:</span>
                          {img.alt || <span className="text-muted">-</span>}
                        </div>
                        <div>
                          <span className="text-muted me-1">Caption:</span>
                          {img.caption || <span className="text-muted">-</span>}
                        </div>
                      </td>
                      <td className="small">
                        <div>
                          <span className="text-muted me-1">Asset:</span>
                          <code>{img.asset_id}</code>
                        </div>
                        {assetInfo && (
                          <div className="text-muted">
                            <div>
                              {assetInfo.width}x{assetInfo.height}{" "}
                              {assetInfo.mime}
                            </div>
                            <div
                              className="text-truncate"
                              style={{ maxWidth: 200 }}
                            >
                              {assetInfo.path}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="small">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={isTruthy(img.is_active)}
                            onChange={(e) =>
                              handleToggleActive(img, e.target.checked)
                            }
                            id={`img-active-${img.id}`}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`img-active-${img.id}`}
                          >
                            {boolLabel(img.is_active)}
                          </label>
                        </div>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(img)}
                          disabled={busy}
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="text-center text-muted small py-3">
                      Bu içerik için kayıtlı görsel bulunamadı.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ============================================================= */
/* FILES TAB                                                     */
/* ============================================================= */

type FilesTabProps = {
  libraryId: string;
};

const FilesTab: React.FC<FilesTabProps> = ({ libraryId }) => {
  const {
    data: files,
    isLoading,
    isFetching,
    refetch,
  } = useListLibraryFilesAdminQuery(libraryId);

  const [createFile, { isLoading: isCreating }] =
    useCreateLibraryFileAdminMutation();
  const [updateFile, { isLoading: isUpdating }] =
    useUpdateLibraryFileAdminMutation();
  const [removeFile, { isLoading: isDeleting }] =
    useRemoveLibraryFileAdminMutation();

  const busy = isLoading || isFetching || isCreating || isUpdating || isDeleting;

  /* Yeni dosya form state */

  const [assetId, setAssetId] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [name, setName] = useState("");
  const [sizeBytes, setSizeBytes] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [displayOrder, setDisplayOrder] = useState<string>("0");
  const [isActive, setIsActive] = useState(true);

  const handleCreate = async () => {
    if (!assetId.trim()) {
      toast.error("Önce asset_id alanını doldurmalısın.");
      return;
    }
    if (!name.trim()) {
      toast.error("Dosya adı (name) zorunludur.");
      return;
    }

    try {
      await createFile({
        id: libraryId,
        payload: {
          asset_id: assetId.trim(),
          file_url: fileUrl.trim() || null,
          name: name.trim(),
          size_bytes: toNumberOrNull(sizeBytes),
          mime_type: mimeType.trim() || null,
          display_order: toNumberOrNull(displayOrder) ?? 0,
          is_active: isActive,
        },
      }).unwrap();

      setAssetId("");
      setFileUrl("");
      setName("");
      setSizeBytes("");
      setMimeType("");
      setDisplayOrder("0");
      setIsActive(true);

      toast.success("Dosya eklendi.");
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Dosya eklenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleActive = async (file: LibraryFileDto, value: boolean) => {
    try {
      await updateFile({
        id: libraryId,
        fileId: file.id,
        patch: {
          is_active: value,
        },
      }).unwrap();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Durum güncellenirken hata oluştu.";
      toast.error(msg);
    }
  };

  const handleOrderChange = async (file: LibraryFileDto, value: string) => {
    const n = toNumberOrNull(value);
    if (n === null) return;
    try {
      await updateFile({
        id: libraryId,
        fileId: file.id,
        patch: {
          display_order: n,
        },
      }).unwrap();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Sıralama güncellenirken hata oluştu.";
      toast.error(msg);
    }
  };

  const handleDelete = async (file: LibraryFileDto) => {
    if (
      !window.confirm(
        `Bu dosyayı silmek üzeresin. Devam etmek istiyor musun?\n\nID: ${file.id}`,
      )
    ) {
      return;
    }
    try {
      await removeFile({
        id: libraryId,
        fileId: file.id,
      }).unwrap();
      toast.success("Dosya silindi.");
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Dosya silinirken hata oluştu.";
      toast.error(msg);
    }
  };

  const rows = files || [];

  return (
    <div className="d-flex flex-column gap-3">
      {/* Yeni dosya formu */}
      <div className="border rounded p-2 bg-light">
        <div className="small fw-semibold mb-2">Yeni Dosya Ekle</div>

        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <label className="form-label small">
              Asset ID <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              placeholder="storage_assets.id"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label small">
              Dosya Adı (name) <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="dokuman.pdf"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label small">Dosya URL (opsiyonel)</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="Sanal / public URL"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label small">
              Boyut (bytes, opsiyonel)
            </label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={sizeBytes}
              onChange={(e) => setSizeBytes(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label small">MIME Type (opsiyonel)</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={mimeType}
              onChange={(e) => setMimeType(e.target.value)}
              placeholder="application/pdf"
            />
          </div>

          <div className="col-md-2">
            <label className="form-label small">Sıra</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
            />
          </div>

          <div className="col-md-2 d-flex flex-column align-items-start">
            <div className="form-check form-switch mt-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                id="new-file-active"
              />
              <label
                className="form-check-label small"
                htmlFor="new-file-active"
              >
                Aktif
              </label>
            </div>
          </div>

          <div className="col-12 col-md-auto ms-auto">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleCreate}
              disabled={busy}
            >
              {busy ? "Ekle..." : "Dosya Ekle"}
            </button>
          </div>
        </div>
      </div>

      {/* Liste */}
      <div className="border rounded">
        <div className="d-flex justify-content-between align-items-center px-2 py-1 border-bottom">
          <span className="small fw-semibold">Dosyalar</span>
          {busy && (
            <span className="badge bg-secondary small">Yükleniyor...</span>
          )}
        </div>

        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle mb-0">
            <thead className="small">
              <tr>
                <th style={{ width: "6%" }}>Sıra</th>
                <th>Ad / URL</th>
                <th style={{ width: "25%" }}>Asset</th>
                <th style={{ width: "15%" }}>Boyut / Tip</th>
                <th style={{ width: "12%" }}>Durum</th>
                <th style={{ width: "10%" }} className="text-end">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        defaultValue={f.display_order ?? 0}
                        onBlur={(e) => handleOrderChange(f, e.target.value)}
                      />
                    </td>
                    <td className="small">
                      <div className="fw-semibold">{f.name}</div>
                      <div
                        className="text-muted text-truncate"
                        style={{ maxWidth: 260 }}
                      >
                        {f.url || <span className="text-muted">URL yok</span>}
                      </div>
                    </td>
                    <td className="small">
                      <div>
                        <span className="text-muted me-1">Asset:</span>
                        <code>{f.asset_id}</code>
                      </div>
                      {f.asset && (
                        <div
                          className="text-muted text-truncate"
                          style={{ maxWidth: 260 }}
                        >
                          {f.asset.path}
                        </div>
                      )}
                    </td>
                    <td className="small">
                      <div>
                        <span className="text-muted me-1">Boyut:</span>
                        {typeof f.size_bytes === "number"
                          ? `${f.size_bytes} B`
                          : "-"}
                      </div>
                      <div>
                        <span className="text-muted me-1">MIME:</span>
                        {f.mime_type || f.asset?.mime || "-"}
                      </div>
                    </td>
                    <td className="small">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={isTruthy(f.is_active)}
                          onChange={(e) =>
                            handleToggleActive(f, e.target.checked)
                          }
                          id={`file-active-${f.id}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`file-active-${f.id}`}
                        >
                          {boolLabel(f.is_active)}
                        </label>
                      </div>
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(f)}
                        disabled={busy}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="text-center text-muted small py-3">
                      Bu içerik için kayıtlı dosya bulunamadı.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
