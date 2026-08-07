import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import type { Post } from '@/types/supabase'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('posts').select('title,excerpt').eq('slug', params.slug).single()
    if (!data) return {}
    return { title: `${data.title} — السيد الريس`, description: data.excerpt ?? '' }
  } catch { return {} }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!data) notFound()
  const post = data as Post

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return (
    <main className="bg-obsidian text-ink min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-ember hover:text-gold transition-colors mb-8 font-tajawal font-semibold">
          <span>←</span><span>المدونة</span>
        </Link>

        {date && <p className="text-ink/40 font-tajawal text-sm mb-4">{date}</p>}
        <h1 className="font-aref text-3xl sm:text-5xl text-ink mb-8 leading-snug">{post.title}</h1>

        {post.cover_url && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-obsidian-lighter mb-10">
            <Image src={post.cover_url} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        {post.body && (
          <article className="space-y-5 text-ink/80 font-tajawal leading-relaxed text-base sm:text-lg">
            {post.body.split('\n').filter(Boolean).map((line, i) => {
              if (line.startsWith('# '))  return <h2 key={i} className="font-aref text-3xl text-ink mt-8 mb-3">{line.slice(2)}</h2>
              if (line.startsWith('## ')) return <h3 key={i} className="font-aref text-2xl text-ink mt-6 mb-2">{line.slice(3)}</h3>
              if (line.startsWith('- '))  return <li  key={i} className="list-disc list-inside text-ink/80">{line.slice(2)}</li>
              return <p key={i} className="text-ink/80">{line}</p>
            })}
          </article>
        )}

        <div className="border-t border-obsidian-lighter mt-14 pt-10 text-center">
          <Link href="/blog" className="inline-block bg-ember text-obsidian px-8 py-3 rounded font-tajawal font-semibold hover:bg-ember/90 transition-colors">
            عودة للمدونة
          </Link>
        </div>
      </div>
    </main>
  )
}
