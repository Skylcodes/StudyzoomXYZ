import React, { useState, useEffect } from 'react';
import { Tag, DocumentWithTags } from '@/types/Document';

interface TagEditModalProps {
  open: boolean;
  onClose: () => void;
  document: DocumentWithTags;
  allTags: Tag[];
  onSave: (selectedTagIds: string[]) => Promise<void>;
  loading?: boolean;
}

export default function TagEditModal({ open, onClose, document, allTags, onSave, loading = false }: TagEditModalProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setSelected(document.tags.map(t => t.id));
    }
  }, [open, document]);

  const handleToggle = (tagId: string) => {
    setSelected(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(selected);
    setSaving(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900/90 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-slate-700 backdrop-blur-md" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)' }}>
        <h2 className="text-2xl font-extrabold text-white mb-6 font-display tracking-tight drop-shadow-lg">Edit Tags for <span className="text-blue-400">{document.original_filename}</span></h2>
        <div className="space-y-3 mb-8 max-h-60 overflow-y-auto">
          {allTags.length === 0 ? (
            <div className="text-slate-400">No tags available. Create tags first.</div>
          ) : (
            allTags.map(tag => (
              <label key={tag.id} className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors">
                <input
                  type="checkbox"
                  checked={selected.includes(tag.id)}
                  onChange={() => handleToggle(tag.id)}
                  disabled={loading || saving}
                  className="accent-blue-500 w-5 h-5 rounded-md border-2 border-blue-500 shadow-sm focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                />
                <span className="text-slate-200 text-base font-semibold tracking-tight">{tag.name}</span>
              </label>
            ))
          )}
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-5 py-2 rounded-full bg-slate-700 text-slate-200 font-semibold hover:bg-slate-600 transition-colors shadow"
            onClick={onClose}
            disabled={loading || saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold hover:from-blue-700 hover:to-blue-500 transition-colors shadow-lg disabled:opacity-50"
            onClick={handleSave}
            disabled={loading || saving}
          >
            {saving || loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
} 