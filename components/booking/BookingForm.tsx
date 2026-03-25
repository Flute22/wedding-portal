'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { TimeSlot } from '@/types/database'

const TYPE_OPTIONS = [
  { value: 'consultation',   label: 'Initial Consultation' },
  { value: 'review_session', label: 'Video Review Session' },
  { value: 'other',          label: 'Other'                },
]

interface BookingFormProps {
  selectedDate: Date
  selectedSlot: TimeSlot
  onSuccess:    () => void
  onBack:       () => void
}

export function BookingForm({ selectedDate, selectedSlot, onSuccess, onBack }: BookingFormProps) {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [type,    setType]    = useState('consultation')
  const [notes,   setNotes]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/bookings/create', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        start_time:       selectedSlot.start,
        end_time:         selectedSlot.end,
        appointment_type: type,
        name,
        email,
        notes: notes || undefined,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Selected time recap */}
      <div className="bg-gold-50 border border-gold-200 rounded-xl p-4">
        <p className="text-xs text-stone-500 tracking-widest uppercase mb-1">Your selected time</p>
        <p className="text-base font-serif text-ink">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </p>
        <p className="text-sm text-stone-500">
          {format(new Date(selectedSlot.start), 'h:mm a')} – {format(new Date(selectedSlot.end), 'h:mm a')}
        </p>
      </div>

      {/* Session type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs tracking-widest uppercase text-stone-600">Session type</label>
        <div className="flex gap-2 flex-wrap">
          {TYPE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-all ${
                type === opt.value
                  ? 'bg-gold-400 text-white border-gold-400'
                  : 'bg-white border-cream-dark text-stone-600 hover:border-gold-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Your full name"
        type="text"
        required
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Emma & James"
      />

      <Input
        label="Email address"
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@email.com"
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs tracking-widest uppercase text-stone-600">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Any specific questions or preferences…"
          rows={3}
          className="w-full rounded-xl border border-cream-dark bg-white px-4 py-3 text-sm text-ink placeholder:text-stone-400 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 resize-none transition-colors"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 h-11 rounded-xl border border-cream-dark text-stone-600 text-sm hover:bg-cream-dark transition-colors"
        >
          Back
        </button>
        <Button type="submit" variant="gold" size="md" loading={loading} className="flex-1">
          Confirm booking
        </Button>
      </div>

      <p className="text-xs text-stone-400 text-center">
        A confirmation email will be sent to your address.
      </p>
    </form>
  )
}
