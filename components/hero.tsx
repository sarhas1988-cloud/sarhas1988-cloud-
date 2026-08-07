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
    <section className="relative min-h-svh flex flex-col items-center justify-between overflow-hidden pt-14 pb-6 bg-[#F8FAFC]">
      {/* Ambient blue glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[50%] opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 10%, rgba(37,99,235,0.18), transparent)' }} />

      {/* === TOP SECTION: Radiant Blue Sun === */}
      <div className="relative flex-shrink-0 mt-4 sm:mt-8">
        <div className="relative w-44 h-44 sm:w-64 sm:h-64 md:w-80 md:h-80 flex items-center justify-center">
          {/* Outer glowing halo */}
          <div className="absolute inset-[-40%] rounded-full opacity-60 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.25), rgba(14,165,233,0.1) 50%, transparent 70%)', filter: 'blur(25px)' }} />
          
          {/* Sun Corona & Rays SVG */}
          <svg viewBox="0 0 400 400" className="w-full h-full absolute inset-0"
            style={{ animation: reduced ? 'none' : 'spin 25s linear infinite' }}>
            <defs>
              <linearGradient id="blueSunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="35%" stopColor="#2563EB" stopOpacity="0.8" />
                <stop offset="65%" stopColor="#0EA5E9" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.9" />
              </linearGradient>
              <filter id="blurFilter"><feGaussianBlur stdDeviation="3" /></filter>
            </defs>
            <circle cx="200" cy="200" r="170" fill="none" stroke="url(#blueSunGrad)" strokeWidth="12" opacity="0.85" filter="url(#blurFilter)" />
            <circle cx="200" cy="200" r="170" fill="none" stroke="url(#blueSunGrad)" strokeWidth="4" opacity="0.6" />
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i / 24) * Math.PI * 2
              return (
                <line key={i}
                  x1={200 + Math.cos(a) * 155} y1={200 + Math.sin(a) * 155}
                  x2={200 + Math.cos(a) * 195} y2={200 + Math.sin(a) * 195}
                  stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" opacity={0.4 + (i % 3) * 0.2} />
              )
            })}
          </svg>

          {/* Radiant Sun Core (Instead of black eclipse) */}
          <div className="absolute w-[68%] h-[68%] rounded-full shadow-2xl flex items-center justify-center"
            style={{ 
              background: 'radial-gradient(circle at 35% 35%, #93C5FD 0%, #2563EB 55%, #1E3A8A 100%)', 
              boxShadow: '0 0 50px 15px rgba(37,99,235,0.4), inset 0 0 25px rgba(255,255,255,0.5)' 
            }}>
            {/* Inner sun texture highlight */}
            <div className="w-[85%] h-[85%] rounded-full opacity-60"
              style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 70%)' }} />
          </div>
        </div>
      </div>

      {/* === MIDDLE SECTION: Content === */}
      <div className="relative z-10 text-center w-full px-6 flex-shrink-0 -mt-4 sm:-mt-6">
        <p className="text-xs sm:text-sm text-sky-600 tracking-widest mb-2 font-tajawal font-medium">
          كاتب الثريلر والأساطير المصرية
        </p>
        <h1 className="font-aref text-4xl sm:text-6xl lg:text-8xl text-slate-900 mb-3 font-bold leading-tight">
          السيد الريس
        </h1>
        <p className="text-sm sm:text-lg text-slate-600 mb-6 font-tajawal leading-relaxed max-w-sm mx-auto">
          حيث يلتقي الموت بالطقوس، ويُعاد كتابةُ التاريخ من خلف الظلام
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <Link href="#universe"
            className="px-6 py-3 bg-blue-600 text-white font-tajawal font-semibold rounded-lg hover:bg-blue-700 transition-all text-sm text-center shadow-lg shadow-blue-600/25">
            اكتشف عالم قلادة الشمس
          </Link>
          <Link href="/books"
            className="px-6 py-3 border border-blue-600/50 text-blue-600 font-tajawal font-semibold rounded-lg hover:bg-blue-50 transition-all text-sm text-center">
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
              <p className="font-aref text-xl sm:text-2xl text-blue-600 leading-none font-bold">{s.v}</p>
              <p className="text-slate-500 font-tajawal text-[10px] sm:text-xs mt-0.5">{s.l}</p>
              </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="text-slate-400" style={{ animation: reduced ? 'none' : 'bounce 2s infinite' }}>
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
