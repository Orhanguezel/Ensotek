// =============================================================
// FILE: src/pages/admin/custompage/[slug].tsx
// Ensotek – Admin Custom Page Create/Edit Page (slug bazlı)
// FIX (Locale):
//  - Locale source single: GET /site_settings/app-locales + /site_settings/default-locale
//  - Active locales only (is_active !== false)
//  - Default locale: meta default > default-locale endpoint > first active > "tr"
// =============================================================

import React, { useMemo } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import {
  CustomPageForm,
  type CustomPageFormValues,
} from '@/components/admin/custompage/CustomPageForm';

import {
  useGetCustomPageBySlugAdminQuery,
  useCreateCustomPageAdminMutation,
  useUpdateCustomPageAdminMutation,
  useGetAppLocalesPublicQuery,
  useGetDefaultLocalePublicQuery,
} from '@/integrations/rtk/hooks';


import type {
  CustomPageCreatePayload,
  CustomPageUpdatePayload,
} from '@/integrations/types/custom_pages.types';
import type { LocaleOption } from '@/components/admin/custompage/CustomPageHeader';

const AdminCustomPageDetail: NextPage = () => {
  const router = useRouter();
  const { slug: slugParam } = router.query;
  const isRouterReady = router.isReady;

  const slug = useMemo(
    () => (isRouterReady && typeof slugParam === 'string' ? slugParam : undefined),
    [isRouterReady, slugParam],
  );

  const isCreateMode = slug === 'new';
  const shouldSkipQuery = !isRouterReady || isCreateMode || !slug;

  const {
    data: page,
    isLoading: isLoadingPage,
    isFetching: isFetchingPage,
    error: pageError,
  } = useGetCustomPageBySlugAdminQuery({ slug: slug as string }, { skip: shouldSkipQuery });

  const [createPage, { isLoading: isCreating }] = useCreateCustomPageAdminMutation();
  const [updatePage, { isLoading: isUpdating }] = useUpdateCustomPageAdminMutation();

  /* --------- Locale meta (PUBLIC endpoints) --------- */

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
    const metas = (appLocalesMeta ?? [])
      .filter((m) => m && m.code)
      .filter((m) => m.is_active !== false)
      .map((m) => ({
        code: String(m.code).trim().toLowerCase(),
        label: typeof m.label === 'string' ? m.label.trim() : undefined,
        is_default: m.is_default === true,
      }))
      .filter((m) => !!m.code);

    // unique by code
    const uniq = new Map<string, (typeof metas)[number]>();
    for (const m of metas) uniq.set(m.code, m);
    const active = Array.from(uniq.values());

    const metaDefault = active.find((m) => m.is_default)?.code || null;

    const defFromEndpoint =
      typeof defaultLocaleMeta === 'string' ? defaultLocaleMeta.trim().toLowerCase() : null;

    const effectiveDefault = (
      metaDefault ||
      defFromEndpoint ||
      active[0]?.code ||
      'tr'
    ).toLowerCase();

    const options: LocaleOption[] = active.map((m) => {
      const labelBase = (m.label && m.label.length ? m.label : m.code.toUpperCase()).trim();
      return { value: m.code, label: `${labelBase} (${m.code})` };
    });

    return { localeOptions: options, defaultLocale: effectiveDefault };
  }, [appLocalesMeta, defaultLocaleMeta]);

  const isLocalesLoading =
    isLocalesLoading1 || isLocalesLoading2 || isLocalesFetching1 || isLocalesFetching2;

  const loading = isLoadingPage || isFetchingPage || isLocalesLoading;
  const saving = isCreating || isUpdating;

  const handleCancel = () => {
    router.push('/admin/custompage');
  };

  const handleSubmit = async (values: CustomPageFormValues) => {
    try {
      const safeLocale = (values.locale || defaultLocale || 'tr').trim().toLowerCase();

      if (isCreateMode) {
        const payload: CustomPageCreatePayload = {
          locale: safeLocale,

          title: values.title.trim(),
          slug: values.slug.trim(),
          content: values.content,

          is_published: values.is_published,
          featured_image: values.featured_image || null,
          featured_image_asset_id: values.featured_image_asset_id || null,
          featured_image_alt: values.featured_image_alt || null,
          meta_title: values.meta_title || null,
          meta_description: values.meta_description || null,

          category_id: values.category_id || null,
          sub_category_id: values.sub_category_id || null,
        };

        const created = await createPage(payload).unwrap();
        toast.success('Sayfa başarıyla oluşturuldu.');

        const nextSlug = created.slug || values.slug.trim();
        router.replace(`/admin/custompage/${encodeURIComponent(nextSlug)}`);
      } else {
        if (!page) {
          toast.error('Sayfa verisi yüklenemedi.');
          return;
        }

        const payload: CustomPageUpdatePayload = {
          locale: safeLocale,
          is_published: values.is_published,

          title: values.title.trim(),
          slug: values.slug.trim(),
          content: values.content,

          featured_image: values.featured_image || null,
          featured_image_asset_id: values.featured_image_asset_id || null,
          featured_image_alt: values.featured_image_alt || null,
          meta_title: values.meta_title || null,
          meta_description: values.meta_description || null,

          category_id: values.category_id || null,
          sub_category_id: values.sub_category_id || null,
        };

        const targetId = values.id || page.id;

        await updatePage({ id: targetId, patch: payload }).unwrap();
        toast.success('Sayfa güncellendi.');

        const nextSlug = values.slug.trim();
        if (slug !== nextSlug) {
          router.replace(`/admin/custompage/${encodeURIComponent(nextSlug)}`);
        }
      }
    } catch (err: unknown) {
      const msg =
        (err as any)?.data?.error?.message ||
        (err as any)?.message ||
        'İşlem sırasında bir hata oluştu.';
      toast.error(msg);
    }
  };

  const pageTitle = isCreateMode ? 'Yeni Sayfa Oluştur' : page?.title || 'Sayfa Düzenle';

  if (!isRouterReady) {
    return (
      <div className="container-fluid py-3">
        <div className="text-muted small">Yükleniyor...</div>
      </div>
    );
  }

  if (!isCreateMode && pageError && !loading && !page) {
    return (
      <div className="container-fluid py-3">
        <h4 className="h5 mb-2">Sayfa bulunamadı</h4>
        <p className="text-muted small mb-3">
          Bu slug için kayıtlı bir özel sayfa yok: <code className="ms-1">{slug}</code>
        </p>
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleCancel}>
          Listeye dön
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      <div className="mb-3">
        <h4 className="h5 mb-1">{pageTitle}</h4>
        <p className="text-muted small mb-0">
          Özel sayfaları burada oluşturup düzenleyebilirsin. Dil seçenekleri aktif locale listesi
          üzerinden dinamik gelir.
        </p>
      </div>

      <CustomPageForm
        mode={isCreateMode ? 'create' : 'edit'}
        initialData={!isCreateMode && page ? page : undefined}
        loading={loading}
        saving={saving}
        locales={localeOptions}
        localesLoading={isLocalesLoading}
        defaultLocale={defaultLocale}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AdminCustomPageDetail;
