// =============================================================
// FILE: src/integrations/types/email_templates.types.ts
// Email Templates – Tipler (public + admin)
// =============================================================

export type BoolLike =
  | boolean
  | 0
  | 1
  | "0"
  | "1"
  | "true"
  | "false";

/* -------------------- PUBLIC DTO'lar -------------------- */

/**
 * PUBLIC list + get-by-key DTO
 * Backend (public.controller):
 *  id, key, name, subject, content_html, variables, is_active, locale,
 *  created_at, updated_at
 */
export interface EmailTemplatePublicDto {
  id: string;
  key: string;
  name: string;
  subject: string;
  content_html: string;
  variables: string[]; // backend parseVariablesFromText fallback da array
  is_active: boolean;
  locale: string | null;
  created_at: string | Date;
  updated_at: string | Date;
}

/**
 * PUBLIC render-by-key sonucu
 * Backend:
 *  id, key, name, subject, body, required_variables, missing_variables,
 *  updated_at, locale
 */
export interface RenderedEmailTemplateDto {
  id: string;
  key: string;
  name: string;
  subject: string;
  body: string;
  required_variables: string[];
  missing_variables: string[];
  updated_at: string | Date;
  locale: string | null;
}

/**
 * PUBLIC list query
 * Backend ListQuery:
 *  { locale?: string | null; is_active?: string | number | boolean; q?: string }
 */
export interface EmailTemplatePublicListQueryParams {
  q?: string;
  locale?: string | null;
  is_active?: BoolLike;
}

/**
 * PUBLIC render-by-key payload (RTK tarafında convenience için)
 */
export interface RenderEmailTemplateByKeyPayload {
  key: string;
  locale?: string | null;
  params?: Record<string, unknown>;
}

/* -------------------- ADMIN DTO'lar -------------------- */

/**
 * Admin list DTO
 * Backend listEmailTemplatesAdmin → out map:
 *  id, template_key, template_name, subject, content, locale,
 *  variables, detected_variables, is_active, created_at, updated_at
 */
export interface EmailTemplateAdminListItemDto {
  id: string;
  template_key: string;
  template_name: string | null;
  subject: string | null;
  content: string | null;
  locale: string | null;
  variables: string[] | null;
  detected_variables: string[];
  is_active: boolean;
  created_at: string | Date;
  updated_at: string | Date;
}

/**
 * Admin translation DTO
 * Backend get/create/update → translations elemanı:
 *  id, locale, template_name, subject, content,
 *  detected_variables, created_at, updated_at
 */
export interface EmailTemplateAdminTranslationDto {
  id: string;
  locale: string;
  template_name: string;
  subject: string;
  content: string;
  detected_variables: string[];
  created_at: string | Date;
  updated_at: string | Date;
}

/**
 * Admin detail DTO (get/create/update)
 * Backend:
 *  id, template_key, variables, is_active,
 *  created_at, updated_at, translations[]
 */
export interface EmailTemplateAdminDetailDto {
  id: string;
  template_key: string;
  variables: string[] | null;
  is_active: boolean;
  created_at: string | Date;
  updated_at: string | Date;
  translations: EmailTemplateAdminTranslationDto[];
}

/**
 * Admin list query (listQuerySchema ile uyumlu)
 * z.object({ q, locale, is_active })
 */
export interface EmailTemplateAdminListQueryParams {
  q?: string;
  locale?: string | null;
  is_active?: BoolLike;
}

/**
 * Admin create payload
 * emailTemplateCreateSchema:
 *  template_key (req)
 *  template_name (req)
 *  subject (req)
 *  content (req)
 *  variables (optional, string[] | JSON string | null)
 *  is_active (optional, BoolLike)
 *  locale (optional, string | null)
 */
export interface EmailTemplateAdminCreatePayload {
  template_key: string;

  template_name: string;
  subject: string;
  content: string;

  variables?: string[] | string | null;
  is_active?: BoolLike;
  locale?: string | null;
}

/**
 * Admin update payload
 * emailTemplateUpdateSchema:
 *  template_key?: string
 *  variables?: string[] | JSON string | null
 *  is_active?: BoolLike
 *  template_name?: string
 *  subject?: string
 *  content?: string
 *  locale?: string | null
 */
export interface EmailTemplateAdminUpdatePayload {
  template_key?: string;
  variables?: string[] | string | null;
  is_active?: BoolLike;

  template_name?: string;
  subject?: string;
  content?: string;

  locale?: string | null;
}

/**
 * Admin update mutation arg
 */
export interface EmailTemplateAdminUpdateArgs {
  id: string;
  patch: EmailTemplateAdminUpdatePayload;
}

/**
 * Admin orderBy, istersen ileride header'da kullanmak için:
 * - Backend list'te explicit orderBy yok ama FE tarafında union iyi olur.
 */
export type EmailTemplateAdminOrderBy =
  | "updated_at"
  | "created_at"
  | "template_key"
  | "locale";
