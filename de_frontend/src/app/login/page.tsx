import { redirect } from "next/navigation";
import { getRuntimeLocaleSettings } from "@/i18n/locale-settings";

export default async function LoginRedirectPage() {
  const { defaultLocale } = await getRuntimeLocaleSettings();
  redirect(`/${defaultLocale}/login`);
}

