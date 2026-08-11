'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowUp } from 'lucide-react'

export function ScrollToTop() {
  const [show, setShow] = useState(false)
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) return null

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      onClick={scrollUp}
      className={`fixed bottom-6 right-6 z-[80] w-11 h-11 rounded-full bg-ember text-white shadow-lg shadow-ember/20 flex items-center justify-center hover:bg-ember/90 hover:scale-110 transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="العودة لأعلى"
    >
      <ArrowUp size={20} />
    </button>
  )
}
