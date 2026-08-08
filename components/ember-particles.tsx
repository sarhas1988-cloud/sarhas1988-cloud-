'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number; size: number; speedX: number; speedY: number
  opacity: number; life: number; maxLife: number
}

export function EmberParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Check reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Particle[] = []
    const maxParticles = 25

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = () => {
      if (particles.length >= maxParticles) return
      const maxLife = 120 + Math.random() * 180
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: canvas.offsetHeight + 10,
        size: 1 + Math.random() * 2.5,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: -(0.4 + Math.random() * 0.8),
        opacity: 0,
        life: 0,
        maxLife,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      if (Math.random() < 0.15) spawn()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.speedX + Math.sin(p.life * 0.02) * 0.3
        p.y += p.speedY
        p.speedX *= 0.999

        // Fade in then out
        const progress = p.life / p.maxLife
        if (progress < 0.15) p.opacity = progress / 0.15
        else if (progress > 0.7) p.opacity = (1 - progress) / 0.3
        else p.opacity = 1

        if (p.life >= p.maxLife || p.y < -10) {
          particles.splice(i, 1)
          continue
        }

        // Draw ember
        const r = Math.round(232 + (Math.random() - 0.5) * 20)
        const g = Math.round(93 + (Math.random() - 0.5) * 40)
        const b = Math.round(43 + (Math.random() - 0.5) * 20)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity * 0.6})`
        ctx.fill()

        // Glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity * 0.08})`
        ctx.fill()
      }

      animId = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ opacity: 0.7 }}
    />
  )
}
