"use client";

import React, { useMemo } from "react";
import Layout from "@/components/layout/Layout";
import Register from "@/components/containers/auth/Register";

import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const toLocaleShort = (l: unknown) =>
  String(l || "tr").trim().toLowerCase().split("-")[0] || "tr";

const RegisterPage: React.FC = () => {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection("ui_auth", locale);

  const title = ui("ui_auth_register_meta_title", "Sign Up | Ensotek");
  const description = ui(
    "ui_auth_register_meta_description",
    "Create your Ensotek account.",
  );

  return (
    <Layout title={title} description={description}>
      <Register />
    </Layout>
  );
};

export default RegisterPage;
