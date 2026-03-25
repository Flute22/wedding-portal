import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateDaySlots } from '@/lib/utils/availability'

export const dynamic = 'force-dynamic'

// GET /api/bookings/availability?date=YYYY-MM-DD
// Public endpoint — no auth required (needed for public booking page)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: 'Invalid or missing date parameter (expected YYYY-MM-DD)' },
      { status: 400 }
    )
  }

  // Use a fresh supabase client (no user session needed for reading public data)
  const supabase = createClient()

  const dayStart = new Date(`${date}T00:00:00Z`)
  const dayEnd   = new Date(`${date}T23:59:59Z`)

  const [{ data: appts }, { data: blocks }] = await Promise.all([
    supabase
      .from('appointments')
      .select('start_time, end_time')
      .gte('start_time', dayStart.toISOString())
      .lte('start_time', dayEnd.toISOString())
      .not('status', 'eq', 'cancelled'),
    supabase
      .from('availability_blocks')
      .select('start_time, end_time')
      .gte('start_time', dayStart.toISOString())
      .lte('start_time', dayEnd.toISOString()),
  ])

  const busyRanges = [
    ...(appts  ?? []).map(a => ({ start: new Date(a.start_time), end: new Date(a.end_time) })),
    ...(blocks ?? []).map(b => ({ start: new Date(b.start_time), end: new Date(b.end_time) })),
  ]

  const slots = generateDaySlots(date, busyRanges)

  return NextResponse.json({ slots })
}
