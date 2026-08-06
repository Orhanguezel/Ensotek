import { SITE_NAME, escapeMailHtml, sendMailRaw, wrapMailBody } from '../mail';
import { getAdminNotificationEmails } from '../_shared';
import type { CatalogRequestRow } from './schema';

export async function sendCatalogRequestMail(row: CatalogRequestRow) {
  const catalogUrl = row.catalog_url || 'https://www.ensotek.de/uploads/ensotek/catalog/ensotek-katalog.pdf';
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

export async function sendCatalogRequestAdminMail(row: CatalogRequestRow) {
  const adminEmails = await getAdminNotificationEmails();
  if (!adminEmails.length) return;

  const subject = `[Katalog Talebi] ${escapeMailHtml(row.customer_name || row.email)}`;
  const html = `<p><strong>Ad:</strong> ${escapeMailHtml(row.customer_name || '')}</p>
    <p><strong>E-posta:</strong> ${escapeMailHtml(row.email)}</p>
    <p><strong>Telefon:</strong> ${escapeMailHtml(row.phone ?? '')}</p>
    <p><strong>Firma:</strong> ${escapeMailHtml(row.company_name ?? '')}</p>
    <p><strong>Katalog:</strong> ${escapeMailHtml(row.catalog_url ?? '')}</p>`;
  const text = `Ad: ${row.customer_name || ''}\nE-posta: ${row.email}\nTelefon: ${row.phone ?? ''}\nFirma: ${row.company_name ?? ''}\nKatalog: ${row.catalog_url ?? ''}`;

  for (const to of adminEmails) {
    await sendMailRaw({ to, subject, html, text });
  }
}
