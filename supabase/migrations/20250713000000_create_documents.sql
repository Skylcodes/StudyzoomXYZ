-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'uploading' CHECK (status IN ('uploading', 'uploaded', 'processing', 'ready', 'failed')),
  upload_progress FLOAT DEFAULT 0 CHECK (upload_progress >= 0 AND upload_progress <= 100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create document processing jobs table
CREATE TABLE IF NOT EXISTS public.document_processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL CHECK (job_type IN ('ocr', 'text_extraction', 'transcription', 'thumbnail')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  progress FLOAT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  result JSONB DEFAULT '{}',
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON public.documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_document_id ON public.document_processing_jobs(document_id);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_status ON public.document_processing_jobs(status);

-- Set up Row Level Security (RLS)
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_processing_jobs ENABLE ROW LEVEL SECURITY;

-- Documents table policies
-- Users can read their own documents
CREATE POLICY "Users can read own documents" 
  ON public.documents 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own documents
CREATE POLICY "Users can insert own documents" 
  ON public.documents 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own documents
CREATE POLICY "Users can update own documents" 
  ON public.documents 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own documents
CREATE POLICY "Users can delete own documents" 
  ON public.documents 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Service role has full access to documents
CREATE POLICY "Service role has full access to documents" 
  ON public.documents 
  USING (
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Processing jobs table policies
-- Users can read processing jobs for their documents
CREATE POLICY "Users can read own document processing jobs" 
  ON public.document_processing_jobs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.documents 
      WHERE documents.id = document_processing_jobs.document_id 
      AND documents.user_id = auth.uid()
    )
  );

-- Service role has full access to processing jobs
CREATE POLICY "Service role has full access to processing jobs" 
  ON public.document_processing_jobs 
  USING (
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Service role can insert/update processing jobs
CREATE POLICY "Service role can manage processing jobs" 
  ON public.document_processing_jobs 
  FOR ALL 
  USING (
    auth.jwt() ->> 'role' = 'service_role'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at on update
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_processing_jobs_updated_at
BEFORE UPDATE ON public.document_processing_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for documents (will need to be created manually in Supabase dashboard)
-- This is just a comment for reference - actual bucket creation is done through Supabase UI
-- Bucket name: 'documents'
-- Public: false (authenticated users only)
-- File size limit: 1GB
-- Allowed MIME types: application/pdf, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain, image/jpeg, image/png, image/tiff, video/mp4, video/quicktime, video/x-msvideo, audio/mpeg, audio/wav, application/zip