// =============================================================
// FILE: brand-media-tab.tsx
// Logo & Favicon yönetimi
// Each brand media item is stored as a SEPARATE site_settings key
// with value: { url: "...", alt?: "...", width?: N, height?: N }
// =============================================================

"use client";

import React, { useCallback, useMemo, useState } from "react";

import { Copy, ExternalLink, RefreshCcw, Save } from "lucide-react";
import { toast } from "sonner";

import { AdminImageUploadField } from "@/app/(main)/admin/_components/common/AdminImageUploadField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminTranslations } from "@/i18n";
import { useGetSiteSettingAdminByKeyQuery, useUpdateSiteSettingAdminMutation } from "@/integrations/hooks";
import {
  getSiteSettingsBrandMediaErrorMessage,
  SITE_SETTINGS_BRAND_MEDIA_ITEMS,
  type SiteSettingsBrandMediaData,
} from "@/integrations/shared";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

/* ── helpers ── */

/** Extract the URL string from a site_setting value (handles {url:"..."} objects and plain strings) */
function extractUrl(data: unknown): string {
  if (!data) return "";
  if (typeof data === "object" && data !== null) {
    const row = data as Record<string, unknown>;
    const val = row.value ?? row;
    if (val && typeof val === "object") {
      const v = val as Record<string, unknown>;
      if (typeof v.url === "string") return v.url;
    }
    if (typeof (row as any).url === "string") return (row as any).url;
  }
  if (typeof data === "string") return data;
  return "";
}

/* ── component ── */

export type BrandMediaTabProps = {
  locale: string;
  settingPrefix?: string;
};

