'use client';

import React from 'react';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { UploadProgress as UploadProgressType } from '@/types/Document';

interface UploadProgressProps {
  upload: UploadProgressType;
  onRetry?: () => void;
  onCancel?: () => void;
}

export default function UploadProgress({ upload, onRetry, onCancel }: UploadProgressProps) {
  const getStatusIcon = () => {
    switch (upload.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      default:
        return <FileText className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusText = () => {
    switch (upload.status) {
      case 'pending':
        return 'Pending';
      case 'uploading':
        return `Uploading... ${Math.round(upload.progress)}%`;
      case 'processing':
        return 'Processing...';
      case 'completed':
        return 'Ready';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = () => {
    switch (upload.status) {
      case 'completed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'processing':
        return 'text-blue-400';
      case 'uploading':
        return 'text-blue-400';
      default:
        return 'text-slate-400';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      {/* File Info Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {getStatusIcon()}
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{upload.file.name}</p>
            <p className="text-slate-400 text-sm">
              {formatFileSize(upload.file.size)} • {upload.file.type}
            </p>
          </div>
        </div>
        
        {/* Status */}
        <div className="text-right">
          <p className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {(upload.status === 'uploading' || upload.status === 'processing') && (
        <div className="mb-3">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                upload.status === 'processing' 
                  ? 'bg-blue-500 animate-pulse' 
                  : 'bg-blue-500'
              }`}
              style={{ width: `${upload.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {upload.status === 'failed' && upload.error && (
        <div className="mb-3 p-2 bg-red-900/50 border border-red-500/50 rounded text-red-300 text-sm">
          {upload.error}
        </div>
      )}

      {/* Action Buttons */}
      {(upload.status === 'failed' || upload.status === 'pending') && (
        <div className="flex space-x-2">
          {upload.status === 'failed' && onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
            >
              Retry
            </button>
          )}
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}