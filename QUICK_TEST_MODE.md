# Quick Test Mode for Storage

If you want to temporarily bypass the storage check to test uploads while we fix the RLS policies:

## Option 1: Environment Variable Bypass

Add this to your `.env.local` file:
```
NEXT_PUBLIC_SKIP_STORAGE_CHECK=true
```

This will skip the permission check in development mode and allow you to test uploads.

## Option 2: Create a Simple Test Policy

Go to Supabase Dashboard → Storage → documents bucket → Policies and create this simple policy:

**Policy Name**: `Temporary test policy`
**Allowed Operation**: `ALL`
**Target Roles**: `authenticated`
**Policy Definition**:
```sql
bucket_id = 'documents'
```

This gives broad access for testing. You can refine it later.

## Option 3: Use Service Role Key

If you have the service role key, you can temporarily use that for testing by updating your environment variables.

After any of these options, refresh your app and try uploading.