export const BrandMediaTab: React.FC<BrandMediaTabProps> = ({ locale, settingPrefix }) => {
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const t = useAdminTranslations(adminLocale || undefined);
  const prefix = settingPrefix || "";

  // Fetch each brand media key individually
  const logoQ = useGetSiteSettingAdminByKeyQuery({ key: `${prefix}site_logo`, locale: "*" }, { refetchOnMountOrArgChange: true });
  const logoDarkQ = useGetSiteSettingAdminByKeyQuery({ key: `${prefix}site_logo_dark`, locale: "*" }, { refetchOnMountOrArgChange: true });
  const faviconQ = useGetSiteSettingAdminByKeyQuery({ key: `${prefix}site_favicon`, locale: "*" }, { refetchOnMountOrArgChange: true });
  const appleQ = useGetSiteSettingAdminByKeyQuery({ key: `${prefix}site_apple_touch_icon`, locale: "*" }, { refetchOnMountOrArgChange: true });
  const ogQ = useGetSiteSettingAdminByKeyQuery({ key: `${prefix}og_image_default`, locale: "*" }, { refetchOnMountOrArgChange: true });

  const queries = [logoQ, logoDarkQ, faviconQ, appleQ, ogQ];

  const [updateSetting, { isLoading: isSaving }] = useUpdateSiteSettingAdminMutation();
  const busy = queries.some((q) => q.isLoading || q.isFetching) || isSaving;

  const serverData = useMemo<SiteSettingsBrandMediaData>(
    () => ({
      site_logo: extractUrl(logoQ.data),
      site_logo_dark: extractUrl(logoDarkQ.data),
      site_favicon: extractUrl(faviconQ.data),
      site_apple_touch_icon: extractUrl(appleQ.data),
      og_image_default: extractUrl(ogQ.data),
    }),
    [logoQ.data, logoDarkQ.data, faviconQ.data, appleQ.data, ogQ.data],
  );

  const [localData, setLocalData] = useState<SiteSettingsBrandMediaData | null>(null);

  React.useEffect(() => {
    if (queries.every((q) => !q.isLoading)) setLocalData({ ...serverData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverData]);

  const current = localData ?? serverData;

  const updateField = (field: keyof SiteSettingsBrandMediaData, value: string) => {
    setLocalData((prev) => ({ ...(prev ?? serverData), [field]: value }));
  };

  const refetchAll = useCallback(() => {
    for (const q of queries) q.refetch();
  }, [queries]);

  const handleSave = async () => {
    if (!localData) return;
    try {
      // Save each changed field to its own key
      const savePromises = SITE_SETTINGS_BRAND_MEDIA_ITEMS.map((m) => {
        const url = localData[m.field] || "";
        return updateSetting({
          key: `${prefix}${m.field}`,
          locale: "*",
          value: { url } as any,
        }).unwrap();
      });
      await Promise.all(savePromises);
      toast.success(t("admin.siteSettings.brandMedia.inline.saved"));
      refetchAll();
    } catch (err: unknown) {
      toast.error(getSiteSettingsBrandMediaErrorMessage(err, t("admin.siteSettings.brandMedia.inline.saveError")));
    }
  };

  const isDirty = localData && JSON.stringify(localData) !== JSON.stringify(serverData);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">{t("admin.siteSettings.brandMedia.inline.title")}</CardTitle>
          <div className="flex items-center gap-2">
            {busy && <Badge variant="outline">{t("admin.siteSettings.brandMedia.inline.loading")}</Badge>}
            {isDirty && <Badge variant="default">{t("admin.siteSettings.brandMedia.inline.dirty")}</Badge>}
            <Button type="button" size="sm" onClick={handleSave} disabled={busy || !isDirty}>
              <Save className="mr-2 h-3.5 w-3.5" />
              {t("admin.siteSettings.brandMedia.inline.save")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => refetchAll()}
              disabled={busy}
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SITE_SETTINGS_BRAND_MEDIA_ITEMS.map((m) => {
            const value = current[m.field];
            const label = t(`admin.siteSettings.brandMedia.inline.labels.${m.labelKey}`);

            return (
              <div key={m.field} className="space-y-1.5 rounded-md border p-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs">{label}</span>
                  {value && (
                    <button
                      type="button"
                      className="text-[10px] text-destructive hover:underline"
                      onClick={() => updateField(m.field, "")}
                      disabled={busy}
                    >
                      {t("admin.siteSettings.brandMedia.inline.remove")}
                    </button>
                  )}
                </div>

                {value ? (
                  <div className="relative mx-auto aspect-square w-full max-w-30 overflow-hidden rounded border bg-muted/20">
                    <img
                      src={value}
                      alt={label}
                      className="h-full w-full object-contain p-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="mx-auto flex aspect-square w-full max-w-30 items-center justify-center rounded border bg-muted/20">
                    <span className="text-[10px] text-muted-foreground">
                      {t("admin.siteSettings.brandMedia.inline.noImage")}
                    </span>
                  </div>
                )}

                <AdminImageUploadField
                  label=""
                  bucket="public"
                  folder={m.folder}
                  metadata={{ field: m.field, scope: "logo" }}
                  value={value || ""}
                  onChange={(url) => updateField(m.field, url)}
                  disabled={busy}
                  openLibraryHref="/admin/storage"
                  previewAspect="1x1"
                  previewObjectFit="contain"
                />

                {/* URL kopyalama + link */}
                {value && (
                  <div className="mt-1 flex items-center gap-1">
                    <input
                      readOnly
                      value={value}
                      className="flex-1 truncate rounded border bg-muted/30 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button
                      type="button"
                      className="shrink-0 rounded p-0.5 hover:bg-muted"
                      title={t("admin.siteSettings.brandMedia.inline.copy")}
                      onClick={() => {
                        navigator.clipboard.writeText(value);
                        toast.success(t("admin.siteSettings.brandMedia.inline.urlCopied"));
                      }}
                    >
                      <Copy className="size-3 text-muted-foreground" />
                    </button>
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded p-0.5 hover:bg-muted"
                      title={t("admin.siteSettings.brandMedia.inline.openNewTab")}
                    >
                      <ExternalLink className="size-3 text-muted-foreground" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {isDirty && (
          <div className="flex justify-end pt-4">
            <Button type="button" onClick={handleSave} disabled={busy}>
              <Save className="mr-2 h-3.5 w-3.5" />
              {t("admin.siteSettings.brandMedia.inline.save")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

BrandMediaTab.displayName = "BrandMediaTab";
