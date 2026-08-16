'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number; size: number; speedX: number; speedY: number
  opacity: number; twinkle: number
}

export function GoldenDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Particle[] = []
    const count = 40

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    // Init particles
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: 0.5 + Math.random() * 2,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -(0.1 + Math.random() * 0.4),
        opacity: Math.random(),
        twinkle: Math.random() * Math.PI * 2,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      particles.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY
        p.twinkle += 0.05

        // Wrap around
        if (p.y < -5) { p.y = canvas.offsetHeight + 5; p.x = Math.random() * canvas.offsetWidth }
        if (p.x < -5) p.x = canvas.offsetWidth + 5
        if (p.x > canvas.offsetWidth + 5) p.x = -5

        const twinkleOpacity = (Math.sin(p.twinkle) + 1) / 2
        const finalOpacity = p.opacity * twinkleOpacity * 0.6

        // Golden particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(199, 154, 59, ${finalOpacity})`
        ctx.fill()

        // Glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(199, 154, 59, ${finalOpacity * 0.15})`
        ctx.fill()
      })

      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[1]" />
}
