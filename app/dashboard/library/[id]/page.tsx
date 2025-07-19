'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Document } from '@/types/Document';
import { getDocumentWithTags } from '@/lib/documents';
import { toast } from 'react-hot-toast';
import DocumentSummary from '@/components/DocumentSummary';
import DocumentChatbot from '@/components/DocumentChatbot';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeftIcon, WrenchIcon } from 'lucide-react';

interface DocumentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);

  useEffect(() => {
    const initializeParams = async () => {
      const { id } = await params;
      setDocumentId(id);
    };
    initializeParams();
  }, [params]);

  const loadDocument = useCallback(async () => {
    if (!documentId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const doc = await getDocumentWithTags(documentId);
      
      if (!doc) {
        setError('Document not found');
        return;
      }

      // Check if user owns this document
      if (doc.user_id !== user?.id) {
        setError('You do not have permission to view this document');
        return;
      }

      setDocument(doc);
    } catch (err) {
      console.error('Error loading document:', err);
      setError('Failed to load document');
      toast.error('Failed to load document');
    } finally {
      setLoading(false);
    }
  }, [documentId, user?.id]);

  useEffect(() => {
    if (!user?.id) {
      router.push('/login');
      return;
    }

    if (documentId) {
      loadDocument();
    }
  }, [user?.id, documentId, router, loadDocument]);

  const handleBack = () => {
    router.push('/dashboard/library');
  };

  const handleFixDocument = async () => {
    if (!document) return;
    
    try {
      toast.loading('Fixing document...', { id: 'fix-document' });
      
      const response = await fetch('/api/documents/fix-parsed-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: document.id
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      if (result.success) {
        toast.success(`Document fixed! ${result.message}`, { id: 'fix-document' });
        // Reload the document to get updated data
        await loadDocument();
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fixing document:', error);
      toast.error(
        `Failed to fix document: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { id: 'fix-document' }
      );
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
        <div className="text-center">
          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-6 max-w-md">
            <h2 className="text-red-400 text-xl font-semibold mb-2">Error</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={handleBack}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Library
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
        <div className="text-center">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 max-w-md">
            <h2 className="text-slate-300 text-xl font-semibold mb-2">Document Not Found</h2>
            <p className="text-slate-400 mb-4">The document you&apos;re looking for could not be found.</p>
            <button
              onClick={handleBack}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Library
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Library
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white truncate">
                {document.title || document.original_filename}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-slate-400 text-sm">
                  {document.file_type} • {(document.file_size / 1024 / 1024).toFixed(2)} MB
                </p>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  document.status === 'ready' ? 'bg-green-900/20 text-green-400' :
                  document.status === 'processing' ? 'bg-blue-900/20 text-blue-400' :
                  document.status === 'failed' ? 'bg-red-900/20 text-red-400' :
                  'bg-slate-900/20 text-slate-400'
                }`}>
                  {document.status === 'ready' ? 'Ready' :
                   document.status === 'processing' ? 'Processing...' :
                   document.status === 'failed' ? 'Failed' :
                   document.status}
                </span>
              </div>
            </div>
            
            {/* Fix Document Button */}
            {document.status === 'ready' && (
              !document.parsed_text || 
              document.parsed_text.trim().length === 0 ||
              document.parsed_text.includes('This is simulated') ||
              document.parsed_text.includes('This is a sample document') ||
              document.parsed_text.includes('This would contain the actual') ||
              document.parsed_text.length < 200
            ) && (
              <button
                onClick={handleFixDocument}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <WrenchIcon className="w-4 h-4" />
                Fix Document
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - TurboAI Style Layout */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)]">
        {/* Left Side - Summary and Tools (2/3) */}
        <div className="flex-1 lg:flex-[2] p-6 overflow-y-auto">
          <DocumentSummary document={document} onDocumentUpdate={setDocument} />
        </div>

        {/* Right Side - Chatbot (1/3) */}
        <div className="w-full lg:w-[400px] lg:flex-[1] border-l border-slate-800/50 bg-slate-900/30">
          <DocumentChatbot document={document} />
        </div>
      </div>
    </div>
  );
}