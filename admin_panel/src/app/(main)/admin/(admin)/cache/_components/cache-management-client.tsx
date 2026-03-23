"use client";

import * as React from "react";

import { AlertCircle, Check, Globe, Plus, Power, RefreshCcw, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

/* ── CORS'tan frontend listesi ── */

const CORS_RAW = (process.env.NEXT_PUBLIC_CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

type FrontendEntry = { name: string; url: string; fromCors: boolean; enabled: boolean };

function buildFromCors(): FrontendEntry[] {
  const adminUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");
  const seen = new Set<string>();

  return CORS_RAW.filter((url) => {
    try {
      const u = new URL(url);
      const normalized = url.replace(/\/+$/, "").replace("127.0.0.1", "localhost");
      const adminNormalized = adminUrl.replace("127.0.0.1", "localhost");
      if (adminNormalized && normalized === adminNormalized) return false;
      const key = `${u.hostname.replace("127.0.0.1", "localhost")}:${u.port || (u.protocol === "https:" ? "443" : "80")}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    } catch {
      return false;
    }
  }).map((url) => {
    try {
      const u = new URL(url);
      const host = u.hostname.replace("www.", "");
      return { name: u.port ? `${host}:${u.port}` : host, url: url.replace(/\/+$/, ""), fromCors: true, enabled: true };
    } catch {
      return { name: url, url, fromCors: true, enabled: true };
    }
  });
}

const STORAGE_KEY = "ensotek_cache_frontends";

function loadState(corsEntries: FrontendEntry[]): FrontendEntry[] {
  if (typeof window === "undefined") return corsEntries;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return corsEntries;
    const saved: { disabled: string[]; custom: { name: string; url: string }[] } = JSON.parse(raw);
    const disabledSet = new Set(saved.disabled || []);
    const merged = corsEntries.map((e) => ({ ...e, enabled: !disabledSet.has(e.url) }));
    for (const c of saved.custom || []) {
      if (!merged.some((m) => m.url === c.url)) {
        merged.push({ name: c.name, url: c.url, fromCors: false, enabled: true });
      }
    }
    return merged;
  } catch {
    return corsEntries;
  }
}

function saveState(entries: FrontendEntry[]) {
  if (typeof window === "undefined") return;
  const disabled = entries.filter((e) => !e.enabled).map((e) => e.url);
  const custom = entries.filter((e) => !e.fromCors).map((e) => ({ name: e.name, url: e.url }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ disabled, custom }));
}

/* ── purge ── */

type PurgeResult = { name: string; ok: boolean; error?: string };

async function purgeOne(entry: FrontendEntry, opts: { all?: boolean; path?: string }): Promise<PurgeResult> {
  try {
    const res = await fetch(`${entry.url}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(opts),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const errVal = (data as any)?.error;
      const errStr = typeof errVal === "string" ? errVal : errVal?.message || `HTTP ${res.status}`;
      return { name: entry.name, ok: false, error: errStr };
    }
    return { name: entry.name, ok: true };
  } catch {
    return { name: entry.name, ok: false, error: "Erisilemedi" };
  }
}

/* ── component ── */

export default function CacheManagementClient() {
  const t = useAdminT("admin.cache");

  const corsEntries = React.useMemo(() => buildFromCors(), []);
  const [entries, setEntries] = React.useState<FrontendEntry[]>(() => loadState(corsEntries));
  const [loading, setLoading] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<PurgeResult[]>([]);
  const [addUrl, setAddUrl] = React.useState("");

  const activeEntries = entries.filter((e) => e.enabled);

  const updateEntries = (next: FrontendEntry[]) => {
    setEntries(next);
    saveState(next);
  };

  const toggleEnabled = (index: number) => {
    const next = entries.map((e, i) => (i === index ? { ...e, enabled: !e.enabled } : e));
    updateEntries(next);
  };

  const removeEntry = (index: number) => {
    const next = entries.filter((_, i) => i !== index);
    updateEntries(next);
  };

  const addEntry = () => {
    const url = addUrl.trim().replace(/\/+$/, "");
    if (!url) return;
    try {
      new URL(url);
    } catch {
      toast.error("Gecersiz URL");
      return;
    }
    if (entries.some((e) => e.url === url)) {
      toast.error("Bu URL zaten var");
      return;
    }
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    const name = u.port ? `${host}:${u.port}` : host;
    updateEntries([...entries, { name, url, fromCors: false, enabled: true }]);
    setAddUrl("");
  };

  const handlePurge = async (opts: { all?: boolean; path?: string }, label: string) => {
    if (!activeEntries.length) {
      toast.error("Aktif frontend yok");
      return;
    }
    setLoading(label);
    setResults([]);
    const res = await Promise.all(activeEntries.map((f) => purgeOne(f, opts)));
    setResults(res);
    const ok = res.filter((r) => r.ok).length;
    const fail = res.filter((r) => !r.ok).length;
    if (ok > 0 && fail === 0) toast.success(`${ok} frontend temizlendi`);
    else if (ok > 0) toast.warning(`${ok} basarili, ${fail} erisilemedi`);
    else toast.error("Hicbir frontend erisilemedi");
    setLoading(null);
  };

  const PAGE_PATHS = [
    "/",
    "/product",
    "/service",
    "/solutions",
    "/about",
    "/news",
    "/blog",
    "/contact",
    "/offer",
    "/faqs",
    "/library",
    "/sparepart",
    "/team",
    "/quality",
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-semibold text-lg">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
      </div>

      {/* Frontend Listesi */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Frontend'ler</CardTitle>
              <CardDescription>CORS ayarindan otomatik + manuel eklenenler</CardDescription>
            </div>
            <Badge variant="secondary">
              {activeEntries.length}/{entries.length} aktif
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {entries.length === 0 && (
            <div className="rounded-md border border-dashed p-6 text-center text-muted-foreground text-sm">
              <AlertCircle className="mx-auto mb-2 size-5" />
              Frontend bulunamadi. .env NEXT_PUBLIC_CORS_ORIGINS degerini kontrol edin.
            </div>
          )}

          {entries.map((entry, i) => (
            <div
              key={`${entry.url}-${i}`}
              className={`flex items-center justify-between rounded-md border p-3 ${!entry.enabled ? "opacity-40" : ""}`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <Globe className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{entry.name}</span>
                    {entry.fromCors && (
                      <Badge variant="outline" className="text-[10px]">
                        CORS
                      </Badge>
                    )}
                    {!entry.fromCors && (
                      <Badge variant="secondary" className="text-[10px]">
                        Manuel
                      </Badge>
                    )}
                  </div>
                  <div className="truncate text-muted-foreground text-xs">{entry.url}</div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => toggleEnabled(i)}
                  title={entry.enabled ? "Devre disi birak" : "Etkinlestir"}
                >
                  <Power className={`size-4 ${entry.enabled ? "text-green-600" : "text-muted-foreground"}`} />
                </Button>
                {!entry.fromCors && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    onClick={() => removeEntry(i)}
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          <Separator />
          <div className="flex gap-2">
            <Input
              placeholder="https://yeni-frontend.com"
              value={addUrl}
              onChange={(e) => setAddUrl(e.target.value)}
              className="h-8"
              onKeyDown={(e) => e.key === "Enter" && addEntry()}
            />
            <Button variant="outline" size="sm" onClick={addEntry} className="shrink-0">
              <Plus className="mr-1.5 size-4" />
              Ekle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cache Temizle */}
      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("quickClear")}</CardTitle>
            <CardDescription>{activeEntries.length} aktif frontend'e istek gonderir</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
                  <Globe className="size-5 text-destructive" />
                </div>
                <div>
                  <span className="font-medium text-sm">Tum Sayfalari Temizle</span>
                  <p className="text-muted-foreground text-xs">{activeEntries.length} frontend</p>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handlePurge({ all: true }, "all")}
                disabled={loading !== null || !activeEntries.length}
              >
                {loading === "all" ? (
                  <RefreshCcw className="mr-2 size-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 size-4" />
                )}
                Temizle
              </Button>
            </div>

            <Separator />

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {PAGE_PATHS.map((path) => (
                <Button
                  key={path}
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => handlePurge({ path }, path)}
                  disabled={loading !== null || !activeEntries.length}
                >
                  {loading === path ? (
                    <RefreshCcw className="mr-2 size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 size-3.5" />
                  )}
                  {path}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sonuclar */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sonuclar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={`${r.name}-${i}`} className="flex items-center justify-between rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    {r.ok ? (
                      <Check className="size-4 text-green-600" />
                    ) : (
                      <AlertCircle className="size-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">{r.name}</span>
                  </div>
                  {r.ok ? (
                    <Badge variant="default" className="text-xs">
                      Temizlendi
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      {r.error}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t("info")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-muted-foreground text-sm">
          <p>{t("infoText1")}</p>
          <p>{t("infoText2")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
