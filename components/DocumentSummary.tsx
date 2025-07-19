'use client';

import { useState, useEffect, useCallback } from 'react';
import { Document } from '@/types/Document';
import { toast } from 'react-hot-toast';
import { 
  RefreshCwIcon, 
  FileTextIcon, 
  BrainCircuitIcon, 
  MessageSquareIcon,
  PlayIcon,
  BookOpenIcon,
  SparklesIcon,
  AlertCircleIcon,
  CheckCircleIcon
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface DocumentSummaryProps {
  document: Document;
  onDocumentUpdate: (document: Document) => void;
}

interface SummaryData {
  title: string;
  summary: string;
  keyPoints: string[];
  cached: boolean;
}

export default function DocumentSummary({ document, onDocumentUpdate }: DocumentSummaryProps) {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async (regenerate = false) => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = `/api/documents/${document.id}/summary`;
      const method = regenerate ? 'POST' : 'GET';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load summary');
      }

      const data = await response.json();
      
      if (data.success && data.summary) {
        setSummaryData(data.summary);
        
        // Update the document object with the new summary data
        const updatedDocument = {
          ...document,
          title: data.summary.title,
          summary: data.summary.summary,
          key_points: data.summary.keyPoints
        };
        onDocumentUpdate(updatedDocument);

        if (regenerate) {
          toast.success('Summary regenerated successfully!');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error loading summary:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load summary';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [document, onDocumentUpdate]);

  useEffect(() => {
    // Check if document already has summary data
    if (document.summary && document.key_points) {
      setSummaryData({
        title: document.title || document.original_filename,
        summary: document.summary,
        keyPoints: document.key_points,
        cached: true
      });
    } else {
      // Load summary if document has parsed text
      if (document.parsed_text && document.status === 'ready') {
        loadSummary();
      }
    }
  }, [document.id, document.summary, document.key_points, document.parsed_text, document.status, document.title, document.original_filename, loadSummary]);

  const handleRegenerateSummary = () => {
    loadSummary(true);
  };

  const canGenerateSummary = document.status === 'ready' && 
                           document.parsed_text && 
                           document.parsed_text.trim().length > 0;

  if (!canGenerateSummary) {
    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircleIcon className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-semibold text-white">
              {document.status === 'ready' ? 'Document Needs Setup' : 'Document Not Ready'}
            </h2>
          </div>
          <p className="text-slate-400 mb-4">
            {document.status === 'ready' 
              ? 'This document is ready but needs text extraction for AI features. Click the "Fix Document" button above to enable AI features.'
              : 'This document needs to be processed before AI features can be used.'
            }
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Status: {document.status}</span>
            <span>•</span>
            <span>Text Available: {document.parsed_text ? 'Yes' : 'No'}</span>
            {document.status === 'processing' && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-500"></div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tool Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          className="bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700 rounded-lg p-4 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
        >
          <FileTextIcon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <span className="text-sm text-slate-300">Flashcards</span>
          <span className="text-xs text-slate-500 block mt-1">Coming Soon</span>
        </button>
        
        <button 
          className="bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700 rounded-lg p-4 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
        >
          <BrainCircuitIcon className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <span className="text-sm text-slate-300">Quiz</span>
          <span className="text-xs text-slate-500 block mt-1">Coming Soon</span>
        </button>
        
        <button 
          className="bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700 rounded-lg p-4 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
        >
          <PlayIcon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <span className="text-sm text-slate-300">Podcast</span>
          <span className="text-xs text-slate-500 block mt-1">Coming Soon</span>
        </button>
        
        <button 
          className="bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700 rounded-lg p-4 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
        >
          <BookOpenIcon className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <span className="text-sm text-slate-300">Practice Test</span>
          <span className="text-xs text-slate-500 block mt-1">Coming Soon</span>
        </button>
      </div>

      {/* Summary Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">AI Summary</h2>
          </div>
          
          {summaryData && (
            <button
              onClick={handleRegenerateSummary}
              disabled={loading}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCwIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <LoadingSpinner />
              <p className="text-slate-400 mt-2">Generating AI summary...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircleIcon className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Error</span>
            </div>
            <p className="text-red-300 text-sm">{error}</p>
            <button
              onClick={() => loadSummary()}
              className="mt-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/20 text-red-400 px-3 py-1 rounded text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {summaryData && !loading && (
          <div className="space-y-6">
            {/* Summary Text */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-medium text-white">Summary</h3>
                {summaryData.cached && (
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    Cached
                  </span>
                )}
              </div>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {summaryData.summary}
                </p>
              </div>
            </div>

            {/* Key Points */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                <MessageSquareIcon className="w-5 h-5 text-blue-400" />
                Key Points
              </h3>
              <ul className="space-y-2">
                {summaryData.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-slate-300 leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}