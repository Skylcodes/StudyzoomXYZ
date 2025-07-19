import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';

const adminClient = getSupabaseAdmin();

/**
 * POST /api/documents/[id]/clear-cache
 * Clear existing summary data to force regeneration from real content
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params;
    
    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }
    
    // Clear existing summary data
    const { error: updateError } = await adminClient
      .from('documents')
      .update({
        title: null,
        summary: null,
        key_points: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId);
    
    if (updateError) {
      console.error('Error clearing summary cache:', updateError);
      return NextResponse.json(
        { error: 'Failed to clear summary cache' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Summary cache cleared successfully'
    });
    
  } catch (error) {
    console.error('Clear cache API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}