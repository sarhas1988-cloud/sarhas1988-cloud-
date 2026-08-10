import { showToast } from '@/lib/toast'
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Plus, Pencil, Trash2, ArrowRight, Eye, EyeOff } from 'lucide-react'
import type { Post } from '@/types/supabase'

export default function AdminPostsPage() {
  const [posts, setPosts]     = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg]         = useState('')

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    const supabase = createClient()
    if (!supabase) return
    const { data } = await supabase.from('posts').select('*').order('published_at', { ascending: false })
    setPosts((data as Post[]) ?? [])
    setLoading(false)
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`حذف "${title}"؟`)) return
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('posts').delete().eq('id', id)
    setPosts((prev) => prev.filter((p) => p.id !== id))
    showToast('تم الحذف بنجاح'); setTimeout(() => setMsg(''), 2500)
  }

  const togglePublished = async (post: Post) => {
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('posts').update({ published: !post.published }).eq('id', post.id)
    setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, published: !p.published } : p))
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString('ar-EG')

  return (
    <div className="min-h-screen bg-obsidian p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin/dashboard" className="text-gold hover:text-ember text-sm font-tajawal flex items-center gap-1 mb-2">
              <ArrowRight size={14} /> العودة
            </Link>
            <h1 className="font-aref text-3xl text-gold">المدونة</h1>
          </div>
          <Link href="/admin/posts/new" className="flex items-center gap-2 px-4 py-2 rounded bg-gold text-obsidian font-tajawal font-semibold text-sm hover:bg-gold/90 transition-colors">
            <Plus size={16} /> إضافة مقالة
          </Link>
        </div>

        {msg && <p className="mb-4 text-center text-sm font-tajawal text-gold">{msg}</p>}

        {loading ? (
          <p className="text-ink/50 font-tajawal text-center py-12">جاري التحميل...</p>
        ) : posts.length === 0 ? (
          <div className="card-lifted rounded-lg p-10 text-center">
            <p className="text-ink/50 font-tajawal mb-4">لا توجد مقالات بعد</p>
            <Link href="/admin/posts/new" className="text-gold hover:text-ember font-tajawal text-sm">أضف أول مقالة →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="card-lifted rounded-lg p-4 flex items-center justify-between gap-4 hover:border-gold/30 transition-all">
                <div className="flex-1 min-w-0">
                  <h3 className="font-aref text-lg text-ink truncate">{post.title}</h3>
                  <p className="text-ink/40 font-tajawal text-xs mt-0.5">{fmt(post.published_at)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => togglePublished(post)} title={post.published ? 'إخفاء' : 'نشر'}
                    className={`p-2 rounded hover:bg-obsidian-lighter transition-colors ${post.published ? 'text-gold' : 'text-ink/30'}`}>
                    {post.published ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <Link href={`/admin/posts/${post.slug}`}
                    className="p-2 rounded hover:bg-obsidian-lighter text-gold hover:text-ember transition-colors">
                    <Pencil size={18} />
                  </Link>
                  <button onClick={() => handleDelete(post.id, post.title)}
                    className="p-2 rounded hover:bg-obsidian-lighter text-blood hover:text-blood/70 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
