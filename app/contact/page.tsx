'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Send, ArrowRight } from 'lucide-react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error'); setMsg('جميع الحقول مطلوبة'); return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error'); setMsg('بريد إلكتروني غير صحيح'); return
    }
    setStatus('sending')
    try {
      const supabase = createClient()
      if (!supabase) throw new Error('no client')
      const { error } = await supabase.from('contacts').insert({
        name: name.trim(), email: email.trim(), message: message.trim()
      })
      if (error) throw error
      setName(''); setEmail(''); setMessage('')
      setStatus('sent'); setMsg('تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت.')
      setTimeout(() => { setStatus('idle'); setMsg('') }, 6000)
    } catch {
      setStatus('error'); setMsg('حدث خطأ، حاول مرة أخرى')
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-ember hover:text-gold transition-colors mb-8 font-tajawal font-semibold text-sm">
          <ArrowRight size={14} /> الرئيسية
        </Link>

        <div className="text-center mb-10">
          <h1 className="font-aref text-4xl sm:text-5xl text-ink mb-3">تواصل معنا</h1>
          <p className="text-ink/60 font-tajawal text-sm sm:text-base">
            للاستفسارات، المقابلات الصحفية، دعوات الفعاليات، أو أي سؤال آخر
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-lifted rounded-xl p-6 sm:p-8 space-y-5">
          <div>
            <label className="block text-ink/70 font-tajawal text-sm mb-1.5">الاسم *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required
              placeholder="اسمك الكامل"
              className="w-full px-4 py-3 bg-obsidian border border-gold-hairline focus:border-ember outline-none rounded-lg font-tajawal text-ink placeholder:text-ink/30 text-sm transition-colors" />
          </div>
          <div>
            <label className="block text-ink/70 font-tajawal text-sm mb-1.5">البريد الإلكتروني *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              placeholder="email@example.com" dir="ltr"
              className="w-full px-4 py-3 bg-obsidian border border-gold-hairline focus:border-ember outline-none rounded-lg font-tajawal text-ink placeholder:text-ink/30 text-sm transition-colors" />
          </div>
          <div>
            <label className="block text-ink/70 font-tajawal text-sm mb-1.5">الرسالة *</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5}
              placeholder="اكتب رسالتك هنا..."
              className="w-full px-4 py-3 bg-obsidian border border-gold-hairline focus:border-ember outline-none rounded-lg font-tajawal text-ink placeholder:text-ink/30 text-sm transition-colors resize-y" />
          </div>

          {msg && (
            <p className={`text-sm font-tajawal ${status === 'sent' ? 'text-gold' : 'text-blood'}`}>{msg}</p>
          )}

          <button type="submit" disabled={status === 'sending' || status === 'sent'}
            className="w-full flex items-center justify-center gap-2 py-3 bg-ember text-white rounded-lg font-tajawal font-semibold hover:bg-ember/90 disabled:opacity-50 transition-colors">
            <Send size={16} />
            {status === 'sending' ? 'جاري الإرسال...' : status === 'sent' ? 'تم الإرسال ✓' : 'إرسال الرسالة'}
          </button>
        </form>
      </div>
    </main>
  )
}
