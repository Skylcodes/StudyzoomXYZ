import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';
import { NoteWithDocument } from '@/types/Note';

// TODO: Switch to session/cookie-based user auth when available. For now, require user_id in body/query.

// GET: Fetch all notes for the user, including document info
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');
  if (!user_id) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('notes')
    .select('*, document:documents(*)')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ notes: data as NoteWithDocument[] });
}

// POST: Create a new note for a document
export async function POST(req: NextRequest) {
  const { user_id, document_id, content } = await req.json();
  if (!user_id || !document_id || typeof content !== 'string') {
    return NextResponse.json({ error: 'Missing user_id, document_id, or content' }, { status: 400 });
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('notes')
    .insert([{ user_id, document_id, content }])
    .select('*, document:documents(*)')
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ note: data as NoteWithDocument });
}

// PATCH: Update a note's content
export async function PATCH(req: NextRequest) {
  const { id, user_id, content } = await req.json();
  if (!id || !user_id || typeof content !== 'string') {
    return NextResponse.json({ error: 'Missing id, user_id, or content' }, { status: 400 });
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('notes')
    .update({ content })
    .eq('id', id)
    .eq('user_id', user_id)
    .select('*, document:documents(*)')
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ note: data as NoteWithDocument });
}

// DELETE: Delete a note
export async function DELETE(req: NextRequest) {
  const { id, user_id } = await req.json();
  if (!id || !user_id) {
    return NextResponse.json({ error: 'Missing id or user_id' }, { status: 400 });
  }
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', user_id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
} 