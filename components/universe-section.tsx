'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'
import type { Book } from '@/types/supabase'
import { getBookCover, getPlaceholderColor } from '@/types/supabase'

interface Props { books: Book[] }

export function UniverseSection({ books }: Props) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section
      id="universe"
      ref={ref}
      className={`py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-section-1 border-t border-gold-hairline relative glow-blood-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 sm:mb-16">
          <p className="text-xs sm:text-base text-gold tracking-widest mb-3 font-tajawal uppercase">
            عالم قلادة الشمس
          </p>
          <h2 className="font-aref text-3xl sm:text-5xl lg:text-6xl text-ink mb-4">
            الكون الروائي
          </h2>
          <p className="text-ink/70 font-tajawal text-base sm:text-lg max-w-2xl leading-relaxed">
            ثلاث روايات متصلة بعالم واحد مظلم، حيث تتشابك الأقدار والأساطير المصرية بالرعب الحديث.
          </p>
        </div>

        {books.length === 0 ? (
          <p className="text-ink/40 font-tajawal text-center py-12">لا توجد روايات في هذا العالم بعد</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {books.map((book, i) => {
              const cover = getBookCover(book)
              const bg    = getPlaceholderColor(book)
              return (
                <Link key={book.slug} href={`/books/${book.slug}`}>
                  <div
                    className="group transition-all duration-700 cursor-pointer"
                    style={{ transitionDelay: isVisible ? `${i * 100}ms` : '0ms' }}
                  >
                    {/* Cover */}
                    <div className="card-lifted relative overflow-hidden rounded-lg mb-4 aspect-[2/3] group-hover:border-gold transition-all duration-300">
                      {cover ? (
                        <Image
                          src={cover} alt={book.title} fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-4" style={{ background: bg }}>
                          <p className="font-aref text-2xl text-ink/80 text-center leading-snug">{book.title}</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <p className="text-gold text-xs font-tajawal">{book.edition ?? book.type}</p>
                      </div>
                    </div>
                    {/* Title */}
                    <h3 className="font-aref text-2xl sm:text-3xl text-ember mb-1 line-clamp-2">
                      {book.title}
                    </h3>
                    {book.tagline && (
                      <p className="text-ink/60 font-tajawal text-sm line-clamp-2">{book.tagline}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
