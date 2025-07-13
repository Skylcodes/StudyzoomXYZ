import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('AuthCallback: Processing callback');
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');

  if (code) {
    console.log('AuthCallback: Exchanging code for session');
    const supabase = createRouteHandlerClient({ cookies });
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('AuthCallback: Error:', error);
      return NextResponse.redirect(new URL('/login?error=auth-failed', requestUrl.origin));
    }

    // Check if user has a profile in the users table
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    if (userId) {
      // Check if user has a profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        // User doesn't have a profile, redirect to onboarding
        console.log('AuthCallback: User needs profile, redirecting to onboarding');
        const nextPath = next ? encodeURIComponent(next) : encodeURIComponent('/dashboard');
        return NextResponse.redirect(new URL(`/onboarding?next=${nextPath}`, requestUrl.origin));
      }
    }

    // Redirect to the next page if provided, otherwise go to dashboard
    if (next) {
      console.log('AuthCallback: Redirecting to:', next);
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }

    console.log('AuthCallback: Success, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
  }

  console.log('AuthCallback: No code present, redirecting to login');
  return NextResponse.redirect(new URL('/login', requestUrl.origin));
} 