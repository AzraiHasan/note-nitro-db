// server/api/notes.ts
import { v4 as uuid } from 'uuid';
import { getDatabase, parseNote } from '../db'

export interface Note {
  id: string
  title: string
  content: string
  status: 'Draft' | 'In Progress' | 'Completed'
  tags: string[]
  userId: string
  createdAt: Date
  updatedAt: Date
}

// GET /api/notes
export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const db = getDatabase()
  const { rows } = await db.sql`SELECT * FROM notes WHERE userId = ${event.context.auth.userId}`
  return rows.map(parseNote)
})

// GET /api/notes/:id
export const getNote = defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const db = getDatabase()
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, message: 'Note ID is required' })
  }
  const { rows } = await db.sql`SELECT * FROM notes WHERE id = ${id} AND userId = ${event.context.auth.userId}`
  if (rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Note not found' })
  }
  return parseNote(rows[0])
})

// POST /api/notes
export const createNote = defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const db = getDatabase()
  const body = await readBody(event)
  const newNote: Note = {
    id: uuid(),
    title: body.title,
    content: body.content,
    status: body.status || 'Draft',
    tags: body.tags || [],
    userId: event.context.auth.userId,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  await db.sql`
    INSERT INTO notes (id, title, content, status, tags, userId, createdAt, updatedAt)
    VALUES (${newNote.id}, ${newNote.title}, ${newNote.content}, ${newNote.status}, ${JSON.stringify(newNote.tags)}, ${newNote.userId}, ${newNote.createdAt.toISOString()}, ${newNote.updatedAt.toISOString()})
  `
  return newNote
})

// PUT /api/notes/:id
export const updateNote = defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const db = getDatabase()
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, message: 'Note ID is required' })
  }
  const body = await readBody(event)
  const updatedAt = new Date()
  await db.sql`
    UPDATE notes
    SET title = ${body.title}, content = ${body.content}, status = ${body.status}, tags = ${JSON.stringify(body.tags)}, updatedAt = ${updatedAt.toISOString()}
    WHERE id = ${id} AND userId = ${event.context.auth.userId}
  `
  return { id, ...body, updatedAt, userId: event.context.auth.userId }
})

// DELETE /api/notes/:id
export const deleteNote = defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const db = getDatabase()
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, message: 'Note ID is required' })
  }
  await db.sql`DELETE FROM notes WHERE id = ${id} AND userId = ${event.context.auth.userId}`
  return { id }
})