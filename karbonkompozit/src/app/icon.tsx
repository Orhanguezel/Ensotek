import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = {
  width: 64,
  height: 64,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#111827',
          color: '#ea580c',
          borderRadius: 14,
          fontSize: 34,
          fontWeight: 700,
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        MK
      </div>
    ),
    size,
  );
}
