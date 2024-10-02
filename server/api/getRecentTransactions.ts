export default defineEventHandler(async (event) => {
  const db = useDatabase();
  const eightDaysAgo = new Date();
  eightDaysAgo.setDate(eightDaysAgo.getDate() - 7); // 7 days ago + today = 8 days

  try {
    const result = await db.sql`
      SELECT id, text, amount, type, category, date, created_at
      FROM transactions
      WHERE date >= ${eightDaysAgo.toISOString().split('T')[0]}
      ORDER BY date DESC, created_at DESC
    `;

    return result.rows || [];
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching recent transactions',
    });
  }
});