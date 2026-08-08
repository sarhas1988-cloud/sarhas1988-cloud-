'use client'

import { useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  intensity?: number
}

export function TiltCard({ children, className = '', intensity = 8 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setStyle({
      transform: `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale(1.02)`,
      transition: 'transform 0.1s ease-out',
    })
  }

  const handleLeave = () => {
    setStyle({
      transform: 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)',
      transition: 'transform 0.4s ease-out',
    })
  }

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  )
}
