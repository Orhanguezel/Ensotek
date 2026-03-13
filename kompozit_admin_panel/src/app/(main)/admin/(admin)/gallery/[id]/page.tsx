import AdminGalleryDetailClient from '../_components/admin-gallery-detail-client';

export default async function AdminGalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminGalleryDetailClient id={id} />;
}
