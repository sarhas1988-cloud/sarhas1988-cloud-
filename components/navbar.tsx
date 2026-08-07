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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'الأعمال', href: '/books' },
    { label: 'عن الكاتب', href: '/about' },
    { label: 'المدونة', href: '/blog' },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      <nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-obsidian/80 backdrop-blur-md border-b border-obsidian-lighter'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <Link href="/" className="font-aref text-2xl text-ember font-bold hover:text-gold transition-colors">
              السيد الريس
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-tajawal text-sm transition-colors ${
                    isActive(link.href)
                      ? 'text-ember border-b-2 border-ember'
                      : 'text-ink hover:text-ember'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="/#join"
                className="bg-ember text-obsidian px-6 py-2 rounded font-tajawal font-semibold hover:bg-ember/90 transition-colors text-sm"
              >
                القصة المجانية
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-ink hover:text-ember transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 top-16 bg-obsidian/95 backdrop-blur-sm z-40 md:hidden">
          <div className="p-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block font-tajawal py-2 transition-colors ${
                  isActive(link.href) ? 'text-ember' : 'text-ink hover:text-ember'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/#join"
              className="block w-full bg-ember text-obsidian px-6 py-3 rounded font-tajawal font-semibold hover:bg-ember/90 transition-colors mt-4 text-center"
              onClick={() => setIsOpen(false)}
            >
              القصة المجانية
            </a>
          </div>
        </div>
      )}
    </>
  )
}
