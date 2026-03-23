// =============================================================
// ImagesGalleryTab — Kapak + galeri resim yonetimi
// Products, Services, Custom Pages modulleri icin ortak
// =============================================================

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, ImageOff } from 'lucide-react';
import { AdminImageUploadField } from './AdminImageUploadField';

interface ImagesGalleryTabProps {
  coverUrl: string;
  coverAlt?: string;
  images: string[];
  onCoverChange: (url: string) => void;
  onCoverAltChange?: (alt: string) => void;
  onImagesChange: (urls: string[]) => void;
  disabled?: boolean;
  folder?: string;
}

export function ImagesGalleryTab({
  coverUrl, coverAlt = '', images, onCoverChange, onCoverAltChange,
  onImagesChange, disabled, folder = 'uploads',
}: ImagesGalleryTabProps) {
  const handleRemove = (idx: number) => {
    const removed = images[idx];
    const next = images.filter((_, i) => i !== idx);
    onImagesChange(next);
    if (coverUrl === removed) onCoverChange(next[0] || '');
  };

  const handleSetCover = (url: string) => {
    onCoverChange(url);
  };

  return (
    <div className="space-y-4">
      {/* Kapak Resmi */}
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          {coverUrl ? (
            <div className="relative rounded border ring-2 ring-primary overflow-hidden">
              <img src={coverUrl} alt={coverAlt || 'Kapak'} className="w-28 h-20 object-cover" />
              <div className="absolute bottom-0 inset-x-0 bg-primary/80 text-center text-[9px] text-primary-foreground py-0.5">
                Kapak
              </div>
            </div>
          ) : (
            <div className="flex w-28 h-20 items-center justify-center rounded border border-dashed text-muted-foreground">
              <ImageOff className="h-5 w-5 opacity-40" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2 max-w-sm">
          <AdminImageUploadField label="Kapak Görseli" value="" onChange={onCoverChange} disabled={disabled} folder={folder} />
          {onCoverAltChange && (
            <div className="space-y-1">
              <Label className="text-xs">Alt Metin</Label>
              <Input value={coverAlt} onChange={(e) => onCoverAltChange(e.target.value)}
                disabled={disabled} placeholder="Görsel açıklaması" className="h-8" />
            </div>
          )}
        </div>
      </div>

      {/* Galeri Upload */}
      <AdminImageUploadField label="Galeri" multiple values={images}
        onChangeMultiple={(urls) => {
          onImagesChange(urls);
          if (!coverUrl && urls.length > 0) onCoverChange(urls[0]);
        }}
        disabled={disabled} folder={folder} />

      {/* Galeri Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {images.map((url, idx) => {
            const isCover = coverUrl === url;
            return (
              <div key={idx} className={`group relative rounded border overflow-hidden ${isCover ? 'ring-2 ring-primary' : ''}`}>
                <img src={url} alt={`${idx + 1}`} className="w-full h-20 object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!isCover && (
                    <button type="button"
                      className="rounded bg-amber-500/90 px-1.5 py-0.5 text-[9px] text-white"
                      onClick={() => handleSetCover(url)} disabled={disabled}>
                      Kapak
                    </button>
                  )}
                  <button type="button"
                    className="rounded bg-red-600/80 p-0.5 text-white"
                    onClick={() => handleRemove(idx)} disabled={disabled}>
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                {isCover && (
                  <div className="absolute bottom-0 inset-x-0 bg-primary/80 text-center text-[9px] text-primary-foreground py-0.5">
                    Kapak
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
