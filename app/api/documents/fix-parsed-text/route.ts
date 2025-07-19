import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';

const adminClient = getSupabaseAdmin();

/**
 * POST /api/documents/fix-parsed-text
 * Fix documents that don't have parsed_text by adding demo content
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Fix parsed text API called');
    
    // Get the request body to check for specific document ID
    const body = await request.json().catch(() => ({}));
    const { documentId } = body;
    
    let query = adminClient
      .from('documents')
      .select('*')
      .eq('status', 'ready')
      .or('parsed_text.is.null,parsed_text.eq.""');
    
    // If specific document ID is provided, filter by it
    if (documentId) {
      query = query.eq('id', documentId);
    }
    
    const { data: documents, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching documents:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch documents: ' + fetchError.message },
        { status: 500 }
      );
    }

    console.log(`Found ${documents?.length || 0} documents to fix`);

    if (!documents || documents.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No documents need fixing',
        updatedCount: 0
      });
    }

    // Extract text from each document
    const updates = [];
    
    for (const doc of documents) {
      console.log(`Processing document: ${doc.original_filename}`);
      
      let extractedText = '';
      
      try {
        // Get the file from Supabase storage
        const { data: fileData, error: downloadError } = await adminClient.storage
          .from('documents')
          .download(doc.storage_path);
        
        if (downloadError) {
          console.error(`Failed to download file ${doc.storage_path}:`, downloadError);
          extractedText = `Failed to download file: ${downloadError.message}`;
        } else {
          // Extract text based on file type
          if (doc.file_type === 'application/pdf') {
            try {
              const pdf = (await import('pdf-parse-fork')).default;
              const arrayBuffer = await fileData.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              const pdfData = await pdf(buffer);
              extractedText = pdfData.text.trim();
              console.log(`Extracted ${extractedText.length} characters from PDF`);
              console.log(`First 500 characters: ${extractedText.substring(0, 500)}...`);
              console.log(`PDF pages: ${pdfData.numpages}`);
            } catch (pdfError) {
              console.error(`PDF parsing error for ${doc.original_filename}:`, pdfError);
              extractedText = `PDF parsing failed: ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}`;
            }
          } else if (doc.file_type === 'text/plain') {
            try {
              extractedText = await fileData.text();
            } catch (textError) {
              console.error(`Text extraction error for ${doc.original_filename}:`, textError);
              extractedText = `Text extraction failed: ${textError instanceof Error ? textError.message : 'Unknown error'}`;
            }
          } else {
            extractedText = `Unsupported file type: ${doc.file_type}. Please convert to PDF or text format for AI processing.`;
          }
        }
        
        // Fallback to demo text if extraction failed or returned empty
        if (!extractedText || extractedText.trim().length === 0) {
          extractedText = `This is a sample document: ${doc.original_filename}. 

This document contains study material that has been uploaded to StudyZoomX. In a real implementation, this would contain the actual extracted text from the document using OCR or text extraction.

Key topics covered:
- Document processing and text extraction
- AI-powered summaries and key points
- Interactive document chat functionality
- Study material organization and management

This demo text allows you to test all the AI features including:
1. AI Summary generation
2. Key points extraction
3. Document-specific chatbot
4. Question answering about the content

You can ask questions like:
- "What are the main topics in this document?"
- "Summarize the key points"
- "What is this document about?"
- "Create a quiz based on this content"

The AI will respond based on this content and provide helpful study assistance.`;
        }
        
      } catch (error) {
        console.error(`Error processing document ${doc.id}:`, error);
        extractedText = `Error processing document: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
      
      updates.push({
        id: doc.id,
        parsed_text: extractedText,
        title: doc.original_filename.replace(/\.[^/.]+$/, '')
      });
    }

    // Update all documents
    let successCount = 0;
    const errors = [];
    
    for (const update of updates) {
      console.log(`Updating document ${update.id}...`);
      
      const { error: updateError } = await adminClient
        .from('documents')
        .update({
          parsed_text: update.parsed_text,
          title: update.title
        })
        .eq('id', update.id);

      if (!updateError) {
        successCount++;
        console.log(`Successfully updated document ${update.id}`);
      } else {
        console.error(`Failed to update document ${update.id}:`, updateError);
        errors.push(`Document ${update.id}: ${updateError.message}`);
      }
    }

    console.log(`Update complete: ${successCount}/${documents.length} documents updated`);

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${successCount} documents`,
      updatedCount: successCount,
      totalFound: documents.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Fix parsed text API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}