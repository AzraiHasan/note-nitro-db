import { useDatabase } from '#imports'

export default defineEventHandler(async (event) => {
  const db = useDatabase()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id || !body.text) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request. ID and text are required.',
    })
  }

  try {
    const result = await db.sql`
      UPDATE transactions
      SET text = ${body.text}
      WHERE id = ${parseInt(id)}
      RETURNING id, text, created_at
    `

    if (result.rows?.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Transaction not found',
      })
    }

    return result.rows?.[0]
  } catch (error) {
    console.error('Error updating transaction:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error updating transaction',
    })
  }
})