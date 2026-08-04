import { cn } from './cn'

export function Field({ label, hint, error, required, children, className = '' }) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="label !normal-case !tracking-normal !text-sm !text-ink !font-medium">
          {label}{required && <span className="text-clay"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-rose mt-1.5">{error}</p>
      ) : hint ? (
        <p className="text-xs text-ink-faint mt-1.5">{hint}</p>
      ) : null}
    </div>
  )
}

export function Input({ className = '', invalid = false, ...props }) {
  return <input className={cn('input', invalid && 'border-rose focus:border-rose focus:ring-rose/20', className)} {...props} />
}

export function Textarea({ className = '', rows = 4, ...props }) {
  return <textarea rows={rows} className={cn('input resize-y', className)} {...props} />
}

export function Select({ className = '', children, ...props }) {
  return (
    <div className="relative">
      <select className={cn('select', className)} {...props}>{children}</select>
      <svg className="w-4 h-4 text-ink-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}

export default Field
