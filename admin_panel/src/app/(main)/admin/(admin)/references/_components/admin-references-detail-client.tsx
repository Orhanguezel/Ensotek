// =============================================================
// AdminReferenceDetailClient — Tab yapisi (Icerik / Gorseller / SEO) + AI
// =============================================================

"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ArrowLeft, RefreshCcw, Save } from "lucide-react";
import { toast } from "sonner";

import { AdminImageUploadField } from "@/app/(main)/admin/_components/common/AdminImageUploadField";
import { AdminJsonEditor } from "@/app/(main)/admin/_components/common/AdminJsonEditor";
import { AdminLocaleSelect } from "@/app/(main)/admin/_components/common/AdminLocaleSelect";
import { type AIAction, AIActionDropdown } from "@/app/(main)/admin/_components/common/AIActionDropdown";
import { AIResultsPanel } from "@/app/(main)/admin/_components/common/AIResultsPanel";
import { GooglePreview } from "@/app/(main)/admin/_components/common/GooglePreview";
import RichContentEditor from "@/app/(main)/admin/_components/common/RichContentEditor";
import { type LocaleContent, useAIContentAssist } from "@/app/(main)/admin/_components/common/useAIContentAssist";
import { useAdminLocales } from "@/app/(main)/admin/_components/common/useAdminLocales";
import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { resolveAdminApiLocale } from "@/i18n/adminLocale";
import { localeShortClient, localeShortClientOr } from "@/i18n/localeShortClient";
import {
  useCreateReferenceAdminMutation,
  useGetReferenceAdminQuery,
  useUpdateReferenceAdminMutation,
} from "@/integrations/hooks";
import type { ReferenceDto, ReferenceUpsertPayload } from "@/integrations/shared";

/* ── Helpers ── */

