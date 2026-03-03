import { redirect } from "next/navigation";
import { getRuntimeLocaleSettings } from "@/i18n/locale-settings";

export default async function LibraryRedirectPage() {
  const { defaultLocale } = await getRuntimeLocaleSettings();
  redirect(`/${defaultLocale}/library`);
}
