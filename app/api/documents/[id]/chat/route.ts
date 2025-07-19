import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';
import { generateChatbotResponse, OpenAIError } from '@/lib/openai';

const adminClient = getSupabaseAdmin();

/**
 * POST /api/documents/[id]/chat
 * Send a message to the document-specific chatbot
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
    
    const body = await request.json();
    const { message } = body;
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      );
    }
    
    // Validate message length (prevent extremely long messages)
    if (message.length > 1000) {
      return NextResponse.json(
        { error: 'Message too long. Please keep messages under 1000 characters.' },
        { status: 400 }
      );
    }
    
    // Get the document with current user access check
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
    
    // Check if document has parsed text
    if (!document.parsed_text || document.parsed_text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Document has no parsed text content. Please ensure the document has been processed before chatting.' },
        { status: 400 }
      );
    }
    
    // Get document title (fallback to filename if not set)
    const documentTitle = document.title || document.original_filename;
    
    // Generate chatbot response using OpenAI
    try {
      console.log(`Generating chatbot response for document ${documentId}`);
      console.log(`Message: ${message.trim()}`);
      console.log(`Document title: ${documentTitle}`);
      console.log(`Parsed text length: ${document.parsed_text.length}`);
      console.log(`First 200 chars of parsed text: ${document.parsed_text.substring(0, 200)}...`);
      
      const response = await generateChatbotResponse(
        message.trim(),
        documentTitle,
        document.parsed_text
      );
      
      return NextResponse.json({
        success: true,
        response: response,
        documentTitle: documentTitle
      });
      
    } catch (aiError) {
      console.error('AI chatbot response failed:', aiError);
      
      if (aiError instanceof OpenAIError) {
        return NextResponse.json(
          { error: aiError.message },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to generate response. Please try again.' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/documents/[id]/chat
 * Get chat context information for a document
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
    
    // Get the document with current user access check
    const { data: document, error: docError } = await adminClient
      .from('documents')
      .select('id, title, original_filename, parsed_text, status')
      .eq('id', documentId)
      .single();
    
    if (docError || !document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
    
    // Check if document is ready for chatting
    const canChat = document.status === 'ready' && 
                   document.parsed_text && 
                   document.parsed_text.trim().length > 0;
    
    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        title: document.title || document.original_filename,
        canChat: canChat,
        status: document.status,
        hasContent: !!document.parsed_text?.trim()
      }
    });
    
  } catch (error) {
    console.error('Chat context API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}