function isUuidLike(v?: string) {
  if (!v) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

const normalizeLocale = (v: unknown): string =>
  String(v ?? "").trim().toLowerCase().replace("_", "-").split("-")[0].trim();

const norm = (v: unknown) => String(v ?? "").trim();
const toNull = (v: unknown) => {
  const s = norm(v);
  return s || null;
};

const isTruthyBoolLike = (v: unknown) => v === true || v === 1 || v === "1" || v === "true";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[çÇ]/g, "c")
    .replace(/[ğĞ]/g, "g")
    .replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o")
    .replace(/[şŞ]/g, "s")
    .replace(/[üÜ]/g, "u")
    .replace(/[äÄ]/g, "ae")
    .replace(/[ß]/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function getErrMessage(err: unknown, fallback: string): string {
  const anyErr = err as any;
  return anyErr?.data?.error?.message || anyErr?.data?.message || anyErr?.error || fallback;
}

/* ── Types ── */

type FormValues = {
  id?: string;
  locale: string;
  is_published: boolean;
  is_featured: boolean;
  display_order: string;
  featured_image: string;
  featured_image_asset_id: string;
  website_url: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured_image_alt: string;
  meta_title: string;
  meta_description: string;
  tags: string;
};

const emptyForm = (locale: string): FormValues => ({
  locale,
  is_published: true,
  is_featured: false,
  display_order: "0",
  featured_image: "",
  featured_image_asset_id: "",
  website_url: "",
  title: "",
  slug: "",
  summary: "",
  content: "",
  featured_image_alt: "",
  meta_title: "",
  meta_description: "",
  tags: "",
});

const dtoToForm = (dto: ReferenceDto): FormValues => ({
  id: String((dto as any).id ?? ""),
  locale: normalizeLocale((dto as any).locale_resolved ?? (dto as any).locale ?? "tr"),
  is_published: isTruthyBoolLike((dto as any).is_published),
  is_featured: isTruthyBoolLike((dto as any).is_featured),
  display_order: String((dto as any).display_order ?? 0),
  featured_image: norm((dto as any).featured_image),
  featured_image_asset_id: norm((dto as any).featured_image_asset_id),
  website_url: norm((dto as any).website_url),
  title: norm((dto as any).title),
  slug: norm((dto as any).slug),
  summary: norm((dto as any).summary),
  content: norm((dto as any).content),
  featured_image_alt: norm((dto as any).featured_image_alt),
  meta_title: norm((dto as any).meta_title),
  meta_description: norm((dto as any).meta_description),
  tags: Array.isArray((dto as any).tags)
    ? (dto as any).tags.join(", ")
    : norm((dto as any).tags_raw ?? (dto as any).tags),
});

/* ── Component ── */

export default function AdminReferenceDetailClient({ id }: { id: string }) {
  const t = useAdminT();
  const router = useRouter();
  const sp = useSearchParams();

  const isCreateMode = String(id) === "new";

  const { localeOptions, defaultLocaleFromDb, loading: localesLoading, fetching: localesFetching } = useAdminLocales();

  const apiLocaleFromDb = React.useMemo(() => {
    return resolveAdminApiLocale(localeOptions as any, defaultLocaleFromDb, "tr");
  }, [localeOptions, defaultLocaleFromDb]);

  const localeSet = React.useMemo(() => {
    return new Set((localeOptions ?? []).map((x: any) => localeShortClient(x.value)).filter(Boolean));
  }, [localeOptions]);

  const urlLocale = React.useMemo(() => {
    const q = sp?.get("locale");
    return localeShortClient(q) || "";
  }, [sp]);

  const [activeLocale, setActiveLocale] = React.useState<string>("");

  React.useEffect(() => {
    if (!localeOptions || localeOptions.length === 0) return;
    setActiveLocale((prev) => {
      const p = localeShortClient(prev);
      const u = localeShortClient(urlLocale);
      const def = localeShortClientOr(apiLocaleFromDb, "tr");
      const canUse = (l: string) => !!l && (localeSet.size === 0 || localeSet.has(l));
      if (p && canUse(p)) return p;
      if (u && canUse(u)) return u;
      if (def && canUse(def)) return def;
      const first = localeShortClient((localeOptions as any)?.[0]?.value);
      return first || "tr";
    });
  }, [localeOptions, localeSet, urlLocale, apiLocaleFromDb]);

  const queryLocale = React.useMemo(() => {
    const l = localeShortClient(activeLocale);
    if (l && (localeSet.size === 0 || localeSet.has(l))) return l;
    return localeShortClientOr(apiLocaleFromDb, "tr");
  }, [activeLocale, localeSet, apiLocaleFromDb]);

  React.useEffect(() => {
    const l = localeShortClient(activeLocale);
    if (!l) return;
    if (l === urlLocale) return;
    const params = new URLSearchParams(sp?.toString() || "");
    params.set("locale", l);
    if (isCreateMode) {
      router.replace(`/admin/references/new?${params.toString()}`);
    } else {
      router.replace(`/admin/references/${encodeURIComponent(String(id))}?${params.toString()}`);
    }
  }, [activeLocale, id, isCreateMode, router, sp, urlLocale]);

  const localesReady = !localesLoading && !localesFetching;
  const hasLocales = (localeOptions?.length ?? 0) > 0;

  const shouldSkipDetail = isCreateMode || !isUuidLike(String(id || "")) || !queryLocale;

  const {
    data: reference,
    isLoading: isLoadingRef,
    isFetching: isFetchingRef,
    error: refError,
    refetch,
  } = useGetReferenceAdminQuery({ id: String(id), locale: queryLocale } as any, { skip: shouldSkipDetail } as any);

  const [createReference, createState] = useCreateReferenceAdminMutation();
  const [updateReference, updateState] = useUpdateReferenceAdminMutation();

  const loading = localesLoading || localesFetching || isLoadingRef || isFetchingRef;
  const saving = createState.isLoading || updateState.isLoading;
  const busy = loading || saving;
  const disabled = loading || saving;

  const [values, setValues] = React.useState<FormValues>(() => emptyForm(queryLocale || "tr"));
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [activeMode, setActiveMode] = React.useState<"form" | "json">("form");
  const [activeTab, setActiveTab] = React.useState<"content" | "images" | "seo">("content");

  // AI
  const { assist: aiAssist, loading: aiLoading } = useAIContentAssist();
  const [aiResults, setAiResults] = React.useState<LocaleContent[] | null>(null);

  React.useEffect(() => {
    if (isCreateMode) {
      setValues(emptyForm(queryLocale || "tr"));
      return;
    }
    if (reference) {
      setValues(dtoToForm(reference));
      setSlugTouched(false);
    }
  }, [reference, isCreateMode, queryLocale]);

  const localeDisabled = disabled || localesLoading || (localeOptions ?? []).length === 0;

  const localeSelectOptions = React.useMemo(
    () => (localeOptions ?? []).map((x: any) => ({ value: normalizeLocale(x.value), label: x.label })),
    [localeOptions],
  );

  const handleLocaleChange = (nextLocaleRaw: string) => {
    const next = normalizeLocale(nextLocaleRaw);
    const list = (localeOptions ?? []).map((x: any) => localeShortClient(x.value));
    const resolved = next && list.includes(next) ? next : localeShortClientOr(queryLocale, "tr");
    if (!resolved) {
      toast.error(t("admin.references.form.localeRequired"));
      return;
    }
    setValues((prev) => ({ ...prev, locale: resolved }));
    setActiveLocale(resolved);
  };

  const handleChange =
    (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }) as FormValues);
    };

  function onCancel() {
    router.push(`/admin/references?locale=${encodeURIComponent(queryLocale || "tr")}`);
  }

  const imageMetadata = React.useMemo(
    () => ({
      module_key: "references",
      locale: queryLocale,
      reference_slug: values.slug || values.title || "",
      ...(values.id ? { reference_id: values.id } : {}),
    }),
    [queryLocale, values.slug, values.title, values.id],
  );

  // AI
  const handleAIAction = async (action: AIAction) => {
    const targetLocales = (localeOptions ?? []).map((l: any) => String(l.value ?? "")).filter(Boolean);
    if (!targetLocales.length) targetLocales.push(values.locale || "tr");
    const result = await aiAssist({
      title: values.title,
      summary: values.summary,
      content: values.content,
      tags: values.tags,
      locale: values.locale || "tr",
      target_locales: targetLocales,
      module_key: "references",
      action,
    });
    if (!result) return;
    setAiResults(result);
    const current = result.find((r) => r.locale === values.locale) || result[0];
    if (current) {
      setValues((prev) => ({
        ...prev,
        title: current.title || prev.title,
        slug: current.slug || prev.slug,
        summary: current.summary || prev.summary,
        content: current.content || prev.content,
        meta_title: current.meta_title || prev.meta_title,
        meta_description: current.meta_description || prev.meta_description,
        tags: current.tags || prev.tags,
      }));
    }

    // Auto-save all locale results to backend
    const currentId = String((reference as any)?.id ?? id);
    if (!isCreateMode && isUuidLike(currentId) && result.length > 0) {
      let saved = 0;
      for (const lc of result) {
        const loc = normalizeLocale(lc.locale);
        if (!loc) continue;
        try {
          await updateReference({
            id: currentId,
            patch: {
              locale: loc,
              title: lc.title || values.title,
              slug: lc.slug || values.slug,
              summary: lc.summary || values.summary,
              content: lc.content || values.content,
              meta_title: lc.meta_title || values.meta_title,
              meta_description: lc.meta_description || values.meta_description,
              is_published: values.is_published ? 1 : 0,
              is_featured: values.is_featured ? 1 : 0,
              display_order: Number(values.display_order) || 0,
              featured_image: toNull(values.featured_image),
              featured_image_asset_id: toNull(values.featured_image_asset_id),
              website_url: toNull(values.website_url),
              featured_image_alt: toNull(values.featured_image_alt),
            } as any,
          }).unwrap();
          saved++;
        } catch {
          // silent — individual locale save failure
        }
      }
      if (saved > 0) {
        toast.success(t("admin.references.formHeader.aiSavedAll", undefined, `${saved} ${t("admin.references.formHeader.aiSavedAllSuffix", undefined, "dil kaydedildi")}`));
      }
    }
  };

  const applyAILocale = React.useCallback(
    (locale: string) => {
      if (!aiResults) return;
      const match = aiResults.find((r) => r.locale === locale);
      if (!match) return;
      setValues((prev) => ({
        ...prev,
        locale,
        title: match.title || "",
        slug: match.slug || prev.slug,
        summary: match.summary || "",
        content: match.content || "",
        meta_title: match.meta_title || "",
        meta_description: match.meta_description || "",
        tags: match.tags || "",
      }));
    },
    [aiResults],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;

    const loc = normalizeLocale(values.locale || queryLocale || apiLocaleFromDb);
    if (!loc || (localeSet.size > 0 && !localeSet.has(localeShortClient(loc)))) {
      toast.error(t("admin.references.formHeader.localeError"));
      return;
    }

    if (!values.title.trim() || !values.slug.trim()) {
      toast.error(t("admin.references.formHeader.titleSlugRequired"));
      return;
    }

    const common: ReferenceUpsertPayload = {
      locale: loc,
      is_published: values.is_published ? 1 : 0,
      is_featured: values.is_featured ? 1 : 0,
      display_order: Number(values.display_order) || 0,
      featured_image: toNull(values.featured_image),
      featured_image_asset_id: toNull(values.featured_image_asset_id),
      website_url: toNull(values.website_url),
      title: values.title.trim(),
      slug: values.slug.trim(),
      summary: toNull(values.summary),
      content: values.content || undefined,
      featured_image_alt: toNull(values.featured_image_alt),
      meta_title: toNull(values.meta_title),
      meta_description: toNull(values.meta_description),
    };

    try {
      if (isCreateMode) {
        const created = await createReference(common as any).unwrap();
        const nextId = String((created as any)?.id ?? "").trim();

        if (!isUuidLike(nextId)) {
          toast.error(t("admin.references.formHeader.createdNoId"));
          return;
        }

        toast.success(t("admin.references.formHeader.created"));
        router.replace(`/admin/references/${encodeURIComponent(nextId)}?locale=${encodeURIComponent(loc)}`);
        router.refresh();
        return;
      }

      const currentId = String((reference as any)?.id ?? id);
      if (!isUuidLike(currentId)) {
        toast.error(t("admin.references.formHeader.idNotFound"));
        return;
      }

      await updateReference({ id: currentId, patch: common } as any).unwrap();
      toast.success(t("admin.references.formHeader.updated"));

      const short = localeShortClient(loc);
      if (short && short !== queryLocale) setActiveLocale(short);
    } catch (err) {
      toast.error(getErrMessage(err, t("admin.references.formHeader.defaultError")));
    }
  }

  // Guards
  if (localesReady && !hasLocales) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="font-semibold text-lg">{t("admin.references.formHeader.noLocalesTitle")}</h1>
          <p className="text-muted-foreground text-sm">{t("admin.references.formHeader.noLocalesDescription")}</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <Button variant="outline" onClick={() => router.push("/admin/site-settings")}>
              {t("admin.references.formHeader.goToSettings")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isCreateMode && !isUuidLike(String(id || ""))) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="font-semibold text-lg">{t("admin.references.formHeader.invalidIdTitle")}</h1>
          <p className="text-muted-foreground text-sm">
            {t("admin.references.formHeader.invalidIdDescription")} <code>{String(id || "-")}</code>
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="mr-2 size-4" />
              {t("admin.references.formHeader.backToList")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isCreateMode && !loading && !reference && refError) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="font-semibold text-lg">{t("admin.references.formHeader.notFoundTitle")}</h1>
          <p className="text-muted-foreground text-sm">
            {t("admin.references.formHeader.notFoundDescription")} <code>{String(id)}</code>
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="mr-2 size-4" />
              {t("admin.references.formHeader.backToList")}
            </Button>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCcw className="mr-2 size-4" />
              {t("admin.references.formHeader.retryButton")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pageTitle = isCreateMode
    ? t("admin.references.formHeader.createTitle")
    : (reference as any)?.title || t("admin.references.formHeader.editTitle");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.back()} disabled={busy}>
              <ArrowLeft className="mr-1 size-3.5" />
              {t("admin.references.formHeader.backButton")}
            </Button>
            <h1 className="font-semibold text-lg">{pageTitle}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
            <Badge variant="secondary">{queryLocale || "-"}</Badge>
            {isCreateMode ? <Badge>CREATE</Badge> : <Badge variant="secondary">EDIT</Badge>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={busy}>
            {t("admin.references.formHeader.cancelButton")}
          </Button>
          <Button form="reference-form" type="submit" size="sm" disabled={busy}>
            <Save className="mr-1 size-3.5" />
            {saving ? t("admin.references.formHeader.saving") : t("admin.references.formHeader.saveButton")}
          </Button>
        </div>
      </div>

      <form id="reference-form" onSubmit={onSubmit} className="space-y-4">
        <div className="rounded-lg border bg-card">
          {/* Form header bar */}
          <div className="border-b p-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="font-semibold text-sm">
                  {isCreateMode ? t("admin.references.form.createTitle") : t("admin.references.form.editTitle")}
                </div>
                <div className="text-muted-foreground text-xs">{t("admin.references.form.description")}</div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Form/JSON toggle */}
                <div className="inline-flex overflow-hidden rounded-md border">
                  <button
                    type="button"
                    className={`px-3 py-1 text-xs ${activeMode === "form" ? "bg-muted font-semibold" : "bg-background"}`}
                    onClick={() => setActiveMode("form")}
                    disabled={disabled}
                  >
                    Form
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1 text-xs ${activeMode === "json" ? "bg-muted font-semibold" : "bg-background"}`}
                    onClick={() => setActiveMode("json")}
                    disabled={disabled}
                  >
                    JSON
                  </button>
                </div>
                <AIActionDropdown
                  onAction={handleAIAction}
                  loading={aiLoading}
                  disabled={disabled || !values.title.trim()}
                />
                {loading && (
                  <span className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                    {t("admin.common.loading")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-3">
            {activeMode === "json" ? (
              <AdminJsonEditor
                value={values}
                disabled={disabled}
                onChange={(next) => setValues(next as FormValues)}
                label={t("admin.references.form.jsonLabel")}
                helperText={t("admin.references.form.jsonHelperText")}
              />
            ) : (
              <>
                {/* Locale select */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <AdminLocaleSelect
                      value={values.locale}
                      onChange={handleLocaleChange}
                      options={localeSelectOptions as any}
                      loading={!!localesLoading}
                      disabled={localeDisabled}
                      label={t("admin.references.form.localeLabel")}
                    />
                  </div>
                </div>

                {/* Tabs: Icerik / Gorseller / SEO */}
                <div className="space-y-3">
                  <div className="flex gap-1 border-b pb-2">
                    {(
                      [
                        { key: "content" as const, label: t("admin.references.tabs.content") },
                        { key: "images" as const, label: t("admin.references.tabs.images") },
                        { key: "seo" as const, label: t("admin.references.tabs.seo") },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        className={`rounded-t-md px-4 py-1.5 font-medium text-xs transition-colors ${
                          activeTab === tab.key
                            ? "border border-b-0 bg-background text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => setActiveTab(tab.key)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Content Tab */}
                  {activeTab === "content" && (
                    <div className="grid gap-6 lg:grid-cols-12">
                      <div className="space-y-4 lg:col-span-8">
                        {/* Flags */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="ref_is_published"
                              checked={!!values.is_published}
                              onCheckedChange={(v) => setValues((prev) => ({ ...prev, is_published: v === true }))}
                              disabled={disabled}
                            />
                            <Label htmlFor="ref_is_published">{t("admin.references.form.publishedLabel")}</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="ref_is_featured"
                              checked={!!values.is_featured}
                              onCheckedChange={(v) => setValues((prev) => ({ ...prev, is_featured: v === true }))}
                              disabled={disabled}
                            />
                            <Label htmlFor="ref_is_featured">{t("admin.references.form.featuredLabel")}</Label>
                          </div>
                        </div>

                        {/* Title + Slug */}
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label className="text-xs">{t("admin.references.form.titleLabel")}</Label>
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
                          <div className="space-y-1.5">
                            <Label className="text-xs">{t("admin.references.form.slugLabel")}</Label>
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

                        {/* Website URL */}
                        <div className="space-y-1.5">
                          <Label className="text-xs">{t("admin.references.form.websiteUrlLabel")}</Label>
                          <Input
                            value={values.website_url}
                            onChange={(e) => setValues((prev) => ({ ...prev, website_url: e.target.value }))}
                            disabled={disabled}
                            placeholder="https://..."
                          />
                        </div>

                        {/* Summary */}
                        <div className="space-y-1.5">
                          <Label className="text-xs">{t("admin.references.form.summaryLabel")}</Label>
                          <Textarea
                            rows={2}
                            value={values.summary}
                            onChange={(e) => setValues((prev) => ({ ...prev, summary: e.target.value }))}
                            disabled={disabled}
                          />
                        </div>

                        {/* Content (rich) */}
                        <div className="space-y-1.5">
                          <Label className="text-xs">{t("admin.references.form.contentLabel")}</Label>
                          <RichContentEditor
                            label=""
                            value={values.content || ""}
                            onChange={(next) => setValues((prev) => ({ ...prev, content: next }))}
                            disabled={disabled}
                            height="280px"
                          />
                        </div>

                        {/* Tags */}
                        <div className="space-y-1.5">
                          <Label className="text-xs">{t("admin.references.tabs.tags")}</Label>
                          <Input
                            value={values.tags}
                            onChange={handleChange("tags")}
                            disabled={disabled}
                            placeholder="tag1, tag2, tag3"
                          />
                        </div>
                      </div>

                      {/* Right sidebar */}
                      <div className="space-y-4 lg:col-span-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs">{t("admin.references.form.displayOrderLabel")}</Label>
                          <Input
                            type="number"
                            min={0}
                            value={values.display_order}
                            onChange={(e) => setValues((p) => ({ ...p, display_order: e.target.value }))}
                            disabled={disabled}
                          />
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Images Tab */}
                  {activeTab === "images" && (
                    <div className="grid gap-6 lg:grid-cols-12">
                      <div className="space-y-4 lg:col-span-8">
                        <AdminImageUploadField
                          label={t("admin.references.formImage.coverLabel")}
                          helperText={t("admin.references.formImage.coverHelperText")}
                          bucket="public"
                          folder="references"
                          metadata={imageMetadata}
                          value={norm(values.featured_image)}
                          onChange={(url) => setValues((prev) => ({ ...prev, featured_image: norm(url) }))}
                          disabled={disabled}
                          openLibraryHref="/admin/storage"
                          onOpenLibraryClick={() => router.push("/admin/storage")}
                        />
                      </div>
                      <div className="space-y-4 lg:col-span-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs">{t("admin.references.form.imageAltLabel")}</Label>
                          <Input
                            value={values.featured_image_alt}
                            onChange={(e) => setValues((p) => ({ ...p, featured_image_alt: e.target.value }))}
                            disabled={disabled}
                            placeholder="Gorsel aciklamasi"
                          />
                        </div>
                        {values.featured_image && (
                          <div className="overflow-hidden rounded-lg border">
                            <img
                              src={values.featured_image}
                              alt={values.featured_image_alt || "Preview"}
                              className="aspect-video w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SEO Tab */}
                  {activeTab === "seo" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className="text-xs">{t("admin.references.form.metaTitleLabel")}</Label>
                          <Input
                            value={values.meta_title}
                            onChange={handleChange("meta_title")}
                            disabled={disabled}
                            placeholder="Sayfa basligi (SEO)"
                          />
                          <p className="text-[10px] text-muted-foreground">{values.meta_title.length}/60</p>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">{t("admin.references.tabs.tags")}</Label>
                          <Input
                            value={values.tags}
                            onChange={handleChange("tags")}
                            disabled={disabled}
                            placeholder="tag1, tag2"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">{t("admin.references.form.metaDescriptionLabel")}</Label>
                        <Textarea
                          rows={3}
                          value={values.meta_description}
                          onChange={handleChange("meta_description")}
                          disabled={disabled}
                          placeholder="Sayfa aciklamasi (max 155 karakter)"
                        />
                        <p className="text-[10px] text-muted-foreground">{values.meta_description.length}/155</p>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">{t("admin.references.form.imageAltLabel")}</Label>
                        <Input
                          value={values.featured_image_alt}
                          onChange={handleChange("featured_image_alt")}
                          disabled={disabled}
                          placeholder="Gorsel aciklamasi (erisilebilirlik)"
                        />
                      </div>
                      <GooglePreview
                        title={values.meta_title || values.title}
                        url={`https://ensotek.de/references/${values.slug || "referans-slug"}`}
                        description={values.meta_description || values.summary}
                        titleFallback={values.title || "Referans Basligi"}
                        descriptionFallback={values.summary || "Referans aciklamasi"}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </form>

      {/* AI Results */}
      {aiResults && aiResults.length > 1 && (
        <div className="rounded-lg border border-purple-200 bg-transparent dark:border-purple-800">
          <AIResultsPanel
            results={aiResults}
            currentLocale={values.locale}
            onApply={(lc) => {
              applyAILocale(lc.locale);
              setActiveLocale(lc.locale);
            }}
            onClose={() => setAiResults(null)}
          />
          <p className="px-3 pb-2 text-[10px] text-muted-foreground">{t("admin.references.formHeader.aiAutoSaved", undefined, "Tüm diller otomatik kaydedildi. Dil seçerek içeriği inceleyebilirsiniz.")}</p>
        </div>
      )}
    </div>
  );
}
