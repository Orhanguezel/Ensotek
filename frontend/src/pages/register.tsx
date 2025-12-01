"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import Register from "@/components/containers/auth/Register";

import { useResolvedLocale } from "@/lib/i18n/locale";
import { useUiSection } from "@/lib/i18n/uiDb";
import { UI_KEYS } from "@/lib/i18n/ui";

const RegisterPage = () => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_auth", locale, UI_KEYS.auth);

  const title = ui("register_meta_title", "Sign Up | Ensotek");
  const description = ui(
    "register_meta_desc",
    "Create your Ensotek account.",
  );

  return (
    <Layout title={title} description={description}>
      <Register />
    </Layout>
  );
};

export default RegisterPage;
