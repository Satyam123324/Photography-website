import { useRef, useState, useCallback } from 'react'

// A camera lens that "zooms" in 3D — stacked depth layers (translateZ) with a real
// aperture diaphragm, knurled focus ring, floating bokeh, and pointer-driven tilt.
// Pure CSS 3D + SVG, no libraries.

const RINGS = [0, 1, 2, 3, 4, 5, 6]

// heptagon aperture points (100x100 viewBox, centered)
const HEPTA = Array.from({ length: 7 }, (_, i) => {
  const a = (-90 + i * (360 / 7)) * (Math.PI / 180)
  return `${(50 + 33 * Math.cos(a)).toFixed(1)},${(50 + 33 * Math.sin(a)).toFixed(1)}`
}).join(' ')

const BOKEH = [
  { s: 26, x: '4%', y: '12%', z: 120, c: 'rgba(255,90,71,0.5)', d: '0s' },
  { s: 16, x: '82%', y: '6%', z: 150, c: 'rgba(255,255,255,0.5)', d: '0.8s' },
  { s: 34, x: '88%', y: '70%', z: 100, c: 'rgba(84,224,138,0.35)', d: '1.6s' },
  { s: 14, x: '10%', y: '78%', z: 160, c: 'rgba(251,191,36,0.45)', d: '2.2s' },
  { s: 20, x: '60%', y: '90%', z: 130, c: 'rgba(255,139,124,0.45)', d: '1.1s' },
]

const TICKS = Array.from({ length: 36 }, (_, i) => i)

export default function LensZoom3D() {
  const ref = useRef(null)
  const [tilt, setTilt] = useState('')
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const onMove = useCallback((e) => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    setTilt(`rotateX(${((0.5 - py) * 22).toFixed(2)}deg) rotateY(${((px - 0.5) * 22).toFixed(2)}deg)`)
  }, [reduce])

  const onLeave = useCallback(() => setTilt(''), [])

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="[perspective:1100px] select-none" aria-hidden="true">
      <div
        className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto transition-transform duration-200 ease-out"
        style={{ transformStyle: 'preserve-3d', transform: tilt || undefined }}
      >
        <div className="lens3d relative w-full h-full rounded-full">
          {/* barrel back plate */}
          <div className="absolute inset-0 rounded-full" style={{ transform: 'translateZ(-100px)', background: '#0C0C0F', boxShadow: '0 45px 100px rgba(0,0,0,0.7)' }} />

          {/* knurled focus ring */}
          <div className="absolute inset-1 rounded-full" style={{ transform: 'translateZ(6px)', background: 'repeating-conic-gradient(#2A2A32 0deg 5deg, #17171B 5deg 10deg)', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.7)' }} />

          {/* barrel rings receding into depth */}
          {RINGS.map((i) => {
            const inset = 10 + i * 8
            const z = 40 - i * 20
            const isFront = i === 0
            return (
              <div
                key={i}
                className="absolute rounded-full border"
                style={{
                  inset: `${inset}px`,
                  transform: `translateZ(${z}px)`,
                  borderColor: isFront ? '#FF5A47' : i % 2 ? '#3A3A44' : '#26262E',
                  borderWidth: isFront ? 3 : 2,
                  background: i > 4 ? '#0A0A0C' : 'transparent',
                  boxShadow: isFront ? '0 0 24px rgba(255,90,71,0.45)' : 'inset 0 3px 8px rgba(0,0,0,0.6)',
                }}
              />
            )
          })}

          {/* aperture f-stop tick ring */}
          <svg viewBox="0 0 100 100" className="absolute inset-[14px]" style={{ transform: 'translateZ(44px)' }}>
            {TICKS.map((i) => {
              const a = (i * 10) * (Math.PI / 180)
              const r1 = i % 3 === 0 ? 43 : 45
              return <line key={i} x1={50 + r1 * Math.cos(a)} y1={50 + r1 * Math.sin(a)} x2={50 + 48 * Math.cos(a)} y2={50 + 48 * Math.sin(a)} stroke="#4A4750" strokeWidth={i % 3 === 0 ? 1.4 : 0.7} />
            })}
          </svg>

          {/* front glass element */}
          <div className="absolute rounded-full overflow-hidden" style={{ inset: '50px', transform: 'translateZ(50px)', background: 'radial-gradient(circle at 33% 27%, #363644, #0A0A0D 74%)', boxShadow: 'inset 0 0 34px rgba(0,0,0,0.85)' }}>
            {/* chromatic coating edge */}
            <div className="absolute inset-0 rounded-full" style={{ boxShadow: 'inset 0 0 0 3px rgba(84,224,138,0.15), inset 0 0 0 6px rgba(255,90,71,0.12)' }} />
            {/* rotating sheen */}
            <div className="lens-shine absolute left-1/2 top-1/2 w-[160%] h-8 bg-white/10 blur-md rounded-full" />
            {/* coating reflections */}
            <div className="absolute w-24 h-24 rounded-full bg-clay/25 blur-2xl" style={{ right: '6%', bottom: '8%' }} />
            <div className="absolute w-12 h-12 rounded-full bg-moss/20 blur-lg" style={{ left: '10%', bottom: '16%' }} />
            {/* specular highlight */}
            <div className="absolute w-14 h-14 rounded-full bg-white/60 blur-md" style={{ left: '18%', top: '14%' }} />
            <div className="absolute w-3.5 h-3.5 rounded-full bg-white" style={{ left: '28%', top: '24%' }} />

            {/* aperture diaphragm */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
              <defs>
                <radialGradient id="apCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#000000" />
                  <stop offset="70%" stopColor="#0B0B0D" />
                  <stop offset="100%" stopColor="#1a0f0c" />
                </radialGradient>
              </defs>
              <g className="lens-aperture">
                <polygon points={HEPTA} fill="url(#apCore)" stroke="#FF5A47" strokeWidth="1.2" strokeOpacity="0.7" />
                {/* blade seams */}
                {Array.from({ length: 7 }, (_, i) => {
                  const a = (-90 + i * (360 / 7)) * (Math.PI / 180)
                  return <line key={i} x1="50" y1="50" x2={50 + 33 * Math.cos(a)} y2={50 + 33 * Math.sin(a)} stroke="#000" strokeWidth="0.6" strokeOpacity="0.6" />
                })}
              </g>
            </svg>
          </div>

          {/* focal length engraving */}
          <div className="absolute left-1/2 -translate-x-1/2 text-[10px] font-semibold tracking-widest text-ink-faint" style={{ bottom: '20px', transform: 'translateZ(52px) translateX(-50%)' }}>
            85mm · ƒ1.4
          </div>
        </div>

        {/* floating bokeh (depth of field) */}
        {BOKEH.map((b, i) => (
          <div
            key={i}
            className="lens-bokeh absolute rounded-full pointer-events-none"
            style={{ width: b.s, height: b.s, left: b.x, top: b.y, background: b.c, filter: 'blur(2px)', '--z': `${b.z}px`, transform: `translateZ(${b.z}px)`, animationDelay: b.d }}
          />
        ))}
      </div>
    </div>
  )
}
