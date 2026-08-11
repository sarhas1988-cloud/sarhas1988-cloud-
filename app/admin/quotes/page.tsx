'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { showToast } from '@/lib/toast'
import { Plus, Trash2, ArrowRight, Eye, EyeOff, Quote } from 'lucide-react'

interface QuoteItem {
  id: string; text: string; book_title: string | null
  sort_order: number; published: boolean
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newText, setNewText] = useState('')
  const [newBook, setNewBook] = useState('')

  useEffect(() => { fetchQuotes() }, [])

  const fetchQuotes = async () => {
    const supabase = createClient()
    if (!supabase) return
    const { data } = await supabase.from('quotes').select('*').order('sort_order')
    setQuotes((data as QuoteItem[]) ?? [])
    setLoading(false)
  }

  const handleAdd = async () => {
    if (!newText.trim()) { showToast('اكتب الاقتباس', 'error'); return }
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('quotes').insert({
      text: newText.trim(),
      book_title: newBook.trim() || null,
      sort_order: quotes.length + 1,
      published: true,
    })
    setNewText(''); setNewBook('')
    fetchQuotes()
    showToast('تمت الإضافة ✓')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذا الاقتباس؟')) return
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('quotes').delete().eq('id', id)
    setQuotes((prev) => prev.filter((q) => q.id !== id))
    showToast('تم الحذف')
  }

  const togglePublished = async (q: QuoteItem) => {
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('quotes').update({ published: !q.published }).eq('id', q.id)
    setQuotes((prev) => prev.map((x) => x.id === q.id ? { ...x, published: !q.published } : x))
    showToast(q.published ? 'تم الإخفاء' : 'تم النشر ✓')
  }

  const inp = 'w-full px-4 py-2.5 bg-obsidian border border-gold-hairline focus:border-ember outline-none rounded-lg font-tajawal text-ink placeholder:text-ink/30 transition-colors text-sm'

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/dashboard" className="text-gold hover:text-ember text-sm font-tajawal flex items-center gap-1 mb-2">
          <ArrowRight size={14} /> العودة
        </Link>
        <h1 className="font-aref text-3xl text-ember mb-8">الاقتباسات</h1>

        {/* Add new */}
        <div className="card-lifted rounded-xl p-5 mb-8">
          <h2 className="font-aref text-xl text-ink mb-4">إضافة اقتباس</h2>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="اكتب الاقتباس من الرواية..."
            rows={3}
            className={`${inp} mb-3 resize-y`}
          />
          <div className="flex gap-2">
            <input
              value={newBook}
              onChange={(e) => setNewBook(e.target.value)}
              placeholder="اسم الرواية (اختياري)"
              className={`${inp} flex-1`}
            />
            <button onClick={handleAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-ember text-white rounded-lg font-tajawal font-semibold text-sm hover:bg-ember/90 transition-colors shrink-0">
              <Plus size={16} /> إضافة
            </button>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <p className="text-ink/50 font-tajawal text-center py-12">جاري التحميل...</p>
        ) : quotes.length === 0 ? (
          <div className="card-lifted rounded-lg p-10 text-center">
            <Quote size={32} className="text-ink/20 mx-auto mb-3" />
            <p className="text-ink/50 font-tajawal">لا توجد اقتباسات بعد</p>
          </div>
        ) : (
          <div className="space-y-3">
            {quotes.map((q) => (
              <div key={q.id} className={`card-lifted rounded-lg p-4 transition-all ${!q.published ? 'opacity-50' : ''}`}>
                <p className="font-aref text-lg text-ink leading-relaxed mb-2">«{q.text}»</p>
                {q.book_title && (
                  <p className="text-ember font-tajawal text-xs font-semibold mb-2">— {q.book_title}</p>
                )}
                <div className="flex items-center gap-2">
                  <button onClick={() => togglePublished(q)}
                    className={`p-1.5 rounded hover:bg-obsidian-lighter transition-colors ${q.published ? 'text-gold' : 'text-ink/30'}`}>
                    {q.published ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button onClick={() => handleDelete(q.id)}
                    className="p-1.5 rounded hover:bg-obsidian-lighter text-blood transition-colors">
                    <Trash2 size={16} />
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
