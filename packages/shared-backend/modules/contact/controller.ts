// =============================================================
// FILE: src/modules/contact/controller.ts (PUBLIC)
// =============================================================
import type { FastifyRequest, FastifyReply } from 'fastify';
import { handleRouteError, getAdminNotificationEmails } from '../_shared';
import { SITE_NAME } from '../mail';
import {
  escapeContactHtml,
  getContactRequestLocale,
  getContactRequestMeta,
  logContactRequestError,
} from "./helpers";
import { ContactCreateSchema } from './validation';
import { repoCreateContact } from './repository';
import type { ContactView } from './schema';
import { sendMailRaw } from '../mail';
import { telegramNotify } from '../telegram';

async function sendContactEmails(contact: ContactView, locale: string | null) {
  const adminEmails = await getAdminNotificationEmails(locale).catch(() => []);

  const deliveries = adminEmails.map((to) => sendMailRaw({
      to,
      subject: `[İletişim] ${escapeContactHtml(contact.subject)} — ${escapeContactHtml(contact.name)}`,
      html: `<p><strong>Ad:</strong> ${escapeContactHtml(contact.name)}</p>
             <p><strong>E-posta:</strong> ${escapeContactHtml(contact.email)}</p>
             <p><strong>Telefon:</strong> ${escapeContactHtml(contact.phone ?? '')}</p>
             <p><strong>Konu:</strong> ${escapeContactHtml(contact.subject)}</p>
             <p><strong>Mesaj:</strong><br/>${escapeContactHtml(contact.message).replace(/\n/g, '<br/>')}</p>`,
      text: `Ad: ${contact.name}\nE-posta: ${contact.email}\nTelefon: ${contact.phone ?? ''}\nKonu: ${contact.subject}\n\n${contact.message}`,
    }));

  const language = locale?.toLowerCase().slice(0, 2);
  const copy = language === 'de'
    ? { subject: 'Wir haben Ihre Nachricht erhalten', greeting: 'Guten Tag', confirmation: 'Ihre Nachricht ist bei uns eingegangen. Wir melden uns so bald wie möglich bei Ihnen.', closing: 'Mit freundlichen Grüßen', team: 'Team' }
    : language === 'en'
    ? { subject: 'We received your message', greeting: 'Hello', confirmation: 'We have received your message and will get back to you shortly.', closing: 'Best regards', team: 'Team' }
    : { subject: 'Mesajınız alındı', greeting: 'Merhaba', confirmation: 'Mesajınız tarafımıza ulaştı. En kısa sürede yanıt vereceğiz.', closing: 'İyi günler', team: 'Ekibi' };
  deliveries.push(sendMailRaw({
    to: contact.email,
    subject: `${copy.subject} — ${contact.subject}`,
    html: `<p>${copy.greeting} <strong>${escapeContactHtml(contact.name)}</strong>,</p><p>${copy.confirmation}</p><p>${copy.closing},<br/>${escapeContactHtml(SITE_NAME)} ${copy.team}</p>`,
    text: `${copy.greeting} ${contact.name},\n\n${copy.confirmation}\n\n${copy.closing},\n${SITE_NAME} ${copy.team}`,
  }));
  const results = await Promise.allSettled(deliveries);
  const failed = results.find((result) => result.status === 'rejected');
  if (failed?.status === 'rejected') throw failed.reason;
}

/** POST /contacts */
export async function createContactPublic(req: FastifyRequest, reply: FastifyReply) {
  try {
    const parsed = ContactCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'INVALID_BODY', details: parsed.error.flatten() });
    }

    // Honeypot
    if (parsed.data.website && parsed.data.website.trim().length > 0) {
      return reply.code(200).send({ ok: true });
    }

    const { ip, userAgent } = getContactRequestMeta(req);

    const created = await repoCreateContact({ ...parsed.data, ip, user_agent: userAgent });
    const locale = getContactRequestLocale(req);

    try {
      await sendContactEmails(created, locale);
    } catch (err: unknown) {
      logContactRequestError(req, err, 'contact_email_send_failed');
    }
    try {
      await telegramNotify({
        event: 'new_contact',
        data: {
          customer_name: created.name,
          customer_email: created.email,
          customer_phone: created.phone ?? '',
          company_name: parsed.data.company ?? '',
          subject: created.subject ?? '',
          message: created.message,
          created_at: created.created_at instanceof Date ? created.created_at.toISOString() : new Date().toISOString(),
        },
      });
    } catch (err: unknown) {
      logContactRequestError(req, err, 'contact_telegram_failed');
    }

    return reply.code(201).send(created);
  } catch (e) {
    return handleRouteError(reply, req, e, 'create_contact');
  }
}
