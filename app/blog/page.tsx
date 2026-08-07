'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { BlogCard } from '@/components/blog-card'
import type { Post } from '@/types/supabase'

export default function BlogPage() {
  const [posts, setPosts]     = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const supabase = createClient()
        if (!supabase) return
        const { data } = await supabase
          .from('posts')
          .select('id,slug,title,excerpt,cover_url,published_at')
          .eq('published', true)
          .order('published_at', { ascending: false })
        setPosts((data as Post[]) ?? [])
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (
    <main className="bg-obsidian text-ink min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="font-aref text-4xl sm:text-6xl text-ink mb-4">المدونة</h1>
          <p className="text-lg text-ink/70 font-tajawal">تأملات وأفكار حول الكتابة والأدب والأساطير المصرية</p>
        </div>

        {loading ? (
          <p className="text-center text-ink/50 font-tajawal py-20">جاري التحميل...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-ink/50 font-tajawal mb-4">لا توجد مقالات منشورة بعد</p>
            <Link href="/" className="text-ember hover:text-gold transition-colors font-tajawal">العودة للرئيسية →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
          </div>
        )}
      </div>
    </main>
  )
}
