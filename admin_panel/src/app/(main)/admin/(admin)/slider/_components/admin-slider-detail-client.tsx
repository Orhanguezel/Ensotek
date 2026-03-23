// =============================================================
// Slider Detail — Tab yapisi + AI Content Assist
// Icerik / Gorsel / SEO + JSON
// =============================================================

'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import RichContentEditor from '@/app/(main)/admin/_components/common/RichContentEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, FileJson, ImageOff } from 'lucide-react';
import { useAdminT } from '@/app/(main)/admin/_components/common/useAdminT';
import { useAIContentAssist, type LocaleContent } from '@/app/(main)/admin/_components/common/useAIContentAssist';
import { AdminLocaleSelect } from '@/app/(main)/admin/_components/common/AdminLocaleSelect';
import { AdminJsonEditor } from '@/app/(main)/admin/_components/common/AdminJsonEditor';
import { AdminImageUploadField } from '@/app/(main)/admin/_components/common/AdminImageUploadField';
import { useAdminLocales } from '@/app/(main)/admin/_components/common/useAdminLocales';
import { toast } from 'sonner';
import {
  useGetSliderAdminQuery,
  useCreateSliderAdminMutation,
  useUpdateSliderAdminMutation,
} from '@/integrations/hooks';

const norm = (v: unknown) => String(v ?? '').trim().toLowerCase();

type Props = { mode: 'create'; id?: string } | { mode: 'edit'; id: string };

