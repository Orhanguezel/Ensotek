/**
 * Mail module — public yuzey.
 *
 * Gercek implementasyon `./mail` altindadir. SMTP konfigurasyonu proje
 * bazli degil; DB'deki site_settings (getSmtpSettings) uzerinden okunur,
 * dolayisiyla tum projeler ayni implementasyonu paylasir.
 *
 * NOT: Burasi eskiden sadece console.warn yapan bir stub idi; bu yuzden
 * iletisim formu / hos geldin / sifre maillleri hic gonderilmiyordu.
 */
export {
  SITE_NAME,
  escapeMailHtml,
  wrapMailBody,
} from './mail/helpers';

export {
  sendMailRaw,
  sendWelcomeMail,
  sendPasswordChangedMail,
} from './mail/service';
