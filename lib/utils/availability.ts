import { addMinutes } from 'date-fns'
import type { TimeSlot } from '@/types/database'

export const SLOT_DURATION_MINUTES = 60
export const WORK_START_HOUR = 9
export const WORK_END_HOUR = 18

interface BusyRange {
  start: Date
  end: Date
}

export function generateDaySlots(
  dateStr: string,         // YYYY-MM-DD
  busyRanges: BusyRange[]
): TimeSlot[] {
  const pad = (n: number) => String(n).padStart(2, '0')
  const dayStart = new Date(`${dateStr}T${pad(WORK_START_HOUR)}:00:00`)
  const dayEnd   = new Date(`${dateStr}T${pad(WORK_END_HOUR)}:00:00`)

  const slots: TimeSlot[] = []
  let cursor = new Date(dayStart)

  while (cursor < dayEnd) {
    const slotEnd = addMinutes(cursor, SLOT_DURATION_MINUTES)
    const isBusy = busyRanges.some(
      range => cursor < range.end && slotEnd > range.start
    )
    slots.push({
      start: cursor.toISOString(),
      end:   slotEnd.toISOString(),
      available: !isBusy,
    })
    cursor = slotEnd
  }

  return slots
}
