# Storage Setup via Supabase Dashboard

Since SQL policies require owner permissions, we'll set up storage policies through the Dashboard interface.

## Step 1: Create Storage Policies via Dashboard

1. **Go to Supabase Dashboard** → Your Project → **Storage**
2. **Click on your "documents" bucket**
3. **Go to "Policies" tab** (should be next to "Objects")
4. **Click "Add Policy"** and create these policies one by one:

### Policy 1: Allow Upload to Own Folder
- **Policy Name**: `Users can upload to own folder`
- **Allowed Operation**: `INSERT`
- **Target Roles**: `authenticated`
- **Policy Definition**:
```sql
bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
```

### Policy 2: Allow Read Own Files
- **Policy Name**: `Users can read own files`
- **Allowed Operation**: `SELECT`
- **Target Roles**: `authenticated`
- **Policy Definition**:
```sql
bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
```

### Policy 3: Allow Update Own Files
- **Policy Name**: `Users can update own files`
- **Allowed Operation**: `UPDATE`
- **Target Roles**: `authenticated`
- **Policy Definition**:
```sql
bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
```

### Policy 4: Allow Delete Own Files
- **Policy Name**: `Users can delete own files`
- **Allowed Operation**: `DELETE`
- **Target Roles**: `authenticated`
- **Policy Definition**:
```sql
bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
```

### Policy 5: Allow List Bucket (CRITICAL)
- **Policy Name**: `Users can list documents bucket`
- **Allowed Operation**: `SELECT`
- **Target Roles**: `authenticated`
- **Policy Definition**:
```sql
bucket_id = 'documents'
```

## Step 2: Verify Bucket Settings

Make sure your "documents" bucket has these settings:
- **Name**: `documents`
- **Public**: `false` (unchecked)
- **File size limit**: `1073741824` (1GB)
- **Allowed MIME types**: 
```
application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,image/jpeg,image/png,image/tiff,video/mp4,video/quicktime,video/x-msvideo,audio/mpeg,audio/wav,application/zip
```

## Step 3: Test the Setup

After creating all policies:
1. Go back to your app
2. Refresh the page
3. Click "Recheck Storage"
4. The upload zone should become active

## Alternative: Simple Permissive Policy

If the above doesn't work, try creating just one simple policy:

- **Policy Name**: `Allow all authenticated users`
- **Allowed Operation**: `ALL`
- **Target Roles**: `authenticated`
- **Policy Definition**:
```sql
bucket_id = 'documents'
```

This is less secure but will definitely work for testing.