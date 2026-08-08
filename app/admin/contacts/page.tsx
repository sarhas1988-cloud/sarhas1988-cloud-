'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Trash2, ArrowRight, Mail, MailOpen } from 'lucide-react'

interface Contact {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  created_at: string
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false })
      setContacts((data as Contact[]) ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  const toggleRead = async (id: string, current: boolean) => {
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('contacts').update({ read: !current }).eq('id', id)
    setContacts((prev) => prev.map((c) => c.id === id ? { ...c, read: !current } : c))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذه الرسالة؟')) return
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('contacts').delete().eq('id', id)
    setContacts((prev) => prev.filter((c) => c.id !== id))
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
  const unread = contacts.filter((c) => !c.read).length

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/admin/dashboard" className="text-gold hover:text-ember text-sm font-tajawal flex items-center gap-1 mb-2">
          <ArrowRight size={14} /> العودة
        </Link>
        <h1 className="font-aref text-3xl text-ember mb-1">الرسائل</h1>
        {unread > 0 && <p className="text-gold font-tajawal text-sm mb-6">{unread} رسالة غير مقروءة</p>}

        {loading ? (
          <p className="text-ink/50 font-tajawal text-center py-12">جاري التحميل...</p>
        ) : contacts.length === 0 ? (
          <div className="card-lifted rounded-lg p-10 text-center">
            <p className="text-ink/50 font-tajawal">لا توجد رسائل</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((c) => (
              <div key={c.id} className={`card-lifted rounded-lg p-4 transition-all ${!c.read ? 'border-gold/30' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-tajawal font-semibold text-ink text-sm">{c.name}</p>
                      <span className="text-ink/30">·</span>
                      <a href={`mailto:${c.email}`} className="text-ember font-tajawal text-xs hover:text-gold">{c.email}</a>
                    </div>
                    <p className="text-ink/60 font-tajawal text-sm leading-relaxed">{c.message}</p>
                    <p className="text-ink/30 font-tajawal text-xs mt-2">{fmt(c.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => toggleRead(c.id, c.read)} title={c.read ? 'غير مقروء' : 'مقروء'}
                      className={`p-2 rounded hover:bg-obsidian-lighter transition-colors ${c.read ? 'text-ink/30' : 'text-gold'}`}>
                      {c.read ? <MailOpen size={18} /> : <Mail size={18} />}
                    </button>
                    <button onClick={() => handleDelete(c.id)}
                      className="p-2 rounded hover:bg-obsidian-lighter text-blood transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                {!c.read && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-gold/15 text-gold text-xs font-tajawal rounded">جديدة</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
