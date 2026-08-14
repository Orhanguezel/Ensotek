import { SITE_NAME, escapeMailHtml, sendMailRaw, wrapMailBody } from '../mail';
import { getAdminNotificationEmails } from '../_shared';
import type { CatalogRequestRow } from './schema';

export async function sendCatalogRequestMail(row: CatalogRequestRow) {
  const catalogUrl = row.catalog_url || 'https://www.ensotek.com.tr/uploads/catalog/ensotek-katalog.pdf';
  const name = row.customer_name || 'Musterimiz';
  const subject = `Katalog indirme bağlantınız — ${SITE_NAME}`;
  const html = wrapMailBody(`
    <h2 style="font-size:18px;">Katalog talebiniz alindi</h2>
    <p>Merhaba <strong>${escapeMailHtml(name)}</strong>,</p>
    <p>${escapeMailHtml(SITE_NAME)} katalog baglantiniz asagidadir:</p>
    <p><a href="${escapeMailHtml(catalogUrl)}" target="_blank" rel="noopener noreferrer">${escapeMailHtml(catalogUrl)}</a></p>
    <p>Teknik secim veya teklif icin bu e-postayi yanitlayabilirsiniz.</p>
    <p>${escapeMailHtml(SITE_NAME)} Ekibi</p>
  `);
  const text = `Merhaba ${name},\n\nKatalog baglantiniz:\n${catalogUrl}\n\nTeknik secim veya teklif icin bu e-postayi yanitlayabilirsiniz.\n\n${SITE_NAME} Ekibi`;
  await sendMailRaw({ to: row.email, subject, html, text });
}

export async function sendCatalogVerificationMail(row: CatalogRequestRow, verificationUrl: string) {
  const locale = String(row.locale || 'tr').toLowerCase();
  const name = row.customer_name || (locale.startsWith('en') ? 'Customer' : 'Müşterimiz');
  const isEnglish = locale.startsWith('en');
  const subject = isEnglish
    ? `Confirm your catalog request — ${SITE_NAME}`
    : `Katalog talebinizi doğrulayın — ${SITE_NAME}`;
  const html = wrapMailBody(isEnglish ? `
    <h2 style="font-size:18px;">Confirm your email address</h2>
    <p>Hello <strong>${escapeMailHtml(name)}</strong>,</p>
    <p>Please confirm your email address to receive the ${escapeMailHtml(SITE_NAME)} product catalog automatically.</p>
    <p><a href="${escapeMailHtml(verificationUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 18px;background:#07365d;color:#fff;text-decoration:none;border-radius:5px;">Confirm and receive catalog</a></p>
    <p>This link is valid for 24 hours. If you did not make this request, you can ignore this email.</p>
  ` : `
    <h2 style="font-size:18px;">E-posta adresinizi doğrulayın</h2>
    <p>Merhaba <strong>${escapeMailHtml(name)}</strong>,</p>
    <p>${escapeMailHtml(SITE_NAME)} ürün kataloğunu otomatik almak için e-posta adresinizi doğrulayın.</p>
    <p><a href="${escapeMailHtml(verificationUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 18px;background:#07365d;color:#fff;text-decoration:none;border-radius:5px;">Doğrula ve kataloğu al</a></p>
    <p>Bu bağlantı 24 saat geçerlidir. Talebi siz oluşturmadıysanız bu e-postayı yok sayabilirsiniz.</p>
  `);
  const text = isEnglish
    ? `Hello ${name},\n\nConfirm your email address to receive the catalog:\n${verificationUrl}\n\nThis link is valid for 24 hours.`
    : `Merhaba ${name},\n\nKataloğu almak için e-posta adresinizi doğrulayın:\n${verificationUrl}\n\nBu bağlantı 24 saat geçerlidir.`;
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
