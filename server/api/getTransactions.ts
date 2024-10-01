export default defineEventHandler(async (event) => {
  console.log('getTransactions API called');
  const db = useDatabase();

  try {
    console.log('Executing SQL query');
    
    const result = await db.sql`
      SELECT id, text, created_at
      FROM transactions
      ORDER BY created_at DESC
    `;
    console.log('Fetched transactions from database:', result);

    // Check if the result has a 'rows' property
    const transactions = result.rows || result;

    console.log('Processed transactions:', transactions);

    // Ensure we're returning an array
    const formattedTransactions = Array.isArray(transactions) ? transactions : [];

    console.log('Formatted transactions:', formattedTransactions);

    return formattedTransactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching transactions',
    });
  }
});