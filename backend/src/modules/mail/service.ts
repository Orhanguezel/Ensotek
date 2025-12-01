// ===================================================================
// FILE: src/modules/mail/service.ts
// ===================================================================

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { z } from "zod";
import { env } from "@/core/env";
import {
  sendMailSchema,
  type SendMailInput,
  orderCreatedMailSchema,
  type OrderCreatedMailInput,
} from "./validation";
import {
  getSmtpSettings,
  type SmtpSettings,
} from "@/modules/siteSettings/service";

// email_templates → çoklu dilli template render
import { renderEmailTemplateByKey } from "@/modules/email-templates/service";

// site_name fallback için site_settings
import { db } from "@/db/client";
import { siteSettings } from "@/modules/siteSettings/schema";
import { eq } from "drizzle-orm";

// Basit cache (aynı config için transporter'ı tekrar tekrar kurmamak için)
let cachedTransporter: Transporter | null = null;
let cachedSignature: string | null = null;

function buildSignature(cfg: SmtpSettings): string {
  return [
    cfg.host ?? "",
    cfg.port ?? "",
    cfg.username ?? "",
    cfg.secure ? "1" : "0",
  ].join("|");
}

/* ==================================================================
   SITE NAME HELPER (site_settings → site_name)
   ================================================================== */

let cachedSiteName: string | null = null;
let cachedSiteNameLoadedAt: number | null = null;

async function getSiteNameFromSettings(): Promise<string> {
  const now = Date.now();
  // 5 dakikalık basit cache
  if (
    cachedSiteName &&
    cachedSiteNameLoadedAt &&
    now - cachedSiteNameLoadedAt < 5 * 60_000
  ) {
    return cachedSiteName;
  }

  // 1) site_title
  const [titleRow] = await db
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(eq(siteSettings.key, "site_title"))
    .limit(1);

  if (titleRow?.value) {
    cachedSiteName = String(titleRow.value);
    cachedSiteNameLoadedAt = now;
    return cachedSiteName;
  }

  // 2) footer_company_name
  const [companyRow] = await db
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(eq(siteSettings.key, "footer_company_name"))
    .limit(1);

  if (companyRow?.value) {
    cachedSiteName = String(companyRow.value);
    cachedSiteNameLoadedAt = now;
    return cachedSiteName;
  }

  // 3) Fallback
  cachedSiteName = "Site";
  cachedSiteNameLoadedAt = now;
  return cachedSiteName;
}

/** vars içine site_name yoksa settings’ten inject eder */
async function enrichParamsWithSiteName(
  params: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  if (Object.prototype.hasOwnProperty.call(params, "site_name")) {
    return params;
  }
  const siteName = await getSiteNameFromSettings();
  return {
    ...params,
    site_name: siteName,
  };
}

/* ==================================================================
   SMTP TRANSPORTER
   ================================================================== */

/**
 * SMTP config'ini site_settings + env'den okuyup transporter üretir
 */
async function getTransporter(): Promise<Transporter> {
  const cfg = await getSmtpSettings();

  if (!cfg.host) {
    throw new Error("smtp_host_not_configured");
  }
  if (!cfg.port) {
    // default 587 (TLS) fallback
    cfg.port = 587;
  }

  const signature = buildSignature(cfg);
  if (cachedTransporter && cachedSignature === signature) {
    return cachedTransporter;
  }

  const auth =
    cfg.username && cfg.password
      ? {
          user: cfg.username,
          pass: cfg.password,
        }
      : undefined;

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure, // smtp_ssl:true ise 465, değilse 587 vb.
    auth,
  });

  cachedTransporter = transporter;
  cachedSignature = signature;

  return transporter;
}

/* ==================================================================
   LOW-LEVEL SENDER
   ================================================================== */

/**
 * Düşük seviye mail gönderici (genel kullanım)
 * SMTP config'ini site_settings tablosundan okur.
 */
export async function sendMailRaw(input: SendMailInput) {
  const data = sendMailSchema.parse(input);

  const smtpCfg = await getSmtpSettings();

  // From alanını DB'den kur
  const fromEmail =
    smtpCfg.fromEmail ||
    env.MAIL_FROM ||
    env.SMTP_USER ||
    "no-reply@example.com";

  const from =
    smtpCfg.fromName && fromEmail
      ? `${smtpCfg.fromName} <${fromEmail}>`
      : fromEmail;

  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from,
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });

  return info;
}

/**
 * sendMailRaw için backward-compatible alias
 * (email-templates/mailer.ts gibi yerler sendMail bekliyor)
 */
export async function sendMail(input: SendMailInput) {
  return sendMailRaw(input);
}

