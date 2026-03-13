'use client';

export function GoogleMap({ className }: { className?: string }) {
  const embedUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;

  if (!embedUrl) return null;

  return (
    <div className={className}>
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: 300 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="MOE Kompozit Konum"
      />
    </div>
  );
}
