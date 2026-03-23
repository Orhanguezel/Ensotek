'use client';

import { useState, useEffect } from 'react';
import { Send, Wrench, Settings2, Box } from 'lucide-react';
import { createOffer, getProducts, getServices } from '@ensotek/core/services';
import { API_BASE_URL } from '@/lib/utils';
import type { Product, Service } from '@ensotek/core/types';

type Tab = 'service' | 'product' | 'sparepart';

interface Labels {
  // Tabs
  tabService: string;
  tabProduct: string;
  tabSparepart: string;
  // Common contact fields
  nameLabel: string;
  companyLabel: string;
  emailLabel: string;
  phoneLabel: string;
  placeholderName: string;
  placeholderCompany: string;
  placeholderEmail: string;
  placeholderPhone: string;
  // Service tab
  serviceLabel: string;
  selectService: string;
  serviceDescLabel: string;
  serviceDescPlaceholder: string;
  // Product tab
  productLabel: string;
  selectProduct: string;
  towerProcessLabel: string;
  towerProcessPlaceholder: string;
  towerCityLabel: string;
  towerCityPlaceholder: string;
  waterFlowLabel: string;
  waterFlowPlaceholder: string;
  inletTempLabel: string;
  inletTempPlaceholder: string;
  outletTempLabel: string;
  outletTempPlaceholder: string;
  wetBulbTempLabel: string;
  wetBulbTempPlaceholder: string;
  capacityLabel: string;
  capacityPlaceholder: string;
  notesLabel: string;
  notesPlaceholder: string;
  // Spare parts tab
  sparepartDescLabel: string;
  sparepartDescPlaceholder: string;
  partNumberLabel: string;
  partNumberPlaceholder: string;
  quantityLabel: string;
  quantityPlaceholder: string;
  sparepartNotesLabel: string;
  sparepartNotesPlaceholder: string;
  // Consents & submit
  consentTerms: string;
  consentMarketing: string;
  submitLabel: string;
  submittingLabel: string;
  successTitle: string;
  successDetail: string;
  errorMessage: string;
}

interface Props {
  locale: string;
  labels: Labels;
  initialTab?: Tab;
  // Spare part pre-fill
  initialPartId?: string;
  initialPartTitle?: string;
  initialPartCode?: string;
  // Product pre-fill
  initialProductId?: string;
  initialProductTitle?: string;
  // Service pre-fill
  initialServiceId?: string;
  initialServiceName?: string;
}

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20';
const labelCls = 'block text-xs font-semibold text-slate-600 mb-1.5';

