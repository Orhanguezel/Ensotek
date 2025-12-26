// =============================================================
// FILE: src/pages/admin/services/[id].tsx (FIXED)
// Ensotek – Admin Hizmet Detay (Create / Edit by id)
// Locale source: RTK public endpoints (app-locales + default-locale)
// URL ?locale=... sync
// RTK imports: ONLY from "@/integrations/rtk/hooks"
// =============================================================

import React, { useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import { ServiceForm, type ServiceFormValues } from '@/components/admin/services/ServiceForm';

import {
  useGetServiceAdminQuery,
  useCreateServiceAdminMutation,
  useUpdateServiceAdminMutation,

  // ✅ locale meta: public endpoints (RTK hooks barrel)
  useGetAppLocalesPublicQuery,
  useGetDefaultLocalePublicQuery,
} from '@/integrations/rtk/hooks';

import type {
  ServiceCreatePayload,
  ServiceUpdatePayload,
} from '@/integrations/types/services.types';

import type { AdminLocaleOption } from '@/components/common/AdminLocaleSelect';

/* -------------------- Locale helpers -------------------- */

const toShortLocale = (v: unknown): string =>
  String(v || '')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0]
    .trim();

function uniqByCode(items: { code: string; label?: string }[]): { code: string; label?: string }[] {
  const seen = new Set<string>();
  const out: { code: string; label?: string }[] = [];
  for (const it of items) {
    const code = toShortLocale(it?.code);
    if (!code) continue;
    if (seen.has(code)) continue;
    seen.add(code);
    out.push({ ...it, code });
  }
  return out;
}

function buildLocaleLabel(item: { code: string; label?: string }): string {
  const code = toShortLocale(item.code);
  const label = String(item.label || '').trim();
  if (label) return `${label} (${code})`;

  let dn: Intl.DisplayNames | null = null;
  try {
    dn = new Intl.DisplayNames(['en'], { type: 'language' });
  } catch {
    dn = null;
  }
  const name = dn?.of(code) ?? '';
  return name ? `${name} (${code})` : `${code.toUpperCase()} (${code})`;
}

const normalizeLocale = (v: unknown): string => {
  const s = typeof v === 'string' ? v.trim().toLowerCase() : '';
  return s;
};

/* -------------------- Page -------------------- */

