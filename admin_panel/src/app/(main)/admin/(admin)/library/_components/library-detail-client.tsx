// =============================================================
// Library Detail — Tab yapisi + AI Content Assist (Standardized)
// Icerik / Gorseller / SEO ic tab'lar + JSON dis tab
// Products modulu ile ayni standart
// =============================================================

"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, FileJson, Save } from "lucide-react";
import { toast } from "sonner";

import { AdminImageUploadField } from "@/app/(main)/admin/_components/common/AdminImageUploadField";
import { AdminJsonEditor } from "@/app/(main)/admin/_components/common/AdminJsonEditor";
import { AdminLocaleSelect } from "@/app/(main)/admin/_components/common/AdminLocaleSelect";
import { type AIAction, AIActionDropdown } from "@/app/(main)/admin/_components/common/AIActionDropdown";
import { AIResultsPanel } from "@/app/(main)/admin/_components/common/AIResultsPanel";
import { GooglePreview } from "@/app/(main)/admin/_components/common/GooglePreview";
import RichContentEditor from "@/app/(main)/admin/_components/common/RichContentEditor";
import { useAdminLocales } from "@/app/(main)/admin/_components/common/useAdminLocales";
import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { type LocaleContent, useAIContentAssist } from "@/app/(main)/admin/_components/common/useAIContentAssist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateLibraryAdminMutation,
  useGetLibraryAdminQuery,
  useUpdateLibraryAdminMutation,
} from "@/integrations/endpoints/admin/library_admin.endpoints";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { LibraryFilesSection } from "./library-files-section";
import { LibraryImagesSection } from "./library-images-section";

// --- Sabitler ---

const LIBRARY_TYPES = [
  { value: "brochure", label: "Brosur" },
  { value: "catalog", label: "Katalog" },
  { value: "manual", label: "Kilavuz" },
  { value: "technical", label: "Teknik Dokuman" },
  { value: "other", label: "Diger" },
];

// --- Props ---

interface Props {
  id: string;
}

// --- Bilesen ---

