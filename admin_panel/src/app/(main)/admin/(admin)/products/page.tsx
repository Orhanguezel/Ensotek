import ProductsListPanel from './_components/products-list-panel';
import type { ProductItemType } from '@/integrations/shared/product_admin.types';

interface Props {
  searchParams: Promise<{ type?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { type } = await searchParams;
  const itemType: ProductItemType | undefined =
    type === 'sparepart' ? 'sparepart' : type === 'product' ? 'product' : undefined;
  return <ProductsListPanel itemType={itemType} />;
}
