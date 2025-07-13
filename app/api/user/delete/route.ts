import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withCors } from '@/utils/cors';
import { getSupabaseAdmin } from '@/utils/supabase-admin';

export const POST = withCors(async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Note: Database dependency removed - user data deletion is now only logged
    // Previously this would delete from users and subscriptions tables
    // You can extend this to delete from your own data source if needed
    console.log('User data would be deleted:', {
      userId,
      timestamp: new Date().toISOString()
    });

    // Delete the user's auth account (this still works as it's part of Supabase Auth)
    const { error: authError } = await getSupabaseAdmin().auth.admin.deleteUser(userId);

    if (authError) {
      console.error('Auth deletion failed:', authError);
      throw authError;
    }

    console.log('User auth account deleted successfully:', userId);

    return NextResponse.json({
      status: 'success',
      message: 'User account deleted successfully'
    });
  } catch (error) {
    console.error('User deletion failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete user account',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}); 