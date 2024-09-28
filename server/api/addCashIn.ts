export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event);
  
  const db = useDatabase();

  // Create the cash_in table if it doesn't exist
  await db.sql`
  CREATE TABLE IF NOT EXISTS cash_in
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    notes TEXT
  )
  `;

  // Insert the new cash in transaction
  const result = await db.sql`
  INSERT INTO cash_in
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