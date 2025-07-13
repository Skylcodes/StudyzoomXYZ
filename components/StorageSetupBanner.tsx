'use client';

import React from 'react';
import { AlertTriangle, Database, ExternalLink } from 'lucide-react';

interface StorageSetupBannerProps {
  error?: string;
  onDismiss?: () => void;
}

export default function StorageSetupBanner({ error, onDismiss }: StorageSetupBannerProps) {
  return (
    <div className="bg-yellow-900/50 border border-yellow-600 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-yellow-400 font-medium mb-2">Storage Setup Required</h3>
          <p className="text-yellow-200 text-sm mb-3">
            The document storage bucket hasn&apos;t been created yet. To enable file uploads, you need to set up Supabase Storage.
          </p>
          
          {error && (
            <div className="bg-yellow-800/50 border border-yellow-600 rounded p-2 mb-3">
              <p className="text-yellow-100 text-xs font-mono">{error}</p>
            </div>
          )}

          <div className="space-y-2 text-sm text-yellow-200">
            <h4 className="font-medium text-yellow-300">Setup Steps:</h4>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Go to your Supabase Dashboard → Storage</li>
              <li>Create a new bucket named &quot;documents&quot;</li>
              <li>Set it as private (not public)</li>
              <li>Copy the SQL policies from <code className="bg-yellow-800/50 px-1 rounded">supabase/STORAGE_SETUP.md</code></li>
              <li>Refresh this page to start uploading</li>
            </ol>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors"
            >
              <Database className="h-4 w-4 mr-1" />
              Open Supabase Dashboard
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-yellow-400 hover:text-yellow-300 text-sm"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}