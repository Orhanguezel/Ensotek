// src/pages/admin/index.tsx
// Ensotek Admin Dashboard – modern özet ekranı
// Layout: _app.tsx içindeki AdminLayoutShell ile geliyor

"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  useStatusQuery,
  useGetMyProfileQuery,
  useGetDashboardSummaryAdminQuery,
  useGetUnreadNotificationsCountQuery
} from "@/integrations/rtk/hooks";

import type { DashboardCountItemDto } from "@/integrations/types/dashboard.types";

import {
  BarChart3,
  Package,
  Settings,
  FileText,
  FolderTree,
  HelpCircle,
  Mail,
  ImageIcon,
  BookOpen,
  Users,
  Database,
  MessageCircle,
  ListTree,
} from "lucide-react";

type NormalizedRole = "admin" | "moderator" | "user";

function normalizeRole(
  rawRole: unknown,
  isAdminFlag: boolean | undefined,
): NormalizedRole {
  if (isAdminFlag) return "admin";

  const s = String(rawRole || "").toLowerCase();

  if (s === "admin" || s === "super_admin" || s === "superadmin") return "admin";
  if (s === "moderator" || s === "editor") return "moderator";

  return "user";
}

// Dashboard item → icon map (key backend ile eşleşirse ikon da anlamlı olur)
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  dashboard: BarChart3,
  site_settings: Settings,
  custom_pages: FileText,
  services: FolderTree,
  products: Package,
  categories: FolderTree,
  subcategories: FolderTree,
  slider: ImageIcon,
  references: FileText,
  faqs: HelpCircle,
  contacts: Mail,
  newsletter: Mail,
  email_templates: Mail,
  library: BookOpen,
  reviews: MessageCircle,
  support: HelpCircle,
  menuitem: ListTree,
  users: Users,
  db: Database,
};

function getIconForItem(item: DashboardCountItemDto) {
  const Icon = ICON_MAP[item.key] ?? BarChart3;
  return Icon;
}

