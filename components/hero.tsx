'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function Hero() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const h = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  return (
    <section className="relative min-h-svh flex items-center justify-center overflow-hidden pt-14">
      {/* Corona — rotation on the SVG only, not the container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full"
          style={{ animation: reduced ? 'none' : 'spin 12s linear infinite' }}
        >
          <defs>
            <radialGradient id="cg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E85D2B" stopOpacity="0.4" />
              <stop offset="40%" stopColor="#C79A3B" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#9E2B25" stopOpacity="0" />
            </radialGradient>
          </defs>
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2
            return (
              <line key={i}
                x1="200" y1="200"
                x2={200 + Math.cos(a) * 150} y2={200 + Math.sin(a) * 150}
                stroke="url(#cg)" strokeWidth="8" opacity="0.5"
              />
            )
          })}
          <circle cx="200" cy="200" r="160" fill="url(#cg)" opacity="0.3" />
        </svg>
      </div>

      {/* Black sun */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-obsidian rounded-full shadow-2xl" />

      {/* Content */}
      <div className="relative z-10 text-center w-full px-5 sm:px-8">
        <p className="text-xs sm:text-sm text-gold tracking-widest mb-3 font-tajawal">
          كاتب الثريلر والأساطير المصرية
        </p>
        <h1 className="font-aref text-4xl sm:text-6xl lg:text-8xl text-ink mb-4 font-bold leading-tight">
          السيد الريس
        </h1>
        <p className="text-sm sm:text-lg text-ink/70 mb-8 font-tajawal leading-relaxed max-w-md mx-auto">
          حيث يلتقي الموت بالطقوس، ويُعاد كتابةُ التاريخ من خلف الظلام
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto sm:flex-row sm:max-w-none sm:justify-center sm:gap-4">
          <Link href="#universe"
            className="px-6 py-3 bg-ember text-obsidian font-tajawal font-semibold rounded hover:bg-ember/90 transition-all text-sm sm:text-base text-center">
            اكتشف عالم قلادة الشمس
          </Link>
          <Link href="/books"
            className="px-6 py-3 border border-ember text-ember font-tajawal font-semibold rounded hover:bg-ember hover:text-obsidian transition-all text-sm sm:text-base text-center">
            كل الأعمال
          </Link>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ink/30"
        style={{ animation: reduced ? 'none' : 'bounce 2s infinite' }}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,100% { transform: translateY(0) translateX(-50%); } 50% { transform: translateY(8px) translateX(-50%); } }
      `}</style>
    </section>
  )
}
