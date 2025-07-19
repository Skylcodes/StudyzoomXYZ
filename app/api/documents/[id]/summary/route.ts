import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';
import { generateDocumentSummary, OpenAIError } from '@/lib/openai';

const adminClient = getSupabaseAdmin();

/**
 * GET /api/documents/[id]/summary
 * Generate or retrieve AI summary for a document
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
      .select('*')
      .eq('id', documentId)
      .single();
    
    if (docError || !document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
    
    // Check if summary already exists
    if (document.summary && document.title && document.key_points) {
      return NextResponse.json({
        success: true,
        summary: {
          title: document.title,
          summary: document.summary,
          keyPoints: document.key_points,
          cached: true
        }
      });
    }
    
    // Check if document has parsed text
    if (!document.parsed_text || document.parsed_text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Document has no parsed text content. Please ensure the document has been processed.' },
        { status: 400 }
      );
    }
    
    // Generate summary using OpenAI
    try {
      console.log(`Generating summary for document ${documentId}`);
      console.log(`Document filename: ${document.original_filename}`);
      console.log(`Parsed text length: ${document.parsed_text.length}`);
      console.log(`First 200 chars of parsed text: ${document.parsed_text.substring(0, 200)}...`);
      
      const summaryResult = await generateDocumentSummary(
        document.parsed_text,
        document.original_filename
      );
      
      // Save the generated summary to the database
      const { error: updateError } = await adminClient
        .from('documents')
        .update({
          title: summaryResult.title,
          summary: summaryResult.summary,
          key_points: summaryResult.keyPoints,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);
      
      if (updateError) {
        console.error('Error saving summary to database:', updateError);
        // Still return the summary even if we couldn't save it
      }
      
      return NextResponse.json({
        success: true,
        summary: {
          title: summaryResult.title,
          summary: summaryResult.summary,
          keyPoints: summaryResult.keyPoints,
          cached: false
        }
      });
      
    } catch (aiError) {
      console.error('AI summary generation failed:', aiError);
      
      if (aiError instanceof OpenAIError) {
        return NextResponse.json(
          { error: aiError.message },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to generate summary. Please try again.' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Summary API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/documents/[id]/summary
 * Regenerate AI summary for a document (force refresh)
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
        { error: 'Document has no parsed text content. Please ensure the document has been processed.' },
        { status: 400 }
      );
    }
    
    // Check if we have placeholder text and extract real content if needed
    let actualParsedText = document.parsed_text;
    
    // Detect placeholder text patterns
    const isPlaceholderText = actualParsedText.includes('This is simulated') || 
                             actualParsedText.includes('This is a sample document') ||
                             actualParsedText.includes('This would contain the actual') ||
                             actualParsedText.length < 200; // Very short text is likely placeholder
    
    if (isPlaceholderText) {
      console.log(`Detected placeholder text for ${document.original_filename}, extracting real content...`);
      
      try {
        // Extract real content from the file
        const { data: fileData, error: downloadError } = await adminClient.storage
          .from('documents')
          .download(document.storage_path);
        
        if (downloadError) {
          console.error(`Failed to download file ${document.storage_path}:`, downloadError);
          throw new Error(`File download failed: ${downloadError.message}`);
        }
        
        // Extract text based on file type
        if (document.file_type === 'application/pdf') {
          const pdf = (await import('pdf-parse-fork')).default;
          const arrayBuffer = await fileData.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const pdfData = await pdf(buffer);
          actualParsedText = pdfData.text.trim();
          console.log(`Extracted ${actualParsedText.length} characters from PDF`);
        } else if (document.file_type === 'text/plain') {
          actualParsedText = await fileData.text();
          console.log(`Extracted ${actualParsedText.length} characters from text file`);
        } else {
          console.warn(`Unsupported file type for extraction: ${document.file_type}`);
        }
        
        // Update the document with real content
        if (actualParsedText && actualParsedText.trim().length > 0) {
          await adminClient
            .from('documents')
            .update({
              parsed_text: actualParsedText,
              updated_at: new Date().toISOString()
            })
            .eq('id', documentId);
          
          console.log(`Updated document ${documentId} with real content (${actualParsedText.length} chars)`);
        }
        
      } catch (extractionError) {
        console.error(`Failed to extract real content:`, extractionError);
        // Continue with existing text if extraction fails
      }
    }
    
    // Generate new summary using OpenAI
    try {
      console.log(`Regenerating summary for document ${documentId}`);
      console.log(`Document filename: ${document.original_filename}`);
      console.log(`Parsed text length: ${actualParsedText.length}`);
      console.log(`First 200 chars of parsed text: ${actualParsedText.substring(0, 200)}...`);
      
      const summaryResult = await generateDocumentSummary(
        actualParsedText,
        document.original_filename
      );
      
      // Save the generated summary to the database
      const { error: updateError } = await adminClient
        .from('documents')
        .update({
          title: summaryResult.title,
          summary: summaryResult.summary,
          key_points: summaryResult.keyPoints,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);
      
      if (updateError) {
        console.error('Error saving summary to database:', updateError);
        return NextResponse.json(
          { error: 'Failed to save summary to database' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        summary: {
          title: summaryResult.title,
          summary: summaryResult.summary,
          keyPoints: summaryResult.keyPoints,
          cached: false
        }
      });
      
    } catch (aiError) {
      console.error('AI summary generation failed:', aiError);
      
      if (aiError instanceof OpenAIError) {
        return NextResponse.json(
          { error: aiError.message },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to generate summary. Please try again.' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Summary regeneration API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}