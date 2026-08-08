import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'السيد الريس — كاتب الثريلر والأساطير المصرية'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  // Load Arabic font
  const fontData = await fetch(
    'https://fonts.gstatic.com/s/tajawal/v9/Iura6YBj_oCad4k1nzSBC45I.ttf'
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1510',
          backgroundImage: 'radial-gradient(circle at 50% 30%, #2e2218 0%, #1a1510 60%)',
          fontFamily: 'Tajawal',
          direction: 'rtl',
          position: 'relative',
        }}
      >
        {/* Top ember accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
          background: 'linear-gradient(to right, transparent, #E85D2B, #C79A3B, #E85D2B, transparent)',
        }} />

        {/* Ember glow */}
        <div style={{
          position: 'absolute', top: '-20%', width: '60%', height: '50%',
          background: 'radial-gradient(ellipse, rgba(232,93,43,0.12), transparent 70%)',
          filter: 'blur(40px)',
        }} />

        {/* Eyebrow */}
        <div style={{
          color: '#C79A3B',
          fontSize: 24,
          letterSpacing: '0.15em',
          marginBottom: 16,
          display: 'flex',
        }}>
          كاتب الثريلر والأساطير المصرية
        </div>

        {/* Name */}
        <div style={{
          color: '#F0EAE0',
          fontSize: 96,
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: 20,
          display: 'flex',
        }}>
          السيد الريس
        </div>

        {/* Tagline */}
        <div style={{
          color: 'rgba(240,234,224,0.5)',
          fontSize: 28,
          maxWidth: '70%',
          textAlign: 'center',
          lineHeight: 1.6,
          display: 'flex',
        }}>
          حيث يلتقي الموت بالطقوس، ويُعاد كتابةُ التاريخ من خلف الظلام
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'flex',
          gap: 60,
          marginTop: 40,
          alignItems: 'center',
        }}>
          {[
            { v: '٥', l: 'روايات' },
            { v: '٢', l: 'مجموعات' },
            { v: '١', l: 'عالم' },
          ].map((s) => (
            <div key={s.l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ color: '#E85D2B', fontSize: 36, fontWeight: 700 }}>{s.v}</span>
              <span style={{ color: 'rgba(240,234,224,0.4)', fontSize: 16 }}>{s.l}</span>
            </div>
          ))}
        </div>

        {/* Bottom ember accent line */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px',
          background: 'linear-gradient(to right, transparent, #E85D2B, #C79A3B, #E85D2B, transparent)',
        }} />
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Tajawal',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    },
  )
}
