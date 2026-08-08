'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Plus, Pencil, Trash2, ArrowRight, Eye, EyeOff, Calendar } from 'lucide-react'

interface Event {
  id: string; title: string; event_date: string; event_type: string
  location: string | null; published: boolean
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false })
      setEvents((data as Event[]) ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`حذف "${title}"؟`)) return
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('events').delete().eq('id', id)
    setEvents((prev) => prev.filter((e) => e.id !== id))
    setMsg('تم الحذف'); setTimeout(() => setMsg(''), 2500)
  }

  const togglePublished = async (event: Event) => {
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('events').update({ published: !event.published }).eq('id', event.id)
    setEvents((prev) => prev.map((e) => e.id === event.id ? { ...e, published: !event.published } : e))
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin/dashboard" className="text-gold hover:text-ember text-sm font-tajawal flex items-center gap-1 mb-2">
              <ArrowRight size={14} /> العودة
            </Link>
            <h1 className="font-aref text-3xl text-ember">الفعاليات</h1>
          </div>
          <Link href="/admin/events/new" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ember text-white font-tajawal font-semibold text-sm hover:bg-ember/90 transition-colors">
            <Plus size={16} /> إضافة فعالية
          </Link>
        </div>

        {msg && <p className="mb-4 text-center text-sm font-tajawal text-gold">{msg}</p>}

        {loading ? (
          <p className="text-ink/50 font-tajawal text-center py-12">جاري التحميل...</p>
        ) : events.length === 0 ? (
          <div className="card-lifted rounded-lg p-10 text-center">
            <p className="text-ink/50 font-tajawal mb-4">لا توجد فعاليات بعد</p>
            <Link href="/admin/events/new" className="text-ember hover:text-gold font-tajawal text-sm">أضف أول فعالية →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="card-lifted rounded-lg p-4 flex items-center justify-between gap-4 hover:border-gold/30 transition-all">
                <div className="flex-1 min-w-0">
                  <h3 className="font-aref text-lg text-ink truncate">{event.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Calendar size={12} className="text-ink/40" />
                    <p className="text-ink/50 font-tajawal text-xs">{fmt(event.event_date)} · {event.event_type}</p>
                    {event.location && <p className="text-ink/40 font-tajawal text-xs">· {event.location}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => togglePublished(event)} title={event.published ? 'إخفاء' : 'نشر'}
                    className={`p-2 rounded hover:bg-obsidian-lighter transition-colors ${event.published ? 'text-gold' : 'text-ink/30'}`}>
                    {event.published ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <Link href={`/admin/events/${event.id}`}
                    className="p-2 rounded hover:bg-obsidian-lighter text-gold hover:text-ember transition-colors">
                    <Pencil size={18} />
                  </Link>
                  <button onClick={() => handleDelete(event.id, event.title)}
                    className="p-2 rounded hover:bg-obsidian-lighter text-blood transition-colors">
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
