'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => setVisible(false), 800)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center transition-all duration-800 ${
        fadeOut ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(199,154,59,0.4), transparent 70%)' }} />
      </div>

      {/* Logo */}
      <div className={`relative transition-all duration-1000 ${fadeOut ? 'scale-95' : 'animate-splash-in'}`}>
        <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 relative rounded-full overflow-hidden">
          <Image
            src="/images/logo-emblem.png"
            alt="السيد الريس"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Loading bar */}
        <div className="mt-8 w-48 sm:w-64 mx-auto h-[2px] bg-ink/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-l from-gold via-ember to-gold rounded-full animate-splash-bar" />
        </div>
      </div>

      <style>{`
        .duration-800 { transition-duration: 800ms; }
        @keyframes splash-in {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes splash-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-splash-in { animation: splash-in 0.8s ease-out; }
        .animate-splash-bar { animation: splash-bar 2.2s ease-in-out; }
      `}</style>
    </div>
  )
}