// Basit HTML escape (ileride manuel HTML gereken yerler için elde bulunsun)
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, '&quot;')
    .replace(/'/g, "&#039;");
}

/* ==================================================================
   ORDER CREATED MAIL (email_templates → order_received)
   ================================================================== */

/**
 * Sipariş oluşturma maili
 *
 * NOT:
 *  - email_templates içindeki "order_received" template'i kullanılır.
 *  - site_name gönderilmezse site_settings → site_title / footer_company_name
 *    üzerinden doldurulur.
 *  - locale, email-templates service içinde i18n fallback (DEFAULT_LOCALE)
 *    ile birlikte çalışır.
 */
export async function sendOrderCreatedMail(input: OrderCreatedMailInput) {
  const data = orderCreatedMailSchema.parse(input);

  const baseParams: Record<string, unknown> = {
    customer_name: data.customer_name,
    order_number: data.order_number,
    final_amount: data.final_amount,
    status: data.status,
    site_name: data.site_name,
  };

  const params = await enrichParamsWithSiteName(baseParams);

  const rendered = await renderEmailTemplateByKey(
    "order_received",
    params,
    data.locale ?? null,
  );

  if (!rendered) {
    throw new Error("email_template_not_found:order_received");
  }

  if (rendered.missing_variables.length > 0) {
    throw new Error(
      `email_template_missing_params:order_received:${rendered.missing_variables.join(
        ",",
      )}`,
    );
  }

  await sendMail({
    to: data.to,
    subject: rendered.subject,
    html: rendered.html,
  });

  return rendered;
}

/* ==================================================================
   DEPOSIT SUCCESS MAIL (email_templates → deposit_success)
   ================================================================== */

const depositSuccessMailSchema = z.object({
  to: z.string().email(),
  user_name: z.string(),
  amount: z.union([z.string(), z.number()]),
  new_balance: z.union([z.string(), z.number()]),
  site_name: z.string().optional(),
  locale: z.string().optional(),
});

export type DepositSuccessMailInput = z.infer<typeof depositSuccessMailSchema>;

export async function sendDepositSuccessMail(input: DepositSuccessMailInput) {
  const data = depositSuccessMailSchema.parse(input);

  const amountStr =
    typeof data.amount === "number"
      ? data.amount.toFixed(2)
      : String(data.amount);
  const newBalanceStr =
    typeof data.new_balance === "number"
      ? data.new_balance.toFixed(2)
      : String(data.new_balance);

  const baseParams: Record<string, unknown> = {
    user_name: data.user_name,
    amount: amountStr,
    new_balance: newBalanceStr,
    site_name: data.site_name,
  };

  const params = await enrichParamsWithSiteName(baseParams);

  const rendered = await renderEmailTemplateByKey(
    "deposit_success",
    params,
    data.locale ?? null,
  );

  if (!rendered) {
    throw new Error("email_template_not_found:deposit_success");
  }

  if (rendered.missing_variables.length > 0) {
    throw new Error(
      `email_template_missing_params:deposit_success:${rendered.missing_variables.join(
        ",",
      )}`,
    );
  }

  await sendMail({
    to: data.to,
    subject: rendered.subject,
    html: rendered.html,
  });

  return rendered;
}

/* ==================================================================
   PASSWORD RESET MAIL (email_templates → password_reset)
//   (Auth tarafı için helper)
// ================================================================== */

const passwordResetMailSchema = z.object({
  to: z.string().email(),
  reset_link: z.string().min(1),
  site_name: z.string().optional(),
  locale: z.string().optional(),
});

export type PasswordResetMailInput = z.infer<typeof passwordResetMailSchema>;

/**
 * password_reset template'ine uygun payload:
 *  - { to, reset_link, site_name?, locale? }
 */
export async function sendPasswordResetMail(input: PasswordResetMailInput) {
  const data = passwordResetMailSchema.parse(input);

  const baseParams: Record<string, unknown> = {
    reset_link: data.reset_link,
    site_name: data.site_name,
  };

  const params = await enrichParamsWithSiteName(baseParams);

  const rendered = await renderEmailTemplateByKey(
    "password_reset",
    params,
    data.locale ?? null,
  );

  if (!rendered) {
    throw new Error("email_template_not_found:password_reset");
  }

  if (rendered.missing_variables.length > 0) {
    throw new Error(
      `email_template_missing_params:password_reset:${rendered.missing_variables.join(
        ",",
      )}`,
    );
  }

  await sendMail({
    to: data.to,
    subject: rendered.subject,
    html: rendered.html,
  });

  return rendered;
}

