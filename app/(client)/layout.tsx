import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ClientNav } from '@/components/layout/ClientNav'

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="flex min-h-screen bg-cream">
      <ClientNav />
      <main className="flex-1 ml-60 min-h-screen">
        {children}
      </main>
    </div>
  )
}
