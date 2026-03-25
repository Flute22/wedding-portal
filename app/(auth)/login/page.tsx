import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/layout/Logo'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = { title: 'Sign In' }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(201,169,110,0.08),transparent)]" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <Logo size="lg" href="/login" />
        </div>

        {/* Card */}
        <div className="card p-8 sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-serif text-ink">Welcome back</h1>
            <p className="text-sm text-stone-500 mt-1.5 font-sans">
              Sign in to view your private gallery &amp; bookings
            </p>
          </div>

          {/* Gold divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-gold-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            <div className="flex-1 h-px bg-gold-200" />
          </div>

          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

      </div>
    </div>
  )
}
