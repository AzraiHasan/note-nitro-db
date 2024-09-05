// stores/notes.ts
import { defineStore } from 'pinia'
import type { Note } from '@/types'

interface NotesState {
  notes: Note[]
  currentNote: Note | null
  isLoading: boolean
  error: string | null
}

export const useNotesStore = defineStore('notes', {
  state: (): NotesState => ({
    notes: [],
    currentNote: null,
    isLoading: false,
    error: null,
  }),
  
  getters: {
    getNoteById: (state) => (id: string) => state.notes.find(note => note.id === id),
    getNotesByStatus: (state) => (status: string) => state.notes.filter(note => note.status === status),
  },

  actions: {
    async fetchNotes() {
      this.isLoading = true
      this.error = null
      try {
        const notes = await $fetch<Note[]>('/api/notes')
        this.notes = notes
      } catch (error) {
        console.error('Error fetching notes:', error)
        this.error = 'Failed to fetch notes. Please try again.'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async fetchNote(id: string) {
      this.isLoading = true
      this.error = null
      try {
        const note = await $fetch<Note>(`/api/notes/${id}`)
        this.currentNote = note
        return note
      } catch (error) {
        console.error('Error fetching note:', error)
        this.error = 'Failed to fetch note. Please try again.'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async createNote(note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
      this.isLoading = true
      this.error = null
      try {
        const newNote = await $fetch<Note>('/api/notes', {
          method: 'POST',
          body: note,
        })
        this.notes.push(newNote)
        return newNote
      } catch (error) {
        console.error('Error creating note:', error)
        this.error = 'Failed to create note. Please try again.'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async updateNote(updatedNote: Note) {
      this.isLoading = true
      this.error = null
      try {
        const note = await $fetch<Note>(`/api/notes/${updatedNote.id}`, {
          method: 'PUT',
          body: updatedNote,
        })
        const index = this.notes.findIndex(n => n.id === note.id)
        if (index !== -1) {
          this.notes[index] = note
        }
        if (this.currentNote && this.currentNote.id === note.id) {
          this.currentNote = note
        }
        return note
      } catch (error) {
        console.error('Error updating note:', error)
        this.error = 'Failed to update note. Please try again.'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async deleteNote(id: string) {
      this.isLoading = true
      this.error = null
      try {
        await $fetch(`/api/notes/${id}`, {
          method: 'DELETE',
        })
        this.notes = this.notes.filter(note => note.id !== id)
        if (this.currentNote && this.currentNote.id === id) {
          this.currentNote = null
        }
      } catch (error) {
        console.error('Error deleting note:', error)
        this.error = 'Failed to delete note. Please try again.'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    clearError() {
      this.error = null
    },
  },
})