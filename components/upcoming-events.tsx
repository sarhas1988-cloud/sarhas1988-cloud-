'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'
import { createClient } from '@/utils/supabase/client'
import { MapPin, Calendar, Clock } from 'lucide-react'

interface Event {
  id: string; title: string; description: string | null; location: string | null
  event_date: string; event_time: string | null; event_type: string
  cover_url: string | null
}

export function UpcomingEvents() {
  const { ref, isVisible } = useScrollReveal()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      if (!supabase) return
      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('events').select('*').eq('published', true)
        .gte('event_date', today).order('event_date').limit(2)
      setEvents((data as Event[]) ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  // Don't show section if no upcoming events
  if (!loading && events.length === 0) return null

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ar-EG', { weekday: 'long', month: 'long', day: 'numeric' })

  const typeColors: Record<string, string> = {
    'معرض كتاب': 'bg-ember/15 text-ember',
    'حفل توقيع': 'bg-gold/15 text-gold',
    'ندوة': 'bg-blood/15 text-blood',
    'أخرى': 'bg-ink/10 text-ink/60',
  }

  return (
    <section
      ref={ref}
      className={`py-14 sm:py-24 px-5 sm:px-8 bg-section-1 border-t border-gold-hairline relative transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <p className="text-xs text-gold tracking-widest mb-2 font-tajawal">لا تفوّتك</p>
            <h2 className="font-aref text-3xl sm:text-4xl text-ink">فعاليات قادمة</h2>
          </div>
          <Link href="/events" className="text-ember hover:text-gold font-tajawal text-sm font-semibold transition-colors">
            كل الفعاليات ←
          </Link>
        </div>

        {loading ? (
          <p className="text-ink/40 font-tajawal text-center py-10">جاري التحميل...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {events.map((event, i) => (
              <Link key={event.id} href="/events">
                <div className={`card-lifted rounded-xl overflow-hidden group hover:border-ember/30 transition-all duration-500 cursor-pointer ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`} style={{ transitionDelay: `${i * 150}ms` }}>

                  {event.cover_url && (
                    <div className="relative aspect-[2.5/1] overflow-hidden">
                      <Image src={event.cover_url} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    </div>
                  )}

                  <div className="p-5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-tajawal font-semibold mb-3 ${typeColors[event.event_type] ?? typeColors['أخرى']}`}>
                      {event.event_type}
                    </span>

                    <h3 className="font-aref text-xl text-ink group-hover:text-ember transition-colors mb-3">{event.title}</h3>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-ink/50 font-tajawal text-sm">
                        <Calendar size={14} className="shrink-0 text-ember" />
                        {fmtDate(event.event_date)}
                      </div>
                      {event.event_time && (
                        <div className="flex items-center gap-2 text-ink/50 font-tajawal text-sm">
                          <Clock size={14} className="shrink-0 text-ember" />
                          {event.event_time}
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-2 text-ink/50 font-tajawal text-sm">
                          <MapPin size={14} className="shrink-0 text-ember" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
