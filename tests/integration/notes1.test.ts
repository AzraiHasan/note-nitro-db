// tests/integration/notes.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('Notes Integration', async () => {
  await setup({
    server: true,
  })

  let noteId: string

  it('creates a new note', async () => {
    const newNote = {
      title: 'Integration Test Note',
      content: 'This is a test note created during integration testing.',
      status: 'Draft',
    }

    const response = await $fetch('/api/notes', {
      method: 'POST',
      body: newNote,
    })

    expect(response).toHaveProperty('id')
    expect(response.title).toBe(newNote.title)
    expect(response.content).toBe(newNote.content)
    expect(response.status).toBe(newNote.status)

    noteId = response.id
  })

  it('fetches the created note', async () => {
    const note = await $fetch(`/api/notes/${noteId}`)

    expect(note).toHaveProperty('id', noteId)
    expect(note.title).toBe('Integration Test Note')
  })

  it('updates the note', async () => {
    const updatedNote = {
      id: noteId,
      title: 'Updated Integration Test Note',
      content: 'This note has been updated during integration testing.',
      status: 'In Progress',
    }

    const response = await $fetch(`/api/notes/${noteId}`, {
      method: 'PUT',
      body: updatedNote,
    })

    expect(response).toHaveProperty('id', noteId)
    expect(response.title).toBe(updatedNote.title)
    expect(response.content).toBe(updatedNote.content)
    expect(response.status).toBe(updatedNote.status)
  })

  it('deletes the note', async () => {
    await $fetch(`/api/notes/${noteId}`, {
      method: 'DELETE',
    })

    // Attempt to fetch the deleted note should result in a 404 error
    try {
      await $fetch(`/api/notes/${noteId}`)
    } catch (error: any) {
      expect(error.response.status).toBe(404)
    }
  })
})