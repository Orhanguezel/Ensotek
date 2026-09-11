import { beforeEach, describe, expect, it } from 'bun:test';
import { clearLeadAttribution, getLeadAttribution, setLeadAnalyticsContext, trackSavedLead, withLeadAttribution } from './lead-tracking';
let events: unknown[][];
beforeEach(() => {
  events = [];
  const values = new Map<string, string>();
  Object.assign(globalThis, {
    window: { dataLayer: { push: (args: IArguments) => events.push(Array.from(args)) } },
    location: { pathname: '/en/product/cooling-tower', search: '?utm_source=instagram&utm_campaign=technical-guide&email=private@example.com' },
    document: { referrer: 'https://instagram.com/example?private=value' },
    sessionStorage: { getItem: (key: string) => values.get(key) || null, setItem: (key: string, val: string) => values.set(key, val), removeItem: (key: string) => values.delete(key) },
  });
  setLeadAnalyticsContext();
});
describe('saved lead and consent contract', () => {
  it('does not store attribution or emit events before consent', () => {
    expect(getLeadAttribution()).toBeUndefined();
    trackSavedLead('/contacts', 201, { id: 'before-consent' });
    expect(events).toHaveLength(0);
  });
  it('counts a persisted 201 once and excludes errors, honeypots and known tests', () => {
    setLeadAnalyticsContext({ measurementId: 'G-TEST123', locale: 'en' });
    trackSavedLead('/contacts', 400, { id: 'invalid' });
    trackSavedLead('/contacts', 201, { ok: true });
    trackSavedLead('/contacts', 201, { id: 'test' }, { email: 'test@example.invalid' });
    trackSavedLead('/offers', 201, { id: 'test-offer', source: 'checklist_test' });
    trackSavedLead('/contacts', 201, { id: 'real-contact', name: 'Private Name', email: 'private@example.com' });
    trackSavedLead('/contacts', 201, { id: 'real-contact' });
    expect(events).toHaveLength(1);
    expect(events[0][0]).toBe('event');
    expect(events[0][1]).toBe('generate_lead');
    expect(events[0][2]).toMatchObject({ send_to: 'G-TEST123', form_name: 'contact_request' });
    expect(JSON.stringify(events)).not.toContain('private@example.com');
    expect(JSON.stringify(events)).not.toContain('real-contact');
  });
  it('preserves campaign across product to request navigation without query contents', () => {
    setLeadAnalyticsContext({ measurementId: 'G-TEST123', locale: 'en' });
    const initial = getLeadAttribution();
    Object.assign(location, { pathname: '/en/offer', search: '' });
    expect(getLeadAttribution()).toEqual(initial);
    expect(initial).toMatchObject({ landing_path: '/en/product/cooling-tower', utm_source: 'instagram', source_host: 'instagram.com' });
    expect(JSON.stringify(initial)).not.toContain('private');
    expect(withLeadAttribution('/offers', { form_data: { product_id: 'product-1' } })).toMatchObject({ form_data: { product_id: 'product-1', attribution: initial } });
  });
  it('drops email-like campaign values and clears stored attribution on withdrawal', () => {
    setLeadAnalyticsContext({ measurementId: 'G-TEST123', locale: 'en' });
    location.search = '?utm_campaign=private%40example.com';
    expect(getLeadAttribution()?.utm_campaign).toBeUndefined();
    clearLeadAttribution();
    setLeadAnalyticsContext();
    expect(getLeadAttribution()).toBeUndefined();
    trackSavedLead('/offers', 201, { id: 'after-withdrawal' });
    expect(events).toHaveLength(0);
  });
});
