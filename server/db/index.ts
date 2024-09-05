// server/db/index.ts

let db: any = null

export function getDatabase() {
  if (!db) {
    db = useDatabase()
    
    // Initialize the database schema if it doesn't exist
    db.sql`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `

    db.sql`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        status TEXT CHECK(status IN ('Draft', 'In Progress', 'Completed')) NOT NULL DEFAULT 'Draft',
        tags TEXT,
        userId INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `
  }
  return db
}

// Helper function to parse note from database
export function parseNote(note: any) {
  return {
    ...note,
    tags: JSON.parse(note.tags || '[]'),
    createdAt: new Date(note.createdAt),
    updatedAt: new Date(note.updatedAt)
  }
}