import { NextRequest, NextResponse } from 'next/server';
import { getDocumentProcessingJobs } from '@/lib/documents';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const documentId = params.id;

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Get processing jobs for the document
    const jobs = await getDocumentProcessingJobs(documentId);

    return NextResponse.json({
      success: true,
      jobs
    });

  } catch (error) {
    console.error('Jobs API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}