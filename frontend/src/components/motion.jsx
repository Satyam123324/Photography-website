import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { cn } from './ui/cn'

// Dependency-free scroll animations (CSS transitions + IntersectionObserver).
// Same API as before: <Reveal>, <Stagger><StaggerItem/></Stagger>.

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(m.matches)
    const h = () => setReduce(m.matches)
    m.addEventListener?.('change', h)
    return () => m.removeEventListener?.('change', h)
  }, [])
  return reduce
}

function useInView(once = true) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) setInView(false)
      },
      { rootMargin: '-60px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once])
  return [ref, inView]
}

export function Reveal({ children, delay = 0, y = 24, className = '', as: Comp = 'div', once = true }) {
  const reduce = usePrefersReducedMotion()
  const [ref, inView] = useInView(once)
  const shown = reduce || inView
  return (
    <Comp
      ref={ref}
      className={cn('transition-all duration-700 ease-out will-change-transform', className)}
      style={{
        transitionDelay: `${delay}s`,
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : `translateY(${reduce ? 0 : y}px)`,
      }}
    >
      {children}
    </Comp>
  )
}

const StaggerCtx = createContext(null)

export function Stagger({ children, className = '', gap = 0.08, once = true }) {
  const reduce = usePrefersReducedMotion()
  const [ref, inView] = useInView(once)
  const idxRef = useRef(0)
  idxRef.current = 0 // reset ordering each render; item indices are captured once on mount
  const shown = reduce || inView
  return (
    <div ref={ref} className={className}>
      <StaggerCtx.Provider value={{ shown, gap, reduce, next: () => idxRef.current++ }}>
        {children}
      </StaggerCtx.Provider>
    </div>
  )
}

export function StaggerItem({ children, className = '', y = 22 }) {
  const ctx = useContext(StaggerCtx)
  const [idx] = useState(() => (ctx ? ctx.next() : 0))
  const shown = ctx ? ctx.shown : true
  const reduce = ctx ? ctx.reduce : false
  const delay = reduce ? 0 : idx * (ctx ? ctx.gap : 0.08)
  return (
    <div
      className={cn('transition-all duration-500 ease-out will-change-transform', className)}
      style={{
        transitionDelay: `${delay}s`,
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : `translateY(${reduce ? 0 : y}px)`,
      }}
    >
      {children}
    </div>
  )
}
