import { H3Event } from 'h3'

interface Transaction {
  id: number
  type: 'Cash In' | 'Cash Out'
  date: string
  amount: number
  category: string
  notes: string | null
}

interface SQLResult {
  rows: Transaction[]
}

export default defineEventHandler(async (event: H3Event) => {
  const db = useDatabase()

  try {
    // Fetch Cash In transactions
    const cashInResult = await db.sql<SQLResult>`
      SELECT id, 'Cash In' as type, date, amount, category, notes
      FROM cash_in
    `

    // Fetch Cash Out transactions
    const cashOutResult = await db.sql<SQLResult>`
      SELECT id, 'Cash Out' as type, date, amount, category, notes
      FROM cash_out
    `

    // Combine and sort all transactions
    const allTransactions = [...cashInResult.rows, ...cashOutResult.rows]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return { 
      success: true, 
      transactions: allTransactions 
    }
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return { 
      success: false, 
      error: 'Please make an entry ...' 
    }
  }
})