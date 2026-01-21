import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    await supabase.auth.signOut()

    const cookieStore = await cookies()
    
    // Clear all Supabase related cookies
    const cookieNames = [
      'sb-access-token',
      'sb-refresh-token',
      `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`
    ]

    cookieNames.forEach(name => {
      cookieStore.delete(name)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}

export async function GET() {
  // Redirect to home page after clearing cookies
  const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
  
  response.cookies.delete('sb-access-token')
  response.cookies.delete('sb-refresh-token')
  
  return response
}
