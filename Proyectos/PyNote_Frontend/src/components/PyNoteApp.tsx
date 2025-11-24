'use client';

import { useEffect, useState } from 'react';
import { useNoteStore } from '@/store/noteStore';
import { NoteCard } from './NoteCard';
import { NoteModal } from './NoteModal';
import { DeleteDialog } from './DeleteDialog';
import { FloatingActionButton } from './FloatingActionButton';
import { SearchBar } from './SearchBar';
import { NoteCardSkeleton, SearchBarSkeleton } from './LoadingSkeletons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw, FileText, Moon, Sun } from 'lucide-react';
import { Note } from '@/types/note';
import { useTheme } from 'next-themes';

export function PyNoteApp() {
  const {
    notes,
    filteredNotes,
    selectedNote,
    isLoading,
    error,
    fetchNotes,
    deleteNote,
    setSelectedNote,
    clearError,
  } = useNoteStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    // Keyboard shortcut: "n" for new note
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleCreateNote();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleDeleteNote = (note: Note) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (noteToDelete) {
      setIsDeleting(true);
      try {
        await deleteNote(noteToDelete.note_id);
        setDeleteDialogOpen(false);
        setNoteToDelete(null);
      } catch (error) {
        console.error('Error deleting note:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">No hay notas</h3>
      <p className="text-muted-foreground mb-6">
        {notes.length === 0 
          ? 'Crea tu primera nota para comenzar' 
          : 'No se encontraron notas con ese criterio de búsqueda'
        }
      </p>
      {notes.length === 0 && (
        <Button onClick={handleCreateNote}>
          Crear primera nota
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">PyNote</h1>
              <Badge variant="secondary" className="text-xs">
                {filteredNotes.length} {filteredNotes.length === 1 ? 'nota' : 'notas'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNotes()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refrescar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          {isLoading && notes.length === 0 ? (
            <SearchBarSkeleton />
          ) : (
            <SearchBar />
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <AlertDescription className="text-red-800 dark:text-red-200">
              {error}
              <Button
                variant="link"
                className="p-0 h-auto ml-2 text-red-800 dark:text-red-200"
                onClick={clearError}
              >
                Descartar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && notes.length === 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <NoteCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Notes Grid */}
            {filteredNotes.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.note_id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                    onSelect={handleSelectNote}
                    isSelected={selectedNote?.note_id === note.note_id}
                  />
                ))}
              </div>
            ) : (
              renderEmptyState()
            )}
          </>
        )}
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleCreateNote} />

      {/* Note Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        note={editingNote}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        noteTitle={noteToDelete?.title || 'Sin título'}
        isLoading={isDeleting}
      />
    </div>
  );
}