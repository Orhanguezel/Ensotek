"use client";

import React, { useMemo } from "react";
import Layout from "@/components/layout/Layout";
import Logout from "@/components/containers/auth/Logout";

import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const toLocaleShort = (l: unknown) =>
  String(l || "tr").trim().toLowerCase().split("-")[0] || "tr";

const LogoutPage: React.FC = () => {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection("ui_auth", locale);

  const title = ui("ui_auth_logout_meta_title", "Signing out | Ensotek");
  const description = ui(
    "ui_auth_logout_meta_description",
    "Signing you out of your Ensotek account.",
  );

  return (
    <Layout title={title} description={description}>
      <Logout />
    </Layout>
  );
};

export default LogoutPage;
