// =============================================================
// FILE: src/components/admin/library/LibraryFilesSection.tsx
// Ensotek – Admin Library Files Section (Storage entegre)
//  - Mevcut dosyaları listeler
//  - PDF'i Storage'a upload eder
//  - StorageAsset.id ile library_files kaydı oluşturur
//  - NOT: Kendi içinde <form> KULLANMIYOR (nested form hatası yok)
// =============================================================

"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";

import type { LibraryFileDto } from "@/integrations/types/library.types";
import {
    useListLibraryFilesAdminQuery,
    useCreateLibraryFileAdminMutation,
    useRemoveLibraryFileAdminMutation,
} from "@/integrations/rtk/endpoints/admin/library_admin.endpoints";
import { useCreateAssetAdminMutation } from "@/integrations/rtk/endpoints/admin/storage_admin.endpoints";

export type LibraryFilesSectionProps = {
    libraryId: string;
    disabled: boolean;
};

export const LibraryFilesSection: React.FC<LibraryFilesSectionProps> = ({
    libraryId,
    disabled,
}) => {
    const {
        data: files,
        isLoading,
        isFetching,
        refetch,
    } = useListLibraryFilesAdminQuery(
        { id: libraryId },
        { skip: !libraryId },
    );

    const [createFile, { isLoading: isCreatingFile }] =
        useCreateLibraryFileAdminMutation();
    const [removeFile, { isLoading: isRemoving }] =
        useRemoveLibraryFileAdminMutation();

    const [createAsset, { isLoading: isUploadingAsset }] =
        useCreateAssetAdminMutation();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [overrideName, setOverrideName] = useState("");
    const [bucket, setBucket] = useState("public");
    const [folder, setFolder] = useState(`library/${libraryId}`);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const loading = isLoading || isFetching;
    const uploading = isUploadingAsset || isCreatingFile;

    const handleUpload = async () => {
        if (!libraryId) return;

        if (!selectedFile) {
            toast.error("Lütfen bir dosya seç.");
            return;
        }

        try {
            // 1) Storage'a upload
            const storage = await createAsset({
                file: selectedFile,
                bucket,
                folder: folder || undefined,
                metadata: {
                    module_key: "library",
                    library_id: libraryId,
                    original_name: selectedFile.name,
                    mime: selectedFile.type || "application/octet-stream",
                },
            }).unwrap();

            // 2) library_files kaydı oluştur
            const displayName = overrideName.trim() || selectedFile.name;

            await createFile({
                id: libraryId,
                payload: {
                    asset_id: storage.id,
                    name: displayName,
                    file_url: storage.url ?? null,
                    size_bytes: storage.size ?? undefined,
                    mime_type: storage.mime ?? selectedFile.type ?? undefined,
                    // tags: ["pdf", "brochure"],
                },
            }).unwrap();

            toast.success("Dosya yüklendi ve kaydedildi.");

            // state reset
            setSelectedFile(null);
            setOverrideName("");

            // file input’u temizle
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            await refetch();
        } catch (err: any) {
            const msg =
                err?.data?.error?.message ||
                err?.message ||
                "PDF yüklenirken veya library_files kaydedilirken hata oluştu.";
            toast.error(msg);
        }
    };

    const handleRemove = async (file: LibraryFileDto) => {
        if (!libraryId || !file.id) return;
        if (!confirm(`"${file.name}" dosyasını silmek istiyor musun?`)) return;

        try {
            await removeFile({ id: libraryId, fileId: file.id }).unwrap();
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

    return (
        <div className="card h-100">
            <div className="card-header py-2">
                <div className="d-flex justify-content-between align-items-center">
                    <span className="small fw-semibold">
                        PDF / Dosyalar (library_files)
                    </span>
                    {loading && (
                        <span className="spinner-border spinner-border-sm" />
                    )}
                </div>
            </div>

            <div className="card-body">
                {/* Liste */}
                {(!files || files.length === 0) && !loading && (
                    <div className="text-muted small mb-3">
                        Henüz dosya eklenmemiş.
                    </div>
                )}

                {files && files.length > 0 && (
                    <ul className="list-group list-group-flush mb-3">
                        {files.map((f) => (
                            <li
                                key={f.id}
                                className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center small"
                            >
                                <div className="me-2">
                                    <div className="fw-semibold">
                                        {f.url ? (
                                            <a
                                                href={f.url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {f.name}
                                            </a>
                                        ) : (
                                            f.name
                                        )}
                                    </div>
                                    <div className="text-muted">
                                        {f.mime_type || "mime yok"}
                                        {typeof f.size_bytes === "number" &&
                                            f.size_bytes > 0 && (
                                                <>
                                                    {" "}
                                                    • {(f.size_bytes / 1024).toFixed(1)} KB
                                                </>
                                            )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    disabled={disabled || isRemoving}
                                    onClick={() => handleRemove(f)}
                                >
                                    Sil
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <hr className="my-2" />

                {/* Upload “formu” – ama gerçek form değil, div */}
                <div className="small">
                    <div className="mb-2">
                        <label className="form-label small mb-1">
                            PDF / Dosya Seç
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="form-control form-control-sm"
                            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip"
                            onChange={(e) =>
                                setSelectedFile(e.target.files?.[0] ?? null)
                            }
                            disabled={disabled || uploading}
                        />
                        <div className="form-text small">
                            Dosya önce Storage modülüne yüklenir, ardından{" "}
                            <code>library_files</code> tablosuna asset id ile kaydedilir.
                        </div>
                    </div>

                    <div className="mb-2">
                        <label className="form-label small mb-1">
                            Görünen Dosya Adı (name)
                        </label>
                        <input
                            className="form-control form-control-sm"
                            value={overrideName}
                            onChange={(e) => setOverrideName(e.target.value)}
                            disabled={disabled || uploading}
                            placeholder="Boş bırakılırsa dosya adı kullanılır (örn: brosur.pdf)"
                        />
                    </div>

                    <div className="row g-2 mb-2">
                        <div className="col-6">
                            <label className="form-label small mb-1">
                                Bucket
                            </label>
                            <input
                                className="form-control form-control-sm"
                                value={bucket}
                                onChange={(e) => setBucket(e.target.value)}
                                disabled={disabled || uploading}
                            />
                            <div className="form-text small">
                                Örn: <code>public</code>, <code>docs</code> vb.
                            </div>
                        </div>
                        <div className="col-6">
                            <label className="form-label small mb-1">
                                Folder
                            </label>
                            <input
                                className="form-control form-control-sm"
                                value={folder}
                                onChange={(e) => setFolder(e.target.value)}
                                disabled={disabled || uploading}
                            />
                            <div className="form-text small">
                                Örn: <code>library/{libraryId}</code>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        disabled={disabled || uploading}
                        onClick={handleUpload}
                    >
                        {uploading ? "Yükleniyor..." : "Yükle ve Kaydet"}
                    </button>
                </div>
            </div>
        </div>
    );
};
