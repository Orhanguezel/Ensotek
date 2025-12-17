"use client";

import React, { useMemo } from "react";
import Layout from "@/components/layout/Layout";
import Login from "@/components/containers/auth/Login";

import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const toLocaleShort = (l: unknown) =>
  String(l || "tr").trim().toLowerCase().split("-")[0] || "tr";

const LoginPage: React.FC = () => {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection("ui_auth", locale);

  const title = ui("ui_auth_login_meta_title", "Sign In | Ensotek");
  const description = ui(
    "ui_auth_login_meta_description",
    "Sign in to your Ensotek account.",
  );

  return (
    <Layout title={title} description={description}>
      <Login />
    </Layout>
  );
};

export default LoginPage;