export function OfferForm({ locale, labels, initialTab, initialPartId, initialPartTitle, initialPartCode, initialProductId, initialProductTitle, initialServiceId, initialServiceName }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab ?? 'service');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const [products, setProducts] = useState<Product[]>([]);
  const [spareParts, setSpareParts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // Common contact
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Service tab
  const [serviceId, setServiceId] = useState(initialServiceId ?? '');
  const [serviceDesc, setServiceDesc] = useState(
    initialServiceName ? `Dienstleistung: ${initialServiceName}` : '',
  );

  // Product tab
  const [productId, setProductId] = useState(initialProductId ?? '');
  const [towerProcess, setTowerProcess] = useState('');
  const [towerCity, setTowerCity] = useState('');
  const [waterFlow, setWaterFlow] = useState('');
  const [inletTemp, setInletTemp] = useState('');
  const [outletTemp, setOutletTemp] = useState('');
  const [wetBulbTemp, setWetBulbTemp] = useState('');
  const [capacity, setCapacity] = useState('');
  const [productNotes, setProductNotes] = useState('');

  // Spare parts tab
  const [sparepartId, setSparepartId] = useState(initialPartId ?? '');
  const [sparepartDesc, setSparepartDesc] = useState(
    initialPartTitle ? `Ersatzteil: ${initialPartTitle}${initialPartCode ? ` (Art.-Nr.: ${initialPartCode})` : ''}` : '',
  );
  const [partNumber, setPartNumber] = useState(initialPartCode ?? '');
  const [quantity, setQuantity] = useState('');
  const [sparepartNotes, setSparepartNotes] = useState('');

  // Consents
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);

  useEffect(() => {
    const fetchOptions = {
      headers: {
        'x-locale': locale,
        'accept-language': locale,
      },
    };

    // Use direct fetch with headers for reliable locale
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/services?locale=${locale}&language=${locale}&is_active=1`, fetchOptions);
        if (res.ok) {
          const data = await res.json();
          setServices(Array.isArray(data) ? data : (data.data ?? []));
        }
      } catch (err) {}
    };

    const fetchProducts = async (type: string, setter: any) => {
      try {
        const res = await fetch(`${API_BASE_URL}/products?locale=${locale}&language=${locale}&item_type=${type}&limit=100&is_active=1`, fetchOptions);
        if (res.ok) {
          const data = await res.json();
          setter(Array.isArray(data) ? data : (data.data ?? []));
        }
      } catch (err) {}
    };

    fetchServices();
    fetchProducts('product', setProducts);
    fetchProducts('sparepart', setSpareParts);
  }, [locale]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    let subject = '';
    let message = '';
    let product_id: string | undefined;
    let service_id: string | undefined;
    let form_data: Record<string, unknown> = {};

    if (activeTab === 'service') {
      subject = 'Dienstleistungsanfrage';
      message = serviceDesc;
      service_id = serviceId || undefined;
      form_data = { related_type: 'service', service_id: serviceId };
    } else if (activeTab === 'product') {
      subject = 'Produktanfrage';
      message = productNotes;
      product_id = productId || undefined;
      form_data = {
        related_type: 'product',
        tower_process: towerProcess,
        tower_city: towerCity,
        water_flow: waterFlow,
        inlet_temp: inletTemp,
        outlet_temp: outletTemp,
        wet_bulb_temp: wetBulbTemp,
        capacity,
        notes: productNotes,
      };
    } else {
      subject = 'Ersatzteilanfrage';
      message = [sparepartDesc, partNumber && `Artikelnr.: ${partNumber}`, quantity && `Menge: ${quantity}`, sparepartNotes]
        .filter(Boolean)
        .join('\n');
      product_id = sparepartId || undefined;
      form_data = {
        related_type: 'sparepart',
        sparepart_id: sparepartId,
        sparepart_desc: sparepartDesc,
        part_number: partNumber,
        quantity,
        notes: sparepartNotes,
      };
    }

    try {
      await createOffer(API_BASE_URL, {
        customer_name: name,
        company_name: company || undefined,
        email,
        phone: phone || undefined,
        subject,
        message: message || undefined,
        locale,
        product_id,
        service_id,
        consent_terms: consentTerms,
        consent_marketing: consentMarketing,
        form_data,
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <span className="text-green-600 text-3xl">✓</span>
        </div>
        <h3 className="font-display text-xl font-bold text-slate-900 mb-2">{labels.successTitle}</h3>
        <p className="text-slate-500 text-sm">{labels.successDetail}</p>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; Icon: React.ElementType }[] = [
    { key: 'service', label: labels.tabService, Icon: Wrench },
    { key: 'product', label: labels.tabProduct, Icon: Settings2 },
    { key: 'sparepart', label: labels.tabSparepart, Icon: Box },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Tab bar */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        {tabs.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors -mb-px ${
              activeTab === key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Common contact fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>
              {labels.nameLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={labels.placeholderName}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>{labels.companyLabel}</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={labels.placeholderCompany}
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>
              {labels.emailLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={labels.placeholderEmail}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>{labels.phoneLabel}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={labels.placeholderPhone}
              className={inputCls}
            />
          </div>
        </div>

        {/* ── Service tab ── */}
        {activeTab === 'service' && (
          <div className="flex flex-col gap-4 border-t border-slate-100 pt-5">
            <div>
              <label className={labelCls}>
                {labels.serviceLabel} <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className={inputCls}
              >
                <option value="">{labels.selectService}</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>{labels.serviceDescLabel}</label>
              <textarea
                rows={5}
                value={serviceDesc}
                onChange={(e) => setServiceDesc(e.target.value)}
                placeholder={labels.serviceDescPlaceholder}
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>
        )}

        {/* ── Product tab ── */}
        {activeTab === 'product' && (
          <div className="flex flex-col gap-4 border-t border-slate-100 pt-5">
            <div>
              <label className={labelCls}>
                {labels.productLabel} <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className={inputCls}
              >
                <option value="">{labels.selectProduct}</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Technical cooling tower fields */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>{labels.towerProcessLabel}</label>
                  <input
                    type="text"
                    value={towerProcess}
                    onChange={(e) => setTowerProcess(e.target.value)}
                    placeholder={labels.towerProcessPlaceholder}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>{labels.towerCityLabel}</label>
                  <input
                    type="text"
                    value={towerCity}
                    onChange={(e) => setTowerCity(e.target.value)}
                    placeholder={labels.towerCityPlaceholder}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>{labels.waterFlowLabel}</label>
                  <input
                    type="text"
                    value={waterFlow}
                    onChange={(e) => setWaterFlow(e.target.value)}
                    placeholder={labels.waterFlowPlaceholder}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>{labels.inletTempLabel}</label>
                  <input
                    type="text"
                    value={inletTemp}
                    onChange={(e) => setInletTemp(e.target.value)}
                    placeholder={labels.inletTempPlaceholder}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>{labels.outletTempLabel}</label>
                  <input
                    type="text"
                    value={outletTemp}
                    onChange={(e) => setOutletTemp(e.target.value)}
                    placeholder={labels.outletTempPlaceholder}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>{labels.wetBulbTempLabel}</label>
                  <input
                    type="text"
                    value={wetBulbTemp}
                    onChange={(e) => setWetBulbTemp(e.target.value)}
                    placeholder={labels.wetBulbTempPlaceholder}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>{labels.capacityLabel}</label>
                  <input
                    type="text"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder={labels.capacityPlaceholder}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>{labels.notesLabel}</label>
              <textarea
                rows={4}
                value={productNotes}
                onChange={(e) => setProductNotes(e.target.value)}
                placeholder={labels.notesPlaceholder}
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>
        )}

        {/* ── Spare Parts tab ── */}
        {activeTab === 'sparepart' && (
          <div className="flex flex-col gap-4 border-t border-slate-100 pt-5">
            {spareParts.length > 0 && (
              <div>
                <label className={labelCls}>{labels.productLabel}</label>
                <select
                  value={sparepartId}
                  onChange={(e) => setSparepartId(e.target.value)}
                  className={inputCls}
                >
                  <option value="">{labels.selectProduct}</option>
                  {spareParts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className={labelCls}>
                {labels.sparepartDescLabel} <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={sparepartDesc}
                onChange={(e) => setSparepartDesc(e.target.value)}
                placeholder={labels.sparepartDescPlaceholder}
                className={`${inputCls} resize-none`}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{labels.partNumberLabel}</label>
                <input
                  type="text"
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  placeholder={labels.partNumberPlaceholder}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>
                  {labels.quantityLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={labels.quantityPlaceholder}
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>{labels.sparepartNotesLabel}</label>
              <textarea
                rows={3}
                value={sparepartNotes}
                onChange={(e) => setSparepartNotes(e.target.value)}
                placeholder={labels.sparepartNotesPlaceholder}
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>
        )}

        {/* Consents */}
        <div className="flex flex-col gap-3 pt-1 border-t border-slate-100">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={consentTerms}
              onChange={(e) => setConsentTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
            />
            <span className="text-xs text-slate-600 leading-snug">
              {labels.consentTerms} <span className="text-red-500">*</span>
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentMarketing}
              onChange={(e) => setConsentMarketing(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
            />
            <span className="text-xs text-slate-600 leading-snug">{labels.consentMarketing}</span>
          </label>
        </div>

        {status === 'error' && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{labels.errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto sm:self-start px-8 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={15} />
          {status === 'loading' ? labels.submittingLabel : labels.submitLabel}
        </button>
      </form>
    </div>
  );
}
