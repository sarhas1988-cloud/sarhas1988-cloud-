'use client'

export function FogEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="fog-layer fog-1" />
      <div className="fog-layer fog-2" />
      <div className="fog-layer fog-3" />
      <style>{`
        .fog-layer {
          position: absolute;
          width: 200%;
          height: 100%;
          background: radial-gradient(ellipse 50% 40% at 50% 50%, rgba(199,154,59,0.04), transparent 70%);
          opacity: 0.6;
        }
        .fog-1 { animation: fogMove1 25s linear infinite; }
        .fog-2 { animation: fogMove2 35s linear infinite; top: 20%; }
        .fog-3 { animation: fogMove1 45s linear infinite; top: -10%; }
        @keyframes fogMove1 {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        @keyframes fogMove2 {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .fog-layer { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
