// =============================================================
// GooglePreview — Google SERP onizleme bileşeni
// SEO tab'larinda meta_title + meta_description onizlemesi
// =============================================================

'use client';

import * as React from 'react';

interface GooglePreviewProps {
  title?: string;
  url?: string;
  description?: string;
  titleFallback?: string;
  descriptionFallback?: string;
}

function charCount(text: string, limit: number) {
  const len = text.length;
  if (len === 0) return null;
  const over = len > limit;
  return (
    <span className={over ? 'text-red-500' : 'text-muted-foreground'}>
      {len}/{limit}
      {over && ' ⚠️'}
    </span>
  );
}

export function GooglePreview({ title, url, description, titleFallback, descriptionFallback }: GooglePreviewProps) {
  const displayTitle = title || titleFallback || 'Sayfa Başlığı';
  const displayDesc = description || descriptionFallback || 'Sayfa açıklaması burada görünecek...';
  const displayUrl = url || 'https://ensotek.de';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">Google Önizleme</label>
        <div className="flex gap-3 text-[10px]">
          {title && charCount(title, 60)}
          {description && charCount(description, 155)}
        </div>
      </div>
      <div className="rounded-lg border bg-background p-4 space-y-1">
        <p className="text-xs text-muted-foreground truncate">{displayUrl}</p>
        <p className="text-sm font-medium text-[#1a0dab] dark:text-[#8ab4f8] truncate">
          {displayTitle.length > 60 ? `${displayTitle.slice(0, 60)}...` : displayTitle}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {displayDesc.length > 155 ? `${displayDesc.slice(0, 155)}...` : displayDesc}
        </p>
      </div>
    </div>
  );
}
