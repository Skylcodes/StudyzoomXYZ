import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';

const adminClient = getSupabaseAdmin();

/**
 * POST /api/documents/[id]/reprocess
 * Force reprocessing of a document to extract real content
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
    
    // Get the document
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
    
    // Clear existing AI content and reset status
    const { error: updateError } = await adminClient
      .from('documents')
      .update({
        status: 'processing',
        title: null,
        summary: null,
        key_points: null,
        parsed_text: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId);
    
    if (updateError) {
      console.error('Error updating document:', updateError);
      return NextResponse.json(
        { error: 'Failed to reset document' },
        { status: 500 }
      );
    }
    
    // Trigger reprocessing
    const jobType = document.file_type === 'application/pdf' ? 'ocr' : 'text_extraction';
    
    const processResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/documents/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentId,
        jobType
      })
    });
    
    if (!processResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to start reprocessing' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Document reprocessing started',
      documentId,
      jobType
    });
    
  } catch (error) {
    console.error('Reprocess API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}