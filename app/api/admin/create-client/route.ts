import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

// POST /api/admin/create-client
// Creates a new Supabase Auth user + client row using the service role key
// ONLY accessible by admins (verified server-side)

export async function POST(request: Request) {
  const supabase      = createClient()
  const adminSupabase = createAdminClient()

  // Verify the caller is an admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Parse body
  const { full_name, email, password, wedding_date, package_type, notes } = await request.json()

  if (!full_name || !email || !password) {
    return NextResponse.json({ error: 'full_name, email, and password are required' }, { status: 422 })
  }

  // Create the auth user with the service role (bypasses email confirmation)
  const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { full_name },
    email_confirm: true,  // auto-confirm so client can log in immediately
  })

  if (createError || !newUser.user) {
    return NextResponse.json({ error: createError?.message ?? 'Failed to create user' }, { status: 500 })
  }

  // The DB trigger creates the profiles row automatically.
  // Now create the clients row.
  const { data: client, error: clientError } = await adminSupabase
    .from('clients')
    .insert({
      user_id:      newUser.user.id,
      wedding_date: wedding_date || null,
      package_type: package_type || null,
      notes:        notes || null,
      created_by:   user.id,
    })
    .select()
    .single()

  if (clientError) {
    // Clean up the auth user if client row creation fails
    await adminSupabase.auth.admin.deleteUser(newUser.user.id)
    return NextResponse.json({ error: clientError.message }, { status: 500 })
  }

  return NextResponse.json({ user: newUser.user, client }, { status: 201 })
}
