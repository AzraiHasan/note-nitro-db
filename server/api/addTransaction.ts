export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event);
  
  if (!requestBody.text || !requestBody.amount || !requestBody.type || !requestBody.category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    })
  }

  const db = useDatabase();

  try {
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
    RETURNING id
    `;

    if (!result.rows || result.rows.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to insert transaction',
      })
    }

    const newId = result.rows[0].id;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Transaction added successfully`,
        id: newId
      })
    };
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error adding transaction',
    })
  }
});