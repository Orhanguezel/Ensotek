// =============================================================
// FILE: src/components/admin/site-settings/tabs/ApiSettingsTab.tsx
// Ensotek – API & Entegrasyon Ayarları (GLOBAL) – style aligned
// =============================================================

import React from 'react';
import { toast } from 'sonner';

import {
  useListSiteSettingsAdminQuery,
  useUpdateSiteSettingAdminMutation,
} from '@/integrations/rtk/hooks';

import type { SettingValue, SiteSetting } from '@/integrations/types/site_settings.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export type ApiSettingsTabProps = {
  locale: string; // UI badge için dursun
};

const API_KEYS = ['google_client_id', 'google_client_secret'] as const;
type ApiKey = (typeof API_KEYS)[number];

type ApiForm = Record<ApiKey, string>;

const EMPTY_FORM: ApiForm = {
  google_client_id: '',
  google_client_secret: '',
};

function valueToString(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function toMap(settings?: SiteSetting[]) {
  const map = new Map<string, SiteSetting>();
  if (settings) for (const s of settings) map.set(s.key, s);
  return map;
}

export const ApiSettingsTab: React.FC<ApiSettingsTabProps> = ({ locale }) => {
  const {
    data: settings,
    isLoading,
    isFetching,
    refetch,
  } = useListSiteSettingsAdminQuery({
    keys: API_KEYS as unknown as string[],
    // GLOBAL => locale yok
  });

  const [updateSetting, { isLoading: isSaving }] = useUpdateSiteSettingAdminMutation();

  const [form, setForm] = React.useState<ApiForm>(EMPTY_FORM);

  React.useEffect(() => {
    const map = toMap(settings);
    const next: ApiForm = { ...EMPTY_FORM };
    API_KEYS.forEach((k) => (next[k] = valueToString(map.get(k)?.value)));
    setForm(next);
  }, [settings]);

  const loading = isLoading || isFetching;
  const busy = loading || isSaving;

  const handleChange = (field: ApiKey, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSave = async () => {
    try {
      const updates: { key: ApiKey; value: SettingValue }[] = [
        { key: 'google_client_id', value: form.google_client_id.trim() },
        { key: 'google_client_secret', value: form.google_client_secret.trim() },
      ];

      for (const u of updates) {
        await updateSetting({ key: u.key, value: u.value }).unwrap();
      }

      toast.success('API & entegrasyon ayarları kaydedildi.');
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message || err?.message || 'API ayarları kaydedilirken bir hata oluştu.';
      toast.error(msg);
    }
  };

  return (
    <div className="card">
      <div className="card-header py-2 d-flex justify-content-between align-items-center">
        <div className="d-flex flex-column">
          <span className="small fw-semibold">API & Entegrasyon Ayarları</span>
          <span className="text-muted small">
            Global ayarlardır (locale=`*`). Seçili dil sadece arayüz bilgisidir.
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-light text-dark border">
            Global (locale=`*`) • Seçili dil: {locale || '—'}
          </span>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={refetch}
            disabled={busy}
          >
            Yenile
          </button>
        </div>
      </div>

      <div className="card-body">
        {busy && (
          <div className="mb-2">
            <span className="badge bg-secondary">Yükleniyor...</span>
          </div>
        )}

        <p className="text-muted small mb-3">
          Bu alanlar genellikle dillere göre değişmez. Veritabanında <code>locale=`*`</code> olarak
          tutulur.
        </p>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small">
              Google Client ID (<code>google_client_id</code>)
            </label>
            <Input
              value={form.google_client_id}
              onChange={(e) => handleChange('google_client_id', e.target.value)}
              placeholder="Google OAuth Client ID"
              disabled={busy}
            />
            <div className="form-text small">Google OAuth / Login entegrasyonu için Client ID.</div>
          </div>

          <div className="col-md-6">
            <label className="form-label small">
              Google Client Secret (<code>google_client_secret</code>)
            </label>
            <Input
              type="password"
              value={form.google_client_secret}
              onChange={(e) => handleChange('google_client_secret', e.target.value)}
              placeholder="Google OAuth Client Secret"
              disabled={busy}
            />
            <div className="form-text small">
              Güvenlik nedeniyle mümkünse sadece backend ortam değişkenleriyle yönet.
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-3">
          <Button type="button" variant="default" disabled={busy} onClick={handleSave}>
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </div>
    </div>
  );
};
