'use client';

import React from 'react';
import { DocumentWithTags } from '@/types/Document';
import FilePreview from './FilePreview';
import { FileText, Search } from 'lucide-react';

interface FileListProps {
  documents: DocumentWithTags[];
  onDelete?: (documentId: string) => void;
  onView?: (document: DocumentWithTags) => void;
  onEditTags?: (document: DocumentWithTags) => void;
  isLoading?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  className?: string;
}

export default function FileList({ 
  documents, 
  onDelete, 
  onView, 
  onEditTags,
  isLoading = false,
  searchQuery = '',
  onSearchChange,
  className = '' 
}: FileListProps) {
  
  const filteredDocuments = documents.filter(doc => 
    doc.original_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.file_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className={`bg-slate-900 border border-slate-800 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-slate-400">Loading documents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-lg font-bold">Your Documents</h3>
            <p className="text-slate-400 text-sm">
              {documents.length} document{documents.length !== 1 ? 's' : ''} total
            </p>
          </div>
          
          {/* Search */}
          {onSearchChange && documents.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 w-64"
              />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {documents.length === 0 ? (
          // Empty State
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h4 className="text-white text-lg font-medium mb-2">No documents yet</h4>
            <p className="text-slate-400">Upload your first document to get started</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          // No Search Results
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h4 className="text-white text-lg font-medium mb-2">No documents found</h4>
            <p className="text-slate-400">Try adjusting your search terms</p>
          </div>
        ) : (
          // Document Grid
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDocuments.map((document) => (
              <FilePreview
                key={document.id}
                document={document}
                onDelete={onDelete}
                onView={onView}
                onEditTags={onEditTags}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer with stats */}
      {documents.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div>
              {filteredDocuments.length !== documents.length && (
                <span>Showing {filteredDocuments.length} of {documents.length} documents</span>
              )}
            </div>
            <div className="flex space-x-4">
              <span>
                Ready: {documents.filter(d => d.status === 'ready').length}
              </span>
              <span>
                Processing: {documents.filter(d => d.status === 'processing').length}
              </span>
              {documents.filter(d => d.status === 'failed').length > 0 && (
                <span className="text-red-400">
                  Failed: {documents.filter(d => d.status === 'failed').length}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}