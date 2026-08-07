'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'
import type { Book } from '@/types/supabase'
import { getBookCover, getPlaceholderColor } from '@/types/supabase'

type Filter = 'الكل' | 'روايات' | 'مجموعات قصصية' | 'قلادة الشمس'

interface Props { books: Book[] }

export function WorksGrid({ books }: Props) {
  const { ref, isVisible } = useScrollReveal()
  const [filter, setFilter] = useState<Filter>('الكل')

  const filtered = books.filter((b) => {
    if (filter === 'الكل')             return true
    if (filter === 'روايات')           return b.type === 'رواية'
    if (filter === 'مجموعات قصصية')   return b.type === 'مجموعة قصصية'
    if (filter === 'قلادة الشمس')     return b.series === 'قلادة الشمس'
    return true
  })

  const filters: Filter[] = ['الكل', 'روايات', 'مجموعات قصصية', 'قلادة الشمس']

  return (
    <section
      id="works"
      ref={ref}
      className={`py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-section-2 border-t border-gold-hairline relative transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <p className="text-xs sm:text-base text-gold tracking-widest mb-3 font-tajawal uppercase">كل الأعمال</p>
          <h2 className="font-aref text-3xl sm:text-5xl lg:text-6xl text-ink mb-4">المكتبة الكاملة</h2>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8 sm:mb-12">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 sm:px-5 py-1.5 rounded font-tajawal text-sm font-semibold transition-all ${
                filter === f
                  ? 'bg-ember text-obsidian'
                  : 'bg-obsidian-lighter text-ink hover:text-ember'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="text-ink/40 font-tajawal text-center py-12">لا توجد أعمال في هذا التصنيف</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((book, i) => {
              const cover = getBookCover(book)
              const bg    = getPlaceholderColor(book)
              return (
                <Link key={book.slug} href={`/books/${book.slug}`}>
                  <div className="group" style={{ transitionDelay: isVisible ? `${i * 50}ms` : '0ms' }}>
                    {/* Cover */}
                    <div className="card-lifted relative overflow-hidden rounded-lg mb-3 aspect-[2/3] group-hover:border-gold transition-all duration-300">
                      {cover ? (
                        <>
                          <Image
                            src={cover} alt={book.title} fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Glint sweep */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                              style={{ animation: 'glint 0.6s ease-in-out' }} />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-3" style={{ background: bg }}>
                          <p className="font-aref text-lg text-ink/80 text-center leading-snug line-clamp-3">{book.title}</p>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <p className="text-gold text-xs font-tajawal">{book.type}</p>
                      </div>
                    </div>
                    {/* Info */}
                    <h3 className="font-aref text-base sm:text-lg text-ember group-hover:text-gold transition-colors duration-300 mb-0.5 line-clamp-2">
                      {book.title}
                    </h3>
                    {book.series && (
                      <p className="text-ink/50 font-tajawal text-xs">{book.series}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes glint {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  )
}
