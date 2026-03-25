'use client'
import { useState } from 'react'
import { format, startOfMonth } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '@/components/layout/Logo'
import { BookingCalendar } from '@/components/booking/BookingCalendar'
import { TimeSlotPicker } from '@/components/booking/TimeSlotPicker'
import { BookingForm } from '@/components/booking/BookingForm'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import type { TimeSlot } from '@/types/database'

type Step = 'calendar' | 'form' | 'success'

export default function BookPage() {
  const [step,          setStep]         = useState<Step>('calendar')
  const [month,         setMonth]        = useState(startOfMonth(new Date()))
  const [selectedDate,  setSelectedDate] = useState<Date | null>(null)
  const [slots,         setSlots]        = useState<TimeSlot[]>([])
  const [slotsLoading,  setSlotsLoading] = useState(false)
  const [selectedSlot,  setSelectedSlot] = useState<TimeSlot | null>(null)

  async function fetchSlots(date: Date) {
    setSelectedDate(date)
    setSelectedSlot(null)
    setSlotsLoading(true)
    const dateStr = format(date, 'yyyy-MM-dd')
    const res  = await fetch(`/api/bookings/availability?date=${dateStr}`)
    const data = await res.json()
    setSlots(data.slots ?? [])
    setSlotsLoading(false)
  }

  function handleSlotSelect(slot: TimeSlot) {
    setSelectedSlot(slot)
  }

  function handleProceed() {
    if (selectedSlot) setStep('form')
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      {/* Radial gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(201,169,110,0.07),transparent)]" />

      <div className="max-w-lg mx-auto relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <Logo size="lg" />
        </div>

        <AnimatePresence mode="wait">
          {step === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-10 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={28} className="text-emerald-500" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-serif text-ink mb-2">You&rsquo;re all set!</h2>
              <p className="text-stone-500 text-sm leading-relaxed">
                Your session has been booked. Check your inbox for a confirmation email.
                We look forward to seeing you!
              </p>
              <button
                onClick={() => { setStep('calendar'); setSelectedDate(null); setSelectedSlot(null); setSlots([]) }}
                className="mt-8 text-sm text-gold-500 hover:text-gold-600 transition-colors"
              >
                Book another session
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="booking"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="card p-6 sm:p-8"
            >
              <div className="mb-7">
                {step === 'form' && (
                  <button
                    onClick={() => setStep('calendar')}
                    className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 mb-4 transition-colors"
                  >
                    <ArrowLeft size={14} /> Change time
                  </button>
                )}
                <h1 className="text-2xl font-serif text-ink">
                  {step === 'calendar' ? 'Book a session' : 'Your details'}
                </h1>
                <p className="text-sm text-stone-500 mt-1">
                  {step === 'calendar'
                    ? 'Pick a date and time that works for you.'
                    : 'Almost there — just a few details.'
                  }
                </p>
              </div>

              {/* Gold divider */}
              <div className="flex items-center gap-3 mb-7">
                <div className="flex-1 h-px bg-gold-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                <div className="flex-1 h-px bg-gold-200" />
              </div>

              {step === 'calendar' && (
                <div className="flex flex-col gap-6">
                  <BookingCalendar
                    selectedDate={selectedDate}
                    onSelect={fetchSlots}
                    month={month}
                    onMonthChange={setMonth}
                  />

                  {selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-4"
                    >
                      <div>
                        <p className="section-label mb-3">
                          Available times · {format(selectedDate, 'MMMM d')}
                        </p>
                        <TimeSlotPicker
                          slots={slots}
                          selected={selectedSlot?.start ?? null}
                          onSelect={handleSlotSelect}
                          loading={slotsLoading}
                        />
                      </div>

                      {selectedSlot && (
                        <motion.button
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={handleProceed}
                          className="w-full h-12 rounded-xl bg-gold-400 text-white font-medium hover:bg-gold-500 transition-colors"
                        >
                          Continue with {format(new Date(selectedSlot.start), 'h:mm a')}
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {step === 'form' && selectedDate && selectedSlot && (
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <BookingForm
                    selectedDate={selectedDate}
                    selectedSlot={selectedSlot}
                    onSuccess={() => setStep('success')}
                    onBack={() => setStep('calendar')}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-stone-400 mt-6">
          Confirmation will be sent to your email automatically.
        </p>
      </div>
    </div>
  )
}
