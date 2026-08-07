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
      {/* Ambient warm glow behind everything */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[60%] opacity-40"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 20%, rgba(232,93,43,0.15), transparent)' }} />

      {/* Eclipse corona ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%]">
        <div className="relative w-52 h-52 sm:w-72 sm:h-72 md:w-96 md:h-96">
          {/* Outer glow */}
          <div className="absolute inset-[-30%] rounded-full opacity-50"
            style={{ background: 'radial-gradient(circle, rgba(232,93,43,0.25), rgba(199,154,59,0.1) 50%, transparent 70%)', filter: 'blur(20px)' }} />
          
          {/* Corona ring */}
          <svg viewBox="0 0 400 400" className="w-full h-full"
            style={{ animation: reduced ? 'none' : 'spin 20s linear infinite' }}>
            <defs>
              <linearGradient id="corona-g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E85D2B" stopOpacity="0.9" />
                <stop offset="35%" stopColor="#C79A3B" stopOpacity="0.7" />
                <stop offset="65%" stopColor="#9E2B25" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#E85D2B" stopOpacity="0.9" />
              </linearGradient>
              <filter id="corona-blur">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>
            {/* Corona circle */}
            <circle cx="200" cy="200" r="170" fill="none" stroke="url(#corona-g)" strokeWidth="12" opacity="0.8" filter="url(#corona-blur)" />
            <circle cx="200" cy="200" r="170" fill="none" stroke="url(#corona-g)" strokeWidth="4" opacity="0.5" />
            {/* Radial rays */}
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i / 24) * Math.PI * 2
              const inner = 155
              const outer = 190
              return (
                <line key={i}
                  x1={200 + Math.cos(a) * inner} y1={200 + Math.sin(a) * inner}
                  x2={200 + Math.cos(a) * outer} y2={200 + Math.sin(a) * outer}
                  stroke="#E85D2B" strokeWidth="2" opacity={0.3 + (i % 3) * 0.15}
                />
              )
            })}
          </svg>

          {/* Black sun center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] h-[65%] rounded-full"
            style={{ background: 'radial-gradient(circle, #0a0705, #060403)', boxShadow: '0 0 60px 20px rgba(5,3,2,0.9)' }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center w-full px-6 sm:px-8 mt-12 sm:mt-0">
        <p className="text-xs sm:text-sm text-gold tracking-widest mb-3 font-tajawal">
          كاتب الثريلر والأساطير المصرية
        </p>
        <h1 className="font-aref text-4xl sm:text-6xl lg:text-8xl text-ink mb-4 font-bold leading-tight">
          السيد الريس
        </h1>
        <p className="text-sm sm:text-lg text-ink/70 mb-8 font-tajawal leading-relaxed max-w-sm mx-auto">
          حيث يلتقي الموت بالطقوس، ويُعاد كتابةُ التاريخ من خلف الظلام
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <Link href="#universe"
            className="px-6 py-3 bg-ember text-obsidian font-tajawal font-semibold rounded hover:bg-ember/90 transition-all text-sm text-center">
            اكتشف عالم قلادة الشمس
          </Link>
          <Link href="/books"
            className="px-6 py-3 border border-ember text-ember font-tajawal font-semibold rounded hover:bg-ember hover:text-obsidian transition-all text-sm text-center">
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
