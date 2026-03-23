"use client";

import type React from "react";
import { useCallback, useMemo, useRef, useState } from "react";

import { CheckCircle2, Copy, Image as ImageIcon, Loader2, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminImageUploadField } from "@/app/(main)/admin/_components/common/AdminImageUploadField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLibraryImageAdminMutation,
  useListLibraryImagesAdminQuery,
  useRemoveLibraryImageAdminMutation,
  useUpdateLibraryImageAdminMutation,
} from "@/integrations/hooks";
import type { LibraryImageCreatePayload, LibraryImageDto, LibraryImageUpdatePayload } from "@/integrations/shared";

export type LibraryImagesSectionProps = {
  libraryId: string;
  locale: string;
  disabled?: boolean;
  onSelectAsCover?: (url: string) => void;
  coverUrl?: string;
  metadata?: Record<string, string | number | boolean>;
};

const toStr = (v: unknown) => (v === null || v === undefined ? "" : String(v));

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8086";

function resolveUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads") || url.startsWith("/storage")) {
    // Frontend rewrite works for /uploads and /storage
    // but we can also use absolute for reliability in preview
    return url;
  }
  return url;
}

function normalizeRows(data: any): LibraryImageDto[] {
  if (Array.isArray(data)) return data as LibraryImageDto[];
  if (Array.isArray(data?.items)) return data.items as LibraryImageDto[];
  if (Array.isArray(data?.data)) return data.data as LibraryImageDto[];
  if (Array.isArray(data?.rows)) return data.rows as LibraryImageDto[];
  return [];
}

function orderOf(r: any): number {
  const n = Number(r?.display_order);
  return Number.isFinite(n) ? n : 0;
}

function imageIdOf(r: any): string {
  const v = r?.id ?? r?.image_id ?? r?.imageId ?? r?.imageID;
  return v ? String(v) : "";
}

const UrlInline: React.FC<{ url: string; disabled?: boolean }> = ({ url, disabled }) => {
  const safe = (url || "").trim();

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!safe) return;

    try {
      await navigator.clipboard.writeText(safe);
      toast.success("URL kopyalandı.");
    } catch {
      toast.error("URL kopyalanamadı.");
    }
  };

  return (
    <div className="mt-1 flex min-w-0 items-center gap-2">
      <div className="flex-1 truncate text-[10px] text-muted-foreground" title={safe}>
        {safe}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 shrink-0"
        onClick={handleCopy}
        disabled={disabled || !safe}
        title="URL'i kopyala"
      >
        <Copy className="h-3 w-3" />
      </Button>
    </div>
  );
};

