import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'MOE Kompozit';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #020617 0%, #111827 50%, #1f2937 100%)',
          color: '#ffffff',
          padding: '56px',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#cbd5e1',
            }}
          >
            MOE Kompozit
          </div>
          <div
            style={{
              display: 'flex',
              width: 80,
              height: 12,
              borderRadius: 999,
              background: '#ea580c',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 76,
              lineHeight: 1,
              fontWeight: 700,
              maxWidth: 900,
            }}
          >
            Carbon Fiber and Composite Manufacturing
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              color: '#cbd5e1',
              maxWidth: 860,
            }}
          >
            Industrial-grade FRP, fiberglass and custom composite solutions for B2B projects.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 24,
            color: '#94a3b8',
          }}
        >
          <div style={{ display: 'flex' }}>karbonkompozit.com.tr</div>
          <div style={{ display: 'flex', color: '#fdba74' }}>Engineered for performance</div>
        </div>
      </div>
    ),
    size,
  );
}
