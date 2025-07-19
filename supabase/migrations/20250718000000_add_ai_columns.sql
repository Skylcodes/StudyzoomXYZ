-- Add AI-related columns to documents table
-- This migration adds columns needed for AI summary generation and document chatbot functionality

-- Add new columns for AI features
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS summary TEXT,
ADD COLUMN IF NOT EXISTS key_points JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS parsed_text TEXT;

-- Create index for faster searches on parsed_text
CREATE INDEX IF NOT EXISTS idx_documents_parsed_text ON public.documents USING gin(to_tsvector('english', parsed_text));

-- Create index for title searches
CREATE INDEX IF NOT EXISTS idx_documents_title ON public.documents(title);

-- Update existing documents to extract parsed_text from metadata where available
-- This will help with backward compatibility for documents that were already processed
UPDATE public.documents 
SET parsed_text = CASE 
  WHEN metadata ? 'ocr' AND metadata->'ocr'->>'text' IS NOT NULL THEN metadata->'ocr'->>'text'
  WHEN metadata ? 'text_extraction' AND metadata->'text_extraction'->>'text' IS NOT NULL THEN metadata->'text_extraction'->>'text'
  WHEN metadata ? 'transcription' AND metadata->'transcription'->>'transcript' IS NOT NULL THEN metadata->'transcription'->>'transcript'
  ELSE NULL
END,
title = CASE 
  WHEN title IS NULL THEN original_filename
  ELSE title
END
WHERE parsed_text IS NULL OR title IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.documents.title IS 'Document title extracted from filename or AI-generated';
COMMENT ON COLUMN public.documents.summary IS 'AI-generated summary of the document content';
COMMENT ON COLUMN public.documents.key_points IS 'AI-generated key points as JSON array';
COMMENT ON COLUMN public.documents.parsed_text IS 'Extracted text content used for AI processing';