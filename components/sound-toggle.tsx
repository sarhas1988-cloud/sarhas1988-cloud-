'use client'

import { useState, useCallback } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { soundManager } from '@/lib/sounds'

export function SoundToggle() {
  const [playing, setPlaying] = useState(false)

  const toggle = useCallback(() => {
    if (!soundManager) return
    soundManager.toggleAmbient()
    setPlaying(soundManager.ambientPlaying)
  }, [])

  return (
    <button
      onClick={toggle}
      className={`relative p-2 rounded-lg transition-all duration-300 ${
        playing 
          ? 'text-ember bg-ember/10' 
          : 'text-ink/40 hover:text-ink/70'
      }`}
      aria-label={playing ? 'إيقاف الصوت' : 'تشغيل الصوت'}
      title={playing ? 'إيقاف الصوت' : 'تشغيل الأجواء 🎧'}
    >
      {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
      {playing && (
        <>
          <span className="absolute inset-0 rounded-lg bg-ember/20 animate-ping-sound" />
          {/* Sound wave bars */}
          <span className="absolute -top-1 -left-1 flex gap-[2px]">
            <span className="w-[2px] h-2 bg-ember rounded-full animate-bar1" />
            <span className="w-[2px] h-3 bg-ember rounded-full animate-bar2" />
            <span className="w-[2px] h-1.5 bg-ember rounded-full animate-bar3" />
          </span>
        </>
      )}

      <style>{`
        @keyframes ping-sound { 0% { opacity: 0.4; transform: scale(1); } 100% { opacity: 0; transform: scale(1.5); } }
        .animate-ping-sound { animation: ping-sound 2s ease-out infinite; }
        @keyframes bar1 { 0%,100% { height: 4px; } 50% { height: 10px; } }
        @keyframes bar2 { 0%,100% { height: 10px; } 50% { height: 4px; } }
        @keyframes bar3 { 0%,100% { height: 6px; } 50% { height: 12px; } }
        .animate-bar1 { animation: bar1 0.8s ease-in-out infinite; }
        .animate-bar2 { animation: bar2 0.6s ease-in-out infinite; }
        .animate-bar3 { animation: bar3 0.7s ease-in-out infinite; }
      `}</style>
    </button>
  )
}
