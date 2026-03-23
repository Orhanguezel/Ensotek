// =============================================================
// Product Detail — Tab yapisi + AI Content Assist (Standardized)
// Icerik / Gorseller / SEO ic tab'lar
// Ozellikler / SSS / Degerlendirmeler / JSON dis tab'lar
// =============================================================

"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, FileJson, HelpCircle, ListChecks, Save, Star } from "lucide-react";
import { toast } from "sonner";

import { AdminJsonEditor } from "@/app/(main)/admin/_components/common/AdminJsonEditor";
import { AdminLocaleSelect } from "@/app/(main)/admin/_components/common/AdminLocaleSelect";
import { type AIAction, AIActionDropdown } from "@/app/(main)/admin/_components/common/AIActionDropdown";
import { AIResultsPanel } from "@/app/(main)/admin/_components/common/AIResultsPanel";
import { GooglePreview } from "@/app/(main)/admin/_components/common/GooglePreview";
import { ImagesGalleryTab } from "@/app/(main)/admin/_components/common/ImagesGalleryTab";
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
  useCreateProductAdminMutation,
  useGetProductAdminQuery,
  useListProductCategoriesAdminQuery,
  useListProductSubcategoriesAdminQuery,
  useUpdateProductAdminMutation,
} from "@/integrations/endpoints/admin/products_admin.endpoints";
import type { ProductItemType } from "@/integrations/shared/product_admin.types";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { ProductFaqsTab } from "./product-faqs-tab";
import { ProductReviewsTab } from "./product-reviews-tab";
import { ProductSpecsTab } from "./product-specs-tab";

interface Props {
  id: string;
  itemType?: ProductItemType;
}

