'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Calendar, X } from 'lucide-react'

interface Event {
  id: string; title: string; event_date: string; event_type: string; location: string | null
}

export function EventPulse() {
  const [event, setEvent] = useState<Event | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      if (!supabase) return
      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('events').select('id, title, event_date, event_type, location')
        .eq('published', true).gte('event_date', today)
        .order('event_date').limit(1).single()
      if (data) setEvent(data as Event)
    }
    fetch()
  }, [])

  // Hide on admin, events page, or if dismissed
  if (!event || dismissed || pathname.startsWith('/admin') || pathname === '/events') return null

  const daysLeft = Math.ceil((new Date(event.event_date).getTime() - Date.now()) / 86400000)
  const urgentLabel = daysLeft <= 0 ? 'اليوم!' : daysLeft === 1 ? 'غداً!' : daysLeft <= 7 ? `بعد ${daysLeft} أيام` : null

  return (
    <div className="fixed bottom-5 left-5 z-[90] flex items-end gap-3 animate-slideUp">
      {/* Pulse ring behind */}
      <Link href="/events" className="group relative">
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-2xl bg-ember/30 animate-ping-slow" />
        <span className="absolute inset-[-4px] rounded-2xl bg-ember/15 animate-ping-slower" />

        {/* Card */}
        <div className="relative bg-card border border-ember/40 rounded-2xl p-4 shadow-2xl shadow-ember/10 max-w-[260px] group-hover:border-ember transition-colors">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-ember/20 flex items-center justify-center shrink-0">
              <Calendar size={20} className="text-ember" />
            </div>

            <div className="flex-1 min-w-0">
              {urgentLabel && (
                <span className="inline-block px-2 py-0.5 bg-ember text-white text-[10px] font-tajawal font-bold rounded-md mb-1">
                  {urgentLabel}
                </span>
              )}
              <p className="font-tajawal font-semibold text-ink text-sm leading-snug line-clamp-2">{event.title}</p>
              <p className="text-ink/40 font-tajawal text-[11px] mt-0.5">
                {new Date(event.event_date).toLocaleDateString('ar-EG', { month: 'long', day: 'numeric' })}
                {event.location ? ` · ${event.location}` : ''}
              </p>
            </div>
          </div>

          <p className="text-ember font-tajawal text-xs mt-2 group-hover:text-gold transition-colors">
            اعرف أكثر ←
          </p>
        </div>
      </Link>

      {/* Close button */}
      <button onClick={() => setDismissed(true)}
        className="mb-1 p-1.5 rounded-full bg-obsidian-lighter text-ink/40 hover:text-ink transition-colors">
        <X size={14} />
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ping-slow {
          0% { opacity: 0.6; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.15); }
        }
        @keyframes ping-slower {
          0% { opacity: 0.4; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.25); }
        }
        .animate-slideUp { animation: slideUp 0.5s ease-out; }
        .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0,0,0.2,1) infinite; }
        .animate-ping-slower { animation: ping-slow 2s cubic-bezier(0,0,0.2,1) infinite 0.3s; }
      `}</style>
    </div>
  )
}
