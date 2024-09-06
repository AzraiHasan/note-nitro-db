// tests/integration/notes.spec.ts
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import { useNotesStore } from '@/stores/notes'
import type { Note } from '@/types';

describe('Notes Integration', async () => {
  await setup({
    // Nuxt config options
    server: true,
  })

  it('renders the dashboard page', async () => {
    const html = await $fetch('/')
    expect(html).toContain('Notes Dashboard')
  })

  it('creates a new note', async () => {
    const notesStore = useNotesStore()
    const newNote: Omit<Note, "id" | "userId" | "createdAt" | "updatedAt"> = {
      title: 'Integration Test Note',
      content: 'This is a test note created during integration testing',
      status: 'Draft' as 'Draft' | 'In Progress' | 'Completed',
      tags: ['test']
    } 

    await notesStore.createNote(newNote)
    const html = await $fetch('/')
    expect(html).toContain('Integration Test Note')
  })

  it('renders the note edit page', async () => {
    const notesStore = useNotesStore()
    const note = notesStore.notes[0]
    const html = await $fetch(`/notes/${note.id}`)
    expect(html).toContain('Edit Note')
    expect(html).toContain(note.title)
  })

  it('updates an existing note', async () => {
    const notesStore = useNotesStore()
    const note = notesStore.notes[0]
    const updatedNote = { ...note, title: 'Updated Integration Test Note' }
    await notesStore.updateNote(updatedNote)
    const html = await $fetch('/')
    expect(html).toContain('Updated Integration Test Note')
  })

  it('deletes a note', async () => {
    const notesStore = useNotesStore()
    const note = notesStore.notes[0]
    await notesStore.deleteNote(note.id)
    const html = await $fetch('/')
    expect(html).not.toContain('Updated Integration Test Note')
  })
})