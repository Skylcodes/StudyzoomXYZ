import { getSupabaseAdmin } from '@/utils/supabase-admin';
import { DocumentProcessingJob } from '@/types/Document';

const adminClient = getSupabaseAdmin();

/**
 * Create a processing job for a document (server-only)
 */
export async function createProcessingJob(
  documentId: string,
  jobType: 'ocr' | 'text_extraction' | 'transcription' | 'thumbnail'
): Promise<DocumentProcessingJob | null> {
  try {
    const { data, error } = await adminClient
      .from('document_processing_jobs')
      .insert([{
        document_id: documentId,
        job_type: jobType,
        status: 'pending',
        progress: 0,
        result: {}
      }])
      .select()
      .single();

    if (error) {
      console.error('[Server] Error creating processing job:', error);
      return null;
    }

    return data as DocumentProcessingJob;
  } catch (err) {
    console.error('[Server] Exception in createProcessingJob:', err);
    return null;
  }
}

/**
 * Get processing jobs for a document (server-only)
 */
export async function getDocumentProcessingJobs(documentId: string): Promise<DocumentProcessingJob[]> {
  try {
    const { data, error } = await adminClient
      .from('document_processing_jobs')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Server] Error fetching processing jobs:', error);
      return [];
    }

    return data as DocumentProcessingJob[];
  } catch (err) {
    console.error('[Server] Exception in getDocumentProcessingJobs:', err);
    return [];
  }
} 