const AdminDashboardPage: React.FC = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useStatusQuery();

  // Profilden full_name almak için (sadece görüntü amaçlı)
  const { data: profile } = useGetMyProfileQuery(undefined, {
    skip: !data?.authenticated,
  });

  // Dashboard summary + unread notifications
  const {
    data: summary,
    isLoading: isSummaryLoading,
    isFetching: isSummaryFetching,
    error: summaryError,
    refetch: refetchSummary,
  } = useGetDashboardSummaryAdminQuery();

  const { data: unreadData } = useGetUnreadNotificationsCountQuery();
  const unreadCount = unreadData?.count ?? 0;

  // Auth guard (sadece yönlendirme; hook sırası bozulmuyor)
  useEffect(() => {
    if (isLoading) return;

    if (isError || !data?.authenticated) {
      router.push("/login");
    }
  }, [isLoading, isError, data, router]);

  // ⚠️ items için ayrı useMemo – ESLint uyarısını çözer
  const items: DashboardCountItemDto[] = useMemo(
    () => (summary?.items ?? []) as DashboardCountItemDto[],
    [summary],
  );

  const loadingSummary = isSummaryLoading || isSummaryFetching;

  const totalCount = useMemo(
    () => items.reduce((sum, it) => sum + (it.count ?? 0), 0),
    [items],
  );

  const maxCount = useMemo(
    () => items.reduce((m, it) => (it.count > m ? it.count : m), 0),
    [items],
  );

  const topItems = useMemo(
    () => [...items].sort((a, b) => b.count - a.count).slice(0, 6),
    [items],
  );

  // ⬇️ Artık tüm hook'lar yukarıda çağrıldı; buradan sonra conditional return serbest
  if (isLoading || !data) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "16rem" }}
      >
        <div className="text-center">
          <div
            className="mx-auto mb-3 rounded-circle border border-primary border-2"
            style={{
              width: 32,
              height: 32,
              borderTopColor: "transparent",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p>Admin paneli yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!data.authenticated) return null;

  const role = normalizeRole(data.user?.role, data.is_admin);
  const userName = profile?.full_name || data.user?.email || "Yönetici";

  const badgeLabel =
    role === "admin" ? "Admin" : role === "moderator" ? "Moderator" : "Kullanıcı";

  return (
    <div className="space-y-3">
      {/* Üst başlık */}
      <div className="d-flex flex-column gap-2 flex-md-row align-items-md-center justify-content-md-between">
        <div>
          <h1 className="h3 mb-1 d-flex align-items-center gap-2">
            <BarChart3 size={20} />
            <span>Ensotek Admin Panel</span>
          </h1>
          <p className="text-muted small mb-0">
            Ensotek web sitesinin içerik ve ayarlarını buradan yönetebilirsiniz.
          </p>
        </div>
        <div className="text-md-end">
          <p className="mb-0 small fw-semibold">{userName}</p>
          <Badge variant="outline" className="mt-1 text-xs">
            {badgeLabel}
          </Badge>
        </div>
      </div>

      {/* Üst istatistik kartları */}
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <Card className="h-100">
            <CardHeader className="py-2">
              <CardTitle className="text-sm d-flex align-items-center gap-2">
                <BarChart3 size={16} />
                <span>Toplam İçerik</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="d-flex align-items-baseline justify-content-between">
                <div className="fs-3 fw-bold">{totalCount}</div>
                <div className="text-muted small text-end">
                  Dashboard özetine dahil edilen
                  <br />
                  tüm kayıt sayısı
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-12 col-md-4">
          <Card className="h-100">
            <CardHeader className="py-2">
              <CardTitle className="text-sm d-flex align-items-center gap-2">
                <Settings size={16} />
                <span>Modül Sayısı</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="d-flex align-items-baseline justify-content-between">
                <div className="fs-3 fw-bold">{items.length}</div>
                <div className="text-muted small text-end">
                  Özet rapora dahil edilen
                  <br />
                  modül sayısı
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-12 col-md-4">
          <Card className="h-100">
            <CardHeader className="py-2">
              <CardTitle className="text-sm d-flex align-items-center gap-2">
                <Mail size={16} />
                <span>Okunmamış Bildirim</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="d-flex align-items-baseline justify-content-between">
                <div className="fs-3 fw-bold">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </div>
                <div className="text-muted small text-end">
                  Admin hesabı için unread
                  <br />
                  notifications
                </div>
              </div>
              <p className="text-muted small mb-0 mt-2">
                Detay için üst header&apos;daki bildirim çanını kullanabilirsin.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hata mesajı (dashboard summary) */}
      {summaryError && (
        <div className="alert alert-danger py-2 small mt-2 mb-0">
          Dashboard verileri yüklenirken bir hata oluştu. Backend&apos;de{" "}
          <code>/admin/dashboard/summary</code> endpoint&apos;inin{" "}
          <code>{`{ items: DashboardCountItemDto[] }`}</code> formatında yanıt
          döndürdüğünden emin ol.
        </div>
      )}

      {/* Modül kartları + dağılım grafiği */}
      <div className="row g-3 mt-1">
        {/* Sol: Top modül kartları */}
        <div className="col-12 col-lg-7">
          <div className="row g-3">
            {topItems.length === 0 && !loadingSummary && (
              <div className="col-12">
                <Card>
                  <CardContent className="py-3 text-sm text-muted">
                    Henüz özetlenecek içerik bulunamadı.{" "}
                    <code>/admin/dashboard/summary</code> yanıtına
                    <code> items </code> ekleyerek modül sayılarını
                    döndürebilirsin.
                  </CardContent>
                </Card>
              </div>
            )}

            {topItems.map((item) => {
              const Icon = getIconForItem(item);
              const percent =
                maxCount > 0 ? Math.round((item.count / maxCount) * 100) : 0;

              return (
                <div key={item.key} className="col-12 col-sm-6">
                  <Card className="h-100 border-0 shadow-sm">
                    <CardContent className="py-3">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                            style={{ width: 32, height: 32 }}
                          >
                            <Icon size={16} />
                          </div>
                          <div>
                            <div className="small fw-semibold">
                              {item.label}
                            </div>
                            <div className="text-muted small">{item.key}</div>
                          </div>
                        </div>
                        <div className="fs-4 fw-bold">{item.count}</div>
                      </div>

                      <div className="progress" style={{ height: 6 }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{ width: `${percent}%` }}
                          aria-valuenow={percent}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <div className="d-flex justify-content-between mt-1">
                        <small className="text-muted">
                          Genel toplam içindeki pay
                        </small>
                        <small className="text-muted">{percent}%</small>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sağ: Dağılım listesi */}
        <div className="col-12 col-lg-5">
          <Card className="h-100 border-0 shadow-sm">
            <CardHeader className="py-2 d-flex justify-content-between align-items-center">
              <CardTitle className="text-sm mb-0">
                İçerik Dağılımı (Tüm Modüller)
              </CardTitle>
              <button
                type="button"
                className="btn btn-outline-secondary btn-xs btn-sm"
                onClick={() => refetchSummary()}
                disabled={loadingSummary}
              >
                {loadingSummary ? "Yenileniyor..." : "Yenile"}
              </button>
            </CardHeader>
            <CardContent className="py-2">
              {items.length === 0 && !loadingSummary && (
                <p className="text-muted small mb-0">
                  Gösterilecek modül bulunamadı.
                </p>
              )}

              {items.map((item) => {
                const Icon = getIconForItem(item);
                const percent =
                  maxCount > 0
                    ? Math.max(4, Math.round((item.count / maxCount) * 100))
                    : 0;

                return (
                  <div
                    key={item.key}
                    className="mb-2 d-flex align-items-center gap-2"
                  >
                    <div
                      className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                      style={{ width: 28, height: 28 }}
                    >
                      <Icon size={14} className="text-secondary" />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between small mb-1">
                        <span className="fw-semibold">{item.label}</span>
                        <span className="text-muted">
                          {item.count} kayıt
                        </span>
                      </div>
                      <div className="progress" style={{ height: 5 }}>
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: `${percent}%` }}
                          aria-valuenow={percent}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {loadingSummary && (
                <p className="text-muted small mt-2 mb-0">
                  Dashboard verileri yükleniyor...
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
