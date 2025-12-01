// =============================================================
// FILE: src/integrations/types/admin/product_specs_admin.types.ts
// Admin Product Specs
// =============================================================

import type { ProductSpecCategory } from "./product.types";

export type AdminProductSpecDto = {
  id: string;
  product_id: string;
  name: string;
  value: string;
  category: ProductSpecCategory;
  order_num: number;
  created_at: string;
  updated_at: string;
};

export type AdminProductSpecListParams = {
  productId: string;
};

export type AdminProductSpecCreatePayload = {
  id?: string;
  name: string;
  value: string;
  category?: ProductSpecCategory;
  order_num?: number;
};

export type AdminProductSpecUpdatePayload = Partial<AdminProductSpecCreatePayload>;

export type AdminProductSpecReplacePayload = {
  specs?: AdminProductSpecCreatePayload[];
  items?: AdminProductSpecCreatePayload[];
};
