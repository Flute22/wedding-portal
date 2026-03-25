'use client'
import { format } from 'date-fns'
import { cn } from '@/lib/utils/cn'
import type { TimeSlot } from '@/types/database'

interface TimeSlotPickerProps {
  slots:    TimeSlot[]
  selected: string | null
  onSelect: (slot: TimeSlot) => void
  loading:  boolean
}

export function TimeSlotPicker({ slots, selected, onSelect, loading }: TimeSlotPickerProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 rounded-xl skeleton" />
        ))}
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <p className="text-sm text-stone-400 text-center py-4">
        No available slots on this day.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {slots.map(slot => {
        const isSelected  = selected === slot.start
        const isAvailable = slot.available
        return (
          <button
            key={slot.start}
            disabled={!isAvailable}
            onClick={() => isAvailable && onSelect(slot)}
            className={cn(
              'h-10 rounded-xl text-sm font-medium transition-all duration-150',
              isSelected
                ? 'bg-gold-400 text-white shadow-sm ring-2 ring-gold-400 ring-offset-1'
                : isAvailable
                  ? 'bg-white border border-cream-dark text-ink hover:border-gold-400 hover:bg-gold-50'
                  : 'bg-cream-dark text-stone-400 line-through cursor-not-allowed opacity-60'
            )}
          >
            {format(new Date(slot.start), 'h:mm a')}
          </button>
        )
      })}
    </div>
  )
}
