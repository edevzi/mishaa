import { ImageResponse } from 'next/og';

export const alt = 'iComics.wiki — manga, manhwa & comics';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#110F16',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#F8F5F0',
          }}
        >
          iComics.wiki
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 26,
            fontWeight: 500,
            color: '#F2994A',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Manga · Manhwa · Comics
        </div>
        <div style={{ marginTop: 12, fontSize: 22, color: '#948EA6' }}>
          Read online — reader-first library
        </div>
      </div>
    ),
    { ...size },
  );
}
