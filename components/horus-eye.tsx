'use client'

import { useState, useEffect, useRef } from 'react'

export function HorusEye() {
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 })
  const eyeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const handleMouse = (e: MouseEvent) => {
      if (!eyeRef.current) return
      const rect = eyeRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx)
      const dist = Math.min(6, Math.hypot(e.clientX - cx, e.clientY - cy) / 40)
      setPupilOffset({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist })
    }

    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <div ref={eyeRef} className="relative w-16 h-16 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Eye of Horus outline */}
        <path
          d="M 20 50 Q 50 25 80 50 Q 50 70 20 50 Z"
          fill="none" stroke="#C79A3B" strokeWidth="2" opacity="0.8"
        />
        {/* Eyebrow */}
        <path d="M 18 42 Q 45 22 82 40" fill="none" stroke="#C79A3B" strokeWidth="2.5" opacity="0.7" />
        {/* Tail marking */}
        <path d="M 80 52 Q 88 58 82 68" fill="none" stroke="#C79A3B" strokeWidth="2" opacity="0.6" />
        {/* Spiral marking */}
        <path d="M 45 62 Q 42 72 52 74 Q 60 74 58 66" fill="none" stroke="#C79A3B" strokeWidth="2" opacity="0.6" />
        {/* Iris */}
        <circle cx="50" cy="50" r="10" fill="#C79A3B" opacity="0.25" />
        {/* Pupil - follows mouse */}
        <circle
          cx={50 + pupilOffset.x}
          cy={50 + pupilOffset.y}
          r="5"
          fill="#E85D2B"
          style={{ transition: 'cx 0.1s ease-out, cy 0.1s ease-out' }}
        />
        {/* Glow pupil */}
        <circle
          cx={50 + pupilOffset.x}
          cy={50 + pupilOffset.y}
          r="8"
          fill="#E85D2B"
          opacity="0.2"
          style={{ transition: 'cx 0.1s ease-out, cy 0.1s ease-out' }}
        />
      </svg>
    </div>
  )
}
