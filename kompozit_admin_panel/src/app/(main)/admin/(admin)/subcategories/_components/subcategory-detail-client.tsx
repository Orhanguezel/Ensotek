// =============================================================
// FILE: src/app/(main)/admin/(admin)/subcategories/_components/subcategory-detail-client.tsx
// Subcategory Detail/Edit Form — Shadcn/UI + RTK Query
// - Form Tab: tüm alanlar + görsel sidebar
// - JSON Tab: tüm formData + görsel sidebar
// Ensotek Admin Panel Standartı
// =============================================================

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, FileJson } from 'lucide-react';
import { useAdminT } from '@/app/(main)/admin/_components/common/useAdminT';
import { usePreferencesStore } from '@/stores/preferences/preferences-provider';
import { AdminLocaleSelect } from '@/app/(main)/admin/_components/common/AdminLocaleSelect';
import { AdminJsonEditor } from '@/app/(main)/admin/_components/common/AdminJsonEditor';
import { AdminImageUploadField } from '@/app/(main)/admin/_components/common/AdminImageUploadField';
import { useAdminLocales } from '@/app/(main)/admin/_components/common/useAdminLocales';
import { toast } from 'sonner';
import {
  useGetSubCategoryAdminQuery,
  useCreateSubCategoryAdminMutation,
  useUpdateSubCategoryAdminMutation,
} from '@/integrations/endpoints/admin/subcategories_admin.endpoints';
import { useListCategoriesAdminQuery } from '@/integrations/endpoints/admin/categories_admin.endpoints';

// ─── Props ───────────────────────────────────────────────────

interface Props {
  id: string;
}

// ─── Bileşen ─────────────────────────────────────────────────

