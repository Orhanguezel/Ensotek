"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import Login from "@/components/containers/auth/Login";

import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const LoginPage = () => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_auth", locale);

  const title = ui("login_meta_title", "Sign In | Ensotek");
  const description = ui(
    "login_meta_desc",
    "Sign in to your Ensotek account.",
  );

  return (
    <Layout title={title} description={description}>
      <Login />
    </Layout>
  );
};

export default LoginPage;
