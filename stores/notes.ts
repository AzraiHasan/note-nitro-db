// stores/notes.ts
import { defineStore } from 'pinia'
import type { Note } from '@/types'

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [] as Note[],
    currentNote: null as Note | null,
  }),
  
  actions: {
    async fetchNotes() {
      try {
        const notes = await $fetch<Note[]>('/api/notes')
        this.notes = notes
      } catch (error) {
        console.error('Error fetching notes:', error)
        throw error
      }
    },
    
    async fetchNote(id: string) {
      try {
        const note = await $fetch<Note>(`/api/notes/${id}`)
        this.currentNote = note
        return note
      } catch (error) {
        console.error('Error fetching note:', error)
        throw error
      }
    },
    
    async createNote(note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
      try {
        const newNote = await $fetch<Note>('/api/notes', {
          method: 'POST',
          body: note,
        })
        this.notes.push(newNote)
        return newNote
      } catch (error) {
        console.error('Error creating note:', error)
        throw error
      }
    },
    
    async updateNote(updatedNote: Note) {
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
        throw error
      }
    },
    
    async deleteNote(id: string) {
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
        throw error
      }
    },
  },
})