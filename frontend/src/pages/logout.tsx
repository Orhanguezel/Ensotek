"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import Logout from "@/components/containers/auth/Logout";

import { useResolvedLocale } from "@/lib/i18n/locale";
import { useUiSection } from "@/lib/i18n/uiDb";
import { UI_KEYS } from "@/lib/i18n/ui";

const LogoutPage = () => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_auth", locale, UI_KEYS.auth);

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
