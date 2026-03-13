import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
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
          borderRadius: 36,
          fontSize: 76,
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
