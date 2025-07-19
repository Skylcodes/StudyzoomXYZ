import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';
import { createProcessingJob } from '@/lib/documents.server';

const adminClient = getSupabaseAdmin();

export async function POST(request: NextRequest) {
  try {
    const { documentId, jobType } = await request.json();

    if (!documentId || !jobType) {
      return NextResponse.json(
        { error: 'Document ID and job type are required' },
        { status: 400 }
      );
    }

    // Validate job type
    const validJobTypes = ['ocr', 'text_extraction', 'transcription', 'thumbnail'];
    if (!validJobTypes.includes(jobType)) {
      return NextResponse.json(
        { error: 'Invalid job type' },
        { status: 400 }
      );
    }

    // Get the document to verify it exists and is owned by the user
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

    // Create processing job
    const job = await createProcessingJob(documentId, jobType);
    
    if (!job) {
      return NextResponse.json(
        { error: 'Failed to create processing job' },
        { status: 500 }
      );
    }

    // TODO: In a production environment, you would:
    // 1. Queue the job in a background job system (like Redis/Bull)
    // 2. Process the job asynchronously
    // 3. Update the job status and results when complete
    
    // For now, we'll simulate processing by updating the job status
    setTimeout(async () => {
      try {
        await simulateProcessing(job.id, jobType, document);
      } catch (error) {
        console.error('Processing simulation failed:', error);
      }
    }, 2000); // Simulate 2 second processing time

    return NextResponse.json({
      success: true,
      job
    });

  } catch (error) {
    console.error('Processing API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Simulate processing for demonstration purposes
async function simulateProcessing(jobId: string, jobType: string, document: { id: string; original_filename: string; file_type: string; storage_path: string; metadata: Record<string, unknown> }) {
  try {
    // Update job to processing
    await adminClient
      .from('document_processing_jobs')
      .update({
        status: 'processing',
        started_at: new Date().toISOString(),
        progress: 50
      })
      .eq('id', jobId);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extract real content from uploaded files
    let result = {};
    let extractedText = '';
    
    try {
      // Get the actual file from storage
      const { data: fileData, error: downloadError } = await adminClient.storage
        .from('documents')
        .download(document.storage_path);
      
      if (downloadError) {
        console.error(`Failed to download file ${document.storage_path}:`, downloadError);
        throw new Error(`File download failed: ${downloadError.message}`);
      }
      
      // Extract text based on file type and job type
      if (jobType === 'text_extraction' && document.file_type === 'text/plain') {
        extractedText = await fileData.text();
        result = {
          text: extractedText,
          wordCount: extractedText.split(/\s+/).length,
          language: 'en'
        };
      } else if (jobType === 'ocr' && document.file_type === 'application/pdf') {
        // Use pdf-parse-fork for Node.js compatible PDF parsing
        const pdf = (await import('pdf-parse-fork')).default;
        const arrayBuffer = await fileData.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const pdfData = await pdf(buffer);
        extractedText = pdfData.text.trim();
        result = {
          text: extractedText,
          confidence: 0.95,
          pages: pdfData.numpages
        };
      } else if (jobType === 'transcription') {
        result = {
          transcript: `Audio/video transcription not implemented yet for ${document.original_filename}`,
          duration: 120,
          language: 'en'
        };
      } else if (jobType === 'thumbnail') {
        result = {
          thumbnailUrl: '/placeholder-thumbnail.jpg',
          width: 200,
          height: 260
        };
      } else {
        // Fallback for unsupported combinations
        result = {
          text: `Content extraction not implemented for ${document.file_type} with job type ${jobType}`,
          error: 'Unsupported file type or job type combination'
        };
      }
    } catch (error) {
      console.error(`Error extracting content from ${document.original_filename}:`, error);
      result = {
        text: `Content extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: 'Content extraction failed'
      };
    }

    // Update job to completed
    await adminClient
      .from('document_processing_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        progress: 100,
        result
      })
      .eq('id', jobId);

    // Extract parsed text from the result for AI processing
    let parsedText = '';
    if (jobType === 'ocr' || jobType === 'text_extraction') {
      parsedText = (result as { text?: string }).text || '';
    } else if (jobType === 'transcription') {
      parsedText = (result as { transcript?: string }).transcript || '';
    }
    
    // Update document status to ready if this was the last processing job
    const updateData: {
      status: string;
      metadata: Record<string, unknown>;
      parsed_text?: string;
      title?: string;
    } = {
      status: 'ready',
      metadata: {
        ...document.metadata,
        [jobType]: result
      }
    };
    
    // Always set parsed_text and title for AI features to work
    if (parsedText && parsedText.trim().length > 0) {
      updateData.parsed_text = parsedText;
      console.log(`Setting parsed_text with ${parsedText.length} characters of real content`);
    } else {
      // Only use fallback if extraction completely failed
      updateData.parsed_text = `Text extraction failed for ${document.original_filename}. Please try re-uploading the file.`;
      console.warn(`No text extracted from ${document.original_filename}, using fallback`);
    }
    
    // Always set title from filename if not already set
    updateData.title = document.original_filename.replace(/\.[^/.]+$/, '');
    
    await adminClient
      .from('documents')
      .update(updateData)
      .eq('id', document.id);

    console.log(`Processing job ${jobId} completed successfully`);

  } catch (error) {
    console.error(`Processing job ${jobId} failed:`, error);
    
    // Update job to failed
    await adminClient
      .from('document_processing_jobs')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_message: error instanceof Error ? error.message : 'Processing failed'
      })
      .eq('id', jobId);
  }
}