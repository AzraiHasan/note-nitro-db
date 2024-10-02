export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event);
  
  if (!requestBody.text || !requestBody.amount || !requestBody.type || !requestBody.category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    })
  }

  const db = useDatabase();

  // Update the table creation SQL
  await db.sql`
  CREATE TABLE IF NOT EXISTS transactions
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
  `;

  // Update the INSERT statement
  const result = await db.sql`
  INSERT INTO transactions
  (
    text,
    amount,
    type,
    category,
    date
  )
  VALUES
  (
    ${requestBody.text},
    ${requestBody.amount},
    ${requestBody.type},
    ${requestBody.category},
    ${requestBody.date || new Date().toISOString().split('T')[0]}
  )
  `;

  return {
    message: `Transaction added successfully`,
    id: result.lastInsertRowid
  };
});