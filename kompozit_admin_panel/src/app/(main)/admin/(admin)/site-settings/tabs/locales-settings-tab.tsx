'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { RefreshCcw } from 'lucide-react';

import { useAdminTranslations, normLocaleTag } from '@/i18n';
import { usePreferencesStore } from '@/stores/preferences/preferences-provider';

import {
  useListSiteSettingsAdminQuery,
  useUpdateSiteSettingAdminMutation,
} from '@/integrations/hooks';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type LocaleRow = {
  code: string;
  label: string;
  is_active: boolean;
};

function toShortLocale(v: unknown): string {
  return normLocaleTag(v);
}

function safeStr(v: unknown): string {
  return v === null || v === undefined ? '' : String(v);
}

function normalizeRows(raw: unknown): LocaleRow[] {
  const arr = Array.isArray(raw) ? raw : [];

  const out: LocaleRow[] = [];
  const seen = new Set<string>();

  for (const item of arr as any[]) {
    const code = toShortLocale(item?.code ?? item);
    if (!code || seen.has(code)) continue;
    seen.add(code);

    const label = safeStr(item?.label).trim();
    out.push({
      code,
      label: label || code.toUpperCase(),
      is_active: item?.is_active === undefined ? true : Boolean(item?.is_active),
    });
  }

  return out.sort((a, b) => {
    const aa = a.is_active ? 0 : 1;
    const bb = b.is_active ? 0 : 1;
    if (aa !== bb) return aa - bb;
    return a.code.localeCompare(b.code);
  });
}

const TOP_20_LOCALES_PRESET: LocaleRow[] = [
  { code: 'de', label: 'Deutsch', is_active: true },
  { code: 'en', label: 'English', is_active: true },
  { code: 'tr', label: 'Türkçe', is_active: true },
  { code: 'es', label: 'Español', is_active: false },
  { code: 'fr', label: 'Français', is_active: false },
  { code: 'it', label: 'Italiano', is_active: false },
  { code: 'pt', label: 'Português', is_active: false },
  { code: 'ru', label: 'Русский', is_active: false },
  { code: 'ar', label: 'العربية', is_active: false },
  { code: 'hi', label: 'हिन्दी', is_active: false },
  { code: 'bn', label: 'বাংলা', is_active: false },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', is_active: false },
  { code: 'ja', label: '日本語', is_active: false },
  { code: 'ko', label: '한국어', is_active: false },
  { code: 'zh', label: '中文', is_active: false },
  { code: 'id', label: 'Bahasa Indonesia', is_active: false },
  { code: 'vi', label: 'Tiếng Việt', is_active: false },
  { code: 'th', label: 'ไทย', is_active: false },
  { code: 'nl', label: 'Nederlands', is_active: false },
  { code: 'pl', label: 'Polski', is_active: false },
];

export function LocalesSettingsTab({ settingPrefix }: { settingPrefix?: string }) {
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const t = useAdminTranslations(adminLocale || undefined);

  const appLocalesKey = `${settingPrefix || ''}app_locales`;
  const localesQ = useListSiteSettingsAdminQuery({
    locale: '*',
    keys: [appLocalesKey],
    limit: 20,
    offset: 0,
    sort: 'key',
    order: 'asc',
  });
  const [updateSetting, { isLoading: isSaving }] = useUpdateSiteSettingAdminMutation();

  const [rows, setRows] = React.useState<LocaleRow[]>([]);
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (touched) return;
    const appLocalesRow = (localesQ.data ?? []).find((row) => row.key === appLocalesKey);
    setRows(normalizeRows(appLocalesRow?.value));
  }, [localesQ.data, appLocalesKey, touched]);

  const busy = isSaving || localesQ.isFetching || localesQ.isLoading;

  const persist = async (nextRows: LocaleRow[]) => {
    const payload = nextRows.map((r, index) => ({
      code: r.code,
      label: r.label,
      is_default: index === 0 && r.is_active,
      is_active: r.is_active,
    }));

    try {
      await updateSetting({ key: appLocalesKey, locale: '*', value: payload }).unwrap();
      toast.success(t('admin.siteSettings.locales.saved'));
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        t('admin.siteSettings.locales.saveError');
      toast.error(msg);
      throw err;
    }
  };

  const onToggleActive = async (code: string, val: boolean) => {
    const prevRows = rows;

    setTouched(true);
    const nextRows = rows.map((r) => (r.code === code ? { ...r, is_active: val } : r));
    setRows(nextRows);

    try {
      await persist(nextRows);
    } catch {
      setRows(prevRows);
      setTouched(false);
    }
  };

  const onPresetDeEnTr = async () => {
    const prevRows = rows;

    setTouched(true);
    const nextRows: LocaleRow[] = [
      { code: 'de', label: 'Deutsch', is_active: true },
      { code: 'en', label: 'English', is_active: true },
      { code: 'tr', label: 'Türkçe', is_active: true },
    ];
    setRows(nextRows);

    try {
      await persist(nextRows);
    } catch {
      setRows(prevRows);
      setTouched(false);
    }
  };

  const onPresetTop20 = async () => {
    const prevRows = rows;

    setTouched(true);
    const nextRows = TOP_20_LOCALES_PRESET.slice();
    setRows(nextRows);

    try {
      await persist(nextRows);
    } catch {
      setRows(prevRows);
      setTouched(false);
    }
  };

  return (
    <Card>
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base">{t('admin.siteSettings.locales.title')}</CardTitle>
            <CardDescription>{t('admin.siteSettings.locales.description')}</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {settingPrefix ? `${t('admin.siteSettings.badges.global')} · ${settingPrefix}` : t('admin.siteSettings.badges.global')}
            </Badge>
            {busy ? <Badge variant="outline">{t('admin.siteSettings.messages.loading')}</Badge> : null}
            <Button
              variant="outline"
              size="icon"
              disabled={busy}
              onClick={async () => {
                try {
                  await localesQ.refetch();
                } catch {
                  toast.error(t('admin.siteSettings.messages.error'));
                }
              }}
              title={t('admin.siteSettings.actions.refresh')}
            >
              <RefreshCcw className={busy ? 'size-4 animate-spin' : 'size-4'} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
          Frontend varsayılan dili artık bu panelden yönetilmiyor. Her proje kendi fallback locale ayarını kendi frontend katmanında belirliyor.
        </div>

        {!rows.length ? (
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            <div className="mb-3">{t('admin.siteSettings.locales.empty')}</div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={onPresetDeEnTr} disabled={busy}>
                {t('admin.siteSettings.locales.presetDeEnTr')}
              </Button>
              <Button variant="outline" onClick={onPresetTop20} disabled={busy}>
                {t('admin.siteSettings.locales.presetTop20')}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={onPresetDeEnTr} disabled={busy}>
                {t('admin.siteSettings.locales.presetDeEnTr')}
              </Button>
              <Button variant="outline" onClick={onPresetTop20} disabled={busy}>
                {t('admin.siteSettings.locales.presetTop20')}
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-28">{t('admin.siteSettings.locales.table.code')}</TableHead>
                    <TableHead>{t('admin.siteSettings.locales.table.label')}</TableHead>
                    <TableHead className="w-28 text-center">
                      {t('admin.siteSettings.locales.table.active')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.code}>
                      <TableCell className="font-mono text-sm">{r.code}</TableCell>
                      <TableCell className="text-sm">{r.label}</TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex justify-center">
                          <Switch
                            checked={r.is_active}
                            onCheckedChange={(v) => onToggleActive(r.code, Boolean(v))}
                            disabled={busy}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
