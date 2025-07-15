"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { NoteWithDocument } from "@/types/Note";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Pencil, FileText } from "lucide-react";
import NoteEditorModal from '@/components/NoteEditorModal';
import { DocumentWithTags } from "@/types/Document";

export default function NotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<NoteWithDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeNote, setActiveNote] = useState<NoteWithDocument | null>(null);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteDocId, setNewNoteDocId] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [documents, setDocuments] = useState<{ id: string; filename: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/notes?user_id=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setNotes(data.notes || []);
        setLoading(false);
      });
  }, [user, modalOpen]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/documents/with-tags?user_id=${user.id}`)
      .then((res) => res.json())
      .then((data) => setDocuments(data.documents || []));
  }, [user]);

  if (!user) {
    return <div className="text-slate-400">Loading user...</div>;
  }

  const handleCreate = async () => {
    setError("");
    if (!newNoteDocId || !newNoteContent) {
      setError("Select a document and enter note content.");
      return;
    }
    setCreating(true);
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, document_id: newNoteDocId, content: newNoteContent }),
    });
    const data = await res.json();
    setCreating(false);
    if (res.ok) {
      setNotes((prev) => [data.note, ...prev]);
      setNewNoteContent("");
      setNewNoteDocId("");
    } else {
      setError(data.error || "Failed to create note");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-white">📝 Notes</h1>
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 rounded-2xl p-6 border border-slate-800/50 shadow-lg mb-8">
        <h2 className="text-lg font-semibold text-white mb-2">Add a New Note</h2>
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <select
            className="bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newNoteDocId}
            onChange={(e) => setNewNoteDocId(e.target.value)}
          >
            <option value="">Select Document</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.filename}
              </option>
            ))}
          </select>
          <Input
            className="flex-1 bg-slate-900 text-white border-slate-700"
            placeholder="Write your note..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            disabled={creating}
          />
          <Button onClick={handleCreate} disabled={creating} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            {creating ? "Saving..." : "Add Note"}
          </Button>
        </div>
        {error && <div className="text-red-400 mt-2">{error}</div>}
      </div>
      <div className="space-y-6">
        {loading ? (
          <div className="text-slate-400">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="text-slate-400">No notes yet. Add your first note above!</div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 rounded-xl p-5 border border-slate-800/50 shadow flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="text-blue-400" size={18} />
                  <Link
                    href={`/dashboard/library?doc=${note.document_id}`}
                    className="text-blue-400 hover:underline font-medium"
                  >
                    {note.document?.filename || "(Unknown Document)"}
                  </Link>
                </div>
                <div className="text-slate-200 text-base whitespace-pre-line line-clamp-3 max-h-24 overflow-hidden">
                  {note.content}
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Button
                  onClick={() => { setActiveNote(note); setModalOpen(true); }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-1"
                  aria-label="Edit note"
                >
                  <Pencil size={16} /> Edit
                </Button>
                <div className="text-xs text-slate-500 mt-2">
                  Last updated: {new Date(note.updated_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {activeNote && (
        <NoteEditorModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setTimeout(() => setActiveNote(null), 300); }}
          document={activeNote.document as DocumentWithTags}
          userId={user.id}
        />
      )}
    </div>
  );
} 