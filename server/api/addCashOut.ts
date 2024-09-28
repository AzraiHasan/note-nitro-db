export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event);
  
  const db = useDatabase();

  // Create the cash_out table if it doesn't exist
  await db.sql`
  CREATE TABLE IF NOT EXISTS cash_out
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    notes TEXT NOT NULL
  )
  `;

  // Insert the new cash out transaction
  const result = await db.sql`
  INSERT INTO cash_out
  (
    date,
    amount,
    category,
    notes
  )
  VALUES
  (
    ${requestBody.date},
    ${requestBody.amount},
    ${requestBody.category},
    ${requestBody.notes}
  )
  `;
  
  return { success: true, id: result.lastInsertRowid };
});