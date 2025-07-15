export interface Note {
  id: string;
  user_id: string;
  document_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface NoteWithDocument extends Note {
  document: {
    id: string;
    filename: string;
    original_filename: string;
    file_type: string;
    file_size: number;
    storage_path: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
} 