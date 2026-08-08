'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)
  const [displayPath, setDisplayPath] = useState(pathname)

  useEffect(() => {
    if (pathname !== displayPath) {
      setVisible(false)
      const timer = setTimeout(() => {
        setDisplayPath(pathname)
        setVisible(true)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [pathname, displayPath])

  return (
    <div
      className={`transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ minHeight: '100svh' }}
    >
      {children}
    </div>
  )
}
