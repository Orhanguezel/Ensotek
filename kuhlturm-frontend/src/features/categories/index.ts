export * from './categories.types';
export * from './categories.service';
export * from './categories.hooks';

// Cross-feature hook (should ideally be in products but legacy imports from categories)
import { useProducts } from '../products/products.hooks';

export const useProductsByCategory = (slug: string) => {
    return useProducts({ category_slug: slug });
};
