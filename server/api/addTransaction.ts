export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event);
  
  if (!requestBody.text) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Transaction text is required',
    })
  }

  const db = useDatabase();

  await db.sql`
  CREATE TABLE IF NOT EXISTS transactions
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
  `;

  const result = await db.sql`
  INSERT INTO transactions
  (
    text
  )
  VALUES
  (
    ${requestBody.text}
  )
  `;

  return {
    message: `Transaction added successfully`,
    id: result.lastInsertRowid
  };
});