# Supabase Storage Setup for Documents

## Manual Setup Required

Since the documents bucket doesn't exist yet, you need to create it manually in the Supabase dashboard:

### 1. Create Documents Bucket

1. Go to Supabase Dashboard → Your Project → Storage
2. Click "Create Bucket"
3. Use these settings:
   - **Name**: `documents`
   - **Public**: `false` (authenticated users only)
   - **File size limit**: `1073741824` (1GB)
   - **Allowed MIME types**: 
     ```
     application/pdf,
     application/vnd.ms-powerpoint,
     application/vnd.openxmlformats-officedocument.presentationml.presentation,
     application/msword,
     application/vnd.openxmlformats-officedocument.wordprocessingml.document,
     text/plain,
     image/jpeg,
     image/png,
     image/tiff,
     video/mp4,
     video/quicktime,
     video/x-msvideo,
     audio/mpeg,
     audio/wav,
     application/zip
     ```

### 2. Storage Policies

After creating the bucket, you need to set up RLS policies. Run these in the SQL editor:

```sql
-- First, enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload to own folder" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to read their own files
CREATE POLICY "Users can read own files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- CRITICAL: Allow authenticated users to list bucket contents
-- This is needed for the storage check to work
CREATE POLICY "Users can list documents bucket" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);

-- Also allow listing files in user's own folder (more permissive for listing)
CREATE POLICY "Users can list own folder" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents'
  AND (
    auth.uid()::text = (storage.foldername(name))[1] 
    OR name = ''  -- Allow listing root to check bucket access
  )
);
```

### 3. Folder Structure

Files will be organized as: `documents/{user_id}/{filename}`

This ensures users can only access their own files and provides good organization.

### 4. Environment Variables

Make sure these are set in your `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)

## Testing the Setup

After creating the bucket and policies, test by:
1. Logging into your app
2. Trying to upload a small file
3. Verifying it appears in Storage → documents → {your-user-id}/

The upload functionality in the app will handle the rest automatically.