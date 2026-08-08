import { useRef, useState, useCallback } from 'react'
import { cn } from './ui/cn'

// Pointer-driven 3D tilt. Children can use translateZ(...) to pop at different depths.
export default function Tilt({ children, max = 14, glare = true, className = '', style }) {
  const ref = useRef(null)
  const [tr, setTr] = useState('')
  const [gl, setGl] = useState({ x: 50, y: 50, o: 0 })
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const onMove = useCallback((e) => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const ry = (px - 0.5) * max * 2
    const rx = (0.5 - py) * max * 2
    setTr(`perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.04)`)
    setGl({ x: px * 100, y: py * 100, o: 1 })
  }, [max, reduce])

  const onLeave = useCallback(() => { setTr(''); setGl((g) => ({ ...g, o: 0 })) }, [])

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn('relative transition-transform duration-200 ease-out [transform-style:preserve-3d] will-change-transform', className)}
      style={{ transform: tr || undefined, ...style }}
    >
      {children}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-200"
          style={{ opacity: gl.o * 0.5, background: `radial-gradient(circle at ${gl.x}% ${gl.y}%, rgba(255,255,255,0.22), transparent 45%)`, transform: 'translateZ(60px)' }}
        />
      )}
    </div>
  )
}
