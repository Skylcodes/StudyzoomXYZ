import React, { useEffect, useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Save } from 'lucide-react';
import { DocumentWithTags } from '@/types/Document';
import { Note } from '@/types/Note';

interface NoteEditorModalProps {
  open: boolean;
  onClose: () => void;
  document: DocumentWithTags;
  userId: string;
}

export default function NoteEditorModal({ open, onClose, document, userId }: NoteEditorModalProps) {
  const [note, setNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [autosaveTimeout, setAutosaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [saved, setSaved] = useState(false);

  // Fetch note for this document/user
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError('');
    fetch(`/api/notes?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        const found = (data.notes || []).find((n: Note) => n.document_id === document.id);
        setNote(found || null);
        setContent(found ? found.content : '');
        setLoading(false);
      });
  }, [open, document.id, userId]);

  // Autosave on content change (debounced)
  useEffect(() => {
    if (!open) return;
    if (loading) return;
    if (!note && !content.trim()) return; // Don't autosave empty new note
    setSaved(false);
    if (autosaveTimeout) clearTimeout(autosaveTimeout);
    setAutosaveTimeout(setTimeout(() => {
      handleSave(true);
    }, 1200));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  // Focus textarea on open
  useEffect(() => {
    if (open && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 200);
    }
  }, [open]);

  const handleSave = async (isAuto = false) => {
    if (saving || loading) return;
    setSaving(true);
    setError('');
    let res, data;
    if (note) {
      res = await fetch('/api/notes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: note.id, user_id: userId, content }),
      });
      data = await res.json();
    } else {
      if (!content.trim()) {
        setSaving(false);
        return;
      }
      res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, document_id: document.id, content }),
      });
      data = await res.json();
    }
    setSaving(false);
    if (res.ok) {
      setNote(data.note || note);
      setSaved(true);
      if (!isAuto) setTimeout(() => setSaved(false), 1200);
    } else {
      setError(data.error || 'Failed to save note');
    }
  };

  // Keyboard accessibility: close on Esc
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, content, note]);

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        {/* Overlay */}
        <div aria-hidden="true" className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0" />
        <div className="relative bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 max-w-2xl w-full mx-auto p-8 flex flex-col gap-6 z-10">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close notes editor"
          >
            <X size={22} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Notes for <span className="text-blue-400">{document.original_filename}</span></h2>
            <p className="text-slate-400 text-sm mb-4">All your notes for this document are saved here. Markdown supported.</p>
          </div>
          {loading ? (
            <div className="text-slate-400">Loading note...</div>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); handleSave(); }}
              className="flex flex-col gap-4"
            >
              <label htmlFor="note-content" className="text-slate-300 font-medium mb-1">Your Note</label>
              <textarea
                id="note-content"
                ref={textareaRef}
                className="w-full min-h-[200px] max-h-[400px] bg-slate-800 text-white rounded-lg p-4 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-mono resize-vertical shadow-inner"
                placeholder="Write your notes here... (Markdown supported)"
                value={content}
                onChange={e => setContent(e.target.value)}
                aria-label="Note content"
                spellCheck={true}
                tabIndex={0}
              />
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:opacity-90 transition disabled:opacity-60"
                  disabled={saving || loading}
                  aria-label="Save note"
                >
                  <Save size={18} /> Save
                </button>
                {saved && <span className="text-green-400 text-sm">Saved</span>}
                {saving && <span className="text-blue-400 text-sm">Saving...</span>}
                {error && <span className="text-red-400 text-sm">{error}</span>}
              </div>
            </form>
          )}
        </div>
      </div>
    </Dialog>
  );
} 