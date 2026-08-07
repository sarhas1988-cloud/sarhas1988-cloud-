'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const h = () => setIsScrolled(window.scrollY > 20)
    h()
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { setIsOpen(false) }, [pathname])

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null

  const links = [
    { label: 'الأعمال',  href: '/books' },
    { label: 'عن الكاتب', href: '/about' },
    { label: 'المدونة',  href: '/blog' },
  ]

  const active = (h: string) => pathname === h || pathname.startsWith(h + '/')

  return (
    <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${
      isScrolled || isOpen ? 'bg-obsidian/95 backdrop-blur-md border-b border-gold-hairline' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="font-aref text-xl text-ember font-bold">
            السيد الريس
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className={`font-tajawal text-sm ${active(l.href) ? 'text-ember' : 'text-ink/70 hover:text-ember'}`}
              >{l.label}</Link>
            ))}
            <Link href="/#join" className="bg-ember text-obsidian px-5 py-1.5 rounded font-tajawal font-semibold text-sm">
              القصة المجانية
            </Link>
          </div>

          <button className="md:hidden p-2 text-ink" onClick={() => setIsOpen(!isOpen)} aria-label="القائمة">
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-obsidian border-t border-gold-hairline px-4 py-3 space-y-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setIsOpen(false)}
              className={`block py-2.5 px-3 rounded font-tajawal ${active(l.href) ? 'text-ember bg-ember/10' : 'text-ink'}`}
            >{l.label}</Link>
          ))}
          <Link href="/#join" onClick={() => setIsOpen(false)}
            className="block w-full bg-ember text-obsidian py-2.5 rounded font-tajawal font-semibold text-center mt-2">
            القصة المجانية
          </Link>
        </div>
      )}
    </nav>
  )
}
