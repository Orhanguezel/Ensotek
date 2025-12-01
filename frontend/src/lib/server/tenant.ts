// src/lib/server/tenant.ts
import { getEnvTenant } from "@/lib/config";

// next/headers'i koşullu al (Pages'te yokmuş gibi davran)
let appHeaders: (() => Headers) | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  appHeaders = require("next/headers").headers as () => Headers;
} catch {
  appHeaders = null;
}

/** App Router varsa X-Tenant header'ını, yoksa .env TENANT'ı kullanır. */
export function resolveTenant(): string {
  const envTenant = getEnvTenant().toLowerCase();
  try {
    if (appHeaders) {
      const h = appHeaders();
      const forwarded = h.get("x-tenant");
      return (forwarded || envTenant).toLowerCase();
    }
  } catch {
    // Pages Router'da veya local dev'de patlarsa env'e düş
  }
  return envTenant;
}
