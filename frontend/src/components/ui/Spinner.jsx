import { cn } from './cn'

const SIZES = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-10 h-10 border-[3px]' }

export default function Spinner({ size = 'md', className = '' }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('inline-block rounded-full border-clay/25 border-t-clay animate-spin', SIZES[size], className)}
    />
  )
}

export function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-ink-muted">
      <Spinner size="lg" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
