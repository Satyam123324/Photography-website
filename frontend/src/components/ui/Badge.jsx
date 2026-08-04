import { cn } from './cn'

const TONES = {
  clay: 'bg-clay-soft text-clay-dark border-clay/15',
  neutral: 'bg-cream-200 text-ink-muted border-line-strong',
  success: 'bg-moss-soft text-moss border-moss/20',
  danger: 'bg-rose-soft text-rose border-rose/20',
  amber: 'bg-amber-soft text-amber border-amber/20',
}

export default function Badge({ tone = 'neutral', dot = false, className = '', children }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border capitalize', TONES[tone], className)}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
