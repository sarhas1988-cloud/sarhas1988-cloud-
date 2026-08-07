'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, User, FileText, Globe, ExternalLink, ShoppingBag } from 'lucide-react'

export function Footer() {
  const pathname = usePathname()

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null

  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-gold-hairline py-10 sm:py-14 px-5 sm:px-8" style={{ backgroundColor: '#0e0a07' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="font-aref text-xl text-ember font-bold mb-2 block">السيد الريس</Link>
            <p className="text-ink/50 font-tajawal text-xs leading-relaxed">
              كاتب الثريلر والأساطير المصرية.
              <br />صاحب عالم «قلادة الشمس».
            </p>
          </div>

          <div>
            <h3 className="font-aref text-base text-ink mb-4">الموقع</h3>
            <nav className="space-y-3">
              {[
                { label: 'كل الأعمال', href: '/books',  icon: BookOpen },
                { label: 'عن الكاتب',  href: '/about',  icon: User },
                { label: 'المدونة',    href: '/blog',   icon: FileText },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="flex items-center gap-3 text-ink/70 hover:text-ember transition-colors font-tajawal text-sm group">
                  <span className="w-8 h-8 rounded-lg bg-ember/10 flex items-center justify-center group-hover:bg-ember/20 transition-colors">
                    <l.icon size={18} className="text-ember" />
                  </span>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="font-aref text-base text-ink mb-4">تابِع</h3>
            <nav className="space-y-3">
              {[
                { label: 'فيسبوك',   href: '#', icon: Globe },
                { label: 'إنستغرام', href: '#', icon: ExternalLink },
                { label: 'جودريدز',  href: '#', icon: BookOpen },
              ].map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener"
                  className="flex items-center gap-3 text-ink/70 hover:text-ember transition-colors font-tajawal text-sm group">
                  <span className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                    <l.icon size={18} className="text-gold" />
                  </span>
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="font-aref text-base text-ink mb-4">الشراء</h3>
            <nav className="space-y-3">
              {[
                { label: 'أمازون',    href: '#', icon: ShoppingBag },
                { label: 'جرير',      href: '#', icon: ShoppingBag },
                { label: 'نيل وفرات', href: '#', icon: Globe },
              ].map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener"
                  className="flex items-center gap-3 text-ink/70 hover:text-ember transition-colors font-tajawal text-sm group">
                  <span className="w-8 h-8 rounded-lg bg-ember/10 flex items-center justify-center group-hover:bg-ember/20 transition-colors">
                    <l.icon size={18} className="text-ember" />
                  </span>
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
