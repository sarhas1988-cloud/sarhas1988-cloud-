'use client'

import { useScrollReveal } from '@/hooks/use-scroll-reveal'

export function Manifesto() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section
      ref={ref}
      className={`py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-section-2 border-t border-gold-hairline relative transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Quote — 2xl on mobile, 4xl sm, 5xl lg */}
        <div className="border-b-4 sm:border-b-0 sm:border-r-4 border-gold pb-6 sm:pb-0 sm:pr-8 mb-10 sm:mb-14">
          <blockquote className="font-aref text-2xl sm:text-4xl lg:text-5xl text-ink leading-snug">
            إنهم مَن يستترون خلف الظلام. من الموت يستمدّون حياتهم.
          </blockquote>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {[
            { label: 'روايات',            value: '٥' },
            { label: 'مجموعات قصصية',     value: '٢' },
            { label: 'عالم واحد',          value: '١' },
          ].map((stat, i) => (
            <div key={i} className="text-center" style={{ transitionDelay: isVisible ? `${i * 100}ms` : '0ms' }}>
              <p className="font-aref text-2xl sm:text-4xl text-ember mb-1 sm:mb-2">{stat.value}</p>
              <p className="text-ink/70 font-tajawal text-xs sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
