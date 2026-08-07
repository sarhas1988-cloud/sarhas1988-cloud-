import Link from 'next/link'
import { BookOpen, User, FileText, Facebook, Instagram, BookMarked, ShoppingCart, Store, Globe } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-gold-hairline py-10 sm:py-14 px-5 sm:px-8" style={{ backgroundColor: '#0e0a07' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="font-aref text-xl text-ember font-bold mb-2 block">السيد الريس</Link>
            <p className="text-ink/50 font-tajawal text-xs leading-relaxed">
              كاتب الثريلر والأساطير المصرية.
              <br />صاحب عالم «قلادة الشمس».
            </p>
          </div>

          {/* الموقع */}
          <div>
            <h3 className="font-aref text-base text-ink mb-4">الموقع</h3>
            <nav className="space-y-3">
              {[
                { label: 'كل الأعمال', href: '/books',  icon: BookOpen },
                { label: 'عن الكاتب',  href: '/about',  icon: User },
                { label: 'المدونة',    href: '/blog',   icon: FileText },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="flex items-center gap-2 text-ink/60 hover:text-ember transition-colors font-tajawal text-sm">
                  <l.icon size={14} className="shrink-0 opacity-60" />
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* تابِع */}
          <div>
            <h3 className="font-aref text-base text-ink mb-4">تابِع</h3>
            <nav className="space-y-3">
              {[
                { label: 'فيسبوك',   href: '#', icon: Facebook },
                { label: 'إنستغرام', href: '#', icon: Instagram },
                { label: 'جودريدز',  href: '#', icon: BookMarked },
              ].map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener"
                  className="flex items-center gap-2 text-ink/60 hover:text-ember transition-colors font-tajawal text-sm">
                  <l.icon size={14} className="shrink-0 opacity-60" />
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          {/* الشراء */}
          <div>
            <h3 className="font-aref text-base text-ink mb-4">الشراء</h3>
            <nav className="space-y-3">
              {[
                { label: 'أمازون',    href: '#', icon: ShoppingCart },
                { label: 'جرير',      href: '#', icon: Store },
                { label: 'نيل وفرات', href: '#', icon: Globe },
              ].map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener"
                  className="flex items-center gap-2 text-ink/60 hover:text-ember transition-colors font-tajawal text-sm">
                  <l.icon size={14} className="shrink-0 opacity-60" />
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-gold-hairline pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-ink/40 font-tajawal">
          <span>© {year} السيد الريس. جميع الحقوق محفوظة.</span>
          <span>نشر وتوزيع: إبهار · تصميم الأغلفة: يوسف السيد</span>
        </div>
      </div>
    </footer>
  )
}
