// =============================================================
// FILE: src/components/admin/catalog/CatalogStatus.ts
// =============================================================

import type { CatalogRequestStatus } from '@/integrations/types';

export const CATALOG_STATUS_OPTIONS: { value: CatalogRequestStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'sent', label: 'Sent' },
  { value: 'failed', label: 'Failed' },
  { value: 'archived', label: 'Archived' },
];

export const statusBadgeClass = (s: string) => {
  if (s === 'sent') return 'badge bg-success-subtle text-success border';
  if (s === 'failed') return 'badge bg-danger-subtle text-danger border';
  if (s === 'archived') return 'badge bg-secondary-subtle text-muted border';
  return 'badge bg-primary-subtle text-primary border';
};
