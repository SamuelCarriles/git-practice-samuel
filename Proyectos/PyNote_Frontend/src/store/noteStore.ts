import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '@/types/note';
import { apiService } from '@/lib/api';

interface NoteStore {
  notes: Note[];
  filteredNotes: Note[];
  selectedNote: Note | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  
  // Actions
  fetchNotes: () => Promise<void>;
  createNote: (note: CreateNoteRequest) => Promise<void>;
  updateNote: (noteId: string, note: UpdateNoteRequest) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  searchNotes: (query: string) => Promise<void>;
  setSelectedNote: (note: Note | null) => void;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
}

export const useNoteStore = create<NoteStore>()(
  devtools(
    (set, get) => ({
      notes: [],
      filteredNotes: [],
      selectedNote: null,
      isLoading: false,
      error: null,
      searchQuery: '',

      fetchNotes: async () => {
        set({ isLoading: true, error: null });
        try {
          const notes = await apiService.getNotes();
          const sortedNotes = notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          set({ 
            notes: sortedNotes, 
            filteredNotes: sortedNotes, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch notes', 
            isLoading: false 
          });
        }
      },

      createNote: async (note: CreateNoteRequest) => {
        set({ isLoading: true, error: null });
        try {
          const newNote = await apiService.createNote(note);
          const currentNotes = get().notes;
          const updatedNotes = [newNote, ...currentNotes].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          set({ 
            notes: updatedNotes, 
            filteredNotes: get().searchQuery ? updatedNotes : updatedNotes,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create note', 
            isLoading: false 
          });
        }
      },

      updateNote: async (noteId: string, note: UpdateNoteRequest) => {
        set({ isLoading: true, error: null });
        try {
          const updatedNote = await apiService.updateNote(noteId, note);
          const currentNotes = get().notes;
          const updatedNotes = currentNotes.map(n => n.note_id === noteId ? updatedNote : n);
          set({ 
            notes: updatedNotes, 
            filteredNotes: get().searchQuery ? updatedNotes : updatedNotes,
            selectedNote: get().selectedNote?.note_id === noteId ? updatedNote : get().selectedNote,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update note', 
            isLoading: false 
          });
        }
      },

      deleteNote: async (noteId: string) => {
        set({ isLoading: true, error: null });
        try {
          await apiService.deleteNote(noteId);
          const currentNotes = get().notes;
          const updatedNotes = currentNotes.filter(n => n.note_id !== noteId);
          set({ 
            notes: updatedNotes, 
            filteredNotes: get().searchQuery ? updatedNotes : updatedNotes,
            selectedNote: get().selectedNote?.note_id === noteId ? null : get().selectedNote,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete note', 
            isLoading: false 
          });
        }
      },

      searchNotes: async (query: string) => {
        set({ searchQuery: query, isLoading: true, error: null });
        try {
          if (query.trim() === '') {
            const notes = get().notes;
            set({ 
              filteredNotes: notes, 
              isLoading: false 
            });
            return;
          }

          const searchResults = await apiService.searchNotes(query);
          const sortedResults = searchResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          set({ 
            filteredNotes: sortedResults, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to search notes', 
            isLoading: false 
          });
        }
      },

      setSelectedNote: (note: Note | null) => {
        set({ selectedNote: note });
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'note-store',
    }
  )
);