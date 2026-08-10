'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ArrowRight } from 'lucide-react'

const faqs = [
  {
    q: 'مين هو السيد الريس؟',
    a: 'كاتب مصري وصيدلي إكلينيكي ومحاضر في الصيدلة الإكلينيكية. يكتب في أدب الرعب النفسي والرعب، وأعماله تمزج بين الأساطير المصرية القديمة والرعب الحديث.',
  },
  {
    q: 'إيه هي سلسلة «قلادة الشمس»؟',
    a: 'سلسلة من ثلاث روايات مترابطة (طقوس الموت، زورستر، كهنة الشمس) تدور في عالم واحد حيث تتصارع قوى الظلام والنور عبر العصور والحضارات.',
  },
  {
    q: 'إيه ترتيب قراءة سلسلة قلادة الشمس؟',
    a: 'الترتيب المُوصى به: ١. طقوس الموت (البداية) ← ٢. زورستر (التصعيد) ← ٣. كهنة الشمس (المواجهة الأخيرة). يُنصح بقراءتها بالترتيب عشان تفهم تطور الشخصيات والأحداث.',
  },
  {
    q: 'فين أقدر أشتري الكتب؟',
    a: 'الكتب متاحة في المكتبات الكبرى ومعارض الكتاب في مصر والعالم العربي، وكمان أونلاين على أمازون وجرير ونيل وفرات. لينكات الشراء موجودة على صفحة كل كتاب.',
  },
  {
    q: 'مين الناشر؟',
    a: 'جميع أعمال السيد الريس صادرة عن دار إبهار للنشر والتوزيع. تصميم الأغلفة بواسطة الفنان يوسف السيد.',
  },
  {
    q: 'هل فيه أعمال جديدة قادمة؟',
    a: 'اشترك في القائمة البريدية عشان تكون أول من يعرف بأي إصدار جديد. كمان تابعنا على السوشيال ميديا.',
  },
  {
    q: 'إزاي أتواصل مع الكاتب؟',
    a: 'من خلال صفحة "تواصل معنا" على الموقع. نرحب بالاستفسارات، دعوات الفعاليات، والمقابلات الصحفية.',
  },
  {
    q: 'هل الروايات مناسبة لكل الأعمار؟',
    a: 'الروايات موجّهة للقرّاء البالغين (١٦+) نظراً لطبيعة المحتوى الذي يتناول موضوعات الرعب والرعب النفسي.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gold-hairline">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-right group">
        <span className="font-tajawal font-semibold text-ink text-sm sm:text-base pr-1 group-hover:text-ember transition-colors">
          {q}
        </span>
        <ChevronDown size={20} className={`text-ink/40 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-60 pb-5' : 'max-h-0'}`}>
        <p className="text-ink/60 font-tajawal text-sm leading-relaxed pr-1">{a}</p>
      </div>
    </div>
  )
}

export default function FaqPage() {
  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-ember hover:text-gold transition-colors mb-8 font-tajawal font-semibold text-sm">
          <ArrowRight size={14} /> الرئيسية
        </Link>

        <div className="text-center mb-10">
          <h1 className="font-aref text-4xl sm:text-5xl text-ink mb-3">أسئلة شائعة</h1>
          <p className="text-ink/60 font-tajawal text-sm sm:text-base">
            إجابات على أكثر الأسئلة تكراراً عن الكاتب وأعماله
          </p>
        </div>

        <div className="card-lifted rounded-xl px-5 sm:px-8 py-2">
          {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
        </div>

        <div className="text-center mt-10">
          <p className="text-ink/50 font-tajawal text-sm mb-3">مالقيتش إجابة سؤالك؟</p>
          <Link href="/contact" className="inline-block bg-ember text-white px-8 py-3 rounded-lg font-tajawal font-semibold hover:bg-ember/90 transition-colors text-sm">
            تواصل معنا
          </Link>
        </div>
      </div>
    </main>
  )
}
