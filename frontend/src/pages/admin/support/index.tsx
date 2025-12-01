// =============================================================
// FILE: src/pages/admin/support/index.tsx
// Ensotek – Admin Support Tickets List Page
// =============================================================

import React, { useMemo, useState } from "react";
import type { NextPage } from "next";

import {
  SupportHeader,
  type SupportFilters,
} from "@/components/admin/support/SupportHeader";
import { SupportList } from "@/components/admin/support/SupportList";
import { useListSupportTicketsAdminQuery } from "@/integrations/rtk/endpoints/admin/support_admin.endpoints";
import type { AdminSupportTicketDto } from "@/integrations/types/support.types";

const AdminSupportIndexPage: NextPage = () => {
  const [filters, setFilters] = useState<SupportFilters>({
    search: "",
    status: "all",
    priority: "all",
    sort: "created_at",
    order: "desc",
  });

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      q: filters.search || undefined,
      status: filters.status === "all" ? undefined : filters.status,
      priority:
        filters.priority === "all" ? undefined : filters.priority,
      sort: filters.sort,
      order: filters.order,
      limit: 50,
      offset: 0,
    };
    return params;
  }, [filters]);

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useListSupportTicketsAdminQuery(queryParams);

  const loading = isLoading || isFetching;

  const items: AdminSupportTicketDto[] = data?.items ?? [];
  const total = data?.total ?? items.length;

  return (
    <div className="container-fluid py-3">
      <SupportHeader
        filters={filters}
        total={total}
        loading={loading}
        onFiltersChange={setFilters}
        onRefresh={refetch}
      />

      <SupportList items={items} loading={loading} />
    </div>
  );
};

export default AdminSupportIndexPage;
