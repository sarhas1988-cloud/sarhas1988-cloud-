'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { GoldenDust } from '@/components/golden-dust'
import { FogEffect } from '@/components/fog-effect'

export function Hero() {
  const [reduced, setReduced] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const h = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const nameWords = ['السيد', 'الريس']

  return (
    <section className="relative min-h-svh flex flex-col items-center justify-between overflow-hidden pt-14 pb-6">
      {/* Warm gradient */}
      <div className="absolute top-0 inset-x-0 h-[50%] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(199,154,59,0.05), transparent)' }} />

      {/* Fog + golden dust */}
      <FogEffect />
      <GoldenDust />

      {/* Logo emblem */}
      <div className="relative flex-shrink-0 mt-6 sm:mt-10 z-[2]">
        <div
          className={`relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 transition-all duration-1000 ${
            revealed ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          style={{ animation: reduced ? 'none' : 'float 4s ease-in-out infinite' }}
        >
          <Image
            src="/images/logo-emblem.png"
            alt="السيد الريس"
            fill
            className="object-contain"
            priority
          />
          {/* Subtle glow behind logo */}
          <div className="absolute inset-[-30%] rounded-full pointer-events-none -z-10"
            style={{ background: 'radial-gradient(circle, rgba(199,154,59,0.12), transparent 65%)', filter: 'blur(20px)' }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center w-full px-6 flex-shrink-0 mt-6 sm:mt-8">
        <p className={`text-xs sm:text-sm text-gold tracking-widest mb-2 font-tajawal font-semibold transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          كاتب الرعب والأساطير المصرية
        </p>

        <h1 className="font-aref text-5xl sm:text-7xl lg:text-8xl text-ink mb-4 font-bold leading-tight">
          {nameWords.map((word, i) => (
            <span
              key={i}
              className="inline-block transition-all"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(30px)',
                transitionDuration: '700ms',
                transitionDelay: reduced ? '0ms' : `${500 + i * 200}ms`,
                transitionTimingFunction: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
              }}
            >
              {word}{i < nameWords.length - 1 ? '\u00A0' : ''}
            </span>
          ))}
        </h1>

        <p className={`text-sm sm:text-lg text-ink/50 mb-8 font-tajawal leading-relaxed max-w-md mx-auto transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: reduced ? '0ms' : '1100ms' }}>
          حيث يلتقي الموت بالطقوس، ويُعاد كتابةُ التاريخ من خلف الظلام
        </p>

        <div className={`flex flex-col gap-3 max-w-xs mx-auto sm:flex-row sm:max-w-none sm:justify-center sm:gap-4 transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: reduced ? '0ms' : '1300ms' }}>
          <Link href="#universe"
            className="px-8 py-3 bg-ember text-white font-tajawal font-semibold rounded-lg hover:bg-ember/90 hover:scale-105 transition-all text-sm text-center shadow-lg shadow-ember/20">
            اكتشف عالم قلادة الشمس
          </Link>
          <Link href="/books"
            className="px-8 py-3 border border-ink/20 text-ink font-tajawal font-semibold rounded-lg hover:bg-ink/5 hover:scale-105 transition-all text-sm text-center">
            كل الأعمال
          </Link>
        </div>
      </div>

      {/* Stats + scroll */}
      <div className="relative z-10 text-center w-full px-6 flex-shrink-0">
        <div className="flex justify-center gap-10 sm:gap-14 mb-5">
          {[
            { v: '٥', l: 'روايات' },
            { v: '٢', l: 'مجموعات' },
            { v: '١', l: 'عالم' },
          ].map((s, i) => (
            <div key={s.l} className={`text-center transition-all duration-500 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: reduced ? '0ms' : `${1500 + i * 100}ms` }}>
              <p className="font-aref text-2xl sm:text-3xl text-ember leading-none">{s.v}</p>
              <p className="text-ink/40 font-tajawal text-[10px] sm:text-xs mt-1">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="text-ink/25" style={{ animation: reduced ? 'none' : 'bounce 2s infinite' }}>
          <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
      `}</style>
    </section>
  )
}
