"use client";

import type React from "react";
import { useMemo, useRef, useState } from "react";

import { ExternalLink, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateAssetAdminMutation,
  useCreateLibraryFileAdminMutation,
  useListLibraryFilesAdminQuery,
  useRemoveLibraryFileAdminMutation,
} from "@/integrations/hooks";
import type { LibraryFileDto } from "@/integrations/shared";

export type LibraryFilesSectionProps = {
  libraryId: string;
  locale?: string;
  disabled?: boolean;
};

const safeText = (v: unknown) => (v === null || v === undefined ? "" : String(v));
const norm = (v: unknown) => String(v ?? "").trim();

function normalizeLocale(raw?: string, fallback = "tr") {
  const s = String(raw ?? "").trim();
  if (!s) return fallback;
  const [short] = s.split("-");
  return (short || fallback).toLowerCase();
}

function extractErrMsg(err: any): string {
  const data = err?.data;
  return data?.error?.message || data?.message || err?.error || err?.message || "İşlem sırasında hata oluştu.";
}

export const LibraryFilesSection: React.FC<LibraryFilesSectionProps> = ({ libraryId, locale, disabled = false }) => {
  const effectiveLocale = useMemo(() => normalizeLocale(locale, "tr"), [locale]);

  const {
    data: files,
    isLoading,
    isFetching,
    refetch,
  } = useListLibraryFilesAdminQuery({ id: libraryId, locale: effectiveLocale }, { skip: !libraryId });

  const [createFile, { isLoading: isCreatingFile }] = useCreateLibraryFileAdminMutation();
  const [removeFile, { isLoading: isRemoving }] = useRemoveLibraryFileAdminMutation();
  const [createAsset, { isLoading: isUploadingAsset }] = useCreateAssetAdminMutation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [overrideName, setOverrideName] = useState("");
  const [bucket, setBucket] = useState("public");
  const [folder, setFolder] = useState("uploads/catalog");

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
      const storage = await createAsset({
        file: selectedFile,
        bucket,
        folder: folder || undefined,
        metadata: {
          module_key: "library",
          library_id: libraryId,
          original_name: selectedFile.name,
          mime: selectedFile.type || "application/octet-stream",
          locale: effectiveLocale,
        },
      } as any).unwrap();

      const storageId = norm((storage as any)?.id);
      const storageUrl = norm((storage as any)?.url);
      const storageMime = norm((storage as any)?.mime) || norm(selectedFile.type) || "application/octet-stream";
      const storageSize = (storage as any)?.size;

      if (!storageId) throw new Error("Upload başarılı ama asset_id alınamadı.");
      if (!storageUrl) throw new Error("Upload başarılı ama public url alınamadı.");

      const displayName = overrideName.trim() || selectedFile.name;

      await createFile({
        id: libraryId,
        locale: effectiveLocale,
        payload: {
          asset_id: storageId,
          name: displayName,
          file_url: storageUrl,
          size_bytes: typeof storageSize === "number" ? storageSize : null,
          mime_type: storageMime || null,
        },
      } as any).unwrap();

      toast.success("Dosya yüklendi ve kaydedildi.");

      setSelectedFile(null);
      setOverrideName("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      void refetch();
    } catch (err: any) {
      toast.error(extractErrMsg(err));
    }
  };

  const handleRemove = async (file: LibraryFileDto) => {
    const fileId = norm((file as any)?.id);
    if (!libraryId || !fileId) return;

    if (!confirm(`"${safeText((file as any).name)}" dosyasını silmek istiyor musun?`)) return;

    try {
      await removeFile({ id: libraryId, fileId, locale: effectiveLocale } as any).unwrap();
      toast.success("Dosya silindi.");
    } catch (err: any) {
      const status = err?.status ?? err?.originalStatus;
      if (status === 404) toast.success("Dosya zaten silinmiş.");
      else toast.error(extractErrMsg(err));
    } finally {
      void refetch();
    }
  };

  const list = (files || []) as LibraryFileDto[];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/30 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-semibold text-sm">
            <FileText className="h-4 w-4 text-primary" />
            PDF / Dosyalar
          </CardTitle>
          {loading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {list.length === 0 && !loading && (
          <div className="rounded-lg border-2 border-dashed bg-muted/10 py-6 text-center text-muted-foreground text-xs italic">
            Henüz dosya eklenmemiş.
          </div>
        )}

        {list.length > 0 && (
          <div className="space-y-2">
            {list.map((f) => {
              const href = norm((f as any)?.file_url);
              const label = safeText((f as any)?.name) || "Dosya";

              return (
                <div
                  key={(f as any)?.id || `${label}-${href}`}
                  className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3 text-xs transition-all hover:shadow-sm"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 truncate font-medium" title={label}>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          {label}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        label
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 truncate text-[10px] text-muted-foreground">
                      <span className="rounded bg-muted px-1.5 py-0.5 uppercase tracking-tighter">
                        {(f as any)?.mime_type?.split("/")?.pop() || "file"}
                      </span>
                      {typeof (f as any)?.size_bytes === "number" && (f as any).size_bytes > 0 && (
                        <span>• {(((f as any).size_bytes as number) / 1024).toFixed(1)} KB</span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10"
                    disabled={disabled || isRemoving}
                    onClick={() => handleRemove(f)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <div className="space-y-3 border-t pt-4">
          <div className="grid gap-3 rounded-lg border bg-muted/20 p-4">
            <div className="space-y-1.5">
              <Label className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
                PDF / Dosya Seç
              </Label>
              <Input
                ref={fileInputRef}
                type="file"
                className="h-9 cursor-pointer bg-background text-xs"
                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                disabled={disabled || uploading}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Görünen Ad</Label>
              <Input
                className="h-9 bg-background text-xs"
                value={overrideName}
                onChange={(e) => setOverrideName(e.target.value)}
                disabled={disabled || uploading}
                placeholder="Boş bırakılırsa dosya adı kullanılır"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Bucket</Label>
                <Input
                  className="h-9 bg-background text-xs"
                  value={bucket}
                  onChange={(e) => setBucket(e.target.value)}
                  disabled={disabled || uploading}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Folder</Label>
                <Input
                  className="h-9 bg-background text-xs"
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  disabled={disabled || uploading}
                />
              </div>
            </div>

            <Button
              className="mt-1 h-9 w-full text-xs"
              disabled={disabled || uploading || !selectedFile}
              onClick={handleUpload}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Yükleniyor...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-3 w-3" />
                  Yükle ve Kaydet
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
