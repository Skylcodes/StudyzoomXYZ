'use client';

import React from 'react';
import { RefreshCw, CheckCircle } from 'lucide-react';

interface StorageQuickFixProps {
  onRecheck: () => void;
  isChecking?: boolean;
}

export default function StorageQuickFix({ onRecheck, isChecking = false }: StorageQuickFixProps) {
  return (
    <div className="bg-blue-900/50 border border-blue-600 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-blue-400 font-medium mb-2">Storage Configuration Check</h3>
          <p className="text-blue-200 text-sm mb-3">
            If you just created the bucket and RLS policies, click the button below to refresh the storage status.
          </p>

          <button
            onClick={onRecheck}
            disabled={isChecking}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Checking...' : 'Recheck Storage'}
          </button>

          <div className="mt-3 text-xs text-blue-300">
            <p>💡 <strong>Tip:</strong> Open your browser&apos;s Developer Tools (F12) and check the Console tab for detailed debug information.</p>
          </div>
        </div>
      </div>
    </div>
  );
}