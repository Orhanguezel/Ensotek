// =============================================================
// FILE: src/integrations/shared/ip-blocklist.types.ts
// =============================================================

export type IpBlocklistEntry = {
  id: number;
  ip: string;
  note: string | null;
  blocked_by: string | null;
  created_at: string;
};

export type IpBlocklistListResponse = {
  items: IpBlocklistEntry[];
  total: number;
};

export type AddIpBlocklistPayload = {
  ip: string;
  note?: string | null;
};
