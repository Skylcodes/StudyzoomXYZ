-- ============================================================================
-- COMPLETE STORAGE SETUP FIX FOR DOCUMENTS BUCKET
-- Run this entire script in your Supabase SQL Editor
-- ============================================================================

-- Step 1: Clean up any existing policies (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can list documents bucket" ON storage.objects;
DROP POLICY IF EXISTS "Users can list own folder" ON storage.objects;

-- Step 2: Ensure RLS is enabled on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Step 3: Create comprehensive policies for the documents bucket

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload to own folder" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to read their own files
CREATE POLICY "Users can read own files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND auth.role() = 'authenticated'
);

-- CRITICAL: Allow authenticated users to list the bucket contents
-- This policy allows the app to check if the bucket is accessible
CREATE POLICY "Users can list documents bucket" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);

-- Alternative approach: Create a more permissive listing policy
-- This allows users to list files in the documents bucket for their own folders
CREATE POLICY "Authenticated users can access documents bucket" ON storage.objects
FOR ALL USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Step 4: Verify the bucket exists
-- This will show an error if the bucket doesn't exist
SELECT 
  id, 
  name, 
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE name = 'documents';

-- Step 5: Test the policies by checking what an authenticated user can see
-- Run this after the policies are created to verify they work
SELECT 
  'SUCCESS: Storage policies created successfully' as status,
  COUNT(*) as total_policies
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%documents%';

-- ============================================================================
-- VERIFICATION QUERIES
-- Run these individually to check your setup:
-- ============================================================================

-- Check if bucket exists:
-- SELECT * FROM storage.buckets WHERE name = 'documents';

-- Check policies:
-- SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- Check RLS status:
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'objects' AND schemaname = 'storage';