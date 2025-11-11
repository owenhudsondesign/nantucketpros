import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  console.log('Auth callback received, code:', code ? 'present' : 'missing')

  if (code) {
    const supabase = await createClient()

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_failed`)
    }

    if (!data.user) {
      console.error('No user data after code exchange')
      return NextResponse.redirect(`${origin}/login?error=no_user`)
    }

    console.log('User authenticated:', data.user.email)

    // Check if user profile exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', data.user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is fine
      console.error('Error fetching user profile:', fetchError)
    }

    if (!existingUser) {
      console.log('Creating new user profile')
      // Create user profile from metadata
      const role = data.user.user_metadata.role || 'homeowner'
      const fullName = data.user.user_metadata.full_name || null

      // @ts-expect-error - Supabase type inference issue with insert
      const { error: insertError } = await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email!,
        role: role,
        full_name: fullName,
      })

      if (insertError) {
        console.error('Error creating user profile:', insertError)
        return NextResponse.redirect(`${origin}/login?error=profile_creation_failed`)
      }

      // Redirect based on the new role
      switch (role) {
        case 'vendor':
          return NextResponse.redirect(`${origin}/vendor/dashboard`)
        case 'admin':
          return NextResponse.redirect(`${origin}/admin/dashboard`)
        default:
          return NextResponse.redirect(`${origin}/homeowner/dashboard`)
      }
    } else {
      // Existing user - redirect based on their role
      console.log('Existing user, role:', existingUser.role)
      switch (existingUser.role) {
        case 'vendor':
          return NextResponse.redirect(`${origin}/vendor/dashboard`)
        case 'admin':
          return NextResponse.redirect(`${origin}/admin/dashboard`)
        default:
          return NextResponse.redirect(`${origin}/homeowner/dashboard`)
      }
    }
  }

  // No code provided
  console.error('No code in callback URL')
  return NextResponse.redirect(`${origin}/login?error=no_code`)
}
