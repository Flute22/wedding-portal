import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs tracking-widest uppercase text-stone-600 font-sans">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'h-11 w-full rounded-xl border bg-white px-4 text-sm text-ink placeholder:text-stone-400',
            'transition-colors duration-150',
            error
              ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
              : 'border-cream-dark focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20',
            'outline-none',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