export const LibraryImagesSection: React.FC<LibraryImagesSectionProps> = ({
  libraryId,
  locale,
  disabled,
  onSelectAsCover,
  coverUrl,
  metadata,
}) => {
  const { data, isLoading, isFetching, refetch } = useListLibraryImagesAdminQuery({ id: libraryId, locale } as any, {
    skip: !libraryId,
  });

  const [createImg, { isLoading: creating }] = useCreateLibraryImageAdminMutation();
  const [updateImg, { isLoading: updating }] = useUpdateLibraryImageAdminMutation();
  const [removeImg, { isLoading: deleting }] = useRemoveLibraryImageAdminMutation();

  const busy = !!disabled || creating || updating || deleting;
  const rows: LibraryImageDto[] = useMemo(() => normalizeRows(data), [data]);
  const inflightUrlsRef = useRef<Set<string>>(new Set());
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string>("");

  const sortedRows = useMemo(() => {
    return rows.slice().sort((a: any, b: any) => orderOf(a) - orderOf(b) || String(a.id).localeCompare(String(b.id)));
  }, [rows]);

  const getNextOrder = () => {
    const maxOrder = rows.reduce((m, r: any) => Math.max(m, orderOf(r)), 0);
    return maxOrder + 10;
  };

  const createLibraryImageFromUrl = async (url: string) => {
    const safeUrl = url.trim();
    if (!safeUrl) return;

    const exists = rows.some((r: any) => (r.image_url || "").trim() === safeUrl);
    if (exists) return;

    if (inflightUrlsRef.current.has(safeUrl)) return;
    inflightUrlsRef.current.add(safeUrl);

    try {
      const payload: LibraryImageCreatePayload = {
        image_url: safeUrl,
        image_asset_id: null,
        is_active: true,
        display_order: getNextOrder(),
        locale,
        title: null,
        alt: null,
        caption: null,
      };

      await createImg({ id: libraryId, payload } as any).unwrap();
      toast.success("Galeri görseli eklendi.");
      await refetch();
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || "Resim kaydı oluşturulamadı.");
    } finally {
      inflightUrlsRef.current.delete(safeUrl);
    }
  };

  const handleUploadedUrl = async (url: string) => {
    setLastUploadedUrl(url);
    await createLibraryImageFromUrl(url);
  };

  const handleSetOrder = useCallback(
    async (r: LibraryImageDto, display_order: number) => {
      const imageId = imageIdOf(r);
      if (!imageId) return;

      try {
        const patch: LibraryImageUpdatePayload = { display_order, locale };
        await updateImg({ id: libraryId, imageId, patch } as any).unwrap();
        toast.success("Sıralama güncellendi.");
        await refetch();
      } catch (err: any) {
        toast.error(err?.data?.error?.message || err?.message || "Sıralama güncellenemedi.");
      }
    },
    [libraryId, locale, updateImg, refetch],
  );

  const handleDelete = useCallback(
    async (r: LibraryImageDto) => {
      const imageId = imageIdOf(r);
      if (!imageId) return;
      if (!confirm("Bu görseli silmek istiyor musun?")) return;

      try {
        await removeImg({ id: libraryId, imageId } as any).unwrap();
        toast.success("Görsel silindi.");
        await refetch();
      } catch (err: any) {
        toast.error(err?.data?.error?.message || err?.message || "Silme hatası.");
      }
    },
    [libraryId, removeImg, refetch],
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/30 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-semibold text-sm">
            <ImageIcon className="h-4 w-4 text-primary" />
            Galeri Görselleri
          </CardTitle>
          {(isLoading || isFetching) && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div className="rounded-lg border bg-muted/20 p-4">
          <AdminImageUploadField
            label="Yeni görsel yükle"
            bucket="public"
            folder="library/gallery"
            metadata={metadata}
            multiple
            value={lastUploadedUrl}
            onChange={handleUploadedUrl}
            disabled={busy}
          />
        </div>

        {sortedRows.length > 0 && (
          <div className="space-y-3">
            {sortedRows.map((r: any) => {
              const id = imageIdOf(r);
              const url = (r.image_url || "").trim();
              const isCover = !!coverUrl && coverUrl === url;
              const resolved = resolveUrl(url);

              return (
                <div
                  key={id || String(url)}
                  className={`group relative rounded-lg border p-3 transition-all hover:shadow-sm ${
                    isCover ? "border-primary bg-primary/5 ring-1 ring-primary/10" : "bg-card"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="group/img relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-white">
                      <img
                        src={resolved}
                        alt={toStr(r.alt)}
                        className="h-full w-full object-cover transition-transform group-hover/img:scale-105"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          if (!img.dataset.triedFallback) {
                            img.dataset.triedFallback = "1";
                            // If relative fails, try absolute backend URL directly
                            if (url.startsWith("/")) {
                              img.src = `${API_BASE}${url}`;
                              return;
                            }
                          }
                          img.src = "https://placehold.co/100x100?text=Error";
                        }}
                      />
                      {isCover && (
                        <div className="absolute top-0 right-0 p-1">
                          <div className="rounded-full bg-primary p-0.5 text-primary-foreground shadow-sm">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                              #{orderOf(r)}
                            </span>
                            {isCover && (
                              <span className="font-bold text-[10px] text-primary uppercase tracking-wider">
                                Kapak Görseli
                              </span>
                            )}
                          </div>
                          <UrlInline url={url} disabled={busy} />
                        </div>

                        <div className="flex shrink-0 gap-1">
                          {onSelectAsCover && url && !isCover && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-[10px] transition-colors hover:bg-primary hover:text-primary-foreground"
                              disabled={busy}
                              onClick={() => onSelectAsCover(url)}
                            >
                              <Star className="mr-1 h-3 w-3" /> Kapak Yap
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            disabled={busy}
                            onClick={() => handleDelete(r)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-3 border-t border-dashed pt-2">
                        <Label className="font-medium text-[10px] text-muted-foreground uppercase tracking-tight">
                          Görüntüleme Sırası:
                        </Label>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            className="h-7 w-16 text-center text-[10px]"
                            disabled={busy}
                            defaultValue={orderOf(r)}
                            onBlur={(e) => {
                              const val = Number(e.target.value) || 0;
                              if (val !== orderOf(r)) handleSetOrder(r, val);
                            }}
                          />
                        </div>
                        {isCover && <div className="ml-auto text-[10px] text-primary italic">Kapak olarak aktif</div>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {sortedRows.length === 0 && !isLoading && (
          <div className="rounded-lg border-2 border-dashed bg-muted/10 py-8 text-center text-muted-foreground text-xs italic">
            Galeri görseli bulunmuyor.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
