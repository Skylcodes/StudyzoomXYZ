import React, { useState } from 'react';
import { Tag } from '@/types/Document';

interface TagCreateInputProps {
  onCreate: (name: string) => Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  existingTags: Tag[];
}

export default function TagCreateInput({ onCreate, loading = false, disabled = false, existingTags }: TagCreateInputProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError('Tag name cannot be empty');
      return;
    }
    if (existingTags.some(tag => tag.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Tag already exists');
      return;
    }
    setError(null);
    await onCreate(trimmed);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2 bg-slate-800/60 rounded-full px-4 py-2 shadow-lg backdrop-blur-md">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Add new tag..."
        className="px-4 py-2 rounded-full border-none bg-slate-900/70 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-inner transition-all duration-200"
        disabled={loading || disabled}
        maxLength={32}
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white text-sm font-semibold shadow-md hover:from-blue-700 hover:to-blue-500 transition-colors disabled:opacity-50"
        disabled={loading || disabled}
      >
        {loading ? 'Adding...' : 'Add'}
      </button>
      {error && <span className="text-red-400 text-xs ml-2 font-semibold drop-shadow">{error}</span>}
    </form>
  );
} 