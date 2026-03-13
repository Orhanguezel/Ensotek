import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'MOE Kompozit';
export const size = {
  width: 1200,
  height: 600,
};
export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#111827',
          color: '#ffffff',
          padding: '48px',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 28,
            padding: '40px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.00))',
          }}
        >
          <div style={{ display: 'flex', fontSize: 24, textTransform: 'uppercase', letterSpacing: 3, color: '#cbd5e1' }}>
            MOE Kompozit
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', fontSize: 68, fontWeight: 700, lineHeight: 1.02, maxWidth: 900 }}>
              High-performance composite production
            </div>
            <div style={{ display: 'flex', fontSize: 28, color: '#cbd5e1', maxWidth: 900 }}>
              Carbon fiber, FRP and fiberglass solutions tailored for industrial demand.
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#94a3b8' }}>
            <div style={{ display: 'flex' }}>karbonkompozit.com.tr</div>
            <div style={{ display: 'flex', color: '#ea580c' }}>B2B manufacturing</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