const AdminServiceDetailPage: NextPage = () => {
  const router = useRouter();
  const { id: idParam } = router.query;

  const isRouterReady = router.isReady;

  const id = useMemo(
    () => (isRouterReady && typeof idParam === 'string' ? idParam : undefined),
    [isRouterReady, idParam],
  );

  const isCreateMode = id === 'new';
  const shouldSkipQuery = !isRouterReady || isCreateMode || !id;

  /* --------- Locales – RTK public endpoints --------- */

  const {
    data: appLocalesMeta,
    isLoading: isLocalesLoading1,
    isFetching: isLocalesFetching1,
  } = useGetAppLocalesPublicQuery();

  const {
    data: defaultLocaleMeta,
    isLoading: isLocalesLoading2,
    isFetching: isLocalesFetching2,
  } = useGetDefaultLocalePublicQuery();

  const { localeOptions, defaultLocale } = useMemo(() => {
    const metasRaw = Array.isArray(appLocalesMeta) ? appLocalesMeta : [];

    const active = metasRaw
      .filter((m: any) => m && m.code)
      .filter((m: any) => m.is_active !== false)
      .map((m: any) => ({
        code: toShortLocale(m.code),
        label: typeof m.label === 'string' ? m.label : undefined,
        is_default: m.is_default === true,
      }))
      .filter((x: any) => !!x.code);

    const uniq = uniqByCode(active);

    const metaDefault = uniq.find((x: any) => x.is_default)?.code || '';
    const defEndpoint =
      typeof defaultLocaleMeta === 'string' ? toShortLocale(defaultLocaleMeta) : '';

    const effectiveDefault = (metaDefault || defEndpoint || uniq[0]?.code || 'de').toLowerCase();

    const options: AdminLocaleOption[] = uniq.map((it: any) => ({
      value: toShortLocale(it.code),
      label: buildLocaleLabel(it),
    }));

    return { localeOptions: options, defaultLocale: effectiveDefault };
  }, [appLocalesMeta, defaultLocaleMeta]);

  const isLocalesLoading =
    isLocalesLoading1 || isLocalesLoading2 || isLocalesFetching1 || isLocalesFetching2;

  const initialActiveLocale = useMemo(() => {
    const qLocale = toShortLocale(router.query?.locale);

    if (qLocale && localeOptions.some((x) => x.value === qLocale)) return qLocale;
    if (defaultLocale && localeOptions.some((x) => x.value === defaultLocale)) return defaultLocale;

    return localeOptions?.[0]?.value || '';
  }, [router.query?.locale, localeOptions, defaultLocale]);

  const [activeLocale, setActiveLocale] = useState<string>(initialActiveLocale);

  // locales/query değişince activeLocale onar
  useEffect(() => {
    setActiveLocale(initialActiveLocale);
  }, [initialActiveLocale]);

  // activeLocale -> URL sync
  useEffect(() => {
    if (!router.isReady) return;
    if (!activeLocale) return;

    const cur = toShortLocale(router.query?.locale);
    if (activeLocale !== cur) {
      void router.replace(
        { pathname: router.pathname, query: { ...router.query, locale: activeLocale } },
        undefined,
        { shallow: true },
      );
    }
  }, [activeLocale, router]);

  /* --------- Detail query – locale ile --------- */

  const {
    data: service,
    isLoading: isLoadingService,
    isFetching: isFetchingService,
    error: serviceError,
  } = useGetServiceAdminQuery(
    { id: id as string, locale: activeLocale },
    { skip: shouldSkipQuery || !activeLocale },
  );

  const [createService, { isLoading: isCreating }] = useCreateServiceAdminMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceAdminMutation();

  const loading = isLoadingService || isFetchingService || isLocalesLoading;
  const saving = isCreating || isUpdating;

  const handleCancel = () => {
    router.push({
      pathname: '/admin/services',
      query: activeLocale ? { locale: activeLocale } : undefined,
    });
  };

  const handleSubmit = async (values: ServiceFormValues) => {
    try {
      const loc = normalizeLocale(values.locale || activeLocale || defaultLocale);
      if (!loc) {
        toast.error('Locale seçimi zorunludur. app_locales ayarlarını kontrol edin.');
        return;
      }

      if (isCreateMode) {
        const payload: ServiceCreatePayload = {
          category_id: values.category_id || null,
          sub_category_id: values.sub_category_id || null,

          featured: values.featured,
          is_active: values.is_active,
          display_order: values.display_order ? Number(values.display_order) : undefined,

          featured_image: values.featured_image || null,
          image_url: values.image_url || null,
          image_asset_id: values.image_asset_id || null,

          area: values.area || null,
          duration: values.duration || null,
          maintenance: values.maintenance || null,
          season: values.season || null,
          thickness: values.thickness || null,
          equipment: values.equipment || null,

          locale: loc,
          name: values.name.trim(),
          slug: values.slug.trim(),
          description: values.description || undefined,
          material: values.material || undefined,
          price: values.price || undefined,
          includes: values.includes || undefined,
          warranty: values.warranty || undefined,
          image_alt: values.image_alt || undefined,

          replicate_all_locales: values.replicate_all_locales,
        };

        const created = await createService(payload).unwrap();
        toast.success('Hizmet oluşturuldu.');

        const nextId = created.id;
        router.replace({
          pathname: `/admin/services/${encodeURIComponent(nextId)}`,
          query: { locale: loc },
        });
      } else {
        if (!service) {
          toast.error('Hizmet verisi yüklenemedi.');
          return;
        }

        const payload: ServiceUpdatePayload = {
          category_id: values.category_id || null,
          sub_category_id: values.sub_category_id || null,

          featured: values.featured,
          is_active: values.is_active,
          display_order: values.display_order ? Number(values.display_order) : undefined,

          featured_image: values.featured_image || null,
          image_url: values.image_url || null,
          image_asset_id: values.image_asset_id || null,

          area: values.area || null,
          duration: values.duration || null,
          maintenance: values.maintenance || null,
          season: values.season || null,
          thickness: values.thickness || null,
          equipment: values.equipment || null,

          locale: loc,
          name: values.name.trim(),
          slug: values.slug.trim(),
          description: values.description || undefined,
          material: values.material || undefined,
          price: values.price || undefined,
          includes: values.includes || undefined,
          warranty: values.warranty || undefined,
          image_alt: values.image_alt || undefined,

          apply_all_locales: values.apply_all_locales,
        };

        await updateService({ id: service.id, patch: payload }).unwrap();
        toast.success('Hizmet güncellendi.');

        if (loc && loc !== activeLocale) setActiveLocale(loc);
      }
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || 'İşlem sırasında hata oluştu.');
    }
  };

  if (!isRouterReady) {
    return (
      <div className="container-fluid py-3">
        <div className="text-muted small">Yükleniyor...</div>
      </div>
    );
  }

  // app_locales yoksa net uyarı
  if (!isLocalesLoading && (!localeOptions || localeOptions.length === 0)) {
    return (
      <div className="container-fluid py-3">
        <h4 className="h5 mb-2">Dil listesi bulunamadı</h4>
        <p className="text-muted small mb-3">
          <code>site_settings.app_locales</code> boş veya geçersiz. Önce Site Settings’ten dilleri
          ayarla.
        </p>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => router.push('/admin/site-settings')}
        >
          Site Ayarlarına git
        </button>
      </div>
    );
  }

  if (!isCreateMode && serviceError && !loading && !service) {
    return (
      <div className="container-fluid py-3">
        <h4 className="h5 mb-2">Hizmet bulunamadı</h4>
        <p className="text-muted small mb-3">
          Bu id için kayıtlı hizmet yok: <code className="ms-1">{id}</code>
        </p>
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleCancel}>
          Listeye dön
        </button>
      </div>
    );
  }

  const pageTitle = isCreateMode ? 'Yeni Hizmet Oluştur' : service?.name || 'Hizmet Düzenle';

  return (
    <div className="container-fluid py-3">
      <div className="mb-3">
        <h4 className="h5 mb-1">{pageTitle}</h4>
        <p className="text-muted small mb-0">
          Hizmeti burada oluşturup düzenleyebilirsin. Dil seçimi dinamik gelir ve URL ile senkron
          çalışır.
        </p>
      </div>

      <ServiceForm
        mode={isCreateMode ? 'create' : 'edit'}
        initialData={!isCreateMode && service ? service : undefined}
        loading={loading}
        saving={saving}
        locales={localeOptions}
        localesLoading={isLocalesLoading}
        defaultLocale={activeLocale || defaultLocale}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onLocaleChange={(loc) => setActiveLocale(toShortLocale(loc))}
      />
    </div>
  );
};

export default AdminServiceDetailPage;
