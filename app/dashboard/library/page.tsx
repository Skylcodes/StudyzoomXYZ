"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentWithTags, Tag, UploadProgress } from '@/types/Document';
import { 
  createDocument, 
  uploadFileToStorage, 
  updateDocumentProgress,
  deleteDocument,
  generateSafeFilename,
  checkStorageSetup,
  getDocument,
  getUserDocumentsWithTags,
  getUserTags,
  createTag,
  assignTagsToDocument,
  deleteTag
} from '@/lib/documents';
import FileUploadZone from '@/components/FileUploadZone';
import FileList from '@/components/FileList';
import UploadProgressComponent from '@/components/UploadProgress';
import StorageSetupBanner from '@/components/StorageSetupBanner';
import StorageDebugPanel from '@/components/StorageDebugPanel';
import StorageQuickFix from '@/components/StorageQuickFix';
import { toast } from 'react-hot-toast';
import { supabase } from '@/utils/supabase';
import TagFilterBar from '@/components/TagFilterBar';
import TagCreateInput from '@/components/TagCreateInput';
import TagEditModal from '@/components/TagEditModal';

export default function LibraryPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentWithTags[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [storageStatus, setStorageStatus] = useState<{
    isConfigured: boolean;
    error?: string;
    checked: boolean;
  }>({ isConfigured: false, checked: false });
  const [isCheckingStorage, setIsCheckingStorage] = useState(false);
  const [tagLoading, setTagLoading] = useState(false);
  // Add state for tag editing modal
  const [editingTagsDoc, setEditingTagsDoc] = useState<DocumentWithTags | null>(null);
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagEditLoading, setTagEditLoading] = useState(false);

  // Load user documents and tags
  const loadDocumentsAndTags = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const [docs, userTags] = await Promise.all([
        getUserDocumentsWithTags(user.id),
        getUserTags(user.id)
      ]);
      // Filter out documents whose files are missing in storage
      const filteredDocs: DocumentWithTags[] = [];
      for (const doc of docs) {
        try {
          const { data, error } = await supabase.storage.from('documents').createSignedUrl(doc.storage_path, 60);
          if (!error && data?.signedUrl) {
            filteredDocs.push(doc);
          }
        } catch {
          // Ignore missing files
        }
      }
      setDocuments(filteredDocs);
      setTags(userTags);
    } catch (error) {
      console.error('Error loading documents/tags:', error);
      toast.error('Failed to load documents or tags');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Check storage configuration
  const checkStorage = useCallback(async () => {
    console.log('🔄 Checking storage configuration...');
    setIsCheckingStorage(true);
    
    try {
      const status = await checkStorageSetup();
      console.log('📊 Storage check result:', status);
      
      const wasConfigured = storageStatus.isConfigured;
      
      setStorageStatus({
        isConfigured: status.isConfigured,
        error: status.error,
        checked: true
      });

      // Show success toast if storage is now configured
      if (status.isConfigured && !wasConfigured && storageStatus.checked) {
        toast.success('🎉 Storage is now properly configured! You can now upload files.');
      }
    } catch (error) {
      console.error('Failed to check storage setup:', error);
      setStorageStatus({
        isConfigured: false,
        error: 'Failed to check storage configuration',
        checked: true
      });
    } finally {
      setIsCheckingStorage(false);
    }
  }, [storageStatus.isConfigured, storageStatus.checked]);

  useEffect(() => {
    loadDocumentsAndTags();
    checkStorage();
  }, [loadDocumentsAndTags, checkStorage]);

  // Start document processing
  const startDocumentProcessing = useCallback(async (documentId: string, fileType: string) => {
    try {
      // Determine what processing jobs to create based on file type
      const jobs = [];
      
      if (fileType.includes('pdf') || fileType.includes('image')) {
        jobs.push('ocr');
      }
      
      if (fileType.includes('word') || fileType.includes('powerpoint') || fileType.includes('text')) {
        jobs.push('text_extraction');
      }
      
      if (fileType.includes('video') || fileType.includes('audio')) {
        jobs.push('transcription');
      }
      
      // Always create thumbnail for visual files
      if (fileType.includes('image') || fileType.includes('pdf') || fileType.includes('video')) {
        jobs.push('thumbnail');
      }

      // Start processing jobs
      for (const jobType of jobs) {
        await fetch('/api/documents/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentId,
            jobType
          }),
        });
      }

    } catch (error) {
      console.error('Failed to start processing:', error);
    }
  }, []);

  // Handle file selection
  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (!user?.id) {
      toast.error('Please log in to upload files');
      return;
    }

    // Check storage configuration before proceeding
    if (!storageStatus.isConfigured) {
      if (storageStatus.checked) {
        toast.error('Storage not configured. Please set up the documents bucket first.');
      } else {
        toast.error('Checking storage configuration...');
        await checkStorage();
      }
      return;
    }

    // Create upload progress entries
    const newUploads: UploadProgress[] = files.map(file => ({
      file,
      progress: 0,
      status: 'pending'
    }));

    setUploads(prev => [...prev, ...newUploads]);

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadIndex = uploads.length + i;

      try {
        // Update status to uploading
        setUploads(prev => 
          prev.map((upload, idx) => 
            idx === uploadIndex 
              ? { ...upload, status: 'uploading' as const }
              : upload
          )
        );

        // Generate storage path
        const storagePath = generateSafeFilename(file.name, user.id);

        // Create document record
        const document = await createDocument({
          userId: user.id,
          filename: storagePath.split('/').pop() || file.name,
          originalFilename: file.name,
          fileType: file.type,
          fileSize: file.size,
          storagePath
        });

        if (!document) {
          throw new Error('Failed to create document record');
        }

        // Update upload with document ID
        setUploads(prev => 
          prev.map((upload, idx) => 
            idx === uploadIndex 
              ? { ...upload, documentId: document.id }
              : upload
          )
        );

        // Upload file to storage
        const uploadResult = await uploadFileToStorage(
          file,
          storagePath,
          (progress) => {
            setUploads(prev => 
              prev.map((upload, idx) => 
                idx === uploadIndex 
                  ? { ...upload, progress }
                  : upload
              )
            );
            
            // Update document progress in database
            updateDocumentProgress(document.id, progress);
          }
        );

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Upload failed');
        }

        // Mark as uploaded and start processing
        await updateDocumentProgress(document.id, 100, 'uploaded');
        
        setUploads(prev => 
          prev.map((upload, idx) => 
            idx === uploadIndex 
              ? { ...upload, status: 'processing' as const, progress: 100 }
              : upload
          )
        );

        // Start automatic processing
        await startDocumentProcessing(document.id, file.type);

        // Poll for processing status
        const pollInterval = 2000; // 2 seconds
        const maxPollAttempts = 30; // 1 minute max
        let pollAttempts = 0;
        let processingDone = false;
        while (!processingDone && pollAttempts < maxPollAttempts) {
          await new Promise(res => setTimeout(res, pollInterval));
          const latestDoc = await getDocument(document.id);
          if (latestDoc?.status === 'ready') {
            // Mark as completed and clean up upload UI
            setUploads(prev => prev.filter((_, idx) => idx !== uploadIndex));
            toast.success(`${file.name} processed and ready!`);
            // Reload documents to show the new ready document
            loadDocumentsAndTags();
            processingDone = true;
          } else if (latestDoc?.status === 'failed') {
            setUploads(prev => prev.map((upload, idx) => idx === uploadIndex ? { ...upload, status: 'failed', error: 'Processing failed' } : upload));
            toast.error(`${file.name} processing failed.`);
            processingDone = true;
          }
          pollAttempts++;
        }
        // If still processing after max attempts, leave as is (user can refresh)

        toast.success(`${file.name} uploaded successfully`);

      } catch (error) {
        console.error('Upload error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        
        setUploads(prev => 
          prev.map((upload, idx) => 
            idx === uploadIndex 
              ? { ...upload, status: 'failed' as const, error: errorMessage }
              : upload
          )
        );

        toast.error(`Failed to upload ${file.name}: ${errorMessage}`);
      }
    }

    // Reload documents to show new uploads
    setTimeout(loadDocumentsAndTags, 1000);
  }, [user?.id, uploads.length, loadDocumentsAndTags, startDocumentProcessing, storageStatus, checkStorage]);

  // Handle upload retry
  const handleRetryUpload = useCallback((uploadIndex: number) => {
    const upload = uploads[uploadIndex];
    if (upload) {
      handleFilesSelected([upload.file]);
      // Remove the failed upload from the list
      setUploads(prev => prev.filter((_, idx) => idx !== uploadIndex));
    }
  }, [uploads, handleFilesSelected]);

  // Handle upload cancel
  const handleCancelUpload = useCallback((uploadIndex: number) => {
    setUploads(prev => prev.filter((_, idx) => idx !== uploadIndex));
  }, []);

  // Handle document deletion
  const handleDeleteDocument = useCallback(async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const success = await deleteDocument(documentId);
      if (success) {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
        toast.success('Document deleted successfully');
      } else {
        toast.error('Failed to delete document');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    }
  }, []);

  // Handle document view
  const handleViewDocument = useCallback((document: DocumentWithTags) => {
    // For now, just show a toast. In the future, this could open a document viewer
    toast.success(`Opening ${document.original_filename}...`);
  }, []);

  // Handle dismissing storage setup banner (and re-check storage)
  const handleDismissStorageBanner = useCallback(async () => {
    await checkStorage();
  }, [checkStorage]);

  // Handle tag creation
  const handleCreateTag = async (name: string) => {
    if (!user?.id) return;
    setTagLoading(true);
    try {
      const newTag = await createTag(user.id, name);
      if (newTag) {
        setTags(prev => [...prev, newTag]);
        toast.success(`Tag "${name}" added!`);
      } else {
        toast.error('Failed to add tag');
      }
    } catch {
      toast.error('Failed to add tag');
    } finally {
      setTagLoading(false);
    }
  };

  // Handler to open tag edit modal
  const handleEditTags = (doc: DocumentWithTags) => {
    setEditingTagsDoc(doc);
    setShowTagModal(true);
  };

  const handleSaveTags = async (selectedTagIds: string[]) => {
    if (!editingTagsDoc) return;
    setTagEditLoading(true);
    try {
      const success = await assignTagsToDocument(editingTagsDoc.id, selectedTagIds);
      if (success) {
        // Update document in state
        setDocuments(prev => prev.map(doc =>
          doc.id === editingTagsDoc.id
            ? { ...doc, tags: tags.filter(t => selectedTagIds.includes(t.id)) }
            : doc
        ));
        toast.success('Tags updated!');
        setShowTagModal(false);
        setEditingTagsDoc(null);
      } else {
        toast.error('Failed to update tags');
      }
    } catch {
      toast.error('Failed to update tags');
    } finally {
      setTagEditLoading(false);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    setTagLoading(true);
    try {
      const success = await deleteTag(tagId);
      if (success) {
        setTags(prev => prev.filter(t => t.id !== tagId));
        setDocuments(prev => prev.map(doc => ({ ...doc, tags: doc.tags.filter(t => t.id !== tagId) })));
        toast.success('Tag deleted!');
      } else {
        toast.error('Failed to delete tag');
      }
    } catch {
      toast.error('Failed to delete tag');
    } finally {
      setTagLoading(false);
    }
  };

  // Filter documents by selected tag
  const filteredDocuments = selectedTag
    ? documents.filter(doc => doc.tags.some(tag => tag.id === selectedTag))
    : documents;

  return (
    <div className="flex-1 space-y-8 p-8 pt-10 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight font-display drop-shadow-lg">Document Library</h1>
          <p className="text-slate-400 mt-2 text-lg font-medium">Upload and manage your study materials</p>
        </div>
      </div>

      {/* Tag Create Input */}
      <TagCreateInput onCreate={handleCreateTag} loading={tagLoading} disabled={isLoading} existingTags={tags} />

      {/* Tag Filter Bar */}
      <TagFilterBar tags={tags} selectedTag={selectedTag} onSelectTag={setSelectedTag} onDeleteTag={handleDeleteTag} />

      {/* Quick Storage Recheck */}
      {storageStatus.checked && !storageStatus.isConfigured && (
        <StorageQuickFix 
          onRecheck={checkStorage}
          isChecking={isCheckingStorage}
        />
      )}

      {/* Storage Setup Banner */}
      {storageStatus.checked && !storageStatus.isConfigured && (
        <StorageSetupBanner 
          error={storageStatus.error}
          onDismiss={handleDismissStorageBanner}
        />
      )}

      {/* Debug Panel - only show in development or when storage issues exist */}
      {(process.env.NODE_ENV === 'development' || !storageStatus.isConfigured) && (
        <StorageDebugPanel show={!storageStatus.isConfigured} />
      )}

      {/* Upload Zone */}
      <FileUploadZone 
        onFilesSelected={handleFilesSelected}
        disabled={
          uploads.some(upload => upload.status === 'uploading') ||
          (storageStatus.checked && !storageStatus.isConfigured)
        }
      />

      {/* Active Uploads */}
      {uploads.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-white text-lg font-semibold">Upload Progress</h3>
          <div className="space-y-3">
            {uploads.map((upload, index) => (
              <UploadProgressComponent
                key={`${upload.file.name}-${index}`}
                upload={upload}
                onRetry={() => handleRetryUpload(index)}
                onCancel={() => handleCancelUpload(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Document List */}
      <FileList
        documents={filteredDocuments}
        onDelete={handleDeleteDocument}
        onView={handleViewDocument}
        onEditTags={handleEditTags}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {editingTagsDoc && (
        <TagEditModal
          open={showTagModal}
          onClose={() => { setShowTagModal(false); setEditingTagsDoc(null); }}
          document={editingTagsDoc}
          allTags={tags}
          onSave={handleSaveTags}
          loading={tagEditLoading}
        />
      )}
    </div>
  );
}