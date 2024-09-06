// tests/unit/stores/notes.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotesStore } from '@/stores/notes'

describe('Notes Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('fetches notes', async () => {
    const store = useNotesStore()
    await store.fetchNotes()
    expect(store.notes.length).toBeGreaterThan(0)
  })

  it('creates a new note', async () => {
    const store = useNotesStore()
    const newNote = {
      title: 'Test Note',
      content: 'This is a test note',
      status: 'Draft' as 'Draft' | 'In Progress' | 'Completed',
      tags: ['test']
    } 

    await store.createNote(newNote)
    expect(store.notes.length).toBe(1)
    expect(store.notes[0].title).toBe('Test Note')
  })

  it('updates a note', async () => {
    const store = useNotesStore()
    await store.createNote({
      title: 'Original Title',
      content: 'Original content',
      status: 'Draft',
      tags: []
    })
    const noteToUpdate = { ...store.notes[0], title: 'Updated Title' }
    await store.updateNote(noteToUpdate)
    expect(store.notes[0].title).toBe('Updated Title')
  })

  it('deletes a note', async () => {
    const store = useNotesStore()
    await store.createNote({
      title: 'Note to Delete',
      content: 'This note will be deleted',
      status: 'Draft',
      tags: []
    })
    const noteId = store.notes[0].id
    await store.deleteNote(noteId)
    expect(store.notes.length).toBe(0)
  })
})