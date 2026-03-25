'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function LoginForm() {
  const router      = useRouter()
  const params      = useSearchParams()
  const redirectTo  = params.get('redirectTo') ?? '/'
  const supabase    = createClient()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Incorrect email or password. Please try again.')
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <Input
        label="Email address"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@email.com"
      />

      <div className="flex flex-col gap-1.5">
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          error={error}
        />
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs text-gold-500 hover:text-gold-600 transition-colors">
            Forgot password?
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        variant="gold"
        size="lg"
        loading={loading}
        className="mt-2 w-full"
      >
        Sign in to your portal
      </Button>
    </form>
  )
}
