import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'عن الكاتب — السيد الريس',
  description: 'تعرف على السيد الريس، كاتب الرعب النفسي والجريمة والأساطير المصرية',
}

export default function AboutPage() {
  return (
    <main className="bg-obsidian text-ink min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="font-aref text-4xl sm:text-6xl text-ink mb-4">عن الكاتب</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-14 items-start">
          {/* Portrait */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-56 sm:w-72 lg:w-full max-w-xs">
              <div className="card-lifted relative aspect-[2/3] rounded-lg overflow-hidden">
                <Image
                  src="/images/author.jpg"
                  alt="السيد الريس"
                  fill
                  className="object-cover"
                  style={{ filter: 'grayscale(0.3) sepia(0.2) brightness(0.85) contrast(1.05)' }}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-obsidian/50" />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h2 className="font-aref text-3xl sm:text-4xl text-ink mb-1">السيد الريس</h2>
              <p className="text-ember font-tajawal font-semibold text-sm sm:text-base">
                كاتب مصري · صيدلي إكلينيكي · محاضر في الصيدلة الإكلينيكية
              </p>
            </div>

            <div className="space-y-4 text-ink/80 font-tajawal leading-relaxed text-sm sm:text-base">
              <p>
                <span className="text-ink font-semibold">السيد الريس</span> يكتب من التقاطع النادر بين العلم والرعب:
                صيدليٌّ إكلينيكيٌّ ومحاضر، يوظّف دقّة المعمل في نسج عوالم مظلمة عن الموت والطقوس والأساطير المصرية القديمة.
              </p>
              <p>
                صدر له عددٌ من الأعمال الروائية والقصصية، أبرزها سلسلة «قلادة الشمس»، ورواية «دائرة الخطايا» المستمدّة من أحداث واقعية.
              </p>
              <p>
                يعتقد الريس أن الأدب يجب أن يُزعج، أن يوقظ الفكر، وأن يجعل القارئ يعيد النظر في معتقداته.
              </p>
            </div>

            <blockquote className="border-r-4 border-gold pr-4 sm:pr-6 py-4 font-aref text-xl sm:text-2xl text-ember leading-relaxed">
              «يقال أحياناً إن الإنسان حيوانٌ كاسر — إلا أن في هذا القول إهانةً للحيوانات.»
            </blockquote>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-obsidian-lighter">
              <div>
                <h3 className="font-aref text-lg text-ink mb-1">الناشر</h3>
                <p className="text-ink/60 font-tajawal text-sm">إبهار للنشر والتوزيع</p>
              </div>
              <div>
                <h3 className="font-aref text-lg text-ink mb-1">تصميم الأغلفة</h3>
                <p className="text-ink/60 font-tajawal text-sm">يوسف السيد</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/books" className="inline-block bg-ember text-obsidian px-8 py-4 rounded font-tajawal font-semibold hover:bg-ember/90 transition-colors text-lg">
            اقرأ كل الأعمال
          </Link>
        </div>
      </div>
    </main>
  )
}
