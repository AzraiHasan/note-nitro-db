let db: any = null

export function getDatabase() {
  if (!db) {
    db = useDatabase()
    
    // Initialize the database schema if it doesn't exist
    db.sql`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        status TEXT CHECK(status IN ('Draft', 'In Progress', 'Completed')) NOT NULL DEFAULT 'Draft',
        tags TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
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