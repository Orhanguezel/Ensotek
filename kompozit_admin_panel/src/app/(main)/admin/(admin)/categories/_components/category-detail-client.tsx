// =============================================================
// FILE: src/app/(main)/admin/(admin)/categories/[id]/CategoryDetailClient.tsx
// Category Detail/Edit Form — JSON + i18n Support
// Ensotek
// =============================================================

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  useGetCategoryAdminQuery,
  useCreateCategoryAdminMutation,
  useUpdateCategoryAdminMutation,
} from '@/integrations/endpoints/admin/categories_admin.endpoints';

interface Props {
  id: string;
}

export default function CategoryDetailClient({ id }: Props) {
  const t = useAdminT('admin.categories');
  const router = useRouter();
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const isNew = id === 'new';

  // Locale management
  const { localeOptions } = useAdminLocales();
  const [activeLocale, setActiveLocale] = React.useState<string>(adminLocale || 'tr');
  const [activeTab, setActiveTab] = React.useState<'form' | 'json'>('form');

  // RTK Query
  const { data: category, isFetching, refetch } = useGetCategoryAdminQuery(
    { id, locale: activeLocale },
    { skip: isNew }
  );

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryAdminMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryAdminMutation();

  // Form state
  const [formData, setFormData] = React.useState({
    name: '',
    slug: '',
    locale: activeLocale,
    module_key: 'product' as string,
    description: '',
    alt: '',
    image_url: '',
    storage_asset_id: '',
    icon: '',
    is_active: true,
    is_featured: false,
    display_order: 0,
    i18n_data: {} as Record<string, any>,
  });

  // Load data when editing/locale changes
  React.useEffect(() => {
    if (category && !isNew) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        locale: category.locale || activeLocale,
        module_key: category.module_key || 'product',
        description: category.description || '',
        alt: category.alt || '',
        image_url: category.image_url || '',
        storage_asset_id: category.storage_asset_id || '',
        icon: category.icon || '',
        is_active: category.is_active ?? true,
        is_featured: category.is_featured ?? false,
        display_order: category.display_order || 0,
        i18n_data: (category as any).i18n_data || {},
      });
    }
  }, [category, isNew, activeLocale]);

  React.useEffect(() => {
    if (!isNew && id) {
      refetch();
    }
  }, [activeLocale, id, isNew, refetch]);

  const handleBack = () => router.push('/admin/categories');

  const handleLocaleChange = (nextLocale: string) => {
    setActiveLocale(nextLocale);
    setFormData((prev) => ({ ...prev, locale: nextLocale }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      toast.error('Name ve Slug zorunludur');
      return;
    }

    try {
      const payload = { ...formData, locale: activeLocale };

      if (isNew) {
        await createCategory(payload).unwrap();
        toast.success('Kategori oluşturuldu');
      } else {
        await updateCategory({ id, patch: payload }).unwrap();
        toast.success('Kategori güncellendi');
      }
      router.push('/admin/categories');
    } catch (error: any) {
      const errMsg = error?.data?.error?.message || error?.message || 'Hata oluştu';
      toast.error(`Hata: ${errMsg}`);
    }
  };

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleJsonChange = (jsonData: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...jsonData }));
  };

  const handleImageChange = (url: string) => {
    setFormData((prev) => ({ ...prev, image_url: url }));
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
                  {isNew ? 'Yeni kategori oluştur' : `${category?.name || ''} düzenle`}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AdminLocaleSelect
                options={localesForSelect}
                value={activeLocale}
                onChange={handleLocaleChange}
                disabled={isLoading}
              />
            </div>
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

        {/* Form Tab */}
        <TabsContent value="form">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('table.name')} *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        disabled={isLoading}
                        placeholder="Örn: İndustrial Coolers"
                      />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                      <Label htmlFor="slug">{t('table.slug')} *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => handleChange('slug', e.target.value)}
                        disabled={isLoading}
                        placeholder="Örn: industrial-coolers"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Açıklama</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        disabled={isLoading}
                        rows={4}
                        placeholder="Kategori açıklaması"
                      />
                    </div>

                    {/* Module */}
                    <div className="space-y-2">
                      <Label htmlFor="module">{t('table.module')}</Label>
                      <Select
                        value={formData.module_key}
                        onValueChange={(v) => handleChange('module_key', v)}
                        disabled={isLoading}
                      >
                        <SelectTrigger id="module">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product">{t('modules.product')}</SelectItem>
                          <SelectItem value="services">{t('modules.services')}</SelectItem>
                          <SelectItem value="news">{t('modules.news')}</SelectItem>
                          <SelectItem value="library">{t('modules.library')}</SelectItem>
                          <SelectItem value="about">{t('modules.about')}</SelectItem>
                          <SelectItem value="sparepart">{t('modules.sparepart')}</SelectItem>
                          <SelectItem value="references">{t('modules.references')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Icon & Alt */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="icon">Icon</Label>
                        <Input
                          id="icon"
                          value={formData.icon}
                          onChange={(e) => handleChange('icon', e.target.value)}
                          disabled={isLoading}
                          placeholder="fa-cube"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alt">Alt Text</Label>
                        <Input
                          id="alt"
                          value={formData.alt}
                          onChange={(e) => handleChange('alt', e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Display Order */}
                    <div className="space-y-2">
                      <Label htmlFor="display_order">Sıralama</Label>
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
                          {t('table.active')}
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
                          {t('table.featured')}
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar - Image */}
                  <div className="space-y-6">
                    <AdminImageUploadField
                      label="Kategori Görseli"
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

        {/* JSON Tab */}
        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Kategori Verisi (JSON)</CardTitle>
              <CardDescription>
                Tüm kategori alanlarını JSON olarak düzenleyebilirsiniz.
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
                    label="Kategori Görseli"
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
