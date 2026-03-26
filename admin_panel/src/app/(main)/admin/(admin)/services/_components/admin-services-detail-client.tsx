// =============================================================
// Service Detail — Tab yapisi + AI Content Assist (Standardized)
// Icerik / Ozellikler / Gorseller / SEO ic tab'lar + JSON dis tab
// =============================================================

"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, FileJson, Save } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateServiceAdminMutation,
  useGetServiceAdminQuery,
  useUpdateServiceAdminMutation,
} from "@/integrations/hooks";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

function isUuidLike(v?: string) {
  return v ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v) : false;
}

export default function AdminServiceDetailClient({ id }: { id: string }) {
  const _t = useAdminT("admin.services");
  const router = useRouter();
  const isNew = id === "new";
  const adminLocale = usePreferencesStore((s) => s.adminLocale);

  const { localeOptions } = useAdminLocales();
  const [activeLocale, setActiveLocale] = React.useState(adminLocale || "tr");
  const [activeTab, setActiveTab] = React.useState<"form" | "json">("form");

  // AI
  const { assist: aiAssist, loading: aiLoading } = useAIContentAssist();
  const [aiResults, setAiResults] = React.useState<LocaleContent[] | null>(null);

  // RTK Query
  const {
    data: item,
    isFetching,
    refetch,
  } = useGetServiceAdminQuery({ id, locale: activeLocale } as any, { skip: isNew || !isUuidLike(id) } as any);
  const [createService, { isLoading: isCreating }] = useCreateServiceAdminMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceAdminMutation();

  // Form state
  const [f, setF] = React.useState({
    locale: "tr",
    name: "",
    slug: "",
    description: "",
    image_url: "",
    image_alt: "",
    images: [] as string[],
    is_active: true,
    featured: false,
    area: "",
    duration: "",
    maintenance: "",
    equipment: "",
    price: "",
    includes: "",
    warranty: "",
    tags: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    display_order: 0,
  });

  React.useEffect(() => {
    if (item && !isNew) {
      const s = item as any;
      setF({
        locale: s.locale || activeLocale,
        name: s.name || "",
        slug: s.slug || "",
        description: s.description || "",
        image_url: s.image_url || s.featured_image || "",
        image_alt: s.image_alt || s.alt || "",
        images: Array.isArray(s.images) ? s.images : [],
        is_active: s.is_active === 1 || s.is_active === true,
        featured: s.featured === 1 || s.featured === true,
        area: s.area || "",
        duration: s.duration || "",
        maintenance: s.maintenance || "",
        equipment: s.equipment || "",
        price: s.price || "",
        includes: s.includes || "",
        warranty: s.warranty || "",
        tags: Array.isArray(s.tags) ? s.tags.join(", ") : s.tags || "",
        meta_title: s.meta_title || "",
        meta_description: s.meta_description || "",
        meta_keywords: s.meta_keywords || "",
        display_order: s.display_order || 0,
      });
    }
  }, [item, isNew, activeLocale]);

  React.useEffect(() => {
    if (!isNew && id) refetch();
  }, [id, isNew, refetch]);

  const set = (field: string, value: unknown) => setF((p) => ({ ...p, [field]: value }));
  const isLoading = isFetching || isCreating || isUpdating;

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
    const targets = localesForSelect.map((l) => l.value).filter(Boolean);
    if (!targets.length) targets.push(activeLocale || "tr");
    const result = await aiAssist({
      title: f.name,
      summary: f.description,
      content: f.description,
      tags: f.tags,
      locale: activeLocale,
      target_locales: targets,
      module_key: "services",
      action,
    });
    if (!result) return;
    setAiResults(result);
    const cur = result.find((r) => r.locale === activeLocale) || result[0];
    if (cur)
      setF((p) => ({
        ...p,
        name: cur.title || p.name,
        slug: cur.slug || p.slug,
        description: cur.content || cur.summary || p.description,
        meta_title: cur.meta_title || p.meta_title,
        meta_description: cur.meta_description || p.meta_description,
        tags: cur.tags || p.tags,
      }));

    // Auto-save all locale results to backend
    if (!isNew && id && isUuidLike(id) && result.length > 0) {
      let saved = 0;
      for (const lc of result) {
        if (!lc.locale) continue;
        try {
          await updateService({
            id,
            patch: {
              locale: lc.locale,
              name: (lc.title || f.name).trim(),
              slug: (lc.slug || f.slug).trim() || (lc.title || f.name).trim().toLowerCase().replace(/\s+/g, "-"),
              description: lc.content || lc.summary || f.description || undefined,
              image_url: f.image_url || null,
              featured_image: f.image_url || null,
              image_alt: f.image_alt || undefined,
              images: f.images || [],
              is_active: f.is_active,
              featured: f.featured,
              area: f.area || null,
              duration: f.duration || null,
              maintenance: f.maintenance || null,
              equipment: f.equipment || null,
              price: f.price || null,
              includes: f.includes || null,
              warranty: f.warranty || null,
              tags: lc.tags || f.tags || null,
              meta_title: lc.meta_title || f.meta_title || null,
              meta_description: lc.meta_description || f.meta_description || null,
              meta_keywords: f.meta_keywords || null,
              display_order: f.display_order,
            },
          } as any).unwrap();
          saved++;
        } catch {
          // silent
        }
      }
      if (saved > 0) toast.success(`AI: ${saved} dil otomatik kaydedildi`);
    }
  };

  const handleApplyAILocale = (lc: LocaleContent) => {
    setActiveLocale(lc.locale);
    setF((p) => ({
      ...p,
      locale: lc.locale,
      name: lc.title,
      slug: lc.slug || p.slug,
      description: lc.content || lc.summary,
      meta_title: lc.meta_title,
      meta_description: lc.meta_description,
      tags: lc.tags,
    }));
  };

  const handleSubmit = async () => {
    if (!f.name.trim()) {
      toast.error("Ad zorunludur");
      return;
    }
    const payload: any = {
      locale: activeLocale,
      name: f.name.trim(),
      slug: f.slug.trim() || f.name.trim().toLowerCase().replace(/\s+/g, "-"),
      description: f.description || undefined,
      image_url: f.image_url || null,
      featured_image: f.image_url || null,
      image_alt: f.image_alt || undefined,
      images: f.images || [],
      is_active: f.is_active,
      featured: f.featured,
      area: f.area || null,
      duration: f.duration || null,
      maintenance: f.maintenance || null,
      equipment: f.equipment || null,
      price: f.price || null,
      includes: f.includes || null,
      warranty: f.warranty || null,
      tags: f.tags || null,
      meta_title: f.meta_title || null,
      meta_description: f.meta_description || null,
      meta_keywords: f.meta_keywords || null,
      display_order: f.display_order,
    };
    try {
      if (isNew) {
        const result = await createService(payload).unwrap();
        toast.success("Hizmet olusturuldu");
        if ((result as any)?.id) router.push(`/admin/services/${(result as any).id}?locale=${activeLocale}`);
      } else {
        await updateService({ id, patch: payload } as any).unwrap();
        toast.success("Hizmet guncellendi");
      }
    } catch (err: any) {
      toast.error(err?.data?.error?.message || "Hata");
    }
  };

  if (!isNew && !isUuidLike(id)) {
    return <div className="p-8 text-center text-muted-foreground">Gecersiz ID</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        {/* Header */}
        <div className="border-b p-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.push("/admin/services")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="font-semibold text-sm">
                  {isNew ? "Yeni Hizmet" : (item as any)?.name || "Hizmet Duzenle"}
                </div>
                <div className="text-muted-foreground text-xs">{isNew ? "Yeni hizmet olustur" : "Hizmeti duzenle"}</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <AdminLocaleSelect
                options={localesForSelect}
                value={activeLocale}
                onChange={(v) => {
                  setActiveLocale(v);
                  setF((p) => ({ ...p, locale: v }));
                }}
                disabled={isLoading}
              />
              <AIActionDropdown onAction={handleAIAction} loading={aiLoading} disabled={isLoading || !f.name.trim()} />
              <Button size="sm" onClick={handleSubmit} disabled={isLoading}>
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <div className="border-b px-3">
            <TabsList className="h-auto bg-transparent p-0">
              <TabsTrigger
                value="form"
                className="rounded-none border-transparent border-b-2 data-[state=active]:border-primary"
              >
                Hizmet
              </TabsTrigger>
              <TabsTrigger
                value="json"
                className="rounded-none border-transparent border-b-2 data-[state=active]:border-primary"
              >
                <FileJson className="mr-1.5 h-4 w-4" /> JSON
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="form" className="p-0">
            <ServiceFormTabs f={f} setF={setF} set={set} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="json" className="p-3">
            <AdminJsonEditor
              value={f}
              onChange={(json) => setF((p) => ({ ...p, ...json }))}
              disabled={isLoading}
              height={500}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ── Ic Tab'lar: Icerik / Ozellikler / Gorseller / SEO ── */

function ServiceFormTabs({ f, setF, set, isLoading }: { f: any; setF: any; set: any; isLoading: boolean }) {
  const [tab, setTab] = React.useState<"content" | "specs" | "images" | "seo">("content");

  return (
    <div className="space-y-3 p-3">
      <div className="flex gap-1 border-b pb-2">
        {[
          { key: "content" as const, label: "Icerik" },
          { key: "specs" as const, label: "Ozellikler" },
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
                value={f.name}
                onChange={(e) => set("name", e.target.value)}
                disabled={isLoading}
                placeholder="Hizmet adi"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Slug</Label>
              <Input
                value={f.slug}
                onChange={(e) => set("slug", e.target.value)}
                disabled={isLoading}
                placeholder="hizmet-slug"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Aciklama</Label>
            <RichContentEditor value={f.description} onChange={(v) => set("description", v)} disabled={isLoading} />
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={f.is_active} onCheckedChange={(v) => set("is_active", v)} disabled={isLoading} />
              <Label className="cursor-pointer text-xs">Aktif</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={f.featured} onCheckedChange={(v) => set("featured", v)} disabled={isLoading} />
              <Label className="cursor-pointer text-xs">One Cikan</Label>
            </div>
          </div>
        </div>
      )}

      {/* Ozellikler */}
      {tab === "specs" && (
        <div className="max-w-lg space-y-3">
          <p className="text-muted-foreground text-xs">Dile gore degisen hizmet ozellikleri.</p>
          <div className="space-y-1.5">
            <Label className="text-xs">Hizmet Alani / Kapsami</Label>
            <Input value={f.area} onChange={(e) => set("area", e.target.value)} disabled={isLoading} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Hizmet Suresi</Label>
            <Input value={f.duration} onChange={(e) => set("duration", e.target.value)} disabled={isLoading} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Bakim Periyodu</Label>
            <Input value={f.maintenance} onChange={(e) => set("maintenance", e.target.value)} disabled={isLoading} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Kullanilan Ekipman</Label>
            <Input value={f.equipment} onChange={(e) => set("equipment", e.target.value)} disabled={isLoading} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Dahil Olan Hizmetler</Label>
            <Textarea
              value={f.includes}
              onChange={(e) => set("includes", e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Fiyat / Fiyat Bilgisi</Label>
            <Input value={f.price} onChange={(e) => set("price", e.target.value)} disabled={isLoading} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Garanti Kosullari</Label>
            <Textarea
              value={f.warranty}
              onChange={(e) => set("warranty", e.target.value)}
              disabled={isLoading}
              rows={2}
            />
          </div>
        </div>
      )}

      {/* Gorseller — ImagesGalleryTab */}
      {tab === "images" && (
        <ImagesGalleryTab
          coverUrl={f.image_url}
          coverAlt={f.image_alt}
          images={f.images}
          onCoverChange={(url) => set("image_url", url)}
          onCoverAltChange={(alt) => set("image_alt", alt)}
          onImagesChange={(urls) => {
            setF((p: any) => ({ ...p, images: urls }));
            if (!f.image_url && urls.length > 0) set("image_url", urls[0]);
          }}
          disabled={isLoading}
          folder="uploads/services"
        />
      )}

      {/* SEO — GooglePreview */}
      {tab === "seo" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs">Meta Baslik</label>
              <Input
                value={f.meta_title}
                onChange={(e) => set("meta_title", e.target.value)}
                disabled={isLoading}
                placeholder="SEO basligi"
              />
              <p className="text-[10px] text-muted-foreground">{(f.meta_title || "").length}/60</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs">Etiketler</label>
              <Input
                value={f.tags}
                onChange={(e) => set("tags", e.target.value)}
                disabled={isLoading}
                placeholder="etiket1, etiket2"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-muted-foreground text-xs">Meta Aciklama</label>
            <Textarea
              value={f.meta_description}
              onChange={(e) => set("meta_description", e.target.value)}
              disabled={isLoading}
              rows={3}
              placeholder="max 155 karakter"
            />
            <p className="text-[10px] text-muted-foreground">{(f.meta_description || "").length}/155</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-muted-foreground text-xs">Meta Anahtar Kelimeler</label>
            <Input
              value={f.meta_keywords}
              onChange={(e) => set("meta_keywords", e.target.value)}
              disabled={isLoading}
            />
          </div>
          <GooglePreview
            title={f.meta_title || f.name}
            url={`https://ensotek.de/dienstleistungen/${f.slug || "hizmet-slug"}`}
            description={f.meta_description || f.description?.replace(/<[^>]*>/g, "").slice(0, 155)}
            titleFallback={f.name || "Hizmet"}
          />
        </div>
      )}
    </div>
  );
}
