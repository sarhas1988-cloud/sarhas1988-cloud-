'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Plus, Trash2, ArrowRight } from 'lucide-react'

interface BuyLinkRow { label: string; url: string }

function slugify(str: string) {
  return str.trim()
    .replace(/[\u0600-\u06FF\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'book'
}

export default function NewBookPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [err, setErr]       = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [buyLinks, setBuyLinks]   = useState<BuyLinkRow[]>([{ label: '', url: '' }])

  const [form, setForm] = useState({
    title: '', slug: '', type: 'رواية', series: '',
    edition: '', award: '', tagline: '', synopsis: '',
    sort_order: '0', published: true,
  })

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }))

  const handleTitleChange = (v: string) => {
    setForm((p) => ({ ...p, title: v, slug: slugify(v) }))
  }

  const uploadCover = async (slug: string): Promise<string | null> => {
    if (!coverFile) return null
    const supabase = createClient()
    if (!supabase) return null
    const ext  = coverFile.name.split('.').pop()
    const path = `books/${slug}-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('covers').upload(path, coverFile, { upsert: true })
    if (error) return null
    const { data } = supabase.storage.from('covers').getPublicUrl(path)
    return data.publicUrl
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setErr('العنوان مطلوب'); return }
    setSaving(true); setErr('')
    const supabase = createClient()
    if (!supabase) { setErr('خطأ في الاتصال'); setSaving(false); return }

    const coverUrl = await uploadCover(form.slug)

    const { data: book, error } = await supabase.from('books').insert({
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      type: form.type,
      series: form.series.trim() || null,
      edition: form.edition.trim() || null,
      award: form.award.trim() || null,
      tagline: form.tagline.trim() || null,
      synopsis: form.synopsis.trim() || null,
      cover_url: coverUrl,
      sort_order: parseInt(form.sort_order) || 0,
      published: form.published,
    }).select('id').single()

    if (error || !book) { setErr(error?.message ?? 'حدث خطأ'); setSaving(false); return }

    const validLinks = buyLinks.filter((l) => l.label.trim() && l.url.trim())
    if (validLinks.length > 0) {
      await supabase.from('buy_links').insert(
        validLinks.map((l, i) => ({ book_id: book.id, label: l.label.trim(), url: l.url.trim(), sort_order: i }))
      )
    }

    router.push('/admin/books')
  }

  return (
    <div className="min-h-screen bg-obsidian p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/books" className="text-gold hover:text-ember text-sm font-tajawal flex items-center gap-1 mb-6">
          <ArrowRight size={14} /> العودة
        </Link>
        <h1 className="font-aref text-3xl text-ember mb-8">إضافة كتاب</h1>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Title */}
          <Field label="العنوان *">
            <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
              className={inp} placeholder="طقوس الموت" required />
          </Field>

          {/* Slug */}
          <Field label="الـ Slug (رابط الصفحة)">
            <input value={form.slug} onChange={(e) => set('slug', e.target.value)}
              className={inp} placeholder="toqoos" dir="ltr" />
          </Field>

          {/* Type */}
          <Field label="النوع">
            <select value={form.type} onChange={(e) => set('type', e.target.value)} className={inp}>
              <option value="رواية">رواية</option>
              <option value="مجموعة قصصية">مجموعة قصصية</option>
            </select>
          </Field>

          {/* Series */}
          <Field label="السلسلة">
            <input value={form.series} onChange={(e) => set('series', e.target.value)}
              className={inp} placeholder="قلادة الشمس" />
          </Field>

          {/* Edition */}
          <Field label="الطبعة">
            <input value={form.edition} onChange={(e) => set('edition', e.target.value)}
              className={inp} placeholder="الطبعة الثالثة" />
          </Field>

          {/* Award */}
          <Field label="جائزة / تقدير">
            <input value={form.award} onChange={(e) => set('award', e.target.value)}
              className={inp} placeholder="القائمة القصيرة — جرير ٢٠٢٢" />
          </Field>

          {/* Tagline */}
          <Field label="الوصف القصير (Tagline)">
            <input value={form.tagline} onChange={(e) => set('tagline', e.target.value)}
              className={inp} placeholder="في كل العصور وُجدوا بيننا..." />
          </Field>

          {/* Synopsis */}
          <Field label="الملخص">
            <textarea value={form.synopsis} onChange={(e) => set('synopsis', e.target.value)}
              className={`${inp} min-h-[120px] resize-y`} placeholder="نبذة عن الرواية..." />
          </Field>

          {/* Cover */}
          <Field label="صورة الغلاف">
            <input type="file" accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              className="w-full text-ink/70 font-tajawal text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-ember file:text-obsidian file:font-semibold file:cursor-pointer cursor-pointer" />
          </Field>

          {/* Sort order */}
          <Field label="ترتيب العرض">
            <input type="number" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)}
              className={inp} min="0" />
          </Field>

          {/* Published */}
          <div className="flex items-center gap-3">
            <input type="checkbox" id="pub" checked={form.published}
              onChange={(e) => set('published', e.target.checked)}
              className="w-4 h-4 accent-ember" />
            <label htmlFor="pub" className="text-ink font-tajawal text-sm cursor-pointer">منشور (مرئي للزوار)</label>
          </div>

          {/* Buy Links */}
          <div>
            <p className="text-ink/70 font-tajawal text-sm mb-3">روابط الشراء</p>
            <div className="space-y-2">
              {buyLinks.map((l, i) => (
                <div key={i} className="flex gap-2">
                  <input value={l.label} placeholder="اسم المتجر"
                    onChange={(e) => { const n = [...buyLinks]; n[i].label = e.target.value; setBuyLinks(n) }}
                    className={`${inp} flex-1`} />
                  <input value={l.url} placeholder="https://..." dir="ltr"
                    onChange={(e) => { const n = [...buyLinks]; n[i].url = e.target.value; setBuyLinks(n) }}
                    className={`${inp} flex-1`} />
                  {buyLinks.length > 1 && (
                    <button type="button" onClick={() => setBuyLinks((p) => p.filter((_, j) => j !== i))}
                      className="text-blood hover:text-blood/70 p-1"><Trash2 size={16} /></button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setBuyLinks((p) => [...p, { label: '', url: '' }])}
              className="mt-2 flex items-center gap-1 text-gold hover:text-ember text-sm font-tajawal transition-colors">
              <Plus size={14} /> إضافة رابط
            </button>
          </div>

          {err && <p className="text-blood font-tajawal text-sm">{err}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded bg-ember text-obsidian font-tajawal font-semibold hover:bg-ember/90 disabled:opacity-50 transition-colors">
              {saving ? 'جاري الحفظ...' : 'حفظ الكتاب'}
            </button>
            <Link href="/admin/books"
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
