import ProductDetailClient from '../_components/product-detail-client';
import type { ProductItemType } from '@/integrations/shared/product_admin.types';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const { type } = await searchParams;
  const itemType: ProductItemType | undefined =
    type === 'sparepart' ? 'sparepart' : type === 'product' ? 'product' : undefined;
  return <ProductDetailClient id={id} itemType={itemType} />;
}
