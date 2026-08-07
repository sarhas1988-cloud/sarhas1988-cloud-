'use client'

import Image from 'next/image'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'

export function AboutSection() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section
      id="about"
      ref={ref}
      className={`py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-section-1 border-t border-gold-hairline relative transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-center">

          {/* Portrait */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-56 sm:w-72 md:w-full max-w-xs">
              <div className="card-lifted relative aspect-[3/4] sm:aspect-[2/3] overflow-hidden rounded-lg">
                <Image
                  src="/images/author.jpg"
                  alt="السيد الريس"
                  fill
                  className="object-cover"
                  style={{ filter: 'grayscale(0.3) sepia(0.2) brightness(0.85) contrast(1.05)' }}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-obsidian/60" />
              </div>
              <div className="absolute -inset-2 border border-gold/20 rounded-lg pointer-events-none" />
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="text-xs sm:text-base text-gold tracking-widest mb-3 font-tajawal uppercase">عن الكاتب</p>
            <h2 className="font-aref text-3xl sm:text-5xl text-ink mb-2">بين المعمل والظلام</h2>
            <p className="text-ember font-tajawal font-semibold text-sm sm:text-base mb-6">
              كاتب مصري · صيدلي إكلينيكي · محاضر في الصيدلة الإكلينيكية
            </p>

            <div className="space-y-4 text-ink/80 font-tajawal leading-relaxed text-sm sm:text-base">
              <p>
                <span className="text-ink font-semibold">السيد الريس</span> يكتب من التقاطع النادر بين العلم والرعب:
                صيدليٌّ إكلينيكيٌّ ومحاضر، يوظّف دقّة المعمل في نسج عوالم مظلمة عن الموت والطقوس والأساطير المصرية القديمة.
              </p>
              <p>
                صدر له عددٌ من الأعمال الروائية والقصصية، أبرزها سلسلة «قلادة الشمس»، ورواية «دائرة الخطايا» المستمدّة من أحداث واقعية.
              </p>
            </div>

            <blockquote className="mt-6 border-r-4 border-gold pr-4 sm:pr-6 py-3 font-aref text-lg sm:text-2xl text-ember leading-relaxed">
              «يقال أحياناً إن الإنسان حيوانٌ كاسر — إلا أن في هذا القول إهانةً للحيوانات.»
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
