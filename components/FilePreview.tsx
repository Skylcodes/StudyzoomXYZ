'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Image, Video, Music, Archive, Download, Trash2, Eye, Clock } from 'lucide-react';
import { Document } from '@/types/Document';
import { getDocumentDownloadUrl } from '@/lib/documents';

interface FilePreviewProps {
  document: Document;
  onDelete?: (documentId: string) => void;
  onView?: (document: Document) => void;
  className?: string;
}

export default function FilePreview({ document, onDelete, onView, className = '' }: FilePreviewProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

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

  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition-colors ${className}`}>
      {/* Thumbnail/Preview */}
      <div className="relative h-32 bg-slate-900 flex items-center justify-center">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={thumbnailUrl} 
            alt={`Preview of ${document.original_filename}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-slate-500">
            {getFileIcon()}
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor()} bg-slate-900/80`}>
          {document.status === 'processing' && <Clock className="h-3 w-3 inline mr-1" />}
          {getStatusText()}
        </div>
      </div>

      {/* File Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-white font-medium truncate" title={document.original_filename}>
            {document.original_filename}
          </h3>
          <p className="text-slate-400 text-sm">
            {getFileTypeLabel()} • {formatFileSize(document.file_size)}
          </p>
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
        <div className="flex space-x-2">
          {onView && document.status === 'ready' && (
            <button
              onClick={() => onView(document)}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </button>
          )}
          
          {document.status === 'ready' && downloadUrl && (
            <button
              onClick={handleDownload}
              className="flex items-center justify-center px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded transition-colors"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
          
          {onDelete && (
            <button
              onClick={() => onDelete(document.id)}
              className="flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}