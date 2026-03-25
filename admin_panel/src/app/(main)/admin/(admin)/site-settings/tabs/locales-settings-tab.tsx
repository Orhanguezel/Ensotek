"use client";

import * as React from "react";

import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  useGetSiteSettingAdminByKeyQuery,
  useListSiteSettingsAdminQuery,
  useUpdateSiteSettingAdminMutation,
} from "@/integrations/hooks";
import {
  buildSiteSettingsLocalePayload,
  getErrorMessage,
  normalizeSiteSettingsLocaleRows,
  type SiteSettingsLocaleRow,
} from "@/integrations/shared";

export function LocalesSettingsTab({ settingPrefix }: { settingPrefix?: string }) {
  const t = useAdminT("admin.siteSettings.locales");
  const appLocalesKey = `${settingPrefix || ""}app_locales`;
  const defaultLocaleKey = `${settingPrefix || ""}default_locale`;

  const localesQ = useListSiteSettingsAdminQuery({
    locale: "*",
    keys: [appLocalesKey],
    limit: 20,
    offset: 0,
    sort: "key",
    order: "asc",
  });

  const defaultLocaleQ = useGetSiteSettingAdminByKeyQuery(defaultLocaleKey);

  const [updateSetting, { isLoading: isSaving }] = useUpdateSiteSettingAdminMutation();
  const [rows, setRows] = React.useState<SiteSettingsLocaleRow[]>([]);
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (touched) return;
    const row = (localesQ.data ?? []).find((r) => r.key === appLocalesKey);
    setRows(normalizeSiteSettingsLocaleRows(row?.value));
  }, [localesQ.data, appLocalesKey, touched]);

  const currentDefault = React.useMemo(() => {
    const v = defaultLocaleQ.data?.value;
    if (!v) return "";
    return String(typeof v === "string" ? v : "").trim().toLowerCase().split("-")[0];
  }, [defaultLocaleQ.data]);

  const activeRows = React.useMemo(() => rows.filter((r) => r.is_active), [rows]);

  const busy = isSaving || localesQ.isFetching || localesQ.isLoading || defaultLocaleQ.isFetching;

  const onDefaultLocaleChange = async (code: string) => {
    try {
      await updateSetting({ key: defaultLocaleKey, locale: "*", value: code }).unwrap();
      defaultLocaleQ.refetch();
      toast.success(t("saved"));
    } catch (err) {
      toast.error(getErrorMessage(err, t("saveError")));
    }
  };

  const persist = async (nextRows: SiteSettingsLocaleRow[]) => {
    const payload = buildSiteSettingsLocalePayload(nextRows);
    try {
      await updateSetting({ key: appLocalesKey, locale: "*", value: payload }).unwrap();
      toast.success(t("saved"));
    } catch (err) {
      toast.error(getErrorMessage(err, t("saveError")));
      throw err;
    }
  };

  const onToggleActive = async (code: string, val: boolean) => {
    const prev = rows;
    setTouched(true);
    const next = rows.map((r) => (r.code === code ? { ...r, is_active: val } : r));
    setRows(next);
    try {
      await persist(next);
    } catch {
      setRows(prev);
      setTouched(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{t("title")}</CardTitle>
          <div className="flex items-center gap-2">
            {busy && <Badge variant="outline">{t("loading")}</Badge>}
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={busy} onClick={() => localesQ.refetch()}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Varsayılan Dil */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t("defaultLocale")}</Label>
          <CardDescription className="text-xs">{t("defaultLocaleDesc")}</CardDescription>
          <Select
            value={currentDefault || "all"}
            onValueChange={(v) => onDefaultLocaleChange(v === "all" ? "" : v)}
            disabled={busy || activeRows.length === 0}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t("selectDefault")} />
            </SelectTrigger>
            <SelectContent>
              {activeRows.map((r) => (
                <SelectItem key={r.code} value={r.code}>
                  {r.label} ({r.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dil Listesi */}
        {rows.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t("emptyRows")}</p>
        ) : (
          <div className="space-y-2">
            {rows.map((r) => (
              <div key={r.code} className="flex items-center justify-between rounded-md border px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="w-8 text-center font-medium font-mono text-sm uppercase">{r.code}</span>
                  <span className="text-sm">{r.label}</span>
                  {r.code === currentDefault && (
                    <Badge variant="secondary" className="text-[10px]">{t("default")}</Badge>
                  )}
                </div>
                <Switch
                  checked={r.is_active}
                  onCheckedChange={(v) => onToggleActive(r.code, Boolean(v))}
                  disabled={busy}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
