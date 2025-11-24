export interface Note {
  note_id: string;
  title: string;
  body: string;
  date: string;
}

export interface CreateNoteRequest {
  title: string;
  body: string;
}

export interface UpdateNoteRequest {
  title: string;
  body: string;
}