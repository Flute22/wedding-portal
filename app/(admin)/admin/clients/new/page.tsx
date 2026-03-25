'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
export default function NewClientPage() {
  const router = useRouter()

  const [fullName,     setFullName]     = useState('')
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [weddingDate,  setWeddingDate]  = useState('')
  const [packageType,  setPackageType]  = useState('')
  const [notes,        setNotes]        = useState('')
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/create-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name:    fullName,
          email,
          password,
          wedding_date: weddingDate  || undefined,
          package_type: packageType  || undefined,
          notes:        notes        || undefined,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to create client')

      router.push('/admin/clients')
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-8 py-10 max-w-xl">
      <Link href="/admin/clients" className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 mb-6">
        <ArrowLeft size={14} /> Back to clients
      </Link>

      <div className="mb-8">
        <p className="section-label mb-1">New account</p>
        <h1 className="text-3xl font-serif text-ink">Create Client</h1>
        <p className="text-sm text-stone-500 mt-1">
          The client will receive an email to confirm their account.
        </p>
      </div>

      <div className="card p-7">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Full name"
            type="text"
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Emma & James Smith"
          />
          <Input
            label="Email address"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="client@email.com"
          />
          <Input
            label="Temporary password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
          />
          <Input
            label="Wedding date (optional)"
            type="date"
            value={weddingDate}
            onChange={e => setWeddingDate(e.target.value)}
          />
          <Input
            label="Package type (optional)"
            type="text"
            value={packageType}
            onChange={e => setPackageType(e.target.value)}
            placeholder="e.g. Full Day Coverage"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-widest uppercase text-stone-600">Notes (internal, hidden from client)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any internal notes about this client…"
              rows={3}
              className="w-full rounded-xl border border-cream-dark bg-white px-4 py-3 text-sm text-ink placeholder:text-stone-400 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 resize-none transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
          )}

          <Button type="submit" variant="gold" size="lg" loading={loading} className="w-full mt-1">
            Create client account
          </Button>
        </form>
      </div>

    </div>
  )
}
