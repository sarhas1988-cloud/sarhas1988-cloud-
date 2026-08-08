'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { ArrowRight } from 'lucide-react'

export default function NewEventPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const [form, setForm] = useState({
    title: '', description: '', location: '', event_date: '',
    event_time: '', event_type: 'معرض كتاب', link: '', published: true,
  })

  const set = (k: keyof typeof form, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }))

  const uploadCover = async (): Promise<string | null> => {
    if (!coverFile) return null
    const supabase = createClient()
    if (!supabase) return null
    const ext = coverFile.name.split('.').pop()
    const path = `events/event-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('covers').upload(path, coverFile, { upsert: true })
    if (error) return null
    return supabase.storage.from('covers').getPublicUrl(path).data.publicUrl
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.event_date) { setErr('العنوان والتاريخ مطلوبين'); return }
    setSaving(true); setErr('')
    const supabase = createClient()
    if (!supabase) { setErr('خطأ في الاتصال'); setSaving(false); return }

    const coverUrl = await uploadCover()
    const { error } = await supabase.from('events').insert({
      title: form.title.trim(), description: form.description.trim() || null,
      location: form.location.trim() || null, event_date: form.event_date,
      event_time: form.event_time.trim() || null, event_type: form.event_type,
      cover_url: coverUrl, link: form.link.trim() || null, published: form.published,
    })

    if (error) { setErr(error.message); setSaving(false); return }
    router.push('/admin/events')
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/events" className="text-gold hover:text-ember text-sm font-tajawal flex items-center gap-1 mb-6">
          <ArrowRight size={14} /> العودة
        </Link>
        <h1 className="font-aref text-3xl text-ember mb-8">إضافة فعالية</h1>

        <form onSubmit={handleSave} className="space-y-5">
          <Field label="عنوان الفعالية *">
            <input value={form.title} onChange={(e) => set('title', e.target.value)} className={inp} required placeholder="معرض القاهرة الدولي للكتاب ٢٠٢٧" />
          </Field>
          <Field label="النوع">
            <select value={form.event_type} onChange={(e) => set('event_type', e.target.value)} className={inp}>
              <option value="معرض كتاب">معرض كتاب</option>
              <option value="حفل توقيع">حفل توقيع</option>
              <option value="ندوة">ندوة</option>
              <option value="أخرى">أخرى</option>
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="التاريخ *">
              <input type="date" value={form.event_date} onChange={(e) => set('event_date', e.target.value)} className={inp} required dir="ltr" />
            </Field>
            <Field label="الوقت">
              <input value={form.event_time} onChange={(e) => set('event_time', e.target.value)} className={inp} placeholder="٤:٠٠ م - ٨:٠٠ م" />
            </Field>
          </div>
          <Field label="المكان">
            <input value={form.location} onChange={(e) => set('location', e.target.value)} className={inp} placeholder="أرض المعارض — مدينة نصر، القاهرة" />
          </Field>
          <Field label="الوصف">
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} className={`${inp} min-h-[100px] resize-y`} placeholder="تفاصيل الفعالية..." />
          </Field>
          <Field label="صورة الفعالية">
            <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              className="w-full text-ink/70 font-tajawal text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-ember file:text-white file:font-semibold file:cursor-pointer cursor-pointer" />
          </Field>
          <Field label="رابط خارجي (اختياري)">
            <input value={form.link} onChange={(e) => set('link', e.target.value)} className={inp} placeholder="https://..." dir="ltr" />
          </Field>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="pub" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="w-4 h-4 accent-ember" />
            <label htmlFor="pub" className="text-ink font-tajawal text-sm cursor-pointer">نشر الفعالية</label>
          </div>

          {err && <p className="text-blood font-tajawal text-sm">{err}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-lg bg-ember text-white font-tajawal font-semibold hover:bg-ember/90 disabled:opacity-50 transition-colors">
              {saving ? 'جاري الحفظ...' : 'حفظ الفعالية'}
            </button>
            <Link href="/admin/events" className="px-6 py-3 rounded-lg border border-gold/30 text-ink hover:border-gold font-tajawal text-sm transition-colors text-center">إلغاء</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

const inp = 'w-full px-4 py-2.5 bg-obsidian border border-gold-hairline focus:border-ember outline-none rounded-lg font-tajawal text-ink placeholder:text-ink/30 transition-colors text-sm'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-ink/70 font-tajawal text-sm mb-1.5">{label}</label>{children}</div>
}
