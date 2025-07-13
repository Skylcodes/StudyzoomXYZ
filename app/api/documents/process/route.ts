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
async function simulateProcessing(jobId: string, jobType: string, document: { id: string; original_filename: string; metadata: Record<string, unknown> }) {
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

    // Generate mock results based on job type
    let result = {};
    switch (jobType) {
      case 'ocr':
        result = {
          text: `This is simulated OCR text extracted from ${document.original_filename}. In a real implementation, this would contain the actual extracted text from the document.`,
          confidence: 0.95,
          pages: 1
        };
        break;
      case 'text_extraction':
        result = {
          text: `This is simulated text extracted from ${document.original_filename}. This would contain the actual document content.`,
          wordCount: 150,
          language: 'en'
        };
        break;
      case 'transcription':
        result = {
          transcript: `This is a simulated transcript of ${document.original_filename}. In production, this would contain the actual audio/video transcription.`,
          duration: 120,
          language: 'en'
        };
        break;
      case 'thumbnail':
        result = {
          thumbnailUrl: '/placeholder-thumbnail.jpg',
          width: 200,
          height: 260
        };
        break;
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

    // Update document status to ready if this was the last processing job
    await adminClient
      .from('documents')
      .update({
        status: 'ready',
        metadata: {
          ...document.metadata,
          [jobType]: result
        }
      })
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