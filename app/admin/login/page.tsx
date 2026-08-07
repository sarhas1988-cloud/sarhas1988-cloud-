'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!supabase) {
        setError('لم يتم تكوين Supabase. يرجى إضافة متغيرات البيئة.')
        return
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/admin/dashboard')
      }
    } catch (err) {
      setError('حدث خطأ ما. يرجى المحاولة مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card-lifted rounded-lg p-8">
          <h1 className="font-aref text-3xl text-center text-ember mb-2">
            السيد الريس
          </h1>
          <p className="text-center text-ink/60 font-tajawal text-sm mb-8">
            لوحة التحكم
          </p>

          {!supabase && (
            <div className="mb-6 p-4 bg-blood/10 border border-blood/30 rounded text-center">
              <p className="text-ink/70 font-tajawal text-sm">
                لم يتم تكوين Supabase. يرجى إضافة متغيرات البيئة:
              </p>
              <code className="block text-xs mt-2 text-ember font-mono">
                NEXT_PUBLIC_SUPABASE_URL<br/>
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-tajawal text-sm text-ink mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded bg-obsidian-lighter border border-gold-subtle text-ink font-tajawal focus:outline-none focus:border-ember transition-colors"
                required
              />
            </div>

            <div>
              <label className="block font-tajawal text-sm text-ink mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded bg-obsidian-lighter border border-gold-subtle text-ink font-tajawal focus:outline-none focus:border-ember transition-colors"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded bg-blood/10 border border-blood text-blood text-sm font-tajawal">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded bg-ember text-obsidian font-tajawal font-semibold hover:bg-ember/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'جاري الدخول...' : 'دخول'}
            </button>
          </form>

          <p className="text-center text-ink/50 font-tajawal text-xs mt-6">
            هذه الصفحة محمية. تواصل مع الإدارة للحصول على بيانات الدخول.
          </p>
        </div>
      </div>
    </div>
  )
}
