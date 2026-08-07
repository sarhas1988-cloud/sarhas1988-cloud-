'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { ArrowRight } from 'lucide-react'

function slugify(str: string) {
  return str.trim().replace(/[\u0600-\u06FF\s]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'post'
}

export default function NewPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [err, setErr]       = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', body: '', published: false,
    published_at: new Date().toISOString().split('T')[0],
  })

  const set = (k: keyof typeof form, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }))

  const handleTitleChange = (v: string) => setForm((p) => ({ ...p, title: v, slug: slugify(v) }))

  const uploadCover = async (slug: string): Promise<string | null> => {
    if (!coverFile) return null
    const supabase = createClient()
    if (!supabase) return null
    const ext  = coverFile.name.split('.').pop()
    const path = `posts/${slug}-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('covers').upload(path, coverFile, { upsert: true })
    if (error) return null
    return supabase.storage.from('covers').getPublicUrl(path).data.publicUrl
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setErr('العنوان مطلوب'); return }
    setSaving(true); setErr('')
    const supabase = createClient()
    if (!supabase) { setErr('خطأ في الاتصال'); setSaving(false); return }

    const coverUrl = await uploadCover(form.slug)
    const { error } = await supabase.from('posts').insert({
      title: form.title.trim(), slug: form.slug.trim() || slugify(form.title),
      excerpt: form.excerpt.trim() || null, body: form.body.trim() || null,
      cover_url: coverUrl, published: form.published,
      published_at: form.published_at ? new Date(form.published_at).toISOString() : new Date().toISOString(),
    })

    if (error) { setErr(error.message); setSaving(false); return }
    router.push('/admin/posts')
  }

  return (
    <div className="min-h-screen bg-obsidian p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/posts" className="text-gold hover:text-ember text-sm font-tajawal flex items-center gap-1 mb-6">
          <ArrowRight size={14} /> العودة
        </Link>
        <h1 className="font-aref text-3xl text-gold mb-8">إضافة مقالة</h1>

        <form onSubmit={handleSave} className="space-y-5">
          <Field label="العنوان *">
            <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className={inp} required />
          </Field>
          <Field label="الـ Slug">
            <input value={form.slug} onChange={(e) => set('slug', e.target.value)} className={inp} dir="ltr" />
          </Field>
          <Field label="المقتطف (Excerpt)">
            <textarea value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} className={`${inp} min-h-[80px] resize-y`} placeholder="وصف قصير يظهر في قائمة المقالات..." />
          </Field>
          <Field label="المحتوى">
            <textarea value={form.body} onChange={(e) => set('body', e.target.value)} className={`${inp} min-h-[240px] resize-y`} placeholder="اكتب المقالة هنا... يمكنك استخدام # للعناوين و## للعناوين الفرعية" />
          </Field>
          <Field label="صورة الغلاف">
            <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              className="w-full text-ink/70 font-tajawal text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-gold file:text-obsidian file:font-semibold file:cursor-pointer cursor-pointer" />
          </Field>
          <Field label="تاريخ النشر">
            <input type="date" value={form.published_at} onChange={(e) => set('published_at', e.target.value)} className={inp} dir="ltr" />
          </Field>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="pub" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="w-4 h-4 accent-ember" />
            <label htmlFor="pub" className="text-ink font-tajawal text-sm cursor-pointer">نشر الآن (مرئي للزوار)</label>
          </div>

          {err && <p className="text-blood font-tajawal text-sm">{err}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded bg-gold text-obsidian font-tajawal font-semibold hover:bg-gold/90 disabled:opacity-50 transition-colors">
              {saving ? 'جاري الحفظ...' : 'حفظ المقالة'}
            </button>
            <Link href="/admin/posts"
              className="px-6 py-3 rounded border border-gold/30 text-ink hover:border-gold font-tajawal text-sm transition-colors text-center">
              إلغاء
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

const inp = 'w-full px-4 py-2.5 bg-obsidian border border-obsidian-lighter focus:border-ember outline-none rounded font-tajawal text-ink placeholder:text-ink/30 transition-colors text-sm'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-ink/70 font-tajawal text-sm mb-1.5">{label}</label>
      {children}
    </div>
  )
}
