'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ShoppingBag, Download, Loader2 } from 'lucide-react'

interface Props {
  bookId: string
  bookTitle: string
  price: number
}

export function BuyEbook({ bookId, bookTitle, price }: Props) {
  const [step, setStep] = useState<'button' | 'form' | 'processing' | 'success'>('button')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [err, setErr] = useState('')
  const [downloadToken, setDownloadToken] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) { setErr('الاسم والإيميل مطلوبين'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('بريد إلكتروني غير صحيح'); return }

    setStep('processing'); setErr('')

    try {
      const supabase = createClient()
      if (!supabase) throw new Error('no client')

      // Create order
      const { data: order, error } = await supabase.from('orders').insert({
        book_id: bookId,
        customer_name: name.trim(),
        customer_email: email.trim(),
        amount: price,
        status: 'completed', // TODO: change to 'pending' when Paymob is connected
      }).select('download_token').single()

      if (error || !order) throw error || new Error('failed')

      setDownloadToken(order.download_token)
      setStep('success')
    } catch {
      setErr('حدث خطأ، حاول مرة أخرى')
      setStep('form')
    }
  }

  if (step === 'button') {
    return (
      <button
        onClick={() => setStep('form')}
        className="w-full flex items-center justify-center gap-3 bg-gold text-obsidian px-6 py-4 rounded-xl font-tajawal font-bold text-base hover:bg-gold/90 transition-all shadow-lg hover:shadow-gold/20 hover:scale-[1.02]"
      >
        <ShoppingBag size={20} />
        اشتري النسخة الإلكترونية — {price} ج.م
      </button>
    )
  }

  if (step === 'success') {
    return (
      <div className="card-lifted rounded-xl p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <Download size={28} className="text-emerald-400" />
        </div>
        <h3 className="font-aref text-2xl text-ink mb-2">تم الشراء بنجاح!</h3>
        <p className="text-ink/60 font-tajawal text-sm mb-5">
          شكراً لك. اضغط الزرار لتحميل «{bookTitle}»
        </p>
        <a
          href={`/api/download?token=${downloadToken}`}
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-tajawal font-bold hover:bg-emerald-700 transition-colors"
        >
          <Download size={18} />
          تحميل الكتاب
        </a>
        <p className="text-ink/30 font-tajawal text-xs mt-4">
          تم إرسال رابط التحميل لبريدك الإلكتروني أيضاً
        </p>
      </div>
    )
  }

  return (
    <div className="card-lifted rounded-xl p-5 sm:p-6">
      <h3 className="font-aref text-xl text-ink mb-1">شراء النسخة الإلكترونية</h3>
      <p className="text-gold font-tajawal font-bold text-lg mb-4">{price} ج.م</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسمك الكامل"
          required
          className="w-full px-4 py-3 bg-obsidian border border-gold-hairline focus:border-ember outline-none rounded-lg font-tajawal text-ink placeholder:text-ink/30 text-sm"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="بريدك الإلكتروني"
          required
          dir="ltr"
          className="w-full px-4 py-3 bg-obsidian border border-gold-hairline focus:border-ember outline-none rounded-lg font-tajawal text-ink placeholder:text-ink/30 text-sm"
        />

        {err && <p className="text-blood font-tajawal text-sm">{err}</p>}

        <button
          type="submit"
          disabled={step === 'processing'}
          className="w-full flex items-center justify-center gap-2 bg-gold text-obsidian py-3 rounded-xl font-tajawal font-bold hover:bg-gold/90 disabled:opacity-50 transition-all"
        >
          {step === 'processing' ? (
            <><Loader2 size={18} className="animate-spin" /> جاري المعالجة...</>
          ) : (
            <><ShoppingBag size={18} /> ادفع {price} ج.م</>
          )}
        </button>

        <button type="button" onClick={() => setStep('button')}
          className="w-full py-2 text-ink/40 font-tajawal text-sm hover:text-ink/60 transition-colors">
          إلغاء
        </button>
      </form>
    </div>
  )
}
