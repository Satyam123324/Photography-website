// Decorative animated camera — pure SVG + CSS (keyframes live in index.css).
// Rotating lens rings, a pulsing iris, capture rings, a blinking flash, and a gentle float.
export default function AnimatedCamera({ className = '' }) {
  // six aperture ticks around the lens
  const ticks = Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 * Math.PI) / 180
    const r1 = 26, r2 = 33
    return {
      x1: 130 + r1 * Math.cos(a), y1: 118 + r1 * Math.sin(a),
      x2: 130 + r2 * Math.cos(a), y2: 118 + r2 * Math.sin(a),
    }
  })

  return (
    <svg viewBox="0 0 260 236" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g className="cam-float">
        {/* capture rings */}
        <circle className="cam-ring" cx="130" cy="118" r="30" stroke="#FF5A47" strokeWidth="1.5" style={{ opacity: 0.5 }} />
        <circle className="cam-ring" cx="130" cy="118" r="30" stroke="#FF5A47" strokeWidth="1.5" style={{ opacity: 0.5, animationDelay: '1.6s' }} />

        {/* body */}
        <rect x="40" y="84" width="180" height="108" rx="20" fill="#17171C" stroke="#34343E" strokeWidth="2" />
        {/* viewfinder hump */}
        <path d="M104 84 L112 66 Q114 62 118 62 L150 62 Q154 62 156 66 L162 84 Z" fill="#17171C" stroke="#34343E" strokeWidth="2" />
        {/* shutter button */}
        <rect x="176" y="70" width="22" height="11" rx="4" fill="#FF5A47" />
        {/* flash + burst */}
        <rect x="54" y="96" width="24" height="15" rx="3" fill="#26262E" stroke="#34343E" strokeWidth="1.5" />
        <rect className="cam-blink" x="58" y="100" width="16" height="7" rx="2" fill="#FBBF24" />
        <circle className="cam-flash" cx="66" cy="103" r="20" fill="#FFFFFF" />
        {/* brand strip */}
        <rect x="150" y="168" width="42" height="6" rx="3" fill="#26262E" />

        {/* lens */}
        <circle cx="130" cy="118" r="46" fill="#0F0F12" stroke="#34343E" strokeWidth="3" />
        <circle className="cam-spin" cx="130" cy="118" r="39" stroke="#FF5A47" strokeWidth="2" strokeDasharray="6 10" style={{ opacity: 0.8 }} />
        <circle className="cam-spin-rev" cx="130" cy="118" r="33" stroke="#615E68" strokeWidth="1.5" strokeDasharray="3 7" />
        {/* aperture ticks */}
        <g className="cam-spin">
          {ticks.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#9C98A2" strokeWidth="2" strokeLinecap="round" />
          ))}
        </g>
        {/* iris */}
        <circle className="cam-iris" cx="130" cy="118" r="24" fill="#161619" stroke="#FF5A47" strokeWidth="2" />
        <circle cx="130" cy="118" r="12" fill="#0B0B0D" />
        {/* glint */}
        <circle cx="120" cy="108" r="5" fill="#F4F1EC" style={{ opacity: 0.85 }} />
        <circle cx="140" cy="128" r="2.5" fill="#FF8B7C" />
      </g>
    </svg>
  )
}
