'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Save, RefreshCcw } from 'lucide-react';

import { useAdminLocales } from '@/app/(main)/admin/_components/common/useAdminLocales';
import { resolveAdminApiLocale } from '@/i18n/adminLocale';
import { localeShortClient, localeShortClientOr } from '@/i18n/localeShortClient';
import { useAdminT } from '@/app/(main)/admin/_components/common/useAdminT';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { AdminJsonEditor } from '@/app/(main)/admin/_components/common/AdminJsonEditor';
import { AdminImageUploadField } from '@/app/(main)/admin/_components/common/AdminImageUploadField';
import { GalleryImagesTab } from './gallery-images-tab';

import type {
  GalleryDto,
  GalleryUpsertPayload,
} from '@/integrations/shared';
import {
  useGetGalleryAdminQuery,
  useCreateGalleryAdminMutation,
  useUpdateGalleryAdminMutation,
} from '@/integrations/hooks';

function isUuidLike(v?: string) {
  if (!v) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

const normalizeLocale = (v: unknown): string =>
  String(v ?? '')
    .trim()
    .toLowerCase();

const norm = (v: unknown) => String(v ?? '').trim();
const toNull = (v: unknown) => {
  const s = norm(v);
  return s || null;
};

const isTruthyBoolLike = (v: unknown) => v === true || v === 1 || v === '1' || v === 'true';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[çÇ]/g, 'c')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[ıİ]/g, 'i')
    .replace(/[öÖ]/g, 'o')
    .replace(/[şŞ]/g, 's')
    .replace(/[üÜ]/g, 'u')
    .replace(/[äÄ]/g, 'ae')
    .replace(/[ß]/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function getErrMessage(err: unknown, fallback: string): string {
  const anyErr = err as any;
  return (
    anyErr?.data?.error?.message ||
    anyErr?.data?.message ||
    anyErr?.error ||
    fallback
  );
}

type FormValues = {
  id?: string;
  locale: string;
  is_active: boolean;
  is_featured: boolean;
  display_order: string;
  module_key: string;
  source_type: string;
  source_id: string;
  cover_image: string;
  cover_asset_id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_alt: string;
  meta_title: string;
  meta_description: string;
  replicate_all_locales: boolean;
  apply_all_locales: boolean;
};

const emptyForm = (locale: string): FormValues => ({
  locale,
  is_active: true,
  is_featured: false,
  display_order: '0',
  module_key: 'kompozit',
  source_type: '',
  source_id: '',
  cover_image: '',
  cover_asset_id: '',
  title: '',
  slug: '',
  description: '',
  cover_image_alt: '',
  meta_title: '',
  meta_description: '',
  replicate_all_locales: false,
  apply_all_locales: false,
});

const dtoToForm = (dto: GalleryDto): FormValues => ({
  id: String((dto as any).id ?? ''),
  locale: normalizeLocale((dto as any).locale_resolved ?? (dto as any).locale ?? 'de'),
  is_active: isTruthyBoolLike((dto as any).is_active),
  is_featured: isTruthyBoolLike((dto as any).is_featured),
  display_order: String((dto as any).display_order ?? 0),
  module_key: norm((dto as any).module_key),
  source_type: norm((dto as any).source_type),
  source_id: norm((dto as any).source_id),
  cover_image: norm((dto as any).cover_image),
  cover_asset_id: norm((dto as any).cover_asset_id),
  title: norm((dto as any).title),
  slug: norm((dto as any).slug),
  description: norm((dto as any).description),
  cover_image_alt: norm((dto as any).cover_image_alt),
  meta_title: norm((dto as any).meta_title),
  meta_description: norm((dto as any).meta_description),
  replicate_all_locales: false,
  apply_all_locales: false,
});

export default function AdminGalleryDetailClient({ id }: { id: string }) {
  const t = useAdminT();
  const router = useRouter();
  const sp = useSearchParams();

  const isCreateMode = String(id) === 'new';

  const {
    localeOptions,
    defaultLocaleFromDb,
    loading: localesLoading,
    fetching: localesFetching,
  } = useAdminLocales();

  const apiLocaleFromDb = React.useMemo(() => {
    return resolveAdminApiLocale(localeOptions as any, defaultLocaleFromDb, 'de');
  }, [localeOptions, defaultLocaleFromDb]);

  const localeSet = React.useMemo(() => {
    return new Set(
      (localeOptions ?? []).map((x: any) => localeShortClient(x.value)).filter(Boolean),
    );
  }, [localeOptions]);

  const urlLocale = React.useMemo(() => {
    const q = sp?.get('locale');
    return localeShortClient(q) || '';
  }, [sp]);

  const [activeLocale, setActiveLocale] = React.useState<string>('');

  React.useEffect(() => {
    if (!localeOptions || localeOptions.length === 0) return;

    setActiveLocale((prev) => {
      const p = localeShortClient(prev);
      const u = localeShortClient(urlLocale);
      const def = localeShortClientOr(apiLocaleFromDb, 'de');

      const canUse = (l: string) => !!l && (localeSet.size === 0 || localeSet.has(l));

      if (p && canUse(p)) return p;
      if (u && canUse(u)) return u;
      if (def && canUse(def)) return def;

      const first = localeShortClient((localeOptions as any)?.[0]?.value);
      return first || 'de';
    });
  }, [localeOptions, localeSet, urlLocale, apiLocaleFromDb]);

  const queryLocale = React.useMemo(() => {
    const l = localeShortClient(activeLocale);
    if (l && (localeSet.size === 0 || localeSet.has(l))) return l;
    return localeShortClientOr(apiLocaleFromDb, 'de');
  }, [activeLocale, localeSet, apiLocaleFromDb]);

  React.useEffect(() => {
    const l = localeShortClient(activeLocale);
    if (!l) return;
    if (l === urlLocale) return;

    const params = new URLSearchParams(sp?.toString() || '');
    params.set('locale', l);

    if (isCreateMode) {
      router.replace(`/admin/gallery/new?${params.toString()}`);
    } else {
      router.replace(`/admin/gallery/${encodeURIComponent(String(id))}?${params.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLocale]);

  const localesReady = !localesLoading && !localesFetching;
  const hasLocales = (localeOptions?.length ?? 0) > 0;

  const shouldSkipDetail = isCreateMode || !isUuidLike(String(id || '')) || !queryLocale;

  const {
    data: gallery,
    isLoading: isLoadingRef,
    isFetching: isFetchingRef,
    error: refError,
    refetch,
  } = useGetGalleryAdminQuery(
    { id: String(id), locale: queryLocale } as any,
    { skip: shouldSkipDetail } as any,
  );

  const [createGallery, createState] = useCreateGalleryAdminMutation();
  const [updateGallery, updateState] = useUpdateGalleryAdminMutation();

  const loading = localesLoading || localesFetching || isLoadingRef || isFetchingRef;
  const saving = createState.isLoading || updateState.isLoading;
  const busy = loading || saving;

  const [values, setValues] = React.useState<FormValues>(() =>
    emptyForm(queryLocale || 'de'),
  );
  const [slugTouched, setSlugTouched] = React.useState(false);

  React.useEffect(() => {
    if (isCreateMode) {
      setValues(emptyForm(queryLocale || 'de'));
      return;
    }
    if (gallery) {
      setValues(dtoToForm(gallery));
      setSlugTouched(false);
    }
  }, [gallery, isCreateMode, queryLocale]);

  const disabled = loading || saving;

  const localeDisabled = disabled || localesLoading || (localeOptions ?? []).length === 0;

  const handleLocaleChange = (nextLocaleRaw: string) => {
    const next = normalizeLocale(nextLocaleRaw);
    const list = (localeOptions ?? []).map((x: any) => localeShortClient(x.value));
    const resolved = next && list.includes(next) ? next : localeShortClientOr(queryLocale, 'de');

    if (!resolved) {
      toast.error(t('admin.gallery.form.localeRequired'));
      return;
    }

    setValues((prev) => ({ ...prev, locale: resolved }));
    setActiveLocale(resolved);
  };

  function onCancel() {
    router.push(`/admin/gallery?locale=${encodeURIComponent(queryLocale || 'de')}`);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;

    const loc = normalizeLocale(values.locale || queryLocale || apiLocaleFromDb);
    if (!loc || (localeSet.size > 0 && !localeSet.has(localeShortClient(loc)))) {
      toast.error(t('admin.gallery.formHeader.localeError'));
      return;
    }

    if (!values.title.trim() || !values.slug.trim()) {
      toast.error(t('admin.gallery.formHeader.titleSlugRequired'));
      return;
    }

    const common: GalleryUpsertPayload = {
      locale: loc,
      is_active: values.is_active ? 1 : 0,
      is_featured: values.is_featured ? 1 : 0,
      display_order: Number(values.display_order) || 0,
      module_key: toNull(values.module_key),
      source_type: toNull(values.source_type),
      source_id: toNull(values.source_id),
      cover_image: toNull(values.cover_image),
      cover_asset_id: toNull(values.cover_asset_id),
      title: values.title.trim(),
      slug: values.slug.trim(),
      description: toNull(values.description),
      cover_image_alt: toNull(values.cover_image_alt),
      meta_title: toNull(values.meta_title),
      meta_description: toNull(values.meta_description),
    };

    try {
      if (isCreateMode) {
        const payload = { ...common, replicate_all_locales: values.replicate_all_locales };
        const created = await createGallery(payload as any).unwrap();
        const nextId = String((created as any)?.id ?? '').trim();

        if (!isUuidLike(nextId)) {
          toast.error(t('admin.gallery.formHeader.createdNoId'));
          return;
        }

        toast.success(t('admin.gallery.formHeader.created'));
        router.replace(
          `/admin/gallery/${encodeURIComponent(nextId)}?locale=${encodeURIComponent(loc)}`,
        );
        router.refresh();
        return;
      }

      const currentId = String((gallery as any)?.id ?? id);
      if (!isUuidLike(currentId)) {
        toast.error(t('admin.gallery.formHeader.idNotFound'));
        return;
      }

      const patch = { ...common, apply_all_locales: values.apply_all_locales };
      await updateGallery({ id: currentId, patch } as any).unwrap();
      toast.success(t('admin.gallery.formHeader.updated'));

      const short = localeShortClient(loc);
      if (short && short !== queryLocale) setActiveLocale(short);
    } catch (err) {
      toast.error(getErrMessage(err, t('admin.gallery.formHeader.defaultError')));
    }
  }

  const imageMetadata = React.useMemo(
    () => ({
      module_key: 'gallery',
      locale: queryLocale,
      gallery_slug: values.slug || values.title || '',
      ...(values.id ? { gallery_id: values.id } : {}),
    }),
    [queryLocale, values.slug, values.title, values.id],
  );

  // Guards
  if (localesReady && !hasLocales) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">{t('admin.gallery.formHeader.noLocalesTitle')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('admin.gallery.formHeader.noLocalesDescription')}
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <Button variant="outline" onClick={() => router.push('/admin/site-settings')}>
              {t('admin.gallery.formHeader.goToSettings')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isCreateMode && !isUuidLike(String(id || ''))) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">{t('admin.gallery.formHeader.invalidIdTitle')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('admin.gallery.formHeader.invalidIdDescription')}{' '}
            <code>{String(id || '-')}</code>
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="mr-2 size-4" />
              {t('admin.gallery.formHeader.backToList')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isCreateMode && !loading && !gallery && refError) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">{t('admin.gallery.formHeader.notFoundTitle')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('admin.gallery.formHeader.notFoundDescription')}{' '}
            <code>{String(id)}</code>
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="mr-2 size-4" />
              {t('admin.gallery.formHeader.backToList')}
            </Button>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCcw className="mr-2 size-4" />
              {t('admin.gallery.formHeader.retryButton')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pageTitle = isCreateMode
    ? t('admin.gallery.formHeader.createTitle')
    : (gallery as any)?.title || t('admin.gallery.formHeader.editTitle');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => router.back()} disabled={busy}>
              <ArrowLeft className="mr-2 size-4" />
              {t('admin.gallery.formHeader.backButton')}
            </Button>
            <h1 className="text-lg font-semibold">{pageTitle}</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('admin.gallery.formHeader.description')}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{t('admin.gallery.formHeader.activeLocale')}</span>
            <Badge variant="secondary">{queryLocale || '-'}</Badge>
            {isCreateMode ? <Badge>CREATE</Badge> : <Badge variant="secondary">EDIT</Badge>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel} disabled={busy}>
            {t('admin.gallery.formHeader.cancelButton')}
          </Button>
          <Button form="gallery-form" type="submit" disabled={busy}>
            <Save className="mr-2 size-4" />
            {t('admin.gallery.formHeader.saveButton')}
          </Button>
        </div>
      </div>

      <form id="gallery-form" onSubmit={onSubmit} className="space-y-4">
        <Card>
          <CardHeader className="gap-2">
            <CardTitle className="text-base">
              {isCreateMode
                ? t('admin.gallery.form.createTitle')
                : t('admin.gallery.form.editTitle')}
            </CardTitle>
            <CardDescription>{t('admin.gallery.form.description')}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Tabs defaultValue="form">
              <TabsList>
                <TabsTrigger value="form">{t('admin.gallery.form.formTab')}</TabsTrigger>
                <TabsTrigger value="json">{t('admin.gallery.form.jsonTab')}</TabsTrigger>
                {!isCreateMode && (
                  <TabsTrigger value="images">{t('admin.gallery.form.imagesTab')}</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="json" className="mt-4">
                <AdminJsonEditor
                  value={values}
                  disabled={disabled}
                  onChange={(next) => setValues(next as FormValues)}
                  label={t('admin.gallery.form.jsonLabel')}
                  helperText={t('admin.gallery.form.jsonHelperText')}
                />
              </TabsContent>

              <TabsContent value="form" className="mt-4">
                <div className="grid gap-6 lg:grid-cols-12">
                  {/* LEFT */}
                  <div className="space-y-4 lg:col-span-8">
                    {/* Locale + flags */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>{t('admin.gallery.form.localeLabel')}</Label>
                        <Select
                          value={normalizeLocale(values.locale) || ''}
                          onValueChange={handleLocaleChange}
                          disabled={localeDisabled}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t('admin.gallery.form.localePlaceholder')}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {(localeOptions ?? []).map((opt: any) => (
                              <SelectItem
                                key={`${opt.value}:${opt.label}`}
                                value={String(opt.value)}
                              >
                                {String(opt.label ?? opt.value)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-end gap-4 md:col-span-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="gal_is_active"
                            checked={!!values.is_active}
                            onCheckedChange={(v) =>
                              setValues((prev) => ({ ...prev, is_active: v === true }))
                            }
                            disabled={disabled}
                          />
                          <Label htmlFor="gal_is_active">
                            {t('admin.gallery.form.activeLabel')}
                          </Label>
                        </div>

                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="gal_is_featured"
                            checked={!!values.is_featured}
                            onCheckedChange={(v) =>
                              setValues((prev) => ({ ...prev, is_featured: v === true }))
                            }
                            disabled={disabled}
                          />
                          <Label htmlFor="gal_is_featured">
                            {t('admin.gallery.form.featuredLabel')}
                          </Label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* title + slug */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{t('admin.gallery.form.titleLabel')}</Label>
                        <Input
                          value={values.title}
                          onChange={(e) => {
                            const titleVal = e.target.value;
                            setValues((prev) => {
                              const next = { ...prev, title: titleVal };
                              if (!slugTouched) next.slug = slugify(titleVal);
                              return next;
                            });
                          }}
                          disabled={disabled}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{t('admin.gallery.form.slugLabel')}</Label>
                        <Input
                          value={values.slug}
                          onFocus={() => setSlugTouched(true)}
                          onChange={(e) => {
                            setSlugTouched(true);
                            setValues((prev) => ({ ...prev, slug: e.target.value }));
                          }}
                          disabled={disabled}
                        />
                      </div>
                    </div>

                    {/* module_key + source */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>{t('admin.gallery.form.moduleKeyLabel')}</Label>
                        <Input
                          value={values.module_key}
                          onChange={(e) =>
                            setValues((prev) => ({ ...prev, module_key: e.target.value }))
                          }
                          disabled={disabled}
                          placeholder="kompozit"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{t('admin.gallery.form.sourceTypeLabel')}</Label>
                        <Input
                          value={values.source_type}
                          onChange={(e) =>
                            setValues((prev) => ({ ...prev, source_type: e.target.value }))
                          }
                          disabled={disabled}
                          placeholder="product, category..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{t('admin.gallery.form.sourceIdLabel')}</Label>
                        <Input
                          value={values.source_id}
                          onChange={(e) =>
                            setValues((prev) => ({ ...prev, source_id: e.target.value }))
                          }
                          disabled={disabled}
                        />
                      </div>
                    </div>

                    {/* description */}
                    <div className="space-y-2">
                      <Label>{t('admin.gallery.form.descriptionLabel')}</Label>
                      <Textarea
                        rows={3}
                        value={values.description}
                        onChange={(e) =>
                          setValues((prev) => ({ ...prev, description: e.target.value }))
                        }
                        disabled={disabled}
                      />
                    </div>

                    {/* SEO */}
                    <Separator />
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{t('admin.gallery.form.metaTitleLabel')}</Label>
                        <Input
                          value={values.meta_title}
                          onChange={(e) =>
                            setValues((p) => ({ ...p, meta_title: e.target.value }))
                          }
                          disabled={disabled}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('admin.gallery.form.imageAltLabel')}</Label>
                        <Input
                          value={values.cover_image_alt}
                          onChange={(e) =>
                            setValues((p) => ({ ...p, cover_image_alt: e.target.value }))
                          }
                          disabled={disabled}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{t('admin.gallery.form.metaDescriptionLabel')}</Label>
                      <Textarea
                        rows={2}
                        value={values.meta_description}
                        onChange={(e) =>
                          setValues((p) => ({ ...p, meta_description: e.target.value }))
                        }
                        disabled={disabled}
                      />
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="space-y-4 lg:col-span-4">
                    <div className="space-y-2">
                      <Label>{t('admin.gallery.form.displayOrderLabel')}</Label>
                      <Input
                        type="number"
                        min={0}
                        value={values.display_order}
                        onChange={(e) =>
                          setValues((p) => ({ ...p, display_order: e.target.value }))
                        }
                        disabled={disabled}
                      />
                    </div>

                    <AdminImageUploadField
                      label={t('admin.gallery.formImage.coverLabel')}
                      helperText={t('admin.gallery.formImage.coverHelperText')}
                      bucket="public"
                      folder="gallery"
                      metadata={imageMetadata}
                      value={norm(values.cover_image)}
                      onChange={(url) =>
                        setValues((prev) => ({ ...prev, cover_image: norm(url) }))
                      }
                      disabled={disabled}
                      openLibraryHref="/admin/storage"
                      onOpenLibraryClick={() => router.push('/admin/storage')}
                    />

                    <Separator />

                    <div className="space-y-3">
                      <div className="text-sm font-medium">
                        {t('admin.gallery.form.multiLocaleTitle')}
                      </div>

                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="gal_replicate_all"
                          checked={!!values.replicate_all_locales}
                          onCheckedChange={(v) =>
                            setValues((p) => ({ ...p, replicate_all_locales: v === true }))
                          }
                          disabled={disabled}
                        />
                        <div className="space-y-1">
                          <Label htmlFor="gal_replicate_all" className="leading-none">
                            {t('admin.gallery.form.replicateAllLocales')}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            <code>replicate_all_locales</code>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="gal_apply_all"
                          checked={!!values.apply_all_locales}
                          onCheckedChange={(v) =>
                            setValues((p) => ({ ...p, apply_all_locales: v === true }))
                          }
                          disabled={disabled}
                        />
                        <div className="space-y-1">
                          <Label htmlFor="gal_apply_all" className="leading-none">
                            {t('admin.gallery.form.applyAllLocales')}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            <code>apply_all_locales</code>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {!isCreateMode && (
                <TabsContent value="images" className="mt-4">
                  <GalleryImagesTab
                    galleryId={String((gallery as any)?.id ?? id)}
                    locale={queryLocale || 'de'}
                    disabled={disabled}
                  />
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
