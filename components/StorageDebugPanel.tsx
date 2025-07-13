'use client';

import React, { useState, useEffect } from 'react';
import { Bug, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { logSupabaseConfig } from '@/utils/debug';

interface StorageDebugPanelProps {
  show?: boolean;
}

export default function StorageDebugPanel({ show = false }: StorageDebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<{
    supabaseUrl: boolean;
    supabaseKey: boolean;
    bucketsResponse: Array<{ id: string; name: string }> | null;
    bucketsError: unknown;
    listResponse: unknown;
    listError: unknown;
  }>({
    supabaseUrl: false,
    supabaseKey: false,
    bucketsResponse: null,
    bucketsError: null,
    listResponse: null,
    listError: null
  });

  useEffect(() => {
    if (isExpanded) {
      runDiagnostics();
      logSupabaseConfig();
    }
  }, [isExpanded]);

  const runDiagnostics = async () => {
    // Check environment variables
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Test bucket listing
    let bucketsResponse: Array<{ id: string; name: string }> | null = null;
    let bucketsError: unknown = null;
    try {
      const result = await supabase.storage.listBuckets();
      bucketsResponse = result.data;
      bucketsError = result.error;
    } catch (err) {
      bucketsError = err;
    }

    // Test documents bucket access
    let listResponse: unknown = null;
    let listError: unknown = null;
    try {
      const result = await supabase.storage.from('documents').list('', { limit: 1 });
      listResponse = result.data;
      listError = result.error;
    } catch (err) {
      listError = err;
    }

    setDebugInfo({
      supabaseUrl: hasUrl,
      supabaseKey: hasKey,
      bucketsResponse,
      bucketsError,
      listResponse,
      listError
    });
  };

  if (!show && process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-slate-700 transition-colors"
      >
        <div className="flex items-center">
          <Bug className="h-4 w-4 text-slate-400 mr-2" />
          <span className="text-slate-300 text-sm font-medium">Storage Debug Panel</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-slate-600 p-4 space-y-4 text-sm">
          {/* Environment Check */}
          <div>
            <h4 className="text-slate-300 font-medium mb-2">Environment Configuration</h4>
            <div className="space-y-1">
              <div className="flex items-center">
                {debugInfo.supabaseUrl ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className="text-slate-400">NEXT_PUBLIC_SUPABASE_URL</span>
              </div>
              <div className="flex items-center">
                {debugInfo.supabaseKey ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className="text-slate-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              </div>
            </div>
          </div>

          {/* Storage Buckets */}
          <div>
            <h4 className="text-slate-300 font-medium mb-2">Storage Buckets</h4>
            {debugInfo.bucketsError ? (
              <div className="flex items-start">
                <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                <div>
                  <div className="text-red-400">Error accessing buckets</div>
                  <code className="text-xs text-red-300 bg-red-900/30 px-2 py-1 rounded mt-1 block">
                    {JSON.stringify(debugInfo.bucketsError, null, 2)}
                  </code>
                </div>
              </div>
            ) : debugInfo.bucketsResponse ? (
              <div>
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-slate-400">Found {debugInfo.bucketsResponse.length} bucket(s)</span>
                </div>
                <div className="space-y-1">
                  {debugInfo.bucketsResponse.map((bucket) => (
                    <div key={bucket.id} className="flex items-center">
                      {bucket.name === 'documents' ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-yellow-500 mr-2" />
                      )}
                      <span className="text-slate-400">{bucket.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-slate-400">Loading...</span>
              </div>
            )}
          </div>

          {/* Documents Bucket Access */}
          <div>
            <h4 className="text-slate-300 font-medium mb-2">Documents Bucket Access</h4>
            {debugInfo.listError ? (
              <div className="flex items-start">
                <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                <div>
                  <div className="text-red-400">Cannot access documents bucket</div>
                  <code className="text-xs text-red-300 bg-red-900/30 px-2 py-1 rounded mt-1 block">
                    {JSON.stringify(debugInfo.listError, null, 2)}
                  </code>
                </div>
              </div>
            ) : debugInfo.listResponse !== null ? (
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-slate-400">Documents bucket accessible</span>
              </div>
            ) : (
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-slate-400">Testing access...</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-600">
            <button
              onClick={runDiagnostics}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
            >
              Re-run Diagnostics
            </button>
          </div>
        </div>
      )}
    </div>
  );
}