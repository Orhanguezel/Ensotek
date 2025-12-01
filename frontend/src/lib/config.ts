import { DEFAULT_LOCALE } from "@/i18n/config";

/** .env’den tenant al (hem server hem client) */
export function getEnvTenant(): string {
  // NEXT_PUBLIC_TENANT > TENANT > 'ensotek'
  return (
    process.env.NEXT_PUBLIC_TENANT ||
    process.env.TENANT ||
    "ensotek"
  ).toLowerCase();
}

/** Varsayılan dil — i18n/config tek kaynak */
export function getEnvDefaultLocale() {
  return DEFAULT_LOCALE;
}
