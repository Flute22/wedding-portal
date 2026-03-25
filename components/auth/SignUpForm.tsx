'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function SignUpForm() {
  const supabase = createClient()

  const [fullName,        setFullName]        = useState('')
  const [email,           setEmail]           = useState('')
  const [password,        setPassword]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error,           setError]           = useState('')
  const [loading,         setLoading]         = useState(false)
  const [success,         setSuccess]         = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-gold-100 border border-gold-300 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✉️</span>
        </div>
        <h2 className="text-xl font-serif text-ink mb-2">Check your inbox</h2>
        <p className="text-sm text-stone-500">
          We&rsquo;ve sent a confirmation link to <strong>{email}</strong>.
          <br />
          Please verify your email to sign in.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-gold-500 hover:text-gold-600"
        >
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <Input
        label="Full name"
        type="text"
        autoComplete="name"
        required
        value={fullName}
        onChange={e => setFullName(e.target.value)}
        placeholder="Jane Doe"
      />

      <Input
        label="Email address"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@email.com"
      />

      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="••••••••"
      />

      <Input
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        required
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        placeholder="••••••••"
        error={error}
      />

      <Button
        type="submit"
        variant="gold"
        size="lg"
        loading={loading}
        className="mt-2 w-full"
      >
        Create account
      </Button>
    </form>
  )
}