/* ==================================================================
   TICKET REPLIED MAIL (email_templates → ticket_replied)
//   (Support module bunu kullanıyor)
// ================================================================== */

const ticketRepliedMailSchema = z.object({
  to: z.string().email(),
  user_name: z.string(),
  ticket_id: z.string(),
  ticket_subject: z.string(),
  reply_message: z.string(),
  site_name: z.string().optional(),
  locale: z.string().optional(),
});

export type TicketRepliedMailInput = z.infer<typeof ticketRepliedMailSchema>;

/**
 * ticket_replied template'ine uygun payload:
 *  - { to, user_name, ticket_id, ticket_subject, reply_message, site_name?, locale? }
 *
 * NOT:
 *  - Seed'deki HTML içinde reply_message şu an direkt kullanılmıyor olabilir,
 *    ama JSON_ARRAY içinde var → ileride şablonu güncelleyip
 *    {{reply_message}} eklediğinde burası hazır.
 */
export async function sendTicketRepliedMail(input: TicketRepliedMailInput) {
  const data = ticketRepliedMailSchema.parse(input);

  const baseParams: Record<string, unknown> = {
    user_name: data.user_name,
    ticket_id: data.ticket_id,
    ticket_subject: data.ticket_subject,
    reply_message: data.reply_message,
    site_name: data.site_name,
  };

  const params = await enrichParamsWithSiteName(baseParams);

  const rendered = await renderEmailTemplateByKey(
    "ticket_replied",
    params,
    data.locale ?? null,
  );

  if (!rendered) {
    throw new Error("email_template_not_found:ticket_replied");
  }

  if (rendered.missing_variables.length > 0) {
    throw new Error(
      `email_template_missing_params:ticket_replied:${rendered.missing_variables.join(
        ",",
      )}`,
    );
  }

  await sendMail({
    to: data.to,
    subject: rendered.subject,
    html: rendered.html,
  });

  return rendered;
}

/* ==================================================================
   WELCOME MAIL (email_templates → welcome)
// ================================================================== */

const welcomeMailSchema = z.object({
  to: z.string().email(),
  user_name: z.string(),
  user_email: z.string().email(),
  site_name: z.string().optional(),
  locale: z.string().optional(),
});

export type WelcomeMailInput = z.infer<typeof welcomeMailSchema>;

/**
 * welcome template'ine uygun payload:
 *  - { to, user_name, user_email, site_name?, locale? }
 */
export async function sendWelcomeMail(input: WelcomeMailInput) {
  const data = welcomeMailSchema.parse(input);

  const baseParams: Record<string, unknown> = {
    user_name: data.user_name,
    user_email: data.user_email,
    site_name: data.site_name,
  };

  const params = await enrichParamsWithSiteName(baseParams);

  const rendered = await renderEmailTemplateByKey(
    "welcome",
    params,
    data.locale ?? null,
  );

  if (!rendered) {
    throw new Error("email_template_not_found:welcome");
  }

  if (rendered.missing_variables.length > 0) {
    throw new Error(
      `email_template_missing_params:welcome:${rendered.missing_variables.join(
        ",",
      )}`,
    );
  }

  await sendMail({
    to: data.to,
    subject: rendered.subject,
    html: rendered.html,
  });

  return rendered;
}

/* ==================================================================
   PASSWORD CHANGED MAIL (email_templates → password_changed)
// ================================================================== */

const passwordChangedMailSchema = z.object({
  to: z.string().email(),
  user_name: z.string().optional(),
  site_name: z.string().optional(),
  locale: z.string().optional(),
});

export type PasswordChangedMailInput = z.infer<typeof passwordChangedMailSchema>;

/**
 * Şifre değişikliğinde kullanıcıya bilgilendirme maili
 *  - email_templates içindeki "password_changed" template'ini kullanır.
 */
export async function sendPasswordChangedMail(
  input: PasswordChangedMailInput,
) {
  const data = passwordChangedMailSchema.parse(input);

  const baseParams: Record<string, unknown> = {
    user_name: data.user_name ?? "Kullanıcımız",
    site_name: data.site_name,
  };

  const params = await enrichParamsWithSiteName(baseParams);

  const rendered = await renderEmailTemplateByKey(
    "password_changed",
    params,
    data.locale ?? null,
  );

  if (!rendered) {
    throw new Error("email_template_not_found:password_changed");
  }

  if (rendered.missing_variables.length > 0) {
    throw new Error(
      `email_template_missing_params:password_changed:${rendered.missing_variables.join(
        ",",
      )}`,
    );
  }

  await sendMail({
    to: data.to,
    subject: rendered.subject,
    html: rendered.html,
  });

  return rendered;
}
