import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/types/supabase'

interface Props {
  post: Pick<Post, 'slug' | 'title' | 'excerpt' | 'cover_url' | 'published_at'>
}

export function BlogCard({ post }: Props) {
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('ar-EG', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : ''

  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="group card-lifted rounded-lg overflow-hidden hover:border-gold transition-all duration-300 cursor-pointer h-full flex flex-col">
        {/* Cover */}
        <div className="relative aspect-video overflow-hidden">
          {post.cover_url ? (
            <Image
              src={post.cover_url} alt={post.title} fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-obsidian-lighter to-obsidian flex items-center justify-center">
              <p className="font-aref text-ink/30 text-2xl">✦</p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {date && <p className="text-ink/40 font-tajawal text-xs mb-3">{date}</p>}
          <h3 className="font-aref text-xl text-ink group-hover:text-ember transition-colors mb-2 line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-ink/60 font-tajawal text-sm leading-relaxed line-clamp-3 flex-1">
              {post.excerpt}
            </p>
          )}
          <p className="text-ember font-tajawal text-sm mt-4">اقرأ المزيد ←</p>
        </div>
      </article>
    </Link>
  )
}
