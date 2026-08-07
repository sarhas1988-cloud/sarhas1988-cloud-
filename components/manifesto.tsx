'use client'

import { useScrollReveal } from '@/hooks/use-scroll-reveal'

export function Manifesto() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section
      ref={ref}
      className={`py-14 sm:py-24 px-5 sm:px-8 border-t border-gold-hairline relative transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ backgroundColor: '#100B07' }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <blockquote className="font-aref text-xl sm:text-3xl lg:text-4xl text-ink leading-relaxed mb-10 sm:mb-14">
          إنهم مَن يستترون خلف الظلام.
          <span className="text-ember"> من الموت </span>
          يستمدّون حياتهم.
        </blockquote>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'روايات',        value: '٥' },
            { label: 'مجموعات قصصية', value: '٢' },
            { label: 'عالم واحد',      value: '١' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="font-aref text-2xl sm:text-4xl text-ember mb-1">{s.value}</p>
              <p className="text-ink/60 font-tajawal text-xs sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
