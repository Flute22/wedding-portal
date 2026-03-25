'use client'
import * as React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const ToastProvider = ToastPrimitive.Provider
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[360px] max-w-[100vw]',
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = 'ToastViewport'

interface ToastProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  variant?: 'default' | 'success' | 'error'
}

export function Toast({ open, onOpenChange, title, description, variant = 'default' }: ToastProps) {
  return (
    <ToastProvider>
      <ToastPrimitive.Root
        open={open}
        onOpenChange={onOpenChange}
        className={cn(
          'card flex gap-3 items-start p-4 shadow-card animate-slide-up',
          variant === 'success' && 'border-l-4 border-l-emerald-400',
          variant === 'error'   && 'border-l-4 border-l-red-400',
        )}
      >
        <div className="flex-1 min-w-0">
          <ToastPrimitive.Title className="text-sm font-semibold text-ink">{title}</ToastPrimitive.Title>
          {description && (
            <ToastPrimitive.Description className="text-xs text-stone-500 mt-0.5">{description}</ToastPrimitive.Description>
          )}
        </div>
        <ToastPrimitive.Close className="shrink-0 text-stone-400 hover:text-ink transition-colors">
          <X size={14} />
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
      <ToastViewport />
    </ToastProvider>
  )
}
