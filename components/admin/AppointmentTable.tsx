'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import type { Appointment, AppointmentStatus } from '@/types/database'

const statusConfig: Record<AppointmentStatus, { variant: any; label: string }> = {
  pending:   { variant: 'gold',  label: 'Pending'   },
  confirmed: { variant: 'green', label: 'Confirmed' },
  cancelled: { variant: 'red',   label: 'Cancelled' },
  completed: { variant: 'grey',  label: 'Completed' },
}

const typeLabel: Record<string, string> = {
  consultation:   'Consultation',
  review_session: 'Review Session',
  other:          'Other',
}

interface AppointmentTableProps {
  appointments: Appointment[]
}

export function AppointmentTable({ appointments: initial }: AppointmentTableProps) {
  const [appointments, setAppointments] = useState(initial)
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()

  async function updateStatus(id: string, status: AppointmentStatus) {
    setLoading(id)
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)

    if (!error) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    }
    setLoading(null)
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-400 text-sm">No appointments yet.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {appointments.map(appt => {
        const { variant, label } = statusConfig[appt.status]
        return (
          <div key={appt.id} className="card p-5 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium text-ink">
                  {appt.booked_by_name ?? 'Unknown'}
                </p>
                <Badge variant={variant}>{label}</Badge>
                <span className="text-xs text-stone-400">
                  {typeLabel[appt.appointment_type] ?? appt.appointment_type}
                </span>
              </div>
              <p className="text-sm text-stone-500 mt-1">
                {format(new Date(appt.start_time), 'EEE, MMM d yyyy · h:mm a')}
                {' '}–{' '}
                {format(new Date(appt.end_time), 'h:mm a')}
              </p>
              {appt.booked_by_email && (
                <p className="text-xs text-stone-400 mt-0.5">{appt.booked_by_email}</p>
              )}
              {appt.notes && (
                <p className="text-xs text-stone-500 mt-1 italic border-l-2 border-gold-300 pl-2">
                  {appt.notes}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1.5 shrink-0">
              {appt.status === 'pending' && (
                <Button
                  size="sm"
                  variant="gold"
                  loading={loading === appt.id}
                  onClick={() => updateStatus(appt.id, 'confirmed')}
                >
                  Confirm
                </Button>
              )}
              {['pending', 'confirmed'].includes(appt.status) && (
                <Button
                  size="sm"
                  variant="ghost"
                  loading={loading === appt.id}
                  onClick={() => updateStatus(appt.id, 'cancelled')}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  Cancel
                </Button>
              )}
              {appt.status === 'confirmed' && (
                <Button
                  size="sm"
                  variant="ghost"
                  loading={loading === appt.id}
                  onClick={() => updateStatus(appt.id, 'completed')}
                >
                  Mark done
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
