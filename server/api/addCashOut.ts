export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event);
  
  const db = useDatabase();

  // Create the cash_out table if it doesn't exist
  await db.sql`
  CREATE TABLE IF NOT EXISTS cash_out
  (
    id INTEGER,
    timestamp INTEGER PRIMARY KEY,
    date TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    notes TEXT NOT NULL
  )
  `;

  // Create trigger for auto-incrementing id
  await db.sql`
  CREATE TRIGGER IF NOT EXISTS auto_increment_cash_out_id
  AFTER INSERT ON cash_out
  BEGIN
      UPDATE cash_out SET id = (SELECT COALESCE(MAX(id), 0) + 1 FROM cash_out) WHERE rowid = NEW.rowid;
  END;
  `;

const timestamp = Date.now();

  // Insert the new cash out transaction
  const result = await db.sql`
  INSERT INTO cash_out
  (
    timestamp,
    date,
    amount,
    category,
    notes
  )
  VALUES
  (
    ${timestamp},
    ${requestBody.date},
    ${requestBody.amount},
    ${requestBody.category},
    ${requestBody.notes}
  )
  `;
  // Fetch the auto-incremented id
  const idResult = await db.sql`SELECT id FROM cash_out WHERE timestamp = ${timestamp}`;
  
  if (!idResult.rows || idResult.rows.length === 0) {
    throw new Error('Failed to retrieve the inserted ID');
  }

  const id = idResult.rows[0].id;

  if (id === undefined) {
    throw new Error('Retrieved ID is undefined');
  }

  return { success: true, id, timestamp };
});