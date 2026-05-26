import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function DELETE() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const uid = session.user.id

  // Delete all user data manually (belt + suspenders with cascade)
  await Promise.all([
    supabase.from('training_logs').delete().eq('user_id', uid),
    supabase.from('routine_logs').delete().eq('user_id', uid),
  ])
  await Promise.all([
    supabase.from('training_goals').delete().eq('user_id', uid),
    supabase.from('routines').delete().eq('user_id', uid),
    supabase.from('reminders').delete().eq('user_id', uid),
    supabase.from('sitter_guides').delete().eq('user_id', uid),
    supabase.from('documents').delete().eq('user_id', uid),
  ])
  await supabase.from('dogs').delete().eq('owner_id', uid)

  // Delete storage files
  const { data: files } = await supabase.storage.from('documents').list(uid)
  if (files && files.length > 0) {
    await supabase.storage.from('documents').remove(files.map(f => `${uid}/${f.name}`))
  }

  // Delete the auth user — requires service role key
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (serviceKey) {
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    await admin.auth.admin.deleteUser(uid)
  }

  return NextResponse.json({ success: true })
}
