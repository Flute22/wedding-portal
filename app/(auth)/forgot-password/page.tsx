'use client'
import { useState } from 'react'
import { Logo } from '@/components/layout/Logo'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Logo size="lg" href="/login" />
        </div>

        <div className="card p-8 sm:p-10">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-gold-100 border border-gold-300 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✉️</span>
              </div>
              <h1 className="text-xl font-serif text-ink mb-2">Check your inbox</h1>
              <p className="text-sm text-stone-500">
                If <strong>{email}</strong> has an account, you'll receive a reset link shortly.
              </p>
              <Link href="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm text-gold-500 hover:text-gold-600">
                <ArrowLeft size={14} /> Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-serif text-ink mb-2">Reset password</h1>
              <p className="text-sm text-stone-500 mb-8">Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Input
                  label="Email address"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com"
                />
                <Button type="submit" variant="gold" size="lg" loading={loading} className="w-full">
                  Send reset link
                </Button>
              </form>
              <Link href="/login" className="mt-5 flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600">
                <ArrowLeft size={14} /> Back to sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
