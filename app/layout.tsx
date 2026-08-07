import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'السيد الريس | كاتب الثريلر والأساطير المصرية',
  description:
    'استكشف عالم قلادة الشمس — حيث يلتقي الموت بالطقوس، ويُعاد كتابةُ التاريخ من خلف الظلام.',
  openGraph: {
    title: 'السيد الريس | كاتب الثريلر والأساطير المصرية',
    description: 'عالم قلادة الشمس — الموت والطقوس والأساطير المصرية',
    type: 'website',
    siteName: 'السيد الريس',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png',  media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0B0806',
  userScalable: true,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="bg-obsidian" style={{ backgroundColor: '#050302' }}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-obsidian text-ink font-tajawal">
        <Navbar />
        {children}
        <Footer />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
