// src/modules/mail/helpers/service.ts
import type { Transporter } from "nodemailer";
import type { SendMailInput } from "../validation";
import type { SmtpSettings } from "../../../siteSettings";
import { z } from "zod";
import { env } from "../../../../core/env";

const SITE_NAME = env.SITE_NAME || "Corporate Site";

export function buildMailTransportSignature(cfg: SmtpSettings): string {
  return [cfg.host ?? "", cfg.port ?? "", cfg.username ?? "", cfg.secure ? "1" : "0"].join("|");
}

export function buildMailFromAddress(smtpCfg: SmtpSettings): string {
  const fromEmail = smtpCfg.fromEmail || smtpCfg.username || "no-reply@example.com";
  return smtpCfg.fromName ? `${smtpCfg.fromName} <${fromEmail}>` : fromEmail;
}

export function createMailTransportConfig(cfg: SmtpSettings & { host: string; port: number }) {
  return {
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: cfg.username && cfg.password ? { user: cfg.username, pass: cfg.password } : undefined,
  };
}

export function escapeMailHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function wrapMailBody(body: string, locale = 'tr'): string {
  const name = escapeMailHtml(SITE_NAME);
  const footer = locale.startsWith('de') ? `Diese E-Mail wurde von ${name} gesendet.` : locale.startsWith('en') ? `This email was sent by ${name}.` : `Bu e-posta ${name} tarafından gönderilmiştir.`;
  return `<div style="font-family:system-ui,sans-serif;font-size:14px;color:#0F172A;line-height:1.6;max-width:560px;margin:0 auto;">${body}<p style="margin-top:24px;color:#64748B;font-size:12px;">${footer}</p></div>`;
}

export async function sendMailWithTransport(transporter: Transporter, from: string, data: SendMailInput) {
  const result = await transporter.sendMail({ from, to: data.to, subject: data.subject, text: data.text, html: data.html });
  console.info('mail_delivery_accepted', { message_id: result.messageId, accepted_count: result.accepted?.length ?? 0, rejected_count: result.rejected?.length ?? 0 });
  return result;
}

export const welcomeMailSchema = z.object({
  to: z.string().email(),
  user_name: z.string(),
  user_email: z.string().email(),
});

export type WelcomeMailInput = z.infer<typeof welcomeMailSchema>;

export const passwordChangedSchema = z.object({
  to: z.string().email(),
  user_name: z.string().optional(),
});

export type PasswordChangedMailInput = z.infer<typeof passwordChangedSchema>;

export { SITE_NAME };
