'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'
import type { Book } from '@/types/supabase'
import { getBookCover, getPlaceholderColor } from '@/types/supabase'
import { soundManager } from '@/lib/sounds'

interface Props { books: Book[] }

export function UniverseSection({ books }: Props) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section
      id="universe"
      ref={ref}
      className={`py-14 sm:py-24 px-5 sm:px-8 border-t border-gold-hairline relative transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs text-gold tracking-widest mb-2 font-tajawal">عالم قلادة الشمس</p>
          <h2 className="font-aref text-3xl sm:text-5xl text-ink mb-3">الكون الروائي</h2>
          <p className="text-ink/60 font-tajawal text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            ثلاث روايات متصلة بعالم واحد مظلم، حيث تتشابك الأقدار والأساطير المصرية بالرعب الحديث.
          </p>
        </div>

        {books.length === 0 ? (
          <p className="text-ink/40 font-tajawal text-center py-8">لا توجد روايات بعد</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {books.map((book) => {
              const cover = getBookCover(book)
              const bg = getPlaceholderColor(book)
              return (
                <Link key={book.slug} href={`/books/${book.slug}`}
                  onClick={() => soundManager?.playPageTurn()}
                  onMouseEnter={() => soundManager?.playHover()}>
                  <div className="group">
                    <div className="relative overflow-hidden rounded-lg mb-3 aspect-[2/3] border border-gold-subtle hover:border-gold transition-all duration-300"
                      style={{ backgroundColor: bg }}>
                      {cover ? (
                        <Image src={cover} alt={book.title} fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <p className="font-aref text-2xl text-ink/70 text-center">{book.title}</p>
                        </div>
                      )}
                    </div>
                    <h3 className="font-aref text-xl sm:text-2xl text-ember mb-0.5">{book.title}</h3>
                    {book.tagline && (
                      <p className="text-ink/50 font-tajawal text-xs sm:text-sm line-clamp-2">{book.tagline}</p>
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
