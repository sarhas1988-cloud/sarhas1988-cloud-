'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import type { Book } from '@/types/supabase'
import { getBookCover, getPlaceholderColor } from '@/types/supabase'
import { TiltCard } from '@/components/tilt-card'

type Filter = 'الكل' | 'روايات' | 'مجموعات قصصية' | 'قلادة الشمس'

interface Props { books: Book[] }

export function WorksGrid({ books }: Props) {
  const [filter, setFilter] = useState<Filter>('الكل')
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const gridRef = useRef<HTMLDivElement>(null)

  const filtered = books.filter((b) => {
    if (filter === 'الكل') return true
    if (filter === 'روايات') return b.type === 'رواية'
    if (filter === 'مجموعات قصصية') return b.type === 'مجموعة قصصية'
    if (filter === 'قلادة الشمس') return b.series === 'قلادة الشمس'
    return true
  })

  // Staggered reveal
  useEffect(() => {
    setVisibleItems(new Set())
    const timers: NodeJS.Timeout[] = []
    filtered.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setVisibleItems((prev) => new Set(prev).add(i))
      }, 100 + i * 80))
    })
    return () => timers.forEach(clearTimeout)
  }, [filter, filtered.length])

  const filters: Filter[] = ['الكل', 'روايات', 'مجموعات قصصية', 'قلادة الشمس']

  const sectionRef = useRef<HTMLDivElement>(null)
  const [sectionVisible, setSectionVisible] = useState(false)
  useEffect(() => {
    if (!sectionRef.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSectionVisible(true) }, { threshold: 0.1 })
    obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="works"
      ref={sectionRef}
      className={`py-14 sm:py-24 px-5 sm:px-8 bg-section-2 border-t border-gold-hairline relative transition-all duration-700 ${
        sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <p className="text-xs sm:text-base text-gold tracking-widest mb-3 font-tajawal">كل الأعمال</p>
          <h2 className="font-aref text-3xl sm:text-5xl lg:text-6xl text-ink mb-4">المكتبة الكاملة</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 sm:mb-12">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 sm:px-5 py-1.5 rounded-lg font-tajawal text-sm font-semibold transition-all duration-300 ${
                filter === f ? 'bg-ember text-white scale-105' : 'bg-obsidian-lighter text-ink hover:text-ember'
              }`}>
              {f}
            </button>
          ))}
        </div>

        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((book, i) => {
            const cover = getBookCover(book)
            const bg = getPlaceholderColor(book)
            const isVisible = visibleItems.has(i)
            return (
              <Link key={book.slug} href={`/books/${book.slug}`}>
                <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                  <TiltCard className="group">
                    <div className="card-lifted relative overflow-hidden rounded-lg mb-3 aspect-[2/3] group-hover:border-gold transition-all duration-300">
                      {cover ? (
                        <>
                          <Image src={cover} alt={book.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-glint" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-3" style={{ background: bg }}>
                          <p className="font-aref text-lg text-ink/80 text-center line-clamp-3">{book.title}</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <p className="text-gold text-xs font-tajawal">{book.type}</p>
                      </div>
                    </div>
                    <h3 className="font-aref text-base sm:text-lg text-ember group-hover:text-gold transition-colors duration-300 mb-0.5 line-clamp-2">
                      {book.title}
                    </h3>
                    {book.series && <p className="text-ink/50 font-tajawal text-xs">{book.series}</p>}
                  </TiltCard>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes glint { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-glint { animation: glint 0.6s ease-in-out; }
      `}</style>
    </section>
  )
}
