'use client'

import { useState } from 'react'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'
import { createClient } from '@/utils/supabase/client'

export function NewsletterSection() {
  const { ref, isVisible } = useScrollReveal()
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [msg, setMsg]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const val = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setStatus('error'); setMsg('الرجاء إدخال بريد إلكتروني صحيح'); return
    }
    setStatus('loading')
    try {
      const supabase = createClient()
      if (!supabase) throw new Error('no client')
      const { error } = await supabase.from('subscribers').insert({ email: val })
      if (error) {
        if (error.code === '23505') { setStatus('error'); setMsg('هذا البريد مشترك بالفعل') }
        else throw error
      } else {
        setEmail(''); setStatus('success'); setMsg('تمام! القصة في طريقها إلى بريدك.')
        setTimeout(() => { setStatus('idle'); setMsg('') }, 4000)
      }
    } catch {
      setStatus('error'); setMsg('حدث خطأ، حاول مرة أخرى')
    }
  }

  return (
    <section
      id="join"
      ref={ref}
      className={`py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-section-2 border-t border-gold-hairline relative glow-gold-bottom transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-2xl mx-auto">
        <div className="border border-gold/30 rounded-lg p-6 sm:p-12 bg-obsidian-lighter/50 backdrop-blur-sm text-center">
          <h2 className="font-aref text-3xl sm:text-5xl text-ink mb-3">ابقَ على تواصل</h2>
          <p className="text-ink/70 font-tajawal text-sm sm:text-lg mb-8">
            احصل على قصة مجانية من عالم «قلادة الشمس» وكن أوّل من يعرف بأي إصدار جديد.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              dir="rtl"
              className="w-full px-4 sm:px-6 py-3 bg-obsidian border border-obsidian-lighter focus:border-ember outline-none rounded font-tajawal text-ink placeholder:text-ink/40 transition-colors duration-300"
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className={`w-full px-6 py-3 rounded font-tajawal font-semibold transition-all duration-300 ${
                status === 'success' ? 'bg-gold text-obsidian' : 'bg-ember text-obsidian hover:bg-ember/90'
              } disabled:opacity-50`}
            >
              {status === 'loading' ? 'جاري الإرسال...' : 'أرسل القصة'}
            </button>
            {msg && (
              <p className={`text-sm font-tajawal ${status === 'success' ? 'text-gold' : 'text-blood'}`}>
                {msg}
              </p>
            )}
          </form>

          <p className="text-ink/40 font-tajawal text-xs mt-6">
            لن نرسل لك بريداً عشوائياً. ألغِ الاشتراك في أي وقت.
          </p>
        </div>
      </div>
    </section>
  )
}
