'use client'
import { showToast } from '@/lib/toast'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Plus, Trash2, ArrowRight } from 'lucide-react'
import type { Book, BuyLink } from '@/types/supabase'

interface BuyLinkRow { id?: string; label: string; url: string }

export default function EditBookPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = React.use(paramsPromise)
  const router  = useRouter()
  const [book, setBook]       = useState<Book | null>(null)
  const [saving, setSaving]   = useState(false)
  const [loading, setLoading] = useState(true)
  const [err, setErr]         = useState('')
  const [msg, setMsg]         = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [buyLinks, setBuyLinks]   = useState<BuyLinkRow[]>([])

  const [form, setForm] = useState({
    title: '', slug: '', type: 'رواية', series: '',
    edition: '', award: '', tagline: '', synopsis: '',
    sort_order: '0', published: true,
  })

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }))

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      if (!supabase) return
      const { data: b } = await supabase.from('books').select('*').eq('slug', params.slug).single()
      if (!b) { router.push('/admin/books'); return }
      const bk = b as Book
      setBook(bk)
      setForm({
        title: bk.title, slug: bk.slug, type: bk.type,
        series: bk.series ?? '', edition: bk.edition ?? '',
        award: bk.award ?? '', tagline: bk.tagline ?? '',
        synopsis: bk.synopsis ?? '', sort_order: String(bk.sort_order),
        published: bk.published,
      })
      const { data: links } = await supabase.from('buy_links').select('*').eq('book_id', bk.id).order('sort_order')
      setBuyLinks((links as BuyLink[])?.map((l) => ({ id: l.id, label: l.label, url: l.url })) ?? [])
      setLoading(false)
    }
    load()
  }, [params.slug, router])

  const uploadCover = async (): Promise<string | null> => {
    if (!coverFile || !book) return null
    const supabase = createClient()
    if (!supabase) return null
    const ext  = coverFile.name.split('.').pop()
    const path = `books/${book.slug}-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('covers').upload(path, coverFile, { upsert: true })
    if (error) return null
    return supabase.storage.from('covers').getPublicUrl(path).data.publicUrl
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!book) return
    setSaving(true); setErr('')
    const supabase = createClient()
    if (!supabase) { setErr('خطأ في الاتصال'); setSaving(false); return }

    const coverUrl = await uploadCover()
    const updateData: Record<string, unknown> = {
      title: form.title.trim(), slug: form.slug.trim(), type: form.type,
      series: form.series.trim() || null, edition: form.edition.trim() || null,
      award: form.award.trim() || null, tagline: form.tagline.trim() || null,
      synopsis: form.synopsis.trim() || null, sort_order: parseInt(form.sort_order) || 0,
      published: form.published, updated_at: new Date().toISOString(),
    }
    if (coverUrl) updateData.cover_url = coverUrl

    const { error } = await supabase.from('books').update(updateData).eq('id', book.id)
    if (error) { setErr(error.message); setSaving(false); return }

    // Replace buy links
    await supabase.from('buy_links').delete().eq('book_id', book.id)
    const valid = buyLinks.filter((l) => l.label.trim() && l.url.trim())
    if (valid.length > 0) {
      await supabase.from('buy_links').insert(
        valid.map((l, i) => ({ book_id: book.id, label: l.label.trim(), url: l.url.trim(), sort_order: i }))
      )
    }

    showToast('تم الحفظ بنجاح ✓')
    setTimeout(() => setMsg(''), 2500)
    setSaving(false)
  }

  if (loading) {
    return <div className="min-h-screen bg-obsidian flex items-center justify-center"><p className="text-ink/50 font-tajawal">جاري التحميل...</p></div>
  }

  return (
    <div className="min-h-screen bg-obsidian p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/books" className="text-gold hover:text-ember text-sm font-tajawal flex items-center gap-1 mb-6">
          <ArrowRight size={14} /> العودة
        </Link>
        <h1 className="font-aref text-3xl text-gold mb-8">تعديل: {book?.title}</h1>

        <form onSubmit={handleSave} className="space-y-5">
          <Field label="العنوان *">
            <input value={form.title} onChange={(e) => set('title', e.target.value)} className={inp} required />
          </Field>
          <Field label="الـ Slug">
            <input value={form.slug} onChange={(e) => set('slug', e.target.value)} className={inp} dir="ltr" />
          </Field>
          <Field label="النوع">
            <select value={form.type} onChange={(e) => set('type', e.target.value)} className={inp}>
              <option value="رواية">رواية</option>
              <option value="مجموعة قصصية">مجموعة قصصية</option>
            </select>
          </Field>
          <Field label="السلسلة">
            <input value={form.series} onChange={(e) => set('series', e.target.value)} className={inp} placeholder="قلادة الشمس" />
          </Field>
          <Field label="الطبعة">
            <input value={form.edition} onChange={(e) => set('edition', e.target.value)} className={inp} />
          </Field>
          <Field label="جائزة / تقدير">
            <input value={form.award} onChange={(e) => set('award', e.target.value)} className={inp} />
          </Field>
          <Field label="Tagline">
            <input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} className={inp} />
          </Field>
          <Field label="الملخص">
            <textarea value={form.synopsis} onChange={(e) => set('synopsis', e.target.value)} className={`${inp} min-h-[120px] resize-y`} />
          </Field>
          <Field label="تغيير الغلاف (اختياري)">
            <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              className="w-full text-ink/70 font-tajawal text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-ember file:text-obsidian file:font-semibold file:cursor-pointer cursor-pointer" />
            {book?.cover_url && !coverFile && (
              <p className="text-ink/40 text-xs font-tajawal mt-1">الغلاف الحالي محفوظ</p>
            )}
          </Field>
          <Field label="ترتيب العرض">
            <input type="number" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} className={inp} min="0" />
          </Field>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="pub" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="w-4 h-4 accent-ember" />
            <label htmlFor="pub" className="text-ink font-tajawal text-sm cursor-pointer">منشور</label>
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
                  <button type="button" onClick={() => setBuyLinks((p) => p.filter((_, j) => j !== i))}
                    className="text-blood hover:text-blood/70 p-1"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setBuyLinks((p) => [...p, { label: '', url: '' }])}
              className="mt-2 flex items-center gap-1 text-gold hover:text-ember text-sm font-tajawal transition-colors">
              <Plus size={14} /> إضافة رابط
            </button>
          </div>

          {err && <p className="text-blood font-tajawal text-sm">{err}</p>}
          {msg && <p className="text-gold font-tajawal text-sm">{msg}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded bg-gold text-obsidian font-tajawal font-semibold hover:bg-gold/90 disabled:opacity-50 transition-colors">
              {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
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
