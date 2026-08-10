'use client'
import { showToast } from '@/lib/toast'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Check, X, Trash2, ArrowRight, Star } from 'lucide-react'

interface ReviewRow {
  id: string
  reviewer_name: string
  rating: number
  comment: string | null
  approved: boolean
  created_at: string
  books: { title: string }[] | { title: string } | null
}

function getBookTitle(books: ReviewRow['books']): string {
  if (!books) return ''
  if (Array.isArray(books)) return books[0]?.title ?? ''
  return books.title ?? ''
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRow[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => { fetchReviews() }, [])

  const fetchReviews = async () => {
    const supabase = createClient()
    if (!supabase) return
    const { data } = await supabase
      .from('reviews')
      .select('id, reviewer_name, rating, comment, approved, created_at, books(title)')
      .order('created_at', { ascending: false })
    setReviews((data as ReviewRow[]) ?? [])
    setLoading(false)
  }

  const toggleApproval = async (id: string, current: boolean) => {
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('reviews').update({ approved: !current }).eq('id', id)
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, approved: !current } : r))
    setMsg(!current ? 'تم الاعتماد ✓' : 'تم الإخفاء')
    setTimeout(() => setMsg(''), 2500)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذا التقييم؟')) return
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('reviews').delete().eq('id', id)
    setReviews((prev) => prev.filter((r) => r.id !== id))
    showToast('تم الحذف بنجاح')
    setTimeout(() => setMsg(''), 2500)
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString('ar-EG')
  const pending = reviews.filter((r) => !r.approved).length

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin/dashboard" className="text-gold hover:text-ember text-sm font-tajawal flex items-center gap-1 mb-2">
              <ArrowRight size={14} /> العودة
            </Link>
            <h1 className="font-aref text-3xl text-ember">التقييمات</h1>
            {pending > 0 && (
              <p className="text-gold font-tajawal text-sm mt-1">{pending} تقييم في انتظار الاعتماد</p>
            )}
          </div>
        </div>

        {msg && <p className="mb-4 text-center text-sm font-tajawal text-gold">{msg}</p>}

        {loading ? (
          <p className="text-ink/50 font-tajawal text-center py-12">جاري التحميل...</p>
        ) : reviews.length === 0 ? (
          <div className="card-lifted rounded-lg p-10 text-center">
            <p className="text-ink/50 font-tajawal">لا توجد تقييمات بعد</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className={`card-lifted rounded-lg p-4 transition-all ${!r.approved ? 'border-gold/30' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-tajawal font-semibold text-ink text-sm">{r.reviewer_name}</p>
                      <span className="text-ink/30">·</span>
                      <p className="text-ink/40 font-tajawal text-xs">{getBookTitle(r.books)}</p>
                    </div>
                    <div className="flex gap-0.5 mb-1" dir="ltr">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} size={14} className={i <= r.rating ? 'fill-gold text-gold' : 'text-ink/20'} />
                      ))}
                    </div>
                    {r.comment && <p className="text-ink/60 font-tajawal text-sm mt-1">{r.comment}</p>}
                    <p className="text-ink/30 font-tajawal text-xs mt-2">{fmt(r.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => toggleApproval(r.id, r.approved)}
                      title={r.approved ? 'إخفاء' : 'اعتماد'}
                      className={`p-2 rounded hover:bg-obsidian-lighter transition-colors ${r.approved ? 'text-gold' : 'text-ink/30'}`}>
                      {r.approved ? <Check size={18} /> : <X size={18} />}
                    </button>
                    <button onClick={() => handleDelete(r.id)}
                      className="p-2 rounded hover:bg-obsidian-lighter text-blood transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                {!r.approved && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-gold/15 text-gold text-xs font-tajawal rounded">
                    في انتظار الاعتماد
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
