'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Plus, Pencil, Trash2, ArrowRight, Eye, EyeOff } from 'lucide-react'
import type { Book } from '@/types/supabase'

export default function AdminBooksPage() {
  const [books, setBooks]     = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg]         = useState('')

  useEffect(() => { fetchBooks() }, [])

  const fetchBooks = async () => {
    const supabase = createClient()
    if (!supabase) return
    const { data } = await supabase.from('books').select('*').order('sort_order')
    setBooks((data as Book[]) ?? [])
    setLoading(false)
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`حذف "${title}"؟`)) return
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('books').delete().eq('id', id)
    setBooks((prev) => prev.filter((b) => b.id !== id))
    setMsg('تم الحذف')
    setTimeout(() => setMsg(''), 2500)
  }

  const togglePublished = async (book: Book) => {
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('books').update({ published: !book.published }).eq('id', book.id)
    setBooks((prev) => prev.map((b) => b.id === book.id ? { ...b, published: !b.published } : b))
  }

  return (
    <div className="min-h-screen bg-obsidian p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin/dashboard" className="text-gold hover:text-ember text-sm font-tajawal flex items-center gap-1 mb-2">
              <ArrowRight size={14} /> العودة
            </Link>
            <h1 className="font-aref text-3xl text-ember">الأعمال</h1>
          </div>
          <Link href="/admin/books/new" className="flex items-center gap-2 px-4 py-2 rounded bg-ember text-obsidian font-tajawal font-semibold text-sm hover:bg-ember/90 transition-colors">
            <Plus size={16} /> إضافة كتاب
          </Link>
        </div>

        {msg && <p className="mb-4 text-center text-sm font-tajawal text-gold">{msg}</p>}

        {loading ? (
          <p className="text-ink/50 font-tajawal text-center py-12">جاري التحميل...</p>
        ) : books.length === 0 ? (
          <div className="card-lifted rounded-lg p-10 text-center">
            <p className="text-ink/50 font-tajawal mb-4">لا توجد كتب بعد</p>
            <Link href="/admin/books/new" className="text-ember hover:text-gold font-tajawal text-sm">أضف أول كتاب →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {books.map((book) => (
              <div key={book.id} className="card-lifted rounded-lg p-4 flex items-center justify-between gap-4 hover:border-gold/30 transition-all">
                <div className="flex-1 min-w-0">
                  <h3 className="font-aref text-lg text-ink truncate">{book.title}</h3>
                  <p className="text-ink/50 font-tajawal text-xs mt-0.5">
                    {book.type}{book.series ? ` · ${book.series}` : ''}{book.edition ? ` · ${book.edition}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => togglePublished(book)} title={book.published ? 'إخفاء' : 'نشر'}
                    className={`p-2 rounded hover:bg-obsidian-lighter transition-colors ${book.published ? 'text-gold' : 'text-ink/30'}`}>
                    {book.published ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <Link href={`/admin/books/${book.slug}`}
                    className="p-2 rounded hover:bg-obsidian-lighter text-gold hover:text-ember transition-colors">
                    <Pencil size={18} />
                  </Link>
                  <button onClick={() => handleDelete(book.id, book.title)}
                    className="p-2 rounded hover:bg-obsidian-lighter text-blood hover:text-blood/70 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
