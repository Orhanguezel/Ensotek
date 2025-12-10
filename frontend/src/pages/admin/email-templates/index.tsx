// =============================================================
// FILE: src/pages/admin/email-templates/index.tsx
// Ensotek – Admin Email Templates Liste Sayfası
// =============================================================

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  useListEmailTemplatesAdminQuery,
  useUpdateEmailTemplateAdminMutation,
  useDeleteEmailTemplateAdminMutation,
} from "@/integrations/rtk/endpoints/admin/email_templates_admin.endpoints";

import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";

import type {
  EmailTemplateAdminListItemDto,
  EmailTemplateAdminListQueryParams,
} from "@/integrations/types/email_templates.types";

import {
  EmailTemplateHeader,
  type LocaleOption,
} from "@/components/admin/email-templates/EmailTemplateHeader";
import { EmailTemplateList } from "@/components/admin/email-templates/EmailTemplateList";

const EmailTemplatesAdminPage: React.FC = () => {
  const router = useRouter();

  /* -------------------- Filtre state -------------------- */
  const [search, setSearch] = useState("");
  const [locale, setLocale] = useState(""); // "" = tüm diller
  const [isActiveFilter, setIsActiveFilter] = useState<
    "" | "active" | "inactive"
  >("");

  /* -------------------- Locale options (site_settings.app_locales) -------------------- */

  const {
    data: appLocaleRows,
    isLoading: isLocalesLoading,
  } = useListSiteSettingsAdminQuery({
    keys: ["app_locales"],
  });

  const localeCodes = useMemo(() => {
    if (!appLocaleRows || appLocaleRows.length === 0) {
      return ["tr", "en"];
    }

    const row = appLocaleRows.find((r) => r.key === "app_locales");
    const v = row?.value;
    let arr: string[] = [];

    if (Array.isArray(v)) {
      arr = v.map((x) => String(x)).filter(Boolean);
    } else if (typeof v === "string") {
      try {
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) {
          arr = parsed.map((x) => String(x)).filter(Boolean);
        }
      } catch {
        // ignore
      }
    }

    if (!arr.length) {
      return ["tr", "en"];
    }

    // uniq + lower-case
    const uniqLower = Array.from(
      new Set(arr.map((x) => String(x).toLowerCase())),
    );
    return uniqLower;
  }, [appLocaleRows]);

  const localeOptions: LocaleOption[] = useMemo(
    () =>
      localeCodes.map((code) => {
        const lower = code.toLowerCase();
        let label = `${code.toUpperCase()} (${lower})`;

        if (lower === "tr") label = "Türkçe (tr)";
        else if (lower === "en") label = "İngilizce (en)";
        else if (lower === "de") label = "Almanca (de)";

        return { value: lower, label };
      }),
    [localeCodes],
  );

  const handleLocaleChange = (next: string) => {
    const normalized = next ? next.trim().toLowerCase() : "";
    setLocale(normalized);
  };

  /* -------------------- Liste + filtreler -------------------- */

  const listParams = useMemo<EmailTemplateAdminListQueryParams | void>(() => {
    const params: EmailTemplateAdminListQueryParams = {};

    if (search.trim()) {
      params.q = search.trim();
    }

    if (locale.trim()) {
      params.locale = locale.trim();
    }

    if (isActiveFilter === "active") {
      params.is_active = 1;
    } else if (isActiveFilter === "inactive") {
      params.is_active = 0;
    }

    return Object.keys(params).length > 0 ? params : undefined;
  }, [search, locale, isActiveFilter]);

  const {
    data: listData,
    isLoading,
    isFetching,
    refetch,
  } = useListEmailTemplatesAdminQuery(listParams);

  const [rows, setRows] = useState<EmailTemplateAdminListItemDto[]>([]);

  useEffect(() => {
    setRows(listData ?? []);
  }, [listData]);

  const total = rows.length;

  /* -------------------- Mutations ----------------------------- */

  const [updateTemplate, { isLoading: isUpdating }] =
    useUpdateEmailTemplateAdminMutation();
  const [deleteTemplate, { isLoading: isDeleting }] =
    useDeleteEmailTemplateAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isUpdating || isDeleting;

  /* -------------------- Actions ----------------------- */

  const handleCreateClick = () => {
    router.push("/admin/email-templates/new");
  };

  const handleEdit = (item: EmailTemplateAdminListItemDto) => {
    router.push(`/admin/email-templates/${item.id}`);
  };

  const handleDelete = async (item: EmailTemplateAdminListItemDto) => {
    if (
      !window.confirm(
        `"${item.template_key}" şablonunu silmek üzeresin. Devam etmek istiyor musun?`,
      )
    ) {
      return;
    }

    try {
      await deleteTemplate(item.id).unwrap();
      toast.success(`"${item.template_key}" silindi.`);
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.data?.error ||
        err?.message ||
        "Şablon silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleActive = async (
    item: EmailTemplateAdminListItemDto,
    value: boolean,
  ) => {
    try {
      await updateTemplate({
        id: item.id,
        patch: { is_active: value },
      }).unwrap();

      setRows((prev) =>
        prev.map((r) =>
          r.id === item.id ? { ...r, is_active: value } : r,
        ),
      );
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.data?.error ||
        err?.message ||
        "Aktif durumu güncellenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  /* -------------------- Render -------------------- */

  return (
    <div className="container-fluid py-4">
      <EmailTemplateHeader
        search={search}
        onSearchChange={setSearch}
        locale={locale}
        onLocaleChange={handleLocaleChange}
        locales={localeOptions}
        localesLoading={isLocalesLoading}
        isActiveFilter={isActiveFilter}
        onIsActiveFilterChange={setIsActiveFilter}
        loading={busy}
        total={total}
        onRefresh={refetch}
        onCreateClick={handleCreateClick}
      />

      <div className="row">
        <div className="col-12">
          <EmailTemplateList
            items={rows}
            loading={busy}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailTemplatesAdminPage;
