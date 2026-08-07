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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 glow-ember-top">
      {/* Corona */}
      <div
        className="absolute inset-0"
        style={{ animation: reduced ? 'none' : 'corona-rotate 10s linear infinite' }}
      >
        {/* Mobile: w-56, sm: w-72, md: w-96 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <defs>
              <radialGradient id="cg" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#E85D2B" stopOpacity="0.4" />
                <stop offset="40%"  stopColor="#C79A3B" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#9E2B25" stopOpacity="0" />
              </radialGradient>
              <filter id="cglow">
                <feGaussianBlur stdDeviation="8" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {Array.from({ length: 16 }).map((_, i) => {
              const a = (i / 16) * Math.PI * 2
              return (
                <line key={i}
                  x1="200" y1="200"
                  x2={200 + Math.cos(a) * 150} y2={200 + Math.sin(a) * 150}
                  stroke="url(#cg)" strokeWidth="8" opacity="0.6" filter="url(#cglow)"
                />
              )
            })}
            <circle cx="200" cy="200" r="180" fill="url(#cg)" opacity="0.3" />
          </svg>
        </div>
      </div>

      {/* Black sun — smaller on mobile */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 bg-gradient-to-br from-obsidian via-obsidian-lighter to-obsidian rounded-full shadow-2xl" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <p className="text-xs sm:text-sm text-gold tracking-widest mb-4 font-tajawal uppercase">
          كاتب الثريلر والأساطير المصرية
        </p>

        {/* Mobile: 4xl → sm: 6xl → lg: 8xl */}
        <h1 className="font-aref text-4xl sm:text-6xl lg:text-8xl text-ink mb-6 font-bold leading-tight">
          السيد الريس
        </h1>

        <p className="text-base sm:text-xl text-ink/80 mb-10 font-tajawal leading-relaxed max-w-sm sm:max-w-none mx-auto">
          حيث يلتقي الموت بالطقوس، ويُعاد كتابةُ التاريخ من خلف الظلام
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="#universe"
            className="w-full sm:w-auto px-8 py-3 bg-ember text-obsidian font-tajawal font-semibold rounded hover:bg-ember/90 transition-all hover:scale-105 duration-300 text-base text-center"
          >
            اكتشف عالم قلادة الشمس
          </Link>
          <Link
            href="/books"
            className="w-full sm:w-auto px-8 py-3 border-2 border-ember text-ember font-tajawal font-semibold rounded hover:bg-ember hover:text-obsidian transition-all duration-300 text-base text-center"
          >
            كل الأعمال
          </Link>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ animation: reduced ? 'none' : 'bounce 2s infinite' }}
      >
        <svg className="w-6 h-6 text-ink/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      <style>{`
        @keyframes corona-rotate { to { transform: rotate(360deg); } }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(8px); }
        }
      `}</style>
    </section>
  )
}
