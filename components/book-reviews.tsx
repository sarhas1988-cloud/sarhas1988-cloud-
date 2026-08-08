'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Star, Send } from 'lucide-react'
import type { Review } from '@/types/supabase'

interface Props {
  bookId: string
  bookTitle: string
}

function StarRating({ rating, onRate, interactive = false }: {
  rating: number
  onRate?: (r: number) => void
  interactive?: boolean
}) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(i)}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`transition-colors ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <Star
            size={interactive ? 28 : 16}
            className={`${
              i <= (hover || rating)
                ? 'fill-gold text-gold'
                : 'fill-none text-ink/20'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  )
}

export function BookReviews({ bookId, bookTitle }: Props) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('book_id', bookId)
        .eq('approved', true)
        .order('created_at', { ascending: false })
      setReviews((data as Review[]) ?? [])
      setLoading(false)
    }
    fetch()
  }, [bookId])

  const avgRating = reviews.length > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setMsg('الاسم مطلوب'); return }
    if (rating === 0) { setMsg('اختر التقييم'); return }
    setSending(true); setMsg('')

    const supabase = createClient()
    if (!supabase) { setMsg('خطأ في الاتصال'); setSending(false); return }

    const { error } = await supabase.from('reviews').insert({
      book_id: bookId,
      reviewer_name: name.trim(),
      rating,
      comment: comment.trim() || null,
    })

    if (error) {
      setMsg('حدث خطأ، حاول مرة أخرى')
    } else {
      setName(''); setRating(0); setComment('')
      setShowForm(false)
      setMsg('شكراً! تقييمك هيظهر بعد المراجعة.')
    }
    setSending(false)
    setTimeout(() => setMsg(''), 5000)
  }

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="border-t border-gold-hairline pt-10 mt-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="font-aref text-2xl sm:text-3xl text-ink">آراء القرّاء</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={Math.round(avgRating)} />
              <span className="text-ink/60 font-tajawal text-sm">
                {avgRating} من ٥ · {reviews.length} تقييم
              </span>
            </div>
          )}
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2 bg-ember text-white rounded-lg font-tajawal font-semibold text-sm hover:bg-ember/90 transition-colors shadow-md"
          >
            أضف تقييمك
          </button>
        )}
      </div>

      {/* Message */}
      {msg && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-gold/10 border border-gold/20 text-ink font-tajawal text-sm">
          {msg}
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card-lifted rounded-xl p-5 sm:p-6 mb-8">
          <h3 className="font-aref text-xl text-ink mb-4">قيّم «{bookTitle}»</h3>

          <div className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-ink/60 font-tajawal text-sm mb-2">التقييم *</label>
              <StarRating rating={rating} onRate={setRating} interactive />
            </div>

            {/* Name */}
            <div>
              <label className="block text-ink/60 font-tajawal text-sm mb-1.5">اسمك *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اسمك أو لقبك"
                required
                className="w-full px-4 py-2.5 bg-obsidian border border-gold-hairline focus:border-ember outline-none rounded-lg font-tajawal text-ink placeholder:text-ink/30 text-sm transition-colors"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-ink/60 font-tajawal text-sm mb-1.5">رأيك (اختياري)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="اكتب رأيك في الرواية..."
                rows={3}
                className="w-full px-4 py-2.5 bg-obsidian border border-gold-hairline focus:border-ember outline-none rounded-lg font-tajawal text-ink placeholder:text-ink/30 text-sm transition-colors resize-y"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-2 px-6 py-2.5 bg-ember text-white rounded-lg font-tajawal font-semibold text-sm hover:bg-ember/90 disabled:opacity-50 transition-colors"
              >
                <Send size={16} />
                {sending ? 'جاري الإرسال...' : 'إرسال التقييم'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-ink/15 rounded-lg font-tajawal text-ink/60 text-sm hover:border-ink/30 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <p className="text-ink/40 font-tajawal text-center py-8">جاري التحميل...</p>
      ) : reviews.length === 0 && !msg ? (
        <div className="text-center py-10">
          <p className="text-ink/40 font-tajawal mb-2">لا توجد تقييمات بعد</p>
          <p className="text-ink/30 font-tajawal text-sm">كن أول من يقيّم هذا العمل</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="card-lifted rounded-xl p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-tajawal font-semibold text-ink text-sm">{r.reviewer_name}</p>
                  <p className="text-ink/35 font-tajawal text-xs mt-0.5">{fmtDate(r.created_at)}</p>
                </div>
                <StarRating rating={r.rating} />
              </div>
              {r.comment && (
                <p className="text-ink/70 font-tajawal text-sm leading-relaxed mt-3">{r.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
