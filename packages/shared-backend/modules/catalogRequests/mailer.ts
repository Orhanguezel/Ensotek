import { SITE_NAME, escapeMailHtml, sendMailRaw, wrapMailBody } from '../mail';
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
