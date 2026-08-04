import { cn } from './cn'

export default function EmptyState({ icon = '📷', title, description, action, className = '' }) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}>
      <div className="w-16 h-16 rounded-2xl bg-clay-soft flex items-center justify-center text-3xl mb-4">{icon}</div>
      {title && <h3 className="text-lg font-semibold text-ink">{title}</h3>}
      {description && <p className="text-sm text-ink-muted mt-1.5 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
