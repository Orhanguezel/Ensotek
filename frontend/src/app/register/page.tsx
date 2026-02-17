import { redirect } from "next/navigation";
import { getRuntimeLocaleSettings } from "@/i18n/locale-settings";

export default async function RegisterRedirectPage() {
  const { defaultLocale } = await getRuntimeLocaleSettings();
  redirect(`/${defaultLocale}/register`);
}

