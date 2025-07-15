import React from 'react';
import { Tag } from '@/types/Document';
import { Trash2 } from 'lucide-react';

interface TagFilterBarProps {
  tags: Tag[];
  selectedTag: string | null;
  onSelectTag: (tagId: string | null) => void;
  onDeleteTag?: (tagId: string) => void;
}

export default function TagFilterBar({ tags, selectedTag, onSelectTag, onDeleteTag }: TagFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 bg-slate-800/60 rounded-xl px-4 py-3 shadow-lg backdrop-blur-md">
      <button
        className={`px-4 py-2 rounded-full border-none text-sm font-semibold transition-all duration-200 shadow-sm ${
          selectedTag === null
            ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md'
            : 'bg-slate-900/80 text-slate-300 hover:bg-blue-700 hover:text-white'
        }`}
        onClick={() => onSelectTag(null)}
      >
        All
      </button>
      {tags.map(tag => (
        <div key={tag.id} className="flex items-center gap-1">
          <button
            className={`px-4 py-2 rounded-full border-none text-sm font-semibold transition-all duration-200 shadow-sm ${
              selectedTag === tag.id
                ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md'
                : 'bg-slate-900/80 text-slate-300 hover:bg-blue-700 hover:text-white'
            }`}
            onClick={() => onSelectTag(tag.id)}
          >
            {tag.name}
          </button>
          {onDeleteTag && (
            <button
              type="button"
              className="p-1 rounded-full hover:bg-red-700/40 text-red-400 hover:text-red-200 transition-colors shadow"
              title="Delete tag"
              onClick={() => {
                if (window.confirm(`Delete tag '${tag.name}'? This will remove it from all documents.`)) {
                  onDeleteTag(tag.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4 drop-shadow" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
} 