export default function AdminSliderDetailClient(props: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const isNew = props.mode === 'create';
  const id = isNew ? '' : String(props.id || '');

  const { localeOptions } = useAdminLocales();
  const urlLocale = norm(sp?.get('locale'));
  const [activeLocale, setActiveLocale] = React.useState(urlLocale || 'de');
  const [activeTab, setActiveTab] = React.useState<'form' | 'json'>('form');

  // AI
  const { assist: aiAssist, loading: aiLoading } = useAIContentAssist();
  const [aiResults, setAiResults] = React.useState<LocaleContent[] | null>(null);

  // RTK
  const { data: item, isFetching, refetch } = useGetSliderAdminQuery(
    { id, locale: activeLocale }, { skip: isNew || !id },
  );
  const [createSlider, { isLoading: isCreating }] = useCreateSliderAdminMutation();
  const [updateSlider, { isLoading: isUpdating }] = useUpdateSliderAdminMutation();

  // Form
  const [f, setF] = React.useState({
    locale: activeLocale, title: '', subtitle: '', slug: '',
    description: '', button_text: '', button_url: '',
    image_url: '', image_alt: '',
    is_active: true, display_order: 0,
    meta_title: '', meta_description: '',
  });

  React.useEffect(() => {
    if (item && !isNew) {
      const s = item as any;
      setF({
        locale: s.locale || activeLocale, title: s.name || s.title || '', subtitle: s.subtitle || '',
        slug: s.slug || '', description: s.description || '',
        button_text: s.buttonText || s.button_text || '', button_url: s.buttonLink || s.button_link || s.button_url || '',
        image_url: s.image_url || '', image_alt: s.alt || s.image_alt || '',
        is_active: s.is_active === 1 || s.is_active === true,
        display_order: s.display_order || 0,
        meta_title: s.meta_title || '', meta_description: s.meta_description || '',
      });
    }
  }, [item, isNew, activeLocale]);

  React.useEffect(() => { if (!isNew && id) refetch(); }, [activeLocale]);

  const set = (field: string, value: unknown) => setF((p) => ({ ...p, [field]: value }));
  const isLoading = isFetching || isCreating || isUpdating;

  const localesForSelect = React.useMemo(() =>
    (localeOptions || []).map((l: any) => ({ value: String(l.value || ''), label: String(l.label || l.value || '') })),
    [localeOptions],
  );

  const handleAI = async () => {
    const targets = localesForSelect.map((l) => l.value).filter(Boolean);
    const result = await aiAssist({
      title: f.title, summary: f.subtitle || f.description, content: f.description,
      locale: activeLocale, target_locales: targets, module_key: 'slider', action: 'full',
    });
    if (!result) return;
    setAiResults(result);
    const cur = result.find((r) => r.locale === activeLocale) || result[0];
    if (cur) setF((p) => ({
      ...p, title: cur.title || p.title, subtitle: cur.summary || p.subtitle,
      description: cur.content || p.description,
      meta_title: cur.meta_title || p.meta_title, meta_description: cur.meta_description || p.meta_description,
    }));
  };

  const applyAILocale = (locale: string) => {
    const m = aiResults?.find((r) => r.locale === locale);
    if (!m) return;
    setActiveLocale(locale);
    setF((p) => ({ ...p, locale, title: m.title, subtitle: m.summary || p.subtitle,
      description: m.content || m.summary, meta_title: m.meta_title, meta_description: m.meta_description }));
  };

  const handleSubmit = async () => {
    if (!f.title.trim()) { toast.error('Baslik zorunlu'); return; }
    const payload: any = {
      locale: activeLocale, name: f.title.trim(), title: f.title.trim(),
      subtitle: f.subtitle || null,
      slug: f.slug.trim() || f.title.trim().toLowerCase().replace(/\s+/g, '-'),
      description: f.description || null, button_text: f.button_text || null,
      button_link: f.button_url || null, button_url: f.button_url || null,
      image_url: f.image_url || null,
      alt: f.image_alt || null, image_alt: f.image_alt || null, is_active: f.is_active,
      display_order: f.display_order,
      meta_title: f.meta_title || null, meta_description: f.meta_description || null,
    };
    try {
      if (isNew) {
        const result = await createSlider(payload).unwrap();
        toast.success('Slider olusturuldu');
        if ((result as any)?.id) router.push(`/admin/slider/${(result as any).id}?locale=${activeLocale}`);
      } else {
        await updateSlider({ id, patch: payload } as any).unwrap();
        toast.success('Slider guncellendi');
      }
    } catch (err: any) {
      toast.error(err?.data?.error?.message || 'Hata');
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        {/* Header */}
        <div className="border-b p-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.push('/admin/slider')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="text-sm font-semibold">{isNew ? 'Yeni Slider' : (f.title || 'Slider Duzenle')}</div>
                <div className="text-xs text-muted-foreground">{isNew ? 'Yeni slider olustur' : 'Slider duzenle'}</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <AdminLocaleSelect options={localesForSelect} value={activeLocale}
                onChange={(v) => { setActiveLocale(v); setF((p) => ({ ...p, locale: v })); }} disabled={isLoading} />
              <button type="button"
                className="rounded-md border border-purple-300 bg-purple-50 px-3 py-1 text-xs text-purple-700 hover:bg-purple-100 disabled:opacity-60 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-300"
                disabled={isLoading || aiLoading || !f.title.trim()} onClick={handleAI}>
                {aiLoading ? 'AI calisiyor...' : 'AI ile Icerik Olustur'}
              </button>
              <Button size="sm" onClick={handleSubmit} disabled={isLoading}>
                <Save className="h-4 w-4 mr-1.5" /> Kaydet
              </Button>
            </div>
          </div>
        </div>

        {/* AI */}
        {aiResults && aiResults.length > 1 && (
          <div className="border-b bg-purple-50/50 p-3 dark:bg-purple-950/20">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI — Diger Diller</span>
              <button type="button" className="text-[10px] text-muted-foreground hover:underline" onClick={() => setAiResults(null)}>Kapat</button>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {aiResults.filter((r) => r.locale !== activeLocale).map((r) => (
                <div key={r.locale} className="rounded-md border bg-background p-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase">{r.locale}</span>
                    <button type="button" className="rounded border px-2 py-0.5 text-[10px] text-purple-700 hover:bg-purple-100 dark:text-purple-300"
                      onClick={() => applyAILocale(r.locale)}>Bu dile gec</button>
                  </div>
                  <p className="text-xs font-medium truncate">{r.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <div className="border-b px-3">
            <TabsList className="h-auto bg-transparent p-0">
              <TabsTrigger value="form" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Slider</TabsTrigger>
              <TabsTrigger value="json" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                <FileJson className="h-4 w-4 mr-1.5" /> JSON
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="form" className="p-0">
            <SliderFormTabs f={f} set={set} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="json" className="p-3">
            <AdminJsonEditor value={f} onChange={(json) => setF((p) => ({ ...p, ...json }))} disabled={isLoading} height={400} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ── Ic Tab'lar: Icerik / Gorsel / SEO ── */

function SliderFormTabs({ f, set, isLoading }: { f: any; set: any; isLoading: boolean }) {
  const [tab, setTab] = React.useState<'content' | 'image' | 'seo'>('content');

  return (
    <div className="p-3 space-y-3">
      <div className="flex gap-1 border-b pb-2">
        {([
          { key: 'content' as const, label: 'Icerik' },
          { key: 'image' as const, label: 'Gorsel' },
          { key: 'seo' as const, label: 'SEO' },
        ]).map((t) => (
          <button key={t.key} type="button"
            className={`rounded-t-md px-4 py-1.5 text-xs font-medium transition-colors ${
              tab === t.key ? 'border border-b-0 bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {/* Icerik */}
      {tab === 'content' && (
        <div className="space-y-4 max-w-2xl">
          <div className="space-y-1.5">
            <Label className="text-xs">Baslik *</Label>
            <Input value={f.title} onChange={(e) => set('title', e.target.value)} disabled={isLoading} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Alt Baslik</Label>
            <Input value={f.subtitle} onChange={(e) => set('subtitle', e.target.value)} disabled={isLoading} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Slug</Label>
            <Input value={f.slug} onChange={(e) => set('slug', e.target.value)} disabled={isLoading} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Aciklama</Label>
            <RichContentEditor value={f.description} onChange={(v) => set('description', v)} disabled={isLoading} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Buton Metni</Label>
              <Input value={f.button_text} onChange={(e) => set('button_text', e.target.value)} disabled={isLoading} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Buton URL</Label>
              <Input value={f.button_url} onChange={(e) => set('button_url', e.target.value)} disabled={isLoading} placeholder="/contact" />
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={f.is_active} onCheckedChange={(v) => set('is_active', v)} disabled={isLoading} />
              <Label className="text-xs cursor-pointer">Aktif</Label>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Siralama</Label>
              <Input type="number" value={f.display_order} onChange={(e) => set('display_order', Number(e.target.value))} disabled={isLoading} className="w-20 h-8" />
            </div>
          </div>
        </div>
      )}

      {/* Gorsel */}
      {tab === 'image' && (
        <div className="space-y-4 max-w-lg">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              {f.image_url ? (
                <div className="rounded border overflow-hidden">
                  <img src={f.image_url} alt="Slider" className="w-40 h-24 object-cover" />
                </div>
              ) : (
                <div className="flex w-40 h-24 items-center justify-center rounded border border-dashed text-muted-foreground">
                  <ImageOff className="h-6 w-6 opacity-40" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <AdminImageUploadField label="Slider Gorseli" value="" onChange={(url) => set('image_url', url)} disabled={isLoading} folder="uploads/slider" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Alt Metin</Label>
            <Input value={f.image_alt} onChange={(e) => set('image_alt', e.target.value)} disabled={isLoading} />
          </div>
        </div>
      )}

      {/* SEO */}
      {tab === 'seo' && (
        <div className="space-y-4 max-w-2xl">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Meta Baslik</label>
            <Input value={f.meta_title} onChange={(e) => set('meta_title', e.target.value)} disabled={isLoading} />
            <p className="text-[10px] text-muted-foreground">{(f.meta_title || '').length}/60</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Meta Aciklama</label>
            <Textarea value={f.meta_description} onChange={(e) => set('meta_description', e.target.value)} disabled={isLoading} rows={3} />
            <p className="text-[10px] text-muted-foreground">{(f.meta_description || '').length}/155</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Google Onizlemesi</label>
            <div className="rounded-md border bg-background p-4">
              <p className="text-xs text-muted-foreground">ensotek.de</p>
              <p className="text-sm font-medium text-[#1a0dab] truncate">{f.meta_title || f.title || 'Slider'} | Ensotek</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{f.meta_description || f.description || f.subtitle || 'Aciklama'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
