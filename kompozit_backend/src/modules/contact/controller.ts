// =============================================================
// FILE: src/modules/contact/controller.ts (PUBLIC)
// =============================================================
import type { FastifyRequest, FastifyReply } from "fastify";
import { ContactCreateSchema } from "./validation";
import { repoCreateContact } from "./repository";
import type { ContactView } from "./schema";
import {
  sendKompozitContactAdminMail,
  sendKompozitContactAutoReplyMail,
} from "@/core/kompozit-mail";
import { telegramNotify } from "@/modules/telegram/telegram.notifier";

type CreateReq = FastifyRequest<{ Body: unknown }>;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendContactEmails(contact: ContactView, locale: string | null) {
  await sendKompozitContactAdminMail({
    name: escapeHtml(contact.name),
    email: escapeHtml(contact.email),
    phone: escapeHtml(contact.phone),
    subject: escapeHtml(contact.subject),
    message: escapeHtml(contact.message),
    locale,
  });

  await sendKompozitContactAutoReplyMail({
    name: escapeHtml(contact.name),
    email: escapeHtml(contact.email),
    subject: escapeHtml(contact.subject),
    message: escapeHtml(contact.message),
    locale,
  });
}

export async function createContactPublic(req: CreateReq, reply: FastifyReply) {
  const parsed = ContactCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ error: "INVALID_BODY", details: parsed.error.flatten() });
  }

  // Basit honeypot: website doluysa drop et
  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    return reply.code(200).send({ ok: true }); // sessiz discard
  }

  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    (req.socket as any)?.remoteAddress ||
    null;

  const ua = (req.headers["user-agent"] as string) || null;

  const created = await repoCreateContact({
    ...parsed.data,
    ip,
    user_agent: ua,
  });

  // Locale'i Fastify request’ten al (metahub i18n pipeline’ına uygun)
  const locale = ((req as any).locale ?? null) as string | null;

  // Mail gönder; hata olursa logla ama kullanıcıya hata gösterme
  try {
    await sendContactEmails(created, locale);
  } catch (err: any) {
    req.log?.error?.({ err }, "contact_email_send_failed");
  }

  // Telegram notification
  try {
    await telegramNotify({
      event: "new_contact",
      data: {
        customer_name: created.name,
        customer_email: created.email,
        customer_phone: created.phone ?? "",
        company_name: "",
        subject: created.subject ?? "",
        message: created.message,
        created_at:
          created.created_at instanceof Date
            ? created.created_at.toISOString()
            : new Date().toISOString(),
      },
    });
  } catch (err: any) {
    req.log?.error?.({ err }, "contact_telegram_failed");
  }

  return reply.code(201).send(created);
}
