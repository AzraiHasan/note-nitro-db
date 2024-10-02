import { useDatabase } from '#imports'

export default defineEventHandler(async (event) => {
  const db = useDatabase()
  const id = getRouterParam(event, 'id')
  
  let body;
  try {
    body = await readBody(event)
    console.log('Received body:', body);
  } catch (error: any) {
    console.error('Error parsing request body:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body: ' + error.message })
    }
  }

  if (!id || !body || typeof body !== 'object') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request. Body must be a valid JSON object.' })
    }
  }

  if (!body.text || !body.amount || !body.type || !body.category || !body.date) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request. All fields are required.' })
    }
  }

  try {
    const result = await db.sql`
      UPDATE transactions
      SET text = ${body.text},
          amount = ${parseFloat(body.amount)},
          type = ${body.type},
          category = ${body.category},
          date = ${body.date}
      WHERE id = ${parseInt(id)}
      RETURNING id, text, amount, type, category, date, created_at
    `

    if (result.rows?.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Transaction not found' })
      }
    }

    return { body: JSON.stringify(result.rows?.[0]) }
  } catch (error: any) {
    console.error('Error updating transaction:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error updating transaction: ' + error.message })
    }
  }
})