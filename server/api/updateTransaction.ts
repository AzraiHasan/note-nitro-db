import { H3Event } from 'h3'

interface Transaction {
  id: number
  type: 'Cash In' | 'Cash Out'
  date: string
  amount: number
  category: string | null
  notes: string | null
}

export default defineEventHandler(async (event: H3Event) => {
  const db = useDatabase()
  const body = await readBody<Transaction>(event)

  try {
    if (body.type === 'Cash In') {
      await db.sql`
        UPDATE cash_in
        SET date = ${body.date}, amount = ${body.amount}, notes = ${body.notes}
        WHERE id = ${body.id}
      `
    } else {
      await db.sql`
        UPDATE cash_out
        SET date = ${body.date}, amount = ${body.amount}, category = ${body.category}, notes = ${body.notes}
        WHERE id = ${body.id}
      `
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating transaction:', error)
    return { 
      success: false, 
      error: 'Failed to update transaction' 
    }
  }
})