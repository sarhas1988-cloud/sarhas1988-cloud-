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

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false) }, [pathname])

  const navLinks = [
    { label: 'الأعمال',  href: '/books' },
    { label: 'عن الكاتب', href: '/about' },
    { label: 'المدونة',  href: '/blog' },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${
        isScrolled || isOpen
          ? 'bg-obsidian/95 backdrop-blur-md border-b border-gold-hairline'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand */}
          <Link href="/" className="font-aref text-xl sm:text-2xl text-ember font-bold hover:text-gold transition-colors">
            السيد الريس
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`font-tajawal text-sm transition-colors ${
                  isActive(link.href) ? 'text-ember' : 'text-ink/80 hover:text-ember'
                }`}
              >{link.label}</Link>
            ))}
            <Link href="/#join"
              className="bg-ember text-obsidian px-5 py-2 rounded font-tajawal font-semibold hover:bg-ember/90 transition-colors text-sm"
            >القصة المجانية</Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 -ml-2 text-ink hover:text-ember transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="القائمة"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-obsidian/98 border-t border-gold-hairline">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`block py-3 px-3 rounded font-tajawal text-base transition-colors ${
                  isActive(link.href) ? 'text-ember bg-ember/10' : 'text-ink hover:text-ember hover:bg-ember/5'
                }`}
                onClick={() => setIsOpen(false)}
              >{link.label}</Link>
            ))}
            <Link href="/#join"
              className="block w-full bg-ember text-obsidian px-6 py-3 rounded font-tajawal font-semibold text-center mt-3"
              onClick={() => setIsOpen(false)}
            >القصة المجانية</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
