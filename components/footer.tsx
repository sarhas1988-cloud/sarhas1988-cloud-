import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-gold-hairline bg-section-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 sm:mb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="font-aref text-2xl text-ember font-bold mb-2 block hover:text-gold transition-colors">
              السيد الريس
            </Link>
            <p className="text-ink/60 font-tajawal text-sm leading-relaxed">
              كاتب الثريلر والأساطير المصرية. صاحب عالم «قلادة الشمس».
            </p>
          </div>

          <div>
            <h3 className="font-aref text-lg text-ink mb-4">الموقع</h3>
            <nav className="space-y-2">
              {[
                { label: 'كل الأعمال', href: '/books' },
                { label: 'عن الكاتب',  href: '/about' },
                { label: 'المدونة',    href: '/blog' },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="text-ink/70 hover:text-ember transition-colors font-tajawal text-sm block"
                >{l.label}</Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="font-aref text-lg text-ink mb-4">تابِع</h3>
            <nav className="space-y-2">
              {[
                { label: 'فيسبوك',   href: '#' },
                { label: 'إنستغرام', href: '#' },
                { label: 'جودريدز',  href: '#' },
              ].map((l) => (
                <a key={l.label} href={l.href}
                  className="text-ink/70 hover:text-ember transition-colors font-tajawal text-sm block"
                >{l.label}</a>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="font-aref text-lg text-ink mb-4">الشراء</h3>
            <nav className="space-y-2">
              {[
                { label: 'أمازون',   href: '#' },
                { label: 'جرير',     href: '#' },
                { label: 'نيل وفرات', href: '#' },
              ].map((l) => (
                <a key={l.label} href={l.href}
                  className="text-ink/70 hover:text-ember transition-colors font-tajawal text-sm block"
                >{l.label}</a>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-obsidian pt-8 flex flex-col sm:flex-row justify-between gap-2 text-xs text-ink/50 font-tajawal">
          <span>© {year} السيد الريس. جميع الحقوق محفوظة.</span>
          <span>نشر وتوزيع: إبهار · تصميم الأغلفة: يوسف السيد</span>
        </div>
      </div>
    </footer>
  )
}
