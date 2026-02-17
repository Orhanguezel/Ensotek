import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LogoutClient } from "@/app/logout/logout-client";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `/${locale}/logout`,
    description: "Logout",
  };
}

export default async function LogoutPage({ params }: Props) {
  const { locale } = await params;
  const commonT = await getTranslations({ locale, namespace: "common" });

  return (
    <LogoutClient
      title={commonT("loading")}
      lead="You are being signed out and redirected to login."
      errorText="There was a server-side logout issue, but local session was cleared."
    />
  );
}

