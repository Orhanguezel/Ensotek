"use client";

// =============================================================
// FILE: src/app/(main)/admin/(admin)/custompage/_components/CustomPageList.tsx
// FINAL — List + optional reorder controls (up/down + save)
// - Bootstrap yok, inline style yok
// - Table (>=1700) + Cards (mobile) korunur
// - enableMoveControls: Up/Down butonları göster
// =============================================================

import type React from "react";
import { useMemo } from "react";

import Link from "next/link";

import { ArrowDown, ArrowUp, Pencil, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { Button } from "@/components/ui/button";
import { useDeleteCustomPageAdminMutation, useUpdateCustomPageAdminMutation } from "@/integrations/hooks";
import type { CustomPageDto } from "@/integrations/shared";

export type CustomPageListProps = {
  items?: CustomPageDto[];
  loading: boolean;

  // Save order
  onSaveOrder?: () => void;
  savingOrder?: boolean;

  // Up/Down reorder controls
  enableMoveControls?: boolean;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;

  activeLocale?: string;
};

const _VERY_LARGE_BP = 1700;

const formatDate = (value: string | null | undefined): string => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}.${mm}.${yy}`;
};

const normLocale = (v: unknown): string =>
  String(v || "")
    .trim()
    .toLowerCase()
    .replace("_", "-")
    .split("-")[0]
    .trim();

const safeText = (v: unknown) => (v === null || v === undefined ? "" : String(v));

export const CustomPageList: React.FC<CustomPageListProps> = ({
  items,
  loading,
  onSaveOrder,
  savingOrder,
  enableMoveControls,
  onMoveUp,
  onMoveDown,
  activeLocale,
}) => {
  const t = useAdminT();
  const rows = items ?? [];
  const hasData = rows.length > 0;

  const [deletePage, { isLoading: isDeleting }] = useDeleteCustomPageAdminMutation();
  const [updatePage, { isLoading: isUpdating }] = useUpdateCustomPageAdminMutation();
  const busy = loading || isDeleting || isUpdating || !!savingOrder;

  const effectiveLocale = useMemo(() => normLocale(activeLocale) || "", [activeLocale]);

  const editHrefById = (id: string) => ({
    pathname: `/admin/custompage/${encodeURIComponent(id)}`,
    query: effectiveLocale ? { locale: effectiveLocale } : undefined,
  });

  const handleTogglePublished = async (page: CustomPageDto) => {
    try {
      await updatePage({ id: page.id, patch: { is_published: !page.is_published } }).unwrap();
    } catch {}
  };

  const handleToggleFeatured = async (page: CustomPageDto) => {
    try {
      await updatePage({ id: page.id, patch: { featured: !page.featured } }).unwrap();
    } catch {}
  };

  const renderStatus = (p: CustomPageDto) => (
    <label className="flex cursor-pointer items-center justify-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={!!p.is_published}
        onChange={() => handleTogglePublished(p)}
        disabled={busy}
      />
      <div className="relative h-4 w-8 rounded-full bg-muted transition-colors peer-checked:bg-primary">
        <div
          className={`absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-background transition-transform ${p.is_published ? "translate-x-4" : ""}`}
        />
      </div>
    </label>
  );

  const renderFeatured = (p: CustomPageDto) => (
    <label className="flex cursor-pointer items-center justify-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={!!p.featured}
        onChange={() => handleToggleFeatured(p)}
        disabled={busy}
      />
      <div className="relative h-4 w-8 rounded-full bg-muted transition-colors peer-checked:bg-primary">
        <div
          className={`absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-background transition-transform ${p.featured ? "translate-x-4" : ""}`}
        />
      </div>
    </label>
  );

  const handleDelete = async (page: CustomPageDto) => {
    const ok = window.confirm(
      t("admin.customPage.list.deleteConfirm", {
        title: page.title ?? t("admin.customPage.list.noTitle"),
        id: page.id,
        slug: page.slug ?? "(slug)",
      }),
    );
    if (!ok) return;

    try {
      await deletePage(page.id).unwrap();
      toast.success(t("admin.customPage.list.deleteSuccess"));
    } catch (err: unknown) {
      const status = (err as any)?.status ?? (err as any)?.originalStatus;
      if (status === 404) {
        // Zaten silinmis - basarili say
        toast.success(t("admin.customPage.list.deleteSuccess"));
      } else {
        const msg =
          (err as { data?: { error?: { message?: string } } })?.data?.error?.message ??
          t("admin.customPage.list.deleteError");
        toast.error(msg);
      }
    }
  };

  const renderEmptyOrLoading = () => {
    if (loading) return <div className="p-6 text-muted-foreground text-sm">{t("admin.common.loading")}</div>;
    return <div className="p-6 text-muted-foreground text-sm">{t("admin.common.noData")}</div>;
  };

  const MoveControls = ({ idx }: { idx: number }) => {
    if (!enableMoveControls) return null;
    return (
      <div className="inline-flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onMoveUp?.(idx)}
          disabled={busy || idx === 0 || !onMoveUp}
          title="Yukarı"
        >
          <ArrowUp className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onMoveDown?.(idx)}
          disabled={busy || idx === rows.length - 1 || !onMoveDown}
          title="Aşağı"
        >
          <ArrowDown className="size-4" />
        </Button>
      </div>
    );
  };

  const renderCards = () => {
    if (!hasData) return renderEmptyOrLoading();

    return (
      <div className="min-w-0 p-4">
        <div className="grid gap-3 sm:grid-cols-1 2xl:grid-cols-2">
          {rows.map((p, idx) => {
            const localeResolved = safeText(p.locale_resolved);

            return (
              <div key={p.id} className="min-w-0 overflow-hidden rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                        #{idx + 1}
                      </span>
                      {renderStatus(p)}
                      {renderFeatured(p)}
                      {localeResolved ? (
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                          Locale: <code className="ml-1">{localeResolved}</code>
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-2 truncate font-semibold text-sm">
                      {p.title ?? <span className="text-muted-foreground">{t("admin.customPage.list.noTitle")}</span>}
                    </div>

                    {p.meta_title ? (
                      <div className="mt-1 truncate text-muted-foreground text-xs" title={p.meta_title}>
                        SEO: {p.meta_title}
                      </div>
                    ) : null}

                    <div className="mt-1 truncate text-muted-foreground text-xs">
                      Slug: <code className="break-all">{p.slug ?? "-"}</code>
                    </div>

                    <div className="mt-2 text-muted-foreground text-xs">
                      <div>
                        {t("admin.customPage.list.created")}: {formatDate(p.created_at)}
                      </div>
                      <div>
                        {t("admin.customPage.list.updated")}: {formatDate(p.updated_at)}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <MoveControls idx={idx} />
                    <Link href={editHrefById(p.id)} className="rounded-md border px-3 py-1 text-center text-xs">
                      {t("admin.common.edit")}
                    </Link>
                    <button
                      type="button"
                      className="rounded-md border px-3 py-1 text-center text-destructive text-xs disabled:opacity-60"
                      disabled={busy}
                      onClick={() => handleDelete(p)}
                    >
                      {t("admin.common.delete")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 text-muted-foreground text-xs">{t("admin.customPage.list.cardViewHint")}</div>
      </div>
    );
  };

  const renderTable = () => {
    if (!hasData) return renderEmptyOrLoading();

    return (
      <div className="min-w-0 overflow-hidden">
        <table className="w-full table-fixed border-collapse text-xs">
          <thead>
            <tr className="border-b bg-muted/30 text-left">
              <th className="w-8 px-2 py-1.5 text-[11px] text-muted-foreground">#</th>
              <th className="w-[25%] px-2 py-1.5 text-[11px]">{t("admin.customPage.form.title")}</th>
              <th className="w-[20%] px-2 py-1.5 text-[11px]">Slug</th>
              <th className="w-[8%] px-2 py-1.5 text-center text-[11px]">Aktif</th>
              <th className="w-[8%] px-2 py-1.5 text-center text-[11px]">One Cikan</th>
              <th className="w-[10%] px-2 py-1.5 text-[11px]">{t("admin.customPage.list.created")}</th>
              <th className="w-[100px] px-2 py-1.5 text-right text-[11px]">{t("admin.common.actions")}</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((p, idx) => {
              const localeResolved = safeText(p.locale_resolved);

              return (
                <tr key={p.id} className="border-b hover:bg-muted/20">
                  <td className="px-2 py-1.5 text-muted-foreground">{idx + 1}</td>

                  <td className="min-w-0 overflow-hidden px-2 py-1.5">
                    <div className="min-w-0">
                      <div className="truncate font-medium" title={safeText(p.title)}>
                        {p.title ?? t("admin.customPage.list.noTitle")}
                      </div>
                      {localeResolved ? (
                        <span className="text-[10px] text-muted-foreground">
                          <code>{localeResolved}</code>
                        </span>
                      ) : null}
                    </div>
                  </td>

                  <td className="overflow-hidden px-2 py-1.5">
                    <code className="block truncate text-[11px]">{p.slug ?? "-"}</code>
                  </td>

                  <td className="px-2 py-1.5 text-center">{renderStatus(p)}</td>
                  <td className="px-2 py-1.5 text-center">{renderFeatured(p)}</td>

                  <td className="px-2 py-1.5 text-[11px] text-muted-foreground" title={`${formatDate(p.created_at)}`}>
                    {formatDate(p.created_at)}
                  </td>

                  <td className="px-2 py-1.5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <MoveControls idx={idx} />
                      <Link
                        href={editHrefById(p.id)}
                        className="rounded border p-1 hover:bg-muted"
                        title={t("admin.common.edit")}
                      >
                        <Pencil className="size-3.5" />
                      </Link>
                      <button
                        type="button"
                        className="rounded border p-1 text-destructive hover:bg-destructive/10 disabled:opacity-60"
                        disabled={busy}
                        onClick={() => handleDelete(p)}
                        title={t("admin.common.delete")}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="px-2 py-2 text-[11px] text-muted-foreground">{t("admin.customPage.list.reorderHelp")}</div>
      </div>
    );
  };

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-lg border bg-card">
      <div className="border-b p-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="font-semibold text-sm">{t("admin.customPage.list.listTitle")}</div>
            <div className="text-muted-foreground text-xs">
              {busy
                ? t("admin.common.loading")
                : t("admin.customPage.list.recordCount", { count: String(rows.length) })}
            </div>
          </div>

          {onSaveOrder ? (
            <Button variant="outline" onClick={onSaveOrder} disabled={busy || !hasData}>
              <Save className="mr-2 size-4" />
              {savingOrder ? t("admin.customPage.list.savingOrder") : t("admin.customPage.list.saveOrder")}
            </Button>
          ) : null}
        </div>
      </div>

      <div className="hidden min-[1700px]:block">{renderTable()}</div>
      <div className="block min-[1700px]:hidden">{renderCards()}</div>
    </div>
  );
};
