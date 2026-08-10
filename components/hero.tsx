'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import type { Book } from '@/types/supabase'
import { getBookCover } from '@/types/supabase'
import { EmberParticles } from '@/components/ember-particles'
import { TiltCard } from '@/components/tilt-card'

export function Hero() {
  const [reduced, setReduced] = useState(false)
  const [latestBook, setLatestBook] = useState<Book | null>(null)
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

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const supabase = createClient()
        if (!supabase) return
        const { data } = await supabase
          .from('books').select('*').eq('published', true)
          .order('sort_order', { ascending: false }).limit(1).single()
        if (data) setLatestBook(data as Book)
      } catch {}
    }
    fetchLatest()
  }, [])

  const cover = latestBook ? getBookCover(latestBook) : null
  const nameWords = ['السيد', 'الريس']

  return (
    <section className="relative min-h-svh flex flex-col items-center justify-between overflow-hidden pt-14 pb-6">
      {/* Warm gradient */}
      <div className="absolute top-0 inset-x-0 h-[50%] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(212,80,31,0.06), transparent)' }} />

      {/* Ember particles */}
      <EmberParticles />

      {/* Featured book cover with 3D tilt */}
      <div className="relative flex-shrink-0 mt-6 sm:mt-10 z-[2]">
        {cover ? (
          <Link href={`/books/${latestBook?.slug}`} className="block group">
            <TiltCard>
              <div className="relative w-40 sm:w-52 md:w-60 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border border-gold-subtle group-hover:shadow-ember/20 transition-all duration-500"
                style={{ animation: reduced ? 'none' : 'float 4s ease-in-out infinite' }}>
                <Image src={cover} alt={latestBook?.title ?? ''} fill className="object-cover" priority />
                {/* Shine sweep on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </div>
              </div>
            </TiltCard>
            <p className="text-center mt-3 text-xs text-ink/50 font-tajawal">أحدث إصدار</p>
          </Link>
        ) : (
          <div className="w-40 sm:w-52 h-60 sm:h-80 rounded-lg bg-obsidian-warm border border-gold-subtle flex items-center justify-center">
            <p className="font-aref text-xl text-ink/30">✦</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center w-full px-6 flex-shrink-0 mt-6 sm:mt-8">
        <p className={`text-xs sm:text-sm text-ember tracking-widest mb-2 font-tajawal font-semibold transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          كاتب الرعب والأساطير المصرية
        </p>

        {/* Text reveal — each character fades in */}
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
