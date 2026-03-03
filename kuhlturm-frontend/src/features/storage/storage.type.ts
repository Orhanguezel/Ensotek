// Backend: storage_assets
export interface StorageAsset {
  id: string;
  user_id: string | null;
  name: string;
  bucket: string;
  path: string;
  folder: string | null;
  mime: string;
  size: number;
  width: number | null;
  height: number | null;
  url: string | null;
  hash: string | null;
  provider: string;
  provider_public_id: string | null;
  provider_resource_type: string | null;
  provider_format: string | null;
  provider_version: number | null;
  etag: string | null;
  metadata: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}

export interface UploadResponse {
  asset: StorageAsset;
  url: string;
}
