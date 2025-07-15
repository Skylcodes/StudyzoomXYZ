'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Image, Video, Music, Archive, Download, Trash2, Eye, Clock } from 'lucide-react';
import { DocumentWithTags } from '@/types/Document';
import { getDocumentDownloadUrl } from '@/lib/documents';
import { useAuth } from '@/contexts/AuthContext';
import NoteEditorModal from './NoteEditorModal';

interface FilePreviewProps {
  document: DocumentWithTags;
  onDelete?: (documentId: string) => void;
  onView?: (document: DocumentWithTags) => void;
  onEditTags?: (document: DocumentWithTags) => void;
  className?: string;
}

export default function FilePreview({ document, onDelete, onView, onEditTags, className = '' }: FilePreviewProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { user } = useAuth();
  const [noteModalOpen, setNoteModalOpen] = useState(false);

  useEffect(() => {
    // Load download URL
    getDocumentDownloadUrl(document.storage_path).then(url => {
      setDownloadUrl(url);
    });

    // Load thumbnail if available in metadata
    if (document.metadata?.thumbnail) {
      setThumbnailUrl(document.metadata.thumbnail);
    }
  }, [document]);

  const getFileIcon = () => {
    const type = document.file_type.toLowerCase();
    
    if (type.includes('image')) {
      // eslint-disable-next-line jsx-a11y/alt-text
      return <Image className="h-8 w-8" />;
    } else if (type.includes('video')) {
      return <Video className="h-8 w-8" />;
    } else if (type.includes('audio')) {
      return <Music className="h-8 w-8" />;
    } else if (type.includes('zip')) {
      return <Archive className="h-8 w-8" />;
    } else {
      return <FileText className="h-8 w-8" />;
    }
  };

  const getFileTypeLabel = () => {
    const type = document.file_type;
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('powerpoint') || type.includes('presentation')) return 'PowerPoint';
    if (type.includes('word') || type.includes('document')) return 'Word';
    if (type.includes('text')) return 'Text';
    if (type.includes('image')) return 'Image';
    if (type.includes('video')) return 'Video';
    if (type.includes('audio')) return 'Audio';
    if (type.includes('zip')) return 'Archive';
    return 'Document';
  };

  const getStatusColor = () => {
    switch (document.status) {
      case 'ready':
        return 'text-green-400';
      case 'processing':
        return 'text-blue-400';
      case 'failed':
        return 'text-red-400';
      case 'uploading':
        return 'text-yellow-400';
      default:
        return 'text-slate-400';
    }
  };

  const getStatusText = () => {
    switch (document.status) {
      case 'ready':
        return 'Ready';
      case 'processing':
        return 'Processing...';
      case 'failed':
        return 'Failed';
      case 'uploading':
        return `Uploading ${Math.round(document.upload_progress)}%`;
      case 'uploaded':
        return 'Uploaded';
      default:
        return 'Unknown';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = window.document.createElement('a');
      link.href = downloadUrl;
      link.download = document.original_filename;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

  if (!user) {
    return <div className="text-slate-400">Loading user...</div>;
  }

  return (
    <div className={`bg-slate-800/70 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-600 transition-colors shadow-xl backdrop-blur-md ${className}`} style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)' }}>
      {/* Thumbnail/Preview */}
      <div className="relative h-32 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center rounded-t-2xl">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={thumbnailUrl} 
            alt={`Preview of ${document.original_filename}`}
            className="h-full w-full object-cover rounded-t-2xl"
          />
        ) : (
          <div className="text-slate-500">
            {getFileIcon()}
          </div>
        )}
        {/* Status Badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${getStatusColor()} bg-slate-900/80 shadow-md`}> {/* modern badge */}
          {document.status === 'processing' && <Clock className="h-3 w-3 inline mr-1" />}
          {getStatusText()}
        </div>
      </div>
      {/* File Info */}
      <div className="p-5">
        <div className="mb-2">
          <h3 className="text-white font-semibold truncate text-lg" title={document.original_filename} style={{ letterSpacing: '-0.01em' }}>
            {document.original_filename}
          </h3>
          <p className="text-slate-400 text-sm font-medium">
            {getFileTypeLabel()} • {formatFileSize(document.file_size)}
          </p>
        </div>
        {/* Tags display */}
        <div className="flex items-center gap-2 mb-2">
          {document.tags && document.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {document.tags.map(tag => (
                <span
                  key={tag.id}
                  className="px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 text-white text-xs font-semibold border-none shadow-sm hover:from-blue-800 hover:to-blue-600 transition-colors"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          {onEditTags && (
            <button
              type="button"
              className="ml-2 px-2 py-0.5 rounded-full bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-500 hover:bg-blue-700 hover:text-white transition-colors shadow"
              onClick={() => onEditTags(document)}
              title="Edit tags"
            >
              + Edit Tags
            </button>
          )}
        </div>

        <p className="text-slate-500 text-xs mb-3">
          Uploaded {formatDate(document.created_at)}
        </p>

        {/* Progress Bar for uploads in progress */}
        {(document.status === 'uploading' || document.status === 'processing') && (
          <div className="mb-3">
            <div className="w-full bg-slate-700 rounded-full h-1">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  document.status === 'processing' 
                    ? 'bg-blue-500 animate-pulse' 
                    : 'bg-blue-500'
                }`}
                style={{ width: `${document.upload_progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 mb-4">
          {onView && document.status === 'ready' && (
            <button
              onClick={() => onView(document)}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </button>
          )}
          {downloadUrl && (
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm rounded transition-colors"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(document.id)}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          )}
        </div>
        {/* Notes Button */}
        <div className="mt-2">
          <button
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-700 shadow-sm transition"
            onClick={() => setNoteModalOpen(true)}
            aria-label="Open notes editor"
          >
            <FileText className="h-4 w-4" />
            Notes
          </button>
          <NoteEditorModal
            open={noteModalOpen}
            onClose={() => setNoteModalOpen(false)}
            document={document}
            userId={user.id}
          />
        </div>
      </div>
    </div>
  );
}