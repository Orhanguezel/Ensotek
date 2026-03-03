// =============================================================
// modules/products/products.action.ts
// =============================================================

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { productsService } from './products.service';
import type { ProductDetailParams, ProductListParams, ProductSubResourceParams } from './products.type';

// ── Product List ─────────────────────────────────────────────

export function useProducts(params?: ProductListParams) {
  return useQuery({
    queryKey: queryKeys.products.list(params as Record<string, unknown>),
    queryFn: () => productsService.getAll(params),
  });
}

// ── Product Detail ───────────────────────────────────────────

export function useProduct(slug: string, params?: ProductDetailParams) {
  return useQuery({
    queryKey: queryKeys.products.bySlug(slug, params as Record<string, unknown> | undefined),
    queryFn: () => productsService.getBySlug(slug, params),
    enabled: !!slug,
  });
}

/** SSR variant for Server Components */
export function useProductSuspense(slug: string, params?: ProductDetailParams) {
  return useSuspenseQuery({
    queryKey: queryKeys.products.bySlug(slug, params as Record<string, unknown> | undefined),
    queryFn: () => productsService.getBySlug(slug, params),
  });
}

export function useProductById(id: string, params?: ProductDetailParams) {
  return useQuery({
    queryKey: queryKeys.products.detail(id, params as Record<string, unknown> | undefined),
    queryFn: () => productsService.getById(id, params),
    enabled: !!id,
  });
}

// ── Product Sub-resources ────────────────────────────────────

export function useProductFaqs(productId: string, params?: Omit<ProductSubResourceParams, 'product_id'>) {
  return useQuery({
    queryKey: queryKeys.products.faqs(productId),
    queryFn: () => productsService.getFaqs({ ...params, product_id: productId }),
    enabled: !!productId,
  });
}

export function useProductSpecs(productId: string, params?: Omit<ProductSubResourceParams, 'product_id'>) {
  return useQuery({
    queryKey: queryKeys.products.specs(productId),
    queryFn: () => productsService.getSpecs({ ...params, product_id: productId }),
    enabled: !!productId,
  });
}

export function useProductReviews(productId: string, params?: Omit<ProductSubResourceParams, 'product_id'>) {
  return useQuery({
    queryKey: queryKeys.products.reviews(productId),
    queryFn: () => productsService.getReviews({ ...params, product_id: productId }),
    enabled: !!productId,
  });
}
