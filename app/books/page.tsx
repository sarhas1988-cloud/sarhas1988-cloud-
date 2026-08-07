'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import type { Book } from '@/types/supabase'
import { getBookCover, getPlaceholderColor } from '@/types/supabase'

type Filter = 'الكل' | 'روايات' | 'مجموعات قصصية' | 'قلادة الشمس'

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('الكل')

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const supabase = createClient()
        if (!supabase) return
        const { data } = await supabase
          .from('books')
          .select('*')
          .eq('published', true)
          .order('sort_order')
        setBooks((data as Book[]) ?? [])
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  const filtered = books.filter((b) => {
    if (filter === 'الكل')           return true
    if (filter === 'روايات')         return b.type === 'رواية'
    if (filter === 'مجموعات قصصية') return b.type === 'مجموعة قصصية'
    if (filter === 'قلادة الشمس')   return b.series === 'قلادة الشمس'
    return true
  })

  const filters: Filter[] = ['الكل', 'روايات', 'مجموعات قصصية', 'قلادة الشمس']

  return (
    <main className="bg-obsidian text-ink min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="font-aref text-4xl sm:text-6xl text-ink mb-4">كل الأعمال</h1>
          <p className="text-lg text-ink/70 font-tajawal max-w-xl mx-auto">
            استكشف عالم قلادة الشمس وغيرها من الروايات والقصص
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10 sm:mb-14">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 sm:px-6 py-2 rounded font-tajawal font-semibold text-sm transition-all ${
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
        {loading ? (
          <p className="text-center text-ink/50 font-tajawal py-20">جاري التحميل...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-ink/50 font-tajawal py-20">لا توجد أعمال في هذا التصنيف</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((book) => {
              const cover = getBookCover(book)
              const bg    = getPlaceholderColor(book)
              return (
                <Link key={book.slug} href={`/books/${book.slug}`}>
                  <div className="group cursor-pointer">
                    <div className="card-lifted relative aspect-[2/3] rounded-lg overflow-hidden mb-3 group-hover:border-gold transition-all duration-300">
                      {cover ? (
                        <Image src={cover} alt={book.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-3" style={{ background: bg }}>
                          <p className="font-aref text-lg text-ink/80 text-center line-clamp-3">{book.title}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      <span className="text-xs text-ink/50 font-tajawal">{book.type}</span>
                      {book.series && <span className="text-xs text-ember font-tajawal">· {book.series}</span>}
                    </div>
                    <h3 className="font-aref text-base sm:text-lg text-ink group-hover:text-ember transition-colors line-clamp-2">
                      {book.title}
                    </h3>
                    {book.award && <p className="text-gold text-xs font-tajawal mt-0.5 line-clamp-1">{book.award}</p>}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
