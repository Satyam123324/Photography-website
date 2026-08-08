import { useEffect, useRef, useState } from 'react'

// Scroll-driven "3D" DSLR that pans in perspective and pops out photos as it shoots.
// Pure CSS 3D transforms + scroll progress — no libraries.

const SHOTS = [
  { hue: '#FF5A47', emoji: '🌇', label: 'Golden hour', x: -250, y: -70, rot: -9 },
  { hue: '#54E08A', emoji: '💍', label: 'The vows', x: 250, y: -100, rot: 8 },
  { hue: '#FBBF24', emoji: '💃', label: 'First dance', x: -285, y: 80, rot: -6 },
  { hue: '#8FB8FF', emoji: '🌃', label: 'City lights', x: 275, y: 70, rot: 11 },
  { hue: '#FF8B7C', emoji: '😄', label: 'Candid joy', x: -10, y: 150, rot: -3 },
]

function usePrefersReducedMotion() {
  const [r, setR] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setR(m.matches)
    const h = () => setR(m.matches)
    m.addEventListener?.('change', h)
    return () => m.removeEventListener?.('change', h)
  }, [])
  return r
}

function Dslr() {
  const ticks = Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 * Math.PI) / 180
    return { x1: 150 + 30 * Math.cos(a), y1: 150 + 30 * Math.sin(a), x2: 150 + 40 * Math.cos(a), y2: 150 + 40 * Math.sin(a) }
  })
  return (
    <svg viewBox="0 0 360 250" className="w-[320px] sm:w-[400px] drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* prism hump */}
      <path d="M116 96 L130 62 Q133 56 140 56 L196 56 Q203 56 206 62 L220 96 Z" fill="#1C1C22" stroke="#34343E" strokeWidth="2" />
      {/* hotshoe */}
      <rect x="150" y="46" width="36" height="12" rx="3" fill="#26262E" stroke="#34343E" strokeWidth="1.5" />
      {/* body */}
      <rect x="44" y="92" width="272" height="120" rx="22" fill="#17171C" stroke="#34343E" strokeWidth="2.5" />
      {/* grip */}
      <path d="M300 100 Q330 104 330 140 L330 176 Q330 206 300 206 Z" fill="#1C1C22" stroke="#34343E" strokeWidth="2" />
      {/* mode dial */}
      <circle cx="86" cy="86" r="18" fill="#1C1C22" stroke="#34343E" strokeWidth="2" />
      <line x1="86" y1="72" x2="86" y2="80" stroke="#9C98A2" strokeWidth="2" strokeLinecap="round" />
      {/* shutter button */}
      <rect x="292" y="80" width="26" height="12" rx="5" fill="#FF5A47" />
      {/* flash light */}
      <rect x="62" y="104" width="22" height="13" rx="3" fill="#26262E" stroke="#34343E" strokeWidth="1.5" />
      <rect className="cam-blink" x="66" y="108" width="14" height="6" rx="2" fill="#FBBF24" />
      {/* brand strip */}
      <rect x="238" y="186" width="46" height="6" rx="3" fill="#26262E" />

      {/* lens barrel */}
      <circle cx="150" cy="152" r="64" fill="#0D0D10" stroke="#34343E" strokeWidth="4" />
      <circle cx="150" cy="152" r="55" fill="#141418" stroke="#26262E" strokeWidth="2" />
      <circle className="spin-self" cx="150" cy="152" r="47" stroke="#FF5A47" strokeWidth="2.5" strokeDasharray="8 12" style={{ opacity: 0.85 }} />
      <circle className="spin-self-rev" cx="150" cy="152" r="39" stroke="#615E68" strokeWidth="1.5" strokeDasharray="3 8" />
      <g className="spin-self">
        {ticks.map((t, i) => <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#9C98A2" strokeWidth="2" strokeLinecap="round" />)}
      </g>
      <circle className="cam-iris" cx="150" cy="152" r="28" fill="#0B0B0D" stroke="#FF5A47" strokeWidth="2" />
      <circle cx="150" cy="152" r="14" fill="#050506" />
      <circle cx="136" cy="138" r="7" fill="#F4F1EC" style={{ opacity: 0.85 }} />
      <circle cx="164" cy="166" r="3" fill="#FF8B7C" />
    </svg>
  )
}

function Polaroid({ s, f = 1 }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 w-[140px] z-0"
      style={{ transform: `translate(calc(-50% + ${s.x * f}px), calc(-50% + ${s.y * f}px)) rotate(${s.rot}deg) scale(${f})` }}
    >
      <div className="cam-pop bg-chalk rounded-[6px] p-2 pb-6 shadow-[0_16px_40px_rgba(0,0,0,0.55)]">
        <div className="h-[104px] rounded-[3px] flex items-center justify-center text-4xl"
          style={{ background: `linear-gradient(135deg, ${s.hue}, ${s.hue}22)` }}>
          {s.emoji}
        </div>
        <p className="text-cream text-[11px] font-medium mt-2 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>{s.label}</p>
      </div>
    </div>
  )
}

export default function CameraScrollShow() {
  const sectionRef = useRef(null)
  const reduce = usePrefersReducedMotion()
  const [progress, setProgress] = useState(0)
  const [flashKey, setFlashKey] = useState(0)
  const [scale, setScale] = useState(1)
  const capturedRef = useRef(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current
        if (!el) return
        setScale(Math.max(0.5, Math.min(1, window.innerWidth / 900)))
        const rect = el.getBoundingClientRect()
        const total = rect.height - window.innerHeight
        const p = Math.min(1, Math.max(0, -rect.top / (total || 1)))
        setProgress(p)
        const passed = SHOTS.filter((_, i) => p >= (i + 1) / (SHOTS.length + 1)).length
        if (passed > capturedRef.current) setFlashKey((k) => k + 1)
        capturedRef.current = passed
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [])

  const captured = SHOTS.filter((_, i) => progress >= (i + 1) / (SHOTS.length + 1)).length
  const rotY = reduce ? 0 : (progress - 0.5) * 44
  const transX = reduce ? 0 : (progress - 0.5) * 210 * scale
  const bob = reduce ? 0 : Math.sin(progress * Math.PI * 3) * 12

  return (
    <section ref={sectionRef} className="relative h-[200vh] sm:h-[240vh] bg-cream-200 border-y border-line">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* heading */}
        <div className="text-center px-4 mb-4 relative z-20">
          <p className="section-label mb-3">/ 06  Every click, a story</p>
          <h2 className="headline text-3xl sm:text-5xl md:text-6xl font-bold text-ink">Point. Shoot. <span className="text-clay">Story.</span></h2>
          <p className="text-ink-muted mt-3 text-sm sm:text-base">
            {captured === 0 ? 'Scroll to start shooting ↓' : `${captured} / ${SHOTS.length} shots captured`}
          </p>
        </div>

        {/* stage */}
        <div className="relative w-full max-w-3xl h-[360px] sm:h-[440px]" style={{ perspective: '1200px' }}>
          {/* popped photos */}
          {SHOTS.slice(0, captured).map((s, i) => <Polaroid key={i} s={s} f={scale} />)}

          {/* camera */}
          <div
            className="absolute left-1/2 top-1/2 z-10"
            style={{
              transform: `translate(-50%,-50%) translateX(${transX}px) translateY(${bob}px) rotateX(-6deg) rotateY(${rotY}deg) scale(${scale})`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.12s linear',
            }}
          >
            <Dslr />
            {flashKey > 0 && (
              <div key={flashKey} className="cam-shot-flash absolute w-40 h-40 rounded-full pointer-events-none"
                style={{ left: '42%', top: '60%', background: 'radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%)' }} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
