import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/email/resend'
import { BookingConfirmation } from '@/lib/email/templates/BookingConfirmation'

export const dynamic = 'force-dynamic'

interface BookingPayload {
  start_time:       string
  end_time:         string
  appointment_type: 'consultation' | 'review_session' | 'other'
  name:             string
  email:            string
  notes?:           string
}

export async function POST(request: Request) {
  let body: BookingPayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { start_time, end_time, appointment_type, name, email, notes } = body

  // Validate required fields
  if (!start_time || !end_time || !appointment_type || !name || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 422 })
  }

  // Validate appointment_type enum
  const validTypes = ['consultation', 'review_session', 'other']
  if (!validTypes.includes(appointment_type)) {
    return NextResponse.json({ error: 'Invalid appointment_type' }, { status: 422 })
  }

  // Validate that end > start
  if (new Date(end_time) <= new Date(start_time)) {
    return NextResponse.json({ error: 'end_time must be after start_time' }, { status: 422 })
  }

  // Prevent bookings in the past
  if (new Date(start_time) < new Date()) {
    return NextResponse.json({ error: 'Cannot book a time in the past' }, { status: 422 })
  }

  const supabase = createClient()

  const { data: appt, error } = await supabase
    .from('appointments')
    .insert({
      start_time,
      end_time,
      appointment_type,
      status:         'pending',
      booked_by_name:  name,
      booked_by_email: email,
      notes:          notes ?? null,
    })
    .select()
    .single()

  if (error) {
    // PostgreSQL exclusion constraint violation = double-booking
    if (error.code === '23P01') {
      return NextResponse.json(
        { error: 'That time slot was just taken. Please choose another time.' },
        { status: 409 }
      )
    }
    console.error('appointments insert error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }

  // Send confirmation emails (non-blocking — don't fail if email fails)
  try {
    await Promise.all([
      // Client confirmation
      resend.emails.send({
        from:    FROM_EMAIL,
        to:      email,
        subject: `Your session is confirmed — ${appointment_type.replace('_', ' ')}`,
        react:   BookingConfirmation({ name, start_time, appointment_type, isClient: true, notes }),
      }),
      // Admin notification
      ADMIN_EMAIL && resend.emails.send({
        from:    FROM_EMAIL,
        to:      ADMIN_EMAIL,
        subject: `New booking: ${name} — ${appointment_type.replace('_', ' ')}`,
        react:   BookingConfirmation({ name, start_time, appointment_type, isClient: false, notes }),
      }),
    ].filter(Boolean))
  } catch (emailErr) {
    // Log but don't fail the booking
    console.error('Email send error (non-fatal):', emailErr)
  }

  return NextResponse.json({ appointment: appt }, { status: 201 })
}
