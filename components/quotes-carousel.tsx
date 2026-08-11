'use client'

import { useState, useEffect, useCallback } from 'react'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'
import { createClient } from '@/utils/supabase/client'
import { Quote } from 'lucide-react'

interface QuoteItem {
  id: string
  text: string
  book_title: string | null
}

export function QuotesCarousel() {
  const { ref, isVisible } = useScrollReveal()
  const [quotes, setQuotes] = useState<QuoteItem[]>([])
  const [current, setCurrent] = useState(0)
  const [fade, setFade] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase
        .from('quotes')
        .select('id, text, book_title')
        .eq('published', true)
        .order('sort_order')
      setQuotes((data as QuoteItem[]) ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  const next = useCallback(() => {
    if (quotes.length <= 1) return
    setFade(false)
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % quotes.length)
      setFade(true)
    }, 400)
  }, [quotes.length])

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (quotes.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, quotes.length])

  if (loading || quotes.length === 0) return null

  const q = quotes[current]

  return (
    <section
      ref={ref}
      className={`py-14 sm:py-20 px-5 sm:px-8 bg-section-1 border-t border-gold-hairline relative overflow-hidden transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-3xl mx-auto text-center relative">
        {/* Quote icon */}
        <Quote size={36} className="text-ember/20 mx-auto mb-6" />

        {/* Quote text */}
        <div className={`transition-all duration-400 min-h-[120px] flex flex-col items-center justify-center ${
          fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}>
          <blockquote className="font-aref text-xl sm:text-3xl lg:text-4xl text-ink leading-relaxed mb-4">
            «{q.text}»
          </blockquote>
          {q.book_title && (
            <p className="text-ember font-tajawal text-sm font-semibold">
              — {q.book_title}
            </p>
          )}
        </div>

        {/* Dots */}
        {quotes.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {quotes.map((_, i) => (
              <button
                key={i}
                onClick={() => { setFade(false); setTimeout(() => { setCurrent(i); setFade(true) }, 400) }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-ember w-6' : 'bg-ink/20 hover:bg-ink/40'
                }`}
                aria-label={`اقتباس ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .duration-400 { transition-duration: 400ms; }
      `}</style>
    </section>
  )
}
