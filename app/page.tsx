import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Root page — redirect based on auth state and role
export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'admin') {
    redirect('/admin/dashboard')
  }

  redirect('/dashboard')
}
