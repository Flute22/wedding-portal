'use client'
import {
  startOfMonth, endOfMonth, eachDayOfInterval, getDay,
  format, isSameDay, isToday, isBefore, startOfDay, addMonths, subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

interface BookingCalendarProps {
  selectedDate: Date | null
  onSelect:     (date: Date) => void
  month:        Date
  onMonthChange:(date: Date) => void
  busyDates?:   string[]   // ISO date strings that are fully booked
}

export function BookingCalendar({ selectedDate, onSelect, month, onMonthChange, busyDates = [] }: BookingCalendarProps) {
  const today     = startOfDay(new Date())
  const monthDays = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) })
  const startPad  = getDay(startOfMonth(month)) // 0 = Sunday

  function goBack()    { onMonthChange(subMonths(month, 1)) }
  function goForward() { onMonthChange(addMonths(month, 1)) }

  return (
    <div className="select-none">
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goBack}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-500 hover:bg-cream-dark hover:text-ink transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <h3 className="text-base font-serif text-ink">
          {format(month, 'MMMM yyyy')}
        </h3>
        <button
          onClick={goForward}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-500 hover:bg-cream-dark hover:text-ink transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-xs text-stone-400 font-medium py-1">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Leading empty cells */}
        {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}

        {monthDays.map(day => {
          const isPast      = isBefore(day, today)
          const isSelected  = selectedDate ? isSameDay(day, selectedDate) : false
          const isBusy      = busyDates.some(d => isSameDay(new Date(d), day))
          const isDisabled  = isPast || isBusy

          return (
            <button
              key={day.toISOString()}
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelect(day)}
              className={cn(
                'relative h-9 w-full rounded-lg text-sm font-medium transition-all duration-150 flex items-center justify-center',
                isSelected
                  ? 'bg-gold-400 text-white shadow-sm'
                  : isDisabled
                    ? 'text-stone-300 cursor-not-allowed'
                    : isToday(day)
                      ? 'bg-blush text-ink hover:bg-blush-dark font-semibold'
                      : 'text-ink hover:bg-cream-dark'
              )}
            >
              {format(day, 'd')}
              {/* Dot indicator for today */}
              {isToday(day) && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-400" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
