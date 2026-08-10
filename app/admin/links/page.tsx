import { showToast } from '@/lib/toast'
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Plus, Trash2, ArrowRight, Save, Globe, ShoppingBag } from 'lucide-react'

interface SiteLink {
  id: string; category: string; label: string; url: string; sort_order: number; published: boolean
}

export default function AdminLinksPage() {
  const [links, setLinks] = useState<SiteLink[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [newLink, setNewLink] = useState({ category: 'social', label: '', url: '' })

  useEffect(() => { fetchLinks() }, [])

  const fetchLinks = async () => {
    const supabase = createClient()
    if (!supabase) return
    const { data } = await supabase.from('site_links').select('*').order('category').order('sort_order')
    setLinks((data as SiteLink[]) ?? [])
    setLoading(false)
  }

  const handleAdd = async () => {
    if (!newLink.label.trim() || !newLink.url.trim()) { setMsg('الاسم والرابط مطلوبين'); return }
    const supabase = createClient()
    if (!supabase) return
    const maxOrder = links.filter((l) => l.category === newLink.category).length
    const { error } = await supabase.from('site_links').insert({
      category: newLink.category, label: newLink.label.trim(),
      url: newLink.url.trim(), sort_order: maxOrder + 1, published: true,
    })
    if (error) { setMsg(error.message); return }
    setNewLink({ category: 'social', label: '', url: '' })
    fetchLinks()
    showToast('تمت الإضافة ✓'); setTimeout(() => setMsg(''), 2500)
  }

  const handleUpdate = async (id: string, field: string, value: string) => {
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('site_links').update({ [field]: value }).eq('id', id)
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, [field]: value } : l))
  }

  const handleSaveUrl = async (id: string, url: string) => {
    await handleUpdate(id, 'url', url)
    showToast('تم الحفظ بنجاح ✓'); setTimeout(() => setMsg(''), 2500)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذا الرابط؟')) return
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('site_links').delete().eq('id', id)
    setLinks((prev) => prev.filter((l) => l.id !== id))
    showToast('تم الحذف بنجاح'); setTimeout(() => setMsg(''), 2500)
  }

  const socialLinks = links.filter((l) => l.category === 'social')
  const storeLinks = links.filter((l) => l.category === 'store')

  const inp = 'w-full px-3 py-2 bg-obsidian border border-gold-hairline focus:border-ember outline-none rounded-lg font-tajawal text-ink placeholder:text-ink/30 text-sm transition-colors'

  const LinkRow = ({ link }: { link: SiteLink }) => {
    const [url, setUrl] = useState(link.url)
    return (
      <div className="flex items-center gap-2 mb-2">
        <span className="text-ink font-tajawal text-sm w-24 shrink-0">{link.label}</span>
        <input value={url} onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..." dir="ltr" className={`${inp} flex-1`} />
        <button onClick={() => handleSaveUrl(link.id, url)}
          className="p-2 rounded-lg hover:bg-obsidian-lighter text-gold hover:text-ember transition-colors" title="حفظ">
          <Save size={16} />
        </button>
        <button onClick={() => handleDelete(link.id)}
          className="p-2 rounded-lg hover:bg-obsidian-lighter text-blood transition-colors" title="حذف">
          <Trash2 size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/dashboard" className="text-gold hover:text-ember text-sm font-tajawal flex items-center gap-1 mb-2">
          <ArrowRight size={14} /> العودة
        </Link>
        <h1 className="font-aref text-3xl text-ember mb-8">إدارة الروابط</h1>

        {msg && <p className="mb-4 text-center text-sm font-tajawal text-gold">{msg}</p>}

        {loading ? (
          <p className="text-ink/50 font-tajawal text-center py-12">جاري التحميل...</p>
        ) : (
          <>
            {/* Social Links */}
            <div className="card-lifted rounded-xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe size={20} className="text-gold" />
                <h2 className="font-aref text-xl text-ink">روابط السوشيال ميديا</h2>
              </div>
              {socialLinks.map((l) => <LinkRow key={l.id} link={l} />)}
              {socialLinks.length === 0 && <p className="text-ink/40 font-tajawal text-sm">لا توجد روابط</p>}
            </div>

            {/* Store Links */}
            <div className="card-lifted rounded-xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag size={20} className="text-ember" />
                <h2 className="font-aref text-xl text-ink">روابط الشراء</h2>
              </div>
              {storeLinks.map((l) => <LinkRow key={l.id} link={l} />)}
              {storeLinks.length === 0 && <p className="text-ink/40 font-tajawal text-sm">لا توجد روابط</p>}
            </div>

            {/* Add new link */}
            <div className="card-lifted rounded-xl p-5">
              <h2 className="font-aref text-xl text-ink mb-4">إضافة رابط جديد</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <select value={newLink.category} onChange={(e) => setNewLink((p) => ({ ...p, category: e.target.value }))}
                  className={`${inp} sm:w-32`}>
                  <option value="social">سوشيال</option>
                  <option value="store">شراء</option>
                </select>
                <input value={newLink.label} onChange={(e) => setNewLink((p) => ({ ...p, label: e.target.value }))}
                  placeholder="الاسم (مثلاً: يوتيوب)" className={`${inp} sm:flex-1`} />
                <input value={newLink.url} onChange={(e) => setNewLink((p) => ({ ...p, url: e.target.value }))}
                  placeholder="https://..." dir="ltr" className={`${inp} sm:flex-1`} />
                <button onClick={handleAdd}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-ember text-white rounded-lg font-tajawal font-semibold text-sm hover:bg-ember/90 transition-colors shrink-0">
                  <Plus size={16} /> إضافة
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
