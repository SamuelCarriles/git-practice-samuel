// api.ts
import { Note, CreateNoteRequest, UpdateNoteRequest } from '@/types/note';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

if (!API_BASE_URL || !API_KEY) {
  throw new Error("Faltan variables de entorno NEXT_PUBLIC_");
}
class ApiService {
  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'key': API_KEY, 
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }
    return response.json();
  }

  async getNotes(): Promise<Note[]> {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Note[]>(response);
  }

  async getNote(noteId: string): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Note>(response);
  }

  async createNote(note: CreateNoteRequest): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(note),
    });
    return this.handleResponse<Note>(response);
  }

  async updateNote(noteId: string, note: UpdateNoteRequest): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(note),
    });
    return this.handleResponse<Note>(response);
  }

  async deleteNote(noteId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }
  }

  async searchNotes(query: string): Promise<Note[]> {
    const response = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`,
      {
        headers: this.getHeaders(),
      }
    );
    return this.handleResponse<Note[]>(response);
  }
}

export const apiService = new ApiService();