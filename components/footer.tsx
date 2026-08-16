'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { BookOpen, User, FileText, Globe, HelpCircle, Mail, Shield, Calendar, ExternalLink, ShoppingBag } from 'lucide-react'

interface SiteLink { id: string; category: string; label: string; url: string }

export function Footer() {
  const pathname = usePathname()
  const [socialLinks, setSocialLinks] = useState<SiteLink[]>([])
  const [storeLinks, setStoreLinks] = useState<SiteLink[]>([])

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase
        .from('site_links').select('id, category, label, url')
        .eq('published', true).order('sort_order')
      if (data) {
        setSocialLinks((data as SiteLink[]).filter((l) => l.category === 'social'))
        setStoreLinks((data as SiteLink[]).filter((l) => l.category === 'store'))
      }
    }
    fetch()
  }, [])

  if (pathname.startsWith('/admin')) return null

  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gold-hairline py-10 sm:py-14 px-5 sm:px-8 bg-section-2">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="font-aref text-xl text-ember font-bold mb-2 block">السيد الريس</Link>
            <p className="text-ink/50 font-tajawal text-xs leading-relaxed">
              كاتب الرعب النفسي والجريمة والأساطير المصرية.
              <br />صاحب عالم «قلادة الشمس».
            </p>
          </div>

          {/* Site pages */}
          <div>
            <h3 className="font-aref text-base text-ink mb-4">الموقع</h3>
            <nav className="space-y-3">
              {[
                { label: 'كل الأعمال',    href: '/books',    icon: BookOpen },
                { label: 'قلادة الشمس',   href: '/universe', icon: BookOpen },
                { label: 'عن الكاتب',     href: '/about',    icon: User },
                { label: 'المدونة',        href: '/blog',     icon: FileText },
                { label: 'الفعاليات',      href: '/events',   icon: Calendar },
                { label: 'أسئلة شائعة',   href: '/faq',      icon: HelpCircle },
                { label: 'تواصل معنا',    href: '/contact',  icon: Mail },
                { label: 'سياسة الخصوصية', href: '/privacy',  icon: Shield },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="flex items-center gap-3 text-ink/70 hover:text-ember transition-colors font-tajawal text-sm group">
                  <span className="w-7 h-7 rounded-lg bg-ember/10 flex items-center justify-center group-hover:bg-ember/20 transition-colors">
                    <l.icon size={15} className="text-ember" />
                  </span>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social — from Supabase */}
          <div>
            <h3 className="font-aref text-base text-ink mb-4">تابِع</h3>
            <nav className="space-y-3">
              {socialLinks.length > 0 ? socialLinks.map((l) => (
                <a key={l.id} href={l.url} target="_blank" rel="noopener"
                  className="flex items-center gap-3 text-ink/70 hover:text-ember transition-colors font-tajawal text-sm group">
                  <span className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                    <ExternalLink size={15} className="text-gold" />
                  </span>
                  {l.label}
                </a>
              )) : (
                <p className="text-ink/30 font-tajawal text-xs">قريباً...</p>
              )}
            </nav>
          </div>

          {/* Store — from Supabase */}
          <div>
            <h3 className="font-aref text-base text-ink mb-4">الشراء</h3>
            <nav className="space-y-3">
              {storeLinks.length > 0 ? storeLinks.map((l) => (
                <a key={l.id} href={l.url} target="_blank" rel="noopener"
                  className="flex items-center gap-3 text-ink/70 hover:text-ember transition-colors font-tajawal text-sm group">
                  <span className="w-7 h-7 rounded-lg bg-ember/10 flex items-center justify-center group-hover:bg-ember/20 transition-colors">
                    <ShoppingBag size={15} className="text-ember" />
                  </span>
                  {l.label}
                </a>
              )) : (
                <p className="text-ink/30 font-tajawal text-xs">قريباً...</p>
              )}
            </nav>
          </div>
        </div>

        <div className="border-t border-gold-hairline pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-ink/40 font-tajawal">
          <span>© {year} السيد الريس. جميع الحقوق محفوظة.</span>
          <span>نشر وتوزيع: إبهار · أغلفة: يوسف السيد</span>
        </div>
      </div>
    </footer>
  )
}
