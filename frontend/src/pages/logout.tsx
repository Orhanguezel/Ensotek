"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import Logout from "@/components/containers/auth/Logout";

import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const LogoutPage = () => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_auth", locale);

  const title = ui("logout_meta_title", "Signing out | Ensotek");
  const description = ui(
    "logout_meta_desc",
    "Signing you out of your Ensotek account.",
  );

  return (
    <Layout title={title} description={description}>
      <Logout />
    </Layout>
  );
};

export default LogoutPage;
