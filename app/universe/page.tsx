import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import type { Book } from '@/types/supabase'
import { getBookCover, getPlaceholderColor } from '@/types/supabase'

export const metadata = {
  title: 'عالم قلادة الشمس — السيد الريس',
  description: 'استكشف الكون الروائي لسلسلة قلادة الشمس: ترتيب القراءة، الشخصيات، والعالم المظلم.',
}

export const revalidate = 60

export default async function UniversePage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('books')
    .select('*')
    .eq('series', 'قلادة الشمس')
    .eq('published', true)
    .order('sort_order')
  const books = (data as Book[]) ?? []

  const timeline = [
    { order: 1, slug: 'toqoos', title: 'طقوس الموت', label: 'البداية', desc: 'الكشف عن الطقوس المظلمة التي مارسها كهنة مجهولون عبر العصور. مَن يستمدّون حياتهم من الموت.' },
    { order: 2, slug: 'zoroaster', title: 'زورستر', label: 'التصعيد', desc: 'الساحر الأسود يعود من الظلام. سلسلة جرائم وحشية تقود إلى مواجهة مع قوى لا يمكن تفسيرها.' },
    { order: 3, slug: 'kohna', title: 'كهنة الشمس', label: 'المواجهة الأخيرة', desc: 'المعركة الأخيرة. كهنة الشمس يحاولون إعادة كتابة التاريخ، وياسين السمري يقف في طريقهم.' },
  ]

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-20">
          <p className="text-xs text-gold tracking-widest mb-2 font-tajawal">الكون الروائي</p>
          <h1 className="font-aref text-4xl sm:text-6xl text-ink mb-4">قلادة الشمس</h1>
          <p className="text-ink/60 font-tajawal text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            ثلاث روايات متصلة بعالم واحد مظلم، حيث تتشابك الأقدار والأساطير المصرية القديمة
            بالرعب الحديث. كل رواية تكشف طبقة جديدة من الحقيقة — ولكن الصورة الكاملة لا تتضح
            إلا عند قراءة الثلاثة.
          </p>
        </div>

        {/* Reading Order */}
        <div className="mb-16 sm:mb-20">
          <h2 className="font-aref text-2xl sm:text-3xl text-ink mb-8 text-center">ترتيب القراءة</h2>
          <div className="space-y-6">
            {timeline.map((t, i) => {
              const book = books.find((b) => b.slug === t.slug)
              const cover = book ? getBookCover(book) : null
              const bg = book ? getPlaceholderColor(book) : '#1a1510'
              return (
                <Link key={t.slug} href={`/books/${t.slug}`}>
                  <div className="card-lifted rounded-xl p-4 sm:p-6 flex gap-4 sm:gap-6 items-start group hover:border-ember/30 transition-all cursor-pointer mb-4">
                    {/* Order number */}
                    <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-ember/15 flex items-center justify-center">
                      <span className="font-aref text-xl sm:text-2xl text-ember">{t.order}</span>
                    </div>

                    {/* Cover */}
                    <div className="shrink-0 w-16 sm:w-20 aspect-[2/3] rounded-lg overflow-hidden relative" style={{ backgroundColor: bg }}>
                      {cover ? (
                        <Image src={cover} alt={t.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-aref text-xs text-ink/50">{t.title}</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <span className="text-gold font-tajawal text-xs font-semibold">{t.label}</span>
                      <h3 className="font-aref text-xl sm:text-2xl text-ink group-hover:text-ember transition-colors mt-0.5">
                        {t.title}
                      </h3>
                      <p className="text-ink/50 font-tajawal text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none">
                        {t.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Themes */}
        <div className="mb-16 sm:mb-20">
          <h2 className="font-aref text-2xl sm:text-3xl text-ink mb-8 text-center">ثيمات العالم</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '𓂀', title: 'الأساطير المصرية', desc: 'طقوس فرعونية وكهنة قدماء يعبرون الزمن لتحقيق نبوءات مظلمة.' },
              { icon: '𓃭', title: 'الصراع بين النور والظلام', desc: 'معركة أبدية بين قوى تسعى لإعادة كتابة التاريخ وحرّاس يقفون في طريقها.' },
              { icon: '𓁹', title: 'الرعب النفسي', desc: 'تشويق يمزج الرعب بالغموض، حيث لا شيء كما يبدو ولا أحد فوق الشبهات.' },
            ].map((theme) => (
              <div key={theme.title} className="card-lifted rounded-xl p-5 text-center">
                <span className="text-3xl mb-3 block">{theme.icon}</span>
                <h3 className="font-aref text-lg text-ink mb-2">{theme.title}</h3>
                <p className="text-ink/50 font-tajawal text-xs leading-relaxed">{theme.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center card-lifted rounded-xl py-10 px-6">
          <h2 className="font-aref text-2xl sm:text-3xl text-ink mb-3">ابدأ الرحلة</h2>
          <p className="text-ink/50 font-tajawal text-sm mb-6">ابدأ بـ «طقوس الموت» واكتشف العالم المظلم</p>
          <Link href="/books/toqoos"
            className="inline-block bg-ember text-white px-10 py-3 rounded-lg font-tajawal font-semibold hover:bg-ember/90 transition-colors">
            اقرأ طقوس الموت
          </Link>
        </div>
      </div>
    </main>
  )
}
