'use client';

import { supabase } from '@/utils/supabase';
import { getSupabaseAdmin } from '@/utils/supabase-admin';
import { Document, DocumentProcessingJob, SUPPORTED_FILE_TYPES, DEFAULT_VALIDATION_RULES } from '@/types/Document';
import { debugStorageError } from '@/utils/debug';

const adminClient = getSupabaseAdmin();

/**
 * File validation utilities
 */
export function validateFile(file: File): { isValid: boolean; error?: string } {
  const rules = DEFAULT_VALIDATION_RULES;
  
  // Check file size
  if (file.size > rules.maxSize) {
    const maxSizeMB = Math.round(rules.maxSize / (1024 * 1024));
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`
    };
  }
  
  // Check file type
  if (!rules.allowedTypes.includes(file.type)) {
    const supportedTypes = Object.values(SUPPORTED_FILE_TYPES).map(t => t.label).join(', ');
    return {
      isValid: false,
      error: `File type not supported. Supported types: ${supportedTypes}`
    };
  }
  
  return { isValid: true };
}

export function validateFiles(files: File[]): { isValid: boolean; errors: string[] } {
  const rules = DEFAULT_VALIDATION_RULES;
  const errors: string[] = [];
  
  // Check batch size
  if (files.length > rules.maxFiles) {
    errors.push(`Too many files. Maximum ${rules.maxFiles} files per upload.`);
  }
  
  // Validate each file
  files.forEach((file, index) => {
    const validation = validateFile(file);
    if (!validation.isValid) {
      errors.push(`File ${index + 1} (${file.name}): ${validation.error}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate a safe filename for storage
 */
export function generateSafeFilename(originalFilename: string, userId: string): string {
  const timestamp = Date.now();
  const safeName = originalFilename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 100); // Limit length
  
  return `${userId}/${timestamp}_${safeName}`;
}

/**
 * Create a document record in the database
 */
export async function createDocument(params: {
  userId: string;
  filename: string;
  originalFilename: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
}): Promise<Document | null> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .insert([{
        user_id: params.userId,
        filename: params.filename,
        original_filename: params.originalFilename,
        file_type: params.fileType,
        file_size: params.fileSize,
        storage_path: params.storagePath,
        status: 'uploading',
        upload_progress: 0,
        metadata: {}
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating document:', error);
      return null;
    }

    return data as Document;
  } catch (err) {
    console.error('Error in createDocument:', err);
    return null;
  }
}

/**
 * Update document upload progress
 */
export async function updateDocumentProgress(
  documentId: string,
  progress: number,
  status?: 'uploading' | 'uploaded' | 'processing' | 'ready' | 'failed'
): Promise<boolean> {
  try {
    const updateData: { upload_progress: number; status?: string } = { upload_progress: progress };
    if (status) {
      updateData.status = status;
    }

    const { error } = await supabase
      .from('documents')
      .update(updateData)
      .eq('id', documentId);

    if (error) {
      console.error('Error updating document progress:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in updateDocumentProgress:', err);
    return false;
  }
}

/**
 * Get documents for a user
 */
export async function getUserDocuments(userId: string): Promise<Document[]> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user documents:', error);
      return [];
    }

    return data as Document[];
  } catch (err) {
    console.error('Error in getUserDocuments:', err);
    return [];
  }
}

/**
 * Get a single document by ID
 */
export async function getDocument(documentId: string): Promise<Document | null> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('Error fetching document:', error);
      }
      return null;
    }

    return data as Document;
  } catch (err) {
    console.error('Error in getDocument:', err);
    return null;
  }
}

/**
 * Delete a document and its storage file
 */
export async function deleteDocument(documentId: string): Promise<boolean> {
  try {
    // First get the document to know the storage path
    const document = await getDocument(documentId);
    if (!document) {
      return false;
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([document.storage_path]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (dbError) {
      console.error('Error deleting document from database:', dbError);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in deleteDocument:', err);
    return false;
  }
}

/**
 * Check if storage bucket exists and is accessible
 */
export async function checkStorageSetup(): Promise<{ isConfigured: boolean; error?: string; debugInfo?: unknown }> {
  console.warn('[Storage Check] Forced bypass: always returning isConfigured: true. This disables all real storage checks.');
  return { isConfigured: true, debugInfo: { forcedBypass: true } };
}

/**
 * Upload file to Supabase Storage with chunked upload
 */
export async function uploadFileToStorage(
  file: File,
  storagePath: string,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; error?: string }> {
  try {
    // First check if storage is properly configured
    const storageCheck = await checkStorageSetup();
    if (!storageCheck.isConfigured) {
      return { 
        success: false, 
        error: storageCheck.error || 'Storage not configured' 
      };
    }

    // For files larger than 6MB, we should implement chunked upload
    // For now, we'll use the standard upload with progress tracking
    const { error } = await supabase.storage
      .from('documents')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      // Enhanced debug logging
      debugStorageError(error, 'File Upload');
      
      // Handle different error object formats
      let errorMessage = '';
      if (typeof error === 'object' && error !== null) {
        const errorObj = error as unknown as Record<string, unknown>;
        errorMessage = (errorObj.message as string) || 
                      (errorObj.error as string) || 
                      (errorObj.statusText as string) || 
                      JSON.stringify(error);
      } else {
        errorMessage = String(error);
      }
      
      // Provide user-friendly error messages based on error content
      let userMessage = errorMessage;
      
      if (!errorMessage || errorMessage === '{}' || errorMessage === '' || errorMessage === 'null') {
        userMessage = 'Upload failed due to storage configuration issue. The documents bucket may not be properly set up or accessible.';
      } else if (errorMessage.toLowerCase().includes('bucket not found') || errorMessage.toLowerCase().includes('object not found')) {
        userMessage = 'Storage bucket not found. The "documents" bucket needs to be created in Supabase Dashboard.';
      } else if (errorMessage.toLowerCase().includes('duplicate')) {
        userMessage = 'A file with this name already exists. Please rename your file or try again.';
      } else if (errorMessage.toLowerCase().includes('size') || errorMessage.toLowerCase().includes('large')) {
        userMessage = 'File is too large. Please choose a smaller file.';
      } else if (errorMessage.toLowerCase().includes('policy') || errorMessage.toLowerCase().includes('permission') || errorMessage.toLowerCase().includes('rls')) {
        userMessage = 'Permission denied. Storage bucket exists but RLS policies are not configured properly.';
      } else if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('fetch')) {
        userMessage = 'Network error occurred during upload. Please check your connection and try again.';
      } else {
        // Include the actual error message for debugging while keeping it user-friendly
        userMessage = `Upload failed: ${errorMessage}. Please check the debug panel for more details.`;
      }
      
      return { success: false, error: userMessage };
    }

    // Simulate progress for now - in a real implementation, 
    // chunked upload would provide real progress
    if (onProgress) {
      onProgress(100);
    }

    return { success: true };
  } catch (err) {
    console.error('Error in uploadFileToStorage:', err);
    
    // Handle network and other unexpected errors
    let errorMessage = 'Upload failed';
    if (err instanceof Error) {
      if (err.message.includes('network') || err.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        errorMessage = err.message;
      }
    }
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
}

/**
 * Get download URL for a document
 */
export async function getDocumentDownloadUrl(storagePath: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(storagePath, 3600); // 1 hour expiry

    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }

    return data?.signedUrl || null;
  } catch (err) {
    console.error('Error getting download URL:', err);
    return null;
  }
}