import ProductsListPanel from './_components/products-list-panel';
import type { ProductItemType } from '@/integrations/shared/product_admin.types';

interface Props {
  searchParams: Promise<{ type?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { type } = await searchParams;
  const validTypes: ProductItemType[] = ['product', 'sparepart', 'kompozit'];
  const itemType: ProductItemType | undefined =
    validTypes.includes(type as ProductItemType) ? (type as ProductItemType) : undefined;
  return <ProductsListPanel itemType={itemType} />;
}
