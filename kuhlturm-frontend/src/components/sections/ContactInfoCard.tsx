import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export interface ContactInfo {
  phones?: string[];
  whatsappNumber?: string;
  email?: string;
  companyName?: string;
  address?: string;
  addressSecondary?: string;
  city?: string;
  country?: string;
  website?: string;
}

interface Props {
  info: ContactInfo;
  labels: {
    title: string;
    callUs: string;
    emailUs: string;
    address: string;
    whatsapp: string;
  };
}

export function ContactInfoCard({ info, labels }: Props) {
  const displayPhone = info.phones?.[0];
  const whatsappRaw = info.whatsappNumber || displayPhone;
  const cleanPhone = whatsappRaw?.replace(/\D/g, '').replace(/^00/, '');

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col gap-4">
      <h3 className="font-display text-base font-bold text-slate-900">{labels.title}</h3>

      {displayPhone && (
        <a
          href={`tel:${displayPhone}`}
          className="flex items-start gap-3 group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Phone size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              {labels.callUs}
            </p>
            <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
              {displayPhone}
            </p>
          </div>
        </a>
      )}

      {info.email && (
        <a
          href={`mailto:${info.email}`}
          className="flex items-start gap-3 group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Mail size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              {labels.emailUs}
            </p>
            <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors break-all">
              {info.email}
            </p>
          </div>
        </a>
      )}

      {(info.address || info.city) && (
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
            <MapPin size={16} className="text-slate-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              {labels.address}
            </p>
            <p className="text-sm text-slate-700">
              {[info.address, info.addressSecondary, info.city, info.country].filter(Boolean).join(', ')}
            </p>
          </div>
        </div>
      )}

      {cleanPhone && (
        <a
          href={`https://wa.me/${cleanPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors justify-center"
        >
          <MessageCircle size={15} />
          {labels.whatsapp}
        </a>
      )}
    </div>
  );
}
