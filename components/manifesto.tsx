'use client'

import { useScrollReveal } from '@/hooks/use-scroll-reveal'
import { useCounter } from '@/hooks/use-counter'

function AnimatedStat({ target, label, arabicNum }: { target: number; label: string; arabicNum: string }) {
  const { count, ref } = useCounter(target, 1200)
  const arabicNums = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩']
  const display = count > 0 ? String(count).split('').map(d => arabicNums[parseInt(d)]).join('') : arabicNum

  return (
    <div ref={ref} className="text-center">
      <p className="font-aref text-3xl sm:text-5xl text-ember mb-1 tabular-nums">{display}</p>
      <p className="text-ink/60 font-tajawal text-xs sm:text-sm">{label}</p>
    </div>
  )
}

export function Manifesto() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section
      ref={ref}
      className={`py-14 sm:py-24 px-5 sm:px-8 border-t border-gold-hairline relative transition-all duration-700 bg-section-2 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-3xl mx-auto text-center">
        <blockquote className="font-aref text-xl sm:text-3xl lg:text-4xl text-ink leading-relaxed mb-10 sm:mb-14">
          إنهم مَن يستترون خلف الظلام.
          <span className="text-ember"> من الموت </span>
          يستمدّون حياتهم.
        </blockquote>

        <div className="grid grid-cols-3 gap-4">
          <AnimatedStat target={5} label="روايات" arabicNum="٥" />
          <AnimatedStat target={2} label="مجموعات قصصية" arabicNum="٢" />
          <AnimatedStat target={1} label="عالم واحد" arabicNum="١" />
        </div>
      </div>
    </section>
  )
}
