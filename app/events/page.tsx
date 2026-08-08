'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { MapPin, Calendar, Clock, ExternalLink } from 'lucide-react'

interface Event {
  id: string; title: string; description: string | null; location: string | null
  event_date: string; event_time: string | null; event_type: string
  cover_url: string | null; link: string | null; published: boolean; created_at: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase
        .from('events').select('*').eq('published', true)
        .order('event_date', { ascending: true })
      setEvents((data as Event[]) ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  const now = new Date().toISOString().split('T')[0]
  const upcoming = events.filter((e) => e.event_date >= now)
  const past = events.filter((e) => e.event_date < now).reverse()

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })

  const typeColors: Record<string, string> = {
    'معرض كتاب': 'bg-ember/15 text-ember',
    'حفل توقيع': 'bg-gold/15 text-gold',
    'ندوة': 'bg-blood/15 text-blood',
    'أخرى': 'bg-ink/10 text-ink/60',
  }

  const EventCard = ({ event, isPast }: { event: Event; isPast?: boolean }) => (
    <div className={`card-lifted rounded-xl overflow-hidden transition-all hover:border-ember/30 ${isPast ? 'opacity-60' : ''}`}>
      {event.cover_url && (
        <div className="relative aspect-video overflow-hidden">
          <Image src={event.cover_url} alt={event.title} fill className="object-cover" />
          {isPast && (
            <div className="absolute inset-0 bg-obsidian/50 flex items-center justify-center">
              <span className="bg-obsidian/80 text-ink/70 px-4 py-1.5 rounded-lg font-tajawal text-sm">انتهت</span>
            </div>
          )}
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-tajawal font-semibold ${typeColors[event.event_type] ?? typeColors['أخرى']}`}>
            {event.event_type}
          </span>
          {isPast && <span className="text-ink/30 text-xs font-tajawal">فعالية سابقة</span>}
        </div>

        <h3 className="font-aref text-xl sm:text-2xl text-ink mb-2">{event.title}</h3>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-ink/60 font-tajawal text-sm">
            <Calendar size={14} className="shrink-0 text-ember" />
            {fmtDate(event.event_date)}
          </div>
          {event.event_time && (
            <div className="flex items-center gap-2 text-ink/60 font-tajawal text-sm">
              <Clock size={14} className="shrink-0 text-ember" />
              {event.event_time}
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2 text-ink/60 font-tajawal text-sm">
              <MapPin size={14} className="shrink-0 text-ember" />
              {event.location}
            </div>
          )}
        </div>

        {event.description && (
          <p className="text-ink/50 font-tajawal text-sm leading-relaxed mb-4 line-clamp-3">{event.description}</p>
        )}

        {event.link && !isPast && (
          <a href={event.link} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-ember text-white px-5 py-2 rounded-lg font-tajawal font-semibold text-sm hover:bg-ember/90 transition-colors">
            <ExternalLink size={14} /> تفاصيل أكثر
          </a>
        )}
      </div>
    </div>
  )

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <h1 className="font-aref text-4xl sm:text-5xl text-ink mb-3">الفعاليات</h1>
          <p className="text-ink/60 font-tajawal text-sm sm:text-base">معارض الكتاب، حفلات التوقيع، والندوات</p>
        </div>

        {loading ? (
          <p className="text-ink/40 font-tajawal text-center py-16">جاري التحميل...</p>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-ink/40 font-tajawal mb-2">لا توجد فعاليات حالياً</p>
            <p className="text-ink/30 font-tajawal text-sm">تابعنا لمعرفة الفعاليات القادمة</p>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="mb-14">
                <h2 className="font-aref text-2xl text-ember mb-6">فعاليات قادمة</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{upcoming.map((e) => <EventCard key={e.id} event={e} />)}</div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <h2 className="font-aref text-2xl text-ink/60 mb-6">فعاليات سابقة</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{past.map((e) => <EventCard key={e.id} event={e} isPast />)}</div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
