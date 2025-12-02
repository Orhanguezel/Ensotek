// =============================================================
// FILE: src/components/admin/dashboard/AdminDashboard.tsx
// Ensotek – Admin Dashboard (cards + simple charts)
// =============================================================

"use client";

import React, { useMemo } from "react";
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

import type { ActiveTab } from "@/components/layout/admin/AdminLayout";
import { useGetDashboardSummaryAdminQuery } from "@/integrations/rtk/endpoints/admin/dashboard_admin.endpoints";
import { useGetUnreadNotificationsCountQuery } from "@/integrations/rtk/endpoints/notifications.endpoints";
import type { DashboardCountItemDto } from "@/integrations/types/dashboard.types";

type AdminDashboardProps = {
  onSelectTab?: (tab: ActiveTab) => void;
};

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

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectTab,
}) => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetDashboardSummaryAdminQuery();

  const { data: unreadData } = useGetUnreadNotificationsCountQuery();
  const unreadCount = unreadData?.count ?? 0;

  const loading = isLoading || isFetching;

  // ✅ items referansını useMemo ile stabilize et
  const items = useMemo(
    () => (data?.items ?? []) as DashboardCountItemDto[],
    [data],
  );

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
  

  return (
    <div className="container-fluid p-0">
      {/* Üst kısım: Başlık + özet */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
        <div>
          <h1 className="h4 mb-1 d-flex align-items-center gap-2">
            <BarChart3 size={20} />
            <span>Yönetim Paneli Özeti</span>
          </h1>
          <p className="text-muted small mb-0">
            İçerik modüllerinin genel durumunu, bildirimleri ve temel metrikleri tek ekranda görebilirsin.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => refetch()}
            disabled={loading}
          >
            {loading ? "Yenileniyor..." : "Verileri yenile"}
          </button>

          <div className="badge bg-primary-subtle text-primary border">
            Toplam içerik: <strong className="ms-1">{totalCount}</strong>
          </div>

          <div className="badge bg-warning-subtle text-warning border">
            Okunmamış bildirim:{" "}
            <strong className="ms-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </strong>
          </div>
        </div>
      </div>

      {/* Hata durumu */}
      {error && (
        <div className="alert alert-danger py-2 small">
          Dashboard verileri yüklenirken bir hata oluştu. Backend&apos;de{" "}
          <code>/admin/dashboard/summary</code> endpoint&apos;inin
          doğru yanıt döndürdüğünden emin ol.
        </div>
      )}

      {/* 1. Satır: Özet kartlar (top 6 modül) */}
      <div className="row g-3 mb-3">
        {topItems.length === 0 && !loading && (
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-3">
                <p className="text-muted small mb-0">
                  Henüz özetlenecek içerik bulunamadı.{" "}
                  <code>/admin/dashboard/summary</code> yanıtına{" "}
                  <code>items</code> ekleyerek modül sayılarını
                  döndürebilirsin.
                </p>
              </div>
            </div>
          </div>
        )}

        {topItems.map((item) => {
          const Icon = getIconForItem(item);
          const percent =
            maxCount > 0 ? Math.round((item.count / maxCount) * 100) : 0;

          return (
            <div key={item.key} className="col-12 col-sm-6 col-lg-4">
              <button
                type="button"
                className="card border-0 shadow-sm h-100 text-start w-100"
                style={{ cursor: onSelectTab ? "pointer" : "default" }}
                onClick={() =>
                  onSelectTab && (onSelectTab(item.key as ActiveTab))
                }
              >
                <div className="card-body py-3 px-3 d-flex flex-column gap-2">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <div className="small fw-semibold">{item.label}</div>
                        <div className="text-muted small">
                          {item.key}
                        </div>
                      </div>
                    </div>
                    <div className="fs-5 fw-bold">{item.count}</div>
                  </div>

                  <div className="mt-1">
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
                      <small className="text-muted">
                        {percent}%
                      </small>
                    </div>
                  </div>

                  {onSelectTab && (
                    <div className="mt-1 text-end">
                      <span className="text-primary small">
                        Detaya git →
                      </span>
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* 2. Satır: Dağılım grafiği + küçük özetler */}
      {items.length > 0 && (
        <div className="row g-3">
          {/* Dağılım: her modül için yatay bar grafiği */}
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header py-2 d-flex justify-content-between align-items-center">
                <span className="small fw-semibold">İçerik Dağılımı</span>
                <span className="text-muted small">
                  Modüllere göre kayıt sayıları
                </span>
              </div>
              <div className="card-body">
                {items.map((item) => {
                  const percent =
                    maxCount > 0
                      ? Math.max(4, Math.round((item.count / maxCount) * 100))
                      : 0;
                  const Icon = getIconForItem(item);

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
                          <span className="text-muted">{item.count} kayıt</span>
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
              </div>
            </div>
          </div>

          {/* Sağ: küçük özet kutuları */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body py-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center"
                      style={{ width: 32, height: 32 }}
                    >
                      <BarChart3 size={16} />
                    </div>
                    <div>
                      <div className="small fw-semibold">Toplam Modül</div>
                      <div className="text-muted small">
                        Dashboard özetine dahil edilen modül sayısı.
                      </div>
                    </div>
                  </div>
                  <div className="fs-5 fw-bold text-success">
                    {items.length}
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body py-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="rounded-circle bg-warning-subtle text-warning d-flex align-items-center justify-content-center"
                      style={{ width: 32, height: 32 }}
                    >
                      <Mail size={16} />
                    </div>
                    <div>
                      <div className="small fw-semibold">
                        Okunmamış Bildirim
                      </div>
                      <div className="text-muted small">
                        Admin hesabı için unread notifications.
                      </div>
                    </div>
                  </div>
                  <div className="fs-5 fw-bold text-warning">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </div>
                </div>
                <div className="text-muted small">
                  Detay için üstteki bildirim çanına tıklayarak son
                  bildirimleri görüntüleyebilirsin.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="mt-3 text-muted small">
          Veriler yükleniyor...
        </div>
      )}
    </div>
  );
};
