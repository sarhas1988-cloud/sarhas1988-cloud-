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
    <section className="relative min-h-svh flex flex-col items-center justify-between overflow-hidden pt-14 pb-6">
      {/* Ambient warm glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[50%] opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 10%, rgba(232,93,43,0.18), transparent)' }} />

      {/* === TOP SECTION: Eclipse === */}
      <div className="relative flex-shrink-0 mt-4 sm:mt-8">
        <div className="relative w-44 h-44 sm:w-64 sm:h-64 md:w-80 md:h-80">
          {/* Outer glow */}
          <div className="absolute inset-[-40%] rounded-full opacity-50 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(232,93,43,0.2), rgba(199,154,59,0.08) 50%, transparent 70%)', filter: 'blur(20px)' }} />
          
          {/* Corona ring */}
          <svg viewBox="0 0 400 400" className="w-full h-full"
            style={{ animation: reduced ? 'none' : 'spin 20s linear infinite' }}>
            <defs>
              <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E85D2B" stopOpacity="0.9" />
                <stop offset="35%" stopColor="#C79A3B" stopOpacity="0.7" />
                <stop offset="65%" stopColor="#9E2B25" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#E85D2B" stopOpacity="0.9" />
              </linearGradient>
              <filter id="cb"><feGaussianBlur stdDeviation="3" /></filter>
            </defs>
            <circle cx="200" cy="200" r="170" fill="none" stroke="url(#cg)" strokeWidth="12" opacity="0.8" filter="url(#cb)" />
            <circle cx="200" cy="200" r="170" fill="none" stroke="url(#cg)" strokeWidth="4" opacity="0.5" />
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i / 24) * Math.PI * 2
              return (
                <line key={i}
                  x1={200 + Math.cos(a) * 155} y1={200 + Math.sin(a) * 155}
                  x2={200 + Math.cos(a) * 190} y2={200 + Math.sin(a) * 190}
                  stroke="#E85D2B" strokeWidth="2" opacity={0.3 + (i % 3) * 0.15} />
              )
            })}
          </svg>

          {/* Black sun center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] h-[65%] rounded-full"
            style={{ background: 'radial-gradient(circle, #0a0705, #060403)', boxShadow: '0 0 60px 20px rgba(5,3,2,0.9)' }} />
        </div>
      </div>

      {/* === MIDDLE SECTION: Content === */}
      <div className="relative z-10 text-center w-full px-6 flex-shrink-0 -mt-4 sm:-mt-6">
        <p className="text-xs sm:text-sm text-gold tracking-widest mb-2 font-tajawal">
          كاتب الثريلر والأساطير المصرية
        </p>
        <h1 className="font-aref text-4xl sm:text-6xl lg:text-8xl text-ink mb-3 font-bold leading-tight">
          السيد الريس
        </h1>
        <p className="text-sm sm:text-lg text-ink/60 mb-6 font-tajawal leading-relaxed max-w-sm mx-auto">
          حيث يلتقي الموت بالطقوس، ويُعاد كتابةُ التاريخ من خلف الظلام
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <Link href="#universe"
            className="px-6 py-3 bg-ember text-obsidian font-tajawal font-semibold rounded hover:bg-ember/90 transition-all text-sm text-center">
            اكتشف عالم قلادة الشمس
          </Link>
          <Link href="/books"
            className="px-6 py-3 border border-ember/60 text-ember font-tajawal font-semibold rounded hover:bg-ember hover:text-obsidian transition-all text-sm text-center">
            كل الأعمال
          </Link>
        </div>
      </div>

      {/* === BOTTOM SECTION: Stats + scroll hint === */}
      <div className="relative z-10 text-center w-full px-6 flex-shrink-0">
        {/* Mini stats */}
        <div className="flex justify-center gap-8 sm:gap-12 mb-5">
          {[
            { v: '٥', l: 'روايات' },
            { v: '٢', l: 'مجموعات' },
            { v: '١', l: 'عالم' },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="font-aref text-xl sm:text-2xl text-ember leading-none">{s.v}</p>
              <p className="text-ink/40 font-tajawal text-[10px] sm:text-xs mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="text-ink/30" style={{ animation: reduced ? 'none' : 'bounce 2s infinite' }}>
          <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
      `}</style>
    </section>
  )
}
