'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { validateFiles } from '@/lib/documents';

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
}

export default function FileUploadZone({ 
  onFilesSelected, 
  maxFiles = 10,
  disabled = false,
  className = '' 
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFileValidation = useCallback((files: File[]) => {
    const validation = validateFiles(files);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return false;
    }
    
    setValidationErrors([]);
    return true;
  }, []);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || disabled) return;
    
    const fileArray = Array.from(files).slice(0, maxFiles);
    
    if (handleFileValidation(fileArray)) {
      onFilesSelected(fileArray);
    }
  }, [onFilesSelected, maxFiles, disabled, handleFileValidation]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only hide drag over when leaving the main container
    if (e.currentTarget === e.target) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [disabled, handleFiles]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input value to allow selecting the same files again
    e.target.value = '';
  }, [handleFiles]);

  const clearErrors = useCallback(() => {
    setValidationErrors([]);
  }, []);

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-slate-600 hover:border-slate-500'
          }
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer hover:bg-slate-800/50'
          }
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled) {
            document.getElementById('file-input')?.click();
          }
        }}
      >
        {/* Hidden file input */}
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,.pptx,.ppt,.docx,.doc,.txt,.jpg,.jpeg,.png,.tiff,.mp4,.mov,.avi,.mp3,.wav,.zip"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Upload icon and text */}
        <div className="space-y-4">
          <Upload 
            className={`h-12 w-12 mx-auto transition-colors ${
              isDragOver ? 'text-blue-500' : 'text-slate-400'
            }`} 
          />
          
          <div>
            <h3 className="text-white text-xl font-semibold mb-2">
              {isDragOver ? 'Drop files here' : 'Upload Study Materials'}
            </h3>
            <p className="text-slate-400 mb-4">
              Drag and drop your documents here or click to browse
            </p>
            <div className="text-sm text-slate-500 space-y-1">
              <div>Supported formats: PDF, PPTX, DOCX, TXT, Images, Videos, ZIP</div>
              <div>Max size: 1GB per file • Max {maxFiles} files per upload</div>
            </div>
          </div>

          {!disabled && (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('file-input')?.click();
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </button>
          )}
        </div>

        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <div className="text-blue-500 text-lg font-semibold">
              Drop files to upload
            </div>
          </div>
        )}
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mt-4 bg-red-900/50 border border-red-500 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-red-400 font-medium mb-2">Upload Errors</h4>
              <ul className="text-red-300 text-sm space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={clearErrors}
              className="text-red-400 hover:text-red-300 ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}