export default function SubcategoryDetailClient({ id }: Props) {
  const t = useAdminT('admin.subcategories');
  const router = useRouter();
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const isNew = id === 'new';

  const { localeOptions } = useAdminLocales();
  const [activeLocale, setActiveLocale] = React.useState<string>(adminLocale || 'tr');
  const [activeTab, setActiveTab] = React.useState<'form' | 'json'>('form');

  // ── RTK Query ──
  const { data: item, isFetching, refetch } = useGetSubCategoryAdminQuery(
    { id, locale: activeLocale },
    { skip: isNew },
  );

  const { data: categories = [] } = useListCategoriesAdminQuery(
    { locale: activeLocale || 'tr', limit: 200 } as any,
  );

  const [createSubCategory, { isLoading: isCreating }] = useCreateSubCategoryAdminMutation();
  const [updateSubCategory, { isLoading: isUpdating }] = useUpdateSubCategoryAdminMutation();

  // ── Form state ──
  const [formData, setFormData] = React.useState({
    locale: activeLocale,
    name: '',
    slug: '',
    description: '',
    category_id: '',
    icon: '',
    alt: '',
    image_url: '',
    storage_asset_id: '',
    is_active: true,
    is_featured: false,
    display_order: 0,
  });

  // ── Veri yüklenince formData'yı doldur ──
  React.useEffect(() => {
    if (item && !isNew) {
      setFormData({
        locale: item.locale || activeLocale,
        name: item.name || '',
        slug: item.slug || '',
        description: item.description || '',
        category_id: item.category_id ? String(item.category_id) : '',
        icon: item.icon || '',
        alt: item.alt || '',
        image_url: item.image_url || '',
        storage_asset_id: item.storage_asset_id || '',
        is_active: item.is_active ?? true,
        is_featured: item.is_featured ?? false,
        display_order: item.display_order ?? 0,
      });
    }
  }, [item, isNew]); // activeLocale kasıtlı olarak dışarıda — locale değişince formData sıfırlanmasın

  // ── Locale değişince yeniden çek ──
  React.useEffect(() => {
    if (!isNew && id) refetch();
  }, [activeLocale, id, isNew, refetch]);

  // ── Auto-slug ──
  const [slugTouched, setSlugTouched] = React.useState(false);
  React.useEffect(() => {
    if (!isNew || slugTouched) return;
    const slug = formData.name
      .toLowerCase()
      .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
      .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((prev) => ({ ...prev, slug }));
  }, [formData.name, isNew, slugTouched]);

  // ── Handler'lar ──
  const handleBack = () => router.push('/admin/subcategories');

  const handleLocaleChange = (next: string) => {
    setActiveLocale(next);
    setFormData((prev) => ({ ...prev, locale: next }));
  };

  const handleChange = (field: string, value: unknown) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleJsonChange = (json: Record<string, any>) =>
    setFormData((prev) => ({ ...prev, ...json }));

  const handleImageChange = (url: string) =>
    setFormData((prev) => ({ ...prev, image_url: url }));

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Ad (name) zorunludur');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('Slug zorunludur');
      return;
    }
    if (!formData.category_id) {
      toast.error('Üst kategori seçilmelidir');
      return;
    }

    const payload = {
      locale: activeLocale,
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description || undefined,
      category_id: formData.category_id,
      icon: formData.icon || undefined,
      alt: formData.alt || undefined,
      image_url: formData.image_url || undefined,
      storage_asset_id: formData.storage_asset_id || undefined,
      is_active: formData.is_active,
      is_featured: formData.is_featured,
      display_order: formData.display_order,
    };

    try {
      if (isNew) {
        const result = await createSubCategory(payload).unwrap();
        toast.success('Alt kategori oluşturuldu');
        if (result?.id) {
          router.push(`/admin/subcategories/${result.id}`);
        }
      } else {
        await updateSubCategory({ id, patch: payload }).unwrap();
        toast.success('Alt kategori güncellendi');
      }
    } catch (error: any) {
      const msg = error?.data?.error?.message || error?.message || 'Hata oluştu';
      toast.error(`Hata: ${msg}`);
    }
  };

  const isLoading = isFetching || isCreating || isUpdating;

  const localesForSelect = React.useMemo(() => {
    return (localeOptions || []).map((l: any) => ({
      value: String(l.value || ''),
      label: String(l.label || l.value || ''),
    }));
  }, [localeOptions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-base">
                  {isNew ? t('actions.create') : t('actions.edit')}
                </CardTitle>
                <CardDescription>
                  {isNew ? 'Yeni alt kategori oluştur' : `${item?.name || ''} düzenle`}
                </CardDescription>
              </div>
            </div>
            <AdminLocaleSelect
              options={localesForSelect}
              value={activeLocale}
              onChange={handleLocaleChange}
              disabled={isLoading}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'form' | 'json')}>
        <TabsList>
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="json">
            <FileJson className="h-4 w-4 mr-2" />
            JSON
          </TabsTrigger>
        </TabsList>

        {/* ── Form Tab ── */}
        <TabsContent value="form">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Main Column */}
                  <div className="lg:col-span-2 space-y-5">

                    {/* Üst Kategori */}
                    <div className="space-y-2">
                      <Label htmlFor="category_id">{t('form.category')} *</Label>
                      <Select
                        key={`cat-${formData.category_id || 'empty'}-${categories.length > 0 ? 'loaded' : 'loading'}`}
                        value={formData.category_id || 'none'}
                        onValueChange={(v) => handleChange('category_id', v === 'none' ? '' : v)}
                        disabled={isLoading}
                      >
                        <SelectTrigger id="category_id">
                          <SelectValue placeholder="Kategori seçin..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">— Seçiniz —</SelectItem>
                          {categories.map((cat: any) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.name || cat.slug}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Ad */}
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('form.name')} *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        disabled={isLoading}
                        placeholder={t('form.namePlaceholder')}
                      />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => {
                          setSlugTouched(true);
                          handleChange('slug', e.target.value);
                        }}
                        disabled={isLoading}
                        placeholder={t('form.slugPlaceholder')}
                      />
                    </div>

                    {/* Açıklama */}
                    <div className="space-y-2">
                      <Label htmlFor="description">{t('form.description')}</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        disabled={isLoading}
                        rows={3}
                        placeholder={t('form.descriptionPlaceholder')}
                      />
                    </div>

                    {/* İkon + Alt */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="icon">{t('form.icon')}</Label>
                        <Input
                          id="icon"
                          value={formData.icon}
                          onChange={(e) => handleChange('icon', e.target.value)}
                          disabled={isLoading}
                          placeholder="fa-cube"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alt">{t('form.alt')}</Label>
                        <Input
                          id="alt"
                          value={formData.alt}
                          onChange={(e) => handleChange('alt', e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Sıralama */}
                    <div className="space-y-2">
                      <Label htmlFor="display_order">{t('form.displayOrder')}</Label>
                      <Input
                        id="display_order"
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => handleChange('display_order', Number(e.target.value))}
                        disabled={isLoading}
                      />
                    </div>

                    {/* Toggles */}
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <Switch
                          id="is_active"
                          checked={formData.is_active}
                          onCheckedChange={(v) => handleChange('is_active', v)}
                          disabled={isLoading}
                        />
                        <Label htmlFor="is_active" className="cursor-pointer">
                          {t('form.isActive')}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="is_featured"
                          checked={formData.is_featured}
                          onCheckedChange={(v) => handleChange('is_featured', v)}
                          disabled={isLoading}
                        />
                        <Label htmlFor="is_featured" className="cursor-pointer">
                          {t('form.isFeatured')}
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar – Görsel */}
                  <div className="space-y-4">
                    <AdminImageUploadField
                      label={t('form.image')}
                      value={formData.image_url}
                      onChange={handleImageChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
                    {t('actions.cancel')}
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {t('actions.save')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {/* ── JSON Tab ── */}
        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Alt Kategori Verisi (JSON)</CardTitle>
              <CardDescription>
                Tüm alt kategori alanlarını JSON olarak düzenleyebilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AdminJsonEditor
                    value={formData}
                    onChange={handleJsonChange}
                    disabled={isLoading}
                    height={500}
                  />
                </div>
                <div className="space-y-4">
                  <AdminImageUploadField
                    label={t('form.image')}
                    value={formData.image_url}
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
                  {t('actions.cancel')}
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {t('actions.save')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
