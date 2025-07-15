/**
 * Document upload and processing related types
 */

export type DocumentStatus = 'uploading' | 'uploaded' | 'processing' | 'ready' | 'failed';

export type ProcessingJobType = 'ocr' | 'text_extraction' | 'transcription' | 'thumbnail';

export type ProcessingJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Represents a document in the system
 */
export interface Document {
  /**
   * Unique document ID
   */
  id: string;
  
  /**
   * ID of the user who uploaded this document
   */
  user_id: string;
  
  /**
   * Current filename (may be different from original)
   */
  filename: string;
  
  /**
   * Original filename as uploaded by user
   */
  original_filename: string;
  
  /**
   * MIME type of the file
   */
  file_type: string;
  
  /**
   * File size in bytes
   */
  file_size: number;
  
  /**
   * Path to file in Supabase Storage
   */
  storage_path: string;
  
  /**
   * Current processing status
   */
  status: DocumentStatus;
  
  /**
   * Upload progress percentage (0-100)
   */
  upload_progress: number;
  
  /**
   * Additional metadata (thumbnails, extracted text, etc.)
   */
  metadata: Record<string, any>;
  
  /**
   * Timestamp when document was created
   */
  created_at: string;
  
  /**
   * Timestamp when document was last updated
   */
  updated_at: string;
}

/**
 * Represents a document processing job
 */
export interface DocumentProcessingJob {
  /**
   * Unique job ID
   */
  id: string;
  
  /**
   * ID of the document being processed
   */
  document_id: string;
  
  /**
   * Type of processing job
   */
  job_type: ProcessingJobType;
  
  /**
   * Current job status
   */
  status: ProcessingJobStatus;
  
  /**
   * Processing progress percentage (0-100)
   */
  progress: number;
  
  /**
   * Processing result data
   */
  result: Record<string, any>;
  
  /**
   * Error message if job failed
   */
  error_message: string | null;
  
  /**
   * Timestamp when job started processing
   */
  started_at: string | null;
  
  /**
   * Timestamp when job completed
   */
  completed_at: string | null;
  
  /**
   * Timestamp when job was created
   */
  created_at: string;
  
  /**
   * Timestamp when job was last updated
   */
  updated_at: string;
}

/**
 * File validation constraints
 */
export interface FileValidationRules {
  maxSize: number; // in bytes
  allowedTypes: string[]; // MIME types
  maxFiles: number; // max files in batch upload
}

/**
 * Upload progress tracking
 */
export interface UploadProgress {
  file: File;
  documentId?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed';
  error?: string;
}

/**
 * Supported file types configuration
 */
export const SUPPORTED_FILE_TYPES = {
  // Documents
  'application/pdf': { label: 'PDF', maxSize: 1024 * 1024 * 1024 }, // 1GB
  'application/vnd.ms-powerpoint': { label: 'PowerPoint', maxSize: 1024 * 1024 * 1024 },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { label: 'PowerPoint', maxSize: 1024 * 1024 * 1024 },
  'application/msword': { label: 'Word', maxSize: 1024 * 1024 * 1024 },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { label: 'Word', maxSize: 1024 * 1024 * 1024 },
  'text/plain': { label: 'Text', maxSize: 1024 * 1024 * 1024 },
  
  // Images
  'image/jpeg': { label: 'JPEG', maxSize: 1024 * 1024 * 1024 },
  'image/png': { label: 'PNG', maxSize: 1024 * 1024 * 1024 },
  'image/tiff': { label: 'TIFF', maxSize: 1024 * 1024 * 1024 },
  
  // Video/Audio
  'video/mp4': { label: 'MP4', maxSize: 1024 * 1024 * 1024 },
  'video/quicktime': { label: 'MOV', maxSize: 1024 * 1024 * 1024 },
  'video/x-msvideo': { label: 'AVI', maxSize: 1024 * 1024 * 1024 },
  'audio/mpeg': { label: 'MP3', maxSize: 1024 * 1024 * 1024 },
  'audio/wav': { label: 'WAV', maxSize: 1024 * 1024 * 1024 },
  
  // Archives
  'application/zip': { label: 'ZIP', maxSize: 1024 * 1024 * 1024 }
} as const;

export const DEFAULT_VALIDATION_RULES: FileValidationRules = {
  maxSize: 1024 * 1024 * 1024, // 1GB
  allowedTypes: Object.keys(SUPPORTED_FILE_TYPES),
  maxFiles: 10 // max 10 files per batch
};

/**
 * Represents a tag for documents
 */
export interface Tag {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

/**
 * Document with tags relation
 */
export interface DocumentWithTags extends Document {
  tags: Tag[];
}