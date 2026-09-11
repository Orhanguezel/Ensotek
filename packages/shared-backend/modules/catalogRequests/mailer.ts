import { SITE_NAME, escapeMailHtml, sendMailRaw, wrapMailBody } from '../mail';
import { getAdminNotificationEmails } from '../_shared';
import type { CatalogRequestRow } from './schema';

const copy = {
  tr: { customer: 'Müşterimiz', hello: 'Merhaba', download: 'Katalog indirme bağlantınız', received: 'Katalog talebiniz alındı', link: 'Katalog bağlantınız', reply: 'Projeniz veya teklif için bu e-postayı yanıtlayabilirsiniz.', confirm: 'Katalog talebinizi doğrulayın', confirmTitle: 'E-posta adresinizi doğrulayın', confirmText: 'Kataloğu almak için e-posta adresinizi doğrulayın.', action: 'Doğrula ve kataloğu al', expiry: 'Bu bağlantı 24 saat geçerlidir. Talebi siz oluşturmadıysanız bu e-postayı yok sayabilirsiniz.' },
  en: { customer: 'Customer', hello: 'Hello', download: 'Your catalog download link', received: 'We received your catalog request', link: 'Your catalog link', reply: 'Reply to this email to discuss your project or request a quote.', confirm: 'Confirm your catalog request', confirmTitle: 'Confirm your email address', confirmText: 'Confirm your email address to receive the catalog.', action: 'Confirm and receive catalog', expiry: 'This link is valid for 24 hours. If you did not request it, you can ignore this email.' },
  de: { customer: 'Kundin oder Kunde', hello: 'Guten Tag', download: 'Ihr Katalog-Downloadlink', received: 'Ihre Kataloganfrage ist eingegangen', link: 'Ihr Kataloglink', reply: 'Antworten Sie auf diese E-Mail, um Ihr Projekt zu besprechen oder ein Angebot anzufragen.', confirm: 'Bestätigen Sie Ihre Kataloganfrage', confirmTitle: 'E-Mail-Adresse bestätigen', confirmText: 'Bestätigen Sie Ihre E-Mail-Adresse, um den Katalog zu erhalten.', action: 'Bestätigen und Katalog erhalten', expiry: 'Dieser Link ist 24 Stunden gültig. Falls Sie die Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren.' },
};
function language(locale?: string | null) { const value = String(locale || 'tr').slice(0, 2).toLowerCase(); return value === 'de' || value === 'en' ? value : 'tr'; }

export async function sendCatalogRequestMail(row: CatalogRequestRow, options?: { attachmentFilename?: string }) {
  if (!row.catalog_url) throw new Error('catalog_url_missing');
  const locale = language(row.locale), t = copy[locale];
  const name = row.customer_name || t.customer;
  const subject = `${t.download} — ${SITE_NAME}`;
  const html = wrapMailBody(`<h2>${t.received}</h2><p>${t.hello} <strong>${escapeMailHtml(name)}</strong>,</p><p>${t.link}:</p><p><a href="${escapeMailHtml(row.catalog_url)}">${escapeMailHtml(row.catalog_url)}</a></p><p>${t.reply}</p>`, locale);
  const text = `${t.hello} ${name},\n\n${t.link}:\n${row.catalog_url}\n\n${t.reply}\n\n${SITE_NAME}`;
  await sendMailRaw({ to: row.email, subject, html, text, ...(options?.attachmentFilename ? { attachments: [{ filename: options.attachmentFilename, path: row.catalog_url, contentType: "application/pdf" }] } : {}) });
}

export async function sendCatalogVerificationMail(row: CatalogRequestRow, verificationUrl: string) {
  const locale = language(row.locale), t = copy[locale];
  const name = row.customer_name || t.customer;
  const subject = `${t.confirm} — ${SITE_NAME}`;
  const html = wrapMailBody(`<h2>${t.confirmTitle}</h2><p>${t.hello} <strong>${escapeMailHtml(name)}</strong>,</p><p>${t.confirmText}</p><p><a href="${escapeMailHtml(verificationUrl)}" style="display:inline-block;padding:12px 18px;background:#07365d;color:white;">${t.action}</a></p><p>${t.expiry}</p>`, locale);
  const text = `${t.hello} ${name},\n\n${t.confirmText}\n${verificationUrl}\n\n${t.expiry}`;
  await sendMailRaw({ to: row.email, subject, html, text });
}

export async function sendCatalogRequestAdminMail(row: CatalogRequestRow) {
  const adminEmails = await getAdminNotificationEmails(row.locale);
  if (!adminEmails.length) return;

  const subject = `[Katalog Talebi] ${escapeMailHtml(row.customer_name || row.email)}`;

  // Musterinin formda doldurdugu HER alan maile girmeli. Onceden `message`
  // (musterinin yazdigi not), ulke, dil ve onaylar maile HIC yansimiyordu.
  const evet = (v: unknown) => (v === true || v === 1 || v === '1' ? 'Evet' : 'Hayır');
  const alanlar: Array<[string, string]> = [
    ['Ad', row.customer_name || ''],
    ['Firma', row.company_name ?? '-'],
    ['E-posta', row.email],
    ['Telefon', row.phone ?? '-'],
    ['Ülke', (row as { country_code?: string | null }).country_code ?? '-'],
    ['Mesaj', row.message ?? '-'],
    ['Katalog', row.catalog_url ?? '-'],
    ['Dil', row.locale ?? '-'],
    ['Pazarlama izni', evet((row as { consent_marketing?: unknown }).consent_marketing)],
    ['Şartlar onayı', evet((row as { consent_terms?: unknown }).consent_terms)],
  ];

  const html =
    '<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">' +
    '<h2>Yeni katalog talebi</h2><table style="border-collapse:collapse;width:100%">' +
    alanlar
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 10px;font-weight:600">${escapeMailHtml(k)}</td>` +
          `<td style="padding:6px 10px">${escapeMailHtml(String(v))}</td></tr>`,
      )
      .join('') +
    '</table></div>';

  const text = alanlar.map(([k, v]) => `${k}: ${v}`).join('\n');

  for (const to of adminEmails) {
    await sendMailRaw({ to, subject, html, text });
  }
}