export default function ProductDetailClient({ id, itemType }: Props) {
  const _t = useAdminT("admin.products");
  const router = useRouter();
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const isNew = id === "new";
  const backUrl = itemType === "sparepart" ? "/admin/products?type=sparepart" : "/admin/products";

  const { localeOptions } = useAdminLocales();
  const [activeLocale, setActiveLocale] = React.useState<string>(adminLocale || "tr");
  const [activeTab, setActiveTab] = React.useState<"form" | "specs" | "faqs" | "reviews" | "json">("form");

  // AI
  const { assist: aiAssist, loading: aiLoading } = useAIContentAssist();
  const [aiResults, setAiResults] = React.useState<LocaleContent[] | null>(null);

  // RTK Query
  const {
    data: item,
    isFetching,
    refetch,
  } = useGetProductAdminQuery({ id, locale: activeLocale, item_type: itemType }, { skip: isNew });
  const { data: categories = [] } = useListProductCategoriesAdminQuery(
    { locale: activeLocale },
    { skip: !activeLocale },
  );
  const [createProduct, { isLoading: isCreating }] = useCreateProductAdminMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductAdminMutation();

  // Form state
  const [formData, setFormData] = React.useState({
    locale: activeLocale,
    title: "",
    slug: "",
    price: "" as string | number,
    stock_quantity: "" as string | number,
    product_code: "",
    description: "",
    image_alt: "",
    tags: "",
    category_id: "",
    sub_category_id: "",
    image_url: "",
    image_asset_id: "",
    images: [] as string[],
    is_active: true,
    is_featured: false,
    meta_title: "",
    meta_description: "",
  });

  const { data: subcategories = [] } = useListProductSubcategoriesAdminQuery(
    { category_id: formData.category_id, locale: activeLocale },
    { skip: !formData.category_id },
  );

  React.useEffect(() => {
    if (item && !isNew) {
      setFormData({
        locale: item.locale || activeLocale,
        title: item.title || "",
        slug: item.slug || "",
        price: item.price ?? "",
        stock_quantity: item.stock_quantity ?? "",
        product_code: item.product_code || "",
        description: item.description || "",
        image_alt: item.alt || "",
        tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
        category_id: item.category_id ? String(item.category_id) : "",
        sub_category_id: item.sub_category_id ? String(item.sub_category_id) : "",
        image_url: item.image_url || "",
        image_asset_id: item.storage_asset_id || "",
        images: Array.isArray((item as any).images) ? (item as any).images : [],
        is_active: item.is_active === 1 || item.is_active === true,
        is_featured: item.is_featured === 1 || item.is_featured === true,
        meta_title: item.meta_title || "",
        meta_description: item.meta_description || "",
      });
    }
  }, [item, isNew, activeLocale]);

  React.useEffect(() => {
    if (!isNew && id) refetch();
  }, [id, isNew, refetch]);

  const handleBack = () => router.push(backUrl);
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

  // AI handler — supports all 4 actions
  const handleAIAction = async (action: AIAction) => {
    const targetLocales = (localesForSelect || []).map((l) => l.value).filter(Boolean);
    if (!targetLocales.length) targetLocales.push(activeLocale || "tr");
    const result = await aiAssist({
      title: formData.title,
      summary: formData.description,
      content: formData.description,
      tags: formData.tags,
      locale: activeLocale,
      target_locales: targetLocales,
      module_key: "products",
      action,
    });
    if (!result) return;
    setAiResults(result);
    const current = result.find((r) => r.locale === activeLocale) || result[0];
    if (current) {
      setFormData((prev) => ({
        ...prev,
        title: current.title || prev.title,
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
      title: lc.title || "",
      slug: lc.slug || prev.slug,
      description: lc.content || lc.summary || "",
      meta_title: lc.meta_title || "",
      meta_description: lc.meta_description || "",
      tags: lc.tags || "",
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Baslik zorunludur");
      return;
    }
    const tagsArray = formData.tags
      ? formData.tags
          .toString()
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const payload = {
      locale: activeLocale,
      title: formData.title.trim(),
      slug: formData.slug.trim() || formData.title.trim().toLowerCase().replace(/\s+/g, "-"),
      price: formData.price !== "" ? Number(formData.price) : 0,
      stock_quantity: formData.stock_quantity !== "" ? Number(formData.stock_quantity) : undefined,
      product_code: formData.product_code || undefined,
      description: formData.description || undefined,
      alt: formData.image_alt || undefined,
      tags: tagsArray,
      category_id: formData.category_id || "",
      sub_category_id: formData.sub_category_id || null,
      image_url: formData.image_url || null,
      images: formData.images || [],
      storage_asset_id: formData.image_asset_id || null,
      is_active: formData.is_active,
      is_featured: formData.is_featured,
      meta_title: formData.meta_title || undefined,
      meta_description: formData.meta_description || undefined,
      item_type: isNew ? (itemType ?? "product") : undefined,
    };
    try {
      if (isNew) {
        const result = await createProduct(payload).unwrap();
        toast.success("Urun olusturuldu");
        if (result?.id) router.push(`/admin/products/${result.id}${itemType === "sparepart" ? "?type=sparepart" : ""}`);
      } else {
        await updateProduct({ id, patch: payload }).unwrap();
        toast.success("Urun guncellendi");
      }
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.message || "Hata");
    }
  };

  const isLoading = isFetching || isCreating || isUpdating;
  const productId = isNew ? undefined : id;

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
                <div className="font-semibold text-sm">{isNew ? "Yeni Urun" : item?.title || "Urun Duzenle"}</div>
                <div className="text-muted-foreground text-xs">{isNew ? "Yeni urun olustur" : "Urunu duzenle"}</div>
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
                disabled={isLoading || !formData.title.trim()}
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
                Urun
              </TabsTrigger>
              <TabsTrigger
                value="specs"
                disabled={isNew}
                className="rounded-none border-transparent border-b-2 data-[state=active]:border-primary"
              >
                <ListChecks className="mr-1.5 h-4 w-4" /> Ozellikler
              </TabsTrigger>
              <TabsTrigger
                value="faqs"
                disabled={isNew}
                className="rounded-none border-transparent border-b-2 data-[state=active]:border-primary"
              >
                <HelpCircle className="mr-1.5 h-4 w-4" /> SSS
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                disabled={isNew}
                className="rounded-none border-transparent border-b-2 data-[state=active]:border-primary"
              >
                <Star className="mr-1.5 h-4 w-4" /> Degerlendirmeler
              </TabsTrigger>
              <TabsTrigger
                value="json"
                className="rounded-none border-transparent border-b-2 data-[state=active]:border-primary"
              >
                <FileJson className="mr-1.5 h-4 w-4" /> JSON
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Urun Tab (ic tab'lar: Icerik / Gorseller / SEO) */}
          <TabsContent value="form" className="p-0">
            <ProductFormTabs
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              isLoading={isLoading}
              categories={categories}
              subcategories={subcategories}
            />
          </TabsContent>

          <TabsContent value="specs" className="p-3">
            {productId ? (
              <ProductSpecsTab productId={productId} locale={activeLocale} disabled={isLoading} />
            ) : (
              <div className="py-8 text-center text-muted-foreground text-sm">Once urunu kaydedin.</div>
            )}
          </TabsContent>

          <TabsContent value="faqs" className="p-3">
            {productId ? (
              <ProductFaqsTab productId={productId} locale={activeLocale} disabled={isLoading} />
            ) : (
              <div className="py-8 text-center text-muted-foreground text-sm">Once urunu kaydedin.</div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="p-3">
            {productId ? (
              <ProductReviewsTab productId={productId} disabled={isLoading} />
            ) : (
              <div className="py-8 text-center text-muted-foreground text-sm">Once urunu kaydedin.</div>
            )}
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

/* ── Urun Ic Tab'lar: Icerik / Gorseller / SEO ── */

function ProductFormTabs({
  formData,
  setFormData,
  handleChange,
  isLoading,
  categories,
  subcategories,
}: {
  formData: any;
  setFormData: any;
  handleChange: any;
  isLoading: boolean;
  categories: any[];
  subcategories: any[];
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
              <Label className="text-xs">Baslik *</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                disabled={isLoading}
                placeholder="Urun basligi"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Slug</Label>
              <Input
                value={formData.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                disabled={isLoading}
                placeholder="urun-slug"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Fiyat</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Stok</Label>
              <Input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => handleChange("stock_quantity", e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Urun Kodu</Label>
              <Input
                value={formData.product_code}
                onChange={(e) => handleChange("product_code", e.target.value)}
                disabled={isLoading}
                placeholder="SKU-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Kategori</Label>
              <Select
                value={formData.category_id || "none"}
                onValueChange={(v) => {
                  handleChange("category_id", v === "none" ? "" : v);
                  handleChange("sub_category_id", "");
                }}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori sec" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Sec —</SelectItem>
                  {categories.map((c: any) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name || c.slug}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.category_id && (
              <div className="space-y-1.5">
                <Label className="text-xs">Alt Kategori</Label>
                <Select
                  value={formData.sub_category_id || "none"}
                  onValueChange={(v) => handleChange("sub_category_id", v === "none" ? "" : v)}
                  disabled={isLoading || subcategories.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Alt kategori sec" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— Sec —</SelectItem>
                    {subcategories.map((s: any) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name || s.slug}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Aciklama</Label>
            <RichContentEditor
              value={formData.description}
              onChange={(v) => handleChange("description", v)}
              disabled={isLoading}
            />
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
                checked={formData.is_featured}
                onCheckedChange={(v) => handleChange("is_featured", v)}
                disabled={isLoading}
              />
              <Label className="cursor-pointer text-xs">One Cikan</Label>
            </div>
          </div>
        </div>
      )}

      {/* Gorseller — ImagesGalleryTab */}
      {tab === "images" && (
        <ImagesGalleryTab
          coverUrl={formData.image_url}
          coverAlt={formData.image_alt}
          images={formData.images}
          onCoverChange={(url) => setFormData((p: any) => ({ ...p, image_url: url }))}
          onCoverAltChange={(alt) => setFormData((p: any) => ({ ...p, image_alt: alt }))}
          onImagesChange={(urls) => {
            setFormData((p: any) => ({ ...p, images: urls }));
            if (!formData.image_url && urls.length > 0) setFormData((p: any) => ({ ...p, image_url: urls[0] }));
          }}
          disabled={isLoading}
          folder="uploads/products"
        />
      )}

      {/* SEO — GooglePreview */}
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
              <label className="text-muted-foreground text-xs">Etiketler</label>
              <Input
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                disabled={isLoading}
                placeholder="etiket1, etiket2"
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
            title={formData.meta_title || formData.title}
            url={`https://ensotek.de/produkte/${formData.slug || "urun-slug"}`}
            description={formData.meta_description || formData.description?.replace(/<[^>]*>/g, "").slice(0, 155)}
            titleFallback={formData.title || "Urun Basligi"}
          />
        </div>
      )}
    </div>
  );
}
