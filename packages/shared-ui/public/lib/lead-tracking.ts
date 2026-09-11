/** Consent-gated events. Never include form contents or contact details in analytics. */
import type { AxiosInstance } from 'axios';

type Context = { measurementId: string; locale: string };
let context: Context | undefined;
const sent = new Set<string>();
const installed = new WeakSet<object>();
const ATTR_KEY = 'ensotek.lead-attribution.v1';
export type Attribution = { analytics_consent: true; landing_path: string; source_host?: string; utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_content?: string; utm_term?: string };
const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

export function setLeadAnalyticsContext(value?: Context) { context = value; }
function safeValue(raw: string | null) {
  const value = (raw || '').trim().slice(0, 160);
  return value && !/@|\b\d{7,}\b/.test(value) ? value : undefined;
}
export function getLeadAttribution(): Attribution | undefined {
  if (!context || typeof window === 'undefined') return;
  const query = new URLSearchParams(location.search);
  let stored: Attribution | undefined;
  try {
    const saved = JSON.parse(sessionStorage.getItem(ATTR_KEY) || 'null');
    if (saved?.expires > Date.now()) stored = saved.value;
  } catch { /* Storage unavailable: use this page only. */ }
  const fresh = campaignKeys.some(key => query.has(key));
  if (stored && !fresh) return stored;
  const value: Attribution = { analytics_consent: true, landing_path: location.pathname.slice(0, 512) };
  for (const key of campaignKeys) { const v = safeValue(query.get(key)); if (v) value[key] = v; }
  try { if (document.referrer) value.source_host = new URL(document.referrer).hostname; } catch { /* No valid referrer. */ }
  try { sessionStorage.setItem(ATTR_KEY, JSON.stringify({ value, expires: Date.now() + 30 * 60 * 1000 })); } catch { /* Optional storage. */ }
  return value;
}
export function clearLeadAttribution() { try { sessionStorage.removeItem(ATTR_KEY); } catch { /* Optional storage. */ } }
export function emitLeadEvent(name: 'generate_lead' | 'click_phone' | 'click_whatsapp' | 'click_email' | 'file_download', params: Record<string, string> = {}) {
  if (!context || typeof window === 'undefined') return;
  const target = window as Window & { dataLayer?: unknown[] };
  target.dataLayer ??= [];
  function gtag(..._args: unknown[]) { target.dataLayer!.push(arguments); }
  gtag('event', name, { ...params, send_to: context.measurementId, language: context.locale, page_path: location.pathname });
}
function formKind(url: string) { return /\/(contacts|offers)\/?(?:\?|$)/.exec(url)?.[1] as 'contacts' | 'offers' | undefined; }
export function withLeadAttribution(url: string, body: any) {
  const kind = formKind(url);
  if (!kind || !body || typeof body !== 'object') return body;
  const attribution = getLeadAttribution();
  if (!attribution) return body;
  if (kind === 'contacts') return { ...body, attribution };
  let data = body.form_data;
  if (typeof data === 'string') { try { data = JSON.parse(data); } catch { data = {}; } }
  return { ...body, form_data: { ...(data && typeof data === 'object' ? data : {}), attribution } };
}
export function trackSavedLead(url: string, status: number, row: any, requestBody?: any) {
  const kind = formKind(url);
  if (!context || !kind || status !== 201 || typeof row?.id !== 'string' || !row.id) return;
  if (row.is_test || /checklist[_ -]?test/i.test(String(row.source || requestBody?.source || '')) || String(requestBody?.email || row.email || '').endsWith('.invalid')) return;
  const key = `${kind}:${row.id}`;
  if (sent.has(key)) return;
  sent.add(key);
  emitLeadEvent('generate_lead', { form_name: kind === 'offers' ? 'quote_request' : 'contact_request' });
}
export function installLeadTracking(api: AxiosInstance) {
  if (installed.has(api)) return;
  installed.add(api);
  api.interceptors.request.use(config => {
    if (config.method?.toLowerCase() === 'post') config.data = withLeadAttribution(config.url || '', config.data);
    return config;
  });
  api.interceptors.response.use(response => {
    if (response.config.method?.toLowerCase() === 'post') {
      let payload = response.config.data;
      if (typeof payload === 'string') { try { payload = JSON.parse(payload); } catch { payload = undefined; } }
      if (formKind(response.config.url || '') && !response.data?.id) throw new Error('Lead record was not saved');
      trackSavedLead(response.config.url || '', response.status, response.data, payload);
    }
    return response;
  });
}
export async function leadFetch(url: string, init: RequestInit) {
  let payload: any;
  if (typeof init.body === 'string') { try { payload = JSON.parse(init.body); } catch { /* Not a JSON lead. */ } }
  const body = withLeadAttribution(url, payload);
  const response = await fetch(url, { ...init, ...(body ? { body: JSON.stringify(body) } : {}) });
  if (init.method?.toUpperCase() === 'POST' && formKind(url) && response.ok) {
    const row = await response.clone().json().catch(() => null);
    if (!row?.id) throw new Error('Lead record was not saved');
    trackSavedLead(url, response.status, row, payload);
  }
  return response;
}
