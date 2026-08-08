'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, X, BookOpen, FileText } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface Result {
  type: 'book' | 'post'
  slug: string
  title: string
  subtitle?: string
}

export function SearchButton() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(true) }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-2 text-ink/60 hover:text-ember transition-colors" aria-label="بحث">
        <Search size={18} />
      </button>
      {open && <SearchModal onClose={() => setOpen(false)} />}
    </>
  )
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        if (!supabase) return
        const q = query.trim()
        const [booksRes, postsRes] = await Promise.all([
          supabase.from('books').select('slug, title, type, series').eq('published', true).or(`title.ilike.%${q}%,series.ilike.%${q}%,tagline.ilike.%${q}%`).limit(5),
          supabase.from('posts').select('slug, title, excerpt').eq('published', true).or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`).limit(5),
        ])
        const r: Result[] = [
          ...(booksRes.data ?? []).map((b: { slug: string; title: string; type: string; series: string | null }) => ({
            type: 'book' as const, slug: b.slug, title: b.title, subtitle: b.series ?? b.type,
          })),
          ...(postsRes.data ?? []).map((p: { slug: string; title: string; excerpt: string | null }) => ({
            type: 'post' as const, slug: p.slug, title: p.title, subtitle: p.excerpt?.slice(0, 60) ?? '',
          })),
        ]
        setResults(r)
      } finally { setLoading(false) }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 sm:pt-32 px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-card border border-gold-subtle rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gold-hairline">
          <Search size={20} className="text-ink/40 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن كتاب أو مقالة..."
            className="flex-1 bg-transparent text-ink font-tajawal outline-none placeholder:text-ink/30"
          />
          <button onClick={onClose} className="text-ink/40 hover:text-ink transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {loading && (
            <p className="text-ink/40 font-tajawal text-sm text-center py-8">جاري البحث...</p>
          )}
          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <p className="text-ink/40 font-tajawal text-sm text-center py-8">لا توجد نتائج</p>
          )}
          {results.map((r) => (
            <Link
              key={`${r.type}-${r.slug}`}
              href={r.type === 'book' ? `/books/${r.slug}` : `/blog/${r.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 px-5 py-3 hover:bg-obsidian-warm transition-colors"
            >
              <span className="w-8 h-8 rounded-lg bg-ember/10 flex items-center justify-center shrink-0">
                {r.type === 'book' ? <BookOpen size={16} className="text-ember" /> : <FileText size={16} className="text-gold" />}
              </span>
              <div className="min-w-0">
                <p className="font-tajawal font-semibold text-ink text-sm truncate">{r.title}</p>
                {r.subtitle && <p className="text-ink/40 font-tajawal text-xs truncate">{r.subtitle}</p>}
              </div>
            </Link>
          ))}
        </div>

        {/* Hint */}
        <div className="px-5 py-2.5 border-t border-gold-hairline text-ink/30 font-tajawal text-xs flex items-center gap-4">
          <span>ESC للإغلاق</span>
          <span>Ctrl+K للبحث السريع</span>
        </div>
      </div>
    </div>
  )
}
