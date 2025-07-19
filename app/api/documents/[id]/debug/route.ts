import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';

const adminClient = getSupabaseAdmin();

/**
 * GET /api/documents/[id]/debug
 * Debug endpoint to check document content in database
 */
export async function GET(
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
    
    // Get the document with all fields
    const { data: document, error: docError } = await adminClient
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();
    
    if (docError || !document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
    
    // Return debug information
    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        original_filename: document.original_filename,
        file_type: document.file_type,
        file_size: document.file_size,
        file_path: document.file_path,
        status: document.status,
        title: document.title,
        summary: document.summary,
        key_points: document.key_points,
        parsed_text_length: document.parsed_text ? document.parsed_text.length : 0,
        parsed_text_preview: document.parsed_text ? document.parsed_text.substring(0, 500) : null,
        has_parsed_text: !!document.parsed_text,
        created_at: document.created_at,
        updated_at: document.updated_at,
        metadata: document.metadata
      }
    });
    
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}