export default function LibraryDetailClient({ id }: Props) {
  const _t = useAdminT("admin.library");
  const router = useRouter();
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const isNew = id === "new";

  const { localeOptions } = useAdminLocales();
  const [activeLocale, setActiveLocale] = React.useState<string>(adminLocale || "tr");
  const [activeTab, setActiveTab] = React.useState<"form" | "json">("form");

  // AI
  const { assist: aiAssist, loading: aiLoading } = useAIContentAssist();
  const [aiResults, setAiResults] = React.useState<LocaleContent[] | null>(null);

  // RTK Query
  const {
    data: item,
    isFetching,
    refetch,
  } = useGetLibraryAdminQuery({ id, locale: activeLocale }, { skip: isNew });
  const [createLibrary, { isLoading: isCreating }] = useCreateLibraryAdminMutation();
  const [updateLibrary, { isLoading: isUpdating }] = useUpdateLibraryAdminMutation();

  // Form state
  const [formData, setFormData] = React.useState({
    locale: activeLocale,
    type: "other" as string,
    name: "",
    slug: "",
    description: "",
    image_alt: "",
    tags: "",
    image_url: "",
    image_asset_id: "",
    featured_image: "",
    category_id: "",
    sub_category_id: "",
    display_order: 0,
    is_active: true,
    is_published: true,
    featured: false,
    published_at: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
  });

  React.useEffect(() => {
    if (item && !isNew) {
      setFormData({
        locale: item.locale || activeLocale,
        type: item.type || "other",
        name: item.name || "",
        slug: item.slug || "",
        description: item.description || "",
        image_alt: item.image_alt || "",
        tags: item.tags || "",
        image_url: item.image_url || "",
        image_asset_id: item.image_asset_id || "",
        featured_image: item.featured_image || "",
        category_id: item.category_id || "",
        sub_category_id: item.sub_category_id || "",
        display_order: item.display_order ?? 0,
        is_active: item.is_active === 1,
        is_published: item.is_published === 1,
        featured: item.featured === 1,
        published_at: item.published_at || "",
        meta_title: item.meta_title || "",
        meta_description: item.meta_description || "",
        meta_keywords: item.meta_keywords || "",
      });
    }
  }, [item, isNew, activeLocale]);

  React.useEffect(() => {
    if (!isNew && id) refetch();
  }, [id, isNew, refetch]);

  const handleBack = () => router.push("/admin/library");
  const handleLocaleChange = (next: string) => {
    setActiveLocale(next);
    setFormData((p) => ({ ...p, locale: next }));
  };
  const handleChange = (field: string, value: unknown) => setFormData((p) => ({ ...p, [field]: value }));

  const localesForSelect = React.useMemo(
    () =>
      (localeOptions || []).map((l: any) => ({
        value: String(l.value || ""),
        label: String(l.label || l.value || ""),
      })),
    [localeOptions],
  );

  // AI handler
  const handleAIAction = async (action: AIAction) => {
    const targetLocales = (localesForSelect || []).map((l) => l.value).filter(Boolean);
    if (!targetLocales.length) targetLocales.push(activeLocale || "tr");
    const result = await aiAssist({
      title: formData.name,
      summary: formData.description,
      content: formData.description,
      tags: formData.tags,
      locale: activeLocale,
      target_locales: targetLocales,
      module_key: "library",
      action,
    });
    if (!result) return;
    setAiResults(result);
    const current = result.find((r) => r.locale === activeLocale) || result[0];
    if (current) {
      setFormData((prev) => ({
        ...prev,
        name: current.title || prev.name,
        slug: current.slug || prev.slug,
        description: current.content || current.summary || prev.description,
        meta_title: current.meta_title || prev.meta_title,
        meta_description: current.meta_description || prev.meta_description,
        tags: current.tags || prev.tags,
      }));
    }
  };

  const handleApplyAILocale = (lc: LocaleContent) => {
    setActiveLocale(lc.locale);
    setFormData((prev) => ({
      ...prev,
      locale: lc.locale,
      name: lc.title || "",
      slug: lc.slug || prev.slug,
      description: lc.content || lc.summary || "",
      meta_title: lc.meta_title || "",
      meta_description: lc.meta_description || "",
      tags: lc.tags || "",
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Ad zorunludur");
      return;
    }

    const payload = {
      locale: activeLocale,
      type: formData.type || "other",
      name: formData.name.trim() || undefined,
      slug: formData.slug.trim() || formData.name.trim().toLowerCase().replace(/\s+/g, "-"),
      description: formData.description || undefined,
      image_alt: formData.image_alt || undefined,
      tags: formData.tags || undefined,
      image_url: formData.image_url || null,
      image_asset_id: formData.image_asset_id || null,
      featured_image: formData.featured_image || null,
      category_id: formData.category_id || null,
      sub_category_id: formData.sub_category_id || null,
      display_order: formData.display_order ?? 0,
      is_active: formData.is_active,
      is_published: formData.is_published,
      featured: formData.featured,
      published_at: formData.published_at || null,
      meta_title: formData.meta_title || undefined,
      meta_description: formData.meta_description || undefined,
      meta_keywords: formData.meta_keywords || undefined,
    };

    try {
      if (isNew) {
        await createLibrary(payload).unwrap();
        toast.success("Kayit olusturuldu");
      } else {
        await updateLibrary({ id, patch: payload }).unwrap();
        toast.success("Kayit guncellendi");
      }
      router.push("/admin/library");
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.message || "Hata");
    }
  };

  const isLoading = isFetching || isCreating || isUpdating;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="font-semibold text-sm">{isNew ? "Yeni Kayit" : item?.name || "Kayit Duzenle"}</div>
                <div className="text-muted-foreground text-xs">{isNew ? "Yeni library kaydi olustur" : "Kaydi duzenle"}</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <AdminLocaleSelect
                options={localesForSelect}
                value={activeLocale}
                onChange={handleLocaleChange}
                disabled={isLoading}
              />
              <AIActionDropdown
                onAction={handleAIAction}
                loading={aiLoading}
                disabled={isLoading || !formData.name.trim()}
              />
              <Button size="sm" onClick={() => handleSubmit()} disabled={isLoading}>
                <Save className="mr-1.5 h-4 w-4" /> Kaydet
              </Button>
            </div>
          </div>
        </div>

        {/* AI Sonuclari */}
        {aiResults && aiResults.length > 1 && (
          <AIResultsPanel
            results={aiResults}
            currentLocale={activeLocale}
            onApply={handleApplyAILocale}
            onClose={() => setAiResults(null)}
          />
        )}

        {/* Ust Tab'lar */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <div className="border-b px-3">
            <TabsList className="h-auto bg-transparent p-0">
              <TabsTrigger
                value="form"
                className="rounded-none border-transparent border-b-2 data-[state=active]:border-primary"
              >
                Kayit
              </TabsTrigger>
              <TabsTrigger
                value="json"
                className="rounded-none border-transparent border-b-2 data-[state=active]:border-primary"
              >
                <FileJson className="mr-1.5 h-4 w-4" /> JSON
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Kayit Tab (ic tab'lar: Icerik / Gorseller / SEO) */}
          <TabsContent value="form" className="p-0">
            <LibraryFormTabs
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              isLoading={isLoading}
              isNew={isNew}
              libraryId={id}
              activeLocale={activeLocale}
            />
          </TabsContent>

          <TabsContent value="json" className="p-3">
            <AdminJsonEditor
              value={formData}
              onChange={(json) => setFormData((p) => ({ ...p, ...json }))}
              disabled={isLoading}
              height={500}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* -- Library Ic Tab'lar: Icerik / Gorseller / SEO -- */

function LibraryFormTabs({
  formData,
  setFormData,
  handleChange,
  isLoading,
  isNew,
  libraryId,
  activeLocale,
}: {
  formData: any;
  setFormData: any;
  handleChange: any;
  isLoading: boolean;
  isNew: boolean;
  libraryId: string;
  activeLocale: string;
}) {
  const [tab, setTab] = React.useState<"content" | "images" | "seo">("content");

  return (
    <div className="space-y-3 p-3">
      <div className="flex gap-1 border-b pb-2">
        {[
          { key: "content" as const, label: "Icerik" },
          { key: "images" as const, label: "Gorseller" },
          { key: "seo" as const, label: "SEO" },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            className={`rounded-t-md px-4 py-1.5 font-medium text-xs transition-colors ${
              tab === t.key
                ? "border border-b-0 bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Icerik */}
      {tab === "content" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Ad *</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isLoading}
                placeholder="Library basligi"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Slug</Label>
              <Input
                value={formData.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                disabled={isLoading}
                placeholder="library-slug"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Tip</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => handleChange("type", v)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LIBRARY_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Siralama</Label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) => handleChange("display_order", Number(e.target.value))}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Yayin Tarihi</Label>
              <Input
                type="datetime-local"
                value={formData.published_at}
                onChange={(e) => handleChange("published_at", e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Aciklama</Label>
            <RichContentEditor
              value={formData.description}
              onChange={(v) => handleChange("description", v)}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Gorsel Alt Text</Label>
              <Input
                value={formData.image_alt}
                onChange={(e) => handleChange("image_alt", e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Etiketler</Label>
              <Input
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                disabled={isLoading}
                placeholder="etiket1, etiket2"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(v) => handleChange("is_active", v)}
                disabled={isLoading}
              />
              <Label className="cursor-pointer text-xs">Aktif</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_published}
                onCheckedChange={(v) => handleChange("is_published", v)}
                disabled={isLoading}
              />
              <Label className="cursor-pointer text-xs">Yayinda</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.featured}
                onCheckedChange={(v) => handleChange("featured", v)}
                disabled={isLoading}
              />
              <Label className="cursor-pointer text-xs">One Cikan</Label>
            </div>
          </div>
        </div>
      )}

      {/* Gorseller */}
      {tab === "images" && (
        <div className="space-y-4">
          <AdminImageUploadField
            label="Kapak Gorseli"
            value={formData.image_url}
            onChange={(url) => setFormData((p: any) => ({ ...p, image_url: url }))}
            disabled={isLoading}
            folder="uploads/library"
            previewAspect="4x3"
            previewObjectFit="contain"
          />

          {!isNew && (
            <>
              <LibraryFilesSection libraryId={libraryId} locale={activeLocale} />
              <LibraryImagesSection
                libraryId={libraryId}
                locale={activeLocale}
                coverUrl={formData.image_url}
                onSelectAsCover={(url) => setFormData((p: any) => ({ ...p, image_url: url }))}
              />
            </>
          )}
        </div>
      )}

      {/* SEO */}
      {tab === "seo" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs">Meta Baslik</label>
              <Input
                value={formData.meta_title}
                onChange={(e) => handleChange("meta_title", e.target.value)}
                disabled={isLoading}
                placeholder="SEO basligi"
              />
              <p className="text-[10px] text-muted-foreground">{(formData.meta_title || "").length}/60</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs">Meta Anahtar Kelimeler</label>
              <Input
                value={formData.meta_keywords}
                onChange={(e) => handleChange("meta_keywords", e.target.value)}
                disabled={isLoading}
                placeholder="anahtar1, anahtar2"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-muted-foreground text-xs">Meta Aciklama</label>
            <Textarea
              value={formData.meta_description}
              onChange={(e) => handleChange("meta_description", e.target.value)}
              disabled={isLoading}
              rows={3}
              placeholder="max 155 karakter"
            />
            <p className="text-[10px] text-muted-foreground">{(formData.meta_description || "").length}/155</p>
          </div>
          <GooglePreview
            title={formData.meta_title || formData.name}
            url={`https://ensotek.de/bibliothek/${formData.slug || "library-slug"}`}
            description={formData.meta_description || formData.description?.replace(/<[^>]*>/g, "").slice(0, 155)}
            titleFallback={formData.name || "Library Basligi"}
          />
        </div>
      )}
    </div>
  );
}
