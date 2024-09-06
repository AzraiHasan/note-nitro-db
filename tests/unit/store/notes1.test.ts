// tests/store/notes.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotesStore } from '@/stores/notes'
import type { Note } from '@/types'

describe('Notes Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('fetches notes', async () => {
    const store = useNotesStore()
    const mockNotes: Note[] = [{ id: '1', title: 'Test Note', content: 'Test Content', status: 'Draft', tags: [], createdAt: new Date(), updatedAt: new Date() }]
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockNotes),
    } as any)

    await store.fetchNotes()

    expect(store.notes).toEqual(mockNotes)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('creates a note', async () => {
    const store = useNotesStore()
    const newNote: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> = { title: 'New Note', content: 'New Content', status: 'Draft', tags: [] }
    const mockCreatedNote: Note = { id: '2', ...newNote, createdAt: new Date(), updatedAt: new Date() }
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockCreatedNote),
    } as any)

    await store.createNote(newNote)

    expect(store.notes).toContainEqual(mockCreatedNote)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('updates a note', async () => {
    const store = useNotesStore()
    const existingNote: Note = { id: '1', title: 'Existing Note', content: 'Existing Content', status: 'Draft', tags: [], createdAt: new Date(), updatedAt: new Date() }
    store.notes = [existingNote]

    const updatedNote: Note = { ...existingNote, title: 'Updated Note', status: 'In Progress' }
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(updatedNote),
    } as any)

    await store.updateNote(updatedNote)

    expect(store.notes[0]).toEqual(updatedNote)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('deletes a note', async () => {
    const store = useNotesStore()
    const existingNote: Note = { id: '1', title: 'Existing Note', content: 'Existing Content', status: 'Draft', tags: [], createdAt: new Date(), updatedAt: new Date() }
    store.notes = [existingNote]

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce({}),
    } as any)

    await store.deleteNote('1')

    expect(store.notes).toHaveLength(0)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('handles errors when fetching notes', async () => {
    const store = useNotesStore()
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'))

    await store.fetchNotes()

    expect(store.notes).toHaveLength(0)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe('Failed to fetch notes. Please try again.')
  })
})