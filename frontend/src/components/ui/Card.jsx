import { cn } from './cn'

export default function Card({ as: Comp = 'div', hover = false, flat = false, className = '', children, ...props }) {
  return (
    <Comp
      className={cn(
        flat ? 'card-flat' : 'card',
        hover && 'transition-all duration-300 hover:shadow-lift hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}

export function CardBody({ className = '', children, ...props }) {
  return <div className={cn('p-5 sm:p-6', className)} {...props}>{children}</div>
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-line', className)}>
      <div>
        {title && <h3 className="text-lg font-semibold text-ink leading-tight">{title}</h3>}
        {subtitle && <p className="text-sm text-ink-muted mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
